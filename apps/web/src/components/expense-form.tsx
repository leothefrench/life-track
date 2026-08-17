'use client';

import { createExpense, updateExpense } from '@/app/actions/expenses';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { toast } from 'sonner';
import { Expense } from '@life-track/shared';
import { useI18n } from '@/lib/i18n/i18n-context';

interface ExpenseformProps {
  onSuccess?: () => void;
  initialData?: Expense;
}

export function ExpenseForm({ onSuccess, initialData }: ExpenseformProps) {
  const [loading, setLoading] = useState(false);
  const { t } = useI18n();

  async function clientAction(formData: FormData) {
    setLoading(true);
    try {
      if (initialData) {
        await updateExpense((initialData as any).id, formData);
        toast.success(t('expense_updated'));
      } else {
        await createExpense(formData);
        toast.success(t('expense_added'));
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error(t('error'));
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {initialData ? t('edit_expense') : t('new_expense')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={clientAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">{t('description')}</Label>
            <Input
              id="title"
              name="title"
              defaultValue={initialData?.title}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">{t('amount')}</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              defaultValue={initialData?.amount}
              placeholder="0.00"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">{t('category')}</Label>
            <Select
              name="category"
              defaultValue={initialData?.category}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder={t('choose_category')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOGEMENT">{t('cat_housing')}</SelectItem>
                <SelectItem value="ENERGIE">{t('cat_energy')}</SelectItem>
                <SelectItem value="ALIMENTATION">{t('cat_food')}</SelectItem>
                <SelectItem value="TRANSPORT">{t('cat_transport')}</SelectItem>
                <SelectItem value="ABONNEMENTS">
                  {t('cat_subscriptions')}
                </SelectItem>
                <SelectItem value="LOISIRS">{t('cat_leisure')}</SelectItem>
                <SelectItem value="SANTE">{t('cat_health')}</SelectItem>
                <SelectItem value="AUTRE">{t('cat_other')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t('saving') : initialData ? t('save') : t('add_expense')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
