/* eslint-disable @next/next/no-img-element -- the hero is art-directed, see below */
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { HeroSearch } from '@/components/hero-search';
import { OFFICIAL_PARTNER, href } from '@/lib/site';
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
    <section className="relative isolate mt-0 flex min-h-0 flex-col justify-center overflow-visible pb-6 pt-28 md:mt-[clamp(5rem,8vw,7rem)] md:min-h-[100svh] md:max-h-[980px] md:justify-end md:pb-[clamp(2rem,5vh,4rem)] md:pt-[clamp(7rem,12vh,10rem)]">
      {/*
        Art-directed with a real <picture> rather than two <Image>s: the browser
        downloads exactly one source, and these files are already compressed to
        their display size, so the optimiser would only upscale them.
      */}
      <div aria-hidden="true" className="absolute inset-0 -z-20 overflow-hidden">
        <picture>
          {/* Mobile: natural 9:16 portrait, centred */}
          <source media="(max-width: 767px)" srcSet="/images/hero-portrait-mobile.jpg" />
          {/* Desktop: natural 19:6 landscape, no zoom */}
          <img
            src="/images/hero-portrait.jpg"
            alt=""
            width={1900}
            height={600}
            fetchPriority="high"
            decoding="async"
            className="size-full object-cover object-[65%_30%] max-md:object-[22%_15%]"
          />
        </picture>
      </div>

      {/* Overlay: extends to cover header area via negative top offset */}
      <div aria-hidden="true" className="hero-scrim-mobile md:hero-scrim absolute -top-32 bottom-0 left-0 right-0 -z-10" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -z-10 hidden border border-gold/13 md:block md:inset-[clamp(1rem,2.5vw,2.2rem)]"
      />

      {/* Official partner mark, docked to the upper-right corner of the frame */}
      <div className="absolute bottom-[7.25rem] right-3 z-[70] flex flex-col items-center gap-1 border border-[rgba(201,162,90,0.45)] bg-[rgba(10,11,14,0.7)] px-2 py-1.5 backdrop-blur-sm max-sm:scale-90 sm:right-6 sm:top-28 sm:bottom-auto sm:gap-2 sm:px-4 sm:py-4 md:right-[clamp(1.5rem,3.5vw,2.8rem)] md:top-[clamp(2.5rem,4vh,4rem)]">
        <span className="text-[0.42rem] uppercase tracking-[0.2em] text-[var(--fixed-gold-bright)] sm:text-[0.65rem]">
          {h.officialPartner}
        </span>
        <Image
          src={OFFICIAL_PARTNER.mark}
          alt={OFFICIAL_PARTNER.name}
          width={144}
          height={144}
          className="size-10 opacity-100 drop-shadow-[0_5px_18px_rgba(0,0,0,.7)] sm:size-28"
        />
      </div>

      <div className="shell flex min-h-0 flex-1 items-start pt-4 md:items-center md:pb-[clamp(1rem,3vh,2.5rem)] md:pt-0">
        <div className="max-w-full pb-2 pl-1 pr-1 max-md:pt-2 sm:pl-2 sm:pr-2 md:max-w-[40rem] md:pb-0 md:pl-[clamp(1rem,3vw,3rem)] md:pr-4 md:pt-0">
          <span className="-mt-2 mb-1 block text-[0.8rem] uppercase tracking-[0.24em] text-[var(--fixed-gold)] sm:-mt-[63px] sm:mb-[-6px] sm:text-[1.05rem] sm:tracking-[0.4em]">
            {h.eyebrow}
          </span>

          <h1
            className={cn(
              'font-light uppercase leading-[0.92] tracking-[0.015em] sm:leading-[0.9] md:leading-[0.84]',
              locale === 'pl'
                ? 'text-[clamp(2.15rem,4.8vw,4.15rem)] tracking-[0.005em]'
                : 'text-[clamp(2.75rem,6.8vw,6rem)]'
            )}
          >
            <span className="mb-[22px] block text-[var(--fixed-cream-bright)] md:mb-6">{h.titleTop}</span>
            <span className="-mt-[31px] text-gradient-gold block md:-mt-[31px]">{h.titleBottom}</span>
          </h1>

          <span aria-hidden="true" className="rule-gold my-5 w-17 md:my-7" />

          <p className="mb-4 text-[0.56rem] uppercase leading-[1.7] tracking-[0.12em] text-[rgba(247,244,238,0.9)] sm:text-[0.84rem] sm:leading-[2] sm:tracking-[0.16em] md:mb-6">
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
            className="mb-1 w-[130px] opacity-95 sm:w-[clamp(180px,22vw,250px)]"
          />

          <p className="mb-1 text-[0.82rem] uppercase tracking-luxer text-[var(--fixed-gold)]">{h.name}</p>
          <p className="text-[0.58rem] uppercase tracking-luxe text-[var(--fixed-cream-bright)] sm:text-[0.72rem] sm:text-[var(--fixed-muted)]">{h.role}</p>

          <div className="mt-5 flex flex-wrap gap-2 sm:mt-6 sm:gap-3 md:mt-8 md:flex-nowrap">
            <Button asChild variant="gold" className="max-sm:px-4 max-sm:py-2.5 max-sm:text-[0.62rem]">
              <Link href={href(locale, 'projects')}>{h.ctaPrimary}</Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="max-sm:px-4 max-sm:py-2.5 max-sm:text-[0.62rem] text-[var(--fixed-cream)] hover:text-[var(--fixed-gold-bright)]"
            >
              <Link href={href(locale, 'contact')}>{h.ctaSecondary}</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="shell relative z-[90] mt-7 lg:-mt-[clamp(1.5rem,4vh,3rem)]">
        <HeroSearch locale={locale} dict={dict} />
      </div>
    </section>
  );
}
