import { PdfLabels } from '@/lib/pdf-export';

export const PDF_LABELS: Record<string, PdfLabels> = {
  fr: {
    title: 'Relevé des Dépenses - Life-Track',
    generatedOn: 'Généré le',
    totalLabel: 'Total',
    colDate: 'Date',
    colCategory: 'Catégorie',
    colDescription: 'Description',
    colAmount: 'Montant',
  },
  en: {
    title: 'Expense Report - Life-Track',
    generatedOn: 'Generated on',
    totalLabel: 'Total',
    colDate: 'Date',
    colCategory: 'Category',
    colDescription: 'Description',
    colAmount: 'Amount',
  },
  de: {
    title: 'Ausgabenübersicht - Life-Track',
    generatedOn: 'Erstellt am',
    totalLabel: 'Gesamtsumme',
    colDate: 'Datum',
    colCategory: 'Kategorie',
    colDescription: 'Beschreibung',
    colAmount: 'Betrag',
  },
  es: {
    title: 'Informe de Gastos - Life-Track',
    generatedOn: 'Generado el',
    totalLabel: 'Total',
    colDate: 'Fecha',
    colCategory: 'Categoría',
    colDescription: 'Descripción',
    colAmount: 'Importe',
  },
  pt: {
    title: 'Relatório de Despesas - Life-Track',
    generatedOn: 'Gerado em',
    totalLabel: 'Total',
    colDate: 'Data',
    colCategory: 'Categoria',
    colDescription: 'Descrição',
    colAmount: 'Montante',
  },
};
