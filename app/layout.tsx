import type { Metadata } from 'next';
import { Cormorant_Garamond, Jost } from 'next/font/google';
import { ScrollReset } from '@/components/scroll-reset';

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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://grand-properties.com'),
  title: 'Grand Property',
  description: 'Premium real estate advisory in Thailand',
  icons: {
    icon: [
      { url: '/images/grand-logo.png', type: 'image/png', sizes: '998x966' },
      { url: '/images/grand-logo.png', type: 'image/png' }
    ],
    shortcut: '/images/grand-logo.png',
    apple: '/images/grand-logo.png'
  },
  openGraph: {
    type: 'website',
    siteName: 'Grand Property',
    title: 'Grand Property',
    description: 'Premium real estate advisory in Thailand',
    images: [{ url: 'https://grand-properties.com/images/grand-logo.png', width: 998, height: 966, alt: 'Grand Property logo' }]
  },
  twitter: {
    card: 'summary',
    title: 'Grand Property',
    description: 'Premium real estate advisory in Thailand',
    images: ['https://grand-properties.com/images/grand-logo.png']
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable} bg-ink`}>
      <body>
        <ScrollReset />
        {children}
      </body>
    </html>
  );
}
