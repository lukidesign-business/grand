'use client'

import { useEffect, useRef, useState } from 'react'

type PropertyVideoProps = { src: string }

export function PropertyVideo({ src }: PropertyVideoProps) {
  const ref = useRef<HTMLVideoElement>(null)
  const [isNearViewport, setIsNearViewport] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new IntersectionObserver(([entry]) => setIsNearViewport(entry.isIntersecting), { rootMargin: '240px 0px', threshold: 0.01 })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const element = ref.current
    if (!element || !isNearViewport) return
    void element.play().catch(() => undefined)
  }, [isNearViewport])

  return <video ref={ref} src={src} muted playsInline loop preload={isNearViewport ? 'auto' : 'none'} controls className="aspect-video w-full" />
}

type PropertyPdfPreviewProps = { src: string; title: string }

export function PropertyPdfPreview({ src, title }: PropertyPdfPreviewProps) {
  return (
    <div className="relative h-64 w-full overflow-hidden bg-ink" aria-label={`${title} first page preview`}>
      <iframe
        src={`${src}#page=1&toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
        title={`${title} first page`}
        scrolling="no"
        className="pointer-events-none absolute left-0 top-0 block h-[calc(100%+24px)] w-[calc(100%+24px)] border-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      />
    </div>
  )
}
