import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Hero } from '@/components/hero';
import {
  AboutSection,
  Advantages,
  Benefits,
  ConsultSection,
  CtaBand,
  FeaturedProjects,
  Ownership,
  WhyPattaya
} from '@/components/sections';
import { getDictionary } from '@/lib/i18n';
import { isLocale, type Locale } from '@/lib/i18n/config';
import { alternatesFor } from '@/lib/metadata';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return {
    title: dict.meta.home.title,
    description: dict.meta.home.description,
    alternates: alternatesFor(locale, '')
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale as Locale);

  return (
    <>
      <Hero locale={locale} dict={dict} />
      <Benefits dict={dict} />
      <WhyPattaya dict={dict} />
      <Ownership locale={locale} dict={dict} />
      <Advantages dict={dict} />
      <FeaturedProjects locale={locale} dict={dict} />
      <AboutSection locale={locale} dict={dict} />
      <ConsultSection locale={locale} dict={dict} />
      <CtaBand locale={locale} dict={dict} />
    </>
  );
}
