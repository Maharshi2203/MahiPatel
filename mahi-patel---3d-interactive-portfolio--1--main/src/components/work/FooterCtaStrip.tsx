import React, { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { PageRoute } from '../../types';

interface FooterCtaStripProps {
  onNavigate: (route: PageRoute) => void;
  onCursorChange?: (state: 'default' | 'link' | 'drag-3d' | 'view' | 'copy') => void;
}

export const FooterCtaStrip: React.FC<FooterCtaStripProps> = ({
  onNavigate,
  onCursorChange,
}) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const prefersReducedMotion = useReducedMotion();

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (prefersReducedMotion || !btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    // Magnetic pull towards pointer (max 12px)
    const pullX = (e.clientX - centerX) * 0.28;
    const pullY = (e.clientY - centerY) * 0.28;
    setPosition({ x: pullX, y: pullY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
    onCursorChange?.('default');
  };

  return (
    <section
      id="work-footer-cta-strip"
      className="mt-28 pt-20 pb-16 border-t border-[#E5E3DD] bg-gradient-to-b from-transparent to-[#FAF8F5]/80 -mx-6 md:-mx-12 px-6 md:px-12"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-3 max-w-xl">
          <span className="font-mono-code text-xs uppercase tracking-widest text-[#9A773E] flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#9A773E]" />
            Direct Commission & Collaboration
          </span>
          <h3 className="font-display font-light text-3xl sm:text-4xl md:text-5xl text-[#141413] tracking-tight">
            Have a space in mind?
          </h3>
          <p className="text-sm font-sans text-[#6E6C65] leading-relaxed">
            From residential retreats to flagship retail and hospitality environments — we collaborate worldwide on spatial architecture and bespoke interior commissions.
          </p>
        </div>

        {/* Magnetic Button */}
        <div>
          <motion.button
            ref={btnRef}
            onClick={() => onNavigate({ name: 'contact' })}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => onCursorChange?.('link')}
            onMouseLeave={handleMouseLeave}
            animate={{ x: position.x, y: position.y }}
            transition={{ type: 'spring', stiffness: 350, damping: 20, mass: 0.5 }}
            className="group relative inline-flex items-center gap-4 px-8 py-4 rounded-full bg-[#141413] text-[#FFFFFF] font-mono-code text-xs uppercase tracking-widest hover:bg-[#C9A47E] hover:text-[#141413] transition-colors duration-300 shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A47E]"
          >
            <span>Start a project</span>
            <div className="h-6 w-6 rounded-full bg-[#FFFFFF]/20 group-hover:bg-[#141413]/10 flex items-center justify-center transition-colors">
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </motion.button>
        </div>
      </div>
    </section>
  );
};
