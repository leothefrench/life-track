'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useI18n, currencies, Currency } from '@/lib/i18n/i18n-context';

export function CurrencySelector() {
  const { currency, setCurrency } = useI18n();
  const currentCurrency = currencies.find((c) => c.code === currency) || currencies[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5 px-2.5 h-8">
          <span className="text-xs font-bold text-primary">{currentCurrency.symbol}</span>
          <span className="text-xs font-semibold uppercase">{currentCurrency.code}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {currencies.map((c) => (
          <DropdownMenuItem
            key={c.code}
            onClick={() => setCurrency(c.code)}
            className={`flex items-center justify-between gap-4 cursor-pointer ${
              c.code === currency ? 'font-bold bg-accent' : ''
            }`}
          >
            <span className="text-sm">{c.name}</span>
            <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-muted">
              {c.symbol}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}