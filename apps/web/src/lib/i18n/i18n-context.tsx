'use client';

import React, {
  createContext,
  useContext,
  useSyncExternalStore,
  useEffect,
} from 'react';
import { translations, Language, TranslationKey } from './translations';
import { Currency, currencies, LOCALE_MAP } from './i18n.config';
import {
  subscribeLang,
  subscribeCurrency,
  getLanguageSnapshot,
  getCurrencySnapshot,
  saveLanguagePreference,
  saveCurrencyPreference,
} from './i18n.store';

export * from './i18n.config';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: Currency;
  setCurrency: (cur: Currency) => void;
  currencySymbol: string;
  formatCurrency: (amount: number, customCurrency?: Currency) => string;
  formatDate: (
    date: Date | string,
    options?: Intl.DateTimeFormatOptions,
  ) => string;
  t: (
    key: TranslationKey | string,
    params?: Record<string, string | number>,
  ) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({
  children,
  initialLanguage,
}: {
  children: React.ReactNode;
  initialLanguage?: Language;
}) {
  // Typage strict <Language> et <Currency> pour useSyncExternalStore
  const language = useSyncExternalStore<Language>(
    subscribeLang,
    getLanguageSnapshot,
    () => 'fr',
  );
  const currency = useSyncExternalStore<Currency>(
    subscribeCurrency,
    getCurrencySnapshot,
    () => 'EUR',
  );

  useEffect(() => {
    if (
      initialLanguage &&
      ['fr', 'en', 'de', 'es', 'pt'].includes(initialLanguage)
    ) {
      if (initialLanguage !== language) saveLanguagePreference(initialLanguage);
    }
  }, [initialLanguage, language]);

  const currencyConfig =
    currencies.find((c) => c.code === currency) || currencies[0];

  const formatCurrency = (
    amount: number,
    customCurrency?: Currency,
  ): string => {
    const cur = customCurrency || currency;
    const locale = LOCALE_MAP[language] || 'fr-FR';
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: cur,
      }).format(amount);
    } catch {
      return `${amount.toFixed(2)} ${cur}`;
    }
  };

  const formatDate = (
    date: Date | string,
    options?: Intl.DateTimeFormatOptions,
  ): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const locale = LOCALE_MAP[language] || 'fr-FR';
    try {
      return new Intl.DateTimeFormat(
        locale,
        options || { dateStyle: 'medium' },
      ).format(d);
    } catch {
      return d.toLocaleDateString();
    }
  };

  const t = (
    key: TranslationKey | string,
    params?: Record<string, string | number>,
  ): string => {
    const currentDict = translations[language] as Record<string, string>;
    const fallbackDict = translations.fr as Record<string, string>;
    let text = currentDict[key] || fallbackDict[key] || String(key);

    if (params) {
      Object.entries(params).forEach(([pKey, pVal]) => {
        text = text.replace(`{${pKey}}`, String(pVal));
      });
    }
    return text;
  };

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage: saveLanguagePreference,
        currency,
        setCurrency: saveCurrencyPreference,
        currencySymbol: currencyConfig.symbol,
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
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within an I18nProvider');
  return ctx;
}
