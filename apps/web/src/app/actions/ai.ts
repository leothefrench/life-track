'use server';

import { GoogleGenAI } from '@google/genai';
import { prisma } from '@life-track/db';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { getAffiliateLink } from '@/lib/affiliates';
import { extractJsonFromResponse } from '@/lib/ai-parser';
import { getLocalFallbackCategory } from '@/lib/categorizer';

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY || '';
  if (!apiKey) {
    throw new Error(
      'Clé API Gemini non configurée (variable GEMINI_API_KEY manquante dans Vercel/.env).',
    );
  }
  return new GoogleGenAI({ apiKey });
}

// Fonction de réessai automatique anti-503 (2 tentatives transparentes)
async function callGeminiWithRetry<T>(
  fn: () => Promise<T>,
  retries = 2,
  delayMs = 1000,
): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    const errorStr = String(error);
    const isOverloaded =
      errorStr.includes('503') ||
      errorStr.includes('UNAVAILABLE') ||
      errorStr.includes('high demand') ||
      errorStr.includes('Resource has been exhausted');

    if (retries > 0 && isOverloaded) {
      await new Promise((res) => setTimeout(res, delayMs));
      return callGeminiWithRetry(fn, retries - 1, delayMs * 1.5);
    }
    throw error;
  }
}

export async function runSmartAudit(language: string = 'fr') {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error('Non autorisé');

    const userId = session.user.id;
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const expenses = await prisma.expense.findMany({
      where: { userId: userId, date: { gte: ninetyDaysAgo } },
      orderBy: { date: 'desc' },
    });

    const LANG_PROMPTS: Record<
      string,
      {
        langName: string;
        defaultTitle: string;
        notEnoughData: string;
        jsonError: string;
      }
    > = {
      fr: {
        langName: 'Français',
        defaultTitle: 'Conseil IA',
        notEnoughData:
          'Pas assez de données (minimum 3 dépenses sur 90 jours requises).',
        jsonError: "Erreur lors de l'analyse. Veuillez réessayer.",
      },
      en: {
        langName: 'English',
        defaultTitle: 'AI Insight',
        notEnoughData:
          'Not enough data (minimum 3 expenses over 90 days required).',
        jsonError: 'Error processing analysis. Please try again.',
      },
      de: {
        langName: 'Deutsch',
        defaultTitle: 'KI-Ratschlag',
        notEnoughData:
          'Nicht genügend Daten (mindestens 3 Ausgaben in 90 Tagen erforderlich).',
        jsonError: 'Fehler bei der Analyse. Bitte versuchen Sie es erneut.',
      },
      es: {
        langName: 'Español',
        defaultTitle: 'Consejo IA',
        notEnoughData:
          'Insuficientes datos (mínimo 3 gastos en 90 días requeridos).',
        jsonError: 'Error al procesar el análisis. Inténtelo de nuevo.',
      },
      pt: {
        langName: 'Português',
        defaultTitle: 'Conselho IA',
        notEnoughData:
          'Dados insuficientes (mínimo de 3 despesas em 90 dias necessárias).',
        jsonError: 'Erro ao processar a análise. Tente novamente.',
      },
    };

    const config = LANG_PROMPTS[language] || LANG_PROMPTS.fr;
    if (expenses.length < 3) {
      return { success: false, message: config.notEnoughData };
    }

    const prompt = `Analyze these expenses: ${JSON.stringify(expenses)}. 
Identify saving opportunities and anomalies.
IMPORTANT: Write all titles and descriptions in ${config.langName}.

PRIORITY RULE: Select up to 5 events with the highest financial impact:
1. Exceptionally high single expenses.
2. Recurring bills where savings are possible.

Generate a JSON array of up to 5 objects:
[{ 
  "type": "SAVING" | "INFO", 
  "title": string, 
  "description": string, 
  "potentialSaving": number,
  "category": "ENERGY" | "TELECOM" | "INSURANCE" | "BANK" | "OTHER"
}]

Reply only with valid JSON.`;

    const ai = getGeminiClient();
    const response = await callGeminiWithRetry(() =>
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      }),
    );

    const responseText = response.text || '';
    const insights = extractJsonFromResponse(responseText);

    if (!insights || !Array.isArray(insights)) {
      return { success: false, message: config.jsonError };
    }

    await prisma.insight.deleteMany({ where: { userId: userId } });

    const insightPromises = insights.map((insight) => {
      const linkSource =
        insight.category || `${insight.title} ${insight.description}`;
      const link =
        insight.type === 'SAVING' ? getAffiliateLink(linkSource) : null;

      return prisma.insight.create({
        data: {
          userId: userId,
          type: insight.type || 'INFO',
          title: insight.title || config.defaultTitle,
          description: insight.description || '',
          potentialSaving:
            typeof insight.potentialSaving === 'number'
              ? insight.potentialSaving
              : null,
          affiliateUrl: link,
        },
      });
    });

    await Promise.all(insightPromises);
    revalidatePath('/dashboard');
    return { success: true, message: 'audit_success' };
  } catch (error) {
    console.error('Erreur audit IA Gemini:', error);
    const rawMessage = error instanceof Error ? error.message : String(error);

    // Messages professionnels pour l'utilisateur sans aucun code d'erreur brut
    if (rawMessage.includes('401') || rawMessage.includes('API_KEY_INVALID')) {
      return {
        message:
          "Service d'analyse en maintenance temporaire. Veuillez réessayer plus tard.",
      };
    }

    if (
      rawMessage.includes('503') ||
      rawMessage.includes('UNAVAILABLE') ||
      rawMessage.includes('429') ||
      rawMessage.includes('RESOURCE_EXHAUSTED')
    ) {
      return {
        message:
          "Le conseiller IA finalise ses calculs. Veuillez relancer l'audit dans un instant.",
      };
    }

    return {
      message:
        'Une erreur est survenue lors de votre audit. Veuillez réessayer.',
    };
  }
}

export async function categorizeTransactions(titles: string[]) {
  if (!titles || titles.length === 0) return {};

  try {
    const ai = getGeminiClient();
    const prompt = `Classifie rigoureusement ces libellés bancaires : ${JSON.stringify(
      titles,
    )}.
Pour chaque libellé, attribue l'une de ces 8 catégories obligatoires :
- LOGEMENT (loyer, charges, agence)
- ENERGIE (électricité, gaz, eau)
- ALIMENTATION (supermarchés, restaurants, boulangerie, café, fast food, Uber Eats)
- TRANSPORT (essence, péage, train, métro, taxi, Uber, bus)
- ABONNEMENTS (forfait internet, téléphone, streaming Netflix/Spotify/Apple/Amazon)
- LOISIRS (cinéma, jeux, sorties, musées, loisirs créatifs)
- SANTE (pharmacie, médecin, optique, dentiste)
- AUTRE (retraits distributeurs ou inclassables)

Réponds STRICTEMENT sous forme d'objet JSON associatif : {"Libellé exact": "CATEGORIE"}`;

    const response = await callGeminiWithRetry(() =>
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      }),
    );

    const responseText = response.text || '';
    const parsed = extractJsonFromResponse(responseText) || {};

    const result: Record<string, string> = {};
    for (const title of titles) {
      result[title] = parsed[title] || getLocalFallbackCategory(title);
    }
    return result;
  } catch (error) {
    console.warn(
      'Bascule transparente sur le moteur de classification local:',
      error,
    );
    const fallback: Record<string, string> = {};
    for (const title of titles) {
      fallback[title] = getLocalFallbackCategory(title);
    }
    return fallback;
  }
}
