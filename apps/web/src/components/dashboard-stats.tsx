'use client'; // Obligatoire pour utiliser dynamic avec ssr: false

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const DailyBarChart = dynamic(
  () => import('@/components/daily-bar-chart').then((mod) => mod.DailyBarChart),
  {
    ssr: false,
    loading: () => <Skeleton className="h-50 w-full bg-white/5" />,
  },
);

const DynamicExpenseChart = dynamic(
  () =>
    import('@/components/dynamic-chart').then((mod) => mod.DynamicExpenseChart),
  {
    ssr: false,
    loading: () => <Skeleton className="h-50 w-full bg-white/5" />,
  },
);

const AIAdvisor = dynamic(
  () => import('@/components/ai-advisor').then((mod) => mod.AIAdvisor),
  {
    ssr: false,
    loading: () => <Skeleton className="h-37.5 w-full bg-white/5" />,
  },
);

interface DashboardStatsProps {
  totalSpent: number;
  last30DaysData: any[];
  chartData: any[];
  isPremium: boolean;
  expensesCount: number;
}

export function DashboardStats({
  totalSpent,
  last30DaysData,
  chartData,
  isPremium,
  expensesCount,
}: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 flex flex-col gap-6">
        {/* Cette carte s'affichera instantanément car elle est très légère */}
        <Card className="bg-card/40 border-border/50 shadow-none flex flex-col items-center justify-center text-center py-6">
          <CardContent className="p-0">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
              Dépensé (30j)
            </p>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-4xl font-bold tracking-tight text-rose-500">
                {totalSpent.toFixed(2)}
              </span>
              <span className="text-xl font-medium text-muted-foreground">
                €
              </span>
            </div>
          </CardContent>
        </Card>

        {/* L'IA Advisor se chargera juste après */}
        <AIAdvisor isPremium={isPremium} expensesCount={expensesCount} />
      </div>

      <div className="lg:col-span-2 relative group overflow-hidden rounded-xl border border-border-bright bg-card/20 p-4 min-h-87.5 flex items-center justify-center">
        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-full ${
            !isPremium
              ? 'blur-[3px] opacity-40 pointer-events-none select-none'
              : ''
          }`}
        >
          {/* Les graphiques ne bloquent plus le thread principal du mobile */}
          <DailyBarChart data={last30DaysData} />
          <DynamicExpenseChart data={chartData} />
        </div>

        {!isPremium && (
          <div className="absolute inset-0 flex items-center justify-center z-30">
            <div className="bg-background/90 p-8 rounded-3xl border border-border-bright shadow-2xl backdrop-blur-md max-w-65 text-center">
              <p className="font-bold text-sm mb-2 uppercase tracking-tighter">
                Analyses Pro
              </p>
              <p className="text-[11px] text-muted-foreground mb-6">
                Visualisez vos dépenses et abonnements en détail.
              </p>
              <Button
                size="sm"
                className="rounded-full px-8 shadow-lg shadow-blue-500/20 bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 w-full"
                asChild
              >
                <Link href="/pricing">Passer Premium</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
