import { Card, CardContent } from '@/components/ui/card';
import { AIAdvisor } from '@/components/ai-advisor';
import { DailyBarChart } from '@/components/daily-bar-chart';
import { DynamicExpenseChart } from '@/components/dynamic-chart';
import { Button } from '@/components/ui/button';
import { createCheckoutSession } from '@/app/actions/stripe';

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
        <AIAdvisor />
      </div>

      <div className="lg:col-span-2 relative group overflow-hidden rounded-xl border border-border/50 bg-card/20 p-4">
        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-4 h-full ${
            !isPremium
              ? 'blur-[2px] opacity-70 pointer-events-none select-none'
              : ''
          }`}
        >
          <DailyBarChart data={last7DaysData} />
          <DynamicExpenseChart data={chartData} />
        </div>

        {!isPremium && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-background/90 p-6 rounded-2xl border border-border/50 shadow-2xl backdrop-blur-md">
              <p className="font-bold text-sm mb-1 text-foreground">
                Analyses Premium
              </p>
              <p className="text-[10px] text-muted-foreground mb-4">
                Débloquez vos graphiques détaillés.
              </p>
              <form action={createCheckoutSession}>
                <Button
                  type="submit"
                  size="sm"
                  className="rounded-full px-6 bg-blue-600 text-white"
                >
                  Passer Premium — 9.99€
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
