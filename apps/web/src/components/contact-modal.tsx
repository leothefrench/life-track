'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { sendContactEmail } from '@/app/actions/contact';

export function ContactModal({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  async function handleSubmit(formData: FormData) {
    const result = await sendContactEmail(formData);
    if (result.success) {
      toast.success('Message envoyé !');
      setOpen(false);
    } else {
      toast.error("Échec de l'envoi.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* Si on passe un bouton spécifique, on l'affiche, sinon bouton par défaut */}
        {children || (
          <button className="text-[10px] uppercase tracking-widest text-white/60 hover:text-white transition-colors font-bold">
            Contact
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-black border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>Contacter le support</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4 pt-4">
          <Input
            name="email"
            type="email"
            placeholder="Votre adresse email"
            required
            className="bg-white/5 border-white/10"
          />
          <Input
            name="subject"
            placeholder="Sujet de votre message"
            required
            className="bg-white/5 border-white/10"
          />
          <Textarea
            name="message"
            placeholder="Comment pouvons-nous vous aider ?"
            required
            className="min-h-[150px] bg-white/5 border-white/10"
          />
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl"
          >
            Envoyer le message
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}