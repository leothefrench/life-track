'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import {
  Configuration,
  PlaidApi,
  PlaidEnvironments,
  Products,
  CountryCode,
} from 'plaid';
import { categorizeExpenseWithAI } from './ai';

const configuration = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV || 'sandbox'],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
    },
  },
});

const plaidClient = new PlaidApi(configuration);

export async function createLinkToken() {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Non autorisé');

  const response = await plaidClient.linkTokenCreate({
    user: { client_user_id: session.user.id },
    client_name: 'LifeTrack',
    products: [Products.Transactions],
    country_codes: [CountryCode.Fr, CountryCode.Us],
    language: 'fr', // <--- PLAID DÉSORMAIS EN FRANÇAIS
  });

  return response.data.link_token;
}

export async function exchangePublicToken(publicToken: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Non autorisé');

  const response = await plaidClient.itemPublicTokenExchange({
    public_token: publicToken,
  });

  const accessToken = response.data.access_token;
  const itemId = response.data.item_id;

  await prisma.bankConnection.create({
    data: {
      userId: session.user.id,
      accessToken,
      itemId,
      institutionName: 'Banque Connectée',
    },
  });

  revalidatePath('/dashboard');
  return { success: true };
}

// ACTION POUR DÉCONNECTER LA BANQUE
export async function disconnectBankAction() {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Non autorisé');

  const connection = await prisma.bankConnection.findFirst({
    where: { userId: session.user.id },
  });

  if (connection) {
    try {
      // Révoquer le jeton côté Plaid
      await plaidClient.itemRemove({
        access_token: connection.accessToken,
      });
    } catch (e) {
      console.error('Erreur lors de la révocation Plaid:', e);
    }

    // Supprimer la connexion en BDD
    await prisma.bankConnection.delete({
      where: { id: connection.id },
    });
  }

  revalidatePath('/dashboard');
  return { success: true };
}

export async function syncBankTransactions() {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Non autorisé');

  const bankConnection = await prisma.bankConnection.findFirst({
    where: { userId: session.user.id },
  });

  if (!bankConnection) {
    throw new Error('Aucune banque connectée');
  }

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const startDate = thirtyDaysAgo.toISOString().split('T')[0];
  const endDate = now.toISOString().split('T')[0];

  const response = await plaidClient.transactionsGet({
    access_token: bankConnection.accessToken,
    start_date: startDate,
    end_date: endDate,
  });

  const transactions = response.data.transactions;
  let addedCount = 0;

  for (const tx of transactions) {
    if (tx.amount <= 0) continue;

    const existing = await prisma.expense.findFirst({
      where: {
        userId: session.user.id,
        amount: tx.amount,
        date: new Date(tx.date),
      },
    });

    if (!existing) {
      let category = 'AUTRES';
      try {
        category = await categorizeExpenseWithAI(tx.name, tx.amount);
      } catch (err) {
        console.error('Erreur IA lors de la sync:', err);
      }

      await prisma.expense.create({
        data: {
          userId: session.user.id,
          title: tx.name,
          amount: tx.amount,
          category,
          date: new Date(tx.date),
        },
      });
      addedCount++;
    }
  }

  revalidatePath('/dashboard');
  return { count: addedCount };
}
