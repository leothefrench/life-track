'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Language, TranslationKey, translations } from './translations';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('fr');

  useEffect(() => {
    // Lecture sécurisée du localStorage au montage côté client
    try {
      const saved = localStorage.getItem('life_track_lang') as Language | null;
      if (saved && saved in translations) {
        setLanguageState(saved);
        return;
      }
      if (typeof navigator !== 'undefined') {
        const browserLang = navigator.language?.toLowerCase() || '';
        if (browserLang.startsWith('de')) setLanguageState('de');
        else if (browserLang.startsWith('es')) setLanguageState('es');
        else if (browserLang.startsWith('pt')) setLanguageState('pt');
        else if (browserLang.startsWith('en')) setLanguageState('en');
        else if (browserLang.startsWith('fr')) setLanguageState('fr');
      }
    } catch {
      // Ignorer si localStorage est inaccessible
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('life_track_lang', lang);
      } catch {
        // Ignorer si localStorage est inaccessible
      }
    }
  };

  const t = (key: TranslationKey): string => {
    const langDict = translations[language] || translations.fr;
    return langDict[key] || translations.fr[key] || key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    // Sécurité au cas où utilisé hors du provider
    return {
      language: 'fr' as Language,
      setLanguage: () => {},
      t: (key: TranslationKey) => translations.fr[key] || key,
    };
  }
  return context;
}
