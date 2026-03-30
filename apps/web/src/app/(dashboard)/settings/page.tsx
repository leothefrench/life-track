import { auth } from '@/auth';
import { prisma } from '@life-track/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { TwoFactorSwitch } from '@/components/two-factor-switch';

export default async function SettingsPage() {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: { id: session?.user?.id },
  });

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white text-center md:text-left">
          Paramètres
        </h1>
        <p className="text-white/50 text-sm text-center md:text-left">
          Gérez vos informations personnelles et votre sécurité.
        </p>
      </div>

      {/* Bloc Profil */}
      <Card className="bg-white/5 border-white/10 shadow-none">
        <CardHeader>
          <CardTitle className="text-lg text-white">Profil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-white/70">Nom</Label>
            <Input
              disabled
              defaultValue={user?.name || ''}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-white/70">Email</Label>
            <Input
              disabled
              defaultValue={user?.email || ''}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
        </CardContent>
      </Card>

      {/* Bloc Sécurité */}
      <Card className="bg-white/5 border-white/10 shadow-none">
        <CardHeader>
          <CardTitle className="text-lg text-white font-bold">
            Sécurité
          </CardTitle>
        </CardHeader>
        {/* On utilise le padding standard de CardContent pour que rien ne colle aux bords */}
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-white/[0.03] rounded-xl border border-white/5">
            <div className="space-y-1">
              <p className="text-sm font-medium text-white">
                Double authentification (2FA)
              </p>
              <p className="text-[11px] text-white/40">
                Code de sécurité envoyé par email.
              </p>
            </div>
            <TwoFactorSwitch initialValue={user?.isTwoFactorEnabled || false} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
