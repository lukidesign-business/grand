import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Building2, Check, MapPin } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Rule } from '@/components/ui/section-head';
import { ProjectCard } from '@/components/project-card';
import { ProjectGallery } from '@/components/project-gallery';
import { PropertyPdfPreview, PropertyVideo } from '@/components/property-media-previews';
import { PropertyLocationFallback } from '@/components/property-location-fallback';
import { WhatsAppSelector } from '@/components/whatsapp-selector';
import { CtaBand } from '@/components/sections';
import { BRAND, PROJECTS, formatPrice, getProject, href } from '@/lib/site';
import { getDictionary } from '@/lib/i18n';
import { isLocale, locales, type Locale } from '@/lib/i18n/config';
import { alternatesFor } from '@/lib/metadata';
import { getPropertyBySlug, getPublishedProperties, propertyToProject } from '@/lib/properties';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateStaticParams() {
  const published = await getPublishedProperties();
  const projects = published.length ? published.map(propertyToProject) : PROJECTS;
  return locales.flatMap((locale) => projects.map((project) => ({ locale, slug: project.id })));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const property = await getPropertyBySlug(slug);
  const project = property ? propertyToProject(property) : getProject(slug);
  if (!isLocale(locale) || !project) return {};

  const dict = getDictionary(locale);
  const dictItem = dict.projects.items[slug as keyof typeof dict.projects.items];
  const name = project.name ?? dictItem?.name ?? slug;
  const tagline = project.tagline ?? dictItem?.tagline ?? '';

  return {
    title: `${name} — ${dict.values.locations[project.location]} | ${dict.meta.project.titleSuffix}`,
    description: `${dict.meta.project.descriptionPrefix} ${project.priceFrom ? formatPrice(locale, project.priceFrom) : dict.projects.labels.priceOnRequest}. ${tagline}.`,
    alternates: alternatesFor(locale, `projects/${slug}`),
    openGraph: { images: [project.image] }
  };
}

