'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail(formData: FormData) {
  // 1. On récupère l'email saisi dans le formulaire (qu'on soit connecté ou non)
  const emailFromForm = formData.get('email') as string;
  const subject = formData.get('subject') as string;
  const message = formData.get('message') as string;

  try {
    await resend.emails.send({
      from: 'Life-Track Support <onboarding@resend.dev>',
      to: 'leandro.dasilva@bbox.fr', 
      subject: `[SUPPORT] ${subject}`,
      replyTo: emailFromForm, 
      text: `Nouveau message de : ${emailFromForm}\n\nSujet : ${subject}\n\nMessage :\n${message}`,
    });

    return { success: true };
  } catch (error) {
    console.error('Erreur envoi mail:', error);
    return { error: "Erreur lors de l'envoi." };
  }
}
