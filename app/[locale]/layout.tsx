import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { Cormorant_Garamond, Jost } from 'next/font/google';

import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { LanguageGate } from '@/components/language-gate';
import { RevealOnScroll } from '@/components/reveal-on-scroll';
import { getDictionary } from '@/lib/i18n';
import { isLocale, locales, type Locale } from '@/lib/i18n/config';
import { BRAND } from '@/lib/site';

import '../globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap'
});

const jost = Jost({
  subsets: ['latin', 'latin-ext'],
  weight: ['200', '300', '400', '500'],
  variable: '--font-jost',
  display: 'swap'
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: '#0a0b0e'
};

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);

  return {
    // Makes relative OG/canonical URLs resolve. Set NEXT_PUBLIC_SITE_URL in prod.
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
    title: dict.meta.home.title,
    description: dict.meta.home.description,
    applicationName: BRAND.name,
    icons: { icon: '/images/emblem-sm.png', apple: '/images/emblem.png' },
    openGraph: {
      type: 'website',
      siteName: BRAND.name,
      locale: locale === 'pl' ? 'pl_PL' : 'en_GB',
      images: ['/images/pattaya-aerial.jpg']
    },
    twitter: { card: 'summary_large_image' }
  };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = getDictionary(locale as Locale);

  return (
    <html lang={dict.htmlLang} dir={dict.dir} className={`${cormorant.variable} ${jost.variable}`}>
      <body>
        <a
          href="#main"
          className="fixed left-4 top-[-100%] z-999 bg-gold px-5 py-3 text-[0.78rem] uppercase tracking-luxe text-ink focus:top-4"
        >
          {dict.nav.skip}
        </a>

        <SiteHeader
          locale={locale as Locale}
          nav={dict.nav}
          langLabels={dict.lang}
          bookCallLabel={dict.common.bookCall}
        />

        <main id="main">{children}</main>

        <SiteFooter locale={locale as Locale} dict={dict} />

        <LanguageGate locale={locale as Locale} copy={dict.lang} />
        <RevealOnScroll />
      </body>
    </html>
  );
}
