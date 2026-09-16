'use client';

import {
  LayoutDashboard,
  BarChart3,
  CreditCard,
  Settings,
  LogOut,
  Wallet,
  X,
  LifeBuoy,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logoutUser } from '@/app/actions/auth';
import { ContactModal } from './contact-modal';
import { CookieSettingsButton } from './cookie-banner';
import { useI18n } from '@/lib/i18n/i18n-context';

export function AppSidebar() {
  const pathname = usePathname();
  const { isMobile, toggleSidebar } = useSidebar();
  const { t } = useI18n();

  const items = [
    { title: t('nav_dashboard'), url: '/dashboard', icon: LayoutDashboard },
    {
      title: t('nav_analytics') || 'Analyses',
      url: '/analytics',
      icon: BarChart3,
      isPro: true,
    },
    { title: t('nav_pricing'), url: '/pricing', icon: CreditCard },
    { title: t('nav_settings'), url: '/settings', icon: Settings },
  ];

  return (
    <Sidebar className="border-r border-border bg-sidebar backdrop-blur-xl">
      <SidebarHeader className="p-6">
        <div className="flex items-center justify-between w-full">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Wallet className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold tracking-tighter text-xl text-white">
              Life-Track
            </span>
          </Link>

          {isMobile && (
            <button
              onClick={toggleSidebar}
              className="p-2 -mr-2 text-white/70 hover:text-white transition-colors"
              aria-label="Fermer le menu"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.url}
                className="hover:bg-white/5 transition-colors py-6 data-[active=true]:bg-white/10 data-[active=true]:text-white"
              >
                <Link
                  href={item.url}
                  className="flex items-center justify-between w-full"
                >
                  <div className="flex items-center gap-3">
                    <item.icon
                      className={`h-4 w-4 ${
                        pathname === item.url ? 'text-white' : 'text-white/60'
                      }`}
                    />
                    <span className="text-sm font-medium">{item.title}</span>
                  </div>
                  {item.isPro && (
                    <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                      Pro
                    </span>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-white/10 space-y-1">
        <ContactModal>
          <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-all text-sm font-medium w-full text-left">
            <LifeBuoy className="h-4 w-4" />
            {t('nav_support')}
          </button>
        </ContactModal>

        <form action={logoutUser}>
          <button
            type="submit"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-white/70 hover:text-red-400 hover:bg-red-400/10 transition-all text-sm font-medium w-full text-left"
          >
            <LogOut className="h-4 w-4" />
            {t('nav_logout')}
          </button>
        </form>

        <div className="pt-3 mt-2 border-t border-white/10 flex flex-wrap items-center justify-center gap-2 text-[11px] text-white/60">
          <Link href="/cgv" className="hover:text-white transition-colors">
            {t('nav_cgv')}
          </Link>
          <span>•</span>
          <Link
            href="/confidentialite"
            className="hover:text-white transition-colors"
          >
            {t('nav_privacy')}
          </Link>
          <span>•</span>
          <Link
            href="/mentions-legales"
            className="hover:text-white transition-colors"
          >
            {t('nav_mentions_legales')}
          </Link>
          <span>•</span>
          <CookieSettingsButton className="hover:text-white transition-colors cursor-pointer text-[11px]" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
