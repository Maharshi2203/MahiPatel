import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { CursorState } from '../../types';

export interface Slide {
  src: string;
  caption: string;
}

interface ProjectImageSliderProps {
  slides: Slide[] | null; // null while generating
  projectName: string;
  onCursorChange?: (state: CursorState, text?: string) => void;
}

const EASE = [0.76, 0, 0.24, 1] as const;
const pad = (n: number) => String(n).padStart(2, '0');

const variants = {
  enter: (dir: number) => ({ clipPath: dir > 0 ? 'inset(0% 0% 0% 100%)' : 'inset(0% 100% 0% 0%)', scale: 1.06 }),
  center: { clipPath: 'inset(0% 0% 0% 0%)', scale: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? '-12%' : '12%', opacity: 0.4 }),
};

export const ProjectImageSlider: React.FC<ProjectImageSliderProps> = ({ slides, projectName, onCursorChange }) => {
  const reduced = !!useReducedMotion();
  const [[index, dir], setState] = useState<[number, number]>([0, 1]);
  const animating = useRef(false);
  const count = slides?.length ?? 0;

  const goTo = useCallback(
    (next: number, d?: number) => {
      if (!count || animating.current) return;
      const target = ((next % count) + count) % count;
      if (target === index) return;
      animating.current = true;
      setState([target, d ?? (target > index ? 1 : -1)]);
      window.setTimeout(() => (animating.current = false), reduced ? 200 : 650);
    },
    [count, index, reduced]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goTo(index + 1, 1);
      else if (e.key === 'ArrowLeft') goTo(index - 1, -1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goTo, index]);

  // Swipe (touch/pen)
  const start = useRef<{ x: number; y: number } | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') start.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const s = start.current;
    start.current = null;
    if (!s) return;
    const dx = e.clientX - s.x;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(e.clientY - s.y) * 1.2) {
      goTo(index + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
    }
  };

  const slide = slides?.[index];

  const arrow = (d: 1 | -1) => (
    <button
      type="button"
      onClick={() => goTo(index + d, d)}
      disabled={count < 2}
      aria-label={d > 0 ? 'Next image' : 'Previous image'}
      onMouseEnter={() => onCursorChange?.('link')}
      onMouseLeave={() => onCursorChange?.('default')}
      className="group h-11 w-11 md:h-12 md:w-12 rounded-full border border-[#E5E3DD] bg-[#FFFFFF] flex items-center justify-center text-[#141413] transition-all duration-300 hover:bg-[#141413] hover:border-[#141413] hover:text-[#FFFFFF] active:scale-95 disabled:opacity-40"
    >
      {d > 0 ? (
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      ) : (
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
      )}
    </button>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_180px] gap-5 lg:gap-8" aria-roledescription="carousel" aria-label={`${projectName} images`}>
      <div>
        <div
          className="relative w-full aspect-[4/3] sm:aspect-[16/10] overflow-hidden rounded-xl border border-[#E5E3DD] bg-[#F8F8F6] touch-pan-y select-none"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => (start.current = null)}
        >
          {!slides && (
            <div className="absolute inset-0 flex items-center justify-center font-mono-code text-[11px] tracking-widest uppercase text-[#A09E96] animate-pulse">
              Rendering views…
            </div>
          )}
          <AnimatePresence initial={false} custom={dir}>
            {slide && (
              <motion.img
                key={slide.src}
                src={slide.src}
                alt={`${projectName} — ${slide.caption}`}
                custom={dir}
                variants={reduced ? { enter: { opacity: 0 }, center: { opacity: 1 }, exit: { opacity: 0 } } : variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: reduced ? 0.2 : 0.7, ease: EASE }}
                draggable={false}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
          </AnimatePresence>
        </div>

        <div className="mt-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={slide?.caption ?? 'loading'}
                  initial={{ y: '100%' }}
                  animate={{ y: '0%' }}
                  exit={{ y: '-100%' }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="font-display text-lg md:text-xl font-light text-[#141413] truncate"
                >
                  {slide?.caption ?? '—'}
                </motion.p>
              </AnimatePresence>
            </div>
            <p className="font-mono-code text-[11px] text-[#7A7770] tracking-widest" aria-live="polite">
              {count ? `${pad(index + 1)} / ${pad(count)}` : '— / —'}
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {arrow(-1)}
            {arrow(1)}
          </div>
        </div>
      </div>

      {/* Numbered slide index */}
      <ol className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible -mx-1 px-1 pb-1 lg:pb-0 border-t lg:border-t-0 lg:border-l border-[#E5E3DD] pt-3 lg:pt-0 lg:pl-5">
        {(slides ?? []).map((s, i) => (
          <li key={s.src} className="shrink-0">
            <button
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show image ${i + 1}: ${s.caption}`}
              aria-current={i === index}
              onMouseEnter={() => onCursorChange?.('link')}
              onMouseLeave={() => onCursorChange?.('default')}
              className={`group w-full flex items-center gap-3 py-2 px-2 lg:px-0 text-left font-mono-code text-[11px] tracking-wider uppercase transition-colors ${
                i === index ? 'text-[#141413]' : 'text-[#A09E96] hover:text-[#141413]'
              }`}
            >
              <span className={`h-px transition-all duration-500 ${i === index ? 'w-6 bg-[#9A773E]' : 'w-3 bg-[#D5D2CB] group-hover:w-5'}`} />
              <span>{pad(i + 1)}</span>
              <span className="hidden lg:inline truncate normal-case tracking-normal font-sans text-xs">{s.caption}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
};
