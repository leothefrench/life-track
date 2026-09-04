'use server';

import { auth } from '@/auth';
import { prisma } from '@life-track/db';
import { revalidatePath } from 'next/cache';

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

    // Récupération de l'utilisateur avec ses informations d'abonnement Stripe
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

    // RÈGLE MÉTIER : Vérification de la période payée restante
    // Même si l'utilisateur a cliqué sur "Annuler" dans Stripe (cancel_at_period_end = true),
    // stripeCurrentPeriodEnd indique la fin des droits payés.
    const isPaidPeriodActive = Boolean(
      user.stripeCurrentPeriodEnd && new Date(user.stripeCurrentPeriodEnd) > now
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

    // Si aucune période payée n'est active, suppression définitive en cascade
    await prisma.user.delete({
      where: { id: userId },
    });

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Erreur lors de la suppression du compte:', error);
    return {
      success: false,
      error: 'Une erreur technique est survenue lors de la suppression. Veuillez réessayer ou contacter le support.',
    };
  }
}
