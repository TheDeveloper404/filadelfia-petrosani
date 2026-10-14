import { useState, useRef } from 'react';
import siteConfig from '@/data/site-config.json';
import PageMeta from '@/components/PageMeta';
import Container from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { WaveDivider } from '@/components/WaveDivider';
import PageHero from '@/components/PageHero';
import SectionHeading from '@/components/SectionHeading';

type FormState = 'idle' | 'sending' | 'success' | 'error' | 'ratelimit';

export default function ContactPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [formState, setFormState] = useState<FormState>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState('sending');
    try {
      const fd = new FormData(formRef.current!);
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fd.get('name'),
          email: fd.get('email'),
          message: fd.get('message'),
        }),
      });
      if (res.ok) {
        setFormState('success');
        formRef.current?.reset();
        return;
      }
      setFormState(res.status === 429 ? 'ratelimit' : 'error');
    } catch {
      setFormState('error');
    }
  };

  return (
    <div>
      <PageMeta title="Contact — Filadelfia" description="Contactează-ne. Suntem pe Str. 9 Mai, Petroșani, Hunedoara." />

      {/* Hero */}
      <PageHero
        eyebrow="Vino să ne cunoști"
        title="Contact"
        subtitle="Alege metoda de contact care ți se potrivește și ne vom întâlni cu bucurie."
      />

      {/* ── Contact + Map ── */}
      <section className="relative py-20 sm:py-24 bg-[#d4ab84]">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 -translate-y-full">
          <WaveDivider bottomColor="#d4ab84" height={70} />
        </div>
        <Container>
          <SectionHeading eyebrow="Hai să ne cunoaștem" title="Informații & Locație" />

          {/* Bento: tile-uri contact (stânga) + adresă și hartă (dreapta) */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">

              {/* LEFT — Contact info */}
              <div className="grid grid-cols-1 gap-4 lg:col-span-5">
              <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">

                {/* Pastors */}
                <div>
                  <p className="mb-3 text-base font-bold uppercase tracking-[0.3em] text-slate-700 text-center">Conducere</p>
                  <div className="divide-y divide-slate-100">
                    <div className="flex items-center justify-between gap-4 py-4">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Pastor principal</p>
                        <p className="mt-1 text-base font-bold text-slate-900">Gheorghe Coicheci</p>
                      </div>
                      <a
                        href="tel:+40730266437"
                        className="shrink-0 rounded-full bg-secondary/10 border border-secondary/20 px-4 py-2 text-sm font-bold text-slate-800 transition hover:bg-secondary/20"
                      >
                        0730 266 437
                      </a>
                    </div>
                    <div className="flex items-center justify-between gap-4 py-4">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Pastor asistent</p>
                        <p className="mt-1 text-base font-bold text-slate-900">Daniel Nemeș</p>
                      </div>
                      <a
                        href="tel:+40721255379"
                        className="shrink-0 rounded-full bg-secondary/10 border border-secondary/20 px-4 py-2 text-sm font-bold text-slate-800 transition hover:bg-secondary/20"
                      >
                        0721 255 379
                      </a>
                    </div>
                  </div>
                </div>

              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">

                {/* Secretariat */}
                <div>
                  <p className="mb-3 text-base font-bold uppercase tracking-[0.3em] text-slate-700 text-center">Secretariat</p>
                  <div className="divide-y divide-slate-100">
                    <div className="flex flex-wrap items-center justify-between gap-4 py-4">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Secretar</p>
                        <p className="mt-1 text-base font-bold text-slate-900">Marko Kiss</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <a
                          href="tel:+40769653161"
                          className="shrink-0 rounded-full bg-secondary/10 border border-secondary/20 px-4 py-2 text-sm font-bold text-slate-800 transition hover:bg-secondary/20"
                        >
                          0769 653 161
                        </a>
                        <a
                          href="mailto:biserica.filadelfia96@gmail.com"
                          className="shrink-0 rounded-full bg-secondary/10 border border-secondary/20 px-4 py-2 text-sm font-bold text-slate-800 transition hover:bg-secondary/20"
                        >
                          biserica.filadelfia96@gmail.com
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
                {/* Social */}
                <div>
                  <p className="mb-3 text-base font-bold uppercase tracking-[0.3em] text-slate-700 text-center">Urmărește-ne</p>
                  <div className="flex flex-wrap justify-center gap-3">
                    {siteConfig.social.youtube && (
                      <Button asChild size="sm" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                        <a href={siteConfig.social.youtube} target="_blank" rel="noopener noreferrer">YouTube</a>
                      </Button>
                    )}
                    {siteConfig.social.facebook && (
                      <Button asChild size="sm" variant="ghost" className="border border-slate-200 hover:bg-slate-100 text-slate-700">
                        <a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              </div>

              {/* RIGHT — Address + Map */}
              <div className="space-y-6 rounded-3xl bg-white p-6 shadow-sm sm:p-8 lg:col-span-7">
                {/* Address */}
                <div>
                  <p className="mb-3 text-base font-bold uppercase tracking-[0.3em] text-slate-700 text-center">Adresă</p>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-slate-800">{siteConfig.contact.address}</p>
                  </div>
                </div>

                <p className="mb-3 text-base font-bold uppercase tracking-[0.3em] text-slate-700 text-center">Harta locației</p>
                {siteConfig.contact.mapEmbedUrl ? (
                  <div className="overflow-hidden rounded-2xl">
                    <iframe
                      src={siteConfig.contact.mapEmbedUrl}
                      title="Locație pe hartă"
                      width="100%"
                      className="h-48 sm:h-[420px]"
                      style={{ border: 0 }}
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 p-10 text-center space-y-4 h-full">
                    <div className="text-4xl">📍</div>
                    <Button asChild size="sm" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                      <a
                        href={`https://www.google.com/maps/search/${encodeURIComponent(siteConfig.contact.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Deschide Google Maps
                      </a>
                    </Button>
                  </div>
                )}
              </div>

          </div>
        </Container>
      </section>

      {/* ── Formular contact ── */}
      <section className="pb-20 sm:pb-24 bg-[#d4ab84]">
        <Container>
          <SectionHeading eyebrow="Scrie-ne" title="Trimite un mesaj">
            <p className="mt-3 text-base text-slate-700">Îți vom răspunde în cel mai scurt timp posibil.</p>
          </SectionHeading>

            <div className="mx-auto max-w-3xl rounded-3xl bg-white p-6 shadow-sm sm:p-10">
              {formState === 'success' ? (
                <div className="flex flex-col items-center gap-4 py-12 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Mesaj trimis!</h3>
                  <p className="text-slate-500 max-w-sm">Îți mulțumim. Te vom contacta în cel mai scurt timp posibil.</p>
                  <button onClick={() => setFormState('idle')} className="mt-2 text-sm font-semibold text-secondary hover:underline">
                    Trimite alt mesaj
                  </button>
                </div>
              ) : (
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">Nume</label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Numele tău"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">Email</label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="email@exemplu.com"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">Mesaj</label>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      placeholder="Scrie mesajul tău aici..."
                      className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                    />
                  </div>
                  {formState === 'error' && (
                    <p className="text-sm font-semibold text-red-500">A apărut o eroare. Încearcă din nou sau contactează-ne telefonic.</p>
                  )}
                  {formState === 'ratelimit' && (
                    <p className="text-sm font-semibold text-amber-600">Ai trimis prea multe mesaje într-o oră. Te rugăm să încerci mai târziu.</p>
                  )}
                  <Button
                    type="submit"
                    disabled={formState === 'sending'}
                    className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
                  >
                    {formState === 'sending' ? 'Se trimite...' : 'Trimite mesajul'}
                  </Button>
                </form>
              )}
            </div>
        </Container>
      </section>
    </div>
  );
}
