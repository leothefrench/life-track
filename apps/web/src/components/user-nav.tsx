'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { LogOut, Settings } from 'lucide-react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useI18n } from '@/lib/i18n/i18n-context';

interface UserNavProps {
  user?: {
    name?: string | null;
    email?: string | null;
  } | null;
  isSubscribed?: boolean;
}

export function UserNav({ user, isSubscribed = false }: UserNavProps) {
  const { t } = useI18n();

  const displayName = user?.name || user?.email?.split('@')[0] || 'Mon Compte';
  const email = user?.email || '';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-9 w-9 rounded-full bg-primary/10 hover:bg-primary/20 p-0 border border-primary/20"
        >
          <span className="font-semibold text-sm text-primary">{initial}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            {email && (
              <p className="text-xs leading-none text-muted-foreground truncate">
                {email}
              </p>
            )}
            <div className="pt-1">
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full inline-block ${
                  isSubscribed
                    ? 'bg-primary/15 text-primary'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {isSubscribed ? t('badge_pro') : t('pricing_free')}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-muted-foreground" />
              <span>{t('nav_settings')}</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="cursor-pointer text-destructive focus:text-destructive flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          <span>{t('nav_logout')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
