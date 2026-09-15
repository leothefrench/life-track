'use client';

import Link from 'next/link';
import {
  Lock,
  BarChart3,
  Settings,
  SlidersHorizontal,
  Info,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface CookieModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  analytics: boolean;
  setAnalytics: (val: boolean) => void;
  preferences: boolean;
  setPreferences: (val: boolean) => void;
  onSave: () => void;
  t: (key: string) => string;
}

export function CookieModal({
  open,
  onOpenChange,
  analytics,
  setAnalytics,
  preferences,
  setPreferences,
  onSave,
  t,
}: CookieModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl bg-[#0b0f19] border-white/10 text-white p-6 rounded-2xl shadow-2xl">
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <SlidersHorizontal className="h-4 w-4" />
            </div>
            <DialogTitle className="text-lg font-bold text-white">
              {t('cookies_modal_title')}
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs sm:text-sm text-slate-300">
            {t('cookies_modal_subtitle')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-3">
          {/* 1. Essentiels */}
          <div className="p-3.5 rounded-xl bg-white/3 border border-white/5 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="h-7 w-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                <Lock className="h-3.5 w-3.5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-white">
                    {t('cookies_essential_title')}
                  </h4>
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {t('cookies_essential_badge')}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {t('cookies_essential_desc')}
                </p>
              </div>
            </div>
            <Switch
              checked={true}
              disabled
              aria-label={t('cookies_essential_title')}
            />
          </div>

          {/* 2. Analytics */}
          <div className="p-3.5 rounded-xl bg-white/3 border border-white/5 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="h-7 w-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                <BarChart3 className="h-3.5 w-3.5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-white">
                  {t('cookies_analytics_title')}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {t('cookies_analytics_desc')}
                </p>
              </div>
            </div>
            <Switch
              checked={analytics}
              onCheckedChange={setAnalytics}
              aria-label={t('cookies_analytics_title')}
            />
          </div>

          {/* 3. Préférences */}
          <div className="p-3.5 rounded-xl bg-white/3 border border-white/5 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="h-7 w-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                <Settings className="h-3.5 w-3.5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-white">
                  {t('cookies_preferences_title')}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {t('cookies_preferences_desc')}
                </p>
              </div>
            </div>
            <Switch
              checked={preferences}
              onCheckedChange={setPreferences}
              aria-label={t('cookies_preferences_title')}
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <Link
            href="/confidentialite"
            onClick={() => onOpenChange(false)}
            className="text-xs text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors inline-flex items-center gap-1"
          >
            <Info className="h-3 w-3" />
            {t('cookies_policy_link')}
          </Link>
          <Button
            type="button"
            onClick={onSave}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs h-9 px-4"
          >
            <Check className="h-3.5 w-3.5 mr-1.5" />
            {t('cookies_save_selection')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
