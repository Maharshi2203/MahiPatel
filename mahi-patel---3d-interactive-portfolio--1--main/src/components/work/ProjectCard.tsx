import React, { useRef, useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Project } from '../../types';
import { ArrowUpRight, Compass } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
  onCursorChange?: (state: 'default' | 'link' | 'drag-3d' | 'view' | 'copy') => void;
  index: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onSelect,
  onCursorChange,
  index,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const rafId = useRef<number | null>(null);

  // Throttled 3D Parallax Tilt calculation via requestAnimationFrame
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -3.8; // max ~4deg
    const rotateY = ((x - centerX) / centerX) * 3.8;

    if (rafId.current !== null) {
      cancelAnimationFrame(rafId.current);
    }

    rafId.current = requestAnimationFrame(() => {
      setTilt({ rotateX, rotateY });
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    onCursorChange?.('view');
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onCursorChange?.('default');
    if (rafId.current !== null) {
      cancelAnimationFrame(rafId.current);
    }
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  useEffect(() => {
    return () => {
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  const isWide = project.gridSpan === 'wide';

  // Category display label
  const categoryLabel =
    project.category === 'thesis'
      ? 'Thesis Research'
      : project.category.charAt(0).toUpperCase() + project.category.slice(1);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{
        layout: {
          type: 'spring',
          stiffness: 350,
          damping: 30,
        },
        opacity: { duration: 0.25, ease: 'easeOut' },
        scale: { duration: 0.25, ease: 'easeOut' },
      }}
      className={`relative group ${
        isWide
          ? 'col-span-1 md:col-span-2'
          : 'col-span-1'
      }`}
    >
      <div
        ref={cardRef}
        role="button"
        tabIndex={0}
        aria-label={`View project: ${project.title}, ${categoryLabel}, ${project.location}`}
        onClick={() => onSelect(project)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect(project);
          }
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: !prefersReducedMotion && isHovered
            ? `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`
            : 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
          transformStyle: 'preserve-3d',
          transition: isHovered
            ? 'transform 0.12s cubic-bezier(0.25, 1, 0.5, 1)'
            : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className={`relative w-full rounded-sm overflow-hidden cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A47E] focus-visible:ring-offset-2 transition-shadow duration-300 ${
          project.isThesis
            ? 'border border-dashed border-[#C9A47E]/40 hover:border-[#C9A47E]'
            : 'border border-[#E5E3DD] hover:border-[#C9A47E]/60'
        } ${isHovered ? 'shadow-xl shadow-black/5' : 'shadow-sm'}`}
      >
        {/* Full-bleed Cover Image Container */}
        <div
          className={`relative w-full overflow-hidden bg-[#F5F3EF] ${
            isWide
              ? 'aspect-[16/10] sm:aspect-[16/9] md:aspect-[21/11]'
              : 'aspect-[4/5] sm:aspect-[3/4]'
          }`}
        >
          {/* Subtle slow image scale on hover: 1.0 -> 1.04 */}
          <img
            src={project.coverImage}
            alt={project.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover will-change-transform transition-transform duration-700 ease-out"
            style={{
              transform: isHovered && !prefersReducedMotion ? 'scale(1.04)' : 'scale(1.0)',
            }}
          />

          {/* Editorial Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#141413]/90 via-[#141413]/25 to-transparent transition-opacity duration-300" />

          {/* Top Metadata Badges */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
            {/* Category / Research Eyebrow */}
            <div className="flex items-center gap-2">
              <span
                className={`px-2.5 py-1 text-[10px] font-mono-code uppercase tracking-wider rounded-sm backdrop-blur-md ${
                  project.isThesis
                    ? 'bg-[#141413]/85 text-[#C9A47E] border border-[#C9A47E]/50 font-medium'
                    : 'bg-[#FFFFFF]/85 text-[#141413] border border-[#E5E3DD]/40'
                }`}
              >
                {project.isThesis ? 'Research Thesis' : categoryLabel}
              </span>

              {project.size && (
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono-code text-[#F5F3EF]/90 bg-[#141413]/60 backdrop-blur-sm rounded-sm">
                  {project.size}
                </span>
              )}
            </div>

            {/* Micro Interaction Arrow Pill */}
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 ${
                isHovered
                  ? 'bg-[#C9A47E] text-[#141413] scale-105'
                  : 'bg-[#141413]/50 text-[#F5F3EF] border border-[#FFFFFF]/15'
              }`}
            >
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>

          {/* Bottom Card Content Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 z-10 flex flex-col justify-end pointer-events-none">
            {/* Thesis Research Eyebrow if thesis */}
            {project.isThesis && (
              <div className="flex items-center gap-1.5 text-[10px] font-mono-code uppercase tracking-widest text-[#C9A47E] mb-1">
                <Compass className="h-3 w-3" />
                <span>Academic & Speculative Inquiry</span>
              </div>
            )}

            {/* Project Title in Serif Display */}
            <h3 className="font-display font-light text-2xl sm:text-3xl md:text-3xl text-[#FFFFFF] tracking-tight leading-tight drop-shadow-sm group-hover:text-[#F5F3EF] transition-colors">
              {project.title}
            </h3>

            {/* One-sentence summary preview on wide cards */}
            {isWide && (
              <p className="mt-2 text-xs md:text-sm font-sans text-[#F5F3EF]/85 max-w-2xl line-clamp-2 leading-relaxed">
                {project.summary}
              </p>
            )}

            {/* Bottom Metas: Location + Year + Material Swatches */}
            <div className="mt-3 pt-3 border-t border-[#FFFFFF]/15 flex items-center justify-between gap-4 font-mono-code text-[11px] text-[#F5F3EF]/80">
              <div className="flex items-center gap-2 uppercase tracking-wider">
                <span>{project.location}</span>
                <span className="text-[#C9A47E]">·</span>
                <span>{project.year}</span>
              </div>

              {/* Material Swatch Indicator Palette */}
              <div className="hidden sm:flex items-center gap-1" title="Primary Materiality">
                {project.materials.slice(0, 3).map((mat) => (
                  <span
                    key={mat.name}
                    className="h-2 w-2 rounded-full border border-[#FFFFFF]/30"
                    style={{ backgroundColor: mat.hex }}
                    title={mat.name}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
};
