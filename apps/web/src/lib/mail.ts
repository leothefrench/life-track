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