import type { MetadataRoute } from 'next';

import { PROJECTS, ROUTES } from '@/lib/site';
import { locales, defaultLocale } from '@/lib/i18n/config';

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [...ROUTES.map((route) => route.path), ...PROJECTS.map((p) => `projects/${p.id}`)];

  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: `${BASE}/${locale}${path ? `/${path}` : ''}`,
      lastModified: new Date(),
      alternates: {
        languages: {
          ...Object.fromEntries(
            locales.map((code) => [code, `${BASE}/${code}${path ? `/${path}` : ''}`])
          ),
          'x-default': `${BASE}/${defaultLocale}${path ? `/${path}` : ''}`
        }
      }
    }))
  );
}
