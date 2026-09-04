import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import { I18nProvider } from '@/lib/i18n/i18n-context';
import { CookieBanner } from '@/components/cookie-banner';
import { Analytics } from '@vercel/analytics/next';

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${jakarta.variable} font-sans antialiased`}>
        <I18nProvider>
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
