'use client';

import { useState } from 'react';
import { MoreHorizontal, Trash2, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { deleteExpense } from '@/app/actions/expenses';
import { toast } from 'sonner';
import { ExpenseForm } from './expense-form';
import { Expense } from '@life-track/shared';

interface ExpenseActionsProps {
  expense: Expense;
}

export function ExpenseActions({ expense }: ExpenseActionsProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);

  const handleDelete = async () => {
    const formData = new FormData();
   formData.append('id', (expense as any).id);
    try {
      await deleteExpense(formData);
      toast.success('Dépense supprimée');
    } catch (error) {
      toast.error('Erreur');
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            aria-label="Actions de la dépense"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
            <Pencil className="mr-2 h-4 w-4" /> Modifier
          </DropdownMenuItem>

          <DropdownMenuItem className="text-red-500" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" /> Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la dépense</DialogTitle>
          </DialogHeader>
          <ExpenseForm
            initialData={expense}
            onSuccess={() => setShowEditDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
