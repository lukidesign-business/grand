'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';

import { locales, type Locale, LANG_COOKIE } from '@/lib/i18n/config';
import { cn } from '@/lib/utils';

/** Persist the choice for a year so middleware can honour it on the next visit. */
export function rememberLocale(locale: Locale) {
  document.cookie = `${LANG_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
}

/** Swaps the leading locale segment, keeping the rest of the path intact. */
export function swapLocale(pathname: string, locale: Locale): string {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length === 0) return `/${locale}`;
  parts[0] = locale;
  return `/${parts.join('/')}`;
}

interface LanguageSwitcherProps {
  locale: Locale;
  labels: Record<string, string>;
  className?: string;
}

export function LanguageSwitcher({ locale, labels, className }: LanguageSwitcherProps) {
  const pathname = usePathname();

  const names: Record<Locale, string> = {
    en: labels.en || 'English',
    pl: labels.pl || 'Polski',
    ru: labels.ru || 'Русский',
    de: labels.de || 'Deutsch',
    es: labels.es || 'Español'
  };
  const activeName = names[locale];

  return (
    <details className={cn('group relative', className)}>
      <summary className="flex cursor-pointer list-none items-center gap-1.5 border border-line px-3 py-1.5 text-[0.68rem] uppercase tracking-[0.14em] text-muted transition-colors hover:border-gold hover:text-gold-bright [&::-webkit-details-marker]:hidden">
        <span>{activeName}</span>
        <ChevronDown className="size-3.5 transition-transform group-open:rotate-180" />
      </summary>
      <div className="absolute right-0 top-[calc(100%+0.45rem)] z-50 min-w-36 border border-line bg-ink-2 p-1.5 shadow-2xl">
        {locales.map((code) => (
          <Link
            key={code}
            href={swapLocale(pathname, code)}
            hrefLang={code}
            lang={code}
            aria-current={code === locale ? 'page' : undefined}
            onClick={() => rememberLocale(code)}
            className={cn(
              'block px-3 py-2 text-left text-[0.68rem] uppercase tracking-[0.12em] transition-colors',
              code === locale ? 'bg-gold text-[var(--fixed-ink)]' : 'text-muted hover:bg-gold/10 hover:text-gold-bright'
            )}
          >
            {names[code]}
          </Link>
        ))}
      </div>
    </details>
  );
}
