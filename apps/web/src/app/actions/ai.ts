'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '@life-track/db';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { getAffiliateLink } from '@/lib/affiliates';
import { extractJsonFromResponse } from '@/lib/ai-parser';

function getGenAI() {
  const apiKey =
    process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || '';
  if (!apiKey) {
    throw new Error(
      'Clé API Google Gemini non configurée (GEMINI_API_KEY ou GOOGLE_AI_API_KEY manquante dans l\'environnement).',
    );
  }
  return new GoogleGenerativeAI(apiKey);
}

export async function runSmartAudit() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error('Non autorisé');
    }

    const userId = session.user.id;

    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const expenses = await prisma.expense.findMany({
      where: { userId: userId, date: { gte: ninetyDaysAgo } },
      orderBy: { date: 'desc' },
    });

    if (expenses.length < 3) {
      return { message: 'Pas assez de données (minimum 3 dépenses requises pour une analyse).' };
    }

    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Analyses ces dépenses : ${JSON.stringify(expenses)}. 
Identifie les opportunités d'économies et les anomalies.

RÈGLE DE PRIORITÉ : Sélectionne en priorité les 5 événements les plus impactants financièrement :
1. Les dépenses unitaires anormalement élevées (ex: > 500€).
2. Les contrats récurrents (EDF, Télécom) où une économie est possible.

Génère un tableau JSON de 5 objets maximum :
[{ 
  "type": "SAVING" | "INFO", 
  "title": string, 
  "description": string, 
  "potentialSaving": number,
  "category": "ENERGY" | "TELECOM" | "INSURANCE" | "BANK" | "OTHER"
}]

CONSIGNE : Sois percutant. Si tu vois une dépense de 1000€ en chaussures, c'est une priorité absolue.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const insights = extractJsonFromResponse(responseText);
    if (!insights || !Array.isArray(insights)) {
      return { message: "Erreur lors de l'analyse des résultats de l'IA." };
    }

    await prisma.insight.deleteMany({ where: { userId: userId } });

    const legalNote =
      ' (Note : Cette estimation informative ne constitue pas un conseil financier personnalisé).';

    const insightPromises = insights.map((insight) => {
      const linkSource =
        insight.category || `${insight.title} ${insight.description}`;
      const link =
        insight.type === 'SAVING' ? getAffiliateLink(linkSource) : null;

      return prisma.insight.create({
        data: {
          userId: userId,
          type: insight.type || 'INFO',
          title: insight.title || 'Conseil IA',
          description: (insight.description || '') + legalNote,
          potentialSaving: typeof insight.potentialSaving === 'number' ? insight.potentialSaving : null,
          affiliateUrl: link,
        },
      });
    });

    await Promise.all(insightPromises);

    revalidatePath('/dashboard');
    return { message: 'Audit terminé !' };
  } catch (error) {
    console.error('Erreur audit IA:', error);
    return {
      message:
        error instanceof Error
          ? error.message
          : 'Désolé, le coach est indisponible pour le moment.',
    };
  }
}

export async function categorizeTransactions(titles: string[]) {
  try {
    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Classe ces libellés : ${JSON.stringify(titles)}. 
Réponds en JSON uniquement : {"Libellé": "CATEGORIE"}. 
Catégories : LOGEMENT, ENERGIE, ALIMENTATION, TRANSPORT, ABONNEMENTS, LOISIRS, SANTE, AUTRE.`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    return extractJsonFromResponse(response) || {};
  } catch (error) {
    console.error('Erreur catégorisation IA:', error);
    return {};
  }
}
