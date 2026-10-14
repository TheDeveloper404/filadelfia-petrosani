import type { ReactNode } from 'react';

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
}

// Titlul unei secțiuni pe fundalul bej: etichetă uppercase + h2, centrat; `children` = subtitlu/buton sub titlu.
export default function SectionHeading({ eyebrow, title, children }: SectionHeadingProps) {
  return (
    <div className="mb-12 text-center">
      <p className="text-base font-semibold uppercase tracking-[0.3em] text-slate-700">{eyebrow}</p>
      <h2 className="mt-3 text-4xl font-bold text-slate-900 sm:text-5xl">{title}</h2>
      {children}
    </div>
  );
}
