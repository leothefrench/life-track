'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { Button } from '@/components/ui/button';
import { Landmark } from 'lucide-react';
import { createLinkToken } from '@/app/actions/plaid';
import { toast } from 'sonner';
import { exchangePublicToken } from '@/app/actions/plaid';

export function PlaidLink() {
  const [token, setToken] = useState<string | null>(null);

  // 1. On demande le jeton au serveur dès que le composant apparaît
  useEffect(() => {
    const getLinkToken = async () => {
      const result = await createLinkToken();
      if (result.linkToken) {
        setToken(result.linkToken);
      } else {
        toast.error('Erreur de connexion à Plaid');
      }
    };
    getLinkToken();
  }, []);

  // 2. Ce qui se passe quand l'utilisateur a choisi sa banque
  const onSuccess = useCallback(async (public_token: string, metadata: any) => {
    try {
      // On envoie le jeton au serveur avec le nom de la banque
      const institutionName = metadata.institution?.name || 'Banque Inconnue';

      const result = await exchangePublicToken(public_token, institutionName);

      if (result.success) {
        toast.success(`Votre compte ${institutionName} est maintenant lié !`);
      } else {
        toast.error('Erreur lors de la liaison finale.');
      }
    } catch (error) {
      toast.error('Une erreur technique est survenue.');
    }
  }, []);

  const { open, ready } = usePlaidLink({
    token,
    onSuccess,
  });

  return (
    <Button
      onClick={() => open()}
      disabled={!ready}
      variant="outline"
      className="gap-2 border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-600"
    >
      <Landmark className="h-4 w-4" />
      Connecter ma banque
    </Button>
  );
}
