'use client';

import React, { useSyncExternalStore } from 'react';
import { useI18n } from '@/lib/i18n/i18n-context';
import { Language, LANGUAGE_NAMES } from '@/lib/i18n/translations';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

const emptySubscribe = () => () => {};

// Hook natif React pour vérifier si le composant est monté dans le navigateur
function useHasMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true, // Côté navigateur (Client)
    () => false, // Côté serveur (SSR)
  );
}

export function LanguageSelector({
  variant = 'outline',
  className = '',
}: {
  variant?: 'outline' | 'ghost';
  className?: string;
}) {
  const { language, setLanguage } = useI18n();
  const mounted = useHasMounted();

  const current = LANGUAGE_NAMES[language];

  if (!mounted) {
    return (
      <Button
        variant={variant}
        size="sm"
        className={`h-8 gap-1.5 px-2.5 text-xs font-medium border-border/60 ${className}`}
      >
        <span className="text-sm leading-none">{current.flag}</span>
        <span className="hidden sm:inline-block font-mono uppercase text-[11px] text-muted-foreground">
          {current.label}
        </span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size="sm"
          className={`h-8 gap-1.5 px-2.5 text-xs font-medium border-border/60 hover:bg-white/5 transition-colors ${className}`}
        >
          <span className="text-sm leading-none">{current.flag}</span>
          <span className="hidden sm:inline-block font-mono uppercase text-[11px] text-muted-foreground">
            {current.label}
          </span>
          <Globe className="w-3.5 h-3.5 text-muted-foreground/70 sm:hidden" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-40 bg-background/95 backdrop-blur-md border-border"
      >
        {(Object.keys(LANGUAGE_NAMES) as Language[]).map((lang) => {
          const item = LANGUAGE_NAMES[lang];
          const isSelected = lang === language;
          return (
            <DropdownMenuItem
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`flex items-center justify-between text-xs cursor-pointer ${
                isSelected
                  ? 'bg-white/10 font-bold text-foreground'
                  : 'text-muted-foreground'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-base">{item.flag}</span>
                <span>{item.name}</span>
              </div>
              {isSelected && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
