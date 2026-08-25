'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, BrainCircuit, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { runSmartAudit } from '@/app/actions/ai';
import { cn } from '@/lib/utils';
import { useI18n } from '@/lib/i18n/i18n-context';

interface AIAdvisorProps {
  isPremium: boolean;
  expensesCount: number;
}

export function AIAdvisor({ isPremium, expensesCount }: AIAdvisorProps) {
  const router = useRouter();
  const { t, language } = useI18n();
  const [advice, setAdvice] = useState<{ isSuccess: boolean; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const prevLangRef = useRef<string | null>(null);

  const hasEnoughData = expensesCount >= 3;
  const progress = Math.min((expensesCount / 3) * 100, 100);

  const handleAnalyze = useCallback(
    async (overrideLang?: string) => {
      const targetLang = overrideLang || language;
      setLoading(true);
      try {
        const result = await runSmartAudit(targetLang);
        if (result.success) {
          setAdvice({ isSuccess: true, text: 'audit_success' });
        } else {
          setAdvice({ isSuccess: false, text: result.message || t('error') });
        }
        router.refresh();
      } catch (error) {
        setAdvice({ isSuccess: false, text: t('error') });
      } finally {
        setLoading(false);
      }
    },
    [language, router, t],
  );

  useEffect(() => {
    if (prevLangRef.current === null) {
      prevLangRef.current = language;
      return;
    }
    if (prevLangRef.current !== language) {
      prevLangRef.current = language;
      if (hasEnoughData) {
        handleAnalyze(language);
      }
    }
  }, [language, hasEnoughData, handleAnalyze]);

  return (
    <Card className="border-blue-500/20 bg-blue-500/5 shadow-none flex flex-col h-full overflow-hidden relative">
      {/* EFFET DE BALAYAGE PENDANT LE CHARGEMENT */}
      {loading && (
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/10 to-transparent h-1/2 w-full animate-scan z-0" />
      )}

      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 z-10">
        <CardTitle className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 text-blue-500">
          <BrainCircuit className={cn('h-3 w-3', loading && 'animate-pulse')} />
          {t('ai_assistant_title')}
        </CardTitle>

        <div className="flex flex-col items-end gap-1">
          <span className="text-[9px] font-bold text-white/40 uppercase">
            {hasEnoughData ? t('ready_status') : `${t('data_progress')} : ${expensesCount}/3`}
          </span>
          {/* MICRO BARRE DE PROGRESSION */}
          {!hasEnoughData && (
            <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 flex-1 flex flex-col justify-between z-10">
        <div className="text-[11px] leading-relaxed min-h-[40px]">
          {loading ? (
            <div className="flex flex-col gap-2 animate-pulse">
              <p className="text-blue-400/80 italic">
                {t('analyzing_transactions')}
              </p>
              <p className="text-white/20 text-[9px]">
                {t('calculating_savings')}
              </p>
            </div>
          ) : advice ? (
            <div className="animate-in fade-in slide-in-from-top-1 duration-500 text-white/80">
              {advice.isSuccess ? (
                <>
                  <p className="font-semibold text-blue-400 mb-1">
                    {t('analysis_complete')}
                  </p>
                  <p className="text-[11px] text-white/80">
                    {t('analysis_complete_desc')}
                  </p>
                </>
              ) : (
                <>
                  <p className="font-semibold text-amber-400 mb-1">
                    {t('info_label')}
                  </p>
                  <p className="text-[11px] text-white/80">{advice.text}</p>
                </>
              )}
            </div>
          ) : (
            <p className="text-white/40 italic">
              {hasEnoughData
                ? t('ai_ready_desc')
                : t('add_more_expenses_desc')}
            </p>
          )}
        </div>

        {!isPremium ? (
          <Button
            asChild
            variant="secondary"
            className="w-full text-[10px] font-bold uppercase h-9 rounded-xl transition-all duration-300 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm"
          >
            <Link href="/pricing" className="flex items-center justify-center">
              <Sparkles className="mr-2 h-3 w-3 text-amber-400" />
              {t('activate_pro_coach')}
            </Link>
          </Button>
        ) : (
          <Button
            onClick={() => handleAnalyze()}
            disabled={loading || !hasEnoughData}
            variant="secondary"
            className={cn(
              'w-full text-[10px] font-bold uppercase h-9 rounded-xl transition-all duration-300',
              hasEnoughData && !loading
                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]'
                : 'bg-white/5 text-white/40 border-white/5',
            )}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                {t('calculating_btn')}
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-3 w-3" />
                {t('launch_ai_audit')}
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
