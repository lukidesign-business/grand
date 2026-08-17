import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Landmark, Mountain, Palmtree, Utensils } from 'lucide-react';

import { getDictionary } from '@/lib/i18n';
import { isLocale, type Locale } from '@/lib/i18n/config';
import { alternatesFor } from '@/lib/metadata';
import { href } from '@/lib/site';

const attractions = [
  ['Wielki Pałac Królewski i Wat Phra Kaew, Bangkok', 'Centralna Tajlandia', '/images/thailand/ayutthaya.jpg', 'Serce Bangkoku i symbol tajskiej monarchii. Wielki Pałac Królewski to rozległy kompleks budynków, w którym znajduje się również Wat Phra Kaew – Świątynia Szmaragdowego Buddy. To najważniejszy buddyjski obiekt w kraju i obowiązkowy punkt pierwszej wizyty w stolicy.'],
  ['Wat Pho i Leżący Budda, Bangkok', 'Centralna Tajlandia', '/images/thailand/boats.jpg', 'Jedna z najstarszych i największych świątyń w Bangkoku, słynąca z 46‑metrowego posągu Leżącego Buddy pokrytego złotem. Wat Pho to także tradycyjne centrum tajskiej medycyny i masażu – idealne miejsce, by zrozumieć duchowy wymiar Tajlandii.'],
  ['Wat Arun (Świątynia Świtu), Bangkok', 'Centralna Tajlandia', '/images/thailand/island.jpg', 'Charakterystyczna świątynia nad rzeką Chao Phraya, rozpoznawalna dzięki wysokiej, ozdobnej prang (wieży). Najlepiej wygląda o zachodzie słońca, gdy światło odbija się od mozaik na fasadzie.'],
  ['Ayutthaya – dawna stolica Tajlandii', 'Centralna Tajlandia', '/images/thailand/ayutthaya.jpg', 'Historyczny park z ruinami świątyń i pałaców dawnej stolicy, wpisany na listę UNESCO. Najsłynniejszym widokiem jest głowa Buddy wplątana w korzenie drzewa w Wat Mahathat. Ayutthaya to popularny cel jednodniowych wycieczek z Bangkoku.'],
  ['Chiang Mai i Wat Phra That Doi Suthep', 'Północna Tajlandia', '/images/thailand/chiang-mai.jpg', 'Stolica północy, otoczona górami i setkami świątyń. Na szczycie góry Doi Suthep znajduje się Wat Phra That Doi Suthep – jedna z najważniejszych świątyń w regionie, z której roztacza się widok na całe miasto.'],
  ['Wyspy Phi Phi', 'Południe – Morze Andamańskie', '/images/thailand/koh-samet.jpg', 'Archipelag sześciu wysp rozsławiony filmem „The Beach”. Biały piasek, wapienne klify i turkusowa woda sprawiają, że to jedno z najbardziej fotogenicznych miejsc w Tajlandii. Idealne na kilkudniowy wypad z Phuket lub Krabi.'],
  ['Phuket – plaże i życie wyspy', 'Południe – Morze Andamańskie', '/images/thailand/phuket.jpg', 'Największa wyspa Tajlandii, z ponad 17 plażami – od tętniących życiem Patong i Karon, po spokojniejsze zatoki na północy. Phuket to także główny rynek nieruchomości dla cudzoziemców.'],
  ['Koh Samui – raj na Morzu Tajskim', 'Południe – Morze Tajskie', '/images/thailand/koh-sak.jpg', 'Druga co do ważności wyspa w Tajlandii, z długimi plażami, palmami i licznymi resortami. Koh Samui przyciąga zarówno turystów, jak i inwestorów – szczególnie okolice Bophut, Maenam i Chaweng.']
] as const;

const regions = [
  ['Bangkok i Centralna Tajlandia', 'Świątynie, pałace, historia i nowoczesne centrum.', '/images/thailand/walking-street.jpg'],
  ['Północ (Chiang Mai, Chiang Rai)', 'Góry, kultura, słynna Biała Świątynia i spokojniejsze tempo.', '/images/thailand/chiang-mai.jpg'],
  ['Południe – wyspy i plaże', 'Phuket, Koh Samui, Phi Phi, Krabi – rajskie zatoki i życie nad morzem.', '/images/thailand/koh-samet.jpg'],
  ['Wschód i Północny Wschód', 'Mniej turystyczne regiony z autentyczną kulturą i przyrodą.', '/images/thailand/island.jpg']
] as const;

