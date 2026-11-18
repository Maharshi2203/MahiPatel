import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Maximize2,
  X,
  Layers,
  Sparkles,
  Compass,
  MapPin,
  Tag,
  Building2,
  Clock,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { CursorState, PageRoute } from '../types';
import { FEATURED_PROJECTS, wrapProjectIndex, projectIndexBySlug } from '../data/featuredProjects';

interface UrbenHatchProjectPageProps {
  onBack?: () => void;
  onNavigate?: (route: PageRoute) => void;
  onOpenProject?: (index: number) => void;
  onCursorChange?: (state: CursorState, text?: string) => void;
}

const EASE = [0.76, 0, 0.24, 1] as const;


// The 5 core spatial design principles of the adaptive reuse intervention
const DESIGN_PRINCIPLES = [
  {
    number: '01',
    title: 'Adaptive Heritage Reuse',
    subtitle: 'Preserving historical memory while activating youth hospitality',
    desc: 'Respecting the colonial brick fabric and classical colonnades of R.C. High School of Commerce while breathing vibrant contemporary civic and social life into disused academic halls.',
  },
  {
    number: '02',
    title: 'Volumetric Stratification',
    subtitle: 'Vertical mezzanine insertions in high-ceilinged spaces',
    desc: 'Transforming 4.8m high heritage classroom volumes into dual-level mezzanine suites with floating cantilever stairs, separating active ground living from tranquil elevated sleeping decks.',
  },
  {
    number: '03',
    title: 'Arch Typology Synthesis',
    subtitle: 'Reinterpreting historic horseshoe, segmental & centred arches',
    desc: 'Analyzing the site’s rhythmic colonial archways and translating their formal geometry into modern structural openings, portal transitions, and framed sightlines across the central atrium.',
  },
  {
    number: '04',
    title: 'Civic-to-Private Gradient',
    subtitle: 'Porous public ground plane rising to secure sleeping pods',
    desc: 'A seamless transition from public-facing street cafes and communal co-working atriums on the ground floor to acoustically isolated dormitories and private suites on the upper floor.',
  },
  {
    number: '05',
    title: 'Material Counterpoint',
    subtitle: 'Heritage brick masonry meets bold crimson structural steel',
    desc: 'A deliberate, poetic dialogue between the tactile patina of exposed 19th-century brickwork and the energetic industrial precision of crimson coated steel stairs and bridge links.',
  },
];

