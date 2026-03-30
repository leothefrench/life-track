'use client';

import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { toggleTwoFactor } from '@/app/actions/auth';
import { toast } from 'sonner';

export function TwoFactorSwitch({ initialValue }: { initialValue: boolean }) {
  const [enabled, setEnabled] = useState(initialValue);

  const handleToggle = async (checked: boolean) => {
    setEnabled(checked);
    try {
      await toggleTwoFactor(checked);
      toast.success(checked ? '2FA activé' : '2FA désactivé');
    } catch {
      setEnabled(!checked); // Retour arrière en cas d'erreur
      toast.error('Erreur lors de la modification');
    }
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] font-bold text-blue-500 uppercase">
        {enabled ? 'Activé' : 'Désactivé'}
      </span>
      <Switch checked={enabled} onCheckedChange={handleToggle} />
    </div>
  );
}
