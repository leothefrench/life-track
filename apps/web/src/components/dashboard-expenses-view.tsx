'use client';

import { useState, useMemo } from 'react';
import { BudgetProgressCard } from '@/components/budget-progress-card';
import { ExpenseList } from '@/components/expense-list';
import { useI18n } from '@/lib/i18n/i18n-context';

export type PeriodFilter = 'current_month' | 'last_30_days' | 'last_month';

interface DashboardExpensesViewProps {
  expenses: any[];
  monthlyBudget: number;
}

export function DashboardExpensesView({
  expenses,
  monthlyBudget,
}: DashboardExpensesViewProps) {
  const { t } = useI18n();
  const [period, setPeriod] = useState<PeriodFilter>('current_month');

  // Filtrage ultra-rapide côté client selon la période choisie
  const filteredExpenses = useMemo(() => {
    const now = new Date();

    if (period === 'current_month') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      return expenses.filter((e) => new Date(e.date) >= startOfMonth);
    }

    if (period === 'last_30_days') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return expenses.filter((e) => new Date(e.date) >= thirtyDaysAgo);
    }

    if (period === 'last_month') {
      const startOfLastMonth = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1,
      );
      const endOfLastMonth = new Date(
        now.getFullYear(),
        now.getMonth(),
        0,
        23,
        59,
        59,
        999,
      );
      return expenses.filter((e) => {
        const d = new Date(e.date);
        return d >= startOfLastMonth && d <= endOfLastMonth;
      });
    }

    return expenses;
  }, [expenses, period]);

  // Recalcul du montant dépensé spécifiquement pour la période sélectionnée
  const totalSpentPeriod = useMemo(() => {
    return filteredExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  }, [filteredExpenses]);

  return (
    <div className="space-y-6">
      {/* Sélecteur d'onglets de période */}
      <div className="flex justify-end">
        <div className="inline-flex p-1 bg-muted/30 border border-border/40 rounded-xl gap-1">
          <button
            type="button"
            onClick={() => setPeriod('current_month')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              period === 'current_month'
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t('period_current_month')}
          </button>
          <button
            type="button"
            onClick={() => setPeriod('last_30_days')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              period === 'last_30_days'
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t('period_last_30_days')}
          </button>
          <button
            type="button"
            onClick={() => setPeriod('last_month')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              period === 'last_month'
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t('period_last_month')}
          </button>
        </div>
      </div>

      {/* Jauge de suivi du budget adaptée à la période sélectionnée */}
      <BudgetProgressCard
        totalSpent={totalSpentPeriod}
        initialBudget={monthlyBudget}
      />

      {/* Liste des dépenses de la période sélectionnée */}
      <ExpenseList expenses={filteredExpenses} />
    </div>
  );
}
