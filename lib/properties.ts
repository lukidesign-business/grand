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

export async function getPublishedProperties() {
  try {
    return await db.select().from(properties).where(eq(properties.isPublished, true)).orderBy(desc(properties.updatedAt))
  } catch (error) {
    console.warn('[properties] Database unavailable while loading published properties:', error)
    return []
  }
}

export async function getPropertyBySlug(slug: string) {
  try {
    const rows = await db.select().from(properties).where(eq(properties.slug, slug)).limit(1)
    return rows[0]
  } catch (error) {
    console.warn(`[properties] Database unavailable while loading ${slug}:`, error)
    return undefined
  }
}

export function propertyToProject(property: Property): Project {
  const location = property.location.toLowerCase().includes('jomtien') ? 'jomtien' : 'pattaya'
  const status = property.status.toLowerCase().includes('ready') ? 'ready' : 'offplan'
  const normalizeImageUrl = (value: string) => {
    const trimmed = value.trim()
    if (!trimmed) return ''
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/')) return trimmed
    return `/images/${trimmed.replace(/^images\//, '')}`
  }
  const image = normalizeImageUrl(property.coverImageUrl)
  const gallery = property.galleryImageUrls.map(normalizeImageUrl).filter(Boolean)
  const numericPrice = Number(property.price.replace(/[^0-9.]/g, ''))
  const isZenithPattaya = property.slug === 'zenith-pattaya'
  const isZenithPattayaTwo = property.slug === 'zenith-pattaya-2'

  return {
    id: property.slug,
    image,
    gallery,
    additionalImages: property.mapImageUrl
      ? [normalizeImageUrl(property.mapImageUrl)]
      : isZenithPattaya
        ? ['/images/zenith-map.jpg']
        : isZenithPattayaTwo
          ? ['/images/zenith-pattaya-2-map.jpg']
          : undefined,
    mapImage: property.mapImageUrl ? normalizeImageUrl(property.mapImageUrl) : (isZenithPattaya
      ? '/images/zenith-map.jpg'
      : isZenithPattayaTwo
        ? '/images/zenith-pattaya-2-map.jpg'
        : undefined),
    mapUrl: isZenithPattaya
      ? 'https://maps.google.com/?q=Zenith+Pattaya'
      : isZenithPattayaTwo
        ? 'https://maps.google.com/?q=Zenith+Pattaya+2'
        : undefined,
    location,
    type: property.propertyType.toLowerCase().includes('villa') ? 'villa' : 'condo',
    status,
    completion: property.status,
    priceFrom: Number.isFinite(numericPrice) && numericPrice > 0 ? numericPrice * 1_000_000 : undefined,
    sizeFrom: property.areaSqm ?? (isZenithPattaya ? 35 : isZenithPattayaTwo ? 65 : 0),
    bedrooms: [String(property.bedrooms) as Project['bedrooms'][number]],
    featured: true,
  }
}
