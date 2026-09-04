'use client';

import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';
import { useI18n } from '@/lib/i18n/i18n-context';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { TwoFactorSwitch } from '@/components/two-factor-switch';
import { NotificationToggleCard } from '@/components/notification-toggle-card';
import { ChangePasswordCard } from '@/components/change-password-card';
import { DangerZoneCard } from '@/components/danger-zone-card';
import { useEffect, useState } from 'react';

export default function SettingsPage() {
  const { t } = useI18n();
  const [userData, setUserData] = useState<{
    isTwoFactorEnabled: boolean;
    hasActiveSubscription: boolean;
    subscriptionEndDate: string | null;
  }>({
    isTwoFactorEnabled: false,
    hasActiveSubscription: false,
    subscriptionEndDate: null,
  });

  // Récupération sécurisée des infos utilisateur
  useEffect(() => {
    async function loadUserData() {
      try {
        const res = await fetch('/api/user/me');
        if (res.ok) {
          const data = await res.json();
          const hasPaidPeriodRemaining = Boolean(
            data.stripeCurrentPeriodEnd &&
              new Date(data.stripeCurrentPeriodEnd) > new Date(),
          );
          setUserData({
            isTwoFactorEnabled: Boolean(data.isTwoFactorEnabled),
            hasActiveSubscription: Boolean(
              data.isPremium || hasPaidPeriodRemaining,
            ),
            subscriptionEndDate: data.stripeCurrentPeriodEnd || null,
          });
        }
      } catch (err) {
        console.error('Erreur chargement utilisateur', err);
      }
    }
    loadUserData();
  }, []);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      {/* Bouton retour avec le vrai libellé nav_dashboard */}
      <div className="flex flex-col gap-3">
        <div>
          <Link
            href="/dashboard"
            aria-label={t('nav_dashboard')}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-medium text-muted-foreground transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{t('nav_dashboard')}</span>
          </Link>
        </div>

        <div>
          <h1
            id="settings-heading"
            className="text-2xl font-bold tracking-tight sm:text-3xl"
          >
            {t('settings_title')}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t('settings_subtitle')}
          </p>
        </div>
      </div>

      <section aria-labelledby="settings-heading" className="space-y-6">
        {/* Notifications */}
        <NotificationToggleCard />

        {/* 2FA avec les vraies clés exactes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
            <div className="space-y-1 pr-4">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Shield
                  className="h-4 w-4 text-blue-500 shrink-0"
                  aria-hidden="true"
                />
                <span>{t('two_factor_title')}</span>
              </CardTitle>
              <CardDescription>{t('two_factor_desc')}</CardDescription>
            </div>
            <TwoFactorSwitch initialValue={userData.isTwoFactorEnabled} />
          </CardHeader>
        </Card>

        {/* Mot de passe */}
        <ChangePasswordCard />

        {/* Danger zone avec Stripe */}
        <DangerZoneCard
          hasActiveSubscription={userData.hasActiveSubscription}
          subscriptionEndDate={userData.subscriptionEndDate}
        />
      </section>
    </div>
  );
}
