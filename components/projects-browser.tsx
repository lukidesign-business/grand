'use client';

import { useMemo, useState } from 'react';

import { ProjectCard } from '@/components/project-card';
import { PROJECTS, type Project } from '@/lib/site';
import { fill } from '@/lib/i18n/fill';
import type { Dictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n/config';
import { cn } from '@/lib/utils';

type Tab = 'all' | 'ready' | 'offplan';

export function ProjectsBrowser({ locale, dict, projects = PROJECTS }: { locale: Locale; dict: Dictionary; projects?: Project[] }) {
  const [tab, setTab] = useState<Tab>('all');
  const page = dict.projects.page;

  const tabs: { id: Tab; label: string }[] = [
    { id: 'all', label: page.filterAll },
    { id: 'ready', label: page.filterReady },
    { id: 'offplan', label: page.filterOffplan }
  ];

  const visible = useMemo(
    () => (tab === 'all' ? projects : projects.filter((project) => project.status === tab)),
    [tab]
  );

  const countLabel =
    visible.length === 1 ? page.countOne : fill(page.count, { n: visible.length });

  return (
    <>
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4 md:mb-12">
        <div role="tablist" aria-label={page.filterAll} className="flex flex-wrap gap-2">
          {tabs.map((item) => {
            const active = item.id === tab;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(item.id)}
                className={cn(
                  'border px-5 py-2.5 text-[0.7rem] uppercase tracking-luxe transition-colors duration-300',
                  active
                    ? 'border-transparent bg-[linear-gradient(135deg,#d8b26d,#b98f45)] font-medium text-ink'
                    : 'border-line-soft text-muted hover:border-line-strong hover:text-gold-bright'
                )}
              >
                {item.label}
              </button>
            );
          })}
        </div>
        <p aria-live="polite" className="text-[0.72rem] uppercase tracking-luxe text-muted-2">
          {countLabel}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {visible.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            locale={locale}
            dict={dict}
            priority={index < 2}
          />
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="mt-12 text-center text-muted">{dict.search.empty}</p>
      ) : null}
    </>
  );
}
