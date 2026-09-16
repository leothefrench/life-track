'use client';

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { BudgetRuleSplit } from './analytics.types';
import type {
  ValueType,
  NameType,
} from 'recharts/types/component/DefaultTooltipContent';

interface BudgetRuleChartProps {
  data: BudgetRuleSplit[];
  currencySymbol: string;
}

export function BudgetRuleChart({
  data,
  currencySymbol,
}: BudgetRuleChartProps) {
  return (
    <div
      role="region"
      aria-label="Répartition du budget 50/30/20"
      className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="mb-2">
        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
          Structure Financière (Règle 50 / 30 / 20)
        </h3>
        <p className="text-xs text-zinc-600 dark:text-zinc-300">
          Équilibre entre vos Besoins, Envies et Épargne
        </p>
      </div>

      <div className="flex flex-col items-center sm:flex-row sm:items-center sm:justify-between">
        <div className="h-52 w-52 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={75}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={entry.color}
                    stroke="transparent"
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#090d16',
                  borderColor: '#1e293b',
                  borderRadius: '12px',
                  color: '#f8fafc',
                  fontSize: '12px',
                }}
                formatter={(value: ValueType) => [
                  `${Number(value || 0).toFixed(2)} ${currencySymbol}`,
                  'Montant',
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Légende détaillée et comparatif avec la cible idéale */}
        <div className="mt-4 w-full space-y-2.5 sm:mt-0 sm:pl-4">
          {data.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                  aria-hidden="true"
                />
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                  {item.name}
                </span>
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  ({item.targetPercent}% visé)
                </span>
              </div>
              <div className="text-right font-bold text-zinc-900 dark:text-zinc-100">
                {item.percentage}% ({item.value.toFixed(0)} {currencySymbol})
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
