// Fundalul comun al hero-urilor: poza de la aniversare + suprapunere inchisa.
export default function HeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{ backgroundImage: 'url(/images/hero.webp)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-900/95" />
    </div>
  );
}
