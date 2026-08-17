'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getExpensesCSV } from '@/app/actions/expenses';
import { toast } from 'sonner';
import { useI18n } from '@/lib/i18n/i18n-context';

export function ExportButton() {
  const [loading, setLoading] = useState(false);
  const { t } = useI18n();

  const handleExport = async () => {
    setLoading(true);
    try {
      const csvData = await getExpensesCSV();

      if (!csvData) {
        toast.error(t('no_data'));
        return;
      }

      // Créer un blob et lancer le téléchargement
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute(
        'download',
        `depenses_${new Date().toISOString().slice(0, 10)}.csv`,
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(t('success'));
    } catch (error) {
      console.error("Erreur lors de l'export:", error);
      toast.error(t('error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={loading}
      className="gap-2 border-white/10 bg-white/5 hover:bg-white/10 text-white"
    >
      <Download className="h-4 w-4" />
      {loading ? t('exporting_btn') : t('export_csv_btn')}
    </Button>
  );
}
