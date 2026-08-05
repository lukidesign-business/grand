import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check, MapPin } from 'lucide-react';

import { formatPrice, projectHref, type Project } from '@/lib/site';
import type { Dictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n/config';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
  locale: Locale;
  dict: Dictionary;
  priority?: boolean;
}

export function ProjectCard({ project, locale, dict, priority = false }: ProjectCardProps) {
  const item = dict.projects.items[project.id as keyof typeof dict.projects.items];
  const labels = dict.projects.labels;
  const url = projectHref(locale, project.id);

  const meta = [
    {
      label: labels.from,
      value: project.priceFrom ? formatPrice(locale, project.priceFrom) : labels.priceOnRequest,
      price: true
    },
    {
      label: labels.plan,
      value: project.plan ? dict.values.plans[project.plan] : labels.resale
    },
    {
      label: labels.bedrooms,
      value: project.bedrooms.map((b) => dict.values.bedroomsShort[b]).join(' · ')
    },
    { label: labels.completion, value: project.completion }
  ];

  return (
    <article className="reveal group flex flex-col border border-line-soft bg-[linear-gradient(170deg,var(--color-surface),var(--color-ink-2))] transition-all duration-500 ease-luxe hover:-translate-y-1 hover:border-line-strong hover:shadow-[0_30px_60px_-40px_rgba(0,0,0,.95)]">
      <Link href={url} tabIndex={-1} aria-hidden="true" className="relative block aspect-16/11 overflow-hidden">
        <Image
          src={`/images/${project.image}`}
          alt=""
          fill
          priority={priority}
          sizes="(max-width: 860px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition-transform duration-1000 ease-luxe group-hover:scale-105"
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_top,rgba(10,11,14,.85),transparent_55%)]"
        />
        <span
          className={cn(
            'absolute left-4 top-4 z-1 border bg-ink/80 px-3 py-1.5 text-[0.62rem] uppercase tracking-[0.18em] backdrop-blur',
            project.status === 'ready'
              ? 'border-ready/35 text-ready'
              : 'border-line text-gold'
          )}
        >
          {dict.values.statuses[project.status]}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-6 md:p-7">
        <p className="mb-3 flex items-center gap-1.5 text-[0.68rem] uppercase tracking-[0.18em] text-gold">
          <MapPin className="size-3.5" />
          <span>{dict.values.locations[project.location]}</span>
        </p>

        <h3 className="mb-2 text-[1.55rem]">
          <Link href={url} className="transition-colors duration-300 group-hover:text-gold-bright">
            {item.name}
          </Link>
        </h3>
        <p className="mb-5 text-[0.9rem] text-muted">{item.tagline}</p>

        <dl className="mb-5 grid grid-cols-2 gap-x-4 gap-y-3.5 border-y border-line-soft py-4">
          {meta.map((entry) => (
            <div key={entry.label}>
              <dt className="mb-0.5 text-[0.6rem] uppercase tracking-[0.18em] text-muted-2">
                {entry.label}
              </dt>
              <dd
                className={cn(
                  'm-0 text-[0.88rem] text-cream',
                  entry.price && 'font-serif text-[1.35rem] font-semibold leading-tight text-gold'
                )}
              >
                {entry.value}
              </dd>
            </div>
          ))}
        </dl>

        <ul className="mb-6 grid gap-2">
          {item.highlights.slice(0, 3).map((highlight) => (
            <li key={highlight} className="flex gap-2.5 text-[0.84rem] leading-relaxed text-muted">
              <Check className="mt-1 size-3.5 shrink-0 text-gold" />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>

        <Link
          href={url}
          className="mt-auto inline-flex items-center gap-2.5 self-start border-b border-gold/25 pb-1 text-[0.72rem] uppercase tracking-luxe text-gold transition-colors duration-300 hover:border-gold hover:text-gold-bright"
        >
          {labels.view}
          <ArrowRight className="size-4 transition-transform duration-300 hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
