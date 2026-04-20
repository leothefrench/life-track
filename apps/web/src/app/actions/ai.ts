'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '@life-track/db';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { getAffiliateLink } from '@/lib/affiliates';
import { extractJsonFromResponse } from '@/lib/ai-parser';

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

  // Prompt affiné pour l'affiliation et la sécurité juridique
  const prompt = `Analyses ces dépenses françaises : ${JSON.stringify(expenses)}. 
  Identifie les opportunités de réduction sur les contrats (Énergie, Télécom, Assurances, Frais bancaires).
  
  Génère des INSIGHTS JSON uniquement sous cette forme : 
  [{ 
    "type": "SAVING" | "DUPLICATE" | "INFO", 
    "title": string, 
    "description": string, 
    "potentialSaving": number,
    "category": "ENERGY" | "TELECOM" | "INSURANCE" | "BANK" | "OTHER"
  }]
  
  CONSIGNE : Utilise des termes prudents ("pourrait", "potentiel"). Ne donne pas de conseils financiers fermes.`;

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  const insights = extractJsonFromResponse(responseText);
  if (!insights || !Array.isArray(insights))
    return { message: "Erreur d'analyse." };

  await prisma.insight.deleteMany({ where: { userId: session.user.id } });

  const legalNote = " (Note : Cette estimation informative ne constitue pas un conseil financier personnalisé).";

  for (const insight of insights) {
    // On utilise la catégorie fournie par l'IA ou le texte pour le lien
    const linkSource = insight.category || `${insight.title} ${insight.description}`;
    const link = insight.type === 'SAVING' ? getAffiliateLink(linkSource) : null;

    await prisma.insight.create({
      data: {
        userId: session.user.id,
        type: insight.type,
        title: insight.title,
        // Ajout automatique du disclaimer à la description
        description: insight.description + legalNote,
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
Catégories : LOGEMENT, ENERGIE, ALIMENTATION, TRANSPORT, ABONNEMENTS, LOISIRS, SANTE, AUTRE.`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    return extractJsonFromResponse(response) || {};
  } catch (error) {
    console.error('Erreur catégorisation IA:', error);
    return {};
  }
}