export default async function ProjectPage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const property = await getPropertyBySlug(slug);
  const project = property ? propertyToProject(property) : getProject(slug);
  if (!isLocale(locale) || !project) notFound();

  const dict = getDictionary(locale as Locale);
  const dictItem = dict.projects.items[slug as keyof typeof dict.projects.items];
  const item = {
    name: project.name ?? dictItem?.name ?? slug,
    tagline: project.tagline ?? dictItem?.tagline ?? '',
    summary: project.summary ?? dictItem?.summary ?? '',
    body: project.body ?? dictItem?.body ?? '',
    highlights: dictItem?.highlights ?? []
  };
  const labels = dict.projects.labels;
  const published = await getPublishedProperties();
  const catalog = published.length ? published.map(propertyToProject) : PROJECTS;
  const others = catalog.filter((p) => p.id !== project.id).slice(0, 3);

  const facts = [
    {
      k: labels.from,
      v: project.priceFrom ? formatPrice(locale, project.priceFrom) : labels.priceOnRequest,
      price: true
    },
    { k: labels.location, v: dict.values.locations[project.location] },
    { k: labels.status, v: dict.values.statuses[project.status] },
    { k: labels.completion, v: project.completion },
    { k: labels.bedrooms, v: `${labels.from}: ${project.bedrooms.map((b) => dict.values.bedroomsShort[b]).join(' · ')}` },
    { k: labels.size, v: `${labels.from}: ${project.sizeFrom} ${dict.common.sqm}` },
    ...(project.floors ? [{ k: labels.floors, v: String(project.floors) }] : []),
    ...(project.units ? [{ k: labels.units, v: String(project.units) }] : [])
  ];

  return (
    <>
      <section className="on-photo relative isolate overflow-hidden pb-[clamp(3rem,6vw,5rem)] pt-[clamp(9rem,17vh,12rem)]">
        <div className="absolute inset-0 -z-10">
          {project.image && !project.image.startsWith('/placeholder.svg') ? (
            <>
              <Image
                src={project.image.startsWith('http') || project.image.startsWith('/') ? project.image : `/images/${project.image}`}
                alt=""
                fill
                priority
                sizes="100vw"
                className="object-cover"
                unoptimized={project.image.startsWith('http://') || project.image.startsWith('https://')}
              />
              <span aria-hidden="true" className="page-scrim absolute inset-0" />
            </>
          ) : (
            <PropertyLocationFallback location={`${dict.values.locations[project.location]}, ${BRAND.country}`} mapUrl={project.mapUrl ?? `https://maps.google.com/?q=${encodeURIComponent(project.location)}`} />
          )}
        </div>

        <div className="shell max-w-[44rem]">
          <Link
            href={href(locale, 'projects')}
            className="mb-6 inline-flex items-center gap-2.5 text-[0.7rem] uppercase tracking-luxe text-muted transition-colors hover:text-gold"
          >
            <ArrowLeft className="size-4" />
            {dict.common.backToProjects}
          </Link>

          <h1 className="mb-2.5 text-[clamp(2.3rem,5.2vw,4rem)]">{item.name}</h1>
          <p className="mb-5 text-[1.1rem] text-muted">{item.tagline}</p>

          <p className="mb-6 flex items-center gap-2 text-[0.72rem] uppercase tracking-luxe text-gold">
            <MapPin className="size-4" />
            <span>
              {dict.values.locations[project.location]}, {BRAND.country}
            </span>
          </p>

          <p className="flex items-baseline gap-3">
            <span className="text-[0.68rem] uppercase tracking-luxe text-muted-2">{labels.from}</span>
            <strong className="font-serif text-[clamp(1.9rem,3.4vw,2.6rem)] font-semibold text-gold">
              {project.priceFrom ? formatPrice(locale, project.priceFrom) : labels.priceOnRequest}
            </strong>
          </p>
        </div>
      </section>

      <section className="section-y bg-ink">
        <div className="shell grid items-start gap-10 lg:grid-cols-[1fr_360px] lg:gap-16">
          <div>
            <h2 className="text-[1.9rem] uppercase tracking-luxe text-gold">{labels.overview}</h2>
            <Rule />
            <p className="text-[clamp(1.02rem,1.25vw,1.16rem)] leading-[1.8] text-cream">
              {item.summary}
            </p>
            <p className="mt-5 text-muted">{item.body}</p>

            <h3 className="mt-10 border-t border-line-soft pt-6 text-[1.35rem]">
              {labels.highlights}
            </h3>
            <ul className="mt-5 grid gap-3.5">
              {item.highlights.map((highlight) => (
                <li key={highlight} className="flex gap-3 text-[0.93rem] leading-relaxed text-muted">
                  <Check className="mt-1.5 size-4 shrink-0 text-gold" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>

            <h3 className="mt-10 border-t border-line-soft pt-6 text-[1.35rem]">{labels.gallery}</h3>
            <ProjectGallery
              images={project.gallery}
              name={item.name}
              labels={{
                viewAll: labels.viewAll,
                close: labels.close,
                prev: labels.prev,
                next: labels.next
              }}
            />

            {project.videoUrl ? <section className="mt-12 border-t border-line-soft pt-8"><h3 className="text-[1.35rem]">Property video tour</h3><div className="mt-5 overflow-hidden border border-line-soft bg-ink-2 shadow-[0_18px_50px_rgba(0,0,0,.22)]"><PropertyVideo src={project.videoUrl} /></div></section> : null}

            {project.documents?.length ? <section className="mt-12 border-t border-line-soft pt-8"><h3 className="text-[1.35rem]">Property documents</h3><div className="mt-5 grid gap-4 sm:grid-cols-2">{project.documents.map((document) => <article key={document.url} className="border border-line-soft bg-ink-2 p-4"><div className="flex items-start justify-between gap-4"><div><p className="text-sm text-cream">{document.title}</p><p className="mt-1 text-xs uppercase tracking-luxe text-gold">PDF</p></div><a href={document.url} download target="_blank" rel="noopener noreferrer" className="text-xs uppercase tracking-luxe text-gold hover:text-gold-bright">Download</a></div><div className="mt-4 overflow-hidden border border-line-soft bg-ink"><PropertyPdfPreview src={document.url} title={document.title} /></div></article>)}</div></section> : null}

            {project.mapImage && project.mapUrl ? (
              <section className="mt-12 border-t border-line-soft pt-8">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <h3 className="text-[1.35rem]">{labels.map}</h3>
                    <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
                      {dict.values.locations[project.location]}, {BRAND.country}
                    </p>
                  </div>
                  <Button asChild variant="ghost" size="sm">
                    <a href={project.mapUrl} target="_blank" rel="noopener noreferrer">
                      {labels.openMap}
                    </a>
                  </Button>
                </div>
                <div className="mt-5 max-w-3xl border border-line-soft bg-ink-2 p-2">
                  <Image
                    src={project.mapImage.startsWith('http') || project.mapImage.startsWith('/') ? project.mapImage : `/images/${project.mapImage}`}
                    alt={`${item.name} location map`}
                    width={1600}
                    height={1000}
                    className="h-auto w-full"
                    unoptimized={project.mapImage.startsWith('http://') || project.mapImage.startsWith('https://')}
                  />
                </div>
              </section>
            ) : null}
          </div>

          <aside>
            <div className="on-photo border border-line bg-[linear-gradient(160deg,rgba(28,33,42,.75),rgba(16,19,24,.9))] p-7 lg:sticky lg:top-26 md:p-8">
              <h2 className="mb-5 flex items-center gap-2.5 text-[1.05rem] uppercase tracking-luxe text-gold">
                <Building2 className="size-5" />
                {labels.facts}
              </h2>
              <dl>
                {facts.map((fact, index) => (
                  <div
                    key={fact.k}
                    className={cn(
                      'flex items-baseline justify-between gap-4 py-3',
                      index < facts.length - 1 && 'border-b border-line-soft'
                    )}
                  >
                    <dt className="text-[0.68rem] uppercase tracking-[0.16em] text-muted-2">
                      {fact.k}
                    </dt>
                    <dd
                      className={cn(
                        'm-0 text-right text-[0.92rem] text-cream',
                        fact.price && 'font-serif text-[1.3rem] font-semibold text-gold'
                      )}
                    >
                      {fact.v}
                    </dd>
                  </div>
                ))}
              </dl>

              <Button asChild variant="gold" size="block" className="mt-6">
                <Link href={`${href(locale, 'contact')}?project=${project.id}`}>
                  {labels.enquire}
                </Link>
              </Button>
              <WhatsAppSelector
                numbers={BRAND.whatsapp}
                label={dict.contact.whatsapp}
                chooseLabel={dict.contact.chooseWhatsapp}
                className="mt-3"
              />

              <p className="mt-5 text-[0.8rem] leading-relaxed text-muted-2">{dict.contact.remote}</p>
            </div>
          </aside>
        </div>
      </section>

      {others.length > 0 && (
        <section className="section-y bg-ink-2">
          <div className="shell">
            <h2 className="text-[clamp(2rem,3.6vw,3.1rem)]">{labels.similar}</h2>
            <Rule />
            <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {others.map((other) => (
                <ProjectCard key={other.id} project={other} locale={locale} dict={dict} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand locale={locale} dict={dict} />
    </>
  );
}
