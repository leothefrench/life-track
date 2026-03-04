'use server';

import { auth } from '@/auth';
import { plaidClient } from '@/lib/plaid';
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
