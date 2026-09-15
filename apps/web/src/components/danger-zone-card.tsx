'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, Lock, ExternalLink, ShieldCheck, Trash2 } from 'lucide-react';
import { useI18n } from '@/lib/i18n/i18n-context';
import { DeleteAccountModal } from './delete-account-modal';
import { STRIPE_LOCK_DICT, LOCALE_DATE_MAP } from './danger-zone.constants';

interface DangerZoneCardProps {
  hasActiveSubscription?: boolean;
  subscriptionEndDate?: string | Date | null;
  cancelAtPeriodEnd?: boolean;
}

export function DangerZoneCard({
  hasActiveSubscription = false,
  subscriptionEndDate,
  cancelAtPeriodEnd = false,
}: DangerZoneCardProps) {
  const { t, language } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  const lockText = STRIPE_LOCK_DICT[(language as keyof typeof STRIPE_LOCK_DICT) || 'fr'] || STRIPE_LOCK_DICT.fr;
  const keyword = t('delete_account_confirm_keyword') || lockText.confirmKeyword;

  const formattedDate = subscriptionEndDate
    ? new Intl.DateTimeFormat(LOCALE_DATE_MAP[language] || 'fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(subscriptionEndDate))
    : null;

  return (
    <div id="danger-zone-section" className="rounded-xl border border-red-200 bg-white p-6 shadow-sm dark:border-red-950/40 dark:bg-zinc-900">
      <div className="flex items-start gap-4">
        <div className="rounded-lg bg-red-100 p-2.5 text-red-600 dark:bg-red-950/50 dark:text-red-400">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">{t('danger_zone_title')}</h3>
          <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-200">{t('danger_zone_desc')}</p>

          {hasActiveSubscription ? (
            <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <p className="font-medium">{cancelAtPeriodEnd ? lockText.subCancelled : lockText.subActive}</p>
                  <p className="text-xs leading-relaxed text-amber-800 dark:text-amber-300">
                    {lockText.descPrefix} <span className="font-semibold text-amber-950 dark:text-amber-100">{formattedDate ?? 'la fin de période'}</span>. {lockText.descSuffix}
                  </p>
                  <Link href="/pricing" className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-900 underline hover:text-amber-700 dark:text-amber-200">
                    {lockText.manageBilling} <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
              <div className="mt-4 border-t border-amber-200/60 pt-3 dark:border-amber-900/40">
                <button type="button" disabled className="inline-flex items-center gap-2 cursor-not-allowed rounded-lg bg-zinc-200 px-4 py-2.5 text-xs font-medium text-zinc-700 opacity-90 dark:bg-zinc-800 dark:text-zinc-300">
                  <Lock className="h-3.5 w-3.5" /> {lockText.lockedBtn}
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-5">
              <button type="button" onClick={() => setIsOpen(true)} className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 transition dark:bg-red-700 dark:hover:bg-red-800">
                <Trash2 className="h-4 w-4" /> {t('delete_account_btn')}
              </button>
            </div>
          )}
        </div>
      </div>

      <DeleteAccountModal isOpen={isOpen && !hasActiveSubscription} onClose={() => setIsOpen(false)} keyword={keyword} t={t} />
    </div>
  );
}