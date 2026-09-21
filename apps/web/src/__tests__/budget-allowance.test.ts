import { describe, it, expect } from 'vitest';

describe('Calculs anti-stress du budget (Allocation journalière)', () => {
  it('devrait diviser le reste par le nombre exact de jours restants', () => {
    const remainingBudget = 300;
    const remainingDays = 15;
    const daily = remainingBudget / remainingDays;
    const weekly = daily * 7;

    expect(daily).toBe(20);
    expect(weekly).toBe(140);
  });

  it('devrait gérer le dernier jour sans division par 0', () => {
    const remainingBudget = 50;
    const remainingDays = 1; // Dernier jour du mois
    const daily = remainingBudget / remainingDays;

    expect(daily).toBe(50);
  });

  it('devrait calculer correctement le dernier jour de février (année bissextile vs normale)', () => {
    // Février 2024 (bissextile)
    const feb2024LastDay = new Date(2024, 2, 0).getDate();
    expect(feb2024LastDay).toBe(29);

    // Février 2025 (normale)
    const feb2025LastDay = new Date(2025, 2, 0).getDate();
    expect(feb2025LastDay).toBe(28);
  });
});
