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

export function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

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
        <CardTitle className="text-2xl">Créer un compte</CardTitle>
        <CardDescription>
          Entrez vos informations pour rejoindre Life-Track
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom complet</Label>
            <Input id="name" name="name" placeholder="Jean Dupont" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="jean@exemple.com"
              autoCapitalize="none"
              autoComplete="email"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe (8 car. min)</Label>
            <div className="relative">
              {' '}
              {/* On ajoute ce conteneur */}
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'} // Type dynamique
                required
                className="pr-10" // Marge pour l'icône
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Masquer' : 'Afficher'}
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
            {loading ? 'Création en cours...' : "S'inscrire"}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm space-y-2">
          <div>
            Déjà un compte ?{' '}
            <Link href="/login" className="underline hover:text-primary transition-colors">
              Se connecter
            </Link>
          </div>
          <div>
            <Link href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors underline">
              Retourner à l'accueil
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
