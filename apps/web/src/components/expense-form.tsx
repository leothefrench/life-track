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

interface ExpenseformProps {
  onSuccess?: () => void;
  initialData?: Expense;
}

export function ExpenseForm({ onSuccess, initialData }: ExpenseformProps) {
  const [loading, setLoading] = useState(false);

  async function clientAction(formData: FormData) {
    setLoading(true);
    try {
      if (initialData) {
        await updateExpense(initialData.id!, formData);
        toast.success('Dépense mise à jour avec succès !');
      } else {
      await createExpense(formData);
      toast.success('Dépense ajoutée avec succès !');
      }

      if (onSuccess) {
        onSuccess();
      }
     } catch (error) {
      toast.error("Une erreur est survenue lors de l'ajout de la dépense.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
return (
  <Card>
    <CardHeader>
      <CardTitle>{initialData ? "Modifier la dépense" : "Nouvelle dépense"}</CardTitle>
    </CardHeader>
    <CardContent>
      <form action={clientAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Description</Label>
          <Input
            id="title"
            name="title"
            defaultValue={initialData?.title}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="amount">Montant (€)</Label>
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
          <Label htmlFor="category">Catégorie</Label>
            <Select name="category" defaultValue={initialData?.category} required>
            <SelectTrigger>
              <SelectValue placeholder="Choisir une catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NOURRITURE">Nourriture</SelectItem>
              <SelectItem value="LOYER">Loyer</SelectItem>
              <SelectItem value="VETEMENTS">Vêtements</SelectItem>
              <SelectItem value="LOISIRS">Loisirs</SelectItem>
              <SelectItem value="AUTRE">Autre</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading 
            ? 'Enregistrement...' 
            : (initialData ? 'Enregistrer les modifications' : 'Ajouter la dépense')
          }
        </Button>
      </form>
    </CardContent>
  </Card>
)}