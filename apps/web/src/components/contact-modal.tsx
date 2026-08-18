'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { sendContactEmail } from '@/app/actions/contact';
import { useI18n } from '@/lib/i18n/i18n-context';

export function ContactModal({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();

  async function handleSubmit(formData: FormData) {
    const result = await sendContactEmail(formData);
    if (result.success) {
      toast.success(t('contact_success_toast'));
      setOpen(false);
    } else {
      toast.error(t('contact_error_toast'));
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* Si on passe un bouton spécifique, on l'affiche, sinon bouton par défaut */}
        {children || (
          <button className="text-[10px] uppercase tracking-widest text-white/60 hover:text-white transition-colors font-bold">
            {t('nav_support')}
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-black border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>{t('contact_modal_title')}</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4 pt-4">
          <Input
            name="email"
            type="email"
            placeholder={t('contact_email_placeholder')}
            required
            className="bg-white/5 border-white/10"
          />
          <Input
            name="subject"
            placeholder={t('contact_subject_placeholder')}
            required
            className="bg-white/5 border-white/10"
          />
          <Textarea
            name="message"
            placeholder={t('contact_message_placeholder')}
            required
            className="min-h-[150px] bg-white/5 border-white/10"
          />
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl"
          >
            {t('contact_send_btn')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}