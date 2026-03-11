'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '@life-track/db';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export async function runSmartAudit() {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Non autorisé');

  // 1. Récupérer les 90 derniers jours pour détecter les abonnements
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  const expenses = await prisma.expense.findMany({
    where: {
      userId: session.user.id,
      date: { gte: ninetyDaysAgo },
    },
    orderBy: { date: 'desc' },
  });

  if (expenses.length < 3)
    return { message: 'Pas assez de données pour auditer vos contrats.' };

  const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

  // 2. Le Prompt d'Expert (orienté économies et détection de récurrence)
  const prompt = `
    En tant qu'auditeur financier, analyse ces 90 jours de dépenses : ${JSON.stringify(
      expenses,
    )}.
    
    1. Identifie les dépenses RÉCURRENTES (abonnements, loyer, factures).
    2. Pour chaque abonnement, compare avec les prix du marché :
       - Mobile/Internet : ~15-30€
       - Streaming : ~10-15€
       - Électricité : Selon montant
    3. Génère une liste d'INSIGHTS au format JSON uniquement :
       [{ "type": "SAVING" | "DUPLICATE" | "INFO", "title": string, "description": string, "potentialSaving": number }]
    
    Réponds uniquement avec le JSON.
  `;

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  // 3. Extraction du JSON (L'IA peut parfois mettre du texte autour)
  const jsonMatch = responseText.match(/\[[\s\S]*\]/);
  if (!jsonMatch) return { message: "Erreur d'analyse." };

  const insights = JSON.parse(jsonMatch[0]);

  // 4. Enregistrement dans la base Neon
  // On nettoie les anciens insights avant pour ne pas doubler les alertes
  await prisma.insight.deleteMany({ where: { userId: session.user.id } });

  for (const insight of insights) {
    await prisma.insight.create({
      data: {
        userId: session.user.id,
        type: insight.type,
        title: insight.title,
        description: insight.description,
        potentialSaving: insight.potentialSaving,
        affiliateUrl: 'https://selectra.info', // On met un lien générique pour l'instant
      },
    });
  }

  revalidatePath('/dashboard');
  return { message: 'Audit terminé avec succès !' };
}

export async function categorizeTransactions(titles: string[]) {
  const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

  const prompt = `
    Agis comme un expert comptable. Voici une liste de libellés de transactions bancaires : ${JSON.stringify(
      titles,
    )}.
    
    Classe chaque transaction dans l'une de ces catégories UNIQUEMENT : 
    LOYER, NOURRITURE, VETEMENTS, LOISIRS, AUTRE.

    Réponds uniquement sous forme d'un objet JSON plat où la clé est le libellé exact et la valeur est la catégorie.
    Exemple : {"Starbucks": "NOURRITURE", "Netflix": "LOISIRS"}
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : {};
  } catch (error) {
    console.error('Erreur catégorisation IA:', error);
    return {};
  }
}