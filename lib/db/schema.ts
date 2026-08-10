import { boolean, integer, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const properties = pgTable('properties', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  status: text('status').notNull(),
  propertyType: text('property_type').notNull(),
  bedrooms: integer('bedrooms').notNull(),
  location: text('location').notNull(),
  price: text('price').notNull(),
  description: text('description').notNull(),
  coverImageUrl: text('cover_image_url').notNull(),
  galleryImageUrls: jsonb('gallery_image_urls').$type<string[]>().notNull().default([]),
  mapImageUrl: text('map_image_url'),
  videoUrl: text('video_url'),
  documents: jsonb('documents').$type<Array<{ title: string; url: string }>>().notNull().default([]),
  isPublished: boolean('is_published').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  areaSqm: integer('area_sqm'),
})

export type Property = typeof properties.$inferSelect
export type NewProperty = typeof properties.$inferInsert
