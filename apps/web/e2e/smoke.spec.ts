import { test, expect } from '@playwright/test';

// Test 1 : L'affichage fonctionne
test('la landing page s’affiche correctement', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Life-Track/);
});

// Test 2 : Le bouton mène bien à l'inscription
test('Navigation : Landing -> Inscription', async ({ page }) => {
  await page.goto('/');

  // 1. On clique sur le bouton de la landing
  await page.getByRole('link', { name: /Commencer à économiser/i }).click();

  // 2. On vérifie qu'on est bien arrivés sur /register
  await expect(page).toHaveURL(/\/register/);
});
