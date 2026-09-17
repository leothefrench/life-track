'use client';

import React from 'react';
import { Flame, TrendingUp, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useI18n } from '@/lib/i18n/i18n-context';
import { BurnRateData } from './analytics.types';

export function BurnRateCard({
  data,
  currencySymbol = '€',
}: {
  data: BurnRateData;
  currencySymbol?: string;
}) {
  const { t } = useI18n();
  const isOverBudget = data.projectedMonthEnd > data.budgetCap;
  const progressPercent = Math.min(
    100,
    Math.round((data.projectedMonthEnd / (data.budgetCap || 1)) * 100),
  );

  return (
    <Card className="border-border/60 bg-card/60 backdrop-blur-sm shadow-sm overflow-hidden">
      <CardContent className="p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl bg-amber-500/10 p-2 text-amber-500">
              <Flame className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">
                {t('burn_rate_title')}
              </h2>
              <p className="text-xs text-muted-foreground">
                {t('days_remaining', { days: data.daysRemaining })}
              </p>
            </div>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
              isOverBudget
                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            }`}
          >
            {isOverBudget ? (
              <AlertCircle className="h-3.5 w-3.5" />
            ) : (
              <TrendingUp className="h-3.5 w-3.5" />
            )}
            {isOverBudget ? t('budget_limit') : t('projected_savings')}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="space-y-1">
            <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              {t('daily_average')}
            </span>
            <p className="text-lg font-bold text-foreground sm:text-xl">
              {data.dailyAverage.toFixed(2)} {currencySymbol}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              {t('projected_month_end')}
            </span>
            <p
              className={`text-lg font-bold sm:text-xl ${
                isOverBudget ? 'text-rose-400' : 'text-foreground'
              }`}
            >
              {data.projectedMonthEnd.toFixed(0)} {currencySymbol}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              {t('budget_limit')}
            </span>
            <p className="text-lg font-bold text-foreground sm:text-xl">
              {data.budgetCap.toFixed(0)} {currencySymbol}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              {t('projected_savings')}
            </span>
            <p className="text-lg font-bold text-emerald-400 sm:text-xl">
              {data.projectedSavings > 0 ? '+' : ''}
              {data.projectedSavings.toFixed(0)} {currencySymbol}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold text-muted-foreground">
            <span>{t('burn_rate_title')}</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted/40">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                isOverBudget ? 'bg-rose-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
