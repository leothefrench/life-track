'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TwoFactorSwitch } from '@/components/two-factor-switch';
import { useI18n } from '@/lib/i18n/i18n-context';

export function SecurityCard({ initialValue }: { initialValue: boolean }) {
  const { t } = useI18n();

  return (
    <Card className="bg-white/5 border-white/10 shadow-none">
      <CardHeader>
        <CardTitle className="text-lg text-white font-bold">
          {t('security')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between p-4 bg-white/[0.03] rounded-xl border border-white/5">
          <div className="space-y-1">
            <p className="text-sm font-medium text-white">
              {t('two_factor_title')}
            </p>
            <p className="text-[11px] text-white/40">
              {t('two_factor_code_email')}
            </p>
          </div>
          <TwoFactorSwitch initialValue={initialValue} />
        </div>
      </CardContent>
    </Card>
  );
}
