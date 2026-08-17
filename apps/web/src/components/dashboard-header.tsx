'use client';

import { useI18n } from '@/lib/i18n/i18n-context';

export function DashboardHeader({ isPremium }: { isPremium: boolean }) {
  const { t } = useI18n();

  return (
    <div className="space-y-1">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight inline-flex items-center gap-3">
        {t('dashboard_header_title')}
        {isPremium && (
          <span className="text-[10px] bg-amber-400/20 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">
            {t('pro_badge')}
          </span>
        )}
      </h1>
      <p className="text-muted-foreground text-xs md:text-sm">
        {t('dashboard_header_subtitle')}
      </p>
    </div>
  );
}
