import { NextResponse, type NextRequest } from 'next/server';

import {
  LANG_COOKIE,
  defaultLocale,
  isLocale,
  localeByCountry,
  localeFromAcceptLanguage,
  locales
} from '@/lib/i18n/config';

/**
 * Every page lives under /<locale>. Requests without one are routed to the
 * visitor's best-guess locale: a stored choice first, then the CDN's country
 * hint, then the Accept-Language header, then English.
 */
export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
  const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/');
  if (hasLocale || isAdminRoute) return NextResponse.next();

  const stored = request.cookies.get(LANG_COOKIE)?.value;
  const country = request.headers.get('x-vercel-ip-country')?.toUpperCase();

  const locale =
    (isLocale(stored) ? stored : null) ??
    (country ? localeByCountry[country] : null) ??
    localeFromAcceptLanguage(request.headers.get('accept-language')) ??
    defaultLocale;

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
  url.search = search;
  return NextResponse.redirect(url);
}

export const config = {
  // Everything except Next internals, the API and files with an extension.
  matcher: ['/((?!_next|api|.*\\..*).*)']
};
