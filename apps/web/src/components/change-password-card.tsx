'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KeyRound, Loader2, CheckCircle2 } from 'lucide-react';
import { changeUserPassword } from '@/app/actions/auth';
import { toast } from 'sonner';
import { useI18n } from '@/lib/i18n/i18n-context';

export function ChangePasswordCard() {
  const [loading, setLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { t } = useI18n();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error(t('password_invalid_length'));
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error(t('password_mismatch'));
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('currentPassword', currentPassword);
    formData.append('newPassword', newPassword);
    formData.append('confirmPassword', confirmPassword);

    try {
      const res = await changeUserPassword(formData);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(t('password_changed_success'));
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch {
      toast.error(t('two_factor_error_toast'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="bg-white/5 border-white/10 shadow-none">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
            <KeyRound className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg text-white font-bold">
              {t('change_password_title')}
            </CardTitle>
            <CardDescription className="text-white/40 text-xs mt-0.5">
              {t('change_password_desc')}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="currentPassword" className="text-xs text-white/80">
              {t('current_password')}
            </Label>
            <Input
              id="currentPassword"
              name="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder={t('current_password_placeholder')}
              required
              className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-10"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="newPassword" className="text-xs text-white/80">
                {t('new_password')}
              </Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={t('new_password_placeholder')}
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-10"
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="confirmPassword"
                className="text-xs text-white/80"
              >
                {t('confirm_password')}
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t('confirm_password_placeholder')}
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-10"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 h-9"
            >
              {loading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
                  {t('updating_password')}
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 mr-2" />
                  {t('change_password_btn')}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
