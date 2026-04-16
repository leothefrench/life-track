import { test, expect } from '@playwright/test';

// TEST 1 : L'INSCRIPTION
test('Flux complet : Création de compte', async ({ page }) => {
  const uniqueEmail = `user-${Date.now()}@test.com`;
  await page.goto('/register');

  await page.locator('input[name="name"]').fill('Test User');
  await page.locator('input[name="email"]').fill(uniqueEmail);
  await page.locator('input[name="password"]').fill('Password123!');

  await page.locator('button[type="submit"]').click();

  await expect(page).toHaveURL(/.*login.*/, { timeout: 30000 });
});

// TEST 2 : LA CONNEXION -> DASHBOARD
test('Flux Connexion : Login -> 2FA -> Dashboard', async ({ page }) => {
  await page.goto('/login');

  // 1. Étape Identifiants
  await page
    .locator('input[name="email"]')
    .fill(process.env.TEST_USER_EMAIL || '');
  await page
    .locator('input[name="password"]')
    .fill(process.env.TEST_USER_PASSWORD || '');
  await page.locator('button[type="submit"]').click();

  // 2. Étape OTP (On cible l'input avec précision)
  const otpInput = page
    .locator('input[type="text"], input[autocomplete="one-time-code"]')
    .first();
  await expect(otpInput).toBeVisible({ timeout: 15000 });

  // 3. Saisie du code Bypass (Touche par touche pour React)
  const magicCode = process.env.E2E_OTP_BYPASS_CODE || '123456';
  await otpInput.click();
  await otpInput.pressSequentially(magicCode, { delay: 100 });

  // 4. Clic sur le bouton de validation
  await page.keyboard.press('Enter');

  // On attend la redirection vers le dashboard
  // J'augmente à 30s car le premier chargement du dashboard est lourd (Prisma + IA)
  await expect(page).toHaveURL(/.*dashboard.*/, { timeout: 30000 });
  
  // On vérifie que le texte "Dashboard" est présent
  await expect(page.getByRole('heading', { name: /Dashboard/i })).toBeVisible();
});
