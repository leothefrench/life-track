import { test, expect } from '@playwright/test';

test('Dashboard : Affichage des composants financiers', async ({ page }) => {
  // 1. Connexion
  await page.goto('/login');
  await page
    .locator('input[name="email"]')
    .fill(process.env.TEST_USER_EMAIL || '');
  await page
    .locator('input[name="password"]')
    .fill(process.env.TEST_USER_PASSWORD || '');
  await page.locator('button[type="submit"]').click();

  // 2. Étape OTP (On attend que le champ soit vraiment là)
  const otpInput = page
    .locator('input[type="text"], input[autocomplete="one-time-code"]')
    .first();
  await expect(otpInput).toBeVisible({ timeout: 15000 }); // <-- CRUCIAL

  // 3. Saisie du code Bypass
  const magicCode = process.env.E2E_OTP_BYPASS_CODE || '123456';
  await otpInput.click();
  await otpInput.pressSequentially(magicCode, { delay: 100 });
  await page.keyboard.press('Enter');

  // 4. VÉRIFICATION DU DASHBOARD
  // On laisse 30s car le premier rendu avec les données Prisma peut être long
  await expect(page).toHaveURL(/.*dashboard.*/, { timeout: 30000 });

  // On vérifie les éléments visuels
  await expect(page.getByText(/Total dépensé/i)).toBeVisible();
  await expect(page.getByRole('link', { name: /Paramètres/i })).toBeVisible();
});
