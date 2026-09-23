'use server';

import { auth } from '@/auth';
import { prisma } from '@life-track/db';
import { DeleteExpenseSchema, ExpenseSchema } from '@life-track/shared';
import { revalidatePath } from 'next/cache';
import { Parser } from 'json2csv';

export async function createExpense(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Non autorisé');

  const userId = session.user.id;

  // 1. PROTECTION VITESSE : Max 10 créations par minute pour éviter les attaques de scripts
  const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
  const recentCount = await prisma.expense.count({
    where: {
      userId,
      createdAt: { gte: oneMinuteAgo },
    },
  });

  if (recentCount >= 10) {
    throw new Error('Trop de requêtes. Veuillez patienter une minute.');
  }

  // 2. PROTECTION QUOTA GRATUIT : Plafond pour protéger le stockage de la base
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isPremium: true },
  });

  if (!user?.isPremium) {
    const totalExpenses = await prisma.expense.count({
      where: { userId },
    });

    const FREE_LIMIT = 150; // Largement suffisant pour plusieurs mois d'usage gratuit normal
    if (totalExpenses >= FREE_LIMIT) {
      throw new Error(
        `Limite atteinte (${FREE_LIMIT} dépenses max en version gratuite). Passez à la version Premium pour un stockage illimité.`,
      );
    }
  }

  const rawData = {
    title: formData.get('title'),
    amount: Number(formData.get('amount')),
    category: formData.get('category'),
    isSubscription:
      formData.get('isSubscription') === 'on' ||
      formData.get('isSubscription') === 'true',
    date: new Date(),
  };

  const validatedData = ExpenseSchema.parse(rawData);

  await prisma.expense.create({
    data: {
      ...validatedData,
      userId,
    },
  });

  revalidatePath('/');
  revalidatePath('/dashboard');
}

export async function deleteExpense(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Non autorisé');

  const rawId = formData.get('id');

  const { id } = DeleteExpenseSchema.parse({ id: rawId });

  await prisma.expense.delete({
    where: {
      id: id,
      userId: session.user.id,
    },
  });

  revalidatePath('/dashboard');
}

export async function updateExpense(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Non autorisé');

  const rawData = {
    title: formData.get('title'),
    amount: Number(formData.get('amount')),
    category: formData.get('category'),
    isSubscription:
      formData.get('isSubscription') === 'on' ||
      formData.get('isSubscription') === 'true',
    date: new Date(),
  };

  const validatedData = ExpenseSchema.parse(rawData);

  await prisma.expense.update({
    where: {
      id: id,
      userId: session.user.id,
    },
    data: validatedData,
  });

  revalidatePath('/dashboard');
}

export async function exportExpensesAction() {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Non autorisé');

  const expenses = await prisma.expense.findMany({
    where: { userId: session.user.id },
    orderBy: { date: 'desc' },
  });

  const fields = ['title', 'amount', 'category', 'date'];
  const opts = { fields };

  try {
    const parser = new Parser(opts);
    const csv = parser.parse(expenses);

    return { success: true, data: csv };
  } catch (err) {
    console.error(err);
    return { success: false, error: 'Erreur lors de la génération du fichier' };
  }
}

export async function getExpensesCSV() {
  const result = await exportExpensesAction();
  return result.success ? result.data : null;
}
