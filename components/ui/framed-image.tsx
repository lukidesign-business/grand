import Image from 'next/image';

import { cn } from '@/lib/utils';

interface FramedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  imageClassName?: string;
  tight?: boolean;
  priority?: boolean;
  sizes?: string;
}

/** The thin gold frame with an inset vignette used around editorial imagery. */
export function FramedImage({
  src,
  alt,
  width,
  height,
  className,
  imageClassName,
  tight = false,
  priority = false,
  sizes = '(max-width: 860px) 100vw, 50vw'
}: FramedImageProps) {
  return (
    <figure
      className={cn(
        'group relative m-0 overflow-hidden border border-line',
        tight ? 'p-1.5' : 'p-2',
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        sizes={sizes}
        className={cn(
          'h-full w-full object-cover transition-transform duration-1000 ease-luxe group-hover:scale-[1.035]',
          imageClassName
        )}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 shadow-[inset_0_0_90px_rgba(0,0,0,.55)]"
      />
    </figure>
  );
}
