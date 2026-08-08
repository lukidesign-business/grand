import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'
import { asc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { properties } from '@/lib/db/schema'
import { requireAdmin } from '@/lib/admin'

const allowedStatuses = new Set(['Ready to move', 'Under construction', 'Resale'])
const allowedTypes = new Set(['Condominium', 'Villa', 'House'])

export async function GET() {
  try {
    await requireAdmin()
    const rows = await db.select().from(properties).orderBy(asc(properties.name))
    return NextResponse.json(rows)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to load properties'
    return NextResponse.json({ error: message }, { status: message === 'Unauthorized' ? 401 : 500 })
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin()
    const body = await request.json()
    const name = String(body.name ?? '').trim() || 'Untitled property'
    const slug = String(body.slug ?? name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')) || `property-${Date.now()}`
    const status = String(body.status ?? 'Ready to move')
    const propertyType = String(body.propertyType ?? 'Condominium')
    const bedrooms = Number(body.bedrooms)
    const location = String(body.location ?? '').trim() || 'Location available on request'
    const price = String(body.price ?? '').trim() || 'Price available on request'
    const description = String(body.description ?? '').trim() || 'Property details available on request'
    const coverImageUrl = String(body.coverImageUrl ?? '').trim()
    const galleryImageUrls = Array.isArray(body.galleryImageUrls) ? body.galleryImageUrls.filter((url: unknown) => typeof url === 'string') : []
    const mapImageUrl = String(body.mapImageUrl ?? '').trim() || null
    const areaSqm = body.areaSqm === null || body.areaSqm === '' ? null : Number(body.areaSqm)

    if (!Number.isInteger(bedrooms) || bedrooms < 0 || (areaSqm !== null && (!Number.isInteger(areaSqm) || areaSqm < 0))) {
      return NextResponse.json({ error: 'Bedrooms and size must be valid numbers' }, { status: 400 })
    }
    if (!allowedStatuses.has(status) || !allowedTypes.has(propertyType)) {
      return NextResponse.json({ error: 'Choose a valid status and property type' }, { status: 400 })
    }

    const values = {
      slug,
      name,
      status,
      propertyType,
      bedrooms,
      location,
      price,
      description,
      coverImageUrl,
      galleryImageUrls: galleryImageUrls.length ? galleryImageUrls : (coverImageUrl ? [coverImageUrl] : []),
      mapImageUrl,
      areaSqm,
      isPublished: body.isPublished !== false,
    }
    const id = typeof body.id === 'string' ? body.id : null
    const previous = id ? (await db.select({ slug: properties.slug }).from(properties).where(eq(properties.id, id)).limit(1))[0] : undefined
    const [property] = id && previous
      ? await db.update(properties).set({ ...values, updatedAt: new Date() }).where(eq(properties.id, id)).returning()
      : await db.insert(properties).values(values).onConflictDoUpdate({
          target: properties.slug,
          set: { ...values, updatedAt: new Date() },
        }).returning()

    if (!property) return NextResponse.json({ error: 'Property was not found' }, { status: 404 })
    for (const locale of ['en', 'th', 'ru', 'de', 'fr']) {
      revalidatePath(`/${locale}/projects`)
      revalidatePath(`/${locale}/projects/${property.slug}`)
      if (previous?.slug && previous.slug !== property.slug) revalidatePath(`/${locale}/projects/${previous.slug}`)
    }
    return NextResponse.json(property)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to save property'
    return NextResponse.json({ error: message }, { status: message === 'Unauthorized' ? 401 : 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAdmin()
    const { id, isPublished } = await request.json()
    if (typeof id !== 'string' || typeof isPublished !== 'boolean') return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    const [property] = await db.update(properties).set({ isPublished, updatedAt: new Date() }).where(eq(properties.id, id)).returning()
    return NextResponse.json(property)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to update property'
    return NextResponse.json({ error: message }, { status: message === 'Unauthorized' ? 401 : 500 })
  }
}
