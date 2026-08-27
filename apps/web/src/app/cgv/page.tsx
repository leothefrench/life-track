'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft, Scale, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageSelector } from '@/components/language-selector';
import { useI18n } from '@/lib/i18n/i18n-context';

export default function CGVPage() {
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
          {t('cgv_back')}
        </Button>
        <LanguageSelector />
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight">
        {t('cgv_title')}
      </h1>

      {/* BANDEAU CLAUSE DE PRIMAUTÉ JURIDIQUE */}
      <div className="mb-8 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-200 flex items-start gap-3">
        <Scale className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <span className="font-bold uppercase tracking-wider text-blue-300 block">
            {t('cgv_legal_precedence_badge')}
          </span>
          <p className="text-white/80 leading-relaxed">
            {t('cgv_legal_precedence_text')}
          </p>
        </div>
      </div>

      <section className="space-y-8 text-sm text-white/75">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-white">
            {t('cgv_section1_title')}
          </h2>
          <p className="leading-relaxed">{t('cgv_section1_desc')}</p>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-white">
            {t('cgv_section2_title')}
          </h2>
          <p className="leading-relaxed">{t('cgv_section2_desc')}</p>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-white">
            {t('cgv_section3_title')}
          </h2>
          <p className="leading-relaxed">{t('cgv_section3_desc')}</p>
        </div>

        {/* SECTION 4: RENONCIATION AU DROIT DE RÉTRACTATION */}
        <div className="bg-white/5 p-5 rounded-xl border border-white/10 space-y-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-amber-400" />
            <h2 className="text-lg font-semibold text-white">
              {t('cgv_section4_title')}
            </h2>
          </div>
          <p className="text-white/85 leading-relaxed">
            {t('cgv_section4_desc')}
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-white">
            {t('cgv_section5_title')}
          </h2>
          <p className="leading-relaxed">{t('cgv_section5_desc')}</p>
          <p className="text-xs text-white/50 italic leading-relaxed">
            {t('cgv_section5_sub')}
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-white">
            {t('cgv_section6_title')}
          </h2>
          <p className="leading-relaxed">{t('cgv_section6_desc')}</p>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-white">
            {t('cgv_section7_title')}
          </h2>
          <p className="leading-relaxed">{t('cgv_section7_desc')}</p>
        </div>
      </section>
    </main>
  );
}
