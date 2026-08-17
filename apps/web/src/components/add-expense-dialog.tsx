'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ExpenseForm } from '@/components/expense-form';
import { useI18n } from '@/lib/i18n/i18n-context';

export function AddExpenseDialog() {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-9 rounded-lg bg-rose-600 hover:bg-rose-700 text-white border-none shadow-lg shadow-rose-500/10 text-[10px] font-bold uppercase tracking-wider px-4 flex items-center justify-center gap-2 transition-colors">
          <Plus className="h-3.5 w-3.5" />
          <span>{t('add_expense')}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('add_expense_dialog_title')}</DialogTitle>
          <DialogDescription>
            {t('add_expense_dialog_desc')}
          </DialogDescription>
        </DialogHeader>
        <ExpenseForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
