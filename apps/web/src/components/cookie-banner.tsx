'use client';

import { useState, useEffect, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { ShieldCheck, Cookie, SlidersHorizontal, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n/i18n-context';
import { CookieModal } from '@/components/cookies/cookie-modal';
import {
  CookiePreferences,
  COOKIE_STORAGE_KEY,
  COOKIE_CONSENT_VERSION,
} from '@/components/cookies/cookie-types';

export * from '@/components/cookies/cookie-types';

const emptySubscribe = () => () => {};

export function CookieBanner() {
  const { t } = useI18n();
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [analyticsAllowed, setAnalyticsAllowed] = useState(false);
  const [preferencesAllowed, setPreferencesAllowed] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(COOKIE_STORAGE_KEY);
      if (stored) {
        const parsed: CookiePreferences = JSON.parse(stored);
        if (parsed.version === COOKIE_CONSENT_VERSION) {
          setAnalyticsAllowed(parsed.analytics ?? false);
          setPreferencesAllowed(parsed.preferences ?? false);
          setIsOpen(false);
          return;
        }
      }
      setIsOpen(true);
    } catch {
      setIsOpen(true);
    }

    const handleOpenSettings = () => setIsModalOpen(true);
    window.addEventListener('open-cookie-settings', handleOpenSettings);
    return () =>
      window.removeEventListener('open-cookie-settings', handleOpenSettings);
  }, []);

  const savePreferences = (prefs: {
    analytics: boolean;
    preferences: boolean;
  }) => {
    const data: CookiePreferences = {
      essential: true,
      analytics: prefs.analytics,
      preferences: prefs.preferences,
      timestamp: new Date().toISOString(),
      version: COOKIE_CONSENT_VERSION,
    };

    try {
      localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify(data));
      document.cookie = `life_track_cookie_consent=true; path=/; max-age=31536000; SameSite=Lax`;
    } catch {}

    setAnalyticsAllowed(prefs.analytics);
    setPreferencesAllowed(prefs.preferences);
    setIsOpen(false);
    setIsModalOpen(false);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('cookie-consent-updated', { detail: data }),
      );
    }
  };

  if (!isClient || (!isOpen && !isModalOpen)) {
    return (
      <CookieModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        analytics={analyticsAllowed}
        setAnalytics={setAnalyticsAllowed}
        preferences={preferencesAllowed}
        setPreferences={setPreferencesAllowed}
        onSave={() =>
          savePreferences({
            analytics: analyticsAllowed,
            preferences: preferencesAllowed,
          })
        }
        t={t}
      />
    );
  }

  return (
    <>
      {isOpen && (
        <aside className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6 bg-linear-to-t from-black via-black/95 to-transparent pointer-events-none">
          <div className="max-w-4xl mx-auto pointer-events-auto bg-[#0d121f]/95 border border-blue-500/20 shadow-2xl backdrop-blur-xl rounded-2xl p-5 sm:p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Cookie className="h-5 w-5" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold tracking-wider uppercase text-blue-400">
                      {t('cookies_banner_badge')}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-medium px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                      <ShieldCheck className="h-3 w-3" /> RGPD & CNIL
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white">
                    {t('cookies_banner_title')}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-200 max-w-2xl">
                    {t('cookies_banner_desc')}{' '}
                    <Link
                      href="/confidentialite"
                      className="text-blue-400 underline hover:text-blue-300"
                    >
                      {t('cookies_policy_link')}
                    </Link>
                    .
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModalOpen(true)}
                  className="border-white/10 text-slate-200 rounded-xl text-xs h-10 px-3.5"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5 text-slate-300" />
                  {t('cookies_customize')}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    savePreferences({ analytics: false, preferences: false })
                  }
                  className="text-slate-300 hover:text-white rounded-xl text-xs h-10 px-3.5"
                >
                  {t('cookies_reject_all')}
                </Button>
                <Button
                  size="sm"
                  onClick={() =>
                    savePreferences({ analytics: true, preferences: true })
                  }
                  className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs h-10 px-4"
                >
                  <Check className="h-3.5 w-3.5 mr-1.5" />
                  {t('cookies_accept_all')}
                </Button>
              </div>
            </div>
          </div>
        </aside>
      )}

      <CookieModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        analytics={analyticsAllowed}
        setAnalytics={setAnalyticsAllowed}
        preferences={preferencesAllowed}
        setPreferences={setPreferencesAllowed}
        onSave={() =>
          savePreferences({
            analytics: analyticsAllowed,
            preferences: preferencesAllowed,
          })
        }
        t={t}
      />
    </>
  );
}

export function CookieSettingsButton({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const { t } = useI18n();
  return (
    <button
      type="button"
      onClick={() =>
        window.dispatchEvent(new CustomEvent('open-cookie-settings'))
      }
      className={
        className ||
        'text-[10px] uppercase tracking-widest text-white/70 hover:text-white font-bold'
      }
    >
      {children || t('cookies_footer_btn')}
    </button>
  );
}
