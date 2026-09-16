'use client';

import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  PieChart,
  ShieldCheck,
} from 'lucide-react';

export function AnalyticsPaywallModal() {
  return (
    <div
      role="dialog"
      aria-labelledby="paywall-title"
      aria-describedby="paywall-desc"
      className="absolute inset-0 z-20 flex items-center justify-center bg-zinc-950/40 p-4 backdrop-blur-md"
    >
      <div className="w-full max-w-lg rounded-2xl border border-blue-500/20 bg-white/95 p-6 shadow-2xl backdrop-blur-xl dark:border-blue-500/30 dark:bg-zinc-900/95 sm:p-8">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-600/10 p-2.5 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
            <Sparkles className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Fonctionnalité Premium
            </span>
            <h3
              id="paywall-title"
              className="text-lg font-bold text-zinc-900 dark:text-zinc-100"
            >
              Débloquez vos Analyses Avancées
            </h3>
          </div>
        </div>

        <p
          id="paywall-desc"
          className="mt-3 text-sm text-zinc-700 dark:text-zinc-200 leading-relaxed"
        >
          Prenez le contrôle total de vos finances avec des outils réservés aux
          membres Pro.
        </p>

        <ul className="mt-4 space-y-2.5 text-xs text-zinc-700 dark:text-zinc-200">
          <li className="flex items-center gap-2">
            <TrendingUp
              className="h-4 w-4 text-emerald-500 shrink-0"
              aria-hidden="true"
            />
            <span>
              Courbes comparatives et suivi de votre vitesse de dépense
            </span>
          </li>
          <li className="flex items-center gap-2">
            <PieChart
              className="h-4 w-4 text-blue-500 shrink-0"
              aria-hidden="true"
            />
            <span>
              Répartition 50/30/20 pour équilibrer besoins, envies et épargne
            </span>
          </li>
          <li className="flex items-center gap-2">
            <ShieldCheck
              className="h-4 w-4 text-amber-500 shrink-0"
              aria-hidden="true"
            />
            <span>Prévisions de fin de mois pour éviter les découverts</span>
          </li>
        </ul>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500"
          >
            <span>Passer à Life-Track Pro</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
