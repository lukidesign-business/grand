import type { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';

import { Rule } from '@/components/ui/section-head';
import { Eyebrow } from '@/components/ui/section-head';
import { SearchExperience } from '@/components/search-experience';
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
    title: dict.meta.search.title,
    description: dict.meta.search.description,
    alternates: alternatesFor(locale, 'search')
  };
}

export default async function SearchPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale as Locale);

  return (
    <>
      <section className="border-b border-line-soft bg-[linear-gradient(to_bottom,var(--color-ink-3),var(--color-ink))] pb-[clamp(2.5rem,5vw,4rem)] pt-[clamp(8.5rem,16vh,11rem)]">
        <div className="shell">
          <Eyebrow>{dict.search.eyebrow}</Eyebrow>
          <h1 className="text-[clamp(2.2rem,5vw,3.8rem)]">{dict.search.title}</h1>
          <Rule />
          <p className="max-w-[56ch] text-muted">{dict.search.lead}</p>
        </div>
      </section>

      <section className="section-y bg-ink-2">
        {/* useSearchParams needs a Suspense boundary during prerender. */}
        <Suspense fallback={<div className="shell text-muted">{dict.search.results}…</div>}>
          <SearchExperience locale={locale} dict={dict} />
        </Suspense>
      </section>
    </>
  );
}
