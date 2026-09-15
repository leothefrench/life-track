'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { deleteUserAccount } from '@/app/actions/user';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  keyword: string;
  t: (key: string) => string;
}

export function DeleteAccountModal({
  isOpen,
  onClose,
  keyword,
  t,
}: DeleteAccountModalProps) {
  const router = useRouter();
  const [confirmationInput, setConfirmationInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDelete = async () => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl dark:bg-zinc-900">
        <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
          <AlertTriangle className="h-6 w-6" />
          <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
            {t('delete_account_confirm_title')}
          </h4>
        </div>

        {/* Contrastes renforcés : zinc-700 / dark:zinc-200 */}
        <p className="mt-3 text-sm text-zinc-700 dark:text-zinc-200 leading-relaxed">
          {t('delete_account_warning')}
        </p>

        <div className="mt-4">
          <label
            htmlFor="confirmation-input"
            className="block text-xs font-semibold text-zinc-800 dark:text-zinc-200"
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
          <div className="mt-3 rounded-md bg-red-50 p-3 text-xs font-medium text-red-700 dark:bg-red-950/50 dark:text-red-300">
            {errorMessage}
          </div>
        )}

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            {t('cancel')}
          </button>
          <button
            type="button"
            onClick={handleDelete}
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
  );
}
