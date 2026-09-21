import { describe, it, expect } from 'vitest';
import { ExpenseSchema } from '@life-track/shared';

describe('Validation des Dépenses (ExpenseSchema)', () => {
  it('devrait valider une dépense classique correcte', () => {
    const result = ExpenseSchema.safeParse({
      title: 'Supermarché',
      amount: 45.5,
      category: 'ALIMENTATION',
      date: new Date(),
    });
    expect(result.success).toBe(true);
  });

  it('devrait accepter le flag isSubscription pour une dépense récurrente', () => {
    const result = ExpenseSchema.safeParse({
      title: 'Loyer',
      amount: 800,
      category: 'LOGEMENT',
      date: new Date(),
      isSubscription: true,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.isSubscription).toBe(true);
    }
  });

  it('devrait refuser un montant négatif ou égal à 0', () => {
    const resultZero = ExpenseSchema.safeParse({
      title: 'Erreur',
      amount: 0,
      category: 'AUTRE',
      date: new Date(),
    });
    const resultNegative = ExpenseSchema.safeParse({
      title: 'Erreur',
      amount: -15,
      category: 'AUTRE',
      date: new Date(),
    });
    expect(resultZero.success).toBe(false);
    expect(resultNegative.success).toBe(false);
  });

  it('devrait refuser une catégorie invalide', () => {
    const result = ExpenseSchema.safeParse({
      title: 'Test',
      amount: 10,
      category: 'CATEGORIE_INEXISTANTE',
      date: new Date(),
    });
    expect(result.success).toBe(false);
  });
});
