'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Check } from 'lucide-react';
import { SubscriptionButton } from '@/components/subscription-button';
import { useI18n } from '@/lib/i18n/i18n-context';

interface PricingPlansProps {
  isSubscribed: boolean;
}

export function PricingPlans({ isSubscribed }: PricingPlansProps) {
  const { t, formatCurrency } = useI18n();

  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      {/* Plan Gratuit */}
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>{t('pricing_free')}</CardTitle>
          <CardDescription>{t('pricing_free_desc')}</CardDescription>
          <div className="mt-4">
            <span className="text-4xl font-bold">{formatCurrency(0)}</span>
            <span className="text-muted-foreground">
              {' '}
              / {t('this_month').toLowerCase()}
            </span>
          </div>
        </CardHeader>
        <CardContent className="flex-1 space-y-4">
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-500" />
              <span>{t('landing_pricing_free_f1')}</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-500" />
              <span>{t('landing_pricing_free_f2')}</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-500" />
              <span>{t('landing_pricing_free_f3')}</span>
            </li>
          </ul>
        </CardContent>
        <CardFooter>
          <SubscriptionButton
            isCurrentPlan={!isSubscribed}
            buttonText={
              !isSubscribed ? t('pricing_current_plan') : t('pricing_free')
            }
            disabled={true}
          />
        </CardFooter>
      </Card>

      {/* Plan Premium */}
      <Card className="flex flex-col border-primary shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
          {t('pricing_recommended')}
        </div>
        <CardHeader>
          <CardTitle>{t('pricing_premium')}</CardTitle>
          <CardDescription>{t('pricing_premium_desc')}</CardDescription>
          <div className="mt-4">
            <span className="text-4xl font-bold">{formatCurrency(4.99)}</span>
            <span className="text-muted-foreground">
              {' '}
              / {t('this_month').toLowerCase()}
            </span>
          </div>
        </CardHeader>
        <CardContent className="flex-1 space-y-4">
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-500" />
              <span className="font-medium">
                {t('feature_unlimited_expenses')}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-500" />
              <span className="font-medium">{t('feature_unlimited_ai')}</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-500" />
              <span>{t('feature_savings_detection')}</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-500" />
              <span>{t('feature_bank_sync')}</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-500" />
              <span>{t('feature_multi_currency')}</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-500" />
              <span>{t('feature_priority_support')}</span>
            </li>
          </ul>
        </CardContent>
        <CardFooter>
          <SubscriptionButton
            isCurrentPlan={isSubscribed}
            buttonText={
              isSubscribed
                ? t('pricing_manage_sub')
                : t('pricing_switch_premium')
            }
          />
        </CardFooter>
      </Card>
    </div>
  );
}
