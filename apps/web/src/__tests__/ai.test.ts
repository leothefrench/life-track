import { describe, it, expect } from "vitest";
import { extractJsonFromResponse } from "@/lib/ai-parser";

describe("Nettoyage des réponses de l'IA", () => {
  it("devrait extraire un JSON simple perdu dans du texte", () => {
    const rawAiResponse = "Voici les résultats : {\"category\": \"LOYER\"} j'espère que ça aide.";
    const result = extractJsonFromResponse(rawAiResponse);
    expect(result).toEqual({ category: "LOYER" });
  });

  it("devrait extraire un tableau JSON", () => {
    const rawAiResponse = "Sure! [{\"id\": 1}, {\"id\": 2}]";
    const result = extractJsonFromResponse(rawAiResponse);
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe(1);
  });

  it("devrait renvoyer null si aucun JSON n'est trouvé", () => {
    const rawAiResponse = "Je ne peux pas répondre à cette question.";
    const result = extractJsonFromResponse(rawAiResponse);
    expect(result).toBeNull();
  });
});