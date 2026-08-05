import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { prisma } from "@life-track/db";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");

  // On récupère les infos pour l'affichage (email, status)
  const user = session?.user?.id 
    ? await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { isPremium: true, email: true }
      })
    : null;

  return (
    <SidebarProvider> {/* Le "flex" ne s'applique qu'ici maintenant */}
      <div className="flex min-h-screen w-full bg-background text-foreground">
        <AppSidebar />
        
        <SidebarInset className="bg-background border-l border-border flex flex-col">
          <header className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-border">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="-ml-1" />
              <div className="h-4 w-px bg-border hidden md:block" />
              <span className="text-xs text-muted-foreground hidden md:block italic">Espace sécurisé</span>
            </div>
            
            {/* Rappel du statut dans le header */}
            {user?.isPremium && (
               <span className="text-[10px] bg-amber-400/20 text-amber-400 border border-amber-400/20 px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">
                Pro
              </span>
            )}
          </header>

          <main className="flex-1 overflow-y-auto p-6 md:p-10">
            <div className="max-w-5xl mx-auto">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}