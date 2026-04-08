'use client';

import { useState } from 'react';
import { Sparkles, BrainCircuit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { runSmartAudit } from '@/app/actions/ai';

interface AIAdvisorProps {
  isPremium: boolean;
  expensesCount: number; // On reçoit le nombre de dépenses
}

export function AIAdvisor({ isPremium, expensesCount }: AIAdvisorProps) {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // L'IA a besoin de 3 dépenses minimum
  const hasEnoughData = expensesCount >= 3;

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
    <Card className="border-blue-500/20 bg-blue-500/5 shadow-none flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 text-blue-500">
          <BrainCircuit className="h-3 w-3" />
          Assistant IA
        </CardTitle>

        {/* INDICATEUR DE STATUT */}
        <div className="flex items-center gap-1.5">
          <div
            className={`h-1.5 w-1.5 rounded-full ${
              hasEnoughData ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
            }`}
          />
          <span className="text-[9px] font-bold text-white/40 uppercase">
            {hasEnoughData ? 'Prêt' : `${expensesCount}/3`}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
        <div className="text-[11px] leading-relaxed">
          {advice ? (
            <div className="animate-in fade-in slide-in-from-top-1 duration-500 text-white/80">
              {advice.split('\n').map((line, i) => (
                <p key={i} className="mb-2">
                  {line}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-white/40 italic">
              {hasEnoughData
                ? "Données suffisantes. L'IA peut maintenant auditer vos finances."
                : "Ajoutez au moins 3 dépenses pour activer l'analyse intelligente."}
            </p>
          )}
        </div>

        <Button
          onClick={handleAnalyze}
          disabled={loading || !isPremium || !hasEnoughData}
          variant="secondary"
          className="w-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 text-[10px] font-bold uppercase h-8"
        >
          {loading ? (
            'Analyse...'
          ) : (
            <>
              <Sparkles className="mr-2 h-3 w-3" />
              {!isPremium
                ? 'Membres Pro'
                : !hasEnoughData
                ? 'Données insuffisantes'
                : "Lancer l'audit"}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
