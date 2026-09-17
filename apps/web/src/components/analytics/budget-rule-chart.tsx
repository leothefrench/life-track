'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PieChart as PieIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useI18n } from '@/lib/i18n/i18n-context';
import { BudgetRuleSplit } from './analytics.types';

export function BudgetRuleChart({
  data,
  currencySymbol = '€',
}: {
  data: BudgetRuleSplit[];
  currencySymbol?: string;
}) {
  const { t } = useI18n();

  return (
    <Card className="border-border/60 bg-card/60 backdrop-blur-sm shadow-sm">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-border/40 pb-4">
          <div className="flex items-center gap-2">
            <PieIcon className="h-4 w-4 text-emerald-500" aria-hidden="true" />
            <h3 className="text-sm font-bold text-foreground">
              {t('budget_rule_title')}
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4">
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const value = payload[0].value;
                      return (
                        <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-1.5 shadow-xl">
                          <span className="text-xs font-bold text-white">
                            {Number(value).toFixed(2)} {currencySymbol}
                          </span>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3">
            {data.map((item) => {
              const isExceeded = item.percentage > item.targetPercent;
              return (
                <div key={item.name} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-foreground flex items-center gap-1.5">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: item.color }}
                        aria-hidden="true"
                      />
                      {item.name}
                    </span>
                    <span
                      className={`font-mono font-bold ${
                        isExceeded ? 'text-rose-500' : 'text-muted-foreground'
                      }`}
                    >
                      {item.percentage}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/40">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isExceeded ? 'bg-rose-500' : ''
                      }`}
                      style={{
                        width: `${Math.min(
                          100,
                          (item.percentage / item.targetPercent) * 100,
                        )}%`,
                        backgroundColor: isExceeded ? undefined : item.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
