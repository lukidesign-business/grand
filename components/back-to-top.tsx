'use client';

import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

import { cn } from '@/lib/utils';

export function BackToTop({ label }: { label: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 520);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={cn(
        'fixed bottom-5 right-5 z-40 inline-flex size-11 items-center justify-center border border-gold/60 bg-ink/90 text-gold shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-gold-bright hover:bg-ink hover:text-gold-bright focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-gold-bright sm:bottom-7 sm:right-7',
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
      )}
    >
      <ArrowUp aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </button>
  );
}
