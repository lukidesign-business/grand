'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { BedDouble, Building2, CalendarDays, ChevronDown, Home, MapPin, Search, Tag } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ProjectCard } from '@/components/project-card';
import { SearchField } from '@/components/hero-search';
import {
  BEDROOMS,
  LOCATIONS,
  PLANS,
  PRICE_BANDS,
  PROJECTS,
  PROPERTY_TYPES,
  STATUSES,
  href
} from '@/lib/site';
import { fill } from '@/lib/i18n/fill';
import type { Dictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n/config';

export type SearchFilters = {
  location: string;
  type: string;
  price: string;
  plan: string;
  bedrooms: string;
  status: string;
};

const EMPTY: SearchFilters = { location: '', type: '', price: '', plan: '', bedrooms: '', status: '' };
type SortMode = 'featured' | 'asc' | 'desc';

export function SearchExperience({
  locale,
  dict,
  initialFilters
}: {
  locale: Locale;
  dict: Dictionary;
  initialFilters: SearchFilters;
}) {
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [sort, setSort] = useState<SortMode>('featured');

  const results = useMemo(() => {
    const band = PRICE_BANDS.find((b) => b.id === filters.price);

    const matched = PROJECTS.filter((project) => {
      if (filters.location && project.location !== filters.location) return false;
      if (filters.type && project.type !== filters.type) return false;
      if (filters.plan && project.plan !== filters.plan) return false;
      if (filters.status && project.status !== filters.status) return false;
      if (filters.bedrooms && !project.bedrooms.includes(filters.bedrooms as never)) return false;
      if (
        band &&
        (project.priceFrom === undefined ||
          project.priceFrom < band.min ||
          project.priceFrom >= band.max)
      ) {
        return false;
      }
      return true;
    });

    return [...matched].sort((a, b) => {
      if (sort === 'asc') return (a.priceFrom ?? Number.POSITIVE_INFINITY) - (b.priceFrom ?? Number.POSITIVE_INFINITY);
      if (sort === 'desc') return (b.priceFrom ?? -1) - (a.priceFrom ?? -1);
      return Number(b.featured) - Number(a.featured);
    });
  }, [filters, sort]);

  const set = (key: keyof SearchFilters) => (event: React.ChangeEvent<HTMLSelectElement>) =>
    setFilters((current) => ({ ...current, [key]: event.target.value }));

  const s = dict.search;
  const v = dict.values;

  const countLabel =
    results.length === 1 ? s.resultCountOne : fill(s.resultCount, { n: results.length });

  return (
    <div className="shell grid items-start gap-6 lg:grid-cols-[320px_1fr] lg:gap-10">
      <aside className="lg:sticky lg:top-26">
        <form
          role="search"
          aria-label={s.title}
          onSubmit={(event) => event.preventDefault()}
          className="border border-line bg-[linear-gradient(165deg,rgba(28,33,42,.6),rgba(14,16,20,.9))] p-6"
        >
          <div className="mb-5 flex items-center justify-between gap-4 border-b border-line-soft pb-5">
            <h2 className="flex items-center gap-2 text-[0.85rem] uppercase tracking-luxe text-gold">
              <Search className="size-4" />
              {s.filters}
            </h2>
            <button
              type="button"
              onClick={() => setFilters(EMPTY)}
              className="text-[0.68rem] uppercase tracking-[0.12em] text-muted-2 transition-colors hover:text-gold"
            >
              {s.reset}
            </button>
          </div>

          <div className="grid gap-px border border-line-soft bg-line-soft sm:grid-cols-2 lg:grid-cols-1">
            <SearchField
              id="f-location"
              name="location"
              label={s.location}
              placeholder={s.anyLocation}
              icon={<MapPin />}
              value={filters.location}
              onChange={set('location')}
              options={LOCATIONS.map((id) => ({ value: id, label: v.locations[id] }))}
              className="bg-ink-2"
            />
            <SearchField
              id="f-type"
              name="type"
              label={s.type}
              placeholder={s.anyType}
              icon={<Home />}
              value={filters.type}
              onChange={set('type')}
              options={PROPERTY_TYPES.map((id) => ({ value: id, label: v.types[id] }))}
              className="bg-ink-2"
            />
            <SearchField
              id="f-price"
              name="price"
              label={s.price}
              placeholder={s.anyPrice}
              icon={<Tag />}
              value={filters.price}
              onChange={set('price')}
              options={PRICE_BANDS.map((b) => ({ value: b.id, label: v.priceBands[b.id] }))}
              className="bg-ink-2"
            />
            <SearchField
              id="f-plan"
              name="plan"
              label={s.plan}
              placeholder={s.anyPlan}
              icon={<CalendarDays />}
              value={filters.plan}
              onChange={set('plan')}
              options={PLANS.map((id) => ({ value: id, label: v.plans[id] }))}
              className="bg-ink-2"
            />
            <SearchField
              id="f-bedrooms"
              name="bedrooms"
              label={s.bedrooms}
              placeholder={s.anyBedrooms}
              icon={<BedDouble />}
              value={filters.bedrooms}
              onChange={set('bedrooms')}
              options={BEDROOMS.map((id) => ({ value: id, label: v.bedrooms[id] }))}
              className="bg-ink-2"
            />
            <SearchField
              id="f-status"
              name="status"
              label={s.status}
              placeholder={s.anyStatus}
              icon={<Building2 />}
              value={filters.status}
              onChange={set('status')}
              options={STATUSES.map((id) => ({ value: id, label: v.statuses[id] }))}
              className="bg-ink-2"
            />
          </div>
        </form>
      </aside>

      <div>
        <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
          <p aria-live="polite" className="text-[0.72rem] uppercase tracking-luxe text-muted-2">
            {countLabel}
          </p>
          <label className="relative inline-flex items-center gap-2.5 border border-line-soft px-3.5 py-2">
            <span className="text-[0.66rem] uppercase tracking-luxe text-muted-2">{s.sort}</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortMode)}
              className="cursor-pointer appearance-none border-0 bg-transparent pr-1 text-[0.82rem] text-cream focus:outline-none"
            >
              <option value="featured">{s.sortFeatured}</option>
              <option value="asc">{s.sortPriceAsc}</option>
              <option value="desc">{s.sortPriceDesc}</option>
            </select>
            <ChevronDown className="size-3.5 text-muted" />
          </label>
        </div>

        {results.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                locale={locale}
                dict={dict}
                priority={index < 2}
              />
            ))}
          </div>
        ) : (
          <div className="border border-line-soft bg-surface px-6 py-16 text-center md:py-20">
            <h2 className="mb-3 text-[1.7rem]">{s.empty}</h2>
            <p className="mx-auto mb-8 max-w-[44ch] text-muted">{s.emptyBody}</p>
            <Button asChild variant="gold">
              <Link href={href(locale, 'contact')}>{s.emptyCta}</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
