import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Sécurité : Si un malin essaie d'aller sur /dashboard sans être connecté
  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Barre de navigation unique pour le Dashboard */}
      <nav className="border-b bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="text-xl font-bold tracking-tighter"
          >
            Life-Track
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground hidden sm:inline-block">
              {session.user?.email}
            </span>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/api/auth/signout">Déconnexion</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Conteneur principal avec de l'air (padding) */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
