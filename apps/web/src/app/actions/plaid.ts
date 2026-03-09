'use server';

import { auth } from '@/auth';
import { plaidClient } from '@/lib/plaid';
import { prisma } from '@life-track/db';
import { Products, CountryCode, LinkTokenCreateRequest } from 'plaid';

export async function createLinkToken() {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Non autorisé');

  const configs: LinkTokenCreateRequest = {
    user: { client_user_id: session.user.id },
    client_name: 'Life-Track',
    products: [Products.Transactions],
    country_codes: [CountryCode.Fr],
    language: 'fr',
  };

  try {
    const createTokenResponse = await plaidClient.linkTokenCreate(configs);
    return { linkToken: createTokenResponse.data.link_token };
  } catch (error) {
    console.error('Erreur Plaid Link Token:', error);
    return { error: 'Impossible de générer le jeton de connexion.' };
  }
}

export async function exchangePublicToken(
  publicToken: string,
  institutionName: string,
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Non autorisé');

  try {
    // 1. On demande à Plaid d'échanger le jeton public contre un Access Token permanent
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;

    // 2. On enregistre cette connexion dans Neon pour ce User
    await prisma.bankConnection.create({
      data: {
        userId: session.user.id,
        accessToken: accessToken,
        itemId: itemId,
        institutionName: institutionName,
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Erreur échange Plaid:', error);
    return { error: 'Échec de la liaison bancaire.' };
  }
}

import { revalidatePath } from 'next/cache';

export async function syncTransactions() {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Non autorisé');

  // 1. Récupérer l'accessToken stocké en base
  const connection = await prisma.bankConnection.findFirst({
    where: { userId: session.user.id },
  });

  if (!connection) throw new Error('Aucune banque connectée');

  // 2. Définir la période (ex: les 30 derniers jours)
  const now = new Date();
  const start = new Date();
  start.setDate(now.getDate() - 30);

  const startDate = start.toISOString().split('T')[0]; // Format YYYY-MM-DD
  const endDate = now.toISOString().split('T')[0];

  try {
    // 3. Appeler Plaid pour récupérer les transactions
    const response = await plaidClient.transactionsGet({
      access_token: connection.accessToken,
      start_date: startDate,
      end_date: endDate,
    });

    const transactions = response.data.transactions;

    // 4. Enregistrer chaque transaction dans la table Expense
    for (const trx of transactions) {
      // On vérifie si la dépense n'existe pas déjà (en utilisant le titre et la date comme base simple)
      const existing = await prisma.expense.findFirst({
        where: {
          userId: session.user.id,
          title: trx.name,
          date: new Date(trx.date),
        },
      });

      if (!existing) {
        await prisma.expense.create({
          data: {
            userId: session.user.id,
            title: trx.name,
            amount: Math.abs(trx.amount), // Plaid met les dépenses en négatif, on les veut en positif
            category: 'AUTRE', // On laissera l'IA classer plus tard
            date: new Date(trx.date),
          },
        });
      }
    }

    // 5. Rafraîchir le Dashboard automatiquement
    revalidatePath('/dashboard');
    return { success: true, count: transactions.length };
  } catch (error) {
    console.error('Erreur Sync Plaid:', error);
    return { error: 'Échec de la récupération des transactions.' };
  }
}