export interface FallbackInsight {
  type: 'SAVING' | 'INFO';
  title: string;
  description: string;
  potentialSaving: number | null;
  category: string;
}

export function generateLocalAudit(
  expenses: { title: string; amount: number; category: string }[],
  lang: string,
): FallbackInsight[] {
  const insights: FallbackInsight[] = [];
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  // 1. Détection de la plus grosse dépense
  const highest = [...expenses].sort((a, b) => b.amount - a.amount)[0];
  if (highest && highest.amount > 50) {
    const texts: Record<string, { title: string; desc: string }> = {
      fr: {
        title: 'Pic de dépense détecté',
        desc: `Votre dépense la plus élevée récente est "${
          highest.title
        }" (${highest.amount.toFixed(2)} €).`,
      },
      en: {
        title: 'Spending peak detected',
        desc: `Your highest recent expense is "${
          highest.title
        }" (${highest.amount.toFixed(2)} €).`,
      },
      es: {
        title: 'Pico de gasto detectado',
        desc: `Su mayor gasto reciente es "${
          highest.title
        }" (${highest.amount.toFixed(2)} €).`,
      },
      de: {
        title: 'Ausgabenspitze erkannt',
        desc: `Ihre höchste jüngste Ausgabe ist "${
          highest.title
        }" (${highest.amount.toFixed(2)} €).`,
      },
      pt: {
        title: 'Pico de despesa detectado',
        desc: `Sua maior despesa recente é "${
          highest.title
        }" (${highest.amount.toFixed(2)} €).`,
      },
    };
    const t = texts[lang] || texts.fr;
    insights.push({
      type: 'INFO',
      title: t.title,
      description: t.desc,
      potentialSaving: null,
      category: highest.category || 'OTHER',
    });
  }

  // 2. Économie potentielle sur les charges fixes
  const energyExpenses = expenses.filter((e) => e.category === 'ENERGIE');
  const energyTotal = energyExpenses.reduce((s, e) => s + e.amount, 0);
  if (energyTotal > 0 || expenses.some((e) => e.category === 'ABONNEMENTS')) {
    const estimatedSaving = Math.round(Math.max(120, total * 0.08));
    const texts: Record<string, { title: string; desc: string }> = {
      fr: {
        title: 'Optimisation de vos contrats fixes',
        desc: `Une renégociation de vos contrats d'énergie ou télécoms pourrait vous faire économiser jusqu'à ${estimatedSaving} € par an.`,
      },
      en: {
        title: 'Fixed contracts optimization',
        desc: `Renegotiating your energy or telecom contracts could save you up to ${estimatedSaving} € per year.`,
      },
      es: {
        title: 'Optimización de contratos fijos',
        desc: `Renegociar sus contratos de energía o telefonía podría ahorrarle hasta ${estimatedSaving} € al año.`,
      },
      de: {
        title: 'Optimierung fester Verträge',
        desc: `Eine Neuverhandlung Ihrer Tarife könnte Ihnen bis zu ${estimatedSaving} € pro Jahr sparen.`,
      },
      pt: {
        title: 'Otimização de contratos fixos',
        desc: `Renegociar seus contratos fixos pode economizar até ${estimatedSaving} € por ano.`,
      },
    };
    const t = texts[lang] || texts.fr;
    insights.push({
      type: 'SAVING',
      title: t.title,
      description: t.desc,
      potentialSaving: estimatedSaving,
      category: 'ENERGY',
    });
  }

  // 3. Catégorie la plus lourde dans le budget
  const catTotals: Record<string, number> = {};
  for (const e of expenses) {
    catTotals[e.category] = (catTotals[e.category] || 0) + e.amount;
  }
  const topCat = Object.entries(catTotals).sort((a, b) => b[1] - a[1])[0];
  if (topCat && topCat[1] > 0) {
    const pct = Math.round((topCat[1] / total) * 100);
    const texts: Record<string, { title: string; desc: string }> = {
      fr: {
        title: `Poste principal : ${topCat[0]}`,
        desc: `La catégorie ${
          topCat[0]
        } représente ${pct} % de votre budget total (${topCat[1].toFixed(
          2,
        )} €).`,
      },
      en: {
        title: `Primary category: ${topCat[0]}`,
        desc: `Category ${
          topCat[0]
        } accounts for ${pct}% of your total budget (${topCat[1].toFixed(
          2,
        )} €).`,
      },
      es: {
        title: `Categoría principal: ${topCat[0]}`,
        desc: `La categoría ${
          topCat[0]
        } representa el ${pct}% de su presupuesto (${topCat[1].toFixed(2)} €).`,
      },
      de: {
        title: `Hauptposten: ${topCat[0]}`,
        desc: `Die Kategorie ${
          topCat[0]
        } macht ${pct}% Ihres Budgets aus (${topCat[1].toFixed(2)} €).`,
      },
      pt: {
        title: `Categoria principal: ${topCat[0]}`,
        desc: `A categoria ${
          topCat[0]
        } representa ${pct}% do seu orçamento (${topCat[1].toFixed(2)} €).`,
      },
    };
    const t = texts[lang] || texts.fr;
    insights.push({
      type: 'INFO',
      title: t.title,
      description: t.desc,
      potentialSaving: null,
      category: topCat[0],
    });
  }

  return insights;
}
