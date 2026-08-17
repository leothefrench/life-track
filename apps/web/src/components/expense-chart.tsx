'use client';

import { Pie, PieChart, Cell } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useI18n } from '@/lib/i18n/i18n-context';

export function ExpenseChart({ data }: { data: any[] }) {
  const { t } = useI18n();

  const chartConfig = {
    amount: { label: t('amount'), color: 'transparent' },
    LOGEMENT: { label: t('cat_housing'), color: 'var(--chart-1)' },
    ENERGIE: { label: t('cat_energy'), color: 'var(--chart-2)' },
    ALIMENTATION: { label: t('cat_food'), color: 'var(--chart-3)' },
    TRANSPORT: { label: t('cat_transport'), color: 'var(--chart-4)' },
    ABONNEMENTS: { label: t('cat_subscriptions'), color: 'var(--chart-5)' },
    LOISIRS: { label: t('cat_leisure'), color: 'var(--chart-6)' },
    SANTE: { label: t('cat_health'), color: 'var(--chart-7)' },
    AUTRE: { label: t('cat_other'), color: 'var(--chart-8)' },
  } satisfies ChartConfig;

  return (
    <Card className="flex flex-col border-border/50 bg-card/30">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
          {t('breakdown_title')}
        </CardTitle>
        <CardDescription>{t('by_category')}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              shared={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey="amount"
              nameKey="category"
              innerRadius={60}
              strokeWidth={5}
              minAngle={15}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    chartConfig[entry.category as keyof typeof chartConfig]
                      ?.color || 'gray'
                  }
                />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
