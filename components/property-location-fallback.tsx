'use client'

import { ExternalLink, MapPin } from 'lucide-react'

type PropertyLocationFallbackProps = {
  location: string
  mapUrl: string
}

export function PropertyLocationFallback({ location, mapUrl }: PropertyLocationFallbackProps) {
  const query = encodeURIComponent(location)
  const embedUrl = `https://www.google.com/maps?q=${query}&output=embed&z=13&hl=en`

  return (
    <div className="relative size-full overflow-hidden bg-[#161a20]">
      <iframe
        title={`Map showing ${location}`}
        src={embedUrl}
        loading="lazy"
        className="size-full border-0 opacity-75 grayscale-[0.2] saturate-[0.7]"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(10,11,14,.68),transparent_58%),linear-gradient(0deg,rgba(10,11,14,.55),transparent_50%)]" />
      <div className="absolute bottom-5 left-5 flex max-w-[calc(100%-2.5rem)] items-center gap-3 border border-[rgba(201,162,90,.42)] bg-[rgba(10,11,14,.82)] px-4 py-3 text-[rgba(247,244,238,.95)] shadow-2xl backdrop-blur-md">
        <MapPin className="size-4 shrink-0 text-[var(--fixed-gold-bright)]" aria-hidden="true" />
        <div className="min-w-0">
          <p className="text-[0.6rem] uppercase tracking-[0.18em] text-[var(--fixed-gold-bright)]">Location</p>
          <p className="truncate text-sm">{location}</p>
        </div>
        <a
          href={mapUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`Open ${location} in Google Maps`}
          className="pointer-events-auto ml-auto shrink-0 text-[var(--fixed-gold-bright)] transition-colors hover:text-[var(--fixed-cream-bright)]"
        >
          <ExternalLink className="size-4" aria-hidden="true" />
        </a>
      </div>
    </div>
  )
}
