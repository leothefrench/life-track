import { prisma } from '@life-track/db';

/**
 * Reconduit automatiquement les dépenses marquées isSubscription: true
 * pour le mois en cours si elles n'existent pas encore ce mois-ci.
 */
export async function syncRecurringExpenses(userId: string) {
  try {
    const now = new Date();
    // Début du mois en cours (ex: 1er du mois à 00:00:00)
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // 1. Récupérer toutes les dépenses récurrentes passées de l'utilisateur
    const pastRecurring = await prisma.expense.findMany({
      where: {
        userId,
        isSubscription: true,
        date: { lt: startOfCurrentMonth },
      },
      orderBy: { date: 'desc' },
    });

    if (pastRecurring.length === 0) return;

    // Dédupliquer par titre + montant pour ne pas prendre 12 fois le même abonnement
    const uniqueTemplates = new Map<string, (typeof pastRecurring)[0]>();
    for (const exp of pastRecurring) {
      const key = `${exp.title.trim().toLowerCase()}-${exp.amount}-${
        exp.category
      }`;
      if (!uniqueTemplates.has(key)) {
        uniqueTemplates.set(key, exp);
      }
    }

    // 2. Récupérer les dépenses récurrentes déjà créées CE mois-ci
    const currentMonthRecurring = await prisma.expense.findMany({
      where: {
        userId,
        isSubscription: true,
        date: { gte: startOfCurrentMonth },
      },
    });

    const currentKeys = new Set(
      currentMonthRecurring.map(
        (e) => `${e.title.trim().toLowerCase()}-${e.amount}-${e.category}`,
      ),
    );

    // 3. Identifier celles qui manquent et les insérer
    const toCreate = [];
    for (const [key, template] of uniqueTemplates) {
      if (!currentKeys.has(key)) {
        toCreate.push({
          userId,
          title: template.title,
          amount: template.amount,
          category: template.category,
          merchant: template.merchant,
          isSubscription: true,
          date: startOfCurrentMonth, // Datée au 1er du mois
        });
      }
    }

    if (toCreate.length > 0) {
      await prisma.expense.createMany({
        data: toCreate,
      });
    }
  } catch (error) {
    console.error(
      'Erreur lors de la synchronisation des dépenses récurrentes:',
      error,
    );
  }
}
