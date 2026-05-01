import { test, expect } from '@playwright/test';

test('Formulaire de contact : Envoi d’un message depuis la landing', async ({ page }) => {
  // 1. Aller sur la page d'accueil
  await page.goto('/');

  // 2. Ouvrir la modale de contact
  // On cherche le bouton "Contact" en bas de page
  const contactTrigger = page.getByRole('button', { name: /contact/i });
  await contactTrigger.scrollIntoViewIfNeeded();
  await contactTrigger.click();

  // 3. Vérifier que la modale est ouverte
  await expect(page.getByText('Contacter le support')).toBeVisible();

  // 4. Remplir les champs
  await page.locator('input[name="email"]').fill('test-robot@example.com');
  await page.locator('input[name="subject"]').fill('Question sur l’abonnement');
  await page.locator('textarea[name="message"]').fill('Bonjour, ceci est un test automatique du robot Playwright.');

  // 5. Envoyer
  await page.getByRole('button', { name: /envoyer le message/i }).click();

  // 6. Vérifier le message de succès (le Toaster Sonner)
  // On utilise un timeout de 10s car l'envoi via Resend peut prendre un peu de temps en local
  await expect(page.getByText(/message envoyé/i)).toBeVisible({ timeout: 10000 });
});