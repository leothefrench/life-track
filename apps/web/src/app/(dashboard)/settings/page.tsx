import { auth } from '@/auth';
import { prisma } from '@life-track/db';
import { SecurityCard } from '@/components/security-card';
import { SettingsLanguageCard } from '@/components/settings-language-card';
import { SettingsHeader } from '@/components/settings-header';
import { SettingsProfileCard } from '@/components/settings-profile-card';

export default async function SettingsPage() {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: { id: session?.user?.id },
  });

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-10 px-4 md:px-0">
      <SettingsHeader />

      {/* Bloc Profil */}
      <SettingsProfileCard name={user?.name} email={user?.email} />

      {/* Bloc Langue */}
      <SettingsLanguageCard />

      {/* Bloc Sécurité */}
      <SecurityCard initialValue={user?.isTwoFactorEnabled || false} />
    </div>
  );
}
