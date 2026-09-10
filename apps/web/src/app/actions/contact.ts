'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail(formData: FormData) {
  // 1. On récupère l'email saisi dans le formulaire (qu'on soit connecté ou non)
  const emailFromForm = formData.get('email') as string;
  const subject = formData.get('subject') as string;
  const message = formData.get('message') as string;

  try {
    const siteUrl =
      process.env.NEXTAUTH_URL || 'https://life-track-web-weld.vercel.app/';

    await resend.emails.send({
      from: 'Life-Track Support <onboarding@resend.dev>',
      to: 'leandro.dasilva@bbox.fr', 
      subject: `[SUPPORT] ${subject}`,
      replyTo: emailFromForm, 
      text: `Nouveau message de : ${emailFromForm}\n\nSujet : ${subject}\n\nMessage :\n${message}\n\n---\nRevenir sur le site Life-Track : ${siteUrl}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #111;">
          <h2>Nouveau message de support Life-Track</h2>
          <p><strong>Expéditeur :</strong> ${emailFromForm}</p>
          <p><strong>Sujet :</strong> ${subject}</p>
          <div style="background: #f4f4f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            ${message.replace(/\n/g, '<br/>')}
          </div>
          <p style="margin-top: 25px;">
            <a href="${siteUrl}" style="background: #2563eb; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Retourner sur Life-Track
            </a>
          </p>
        </div>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('Erreur envoi mail:', error);
    return { error: "Erreur lors de l'envoi." };
  }
}
