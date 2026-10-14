import { useState } from 'react';
import { createPortal } from 'react-dom';
import LivePlayer from '@/components/LivePlayer';
import PageMeta from '@/components/PageMeta';
import Container from '@/components/ui/container';
import { WaveDivider } from '@/components/WaveDivider';
import PageHero from '@/components/PageHero';
import SectionHeading from '@/components/SectionHeading';
import siteConfig from '@/data/site-config.json';

export default function LivePage() {
  const [showPopup, setShowPopup] = useState(false);
  const [isLive, setIsLive] = useState(false);

  return (
    <div>
      <PageMeta title="Live — Biserica Filadelfia" description="Urmărește transmisia noastră live." />

      {/* Hero */}
      <PageHero
        eyebrow="Transmisie în direct"
        title="Live"
        subtitle="Te invităm să urmărești programele noastre în direct."
      />

      {/* ── Player ── */}
      <section className="relative py-20 sm:py-24 bg-[#d4ab84]">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 -translate-y-full">
          <WaveDivider bottomColor="#d4ab84" height={70} />
        </div>
        <Container>
          <SectionHeading eyebrow="VIZIONEAZĂ ACUM" title={isLive ? 'Suntem Live!' : 'Ultimul program înregistrat'} />
          <div className="rounded-3xl bg-slate-900 p-3 shadow-xl shadow-slate-900/20 sm:p-4">
            <LivePlayer onStateChange={setIsLive} />
          </div>
        </Container>
      </section>

      {/* ── Arhivă predici ── */}
      <section className="py-20 sm:py-24 bg-[#d4ab84]">
        <Container>
          <SectionHeading eyebrow="Predici recomandate" title="Arhivă predici">
            <div className="mt-6">
              <button
                onClick={() => setShowPopup(true)}
                className="inline-flex items-center gap-2 rounded-full bg-secondary px-6 py-3 text-sm font-bold text-secondary-foreground transition hover:bg-secondary/90 shadow-md shadow-secondary/20"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                Vezi toate predicile pe YouTube
              </button>
            </div>
          </SectionHeading>
          {/* Bento: pe desktop primul video mare (2×2), restul mici; pe tabletă 2 coloane egale */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {siteConfig.youtube.featuredVideoIds.map((id, i) => (
              <div
                key={id}
                className={`aspect-video overflow-hidden rounded-3xl bg-slate-950 shadow-sm ${i === 0 ? 'lg:col-span-2 lg:row-span-2 lg:aspect-auto' : ''}`}
              >
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`}
                  title="Predica"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Popup */}
      {showPopup && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowPopup(false)} />
          <div className="relative mx-4 w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
            <div className="mb-1 flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-secondary/15 text-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 0 0 .5 6.19C0 8.1 0 12 0 12s0 3.9.5 5.81a3.02 3.02 0 0 0 2.12 2.14C4.5 20.5 12 20.5 12 20.5s7.5 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14C24 15.9 24 12 24 12s0-3.9-.5-5.81zM9.75 15.5v-7l6.5 3.5-6.5 3.5z"/>
                </svg>
              </span>
              <h3 className="text-xl font-bold text-slate-900">Arhivă predici</h3>
            </div>
            <p className="mt-3 text-base leading-7 text-slate-600">
              Vei fi direcționat către canalul nostru de YouTube unde găsești toate predicile și transmisiile live anterioare.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => { setShowPopup(false); window.open(`${siteConfig.social.youtube}/streams`, '_blank'); }}
                className="flex-1 rounded-full bg-secondary px-5 py-2.5 text-sm font-bold text-secondary-foreground transition hover:bg-secondary/90"
              >
                Deschide YouTube
              </button>
              <button
                onClick={() => setShowPopup(false)}
                className="flex-1 rounded-full border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Anulează
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
