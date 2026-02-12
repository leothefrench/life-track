"use client";

import { useState } from "react";
import { Sparkles, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { analyzeExpenses } from "@/app/actions/ai";

export function AIAdvisor() {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const result = await analyzeExpenses();
      setAdvice(result);
    } catch (error) {
      setAdvice("Désolé, le coach est indisponible pour le moment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-blue-500/20 bg-blue-500/5 shadow-none">
      <CardHeader className="flex flex-row items-center space-y-0 pb-2">
        <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
          <BrainCircuit className="h-4 w-4 text-blue-500" />
          Assistant IA
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {advice ? (
          <div className="text-sm leading-relaxed animate-in fade-in slide-in-from-top-1 duration-500">
            {advice.split('\n').map((line, i) => (
              <p key={i} className="mb-2">{line}</p>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            L'IA analyse vos dépenses du mois pour vous donner des conseils personnalisés.
          </p>
        )}
        
        <Button 
          onClick={handleAnalyze} 
          disabled={loading}
          variant="secondary"
          className="w-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 border border-blue-500/20"
        >
          {loading ? "Analyse en cours..." : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Générer des conseils
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}