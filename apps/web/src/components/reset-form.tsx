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

export function ResetForm() {
  const [loading, setLoading] = useState(false);

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
        <CardTitle>Mot de passe oublié ?</CardTitle>
        <CardDescription>
          Entrez votre email pour recevoir un lien de réinitialisation.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="nom@exemple.com"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Envoi...' : 'Envoyer le lien'}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm text-muted-foreground">
          <Link href="/login" className="hover:text-primary underline">
            Retour à la connexion
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
