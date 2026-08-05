/* eslint-disable @next/next/no-img-element -- the hero is art-directed, see below */
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { HeroSearch } from '@/components/hero-search';
import { href } from '@/lib/site';
import type { Dictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n/config';
import { cn } from '@/lib/utils';

/**
 * Recreated from the supplied mockup: a left content column over the full-bleed
 * portrait, with the search bar docked at the lower edge. The background is
 * art-directed — a wide crop on desktop, a portrait crop on phones.
 */
export function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const h = dict.hero;

  return (
    <section className="relative isolate mt-0 flex min-h-[100svh] flex-col justify-center overflow-hidden pb-8 pt-24 lg:mt-[clamp(5rem,8vw,7rem)] md:max-h-[980px] md:justify-end md:pb-[clamp(2rem,5vh,4rem)] md:pt-[clamp(7rem,12vh,10rem)]">
      {/*
        Art-directed with a real <picture> rather than two <Image>s: the browser
        downloads exactly one source, and these files are already compressed to
        their display size, so the optimiser would only upscale them.
      */}
      <div aria-hidden="true" className="absolute inset-0 -z-20">
        <picture>
          <source media="(max-width: 767px)" srcSet="/images/hero-portrait-mobile.jpg" />
          <img
            src="/images/hero-portrait.jpg"
            alt=""
            width={1600}
            height={905}
            fetchPriority="high"
            decoding="async"
            className="size-full object-cover object-[50%_22%] md:object-[72%_center]"
          />
        </picture>
      </div>

      <div aria-hidden="true" className="hero-scrim-mobile md:hero-scrim absolute inset-0 -z-10" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -z-10 hidden border border-gold/13 md:block md:inset-[clamp(1rem,2.5vw,2.2rem)]"
      />

      <div className="shell flex flex-1 items-end md:items-start">
        <div className="max-w-full pb-2 pl-1 sm:pl-2 md:max-w-[32rem] md:pb-0 md:pl-[clamp(1rem,3vw,3rem)] md:pt-[clamp(2rem,5vh,4rem)]">
          <span className="mb-4 block text-[0.72rem] uppercase tracking-[0.4em] text-gold sm:text-[0.82rem] sm:tracking-[0.5em]">
            {h.eyebrow}
          </span>

          <h1
            className={cn(
              'font-light uppercase leading-[0.96] tracking-[0.015em]',
              locale === 'pl'
                ? 'text-[clamp(2.25rem,5.2vw,4.5rem)]'
                : 'text-[clamp(2.75rem,6.8vw,6rem)]'
            )}
          >
            <span className="block text-cream-bright">{h.titleTop}</span>
            <span className="text-gradient-gold block">{h.titleBottom}</span>
          </h1>

          <span aria-hidden="true" className="rule-gold my-5 w-17 md:my-7" />

          <p className="mb-4 text-[0.78rem] uppercase leading-[1.85] tracking-[0.16em] text-cream-bright/90 sm:text-[0.84rem] sm:leading-[2] md:mb-6">
            {h.taglineLine1}
            <br />
            {h.taglineLine2}
          </p>

          <Image
            src="/images/signature.png"
            alt={h.signatureAlt}
            width={1186}
            height={369}
            priority
            className="mb-1 w-[175px] opacity-95 sm:w-[clamp(180px,22vw,250px)]"
          />

          <p className="mb-1 text-[0.82rem] uppercase tracking-luxer text-gold">{h.name}</p>
          <p className="text-[0.72rem] uppercase tracking-luxe text-muted">{h.role}</p>

          <div className="mt-6 flex flex-wrap gap-3 md:mt-8">
            <Button asChild variant="gold" className="max-sm:w-full">
              <Link href={href(locale, 'projects')}>{h.ctaPrimary}</Link>
            </Button>
            <Button asChild variant="ghost" className="max-sm:w-full">
              <Link href={href(locale, 'contact')}>{h.ctaSecondary}</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="shell mt-7 md:mt-[clamp(2rem,5vh,3.5rem)]">
        <HeroSearch locale={locale} dict={dict} />
      </div>
    </section>
  );
}
