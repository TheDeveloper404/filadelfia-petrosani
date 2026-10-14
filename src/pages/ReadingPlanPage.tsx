import { useEffect, useRef, useState } from 'react';
import planJson from '@/data/reading-plan.json';
import PageMeta from '@/components/PageMeta';
import { formatDateRo, getReadingPlanDayIndex } from '@/utils/date';
import Container from '@/components/ui/container';
import Badge from '@/components/ui/badge';
import { WaveDivider } from '@/components/WaveDivider';
import PageHero from '@/components/PageHero';
import SectionHeading from '@/components/SectionHeading';

interface ReadingEntry {
  reading: string;
}

const plan = planJson as typeof planJson & { readings: ReadingEntry[] };
const READ_KEY = 'filadelfia_plan_read';

function loadRead(): Set<number> {
  try {
    const stored = localStorage.getItem(READ_KEY);
    return new Set(stored ? JSON.parse(stored) : []);
  } catch {
    return new Set();
  }
}

function saveRead(set: Set<number>) {
  try {
    localStorage.setItem(READ_KEY, JSON.stringify([...set]));
  } catch {}
}

export default function ReadingPlanPage() {
  const dayIndex = getReadingPlanDayIndex(plan.startDate, plan.readings.length);
  const todayReading = plan.readings[dayIndex];
  const todayLabel = formatDateRo(new Date().toISOString().split('T')[0]!);
  const progress = Math.round(((dayIndex + 1) / plan.readings.length) * 100);
  const listRef = useRef<HTMLDivElement>(null);

  const [readDays, setReadDays] = useState<Set<number>>(loadRead);
  const [search, setSearch] = useState('');

  const toggleRead = (index: number) => {
    setReadDays(prev => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      saveRead(next);
      return next;
    });
  };

  const scrollToToday = (behavior: ScrollBehavior = 'smooth') => {
    const container = listRef.current;
    const row = document.getElementById('today-row');
    if (!container || !row) return;
    container.scrollBy({ top: row.getBoundingClientRect().top - container.getBoundingClientRect().top - container.clientHeight / 2 + row.clientHeight / 2, behavior });
  };

  useEffect(() => {
    const t = setTimeout(() => scrollToToday('instant'), 100);
    return () => clearTimeout(t);
  }, []);

  const filtered = search.trim()
    ? plan.readings.map((row, index) => ({ row, index })).filter(({ row }) =>
        row.reading.toLowerCase().includes(search.toLowerCase())
      )
    : plan.readings.map((row, index) => ({ row, index }));

  const readCount = readDays.size;

  return (
    <div>
      <PageMeta title="Plan de citire — Filadelfia" description="Plan anual de citire biblică pentru ziua de astăzi și următoarele zile." />

      {/* Hero */}
      <PageHero
        eyebrow="Lectură zilnică"
        title={plan.planName}
        subtitle="Citește Biblia și vei deveni mai înțelept, crede-o ca să fii în siguranță și aplică-o, ca să trăiești o viață adevărată!"
      />

      {/* ── Plan ── */}
      <section className="relative py-20 sm:py-24 bg-[#d4ab84]">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 -translate-y-full">
          <WaveDivider bottomColor="#d4ab84" height={70} />
        </div>
        <Container>
          <SectionHeading eyebrow="Începeți ziua cu Biblia" title="Fii la zi cu citirea Cuvântului lui Dumnezeu" />

            {/* Bento: tile închis „azi" + tile alb cu lista zilelor */}
            <div className="grid gap-4 lg:grid-cols-12">

              {/* LEFT — today */}
              <div className="flex flex-col items-center justify-center gap-6 rounded-3xl bg-slate-900 p-8 text-center text-white shadow-xl shadow-slate-900/20 sm:p-12 lg:col-span-5">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">{todayLabel}</p>
                <p className="text-5xl font-bold text-white leading-tight">
                  {todayReading ? todayReading.reading : '—'}
                </p>
                <p className="text-sm text-slate-400">Ziua {dayIndex + 1} din {plan.readings.length}</p>

                {/* Progress plan */}
                <div className="w-full max-w-xs">
                  <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
                    <span>Progres plan</span>
                    <span className="text-secondary">{progress}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-2 rounded-full bg-secondary transition-all" style={{ width: `${progress}%` }} />
                  </div>
                </div>

                {/* Progress citit */}
                <div className="w-full max-w-xs">
                  <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
                    <span>Zile marcate ca citite</span>
                    <span className="text-green-600">{readCount} / {plan.readings.length}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-2 rounded-full bg-green-500 transition-all" style={{ width: `${Math.round((readCount / plan.readings.length) * 100)}%` }} />
                  </div>
                </div>

                <button
                  onClick={() => scrollToToday('smooth')}
                  className="inline-flex items-center gap-2 rounded-full bg-secondary px-6 py-2.5 text-sm font-bold text-secondary-foreground transition hover:bg-secondary/90"
                >
                  Mergi la ziua de azi
                </button>
              </div>

              {/* RIGHT — list */}
              <div className="flex flex-col gap-3 rounded-3xl bg-white p-4 shadow-sm sm:p-8 lg:col-span-7">

                {/* Search */}
                <div className="relative">
                  <svg className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                  </svg>
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Caută după carte (ex: Matei, Geneza...)"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                  />
                  {search && (
                    <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>

                <div ref={listRef} className="max-h-[420px] overflow-y-auto divide-y divide-slate-100 pr-1">
                  {filtered.length === 0 && (
                    <p className="py-8 text-center text-sm text-slate-400">Niciun rezultat pentru „{search}"</p>
                  )}
                  {filtered.map(({ row, index }) => {
                    const isToday = index === dayIndex;
                    const isPast = index < dayIndex;
                    const isRead = readDays.has(index);
                    return (
                      <div
                        key={index}
                        id={isToday ? 'today-row' : undefined}
                        className={`px-3 py-3 flex items-center justify-between gap-3 transition ${
                          isToday ? 'rounded-xl bg-secondary/10' : isPast ? 'opacity-60' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-xs font-bold text-slate-400 w-14 shrink-0">Ziua {index + 1}</span>
                          <span className={`text-sm font-semibold truncate ${isToday ? 'text-slate-900' : 'text-slate-700'} ${isRead ? 'line-through text-slate-400' : ''}`}>
                            {row.reading}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {isToday && !isRead && <Badge>Astăzi</Badge>}
                          <button
                            onClick={() => toggleRead(index)}
                            title={isRead ? 'Marchează ca necitit' : 'Marchează ca citit'}
                            className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition ${
                              isRead
                                ? 'border-green-500 bg-green-500 text-white'
                                : 'border-slate-300 bg-white hover:border-green-400'
                            }`}
                          >
                            {isRead && (
                              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
        </Container>
      </section>
    </div>
  );
}
