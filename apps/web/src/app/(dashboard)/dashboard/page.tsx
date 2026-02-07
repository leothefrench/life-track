import { prisma } from '@life-track/db';
import { auth } from '@/auth';
import { AddExpenseDialog } from '@/components/add-expense-dialog';
import { ExpenseChart } from '@/components/expense-chart';
import { ExportButton } from '@/components/export-button';
import { ExpenseActions } from '@/components/expense-actions';
import { Card, CardContent } from '@/components/ui/card';
import { createCheckoutSession } from '@/app/actions/stripe';
import { Button } from '@/components/ui/button';
import { createCustomerPortalSession } from '@/app/actions/stripe';

const CATEGORY_STYLES: Record<string, string> = {
  LOYER: 'bg-blue-500/10 text-blue-500 border-blue-500/20', // Correspond à --chart-1
  NOURRITURE: 'bg-green-500/10 text-green-500 border-green-500/20', // Correspond à --chart-2
  VETEMENTS: 'bg-orange-500/10 text-orange-500 border-orange-500/20', // Correspond à --chart-3
  LOISIRS: 'bg-purple-500/10 text-purple-500 border-purple-500/20', // Correspond à --chart-4
  AUTRE: 'bg-rose-500/10 text-rose-500 border-rose-500/20', // Correspond à --chart-5
};

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const user = userId
    ? await prisma.user.findUnique({ where: { id: userId } })
    : null;
  const isPremium = user?.isPremium || false;

  const expenses = userId
    ? await prisma.expense.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
      })
    : [];

  const stats = userId
    ? await prisma.expense.aggregate({
        where: { userId },
        _sum: { amount: true },
      })
    : null;

  const totalSpent = stats?._sum.amount || 0;

  const categoriesData = userId
    ? await prisma.expense.groupBy({
        by: ['category'],
        where: { userId },
        _sum: { amount: true },
      })
    : [];

  const chartData = categoriesData.map((item) => ({
    category: item.category,
    amount: item._sum.amount || 0,
  }));

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight inline-flex items-center gap-3">
            Dashboard
            {/* Petit badge de rappel si Premium */}
            {isPremium && (
              <span className="text-[10px] bg-amber-400/20 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">
                Pro
              </span>
            )}
          </h1>
          <p className="text-muted-foreground text-sm">
            Suivi de vos dépenses.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* BOUTON DE GESTION STRIPE (Apparaît seulement si Premium) */}
          {isPremium && (
            <form action={createCustomerPortalSession}>
              <Button
                variant="outline"
                size="sm"
                type="submit"
                className="h-8 text-[10px] font-bold uppercase tracking-wider"
              >
                Gérer mon abonnement
              </Button>
            </form>
          )}
          <AddExpenseDialog />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card/40 border-border/50 shadow-none h-full flex flex-col items-center justify-center text-center">
          <CardContent className="p-6">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
              Total dépensé
            </p>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-4xl font-bold tracking-tight text-rose-500">
                {totalSpent.toFixed(2)}
              </span>
              <span className="text-xl font-medium text-muted-foreground">
                €
              </span>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2 relative group overflow-hidden rounded-xl border border-border/50 bg-card/20 h-full flex items-center justify-center">
          <div
            className={
              !isPremium
                ? 'blur-[1.5px] opacity-70 pointer-events-none select-none w-full'
                : 'w-full'
            }
          >
            <ExpenseChart data={chartData} />
          </div>
          {!isPremium && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <div className="bg-background/90 p-6 rounded-2xl border border-border/50 shadow-2xl backdrop-blur-md">
                <p className="font-bold text-sm mb-1 text-foreground">
                  Analyses Premium
                </p>
                <p className="text-[10px] text-muted-foreground mb-4">
                  Débloquez la répartition par catégorie.
                </p>
                <form action={createCheckoutSession}>
                  <Button
                    type="submit"
                    size="sm"
                    className="rounded-full px-6 shadow-lg shadow-blue-500/20 bg-blue-600 text-white"
                  >
                    Passer Premium — 5€
                  </Button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Historique
          </h3>
          <ExportButton />
        </div>
        <div className="divide-y divide-border/20 border rounded-xl overflow-hidden bg-card/20">
          {expenses.map((expense) => (
            <div
              key={expense.id}
              className="flex justify-between items-center p-3 hover:bg-card/40 transition-colors"
            >
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium leading-none">
                  {expense.title}
                </p>
                <span
                  className={`text-[8px] px-1.5 py-0.5 rounded uppercase font-extrabold w-fit border ${
                    CATEGORY_STYLES[expense.category] || CATEGORY_STYLES.AUTRE
                  }`}
                >
                  {expense.category}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-bold text-sm">
                    {expense.amount.toFixed(2)} €
                  </p>
                  <p className="text-[9px] text-muted-foreground uppercase">
                    {new Date(expense.date).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: 'short',
                    })}
                  </p>
                </div>
                <ExpenseActions expense={expense} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
