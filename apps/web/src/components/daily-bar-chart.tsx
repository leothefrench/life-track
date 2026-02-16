'use client';

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
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

const categories = [
  'LOYER',
  'NOURRITURE',
  'VETEMENTS',
  'LOISIRS',
  'AUTRE',
] as const;

// On mappe les catégories aux variables CSS définies dans globals.css
const chartConfig = {
  LOYER: { label: 'Loyer', color: 'var(--chart-1)' },
  NOURRITURE: { label: 'Nourriture', color: 'var(--chart-2)' },
  VETEMENTS: { label: 'Vêtements', color: 'var(--chart-3)' },
  LOISIRS: { label: 'Loisirs', color: 'var(--chart-4)' },
  AUTRE: { label: 'Autre', color: 'var(--chart-5)' },
} satisfies ChartConfig;

export function DailyBarChart({ data }: { data: any[] }) {
  return (
    <Card className="border-border/50 bg-card/30 shadow-none h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
          Activité
        </CardTitle>
        <CardDescription>7 derniers jours par catégorie</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-37.5 w-full">
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
                radius={[4, 4, 0, 0]}
                stackId="a"
              />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
