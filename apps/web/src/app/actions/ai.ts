'use server';

import { GoogleGenAI } from '@google/genai';
import { prisma } from '@life-track/db';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { getAffiliateLink } from '@/lib/affiliates';
import { extractJsonFromResponse } from '@/lib/ai-parser';
import { getLocalFallbackCategory } from '@/lib/categorizer';
import { generateLocalAudit, FallbackInsight } from '@/lib/audit-fallback';

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY || '';
  if (!apiKey) throw new Error('Clé API Gemini non configurée.');
  return new GoogleGenAI({ apiKey });
}

async function callGeminiWithRetry<T>(
  fn: () => Promise<T>,
  retries = 1,
  delayMs = 800,
): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    const err = String(error);
    const retryable =
      err.includes('503') ||
      err.includes('UNAVAILABLE') ||
      err.includes('high demand') ||
      err.includes('RESOURCE_EXHAUSTED') ||
      err.includes('429');

    if (retries > 0 && retryable) {
      await new Promise((res) => setTimeout(res, delayMs));
      return callGeminiWithRetry(fn, retries - 1, delayMs * 1.5);
    }
    throw error;
  }
}

export async function runSmartAudit(language: string = 'fr') {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Non autorisé');

  const userId = session.user.id;
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  const expenses = await prisma.expense.findMany({
    where: { userId: userId, date: { gte: ninetyDaysAgo } },
    orderBy: { date: 'desc' },
  });

  const LANG_NAMES: Record<string, string> = {
    fr: 'Français',
    en: 'English',
    de: 'Deutsch',
    es: 'Español',
    pt: 'Português',
  };

  if (expenses.length < 3) {
    const notEnough: Record<string, string> = {
      fr: 'Pas assez de données (minimum 3 dépenses sur 90 jours requises).',
      en: 'Not enough data (minimum 3 expenses over 90 days required).',
      de: 'Nicht genügend Daten (mindestens 3 Ausgaben erforderlich).',
      es: 'Insuficientes datos (mínimo 3 gastos requeridos).',
      pt: 'Dados insuficientes (mínimo de 3 despesas necessárias).',
    };
    return { success: false, message: notEnough[language] || notEnough.fr };
  }

  let insights: FallbackInsight[] | null = null;

  // 1. Tentative IA
  try {
    const prompt = `Analyze these expenses: ${JSON.stringify(expenses)}. 
Identify saving opportunities and anomalies.
IMPORTANT: Write all titles and descriptions in ${
      LANG_NAMES[language] || 'Français'
    }.

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

    const parsed = extractJsonFromResponse(response.text || '');
    if (parsed && Array.isArray(parsed) && parsed.length > 0) {
      insights = parsed;
    }
  } catch (error) {
    console.warn('Gemini indisponible : bascule sur l’algorithme local.');
  }

  // 2. Filet de secours local garanti
  if (!insights || insights.length === 0) {
    insights = generateLocalAudit(expenses, language);
  }

  // 3. Enregistrement en base de données
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
        title: insight.title || 'Conseil financier',
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
}

export async function categorizeTransactions(titles: string[]) {
  if (!titles || titles.length === 0) return {};

  try {
    const ai = getGeminiClient();
    const prompt = `Classifie rigoureusement ces libellés bancaires : ${JSON.stringify(
      titles,
    )}.
Catégories autorisées exclusivement : LOGEMENT, ENERGIE, ALIMENTATION, TRANSPORT, ABONNEMENTS, LOISIRS, SANTE, AUTRE.
Réponds STRICTEMENT en JSON : {"Libellé exact": "CATEGORIE"}`;

    const response = await callGeminiWithRetry(() =>
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      }),
    );

    const parsed = extractJsonFromResponse(response.text || '') || {};
    const result: Record<string, string> = {};
    for (const title of titles) {
      result[title] = parsed[title] || getLocalFallbackCategory(title);
    }
    return result;
  } catch (error) {
    console.warn('Bascule sur le moteur de classification local.');
    const fallback: Record<string, string> = {};
    for (const title of titles) {
      fallback[title] = getLocalFallbackCategory(title);
    }
    return fallback;
  }
}
