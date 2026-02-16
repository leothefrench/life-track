import { Expense } from "@life-track/shared";
import { ExpenseActions } from "./expense-actions";
import { ExportButton } from "./export-button";

const CATEGORY_STYLES: Record<string, string> = {
  LOYER: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
  NOURRITURE: 'bg-green-500/10 text-green-300 border-green-500/20',
  VETEMENTS: 'bg-orange-500/10 text-orange-300 border-orange-500/20',
  LOISIRS: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
  AUTRE: 'bg-rose-500/10 text-rose-300 border-rose-500/20',
};

export function ExpenseList({ expenses }: { expenses: Expense[] }) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Historique</h2>
        <ExportButton />
      </div>
      <div className="divide-y divide-border/20 border rounded-xl overflow-hidden bg-card/20">
        {expenses.length === 0 ? (
          <p className="p-8 text-center text-muted-foreground italic">Aucune donnée</p>
        ) : (
          expenses.map((expense: Expense) => (
            <div key={expense.id} className="flex justify-between items-center p-3 hover:bg-card/40 transition-colors">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">{expense.title}</p>
                <span className={`text-[8px] px-1.5 py-0.5 rounded uppercase font-extrabold w-fit border ${CATEGORY_STYLES[expense.category] || CATEGORY_STYLES.AUTRE}`}>
                  {expense.category}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-bold text-sm">{expense.amount.toFixed(2)} €</p>
                  <p className="text-[9px] text-muted-foreground uppercase">
                    {new Date(expense.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                  </p>
                </div>
                <ExpenseActions expense={expense} />
              </div>
            </div>
          )))}
      </div>
    </section>
  );
}