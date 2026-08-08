import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Award, Handshake, MapPin, TrendingUp } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Eyebrow, Rule, SectionHead } from '@/components/ui/section-head';
import { FramedImage } from '@/components/ui/framed-image';
import { CtaBand, PageHero } from '@/components/sections';
import { getDictionary } from '@/lib/i18n';
import { isLocale, type Locale } from '@/lib/i18n/config';
import { alternatesFor } from '@/lib/metadata';
import { href } from '@/lib/site';

const PILLAR_ICONS = [MapPin, Handshake, Award, TrendingUp];

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return {
    title: dict.meta.about.title,
    description: dict.meta.about.description,
    alternates: alternatesFor(locale, 'about')
  };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale as Locale);
  const a = dict.about.page;

  return (
    <>
      <PageHero eyebrow={a.eyebrow} title={a.title} lead={a.lead} image="lobby.jpg" />

      <section className="section-y bg-ink">
        <div className="shell grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="reveal">
            <Rule className="mt-0" />
            <h2 className="text-[clamp(2rem,3.6vw,3.1rem)]">{a.storyTitle}</h2>
            <p className="mt-5 text-muted">{a.story1}</p>
            <p className="mt-4 text-muted">{a.story2}</p>

            <blockquote className="mt-10 border-t border-line-strong pt-7">
              <p className="mb-4 font-serif text-[clamp(1.35rem,2.2vw,1.75rem)] leading-[1.5] text-cream-bright">
                {a.mission}
              </p>
              <cite className="text-[0.68rem] uppercase not-italic tracking-luxer text-gold">
                {a.missionTitle}
              </cite>
            </blockquote>
          </div>

          <FramedImage
            src="/images/eryk-approach.png"
            alt={dict.about.imageAlt}
            width={1280}
            height={731}
            className="reveal"
          />
        </div>
      </section>

      <section className="section-y border-y border-line-soft bg-ink-2">
        <div className="shell">
          <ul className="grid gap-12 sm:grid-cols-2 sm:gap-x-0 lg:grid-cols-4">
            {dict.about.pillars.map((pillar, index) => {
              const Icon = PILLAR_ICONS[index] ?? Award;
              return (
                <li key={pillar.title} className="reveal px-0 text-center sm:px-6 lg:px-8">
                  <span className="mb-5 inline-flex text-gold">
                    <Icon
                      strokeWidth={0.9}
                      className="size-12 drop-shadow-[0_0_18px_rgba(201,162,90,.35)]"
                    />
                  </span>
                  <h3 className="mb-3.5 text-[1.06rem] uppercase tracking-luxe text-gold">
                    {pillar.title}
                  </h3>
                  <p className="text-[0.93rem] leading-[1.85] text-muted">{pillar.body}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="section-y bg-ink">
        <div className="shell grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="reveal">
            <Rule className="mt-0" />
            <h2 className="text-[clamp(2rem,3.6vw,3.1rem)]">{a.expertiseTitle}</h2>
            <p className="mt-5 text-muted">{a.expertise1}</p>
            <p className="mt-4 text-muted">{a.expertise2}</p>
          </div>
          <FramedImage
            src="/images/interior-living.jpg"
            alt=""
            width={1280}
            height={731}
            tight
            className="reveal"
          />
        </div>
      </section>

      <section className="section-y border-y border-line-soft bg-ink-2">
        <div className="shell">
          <SectionHead title={a.philosophyTitle} />
          <ol className="grid gap-px border border-line-soft bg-line-soft md:grid-cols-2">
            {a.philosophy.map((step, index) => (
              <li
                key={step.title}
                className="reveal flex flex-col gap-3 bg-ink-2 p-7 transition-colors duration-500 hover:bg-surface sm:flex-row sm:gap-6 md:p-8"
              >
                <span className="min-w-10 shrink-0 font-serif text-[1.9rem] leading-none text-gold/55">
                  0{index + 1}
                </span>
                <div>
                  <h3 className="mb-2 text-[1.22rem]">{step.title}</h3>
                  <p className="text-[0.92rem] leading-[1.8] text-muted">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section-y bg-ink-3">
        <div className="shell grid items-center gap-10 lg:grid-cols-[.9fr_1.1fr] lg:gap-16">
          <figure className="reveal m-0 border border-line p-2">
            <Image
              src="/images/hero-portrait.jpg"
              alt={a.consultantTitle}
              width={1600}
              height={905}
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="aspect-4/5 w-full object-cover object-[66%_center]"
            />
          </figure>

          <div className="reveal">
            <Eyebrow>{dict.about.eyebrow}</Eyebrow>
            <h2 className="text-[clamp(2rem,3.6vw,3.1rem)]">{a.consultantTitle}</h2>
            <p className="my-4 text-[0.72rem] uppercase tracking-luxe text-gold">
              {a.consultantRole}
            </p>
            <p className="text-[clamp(1.02rem,1.25vw,1.16rem)] leading-[1.8] text-cream">
              {a.consultantBody}
            </p>
            <p className="mt-4 text-muted">{dict.about.body1}</p>

            <Image
              src="/images/signature.png"
              alt={dict.hero.signatureAlt}
              width={1186}
              height={369}
              className="my-7 w-[clamp(150px,18vw,200px)]"
            />

            <div className="flex flex-wrap gap-3">
              <Button asChild variant="gold">
                <Link href={href(locale, 'contact')}>{dict.common.bookCall}</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href={href(locale, 'projects')}>{dict.projects.cta}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <CtaBand locale={locale} dict={dict} />
    </>
  );
}
