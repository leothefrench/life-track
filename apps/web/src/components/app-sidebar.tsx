'use client';

import {
  LayoutDashboard,
  CreditCard,
  Settings,
  LogOut,
  Wallet,
  X,
  LifeBuoy, // Ajout de l'icône pour le support
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

const items = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Abonnement', url: '/pricing', icon: CreditCard },
  { title: 'Paramètres', url: '/settings', icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { isMobile, toggleSidebar } = useSidebar();

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

          {/* CROIX DE FERMETURE : Uniquement sur mobile */}
          {isMobile && (
            <button
              onClick={toggleSidebar}
              className="p-2 -mr-2 text-white/50 hover:text-white transition-colors"
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
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.url}
                className="hover:bg-white/5 transition-colors py-6 data-[active=true]:bg-white/10 data-[active=true]:text-white"
              >
                <Link href={item.url} className="flex items-center gap-3">
                  <item.icon
                    className={`h-4 w-4 ${
                      pathname === item.url ? 'text-white' : 'text-white/50'
                    }`}
                  />
                  <span className="text-sm font-medium">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-white/5 space-y-1">
        {/* BOUTON SUPPORT */}
        <ContactModal>
          <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-all text-sm font-medium w-full text-left">
            <LifeBuoy className="h-4 w-4" />
            Support
          </button>
        </ContactModal>

        {/* BOUTON DÉCONNEXION */}
        <button
          onClick={() => signOut({ redirectTo: '/' })}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-white/50 hover:text-red-400 hover:bg-red-400/10 transition-all text-sm font-medium w-full text-left"
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
