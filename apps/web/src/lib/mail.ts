import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);

// Adresse email par défaut pour l'envoi (Standard de test Resend)
export const MAIL_FROM = 'onboarding@resend.dev';

export const sendPasswordResetEmail = async (email: string, token: string) => {
  // On construit l'URL que l'utilisateur devra cliquer
  // En ligne, ce sera https://life-track...vercel.app/new-password?token=...
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/new-password?token=${token}`;

  await resend.emails.send({
    from: MAIL_FROM,
    to: email,
    subject: 'Réinitialisez votre mot de passe - Life-Track',
    html: `
      <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
      <p>Cliquez sur le lien ci-dessous pour choisir un nouveau mot de passe :</p>
      <a href="${resetLink}">Réinitialiser mon mot de passe</a>
      <p>Ce lien expirera dans 1 heure.</p>
    `,
  });
};

export const sendWelcomeEmail = async (email: string, name: string) => {
  await resend.emails.send({
    from: MAIL_FROM,
    to: email, // mail pour le test
    subject: "Bienvenue sur Life-Track ! 🚀",
    html: `
      <h1>Bonjour ${name} !</h1>
      <p>Merci d'avoir rejoint Life-Track. Votre compte est maintenant prêt.</p>
      <p>Pour commencer à économiser, connectez votre banque depuis votre dashboard. Notre IA analysera vos 90 derniers jours pour trouver des économies.</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard">Accéder à mon Dashboard</a>
    `,
  });
};

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: MAIL_FROM,
    to: email,
    subject: 'Votre code de sécurité - Life-Track',
    html: `
      <div style="font-family: sans-serif; max-width: 400px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; rounded-lg: 12px;">
        <h1 style="font-size: 20px; font-weight: bold; text-align: center;">Code de sécurité</h1>
        <p style="text-align: center; color: #64748b;">Entrez le code ci-dessous pour vous connecter à votre compte.</p>
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 0.2em; color: #2563eb; margin: 20px 0;">
          ${token}
        </div>
        <p style="font-size: 12px; color: #94a3b8; text-align: center;">Ce code expire dans 5 minutes.</p>
      </div>
    `,
  });
};