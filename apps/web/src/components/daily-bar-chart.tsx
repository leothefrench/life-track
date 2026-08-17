'use client';

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useI18n } from '@/lib/i18n/i18n-context';

const categories = [
  'LOGEMENT',
  'ENERGIE',
  'ALIMENTATION',
  'TRANSPORT',
  'ABONNEMENTS',
  'LOISIRS',
  'SANTE',
  'AUTRE',
] as const;

export function DailyBarChart({ data }: { data: any[] }) {
  const { t } = useI18n();

  const chartConfig = {
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
    <Card className="border-none bg-transparent shadow-none h-full">
      <CardHeader className="p-0 pb-4">
        <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          {t('activity_30d')}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ChartContainer config={chartConfig} className="h-45 w-full">
          <BarChart data={data}>
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.1)"
            />
            <XAxis
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              fontSize={10}
            />
            <ChartTooltip
              cursor={false}
              shared={false}
              content={<ChartTooltipContent hideLabel />}
            />
            {/* On boucle sur les catégories pour créer les segments empilés */}
            {categories.map((cat) => (
              <Bar
                key={cat}
                dataKey={cat}
                fill={chartConfig[cat].color}
                radius={[2, 2, 0, 0]}
                stackId="a"
                style={{ filter: 'saturate(1.4) brightness(1.1)' }}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
