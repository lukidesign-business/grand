import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Instagram, Linkedin, Mail, MapPin, MessageCircle } from 'lucide-react';

import { LanguageSwitcher } from '@/components/language-switcher';
import { BRAND, FOOTER_NAV, href } from '@/lib/site';
import type { Dictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n/config';

const SOCIAL_ICONS = { instagram: Instagram, facebook: Facebook, linkedin: Linkedin } as const;

export function SiteFooter({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const { footer, nav, lang } = dict;

  const column = (title: string, links: readonly { id: string; route: string; hash?: string }[]) => (
    <div>
      <h3 className="mb-5 text-[0.68rem] font-normal uppercase tracking-luxer text-gold">{title}</h3>
      <ul className="grid gap-3">
        {links.map((link) => (
          <li key={`${link.id}-${link.hash ?? ''}`}>
            <Link
              href={href(locale, link.route as never, link.hash)}
              className="text-[0.9rem] text-muted transition-all duration-300 hover:pl-1 hover:text-gold-bright"
            >
              {nav[link.id as keyof typeof nav]}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <footer className="border-t border-line-soft bg-[#08090b] pb-8 pt-[clamp(3.5rem,7vw,5.5rem)]">
      <div className="shell">
        <div className="grid gap-10 border-b border-line-soft pb-12 md:grid-cols-2 lg:grid-cols-[1.6fr_.8fr_.8fr_1.2fr]">
          <div>
            <Link href={href(locale)} aria-label={BRAND.name} className="flex items-center gap-3">
              <Image
                src="/images/emblem.png"
                alt=""
                width={152}
                height={152}
                className="size-19 drop-shadow-[0_4px_14px_rgba(0,0,0,.55)]"
              />
              <span className="flex flex-col leading-none">
                <span className="font-serif text-[1.22rem] uppercase tracking-[0.16em] text-cream-bright">
                  Grand
                </span>
                <span className="mt-1 text-[0.58rem] uppercase tracking-[0.42em] text-gold">
                  Property
                </span>
              </span>
            </Link>

            <p className="mt-6 max-w-[42ch] text-[0.9rem] text-muted">{footer.tagline}</p>

            <ul className="mt-6 flex gap-2.5">
              {BRAND.social.map((social) => {
                const Icon = SOCIAL_ICONS[social.id as keyof typeof SOCIAL_ICONS];
                return (
                  <li key={social.id}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.id}
                      className="grid size-10 place-items-center border border-line-soft text-muted transition-colors duration-300 hover:border-line-strong hover:text-gold"
                    >
                      <Icon className="size-4.5" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {column(footer.explore, FOOTER_NAV.explore)}
          {column(footer.company, FOOTER_NAV.company)}

          <div>
            <h3 className="mb-5 text-[0.68rem] font-normal uppercase tracking-luxer text-gold">
              {footer.contact}
            </h3>
            <ul className="grid gap-3 text-[0.9rem] text-muted">
              <li>
                <a
                  href={`mailto:${BRAND.email}`}
                  className="flex items-start gap-2.5 transition-all duration-300 hover:pl-1 hover:text-gold-bright"
                >
                  <Mail className="mt-1 size-4.5 shrink-0 text-gold" />
                  <span>{BRAND.email}</span>
                </a>
              </li>
              {BRAND.whatsapp.map((number, index) => (
                <li key={number.display}>
                  <a
                    href={number.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-2.5 transition-all duration-300 hover:pl-1 hover:text-gold-bright"
                  >
                    <MessageCircle className="mt-1 size-4.5 shrink-0 text-gold" />
                    <span>WhatsApp {number.display}</span>
                  </a>
                </li>
              ))}
              <li className="flex items-start gap-2.5 leading-relaxed">
                <MapPin className="mt-1 size-4.5 shrink-0 text-gold" />
                <span>{BRAND.address}</span>
              </li>
            </ul>

            <div className="mt-7">
              <span className="mb-3 block text-[0.68rem] uppercase tracking-luxer text-gold">
                {footer.language}
              </span>
              <LanguageSwitcher locale={locale} labels={lang} />
            </div>
          </div>
        </div>

        <p className="mt-8 max-w-[88ch] text-[0.76rem] leading-[1.75] text-muted-2">
          {footer.disclaimer}
        </p>

        <div className="mt-6 flex flex-wrap justify-between gap-2 border-t border-line-soft pt-6 text-[0.76rem] text-muted-2">
          <p>
            © {new Date().getFullYear()} {BRAND.name}. {footer.rights}
          </p>
          <p>{footer.placeholderNote}</p>
        </div>
      </div>
    </footer>
  );
}
