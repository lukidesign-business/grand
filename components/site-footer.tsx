import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Instagram, Mail, MapPin, MessageCircle, Music2 } from 'lucide-react';

import { LanguageSwitcher } from '@/components/language-switcher';
import { BRAND, FOOTER_NAV, OFFICIAL_PARTNER, TEAM, href } from '@/lib/site';
import type { Dictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n/config';

const SOCIAL_ICONS = { instagram: Instagram, tiktok: Music2, facebook: Facebook } as const;

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
    <footer className="on-photo border-t border-line-soft bg-[#08090b] pb-8 pt-[clamp(3.5rem,7vw,5.5rem)]">
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
                      className={`social-box social-box-${social.id} grid size-12 place-items-center border text-muted transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_24px_-14px_currentColor]`}
                    >
                      <Icon className="size-5.5" />
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
                    <span><span aria-hidden="true" className="mr-1.5">{number.code === 'TH' ? '🇹🇭' : '🇵🇱'}</span>WhatsApp {number.display}</span>
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

          <div className="border-t border-line-soft pt-8 md:col-span-2 lg:col-span-4">
            <div className="grid gap-8 md:grid-cols-[1.3fr_1fr_1fr] md:items-center">
              {TEAM.map((person) => (
                <div key={person.id} className="flex items-center gap-4">
                  <Image src={person.photo} alt={person.name} width={96} height={96} className="size-20 shrink-0 rounded-full border border-line-soft object-cover" />
                  <div className="min-w-0">
                    <p className="text-[0.95rem] text-cream-bright">{person.name}</p>
                    <p className="mt-1 text-[0.68rem] uppercase tracking-luxe text-gold">{person.role}</p>
                    {'whatsapp' in person ? <div className="mt-2 grid gap-1"><a href={person.whatsapp.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[0.8rem] text-muted hover:text-gold-bright"><MessageCircle className="size-3.5 text-gold" />{person.whatsapp.display}</a></div> : <div className="mt-2 grid gap-1">{BRAND.whatsapp.map((number) => <a key={number.display} href={number.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[0.8rem] text-muted hover:text-gold-bright"><MessageCircle className="size-3.5 text-gold" /><span aria-hidden="true">{number.code === 'TH' ? '🇹🇭' : '🇵🇱'}</span>{number.display}</a>)}</div>}
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-4 md:justify-end">
                <div><span className="block text-[0.68rem] uppercase tracking-luxer text-gold">{footer.officialPartner}</span><span className="mt-1 block text-[0.8rem] text-muted">{OFFICIAL_PARTNER.name}</span></div>
                <Image src={OFFICIAL_PARTNER.mark} alt={OFFICIAL_PARTNER.name} width={112} height={112} className="size-24 opacity-95" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-line-soft pt-6 text-[0.76rem] text-muted-2">
          <p>© {new Date().getFullYear()} {BRAND.name}. {footer.rights}</p>
        </div>
      </div>
    </footer>
  );
}
