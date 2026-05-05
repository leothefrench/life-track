'use client';

import { useState } from 'react';
import { Sparkles, BrainCircuit, Loader2 } from 'lucide-react'; // Ajout de Loader2
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { runSmartAudit } from '@/app/actions/ai';
import { cn } from '@/lib/utils';

interface AIAdvisorProps {
  isPremium: boolean;
  expensesCount: number;
}

export function AIAdvisor({ isPremium, expensesCount }: AIAdvisorProps) {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const hasEnoughData = expensesCount >= 3;
  const progress = Math.min((expensesCount / 3) * 100, 100);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const result = await runSmartAudit();
      setAdvice(result.message);
    } catch (error) {
      setAdvice('Désolé, le coach est indisponible pour le moment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-blue-500/20 bg-blue-500/5 shadow-none flex flex-col h-full overflow-hidden relative">
      {/* EFFET DE BALAYAGE PENDANT LE CHARGEMENT */}
      {loading && (
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/10 to-transparent h-1/2 w-full animate-scan z-0" />
      )}

      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 z-10">
        <CardTitle className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 text-blue-500">
          <BrainCircuit className={cn('h-3 w-3', loading && 'animate-pulse')} />
          Assistant IA
        </CardTitle>

        <div className="flex flex-col items-end gap-1">
          <span className="text-[9px] font-bold text-white/40 uppercase">
            {hasEnoughData ? 'Prêt' : `Données : ${expensesCount}/3`}
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
                Analyse de vos transactions en cours...
              </p>
              <p className="text-white/20 text-[9px]">
                Calcul des économies potentielles via Gemini Flash
              </p>
            </div>
          ) : advice ? (
            <div className="animate-in fade-in slide-in-from-top-1 duration-500 text-white/80">
              <p className="font-semibold text-blue-400 mb-1">
                Analyse terminée !
              </p>
              <p>
                Vos nouveaux conseils d'économies sont disponibles juste en
                dessous.
              </p>
            </div>
          ) : (
            <p className="text-white/40 italic">
              {hasEnoughData
                ? "L'IA est prête à identifier vos économies sur vos contrats (énergie, assurances...)."
                : 'Ajoutez encore quelques dépenses pour permettre une analyse précise.'}
            </p>
          )}
        </div>

        <Button
          onClick={handleAnalyze}
          disabled={loading || !isPremium || !hasEnoughData}
          variant="secondary"
          className={cn(
            'w-full text-[10px] font-bold uppercase h-9 rounded-xl transition-all duration-300',
            hasEnoughData && isPremium && !loading
              ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]'
              : 'bg-white/5 text-white/40 border-white/5',
          )}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
              Calcul en cours...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-3 w-3" />
              {!isPremium ? 'Activer le Coach Pro' : 'Lancer l’Audit IA'}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
