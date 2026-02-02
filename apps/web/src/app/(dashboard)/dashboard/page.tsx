import { prisma } from '@life-track/db';
import { auth } from '@/auth';
import { AddExpenseDialog } from '@/components/add-expense-dialog';
import { Card, CardContent } from '@/components/ui/card';

export default async function DashboardPage() {
  const session = await auth();

  const expenses = session?.user?.id
    ? await prisma.expense.findMany({
        where: { userId: session.user.id },
        orderBy: { date: 'desc' },
      })
    : [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Suivi dépenses dépenses.</p>
        </div>
        <AddExpenseDialog />
      </div>

      <section className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Historique
        </h3>
        <div className="grid gap-3">
          {expenses.map((expense) => (
            <Card
              key={expense.id}
              className="bg-card/40 border-border/50 hover:bg-card/60 transition-all duration-200 shadow-none"
            >
              <CardContent className="py-3 px-4 flex justify-between items-center">
                {' '}
                {/* py-3 réduit la hauteur */}
                <div className="flex flex-col">
                  <p className="text-sm font-semibold leading-none mb-1.5">
                    {expense.title}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-500 uppercase font-bold border border-blue-500/20">
                      {expense.category}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-base tabular-nums">
                    {expense.amount.toFixed(2)} €
                  </p>{' '}
                  {/* text-base est plus petit que xl */}
                  <p className="text-[10px] text-muted-foreground font-medium uppercase opacity-70">
                    {new Date(expense.date).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: 'short',
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
