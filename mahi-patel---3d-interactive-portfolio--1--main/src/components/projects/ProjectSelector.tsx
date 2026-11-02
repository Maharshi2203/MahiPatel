import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { CursorState } from '../../types';
import { FEATURED_PROJECTS, wrapProjectIndex } from '../../data/featuredProjects';
import { Project3DViewer, Project3DViewerHandle } from './Project3DViewer';

interface ProjectSelectorProps {
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  onOpen: (index: number, snapshot: HTMLCanvasElement | null, rect: DOMRect | null) => void;
  /** True while a page-level transition (pixelation) is running. */
  locked?: boolean;
  onCursorChange?: (state: CursorState, text?: string) => void;
}

const EASE = [0.76, 0, 0.24, 1] as const;

// Direction-aware masked line reveal (1 = next: out upward, in from below)
const lineVariants = {
  enter: (dir: number) => ({ y: dir > 0 ? '105%' : '-105%' }),
  center: (_: number) => ({ y: '0%' }),
  exit: (dir: number) => ({ y: dir > 0 ? '-105%' : '105%' }),
};

export const ProjectSelector: React.FC<ProjectSelectorProps> = ({
  activeIndex,
  onActiveIndexChange,
  onOpen,
  locked = false,
  onCursorChange,
}) => {
  const reduced = !!useReducedMotion();
  const viewerRef = useRef<Project3DViewerHandle>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [initialProject] = useState(() => FEATURED_PROJECTS[activeIndex]);

  const project = FEATURED_PROJECTS[activeIndex];
  const total = FEATURED_PROJECTS.length;

  const go = useCallback(
    async (dir: 1 | -1) => {
      if (busy.current || locked) return;
      busy.current = true;
      setIsTransitioning(true);
      const next = wrapProjectIndex(activeIndex + dir);
      setDirection(dir);
      // Text starts leaving immediately; the model swaps at the midpoint of the spin
      onActiveIndexChange(next);
      try {
        await viewerRef.current?.spinTo(FEATURED_PROJECTS[next], dir, reduced);
      } finally {
        busy.current = false;
        setIsTransitioning(false);
      }
    },
    [activeIndex, locked, onActiveIndexChange, reduced]
  );

  const open = useCallback(() => {
    if (busy.current || locked) return;
    viewerRef.current?.setHover(false);
    onCursorChange?.('default');
    onOpen(activeIndex, viewerRef.current?.snapshot() ?? null, stageRef.current?.getBoundingClientRect() ?? null);
  }, [activeIndex, locked, onCursorChange, onOpen]);

  // Keyboard: ← / → anywhere on the page
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go]);

  // Tap to open, horizontal swipe to navigate (touch/pen)
  const down = useRef<{ x: number; y: number; type: string } | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    down.current = { x: e.clientX, y: e.clientY, type: e.pointerType };
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const d = down.current;
    down.current = null;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (d.type !== 'mouse' && Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      go(dx < 0 ? 1 : -1);
    } else if (Math.hypot(dx, dy) < 10) {
      open();
    }
  };

  const hoverOn = () => {
    viewerRef.current?.setHover(true);
    onCursorChange?.('view', 'open project');
  };
  const hoverOff = () => {
    viewerRef.current?.setHover(false);
    onCursorChange?.('default');
  };

  const navButton = (dir: 1 | -1, className = '') => (
    <button
      type="button"
      onClick={() => go(dir)}
      disabled={isTransitioning || locked}
      aria-label={dir > 0 ? 'Next project' : 'Previous project'}
      onMouseEnter={() => onCursorChange?.('link', dir > 0 ? 'next' : 'previous')}
      onMouseLeave={() => onCursorChange?.('default')}
      className={`group flex flex-col items-center gap-2 disabled:opacity-40 disabled:cursor-default ${className}`}
    >
      <span className="h-12 w-12 md:h-14 md:w-14 rounded-full border border-[#E5E3DD] bg-[#FFFFFF]/90 backdrop-blur-sm flex items-center justify-center text-[#141413] transition-all duration-300 group-hover:border-[#141413] group-hover:bg-[#141413] group-hover:text-[#FFFFFF] group-active:scale-95">
        {dir > 0 ? (
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        ) : (
          <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
        )}
      </span>
      <span className="font-mono-code text-[10px] tracking-[0.25em] uppercase text-[#7A7770] group-hover:text-[#141413] transition-colors">
        {dir > 0 ? 'Next' : 'Prev'}
      </span>
    </button>
  );

  const textTransition = { duration: reduced ? 0.2 : 0.45, ease: EASE };

  return (
    <section
      id="project-selector"
      aria-roledescription="carousel"
      aria-label="Selected projects"
      className="relative min-h-[100svh] flex flex-col pt-44 sm:pt-32 md:pt-28 pb-8 md:pb-10"
    >
      {/* Eyebrow row */}
      <div className="flex items-center justify-between font-mono-code text-[11px] tracking-widest uppercase text-[#7A7770]">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#9A773E]" />
          <span>Content — Selected Projects</span>
        </div>
        <span className="hidden sm:inline">Click the project to open</span>
      </div>

      {/* Project number */}
      <div className="mt-6 md:mt-4 flex justify-center" aria-live="polite" aria-atomic="true">
        <div className="relative flex items-start">
          <span className="sr-only">
            Project {project.number} of {String(total).padStart(2, '0')}: {project.name}, {project.type}
          </span>
          <div className="overflow-hidden" aria-hidden="true">
            <AnimatePresence mode="wait" custom={direction} initial={false}>
              <motion.span
                key={project.number}
                custom={direction}
                variants={lineVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={textTransition}
                className="block font-display font-light text-[88px] sm:text-[112px] md:text-[132px] leading-[0.9] tracking-tight text-[#141413] tabular-nums"
              >
                {project.number}
              </motion.span>
            </AnimatePresence>
          </div>
          <span className="ml-2 mt-3 font-mono-code text-xs text-[#A09E96]" aria-hidden="true">
            / {String(total).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Stage with flanking arrows */}
      <div className="relative flex-1 flex items-center min-h-[300px] sm:min-h-[380px]">
        {navButton(-1, 'hidden md:flex absolute left-0 lg:left-4 z-10')}

        <div
          ref={stageRef}
          role="button"
          tabIndex={0}
          aria-label={`Open ${project.name} project`}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => (down.current = null)}
          onMouseEnter={hoverOn}
          onMouseLeave={hoverOff}
          onFocus={() => viewerRef.current?.setHover(true)}
          onBlur={() => viewerRef.current?.setHover(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              open();
            }
          }}
          className="relative mx-auto w-full md:w-[78%] lg:w-[72%] h-[42svh] sm:h-[46svh] md:h-[50vh] min-h-[280px] max-h-[620px] cursor-pointer touch-pan-y outline-none rounded-2xl focus-visible:ring-1 focus-visible:ring-[#9A773E]/60"
        >
          <Project3DViewer ref={viewerRef} initialProject={initialProject} className="absolute inset-0" />
        </div>

        {navButton(1, 'hidden md:flex absolute right-0 lg:right-4 z-10')}
      </div>

      {/* Name over rule, type below */}
      <div className="flex flex-col items-center text-center">
        <div className="overflow-hidden pb-1">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.h2
              key={project.slug}
              custom={direction}
              variants={lineVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ ...textTransition, delay: reduced ? 0 : 0.04 }}
              className="font-display font-light text-3xl sm:text-4xl md:text-5xl text-[#141413] tracking-tight leading-tight px-2"
            >
              {project.name}
            </motion.h2>
          </AnimatePresence>
        </div>

        <motion.div
          key={`rule-${project.slug}`}
          initial={{ scaleX: reduced ? 1 : 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, ease: EASE, delay: reduced ? 0 : 0.35 }}
          className="mt-3 h-px w-40 sm:w-56 bg-[#141413] origin-center"
        />

        <div className="mt-3 overflow-hidden">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.p
              key={project.type}
              custom={direction}
              variants={lineVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ ...textTransition, delay: reduced ? 0 : 0.08 }}
              className="font-mono-code text-[11px] sm:text-xs tracking-[0.22em] uppercase text-[#9A773E]"
            >
              {project.type}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom row: mobile arrows + progress */}
      <div className="mt-8 flex items-center justify-between md:justify-center gap-6">
        {navButton(-1, 'md:hidden')}
        <div className="flex items-center gap-2" aria-hidden="true">
          {FEATURED_PROJECTS.map((p, i) => (
            <span
              key={p.slug}
              className={`h-px transition-all duration-500 ${
                i === activeIndex ? 'w-10 bg-[#141413]' : 'w-5 bg-[#D5D2CB]'
              }`}
            />
          ))}
        </div>
        {navButton(1, 'md:hidden')}
      </div>
    </section>
  );
};

