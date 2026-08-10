'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

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

  return (
    <div className={cn('inline-flex items-center overflow-hidden border border-line', className)}>
      {locales.map((code, index) => {
        const active = code === locale;
        return (
          <Link
            key={code}
            href={swapLocale(pathname, code)}
            hrefLang={code}
            lang={code}
            aria-current={active ? 'true' : undefined}
            onClick={() => rememberLocale(code)}
            className={cn(
              'px-3 py-1.5 text-[0.68rem] uppercase tracking-[0.14em] transition-colors duration-300',
              index > 0 && 'border-l border-line',
              active
                ? 'bg-[linear-gradient(135deg,#d8b26d,#b98f45)] font-medium text-[var(--fixed-ink)]'
                : 'text-muted hover:bg-gold/8 hover:text-gold-bright'
            )}
          >
            <span aria-hidden="true">{labels[`${code}Short`]}</span>
            <span className="sr-only">{labels[code]}</span>
          </Link>
        );
      })}
    </div>
  );
}