const gallery = [
  ['Zachód słońca nad plażą w Phuket', '/images/thailand/phuket.jpg'], ['Złote prangi Wat Arun w Bangkoku', '/images/thailand/boats.jpg'], ['Leżący Budda w Wat Pho', '/images/thailand/elephants.jpg'], ['Ruiny świątyń w Ayutthaya', '/images/thailand/ayutthaya.jpg'], ['Widok na Chiang Mai z Doi Suthep', '/images/thailand/chiang-mai.jpg'], ['Wapienne klify zatoki Phang Nga', '/images/thailand/island.jpg'], ['Targ pływający Damnoen Saduak', '/images/thailand/boats.jpg'], ['Biała Świątynia w Chiang Rai', '/images/thailand/chiang-mai.jpg'], ['Plaża Maya Bay na wyspach Phi Phi', '/images/thailand/koh-samet.jpg'], ['Rybacka wioska w Bophut na Koh Samui', '/images/thailand/koh-sak.jpg'], ['Tropikalny las w Parku Narodowego Khao Sok', '/images/thailand/koh-mak.jpg'], ['Nocny Bangkok z rzeki Chao Phraya', '/images/thailand/walking-street.jpg']
] as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: 'Atrakcje Tajlandii — Grand Property', description: 'Poznaj atrakcje Tajlandii przed inwestycją lub dłuższym pobytem.', alternates: alternatesFor(locale, 'thailand') };
}

