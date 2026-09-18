'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n/i18n-context';
import { CookieModal } from '@/components/cookies/cookie-modal';
import { CookieBannerUI } from '@/components/cookies/cookie-banner-ui';
import { useCookiePreferences } from '@/components/cookies/use-cookie-preferences';

export * from '@/components/cookies/cookie-types';
export { CookieSettingsButton } from '@/components/cookies/cookie-settings-button';

export function CookieBanner() {
  const { t } = useI18n();
  const { prefs, hasConsented, save } = useCookiePreferences();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [analyticsAllowed, setAnalyticsAllowed] = useState(false);
  const [preferencesAllowed, setPreferencesAllowed] = useState(false);

  // Écoute l'ouverture manuelle depuis la sidebar
  useEffect(() => {
    const handleOpen = () => {
      setAnalyticsAllowed(prefs.analytics);
      setPreferencesAllowed(prefs.preferences);
      setIsModalOpen(true);
    };
    window.addEventListener('open-cookie-settings', handleOpen);
    return () => window.removeEventListener('open-cookie-settings', handleOpen);
  }, [prefs]);

  const handleSaveModal = () => {
    save({ analytics: analyticsAllowed, preferences: preferencesAllowed });
    setIsModalOpen(false);
  };

  return (
    <>
      {!hasConsented && (
        <CookieBannerUI
          onCustomize={() => {
            setAnalyticsAllowed(prefs.analytics);
            setPreferencesAllowed(prefs.preferences);
            setIsModalOpen(true);
          }}
          onRejectAll={() => save({ analytics: false, preferences: false })}
          onAcceptAll={() => save({ analytics: true, preferences: true })}
          t={t}
        />
      )}

      <CookieModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        analytics={analyticsAllowed}
        setAnalytics={setAnalyticsAllowed}
        preferences={preferencesAllowed}
        setPreferences={setPreferencesAllowed}
        onSave={handleSaveModal}
        t={t}
      />
    </>
  );
}
