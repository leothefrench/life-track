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