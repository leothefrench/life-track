import {
  MonthlyTrendPoint,
  BurnRateData,
  CHART_COLORS,
} from './analytics.types';

export interface RawExpense {
  amount: number;
  date: Date | string;
  category: string;
}

/**
 * Calcule le Burn Rate (rythme de dépenses) sur le mois en cours
 */
export function calculateBurnRate(
  expenses: RawExpense[],
  monthlyBudgetCap: number = 1700,
): BurnRateData {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const currentDay = now.getDate();

  // Nombre total de jours dans le mois en cours
  const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysRemaining = Math.max(0, totalDaysInMonth - currentDay);

  // Filtrer les dépenses du mois en cours
  const currentMonthExpenses = expenses.filter((e) => {
    const d = new Date(e.date);
    return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
  });

  const totalSpentSoFar = currentMonthExpenses.reduce(
    (sum, e) => sum + e.amount,
    0,
  );

  // Moyenne quotidienne réelle (sur les jours déjà écoulés)
  const dailyAverage = currentDay > 0 ? totalSpentSoFar / currentDay : 0;

  // Projection fin de mois basée sur le rythme actuel
  const projectedMonthEnd = Math.round(dailyAverage * totalDaysInMonth);
  const projectedSavings = Math.max(0, monthlyBudgetCap - projectedMonthEnd);

  return {
    dailyAverage: Number(dailyAverage.toFixed(2)),
    projectedMonthEnd,
    budgetCap: monthlyBudgetCap,
    projectedSavings,
    daysRemaining,
  };
}

/**
 * Calcule la tendance comparative cumulée : Mois en cours (M) vs Mois précédent (M-1)
 */
export function calculateMonthlyTrends(
  expenses: RawExpense[],
): MonthlyTrendPoint[] {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const currentDay = now.getDate();

  // Définition du mois précédent
  const prevDate = new Date(currentYear, currentMonth - 1, 1);
  const prevYear = prevDate.getFullYear();
  const prevMonth = prevDate.getMonth();

  const totalDaysInCurrentMonth = new Date(
    currentYear,
    currentMonth + 1,
    0,
  ).getDate();

  // Initialisation des cumuls journaliers
  const points: MonthlyTrendPoint[] = [];
  let currentCumul = 0;
  let prevCumul = 0;

  for (let day = 1; day <= totalDaysInCurrentMonth; day++) {
    // Dépenses du jour pour le mois en cours
    const currentDayExpenses = expenses.filter((e) => {
      const d = new Date(e.date);
      return (
        d.getFullYear() === currentYear &&
        d.getMonth() === currentMonth &&
        d.getDate() === day
      );
    });

    // Dépenses du jour pour le mois précédent
    const prevDayExpenses = expenses.filter((e) => {
      const d = new Date(e.date);
      return (
        d.getFullYear() === prevYear &&
        d.getMonth() === prevMonth &&
        d.getDate() === day
      );
    });

    const currentSpent = currentDayExpenses.reduce(
      (sum, e) => sum + e.amount,
      0,
    );
    const prevSpent = prevDayExpenses.reduce((sum, e) => sum + e.amount, 0);

    prevCumul += prevSpent;

    // Pour le mois en cours, on ne cumule pas les jours futurs
    if (day <= currentDay) {
      currentCumul += currentSpent;
    }

    // On échantillonne tous les 5 jours + le dernier jour du mois pour un graphique fluide
    if (day % 5 === 0 || day === 1 || day === totalDaysInCurrentMonth) {
      points.push({
        day: String(day).padStart(2, '0'),
        currentMonth:
          day <= currentDay
            ? Math.round(currentCumul)
            : (null as unknown as number),
        previousMonth: Math.round(prevCumul),
      });
    }
  }

  return points;
}

/**
 * Calcule la répartition 50/30/20 basée sur le vrai budget mensuel de l'utilisateur
 */
export function calculateBudgetRuleSplit(
  expenses: RawExpense[],
  monthlyBudget: number = 1500,
) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const currentMonthExpenses = expenses.filter((e) => {
    const d = new Date(e.date);
    return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
  });

  const NEEDS_CATEGORIES = ['LOGEMENT', 'ENERGIE', 'ALIMENTATION', 'TRANSPORT', 'SANTE'];
  const WANTS_CATEGORIES = ['LOISIRS', 'ABONNEMENTS', 'AUTRE'];

  let needsTotal = 0;
  let wantsTotal = 0;

  currentMonthExpenses.forEach((e) => {
    if (NEEDS_CATEGORIES.includes(e.category)) {
      needsTotal += e.amount;
    } else if (WANTS_CATEGORIES.includes(e.category)) {
      wantsTotal += e.amount;
    } else {
      needsTotal += e.amount;
    }
  });

  const baseBudget = monthlyBudget > 0 ? monthlyBudget : 1500;

  // Calcul des vrais pourcentages par rapport au budget mensuel global (ex: 3050 €)
  const needsPercent = Math.round((needsTotal / baseBudget) * 100);
  const wantsPercent = Math.round((wantsTotal / baseBudget) * 100);

  // Ce qu'il reste du budget pour l'épargne (ou 0 si dépassement total)
  const remainingForSavings = Math.max(0, baseBudget - (needsTotal + wantsTotal));
  const savingsPercent = Math.max(0, 100 - needsPercent - wantsPercent);

  return {
    needs: {
      value: Number(needsTotal.toFixed(2)),
      percentage: needsPercent,
      color: CHART_COLORS.needs,
      targetPercent: 50,
    },
    wants: {
      value: Number(wantsTotal.toFixed(2)),
      percentage: wantsPercent,
      color: CHART_COLORS.wants,
      targetPercent: 30,
    },
    savings: {
      value: Number(remainingForSavings.toFixed(2)),
      percentage: savingsPercent,
      color: CHART_COLORS.savings,
      targetPercent: 20,
    },
  };
}
