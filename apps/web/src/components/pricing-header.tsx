'use client';

import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n/i18n-context';

export function PricingHeader() {
  const { t } = useI18n();

  return (
    <div className="mb-8">
      <Button
        variant="ghost"
        size="sm"
        asChild
        className="-ml-2 mb-4 text-white/50 hover:text-white transition-colors"
      >
        <Link href="/dashboard" className="flex items-center gap-1">
          <ChevronLeft className="h-4 w-4" />
          {t('dashboard_header_title')}
        </Link>
      </Button>
    </div>
  );
}
