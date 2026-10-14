import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import HomePage from '../src/pages/HomePage';
import LivePage from '../src/pages/LivePage';
import ContactPage from '../src/pages/ContactPage';
import ReadingPlanPage from '../src/pages/ReadingPlanPage';
import AdminPage from '../src/pages/AdminPage';
import DespreNoi from '../src/pages/DespreNoi';

// ============================================================
// Helpers
// ============================================================
function renderPage(ui: React.ReactElement, path = '/') {
  return render(<MemoryRouter initialEntries={[path]}>{ui}</MemoryRouter>);
}

// Silence console.error from React Router / jsdom
beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;
  HTMLElement.prototype.scrollBy = vi.fn();
});
afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
});

// ============================================================
// HomePage
// ============================================================
describe('HomePage', () => {
  it('renders the church name in hero', () => {
    renderPage(<HomePage />);
    expect(screen.getAllByText(/filadelfia/i).length).toBeGreaterThan(0);
  });

  it('renders Program & Comunitate section', () => {
    renderPage(<HomePage />);
    expect(screen.getByText(/program & comunitate/i)).toBeInTheDocument();
  });

  it('renders Program săptămânal', () => {
    renderPage(<HomePage />);
    expect(screen.getByText(/program săptămânal/i)).toBeInTheDocument();
  });

  it('renders Evenimente section', () => {
    renderPage(<HomePage />);
    expect(screen.getByText(/evenimente/i)).toBeInTheDocument();
  });

  it('renders Calendar section', () => {
    renderPage(<HomePage />);
    expect(screen.getByText(/calendar/i)).toBeInTheDocument();
  });

  it('renders Urmărește Live CTA button', () => {
    renderPage(<HomePage />);
    expect(screen.getByRole('link', { name: /urmărește live/i })).toBeInTheDocument();
  });

  it('renders Plan Biblic CTA button', () => {
    renderPage(<HomePage />);
    expect(screen.getByRole('link', { name: /plan biblic/i })).toBeInTheDocument();
  });
});

