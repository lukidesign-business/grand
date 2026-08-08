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
    const name = String(body.name ?? '').trim()
    const slug = String(body.slug ?? name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))
    const status = String(body.status ?? '')
    const propertyType = String(body.propertyType ?? '')
    const bedrooms = Number(body.bedrooms)
    const location = String(body.location ?? '').trim()
    const price = String(body.price ?? '').trim()
    const description = String(body.description ?? '').trim()
    const coverImageUrl = String(body.coverImageUrl ?? '').trim()
    const galleryImageUrls = Array.isArray(body.galleryImageUrls) ? body.galleryImageUrls.filter((url: unknown) => typeof url === 'string') : []
    const mapImageUrl = String(body.mapImageUrl ?? '').trim() || null
    const areaSqm = body.areaSqm === null || body.areaSqm === '' ? null : Number(body.areaSqm)

    if (!name || !slug || !location || !description || !coverImageUrl || !Number.isInteger(bedrooms) || bedrooms < 0 || (areaSqm !== null && (!Number.isInteger(areaSqm) || areaSqm < 0))) {
      return NextResponse.json({ error: 'Complete every property field before publishing' }, { status: 400 })
    }
    if (!allowedStatuses.has(status) || !allowedTypes.has(propertyType)) {
      return NextResponse.json({ error: 'Choose a valid status and property type' }, { status: 400 })
    }

    const [property] = await db.insert(properties).values({
      slug,
      name,
      status,
      propertyType,
      bedrooms,
      location,
      price,
      description,
      coverImageUrl,
      galleryImageUrls: galleryImageUrls.length ? galleryImageUrls : [coverImageUrl],
      mapImageUrl,
      areaSqm,
      isPublished: body.isPublished !== false,
    }).onConflictDoUpdate({
      target: properties.slug,
      set: {
        name,
        status,
        propertyType,
        bedrooms,
        location,
        price,
        description,
        coverImageUrl,
        galleryImageUrls: galleryImageUrls.length ? galleryImageUrls : [coverImageUrl],
        mapImageUrl,
        areaSqm,
        isPublished: body.isPublished !== false,
        updatedAt: new Date(),
      },
    }).returning()

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
