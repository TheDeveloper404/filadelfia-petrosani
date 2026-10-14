import PageMeta from '@/components/PageMeta';
import Container from '@/components/ui/container';
import { WaveDivider } from '@/components/WaveDivider';
import PageHero from '@/components/PageHero';
import SectionHeading from '@/components/SectionHeading';

const events = [
  { year: '9 august 1996', title: 'Înființarea bisericii', desc: 'Ia ființă Biserica Filadelfia din Petroșani.' },
  { year: '2026', title: '30 de ani de binecuvântare', desc: 'Biserica aniversează 30 de ani: „Până aici Domnul ne-a ajutat” (1 Samuel 7:12).' },
];

const photos = [
  { src: '/images/30-ani/01.webp', w: 1200, h: 900 },
  { src: '/images/30-ani/02.webp', w: 800, h: 1200 },
  { src: '/images/30-ani/03.webp', w: 906, h: 1200 },
  { src: '/images/30-ani/04.webp', w: 1200, h: 800 },
  { src: '/images/30-ani/05.webp', w: 1200, h: 800 },
  { src: '/images/30-ani/06.webp', w: 1200, h: 800 },
  { src: '/images/30-ani/07.webp', w: 1200, h: 800 },
  { src: '/images/30-ani/08.webp', w: 1200, h: 800 },
  { src: '/images/30-ani/09.webp', w: 1200, h: 800 },
  { src: '/images/30-ani/10.webp', w: 1200, h: 800 },
  { src: '/images/30-ani/11.webp', w: 1200, h: 800 },
  { src: '/images/30-ani/12.webp', w: 1200, h: 800 },
];

export default function DespreNoi() {
  return (
    <div className="relative">
      <PageMeta title="Despre noi — Filadelfia" description="Istoria și identitatea Bisericii Filadelfia Petroșani." />

      {/* Hero */}
      <PageHero
        eyebrow="Identitate & Istorie"
        title="Despre noi"
        subtitle="O comunitate de credință întemeiată pe 9 august 1996, construită pe iubire și rugăciune."
      />

      {/* Cine suntem */}
      <section className="relative py-20 sm:py-28 bg-[#d4ab84]">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 -translate-y-full">
          <WaveDivider bottomColor="#d4ab84" height={70} />
        </div>
        <Container>
          <div className="mx-auto max-w-4xl">
            <SectionHeading eyebrow="Cine suntem?" title="O comunitate de credință" />
              <div className="space-y-4 text-center">
              <p className="text-lg leading-8 text-slate-800">
                Biserica Filadelfia din Petroșani este o comunitate creștină evanghelică, înființată pe 9 august 1996.
                Ne întâlnim săptămânal pentru închinare, rugăciune și studiul Cuvântului lui Dumnezeu.
              </p>
              <p className="text-lg leading-8 text-slate-800">
                Credem în puterea transformatoare a Evangheliei și ne dorim să fim o comunitate deschisă tuturor celor care caută.
              </p>
              </div>
          </div>
        </Container>
      </section>

      {/* Misiune, Viziune și Valori (mutat de pe Acasă) */}
      <section className="pb-20 sm:pb-28 bg-[#d4ab84]">
        <Container>

          {/* Two columns */}
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-start">

            {/* LEFT — title + image */}
            <div className="flex flex-col items-center gap-14">
              <h2 className="text-4xl font-bold text-slate-900 sm:text-5xl text-center">Misiune, Viziune și Valori</h2>
              <img
                src="/images/30-ani/01.webp"
                alt="Biserica Penticostală Filadelfia Petroșani"
                width={1200}
                height={900}
                loading="lazy"
                className="w-full rounded-3xl object-cover shadow-xl shadow-slate-900/20"
                style={{ maxHeight: '400px' }}
              />
            </div>

            {/* RIGHT — three sections */}
            <div className="flex flex-col divide-y divide-slate-900/15">

              {/* Misiune */}
              <div className="pb-8">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-7 w-1 rounded-full bg-slate-900/40" />
                  <h3 className="text-lg font-bold text-slate-900">Misiune</h3>
                </div>
                <p className="text-base leading-7 text-slate-800">
                  Misiunea Bisericii Filadelfia este să-L onoreze pe Dumnezeu prin creșterea unor oameni
                  transformați, care trăiesc după modelul lui Cristos în fiecare aspect al vieții. Ne ghidăm
                  după chemarea lui Isus din Matei 28:19-20 — să facem ucenici, să-i botezăm și să-i învățăm
                  să trăiască în ascultare de Cuvântul Lui.
                </p>
              </div>

              {/* Viziune */}
              <div className="py-8">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-7 w-1 rounded-full bg-slate-900/40" />
                  <h3 className="text-lg font-bold text-slate-900">Viziune</h3>
                </div>
                <p className="text-base leading-7 text-slate-800">
                  Să fim o biserică vie și relevantă, un loc în care fiecare om — indiferent de unde vine —
                  poate întâlni pe Dumnezeu, poate crește în credință și poate contribui la transformarea
                  comunității din Petroșani și a lumii din jur.
                </p>
              </div>

              {/* Valori */}
              <div className="pt-8">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-7 w-1 rounded-full bg-slate-900/40" />
                  <h3 className="text-lg font-bold text-slate-900">Valori</h3>
                </div>
                <ul className="space-y-2 text-base leading-7 text-slate-800">
                  <li className="flex items-start gap-2"><span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-slate-900/30" /><span><strong className="text-slate-900">Credință</strong> — ancorată în Biblie și trăită zilnic</span></li>
                  <li className="flex items-start gap-2"><span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-slate-900/30" /><span><strong className="text-slate-900">Comunitate</strong> — autentică, primitoare și plină de dragoste</span></li>
                  <li className="flex items-start gap-2"><span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-slate-900/30" /><span><strong className="text-slate-900">Slujire</strong> — cu bucurie, în Duh și în Adevăr</span></li>
                  <li className="flex items-start gap-2"><span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-slate-900/30" /><span><strong className="text-slate-900">Generozitate</strong> — față de aproapele nostru și față de lume</span></li>
                </ul>
              </div>

            </div>
          </div>
        </Container>
      </section>

      {/* Istoria noastră */}
      <section className="pb-20 sm:pb-28 bg-[#d4ab84]">
        <Container>
          <div className="mx-auto max-w-4xl">
            <SectionHeading eyebrow="Cronologie" title="Istoria noastră" />

            <ol className="relative space-y-10 border-l-2 border-slate-900/20 pl-8 sm:mx-auto sm:max-w-xl">
              {events.map((ev) => (
                <li key={ev.year} className="relative">
                  <span className="absolute -left-[41px] top-1 h-4 w-4 rounded-full border-2 border-[#d4ab84] bg-slate-900" />
                  <p className="text-sm font-bold uppercase tracking-widest text-slate-700">{ev.year}</p>
                  <h3 className="mt-1 text-xl font-bold text-slate-900">{ev.title}</h3>
                  <p className="mt-1 text-base leading-7 text-slate-800">{ev.desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      {/* Galerie — 30 de ani */}
      <section className="bg-[#d4ab84] pb-20 sm:pb-28">
        <Container>
          {/* Galerie uniformă: aceeași mărime pentru toate pozele, fără texte */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {photos.map((p) => (
              <img
                key={p.src}
                src={p.src}
                alt=""
                width={p.w}
                height={p.h}
                className="aspect-[4/3] w-full rounded-2xl object-cover object-[50%_30%] shadow-sm"
              />
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
