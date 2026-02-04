import { prisma } from '@life-track/db';
import { auth } from '@/auth';
import { Card, CardContent } from '@/components/ui/card';
import { ExpenseActions } from '@/components/expense-actions';

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

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card/40 border-border/50 shadow-none">
          <CardContent className="p-3 flex items-center justify-between h-12">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Total
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold tracking-tight text-rose-500">
                {totalSpent.toFixed(2)}
              </span>
              <span className="text-xs font-medium text-muted-foreground">
                €
              </span>
            </div>
          </CardContent>
        </Card>
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
