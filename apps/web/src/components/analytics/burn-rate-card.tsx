'use client';

import { Flame, TrendingUp, TrendingDown } from 'lucide-react';
import { BurnRateData } from './analytics.types';

interface BurnRateCardProps {
  data: BurnRateData;
  currencySymbol: string;
}

export function BurnRateCard({ data, currencySymbol }: BurnRateCardProps) {
  const isPositive = data.projectedSavings >= 0;

  return (
    <div
      role="region"
      aria-label="Prévision de fin de mois"
      className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-amber-500/10 p-2 text-amber-600 dark:text-amber-400">
            <Flame className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Vitesse de Dépense & Projection
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-300">
              {data.daysRemaining} jours restants ce mois-ci
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
            Rythme quotidien
          </span>
          <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            {data.dailyAverage.toFixed(2)} {currencySymbol} / j
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-800/60">
          <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
            Total projeté fin de mois
          </span>
          <p className="mt-0.5 text-base font-bold text-zinc-900 dark:text-zinc-100">
            {data.projectedMonthEnd.toFixed(2)} {currencySymbol}
          </p>
        </div>

        <div className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-800/60">
          <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
            Économie / Dépassement estimé
          </span>
          <p
            className={`mt-0.5 flex items-center gap-1 text-base font-bold ${
              isPositive
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {isPositive ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            {Math.abs(data.projectedSavings).toFixed(2)} {currencySymbol}
          </p>
        </div>
      </div>
    </div>
  );
}
