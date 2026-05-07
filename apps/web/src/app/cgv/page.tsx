'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CGVPage() {
  const router = useRouter();

  return (
    <main className="max-w-4xl mx-auto py-20 px-6 text-white/80 leading-relaxed">
      {/* BOUTON RETOUR */}
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-8 -ml-4 text-white/50 hover:text-white"
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        Retour
      </Button>

      <h1 className="text-3xl font-bold text-white mb-8">
        Conditions Générales de Vente (CGV)
      </h1>

      <section className="space-y-6 text-sm">
        <div>
          <h2 className="text-xl font-semibold text-white mb-2">1. Objet</h2>
          <p>
            Les présentes CGV régissent la vente des abonnements 'Premium' de
            l'application Life-Track, éditée par DA SILVA COSTA Léandro José EI.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">2. Services</h2>
          <p>
            L'abonnement Premium donne accès à l'analyse par Intelligence
            Artificielle, la synchronisation bancaire automatique et les
            graphiques avancés.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">
            3. Tarifs et Paiement
          </h2>
          <p>
            Le tarif est de 9,99€ TTC par mois ou 99€ TTC par an. Le paiement
            est sécurisé et assuré par notre partenaire Stripe.
          </p>
        </div>

        <div className="bg-white/5 p-4 rounded-lg border border-white/10">
          <h2 className="text-xl font-semibold text-white mb-2">
            4. Droit de rétractation
          </h2>
          <p>
            Conformément à l&apos;article L221-28 du Code de la consommation, le
            client accepte que l&apos;exécution du service commence
            immédiatement après le paiement et renonce expressément à son droit
            de rétractation de 14 jours pour accéder aux outils d&apos;IA sans
            délai.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">
            5. Responsabilité (IA)
          </h2>
          <p>
            Life-Track fournit des analyses basées sur une IA. Ces informations
            sont données à titre indicatif et ne constituent en aucun cas un
            conseil financier, juridique ou une expertise comptable.
            L&apos;utilisateur reste seul responsable de ses décisions
            budgétaires.
          </p>
          <p>
            L&apos;éditeurr ne pourra être tenu responsable des dommages directs
            ou indirects, financiers ou matériels, résultant de l'interprétation
            des analyses fournies par l&apos;intelligence artificielle.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">
            6. Données personnelles
          </h2>
          <p>
            Vos données sont traitées conformément au RGPD. Vous disposez
            d&apos;un droit d&apos;accès, de rectification et de suppression via
            votre tableau de bord.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white mb-2">
            7. Droit applicable
          </h2>
          <p>
            Les présentes CGV sont soumises à la loi française. En cas de
            litige, et à défaut de résolution amiable, les tribunaux français
            seront seuls compétents.
          </p>
        </div>
      </section>
    </main>
  );
}
