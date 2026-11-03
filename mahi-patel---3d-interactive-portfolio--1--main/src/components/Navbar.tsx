import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { DisciplineMode, PageRoute } from '../types';

interface NavbarProps {
  currentRoute: PageRoute;
  onNavigate: (route: PageRoute) => void;
  mode: DisciplineMode;
  onModeToggle: (newMode: DisciplineMode) => void;
  onCursorChange?: (state: 'default' | 'link' | 'drag-3d' | 'view' | 'copy') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  onNavigate,
  mode,
  onModeToggle,
  onCursorChange,
}) => {
  const isHomePage = currentRoute.name === 'home';
  const [scrolledPastHero, setScrolledPastHero] = useState(false);

  useEffect(() => {
    if (!isHomePage) {
      setScrolledPastHero(false);
      return;
    }
    const handleScroll = () => {
      setScrolledPastHero(window.scrollY > 150);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  const isAboutActive = currentRoute.name === 'about';
  const isContactActive = currentRoute.name === 'contact';
  const isWorkActive = currentRoute.name === 'work' || currentRoute.name === 'work-detail' || currentRoute.name === 'royce';

  // Phone menu (three-line button)
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => setMenuOpen(false), [currentRoute]);
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);
  const go = (route: PageRoute) => {
    setMenuOpen(false);
    onNavigate(route);
  };
  const menuLinks: { label: string; route: PageRoute; active: boolean }[] = [
    { label: 'Home', route: { name: 'home' }, active: isHomePage },
    { label: 'Projects', route: { name: 'work' }, active: isWorkActive },
    { label: 'About', route: { name: 'about' }, active: isAboutActive },
    { label: 'Contact', route: { name: 'contact' }, active: isContactActive },
  ];

  return (
    <header
      id="main-nav-header"
      className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between gap-4 px-5 py-4 sm:px-6 sm:py-5 md:px-12 md:py-6 backdrop-blur-md bg-[#FFFFFF]/85 border-b border-[#E5E3DD] transition-all duration-300"
    >
      {/* Brand / Logo */}
      <div className="flex items-center min-w-0 md:min-w-[200px] h-10">
        {(!isHomePage || scrolledPastHero) && (
          <div className="flex items-center gap-3.5">
            <button
              id="nav-logo-btn"
              onClick={() => {
                if (isHomePage) {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                  onNavigate({ name: 'home' });
                }
              }}
              onMouseEnter={() => onCursorChange?.('link')}
              onMouseLeave={() => onCursorChange?.('default')}
              className="group flex items-center gap-3 text-left"
            >
              {/* Architectural Spatial Monogram / Isometric Mark */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.18, duration: 0.35, ease: 'easeOut' }}
                className="relative shrink-0 w-9 h-9 rounded-sm border border-[#141413]/25 bg-[#F8F8F6] flex items-center justify-center transition-all duration-300 group-hover:border-[#9A773E] group-hover:bg-[#FFFFFF] group-hover:shadow-sm"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 text-[#141413] group-hover:text-[#9A773E] transition-colors duration-300"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2.5L20.5 7.5V16.5L12 21.5L3.5 16.5V7.5L12 2.5Z" />
                  <path d="M12 12V21.5" />
                  <path d="M12 12L20.5 7.5" />
                  <path d="M12 12L3.5 7.5" />
                </svg>
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#9A773E] ring-2 ring-[#FFFFFF]" />
              </motion.div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <motion.span
                    layoutId="mahi-patel-brand-title"
                    transition={{
                      type: 'spring',
                      stiffness: 95,
                      damping: 18,
                      mass: 0.9,
                    }}
                    className="font-display text-lg md:text-xl font-light tracking-[0.06em] text-[#141413] group-hover:text-[#9A773E] transition-colors origin-top-left inline-block whitespace-nowrap"
                  >
                    Mahi Patel
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.22, duration: 0.3 }}
                    className="hidden sm:block h-1 w-1 rounded-full bg-[#9A773E]/70"
                  />
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.22, duration: 0.3 }}
                    className="hidden sm:inline font-mono-code text-[9px] uppercase tracking-[0.18em] text-[#9A773E] font-medium"
                  >
                    Portfolio
                  </motion.span>
                </div>
                <motion.span
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.28, duration: 0.35 }}
                  className="block truncate font-mono-code text-[9px] sm:text-[10px] text-[#7A7770] tracking-[0.12em] uppercase whitespace-nowrap"
                >
                  Interior & Spatial Design Student
                </motion.span>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Student Academic Status Badge */}
      <div
        id="studio-status-badge"
        className="hidden lg:flex items-center gap-2 whitespace-nowrap px-3.5 py-1 rounded-full border border-[#E5E3DD] bg-[#F8F8F6] text-[11px] font-mono-code text-[#7A7770]"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[#9A773E] animate-pulse" />
        <span className="text-[#141413]">Interior & Spatial Design</span>
        <span className="text-[#9A773E]/70">·</span>
        <span>Ahmedabad · Academic Studios</span>
      </div>

      {/* Nav Links */}
      <nav className="hidden md:flex items-center gap-9 font-mono-code text-xs lowercase">
        <button
          id="nav-link-about"
          onClick={() => onNavigate({ name: 'about' })}
          onMouseEnter={() => onCursorChange?.('link')}
          onMouseLeave={() => onCursorChange?.('default')}
          className={`relative tracking-wider transition-colors py-1 ${
            isAboutActive ? 'text-[#141413]' : 'text-[#7A7770] hover:text-[#141413]'
          }`}
        >
          <span>about</span>
          {isAboutActive && (
            <span className="absolute -bottom-1 left-0 w-full h-[1.5px] bg-[#9A773E]" />
          )}
        </button>

        <button
          id="nav-link-contact"
          onClick={() => onNavigate({ name: 'contact' })}
          onMouseEnter={() => onCursorChange?.('link')}
          onMouseLeave={() => onCursorChange?.('default')}
          className={`relative tracking-wider transition-colors py-1 ${
            isContactActive ? 'text-[#141413]' : 'text-[#7A7770] hover:text-[#141413]'
          }`}
        >
          <span>contact</span>
          {isContactActive && (
            <span className="absolute -bottom-1 left-0 w-full h-[1.5px] bg-[#9A773E]" />
          )}
        </button>
      </nav>

      {/* Phone: three-line menu button */}
      <button
        type="button"
        onClick={() => setMenuOpen((o) => !o)}
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
        aria-controls="mobile-menu"
        className="md:hidden relative z-50 -mr-2 h-11 w-11 shrink-0 inline-flex items-center justify-center"
      >
        <span className="relative block h-3.5 w-6">
          <span
            className={`absolute left-0 h-[1.5px] w-6 bg-[#141413] transition-all duration-500 ${menuOpen ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-0'}`}
          />
          <span
            className={`absolute left-0 top-1/2 -translate-y-1/2 h-[1.5px] bg-[#141413] transition-all duration-500 ${menuOpen ? 'w-0 opacity-0' : 'w-4 opacity-100'}`}
          />
          <span
            className={`absolute left-0 h-[1.5px] w-6 bg-[#141413] transition-all duration-500 ${menuOpen ? 'top-1/2 -translate-y-1/2 -rotate-45' : 'bottom-0'}`}
          />
        </span>
      </button>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden fixed inset-x-0 top-[73px] sm:top-[81px] bottom-0 z-40 h-[calc(100dvh-73px)] sm:h-[calc(100dvh-81px)] bg-[#FFFFFF] flex flex-col px-6 pt-8 pb-10"
          >
            <nav aria-label="Mobile" className="flex-1">
              <ul className="divide-y divide-[#E5E3DD] border-y border-[#E5E3DD]">
                {menuLinks.map((l, i) => (
                  <motion.li
                    key={l.label}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.06 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <button
                      onClick={() => go(l.route)}
                      className="w-full flex items-baseline justify-between py-5 text-left"
                    >
                      <span className={`font-display font-light text-4xl ${l.active ? 'text-[#9A773E]' : 'text-[#141413]'}`}>{l.label}</span>
                      <span className="font-mono-code text-[11px] text-[#9A773E]">{String(i + 1).padStart(2, '0')}</span>
                    </button>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="space-y-2 text-sm text-[#6E6C65]"
            >
              <a href="mailto:mahipatel1329@gmail.com" className="block text-[#141413]">mahipatel1329@gmail.com</a>
              <div>Ahmedabad, Gujarat, India</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
