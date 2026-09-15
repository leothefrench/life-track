'use client';

import { useState } from 'react';
import { FileText, Table, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getExpensesCSV } from '@/app/actions/expenses';
import { toast } from 'sonner';
import { useI18n } from '@/lib/i18n/i18n-context';
import { generateExpensesPdf } from '@/lib/pdf-export';
import { PDF_LABELS } from '@/lib/pdf-labels';

export function ExportButton() {
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [loadingCsv, setLoadingCsv] = useState(false);
  const { t, currencySymbol, language } = useI18n();
  const labels = PDF_LABELS[language] || PDF_LABELS.fr;

  const handleExportPDF = async () => {
    setLoadingPdf(true);
    try {
      const csvData = await getExpensesCSV();
      if (!csvData) return toast.error(t('no_data'));
      const success = generateExpensesPdf(
        csvData,
        labels,
        currencySymbol,
        language,
      );
      if (success) toast.success(t('success'));
      else toast.error(t('no_data'));
    } catch {
      toast.error(t('error'));
    } finally {
      setLoadingPdf(false);
    }
  };

  const handleExportCSV = async () => {
    setLoadingCsv(true);
    try {
      const csvData = await getExpensesCSV();
      if (!csvData) return toast.error(t('no_data'));
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `depenses_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(t('success'));
    } catch {
      toast.error(t('error'));
    } finally {
      setLoadingCsv(false);
    }
  };

  return (
    <div className="inline-flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleExportPDF}
        disabled={loadingPdf || loadingCsv}
        className="gap-2 border-white/10 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400"
      >
        {loadingPdf ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <FileText className="h-4 w-4" />
        )}
        PDF
      </Button>

      {/* Contraste lisible : text-zinc-200 */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleExportCSV}
        disabled={loadingPdf || loadingCsv}
        className="gap-1.5 text-xs text-zinc-200 hover:text-white"
      >
        {loadingCsv ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Table className="h-3.5 w-3.5" />
        )}
        CSV
      </Button>
    </div>
  );
}
