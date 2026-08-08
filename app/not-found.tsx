import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Rule } from '@/components/ui/section-head'
import { getDictionary } from '@/lib/i18n'
import { defaultLocale } from '@/lib/i18n/config'
import { href } from '@/lib/site'

export default function NotFound() {
  const dict = getDictionary(defaultLocale)

  return (
    <section className="section-y pt-[clamp(10rem,20vh,14rem)]">
      <div className="shell mx-auto max-w-[42rem] text-center">
        <span className="block font-serif text-[clamp(4.5rem,12vw,8rem)] leading-none text-gold/35">
          {dict.notFound.code}
        </span>
        <h1 className="mt-4 text-[clamp(1.9rem,4vw,3rem)]">{dict.notFound.title}</h1>
        <Rule centered />
        <p className="text-muted">{dict.notFound.body}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild variant="gold">
            <Link href={href(defaultLocale)}>{dict.notFound.primary}</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href={href(defaultLocale, 'projects')}>{dict.notFound.secondary}</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
