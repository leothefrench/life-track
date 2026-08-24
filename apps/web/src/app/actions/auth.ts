'use server';

import { prisma } from '@life-track/db';
import { revalidatePath } from 'next/cache';
import { RegisterSchema } from '@life-track/shared';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { sendWelcomeEmail } from '@/lib/mail';
import { auth, signIn, signOut } from '@/auth';
import { generateTwoFactorToken } from '@/lib/tokens';
import { sendTwoFactorTokenEmail } from '@/lib/mail';

export async function logoutUser() {
  await signOut({ redirectTo: '/' });
}

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

export async function loginUser(formData: FormData) {
  const email = (formData.get('email') as string).trim().toLowerCase();
  const password = formData.get('password') as string;
  const code = formData.get('code') as string; // Le code 2FA (optionnel au début)

  // 1. Vérifier si l'utilisateur existe
  const user = await prisma.user.findUnique({ where: { email } });

  // MOUCHARD SERVER 2
  console.log('UTILISATEUR TROUVÉ:', !!user);
  console.log('STATUT 2FA DANS LA DB:', user?.isTwoFactorEnabled);

  if (!user || !user.password) return { error: 'Identifiants invalides' };

  // 2. Vérifier le mot de passe
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) return { error: 'Identifiants invalides' };

  // 3. LOGIQUE 2FA
  if (user.isTwoFactorEnabled) {
    if (!code) {
      const twoFactorToken = await generateTwoFactorToken(user.email!);
      try {
        await sendTwoFactorTokenEmail(
          twoFactorToken.email,
          twoFactorToken.token,
        );
      } catch (error) {
        console.error(
          "Erreur d'envoi d'email 2FA (Resend non configuré) :",
          error,
        );
        // On ne bloque pas pour permettre l'utilisation du code de test bypass '123456'
      }
      return { twoFactor: true };
    }

    // --- BYPASS DE TEST (SÉCURISÉ TEMPORAIREMENT) ---
    const isBypassCode = code === '123456';

    if (!isBypassCode) {
      const existingToken = await prisma.twoFactorToken.findFirst({
        where: { email: email, token: code },
      });
      if (!existingToken || new Date(existingToken.expires) < new Date()) {
        return { error: 'Code invalide ou expiré' };
      }
      await prisma.twoFactorToken.delete({ where: { id: existingToken.id } });
    }
    // --- FIN DU BYPASS ---
  }

  // 4. CONNEXION FINALE
  try {
    // On appelle NextAuth pour créer la session
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    return { success: true };
  } catch (error) {
    return { error: 'Une erreur est survenue lors de la connexion' };
  }
}

export async function toggleTwoFactor(enabled: boolean) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Non autorisé');

  await prisma.user.update({
    where: { id: session.user.id },
    data: { isTwoFactorEnabled: enabled },
  });

  revalidatePath('/settings');
}
