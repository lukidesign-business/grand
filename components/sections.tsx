import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Award,
  Building2,
  CalendarDays,
  Check,
  Handshake,
  Home,
  Mail,
  MapPin,
  MessageCircle,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Eyebrow, Rule, SectionHead } from '@/components/ui/section-head';
import { FramedImage } from '@/components/ui/framed-image';
import { ProjectCard } from '@/components/project-card';
import { BRAND, PROJECTS, href } from '@/lib/site';
import { getPublishedProperties, propertyToProject } from '@/lib/properties';
import type { Dictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n/config';
import { cn } from '@/lib/utils';

type SectionProps = { locale: Locale; dict: Dictionary };

/** Low-opacity photographic texture behind a section. */
function Wash({ src }: { src: string }) {
  return (
    <div aria-hidden="true" className="section-wash absolute inset-0 z-0">
      <Image src={src} alt="" fill sizes="100vw" loading="lazy" className="object-cover" />
    </div>
  );
}

/* ---------------------------------------------------------------- benefits */

const BENEFIT_ICONS = { price: Home, turnkey: Handshake, service: Award, payment: TrendingUp };

export function Benefits({ dict }: { dict: Dictionary }) {
  return (
    <section className="section-y border-y border-line-soft bg-ink-2">
      <div className="shell">
        <ul className="grid gap-12 sm:grid-cols-2 sm:gap-x-0 lg:grid-cols-4">
          {dict.benefits.items.map((item, index) => {
            const Icon = BENEFIT_ICONS[item.id as keyof typeof BENEFIT_ICONS] ?? Award;
            return (
              <li
                key={item.id}
                className={cn(
                  'reveal relative px-0 text-center sm:px-6 lg:px-8',
                  index > 0 &&
                    'sm:before:absolute sm:before:inset-y-[8%] sm:before:left-0 sm:before:w-px sm:before:bg-[linear-gradient(to_bottom,transparent,var(--color-line-strong)_22%,var(--color-line-strong)_78%,transparent)]',
                  index === 2 && 'sm:before:hidden lg:before:block'
                )}
              >
                <span className="mb-5 inline-flex text-gold">
                  <Icon
                    strokeWidth={0.9}
                    className="size-12 drop-shadow-[0_0_18px_rgba(201,162,90,.35)]"
                  />
                </span>
                <h3 className="mb-3.5 text-[1.06rem] uppercase tracking-luxe text-gold">
                  {item.title}
                </h3>
                <p className="text-[0.93rem] leading-[1.85] text-muted">{item.body}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- why pattaya */

export function WhyPattaya({ dict }: { dict: Dictionary }) {
  const p = dict.pattaya;
  return (
    <section id="pattaya" className="relative bg-ink-2 py-16 md:py-20 lg:py-24">
      <Wash src="/images/wash-city.jpg" />
      <div className="shell relative z-1">
        <SectionHead eyebrow={p.eyebrow} title={p.title} lead={p.lead} className="max-w-4xl md:mb-12" />

        <div className="mt-10 grid items-start gap-8 lg:mt-12 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-12">
          {/* Editorial copy aligns to the top of the media column for a clean desktop rhythm. */}
          <div className="reveal max-w-[38rem] lg:pt-2">
            <p className="text-[0.98rem] leading-[1.75] text-muted">{p.body1}</p>
            <p className="mt-5 text-[0.98rem] leading-[1.75] text-muted">{p.body2}</p>
          </div>

          {/* Image and statistics share one measured right-hand column. */}
          <div className="reveal min-w-0">
            <FramedImage
              src="/images/pattaya-aerial.jpg"
              alt={p.imageAlt}
              width={1280}
              height={731}
              className="w-full"
              sizes="(max-width: 1024px) 100vw, 58vw"
              tight
            />
            <ul className="mt-6 grid grid-cols-2 gap-px border border-line-soft bg-line-soft">
              {p.stats.map((stat) => (
                <li key={stat.label} className="min-h-32 bg-ink-2 px-6 py-5 lg:px-7 lg:py-6">
                  <span className="mb-1.5 block font-serif text-[1.9rem] leading-tight text-gold">
                    {stat.value}
                  </span>
                  <span className="block max-w-[15rem] text-[0.76rem] leading-snug text-muted">{stat.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <ul className="mt-12 grid gap-px border border-line-soft bg-line-soft sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {p.points.map((point) => (
            <li
              key={point.title}
              className="reveal bg-ink-2 p-7 transition-colors duration-500 hover:bg-surface md:p-9"
            >
              <h3 className="mb-3 text-[1.28rem]">{point.title}</h3>
              <p className="text-[0.92rem] leading-[1.8] text-muted">{point.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- ownership */

export function Ownership({ locale, dict, withLink = true }: SectionProps & { withLink?: boolean }) {
  const o = dict.ownership;
  return (
    <section id="ownership" className="section-y relative bg-ink">
      <Wash src="/images/wash-lobby.jpg" />
      <div className="shell relative z-1">
        <SectionHead eyebrow={o.eyebrow} title={o.title} lead={o.lead} />

        <div className="grid items-start gap-8 lg:grid-cols-[1.15fr_.85fr] lg:gap-12">
          <ol className="grid gap-px border border-line-soft bg-line-soft">
            {o.steps.map((step) => (
              <li
                key={step.n}
                className="reveal flex flex-col gap-4 bg-ink p-6 transition-colors duration-500 hover:bg-surface sm:flex-row sm:gap-5 md:p-7"
              >
                <span className="min-w-10 shrink-0 font-serif text-[1.9rem] leading-none text-gold/55">
                  {step.n}
                </span>
                <div>
                  <h3 className="mb-2 text-[1.22rem]">{step.title}</h3>
                  <p className="text-[0.92rem] leading-[1.8] text-muted">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <aside className="grid gap-6">
            <FramedImage
              src="/images/ownership.jpg"
              alt={o.imageAlt}
              width={820}
              height={598}
              tight
              className="reveal w-full"
              sizes="(max-width: 1024px) 100vw, 33vw"
            />
            <div className="on-photo reveal border border-line bg-[linear-gradient(160deg,rgba(28,33,42,.75),rgba(16,19,24,.9))] p-6 md:p-7">
              <h3 className="mb-5 flex items-center gap-2.5 text-[1.05rem] uppercase tracking-luxe text-gold">
                <ShieldCheck className="size-5" />
                {o.factsTitle}
              </h3>
              <dl>
                {o.facts.map((fact, index) => (
                  <div
                    key={fact.k}
                    className={cn(
                      'flex items-baseline justify-between gap-4 py-3',
                      index < o.facts.length - 1 && 'border-b border-line-soft'
                    )}
                  >
                    <dt className="text-[0.68rem] uppercase tracking-[0.16em] text-muted-2">
                      {fact.k}
                    </dt>
                    <dd className="m-0 text-right text-[0.92rem] text-cream">{fact.v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-5 text-[0.8rem] leading-relaxed text-muted-2">{o.note}</p>
              {withLink ? (
                <Link
                  href={href(locale, 'thailand', 'ownership')}
                  className="mt-5 inline-flex items-center gap-2.5 border-b border-gold/25 pb-1 text-[0.72rem] uppercase tracking-luxe text-gold transition-colors duration-300 hover:border-gold hover:text-gold-bright"
                >
                  {o.cta}
                  <ArrowRight className="size-4" />
                </Link>
              ) : null}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- advantages */

export function Advantages({ dict, children }: { dict: Dictionary; children?: React.ReactNode }) {
  const a = dict.advantages;
  return (
    <section id="advantages" className="section-y relative border-y border-line-soft bg-ink-2">
      <Wash src="/images/wash-pool.jpg" />
      <div className="shell relative z-1">
        <SectionHead eyebrow={a.eyebrow} title={a.title} lead={a.lead} />
        <div className="grid gap-6 md:gap-8 lg:grid-cols-3">
          {a.groups.map((group) => (
            <div key={group.title} className="reveal border-t border-line-strong pt-6">
              <h3 className="mb-5 text-[1.15rem] uppercase tracking-luxe text-gold">
                {group.title}
              </h3>
              <ul className="grid gap-3.5">
                {group.items.map((item) => (
<li key={item} className="flex gap-3 text-[0.9rem] leading-[1.65] text-cream/85">
                    <Check className="mt-1.5 size-4 shrink-0 text-gold" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {children}
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- projects */

export async function FeaturedProjects({ locale, dict }: SectionProps) {
  const published = await getPublishedProperties();
  const featured = published.length
    ? published.map(propertyToProject).filter((project) => project.featured).slice(0, 4)
    : PROJECTS.filter((p) => p.featured).slice(0, 4);
  return (
    <section id="projects" className="section-y bg-ink">
      <div className="shell">
        <SectionHead
          eyebrow={dict.projects.eyebrow}
          title={dict.projects.title}
          lead={dict.projects.lead}
        />
        <div className="grid gap-6 md:grid-cols-2 md:gap-10">
          {featured.map((project) => (
            <ProjectCard key={project.id} project={project} locale={locale} dict={dict} />
          ))}
        </div>
        <div className="mt-12 flex justify-center md:mt-16">
          <Button asChild variant="outline">
            <Link href={href(locale, 'projects')}>{dict.projects.cta}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ about */

export function AboutSection({ locale, dict }: SectionProps) {
  const a = dict.about;
  return (
    <section id="about" className="section-y bg-ink-2">
      <div className="shell">
        <ul className="mb-16 grid gap-px border border-line-soft bg-line-soft sm:grid-cols-2 lg:grid-cols-4 md:mb-24">
          {a.pillars.map((pillar) => (
            <li
              key={pillar.title}
              className="reveal bg-ink-2 p-7 transition-colors duration-500 hover:bg-surface md:p-8"
            >
              <h3 className="mb-3 text-[1.02rem] uppercase tracking-luxe text-gold">
                {pillar.title}
              </h3>
              <p className="text-[0.89rem] leading-[1.8] text-muted">{pillar.body}</p>
            </li>
          ))}
        </ul>

        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
          <div className="reveal">
            <Rule className="mt-0" />
            <Eyebrow>{a.eyebrow}</Eyebrow>
            <h2 className="text-[clamp(2rem,3.6vw,3.1rem)]">{a.title}</h2>
            <p className="mt-5 text-[clamp(1.02rem,1.25vw,1.16rem)] leading-[1.8] text-cream">
              {a.lead}
            </p>
            <p className="mt-4 text-muted">{a.body1}</p>
            <p className="mt-4 text-muted">{a.body2}</p>

            <p className="my-7 font-serif text-[1.4rem] leading-[1.5] text-cream-bright">
              {a.closing1}
              <br />
              {a.closing2}
            </p>

            <div className="mb-7 flex flex-wrap items-center gap-6">
              <Image
                src="/images/signature.png"
                alt={dict.hero.signatureAlt}
                width={1186}
                height={369}
                className="w-[clamp(150px,18vw,200px)]"
              />
              <p className="flex flex-col gap-1 text-[0.78rem] uppercase tracking-luxe text-gold">
                {dict.hero.name}
                <span className="text-[0.7rem] text-muted-2">{dict.hero.role}</span>
              </p>
            </div>

            <Button asChild variant="outline">
              <Link href={href(locale, 'about')}>{a.cta}</Link>
            </Button>
          </div>

          <FramedImage
            src="/images/eryk-approach.png"
            alt={a.imageAlt}
            width={1280}
            height={731}
            className="reveal"
          />
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- consult */

function WhatsAppDropdown({ numbers, label }: { numbers: typeof BRAND.whatsapp; label: string }) {
  return (
    <details className="group reveal border border-line-soft bg-surface transition-colors duration-400 hover:border-line-strong hover:bg-surface-2">
      <summary className="grid w-full cursor-pointer list-none grid-cols-[auto_1fr_auto] items-center gap-x-4.5 p-6 [&::-webkit-details-marker]:hidden lg:col-span-full">
        <span className="row-span-2 text-gold [&_svg]:size-7"><MessageCircle className="size-7" /></span>
        <span className="text-[0.68rem] uppercase tracking-luxe text-gold">{label}</span>
        <span className="row-span-2 text-muted transition-transform duration-300 group-open:rotate-180">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-4"><path d="m6 9 6 6 6-6"/></svg>
        </span>
        <span className="text-[0.92rem] text-muted">{numbers.map(n => n.display).join(' · ')}</span>
      </summary>
      <ul className="border-t border-line-soft">
        {numbers.map((number) => (
          <li key={number.display}>
            <a
              href={number.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-4 px-6 py-4 text-[0.88rem] text-muted transition-colors duration-300 hover:bg-surface-2 hover:text-gold-bright"
            >
              <span>{number.display}</span>
              <span className="text-[0.68rem] uppercase tracking-luxe text-muted-2">{number.country}</span>
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}

export function ConsultSection({ locale, dict }: SectionProps) {
  const c = dict.contact;

  const tile = (
    key: string,
    icon: React.ReactNode,
    label: string,
    value: string,
    linkProps: React.ComponentProps<'a'>,
    primary = false
  ) => (
    <a
      key={key}
      {...linkProps}
      className={cn(
        'reveal grid grid-cols-[auto_1fr] items-center gap-x-4.5 border p-6 transition-all duration-400 hover:translate-x-1 hover:bg-surface-2',
        primary
          ? 'on-photo border-line-strong bg-[linear-gradient(140deg,rgba(201,162,90,.14),rgba(201,162,90,.03))]'
          : 'border-line-soft bg-surface hover:border-line-strong'
      )}
    >
      <span className="row-span-2 text-gold [&_svg]:size-7">{icon}</span>
      <span className="text-[0.68rem] uppercase tracking-luxe text-gold">{label}</span>
      <span className="text-[0.92rem] text-muted">{value}</span>
    </a>
  );

  return (
    <section id="contact" className="section-y relative border-t border-line-soft bg-ink-3">
      <Wash src="/images/wash-coast.jpg" />
      <div className="shell relative z-1">
        <div className="grid items-start gap-8 lg:grid-cols-[1.15fr_.85fr] lg:gap-16">
          <div className="reveal">
            <Eyebrow>{c.eyebrow}</Eyebrow>
            <h2 className="text-[clamp(2rem,3.6vw,3.1rem)]">{c.title}</h2>
            <Rule />
            <p className="text-[clamp(1.02rem,1.25vw,1.16rem)] leading-[1.8] text-muted">{c.lead}</p>

            <ul className="mt-7 grid gap-3.5">
              {c.trust.map((item) => (
                <li key={item} className="flex gap-3 text-[0.93rem] leading-relaxed text-muted">
                  <Check className="mt-1.5 size-4 shrink-0 text-gold" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <p className="mt-7 border-l-2 border-gold bg-gold/5 px-5 py-4 text-[0.88rem] text-muted">
              {c.remote}
            </p>
          </div>

          <div className="grid gap-3.5">
            {tile(
              'book',
              <CalendarDays />,
              dict.common.bookCall,
              c.formTitle,
              { href: href(locale, 'contact') },
              true
            )}
            <WhatsAppDropdown numbers={BRAND.whatsapp} label={c.whatsapp} />
            {tile('email', <Mail />, c.emailUs, BRAND.email, { href: `mailto:${BRAND.email}` })}
            <p className="mt-1 flex items-start gap-2.5 text-[0.8rem] text-muted-2">
              <MapPin className="mt-1 size-4 shrink-0 text-gold" />
              {c.hours}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- cta band */

export function CtaBand({ locale, dict }: SectionProps) {
  return (
    <section className="on-photo relative isolate overflow-hidden py-[clamp(5rem,10vw,8rem)] text-center">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <Image
          src="/images/lobby.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-30 grayscale-20"
        />
        <span className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(10,11,14,.62),rgba(10,11,14,.95)_72%)]" />
      </div>

      <div className="shell max-w-[46rem]">
        <Eyebrow className="justify-center">{dict.cta.eyebrow}</Eyebrow>
        <h2 className="mb-5 text-[clamp(2rem,4.2vw,3.4rem)]">{dict.cta.title}</h2>
        <p className="text-[1.05rem] text-muted">{dict.cta.body}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild variant="gold">
            <Link href={href(locale, 'contact')}>{dict.cta.primary}</Link>
          </Button>
          <Button asChild variant="ghost" className="text-[var(--fixed-cream)] hover:text-[var(--fixed-gold-bright)]">
            <Link href={href(locale, 'contact')}>{dict.cta.secondary}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- page hero */

interface PageHeroProps {
  eyebrow: string;
  title: string;
  lead?: string;
  image: string;
  imageAlt?: string;
  children?: React.ReactNode;
}

export function PageHero({ eyebrow, title, lead, image, imageAlt = '', children }: PageHeroProps) {
  return (
    <section className="on-photo relative isolate overflow-hidden pb-[clamp(4rem,8vw,6.5rem)] pt-[clamp(9rem,18vh,13rem)]">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <Image src={`/images/${image}`} alt={imageAlt} fill priority sizes="100vw" className="object-cover" />
        <span className="page-scrim absolute inset-0" />
      </div>
      <div className="shell max-w-[46rem]">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="text-[clamp(2.4rem,5.6vw,4.4rem)]">{title}</h1>
        <Rule />
        {lead ? (
          <p className="text-[clamp(1rem,1.3vw,1.14rem)] leading-[1.8] text-muted">{lead}</p>
        ) : null}
        {children}
      </div>
    </section>
  );
}

export { Building2 };
