'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BarChart3, Sparkles, ArrowLeft } from 'lucide-react';
import { useI18n } from '@/lib/i18n/i18n-context';
import { MonthlyTrendChart } from '@/components/analytics/monthly-trend-chart';
import { BudgetRuleChart } from '@/components/analytics/budget-rule-chart';
import { BurnRateCard } from '@/components/analytics/burn-rate-card';
import { AnalyticsPaywallModal } from '@/components/analytics/analytics-paywall-modal';
import {
  MonthlyTrendPoint,
  BudgetRuleSplit,
  BurnRateData,
  CHART_COLORS,
} from '@/components/analytics/analytics.types';

const SAMPLE_TRENDS: MonthlyTrendPoint[] = [
  { day: '01', currentMonth: 45, previousMonth: 60 },
  { day: '05', currentMonth: 180, previousMonth: 210 },
  { day: '10', currentMonth: 420, previousMonth: 530 },
  { day: '15', currentMonth: 690, previousMonth: 820 },
  { day: '20', currentMonth: 950, previousMonth: 1100 },
  { day: '25', currentMonth: 1240, previousMonth: 1450 },
  { day: '30', currentMonth: 1480, previousMonth: 1720 },
];

const SAMPLE_BURN_RATE: BurnRateData = {
  dailyAverage: 47.74,
  projectedMonthEnd: 1480,
  budgetCap: 1700,
  projectedSavings: 220,
  daysRemaining: 16,
};

export default function AnalyticsPage() {
  const { currencySymbol, t } = useI18n();
  const [isPremium] = useState<boolean>(true);

  const sampleRuleSplit: BudgetRuleSplit[] = [
    {
      name: t('cat_housing') || 'Besoins',
      value: 850,
      percentage: 52,
      color: CHART_COLORS.needs,
      targetPercent: 50,
    },
    {
      name: t('cat_leisure') || 'Envies',
      value: 430,
      percentage: 26,
      color: CHART_COLORS.wants,
      targetPercent: 30,
    },
    {
      name: t('dashboard_title') || 'Épargne',
      value: 360,
      percentage: 22,
      color: CHART_COLORS.savings,
      targetPercent: 20,
    },
  ];

  return (
    <main className="relative min-h-[calc(100vh-5rem)] px-4 py-8 sm:px-8 lg:px-12 max-w-6xl mx-auto space-y-8">
      {/* Bouton retour aéré avec style de bouton subtil */}
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white bg-zinc-100 dark:bg-zinc-800/60 hover:bg-zinc-200/70 dark:hover:bg-zinc-800 transition-all shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>{t('nav_dashboard')}</span>
        </Link>
      </div>

      {/* En-tête aéré */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-zinc-200/60 dark:border-zinc-800/80">
        <div className="flex items-center gap-3.5">
          <div className="rounded-2xl bg-blue-600/10 p-3 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 shadow-inner">
            <BarChart3 className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-3xl">
              {t('pro_analytics')}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
              {t('visualize_expenses')}
            </p>
          </div>
        </div>

        {isPremium && (
          <span className="inline-flex items-center gap-2 rounded-full bg-amber-400/10 px-3.5 py-1.5 text-xs font-black uppercase tracking-wider text-amber-500 dark:text-amber-400 border border-amber-400/20 shadow-sm">
            <Sparkles className="h-3.5 w-3.5" /> {t('pro_member')}
          </span>
        )}
      </div>

      {/* Grille des graphiques avec marges et respirations adaptées */}
      <div
        className={`space-y-8 transition-all duration-300 ${
          !isPremium ? 'select-none blur-md pointer-events-none' : ''
        }`}
      >
        <BurnRateCard
          data={SAMPLE_BURN_RATE}
          currencySymbol={currencySymbol || '€'}
        />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <MonthlyTrendChart
            data={SAMPLE_TRENDS}
            currencySymbol={currencySymbol || '€'}
          />
          <BudgetRuleChart
            data={sampleRuleSplit}
            currencySymbol={currencySymbol || '€'}
          />
        </div>
      </div>

      {!isPremium && <AnalyticsPaywallModal />}
    </main>
  );
}
