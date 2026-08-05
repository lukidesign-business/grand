import type { Locale } from './i18n/config';

export const BRAND = {
  name: 'Grand Property',
  consultant: 'Eryk Fokt',
  email: 'hello@grandproperty.co.th',
  phoneDisplay: '+48 666 212 777',
  phoneHref: '+48666212777',
  whatsappHref: 'https://wa.me/48666212777',
  whatsapp: [
    { display: '+48 666 212 777', href: 'https://wa.me/48666212777' },
    { display: '+48 600 377 522', href: 'https://wa.me/48600377522' },
    { display: '+66 81 373 0494', href: 'https://wa.me/66813730494' }
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

export const LOCATIONS = ['pattaya', 'jomtien', 'pratumnak', 'najomtien', 'bangsaray', 'wongamat'] as const;
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
    id: 'aurea-bayfront',
    image: 'project-01.jpg',
    gallery: ['interior-living.jpg', 'amenities.jpg', 'bedroom.jpg'],
    location: 'jomtien',
    type: 'condo',
    status: 'offplan',
    plan: 'plan4',
    completion: '2028',
    priceFrom: 4_900_000,
    sizeFrom: 32,
    bedrooms: ['studio', '1', '2'],
    floors: 44,
    units: 612,
    featured: true
  },
  {
    id: 'celeste-skyline',
    image: 'project-02.jpg',
    gallery: ['bedroom.jpg', 'lobby.jpg', 'amenities.jpg'],
    location: 'pratumnak',
    type: 'condo',
    status: 'offplan',
    plan: 'plan3',
    completion: '2027',
    priceFrom: 6_400_000,
    sizeFrom: 45,
    bedrooms: ['1', '2', '3'],
    floors: 38,
    units: 318,
    featured: true
  },
  {
    id: 'verdana-lagoon',
    image: 'project-03.jpg',
    gallery: ['amenities.jpg', 'interior-living.jpg', 'approach-pool.jpg'],
    location: 'najomtien',
    type: 'condo',
    status: 'ready',
    plan: 'plan2',
    completion: '2025',
    priceFrom: 3_750_000,
    sizeFrom: 30,
    bedrooms: ['studio', '1', '2'],
    floors: 8,
    units: 240,
    featured: true
  },
  {
    id: 'meridian-grand',
    image: 'project-04.jpg',
    gallery: ['lobby.jpg', 'interior-living.jpg', 'bedroom.jpg'],
    location: 'pattaya',
    type: 'condo',
    status: 'offplan',
    plan: 'plan3',
    completion: '2027',
    priceFrom: 5_200_000,
    sizeFrom: 35,
    bedrooms: ['1', '2', '3'],
    floors: 41,
    units: 486,
    featured: true
  },
  {
    id: 'seranai-wongamat',
    image: 'interior-living.jpg',
    gallery: ['bedroom.jpg', 'amenities.jpg', 'lobby.jpg'],
    location: 'wongamat',
    type: 'penthouse',
    status: 'ready',
    plan: 'plan2',
    completion: '2024',
    priceFrom: 13_800_000,
    sizeFrom: 118,
    bedrooms: ['2', '3', '4plus'],
    floors: 27,
    units: 96,
    featured: false
  },
  {
    id: 'palmera-bangsaray',
    image: 'approach-pool.jpg',
    gallery: ['amenities.jpg', 'interior-living.jpg', 'bedroom.jpg'],
    location: 'bangsaray',
    type: 'villa',
    status: 'offplan',
    plan: 'plan3',
    completion: '2027',
    priceFrom: 9_600_000,
    sizeFrom: 176,
    bedrooms: ['3', '4plus'],
    floors: 2,
    units: 34,
    featured: false
  },
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
    featured: false
  }
];

export function getProject(id: string): Project | undefined {
  return PROJECTS.find((p) => p.id === id);
}
