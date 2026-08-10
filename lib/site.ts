import type { Locale } from './i18n/config';

export const BRAND = {
  name: 'Grand Property',
  consultant: 'Eryk Fokt',
  email: 'thai@grand-properties.com',
  phoneDisplay: '+66 98 085 0053',
  phoneHref: '+66980850053',
  whatsappHref: 'https://wa.me/66980850053',
  whatsapp: [
    { display: '+66 98 085 0053', href: 'https://wa.me/66980850053', country: 'Thailand', code: 'TH' },
    { display: '+48 666 212 777', href: 'https://wa.me/48666212777', country: 'Poland', code: 'PL' }
  ],
  address: '315/85 Moo 12, Nongprue Banglamung, Chonburi, Thailand',
  city: '315/85 Moo 12, Nongprue Banglamung',
  country: 'Chonburi, Thailand',
  social: [
    { id: 'instagram', href: 'https://instagram.com/' },
    { id: 'facebook', href: 'https://facebook.com/' }
  ]
} as const;

/** The two people clients deal with directly, shown together in the footer. */
export const TEAM = [
  {
    id: 'eryk',
    name: 'Eryk Fokt',
    role: 'Founder & Property Consultant',
    photo: '/images/partners/eryk-fokt.png'
  },
  {
    id: 'business-partner',
    name: 'Pattaya Property 11',
    role: 'Business Partner',
    photo: '/images/partners/business-partner.jpg',
    whatsapp: { display: '+66 98 085 0053', href: 'https://wa.me/66980850053' }
  }
] as const;

/** Development partner credited across the hero and footer. */
export const OFFICIAL_PARTNER = {
  name: 'Grand Solaire',
  mark: '/images/partners/grand-solaire-mark.png'
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
  name?: string;
  tagline?: string;
  summary?: string;
  body?: string;
  image: string;
  gallery: string[];
  videoUrl?: string | null;
  documents?: Array<{ title: string; url: string }>;
  additionalImages?: string[];
  mapImage?: string;
  mapUrl?: string;
  location: LocationId;
  locationLabel?: string;
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
    gallery: ['zenith-living-1.jpg'],
    additionalImages: ['zenith-map.jpg'],
    mapImage: 'zenith-map.jpg',
    mapUrl: 'https://maps.google.com/?q=Zenith+Pattaya',
    location: 'pattaya',
    type: 'condo',
    status: 'ready',
    completion: 'Ready to move in',
    priceFrom: 3_900_000,
    sizeFrom: 35,
    bedrooms: ['1'],
    featured: true
  },
  {
    id: 'zenith-pattaya-2',
    image: 'zenith-pattaya-2-living.jpg',
    gallery: [
      'zenith-pattaya-2-living-wide.jpg',
      'zenith-pattaya-2-interior-1.jpg',
      'zenith-pattaya-2-bedroom-1.jpg',
      'zenith-pattaya-2-bedroom-2.jpg',
      'zenith-pattaya-2-bathroom-1.jpg',
      'zenith-pattaya-2-interior-2.jpg',
      'zenith-pattaya-2-interior-3.jpg',
      'zenith-pattaya-2-interior-4.jpg',
      'zenith-pattaya-2-interior-5.jpg',
      'zenith-pattaya-2-exterior-1.jpg',
      'zenith-pattaya-2-exterior-2.jpg',
      'zenith-pattaya-2-exterior-3.jpg',
      'zenith-pattaya-2-exterior-4.jpg',
      'zenith-pattaya-2-exterior-5.jpg'
    ],
    additionalImages: ['zenith-pattaya-2-map.jpg'],
    mapImage: 'zenith-pattaya-2-map.jpg',
    mapUrl: 'https://maps.google.com/?q=Zenith+Pattaya+2',
    location: 'jomtien',
    type: 'condo',
    status: 'ready',
    completion: 'Ready to move in',
    priceFrom: 4_200_000,
    sizeFrom: 65,
    bedrooms: ['1'],
    floors: 8,
    units: 900,
    featured: true
  }
];

export function getProject(id: string): Project | undefined {
  return PROJECTS.find((p) => p.id === id);
}
