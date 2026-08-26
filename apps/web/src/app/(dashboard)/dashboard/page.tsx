import { prisma } from '@life-track/db';
import { auth } from '@/auth';
import { AddExpenseDialog } from '@/components/add-expense-dialog';
import { DashboardStats } from '@/components/dashboard-stats';
import { ExpenseList } from '@/components/expense-list';
import { PlaidLink } from '@/components/plaid-link';
import { SyncButton } from '@/components/sync-button';
import { InsightCards } from '@/components/insight-cards';
import { WelcomeState } from '@/components/welcome-state';
import { DashboardHeader } from '@/components/dashboard-header';

interface CategoryResult {
  category:
    | 'LOGEMENT'
    | 'ENERGIE'
    | 'ALIMENTATION'
    | 'TRANSPORT'
    | 'ABONNEMENTS'
    | 'LOISIRS'
    | 'SANTE'
    | 'AUTRE';
  _sum: { amount: number | null };
}

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;

  // 1. DATA FETCHING (Serveur)
  const user = userId
    ? await prisma.user.findUnique({
        where: { id: userId },
        include: { bankConnections: true },
      })
    : null;

  const isPremium = user?.isPremium || false;
  const isBankConnected = (user?.bankConnections?.length || 0) > 0;

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const expenses = userId
    ? await prisma.expense.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
      })
    : [];
  const totalStats = userId
    ? await prisma.expense.aggregate({
        where: { userId, date: { gte: thirtyDaysAgo } },
        _sum: { amount: true },
      })
    : null;
  const categoriesData = userId
    ? await prisma.expense.groupBy({
        by: ['category'],
        where: { userId, date: { gte: thirtyDaysAgo } },
        _sum: { amount: true },
      })
    : [];

  // On récupère les audits de l'IA (Insights) qui n'ont pas été ignorés
  const insights = userId
    ? await prisma.insight.findMany({
        where: { userId, isDismissed: false },
        orderBy: { createdAt: 'desc' },
        take: 5,
      })
    : [];

  // 2. TRANSFORMATIONS
  const totalSpent = totalStats?._sum.amount || 0;
  const chartData = (categoriesData as unknown as CategoryResult[]).map(
    (item) => ({
      category: item.category,
      amount: item._sum.amount || 0,
    }),
  );

  const dailyExpenses: { amount: number; date: Date; category: any }[] = userId
    ? await prisma.expense.findMany({
        where: { userId, date: { gte: thirtyDaysAgo } },
        select: { amount: true, date: true, category: true },
      })
    : [];

  const last30DaysData = Array.from({ length: 30 })
    .map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayExp = dailyExpenses.filter(
        (e) => new Date(e.date).toDateString() === d.toDateString(),
      );
      return {
        day: d.toLocaleDateString('default', {
          day: 'numeric',
          month: 'numeric',
        }),
        LOGEMENT: dayExp
          .filter((e) => e.category === 'LOGEMENT')
          .reduce((sum, e) => sum + e.amount, 0),
        ENERGIE: dayExp
          .filter((e) => e.category === 'ENERGIE')
          .reduce((sum, e) => sum + e.amount, 0),
        ALIMENTATION: dayExp
          .filter((e) => e.category === 'ALIMENTATION')
          .reduce((sum, e) => sum + e.amount, 0),
        TRANSPORT: dayExp
          .filter((e) => e.category === 'TRANSPORT')
          .reduce((sum, e) => sum + e.amount, 0),
        ABONNEMENTS: dayExp
          .filter((e) => e.category === 'ABONNEMENTS')
          .reduce((sum, e) => sum + e.amount, 0),
        LOISIRS: dayExp
          .filter((e) => e.category === 'LOISIRS')
          .reduce((sum, e) => sum + e.amount, 0),
        SANTE: dayExp
          .filter((e) => e.category === 'SANTE')
          .reduce((sum, e) => sum + e.amount, 0),
        AUTRE: dayExp
          .filter((e) => e.category === 'AUTRE')
          .reduce((sum, e) => sum + e.amount, 0),
      };
    })
    .reverse();

  // 3. RENDU
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center justify-between mb-8">
        {/* BLOC TITRE AVEC IDENTITÉ UTILISATEUR */}
        <DashboardHeader user={session?.user} isPremium={isPremium} />

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
          {/* 1. Bouton Banque (Sync ou Plaid) pour les utilisateurs PRO */}
          {isPremium && (isBankConnected ? <SyncButton /> : <PlaidLink />)}

          {/* 2. Bouton Dépense */}
          <AddExpenseDialog />
        </div>
      </div>

      {expenses.length > 0 ? (
        <>
          <DashboardStats
            totalSpent={totalSpent}
            last30DaysData={last30DaysData}
            chartData={chartData}
            isPremium={isPremium}
            expensesCount={expenses.length}
          />
          <InsightCards insights={insights} />
          <ExpenseList expenses={expenses} />
        </>
      ) : (
        <WelcomeState isPremium={isPremium} isBankConnected={isBankConnected} />
      )}
    </div>
  );
}