import { locales, defaultLocale, type Locale } from './i18n/config';

/**
 * Builds the canonical + hreflang set for a path. Because every locale mirrors
 * the same slugs, the alternates are a straight prefix swap.
 */
export function alternatesFor(locale: Locale, path: string) {
  const suffix = path ? `/${path}` : '';

  return {
    canonical: `/${locale}${suffix}`,
    languages: {
      ...Object.fromEntries(locales.map((code) => [code, `/${code}${suffix}`])),
      'x-default': `/${defaultLocale}${suffix}`
    }
  };
}
