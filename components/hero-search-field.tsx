'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';

interface SearchOption {
  value: string;
  label: string;
}

interface HeroSearchFieldProps {
  id: string;
  name: string;
  openField: string | null;
  setOpenField: (id: string | null) => void;
  label: string;
  placeholder: string;
  hint?: string;
  icon: React.ReactNode;
  options: SearchOption[];
  className?: string;
}

export function HeroSearchField({
  id,
  name,
  label,
  placeholder,
  hint,
  icon,
  options,
  className,
  openField,
  setOpenField
}: HeroSearchFieldProps) {
  const fieldRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState('');
  const open = openField === id;

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!fieldRef.current?.contains(event.target as Node)) {
        setOpenField(null);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [open, setOpenField]);
  const selectedLabel = options.find((option) => option.value === selected)?.label ?? placeholder;

  return (
    <div
      ref={fieldRef}
      className={cn(
        'group relative z-0 flex min-w-0 items-center gap-3.5 px-4 py-4 transition-colors duration-300 hover:bg-gold/5',
        open && 'z-[100] bg-gold/7',
        className
      )}
    >
      <span className="flex text-gold [&_svg]:size-5.5">{icon}</span>
      <div className="relative min-w-0 flex-1">
        <label
          htmlFor={id}
          className="mb-0.5 block text-[0.6rem] uppercase tracking-[0.2em] text-gold transition-colors group-focus-within:text-gold-bright"
        >
          {label}
        </label>
        <input type="hidden" name={name} value={selected} />
        <button
          id={id}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpenField(open ? null : id)}
          className="flex w-full items-center justify-between gap-2 border-0 bg-transparent p-0 text-left text-[0.95rem] font-light text-cream-bright outline-none"
        >
          <span className="truncate">{selectedLabel}</span>
          <ChevronDown className={cn('size-4 shrink-0 text-muted transition-transform duration-300', open && 'rotate-180 text-gold')} />
        </button>
        {hint ? <span className="mt-0.5 block text-[0.66rem] text-muted-2">{hint}</span> : null}

        {open ? (
          <div
            role="listbox"
            aria-label={label}
            className="absolute left-0 top-[calc(100%+1rem)] z-30 min-w-[min(17rem,calc(100vw-3rem))] overflow-hidden border border-gold/35 bg-[rgba(12,13,17,.98)] py-1 shadow-[0_22px_50px_-18px_rgba(0,0,0,.95)] backdrop-blur-xl"
          >
            <button
              type="button"
              role="option"
              aria-selected={!selected}
              onClick={() => {
                setSelected('');
                setOpenField(null);
              }}
              className="flex w-full items-center justify-between gap-4 px-4 py-2.5 text-left text-[0.82rem] text-muted transition-colors hover:bg-gold/10 hover:text-cream-bright"
            >
              {placeholder}
              {!selected ? <Check className="size-3.5 text-gold" /> : null}
            </button>
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={selected === option.value}
                onClick={() => {
                  setSelected(option.value);
                  setOpenField(null);
                }}
                className="flex w-full items-center justify-between gap-4 px-4 py-2.5 text-left text-[0.82rem] text-cream transition-colors hover:bg-gold/10 hover:text-gold-bright"
              >
                {option.label}
                {selected === option.value ? <Check className="size-3.5 text-gold" /> : null}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
