'use server'; 

import { auth } from '@/auth';
import { prisma } from '@life-track/db';
import { DeleteExpenseSchema, ExpenseSchema } from '@life-track/shared';
import { revalidatePath } from 'next/cache';

export async function createExpense(formData: FormData) {

  const session = await auth();
  if (!session?.user?.id) throw new Error('Non autorisé');

  const rawData = {
    title: formData.get('title'),
    amount: Number(formData.get('amount')),
    category: formData.get('category'),
    date: new Date(),
  };

  const validatedData = ExpenseSchema.parse(rawData);

  await prisma.expense.create({
    data: {
      ...validatedData,
      userId: session.user.id,
    },
  });

  revalidatePath('/');
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
  if (!session?.user?.id) throw new Error("Non autorisé");

  const rawData = {
    title: formData.get("title"),
    amount: Number(formData.get("amount")),
    category: formData.get("category"),
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

  revalidatePath("/dashboard");
}
import { Parser } from 'json2csv';

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