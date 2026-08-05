'use client';

import { ChevronDown, MessageCircle } from 'lucide-react';

import { cn } from '@/lib/utils';

type WhatsAppNumber = {
  display: string;
  href: string;
  country: string;
  code: 'PL' | 'TH';
};

type WhatsAppSelectorProps = {
  numbers: readonly WhatsAppNumber[];
  label: string;
  chooseLabel: string;
  className?: string;
};

function Flag({ code }: { code: WhatsAppNumber['code'] }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'relative inline-flex size-5 shrink-0 overflow-hidden rounded-[3px] border border-foreground/15 shadow-sm',
        code === 'PL' ? 'bg-gradient-to-b from-white via-white to-[#dc143c]' : 'bg-[#da291c]'
      )}
    >
      {code === 'TH' ? (
        <span className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 bg-[#241d4f] shadow-[0_-3px_0_#fff,0_3px_0_#fff]" />
      ) : null}
      <span className="sr-only">{code}</span>
    </span>
  );
}

export function WhatsAppSelector({ numbers, label, chooseLabel, className }: WhatsAppSelectorProps) {
  return (
    <details className={cn('group relative w-full', className)}>
      <summary
        className="flex min-h-11 w-full cursor-pointer list-none items-center justify-center gap-2 border border-gold/50 bg-gold/10 px-4 py-3 text-center text-[0.72rem] font-medium uppercase tracking-[0.16em] text-gold-bright transition hover:border-gold hover:bg-gold/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-bright [&::-webkit-details-marker]:hidden"
        aria-label={label}
      >
        <MessageCircle aria-hidden="true" className="size-4" />
        <span>{label}</span>
        <ChevronDown aria-hidden="true" className="size-4 transition-transform group-open:rotate-180" />
      </summary>
      <div className="absolute inset-x-0 top-full z-20 mt-2 overflow-hidden border border-line-soft bg-ink-2 shadow-xl">
        <p className="border-b border-line-soft px-4 py-2 text-[0.62rem] uppercase tracking-[0.16em] text-muted-2">
          {chooseLabel}
        </p>
        <div className="grid gap-px bg-line-soft p-px">
          {numbers.map((number) => (
            <a
              key={number.display}
              href={number.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-14 items-center gap-3 bg-ink-2 px-4 py-3 text-sm transition hover:bg-ink-3 focus-visible:bg-ink-3 focus-visible:outline-none"
            >
              <Flag code={number.code} />
              <span className="min-w-0">
                <span className="block text-[0.68rem] uppercase tracking-[0.12em] text-muted-2">{number.country}</span>
                <span className="block font-medium text-foreground">{number.display}</span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </details>
  );
}
