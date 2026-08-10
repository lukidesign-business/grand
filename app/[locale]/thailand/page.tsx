import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Globe, KeyRound, ShieldCheck, TrendingUp } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Rule, SectionHead } from '@/components/ui/section-head';
import { FramedImage } from '@/components/ui/framed-image';
import { Advantages, CtaBand, Ownership, PageHero, WhyPattaya } from '@/components/sections';
import { getDictionary } from '@/lib/i18n';
import { isLocale, type Locale } from '@/lib/i18n/config';
import { alternatesFor } from '@/lib/metadata';
import { href } from '@/lib/site';

const WHY_ICONS = [Globe, TrendingUp, ShieldCheck, KeyRound];

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return {
    title: dict.meta.thailand.title,
    description: dict.meta.thailand.description,
    alternates: alternatesFor(locale, 'thailand')
  };
}

export default async function ThailandPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale as Locale);
  const t = dict.thailand;

  return (
    <>
      <PageHero
        eyebrow={t.hero.eyebrow}
        title={t.hero.title}
        lead={t.hero.lead}
        image="thailand-coast.jpg"
        imageAlt={t.hero.imageAlt}
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild variant="gold">
            <Link href={href(locale, 'projects')}>{dict.projects.cta}</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="#ownership">{dict.ownership.title}</Link>
          </Button>
        </div>
      </PageHero>

      <section className="section-y bg-ink">
        <div className="shell">
          <SectionHead title={t.whyTitle} centered />
          <ul className="grid gap-px border border-line-soft bg-line-soft sm:grid-cols-2 lg:grid-cols-4">
            {t.why.map((entry, index) => {
              const Icon = WHY_ICONS[index] ?? Globe;
              return (
                <li
                  key={entry.title}
                  className="reveal bg-ink-2 p-8 transition-colors duration-500 hover:bg-surface md:p-10"
                >
                  <span className="mb-4 inline-flex text-gold">
                    <Icon strokeWidth={0.9} className="size-8" />
                  </span>
                  <h3 className="mb-3 text-[1.3rem]">{entry.title}</h3>
                  <p className="text-[0.91rem] leading-[1.8] text-muted">{entry.body}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <WhyPattaya dict={dict} />

      <section className="section-y relative bg-ink-2">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="reveal">
              <Rule className="mt-0" />
              <h2 className="text-[clamp(2rem,3.6vw,3.1rem)]">{t.climateTitle}</h2>
              <p className="mt-5 text-muted">{t.climate1}</p>
              <p className="mt-4 text-muted">{t.climate2}</p>
            </div>
            <div className="reveal">
              <Rule className="mt-0" />
              <h2 className="text-[clamp(2rem,3.6vw,3.1rem)]">{t.lifestyleTitle}</h2>
              <p className="mt-5 text-muted">{t.lifestyle1}</p>
              <p className="mt-4 text-muted">{t.lifestyle2}</p>
            </div>
          </div>

          <FramedImage
            src="/images/interior-living.jpg"
            alt=""
            width={1280}
            height={731}
            className="reveal mt-12 md:mt-16"
            imageClassName="max-h-115"
            sizes="100vw"
          />
        </div>
      </section>

      <Ownership locale={locale} dict={dict} withLink={false} />

      <Advantages dict={dict}>
        <div className="on-photo reveal mt-12 border border-line bg-[linear-gradient(140deg,rgba(201,162,90,.09),rgba(16,19,24,.6))] p-8 text-center md:mt-20 md:p-12">
          <h3 className="mb-3 text-[clamp(1.6rem,3vw,2.2rem)]">{t.ctaTitle}</h3>
          <p className="mx-auto mb-8 max-w-[52ch] text-muted">{t.ctaBody}</p>
          <Button asChild variant="gold">
            <Link href={href(locale, 'contact')}>{t.ctaButton}</Link>
          </Button>
        </div>
      </Advantages>

      <CtaBand locale={locale} dict={dict} />
    </>
  );
}
