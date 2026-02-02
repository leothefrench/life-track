import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await auth();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4 text-center space-y-8">
      <h1 className="text-6xl font-extrabold tracking-tighter sm:text-7xl">
        Maîtrisez votre <span className="text-blue-500">budget.</span>
      </h1>
      <p className="max-w-[600px] text-muted-foreground text-xl">
        Life-Track est la solution la plus simple pour suivre vos dépenses et
        économiser chaque mois.
      </p>
      <div className="flex gap-4">
        <Button size="lg" className="rounded-full px-8" asChild>
          <Link href="/login">Commencer maintenant</Link>
        </Button>
        <Button size="lg" variant="outline" className="rounded-full px-8">
          Voir la démo
        </Button>
      </div>
    </div>
  );
}
