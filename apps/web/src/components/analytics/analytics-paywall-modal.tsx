'use client';

import Link from 'next/link';
import { X } from 'lucide-react';
import { useI18n } from '@/lib/i18n/i18n-context';

export function AnalyticsPaywallModal() {
  const { t } = useI18n();

  return (
    <div
      role="dialog"
      aria-labelledby="paywall-title"
      aria-describedby="paywall-desc"
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 p-4 backdrop-blur-md"
    >
      <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-zinc-900/95 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
        {/* Croix de fermeture pour revenir au dashboard sans la flèche du navigateur */}
        <Link
          href="/dashboard"
          className="absolute top-5 right-5 p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          aria-label={t('close')}
        >
          <X className="h-5 w-5" />
        </Link>

        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
            {t('paywall_badge')}
          </span>
          <h3
            id="paywall-title"
            className="text-xl font-bold text-zinc-100 mt-1"
          >
            {t('paywall_title')}
          </h3>
        </div>

        <p
          id="paywall-desc"
          className="mt-3 text-sm text-zinc-300 leading-relaxed"
        >
          {t('paywall_desc')}
        </p>

        {/* Liste épurée sans icônes gadget */}
        <ul className="mt-5 space-y-3 text-sm text-zinc-300">
          <li className="flex items-start gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400 mt-2 shrink-0" />
            <span>{t('paywall_feature_burn_rate')}</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400 mt-2 shrink-0" />
            <span>{t('paywall_feature_split')}</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400 mt-2 shrink-0" />
            <span>{t('paywall_feature_forecast')}</span>
          </li>
        </ul>

        {/* Boutons d'action : Retour au Dashboard ou Passer à Pro */}
        <div className="mt-8 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-xs font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition"
          >
            {t('paywall_back_dashboard')}
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500"
          >
            {t('paywall_cta')}
          </Link>
        </div>
      </div>
    </div>
  );
}
