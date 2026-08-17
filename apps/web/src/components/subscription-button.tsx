'use client';

import { Button } from '@/components/ui/button';
import { createCustomerPortalSession } from '@/app/actions/stripe';
import { useI18n } from '@/lib/i18n/i18n-context';

export function SubscriptionButton() {
  const { t } = useI18n();

  return (
    <form action={createCustomerPortalSession} className="w-full sm:w-auto">
      <Button
        variant="outline"
        size="sm"
        type="submit"
        aria-label={t('nav_pricing')}
        className="h-9 w-full sm:w-auto rounded-lg border-white/10 bg-white/5 text-white/70 text-[10px] font-bold uppercase tracking-wider px-4"
      >
        {t('nav_pricing')}
      </Button>
    </form>
  );
}
