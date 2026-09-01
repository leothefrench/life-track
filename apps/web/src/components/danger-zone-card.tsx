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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { AlertTriangle, Trash2, Loader2 } from 'lucide-react';
import { deleteUserAccount } from '@/app/actions/auth';
import { toast } from 'sonner';
import { useI18n } from '@/lib/i18n/i18n-context';

export function DangerZoneCard() {
  const [open, setOpen] = useState(false);
  const [confirmInput, setConfirmInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useI18n();

  const requiredKeyword = t('delete_account_confirm_keyword') || 'SUPPRIMER';
  const isConfirmed =
    confirmInput.trim().toUpperCase() === requiredKeyword.toUpperCase();

  async function handleDelete() {
    if (!isConfirmed) return;
    setLoading(true);
    try {
      const res = await deleteUserAccount();
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success(t('delete_account_success'));
      }
    } catch {
      toast.error('Erreur lors de la suppression du compte.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="bg-rose-500/5 border-rose-500/20 shadow-none">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg text-rose-400 font-bold">
              {t('danger_zone_title')}
            </CardTitle>
            <CardDescription className="text-rose-300/60 text-xs mt-0.5">
              {t('danger_zone_desc')}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-rose-950/20 rounded-xl border border-rose-500/10">
          <div className="space-y-1 max-w-md">
            <p className="text-sm font-medium text-rose-200">
              {t('delete_account_title')}
            </p>
            <p className="text-xs text-rose-300/60">
              {t('delete_account_desc')}
            </p>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                variant="destructive"
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold h-9 px-4 shrink-0"
              >
                <Trash2 className="h-3.5 w-3.5 mr-2" />
                {t('delete_account_btn')}
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0b0f19] border-white/10 text-white sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-rose-400 font-bold flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  {t('delete_account_confirm_title')}
                </DialogTitle>
                <DialogDescription className="text-white/60 text-xs pt-2 leading-relaxed">
                  {t('delete_account_warning')}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3 py-3">
                <p className="text-xs text-white/80 font-medium">
                  {t('delete_account_confirm_desc')}
                </p>
                <Input
                  value={confirmInput}
                  onChange={(e) => setConfirmInput(e.target.value)}
                  placeholder={t('delete_account_confirm_input_placeholder')}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-10 font-mono text-sm"
                />
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="border-white/10 bg-white/5 text-white hover:bg-white/10 text-xs"
                >
                  {t('cancel')}
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  disabled={!isConfirmed || loading}
                  onClick={handleDelete}
                  className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
                      {t('deleting_account')}
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-3.5 w-3.5 mr-2" />
                      {t('delete_account_btn')}
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
