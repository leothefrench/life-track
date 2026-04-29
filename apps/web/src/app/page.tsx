import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { ShieldCheck, Lock, MapPin } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default async function Home() {
  const session = await auth();
  if (session) redirect('/dashboard');

  return (
    <>
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

        <section className="relative z-10 max-w-5xl mx-auto px-6 py-24 border-t border-white/5">
          {/* Titre de section discret pour le SEO/Lighthouse */}
          <h2 className="sr-only">Pourquoi nous faire confiance</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Lock className="h-5 w-5 text-blue-500" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-white">
                Sécurité Bancaire
              </h3>
              <p className="text-sm text-white/50 leading-relaxed">
                Vos identifiants ne transitent jamais par nos serveurs. Nous
                utilisons un cryptage de niveau militaire (AES-256) pour
                protéger vos données.
              </p>
            </div>

            <div className="space-y-4">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-white">
                Vie Privée
              </h3>
              <p className="text-sm text-white/50 leading-relaxed">
                Zéro revente de données. Votre vie financière est privée, et le
                restera.
              </p>
            </div>

            <div className="space-y-4">
              <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-purple-500" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-white">
                Souveraineté Européenne
              </h3>
              <p className="text-sm text-white/50 leading-relaxed">
                Toutes vos données sont stockées sur des serveurs sécurisés en
                Europe. Conformité RGPD totale pour une tranquillité d'esprit
                absolue.
              </p>
            </div>
          </div>
        </section>

        <section className="relative z-10 max-w-3xl mx-auto px-6 py-24">
          <h2 className="text-2xl font-bold text-center mb-12">
            Questions fréquentes
          </h2>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-white/10">
              <AccordionTrigger className="text-sm hover:no-underline">
                Est-ce que Life-Track peut faire des virements depuis mon compte
                ?
              </AccordionTrigger>
              <AccordionContent className="text-xs text-white/50 leading-relaxed">
                Absolument pas. Nous utilisons Plaid, le standard mondial de
                sécurité bancaire. Votre connexion est en lecture seule : nous
                pouvons voir les transactions pour les analyser, mais il est
                techniquement impossible pour nous de déplacer votre argent.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border-white/10">
              <AccordionTrigger className="text-sm hover:no-underline">
                L&apos;IA a-t-elle accès à mon identité réelle ?
              </AccordionTrigger>
              <AccordionContent className="text-xs text-white/50 leading-relaxed">
                Non. Avant d&apos;être analysées par Gemini, vos données sont
                anonymisées. L&apos;IA voit des montants et des libellés (ex:
                Starbucks 5€), mais jamais votre nom, votre adresse ou votre
                numéro de compte.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border-white/10">
              <AccordionTrigger className="text-sm hover:no-underline">
                Puis-je annuler mon abonnement facilement ?
              </AccordionTrigger>
              <AccordionContent className="text-xs text-white/50 leading-relaxed">
                Oui, à tout moment et en un seul clic depuis votre Dashboard. Il
                n&apos;y a aucun engagement de durée. Une fois annulé, vous
                gardez vos accès Premium jusqu&apos;à la fin de la période
                payée.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </main>
      <footer className="relative z-10 border-t border-white/5 py-12 mt-20">
        <div className="max-w-3xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="text-xs text-white/60 font-medium tracking-tighter">
            © {new Date().getFullYear()} Life-Track. Tous droits réservés.
          </span>

          <div className="flex gap-8">
            <Link
              href="/cgv"
              className="text-[10px] uppercase tracking-widest text-white/60 hover:text-white transition-colors font-bold"
            >
              CGV & Mentions Légales
            </Link>
            <a
              href="mailto:leothefrench@gmail.com"
              className="text-[10px] uppercase tracking-widest text-white/60 hover:text-white transition-colors font-bold"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
