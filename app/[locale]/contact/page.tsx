import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Check, Mail, MapPin, MessageCircle, Phone, ShieldCheck } from 'lucide-react';

import { Eyebrow, Rule } from '@/components/ui/section-head';
import { ContactForm } from '@/components/contact-form';
import { getDictionary } from '@/lib/i18n';
import { isLocale, type Locale } from '@/lib/i18n/config';
import { alternatesFor } from '@/lib/metadata';
import { BRAND } from '@/lib/site';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return {
    title: dict.meta.contact.title,
    description: dict.meta.contact.description,
    alternates: alternatesFor(locale, 'contact')
  };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale as Locale);
  const c = dict.contact;

  const links = [
    ...BRAND.whatsapp.map((number) => ({
      icon: MessageCircle,
      label: c.whatsapp,
      value: number.display,
      href: number.href,
      external: true
    })),
    {
      icon: Mail,
      label: c.emailUs,
      value: BRAND.email,
      href: `mailto:${BRAND.email}`,
      external: false
    },
    {
      icon: Phone,
      label: c.callUs,
      value: BRAND.phoneDisplay,
      href: `tel:${BRAND.phoneHref}`,
      external: false
    }
  ];

  return (
    <>
      <section className="border-b border-line-soft bg-[linear-gradient(to_bottom,var(--color-ink-3),var(--color-ink))] pb-[clamp(2.5rem,5vw,4rem)] pt-[clamp(8.5rem,16vh,11rem)]">
        <div className="shell">
          <Eyebrow>{c.eyebrow}</Eyebrow>
          <h1 className="text-[clamp(2.2rem,5vw,3.8rem)]">{c.title}</h1>
          <Rule />
          <p className="max-w-[56ch] text-muted">{c.lead}</p>
        </div>
      </section>

      <section className="section-y bg-ink-2">
        <div className="shell grid items-start gap-10 lg:grid-cols-[1.25fr_.75fr] lg:gap-16">
          <div className="on-photo reveal border border-line bg-[linear-gradient(160deg,rgba(28,33,42,.75),rgba(16,19,24,.9))] p-7 md:p-8">
            <h2 className="text-[1.8rem]">{c.formTitle}</h2>
            <Rule />
            <ContactForm dict={dict} />
          </div>

          <aside className="grid gap-6">
            <div className="on-photo reveal border border-line bg-[linear-gradient(160deg,rgba(28,33,42,.75),rgba(16,19,24,.9))] p-7 md:p-8">
              <h2 className="mb-5 flex items-center gap-2.5 text-[1.05rem] uppercase tracking-luxe text-gold">
                <Phone className="size-5" />
                {c.directTitle}
              </h2>
              <ul className="grid">
                {links.map((link, index) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className={`flex items-center gap-4 py-3.5 transition-all duration-300 hover:pl-1 hover:text-gold-bright ${
                        index < links.length - 1 ? 'border-b border-line-soft' : ''
                      }`}
                    >
                      <link.icon className="size-5.5 shrink-0 text-gold" />
                      <span className="flex flex-col text-[0.88rem] text-muted">
                        <strong className="mb-0.5 text-[0.66rem] font-normal uppercase tracking-luxe text-gold">
                          {link.label}
                        </strong>
                        {link.value}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>

              <p className="mt-5 flex items-start gap-2 text-[0.8rem] leading-relaxed text-muted-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-gold" />
                {BRAND.address}
              </p>
              <p className="mt-3 text-[0.8rem] leading-relaxed text-muted-2">{c.hours}</p>
            </div>

            <div className="on-photo reveal border border-line bg-[linear-gradient(160deg,rgba(28,33,42,.75),rgba(16,19,24,.9))] p-7 md:p-8">
              <h2 className="mb-5 flex items-center gap-2.5 text-[1.05rem] uppercase tracking-luxe text-gold">
                <ShieldCheck className="size-5" />
                {dict.cta.eyebrow}
              </h2>
              <ul className="grid gap-3.5">
                {c.trust.map((item) => (
                  <li key={item} className="flex gap-3 text-[0.93rem] leading-relaxed text-muted">
                    <Check className="mt-1.5 size-4 shrink-0 text-gold" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-[0.8rem] leading-relaxed text-muted-2">{c.remote}</p>
            </div>


          </aside>
        </div>
      </section>
    </>
  );
}
