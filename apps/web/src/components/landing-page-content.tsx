'use client';

import { useSyncExternalStore } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  MapPin,
  ChevronDown,
  ArrowRight,
} from 'lucide-react';
import { ContactModal } from '@/components/contact-modal';
import { CookieSettingsButton } from '@/components/cookie-banner';
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
      {/* HEADER ÉPURÉ SANS LOGO POLLUANT */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 max-w-6xl mx-auto backdrop-blur-md bg-black/40 border-b border-white/[0.06] rounded-b-2xl transition-all">
        <Link
          href="/"
          className="font-bold text-xl tracking-tight text-white hover:opacity-90 transition-opacity"
        >
          Life-Track
        </Link>
        <div className="flex items-center gap-3">
          <LanguageSelector
            variant="outline"
            className="border-white/10 text-white hover:bg-white/10"
          />
          <Button
            size="sm"
            variant="ghost"
            className="text-xs font-semibold text-white/70 hover:text-white hover:bg-white/10 rounded-xl"
            asChild
          >
            <Link href="/login">{t('landing_login_btn')}</Link>
          </Button>
          <Button
            size="sm"
            className="relative hidden sm:inline-flex text-xs font-semibold bg-white text-black hover:bg-white/90 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(255,255,255,0.35)] transition-all"
            asChild
          >
            <Link href="/register">{t('landing_hero_cta')}</Link>
          </Button>
        </div>
      </header>

      <main
        className="min-h-screen bg-[#030305] text-white selection:bg-blue-500/30 overflow-hidden relative"
        suppressHydrationWarning
      >
        {/* HALOS LUMINEUX GEMINI (Bleu profond + Violet IA) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Halo central principal */}
          <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[650px] sm:w-[850px] h-[350px] sm:h-[450px] rounded-full bg-gradient-to-tr from-blue-600/20 via-indigo-500/25 to-purple-600/20 blur-[130px] opacity-80 animate-pulse duration-1000" />

          {/* Faisceau supérieur */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

          {/* Halos latéraux d'ambiance */}
          <div className="absolute top-[40%] right-[-10%] w-[300px] h-[300px] rounded-full bg-blue-600/10 blur-[100px]" />
          <div className="absolute top-[60%] left-[-10%] w-[300px] h-[300px] rounded-full bg-purple-600/10 blur-[100px]" />
        </div>

        {/* HERO SECTION MINIMALISTE & PUISSANTE */}
        <section className="relative z-10 px-6 pt-36 sm:pt-44 pb-20 text-center space-y-8 max-w-4xl mx-auto">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-[-0.04em] leading-[1.1] text-white">
            {t('landing_hero_title_1')} <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              {t('landing_hero_title_2')}
            </span>
          </h1>

          <p className="max-w-xl text-white/60 text-base sm:text-lg mx-auto leading-relaxed text-balance font-normal">
            {t('landing_hero_subtitle')}
          </p>

          {/* Bouton CTA avec Glow moderne */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              size="lg"
              className="h-12 px-8 rounded-xl text-sm font-semibold transition-all duration-300 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:shadow-[0_0_40px_rgba(37,99,235,0.6)] border border-blue-400/30 group"
              asChild
            >
              <Link href="/register" className="flex items-center gap-2">
                <span>{t('landing_hero_cta')}</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </section>

        {/* TRUST SECTION : CARTES GLASSMORPHISM */}
        <section className="relative z-10 max-w-5xl mx-auto px-6 py-24 border-t border-white/[0.06]">
          <h2 className="sr-only">{t('landing_trust_title')}</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Carte Sécurité */}
            <div className="group relative rounded-2xl border border-white/[0.08] bg-white/[0.02] p-7 backdrop-blur-sm transition-all duration-300 hover:border-blue-500/40 hover:bg-blue-500/[0.03] hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]">
              <div className="h-11 w-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                <Lock className="h-5 w-5 text-blue-400" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-2">
                {t('landing_security_title')}
              </h3>
              <p className="text-sm text-white/50 leading-relaxed group-hover:text-white/70 transition-colors">
                {t('landing_security_desc')}
              </p>
            </div>

            {/* Carte Confidentialité */}
            <div className="group relative rounded-2xl border border-white/[0.08] bg-white/[0.02] p-7 backdrop-blur-sm transition-all duration-300 hover:border-emerald-500/40 hover:bg-emerald-500/[0.03] hover:shadow-[0_0_30px_rgba(16,185,129,0.1)]">
              <div className="h-11 w-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-2">
                {t('landing_privacy_title')}
              </h3>
              <p className="text-sm text-white/50 leading-relaxed group-hover:text-white/70 transition-colors">
                {t('landing_privacy_desc')}
              </p>
            </div>

            {/* Carte Souveraineté */}
            <div className="group relative rounded-2xl border border-white/[0.08] bg-white/[0.02] p-7 backdrop-blur-sm transition-all duration-300 hover:border-purple-500/40 hover:bg-purple-500/[0.03] hover:shadow-[0_0_30px_rgba(168,85,247,0.1)]">
              <div className="h-11 w-11 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                <MapPin className="h-5 w-5 text-purple-400" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-2">
                {t('landing_sovereignty_title')}
              </h3>
              <p className="text-sm text-white/50 leading-relaxed group-hover:text-white/70 transition-colors">
                {t('landing_sovereignty_desc')}
              </p>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="relative z-10 max-w-3xl mx-auto px-6 py-24">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12 text-white">
            {t('landing_faq_title')}
          </h2>

          <div
            className="w-full divide-y divide-white/[0.08] border-y border-white/[0.08]"
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

      {/* FOOTER ÉPURÉ */}
      <footer
        className="relative z-10 border-t border-white/[0.08] py-12 bg-[#030305]"
        suppressHydrationWarning
      >
        <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="text-xs text-white/50 font-medium tracking-tight">
            © {new Date().getFullYear()} Life-Track.{' '}
            {t('landing_footer_rights')}
          </span>

          <div className="flex flex-wrap gap-6 items-center">
            <Link
              href="/cgv"
              className="text-[10px] uppercase tracking-widest text-white/60 hover:text-white transition-colors font-bold"
            >
              {t('landing_footer_cgv')}
            </Link>
            <Link
              href="/confidentialite"
              className="text-[10px] uppercase tracking-widest text-white/60 hover:text-white transition-colors font-bold"
            >
              {t('landing_footer_privacy')}
            </Link>
            <Link
              href="/mentions-legales"
              className="text-[10px] uppercase tracking-widest text-white/60 hover:text-white transition-colors font-bold"
            >
              {t('landing_footer_legal')}
            </Link>
            <CookieSettingsButton />
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
