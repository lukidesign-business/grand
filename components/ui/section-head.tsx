import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'mb-4 inline-flex items-center gap-2 text-[0.72rem] uppercase tracking-luxer text-gold [&_svg]:size-4',
        className
      )}
    >
      {children}
    </span>
  );
}

export function Rule({ className, centered = false }: { className?: string; centered?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn('my-6', centered ? 'rule-gold-center' : 'rule-gold', className)}
    />
  );
}

interface SectionHeadProps {
  eyebrow?: string;
  title: string;
  lead?: string;
  centered?: boolean;
  as?: 'h1' | 'h2';
  className?: string;
}

export function SectionHead({
  eyebrow,
  title,
  lead,
  centered = false,
  as: Heading = 'h2',
  className
}: SectionHeadProps) {
  return (
    <div
      className={cn(
        'reveal mb-10 max-w-[60ch] md:mb-12',
        centered && 'mx-auto text-center',
        className
      )}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <Heading className="text-[clamp(2rem,3.6vw,3.1rem)]">{title}</Heading>
      <Rule centered={centered} />
      {lead ? (
        <p className="text-[clamp(1.02rem,1.25vw,1.16rem)] leading-[1.8] text-muted">{lead}</p>
      ) : null}
    </div>
  );
}
