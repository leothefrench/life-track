'use client';

import { useState } from 'react';
import { MoreHorizontal, Trash2, Pencil, AlertTriangle } from 'lucide-react';
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
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { deleteExpense } from '@/app/actions/expenses';
import { toast } from 'sonner';
import { ExpenseForm } from './expense-form';
import { Expense } from '@life-track/shared';
import { useI18n } from '@/lib/i18n/i18n-context';

interface ExpenseActionsProps {
  expense: Expense;
}

export function ExpenseActions({ expense }: ExpenseActionsProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { t } = useI18n();

  const isRecurring = Boolean(expense.isSubscription);

  const confirmDelete = async () => {
    setIsDeleting(true);
    const formData = new FormData();
    formData.append('id', (expense as any).id);
    try {
      await deleteExpense(formData);
      toast.success(t('expense_deleted'));
      setShowDeleteDialog(false);
    } catch (error) {
      toast.error(t('error'));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Actions">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
            <Pencil className="mr-2 h-4 w-4" /> {t('edit')}
          </DropdownMenuItem>

          <DropdownMenuItem
            className="text-red-500 focus:text-red-500"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" /> {t('delete')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* MODALE D'ÉDITION */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('edit_expense')}</DialogTitle>
          </DialogHeader>
          <ExpenseForm
            initialData={expense}
            onSuccess={() => setShowEditDialog(false)}
          />
        </DialogContent>
      </Dialog>

      {/* MODALE DE CONFIRMATION DE SUPPRESSION MULTILINGUE */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              {isRecurring && (
                <div className="h-10 w-10 shrink-0 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                  <AlertTriangle className="h-5 w-5" />
                </div>
              )}
              <div>
                <DialogTitle className="text-base">
                  {t('delete_expense_title').replace('{title}', expense.title)}
                </DialogTitle>
                <DialogDescription className="text-xs sm:text-sm mt-1">
                  {isRecurring ? (
                    <span className="text-amber-300 font-medium block">
                      {t('delete_recurring_desc')}
                    </span>
                  ) : (
                    t('delete_expense_desc')
                  )}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <DialogFooter className="flex flex-row justify-end gap-2 sm:gap-0 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              {t('cancel')}
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? t('deleting') : t('confirm_delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
