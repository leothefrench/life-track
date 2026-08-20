'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { usePlaidLink } from 'react-plaid-link';
import { Button } from '@/components/ui/button';
import { Landmark } from 'lucide-react';
import { createLinkToken } from '@/app/actions/plaid';
import { toast } from 'sonner';
import { exchangePublicToken } from '@/app/actions/plaid';
import { useI18n } from '@/lib/i18n/i18n-context';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function PlaidLink() {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();
  const { t, language } = useI18n();

  // 1. On demande le jeton au serveur dès que le composant apparaît ou que la langue change
  useEffect(() => {
    const getLinkToken = async () => {
      const result = await createLinkToken(language);
      if (result.linkToken) {
        setToken(result.linkToken);
      } else {
        toast.error('Erreur de connexion à Plaid');
      }
    };
    getLinkToken();
  }, [language]);

  // 2. Ce qui se passe quand l'utilisateur a choisi sa banque
  const onSuccess = useCallback(
    async (public_token: string, metadata: any) => {
      try {
        const institutionName = metadata.institution?.name || 'Banque Inconnue';
        const result = await exchangePublicToken(public_token, institutionName);

        if (result.success) {
          toast.success(`Votre compte ${institutionName} est maintenant lié !`);
          router.refresh(); // Force Next.js à recalculer le Dashboard (Server Side)
        } else {
          toast.error('Erreur lors de la liaison finale.');
        }
      } catch (error) {
        toast.error('Une erreur technique est survenue.');
      }
    },
    [router],
  );

  const { open, ready } = usePlaidLink({
    token,
    onSuccess,
  });

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={() => open()}
          disabled={!ready}
          variant="outline"
          className="h-9 rounded-lg border-white/10 bg-white/5 text-emerald-500 hover:bg-white/10 text-[10px] font-bold uppercase tracking-wider px-4 flex items-center justify-center gap-2 transition-colors"
        >
          <Landmark className="h-3.5 w-3.5" />
          {t('sync_inactive')}
        </Button>
      </TooltipTrigger>
      <TooltipContent
        side="bottom"
        className="bg-black border-white/10 text-white text-[10px] uppercase font-bold"
        sideOffset={10}
      >
        {t('plaid_tooltip')}
      </TooltipContent>
    </Tooltip>
  );
}
