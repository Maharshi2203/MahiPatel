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
  Ruler,
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

// 6-Swatch Palette extracted directly from Mahi Patel's Urben Hatch Presentation Sheets
const COLOR_PALETTE = [
  {
    name: 'Historic Terracotta Brick & Jaali',
    hex: '#B35446',
    description: 'Restored colonial masonry, exterior pilasters & contemporary perforated jaali acoustic screens',
  },
  {
    name: 'Architectural Crimson Steel',
    hex: '#C83E34',
    description: 'Sculptural central staircase, elevated catwalk bridges, steel stringers & balustrade framing',
  },
  {
    name: 'Polished Peach Terrazzo',
    hex: '#E6BAA3',
    description: 'Cast-in-place ground and atrium flooring with fine marble aggregate & brass control joints',
  },
  {
    name: 'Natural Fluted White Oak',
    hex: '#C49A6C',
    description: 'Mezzanine ladders, under-stair luggage joinery, study desks & stepped gathering podiums',
  },
  {
    name: 'Warm Ivory Lime Wash',
    hex: '#F4EFE6',
    description: 'Traditional breathable mineral wall plaster diffusing soft natural courtyard illumination',
  },
  {
    name: 'Matte Graphite & Steel Mesh',
    hex: '#2E3033',
    description: 'Minimalist window fenestration, lighting track armatures & mezzanine safety screens',
  },
];

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

// Architectural drawings and technical documentation
const TECHNICAL_DRAWINGS = [
  {
    id: 'section-aa',
    category: 'drawings',
    title: 'Longitudinal Section AA’ — Roof Trusses & Courtyards',
    scale: '1:100',
    src: '/projects/urben-hatch/05-architectural-section-aa.png',
    caption:
      'Full architectural longitudinal section AA’ cutting through the central double-height atrium, original timber roof trusses, internal open courtyards, and vertical circulation bridges.',
    highlights: ['Timber roof truss preservation', 'Double-height volume dynamics', 'Courtyard microclimate cross-ventilation', 'Bridge insertions'],
  },
  {
    id: 'sections-bb-cc',
    category: 'drawings',
    title: 'Transverse Sections BB’ & CC’ — Minaret Tower & Wing Spatial Hierarchy',
    scale: '1:100',
    src: '/projects/urben-hatch/06-sections-bb-cc.png',
    caption:
      'Comparative transverse sections illustrating structural relationship between the heritage clock tower minaret, dormitory wings, and colonnaded circulation loggias.',
    highlights: ['Minaret tower integration', 'Classroom mezzanine height studies', 'Ground-to-first floor circulation', 'Perimeter arcade loggias'],
  },
  {
    id: 'floor-plans',
    category: 'drawings',
    title: 'Comparative Floor Plans — Ground Public Hub & First Floor Accommodations',
    scale: '1:250',
    src: '/projects/urben-hatch/07-ground-first-floor-plans.png',
    caption:
      'Complete 1:250 spatial layout comparing Ground Floor public amenities (reception, co-working hub, cafe, exhibition atrium, indoor games) with First Floor guestrooms (single, double, 4-bed & 6-bed dormitories).',
    highlights: ['Ground floor public activation', 'Upper floor room typology zoning', 'Axial circulation paths', 'Clear service & guest separation'],
  },
  {
    id: 'cafe-plan',
    category: 'drawings',
    title: 'Atrium Cafe & Communal Hub Detailed Layout',
    scale: '1:50',
    src: '/projects/urben-hatch/13-cafe-atrium-plan.png',
    caption:
      'Detailed 1:50 architectural plan and material schedule of the ground-floor cafe, showing custom circular dining banquettes, built-in planter partitions, service bar, and courtyard spill-out.',
    highlights: ['Circular booth joinery', 'Terrazzo dining surfaces', 'Integrated biophilic planters', 'Seamless threshold to atrium'],
  },
  {
    id: 'single-suite-drawings',
    category: 'drawings',
    title: 'Single Room Suite — Architectural Plan, Section & Spec Sheet',
    scale: '1:25',
    src: '/projects/urben-hatch/11-single-room-suite.png',
    caption:
      'Technical 1:25 drawing sheet featuring single room suite layout, section elevation, bespoke furniture dimensions, striped wallpaper accent, and material finishes.',
    highlights: ['1:25 detailed plan & section', 'Integrated wardrobe joinery', 'Ergonomic study nook', 'Compact ensuite layout'],
  },
  {
    id: 'double-suite-drawings',
    category: 'drawings',
    title: 'Double Room Suite — Layout Plan & Material Palette Spec',
    scale: '1:25',
    src: '/projects/urben-hatch/12-double-room-suite.png',
    caption:
      'Comprehensive 1:25 plan and specification sheet for double occupancy guestroom suite, pairing dark-stained oak cabinetry with patterned terrazzo floors and matte black hardware.',
    highlights: ['Generous double layout', 'Luggage stowage optimization', 'Material sample schedule', 'Ambient lighting integration'],
  },
  {
    id: 'urban-site-analysis',
    category: 'analysis',
    title: 'Old City Ahmedabad Urban Site Context & SWOT Analysis',
    scale: 'Urban Scale',
    src: '/projects/urben-hatch/09-urban-site-analysis.png',
    caption:
      'Urban context analysis within the historic Gheekanta district of Old City Ahmedabad, examining proximity to Bhadra Fort, Teen Darwaza, pedestrian pol networks, sun path angles, and accessibility.',
    highlights: ['UNESCO World Heritage pol context', 'Pedestrian & transit connectivity', 'Microclimate & solar orientation', 'Comprehensive SWOT breakdown'],
  },
  {
    id: 'concept-zoning',
    category: 'analysis',
    title: 'Concept Framework, Arch Typologies & Spatial Flow Diagram',
    scale: 'Diagrammatic',
    src: '/projects/urben-hatch/08-concept-programme-zoning.png',
    caption:
      'Morphological study of architectural arch typologies (horseshoe, segmental, and centred arches) and the programmatic zoning matrix linking public, semi-public, and private hospitality sectors.',
    highlights: ['Heritage arch morphology', 'Connectivity & programmatic flow', 'User journey mapping', 'Spatial density matrix'],
  },
];

