import { Language } from './translations';

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

export const DEFAULT_CURRENCY_BY_LANG: Record<Language, Currency> = {
  fr: 'EUR',
  en: 'EUR',
  de: 'EUR',
  es: 'EUR',
  pt: 'EUR',
};

export const LOCALE_MAP: Record<Language, string> = {
  fr: 'fr-FR',
  en: 'en-US',
  de: 'de-DE',
  es: 'es-ES',
  pt: 'pt-PT',
};

export const languages: { code: Language; name: string; flag: string }[] = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
];