'use client';

import Link from 'next/link';
import { useState } from 'react';
import { BedDouble, ChevronDown, Home, MapPin, Search, Tag } from 'lucide-react';

import { HeroSearchField } from '@/components/hero-search-field';
import { BEDROOMS, LOCATIONS, PRICE_BANDS, PROPERTY_TYPES, href } from '@/lib/site';
import type { Dictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n/config';
import { cn } from '@/lib/utils';

interface FilterFieldProps {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  icon: React.ReactNode;
  options: { value: string; label: string }[];
  className?: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
}

/** The filter-page variant remains a native controlled field for instant filtering. */
export function SearchField({
  id,
  name,
  label,
  placeholder,
  icon,
  options,
  className,
  value,
  onChange
}: FilterFieldProps) {
  return (
    <div className={cn('group relative flex min-w-0 items-center gap-3.5 px-4 py-4', className)}>
      <span className="flex text-gold [&_svg]:size-5.5">{icon}</span>
      <div className="flex min-w-0 flex-1 flex-col">
        <label htmlFor={id} className="mb-0.5 text-[0.6rem] uppercase tracking-[0.2em] text-gold">
          {label}
        </label>
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full cursor-pointer appearance-none truncate border-0 bg-transparent p-0 text-[0.95rem] font-light text-cream-bright focus:outline-none"
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <ChevronDown className="size-4 text-muted" />
    </div>
  );
}

/**
 * The bar docked at the foot of the hero. It is a plain GET form, so it works
 * with JavaScript disabled and hands its query straight to the search page.
 */
export function HeroSearch({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const s = dict.hero.search;
  const v = dict.values;
  const action = href(locale, 'search');
  const [openField, setOpenField] = useState<string | null>(null);

  const divider = 'sm:border-l sm:border-line-soft border-t border-line-soft sm:border-t-0';

  return (
    <form action={action} method="get" role="search" aria-label={s.label} className="reveal relative z-[100] max-md:mt-2">
      <div className="relative z-[200] grid border border-line bg-[rgba(12,13,17,.82)] shadow-[0_24px_55px_-32px_rgba(0,0,0,.95)] backdrop-blur-xl backdrop-saturate-125 max-md:rounded-sm sm:grid-cols-2 xl:grid-cols-[1.45fr_1fr_1fr_.85fr_auto]">
        <HeroSearchField
          id="hero-location"
          name="location"
          openField={openField}
          setOpenField={setOpenField}
          label={s.location}
          placeholder={s.locationPlaceholder}
          hint={s.locationHint}
          icon={<MapPin />}
          options={LOCATIONS.map((id) => ({ value: id, label: v.locations[id] }))}
        />
        <HeroSearchField
          id="hero-type"
          name="type"
          openField={openField}
          setOpenField={setOpenField}
          label={s.type}
          placeholder={s.typeAny}
          icon={<Home />}
          options={PROPERTY_TYPES.map((id) => ({ value: id, label: v.types[id] }))}
          className={divider}
        />
        <HeroSearchField
          id="hero-price"
          name="price"
          openField={openField}
          setOpenField={setOpenField}
          label={s.price}
          placeholder={s.priceAny}
          icon={<Tag />}
          options={PRICE_BANDS.map((band) => ({ value: band.id, label: v.priceBands[band.id] }))}
          className="border-t border-line-soft sm:border-l-0 xl:border-l xl:border-t-0"
        />
        <HeroSearchField
          id="hero-bedrooms"
          name="bedrooms"
          openField={openField}
          setOpenField={setOpenField}
          label={s.bedrooms}
          placeholder={s.bedroomsAny}
          icon={<BedDouble />}
          options={BEDROOMS.map((id) => ({ value: id, label: v.bedroomsShort[id] }))}
          className={divider}
        />

        <button
          type="submit"
          className="group flex items-center justify-center gap-2.5 bg-[linear-gradient(135deg,#d8b26d,#b98f45_60%,#cfa561)] px-5 py-3 text-[0.66rem] font-medium uppercase tracking-luxe text-ink transition-[filter] duration-300 hover:brightness-110 sm:col-span-2 sm:px-8 sm:py-4 xl:col-span-1"
        >
          <Search className="size-4.5" />
          <span>{s.submit}</span>
        </button>
      </div>

      <div className="relative z-0 mt-4 flex flex-wrap items-center gap-2.5">
        <span className="mr-1 text-[0.62rem] uppercase tracking-[0.22em] text-gold">{s.popular}</span>
        <ul className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] sm:flex-wrap sm:overflow-visible [&::-webkit-scrollbar]:hidden">
          {LOCATIONS.slice(0, 5).map((id) => (
            <li key={id}>
              <Link
                href={`${action}?location=${id}`}
                className="inline-flex items-center gap-1.5 whitespace-nowrap border border-line bg-[rgba(12,13,17,.5)] px-4 py-2 text-[0.76rem] text-cream/90 backdrop-blur transition-colors duration-300 hover:border-gold hover:bg-gold/8 hover:text-gold-bright"
              >
                <MapPin className="size-3.5 text-gold" />
                <span>{v.locations[id]}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </form>
  );
}
