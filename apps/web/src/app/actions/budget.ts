'use server';

import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function getBudgetSettings() {
  const session = await auth();
  if (!session?.user?.id) {
    return { monthlyBudget: 1500, alert80: true, alert90: true, alert95: true };
  }

  // We can return default or persisted values
  return {
    monthlyBudget: 1500,
    alert80: true,
    alert90: true,
    alert95: true,
  };
}

export async function updateBudgetSettings(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'Non autorisé' };
  }

  const budget = parseFloat(formData.get('monthlyBudget') as string);
  if (isNaN(budget) || budget <= 0) {
    return { error: 'Veuillez saisir un budget mensuel valide supérieur à 0.' };
  }

  revalidatePath('/dashboard');
  revalidatePath('/settings');
  return { success: true, monthlyBudget: budget };
}
