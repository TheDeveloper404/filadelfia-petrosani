import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import PageMeta from '@/components/PageMeta';
import Container from '@/components/ui/container';
import { WaveDivider } from '@/components/WaveDivider';
import PageHero from '@/components/PageHero';
import SectionHeading from '@/components/SectionHeading';

// Poze de la aniversarea de 30 de ani (9 august 2026) — afișate la reperul 2026, uniform, fără texte.
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

// Repere în ordine descrescătoare (cel mai recent primul). `photos` = numerele fotografiilor istorice (1–17)
// așezate lângă reper la decizia beneficiarului — nu indică data fotografiei.
const events: { year: string; title: string; desc: string; photos?: number[]; anniversaryPhotos?: typeof photos }[] = [
  { year: '9 august 2026', title: '30 de ani de binecuvântare', desc: 'Biserica aniversează 30 de ani: „Până aici Domnul ne-a ajutat” (1 Samuel 7:12).', anniversaryPhotos: photos },
  { year: '1996–2016', title: 'Dezvoltarea lucrărilor bisericii', desc: 'În primele două decenii de la inaugurare s-au dezvoltat pregătirea biblică, activitățile pentru copii și tineri, corurile, fanfara și misiunea prin televiziune. Inițiativele medicale și sociale au completat implicarea bisericii în comunitate.', photos: [10, 12, 13, 14, 15, 16, 17] },
  { year: '11 august 1996', title: 'Inaugurarea', desc: 'După patru ani de lucrări, susținute de credincioși, binevoitori și Biserica „Filadelfia” din Ockero, Suedia, noul lăcaș a fost inaugurat în prezența slujitorilor, autorităților locale și a unei delegații din Suedia.', photos: [9] },
  { year: '1990–1991', title: 'Inițiativa construirii Bisericii „Filadelfia”', desc: 'După schimbările din decembrie 1989, conducerea bisericii a inițiat construirea unui lăcaș mai central. În aprilie 1991 au fost obținute terenul în concesiune și autorizația de construire.', photos: [7, 8, 11] },
  { year: '1965', title: 'Amenajarea unui lăcaș de cult', desc: 'Un comitet de inițiativă a sprijinit cumpărarea și renovarea unei case pe strada Boțoni, nr. 87. Biserica a funcționat acolo până în 1996.', photos: [4, 5, 6] },
  { year: '1940–1946', title: 'Credință în vremuri dificile', desc: 'În timpul războiului, comunitatea a trecut prin interdicții și persecuții, continuând să se adune în ascuns. În 1946, recunoașterea oficială a Bisericii Penticostale a deschis o nouă etapă de organizare.', photos: [2, 3] },
  { year: '1933–1935', title: 'Începuturile comunității', desc: 'Primii credincioși penticostali au venit în Petroșani din diferite zone ale țării, pentru a lucra în Valea Jiului. Întâlnirile de rugăciune se desfășurau în casele credincioșilor.', photos: [1] },
];

