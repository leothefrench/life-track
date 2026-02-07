'use server';

import { auth } from '@/auth';
import { stripe } from '@/lib/stripe';
import { prisma } from '@life-track/db';
import { redirect } from 'next/navigation';

export async function createCheckoutSession() {
  const session = await auth();

  if (!session?.user?.id || !session.user.email) {
    throw new Error('Vous devez être connecté pour passer au Premium.');
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: process.env.STRIPE_PREMIUM_PRICE_ID, 
        quantity: 1,
      },
    ],
    customer_email: session.user.email,
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?canceled=true`,
    metadata: {
      userId: session.user.id, 
    },
  });

  if (checkoutSession.url) {
    redirect(checkoutSession.url);
  }
}

export async function createCustomerPortalSession() {
  const session = await auth();

  if (!session?.user?.id || !session.user.email) {
    throw new Error('Non autorisé');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { stripeCustomerId: true },
  });

  if (!user?.stripeCustomerId) {
    throw new Error('Aucun compte client Stripe trouvé.');
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
  });

  if (portalSession.url) {
    redirect(portalSession.url);
  }
}