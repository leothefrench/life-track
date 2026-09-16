'use client';

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { MonthlyTrendPoint, CHART_COLORS } from './analytics.types';

interface MonthlyTrendChartProps {
  data: MonthlyTrendPoint[];
  currencySymbol: string;
}

export function MonthlyTrendChart({
  data,
  currencySymbol,
}: MonthlyTrendChartProps) {
  return (
    <div
      role="region"
      aria-label="Graphique d'évolution des dépenses"
      className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            Évolution & Comparatif Mensuel
          </h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-300">
            Cumul quotidien par rapport au mois précédent
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 font-medium text-zinc-700 dark:text-zinc-200">
            <span
              className="h-2.5 w-2.5 rounded-full bg-emerald-500"
              aria-hidden="true"
            />
            Ce mois-ci
          </span>
          <span className="flex items-center gap-1.5 font-medium text-zinc-500 dark:text-zinc-400">
            <span
              className="h-2.5 w-2.5 rounded-full bg-slate-400"
              aria-hidden="true"
            />
            Mois dernier
          </span>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient
                id="currentMonthGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={CHART_COLORS.emerald}
                  stopOpacity={0.4}
                />
                <stop
                  offset="95%"
                  stopColor={CHART_COLORS.emerald}
                  stopOpacity={0.0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e2e8f0"
              className="dark:stroke-zinc-800"
              vertical={false}
            />
            <XAxis
              dataKey="day"
              stroke="#64748b"
              tick={{ fontSize: 11 }}
              tickLine={false}
            />
            <YAxis
              stroke="#64748b"
              tick={{ fontSize: 11 }}
              tickLine={false}
              tickFormatter={(val) => `${val}${currencySymbol}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#090d16',
                borderColor: '#1e293b',
                borderRadius: '12px',
                color: '#f8fafc',
                fontSize: '12px',
              }}
              formatter={(value: any, name: any) => [
                `${Number(value).toFixed(2)} ${currencySymbol}`,
                name === 'currentMonth' ? 'Ce mois-ci' : 'Mois précédent',
              ]}
              labelFormatter={(label) => `Jour ${label}`}
            />
            <Area
              type="monotone"
              dataKey="previousMonth"
              stroke={CHART_COLORS.slate}
              strokeWidth={2}
              strokeDasharray="4 4"
              fill="none"
            />
            <Area
              type="monotone"
              dataKey="currentMonth"
              stroke={CHART_COLORS.emerald}
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#currentMonthGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
