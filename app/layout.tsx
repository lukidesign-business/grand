import type { Metadata } from 'next';
import { Cormorant_Garamond, Jost } from 'next/font/google';

import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500'],
  variable: '--font-cormorant',
  display: 'swap'
});

const jost = Jost({
  subsets: ['latin', 'latin-ext'],
  weight: ['200', '300', '400', '500'],
  variable: '--font-jost',
  display: 'swap'
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: 'Grand Property',
  description: 'Premium real estate advisory in Thailand',
  icons: {
    icon: '/images/emblem-sm.png',
    apple: '/images/emblem.png'
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable} bg-ink`}>
      <body>{children}</body>
    </html>
  );
}
