import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MapPin } from 'lucide-react';

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
  const dictItem = dict.projects.items[project.id as keyof typeof dict.projects.items];
  const name = project.name ?? dictItem?.name ?? project.id;
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
    <article className="group flex flex-col border border-line-soft bg-[linear-gradient(170deg,var(--color-surface),var(--color-ink-2))] transition-all duration-500 ease-luxe hover:-translate-y-1 hover:border-line-strong hover:shadow-[0_30px_60px_-40px_rgba(0,0,0,.95)]">
      <Link href={url} tabIndex={-1} aria-hidden="true" className="relative block aspect-[16/9] overflow-hidden">
        <Image
          src={project.image.startsWith('http') || project.image.startsWith('/') ? project.image : `/images/${project.image}`}
          alt=""
          fill
          priority={priority}
          sizes="(max-width: 860px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition-transform duration-1000 ease-luxe group-hover:scale-105"
          unoptimized={project.image.startsWith('http://') || project.image.startsWith('https://')}
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_top,rgba(10,11,14,.85),transparent_55%)]"
        />
        <span
          className={cn(
            'absolute left-4 top-4 z-1 border bg-ink/80 px-3 py-1.5 text-[0.62rem] uppercase tracking-[0.18em] backdrop-blur',
            project.status === 'ready'
              ? 'border-gold-bright bg-[linear-gradient(135deg,var(--color-gold-bright),var(--color-gold-deep))] font-medium text-[var(--fixed-ink)] shadow-[0_8px_24px_-12px_rgba(214,170,84,.95)]'
              : 'border-line text-gold'
          )}
        >
          {dict.values.statuses[project.status]}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="mb-1.5 flex items-center gap-1.5 text-[0.62rem] uppercase tracking-[0.16em] text-gold">
              <MapPin className="size-3" />
              <span>{dict.values.locations[project.location]}</span>
            </p>
            <h3 className="text-[1.4rem] leading-tight">
              <Link href={url} className="transition-colors duration-300 group-hover:text-gold-bright">
                {name}
              </Link>
            </h3>
          </div>
          <Link
            href={url}
            aria-label={`${labels.view}: ${name}`}
            className="mt-1 shrink-0 text-gold transition-colors duration-300 hover:text-gold-bright"
          >
            <ArrowRight className="size-5" />
          </Link>
        </div>

        <dl className="mt-4 flex items-end gap-6 border-t border-line-soft pt-3">
          <div>
            <dt className="mb-0.5 text-[0.56rem] uppercase tracking-[0.16em] text-muted-2">{labels.from}</dt>
            <dd className="m-0 font-serif text-[1.3rem] font-semibold leading-tight text-gold">
              {meta[0].value}
            </dd>
          </div>
          <div>
            <dt className="mb-0.5 text-[0.56rem] uppercase tracking-[0.16em] text-muted-2">{labels.bedrooms}</dt>
            <dd className="m-0 text-[0.82rem] text-cream">{meta[2].value}</dd>
          </div>
          <div className="ml-auto hidden sm:block">
            <dt className="sr-only">{labels.plan}</dt>
            <dd className="m-0 text-[0.72rem] text-muted">{meta[1].value}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}
