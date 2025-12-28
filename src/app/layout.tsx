import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { Providers } from '@/providers';
import { Metadata } from 'next';

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
    <html lang="en">
      <Providers>
        <body className="flex min-h-screen w-screen flex-col bg-gray-100">
          <Header />
          <main className="grow p-4">{children}</main>
          <Footer />
        </body>
      </Providers>
    </html>
  );
}
