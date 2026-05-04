import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';

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
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${jakarta.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster
            position="bottom-right"
            richColors
            toastOptions={{ classNames: { toast: 'text-white' } }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