// Architectural presentation sheets and technical documentation in official project sequence (01 to 07)
const TECHNICAL_DRAWINGS = [
  {
    id: 'sheet-01-concept',
    number: '01',
    category: 'plans',
    title: 'Sheet 01 · URBEN HATCH — Hospitality Design & Adaptive Reuse Concept',
    scale: 'Concept & Macro Analysis',
    src: '/projects/urben-hatch/sheet-01-concept.jpg',
    caption:
      'Introductory concept sheet for Urben Hatch: historic R.C. High School of Commerce context in Old City Ahmedabad, hostel hotel typology, adaptive reuse design objectives, light analysis, major axial corridors, layout zoning, and functional connectivity between public, service, and guest accommodations.',
    highlights: ['Old City Ahmedabad Context', 'Hostel Hotel Typology', 'Light & Solar Analysis', 'Bubble Connectivity Matrix'],
  },
  {
    id: 'sheet-02-ground-floor-plan',
    number: '02',
    category: 'plans',
    title: 'Sheet 02 · Ground Floor Plan (1:250) — Public Hospitality Core',
    scale: '1:250',
    src: '/projects/urben-hatch/sheet-02-ground-floor-plan.jpg',
    caption:
      'Detailed 1:250 Ground Floor Plan with compass orientation, section cutlines AA’, BB’, CC’ and 9-zone functional legend: 1. Sitting Area, 2. Game Room, 3. Co-Working Area, 4. Reception + Lounge, 5. Conference Room, 6. Housekeeping, 7. Kitchen, 8. Staff Room, 9. Cafe.',
    highlights: ['1:250 Scale Plan', '9-Zone Program Schedule', 'Section Cutlines AA’, BB’, CC’', 'Courtyard & Entry Axis'],
  },
  {
    id: 'sheet-03-first-floor-plan',
    number: '03',
    category: 'plans',
    title: 'Sheet 03 · First Floor Plan (1:250) — Accommodations & Dormitories',
    scale: '1:250',
    src: '/projects/urben-hatch/sheet-03-first-floor-plan.jpg',
    caption:
      'Detailed 1:250 accommodations plan mapping room typologies along arcaded corridors: 1. Single Room, 2. Double Room, 3. 4-Sharing Dormitory, and 4. 6-Sharing Dormitory.',
    highlights: ['1:250 Accommodations Plan', 'Single & Double Suites', '4-Share & 6-Share Dorms', 'Arcaded Circulation'],
  },
  {
    id: 'sheet-04-sections',
    number: '04',
    category: 'plans',
    title: 'Sheet 04 · Architectural Sections (1:250) — AA’, BB’ & CC’',
    scale: '1:250',
    src: '/projects/urben-hatch/sheet-04-sections.jpg',
    caption:
      'Three measured architectural sections at 1:250: Section AA’ cuts through the central double-height volume and timber roof trusses; Section BB’ through the clock tower minaret and arcade wing; Section CC’ through the open courtyard and circulation staircase.',
    highlights: ['Section AA’ Longitudinal', 'Section BB’ Minaret Tower', 'Section CC’ Courtyard Axis', 'Scale 1:250'],
  },
  {
    id: 'sheet-05-reception',
    number: '05',
    category: 'suites',
    title: 'Sheet 05 · Reception & Central Atrium — Multi-Level Plans & 3D Perspectives',
    scale: 'Multi-Level Plans & 3D',
    src: '/projects/urben-hatch/sheet-05-reception.jpg',
    caption:
      'Three-level spatial plans at 2300 mm, 4700 mm, and 6200 mm, paired with four interior 3D renders capturing the sculptural crimson steel staircase, suspended pedestrian bridges, and the double-height reception atrium.',
    highlights: ['Plans at 2300, 4700, 6200 mm', 'Crimson Steel Staircase', 'Double-Height Void', 'Heritage Arcades'],
  },
  {
    id: 'sheet-06-double-room',
    number: '06',
    category: 'suites',
    title: 'Sheet 06 · Double Room Suite (1:25) — Plan, Material Palette & 3D Views',
    scale: '1:25 & 3D Renders',
    src: '/projects/urben-hatch/sheet-06-double-room.jpg',
    caption:
      '1:25 measured plan, material specifications (black metal with warm accents, dark-stained wood, inlay terrazzo flooring, textured textiles), and two 3D perspective renders showing the cantilever orange stairs, lower lounge, and upper mezzanine sleeping loft.',
    highlights: ['1:25 Layout Plan', 'Material Sample Palette', 'Orange Cantilever Stair', 'Mezzanine Loft Bed'],
  },
  {
    id: 'sheet-07-single-room',
    number: '07',
    category: 'suites',
    title: 'Sheet 07 · Single Room Suite (1:25) — Plan, Material Palette & 3D Views',
    scale: '1:25 & 3D Renders',
    src: '/projects/urben-hatch/sheet-07-single-room.jpg',
    caption:
      '1:25 measured layout plan, material schedule (accent panel, striped wallpaper, linen, brass arc floor lamp), and two 3D perspective views featuring the custom crimson plinth bed and "Hey Love" illuminated artwork.',
    highlights: ['1:25 Layout Plan', 'Material Sample Moodboard', 'Crimson Bed Plinth', 'Striped Graphic Accent'],
  },
];


