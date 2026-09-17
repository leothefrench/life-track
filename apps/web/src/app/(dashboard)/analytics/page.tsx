import { auth } from '@/auth';
import { prisma } from '@life-track/db';
import { AnalyticsView } from '@/components/analytics/analytics-view';
import {
  calculateBurnRate,
  calculateMonthlyTrends,
  calculateBudgetRuleSplit,
  RawExpense,
} from '@/components/analytics/analytics.utils';

export default async function AnalyticsPage() {
  const session = await auth();
  const userId = session?.user?.id;

  // 1. Récupération de l'utilisateur, de son statut Pro et de son vrai budget personnalisé en base
  const user = userId
    ? await prisma.user.findUnique({
        where: { id: userId },
        select: { isPremium: true, monthlyBudget: true },
      })
    : null;

  const isPremium = user?.isPremium || false;
  // Si l'utilisateur n'a pas encore défini de budget, 1500 € par défaut
  const monthlyBudget = user?.monthlyBudget || 1500;

  // 2. Récupération des dépenses des 60 derniers jours
  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

  const expensesData = userId
    ? await prisma.expense.findMany({
        where: {
          userId,
          date: { gte: sixtyDaysAgo },
        },
        select: {
          amount: true,
          date: true,
          category: true,
        },
        orderBy: { date: 'asc' },
      })
    : [];

  const rawExpenses: RawExpense[] = expensesData.map((e) => ({
    amount: e.amount,
    date: e.date,
    category: e.category,
  }));

  // 3. Calculs financiers réels basés sur le budget PostgreSQL de l'utilisateur
  const burnRateData = calculateBurnRate(rawExpenses, monthlyBudget);
  const trendData = calculateMonthlyTrends(rawExpenses);
  const ruleSplitRaw = calculateBudgetRuleSplit(rawExpenses);

  return (
    <AnalyticsView
      isPremium={isPremium}
      burnRateData={burnRateData}
      trendData={trendData}
      ruleSplitRaw={ruleSplitRaw}
    />
  );
}
