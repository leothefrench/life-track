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
        <Button className="rounded-full shadow-lg">
          <Plus className="h-4 w-4" />
          Dépense
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
        <ExpenseForm />
      </DialogContent>
    </Dialog>
  );
}
