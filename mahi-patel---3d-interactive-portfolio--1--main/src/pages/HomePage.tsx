import React, { useState } from 'react';
import { motion } from 'motion/react';
import { DisciplineMode, PageRoute, CursorState } from '../types';
import { HeroScene } from '../scene/HeroScene';
import { RotateCcw } from 'lucide-react';
import { WorkPage } from './WorkPage';

interface HomePageProps {
  mode?: DisciplineMode;
  onModeToggle?: (newMode: DisciplineMode) => void;
  onNavigate: (route: PageRoute) => void;
  onCursorChange?: (state: CursorState, text?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  mode = 'interior',
  onNavigate,
  onCursorChange,
}) => {
  const [colorProgress, setColorProgress] = useState(0);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [spinTrigger, setSpinTrigger] = useState(0);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleResetColor = () => {
    setResetTrigger((prev) => prev + 1);
  };

  const handleTriggerSpin = () => {
    setSpinTrigger((prev) => prev + 1);
  };

  const pct = Math.round(colorProgress * 100);

  return (
    <div id="home-page" className="relative w-full bg-[#FFFFFF]">
      {/* ---------------------------------------------------- */}
      {/* 1. HERO 3D STAGE SECTION (hidden when viewing detail) */}
      {/* ---------------------------------------------------- */}
      {!isDetailOpen && (
        <section className="relative w-full h-[100vh] min-h-[700px] flex flex-col justify-between p-6 md:p-14 overflow-hidden">
          {/* 3D WebGL Canvas Layer (Click to rotate & animate material fill) */}
          <HeroScene
            mode={mode}
            onColorProgressChange={setColorProgress}
            resetTrigger={resetTrigger}
            spinTrigger={spinTrigger}
            onCursorChange={onCursorChange}
          />

          {/* Top Header Row: Interactive Material & Rotation Controls */}
          <div className="relative z-10 pt-16 flex items-start justify-end pointer-events-none">
            <div className="pointer-events-auto flex items-center gap-2.5 bg-[#FFFFFF]/90 backdrop-blur-md border border-[#E5E3DD] px-4 py-2 rounded-full text-xs font-mono-code text-[#141413] shadow-sm transition-all">
              <button
                onClick={handleTriggerSpin}
                onMouseEnter={() => onCursorChange?.('link')}
                onMouseLeave={() => onCursorChange?.('default')}
                className="flex items-center gap-2 hover:text-[#9A773E] transition-colors"
                title="Click to rotate 3D model and fill materials smoothly"
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    pct >= 95
                      ? 'bg-emerald-500'
                      : pct > 0
                      ? 'bg-[#9A773E] animate-pulse'
                      : 'bg-[#D8A46B] animate-ping'
                  }`}
                />
                <span className="text-[#141413] font-medium tracking-wide">
                  {pct === 0
                    ? '✦ CLICK TO ROTATE & MATERIALIZE'
                    : pct >= 95
                    ? '✦ 360° ACTIVE · DRAG TO INSPECT'
                    : `MATERIALIZING · ${pct}%`}
                </span>
              </button>

              {/* Quick reset to clay when color is filled */}
              {pct > 5 && (
                <button
                  onClick={handleResetColor}
                  onMouseEnter={() => onCursorChange?.('link')}
                  onMouseLeave={() => onCursorChange?.('default')}
                  className="flex items-center gap-1.5 px-2.5 py-0.5 border border-[#E5E3DD] rounded-full text-[11px] text-[#7A7770] hover:text-[#141413] hover:border-[#141413] transition-colors ml-1"
                  title="Reset back to Architectural Clay study"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clay</span>
                </button>
              )}
            </div>
          </div>

          {/* Left Column: Designer Name, Subtitle, Short Intro Statement & Minimal Navigation */}
          <div className="relative z-10 pointer-events-none max-w-xl my-auto">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#141413]" />
                <span className="font-mono-code text-[11px] uppercase tracking-[0.24em] text-[#7A7770]">
                  INTERIOR & SPATIAL DESIGN STUDENT
                </span>
              </div>

              <motion.h1
                layoutId="mahi-patel-brand-title"
                transition={{
                  type: 'spring',
                  stiffness: 95,
                  damping: 18,
                  mass: 0.9,
                }}
                className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-light tracking-tight text-[#141413] leading-[0.92] origin-top-left"
              >
                Mahi Patel
              </motion.h1>

              <p className="font-sans text-sm md:text-base text-[#575550] font-light leading-relaxed max-w-md pt-1">
                Design portfolio documenting academic studio projects, technical working drawings, 3D spatial modeling, and material explorations.
              </p>
            </div>
          </div>

          {/* Floating Visual Prompt before interaction */}
          {pct === 0 && (
            <div className="absolute right-8 md:right-24 bottom-24 z-10 pointer-events-none hidden sm:flex items-center gap-2 bg-[#141413]/85 backdrop-blur-md text-[#FAF9F5] px-4 py-2 rounded-full text-xs font-mono-code border border-[#3E3D3A] shadow-lg animate-pulse">
              <span className="text-[#D8A46B]">✦</span>
              <span>Click anywhere on 3D model to rotate & materialize</span>
            </div>
          )}

          {/* Bottom Bar: Minimal Scroll Prompt */}
          <div className="relative z-10 flex items-end justify-end pointer-events-none pb-2">
            {/* Minimal scroll prompt */}
            <div className="pointer-events-auto">
              <button
                onClick={() => {
                  const el = document.getElementById('content-section');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
                  }
                }}
                onMouseEnter={() => onCursorChange?.('link')}
                onMouseLeave={() => onCursorChange?.('default')}
                className="flex items-center gap-2 text-[#7A7770] hover:text-[#141413] transition-colors group"
              >
                <span className="font-mono-code text-[11px] tracking-widest uppercase">
                  SCROLL TO EXPLORE ↓
                </span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ---------------------------------------------------- */}
      {/* 2. CONTENT / SELECTED PROJECTS SHOWCASE SECTION       */}
      {/* ---------------------------------------------------- */}
      <section
        id="content-section"
        className={`relative z-20 ${isDetailOpen ? 'pt-4' : 'border-t border-[#E5E3DD]'} bg-[#FFFFFF] scroll-mt-20`}
      >
        <WorkPage
          onNavigate={onNavigate}
          onCursorChange={onCursorChange}
          onDetailChange={setIsDetailOpen}
        />
      </section>
    </div>
  );
};
