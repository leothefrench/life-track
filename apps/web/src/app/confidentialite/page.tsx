'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft, Scale, Shield, Lock, EyeOff, Trash2, Server, HelpCircle, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageSelector } from '@/components/language-selector';
import { useI18n } from '@/lib/i18n/i18n-context';

export default function PrivacyPage() {
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
          {t('privacy_back')}
        </Button>
        <LanguageSelector />
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight">
        {t('privacy_title')}
      </h1>

      {/* BANDEAU CLAUSE DE PRIMAUTÉ JURIDIQUE */}
      <div className="mb-8 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-200 flex items-start gap-3">
        <Scale className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <span className="font-bold uppercase tracking-wider text-blue-300 block">
            {t('privacy_legal_precedence_badge')}
          </span>
          <p className="text-white/80 leading-relaxed">
            {t('privacy_legal_precedence_text')}
          </p>
        </div>
      </div>

      <section className="space-y-8 text-sm text-white/75">
        {/* SECTION 1: ENGAGEMENT RGPD & RESPONSABLE */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-emerald-400" />
            <h2 className="text-lg font-semibold text-white">
              {t('privacy_sec1_title')}
            </h2>
          </div>
          <p className="leading-relaxed">
            {t('privacy_sec1_desc')}
          </p>
          <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-1 text-xs">
            <p><strong className="text-white">{t('privacy_sec1_resp_label')}:</strong> {t('privacy_sec1_resp_val')}</p>
            <p><strong className="text-white">{t('privacy_sec1_contact_label')}:</strong> <a href="mailto:leandro.dasilva@bbox.fr" className="text-blue-400 hover:underline">leandro.dasilva@bbox.fr</a></p>
          </div>
        </div>

        {/* SECTION 2: DONNÉES COLLECTÉES ET ANONYMISATION */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <EyeOff className="h-5 w-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-white">
              {t('privacy_sec2_title')}
            </h2>
          </div>
          <p className="leading-relaxed">
            {t('privacy_sec2_desc')}
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-1">
              <span className="text-white font-medium text-xs block">{t('privacy_sec2_item1_title')}</span>
              <p className="text-xs text-white/70">{t('privacy_sec2_item1_desc')}</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-1">
              <span className="text-white font-medium text-xs block">{t('privacy_sec2_item2_title')}</span>
              <p className="text-xs text-white/70">{t('privacy_sec2_item2_desc')}</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-1">
              <span className="text-white font-medium text-xs block">{t('privacy_sec2_item3_title')}</span>
              <p className="text-xs text-white/70">{t('privacy_sec2_item3_desc')}</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-1">
              <span className="text-white font-medium text-xs block">{t('privacy_sec2_item4_title')}</span>
              <p className="text-xs text-white/70">{t('privacy_sec2_item4_desc')}</p>
            </div>
          </div>
        </div>

        {/* SECTION 3: SÉCURITÉ & SOUS-TRAITANTS CERTIFIÉS */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-purple-400" />
            <h2 className="text-lg font-semibold text-white">
              {t('privacy_sec3_title')}
            </h2>
          </div>
          <p className="leading-relaxed">
            {t('privacy_sec3_desc')}
          </p>
          <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-2 text-xs">
            <div className="flex items-start gap-2">
              <Server className="h-4 w-4 text-purple-300 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">{t('privacy_sec3_sub1_title')}:</strong> {t('privacy_sec3_sub1_desc')}
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Server className="h-4 w-4 text-purple-300 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">{t('privacy_sec3_sub2_title')}:</strong> {t('privacy_sec3_sub2_desc')}
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Server className="h-4 w-4 text-purple-300 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">{t('privacy_sec3_sub3_title')}:</strong> {t('privacy_sec3_sub3_desc')}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: CONSERVATION ET SUPPRESSION (DROIT À L'OUBLI) */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-amber-400" />
            <h2 className="text-lg font-semibold text-white">
              {t('privacy_sec4_title')}
            </h2>
          </div>
          <p className="leading-relaxed">
            {t('privacy_sec4_desc')}
          </p>
        </div>

        {/* SECTION 5: VOS DROITS ET CONTACT CNIL */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-white">
              {t('privacy_sec5_title')}
            </h2>
          </div>
          <p className="leading-relaxed">
            {t('privacy_sec5_desc')}
          </p>
          <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-2 text-xs">
            <p><strong className="text-white">{t('privacy_sec5_exercise_label')}:</strong> {t('privacy_sec5_exercise_val')}</p>
            <p className="text-white/60">{t('privacy_sec5_cnil_info')}</p>
          </div>
        </div>
      </section>

      {/* FOOTER CONTACT */}
      <div className="mt-12 pt-8 border-t border-white/10 text-xs text-white/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span>Life-Track © {new Date().getFullYear()} — DA SILVA COSTA Léandro José EI</span>
        <a
          href="mailto:leandro.dasilva@bbox.fr"
          className="text-white/60 hover:text-white transition-colors inline-flex items-center gap-1"
        >
          <Mail className="h-3.5 w-3.5" />
          leandro.dasilva@bbox.fr
        </a>
      </div>
    </main>
  );
}
