'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '@life-track/db';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { getAffiliateLink } from '@/lib/affiliates';
import { extractJsonFromResponse } from '@/lib/ai-parser'; // 1. IMPORT

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export async function runSmartAudit() {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Non autorisé');

  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  const expenses = await prisma.expense.findMany({
    where: { userId: session.user.id, date: { gte: ninetyDaysAgo } },
    orderBy: { date: 'desc' },
  });

  if (expenses.length < 3) return { message: 'Pas assez de données.' };

  const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

  const prompt = `Analyses ces dépenses : ${JSON.stringify(expenses)}. 
  Génère des INSIGHTS JSON : [{ "type": "SAVING" | "DUPLICATE" | "INFO", "title": string, "description": string, "potentialSaving": number }]
  Inclus les mots-clés : EDF, TOTAL, ENGIE, ÉLECTRICITÉ, BANQUE, FRAIS, AGIOS, ASSURANCE, MUTUELLE.`;

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  // 2. UTILISATION DU PARSER TESTÉ
  const insights = extractJsonFromResponse(responseText);
  if (!insights || !Array.isArray(insights))
    return { message: "Erreur d'analyse." };

  await prisma.insight.deleteMany({ where: { userId: session.user.id } });

  for (const insight of insights) {
    const searchText = `${insight.title} ${insight.description}`.toUpperCase();
    const link =
      insight.type === 'SAVING' ? getAffiliateLink(searchText) : null;

    await prisma.insight.create({
      data: {
        userId: session.user.id,
        type: insight.type,
        title: insight.title,
        description: insight.description,
        potentialSaving: insight.potentialSaving,
        affiliateUrl: link,
      },
    });
  }

  revalidatePath('/dashboard');
  return { message: 'Audit terminé !' };
}

export async function categorizeTransactions(titles: string[]) {
  const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

  const prompt = `Classe ces libellés : ${JSON.stringify(titles)}. 
  Réponds en JSON uniquement : {"Libellé": "CATEGORIE"}. 
  Catégories : LOYER, NOURRITURE, VETEMENTS, LOISIRS, AUTRE.`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // 3. UTILISATION DU PARSER TESTÉ
    return extractJsonFromResponse(response) || {};
  } catch (error) {
    console.error('Erreur catégorisation IA:', error);
    return {};
  }
}
