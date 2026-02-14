'use client';

import dynamic from 'next/dynamic';

export const DynamicExpenseChart = dynamic(
  () => import('./expense-chart').then((mod) => mod.ExpenseChart),
  {
    ssr: false,
    loading: () => (
      <div className="h-[300px] flex items-center justify-center text-xs text-muted-foreground italic">
        Chargement...
      </div>
    ),
  },
);
