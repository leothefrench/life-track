'use client';

import {
  Lightbulb,
  TrendingDown,
  AlertTriangle,
  ArrowRight,
  Info,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n/i18n-context';

export function InsightCards({ insights }: { insights: any[] }) {
  const { t } = useI18n();

  if (insights.length === 0) return null;

  return (
    <div className="space-y-3 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.map((insight) => (
          <Card
            key={insight.id}
            className="border-emerald-500/20 bg-emerald-500/5 shadow-none overflow-hidden flex flex-col"
          >
            <CardContent className="p-4 flex flex-col h-full">
              <div className="flex-1 space-y-3 mb-4">
                <div className="flex items-start justify-between">
                  <div className="p-2 rounded-lg bg-emerald-500/10">
                    {insight.type === 'SAVING' ? (
                      <TrendingDown className="h-4 w-4 text-emerald-500" />
                    ) : insight.type === 'DUPLICATE' ? (
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                    ) : (
                      <Lightbulb className="h-4 w-4 text-blue-500" />
                    )}
                  </div>
                  {insight.potentialSaving && (
                    <span className="text-[10px] font-bold bg-emerald-500 text-white px-2 py-0.5 rounded-full">
                      -{insight.potentialSaving}€
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-bold leading-tight">
                    {insight.title}
                  </h4>
                  <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                    {insight.description}
                  </p>
                </div>
              </div>

              {insight.affiliateUrl && (
                <Button
                  variant="ghost"
                  size="sm"
                  className={`w-full justify-between h-8 text-[10px] font-bold uppercase tracking-wider p-0 px-2 mt-auto ${
                    insight.type === 'SAVING'
                      ? 'hover:bg-emerald-500/10 hover:text-emerald-500'
                      : 'hover:bg-amber-500/10 hover:text-amber-500'
                  }`}
                  asChild
                >
                  <a
                    href={insight.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {insight.type === 'SAVING' && t('compare_offers')}
                    {insight.type === 'DUPLICATE' && t('check_error')}
                    {insight.type === 'INFO' && t('learn_more')}
                    <ArrowRight className="h-3 w-3" />
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Note d'information légale discrète et adaptée aux smartphones */}
      <div className="flex items-center gap-1.5 px-1 text-[11px] text-muted-foreground/75 leading-tight">
        <Info className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
        <span>{t('ai_disclaimer')}</span>
      </div>
    </div>
  );
}
