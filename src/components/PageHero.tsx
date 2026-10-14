import type { ReactNode } from 'react';
import Container from '@/components/ui/container';
import HeroBackground from '@/components/HeroBackground';
import { NAV_OFFSET } from '@/components/Nav';

interface PageHeroProps {
  eyebrow: string;
  title: ReactNode;
  subtitle: string;
}

export default function PageHero({ eyebrow, title, subtitle }: PageHeroProps) {
  return (
    <section className={`relative overflow-hidden bg-slate-900 pb-24 text-white ${NAV_OFFSET}`}>
      <HeroBackground />
      <Container className="relative text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">{eyebrow}</p>
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl" style={{ color: '#d4ab84' }}>{title}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-xl leading-8 text-slate-300">{subtitle}</p>
      </Container>
    </section>
  );
}
