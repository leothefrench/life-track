'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginUser } from '@/app/actions/auth';
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isRegistered = searchParams.get('registered') === 'true';

  const [showPassword, setShowPassword] = useState(false);
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ÉTATS POUR SAUVEGARDER LES INFOS ENTRE LES DEUX ÉTAPES
  const [emailSave, setEmailSave] = useState('');
  const [passwordSave, setPasswordSave] = useState('');

  async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);

    // Si on est à l'étape 2 (2FA), on rajoute l'email et le mdp sauvés dans le formulaire
    if (showTwoFactor) {
      formData.set('email', emailSave);
      formData.set('password', passwordSave);
    }

    const result = await loginUser(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    if (result?.twoFactor) {
      // ON SAUVEGARDE POUR L'ÉTAPE FINALE
      setEmailSave(formData.get('email') as string);
      setPasswordSave(formData.get('password') as string);

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
            : 'Accédez à votre espace Life-Track'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!showTwoFactor ? (
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
                    Oublié ?
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
            <div className="space-y-4 flex flex-col items-center">
              <Label htmlFor="code" className="text-center w-full">
                Code de sécurité
              </Label>

              <InputOTP
                maxLength={6}
                name="code"
                autoFocus
                onComplete={() => {
                  // Attendre 100ms pour que l'utilisateur voie le dernier chiffre s'afficher
                  setTimeout(() => {
                    const form = document.querySelector('form');
                    if (form) form.requestSubmit();
                  }, 100);
                }}
              >
                <InputOTPGroup className="gap-2">
                  <InputOTPSlot
                    index={0}
                    className="w-10 h-12 text-lg font-bold border-border/50"
                  />
                  <InputOTPSlot
                    index={1}
                    className="w-10 h-12 text-lg font-bold border-border/50"
                  />
                  <InputOTPSlot
                    index={2}
                    className="w-10 h-12 text-lg font-bold border-border/50"
                  />
                  <InputOTPSlot
                    index={3}
                    className="w-10 h-12 text-lg font-bold border-border/50"
                  />
                  <InputOTPSlot
                    index={4}
                    className="w-10 h-12 text-lg font-bold border-border/50"
                  />
                  <InputOTPSlot
                    index={5}
                    className="w-10 h-12 text-lg font-bold border-border/50"
                  />
                </InputOTPGroup>
              </InputOTP>

              <p className="text-[10px] text-muted-foreground text-center uppercase tracking-widest">
                Vérification en cours...
              </p>
            </div>
          )}

          {error && (
            <p className="text-sm text-red-500 font-medium text-center">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading
              ? 'Traitement...'
              : showTwoFactor
              ? 'Vérifier le code'
              : 'Se connecter'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
