'use client';

import { useRouter } from 'next/navigation';
import {
  ChevronLeft,
  Scale,
  Building2,
  Server,
  ShieldCheck,
  Mail,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageSelector } from '@/components/language-selector';
import { useI18n } from '@/lib/i18n/i18n-context';

export default function MentionsLegales() {
  const router = useRouter();
  const { t } = useI18n();

  return (
    <main className="max-w-4xl mx-auto py-16 px-6 text-white/80 leading-relaxed">
      {/* HEADER BAR */}
      <div className="flex items-center justify-between mb-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="-ml-4 text-white/60 hover:text-white hover:bg-white/5 transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          {t('legal_back')}
        </Button>
        <LanguageSelector />
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight">
        {t('legal_title')}
      </h1>

      {/* BANDEAU CLAUSE DE PRIMAUTÉ JURIDIQUE */}
      <div className="mb-8 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-200 flex items-start gap-3">
        <Scale className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <span className="font-bold uppercase tracking-wider text-blue-300 block">
            {t('legal_precedence_badge')}
          </span>
          <p className="text-white/80 leading-relaxed">
            {t('legal_precedence_text')}
          </p>
        </div>
      </div>

      <section className="space-y-8 text-sm text-white/75">
        {/* SECTION 1: ÉDITEUR */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-white">
              {t('legal_section1_title')}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
            <div>
              <span className="text-xs text-white/40 block">
                {t('legal_section1_name')}
              </span>
              <span className="text-white/90 font-medium">
                {t('legal_section1_name_val')}
              </span>
            </div>
            <div>
              <span className="text-xs text-white/40 block">
                {t('legal_section1_dir')}
              </span>
              <span className="text-white/90 font-medium">
                {t('legal_section1_dir_val')}
              </span>
            </div>
            <div>
              <span className="text-xs text-white/40 block">
                {t('legal_section1_address')}
              </span>
              <span className="text-white/90 font-medium">
                {t('legal_section1_address_val')}
              </span>
            </div>
            <div>
              <span className="text-xs text-white/40 block">
                {t('legal_section1_siret')}
              </span>
              <span className="text-white/90 font-medium">
                {t('legal_section1_siret_val')}
              </span>
            </div>
            <div className="sm:col-span-2">
              <span className="text-xs text-white/40 block">
                {t('legal_section1_email')}
              </span>
              <a
                href={`mailto:${t('legal_section1_email_val')}`}
                className="text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-1.5 font-medium"
              >
                <Mail className="h-3.5 w-3.5" />
                {t('legal_section1_email_val')}
              </a>
            </div>
          </div>
        </div>

        {/* SECTION 2: HÉBERGEMENT */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Server className="h-5 w-5 text-purple-400" />
            <h2 className="text-lg font-semibold text-white">
              {t('legal_section2_title')}
            </h2>
          </div>
          <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-2">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-semibold text-white">
                {t('legal_section2_host_val')}
              </span>
              <a
                href="https://vercel.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-400 hover:text-blue-300 underline"
              >
                https://vercel.com
              </a>
            </div>
            <p className="text-white/60 text-xs">
              {t('legal_section2_host_address_val')}
            </p>
          </div>
        </div>

        {/* SECTION 3: PROPRIÉTÉ INTELLECTUELLE */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            <h2 className="text-lg font-semibold text-white">
              {t('legal_section3_title')}
            </h2>
          </div>
          <p className="leading-relaxed">{t('legal_section3_desc')}</p>
        </div>

        {/* SECTION 4: DROIT APPLICABLE */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-white">
            {t('legal_section4_title')}
          </h2>
          <p className="leading-relaxed">{t('legal_section4_desc')}</p>
        </div>
      </section>
    </main>
  );
}
