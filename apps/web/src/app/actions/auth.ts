'use server';

import { prisma } from '@life-track/db';
import { RegisterSchema } from '@life-track/shared';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';

export async function registerUser(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const validation = RegisterSchema.safeParse({ name, email, password });

  if (!validation.success) {
    const firstError = validation.error.issues[0].message;
    throw new Error(firstError);
  }

  const validatedData = validation.data;

  const existingUser = await prisma.user.findUnique({
    where: { email: validatedData.email },
  });

  if (existingUser) {
    throw new Error('Cet email est déjà utilisé.');
  }

  const hashedPassword = await bcrypt.hash(validatedData.password, 12);

  await prisma.user.create({
    data: {
      name: validatedData.name,
      email: validatedData.email,
      password: hashedPassword,
    },
  });

  redirect('/login?registered=true');
}
