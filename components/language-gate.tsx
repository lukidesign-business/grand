'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Globe, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Eyebrow } from '@/components/ui/section-head';
import { rememberLocale, swapLocale } from '@/components/language-switcher';
import { locales, isLocale, LANG_COOKIE, type Locale } from '@/lib/i18n/config';

interface LanguageGateProps {
  locale: Locale;
  copy: {
    modalEyebrow: string;
    modalTitle: string;
    modalBody: string;
    modalHintPl: string;
    modalPrimary: string;
    modalSecondary: string;
    modalDismiss: string;
    remember: string;
  };
}

function hasStoredChoice() {
  return document.cookie.split('; ').some((c) => c.startsWith(`${LANG_COOKIE}=`));
}

/** Browser language list first, then timezone as a coarse regional signal. */
function detectLocale(): Locale | null {
  const list = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const tag of list) {
    const base = String(tag).toLowerCase().split('-')[0];
    if (isLocale(base)) return base;
  }
  try {
    if (Intl.DateTimeFormat().resolvedOptions().timeZone === 'Europe/Warsaw') return 'pl';
  } catch {
    /* Intl unavailable — fall through */
  }
  return null;
}

export function LanguageGate({ locale, copy }: LanguageGateProps) {
  const [open, setOpen] = useState(false);
  const [suggestsOther, setSuggestsOther] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreFocusTo = useRef<Element | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const other = locales.find((l) => l !== locale) as Locale;

  useEffect(() => {
    if (hasStoredChoice()) return;
    const guess = detectLocale();
    setSuggestsOther(guess !== null && guess !== locale);
    restoreFocusTo.current = document.activeElement;
    setOpen(true);
  }, [locale]);

  // Focus trap, Escape to dismiss, focus restored on close.
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel) return;

    const focusables = () =>
      Array.from(panel.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'));

    focusables()[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close(locale);
        return;
      }
      if (event.key !== 'Tab') return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, locale]);

  function close(choice: Locale) {
    rememberLocale(choice);
    setOpen(false);
    (restoreFocusTo.current as HTMLElement | null)?.focus?.();
  }

  function choose(choice: Locale) {
    rememberLocale(choice);
    setOpen(false);
    if (choice !== locale) router.push(swapLocale(pathname, choice));
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-200 grid place-items-center p-6">
      <div
        className="absolute inset-0 animate-fade-in bg-[rgba(5,6,8,.82)] backdrop-blur-md"
        onClick={() => close(locale)}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="lang-gate-title"
        aria-describedby="lang-gate-body"
        className="relative w-full max-w-[30rem] animate-rise-in border border-line bg-[linear-gradient(160deg,var(--color-surface-2),var(--color-ink-2))] p-8 text-center shadow-[0_40px_90px_-40px_rgba(0,0,0,.95)] sm:p-11"
      >
        <button
          type="button"
          onClick={() => close(locale)}
          aria-label={copy.modalDismiss}
          className="absolute right-3 top-3 p-1.5 text-muted transition-colors hover:text-gold"
        >
          <X className="size-5" />
        </button>

        <Eyebrow className="justify-center">
          <Globe />
          {copy.modalEyebrow}
        </Eyebrow>

        <h2 id="lang-gate-title" className="mb-3 text-[clamp(1.6rem,3vw,2.05rem)]">
          {copy.modalTitle}
        </h2>
        <p id="lang-gate-body" className="mb-4 text-[0.93rem] text-muted">
          {copy.modalBody}
        </p>
        {suggestsOther ? <p className="mb-4 text-[0.82rem] text-gold">{copy.modalHintPl}</p> : null}

        <div className="grid gap-3">
          <Button variant="gold" onClick={() => choose(locale)}>
            {copy.modalPrimary}
          </Button>
          <Button variant="ghost" lang={other} onClick={() => choose(other)}>
            {copy.modalSecondary}
          </Button>
        </div>

        <p className="mt-5 text-[0.72rem] text-muted-2">{copy.remember}</p>
      </div>
    </div>
  );
}
