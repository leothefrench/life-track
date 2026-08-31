'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Cookie,
  Settings,
  Check,
  X,
  Lock,
  BarChart3,
  SlidersHorizontal,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { useI18n } from '@/lib/i18n/i18n-context';

export interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  preferences: boolean;
  timestamp: string;
  version: string;
}

const COOKIE_STORAGE_KEY = 'life_track_cookie_consent';
const COOKIE_CONSENT_VERSION = '1.0';

export function CookieBanner() {
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [analyticsAllowed, setAnalyticsAllowed] = useState(false);
  const [preferencesAllowed, setPreferencesAllowed] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(COOKIE_STORAGE_KEY);
      if (stored) {
        const parsed: CookiePreferences = JSON.parse(stored);
        if (parsed.version === COOKIE_CONSENT_VERSION) {
          setAnalyticsAllowed(parsed.analytics ?? false);
          setPreferencesAllowed(parsed.preferences ?? false);
          setIsOpen(false);
        } else {
          setIsOpen(true);
        }
      } else {
        setIsOpen(true);
      }
    } catch {
      setIsOpen(true);
    }

    const handleOpenSettings = () => {
      setIsModalOpen(true);
    };

    window.addEventListener('open-cookie-settings', handleOpenSettings);
    return () => {
      window.removeEventListener('open-cookie-settings', handleOpenSettings);
    };
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
      // Optionnel : cookie de session technique pour les middleware
      document.cookie = `life_track_cookie_consent=true; path=/; max-age=31536000; SameSite=Lax`;
    } catch {
      // Ignorer si localStorage désactivé
    }

    setAnalyticsAllowed(prefs.analytics);
    setPreferencesAllowed(prefs.preferences);
    setIsOpen(false);
    setIsModalOpen(false);

    // Déclencher un événement global pour que les éventuels traceurs s'activent/se désactivent
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('cookie-consent-updated', { detail: data }),
      );
    }
  };

  const handleAcceptAll = () => {
    savePreferences({ analytics: true, preferences: true });
  };

  const handleRejectAll = () => {
    savePreferences({ analytics: false, preferences: false });
  };

  const handleSaveModal = () => {
    savePreferences({
      analytics: analyticsAllowed,
      preferences: preferencesAllowed,
    });
  };

  if (!mounted || (!isOpen && !isModalOpen)) {
    return (
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
    );
  }

  return (
    <>
      {isOpen && (
        <aside
          role="region"
          aria-label={t('cookies_banner_title')}
          className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6 bg-gradient-to-t from-black via-black/95 to-transparent pointer-events-none"
        >
          <div className="max-w-4xl mx-auto pointer-events-auto bg-[#0d121f]/95 border border-blue-500/20 shadow-2xl shadow-blue-950/40 backdrop-blur-xl rounded-2xl p-5 sm:p-6 transition-all duration-300">
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
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400/90 font-medium px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                      <ShieldCheck className="h-3 w-3" />
                      RGPD & CNIL
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    {t('cookies_banner_title')}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed max-w-2xl">
                    {t('cookies_banner_desc')}{' '}
                    <Link
                      href="/confidentialite"
                      className="text-blue-400 underline underline-offset-2 hover:text-blue-300 transition-colors"
                    >
                      {t('cookies_policy_link')}
                    </Link>
                    .
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 shrink-0 self-end md:self-center w-full md:w-auto">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModalOpen(true)}
                  className="w-full sm:w-auto border-white/10 hover:bg-white/5 text-slate-300 hover:text-white rounded-xl text-xs h-10 px-3.5"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
                  {t('cookies_customize')}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRejectAll}
                  className="w-full sm:w-auto text-slate-400 hover:text-white hover:bg-white/5 rounded-xl text-xs h-10 px-3.5"
                >
                  {t('cookies_reject_all')}
                </Button>

                <Button
                  type="button"
                  size="sm"
                  onClick={handleAcceptAll}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs h-10 px-4 shadow-lg shadow-blue-600/25"
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
        onSave={handleSaveModal}
        t={t}
      />
    </>
  );
}

function CookieModal({
  open,
  onOpenChange,
  analytics,
  setAnalytics,
  preferences,
  setPreferences,
  onSave,
  t,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  analytics: boolean;
  setAnalytics: (val: boolean) => void;
  preferences: boolean;
  setPreferences: (val: boolean) => void;
  onSave: () => void;
  t: (key: string) => string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl bg-[#0b0f19] border-white/10 text-white p-6 rounded-2xl shadow-2xl">
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <SlidersHorizontal className="h-4 w-4" />
            </div>
            <DialogTitle className="text-lg font-bold text-white">
              {t('cookies_modal_title')}
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs sm:text-sm text-slate-400">
            {t('cookies_modal_subtitle')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-3">
          {/* 1. Essentiels */}
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="h-7 w-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                <Lock className="h-3.5 w-3.5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-white">
                    {t('cookies_essential_title')}
                  </h4>
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {t('cookies_essential_badge')}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {t('cookies_essential_desc')}
                </p>
              </div>
            </div>
            <Switch
              checked={true}
              disabled
              aria-label={t('cookies_essential_title')}
            />
          </div>

          {/* 2. Analytics */}
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-start justify-between gap-4 hover:border-white/10 transition-colors">
            <div className="flex items-start gap-3">
              <div className="h-7 w-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                <BarChart3 className="h-3.5 w-3.5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-white">
                  {t('cookies_analytics_title')}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {t('cookies_analytics_desc')}
                </p>
              </div>
            </div>
            <Switch
              checked={analytics}
              onCheckedChange={setAnalytics}
              aria-label={t('cookies_analytics_title')}
            />
          </div>

          {/* 3. Préférences & Confort */}
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-start justify-between gap-4 hover:border-white/10 transition-colors">
            <div className="flex items-start gap-3">
              <div className="h-7 w-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                <Settings className="h-3.5 w-3.5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-white">
                  {t('cookies_preferences_title')}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {t('cookies_preferences_desc')}
                </p>
              </div>
            </div>
            <Switch
              checked={preferences}
              onCheckedChange={setPreferences}
              aria-label={t('cookies_preferences_title')}
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <Link
            href="/confidentialite"
            onClick={() => onOpenChange(false)}
            className="text-xs text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors inline-flex items-center gap-1"
          >
            <Info className="h-3 w-3" />
            {t('cookies_policy_link')}
          </Link>
          <Button
            type="button"
            onClick={onSave}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs h-9 px-4"
          >
            <Check className="h-3.5 w-3.5 mr-1.5" />
            {t('cookies_save_selection')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Bouton utilitaire pour rouvrir les préférences cookies depuis n'importe quel footer ou page de paramètres
 */
export function CookieSettingsButton({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const { t } = useI18n();

  const handleOpen = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-cookie-settings'));
    }
  };

  return (
    <button
      type="button"
      onClick={handleOpen}
      className={
        className ||
        'text-[10px] uppercase tracking-widest text-white/60 hover:text-white transition-colors font-bold'
      }
    >
      {children || t('cookies_footer_btn')}
    </button>
  );
}
