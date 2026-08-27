'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useI18n } from '@/lib/i18n/i18n-context';
import { LANGUAGE_NAMES, Language } from '@/lib/i18n/translations';
import { currencies, Currency } from '@/lib/i18n/i18n-context';
import { Globe, Check, Coins } from 'lucide-react';

export function SettingsLanguageCard() {
  const { language, setLanguage, currency, setCurrency, t } = useI18n();

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
      <CardContent className="space-y-6">
        {/* Choix de la langue */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-white/60">
            {t('language_select_label')}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(Object.keys(LANGUAGE_NAMES) as Language[]).map((langKey) => {
              const lang = LANGUAGE_NAMES[langKey];
              const isSelected = langKey === language;
              return (
                <button
                  type="button"
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
        </div>

        {/* Choix de la devise */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 flex items-center gap-1.5 pt-2">
            <Coins className="h-3.5 w-3.5 text-blue-400" />
            {t('currency_select_label')}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {currencies.map((cur) => {
              const isSelected = cur.code === currency;
              return (
                <button
                  type="button"
                  key={cur.code}
                  onClick={() => setCurrency(cur.code as Currency)}
                  className={`flex items-center justify-between p-2.5 rounded-lg border transition-all text-left ${
                    isSelected
                      ? 'border-blue-500 bg-blue-500/10 text-white font-medium'
                      : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-white">
                      {cur.code}
                    </span>
                    <span className="text-[10px] text-white/50 truncate">
                      {cur.name.split(' ')[0]}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-blue-400">
                    {cur.symbol}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
