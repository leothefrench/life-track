'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useI18n } from '@/lib/i18n/i18n-context';

interface SubscriptionButtonProps {
  isSubscribed?: boolean;
  isCurrentPlan?: boolean;
  buttonText?: string;
  disabled?: boolean;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link';
  className?: string;
}

export function SubscriptionButton({
  isSubscribed = false,
  isCurrentPlan = false,
  buttonText,
  disabled = false,
  variant = 'default',
  className = '',
}: SubscriptionButtonProps) {
  const [loading, setLoading] = useState(false);
  const { t } = useI18n();

  const handleSubscribe = async () => {
    if (isCurrentPlan || disabled) return;
    setLoading(true);
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Subscription error:', error);
    } finally {
      setLoading(false);
    }
  };

  const label =
    buttonText ||
    (isCurrentPlan
      ? t('pricing_current_plan')
      : isSubscribed
      ? t('pricing_manage')
      : t('pricing_upgrade_pro'));

  return (
    <Button
      variant={isCurrentPlan ? 'outline' : variant}
      className={`w-full ${className}`}
      disabled={disabled || isCurrentPlan || loading}
      onClick={handleSubscribe}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
      {label}
    </Button>
  );
}
