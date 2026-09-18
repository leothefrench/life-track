'use client';

import Link from 'next/link';
import { ShieldCheck, Cookie, SlidersHorizontal, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CookieBannerUIProps {
  onCustomize: () => void;
  onRejectAll: () => void;
  onAcceptAll: () => void;
  t: (key: any) => string;
}

export function CookieBannerUI({
  onCustomize,
  onRejectAll,
  onAcceptAll,
  t,
}: CookieBannerUIProps) {
  return (
    <aside className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6 bg-linear-to-t from-black via-black/95 to-transparent pointer-events-none">
      <div className="max-w-4xl mx-auto pointer-events-auto bg-[#0d121f]/95 border border-blue-500/20 shadow-2xl backdrop-blur-xl rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Cookie className="h-5 w-5" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold tracking-wider uppercase text-blue-400">
                  {t('cookies_banner_badge')}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-medium px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                  <ShieldCheck className="h-3 w-3" /> RGPD & CNIL
                </span>
              </div>
              <h3 className="text-base font-bold text-white">
                {t('cookies_banner_title')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 max-w-2xl">
                {t('cookies_banner_desc')}{' '}
                <Link
                  href="/confidentialite"
                  className="text-blue-400 underline hover:text-blue-300"
                >
                  {t('cookies_policy_link')}
                </Link>
                .
              </p>
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={onCustomize}
              className="border-white/10 text-slate-200 rounded-xl text-xs h-10 px-3.5"
            >
              <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5 text-slate-300" />
              {t('cookies_customize')}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRejectAll}
              className="text-slate-300 hover:text-white rounded-xl text-xs h-10 px-3.5"
            >
              {t('cookies_reject_all')}
            </Button>
            <Button
              size="sm"
              onClick={onAcceptAll}
              className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs h-10 px-4"
            >
              <Check className="h-3.5 w-3.5 mr-1.5" />
              {t('cookies_accept_all')}
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}
