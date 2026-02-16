'use server';

import { prisma } from '@life-track/db';
import { RegisterSchema } from '@life-track/shared';
import { generatePasswordResetToken } from '@/lib/tokens';
import { sendPasswordResetEmail } from '@/lib/mail';
import bcrypt from 'bcryptjs';

export const resetPasswordAction = async (formData: FormData) => {
  const email = formData.get('email') as string;

  if (!email) return { error: 'Email requis' };

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (!existingUser) {
    return { success: 'Si ce compte existe, un email a été envoyé.' };
  }

  const passwordResetToken = await generatePasswordResetToken(email);

  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token,
  );

  return { success: 'Email de réinitialisation envoyé !' };
};

export const newPasswordAction = async (
  formData: FormData,
  token: string | null,
) => {
  if (!token) return { error: 'Jeton manquant !' };

  const password = formData.get('password') as string;

  const validatedFields = RegisterSchema.pick({ password: true }).safeParse({
    password,
  });
  if (!validatedFields.success)
    return { error: 'Mot de passe invalide (min 8 car.)' };

  const existingToken = await prisma.passwordResetToken.findUnique({
    where: { token },
  });

  if (!existingToken) return { error: 'Jeton invalide !' };

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) return { error: 'Le jeton a expiré !' };

  const existingUser = await prisma.user.findUnique({
    where: { email: existingToken.email },
  });

  if (!existingUser) return { error: "L'email n'existe pas !" };

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: existingUser.id },
      data: { password: hashedPassword },
    }),
    prisma.passwordResetToken.delete({
      where: { id: existingToken.id },
    }),
  ]);

  return { success: 'Mot de passe mis à jour !' };
};
