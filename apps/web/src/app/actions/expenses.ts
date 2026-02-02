'use server'; 

import { auth } from '@/auth';
import { prisma } from '@life-track/db';
import { ExpenseSchema } from '@life-track/shared';
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