// Fotografiile istorice 1–17 (numerotarea beneficiarului; lightbox-ul navighează în ordinea asta); `context` apare doar în vizualizarea mărită.
const historyPhotos: { src: string; w: number; h: number; alt: string; caption: string; context?: string }[] = [
  { src: '/images/istoric/01.webp', w: 1350, h: 1165, alt: 'Fotografie alb-negru: Nicolae Cazan vorbind în fața unui grup de oameni', caption: 'Nicolae Cazan, primul conducător prezbiter al Bisericii Penticostale din Petroșani.' },
  { src: '/images/istoric/02.webp', w: 1400, h: 933, alt: 'Fotografie alb-negru: Greța Alexa, în mijloc, alături de alți bărbați, la o masă cu flori', caption: 'Greța Alexa (în mijloc), primul pastor de zonă (sector).' },
  { src: '/images/istoric/03.webp', w: 1400, h: 933, alt: 'Fotografie alb-negru: Demean Mircea și soția, în picioare, lângă o masă festivă', caption: 'Demean Mircea (în picioare), împreună cu soția, primul pastor ordinat la Petroșani.' },
  { src: '/images/istoric/04.webp', w: 1215, h: 1200, alt: 'Portret alb-negru al lui Ile Traian', caption: 'Ile Traian, primul dirijor de cor al Bisericii.' },
  { src: '/images/istoric/05.webp', w: 1072, h: 1200, alt: 'Portret alb-negru al lui Coman Petru', caption: 'Coman Petru, primul dirijor al Fanfarei Bisericii Penticostale din Petroșani.' },
  { src: '/images/istoric/06.webp', w: 800, h: 1200, alt: 'Fotografie alb-negru: Ile Traian și Voinea Simion, în picioare, unul lângă altul', caption: 'Prietenii de neuitat: Frații Ile Traian și Voinea Simion.' },
  { src: '/images/istoric/07.webp', w: 1400, h: 606, alt: 'Fotografie de grup cu membrii primului comitet al Bisericii „Filadelfia” Petroșani', caption: 'Primul Comitet al Bisericii „Filadelfia” Petroșani.', context: '„Au luat inițiativa construirii unui lăcaș de cult, poziționat mai central.”' },
  { src: '/images/istoric/08.webp', w: 1400, h: 933, alt: 'Fotografie de grup cu soțiile membrilor comitetului', caption: 'Soțiile membrilor Comitetului.' },
  { src: '/images/istoric/09.webp', w: 1400, h: 619, alt: 'Fotografie de grup: slujitori ordinați în picioare, cu comisia de ordinare așezată în rândul din față', caption: 'Slujitori ordinați, împreună cu comisia de ordinare (ceata prezbiterilor).' },
  { src: '/images/istoric/10.webp', w: 1400, h: 1102, alt: 'Herth Simona alături de prima grupă de copii a grădiniței, pe treptele din fața unei uși de lemn', caption: 'Herth Simona, prima directoare a Grădiniței, împreună cu prima grupă de copii.' },
  { src: '/images/istoric/11.webp', w: 1285, h: 1200, alt: 'Familia Greg și Evelyin Puchianu, împreună cu cei doi copii', caption: 'Prima familie de misionari americani sosiți la Petroșani, în anul 1990, Familia Greg și Evelyin Puchianu.' },
  { src: '/images/istoric/12.webp', w: 1295, h: 1200, alt: 'Ovidiu și Viorica Liteanu, în fața unui perete galben', caption: 'Prima familie de misionari trimiși de Biserica Penticostală „Filadelfia” din Petroșani, Liteanu Ovidiu și Viorica.' },
  { src: '/images/istoric/13.webp', w: 1400, h: 652, alt: 'Părtășie în aer liber, la o masă lungă, în familia Szabo Alexandru', caption: 'Părtășie în Familia Szabo Alexandru.' },
  { src: '/images/istoric/14.webp', w: 1312, h: 1199, alt: 'Portret color al lui Daniel Bujeniță', caption: 'Primul misionar transcultural, Daniel Bujeniță.' },
  { src: '/images/istoric/15.webp', w: 1400, h: 829, alt: 'Candidați la botez în haine albe, alături de slujitori, pe treptele bisericii', caption: 'Botez în apă — 2016.' },
  { src: '/images/istoric/16.webp', w: 1400, h: 593, alt: 'Fotografie de grup a copiilor din grupa mare a Școlii Duminicale, sub inscripția „Merry Christmas!”', caption: 'Grupa mare a Școlii Duminicale.', context: '„Școala duminicală funcționează cu trei grupe.”' },
  { src: '/images/istoric/17.webp', w: 1400, h: 862, alt: 'Corul de copii al Bisericii „Filadelfia” Petroșani, pe podium, cu eșarfe roșii', caption: 'Corul de copii al Bisericii „Filadelfia” Petroșani.', context: '„Corul de copii, format și dirijat de sora Prof. Solovan Ramona, împreună cu prof. Bulancea Larisa și Prof. Stoica Anca.”' },
];

