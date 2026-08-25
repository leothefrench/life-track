'use server';

import { auth } from '@/auth';
import { plaidClient } from '@/lib/plaid';
import { prisma } from '@life-track/db';
import { Products, CountryCode, LinkTokenCreateRequest } from 'plaid';
import { categorizeTransactions } from './ai';

export async function createLinkToken(lang: string = 'fr') {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Non autorisé');

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isPremium: true },
  });

  if (!user?.isPremium) {
    return { error: 'Fonctionnalité réservée aux membres Pro.' };
  }

  const validLanguages = ['fr', 'en', 'es', 'de', 'pt'];
  const language = validLanguages.includes(lang) ? lang : 'fr';

  const configs: LinkTokenCreateRequest = {
    user: { client_user_id: session.user.id },
    client_name: 'Life-Track',
    products: [Products.Transactions],
    country_codes: [CountryCode.Fr],
    language,
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

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isPremium: true },
  });

  if (!user?.isPremium) {
    return { error: 'Fonctionnalité réservée aux membres Pro.' };
  }

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

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isPremium: true },
  });

  if (!user?.isPremium) {
    return { error: 'Fonctionnalité réservée aux membres Pro.' };
  }

  const connection = await prisma.bankConnection.findFirst({
    where: { userId: session.user.id },
  });

  if (!connection) throw new Error('Aucune banque connectée');

  const now = new Date();
  const start = new Date();
  start.setDate(now.getDate() - 30);
  const startDate = start.toISOString().split('T')[0];
  const endDate = now.toISOString().split('T')[0];

  try {
    const response = await plaidClient.transactionsGet({
      access_token: connection.accessToken,
      start_date: startDate,
      end_date: endDate,
    });

    const transactions = response.data.transactions;

    // 1. On demande à l'IA de classer les noms
    const titlesToCategorize = transactions.map((t) => t.name);
    const categoriesMap = await categorizeTransactions(titlesToCategorize);

    // 2. On enregistre avec la catégorie intelligente
    for (const trx of transactions) {
      const existing = await prisma.expense.findFirst({
        where: {
          userId: session.user.id,
          title: trx.name,
          date: new Date(trx.date),
        },
      });

      if (!existing) {
        // SÉCURITÉ : On vérifie que la catégorie de l'IA appartient bien à notre liste autorisée
        const validCategories = [
          'LOGEMENT',
          'ENERGIE',
          'ALIMENTATION',
          'TRANSPORT',
          'ABONNEMENTS',
          'LOISIRS',
          'SANTE',
          'AUTRE',
        ];
        let suggestedCategory = (
          categoriesMap[trx.name] || 'AUTRE'
        ).toUpperCase();

        // Si l'IA renvoie n'importe quoi, on reset à AUTRE pour éviter le crash DB
        if (!validCategories.includes(suggestedCategory)) {
          suggestedCategory = 'AUTRE';
        }

        await prisma.expense.create({
          data: {
            userId: session.user.id,
            title: trx.name,
            amount: Math.abs(trx.amount),
            category: suggestedCategory as any,
            date: new Date(trx.date),
          },
        });
      }
    }

    revalidatePath('/dashboard');
    return { success: true, count: transactions.length };
  } catch (error) {
    console.error('Erreur Sync Plaid:', error);
    return { error: 'Échec de la récupération des transactions.' };
  }
}

export async function disconnectBank() {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Non autorisé');

  try {
    await prisma.bankConnection.deleteMany({
      where: { userId: session.user.id },
    });
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Erreur déconnexion banque:', error);
    return { error: 'Échec de la déconnexion.' };
  }
}