export const UrbenHatchProjectPage: React.FC<UrbenHatchProjectPageProps> = ({
  onBack,
  onNavigate,
  onOpenProject,
  onCursorChange,
}) => {
  const reduced = !!useReducedMotion();
  const [activeTab, setActiveTab] = useState<'all' | 'plans' | 'suites'>('all');
  const [lightboxImage, setLightboxImage] = useState<{ src: string; title: string; subtitle?: string } | null>(null);

  // Close lightbox on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxImage(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleReturnToProjects = () => {
    if (onBack) {
      onBack();
    } else if (onNavigate) {
      onNavigate({ name: 'work' });
    }
  };

  const currentProjectIdx = projectIndexBySlug('urben-hatch');
  const prevIdx = wrapProjectIndex(currentProjectIdx - 1);
  const nextIdx = wrapProjectIndex(currentProjectIdx + 1);
  const prevProject = FEATURED_PROJECTS[prevIdx];
  const nextProject = FEATURED_PROJECTS[nextIdx];

  const handleGoPrev = () => {
    if (onOpenProject) {
      onOpenProject(prevIdx);
    } else if (onNavigate) {
      onNavigate({ name: 'work' });
    }
  };

  const handleGoNext = () => {
    if (onOpenProject) {
      onOpenProject(nextIdx);
    } else if (onNavigate) {
      onNavigate({ name: 'work' });
    }
  };

  const linkCursor = {
    onMouseEnter: () => onCursorChange?.('link'),
    onMouseLeave: () => onCursorChange?.('default'),
  };

  const viewCursor = {
    onMouseEnter: () => onCursorChange?.('view'),
    onMouseLeave: () => onCursorChange?.('default'),
  };

  // Filtered technical presentation sheets
  const filteredDrawings = TECHNICAL_DRAWINGS.filter((d) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'plans') return d.category === 'plans';
    if (activeTab === 'suites') return d.category === 'suites';
    return false;
  });

  return (
    <article
      id="urben-hatch-project-case-study"
      className="relative min-h-screen bg-[#FFFFFF] text-[#141413] selection:bg-[#B35446] selection:text-[#FFFFFF] overflow-x-hidden pt-28 sm:pt-32 pb-24"
    >
      {/* ========================================================================= */}
      {/* 0. EDITORIAL TOP BREADCRUMB & UTILITY BAR                                  */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-8 md:mb-12">
        <div className="flex items-center justify-between pb-6 border-b border-[#E5E3DD]">
          <button
            type="button"
            onClick={handleReturnToProjects}
            {...linkCursor}
            className="group inline-flex items-center gap-3 font-mono-code text-xs uppercase tracking-widest text-[#7A7770] hover:text-[#141413] transition-colors"
          >
            <span className="h-8 w-8 rounded-full border border-[#E5E3DD] flex items-center justify-center group-hover:border-[#B35446] group-hover:bg-[#FAF8F5] transition-all">
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5 text-[#141413]" />
            </span>
            <span className="font-medium">Back to Projects</span>
          </button>

          <div className="flex items-center gap-4 text-xs font-mono-code tracking-widest text-[#7A7770]">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[#B35446]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B35446]" />
              <span>Project Case Study 03</span>
            </span>
            <span className="text-[#E5E3DD] hidden sm:inline">|</span>
            <span className="text-[#141413] font-medium">{FEATURED_PROJECTS[currentProjectIdx].number} / {String(FEATURED_PROJECTS.length).padStart(2, '0')}</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. HERO SECTION                                                           */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-6 md:px-12">
        <header className="pb-10 md:pb-14">
          <div className="flex flex-col gap-10 md:gap-12">
            {/* Title Block */}
            <div className="space-y-3">
              <h1 className="font-display font-light text-[11vw] xl:text-9xl tracking-tight text-[#141413] leading-[0.92] whitespace-nowrap">
                URBEN HATCH
              </h1>
              <p className="font-serif italic text-lg sm:text-xl md:text-2xl text-[#9A773E] tracking-wide">
                Hospitality Design · Adaptive Reuse
              </p>
              <p className="max-w-3xl font-mono-code text-xs md:text-sm text-[#7A7770] leading-relaxed pt-2">
                A sensitive architectural transformation of the colonial-era <span className="text-[#141413] font-medium">R.C. High School of Commerce</span> in Old City Ahmedabad into a vibrant boutique hostel, co-working atrium, and civic hospitality hub for travelers, students, and interns.
              </p>
            </div>

            {/* Project Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 bg-[#FAF8F5] border border-[#E5E3DD] p-6 sm:p-8 rounded-sm">
              <div className="space-y-1">
                <span className="font-mono-code text-[11px] uppercase tracking-widest text-[#9A773E] flex items-center gap-1.5 font-medium">
                  <MapPin className="w-3.5 h-3.5" /> Location
                </span>
                <p className="font-display text-base sm:text-lg text-[#141413] leading-snug">
                  Gheekanta, Bhadra
                </p>
                <p className="font-mono-code text-xs text-[#7A7770]">Old City, Ahmedabad, Gujarat</p>
              </div>

              <div className="space-y-1">
                <span className="font-mono-code text-[11px] uppercase tracking-widest text-[#9A773E] flex items-center gap-1.5 font-medium">
                  <Building2 className="w-3.5 h-3.5" /> Original Building
                </span>
                <p className="font-display text-base sm:text-lg text-[#141413] leading-snug">
                  R.C. High School of Commerce
                </p>
                <p className="font-mono-code text-xs text-[#7A7770]">Colonial arcades & clock tower</p>
              </div>

              <div className="space-y-1 pt-2 sm:pt-0 sm:border-t-0 border-t border-[#E5E3DD]/70">
                <span className="font-mono-code text-[11px] uppercase tracking-widest text-[#9A773E] flex items-center gap-1.5 font-medium">
                  <Tag className="w-3.5 h-3.5" /> Typology & Target
                </span>
                <p className="font-display text-base sm:text-lg text-[#141413] leading-snug">
                  Boutique Hostel & Co-Living
                </p>
                <p className="font-mono-code text-xs text-[#7A7770]">Travelers, interns, backpackers</p>
              </div>
            </div>
          </div>
        </header>
      </section>

      {/* ========================================================================= */}
      {/* 2. PROJECT STATEMENT & ADAPTIVE REUSE VISION                              */}
      {/* ========================================================================= */}
      <section className="mt-20 md:mt-28">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col gap-8 md:gap-10 pt-10 md:pt-14 border-t border-[#E5E3DD]">
            <div className="space-y-3 max-w-4xl">
              <div className="inline-flex items-center gap-2 font-mono-code text-xs uppercase tracking-widest text-[#B35446]">
                <span className="w-2 h-0.5 bg-[#B35446]" />
                <span>02 / Project Manifesto</span>
              </div>
              <h2 className="font-display font-light text-3xl sm:text-4xl text-[#141413] leading-tight">
                Breathing Youth & Hospitality into Ahmedabad’s Heritage Core
              </h2>
            </div>

            <div className="max-w-4xl">
              <div className="space-y-6 text-[#141413]">
                <p className="font-serif italic text-lg sm:text-xl md:text-2xl leading-relaxed text-[#2C2926]">
                  “Urben Hatch reimagines the historic R.C. High School of Commerce not as a static museum relic, but as an active, living infrastructure that bridges Old City heritage with the energetic lifestyle of students, creative interns, and global travelers.”
                </p>
                <div className="w-12 h-px bg-[#B35446]" />
                <p className="font-display font-light text-base sm:text-lg leading-relaxed text-[#5C5751]">
                  By utilizing the soaring vertical clearance of colonial classrooms, the design introduces custom mezzanine sleeping pods, perforated brick jaali amphitheaters, and bold crimson circulation bridges. The street-facing ground level dissolves boundaries, opening a civic cafe, co-working commons, and shaded courtyards back to the community.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. ARCHITECTURAL PRINCIPLES & SPATIAL STRATEGY                           */}
      {/* ========================================================================= */}
      <section className="mt-20 md:mt-32 max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16 pb-6 border-b border-[#E5E3DD]">
          <div>
            <div className="inline-flex items-center gap-2 font-mono-code text-xs uppercase tracking-widest text-[#B35446] mb-2">
              <span className="w-2 h-0.5 bg-[#B35446]" />
              <span>03 / Spatial Philosophy</span>
            </div>
            <h2 className="font-display font-light text-4xl sm:text-5xl md:text-6xl text-[#141413]">
              Five Architectural Interventions
            </h2>
          </div>

        </div>

        {/* 5 Core Principles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {DESIGN_PRINCIPLES.map((p) => (
            <div
              key={p.number}
              className="group relative bg-[#FAF8F5] border border-[#E5E3DD] p-6 rounded-sm hover:border-[#B35446] hover:bg-[#FFFFFF] hover:shadow-sm transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <span className="font-mono-code text-[11px] tracking-widest text-[#B35446] font-medium block mb-3">
                  {p.number}
                </span>
                <h3 className="font-display text-lg sm:text-xl text-[#141413] mb-2 leading-tight">
                  {p.title}
                </h3>
                <p className="font-serif italic text-xs text-[#7A7770]">
                  {p.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. TECHNICAL WORKING DRAWINGS & SECTIONS (INTERACTIVE VIEWER)              */}
      {/* ========================================================================= */}
      <section className="mt-20 md:mt-32 max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-[#E5E3DD]">
          <div>
            <div className="inline-flex items-center gap-2 font-mono-code text-xs uppercase tracking-widest text-[#B35446] mb-2">
              <span className="w-2 h-0.5 bg-[#B35446]" />
              <span>04 / Technical Documentation</span>
            </div>
            <h2 className="font-display font-light text-3xl sm:text-4xl md:text-5xl text-[#141413]">
              Project Presentation Sheets (01 to 07)
            </h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none self-start md:self-auto">
            <button
              onClick={() => setActiveTab('all')}
              {...linkCursor}
              className={`px-4 py-1.5 rounded-full text-xs font-mono-code tracking-wider uppercase transition-all ${
                activeTab === 'all'
                  ? 'bg-[#141413] text-white shadow-xs'
                  : 'bg-[#FAF8F5] text-[#7A7770] border border-[#E5E3DD] hover:text-[#141413]'
              }`}
            >
              All Sheets ({TECHNICAL_DRAWINGS.length})
            </button>
            <button
              onClick={() => setActiveTab('plans')}
              {...linkCursor}
              className={`px-4 py-1.5 rounded-full text-xs font-mono-code tracking-wider uppercase transition-all ${
                activeTab === 'plans'
                  ? 'bg-[#141413] text-white shadow-xs'
                  : 'bg-[#FAF8F5] text-[#7A7770] border border-[#E5E3DD] hover:text-[#141413]'
              }`}
            >
              Concept, Plans & Sections (Sheets 01–04)
            </button>
            <button
              onClick={() => setActiveTab('suites')}
              {...linkCursor}
              className={`px-4 py-1.5 rounded-full text-xs font-mono-code tracking-wider uppercase transition-all ${
                activeTab === 'suites'
                  ? 'bg-[#141413] text-white shadow-xs'
                  : 'bg-[#FAF8F5] text-[#7A7770] border border-[#E5E3DD] hover:text-[#141413]'
              }`}
            >
              Reception & Guestroom Suites (Sheets 05–07)
            </button>
          </div>
        </div>

        {/* Technical Drawings List / Cards */}
        <div className="space-y-12">
          {filteredDrawings.map((drawing) => (
            <div
              key={drawing.id}
              className="bg-[#FAF8F5] border border-[#E5E3DD] rounded-sm overflow-hidden p-6 sm:p-8 hover:border-[#B35446] transition-all duration-300"
            >
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#E5E3DD]">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono-code text-[11px] font-semibold text-[#B35446] uppercase tracking-wider">
                      Scale {drawing.scale}
                    </span>
                    <span className="text-[#E5E3DD]">•</span>
                    <span className="font-mono-code text-[11px] text-[#7A7770] uppercase tracking-wider">
                      {drawing.category === 'drawings' ? 'Architectural Drawing' : 'Urban Research Diagram'}
                    </span>
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl text-[#141413] mt-1">
                    {drawing.title}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setLightboxImage({
                      src: drawing.src,
                      title: drawing.title,
                      subtitle: `Scale: ${drawing.scale}`,
                    })
                  }
                  {...linkCursor}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFFFFF] border border-[#E5E3DD] hover:border-[#141413] rounded-full text-xs font-mono-code text-[#141413] transition-all self-start sm:self-auto shrink-0 shadow-2xs"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-[#B35446]" />
                  <span>Inspect Drawing (High-Res)</span>
                </button>
              </div>

              {/* Drawing Preview Area */}
              <div
                className="relative bg-[#FFFFFF] border border-[#E5E3DD] rounded-xs overflow-hidden cursor-pointer group"
                onClick={() =>
                  setLightboxImage({
                    src: drawing.src,
                    title: drawing.title,
                    subtitle: `Scale: ${drawing.scale}`,
                  })
                }
                {...viewCursor}
              >
                <img
                  src={drawing.src}
                  alt={drawing.title}
                  className="w-full h-auto max-h-[580px] object-contain p-4 group-hover:scale-[1.01] transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-[#141413]/0 group-hover:bg-[#141413]/5 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 bg-[#141413] text-white px-4 py-2 rounded-full text-xs font-mono-code transition-opacity shadow-md flex items-center gap-2">
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Click to zoom & inspect full drawing</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. PROJECT-TO-PROJECT FOOTER NAVIGATION                                   */}
      {/* ========================================================================= */}
      <nav aria-label="Project navigation" className="mt-20 md:mt-32 max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 border-t border-b border-[#E5E3DD]">
          <button
            type="button"
            onClick={handleGoPrev}
            aria-label={`Open ${prevProject.name} project`}
            {...linkCursor}
            className="group text-left py-8 md:py-12 pr-4 border-r border-[#E5E3DD]"
          >
            <span className="flex items-center gap-2 font-mono-code text-[11px] tracking-widest uppercase text-[#A09E96]">
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" /> Previous · {prevProject.number}
            </span>
            <span className="mt-2 block font-display text-xl sm:text-2xl md:text-3xl font-light text-[#141413] group-hover:text-[#B35446] transition-colors">
              {prevProject.name}
            </span>
            <span className="font-mono-code text-xs text-[#7A7770] hidden sm:block mt-1">
              {prevProject.type}
            </span>
          </button>

          <button
            type="button"
            onClick={handleGoNext}
            aria-label={`Open ${nextProject.name} project`}
            {...linkCursor}
            className="group text-right py-8 md:py-12 pl-4"
          >
            <span className="flex items-center justify-end gap-2 font-mono-code text-[11px] tracking-widest uppercase text-[#A09E96]">
              Next · {nextProject.number} <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </span>
            <span className="mt-2 block font-display text-xl sm:text-2xl md:text-3xl font-light text-[#141413] group-hover:text-[#B35446] transition-colors">
              {nextProject.name}
            </span>
            <span className="font-mono-code text-xs text-[#7A7770] hidden sm:block mt-1">
              {nextProject.type}
            </span>
          </button>
        </div>

        <div className="mt-12 flex justify-center">
          <button
            type="button"
            onClick={handleReturnToProjects}
            {...linkCursor}
            className="px-8 py-3.5 rounded-full border border-[#141413] text-xs font-mono-code tracking-widest uppercase text-[#141413] hover:bg-[#141413] hover:text-[#FFFFFF] transition-all shadow-xs"
          >
            Back to 3D Project Selector
          </button>
        </div>
      </nav>

      {/* ========================================================================= */}
      {/* 9. FULLSCREEN LIGHTBOX MODAL                                              */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-[#141413]/95 backdrop-blur-md flex flex-col p-4 sm:p-6 md:p-8"
          >
            {/* Lightbox Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
              <div className="pr-4">
                <span className="font-mono-code text-[11px] text-[#C83E34] uppercase tracking-widest block">
                  URBEN HATCH Architectural Drawing Dossier
                </span>
                <h3 className="font-display text-lg sm:text-xl text-white truncate max-w-xl sm:max-w-2xl">
                  {lightboxImage.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setLightboxImage(null)}
                aria-label="Close drawing viewer"
                className="h-10 w-10 rounded-full border border-white/20 hover:border-white flex items-center justify-center text-white transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Lightbox Image Container */}
            <div data-lenis-prevent className="flex-1 flex items-center justify-center overflow-auto p-2 sm:p-4">
              <img
                src={lightboxImage.src}
                alt={lightboxImage.title}
                className="max-h-[82vh] max-w-[95vw] object-contain rounded-xs shadow-2xl bg-white/5"
              />
            </div>

            {/* Lightbox Footer Caption */}
            {lightboxImage.subtitle && (
              <div className="pt-3 border-t border-white/10 text-center shrink-0">
                <p className="font-mono-code text-xs text-white/70 max-w-3xl mx-auto truncate">
                  {lightboxImage.subtitle}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
};
