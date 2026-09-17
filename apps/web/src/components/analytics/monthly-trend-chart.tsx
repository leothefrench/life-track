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
import { TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useI18n } from '@/lib/i18n/i18n-context';
import { MonthlyTrendPoint } from './analytics.types';

export function MonthlyTrendChart({
  data,
  currencySymbol = '€',
}: {
  data: MonthlyTrendPoint[];
  currencySymbol?: string;
}) {
  const { t } = useI18n();

  return (
    <Card className="border-border/60 bg-card/60 backdrop-blur-sm shadow-sm">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-border/40 pb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-500" aria-hidden="true" />
            <h3 className="text-sm font-bold text-foreground">
              {t('monthly_trend_title')}
            </h3>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-blue-400">
              <span
                className="h-2 w-2 rounded-full bg-blue-500"
                aria-hidden="true"
              />
              {t('current_month')}
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span
                className="h-2 w-2 rounded-full bg-zinc-500"
                aria-hidden="true"
              />
              {t('previous_month')}
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
                <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#27272a"
                vertical={false}
              />
              <XAxis
                dataKey="day"
                stroke="#71717a"
                fontSize={11}
                tickLine={false}
              />
              <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#18181b',
                  borderColor: '#27272a',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
                }}
                itemStyle={{ color: '#ffffff' }}
                labelStyle={{ color: '#ffffff', fontWeight: 600 }}
                formatter={(value: number, name: string) => [
                  `${value} ${currencySymbol}`,
                  name,
                ]}
              />
              <Area
                type="monotone"
                dataKey="previousMonth"
                name={t('previous_month')}
                stroke="#71717a"
                strokeDasharray="4 4"
                fill="transparent"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="currentMonth"
                name={t('current_month')}
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorCurrent)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
