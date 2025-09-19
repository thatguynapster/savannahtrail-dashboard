import { Toaster } from '@/components/ui/sonner';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';

import './globals.css';
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SavannahTrail Admin Panel',
  description: 'Tour booking management system for SavannahTrail',

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
