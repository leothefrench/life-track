'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { deleteUserAccount } from '@/app/actions/user';
import {
  AlertTriangle,
  Lock,
  ExternalLink,
  ShieldCheck,
  Trash2,
  Loader2,
} from 'lucide-react';
import { useI18n } from '@/lib/i18n/i18n-context';

interface DangerZoneCardProps {
  hasActiveSubscription?: boolean;
  subscriptionEndDate?: string | Date | null;
  cancelAtPeriodEnd?: boolean;
}

export function DangerZoneCard({
  hasActiveSubscription = false,
  subscriptionEndDate,
  cancelAtPeriodEnd = false,
}: DangerZoneCardProps) {
  const router = useRouter();
  const { t, language } = useI18n();

  const [isOpen, setIsOpen] = useState(false);
  const [confirmationInput, setConfirmationInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Dictionnaire spécifique pour les textes de verrouillage Stripe selon les 5 langues
  const stripeLockDict = {
    fr: {
      subActive: 'Abonnement Pro actuellement actif',
      subCancelled: 'Renouvellement résilié — Période payée en cours',
      descPrefix: 'Vous avez réglé votre abonnement jusqu’au',
      descSuffix:
        'Afin de garantir que vous profitiez de l’intégralité du temps payé, la suppression de compte est temporairement indisponible.',
      manageBilling: 'Gérer la facturation dans Stripe',
      lockedBtn: 'Suppression verrouillée pendant l’abonnement',
      confirmKeyword: 'SUPPRIMER',
    },
    en: {
      subActive: 'Pro subscription currently active',
      subCancelled: 'Renewal cancelled — Paid period in progress',
      descPrefix: 'Your subscription is paid until',
      descSuffix:
        'To ensure you enjoy the full duration of your paid plan, account deletion is temporarily disabled.',
      manageBilling: 'Manage billing in Stripe',
      lockedBtn: 'Deletion locked during subscription',
      confirmKeyword: 'DELETE',
    },
    de: {
      subActive: 'Pro-Abonnement derzeit aktiv',
      subCancelled: 'Verlängerung gekündigt — Bezahlter Zeitraum läuft',
      descPrefix: 'Sie haben Ihr Abonnement bezahlt bis zum',
      descSuffix:
        'Damit Sie die bezahlte Zeit voll nutzen können, ist die Kontolöschung vorübergehend deaktiviert.',
      manageBilling: 'Abrechnung in Stripe verwalten',
      lockedBtn: 'Löschung während des Abonnements gesperrt',
      confirmKeyword: 'LÖSCHEN',
    },
    es: {
      subActive: 'Suscripción Pro actualmente activa',
      subCancelled: 'Renovación cancelada — Periodo pagado en curso',
      descPrefix: 'Ha pagado su suscripción hasta el',
      descSuffix:
        'Para garantizar que disfrute de todo el tiempo pagado, la eliminación de cuenta está temporalmente deshabilitada.',
      manageBilling: 'Gestionar facturación en Stripe',
      lockedBtn: 'Eliminación bloqueada durante la suscripción',
      confirmKeyword: 'ELIMINAR',
    },
    pt: {
      subActive: 'Subscrição Pro atualmente ativa',
      subCancelled: 'Renovação cancelada — Período pago em curso',
      descPrefix: 'Pagou a sua subscrição até',
      descSuffix:
        'Para garantir que aproveita todo o período pago, a eliminação da conta está temporariamente indisponível.',
      manageBilling: 'Gerir faturação no Stripe',
      lockedBtn: 'Eliminação bloqueada durante a subscrição',
      confirmKeyword: 'ELIMINAR',
    },
  };

  const currentLockText =
    stripeLockDict[(language as keyof typeof stripeLockDict) || 'fr'] ||
    stripeLockDict.fr;
  const keyword =
    t('delete_account_confirm_keyword') || currentLockText.confirmKeyword;

  // Formatage de la date selon la langue choisie
  const localeFormat =
    language === 'en'
      ? 'en-US'
      : language === 'de'
      ? 'de-DE'
      : language === 'es'
      ? 'es-ES'
      : language === 'pt'
      ? 'pt-PT'
      : 'fr-FR';
  const formattedDate = subscriptionEndDate
    ? new Intl.DateTimeFormat(localeFormat, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date(subscriptionEndDate))
    : null;

  const handleDeleteAccount = async () => {
    if (confirmationInput.trim() !== keyword) return;

    setLoading(true);
    setErrorMessage(null);

    try {
      const result = await deleteUserAccount();

      if (!result.success) {
        setErrorMessage(
          result.error ||
            t('error') ||
            'Une erreur est survenue lors de la suppression.',
        );
        setLoading(false);
        return;
      }

      await signOut({ callbackUrl: '/' });
      router.push('/');
    } catch {
      setErrorMessage(t('error') || 'Une erreur imprévue est survenue.');
      setLoading(false);
    }
  };

  return (
    <div
      id="danger-zone-section"
      className="rounded-xl border border-red-200 bg-white p-6 shadow-sm dark:border-red-950/40 dark:bg-zinc-900"
    >
      <div className="flex items-start gap-4">
        <div className="rounded-lg bg-red-100 p-2.5 text-red-600 dark:bg-red-950/50 dark:text-red-400">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            {t('danger_zone_title')}
          </h3>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {t('danger_zone_desc')}
          </p>

          {/* CAS 1 : Utilisateur avec abonnement en cours ou période payée restante */}
          {hasActiveSubscription ? (
            <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <p className="font-medium">
                    {cancelAtPeriodEnd
                      ? currentLockText.subCancelled
                      : currentLockText.subActive}
                  </p>
                  <p className="text-xs leading-relaxed text-amber-800 dark:text-amber-300">
                    {currentLockText.descPrefix}{' '}
                    <span className="font-semibold text-amber-950 dark:text-amber-100">
                      {formattedDate ?? 'la fin de période'}
                    </span>
                    . {currentLockText.descSuffix}
                  </p>
                  <div className="pt-1 flex flex-wrap items-center gap-3">
                    <Link
                      href="/pricing"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-900 underline underline-offset-2 hover:text-amber-700 dark:text-amber-200 dark:hover:text-amber-100"
                    >
                      {currentLockText.manageBilling}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>

              <div className="mt-4 border-t border-amber-200/60 pt-3 dark:border-amber-900/40">
                <button
                  type="button"
                  disabled
                  className="inline-flex items-center gap-2 cursor-not-allowed rounded-lg bg-zinc-200 px-4 py-2.5 text-xs font-medium text-zinc-500 opacity-80 dark:bg-zinc-800 dark:text-zinc-500"
                >
                  <Lock className="h-3.5 w-3.5" />
                  {currentLockText.lockedBtn}
                </button>
              </div>
            </div>
          ) : (
            /* CAS 2 : Utilisateur gratuit ou période payée expirée */
            <div className="mt-5">
              <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:bg-red-700 dark:hover:bg-red-800"
              >
                <Trash2 className="h-4 w-4" />
                {t('delete_account_btn')}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MODAL DE CONFIRMATION STRICTE */}
      {isOpen && !hasActiveSubscription && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl dark:bg-zinc-900">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
              <AlertTriangle className="h-6 w-6" />
              <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                {t('delete_account_confirm_title')}
              </h4>
            </div>

            <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {t('delete_account_warning')}
            </p>

            <div className="mt-4">
              <label
                htmlFor="confirmation-input"
                className="block text-xs font-medium text-zinc-700 dark:text-zinc-300"
              >
                {t('delete_account_confirm_desc')}
              </label>
              <input
                id="confirmation-input"
                type="text"
                value={confirmationInput}
                onChange={(e) => setConfirmationInput(e.target.value)}
                placeholder={keyword}
                className="mt-2 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>

            {errorMessage && (
              <div className="mt-3 rounded-md bg-red-50 p-3 text-xs text-red-700 dark:bg-red-950/50 dark:text-red-300">
                {errorMessage}
              </div>
            )}

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setConfirmationInput('');
                  setErrorMessage(null);
                }}
                disabled={loading}
                className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              >
                {t('cancel')}
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={confirmationInput.trim() !== keyword || loading}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-700 dark:hover:bg-red-800"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t('deleting_account')}
                  </>
                ) : (
                  t('delete_account_btn')
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
