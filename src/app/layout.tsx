import { Footer } from '@/components/navigation/footer';
import { Header } from '@/components/navigation/header';
import { Toaster } from '@/components/ui/sonner';
import { Providers } from '@/providers';
import { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { Suspense } from 'react';

import './globals.css';

export const metadata: Metadata = {
  title: 'Next.js App Starter Kit',
  description: 'Next.js App Starter Kit',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Providers>
        <body className="bg-background flex min-h-screen w-full flex-col">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster position="bottom-right" />
            <Header />
            <main className="grow p-4">{children}</main>
            <Suspense>
              <Footer />
            </Suspense>
          </ThemeProvider>
        </body>
      </Providers>
    </html>
  );
}
