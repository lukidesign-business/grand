import { revalidatePath, revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'
import { asc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { properties } from '@/lib/db/schema'
import { requireAdmin } from '@/lib/admin'

const allowedStatuses = new Set(['Ready to move', 'Under construction', 'Resale', 'Presale'])
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
    const name = String(body.name ?? '').trim()
    const safeName = name || 'Untitled property'
    const requestedSlug = String(body.slug ?? '').trim()
    const safeSlug = requestedSlug || safeName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `property-${Date.now()}`
    const status = String(body.status ?? 'Ready to move')
    const completionText = String(body.completionText ?? '').trim() || null
    const propertyType = String(body.propertyType ?? 'Condominium')
    const bedrooms = Number.isFinite(Number(body.bedrooms)) ? Number(body.bedrooms) : 0
    const location = String(body.location ?? '').trim() || 'Location available on request'
    const price = String(body.price ?? '').trim() || 'Price available on request'
    const description = String(body.description ?? '').trim() || 'Property details available on request'
    const coverImageUrl = String(body.coverImageUrl ?? '').trim() || '/placeholder.svg?height=720&width=960'
    const galleryImageUrls = Array.isArray(body.galleryImageUrls) ? body.galleryImageUrls.filter((url: unknown) => typeof url === 'string') : []
    const mapImageUrl = String(body.mapImageUrl ?? '').trim() || null
    const areaSqm = body.areaSqm === null || body.areaSqm === '' ? null : Number(body.areaSqm)
    const videoUrl = String(body.videoUrl ?? '').trim() || null
    const documents = Array.isArray(body.documents) ? body.documents.filter((document: unknown) => document && typeof document === 'object' && typeof (document as { title?: unknown }).title === 'string' && typeof (document as { url?: unknown }).url === 'string').map((document: { title: string; url: string }) => ({ title: document.title.trim(), url: document.url.trim() })).filter((document: { title: string; url: string }) => document.title && document.url) : []

    if (!Number.isInteger(bedrooms) || bedrooms < 0 || (areaSqm !== null && (!Number.isInteger(areaSqm) || areaSqm < 0))) {
      return NextResponse.json({ error: 'Bedrooms and size must be valid numbers' }, { status: 400 })
    }
    if (!allowedStatuses.has(status) || !allowedTypes.has(propertyType)) {
      return NextResponse.json({ error: 'Choose a valid status and property type' }, { status: 400 })
    }

    const values = {
      slug: safeSlug,
      name: safeName,
      status,
      completionText,
      propertyType,
      bedrooms,
      location,
      price,
      description,
      coverImageUrl,
      galleryImageUrls: galleryImageUrls.length ? galleryImageUrls : (coverImageUrl ? [coverImageUrl] : []),
      mapImageUrl,
      areaSqm,
      videoUrl,
      documents,
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
    revalidateTag('published-properties', 'max')
    for (const locale of ['en', 'th', 'ru', 'de', 'fr']) {
      revalidatePath(`/${locale}/projects`)
      revalidatePath(`/${locale}/search`)
      revalidatePath(`/${locale}/projects/${property.slug}`)
      if (previous?.slug && previous.slug !== property.slug) revalidatePath(`/${locale}/projects/${previous.slug}`)
    }
    return NextResponse.json(property)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to save property'
    return NextResponse.json({ error: message }, { status: message === 'Unauthorized' ? 401 : 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin()
    const { id } = await request.json()
    if (typeof id !== 'string' || !id.trim()) return NextResponse.json({ error: 'Property id is required' }, { status: 400 })
    const [deleted] = await db.delete(properties).where(eq(properties.id, id)).returning({ slug: properties.slug })
    if (!deleted) return NextResponse.json({ error: 'Property was not found' }, { status: 404 })
    revalidateTag('published-properties', 'max')
    for (const locale of ['en', 'th', 'ru', 'de', 'fr']) {
      revalidatePath(`/${locale}/projects`)
      revalidatePath(`/${locale}/search`)
      revalidatePath(`/${locale}/projects/${deleted.slug}`)
    }
    return NextResponse.json({ ok: true, slug: deleted.slug })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to delete property'
    return NextResponse.json({ error: message }, { status: message === 'Unauthorized' ? 401 : 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAdmin()
    const { id, isPublished } = await request.json()
    if (typeof id !== 'string' || typeof isPublished !== 'boolean') return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    const [property] = await db.update(properties).set({ isPublished, updatedAt: new Date() }).where(eq(properties.id, id)).returning()
    revalidateTag('published-properties', 'max')
    if (property) {
      for (const locale of ['en', 'th', 'ru', 'de', 'fr']) revalidatePath(`/${locale}/projects/${property.slug}`)
    }
    return NextResponse.json(property)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to update property'
    return NextResponse.json({ error: message }, { status: message === 'Unauthorized' ? 401 : 500 })
  }
}