export default async function ThailandPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const current = locale as Locale;

  return (
    <main className="scroll-smooth bg-background text-foreground">
      <section className="relative flex min-h-[78vh] items-end overflow-hidden bg-ink text-cream-bright">
        <Image src="/images/thailand/phuket.jpg" alt="Plaża w Tajlandii" fill priority className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,15,20,.88),rgba(8,15,20,.25),rgba(8,15,20,.45))]" />
        <div className="shell relative z-10 pb-16 pt-36 md:pb-24">
          <p className="mb-4 text-xs uppercase tracking-[.24em] text-gold">Grand Property · Tajlandia</p>
          <h1 className="max-w-4xl text-balance text-5xl leading-[.95] md:text-7xl">Tajlandia – więcej niż plaże i świątynie</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-cream-bright/85">Odkryj atrakcje, które sprawiają, że inwestorzy i podróżnicy zakochują się w tym kraju.</p>
          <div className="mt-8 flex flex-wrap gap-3"><a href="#attractions" className="bg-gold px-5 py-3 text-sm font-medium text-ink">Poznaj atrakcje →</a><Link href={href(current, 'contact')} className="border border-cream-bright/50 px-5 py-3 text-sm">Kontakt →</Link></div>
        </div>
      </section>

      <section className="section-y"><div className="shell grid gap-12 lg:grid-cols-[1.1fr_.9fr] lg:items-center"><div><p className="mb-3 text-xs uppercase tracking-[.2em] text-gold">Tajlandia z bliska</p><h2 className="text-balance text-4xl md:text-5xl">Dlaczego warto poznać Tajlandię?</h2><div className="mt-6 space-y-4 leading-relaxed text-muted"><p>Tajlandia to jeden z najciekawszych kierunków w Azji – łączy bogatą historię, buddyzm, nowoczesne miasta i jedne z najpiękniejszych plaż na świecie. Dla inwestorów to kraj stabilny, otwarty na cudzoziemców i z rozwiniętą infrastrukturą turystyczną.</p><p>Wielu naszych klientów kupuje nieruchomości w Tajlandii, bo pokochali ten kraj podczas wakacji. Zanim podejmiesz decyzję o zakupie, warto zrozumieć, co sprawia, że Tajlandia przyciąga miliony odwiedzających rok po roku.</p><p>Poniżej znajdziesz przegląd najważniejszych atrakcji – od świątyń Bangkoku, przez dawne stolice, po rajskie wyspy i parki narodowe.</p></div><div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">{[[Landmark,'Świątynie'],[Palmtree,'Plaże'],[Mountain,'Góry'],[Utensils,'Jedzenie']].map(([Icon,label])=><div key={label as string} className="flex items-center gap-2 text-sm text-muted"><Icon className="size-5 text-gold" />{label as string}</div>)}</div></div><Image src="/images/thailand/koh-mak.jpg" alt="Wybrzeże Tajlandii" width={900} height={620} className="h-full max-h-[520px] w-full object-cover" /></div></section>

      <section id="attractions" className="section-y bg-surface"><div className="shell"><p className="mb-3 text-xs uppercase tracking-[.2em] text-gold">Miejsca warte poznania</p><h2 className="text-4xl md:text-5xl">Najważniejsze atrakcje Tajlandii</h2><p className="mt-4 max-w-2xl text-muted">Miejsca, które najczęściej odwiedzają nasi klienci – przed i po zakupie nieruchomości.</p><div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{attractions.map(([name,region,image,text])=><article key={name} className="group overflow-hidden border border-line-soft bg-background transition duration-500 hover:-translate-y-1 hover:shadow-2xl"><Image src={image} alt={name} width={700} height={420} className="aspect-[5/3] w-full object-cover transition duration-700 group-hover:scale-105" /><div className="p-6"><p className="text-xs uppercase tracking-[.16em] text-gold">{region}</p><h3 className="mt-3 text-2xl leading-tight">{name}</h3><p className="mt-4 text-sm leading-relaxed text-muted">{text}</p><a href="#contact" className="mt-5 inline-block text-xs uppercase tracking-[.14em] text-gold">Dowiedz się więcej →</a></div></article>)}</div></div></section>

      <section className="section-y"><div className="shell"><h2 className="text-4xl md:text-5xl">Odkryj Tajlandię według regionów</h2><div className="mt-10 grid gap-4 md:grid-cols-2">{regions.map(([title,text,image])=><a href="#attractions" key={title} className="group relative min-h-64 overflow-hidden p-7 text-cream-bright"><Image src={image} alt={title} fill className="object-cover transition duration-700 group-hover:scale-105" sizes="(min-width: 768px) 50vw, 100vw" /><div className="absolute inset-0 bg-ink/65" /><div className="relative flex h-full flex-col justify-end"><h3 className="text-2xl">{title}</h3><p className="mt-2 max-w-md text-sm text-cream-bright/80">{text}</p></div></a>)}</div></div></section>

      <section className="section-y bg-surface"><div className="shell"><h2 className="text-4xl md:text-5xl">Dlaczego Tajlandia przyciąga inwestorów i podróżników?</h2><div className="mt-10 grid gap-px border border-line-soft bg-line-soft sm:grid-cols-2 lg:grid-cols-4">{[['Bogata kultura i historia','Tysiące świątyń, dawne stolice i żywe tradycje buddyzmu tworzą unikalny klimat.'],['Jedne z najlepszych plaż na świecie','Biały piasek, ciepłe morze i setki wysp – idealne na wakacje i drugi dom.'],['Smaki, które zapadają w pamięć','Od ulicznego pad thai po fine dining – tajskie jedzenie to osobny powód, by tu wracać.'],['Dobra relacja ceny do jakości','Wysoki standard życia i nieruchomości w atrakcyjnych cenach w porównaniu do Europy.']].map(([title,text])=><div key={title} className="bg-background p-7"><h3 className="text-xl">{title}</h3><p className="mt-3 text-sm leading-relaxed text-muted">{text}</p></div>)}</div></div></section>

      <section className="section-y"><div className="shell"><h2 className="text-4xl md:text-5xl">Galeria – Tajlandia w kadrze</h2><p className="mt-3 text-muted">Kraj, który najlepiej poznaje się przez różnorodność miejsc, ludzi i codziennych doświadczeń.</p>{/* Replace these local image paths with a lightbox/gallery source when ready. */}<div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3">{gallery.map(([caption,image],index)=><figure key={caption} className="mb-4 break-inside-avoid overflow-hidden bg-surface"><Image src={image} alt={caption} width={900} height={index % 3 === 0 ? 620 : 500} className="w-full object-cover" /><figcaption className="p-3 text-sm text-muted">{caption}</figcaption></figure>)}</div></div></section>

      <section id="contact" className="relative overflow-hidden bg-ink py-24 text-cream-bright"><Image src="/images/thailand/phuket.jpg" alt="Tropikalny krajobraz Tajlandii" fill className="object-cover opacity-25" sizes="100vw" /><div className="absolute inset-0 bg-ink/70" /><div className="shell relative text-center"><h2 className="mx-auto max-w-3xl text-balance text-4xl md:text-6xl">Planujesz inwestycję lub dłuższy pobyt w Tajlandii?</h2><p className="mx-auto mt-6 max-w-2xl leading-relaxed text-cream-bright/80">Pomożemy Ci zrozumieć rynek, wybrać lokalizację i bezpiecznie przeprowadzić proces zakupu nieruchomości.</p><div className="mt-8 flex flex-wrap justify-center gap-3"><Link href={href(current, 'contact')} className="bg-gold px-5 py-3 text-sm text-ink">Skontaktuj się z nami →</Link><Link href={href(current, 'projects')} className="border border-cream-bright/50 px-5 py-3 text-sm">Zobacz oferty nieruchomości →</Link></div></div></section>

      <footer className="border-t border-line-soft bg-background py-8"><div className="shell flex flex-col gap-4 text-sm text-muted md:flex-row md:items-center md:justify-between"><p>© Tajlandia – Atrakcje i nieruchomości | Tajlandia.com</p><nav className="flex flex-wrap gap-4"><Link href={href(current)} className="hover:text-gold">Strona główna</Link><Link href={href(current, 'thailand')} className="hover:text-gold">Atrakcje</Link><Link href={href(current, 'contact')} className="hover:text-gold">Kontakt</Link></nav><p className="text-xs">Treść ma charakter informacyjny i nie stanowi oferty handlowej.</p></div></footer>
    </main>
  );
}
