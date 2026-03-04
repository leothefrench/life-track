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
  const jsonMatch = responseText.match(/\[.*\]/s);
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
