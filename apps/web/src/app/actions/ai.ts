"use server"

import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "@life-track/db";
import { auth } from "@/auth";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export async function analyzeExpenses() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Non autorisé");

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // 1. On récupère les données brutes ET les statistiques d'un coup
  const [expenses, stats, categories] = await Promise.all([
    prisma.expense.findMany({
      where: { userId: session.user.id, date: { gte: startOfMonth } },
      orderBy: { amount: 'desc' },
      take: 20 // Les plus grosses dépenses
    }),
    prisma.expense.aggregate({
      where: { userId: session.user.id, date: { gte: startOfMonth } },
      _sum: { amount: true },
      _count: true
    }),
    prisma.expense.groupBy({
      by: ['category'],
      where: { userId: session.user.id, date: { gte: startOfMonth } },
      _sum: { amount: true }
    })
  ]);

  if (stats._count === 0) return "Aucune donnée pour ce mois. Ajoutez vos premières dépenses !";

  // 2. On prépare le modèle
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // 3. LE PROMPT "CHIRURGICAL" (C'est ici que le prix de 9.99€ se justifie)
  const total = stats._sum.amount || 0;
  const prompt = `
    Agis en tant qu'expert en finance personnelle pour l'application Life-Track.
    Analyse les données suivantes de l'utilisateur pour le mois en cours :
    - Total dépensé : ${total.toFixed(2)}€
    - Nombre de transactions : ${stats._count}
    - Répartition par catégories : ${JSON.stringify(categories)}
    - Top 5 des plus grosses dépenses : ${JSON.stringify(expenses.slice(0, 5))}

    Tes instructions :
    1. Identifie la catégorie où l'utilisateur abuse (plus de 30% du budget).
    2. Repère une dépense spécifique qui semble anormale ou optimisable.
    3. Donne une estimation de ce qu'il pourrait économiser le mois prochain.
    
    Réponds en français, sois très précis (cite des chiffres), utilise un ton pro mais encourageant avec des emojis.
    Fais court : 3 points maximum.
  `;

  const result = await model.generateContent(prompt);
  return result.response.text();
}