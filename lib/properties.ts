import { unstable_cache } from 'next/cache'
import { desc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { properties, type Property } from '@/lib/db/schema'
import type { Project } from '@/lib/site'

export async function getAllProperties() {
  try {
    return await db.select().from(properties).orderBy(desc(properties.updatedAt))
  } catch (error) {
    console.warn('[properties] Database unavailable while loading all properties:', error)
    return []
  }
}

async function loadPublishedProperties() {
  try {
    return await db.select().from(properties).where(eq(properties.isPublished, true)).orderBy(desc(properties.updatedAt))
  } catch (error) {
    console.warn('[properties] Database unavailable while loading published properties:', error)
    return []
  }
}

export const getPublishedProperties = unstable_cache(loadPublishedProperties, ['published-properties'], {
  revalidate: 15,
  tags: ['published-properties']
})

export function getPropertyBySlug(slug: string) {
  return unstable_cache(
    async () => {
      try {
        const rows = await db.select().from(properties).where(eq(properties.slug, slug)).limit(1)
        return rows[0]
      } catch (error) {
        console.warn(`[properties] Database unavailable while loading ${slug}:`, error)
        return undefined
      }
    },
    ['property-by-slug', slug],
    { revalidate: 15, tags: ['published-properties', `property-${slug}`] }
  )()
}

export function propertyToProject(property: Property): Project {
  const normalizedLocation = property.location.toLowerCase()
  const location = normalizedLocation.includes('jomtien')
    ? 'jomtien'
    : normalizedLocation.includes('pratumnak')
      ? 'pratumnak'
      : normalizedLocation.includes('bangsaray')
        ? 'bangsaray'
        : normalizedLocation.includes('wongamat')
          ? 'wongamat'
          : 'pattaya'
  const status = property.status.toLowerCase().includes('ready') || property.status.toLowerCase().includes('resale') ? 'ready' : 'offplan'
  const normalizeImageUrl = (value: string | null | undefined) => {
    const trimmed = value?.trim() ?? ''
    if (!trimmed || trimmed.startsWith('blob:')) return ''
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/')) return trimmed
    return `/images/${trimmed.replace(/^images\//, '')}`
  }
  const image = normalizeImageUrl(property.coverImageUrl) || '/placeholder.svg?height=720&width=960'
  const gallery = property.galleryImageUrls.map(normalizeImageUrl).filter(Boolean)
  const numericPrice = Number(property.price.replace(/[^0-9.]/g, ''))
  const isZenithPattaya = property.slug === 'zenith-pattaya'
  const isZenithPattayaTwo = property.slug === 'zenith-pattaya-2'
  const bedroomId: Project['bedrooms'][number] =
    property.bedrooms <= 0 ? 'studio' : property.bedrooms >= 4 ? '4plus' : (String(property.bedrooms) as Project['bedrooms'][number])

  return {
    id: property.slug,
    name: property.name,
    tagline: property.description,
    summary: property.description,
    body: property.description,
    image,
    gallery,
    videoUrl: property.videoUrl ?? null,
    documents: property.documents ?? [],
    additionalImages: property.mapImageUrl
      ? [normalizeImageUrl(property.mapImageUrl)]
      : isZenithPattaya
        ? ['/images/zenith-map.jpg']
        : isZenithPattayaTwo
          ? ['/images/zenith-pattaya-2-map.jpg']
          : ['/placeholder.svg?height=420&width=960'],
    mapImage: normalizeImageUrl(property.mapImageUrl) || (isZenithPattaya
      ? '/images/zenith-map.jpg'
      : isZenithPattayaTwo
        ? '/images/zenith-pattaya-2-map.jpg'
        : '/placeholder.svg?height=420&width=960'),
    mapUrl: property.customLocationUrl?.trim() || (isZenithPattaya
      ? 'https://maps.google.com/?q=Zenith+Pattaya'
      : isZenithPattayaTwo
        ? 'https://maps.google.com/?q=Zenith+Pattaya+2'
        : `https://maps.google.com/?q=${encodeURIComponent(property.customLocation || property.location)}`),
    location,
    locationLabel: property.customLocation || property.location,
    type: property.propertyType.toLowerCase().includes('villa')
      ? 'villa'
      : property.propertyType.toLowerCase().includes('penthouse')
        ? 'penthouse'
        : property.propertyType.toLowerCase().includes('townhouse') || property.propertyType.toLowerCase().includes('house')
          ? 'townhouse'
          : 'condo',
    status,
    plan: property.status.toLowerCase().includes('ready') || property.status.toLowerCase().includes('resale')
      ? 'plan2'
      : property.status.toLowerCase().includes('construction')
        ? 'plan3'
        : 'plan4',
    completion: property.status,
    priceFrom: Number.isFinite(numericPrice) && numericPrice > 0 ? numericPrice * 1_000_000 : undefined,
    sizeFrom: property.areaSqm ?? (isZenithPattaya ? 35 : isZenithPattayaTwo ? 65 : 0),
    bedrooms: [bedroomId],
    featured: true,
  }
}
