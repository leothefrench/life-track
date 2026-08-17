'use client';

import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n/i18n-context';

export function SettingsHeader() {
  const { t } = useI18n();

  return (
    <div>
      <Button
        variant="ghost"
        size="sm"
        asChild
        className="-ml-2 mb-4 text-white/50 hover:text-white transition-colors"
      >
        <Link href="/dashboard" className="flex items-center gap-1">
          <ChevronLeft className="h-4 w-4" />
          {t('dashboard_header_title')}
        </Link>
      </Button>
      <h1 className="text-3xl font-bold tracking-tight text-white text-center md:text-left">
        {t('settings_title')}
      </h1>
      <p className="text-white/50 text-sm text-center md:text-left">
        {t('settings_subtitle')}
      </p>
    </div>
  );
}
