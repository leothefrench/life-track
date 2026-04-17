import { test, expect } from '@playwright/test';

test('Tunnel de vente : Redirection vers Stripe Checkout', async ({ page }) => {
  // 1. CONNEXION
  await page.goto('/login');
  await page
    .locator('input[name="email"]')
    .fill(process.env.TEST_USER_EMAIL || '');
  await page
    .locator('input[name="password"]')
    .fill(process.env.TEST_USER_PASSWORD || '');
  await page.locator('button[type="submit"]').click();

  // 2. ATTENTE DE L'ÉCRAN OTP
  // On cherche le texte "Vérification" exact (le titre) pour confirmer qu'on est sur la page
  await expect(page.getByText('Vérification', { exact: true })).toBeVisible({
    timeout: 15000,
  });

  // 3. SAISIE DE L'OTP
  // On utilise l'input qui est déjà "actif" (focus) sur cette page
  const otpInput = page
    .locator('input[type="text"], input[autocomplete="one-time-code"]')
    .first();
  await otpInput.click();
  await page.keyboard.type('123456', { delay: 100 });

  // 4. VALIDATION
  await page.keyboard.press('Enter');

  // 5. ATTENTE DU DASHBOARD
  await page.waitForURL(/.*dashboard.*/, { timeout: 45000 });
  await expect(
    page.getByText(/Total dépensé|Dashboard/i).first(),
  ).toBeVisible();

  // 6. PRICING & STRIPE
  await page.goto('/pricing');
  // On s'assure que le titre est là avant de chercher la suite
  await expect(page.getByText(/Choisissez votre plan/i)).toBeVisible();

  // On clique sur le texte de la renonciation (le robot "lit" le texte et clique dessus)
  const consentText = page.getByText(
    /Je reconnais que Life-Track fournit un contenu numérique/i,
  );
  await consentText.scrollIntoViewIfNeeded();
  await consentText.click();

  // On vérifie que le bouton "S'abonner" n'est plus grisé
  // On cible le bouton de soumission du formulaire
  const stripeBtn = page.locator('button[type="submit"]').first();
  await expect(stripeBtn).toBeEnabled({ timeout: 10000 });
  await stripeBtn.click();

  // 7. LE GRAAL : STRIPE
   await expect(page).toHaveURL(/.*stripe\.com.*/, { timeout: 40000 });
});