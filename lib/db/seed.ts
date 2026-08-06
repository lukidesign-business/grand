import { db } from './index'
import { properties } from './schema'

export async function seedProperties() {
  await db.insert(properties).values([
    {
      slug: 'zenith-pattaya',
      name: 'Zenith Pattaya',
      status: 'Ready to move',
      propertyType: 'Condominium',
      bedrooms: 1,
      location: 'Pattaya, Thailand',
      price: 'From ฿3.9M',
      description: 'A polished coastal residence designed for effortless living and strong rental appeal.',
      coverImageUrl: '/images/zenith-pattaya-living.jpg',
      galleryImageUrls: ['/images/zenith-pattaya-living.jpg'],
      isPublished: true,
    },
    {
      slug: 'zenith-pattaya-2',
      name: 'Zenith Pattaya 2',
      status: 'Under construction',
      propertyType: 'Condominium',
      bedrooms: 1,
      location: 'Pattaya, Thailand',
      price: 'From ฿4.2M',
      description: 'A new coastal development with a considered mix of private residences and resort amenities.',
      coverImageUrl: '/images/zenith-pattaya-2-living-wide.jpg',
      galleryImageUrls: ['/images/zenith-pattaya-2-living-wide.jpg'],
      isPublished: true,
    },
  ]).onConflictDoNothing()
}
