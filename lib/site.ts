import type { Locale } from './i18n/config';

export const BRAND = {
  name: 'Grand Property',
  consultant: 'Eryk Fokt',
  email: 'thai@grand-properties.com',
  phoneDisplay: '+48 666 212 777',
  phoneHref: '+48666212777',
  whatsappHref: 'https://wa.me/48666212777',
  whatsapp: [
    { display: '+48 666 212 777', href: 'https://wa.me/48666212777', country: 'Poland', code: 'PL' },
    { display: '+48 600 377 522', href: 'https://wa.me/48600377522', country: 'Poland', code: 'PL' },
    { display: '+66 81 373 0494', href: 'https://wa.me/66813730494', country: 'Thailand', code: 'TH' }
  ],
  address: '433/8 Moo 12, Tapphraya Rd., Nongprue, Banglamung, Chon Buri 20150',
  city: '433/8 Moo 12, Tapphraya Rd., Nongprue, Banglamung',
  country: 'Chon Buri 20150, Thailand',
  social: [
    { id: 'instagram', href: 'https://instagram.com/' },
    { id: 'facebook', href: 'https://facebook.com/' },
    { id: 'linkedin', href: 'https://linkedin.com/' }
  ]
} as const;

/** Route ids double as dictionary keys for nav labels and page metadata. */
export type RouteId = 'home' | 'projects' | 'thailand' | 'about' | 'search' | 'contact';

export const ROUTES: { id: RouteId; path: string }[] = [
  { id: 'home', path: '' },
  { id: 'projects', path: 'projects' },
  { id: 'thailand', path: 'thailand' },
  { id: 'about', path: 'about' },
  { id: 'search', path: 'search' },
  { id: 'contact', path: 'contact' }
];

export const NAV: { id: RouteId | 'invest'; route: RouteId; hash?: string }[] = [
  { id: 'projects', route: 'projects' },
  { id: 'thailand', route: 'thailand' },
  { id: 'invest', route: 'thailand', hash: 'advantages' },
  { id: 'about', route: 'about' },
  { id: 'search', route: 'search' }
];

export const FOOTER_NAV = {
  explore: [
    { id: 'projects', route: 'projects' },
    { id: 'search', route: 'search' },
    { id: 'thailand', route: 'thailand' }
  ],
  company: [
    { id: 'about', route: 'about' },
    { id: 'contact', route: 'contact' },
    { id: 'invest', route: 'thailand', hash: 'advantages' }
  ]
} as const;

/** Every locale mirrors the same slugs, so switching language is a prefix swap. */
export function href(locale: Locale, route: RouteId = 'home', hash?: string): string {
  const entry = ROUTES.find((r) => r.id === route);
  const segment = entry?.path ?? '';
  return `/${locale}${segment ? `/${segment}` : ''}${hash ? `#${hash}` : ''}`;
}

export function projectHref(locale: Locale, id: string): string {
  return `/${locale}/projects/${id}`;
}

export function formatPrice(locale: Locale, value: number): string {
  return `฿${new Intl.NumberFormat(locale === 'pl' ? 'pl-PL' : 'en-GB').format(value)}`;
}

/* ------------------------------------------------------------ filter values */

export const LOCATIONS = ['pattaya', 'jomtien', 'pratumnak', 'bangsaray', 'wongamat'] as const;
export const PROPERTY_TYPES = ['condo', 'penthouse', 'villa', 'townhouse'] as const;
export const BEDROOMS = ['studio', '1', '2', '3', '4plus'] as const;
export const STATUSES = ['ready', 'offplan'] as const;
export const PLANS = ['plan2', 'plan3', 'plan4'] as const;

export type LocationId = (typeof LOCATIONS)[number];
export type PropertyType = (typeof PROPERTY_TYPES)[number];
export type BedroomId = (typeof BEDROOMS)[number];
export type StatusId = (typeof STATUSES)[number];
export type PlanId = (typeof PLANS)[number];
export type PriceBandId = 'p1' | 'p2' | 'p3' | 'p4';

export const PRICE_BANDS: { id: PriceBandId; min: number; max: number }[] = [
  { id: 'p1', min: 0, max: 4_000_000 },
  { id: 'p2', min: 4_000_000, max: 7_000_000 },
  { id: 'p3', min: 7_000_000, max: 12_000_000 },
  { id: 'p4', min: 12_000_000, max: Number.POSITIVE_INFINITY }
];

/* ---------------------------------------------------------------- projects */

export interface Project {
  id: string;
  image: string;
  gallery: string[];
  additionalImages?: string[];
  mapUrl?: string;
  location: LocationId;
  type: PropertyType;
  status: StatusId;
  plan?: PlanId;
  completion: string;
  priceFrom?: number;
  sizeFrom: number;
  bedrooms: BedroomId[];
  floors?: number;
  units?: number;
  featured: boolean;
}

export const PROJECTS: Project[] = [
  {
    id: 'zenith-pattaya',
    image: 'zenith-living-1.jpg',
    gallery: [
      'zenith-bedroom-1.jpg',
      'zenith-living-2.jpg',
      'zenith-living-3.jpg',
      'zenith-bedroom-2.jpg',
      'zenith-bedroom-3.jpg',
      'zenith-bedroom-4.jpg',
      'zenith-bedroom-5.jpg',
      'zenith-living-4.jpg',
      'zenith-living-5.jpg',
      'zenith-living-6.jpg',
      'zenith-living-7.jpg',
      'zenith-living-8.jpg',
      'zenith-bathroom-1.jpg',
      'zenith-bathroom-2.jpg',
      'zenith-bathroom-3.jpg',
      'zenith-bathroom-4.jpg'
    ],
    additionalImages: ['zenith-map.jpg'],
    mapUrl: 'https://maps.app.goo.gl/AHsdtqmkctAocsLx8?g_st=it',
    location: 'pattaya',
    type: 'condo',
    status: 'ready',
    completion: 'Ready to move in',
    sizeFrom: 65,
    bedrooms: ['2'],
    featured: true
  }
];

export function getProject(id: string): Project | undefined {
  return PROJECTS.find((p) => p.id === id);
}
