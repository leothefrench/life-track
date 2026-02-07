import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@life-track/db';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('Stripe-Signature') as string;

  let event;

  try {

    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    const userId = session.metadata.userId;

    if (!userId) {
      return new NextResponse('User ID non trouvé', { status: 400 });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { isPremium: true, stripeCustomerId: session.customer as string },
    });

    console.log(`Utilisateur ${userId} est maintenant Premium ! ✅`);
  }

  return new NextResponse(null, { status: 200 });
}
