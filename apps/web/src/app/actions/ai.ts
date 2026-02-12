'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '@life-track/db';
import { auth } from '@/auth';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export async function analyzeExpenses() {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Non autorisé');

  // 1. Calculer le début du mois en cours
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // 2. Récupérer les dépenses du mois uniquement
  const expenses = await prisma.expense.findMany({
    where: {
      userId: session.user.id,
      date: { gte: startOfMonth },
    },
    orderBy: { date: 'desc' },
  });

  if (expenses.length === 0)
    return "Aucune dépense enregistrée ce mois-ci pour l'analyse.";

  // 3. Préparer le modèle
 const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
  

  // 4. Le Prompt amélioré
  const prompt = `Voici mes dépenses depuis le ${startOfMonth.toLocaleDateString()} : ${JSON.stringify(
    expenses,
  )}. 
  Agis comme un coach financier expert. Donne-moi 3 conseils très courts (1 phrase chacun) pour optimiser mon budget. 
  Réponds en français avec un ton encourageant et des emojis.`;

  // 5. Appel à l'IA
  const result = await model.generateContent(prompt);

  return result.response.text();
}
