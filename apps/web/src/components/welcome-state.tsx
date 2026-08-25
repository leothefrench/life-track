'use client';

import { Wallet, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddExpenseDialog } from './add-expense-dialog';
import { PlaidLink } from './plaid-link';
import { useI18n } from '@/lib/i18n/i18n-context';
import Link from 'next/link';

export function WelcomeState({
  isPremium,
  isBankConnected,
}: {
  isPremium: boolean;
  isBankConnected: boolean;
}) {
  const { t } = useI18n();

  return (
    <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-white/5 rounded-3xl bg-white/2 text-center space-y-6">
      <div className="h-16 w-16 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-2xl shadow-blue-500/20">
        <Wallet className="h-8 w-8 text-blue-500" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white">{t('welcome_title')}</h2>
        <p className="text-sm text-white/50 max-w-sm mx-auto">
          {t('welcome_desc')}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        {!isBankConnected &&
          (isPremium ? (
            <PlaidLink />
          ) : (
            <Button
              asChild
              variant="outline"
              className="h-9 rounded-lg border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 hover:text-white px-6 text-[10px] font-bold uppercase tracking-wider gap-2 transition-all shadow-sm"
            >
              <Link href="/pricing">
                <Lock className="h-3.5 w-3.5 text-amber-400" />
                {t('bank_sync_pro')}
              </Link>
            </Button>
          ))}

        <AddExpenseDialog />
      </div>
    </div>
  );
}
