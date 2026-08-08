'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';

import { cn } from '@/lib/utils';

function resolveImageSrc(image: string) {
  if (/^(https?:|blob:|data:|\/)/.test(image)) return image;
  return `/images/${image}`;
}

function isExternalImage(image: string) {
  return /^(https?:|blob:|data:)/.test(image);
}

interface GalleryLabels {
  viewAll: string;
  close: string;
  prev: string;
  next: string;
}

interface ProjectGalleryProps {
  images: string[];
  name: string;
  labels: GalleryLabels;
}

export function ProjectGallery({ images, name, labels }: ProjectGalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const isOpen = openIndex !== null;
  const total = images.length;

  const open = useCallback((index: number) => setOpenIndex(index), []);
  const close = useCallback(() => setOpenIndex(null), []);
  const go = useCallback(
    (dir: number) => setOpenIndex((current) => (current === null ? current : (current + dir + total) % total)),
    [total]
  );

  useEffect(() => {
    if (!isOpen) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowRight') go(1);
      if (event.key === 'ArrowLeft') go(-1);
    };

    document.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, close, go]);

  if (total === 0) return null;

  const preview = images.slice(0, 5);

  return (
    <>
      <div className="relative mt-5 grid h-[clamp(19rem,58vw,32rem)] grid-cols-2 grid-rows-2 gap-2 sm:grid-cols-4 sm:gap-2.5">
        {preview.map((image, index) => (
          <button
            key={image}
            type="button"
            onClick={() => open(index)}
            className={cn(
              'group relative m-0 overflow-hidden border border-line bg-ink-2 p-1.5',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-bright',
              index === 0 && 'col-span-2 sm:row-span-2',
              index === 3 && 'hidden sm:block',
              index === 4 && 'hidden sm:block'
            )}
            aria-label={`${name} — ${index + 1} / ${total}`}
          >
            <Image
              src={resolveImageSrc(image)}
              alt={`${name} interior photograph ${index + 1}`}
              fill
              sizes="(max-width: 640px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 ease-luxe group-hover:scale-[1.05]"
              priority={index === 0}
              unoptimized={isExternalImage(image)}
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 shadow-[inset_0_0_70px_rgba(0,0,0,.5)]"
            />
          </button>
        ))}

        <button
          type="button"
          onClick={() => open(0)}
          className={cn(
            'absolute bottom-3 right-3 inline-flex items-center gap-2 border border-white/25 bg-ink/80 px-4 py-2.5',
            'text-[0.66rem] uppercase tracking-luxer text-cream backdrop-blur-sm transition-colors',
            'hover:border-gold hover:text-gold-bright focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-bright'
          )}
        >
          <Expand className="size-3.5" />
          {labels.viewAll.replace('{count}', String(total))}
        </button>
      </div>

      {isOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={name}
          className="fixed inset-0 z-100 flex flex-col bg-ink/97 backdrop-blur-md"
        >
          <div className="flex items-center justify-between px-4 py-4 sm:px-6">
            <span className="font-serif text-[0.95rem] text-gold tabular-nums">
              {openIndex! + 1} / {total}
            </span>
            <button
              type="button"
              onClick={close}
              aria-label={labels.close}
              className="inline-flex size-11 items-center justify-center border border-white/20 text-cream transition-colors hover:border-gold hover:text-gold-bright focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-bright"
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 sm:px-4">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label={labels.prev}
              className="absolute left-2 z-10 inline-flex size-11 items-center justify-center border border-white/20 bg-ink/60 text-cream transition-colors hover:border-gold hover:text-gold-bright focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-bright sm:left-5 sm:size-13"
            >
              <ChevronLeft className="size-5 sm:size-6" />
            </button>

            <div className="relative h-full w-full">
              <Image
                key={images[openIndex!]}
                src={resolveImageSrc(images[openIndex!])}
                alt={`${name} interior photograph ${openIndex! + 1}`}
                fill
                sizes="100vw"
                className="object-contain"
                priority
                unoptimized={isExternalImage(images[openIndex!])}
              />
            </div>

            <button
              type="button"
              onClick={() => go(1)}
              aria-label={labels.next}
              className="absolute right-2 z-10 inline-flex size-11 items-center justify-center border border-white/20 bg-ink/60 text-cream transition-colors hover:border-gold hover:text-gold-bright focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-bright sm:right-5 sm:size-13"
            >
              <ChevronRight className="size-5 sm:size-6" />
            </button>
          </div>

          <div className="shrink-0 overflow-x-auto px-4 py-4 sm:px-6">
            <div className="mx-auto flex w-max gap-2">
              {images.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setOpenIndex(index)}
                  aria-label={`${name} — ${index + 1} / ${total}`}
                  aria-current={index === openIndex}
                  className={cn(
                    'relative h-14 w-20 shrink-0 overflow-hidden border transition-opacity sm:h-16 sm:w-24',
                    index === openIndex
                      ? 'border-gold opacity-100'
                      : 'border-line-soft opacity-55 hover:opacity-100'
                  )}
                >
                  <Image
                    src={resolveImageSrc(image)}
                    alt=""
                    fill
                    sizes="96px"
                    className="object-cover"
                    unoptimized={isExternalImage(image)}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
