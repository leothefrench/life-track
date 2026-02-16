'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { newPasswordAction } from '@/app/actions/reset';
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
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export function NewPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token'); // On récupère le token dans l'URL

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const result = await newPasswordAction(formData, token);

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
        <CardTitle>Nouveau mot de passe</CardTitle>
        <CardDescription>
          Choisissez votre nouveau mot de passe sécurisé.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe (8 car. min)</Label>
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Mise à jour...' : 'Enregistrer le mot de passe'}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          <Link href="/login" className="underline hover:text-primary">
            Retour à la connexion
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
