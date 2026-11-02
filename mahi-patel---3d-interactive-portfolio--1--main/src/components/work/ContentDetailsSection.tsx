import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CONTENT_PILLARS, CategoryContentDetail } from '../../data/contentDetails';
import { INTERIOR_PROJECTS } from '../../data/interiorProjects';
import { Project, PageRoute } from '../../types';
import { ArrowUpRight, Check, Compass, Layers, Sparkles, MapPin, Calendar, Ruler } from 'lucide-react';

interface ContentDetailsSectionProps {
  activePillarIndex: number;
  onSelectPillarIndex: (index: number) => void;
  onSelectProject: (project: Project) => void;
  onCursorChange?: (state: 'default' | 'link' | 'drag-3d' | 'view' | 'copy') => void;
}

export const ContentDetailsSection: React.FC<ContentDetailsSectionProps> = ({
  activePillarIndex,
  onSelectPillarIndex,
  onSelectProject,
  onCursorChange,
}) => {
  const [viewMode, setViewMode] = useState<'focused' | 'all'>('focused');
  const activePillar = CONTENT_PILLARS[activePillarIndex] || CONTENT_PILLARS[0];

  // Helper to find projects for a given pillar
  const getPillarProjects = (pillar: CategoryContentDetail): Project[] => {
    return INTERIOR_PROJECTS.filter((p) => p.category === pillar.categoryKey);
  };

  return (
    <section
      id="content-details-section"
      className="mt-16 md:mt-24 pt-12 border-t border-[#E5E3DD] transition-all duration-300"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-3 max-w-3xl">
          <div className="flex items-center gap-2.5 font-mono-code text-xs text-[#9A773E] uppercase tracking-widest">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C9A47E]" />
            <span>Spatial Taxonomy & Typologies</span>
          </div>
          <h2 className="font-display font-light text-3xl sm:text-5xl md:text-6xl text-[#141413] tracking-tight">
            Content Details & Spatial Philosophy
          </h2>
          <p className="text-sm md:text-base font-sans text-[#6E6C65] leading-relaxed max-w-2xl">
            A comprehensive inquiry into our four core architectural pillars — spanning private domestic residences, experiential retail environments, sensory hospitality retreats, and speculative academic research.
          </p>
        </div>

        {/* View mode toggle: Focused Pillar vs Complete Dossier */}
        <div className="flex items-center gap-2 border border-[#E5E3DD] rounded-full p-1 bg-[#FAF8F5]/80 self-start md:self-auto">
          <button
            onClick={() => setViewMode('focused')}
            onMouseEnter={() => onCursorChange?.('link')}
            onMouseLeave={() => onCursorChange?.('default')}
            className={`px-4 py-1.5 rounded-full text-xs font-mono-code uppercase tracking-wider transition-all ${
              viewMode === 'focused'
                ? 'bg-[#141413] text-[#FFFFFF] shadow-sm'
                : 'text-[#7A7770] hover:text-[#141413]'
            }`}
          >
            Active Pillar View
          </button>
          <button
            onClick={() => setViewMode('all')}
            onMouseEnter={() => onCursorChange?.('link')}
            onMouseLeave={() => onCursorChange?.('default')}
            className={`px-4 py-1.5 rounded-full text-xs font-mono-code uppercase tracking-wider transition-all ${
              viewMode === 'all'
                ? 'bg-[#141413] text-[#FFFFFF] shadow-sm'
                : 'text-[#7A7770] hover:text-[#141413]'
            }`}
          >
            All 4 Pillars Expanded
          </button>
        </div>
      </div>

      {/* 4 Pillar Quick Tabs Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 mb-10">
        {CONTENT_PILLARS.map((pillar, idx) => {
          const isSelected = activePillarIndex === idx;
          return (
            <button
              key={pillar.id}
              id={`details-tab-${pillar.id}`}
              onClick={() => {
                onSelectPillarIndex(idx);
                if (viewMode === 'all') {
                  const el = document.getElementById(`pillar-card-${pillar.id}`);
                  el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              onMouseEnter={() => onCursorChange?.('link')}
              onMouseLeave={() => onCursorChange?.('default')}
              className={`text-left p-4 rounded-sm border transition-all duration-200 flex flex-col justify-between gap-3 ${
                isSelected
                  ? 'border-[#141413] bg-[#FAF8F5] shadow-sm ring-1 ring-[#141413]'
                  : 'border-[#E5E3DD] bg-[#FFFFFF] hover:border-[#C9A47E]/60 hover:bg-[#FAF8F5]/50'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono-code">
                <span className={isSelected ? 'text-[#C9A47E] font-medium' : 'text-[#A09E96]'}>
                  {pillar.number}
                </span>
                <span className="text-[10px] text-[#A09E96] uppercase">
                  {pillar.categoryKey === 'thesis' ? 'Research' : 'Built Work'}
                </span>
              </div>
              <div>
                <h3 className="font-mono-code text-xs sm:text-sm font-semibold text-[#141413] tracking-wide">
                  {pillar.title}
                </h3>
                <p className="text-[11px] text-[#7A7770] line-clamp-1 mt-0.5">
                  {pillar.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Render Pillars based on viewMode */}
      {viewMode === 'focused' ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={activePillar.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <PillarDetailBlock
              pillar={activePillar}
              projects={getPillarProjects(activePillar)}
              onSelectProject={onSelectProject}
              onCursorChange={onCursorChange}
            />
          </motion.div>
        </AnimatePresence>
      ) : (
        <div className="space-y-16">
          {CONTENT_PILLARS.map((pillar) => (
            <div key={pillar.id} id={`pillar-card-${pillar.id}`} className="scroll-mt-28">
              <PillarDetailBlock
                pillar={pillar}
                projects={getPillarProjects(pillar)}
                onSelectProject={onSelectProject}
                onCursorChange={onCursorChange}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

// Subcomponent rendering a comprehensive pillar block
interface PillarDetailBlockProps {
  pillar: CategoryContentDetail;
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onCursorChange?: (state: 'default' | 'link' | 'drag-3d' | 'view' | 'copy') => void;
}

const PillarDetailBlock: React.FC<PillarDetailBlockProps> = ({
  pillar,
  projects,
  onSelectProject,
  onCursorChange,
}) => {
  return (
    <article
      className={`rounded-sm border p-6 sm:p-8 md:p-10 transition-all ${
        pillar.categoryKey === 'thesis'
          ? 'border-dashed border-[#C9A47E]/50 bg-[#FCFAF7]'
          : 'border-[#E5E3DD] bg-[#FFFFFF]'
      }`}
    >
      {/* Header Eyebrow & Number */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#E5E3DD]">
        <div className="flex items-center gap-3">
          <span className="font-mono-code text-sm font-semibold text-[#9A773E] px-2.5 py-1 rounded-sm bg-[#FAF8F5] border border-[#E5E3DD]">
            {pillar.number}
          </span>
          <h3 className="font-display font-light text-2xl sm:text-3xl md:text-4xl text-[#141413]">
            {pillar.title}
          </h3>
        </div>

        <div className="font-mono-code text-xs text-[#7A7770] uppercase tracking-wider">
          {pillar.subtitle}
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 mt-8">
        {/* Left Column: Manifesto & Spatial Methodology (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Lead Quote */}
          <blockquote className="font-serif italic text-lg sm:text-xl md:text-2xl text-[#141413] leading-relaxed border-l-2 border-[#C9A47E] pl-5">
            “{pillar.leadQuote}”
          </blockquote>

          {/* Philosophy Statement */}
          <div className="space-y-4 text-sm md:text-base font-sans text-[#4A4742] leading-relaxed">
            <p>{pillar.philosophy}</p>
          </div>

          {/* Spatial Strategy Principles */}
          <div className="space-y-4 pt-4">
            <h4 className="font-mono-code text-xs uppercase tracking-widest text-[#9A773E] flex items-center gap-2">
              <Layers className="h-3.5 w-3.5" />
              Spatial Choreography & Tectonic Principles
            </h4>
            <ul className="space-y-3">
              {pillar.spatialStrategy.map((strat, i) => (
                <li key={i} className="flex items-start gap-3 text-xs md:text-sm text-[#4A4742] leading-relaxed">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#C9A47E] mt-2 flex-shrink-0" />
                  <span>{strat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Material Focus Swatches */}
          <div className="space-y-3 pt-4 border-t border-[#E5E3DD]">
            <h4 className="font-mono-code text-xs uppercase tracking-widest text-[#7A7770]">
              Materiality & Tonal Anchors
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {pillar.materialFocus.map((mat) => (
                <div
                  key={mat.name}
                  className="p-3 rounded-sm border border-[#E5E3DD] bg-[#FAF8F5]/60 space-y-1.5"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full border border-black/20"
                      style={{ backgroundColor: mat.hex }}
                    />
                    <span className="font-mono-code text-xs font-medium text-[#141413] line-clamp-1">
                      {mat.name}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6E6C65] leading-normal line-clamp-2">
                    {mat.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Key Metrics & Hero Cover / Highlights (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Cover Visual */}
          <div className="relative aspect-[16/10] sm:aspect-[4/3] rounded-sm overflow-hidden border border-[#E5E3DD] shadow-sm group">
            <img
              src={pillar.coverImage}
              alt={pillar.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="font-mono-code text-[10px] uppercase tracking-widest text-[#C9A47E] block mb-1">
                Representative Visual
              </span>
              <p className="font-serif italic text-base sm:text-lg">
                {pillar.name} — Spatial Archive
              </p>
            </div>
          </div>

          {/* Typology Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            {pillar.metrics.map((metric) => (
              <div
                key={metric.label}
                className="p-3.5 rounded-sm border border-[#E5E3DD] bg-[#FAF8F5]/80"
              >
                <div className="text-[10px] font-mono-code uppercase tracking-widest text-[#7A7770]">
                  {metric.label}
                </div>
                <div className="mt-1 font-mono-code text-xs sm:text-sm font-semibold text-[#141413] tracking-wide">
                  {metric.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Curated Built Projects Carousel / Grid for this Pillar */}
      <div className="mt-10 pt-8 border-t border-[#E5E3DD]">
        <div className="flex items-center justify-between mb-6">
          <h4 className="font-mono-code text-xs uppercase tracking-widest text-[#141413] flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-[#C9A47E]" />
            <span>Curated {pillar.name} Works in Archive ({projects.length})</span>
          </h4>
          <span className="font-mono-code text-[11px] text-[#A09E96]">
            Click to view case study
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.slice(0, 3).map((proj) => (
            <div
              key={proj.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelectProject(proj)}
              onMouseEnter={() => onCursorChange?.('view')}
              onMouseLeave={() => onCursorChange?.('default')}
              className="group relative rounded-sm border border-[#E5E3DD] hover:border-[#C9A47E] overflow-hidden bg-[#FAF8F5]/50 hover:bg-[#FFFFFF] transition-all cursor-pointer p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A47E]"
            >
              <div className="relative aspect-[16/10] rounded-sm overflow-hidden mb-3 bg-[#E5E3DD]">
                <img
                  src={proj.coverImage}
                  alt={proj.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2.5 right-2.5 h-7 w-7 rounded-full bg-[#141413]/70 backdrop-blur-sm text-white flex items-center justify-center group-hover:bg-[#C9A47E] group-hover:text-[#141413] transition-colors">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono-code text-[#7A7770]">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-2.5 w-2.5" />
                    {proj.location}
                  </span>
                  <span>{proj.year}</span>
                </div>
                <h5 className="font-serif text-base text-[#141413] group-hover:text-[#9A773E] transition-colors leading-snug">
                  {proj.title}
                </h5>
                <p className="text-xs text-[#6E6C65] line-clamp-2 leading-relaxed">
                  {proj.summary}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
};
