'use client';

import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { toggleTwoFactor } from '@/app/actions/auth';
import { toast } from 'sonner';
import { useI18n } from '@/lib/i18n/i18n-context';

export function TwoFactorSwitch({ initialValue }: { initialValue: boolean }) {
  const [enabled, setEnabled] = useState(initialValue);
  const { t } = useI18n();

  const handleToggle = async (checked: boolean) => {
    setEnabled(checked);
    try {
      await toggleTwoFactor(checked);
      toast.success(checked ? t('two_factor_enabled_toast') : t('two_factor_disabled_toast'));
    } catch {
      setEnabled(!checked); // Retour arrière en cas d'erreur
      toast.error(t('two_factor_error_toast'));
    }
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] font-bold text-blue-500 uppercase">
        {enabled ? t('enabled') : t('disabled')}
      </span>
      <Switch checked={enabled} onCheckedChange={handleToggle} />
    </div>
  );
}
