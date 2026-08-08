import type { MetadataRoute } from 'next';

import { PROJECTS, ROUTES } from '@/lib/site';
import { locales, defaultLocale } from '@/lib/i18n/config';
import { getPublishedProperties } from '@/lib/properties';

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const published = await getPublishedProperties();
  const projectSlugs = published.length ? published.map((p) => p.slug) : PROJECTS.map((p) => p.id);
  const paths = [...ROUTES.map((route) => route.path), ...projectSlugs.map((slug) => `projects/${slug}`)];

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
