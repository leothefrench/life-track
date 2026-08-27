'use client';

import React, { createContext, useContext, useSyncExternalStore } from 'react';
import { translations, Language, TranslationKey } from './translations';

export type Currency = 'EUR' | 'USD' | 'GBP' | 'CHF' | 'CAD' | 'BRL';

export interface CurrencyConfig {
  code: Currency;
  symbol: string;
  name: string;
}

export const currencies: CurrencyConfig[] = [
  { code: 'EUR', symbol: '€', name: 'Euro (EUR)' },
  { code: 'USD', symbol: '$', name: 'US Dollar (USD)' },
  { code: 'GBP', symbol: '£', name: 'British Pound (GBP)' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc (CHF)' },
  { code: 'CAD', symbol: '$', name: 'Canadian Dollar (CAD)' },
  { code: 'BRL', symbol: 'R$', name: 'Real Brasileiro (BRL)' },
];

const DEFAULT_CURRENCY_BY_LANG: Record<Language, Currency> = {
  fr: 'EUR',
  en: 'USD',
  de: 'EUR',
  es: 'EUR',
  pt: 'EUR',
};

const LOCALE_MAP: Record<Language, string> = {
  fr: 'fr-FR',
  en: 'en-US',
  de: 'de-DE',
  es: 'es-ES',
  pt: 'pt-PT',
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: Currency;
  setCurrency: (cur: Currency) => void;
  currencySymbol: string;
  formatCurrency: (amount: number, customCurrency?: Currency) => string;
  formatDate: (date: Date | string, options?: Intl.DateTimeFormatOptions) => string;
  t: (key: TranslationKey | string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Listeners pour propager les changements de localStorage de façon réactive
let langListeners: Array<() => void> = [];
let currencyListeners: Array<() => void> = [];

function subscribeLang(callback: () => void) {
  langListeners.push(callback);
  return () => {
    langListeners = langListeners.filter((l) => l !== callback);
  };
}

function subscribeCurrency(callback: () => void) {
  currencyListeners.push(callback);
  return () => {
    currencyListeners = currencyListeners.filter((l) => l !== callback);
  };
}

function getLanguageSnapshot(): Language {
  if (typeof window === 'undefined') return 'fr';
  try {
    const saved = localStorage.getItem('life_track_lang') as Language | null;
    if (saved && ['fr', 'en', 'de', 'es', 'pt'].includes(saved)) {
      return saved;
    }
  } catch {
    // Ignorer si localStorage inaccessible
  }
  return 'fr';
}

function getCurrencySnapshot(): Currency {
  if (typeof window === 'undefined') return 'EUR';
  try {
    const saved = localStorage.getItem('life_track_currency') as Currency | null;
    if (saved && currencies.some((c) => c.code === saved)) {
      return saved;
    }
    const currentLang = getLanguageSnapshot();
    if (DEFAULT_CURRENCY_BY_LANG[currentLang]) {
      return DEFAULT_CURRENCY_BY_LANG[currentLang];
    }
  } catch {
    // Ignorer si localStorage inaccessible
  }
  return 'EUR';
}

function getServerSnapshotLang(): Language {
  return 'fr';
}

function getServerSnapshotCurrency(): Currency {
  return 'EUR';
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  // useSyncExternalStore est l'API React 18/19 recommandée par l'équipe React pour synchroniser avec localStorage
  // sans aucun useEffect, sans warning ESLint et sans risque d'erreur d'hydratation
  const language = useSyncExternalStore(subscribeLang, getLanguageSnapshot, getServerSnapshotLang);
  const currency = useSyncExternalStore(subscribeCurrency, getCurrencySnapshot, getServerSnapshotCurrency);

  const setLanguage = (lang: Language) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('life_track_lang', lang);
        document.cookie = `life_track_lang=${lang}; path=/; max-age=31536000; SameSite=Lax`;
        // Si aucune devise spécifique n'a été choisie manuellement, adapter par défaut
        const hasCustomCurrency = localStorage.getItem('life_track_currency');
        if (!hasCustomCurrency && DEFAULT_CURRENCY_BY_LANG[lang]) {
          localStorage.setItem('life_track_currency', DEFAULT_CURRENCY_BY_LANG[lang]);
          currencyListeners.forEach((listener) => listener());
        }
      } catch {
        // Ignorer
      }
      langListeners.forEach((listener) => listener());
    }
  };

  const setCurrency = (cur: Currency) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('life_track_currency', cur);
      } catch {
        // Ignorer
      }
      currencyListeners.forEach((listener) => listener());
    }
  };

  const currencyConfig = currencies.find((c) => c.code === currency) || currencies[0];
  const currencySymbol = currencyConfig.symbol;

  const formatCurrency = (amount: number, customCurrency?: Currency): string => {
    const cur = customCurrency || currency;
    const locale = LOCALE_MAP[language] || 'fr-FR';
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: cur,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch {
      return `${amount.toFixed(2)} ${cur}`;
    }
  };

  const formatDate = (date: Date | string, options?: Intl.DateTimeFormatOptions): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const locale = LOCALE_MAP[language] || 'fr-FR';
    try {
      return new Intl.DateTimeFormat(locale, options || { dateStyle: 'medium' }).format(d);
    } catch {
      return d.toLocaleDateString();
    }
  };

  const t = (key: TranslationKey | string, params?: Record<string, string | number>): string => {
    const langDict = (translations[language] as Record<string, string> | undefined);
    const frDict = translations.fr as Record<string, string>;
    let text = (langDict && langDict[key]) || frDict[key] || key;

    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        text = text.replace(`{${paramKey}}`, String(paramValue));
      });
    }

    return text;
  };

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage,
        currency,
        setCurrency,
        currencySymbol,
        formatCurrency,
        formatDate,
        t,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

export const languages: { code: Language; name: string; flag: string }[] = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
];
