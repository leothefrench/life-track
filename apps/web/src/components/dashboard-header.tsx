'use client';

import Link from 'next/link';
import { LanguageSelector } from '@/components/language-selector';
import { CurrencySelector } from '@/components/currency-selector';
import { UserNav } from '@/components/user-nav';
import { useI18n } from '@/lib/i18n/i18n-context';

interface DashboardHeaderProps {
  user?: {
    name?: string | null;
    email?: string | null;
  } | null;
  isSubscribed?: boolean;
  isPremium?: boolean;
}

export function DashboardHeader({
  user,
  isSubscribed,
  isPremium,
}: DashboardHeaderProps) {
  const { t } = useI18n();
  const proStatus = isSubscribed ?? isPremium ?? false;

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="font-bold text-xl text-primary tracking-tight"
          >
            Life-Track
          </Link>
          {proStatus && (
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
              {t('badge_pro')}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <CurrencySelector />
          <LanguageSelector />
          <UserNav user={user} isSubscribed={proStatus} />
        </div>
      </div>
    </header>
  );
}
