'use client';

import React from 'react';
import { useI18n } from '@/lib/i18n/i18n-context';

interface CookieSettingsButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export function CookieSettingsButton({
  className,
  children,
}: CookieSettingsButtonProps) {
  const { t } = useI18n();

  const handleOpen = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-cookie-settings'));
    }
  };

  return (
    <button
      type="button"
      onClick={handleOpen}
      className={
        className ||
        'text-[10px] uppercase tracking-widest text-white/70 hover:text-white font-bold'
      }
    >
      {children || t('cookies_footer_btn')}
    </button>
  );
}
