import { desc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { properties, type Property } from '@/lib/db/schema'
import type { Project } from '@/lib/site'

export async function getAllProperties() {
  return db.select().from(properties).orderBy(desc(properties.updatedAt))
}

export async function getPublishedProperties() {
  return db.select().from(properties).where(eq(properties.isPublished, true)).orderBy(desc(properties.updatedAt))
}

export async function getPropertyBySlug(slug: string) {
  const rows = await db.select().from(properties).where(eq(properties.slug, slug)).limit(1)
  return rows[0]
}

export function propertyToProject(property: Property): Project {
  const location = property.location.toLowerCase().includes('jomtien') ? 'jomtien' : 'pattaya'
  const status = property.status.toLowerCase().includes('ready') ? 'ready' : 'offplan'
  const image = property.coverImageUrl
  const gallery = property.galleryImageUrls
  const numericPrice = Number(property.price.replace(/[^0-9.]/g, ''))

  return {
    id: property.slug,
    image,
    gallery,
    location,
    type: property.propertyType.toLowerCase().includes('villa') ? 'villa' : 'condo',
    status,
    completion: property.status,
    priceFrom: Number.isFinite(numericPrice) && numericPrice > 0 ? numericPrice * 1_000_000 : undefined,
    sizeFrom: 0,
    bedrooms: [String(property.bedrooms) as Project['bedrooms'][number]],
    featured: true,
  }
}
