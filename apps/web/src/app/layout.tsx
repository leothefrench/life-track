import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import { I18nProvider } from '@/lib/i18n/i18n-context';
import { CookieBanner } from '@/components/cookie-banner';
import { Analytics } from '@vercel/analytics/next';
import { auth } from '@/auth';
import { cookies } from 'next/headers';
import { prisma } from '@life-track/db';
import { Language } from '@/lib/i18n/translations';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
});

export const metadata: Metadata = {
  title: 'Life-Track | Gestion de dépenses',
  description: 'Prenez le contrôle de vos finances',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Life-Track',
  },
};

export const viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let initialLanguage: Language = 'fr';

  try {
    const session = await auth();

    if (session?.user?.id) {
      // 1. Si connecté, on lit directement la langue dans la base
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { language: true },
      });
      if (
        user?.language &&
        ['fr', 'en', 'de', 'es', 'pt'].includes(user.language)
      ) {
        initialLanguage = user.language as Language;
      }
    } else {
      // 2. Si non connecté, on lit le cookie déposé par le sélecteur
      const cookieStore = await cookies();
      const langCookie = cookieStore.get('life_track_lang')?.value;
      if (langCookie && ['fr', 'en', 'de', 'es', 'pt'].includes(langCookie)) {
        initialLanguage = langCookie as Language;
      }
    }
  } catch (error) {
    console.error('Erreur résolution langue dans RootLayout:', error);
  }

  return (
    <html lang={initialLanguage} suppressHydrationWarning>
      <body className={`${jakarta.variable} font-sans antialiased`}>
        <I18nProvider initialLanguage={initialLanguage}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <TooltipProvider>
              {children}
              <Analytics />
              <CookieBanner />
              <Toaster
                position="bottom-right"
                richColors
                toastOptions={{ classNames: { toast: 'text-white' } }}
              />
            </TooltipProvider>
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
