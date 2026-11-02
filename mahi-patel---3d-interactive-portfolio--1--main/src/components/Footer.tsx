import React, { useEffect, useState } from 'react';
import { PageRoute } from '../types';
import { FEATURED_PROJECTS } from '../data/featuredProjects';
import { CONTACT_FORM_ID, SCROLL_TO_FORM_KEY } from '../pages/ContactPage';

interface FooterProps {
  onNavigate: (route: PageRoute) => void;
  onReplayPreloader: () => void;
  onCursorChange?: (state: 'default' | 'link' | 'drag-3d' | 'view' | 'copy') => void;
}

const EMAIL = 'mahipatel1329@gmail.com';

const EXPERTISE = [
  'Residential Interiors',
  'Retail & Brand Spaces',
  'Hospitality Design',
  'Adaptive Reuse',
  '3D Visualisation',
  'Working Drawings & Detailing',
];

const SOCIALS = [
  { label: 'LinkedIn', href: 'https://linkedin.com' },
  { label: 'Instagram', href: 'https://instagram.com' },
  { label: 'Behance', href: 'https://behance.net' },
];

/** Content page remembers the selected project under this key (see WorkPage). */
const ACTIVE_PROJECT_KEY = 'mahi_content_active_project';

export const Footer: React.FC<FooterProps> = ({ onNavigate, onReplayPreloader, onCursorChange }) => {
  const [studioTime, setStudioTime] = useState('');

  useEffect(() => {
    const update = () =>
      setStudioTime(
        new Date().toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Asia/Kolkata',
        })
      );
    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, []);

  const hover = {
    onMouseEnter: () => onCursorChange?.('link'),
    onMouseLeave: () => onCursorChange?.('default'),
  };

  /** Scroll to the contact form if it's on screen, otherwise open the Contact page at the form. */
  const goToContactForm = () => {
    const form = document.getElementById(CONTACT_FORM_ID);
    if (form) return form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    try {
      sessionStorage.setItem(SCROLL_TO_FORM_KEY, '1');
    } catch {}
    onNavigate({ name: 'contact' });
  };

  const openProject = (slug: string, index: number) => {
    if (slug === 'royce-store') return onNavigate({ name: 'royce' });
    if (slug === 'urben-hatch') return onNavigate({ name: 'work-detail', slug: 'urben-hatch' });
    if (slug === 'villa') return onNavigate({ name: 'work-detail', slug: 'villa' });
    try {
      sessionStorage.setItem(ACTIVE_PROJECT_KEY, String(index));
    } catch {}
    onNavigate({ name: 'work' });
  };

  const studioLinks: { label: string; route: PageRoute }[] = [
    { label: 'Projects', route: { name: 'work' } },
    { label: 'About', route: { name: 'about' } },
    { label: 'Contact', route: { name: 'contact' } },
  ];

  const heading = 'font-mono-code text-[10px] uppercase tracking-[0.22em] text-[#C9A47E] mb-4';
  const link = 'text-left text-[#D9D4CA] hover:text-white transition-colors duration-300';

  return (
    <footer id="main-footer" className="relative z-20 bg-[#141413] text-[#A8A399] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Call to action */}
        <div className="pt-12 md:pt-16 pb-10 md:pb-12 grid gap-8 md:grid-cols-12 md:items-end border-b border-white/10">
          <div className="md:col-span-8">
            <p className="font-mono-code text-[10px] uppercase tracking-[0.22em] text-[#C9A47E] mb-4">
              Commissions · Internships · Collaborations
            </p>
            <h2 className="font-display font-light text-[#F4F1EA] text-3xl sm:text-4xl leading-[1.1] tracking-tight">
              Let’s shape spaces
              <br />
              <span className="italic text-[#C9A47E]">that feel considered.</span>
            </h2>
          </div>
          <div className="md:col-span-4 md:justify-self-end">
            <button
              type="button"
              onClick={goToContactForm}
              {...hover}
              className="group inline-flex items-center gap-4 rounded-full border border-[#C9A47E]/60 px-6 py-3 text-sm text-[#F4F1EA] transition-colors duration-300 hover:bg-[#C9A47E] hover:text-[#141413]"
            >
              Start a conversation
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </button>
            <a href={`mailto:${EMAIL}`} {...hover} className="mt-3 block text-sm text-[#D9D4CA] hover:text-white transition-colors">
              {EMAIL}
            </a>
          </div>
        </div>

        {/* Columns */}
        <div className="py-10 md:py-12 grid grid-cols-2 gap-y-10 gap-x-8 md:grid-cols-12 text-sm">
          <div className="col-span-2 md:col-span-4 md:pr-10">
            <div className="font-display text-xl text-[#F4F1EA] font-light mb-4">Mahi Patel</div>
            <p className="leading-relaxed text-[#A8A399] max-w-sm">
              Interior &amp; spatial designer based in Ahmedabad, crafting retail, hospitality and residential
              interiors grounded in material honesty, light and the way people move through space.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 text-xs text-[#C9A47E]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#C9A47E] opacity-60 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#C9A47E]" />
              </span>
              Available for internships &amp; studio collaborations
            </div>
          </div>

          <nav className="md:col-span-3" aria-label="Selected projects">
            <h3 className={heading}>Selected Work</h3>
            <ul className="space-y-2.5">
              {FEATURED_PROJECTS.map((p, i) => (
                <li key={p.slug}>
                  <button onClick={() => openProject(p.slug, i)} {...hover} className={`${link} group flex items-baseline gap-3`}>
                    <span className="font-mono-code text-[10px] text-[#6E6A62] group-hover:text-[#C9A47E] transition-colors">
                      {p.number}
                    </span>
                    <span className="capitalize">{p.name.replace('’', '').toLowerCase()}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <h3 className={heading}>Expertise</h3>
            <ul className="space-y-2.5 text-[#D9D4CA]">
              {EXPERTISE.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2 space-y-8">
            <nav aria-label="Studio">
              <h3 className={heading}>Studio</h3>
              <ul className="space-y-2.5">
                {studioLinks.map((l) => (
                  <li key={l.label}>
                    <button onClick={() => onNavigate(l.route)} {...hover} className={link}>
                      {l.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
            <div>
              <h3 className={heading}>Follow</h3>
              <ul className="space-y-2.5">
                {SOCIALS.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noreferrer" {...hover} className={`${link} inline-flex items-center gap-1.5`}>
                      {s.label}
                      <span aria-hidden="true" className="text-[10px]">↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </div>

      {/* Oversized wordmark */}
      <div aria-hidden="true" className="select-none px-4 md:px-8 leading-none">
        <div className="font-display font-light text-[#F4F1EA]/[0.06] text-center tracking-tight whitespace-nowrap text-[9vw] pb-[0.5vw]">
          MAHI PATEL
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#6E6A62]">
          <span>© {new Date().getFullYear()} Mahi Patel — Interior &amp; Spatial Design</span>
          <span>Ahmedabad, India · {studioTime || '--:--'} IST</span>
          <div className="flex items-center gap-6">
            <button onClick={onReplayPreloader} {...hover} className="hover:text-[#C9A47E] transition-colors">
              Replay intro
            </button>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              {...hover}
              className="inline-flex items-center gap-1.5 hover:text-[#C9A47E] transition-colors"
            >
              Back to top <span aria-hidden="true">↑</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
