'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { exportExpensesAction } from '@/app/actions/expenses';
import { toast } from 'sonner';

export function ExportButton() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const result = await exportExpensesAction();

      if (result.success && result.data) {
        // --- LA MAGIE DU TÉLÉCHARGEMENT ---
        // 1. On crée un "Blob" (un objet binaire) à partir du texte CSV
        const blob = new Blob([result.data], {
          type: 'text/csv;charset=utf-8;',
        });

        // 2. On crée un lien temporaire dans la mémoire du navigateur
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');

        // 3. On configure le nom du fichier
        link.setAttribute('href', url);
        link.setAttribute(
          'download',
          `life-track-export-${new Date().toISOString().split('T')[0]}.csv`,
        );

        // 4. On déclenche le clic invisible et on nettoie
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success('Exportation terminée !');
      } else {
        toast.error("Échec de l'exportation");
      }
    } catch (error) {
      toast.error('Erreur technique');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={isExporting}
      className="h-8 text-[10px] font-bold uppercase tracking-wider"
    >
      <Download className="mr-2 h-3 w-3" />
      {isExporting ? 'Calcul...' : 'Exporter (CSV)'}
    </Button>
  );
}
