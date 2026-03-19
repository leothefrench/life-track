'use server';

import { prisma } from '@life-track/db';
import { RegisterSchema } from '@life-track/shared';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { sendWelcomeEmail } from '@/lib/mail';

export async function registerUser(formData: FormData) {
  const name = formData.get('name') as string;
  const email = (formData.get('email') as string).trim().toLowerCase();
  const password = (formData.get('password') as string).trim();

  const validation = RegisterSchema.safeParse({ name, email, password });

  // AU LIEU DE THROW, ON FAIT UN RETURN
  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }

  const validatedData = validation.data;

  const existingUser = await prisma.user.findUnique({
    where: { email: validatedData.email },
  });

  if (existingUser) {
    return { error: 'Cet email est déjà utilisé.' };
  }

  const hashedPassword = await bcrypt.hash(validatedData.password, 12);

  await prisma.user.create({
    data: {
      name: validatedData.name,
      email: validatedData.email,
      password: hashedPassword,
    },
  });

  // ENVOI DU MAIL DE BIENVENUE
  try {
    await sendWelcomeEmail(validatedData.email, validatedData.name);
  } catch (error) {
    console.error('Erreur envoi mail bienvenue:', error);
    // On ne bloque pas l'inscription si le mail échoue
  }

  // Le redirect doit toujours être à la fin, hors de tout bloc logique
  redirect('/login?registered=true');
}