// Grupuri vizuale peste ordinea globală: [from, to) = indici în `historyPhotos`.
export default function DespreNoi() {
  // Index în `historyPhotos` al fotografiei deschise în vizualizarea mărită (null = închisă).
  const [active, setActive] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const isOpen = active !== null;
  const last = historyPhotos.length - 1;

  useEffect(() => {
    if (!isOpen) return;
    const trigger = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActive(null);
      else if (e.key === 'ArrowRight') setActive((i) => (i === null ? i : Math.min(i + 1, last)));
      else if (e.key === 'ArrowLeft') setActive((i) => (i === null ? i : Math.max(i - 1, 0)));
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      trigger?.focus();
    };
  }, [isOpen, last]);

  const current = active === null ? null : historyPhotos[active];

  // Fotografia `n` (1–17) cu legendă; click deschide vizualizarea mărită.
  const renderPhoto = (n: number) => {
    const p = historyPhotos[n - 1];
    return (
      <figure key={p.src}>
        <button
          type="button"
          onClick={() => setActive(n - 1)}
          className="block w-full rounded-2xl transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 focus-visible:ring-offset-[#d4ab84]"
        >
          <img
            src={p.src}
            alt={p.alt}
            width={p.w}
            height={p.h}
            loading="lazy"
            className="aspect-[4/3] w-full rounded-2xl bg-slate-900/10 object-contain"
          />
        </button>
        <figcaption className="mt-3 text-sm leading-6 text-slate-800">{p.caption}</figcaption>
      </figure>
    );
  };

  return (
    <div className="relative">
      <PageMeta title="Despre noi — Filadelfia" description="Istoria și identitatea Bisericii Filadelfia Petroșani." />

      {/* Hero */}
      <PageHero
        eyebrow="Identitate & Istorie"
        title="Despre noi"
        subtitle="O comunitate de credință construită pe iubire și rugăciune."
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
                Începuturile comunității penticostale din Petroșani sunt consemnate în anii 1933–1935. Din întâlnirile
                de rugăciune organizate în casele credincioșilor, comunitatea s-a dezvoltat de-a lungul generațiilor.
              </p>
              <p className="text-lg leading-8 text-slate-800">
                Istoria Bisericii „Filadelfia”, inaugurată în 1996, reflectă credința și implicarea celor care au
                contribuit la construirea și viața ei.
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
          <div className="mx-auto max-w-6xl">
            <SectionHeading eyebrow="Cronologie" title="Repere din istoria noastră">
              <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-800">
                Fotografiile sunt grupate după etapele și activitățile comunității; nu toate au o dată consemnată.
              </p>
            </SectionHeading>

            {/* Rânduri: an + titlu + text în stânga, fotografiile reperului în dreapta (pe mobil dedesubt) */}
            <ol className="divide-y divide-slate-900/15 border-y border-slate-900/15">
              {events.map((ev) => (
                <li key={ev.year} className="grid gap-6 py-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-12">
                  <div>
                    <p className="text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">{ev.year}</p>
                    <h3 className="mt-3 text-xl font-bold text-slate-900">{ev.title}</h3>
                    <p className="mt-2 text-base leading-7 text-slate-800">{ev.desc}</p>
                  </div>
                  {ev.photos && (
                    <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                      {ev.photos.map(renderPhoto)}
                    </div>
                  )}
                  {ev.anniversaryPhotos && (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {ev.anniversaryPhotos.map((p) => (
                        <img
                          key={p.src}
                          src={p.src}
                          alt=""
                          width={p.w}
                          height={p.h}
                          loading="lazy"
                          className="aspect-[4/3] w-full rounded-2xl object-cover object-[50%_30%] shadow-sm"
                        />
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ol>

            <p className="mt-12 text-center text-sm italic text-slate-700">
              Istoric sintetizat din materialul aniversar consemnat de pastorul Ile Traian, Petroșani, august 2016.
            </p>
          </div>
        </Container>
      </section>

      {/* Vizualizare mărită — Esc închide, săgețile navighează în ordinea 1–17 */}
      {current && active !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Fotografia ${active + 1} din ${historyPhotos.length}`}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/95 p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setActive(null); }}
        >
          <button
            ref={closeRef}
            type="button"
            onClick={() => setActive(null)}
            aria-label="Închide"
            className="absolute right-4 top-4 rounded-full p-2 text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <X className="h-7 w-7" />
          </button>

          <figure className="flex max-h-full w-full max-w-5xl flex-col items-center">
            <img
              src={current.src}
              alt={current.alt}
              width={current.w}
              height={current.h}
              className="max-h-[70vh] w-auto max-w-full rounded-xl object-contain"
            />
            <figcaption className="mt-4 max-w-3xl text-center">
              <p className="text-base leading-7 text-white">{current.caption}</p>
              {current.context && (
                <p className="mt-2 text-sm italic leading-6 text-slate-300">
                  Din materialul aniversar (2016): {current.context}
                </p>
              )}
            </figcaption>

            <div className="mt-4 flex items-center gap-6 text-white">
              <button
                type="button"
                onClick={() => setActive(Math.max(active - 1, 0))}
                disabled={active === 0}
                aria-label="Fotografia anterioară"
                className="rounded-full p-2 hover:bg-white/10 disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <ChevronLeft className="h-7 w-7" />
              </button>
              <span className="text-sm tabular-nums text-slate-300">{active + 1} / {historyPhotos.length}</span>
              <button
                type="button"
                onClick={() => setActive(Math.min(active + 1, last))}
                disabled={active === last}
                aria-label="Fotografia următoare"
                className="rounded-full p-2 hover:bg-white/10 disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <ChevronRight className="h-7 w-7" />
              </button>
            </div>
          </figure>
        </div>
      )}
    </div>
  );
}