// Interior 3D Renders & Perspectives
const PERSPECTIVES = [
  {
    id: 'mezzanine-hero',
    title: 'Mezzanine Guestroom Suite — Floating Orange Stair & Lounge',
    src: '/projects/urben-hatch/01-mezzanine-room-stairs.png',
    caption:
      'Hero perspective of the high-ceilinged guestroom suite: a custom bright orange cantilevered steel stair leads to an upper sleeping loft, accompanied by mid-century lounge chairs and warm natural light.',
    tag: 'Hero Suite Perspective',
  },
  {
    id: 'mezzanine-loft',
    title: 'Mezzanine Loft Sleeping Pod & Perforated Timber Railing',
    src: '/projects/urben-hatch/02-mezzanine-bed-interior.png',
    caption:
      'View from the elevated sleeping deck featuring a graphic terracotta-and-cream patterned headboard, built-in task sconces, and perforated timber privacy balustrade.',
    tag: 'Upper Sleeping Deck',
  },
  {
    id: 'atrium-colonnade',
    title: 'Central Atrium Colonnade — Heritage Arches & Terrazzo Floor',
    src: '/projects/urben-hatch/03-atrium-hall-colonnade.png',
    caption:
      'Double-height central atrium framed by restored colonial brick archways, cast peach terrazzo flooring, contemporary fluted oak benches, and lush indoor planters.',
    tag: 'Central Colonnade',
  },
  {
    id: 'atrium-jaali',
    title: 'Atrium Gathering Space & Contemporary Brick Jaali Partition',
    src: '/projects/urben-hatch/04-atrium-jaali-seating.png',
    caption:
      'Stepped amphitheatre seating constructed from solid oak, set against an acoustic perforated terracotta jaali screen wall that filters diffused golden daylight.',
    tag: 'Amphitheatre Lounge',
  },
  {
    id: 'crimson-stairs-study',
    title: 'Sculptural Crimson Steel Staircase & Pedestrian Bridge Insertion',
    src: '/projects/urben-hatch/10-crimson-atrium-stairs.png',
    caption:
      'Four-angle architectural study of the bold crimson steel sculptural staircase and suspended pedestrian bridges weaving through the historic atrium.',
    tag: 'Circulation Core Study',
  },
];

