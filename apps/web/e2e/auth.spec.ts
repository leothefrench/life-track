import { test, expect } from '@playwright/test';

// TEST 1 : L'INSCRIPTION (Le mix qui passait)
test('Flux complet : Création de compte', async ({ page }) => {
  const uniqueEmail = `user-${Date.now()}@test.com`;
  await page.goto('/register');

  await page.locator('input[name="name"]').fill('Test User');
  await page.locator('input[name="email"]').fill(uniqueEmail);
  await page.locator('input[name="password"]').fill('Password123!');

  await page.locator('button[type="submit"]').click();
  
  // On utilise toHaveURL avec un timeout long pour laisser le serveur respirer
  // Cela couvre le cas "/login?registered=true"
  await expect(page).toHaveURL(/.*registered=true.*/, { timeout: 30000 });
});

// TEST 2 : LA CONNEXION (La partie qui passait hier)
test('Flux Connexion : Identifiants -> Affichage 2FA', async ({ page }) => {
  await page.goto('/login');

  await page.locator('input[name="email"]').fill(process.env.TEST_USER_EMAIL || '');
  await page.locator('input[name="password"]').fill(process.env.TEST_USER_PASSWORD || '');

  await page.locator('button[type="submit"]').click();

  // On cherche le bouton spécifique du 2FA (écarte toute ambiguïté)
  const verifyBtn = page.getByRole('button', { name: /Vérifier le code/i });
  await expect(verifyBtn).toBeVisible({ timeout: 15000 });

  // On vérifie qu'un champ de saisie est présent pour le code
  await expect(page.locator('input').first()).toBeVisible();
});