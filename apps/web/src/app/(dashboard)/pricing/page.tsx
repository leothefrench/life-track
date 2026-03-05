"use client";

import { useState } from 'react';
import { createCheckoutSession } from '@/app/actions/stripe';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Check } from 'lucide-react';

export default function PricingPage() {
  const [accepted, setAccepted] = useState(false);

  const plans = [
    {
      name: 'Mensuel',
      price: '9,99€',
      description: 'La flexibilité totale, mois après mois.',
      priceId: process.env.STRIPE_PREMIUM_PRICE_ID,
      features: [
        'Analyses IA illimitées',
        'Graphiques détaillés',
        'Export CSV/PDF',
        'Support prioritaire',
      ],
      buttonText: "S'abonner au mois",
      highlight: false,
    },
    {
      name: 'Annuel',
      price: '99€',
      description: 'Le meilleur choix pour transformer vos finances.',
      priceId: process.env.STRIPE_YEARLY_PRICE_ID,
      features: [
        'Tout le plan Mensuel',
        '2 mois offerts',
        'Audit de patrimoine',
        'Accès anticipé aux nouveautés',
      ],
      buttonText: "Économiser avec l'annuel",
      highlight: true,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <div className="text-center mb-12 space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Choisissez votre plan
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Passez au niveau supérieur. Laissez notre IA auditer vos{' '}
          <span className="text-foreground font-medium">
            dépenses et abonnements
          </span>{' '}
          pour optimiser votre cash.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`relative flex flex-col ${
              plan.highlight
                ? 'border-blue-500 shadow-2xl shadow-blue-500/10'
                : 'border-border/50'
            }`}
          >
            {plan.highlight && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                Recommandé
              </span>
            )}
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-5xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">
                  /{plan.name === 'Annuel' ? 'an' : 'mois'}
                </span>
              </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-6">
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    <Check className="h-4 w-4 text-emerald-500" />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* --- LA NOUVELLE CASE À COCHER --- */}
              <div className="flex items-start gap-3 pt-4 border-t border-border/50">
                <input
                  type="checkbox"
                  id={`terms-${plan.name}`}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  onChange={(e) => setAccepted(e.target.checked)}
                />
                <label
                  htmlFor={`terms-${plan.name}`}
                  className="text-[10px] text-muted-foreground leading-tight cursor-pointer"
                >
                  Je reconnais que Life-Track fournit un contenu numérique
                  immédiatement et je renonce expressément à mon droit de
                  rétractation.
                </label>
              </div>

              <form action={createCheckoutSession}>
                <input type="hidden" name="priceId" value={plan.priceId} />
                <Button
                  className={`w-full rounded-xl h-12 font-bold ${
                    plan.highlight ? 'bg-blue-600 hover:bg-blue-700' : ''
                  }`}
                  type="submit"
                  disabled={!accepted} // LE BOUTON EST BLOQUÉ SI PAS COCHÉ
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
