import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { CtaBand, PageHero } from '@/components/sections';
import { ProjectsBrowser } from '@/components/projects-browser';
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
    title: dict.meta.projects.title,
    description: dict.meta.projects.description,
    alternates: alternatesFor(locale, 'projects')
  };
}

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale as Locale);
  const page = dict.projects.page;

  return (
    <>
      <PageHero eyebrow={page.eyebrow} title={page.title} lead={page.lead} image="amenities.jpg" />

      <section className="section-y bg-ink-2">
        <div className="shell">
          <ProjectsBrowser locale={locale} dict={dict} />
        </div>
      </section>

      <CtaBand locale={locale} dict={dict} />
    </>
  );
}
