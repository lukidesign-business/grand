'use client';

import { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { PRICE_BANDS } from '@/lib/site';
import type { Dictionary } from '@/lib/i18n';
import { cn } from '@/lib/utils';

type Status = 'idle' | 'sending' | 'sent' | 'error';

const fieldClass =
  'border border-line-soft bg-ink-3 px-4 py-3.5 text-[0.95rem] font-light text-cream-bright transition-colors duration-300 placeholder:text-muted-2 focus:border-gold focus:bg-surface-2 focus:outline-none aria-invalid:border-[#b9603f]';

const labelClass = 'text-[0.66rem] uppercase tracking-luxe text-[var(--fixed-gold)]';

export function ContactForm({ dict }: { dict: Dictionary }) {
  const f = dict.contact.form;
  const [status, setStatus] = useState<Status>('idle');

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    setStatus('sending');

    try {
      const values = new FormData(form)
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.get('name') ?? '',
          email: values.get('email') ?? '',
          phone: values.get('phone') ?? '',
          budget: values.get('budget') ?? '',
          interest: values.get('interest') ?? '',
          message: values.get('message') ?? '',
          consent: values.get('consent') === 'on',
        }),
      })

      if (!response.ok) throw new Error('Contact submission failed')
      form.reset()
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="mt-6 grid gap-5">
      <div className="grid gap-2">
        <label htmlFor="c-name" className={labelClass}>
          {f.name} <span aria-hidden="true">*</span>
        </label>
        <input
          id="c-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          placeholder={f.namePlaceholder}
          className={fieldClass}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="grid gap-2">
          <label htmlFor="c-email" className={labelClass}>
            {f.email} <span aria-hidden="true">*</span>
          </label>
          <input
            id="c-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder={f.emailPlaceholder}
            className={fieldClass}
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor="c-phone" className={labelClass}>
            {f.phone}
          </label>
          <input
            id="c-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder={f.phonePlaceholder}
            className={fieldClass}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="relative grid gap-2">
          <label htmlFor="c-budget" className={labelClass}>
            {f.budget}
          </label>
          <select id="c-budget" name="budget" defaultValue="" className={cn(fieldClass, 'cursor-pointer appearance-none pr-10')}>
            <option value="">{f.budgetPlaceholder}</option>
            {PRICE_BANDS.map((band) => (
              <option key={band.id} value={band.id}>
                {dict.values.priceBands[band.id]}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute bottom-4 right-4 size-4 text-muted" />
        </div>

        <div className="relative grid gap-2">
          <label htmlFor="c-interest" className={labelClass}>
            {f.interest}
          </label>
          <select id="c-interest" name="interest" className={cn(fieldClass, 'cursor-pointer appearance-none pr-10')}>
            {f.interestOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute bottom-4 right-4 size-4 text-muted" />
        </div>
      </div>

      <div className="grid gap-2">
        <label htmlFor="c-message" className={labelClass}>
          {f.message}
        </label>
        <textarea
          id="c-message"
          name="message"
          rows={5}
          placeholder={f.messagePlaceholder}
          className={cn(fieldClass, 'min-h-32 resize-y font-sans')}
        />
      </div>

      <label className="group flex cursor-pointer items-start gap-3 text-[0.88rem] text-muted">
        <input type="checkbox" name="consent" required className="peer sr-only" />
        <span className="mt-0.5 grid size-5 shrink-0 place-items-center border border-line-strong transition-colors duration-250 peer-checked:border-gold peer-checked:bg-gold peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold-bright">
          <Check className="size-3.5 stroke-3 text-ink opacity-0 transition-opacity peer-checked:opacity-100 group-has-[:checked]:opacity-100" />
        </span>
        <span>{f.consent}</span>
      </label>

      <Button type="submit" variant="gold" size="block" disabled={status === 'sending'}>
        {status === 'sending' ? f.sending : f.submit}
      </Button>

      {status === 'sent' || status === 'error' ? (
        <p
          role="status"
          aria-live="polite"
          className={cn(
            'border-l-2 px-5 py-4 text-[0.9rem]',
            status === 'error'
              ? 'border-[#b9603f] bg-[rgba(185,96,63,.08)]'
              : 'border-gold bg-gold/7'
          )}
        >
          {status === 'error' ? f.error : f.success}
        </p>
      ) : null}

    </form>
  );
}
