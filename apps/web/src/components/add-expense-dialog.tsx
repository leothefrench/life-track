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

export function AddExpenseDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-9 rounded-lg bg-rose-600 hover:bg-rose-700 text-white border-none shadow-lg shadow-rose-500/10 text-[10px] font-bold uppercase tracking-wider px-4 flex items-center justify-center gap-2 transition-colors">
          <Plus className="h-3.5 w-3.5" />
          <span>Dépense</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter une dépense</DialogTitle>
          <DialogDescription>
            Remplissez les détails ci-dessous. Cliquez sur enregistrer une fois
            terminé.
          </DialogDescription>
        </DialogHeader>
        <ExpenseForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
