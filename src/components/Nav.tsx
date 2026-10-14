import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import Container from '@/components/ui/container';
import { Button } from '@/components/ui/button';

const navLinks = [
  { to: '/', label: 'Acasă' },
  { to: '/live', label: 'Live' },
  { to: '/despre-noi', label: 'Despre noi' },
  { to: '/plan-citire', label: 'Plan Biblic' },
  { to: 'https://seminarulteologicfiladelfia.ro', label: 'Seminar Teologic', external: true },
  { to: '/contact', label: 'Contact' },
];

// Spațiul de sus pe care hero-urile îl rezervă pentru header-ul din hero (logo + meniu pastilă).
export const NAV_OFFSET = 'pt-36 md:pt-64';

// Linkurile din pastila albă (header-ul din hero și pastila plutitoare de la scroll).
const PILL = 'flex items-center gap-1 rounded-full bg-white px-3 py-2 shadow-xl shadow-black/25 lg:px-4';
const PILL_LINK = {
  base: 'rounded-full px-3 py-2 text-base font-medium lg:px-5 lg:text-lg',
  active: 'bg-slate-900 text-white hover:text-white',
  inactive: 'text-slate-600 hover:bg-[#d4ab84]/30 hover:text-slate-900',
};

export default function Nav() {
  const location = useLocation();
  const heroHeaderRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuTop, setMenuTop] = useState(0);
  const [pendingExternalUrl, setPendingExternalUrl] = useState<string | null>(null);

  // Pastila plutitoare apare exact când header-ul din hero a ieșit complet din ecran —
  // indiferent de lățimea ecranului sau de bannerul de anunț de deasupra.
  useEffect(() => {
    const el = heroHeaderRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  // Meniul mobil e poziționat fix sub hamburgerul apăsat — la rotire / schimbarea lățimii se închide,
  // ca să nu rămână decalat (sau deschis, cu scroll-ul blocat, după trecerea pe desktop).
  // Doar lățimea contează: bara de adrese de pe mobil schimbă înălțimea la scroll și nu trebuie să-l închidă.
  useEffect(() => {
    if (!menuOpen) return;
    const width = window.innerWidth;
    const close = () => { if (window.innerWidth !== width) setMenuOpen(false); };
    window.addEventListener('resize', close);
    return () => window.removeEventListener('resize', close);
  }, [menuOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const renderLinks = (linkClass: string, activeClass: string, inactiveClass: string, onNavigate?: () => void) =>
    navLinks.map(link => {
      const active = !link.external && location.pathname === link.to;
      const className = `transition-colors duration-200 ${linkClass} ${active ? activeClass : inactiveClass}`;
      return link.external ? (
        <button
          key={link.to}
          type="button"
          onClick={() => { onNavigate?.(); setPendingExternalUrl(link.to); }}
          className={`text-left ${className}`}
        >
          {link.label}
        </button>
      ) : (
        <Link key={link.to} to={link.to} onClick={onNavigate} className={className}>
          {link.label}
        </Link>
      );
    });

  // Aceleași linkuri în pastila din hero și în pastila plutitoare
  const pillLinks = renderLinks(PILL_LINK.base, PILL_LINK.active, PILL_LINK.inactive);

  // Hamburger — mobile only (apare atât în header-ul din hero, cât și în pastila plutitoare).
  // Meniul se deschide fix sub butonul apăsat, ca să rămână pe loc și dacă pagina e derulată.
  const renderHamburger = (colorClass: string) => (
    <button
      className={`relative flex md:hidden items-center justify-center h-14 w-14 rounded-full transition overflow-hidden active:scale-95 ${colorClass}`}
      onClick={e => {
        setMenuTop(e.currentTarget.getBoundingClientRect().bottom);
        setMenuOpen(o => !o);
      }}
      aria-label={menuOpen ? 'Închide meniu' : 'Deschide meniu'}
    >
      {menuOpen ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 transition-transform duration-200 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      )}
    </button>
  );

  return (
    <header>
      {/* ── Header în hero: logo centrat + meniu pastilă ── */}
      <div
        ref={heroHeaderRef}
        className="absolute inset-x-0 top-0 z-50"
        aria-hidden={scrolled}
        inert={scrolled}
      >
        <Container className="pt-4 md:pt-8">
          <div className="flex items-center justify-between md:flex-col md:gap-6">
            <Link to="/" className="flex items-center gap-3 text-white hover:text-white">
              <img src="/logo.png" alt="Logo Filadelfia" className="h-12 w-12 object-contain md:h-20 md:w-20" fetchPriority="high" />
              <div className="flex flex-col leading-tight">
                <span className="text-3xl font-bold text-white md:text-4xl">Filadelfia</span>
                <span className="text-xs font-medium tracking-widest text-slate-300 uppercase">Biserica Penticostală</span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav data-testid="desktop-nav" className={`hidden md:flex ${PILL}`}>
              {pillLinks}
            </nav>

            {renderHamburger('text-slate-300 hover:text-white')}
          </div>
        </Container>
      </div>

      {/* ── La scroll: doar pastila cu meniul, plutind sus ── */}
      <div
        className={`pointer-events-none fixed inset-x-0 top-3 z-50 flex justify-center px-4 transition-all duration-300 ${
          scrolled ? 'translate-y-0 opacity-100' : '-translate-y-24 opacity-0'
        }`}
        aria-hidden={!scrolled}
        inert={!scrolled}
      >
        {/* Bandă pe toată lățimea, dar click-urile trec prin ea — doar pastila e clickabilă */}
        <nav className={`pointer-events-auto hidden md:flex ${PILL}`}>
          {pillLinks}
        </nav>
        <div className="pointer-events-auto ml-auto rounded-full bg-white shadow-xl shadow-black/25 md:hidden">
          {renderHamburger('text-slate-700 hover:text-slate-900')}
        </div>
      </div>

      {/* Mobile menu — card cu margini, fix sub hamburgerul apăsat */}
      <div
        className={`fixed left-0 right-0 z-50 md:hidden px-4 pt-2 pb-4 ${!menuOpen ? 'pointer-events-none' : ''}`}
        style={{ top: menuTop }}
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <div
          className={`transition-all duration-300 ${
            menuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
          }`}
          style={{
            background: 'rgba(10, 15, 30, 0.97)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '1.5rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
          }}
        >
          <nav className="flex flex-col p-3 gap-1">
            {renderLinks(
              'rounded-2xl px-5 py-3.5 text-base font-semibold transition-all',
              'bg-secondary/20 text-secondary',
              'text-slate-300 hover:bg-white/8 hover:text-white',
              () => setMenuOpen(false),
            )}
          </nav>
        </div>
      </div>

      {/* Fundal transparent care închide meniul mobil la tap în afara lui (sub header, z-40) */}
      {menuOpen && createPortal(
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setMenuOpen(false)} />,
        document.body
      )}

      {pendingExternalUrl && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={() => setPendingExternalUrl(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold text-slate-900">Vei fi direcționat către un alt site</h2>
            <p className="mt-2 text-sm text-slate-600">
              Vei fi direcționat către <span className="font-semibold">{pendingExternalUrl.replace(/^https?:\/\//, '')}</span>, site-ul Seminarului Teologic Filadelfia.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" size="sm" onClick={() => setPendingExternalUrl(null)}>
                Anulează
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  window.open(pendingExternalUrl, '_blank', 'noopener,noreferrer');
                  setPendingExternalUrl(null);
                }}
              >
                Continuă
              </Button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
}
