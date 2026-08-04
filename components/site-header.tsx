'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/language-switcher';
import { BRAND, NAV, href } from '@/lib/site';
import type { Locale } from '@/lib/i18n/config';
import { cn } from '@/lib/utils';

interface SiteHeaderProps {
  locale: Locale;
  nav: Record<string, string>;
  langLabels: Record<string, string>;
  bookCallLabel: string;
}

export function SiteHeader({ locale, nav, langLabels, bookCallLabel }: SiteHeaderProps) {
  const [stuck, setStuck] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    let last = window.scrollY;
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      setStuck(y > 40);
      // Retract on the way down once clear of the hero; always return on the way up.
      setHidden(y > 480 && y > last);
      last = y;
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-90 border-b border-transparent transition-all duration-500 ease-luxe',
        stuck && 'border-line-soft bg-ink/90 backdrop-blur-xl backdrop-saturate-150',
        hidden && !menuOpen && '-translate-y-full'
      )}
    >
      <div className="shell flex items-center gap-4 py-4 lg:gap-10">
        <Link href={href(locale)} aria-label={BRAND.name} className="group flex flex-none items-center gap-3">
          <Image
            src="/images/emblem.png"
            alt=""
            width={124}
            height={124}
            priority
            className="size-13 drop-shadow-[0_4px_14px_rgba(0,0,0,.55)] transition-transform duration-500 ease-luxe group-hover:scale-105 sm:size-16"
          />
          <span className="flex flex-col leading-none">
            <span className="font-serif text-[1.05rem] uppercase tracking-[0.16em] text-cream-bright sm:text-[1.22rem]">
              Grand
            </span>
            <span className="mt-1 text-[0.58rem] uppercase tracking-[0.42em] text-gold">Property</span>
          </span>
        </Link>

        <nav aria-label={nav.menu} className="mx-auto hidden lg:block">
          <ul className="flex gap-6 xl:gap-10">
            {NAV.map((item) => {
              const target = href(locale, item.route, item.hash);
              const active = !item.hash && pathname === href(locale, item.route);
              return (
                <li key={item.id}>
                  <Link
                    href={target}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'group relative block py-1.5 text-[0.73rem] uppercase tracking-luxe transition-colors duration-300',
                      active ? 'text-gold-bright' : 'text-cream/80 hover:text-gold-bright'
                    )}
                  >
                    {nav[item.id]}
                    <span
                      aria-hidden="true"
                      className={cn(
                        'absolute inset-x-0 bottom-0 h-px origin-right scale-x-0 bg-gold transition-transform duration-400 ease-luxe group-hover:origin-left group-hover:scale-x-100',
                        active && 'origin-left scale-x-100'
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex flex-none items-center gap-3 lg:ml-0">
          <LanguageSwitcher locale={locale} labels={langLabels} />
          <Button asChild variant="outline" size="sm" className="hidden lg:inline-flex">
            <Link href={href(locale, 'contact')}>{nav.contact}</Link>
          </Button>
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen((open) => !open)}
            className="border border-line p-2 text-cream transition-colors hover:text-gold lg:hidden"
          >
            <span className="sr-only">{nav.menu}</span>
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div
          id="mobile-nav"
          className="border-t border-line-soft bg-ink/97 px-[clamp(1.25rem,4vw,3.5rem)] pb-8 pt-6 backdrop-blur-xl lg:hidden"
        >
          <ul className="grid">
            {[...NAV, { id: 'contact' as const, route: 'contact' as const, hash: undefined }].map((item) => (
              <li key={`${item.id}-${item.hash ?? ''}`}>
                <Link
                  href={href(locale, item.route, item.hash)}
                  className="block border-b border-line-soft py-3.5 font-serif text-2xl transition-all duration-300 hover:pl-2 hover:text-gold-bright"
                >
                  {nav[item.id]}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-7 flex items-center justify-between gap-4">
            <LanguageSwitcher locale={locale} labels={langLabels} />
            <Button asChild variant="gold" size="sm">
              <Link href={href(locale, 'contact')}>{bookCallLabel}</Link>
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
