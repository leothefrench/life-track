'use server';

import { Mistral } from '@mistralai/mistralai';
import { prisma } from '@life-track/db';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { getAffiliateLink } from '@/lib/affiliates';
import { extractJsonFromResponse } from '@/lib/ai-parser';

function getMistralClient() {
  const apiKey = process.env.MISTRAL_API_KEY || '';
  if (!apiKey) {
    throw new Error(
      'Clé API Mistral non configurée (variable MISTRAL_API_KEY manquante dans Vercel/.env).'
    );
  }
  return new Mistral({ apiKey });
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
      return { message: 'Pas assez de données (minimum 3 dépenses sur 90 jours requises).' };
    }

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

CONSIGNE : Sois percutant. Si tu vois une dépense de 1000€ en chaussures, c'est une priorité absolue.
Réponds uniquement en JSON valide.`;

    const client = getMistralClient();
    const chatResponse = await client.chat.complete({
      model: 'mistral-small-latest',
      messages: [{ role: 'user', content: prompt }],
    });

    const rawContent = chatResponse.choices?.[0]?.message?.content;
    const responseText = typeof rawContent === 'string' ? rawContent : String(rawContent || '');

    const insights = extractJsonFromResponse(responseText);
    if (!insights || !Array.isArray(insights)) {
      return { message: "Erreur lors du traitement du JSON généré par l'IA Mistral." };
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
    console.error('Erreur audit IA Mistral:', error);
    const rawMessage = error instanceof Error ? error.message : String(error);
    
    if (rawMessage.includes('401') || rawMessage.includes('Unauthorized') || rawMessage.includes('invalid_api_key')) {
      return {
        message: 'Clé API Mistral invalide (Erreur 401). Vérifiez votre variable MISTRAL_API_KEY sur Vercel.',
      };
    }

    if (rawMessage.includes('429') || rawMessage.includes('Rate limit')) {
      return {
        message: 'Quota d\'appels Mistral dépassé (Erreur 429). Veuillez patienter quelques minutes.',
      };
    }

    return {
      message: rawMessage || 'Désolé, le coach IA est indisponible pour le moment.',
    };
  }
}

export async function categorizeTransactions(titles: string[]) {
  try {
    const client = getMistralClient();

    const prompt = `Classe ces libellés : ${JSON.stringify(titles)}. 
Réponds en JSON uniquement : {"Libellé": "CATEGORIE"}. 
Catégories : LOGEMENT, ENERGIE, ALIMENTATION, TRANSPORT, ABONNEMENTS, LOISIRS, SANTE, AUTRE.`;

    const chatResponse = await client.chat.complete({
      model: 'mistral-small-latest',
      messages: [{ role: 'user', content: prompt }],
    });

    const rawContent = chatResponse.choices?.[0]?.message?.content;
    const responseText = typeof rawContent === 'string' ? rawContent : String(rawContent || '');

    return extractJsonFromResponse(responseText) || {};
  } catch (error) {
    console.error('Erreur catégorisation IA Mistral:', error);
    return {};
  }
}
