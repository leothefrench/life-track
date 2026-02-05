'use client';

import { Pie, PieChart, Cell} from 'recharts';
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

const chartConfig = {
  amount: { label: 'Montant', color: 'transparent' },
  loyer: { label: 'Loyer', color: 'var(--chart-1)' },
  nourriture: { label: 'Nourriture', color: 'var(--chart-2)' },
  vetements: { label: 'Vêtements', color: 'var(--chart-3)' },
  loisirs: { label: 'Loisirs', color: 'var(--chart-4)' },
  autre: { label: 'Autre', color: 'var(--chart-5)' },
} satisfies ChartConfig;

export function ExpenseChart({ data }: { data: any[] }) {
  return (
    <Card className="flex flex-col border-border/50 bg-card/30">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
          Répartition
        </CardTitle>
        <CardDescription>Par catégorie de dépenses</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
        
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={data}
                dataKey="amount"
                nameKey="category"
                innerRadius={60}
                strokeWidth={5}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      chartConfig[
                        entry.category.toLowerCase() as keyof typeof chartConfig
                      ]?.color || 'gray'
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
