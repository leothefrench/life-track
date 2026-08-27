'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { registerUser } from '@/app/actions/auth';
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
import Link from 'next/link';
import { useI18n } from '@/lib/i18n/i18n-context';

export function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useI18n();

  async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);

    const email = (formData.get('email') as string).trim().toLowerCase();
    const name = (formData.get('name') as string).trim();
    const password = (formData.get('password') as string).trim();

    formData.set('email', email);
    formData.set('name', name);
    formData.set('password', password);

    const result = await registerUser(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">{t('auth_register_title')}</CardTitle>
        <CardDescription>{t('auth_register_desc')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('auth_name_label')}</Label>
            <Input
              id="name"
              name="name"
              placeholder={t('auth_name_placeholder')}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t('auth_email_label')}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder={t('auth_email_placeholder')}
              autoCapitalize="none"
              autoComplete="email"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t('auth_password_min_label')}</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={
                  showPassword
                    ? t('auth_hide_password')
                    : t('auth_show_password')
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t('auth_creating_account') : t('auth_register_btn')}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm space-y-2">
          <div>
            {t('auth_already_have_account')}{' '}
            <Link
              href="/login"
              className="underline hover:text-primary transition-colors"
            >
              {t('auth_login_btn')}
            </Link>
          </div>
          <div>
            <Link
              href="/"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors underline"
            >
              {t('auth_back_home')}
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
