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
import { WelcomeState } from '@/components/welcome-state';

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
        include: { bankConnections: true }, // On demande à voir s'il y a une banque liée
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

  // 1. On récupère les audits de l'IA (Insights) qui n'ont pas été ignorés
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
        day: d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'numeric' }),
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

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
          {/* 1. Bouton Banque (Sync ou Plaid) */}
          {isPremium && (isBankConnected ? <SyncButton /> : <PlaidLink />)}

          {/* 2. Formulaire Abonnement */}
          {isPremium && (
            <form
              action={createCustomerPortalSession}
              className="w-full sm:w-auto"
            >
              <Button
                variant="outline"
                size="sm"
                type="submit"
                aria-label="Gérer mon abonnement Stripe"
                className="h-9 w-full sm:w-auto rounded-lg border-white/10 bg-white/5 text-white/70 text-[10px] font-bold uppercase tracking-wider px-4"
              >
                Abonnement
              </Button>
            </form>
          )}

          {/* 3. Bouton Dépense */}
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
