import { useState, useEffect, startTransition } from 'react';
import { Link } from 'react-router-dom';
import siteConfig from '@/data/site-config.json';
import staticEvents from '@/data/events.json';
import holidays from '@/data/holidays.json';
import schedule from '@/data/schedule.json';
import versesData from '@/data/verses.json';
import { getVerseOfTheDay } from '@/utils/verse';
import { isUpcoming, isTodayEvent } from '@/utils/date';
import { getNextService, getServiceNextDate } from '@/utils/schedule';
import type { CustomEvent } from '@/pages/AdminPage';
import { dbRead } from '@/lib/db';

import { Button } from '@/components/ui/button';
import Container from '@/components/ui/container';
import EventCard from '@/components/EventCard';
import MiniCalendar from '@/components/MiniCalendar';
import PageMeta from '@/components/PageMeta';
import VerseOfTheDay from '@/components/VerseOfTheDay';
import { WaveDivider } from '@/components/WaveDivider';
import SectionHeading from '@/components/SectionHeading';
import HeroBackground from '@/components/HeroBackground';
import { NAV_OFFSET } from '@/components/Nav';

const EVENTS_KEY = 'filadelfia_events';
const SCHEDULE_KEY = 'filadelfia_schedule';

function loadCachedEvents(): CustomEvent[] {
  try {
    const stored = localStorage.getItem(EVENTS_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return [];
}

function loadCachedSchedule(): typeof schedule.services {
  try {
    const stored = localStorage.getItem(SCHEDULE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return schedule.services;
}

export default function HomePage() {
  const [customEvents, setCustomEvents] = useState<CustomEvent[]>(loadCachedEvents);
  const [services, setServices] = useState<typeof schedule.services>(loadCachedSchedule);
  const [nextService, setNextService] = useState(() => getNextService(schedule.services, new Date()));
  const verse = getVerseOfTheDay(versesData);

  useEffect(() => {
    dbRead<CustomEvent[]>('events').then(remote => {
      if (remote !== undefined) {
        const list = Array.isArray(remote) ? remote : [];
        localStorage.setItem(EVENTS_KEY, JSON.stringify(list));
        startTransition(() => setCustomEvents(list));
      }
    });
    dbRead<typeof schedule.services>('schedule').then(remote => {
      if (remote !== undefined && Array.isArray(remote) && remote.length > 0) {
        localStorage.setItem(SCHEDULE_KEY, JSON.stringify(remote));
        startTransition(() => setServices(remote));
      }
    });
  }, []);

  // Recalculate next service every minute so the highlight updates without refresh
  useEffect(() => {
    setNextService(getNextService(services, new Date()));
    const interval = setInterval(
      () => setNextService(getNextService(services, new Date())),
      60_000,
    );
    return () => clearInterval(interval);
  }, [services]);

  const allEvents = [...staticEvents, ...customEvents].sort((a, b) => a.date.localeCompare(b.date));
  const upcomingEvents = allEvents.filter(event => isUpcoming(event.date));

  return (
    <div>
      <PageMeta title="Biserica Penticostală Filadelfia | Petroșani" description={siteConfig.description} />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-slate-900 text-white hero-full-height">
        <HeroBackground />

        <Container className={`relative pb-32 md:pb-40 ${NAV_OFFSET}`}>
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-6xl md:text-7xl" style={{ color: '#d4ab84' }}>
              <span className="block">Biserica Penticostală Filadelfia</span>
              <span className="mt-2 block text-2xl font-light tracking-[0.2em] text-white sm:text-4xl">— Petroșani —</span>
            </h1>

            <p className="mt-6 max-w-3xl text-2xl leading-10 text-slate-200">
              Indiferent dacă aveți o relație cu Isus de mult timp sau sunteți la început în descoperirea credinței, Biserica Penticostală Filadelfia din Petroșani vă este alături pentru a vă sprijini în apropierea de Dumnezeu și în înțelegerea mântuirii oferite prin har.
            </p>

            <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="min-w-[12rem] bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-lg shadow-secondary/20">
                <Link to="/live">Urmărește Live</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="min-w-[12rem] bg-transparent border-white/40 text-white hover:bg-white/10 hover:border-white/60">
                <Link to="/plan-citire">Plan Biblic</Link>
              </Button>
            </div>

            <div className="mt-28 w-full max-w-3xl">
              <VerseOfTheDay verse={verse} variant="dark" />
            </div>
          </div>
        </Container>

        <div className="absolute inset-x-0 bottom-0 z-10">
          <WaveDivider bottomColor="#d4ab84" height={90} />
        </div>
      </section>
      {/* ── Schedule + Events + Calendar (bento) ── */}
      <section className="py-20 sm:py-24 bg-[#d4ab84]">
        <Container>
          <SectionHeading eyebrow="Vino alături de noi" title="Program & Comunitate" />

          <p className="mb-4 text-base font-bold uppercase tracking-[0.3em] text-slate-700">Program săptămânal</p>
          {(() => {
            const now = new Date();
            const sorted = [...services]
              .map(service => ({ service, nextDate: getServiceNextDate(service, now) }))
              .sort((a, b) => a.nextDate.getTime() - b.nextDate.getTime() || a.service.time.localeCompare(b.service.time));
            const dateLabel = (d: Date) => `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}`;
            const timeLabel = (s: (typeof services)[number]) => `${s.time}${s.endTime ? ` – ${s.endTime}` : ''}`;
            const nextLabel = nextService?.isOngoing ? 'În desfășurare' : nextService?.daysUntil === 0 ? 'Urmează · azi' : 'Urmează';
            return (
              // Tile-uri egale (4 pe un rând pe desktop); următorul serviciu (getNextService) e închis la culoare
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {sorted.map(({ service, nextDate }) => {
                  const isFirst = service.id === nextService?.service.id;
                  return (
                    <div
                      key={service.id}
                      className={`flex flex-col justify-between rounded-3xl p-6 ${
                        isFirst ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20' : 'bg-white shadow-sm'
                      }`}
                    >
                      <p className={`text-xs font-bold uppercase tracking-widest ${isFirst ? 'text-[#d4ab84]' : 'text-secondary'}`}>
                        {isFirst ? nextLabel : `${service.dayLabel} · ${dateLabel(nextDate)}`}
                      </p>
                      <div className="mt-6">
                        {isFirst && <p className="text-sm font-semibold uppercase tracking-widest text-slate-400">{service.dayLabel} · {dateLabel(nextDate)}</p>}
                        <p className={`mt-1 text-xl font-bold ${isFirst ? 'text-white' : 'text-slate-900'}`}>{service.title}</p>
                        <p className={`mt-1 text-lg ${isFirst ? 'text-slate-200' : 'text-slate-600'}`}>{timeLabel(service)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}

          {/* Evenimente + Calendar */}
          <div className="mt-4 grid gap-4 lg:grid-cols-12">
            <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8 lg:col-span-5">
              <p className="mb-2 text-base font-bold uppercase tracking-[0.3em] text-slate-700">Evenimente</p>
              {upcomingEvents.length > 0 ? (
                <div className="max-h-[420px] overflow-y-auto divide-y divide-slate-100 overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' }}>
                  {upcomingEvents.map(event => (
                    <EventCard key={event.id} {...event} isToday={isTodayEvent(event.date, event.endDate)} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center py-16 text-center">
                  <span className="text-3xl">📅</span>
                  <p className="mt-3 text-sm font-bold text-slate-700">Niciun eveniment planificat</p>
                </div>
              )}
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8 lg:col-span-7">
              <p className="mb-4 text-base font-bold uppercase tracking-[0.3em] text-slate-700">Calendar</p>
              <MiniCalendar events={allEvents} holidays={holidays} />
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