// ============================================================
// LivePage
// ============================================================
describe('LivePage', () => {
  it('renders the page heading', () => {
    renderPage(<LivePage />);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('renders the last recorded video section', () => {
    renderPage(<LivePage />);
    expect(screen.getByText(/ultimul program înregistrat/i)).toBeInTheDocument();
  });
});

// ============================================================
// ContactPage
// ============================================================
describe('ContactPage', () => {
  it('renders the page', () => {
    renderPage(<ContactPage />);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('renders the address', () => {
    renderPage(<ContactPage />);
    expect(screen.getByText(/petroșani/i)).toBeInTheDocument();
  });

  it('renders pastor name', () => {
    renderPage(<ContactPage />);
    expect(screen.getByText(/gheorghe coicheci/i)).toBeInTheDocument();
  });

  it('renders the map iframe', () => {
    renderPage(<ContactPage />);
    expect(screen.getByTitle(/hartă/i)).toBeInTheDocument();
  });
});

// ============================================================
// DespreNoi
// ============================================================
describe('DespreNoi', () => {
  it('renders Misiune, Viziune și Valori (mutat de pe Acasă)', () => {
    renderPage(<DespreNoi />, '/despre-noi');
    expect(screen.getByRole('heading', { name: /misiune, viziune și valori/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /^misiune$/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /^viziune$/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /^valori$/i })).toBeInTheDocument();
  });

  it('renders the history milestones (1933–1935 începuturi, 11 august 1996 inaugurare)', () => {
    renderPage(<DespreNoi />, '/despre-noi');
    expect(screen.getByRole('heading', { name: /repere din istoria noastră/i })).toBeInTheDocument();
    expect(screen.getByText('1933–1935')).toBeInTheDocument();
    expect(screen.getByText('11 august 1996')).toBeInTheDocument();
  });

  it('renders each of the 17 historic photos exactly once', () => {
    renderPage(<DespreNoi />, '/despre-noi');
    const srcs = screen
      .getAllByRole('img')
      .map((img) => img.getAttribute('src') ?? '')
      .filter((src) => src.startsWith('/images/istoric/'));
    const expected = Array.from({ length: 17 }, (_, i) => `/images/istoric/${String(i + 1).padStart(2, '0')}.webp`);
    expect([...srcs].sort()).toEqual(expected);
  });

  it('lists the milestones newest first (2026 at the top, 1933–1935 at the bottom)', () => {
    renderPage(<DespreNoi />, '/despre-noi');
    const years = Array.from(screen.getByText('1933–1935').closest('ol')!.children).map((li) => li.querySelector('p')?.textContent);
    expect(years).toEqual(['9 august 2026', '1996–2016', '11 august 1996', '1990–1991', '1965', '1940–1946', '1933–1935']);
  });

  it('places the photos next to their milestones, as decided by the client', () => {
    renderPage(<DespreNoi />, '/despre-noi');
    const photosIn = (year: string) =>
      Array.from(screen.getByText(year).closest('li')!.querySelectorAll('img')).map((img) => img.getAttribute('src'));
    const ist = (...n: number[]) => n.map((i) => `/images/istoric/${String(i).padStart(2, '0')}.webp`);
    expect(photosIn('1933–1935')).toEqual(ist(1));
    expect(photosIn('1940–1946')).toEqual(ist(2, 3));
    expect(photosIn('1965')).toEqual(ist(4, 5, 6));
    expect(photosIn('1990–1991')).toEqual(ist(7, 8, 11));
    expect(photosIn('11 august 1996')).toEqual(ist(9));
    expect(photosIn('1996–2016')).toEqual(ist(10, 12, 13, 14, 15, 16, 17));
    expect(photosIn('9 august 2026')).toEqual(
      Array.from({ length: 12 }, (_, i) => `/images/30-ani/${String(i + 1).padStart(2, '0')}.webp`),
    );
  });

  it('lightbox: opens photo 1, ArrowRight goes to photo 2, Escape closes', () => {
    renderPage(<DespreNoi />, '/despre-noi');
    fireEvent.click(screen.getByRole('button', { name: /nicolae cazan vorbind/i }));
    const dialog = screen.getByRole('dialog', { name: /fotografia 1 din 17/i });
    expect(dialog).toHaveTextContent(/primul conducător prezbiter/i);
    expect(screen.getByRole('button', { name: /închide/i })).toHaveFocus();

    fireEvent.keyDown(document, { key: 'ArrowRight' });
    expect(screen.getByRole('dialog', { name: /fotografia 2 din 17/i })).toHaveTextContent(/greța alexa/i);

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});

// ============================================================
// ReadingPlanPage
// ============================================================
describe('ReadingPlanPage', () => {
  it('renders the page heading', () => {
    renderPage(<ReadingPlanPage />);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('renders the scroll-to-today button', () => {
    renderPage(<ReadingPlanPage />);
    expect(screen.getByRole('button', { name: /mergi la ziua de azi/i })).toBeInTheDocument();
  });

  it('renders reading plan rows', () => {
    renderPage(<ReadingPlanPage />);
    // Should render multiple day rows
    const rows = screen.getAllByText(/geneza|matei|psalmul|marcu|luca|fapte/i);
    expect(rows.length).toBeGreaterThan(0);
  });
});

// ============================================================
// AdminPage
// ============================================================
describe('AdminPage', () => {
  beforeEach(() => {
    // Simulate already-unlocked session so PIN screen is bypassed
    sessionStorage.setItem('filadelfia_admin_unlocked', '1');
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('renders admin heading', () => {
    renderPage(<AdminPage />);
    expect(screen.getByText(/administrator/i)).toBeInTheDocument();
  });

  it('renders events section', () => {
    renderPage(<AdminPage />);
    expect(screen.getAllByText(/evenimente/i).length).toBeGreaterThan(0);
  });

  it('shows PIN screen when not unlocked', () => {
    sessionStorage.clear();
    renderPage(<AdminPage />);
    expect(screen.getByText(/introdu codul de acces/i)).toBeInTheDocument();
  });
});
