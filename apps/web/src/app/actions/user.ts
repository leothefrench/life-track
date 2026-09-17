'use server';

import { auth } from '@/auth';
import { prisma } from '@life-track/db';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export type DeleteAccountResult = {
  success: boolean;
  error?: string;
};

/**
 * Supprime le compte utilisateur avec vérification stricte :
 * Si l'utilisateur possède un abonnement actif ou s'il a résilié dans Stripe
 * mais qu'il lui reste du temps sur sa période payée (stripeCurrentPeriodEnd > Date.now()),
 * la suppression est formellement bloquée côté serveur pour préserver ses droits.
 */
export async function deleteUserAccount(): Promise<DeleteAccountResult> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        error: 'Non authentifié. Veuillez vous reconnecter.',
      };
    }

    const userId = session.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        stripeCustomerId: true,
        stripeSubscriptionId: true,
        stripeCurrentPeriodEnd: true,
      },
    });

    if (!user) {
      return {
        success: false,
        error: 'Utilisateur introuvable.',
      };
    }

    const now = new Date();

    const isPaidPeriodActive = Boolean(
      user.stripeCurrentPeriodEnd &&
        new Date(user.stripeCurrentPeriodEnd) > now,
    );

    if (isPaidPeriodActive) {
      const formattedDate = new Intl.DateTimeFormat('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date(user.stripeCurrentPeriodEnd!));

      return {
        success: false,
        error: `Impossible de supprimer votre compte : vous bénéficiez d'un abonnement en cours valable jusqu'au ${formattedDate}. Pour protéger vos droits d'accès sur le temps payé, la suppression sera possible uniquement à l'expiration de cette période.`,
      };
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Erreur lors de la suppression du compte:', error);
    return {
      success: false,
      error:
        'Une erreur technique est survenue lors de la suppression. Veuillez réessayer ou contacter le support.',
    };
  }
}

/**
 * Met à jour la langue de l'utilisateur :
 * 1. Dans PostgreSQL pour que la PWA mobile et toutes les sessions futures soient immédiatement synchronisées.
 * 2. Dans le cookie 'life_track_lang' pour que le rendu HTML soit instantané.
 */
export async function updateUserLanguage(lang: string) {
  try {
    const cookieStore = await cookies();
    cookieStore.set('life_track_lang', lang, {
      path: '/',
      maxAge: 31536000,
      sameSite: 'lax',
    });

    const session = await auth();

    if (!session?.user?.id) {
      return { success: true };
    }

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: { language: lang },
      select: { id: true, language: true },
    });

    console.log(
      '[i18n] Langue mise à jour avec succès dans PostgreSQL :',
      updated.language,
    );
    return { success: true };
  } catch (error) {
    console.error('[i18n] Erreur Prisma updateUserLanguage :', error);
    return { success: false };
  }
}

/**
 * Met à jour le budget mensuel de l'utilisateur dans PostgreSQL.
 * Synchronisé instantanément sur tous ses appareils (PC, Mobile PWA, Tablette).
 */
export async function updateUserMonthlyBudget(amount: number) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Non authentifié' };
    }

    if (isNaN(amount) || amount <= 0) {
      return { success: false, error: 'Montant invalide' };
    }

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: { monthlyBudget: amount },
      select: { id: true, monthlyBudget: true },
    });

    return { success: true, monthlyBudget: updated.monthlyBudget };
  } catch (error) {
    console.error('Erreur Prisma updateUserMonthlyBudget :', error);
    return { success: false, error: 'Erreur lors de la sauvegarde du budget' };
  }
}