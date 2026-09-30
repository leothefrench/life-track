'use server';

import { auth } from '@/auth';
import { plaidClient } from '@/lib/plaid';
import { prisma } from '@life-track/db';
import { Products, CountryCode, LinkTokenCreateRequest } from 'plaid';
import { categorizeTransactions } from './ai';
import { getLocalFallbackCategory } from '@/lib/categorizer';
import { revalidatePath } from 'next/cache';

// Table de correspondance officielle Plaid -> Life-Track
function mapPlaidToCategory(trx: any): string | null {
  const pfc = trx.personal_finance_category?.primary?.toUpperCase() || '';
  const legacyCat = (trx.category || []).join(' ').toUpperCase();
  const fullPlaid = `${pfc} ${legacyCat}`;

  // ALIMENTATION
  if (
    fullPlaid.includes('FOOD') ||
    fullPlaid.includes('DRINK') ||
    fullPlaid.includes('RESTAURANT') ||
    fullPlaid.includes('GROCERIES') ||
    fullPlaid.includes('SUPERMARKET') ||
    fullPlaid.includes('FAST_FOOD')
  ) {
    return 'ALIMENTATION';
  }

  // TRANSPORT
  if (
    fullPlaid.includes('TRANSPORT') ||
    fullPlaid.includes('TRAVEL') ||
    fullPlaid.includes('GAS') ||
    fullPlaid.includes('TAXI') ||
    fullPlaid.includes('AIRLINES') ||
    fullPlaid.includes('TOLLS') ||
    fullPlaid.includes('PARKING')
  ) {
    return 'TRANSPORT';
  }

  // ENERGIE & CHARGES
  if (
    fullPlaid.includes('UTILITIES') ||
    fullPlaid.includes('ELECTRIC') ||
    fullPlaid.includes('GAS_POWER') ||
    fullPlaid.includes('WATER')
  ) {
    return 'ENERGIE';
  }

  // LOGEMENT
  if (
    fullPlaid.includes('RENT') ||
    fullPlaid.includes('MORTGAGE') ||
    fullPlaid.includes('HOUSING') ||
    fullPlaid.includes('REAL_ESTATE')
  ) {
    return 'LOGEMENT';
  }

  // ABONNEMENTS
  if (
    fullPlaid.includes('SUBSCRIPTION') ||
    fullPlaid.includes('TELECOM') ||
    fullPlaid.includes('CABLE') ||
    fullPlaid.includes('INTERNET') ||
    fullPlaid.includes('PHONE')
  ) {
    return 'ABONNEMENTS';
  }

  // SANTE
  if (
    fullPlaid.includes('MEDICAL') ||
    fullPlaid.includes('HEALTH') ||
    fullPlaid.includes('PHARMACY') ||
    fullPlaid.includes('DENTAL')
  ) {
    return 'SANTE';
  }

  // LOISIRS
  if (
    fullPlaid.includes('ENTERTAINMENT') ||
    fullPlaid.includes('RECREATION') ||
    fullPlaid.includes('SPORT') ||
    fullPlaid.includes('THEATER') ||
    fullPlaid.includes('GAMES')
  ) {
    return 'LOISIRS';
  }

  return null;
}

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

  const plaidLanguageMap: Record<string, string> = {
    fr: 'fr',
    en: 'en',
    es: 'es',
    de: 'de',
  };

  const language = plaidLanguageMap[lang] || 'en';

  const configs: LinkTokenCreateRequest = {
    user: { client_user_id: session.user.id },
    client_name: 'Life-Track',
    products: [Products.Transactions],
    country_codes: [
      CountryCode.Fr,
      CountryCode.Es,
      CountryCode.Pt,
      CountryCode.De,
      CountryCode.Gb,
    ],
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
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;

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

    // Détection des transactions nécessitant l'IA
    const ambiguousTitles: string[] = [];
    for (const trx of transactions) {
      const plaidMatch = mapPlaidToCategory(trx);
      const textMatch = getLocalFallbackCategory(trx.merchant_name || trx.name);
      if (!plaidMatch && textMatch === 'AUTRE') {
        ambiguousTitles.push(trx.merchant_name || trx.name);
      }
    }

    const aiCategoriesMap =
      ambiguousTitles.length > 0
        ? await categorizeTransactions(ambiguousTitles)
        : {};

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

    for (const trx of transactions) {
      const displayName = trx.merchant_name || trx.name;

      const existing = await prisma.expense.findFirst({
        where: {
          userId: session.user.id,
          title: displayName,
          date: new Date(trx.date),
        },
      });

      if (!existing) {
        // Ordre de priorité : 1. Catégorie native Plaid -> 2. Dictionnaire local -> 3. IA -> 4. AUTRE
        let finalCategory =
          mapPlaidToCategory(trx) || getLocalFallbackCategory(displayName);

        if (finalCategory === 'AUTRE' && aiCategoriesMap[displayName]) {
          finalCategory = aiCategoriesMap[displayName];
        }

        finalCategory = (finalCategory || 'AUTRE').toUpperCase();
        if (!validCategories.includes(finalCategory)) {
          finalCategory = 'AUTRE';
        }

        await prisma.expense.create({
          data: {
            userId: session.user.id,
            title: displayName,
            amount: Math.abs(trx.amount),
            category: finalCategory as any,
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
