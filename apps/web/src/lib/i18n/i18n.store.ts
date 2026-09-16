import { Language } from './translations';
import { Currency, currencies, DEFAULT_CURRENCY_BY_LANG } from './i18n.config';

let langListeners: Array<() => void> = [];
let currencyListeners: Array<() => void> = [];

export function subscribeLang(cb: () => void) {
  langListeners.push(cb);
  return () => {
    langListeners = langListeners.filter((l) => l !== cb);
  };
}

export function subscribeCurrency(cb: () => void) {
  currencyListeners.push(cb);
  return () => {
    currencyListeners = currencyListeners.filter((l) => l !== cb);
  };
}

export function getLanguageSnapshot(): Language {
  if (typeof window === 'undefined') return 'fr';
  try {
    const saved = localStorage.getItem('life_track_lang') as Language | null;
    if (saved && ['fr', 'en', 'de', 'es', 'pt'].includes(saved)) return saved;
  } catch {}
  return 'fr';
}

export function getCurrencySnapshot(): Currency {
  if (typeof window === 'undefined') return 'EUR';
  try {
    const saved = localStorage.getItem(
      'life_track_currency',
    ) as Currency | null;
    if (saved && currencies.some((c) => c.code === saved)) return saved;
    const curLang = getLanguageSnapshot();
    if (DEFAULT_CURRENCY_BY_LANG[curLang])
      return DEFAULT_CURRENCY_BY_LANG[curLang];
  } catch {}
  return 'EUR';
}

export function saveLanguagePreference(lang: Language) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('life_track_lang', lang);
    document.cookie = `life_track_lang=${lang}; path=/; max-age=31536000; SameSite=Lax`;
    const hasCustom = localStorage.getItem('life_track_currency');
    if (!hasCustom && DEFAULT_CURRENCY_BY_LANG[lang]) {
      localStorage.setItem(
        'life_track_currency',
        DEFAULT_CURRENCY_BY_LANG[lang],
      );
      currencyListeners.forEach((l) => l());
    }
  } catch {}
  langListeners.forEach((l) => l());
}

export function saveCurrencyPreference(cur: Currency) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('life_track_currency', cur);
  } catch {}
  currencyListeners.forEach((l) => l());
}
