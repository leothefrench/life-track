import { prisma } from '@life-track/db';
import { auth } from '@/auth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function Home() {
  const session = await auth();
  const userCount = await prisma.user.count();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="border-b bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <span className="text-xl font-bold tracking-tighter">Life-Track</span>
          {session && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {session.user?.email}
              </span>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/api/auth/signout">Déconnexion</Link>
              </Button>
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-20 px-4">
        {session ? (
          <div className="space-y-8">
            <header className="space-y-2">
              <h2 className="text-3xl font-bold">Tableau de bord</h2>
              <p className="text-muted-foreground">
                Bienvenue, {session.user?.name}. Voici un aperçu de la
                plateforme.
              </p>
            </header>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-border/50 bg-card/30">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground uppercase">
                    Statistiques Globales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">{userCount}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Utilisateurs inscrits sur Life-Track
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/30">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground uppercase">
                    Abonnement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-semibold text-blue-500">
                    Plan Gratuit
                  </div>
                  <Button variant="link" className="p-0 h-auto mt-2">
                    Passer au Premium →
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-center pt-8">
              <Button
                size="lg"
                className="rounded-full px-8 shadow-lg shadow-primary/20"
              >
                + Ajouter une dépense
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-6 py-12">
            <h2 className="text-5xl font-extrabold tracking-tight">
              Gérez vos finances sans effort.
            </h2>
            <p className="text-xl text-muted-foreground max-w-lg mx-auto">
              Rejoignez les utilisateurs qui maîtrisent leur budget avec
              Life-Track.
            </p>
            <Button size="lg" asChild className="rounded-full px-10">
              <Link href="/login">Démarrer gratuitement</Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
