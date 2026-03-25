import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { AIAdvisor } from '@/components/ai-advisor';
import { DailyBarChart } from '@/components/daily-bar-chart';
import { DynamicExpenseChart } from '@/components/dynamic-chart';
import { Button } from '@/components/ui/button';

interface DashboardStatsProps {
  totalSpent: number;
  last7DaysData: any[];
  chartData: any[];
  isPremium: boolean;
}

export function DashboardStats({
  totalSpent,
  last7DaysData,
  chartData,
  isPremium,
}: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 flex flex-col gap-6">
        <Card className="bg-card/40 border-border/50 shadow-none flex flex-col items-center justify-center text-center py-6">
          <CardContent className="p-0">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
              Total dépensé
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
        <AIAdvisor isPremium={isPremium} />
      </div>

      <div className="lg:col-span-2 relative group overflow-hidden rounded-xl border border-border/50 bg-card/20 p-4 min-h-[350px] flex items-center justify-center">
        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-full ${
            !isPremium
              ? 'blur-[3px] opacity-40 pointer-events-none select-none'
              : ''
          }`}
        >
          <DailyBarChart data={last7DaysData} />
          <DynamicExpenseChart data={chartData} />
        </div>

        {!isPremium && (
          <div className="absolute inset-0 flex items-center justify-center z-30">
            <div className="bg-background/90 p-8 rounded-3xl border border-border/50 shadow-2xl backdrop-blur-md max-w-[260px] text-center">
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
