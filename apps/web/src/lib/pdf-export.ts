import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface PdfLabels {
  title: string;
  generatedOn: string;
  totalLabel: string;
  colDate: string;
  colCategory: string;
  colDescription: string;
  colAmount: string;
}

function formatDate(raw: string, lang: string): string {
  if (!raw || raw === '-') return '-';
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  const locale = lang === 'en' ? 'en-US' : lang === 'de' ? 'de-DE' : 'fr-FR';
  return d.toLocaleDateString(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function generateExpensesPdf(
  csvData: string,
  labels: PdfLabels,
  currencySymbol: string,
  language: string,
) {
  const lines = csvData.trim().split('\n');
  if (lines.length <= 1) return false;

  const tableRows: string[][] = [];
  let grandTotal = 0;

  // Ligne 0 = headers ("title","amount","category","date")
  for (let i = 1; i < lines.length; i++) {
    const row = lines[i]
      .split(',')
      .map((cell) => cell.replace(/"/g, '').trim());
    if (row.length < 4) continue;

    const title = row[0] || '-'; // title ("café")
    const numericAmount = parseFloat(row[1]) || 0; // amount (3.00)
    const category = row[2] || '-'; // category ("Alimentation")
    const dateFormatted = formatDate(row[3], language); // date ("07/09/2026")

    grandTotal += numericAmount;

    // Colonnes affichées : Date | Catégorie | Description | Montant
    tableRows.push([
      dateFormatted,
      category,
      title,
      `${numericAmount.toFixed(2)} ${currencySymbol}`,
    ]);
  }

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  // En-tête sobre
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 210, 28, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.text(labels.title, 14, 14);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text(
    `${labels.generatedOn}: ${formatDate(new Date().toISOString(), language)}`,
    14,
    21,
  );

  // Tableau des dépenses
  autoTable(doc, {
    head: [
      [
        labels.colDate,
        labels.colCategory,
        labels.colDescription,
        labels.colAmount,
      ],
    ],
    body: tableRows,
    startY: 35,
    theme: 'striped',
    styles: { fontSize: 9, cellPadding: 3, textColor: [30, 41, 59] },
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: { 3: { halign: 'right', fontStyle: 'bold' } },
  });

  // Total général
  const finalY =
    (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable
      ?.finalY || 80;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(
    `${labels.totalLabel}: ${grandTotal.toFixed(2)} ${currencySymbol}`,
    196,
    finalY + 8,
    { align: 'right' },
  );

  doc.save(`depenses_${new Date().toISOString().slice(0, 10)}.pdf`);
  return true;
}
