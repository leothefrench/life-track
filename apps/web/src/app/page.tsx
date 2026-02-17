import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await auth();
  if (session) redirect('/dashboard');

  return (
    <main className="min-h-screen bg-black text-white selection:bg-blue-500/30 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px]" />
      </div>

      {/* HERO SECTION */}
      <section className="relative z-10 px-6 pt-40 pb-20 text-center space-y-8 max-w-3xl mx-auto">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(120,119,198,0.1)_0,transparent_60%)] pointer-events-none" />
        <h1 className="text-5xl md:text-7xl font-bold tracking-[-0.04em] leading-[1.1] text-white">
          Votre argent méritait <br />
          <span className="text-white/40 font-medium">
            une meilleure vision
          </span>
        </h1>

        <p className="max-w-xl text-white/50 text-base md:text-lg mx-auto leading-relaxed text-balance">
          Life-Track utilise l'IA pour analyser vos habitudes et identifier
          chaque euro que vous pouvez économiser
        </p>

        <div className="flex justify-center pt-4">
          <Button
            size="lg"
            className="h-12 px-8 rounded-xl text-sm font-semibold transition-all duration-300 border border-white/10 bg-white/5 hover:bg-white hover:text-black text-white"
            asChild
          >
            <Link href="/register">Commencer à économiser</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