export const UrbenHatchProjectPage: React.FC<UrbenHatchProjectPageProps> = ({
  onBack,
  onNavigate,
  onOpenProject,
  onCursorChange,
}) => {
  const reduced = !!useReducedMotion();
  const [activeTab, setActiveTab] = useState<'all' | 'perspectives' | 'drawings' | 'analysis'>('all');
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

  // Filtered technical items
  const filteredDrawings = TECHNICAL_DRAWINGS.filter((d) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'drawings') return d.category === 'drawings';
    if (activeTab === 'analysis') return d.category === 'analysis';
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
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-10">
            {/* Title Block */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FAF8F5] border border-[#E5E3DD] rounded-full font-mono-code text-[11px] text-[#B35446] uppercase tracking-widest">
                <span>Design Studio VI · Semester 6</span>
                <span className="w-1 h-1 rounded-full bg-[#B35446]" />
                <span>Historic Adaptive Reuse</span>
              </div>
              <h1 className="font-display font-light text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-[#141413] leading-[0.95]">
                URBEN HATCH
              </h1>
              <p className="font-serif italic text-lg sm:text-xl md:text-2xl text-[#B35446] tracking-wide">
                Hostel Hotel · Adaptive Reuse of Historic R.C. High School
              </p>
              <p className="max-w-2xl font-mono-code text-xs md:text-sm text-[#7A7770] leading-relaxed pt-2">
                A sensitive architectural transformation of the colonial-era <span className="text-[#141413] font-medium">R.C. High School of Commerce</span> in Old City Ahmedabad into a vibrant boutique hostel, co-working atrium, and civic hospitality hub for travelers, students, and interns.
              </p>
            </div>

            {/* Project Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 lg:min-w-[440px] bg-[#FAF8F5] border border-[#E5E3DD] p-6 sm:p-8 rounded-sm">
              <div className="space-y-1">
                <span className="font-mono-code text-[11px] uppercase tracking-widest text-[#B35446] flex items-center gap-1.5 font-medium">
                  <MapPin className="w-3.5 h-3.5" /> Location
                </span>
                <p className="font-display text-base sm:text-lg text-[#141413] leading-snug">
                  Gheekanta, Bhadra
                </p>
                <p className="font-mono-code text-xs text-[#7A7770]">Old City, Ahmedabad, Gujarat</p>
              </div>

              <div className="space-y-1">
                <span className="font-mono-code text-[11px] uppercase tracking-widest text-[#B35446] flex items-center gap-1.5 font-medium">
                  <Building2 className="w-3.5 h-3.5" /> Original Building
                </span>
                <p className="font-display text-base sm:text-lg text-[#141413] leading-snug">
                  R.C. High School of Commerce
                </p>
                <p className="font-mono-code text-xs text-[#7A7770]">Colonial arcades & clock tower</p>
              </div>

              <div className="space-y-1 pt-2 sm:pt-0 sm:border-t-0 border-t border-[#E5E3DD]/70">
                <span className="font-mono-code text-[11px] uppercase tracking-widest text-[#B35446] flex items-center gap-1.5 font-medium">
                  <Tag className="w-3.5 h-3.5" /> Typology & Target
                </span>
                <p className="font-display text-base sm:text-lg text-[#141413] leading-snug">
                  Boutique Hostel & Co-Living
                </p>
                <p className="font-mono-code text-xs text-[#7A7770]">Travelers, interns, backpackers</p>
              </div>

              <div className="space-y-1 pt-2 sm:pt-0 sm:border-t-0 border-t border-[#E5E3DD]/70">
                <span className="font-mono-code text-[11px] uppercase tracking-widest text-[#B35446] flex items-center gap-1.5 font-medium">
                  <Ruler className="w-3.5 h-3.5" /> Site & Drawing Scales
                </span>
                <p className="font-display text-base sm:text-lg text-[#141413] leading-snug">
                  19,091 m² Site Area
                </p>
                <p className="font-mono-code text-xs text-[#7A7770]">Drawings: 1:250 · 1:100 · 1:50 · 1:25</p>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Visual Banner */}
        <div className="mt-8 rounded-sm overflow-hidden border border-[#E5E3DD] relative group shadow-sm">
          <div className="relative aspect-[16/9] md:aspect-[21/9] w-full bg-[#1A1816] overflow-hidden">
            <img
              src="/projects/urben-hatch/01-mezzanine-room-stairs.png"
              alt="URBEN HATCH Mezzanine Guestroom Suite Hero Perspective"
              className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141413]/70 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
              <div>
                <span className="font-mono-code text-[10px] tracking-widest uppercase bg-[#C83E34] text-white px-2.5 py-1 rounded-xs">
                  Hero Interior Perspective
                </span>
                <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-light mt-2 text-white">
                  Mezzanine Guestroom Suite & Custom Orange Cantilever Stair
                </h3>
              </div>
              <button
                type="button"
                onClick={() =>
                  setLightboxImage({
                    src: '/projects/urben-hatch/01-mezzanine-room-stairs.png',
                    title: 'Mezzanine Guestroom Suite Hero Perspective',
                    subtitle: 'Custom orange floating stair, upper sleeping loft & modular joinery',
                  })
                }
                {...linkCursor}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full text-xs font-mono-code text-white transition-colors self-start sm:self-auto"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Expand Fullscreen</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. PROJECT STATEMENT & ADAPTIVE REUSE VISION                              */}
      {/* ========================================================================= */}
      <section className="mt-20 md:mt-28 bg-[#FAF8F5] border-y border-[#E5E3DD] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-4 space-y-3">
              <div className="inline-flex items-center gap-2 font-mono-code text-xs uppercase tracking-widest text-[#B35446]">
                <span className="w-2 h-0.5 bg-[#B35446]" />
                <span>02 / Project Manifesto</span>
              </div>
              <h2 className="font-display font-light text-3xl sm:text-4xl text-[#141413] leading-tight">
                Breathing Youth & Hospitality into Ahmedabad’s Heritage Core
              </h2>
              <p className="font-mono-code text-xs text-[#7A7770] leading-relaxed pt-2">
                Preserving architectural dignity while responding to the pressing demand for vibrant, design-led accommodations in historic urban settings.
              </p>
            </div>

            <div className="lg:col-span-8 bg-[#FFFFFF] border border-[#E5E3DD] p-8 sm:p-12 rounded-sm shadow-xs relative">
              <div className="space-y-6 text-[#141413]">
                <p className="font-serif italic text-lg sm:text-xl md:text-2xl leading-relaxed text-[#2C2926]">
                  “Urben Hatch reimagines the historic R.C. High School of Commerce not as a static museum relic, but as an active, living infrastructure that bridges Old City heritage with the energetic lifestyle of students, creative interns, and global travelers.”
                </p>
                <div className="w-12 h-px bg-[#B35446]" />
                <p className="font-display font-light text-base sm:text-lg leading-relaxed text-[#5C5751]">
                  By utilizing the soaring vertical clearance of colonial classrooms, the design introduces custom mezzanine sleeping pods, perforated brick jaali amphitheaters, and bold crimson circulation bridges. The street-facing ground level dissolves boundaries, opening a civic cafe, co-working commons, and shaded courtyards back to the community.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-[#E5E3DD] flex flex-wrap items-center justify-between gap-4 font-mono-code text-xs text-[#7A7770]">
                <span>Typology: Adaptive Reuse / Boutique Hostel & Hotel</span>
                <span className="text-[#B35446] font-medium">Design Studio VI · Indus University (2024)</span>
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
            <p className="font-serif italic text-lg sm:text-xl text-[#7A7770] mt-2">
              Transforming colonial educational architecture into contemporary co-living spaces.
            </p>
          </div>

          <div className="max-w-md">
            <p className="font-mono-code text-xs sm:text-sm text-[#5C5751] leading-relaxed">
              Every design move navigates between heritage conservation and contemporary hospitality requirements: light, volume, structural lightness, and vibrant social connectivity.
            </p>
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
                <p className="font-serif italic text-xs text-[#7A7770] mb-3">
                  {p.subtitle}
                </p>
              </div>
              <p className="font-mono-code text-xs text-[#5C5751] leading-relaxed pt-3 border-t border-[#E5E3DD]/60">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. 3D VISUAL PERSPECTIVES & SPATIAL EXPERIENCES                           */}
      {/* ========================================================================= */}
      <section className="mt-20 md:mt-32 max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-[#E5E3DD]">
          <div>
            <div className="inline-flex items-center gap-2 font-mono-code text-xs uppercase tracking-widest text-[#B35446] mb-2">
              <span className="w-2 h-0.5 bg-[#B35446]" />
              <span>04 / Spatial Visualization</span>
            </div>
            <h2 className="font-display font-light text-3xl sm:text-4xl md:text-5xl text-[#141413]">
              3D Perspectives & Interior Spaces
            </h2>
          </div>
          <p className="max-w-md font-mono-code text-xs text-[#7A7770] leading-relaxed">
            High-fidelity interior renders showcasing the interplay of historic brick arcades, peach terrazzo, custom furniture, and energetic crimson steel elements.
          </p>
        </div>

        {/* 2-Column Perspectives Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PERSPECTIVES.map((item) => (
            <div
              key={item.id}
              className="bg-[#FAF8F5] border border-[#E5E3DD] rounded-sm overflow-hidden flex flex-col group hover:border-[#B35446] transition-all duration-300"
            >
              <div
                className="relative aspect-[16/10] bg-[#E5E3DD] overflow-hidden cursor-pointer"
                onClick={() =>
                  setLightboxImage({
                    src: item.src,
                    title: item.title,
                    subtitle: item.caption,
                  })
                }
                {...viewCursor}
              >
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute top-4 left-4">
                  <span className="font-mono-code text-[10px] tracking-wider uppercase bg-[#141413]/80 text-white px-2.5 py-1 rounded-xs backdrop-blur-xs">
                    {item.tag}
                  </span>
                </div>
                <div className="absolute bottom-4 right-4 bg-white/90 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                  <Maximize2 className="w-4 h-4 text-[#141413]" />
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-lg sm:text-xl text-[#141413] leading-snug">
                    {item.title}
                  </h3>
                  <p className="font-mono-code text-xs text-[#6E6C65] mt-2 leading-relaxed">
                    {item.caption}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setLightboxImage({
                      src: item.src,
                      title: item.title,
                      subtitle: item.caption,
                    })
                  }
                  {...linkCursor}
                  className="mt-4 pt-4 border-t border-[#E5E3DD] inline-flex items-center gap-2 font-mono-code text-xs text-[#B35446] hover:text-[#141413] transition-colors"
                >
                  <span>View Full Resolution</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. ARCHITECTURAL MATERIAL PALETTE & SWATCHES                              */}
      {/* ========================================================================= */}
      <section className="mt-20 md:mt-32 max-w-7xl mx-auto px-6 md:px-12">
        <div className="bg-[#FAF8F5] border border-[#E5E3DD] p-6 sm:p-10 md:p-14 rounded-sm">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-[#E5E3DD]">
            <div>
              <div className="inline-flex items-center gap-2 font-mono-code text-xs uppercase tracking-widest text-[#B35446] mb-2">
                <span className="w-2 h-0.5 bg-[#B35446]" />
                <span>05 / Material Sensibility</span>
              </div>
              <h2 className="font-display font-light text-3xl sm:text-4xl md:text-5xl text-[#141413]">
                Architectural Material Palette
              </h2>
            </div>
            <p className="max-w-md font-mono-code text-xs text-[#7A7770] leading-relaxed">
              Extracted directly from Mahi Patel’s presentation sheets: tactile heritage brick juxtaposed against bold red architectural steel, peach terrazzo, and natural fluted oak.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {COLOR_PALETTE.map((c) => (
              <div
                key={c.name}
                className="bg-[#FFFFFF] border border-[#E5E3DD] p-5 rounded-sm flex items-start gap-4 hover:border-[#B35446] hover:shadow-xs transition-all"
              >
                <div
                  className="w-14 h-14 rounded-sm border border-black/10 shrink-0 shadow-inner"
                  style={{ backgroundColor: c.hex }}
                />
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-sm font-medium text-[#141413] leading-snug">
                      {c.name}
                    </h3>
                  </div>
                  <span className="font-mono-code text-[11px] text-[#B35446] font-semibold block">
                    {c.hex}
                  </span>
                  <p className="font-mono-code text-[11px] text-[#7A7770] leading-relaxed pt-1">
                    {c.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
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
              <span>06 / Technical Documentation</span>
            </div>
            <h2 className="font-display font-light text-3xl sm:text-4xl md:text-5xl text-[#141413]">
              Plans, Sections & Urban Studies
            </h2>
            <p className="font-serif italic text-base sm:text-lg text-[#7A7770] mt-1">
              Rigorous architectural drawings rendered with scale bars, room schedules, and structural details.
            </p>
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
              All Drawings ({TECHNICAL_DRAWINGS.length})
            </button>
            <button
              onClick={() => setActiveTab('drawings')}
              {...linkCursor}
              className={`px-4 py-1.5 rounded-full text-xs font-mono-code tracking-wider uppercase transition-all ${
                activeTab === 'drawings'
                  ? 'bg-[#141413] text-white shadow-xs'
                  : 'bg-[#FAF8F5] text-[#7A7770] border border-[#E5E3DD] hover:text-[#141413]'
              }`}
            >
              Plans & Sections (6)
            </button>
            <button
              onClick={() => setActiveTab('analysis')}
              {...linkCursor}
              className={`px-4 py-1.5 rounded-full text-xs font-mono-code tracking-wider uppercase transition-all ${
                activeTab === 'analysis'
                  ? 'bg-[#141413] text-white shadow-xs'
                  : 'bg-[#FAF8F5] text-[#7A7770] border border-[#E5E3DD] hover:text-[#141413]'
              }`}
            >
              Urban & Concept (2)
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
                      subtitle: `${drawing.caption} (Scale: ${drawing.scale})`,
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
                    subtitle: `${drawing.caption} (Scale: ${drawing.scale})`,
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

              {/* Caption & Highlights */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                <p className="md:col-span-8 font-mono-code text-xs sm:text-sm text-[#5C5751] leading-relaxed">
                  {drawing.caption}
                </p>
                <div className="md:col-span-4 flex flex-wrap gap-2">
                  {drawing.highlights.map((h) => (
                    <span
                      key={h}
                      className="font-mono-code text-[10px] uppercase tracking-wider bg-[#FFFFFF] border border-[#E5E3DD] text-[#7A7770] px-2.5 py-1 rounded-xs"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. SPATIAL PROGRAMME & ACCOMMODATION MATRIX                              */}
      {/* ========================================================================= */}
      <section className="mt-20 md:mt-32 max-w-7xl mx-auto px-6 md:px-12">
        <div className="bg-[#FAF8F5] border border-[#E5E3DD] p-6 sm:p-10 md:p-12 rounded-sm">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-[#E5E3DD]">
            <div>
              <div className="inline-flex items-center gap-2 font-mono-code text-xs uppercase tracking-widest text-[#B35446] mb-2">
                <span className="w-2 h-0.5 bg-[#B35446]" />
                <span>07 / Program Schedule</span>
              </div>
              <h2 className="font-display font-light text-3xl sm:text-4xl text-[#141413]">
                Spatial Program & Capacity
              </h2>
            </div>
            <p className="max-w-md font-mono-code text-xs text-[#7A7770] leading-relaxed">
              Zoning summary derived from comparative 1:250 floor plans of R.C. High School adaptive reuse.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#FFFFFF] border border-[#E5E3DD] p-6 rounded-sm space-y-2">
              <span className="font-mono-code text-xs text-[#B35446] uppercase tracking-widest font-medium">Ground Floor Public</span>
              <h3 className="font-display text-xl text-[#141413]">Civic Atrium & Cafe</h3>
              <p className="font-mono-code text-xs text-[#7A7770] leading-relaxed">
                Reception lounge, 60-seat atrium cafe, co-working hub, stepped jaali amphitheater, indoor game hall, public washrooms.
              </p>
            </div>

            <div className="bg-[#FFFFFF] border border-[#E5E3DD] p-6 rounded-sm space-y-2">
              <span className="font-mono-code text-xs text-[#B35446] uppercase tracking-widest font-medium">First Floor Living</span>
              <h3 className="font-display text-xl text-[#141413]">Private Guestrooms</h3>
              <p className="font-mono-code text-xs text-[#7A7770] leading-relaxed">
                Single executive rooms, double boutique suites, private ensuite baths, luggage storage, quiet study reading desks.
              </p>
            </div>

            <div className="bg-[#FFFFFF] border border-[#E5E3DD] p-6 rounded-sm space-y-2">
              <span className="font-mono-code text-xs text-[#B35446] uppercase tracking-widest font-medium">Dormitory Suites</span>
              <h3 className="font-display text-xl text-[#141413]">Shared Pod Rooms</h3>
              <p className="font-mono-code text-xs text-[#7A7770] leading-relaxed">
                4-share and 6-share dormitories, acoustic fabric divider curtains, individual lockable trunks, dual vanity blocks.
              </p>
            </div>

            <div className="bg-[#FFFFFF] border border-[#E5E3DD] p-6 rounded-sm space-y-2">
              <span className="font-mono-code text-xs text-[#B35446] uppercase tracking-widest font-medium">Open Courtyards</span>
              <h3 className="font-display text-xl text-[#141413]">Microclimate Wells</h3>
              <p className="font-mono-code text-xs text-[#7A7770] leading-relaxed">
                Internal open-to-sky courtyards providing stack ventilation, seasonal shade trees, rainwater collection, outdoor relaxation.
              </p>
            </div>
          </div>
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
