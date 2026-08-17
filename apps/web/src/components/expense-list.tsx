'use client';

import { Expense } from '@life-track/shared';
import { ExpenseActions } from './expense-actions';
import { ExportButton } from './export-button';
import { useI18n } from '@/lib/i18n/i18n-context';

type ExpenseWithId = Expense & {
  id: string;
  date: Date;
};

const CATEGORY_STYLES: Record<string, string> = {
  LOGEMENT: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  ENERGIE: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  ALIMENTATION: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  TRANSPORT: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  ABONNEMENTS: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  LOISIRS: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  SANTE: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
  AUTRE: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
};

const CATEGORY_TRANSLATIONS: Record<string, string> = {
  LOGEMENT: 'cat_housing',
  ENERGIE: 'cat_energy',
  ALIMENTATION: 'cat_food',
  TRANSPORT: 'cat_transport',
  ABONNEMENTS: 'cat_subscriptions',
  LOISIRS: 'cat_leisure',
  SANTE: 'cat_health',
  AUTRE: 'cat_other',
};

export function ExpenseList({ expenses }: { expenses: any[] }) {
  const { t, language } = useI18n();

  const localeMap = {
    fr: 'fr-FR',
    en: 'en-US',
    de: 'de-DE',
    es: 'es-ES',
    pt: 'pt-PT',
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          {t('history_title')}
        </h2>
        <ExportButton />
      </div>
      <div className="divide-y divide-border/20 border rounded-xl overflow-hidden bg-card/20">
        {expenses.length === 0 ? (
          <p className="p-8 text-center text-muted-foreground italic">
            {t('no_data')}
          </p>
        ) : (
          expenses.map((expense: ExpenseWithId) => (
            <div
              key={expense.id}
              className="flex justify-between items-center p-3 hover:bg-card/40 transition-colors"
            >
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">{expense.title}</p>
                <span
                  className={`text-[8px] px-1.5 py-0.5 rounded uppercase font-extrabold w-fit border ${
                    CATEGORY_STYLES[expense.category] || CATEGORY_STYLES.AUTRE
                  }`}
                >
                  {t(
                    (CATEGORY_TRANSLATIONS[expense.category] ||
                      'cat_other') as any,
                  )}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-bold text-sm">
                    {expense.amount.toFixed(2)} €
                  </p>
                  <p className="text-[9px] text-muted-foreground uppercase">
                    {new Date(expense.date).toLocaleDateString(
                      localeMap[language] || 'fr-FR',
                      {
                        day: '2-digit',
                        month: 'short',
                      },
                    )}
                  </p>
                </div>
                <ExpenseActions expense={expense} />
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
