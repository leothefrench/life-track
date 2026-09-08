'use client';

import { useState } from 'react';
import { FileText, ExternalLink, Loader2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createCustomerPortalSession } from '@/app/actions/stripe';
import { useI18n } from '@/lib/i18n/i18n-context';

const LABELS = {
  fr: {
    title: 'Facturation & Factures',
    desc: 'Consultez et téléchargez vos reçus et factures d’abonnement Stripe.',
    btn: 'Accéder aux factures Stripe',
  },
  en: {
    title: 'Billing & Invoices',
    desc: 'View and download your Stripe subscription receipts and invoices.',
    btn: 'Manage Stripe Invoices',
  },
  de: {
    title: 'Abrechnung & Rechnungen',
    desc: 'Sehen Sie Ihre Rechnungen ein und laden Sie diese über Stripe herunter.',
    btn: 'Zu den Stripe-Rechnungen',
  },
  es: {
    title: 'Facturación y Facturas',
    desc: 'Consulte y descargue sus recibos y facturas de suscripción en Stripe.',
    btn: 'Acceder a las facturas',
  },
  pt: {
    title: 'Faturação e Faturas',
    desc: 'Consulte e transfira os seus recibos e faturas de subscrição Stripe.',
    btn: 'Aceder às faturas',
  },
};

export function BillingInvoicesCard({
  hasActiveSubscription,
}: {
  hasActiveSubscription: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const { language } = useI18n();
  const text = LABELS[(language as keyof typeof LABELS) || 'fr'] || LABELS.fr;

  const handleOpenPortal = async () => {
    setLoading(true);
    try {
      await createCustomerPortalSession();
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  if (!hasActiveSubscription) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <FileText className="h-4 w-4 text-emerald-500 shrink-0" />
          <span>{text.title}</span>
        </CardTitle>
        <CardDescription>{text.desc}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Button
          onClick={handleOpenPortal}
          disabled={loading}
          variant="outline"
          className="gap-2 border-white/10 hover:bg-white/10 text-sm"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ExternalLink className="h-4 w-4" />
          )}
          {text.btn}
        </Button>
      </CardContent>
    </Card>
  );
}
