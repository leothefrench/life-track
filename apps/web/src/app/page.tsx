import { prisma } from '@life-track/db';
import { Button } from '@/components/ui/button';

export default async function Home() {
  const userCount = await prisma.user.count();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 gap-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Life-Track</h1>
        <p className="text-muted-foreground">
          Votre gestionnaire de dépenses intelligent.
        </p>
      </div>

      <div className="p-6 border rounded-xl bg-card shadow-sm text-center space-y-4">
        <p className="text-sm font-medium">
          Statut de la base :{' '}
          <span className="text-green-500">Connectée ✅</span>
        </p>
        <p className="text-3xl font-bold">{userCount}</p>
        <p className="text-xs text-muted-foreground uppercase tracking-widest">
          Utilisateurs inscrits
        </p>
      </div>

      <div className="flex gap-4">
        {/* On utilise notre nouveau composant Shadcn */}
        <Button size="lg">Démarrer maintenant</Button>
        <Button variant="outline" size="lg">
          En savoir plus
        </Button>
      </div>
    </main>
  );
}
