'use client';

import { useState, useEffect } from 'react';
import {
  createCheckoutSession,
  createCustomerPortalSession,
  getSubscriptionStatus,
} from '@/app/actions/stripe';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Check, Sparkles } from 'lucide-react';
import { useI18n } from '@/lib/i18n/i18n-context';

export default function PricingPage() {
  const [accepted, setAccepted] = useState(false);
  const [isPremium, setIsPremium] = useState<boolean | null>(null);
  const { t } = useI18n();

  useEffect(() => {
    const checkStatus = async () => {
      const status = await getSubscriptionStatus();
      setIsPremium(status);
    };
    checkStatus();
  }, []);

  if (isPremium === null) {
    return (
      <div className="max-w-5xl mx-auto py-24 px-4 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 bg-white/5 mx-auto rounded-lg" />
          <div className="h-4 w-96 bg-white/5 mx-auto rounded-lg" />
        </div>
      </div>
    );
  }

  if (isPremium) {
    return (
      <div className="max-w-3xl mx-auto py-24 px-4 text-center space-y-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="h-3 w-3" /> {t('pro_member')}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            {t('subscription_active')}
          </h1>
          <p className="text-white/50 max-w-md mx-auto text-sm md:text-base">
            {t('active_desc')}
          </p>
        </div>

        <Card className="border-white/10 bg-white/5 backdrop-blur-xl max-w-md mx-auto overflow-hidden">
          <CardContent className="p-8 space-y-6">
            <p className="text-sm text-white/70 leading-relaxed">
              {t('stripe_portal_desc')}
            </p>
            <form action={createCustomerPortalSession}>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all"
                type="submit"
              >
                {t('manage_subscription')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const plans = [
    {
      name: t('monthly'),
      price: '9,99€',
      description: t('monthly_desc'),
      priceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID,
      features: [
        t('unlimited_ai'),
        t('detailed_charts'),
        t('export_csv_pdf'),
        t('priority_support'),
      ],
      buttonText: t('subscribe_monthly'),
      highlight: false,
    },
    {
      name: t('annual'),
      price: '99€',
      description: t('annual_desc'),
      priceId: process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID,
      features: [
        t('unlimited_ai'),
        t('detailed_charts'),
        t('export_csv_pdf'),
        t('priority_support'),
      ],
      buttonText: t('subscribe_annual'),
      highlight: true,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <div className="text-center mb-12 space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-white">
          {t('pricing_title')}
        </h1>
        <p className="text-white/50 max-w-2xl mx-auto">
          {t('pricing_subtitle')}
        </p>
      </div>

      <div className="max-w-md mx-auto mb-12 flex items-start gap-3 p-4 bg-white/5 rounded-2xl border border-white/10 shadow-xl">
        <input
          type="checkbox"
          id="global-terms"
          className="mt-1 h-4 w-4 rounded border-white/20 bg-white/10 text-blue-600 focus:ring-blue-500 cursor-pointer"
          onChange={(e) => setAccepted(e.target.checked)}
        />
        <label
          htmlFor="global-terms"
          className="text-[11px] text-white/50 leading-tight cursor-pointer"
        >
          Je reconnais que Life-Track fournit un contenu numérique immédiatement
          et je renonce expressément à mon droit de rétractation.
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`relative flex flex-col ${
              plan.highlight
                ? 'border-blue-500 bg-white/5 shadow-2xl shadow-blue-500/10'
                : 'border-white/10 bg-transparent'
            }`}
          >
            {plan.highlight && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                {t('best_value')}
              </span>
            )}
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-xl text-white">{plan.name}</CardTitle>
              <CardDescription className="text-white/50">
                {plan.description}
              </CardDescription>
              <div className="mt-4">
                <span className="text-5xl font-bold text-white">
                  {plan.price}
                </span>
                <span className="text-white/40 text-sm">
                  {plan.name === t('annual') ? ' / an' : ' / mois'}
                </span>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-sm text-white/70"
                  >
                    <Check className="h-4 w-4 text-emerald-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <form action={createCheckoutSession}>
                <input type="hidden" name="priceId" value={plan.priceId} />
                <Button
                  className={`w-full rounded-xl h-12 font-bold transition-all ${
                    plan.highlight
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  } disabled:opacity-30`}
                  type="submit"
                  disabled={!accepted}
                >
                  {plan.buttonText}
                </Button>
              </form>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
