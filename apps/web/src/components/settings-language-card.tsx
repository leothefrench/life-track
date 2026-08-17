'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useI18n } from '@/lib/i18n/i18n-context';
import { LANGUAGE_NAMES, Language } from '@/lib/i18n/translations';
import { Globe, Check } from 'lucide-react';

export function SettingsLanguageCard() {
  const { language, setLanguage, t } = useI18n();

  return (
    <Card className="bg-white/5 border-white/10 shadow-none">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
            <Globe className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg text-white">
              {t('language_title')}
            </CardTitle>
            <p className="text-xs text-white/50">{t('language_desc')}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {(Object.keys(LANGUAGE_NAMES) as Language[]).map((langKey) => {
            const lang = LANGUAGE_NAMES[langKey];
            const isSelected = langKey === language;
            return (
              <button
                key={langKey}
                onClick={() => setLanguage(langKey)}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all text-left ${
                  isSelected
                    ? 'border-blue-500 bg-blue-500/10 text-white font-medium'
                    : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{lang.flag}</span>
                  <span className="text-sm">{lang.name}</span>
                </div>
                {isSelected && <Check className="h-4 w-4 text-blue-400" />}
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
