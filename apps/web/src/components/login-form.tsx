'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginUser } from '@/app/actions/auth'; // Notre nouvelle action
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
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isRegistered = searchParams.get('registered') === 'true';

  const [showPassword, setShowPassword] = useState(false);
  const [showTwoFactor, setShowTwoFactor] = useState(false); // ÉTAT POUR LE 2FA
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);

    // On appelle notre nouvelle Server Action
    const result = await loginUser(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    if (result?.twoFactor) {
      // SI LE SERVEUR DIT QU'IL FAUT LE 2FA
      setShowTwoFactor(true);
      setLoading(false);
      toast.info('Un code de sécurité a été envoyé par email.');
    }

    if (result?.success) {
      router.push('/dashboard');
      router.refresh();
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{showTwoFactor ? 'Vérification' : 'Connexion'}</CardTitle>
        <CardDescription>
          {showTwoFactor
            ? 'Entrez le code reçu par email.'
            : 'Entrez vos identifiants pour accéder à Life-Track'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!showTwoFactor ? (
            // --- ÉTAPE 1 : EMAIL / PASSWORD ---
            <>
              {isRegistered && (
                <div className="p-3 mb-4 text-sm font-medium text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-center">
                  Compte créé ! Connectez-vous maintenant.
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoCapitalize="none"
                  placeholder="nom@exemple.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Link
                    href="/reset"
                    className="text-xs text-muted-foreground hover:text-primary underline"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
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
            </>
          ) : (
            // --- ÉTAPE 2 : CODE 2FA ---
            <div className="space-y-2">
              <Label htmlFor="code">Code de sécurité</Label>
              <div className="relative">
                <Input
                  id="code"
                  name="code"
                  placeholder="123456"
                  required
                  className="pl-10 text-center tracking-[0.5em] text-lg font-bold"
                  maxLength={6}
                />
                <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500" />
              </div>
              {/* IMPORTANT : On cache l'email et le password dans le form pour qu'ils soient renvoyés avec le code */}
              <input
                type="hidden"
                name="email"
                value={
                  new FormData(document.querySelector('form')!).get(
                    'email',
                  ) as string
                }
              />
              <input
                type="hidden"
                name="password"
                value={
                  new FormData(document.querySelector('form')!).get(
                    'password',
                  ) as string
                }
              />
            </div>
          )}

          {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading
              ? 'Chargement...'
              : showTwoFactor
              ? 'Vérifier le code'
              : 'Se connecter'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
