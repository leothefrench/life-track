'use client';

import { useSyncExternalStore } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ShieldCheck, Lock, MapPin, ChevronDown } from 'lucide-react';
import { ContactModal } from '@/components/contact-modal';
import { LanguageSelector } from '@/components/language-selector';
import { useI18n } from '@/lib/i18n/i18n-context';

const emptySubscribe = () => () => {};

export function LandingPageContent() {
  const { t } = useI18n();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  return (
    <>
      <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <Link
          href="/"
          className="font-bold text-lg tracking-tight text-white flex items-center gap-2"
        >
          <div className="h-7 w-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-xs shadow-md shadow-blue-500/20">
            LT
          </div>
          <span>Life-Track</span>
        </Link>
        <div className="flex items-center gap-3">
          <LanguageSelector
            variant="outline"
            className="border-white/10 text-white hover:bg-white/10"
          />
          <Button
            size="sm"
            variant="ghost"
            className="text-xs font-semibold text-white/80 hover:text-white hover:bg-white/10 rounded-xl"
            asChild
          >
            <Link href="/login">{t('landing_login_btn')}</Link>
          </Button>
          <Button
            size="sm"
            className="hidden sm:inline-flex text-xs font-semibold bg-white text-black hover:bg-white/90 rounded-xl shadow-sm"
            asChild
          >
            <Link href="/register">{t('landing_hero_cta')}</Link>
          </Button>
        </div>
      </header>

      <main
        className="min-h-screen bg-black text-white selection:bg-blue-500/30 overflow-hidden"
        suppressHydrationWarning
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px]" />
        </div>

        {/* HERO SECTION */}
        <section className="relative z-10 px-6 pt-40 pb-20 text-center space-y-8 max-w-3xl mx-auto">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(120,119,198,0.1)_0,transparent_60%)] pointer-events-none" />
          <h1 className="text-5xl md:text-7xl font-bold tracking-[-0.04em] leading-[1.1] text-white">
            {t('landing_hero_title_1')} <br />
            <span className="text-white/40 font-medium">
              {t('landing_hero_title_2')}
            </span>
          </h1>
          <p className="max-w-xl text-white/50 text-base md:text-lg mx-auto leading-relaxed text-balance">
            {t('landing_hero_subtitle')}
          </p>
          <div className="flex justify-center pt-4">
            <Button
              size="lg"
              className="h-12 px-8 rounded-xl text-sm font-semibold transition-all duration-300 border border-white/10 bg-white/5 hover:bg-white hover:text-black text-white shadow-lg"
              asChild
            >
              <Link href="/register">{t('landing_hero_cta')}</Link>
            </Button>
          </div>
        </section>

        {/* TRUST SECTION */}
        <section className="relative z-10 max-w-5xl mx-auto px-6 py-24 border-t border-white/5">
          <h2 className="sr-only">{t('landing_trust_title')}</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Lock className="h-5 w-5 text-blue-500" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-white">
                {t('landing_security_title')}
              </h3>
              <p className="text-sm text-white/50 leading-relaxed">
                {t('landing_security_desc')}
              </p>
            </div>

            <div className="space-y-4">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-white">
                {t('landing_privacy_title')}
              </h3>
              <p className="text-sm text-white/50 leading-relaxed">
                {t('landing_privacy_desc')}
              </p>
            </div>

            <div className="space-y-4">
              <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-purple-500" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-white">
                {t('landing_sovereignty_title')}
              </h3>
              <p className="text-sm text-white/50 leading-relaxed">
                {t('landing_sovereignty_desc')}
              </p>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="relative z-10 max-w-3xl mx-auto px-6 py-24">
          <h2 className="text-2xl font-bold text-center mb-12">
            {t('landing_faq_title')}
          </h2>

          <div
            className="w-full divide-y divide-white/10 border-y border-white/10"
            suppressHydrationWarning
          >
            <details className="group py-4 text-left transition-all">
              <summary className="flex items-center justify-between text-sm font-medium cursor-pointer list-none text-white/90 hover:text-white select-none">
                <span>{t('landing_faq_q_sync')}</span>
                <ChevronDown className="h-4 w-4 text-white/50 transition-transform duration-200 group-open:rotate-180 shrink-0 ml-4" />
              </summary>
              <div className="pt-3 text-xs text-white/50 leading-relaxed">
                {t('landing_faq_a_sync')}
              </div>
            </details>

            <details className="group py-4 text-left transition-all">
              <summary className="flex items-center justify-between text-sm font-medium cursor-pointer list-none text-white/90 hover:text-white select-none">
                <span>{t('landing_faq_q1')}</span>
                <ChevronDown className="h-4 w-4 text-white/50 transition-transform duration-200 group-open:rotate-180 shrink-0 ml-4" />
              </summary>
              <div className="pt-3 text-xs text-white/50 leading-relaxed">
                {t('landing_faq_a1')}
              </div>
            </details>

            <details className="group py-4 text-left transition-all">
              <summary className="flex items-center justify-between text-sm font-medium cursor-pointer list-none text-white/90 hover:text-white select-none">
                <span>{t('landing_faq_q2')}</span>
                <ChevronDown className="h-4 w-4 text-white/50 transition-transform duration-200 group-open:rotate-180 shrink-0 ml-4" />
              </summary>
              <div className="pt-3 text-xs text-white/50 leading-relaxed">
                {t('landing_faq_a2')}
              </div>
            </details>

            <details className="group py-4 text-left transition-all">
              <summary className="flex items-center justify-between text-sm font-medium cursor-pointer list-none text-white/90 hover:text-white select-none">
                <span>{t('landing_faq_q3')}</span>
                <ChevronDown className="h-4 w-4 text-white/50 transition-transform duration-200 group-open:rotate-180 shrink-0 ml-4" />
              </summary>
              <div className="pt-3 text-xs text-white/50 leading-relaxed">
                {t('landing_faq_a3')}
              </div>
            </details>
          </div>
        </section>
      </main>

      <footer
        className="relative z-10 border-t border-white/5 py-12 bg-black"
        suppressHydrationWarning
      >
        <div className="max-w-3xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="text-xs text-white/60 font-medium tracking-tighter">
            © {new Date().getFullYear()} Life-Track.{' '}
            {t('landing_footer_rights')}
          </span>

          <div className="flex gap-8 items-center">
            <Link
              href="/cgv"
              className="text-[10px] uppercase tracking-widest text-white/60 hover:text-white transition-colors font-bold"
            >
              {t('landing_footer_cgv')}
            </Link>
            {mounted ? (
              <ContactModal />
            ) : (
              <button className="text-[10px] uppercase tracking-widest text-white/60 font-bold">
                {t('nav_support')}
              </button>
            )}
          </div>
        </div>
      </footer>
    </>
  );
}
