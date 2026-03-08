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