'use client';

import {
  CreditCard,
  LayoutDashboard,
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
import { signOut } from 'next-auth/react';
import { ContactModal } from './contact-modal';
import { useI18n } from '@/lib/i18n/i18n-context';

export function AppSidebar() {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();
  const { t } = useI18n();

  const items = [
    { title: t('nav_dashboard'), url: '/dashboard', icon: LayoutDashboard },
    { title: t('nav_pricing'), url: '/pricing', icon: CreditCard },
    { title: t('nav_settings'), url: '/settings', icon: Settings },
  ];

  return (
    <Sidebar className="border-r border-border bg-sidebar backdrop-blur-xl">
      <SidebarHeader className="p-4 border-b border-border/50 flex flex-row items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
            <Wallet className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight text-foreground">
              LifeTrack
            </span>
            <span className="text-[10px] text-muted-foreground font-mono">
              v1.0.0
            </span>
          </div>
        </Link>

        {isMobile && (
          <button
            onClick={() => setOpenMobile(false)}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </SidebarHeader>

      <SidebarContent className="px-4">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.url}
                className="w-full justify-start gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-semibold hover:bg-accent hover:text-accent-foreground"
              >
                <Link
                  href={item.url}
                  onClick={() => isMobile && setOpenMobile(false)}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border/50 space-y-2">
        <ContactModal>
          <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-all text-sm font-medium w-full text-left">
            <LifeBuoy className="h-4 w-4" />
            {t('nav_support')}
          </button>
        </ContactModal>

        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-white/50 hover:text-red-400 hover:bg-red-400/10 transition-all text-sm font-medium w-full text-left"
        >
          <LogOut className="h-4 w-4" />
          {t('nav_logout')}
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
