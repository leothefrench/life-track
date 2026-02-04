import { prisma } from '@life-track/db';
import { auth } from '@/auth';
import { Card, CardContent } from '@/components/ui/card';
import { ExpenseActions } from '@/components/expense-actions';
import { ExpenseChart } from '@/components/expense-chart';
import { Button } from '@/components/ui/button';

const CATEGORY_STYLES: Record<string, string> = {
  LOYER: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  NOURRITURE: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  VETEMENTS: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  LOISIRS: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  AUTRE: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
};

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;

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

  const totalSpent = stats?._sum.amount ?? 0;

  const categoriesData = userId
    ? await prisma.expense.groupBy({
        by: ['category'],
        where: { userId },
        _sum: {
          amount: true,
        },
      })
    : [];

  const chartData = categoriesData.map((item) => ({
    category: item.category,
    amount: item._sum.amount || 0,
    // On utilise une variable CSS pour la couleur, on la liera plus tard
    fill: `var(--color-${item.category.toLowerCase()})`,
  }));

  const isPremium = false;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CARTE TOTAL - Centrage vertical et horizontal parfait */}
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

        {/* BLOC GRAPHIQUE - Visibilité augmentée (70%) pour voir le donut */}
        <div className="md:col-span-2 relative group overflow-hidden rounded-xl border border-border/50 bg-card/20 h-full flex items-center justify-center">
          {/* Opacité à 70% : on voit très bien les couleurs néon maintenant */}
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
                <Button
                  size="sm"
                  className="rounded-full px-6 shadow-lg shadow-blue-500/20"
                >
                  Passer Premium — 5€
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <section className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Historique
        </h3>

        <div className="divide-y divide-border/20 border rounded-xl overflow-hidden bg-card/20">
          {expenses.length === 0 ? (
            <p className="p-8 text-center text-muted-foreground italic">
              Aucune donnée
            </p>
          ) : (
            expenses.map((expense) => (
              <div
                key={expense.id}
                className="flex justify-between items-center p-3 hover:bg-card/40 transition-colors"
              >
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium leading-none text-foreground/90">
                    {expense.title}
                  </p>
                  <span
                    className={`text-[8px] px-1.5 py-0.5 rounded uppercase font-extrabold border w-fit ${
                      CATEGORY_STYLES[expense.category] || CATEGORY_STYLES.AUTRE
                    }`}
                  >
                    {expense.category}
                  </span>
                </div>
                <div className="text-right flex flex-col items-end">
                  <p className="font-bold text-sm tabular-nums">
                    {expense.amount.toFixed(2)} €
                  </p>
                  <p className="text-[9px] text-muted-foreground uppercase opacity-60">
                    {new Date(expense.date).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: 'short',
                    })}
                  </p>
                </div>
                <div className="ml-2">
                  <ExpenseActions expense={expense} />
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
