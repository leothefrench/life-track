import { prisma } from '@life-track/db';
import { auth } from '@/auth';
import { AddExpenseDialog } from '@/components/add-expense-dialog';
import { DashboardStats } from '@/components/dashboard-stats';
import { ExpenseList } from '@/components/expense-list';
import { createCustomerPortalSession } from '@/app/actions/stripe';
import { Button } from '@/components/ui/button';
import { PlaidLink } from '@/components/plaid-link';
import { SyncButton } from '@/components/sync-button';
import { InsightCards } from '@/components/insight-cards';

interface CategoryResult {
  category: 'LOYER' | 'NOURRITURE' | 'VETEMENTS' | 'LOISIRS' | 'AUTRE';
  _sum: { amount: number | null };
}

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;

  // 1. DATA FETCHING (Serveur)
  const user = userId
    ? await prisma.user.findUnique({
        where: { id: userId },
        include: { bankConnections: true }, // On demande à voir s'il y a une banque liée
      })
    : null;

  const isPremium = user?.isPremium || false;
  const isBankConnected = (user?.bankConnections?.length || 0) > 0;

  const expenses = userId
    ? await prisma.expense.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
      })
    : [];
  const totalStats = userId
    ? await prisma.expense.aggregate({
        where: { userId },
        _sum: { amount: true },
      })
    : null;
  const categoriesData = userId
    ? await prisma.expense.groupBy({
        by: ['category'],
        where: { userId },
        _sum: { amount: true },
      })
    : [];

  // 1. On récupère les audits de l'IA (Insights) qui n'ont pas été ignorés
  const insights = userId
    ? await prisma.insight.findMany({
        where: { userId, isDismissed: false },
        orderBy: { createdAt: 'desc' },
        take: 3,
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

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const dailyExpenses = userId
    ? await prisma.expense.findMany({
        where: { userId, date: { gte: sevenDaysAgo } },
        select: { amount: true, date: true, category: true },
      })
    : [];

  const last7DaysData = Array.from({ length: 7 })
    .map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayExp = dailyExpenses.filter(
        (e) => new Date(e.date).toDateString() === d.toDateString(),
      );
      return {
        day: d.toLocaleDateString('fr-FR', { weekday: 'short' }),
        LOYER: dayExp
          .filter((e) => e.category === 'LOYER')
          .reduce((sum, e) => sum + e.amount, 0),
        NOURRITURE: dayExp
          .filter((e) => e.category === 'NOURRITURE')
          .reduce((sum, e) => sum + e.amount, 0),
        VETEMENTS: dayExp
          .filter((e) => e.category === 'VETEMENTS')
          .reduce((sum, e) => sum + e.amount, 0),
        LOISIRS: dayExp
          .filter((e) => e.category === 'LOISIRS')
          .reduce((sum, e) => sum + e.amount, 0),
        AUTRE: dayExp
          .filter((e) => e.category === 'AUTRE')
          .reduce((sum, e) => sum + e.amount, 0),
      };
    })
    .reverse();

  // 3. RENDU (Lisible en un coup d'oeil)
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center justify-between mb-8">
        {/* BLOC TITRE */}
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight inline-flex items-center gap-3">
            Dashboard
            {isPremium && (
              <span className="text-[10px] bg-amber-400/20 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">
                Pro
              </span>
            )}
          </h1>
          <p className="text-muted-foreground text-xs md:text-sm">
            Suivi de vos dépenses et abonnements.
          </p>
        </div>

        {/* BLOC BOUTONS (Responsive) */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {isPremium && (isBankConnected ? <SyncButton /> : <PlaidLink />)}

          {isPremium && (
            <form action={createCustomerPortalSession}>
              <Button
                variant="outline"
                size="sm"
                type="submit"
                className="h-8 text-[10px] font-bold uppercase tracking-wider"
              >
                Abonnement
              </Button>
            </form>
          )}

          <AddExpenseDialog />
        </div>
      </div>

      <DashboardStats
        totalSpent={totalSpent}
        last7DaysData={last7DaysData}
        chartData={chartData}
        isPremium={isPremium}
      />

      <InsightCards insights={insights} />

      <ExpenseList expenses={expenses} />
    </div>
  );
}
