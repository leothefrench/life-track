'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Globe, Coins } from 'lucide-react';
import {
  useI18n,
  languages,
  currencies,
  Currency,
} from '@/lib/i18n/i18n-context';
import { Language } from '@/lib/i18n/translations';

export function SettingsLanguageCard() {
  const { language, setLanguage, currency, setCurrency, t } = useI18n();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-muted-foreground" />
          <CardTitle>{t('settings_language')}</CardTitle>
        </div>
        <CardDescription>{t('settings_language_desc')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Selecteur de langue */}
        <div className="space-y-2 max-w-xs">
          <label className="text-sm font-medium text-muted-foreground">
            {t('settings_language')}
          </label>
          <Select
            value={language}
            onValueChange={(val) => setLanguage(val as Language)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  <span className="flex items-center gap-2">
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Selecteur de devise */}
        <div className="space-y-2 max-w-xs pt-4 border-t">
          <div className="flex items-center gap-2">
            <Coins className="h-4 w-4 text-muted-foreground" />
            <label className="text-sm font-medium text-muted-foreground">
              {t('settings_currency')}
            </label>
          </div>
          <Select
            value={currency}
            onValueChange={(val) => setCurrency(val as Currency)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  <span className="flex items-center justify-between w-full gap-2">
                    <span>{c.name}</span>
                    <span className="font-semibold text-muted-foreground">
                      {c.symbol}
                    </span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
