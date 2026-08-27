'use client';

import { useState } from 'react';
import { resetPasswordAction } from '@/app/actions/reset';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from 'sonner';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n/i18n-context';

export function ResetForm() {
  const [loading, setLoading] = useState(false);
  const { t } = useI18n();

  async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const result = await resetPasswordAction(formData);

    if (result?.success) {
      toast.success(result.success);
    } else {
      toast.error(result?.error || 'Une erreur est survenue');
    }

    setLoading(false);
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{t('auth_reset_title')}</CardTitle>
        <CardDescription>{t('auth_reset_desc')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t('auth_email_label')}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder={t('auth_email_placeholder')}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t('auth_sending') : t('auth_send_link_btn')}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm text-muted-foreground">
          <Link href="/login" className="hover:text-primary underline">
            {t('auth_back_to_login')}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
