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
} from 'lucide-react';
import { CursorState, PageRoute } from '../types';
import { FEATURED_PROJECTS, wrapProjectIndex, projectIndexBySlug } from '../data/featuredProjects';

interface RoyceProjectPageProps {
  onBack?: () => void;
  onNavigate?: (route: PageRoute) => void;
  onOpenProject?: (index: number) => void;
  onCursorChange?: (state: CursorState, text?: string) => void;
}

const EASE = [0.76, 0, 0.24, 1] as const;

// 5-Swatch Palette extracted directly from Mahi Patel's ROYCE' PDF Sheet
const COLOR_PALETTE = [
  {
    name: 'Rice Paper / Cream Stone',
    hex: '#EDE5D8',
    description: 'Textured wall plaster, primary floor travertine & warm light bounce',
  },
  {
    name: 'Natural Birch / Light Oak',
    hex: '#E4C7A5',
    description: 'Custom joinery, vertical timber lattices & open retail shelving',
  },
  {
    name: 'Warm Cocoa Taupe',
    hex: '#B0917E',
    description: 'Acoustic wall paneling, subtle tactile textiles & shadow reveals',
  },
  {
    name: 'Roasted Cocoa Wood',
    hex: '#7A583E',
    description: 'Display plinths, counter wave accents & brand frame details',
  },
  {
    name: 'Dark Chocolate Espresso',
    hex: '#523B2B',
    description: 'Structural perimeter framing, portal base reveals & accent hardware',
  },
];

// The 5 core Kanso principles
const KANSO_KEYWORDS = [
  {
    title: 'Minimal Forms',
    subtitle: 'Purity in volumetric massing and unadorned surfaces',
    desc: 'Uncluttered geometric forms that create calm visual balance without unnecessary ornamentation.',
  },
  {
    title: 'Straight Lines',
    subtitle: 'Disciplined spatial axes & rectilinear framing',
    desc: 'Clear architectural alignments that guide visitor sightlines effortlessly from facade to counter.',
  },
  {
    title: 'Clean Visual Composition',
    subtitle: 'Spatial breathing room and uncluttered planes',
    desc: 'Balanced proportion of void and mass, allowing products to stand out as sculptural focal points.',
  },
  {
    title: 'Limited Material Palette',
    subtitle: 'Cohesive dialogue of wood, stone, glass & chocolate tones',
    desc: 'Restrained selection of tactile finishes that echo Japanese sukiya craftsmanship and cocoa warmth.',
  },
  {
    title: 'Warm & Comfortable Ambience',
    subtitle: 'Diffused 2400K illumination & woven paper textures',
    desc: 'Soft, indirect lighting and welcoming textures that invite visitors to pause, browse and savor.',
  },
];

// Architectural elevations data
const ELEVATIONS = [
  {
    id: 'elevation-b',
    title: 'Elevation B — Storefront Glazing & Entrance Portal',
    scale: '1:20',
    src: '/royce/elevation-b-clean.png',
    caption:
      'Storefront facade featuring clear floor-to-ceiling glass, custom textured stone portal, illuminated ROYCE’ CHOCOLATE signage, and transparent sightlines into central display plinths.',
    highlights: ['Clear storefront glazing', 'Full-height stone portal', 'Illuminated signage', 'Pedestrian scale integration'],
  },
  {
    id: 'elevation-a',
    title: 'Elevation A — Staggered Timber Display Shelving',
    scale: '1:20',
    src: '/royce/elevation-a-clean.png',
    caption:
      'Asymmetrical floating timber display shelves anchored to a central vertical wood spine against a textured cream plaster backdrop, presenting signature packaged chocolate boxes.',
    highlights: ['Staggered horizontal cantilever shelves', 'Solid central timber column', 'Natural plaster textured wall', 'Integrated product display'],
  },
  {
    id: 'elevation-c',
    title: 'Elevation C — Modular Grid Shelving & Wooden Peg Wall',
    scale: '1:20',
    src: '/royce/elevation-c-clean.png',
    caption:
      'Floor-to-ceiling dark timber matrix shelving designed for precise product packaging alignment, complemented by an adjacent natural wood panel with turned brass-tipped hanging pegs.',
    highlights: ['High-density modular grid matrix', 'Merchandise display alignment', 'Turned wooden hanging peg board', 'Framed oak feature panel'],
  },
  {
    id: 'elevation-d',
    title: 'Elevation D — Sculpted Cashier Counter & Lantern Cluster',
    scale: '1:20',
    src: '/royce/elevation-d-clean.png',
    caption:
      'Point-of-sale service counter showcasing an organic melting chocolate wave front, flanked by geometric grid wall paneling and crowned with an asymmetrical cluster of woven rattan and washi pendant lanterns.',
    highlights: ['Sculptural dripping chocolate wave front', 'Grid relief feature wall', 'Clustered woven pendant lanterns', 'Concealed ambient base glow'],
  },
];

export const RoyceProjectPage: React.FC<RoyceProjectPageProps> = ({
  onBack,
  onNavigate,
  onOpenProject,
  onCursorChange,
}) => {
  const reduced = !!useReducedMotion();
  const [activeElevationTab, setActiveElevationTab] = useState<string>('all');
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

  const currentProjectIdx = projectIndexBySlug('royce-store');
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

  return (
    <article
      id="royce-project-case-study"
      className="relative min-h-screen bg-[#FFFFFF] text-[#141413] selection:bg-[#9A773E] selection:text-[#FFFFFF] overflow-x-hidden pt-28 sm:pt-32 pb-24"
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
            <span className="h-8 w-8 rounded-full border border-[#E5E3DD] flex items-center justify-center group-hover:border-[#9A773E] group-hover:bg-[#FAF8F5] transition-all">
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5 text-[#141413]" />
            </span>
            <span className="font-medium">Back to Projects</span>
          </button>

          <div className="flex items-center gap-4 text-xs font-mono-code tracking-widest text-[#7A7770]">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[#9A773E]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#9A773E]" />
              <span>Project Case Study 01</span>
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
              <h1 className="font-display font-light text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight text-[#141413] leading-[0.92]">
                ROYCE’
              </h1>
              <p className="font-serif italic text-lg sm:text-xl md:text-2xl text-[#9A773E] tracking-wide">
                Retail Store Interior Design
              </p>
              <p className="max-w-xl font-mono-code text-xs md:text-sm text-[#7A7770] leading-relaxed pt-2">
                A Japanese luxury chocolate retail interior shaped by the aesthetic concept of <span className="text-[#141413] font-medium">Kanso (簡素)</span> — translating brand heritage into tectonic purity and warm timber craftsmanship.
              </p>
            </div>

            {/* Project Details Grid (Exact Reference Placement) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 lg:min-w-[420px] bg-[#FAF8F5] border border-[#E5E3DD] p-6 sm:p-8 rounded-sm">
              <div className="space-y-1">
                <span className="font-mono-code text-[11px] uppercase tracking-widest text-[#9A773E] flex items-center gap-1.5 font-medium">
                  <MapPin className="w-3.5 h-3.5" /> Location
                </span>
                <p className="font-display text-base sm:text-lg text-[#141413] leading-snug">
                  Shilp Aaron, Bodakdev
                </p>
                <p className="font-mono-code text-xs text-[#7A7770]">Ahmedabad, Gujarat</p>
              </div>

              <div className="space-y-1">
                <span className="font-mono-code text-[11px] uppercase tracking-widest text-[#9A773E] flex items-center gap-1.5 font-medium">
                  <Sparkles className="w-3.5 h-3.5" /> Project Focus
                </span>
                <p className="font-display text-base sm:text-lg text-[#141413] leading-snug">
                  Luxury Chocolate Retail Experience
                </p>
                <p className="font-mono-code text-xs text-[#7A7770]">Brand translation & hospitality</p>
              </div>

              <div className="space-y-1 pt-2 sm:pt-0 sm:border-t-0 border-t border-[#E5E3DD]/70">
                <span className="font-mono-code text-[11px] uppercase tracking-widest text-[#9A773E] flex items-center gap-1.5 font-medium">
                  <Tag className="w-3.5 h-3.5" /> Project Type
                </span>
                <p className="font-display text-base sm:text-lg text-[#141413] leading-snug">
                  Retail Interior Design
                </p>
                <p className="font-mono-code text-xs text-[#7A7770]">Commercial Architecture</p>
              </div>

              <div className="space-y-1 pt-2 sm:pt-0 sm:border-t-0 border-t border-[#E5E3DD]/70">
                <span className="font-mono-code text-[11px] uppercase tracking-widest text-[#9A773E] flex items-center gap-1.5 font-medium">
                  <Ruler className="w-3.5 h-3.5" /> Footprint & Scale
                </span>
                <p className="font-display text-base sm:text-lg text-[#141413] leading-snug">
                  30 sq.m (30 m²)
                </p>
                <p className="font-mono-code text-xs text-[#7A7770]">Drawing Scale 1:20</p>
              </div>
            </div>
          </div>
        </header>
      </section>

      {/* ========================================================================= */}
      {/* 2. PROJECT BRIEF SECTION                                                  */}
      {/* ========================================================================= */}
      <section className="mt-20 md:mt-28 bg-[#FAF8F5] border-y border-[#E5E3DD] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-4 space-y-3">
              <div className="inline-flex items-center gap-2 font-mono-code text-xs uppercase tracking-widest text-[#9A773E]">
                <span className="w-2 h-0.5 bg-[#9A773E]" />
                <span>02 / Project Brief</span>
              </div>
              <h2 className="font-display font-light text-3xl sm:text-4xl text-[#141413]">
                Translating Japanese Brand Heritage into Space
              </h2>
              <p className="font-mono-code text-xs text-[#7A7770] leading-relaxed pt-2">
                A design exploration in balancing commercial merchandising requirements with contemplative Japanese retail serenity.
              </p>
            </div>

            <div className="lg:col-span-8 bg-[#FFFFFF] border border-[#E5E3DD] p-8 sm:p-12 rounded-sm shadow-xs relative">
              <div className="space-y-6 text-[#141413]">
                <p className="font-serif italic text-lg sm:text-xl md:text-2xl leading-relaxed text-[#2C2926]">
                  “The project involved selecting an existing brand and designing a retail interior that reflects its brand identity and existing store features.”
                </p>
                <div className="w-12 h-px bg-[#9A773E]" />
                <p className="font-display font-light text-base sm:text-lg leading-relaxed text-[#5C5751]">
                  “For this project, ROYCE’, a Japanese luxury chocolate brand, was selected and its visual language and retail characteristics were translated into the interior design.”
                </p>
              </div>

              {/* Discreet Japanese Brand Monogram Badge */}
              <div className="mt-8 pt-6 border-t border-[#E5E3DD] flex flex-wrap items-center justify-between gap-4 font-mono-code text-xs text-[#7A7770]">
                <span>Brand Origin: Hokkaido, Japan (Est. 1983)</span>
                <span className="text-[#9A773E] font-medium">Design Studio II · Indus University</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. CONCEPT – KANSO (簡素 — Simplicity & Purity)                           */}
      {/* ========================================================================= */}
      <section className="mt-20 md:mt-32 max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16 pb-6 border-b border-[#E5E3DD]">
          <div>
            <div className="inline-flex items-center gap-2 font-mono-code text-xs uppercase tracking-widest text-[#9A773E] mb-2">
              <span className="w-2 h-0.5 bg-[#9A773E]" />
              <span>03 / Architectural Philosophy</span>
            </div>
            <h2 className="font-display font-light text-4xl sm:text-5xl md:text-6xl text-[#141413]">
              KANSO — Simplicity & Purity
            </h2>
            <p className="font-serif italic text-lg sm:text-xl text-[#7A7770] mt-2">
              簡素 (Kanso): The aesthetic elimination of non-essentials to reveal pure essence.
            </p>
          </div>

          <div className="max-w-md">
            <p className="font-mono-code text-xs sm:text-sm text-[#5C5751] leading-relaxed">
              <span className="font-semibold text-[#141413]">KANSO</span> means simplicity or purity. The concept aligns with the minimalist tendencies of modern architecture and interior design.
            </p>
          </div>
        </div>

        {/* 5 Core Keywords Breakdown in Editorial Grid */}
        <div className="mb-14">
          <p className="font-mono-code text-xs uppercase tracking-[0.2em] text-[#9A773E] mb-6 font-medium">
            The concept is expressed through five spatial principles:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {KANSO_KEYWORDS.map((k, idx) => (
              <div
                key={k.title}
                className="group relative bg-[#FAF8F5] border border-[#E5E3DD] p-6 rounded-sm hover:border-[#9A773E] hover:bg-[#FFFFFF] hover:shadow-sm transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <span className="font-mono-code text-[11px] tracking-widest text-[#9A773E] font-medium block mb-3">
                    0{idx + 1}
                  </span>
                  <h3 className="font-display text-lg sm:text-xl text-[#141413] mb-2 leading-tight">
                    {k.title}
                  </h3>
                  <p className="font-serif italic text-xs text-[#7A7770] mb-3">
                    {k.subtitle}
                  </p>
                </div>
                <p className="font-mono-code text-xs text-[#5C5751] leading-relaxed pt-3 border-t border-[#E5E3DD]/60">
                  {k.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. MOOD BOARD SECTION (Authentic visuals from PDF)                       */}
      {/* ========================================================================= */}
      <section className="mt-16 md:mt-24 max-w-7xl mx-auto px-6 md:px-12">
        <div className="bg-[#FAF8F5] border border-[#E5E3DD] p-6 sm:p-10 md:p-14 rounded-sm">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-[#E5E3DD]">
            <div>
              <div className="inline-flex items-center gap-2 font-mono-code text-xs uppercase tracking-widest text-[#9A773E] mb-2">
                <span className="w-2 h-0.5 bg-[#9A773E]" />
                <span>04 / Visual Identity</span>
              </div>
              <h2 className="font-display font-light text-3xl sm:text-4xl md:text-5xl text-[#141413]">
                Mood Board & Atmosphere
              </h2>
            </div>
            <p className="max-w-md font-mono-code text-xs text-[#7A7770] leading-relaxed">
              Curated from Mahi Patel’s original project study: a dialogue of natural cedar joinery, woven textures, suspended lanterns, and rich cocoa undertones.
            </p>
          </div>

          {/* Large Image Spread of Mood Board from PDF */}
          <div
            onClick={() =>
              setLightboxImage({
                src: '/royce/mood-board.png',
                title: 'ROYCE’ Project Mood Board & Atmosphere Study',
                subtitle: 'Original Concept Sheet Spread — Design Studio II',
              })
            }
            {...viewCursor}
            className="group relative cursor-pointer bg-[#FFFFFF] border border-[#E5E3DD] p-4 sm:p-8 rounded-sm overflow-hidden hover:border-[#9A773E] transition-all duration-300"
          >
            <div className="w-full flex items-center justify-center">
              <img
                src="/royce/mood-board.png"
                alt="ROYCE' Retail Store Mood Board Collage"
                className="w-full max-w-4xl h-auto object-contain transition-transform duration-700 ease-out group-hover:scale-[1.015]"
                loading="lazy"
              />
            </div>

            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2 bg-[#FFFFFF]/90 backdrop-blur-xs border border-[#E5E3DD] px-3 py-1.5 rounded-full text-[11px] font-mono-code text-[#7A7770] group-hover:text-[#141413] group-hover:border-[#9A773E] transition-all">
              <Maximize2 className="w-3.5 h-3.5 text-[#9A773E]" />
              <span className="hidden sm:inline">Inspect Mood Board</span>
            </div>
          </div>

          {/* Material & Color Palette Swatches */}
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#E5E3DD]">
              <span className="font-mono-code text-xs uppercase tracking-[0.2em] text-[#9A773E] font-medium">
                Color Palette & Material Tectonic Palette
              </span>
              <span className="font-mono-code text-[11px] text-[#7A7770]">
                5 Harmonious Hues Extracted from Sheet
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {COLOR_PALETTE.map((c) => (
                <div
                  key={c.hex}
                  className="group bg-[#FFFFFF] border border-[#E5E3DD] rounded-sm overflow-hidden p-4 hover:border-[#9A773E] hover:shadow-xs transition-all duration-300"
                >
                  {/* Color Swatch Block */}
                  <div
                    className="w-full h-20 sm:h-24 rounded-xs border border-[#141413]/10 transition-transform duration-300 group-hover:scale-[1.02]"
                    style={{ backgroundColor: c.hex }}
                  />

                  <div className="mt-3.5 space-y-1">
                    <div className="flex items-center justify-between font-mono-code text-[11px]">
                      <span className="font-semibold text-[#141413]">{c.hex}</span>
                    </div>
                    <p className="font-display text-sm text-[#141413] leading-snug">
                      {c.name}
                    </p>
                    <p className="font-mono-code text-[10px] text-[#7A7770] leading-normal pt-1">
                      {c.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. DESIGN DEVELOPMENT — PLAN & SPATIAL DRAWINGS                           */}
      {/* ========================================================================= */}
      <section className="mt-20 md:mt-32 max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16 pb-6 border-b border-[#E5E3DD]">
          <div>
            <div className="inline-flex items-center gap-2 font-mono-code text-xs uppercase tracking-widest text-[#9A773E] mb-2">
              <span className="w-2 h-0.5 bg-[#9A773E]" />
              <span>05 / Spatial Layout & Drawings</span>
            </div>
            <h2 className="font-display font-light text-4xl sm:text-5xl md:text-6xl text-[#141413]">
              Floor Plan & Spatial Layout
            </h2>
            <p className="font-mono-code text-xs md:text-sm text-[#7A7770] mt-2">
              Scale 1:20 · Total Retail Footprint: 30 sq.m (30 m²)
            </p>
          </div>

          <div className="max-w-md">
            <p className="font-mono-code text-xs text-[#5C5751] leading-relaxed">
              Circulation flows intuitively from the glazed entrance portal past three stepped Nama chocolate plinths toward the sculptural service counter at the rear.
            </p>
          </div>
        </div>

        {/* Plan Presentation Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Plan Drawing Image */}
          <div
            onClick={() =>
              setLightboxImage({
                src: '/royce/plan-drawing.png',
                title: 'ROYCE’ Retail Store Architectural Floor Plan',
                subtitle: 'Scale 1:20 · Area: 30 sq.m · Sheet 02',
              })
            }
            {...viewCursor}
            className="lg:col-span-8 group relative cursor-pointer bg-[#FAF8F5] border border-[#E5E3DD] p-4 sm:p-8 rounded-sm hover:border-[#9A773E] transition-all duration-300"
          >
            <div className="w-full flex items-center justify-center">
              <img
                src="/royce/plan-drawing.png"
                alt="ROYCE' Floor Plan Drawing (Scale 1:20)"
                className="w-full max-w-2xl h-auto object-contain transition-transform duration-700 ease-out group-hover:scale-[1.015]"
                loading="lazy"
              />
            </div>

            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2 bg-[#FFFFFF]/90 backdrop-blur-xs border border-[#E5E3DD] px-3 py-1.5 rounded-full text-[11px] font-mono-code text-[#7A7770] group-hover:text-[#141413] group-hover:border-[#9A773E] transition-all">
              <Maximize2 className="w-3.5 h-3.5 text-[#9A773E]" />
              <span className="hidden sm:inline">Inspect Plan (1:20)</span>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E5E3DD] flex items-center justify-between text-[11px] font-mono-code text-[#7A7770]">
              <span>Drawing 02 · Floor Plan</span>
              <span className="text-[#9A773E] font-medium">Scale 1:20 · 30 sq.m</span>
            </div>
          </div>

          {/* Plan Annotations & Spatial Zones Breakdown */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#FAF8F5] border border-[#E5E3DD] p-6 rounded-sm">
              <span className="font-mono-code text-xs uppercase tracking-widest text-[#9A773E] block mb-3 font-medium">
                Spatial Zones & Orientation
              </span>
              <p className="font-mono-code text-xs text-[#7A7770] leading-relaxed mb-4">
                The orientation diamond (A, B, C, D) positioned at the plan center aligns with each corresponding elevation study:
              </p>

              <ul className="space-y-3 font-mono-code text-xs text-[#141413]">
                <li className="flex items-start gap-3 pb-3 border-b border-[#E5E3DD]/60">
                  <span className="h-5 w-5 rounded-full bg-[#141413] text-[#FFFFFF] flex items-center justify-center text-[10px] shrink-0 font-medium">
                    B
                  </span>
                  <div>
                    <span className="font-semibold block">Storefront Entrance Portal</span>
                    <span className="text-[#7A7770] text-[11px]">Floor-to-ceiling glass glazing on Bodakdev avenue</span>
                  </div>
                </li>
                <li className="flex items-start gap-3 pb-3 border-b border-[#E5E3DD]/60">
                  <span className="h-5 w-5 rounded-full bg-[#9A773E] text-[#FFFFFF] flex items-center justify-center text-[10px] shrink-0 font-medium">
                    1
                  </span>
                  <div>
                    <span className="font-semibold block">Stepped Display Plinths</span>
                    <span className="text-[#7A7770] text-[11px]">Three layered stone & oak pedestals for signature Nama chocolates</span>
                  </div>
                </li>
                <li className="flex items-start gap-3 pb-3 border-b border-[#E5E3DD]/60">
                  <span className="h-5 w-5 rounded-full bg-[#141413] text-[#FFFFFF] flex items-center justify-center text-[10px] shrink-0 font-medium">
                    D
                  </span>
                  <div>
                    <span className="font-semibold block">Sculpted Wave Cashier Counter</span>
                    <span className="text-[#7A7770] text-[11px]">Point of sale with 2 customer bar stools & pendant cluster</span>
                  </div>
                </li>
                <li className="flex items-start gap-3 pb-3 border-b border-[#E5E3DD]/60">
                  <span className="h-5 w-5 rounded-full bg-[#141413] text-[#FFFFFF] flex items-center justify-center text-[10px] shrink-0 font-medium">
                    A
                  </span>
                  <div>
                    <span className="font-semibold block">Floating Shelving Wall</span>
                    <span className="text-[#7A7770] text-[11px]">Asymmetric timber display on left boundary wall</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="h-5 w-5 rounded-full bg-[#141413] text-[#FFFFFF] flex items-center justify-center text-[10px] shrink-0 font-medium">
                    C
                  </span>
                  <div>
                    <span className="font-semibold block">Perimeter Grid & Peg Board</span>
                    <span className="text-[#7A7770] text-[11px]">Geometric chocolate library on right boundary wall</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Back of House Note */}
            <div className="p-5 border border-[#E5E3DD] rounded-sm bg-[#FFFFFF] text-xs font-mono-code text-[#7A7770] space-y-1.5">
              <span className="text-[#141413] font-medium block">Back-of-House Facilities:</span>
              <p>Concealed doorway at rear leads to private staff restroom, water basin, and temperature-controlled stock storage.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. DESIGN DEVELOPMENT — ELEVATIONS A, B, C, D                             */}
      {/* ========================================================================= */}
      <section className="mt-20 md:mt-32 max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-[#E5E3DD]">
          <div>
            <div className="inline-flex items-center gap-2 font-mono-code text-xs uppercase tracking-widest text-[#9A773E] mb-2">
              <span className="w-2 h-0.5 bg-[#9A773E]" />
              <span>06 / Architectural Elevations</span>
            </div>
            <h2 className="font-display font-light text-4xl sm:text-5xl md:text-6xl text-[#141413]">
              Sectional Elevations
            </h2>
            <p className="font-mono-code text-xs md:text-sm text-[#7A7770] mt-2">
              Elevations A, B, C & D · Scale 1:20 · All four internal & external spatial planes
            </p>
          </div>

          {/* Elevation Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setActiveElevationTab('all')}
              {...linkCursor}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono-code transition-all ${
                activeElevationTab === 'all'
                  ? 'bg-[#141413] text-[#FFFFFF]'
                  : 'border border-[#E5E3DD] text-[#7A7770] hover:text-[#141413]'
              }`}
            >
              All (4)
            </button>
            {ELEVATIONS.map((e) => (
              <button
                key={e.id}
                onClick={() => setActiveElevationTab(e.id)}
                {...linkCursor}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono-code whitespace-nowrap transition-all ${
                  activeElevationTab === e.id
                    ? 'bg-[#9A773E] text-[#FFFFFF]'
                    : 'border border-[#E5E3DD] text-[#7A7770] hover:text-[#141413]'
                }`}
              >
                {e.title.split('—')[0].trim()}
              </button>
            ))}
          </div>
        </div>

        {/* Stacked / Filtered Elevation Cards */}
        <div className="space-y-12">
          {ELEVATIONS.filter((e) => activeElevationTab === 'all' || activeElevationTab === e.id).map(
            (elevation, index) => (
              <div
                key={elevation.id}
                className="bg-[#FAF8F5] border border-[#E5E3DD] rounded-sm overflow-hidden p-6 sm:p-8 md:p-10 shadow-xs"
              >
                {/* Elevation Drawing Header */}
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 mb-6 pb-4 border-b border-[#E5E3DD]">
                  <div>
                    <span className="font-mono-code text-[11px] uppercase tracking-widest text-[#9A773E] block mb-1">
                      Elevation Study {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="font-display text-2xl sm:text-3xl text-[#141413] font-light">
                      {elevation.title}
                    </h3>
                  </div>
                  <span className="font-mono-code text-xs text-[#7A7770] uppercase tracking-widest">
                    Scale: {elevation.scale}
                  </span>
                </div>

                {/* Elevation Image with Lightbox Trigger */}
                <div
                  onClick={() =>
                    setLightboxImage({
                      src: elevation.src,
                      title: elevation.title,
                      subtitle: `Scale ${elevation.scale} · Architectural Elevation Drawing`,
                    })
                  }
                  {...viewCursor}
                  className="group relative cursor-pointer bg-[#FFFFFF] border border-[#E5E3DD] p-4 sm:p-8 rounded-sm overflow-hidden hover:border-[#9A773E] transition-all duration-300"
                >
                  <div className="w-full flex items-center justify-center">
                    <img
                      src={elevation.src}
                      alt={elevation.title}
                      className="w-full max-w-5xl h-auto object-contain transition-transform duration-700 ease-out group-hover:scale-[1.015]"
                      loading="lazy"
                    />
                  </div>

                  <div className="absolute top-4 right-4 flex items-center gap-2 bg-[#FFFFFF]/90 backdrop-blur-xs border border-[#E5E3DD] px-3 py-1.5 rounded-full text-[11px] font-mono-code text-[#7A7770] group-hover:text-[#141413] group-hover:border-[#9A773E] transition-all">
                    <Maximize2 className="w-3.5 h-3.5 text-[#9A773E]" />
                    <span className="hidden sm:inline">Inspect Drawing</span>
                  </div>
                </div>

                {/* Elevation Description & Highlights */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-start pt-4 border-t border-[#E5E3DD]/70">
                  <p className="md:col-span-8 font-mono-code text-xs sm:text-sm text-[#5C5751] leading-relaxed">
                    {elevation.caption}
                  </p>

                  <div className="md:col-span-4 flex flex-wrap gap-2">
                    {elevation.highlights.map((h) => (
                      <span
                        key={h}
                        className="inline-block px-2.5 py-1 rounded-full bg-[#FFFFFF] border border-[#E5E3DD] text-[10px] font-mono-code text-[#7A7770]"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. PROJECT TAKEAWAY SECTION                                               */}
      {/* ========================================================================= */}
      <section className="mt-24 md:mt-36 bg-[#141413] text-[#FFFFFF] py-20 md:py-28 px-6 md:px-12 relative overflow-hidden">
        {/* Subtle decorative grid/line background */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="w-full h-full bg-[radial-gradient(#FFFFFF_1px,transparent_1px)] [background-size:24px_24px]" />
        </div>

        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 font-mono-code text-xs uppercase tracking-[0.25em] text-[#9A773E]">
            <span className="w-2 h-0.5 bg-[#9A773E]" />
            <span>07 / Project Takeaway</span>
            <span className="w-2 h-0.5 bg-[#9A773E]" />
          </div>

          <h2 className="font-display font-light text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight text-[#FFFFFF] max-w-3xl mx-auto">
            “The design translates ROYCE’s existing brand identity into a minimal, warm and refined retail environment, allowing the products and spatial experience to remain the primary focus.”
          </h2>

          <div className="w-16 h-px bg-[#9A773E] mx-auto pt-2" />

          <div className="pt-4 space-y-2">
            <p className="font-mono-code text-xs tracking-widest uppercase text-[#9A773E] font-medium">
              Mahi Patel — Interior & Spatial Architecture
            </p>
            <p className="font-mono-code text-[11px] text-[#A09E96]">
              Design Studio II · Indus University · Bodakdev, Ahmedabad
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. PROJECT-TO-PROJECT NAVIGATION                                          */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mt-16 md:mt-24">
        <nav
          aria-label="Project Case Study Navigation"
          className="grid grid-cols-2 border-t border-b border-[#E5E3DD]"
        >
          {/* Previous Project Button */}
          <button
            type="button"
            onClick={handleGoPrev}
            aria-label={`Open ${prevProject.name} project`}
            {...linkCursor}
            className="group text-left py-8 md:py-12 pr-4 sm:pr-8 border-r border-[#E5E3DD] transition-colors"
          >
            <span className="flex items-center gap-2 font-mono-code text-[10px] sm:text-xs tracking-widest uppercase text-[#7A7770] group-hover:text-[#9A773E] transition-colors">
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
              <span>Previous Project · {prevProject.number}</span>
            </span>
            <span className="mt-3 block font-display text-xl sm:text-2xl md:text-3xl font-light text-[#141413] group-hover:text-[#9A773E] transition-colors">
              {prevProject.name}
            </span>
            <span className="mt-1 block font-mono-code text-xs text-[#7A7770]">
              {prevProject.type}
            </span>
          </button>

          {/* Next Project Button */}
          <button
            type="button"
            onClick={handleGoNext}
            aria-label={`Open ${nextProject.name} project`}
            {...linkCursor}
            className="group text-right py-8 md:py-12 pl-4 sm:pl-8 transition-colors"
          >
            <span className="flex items-center justify-end gap-2 font-mono-code text-[10px] sm:text-xs tracking-widest uppercase text-[#7A7770] group-hover:text-[#9A773E] transition-colors">
              <span>Next Project · {nextProject.number}</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </span>
            <span className="mt-3 block font-display text-xl sm:text-2xl md:text-3xl font-light text-[#141413] group-hover:text-[#9A773E] transition-colors">
              {nextProject.name}
            </span>
            <span className="mt-1 block font-mono-code text-xs text-[#7A7770]">
              {nextProject.type}
            </span>
          </button>
        </nav>

        {/* Central Return Action */}
        <div className="mt-12 flex justify-center">
          <button
            type="button"
            onClick={handleReturnToProjects}
            {...linkCursor}
            className="px-8 py-3.5 rounded-full border border-[#141413] text-xs font-mono-code tracking-widest uppercase text-[#141413] hover:bg-[#141413] hover:text-[#FFFFFF] transition-all flex items-center gap-2.5 shadow-xs"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to All Projects</span>
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. LIGHTBOX / DRAWING ZOOM MODAL                                          */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 z-50 bg-[#141413]/90 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8"
          >
            {/* Modal Top Bar */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-between text-[#FFFFFF] pb-4 border-b border-[#FFFFFF]/15"
            >
              <div>
                <h4 className="font-display text-lg sm:text-xl font-light text-[#FFFFFF]">
                  {lightboxImage.title}
                </h4>
                {lightboxImage.subtitle && (
                  <p className="font-mono-code text-xs text-[#A09E96]">
                    {lightboxImage.subtitle}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => setLightboxImage(null)}
                className="p-2 rounded-full border border-[#FFFFFF]/20 hover:border-[#FFFFFF] hover:bg-[#FFFFFF]/10 text-[#FFFFFF] transition-colors"
                title="Close Lightbox (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image Viewport */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex-1 flex items-center justify-center p-2 sm:p-6 overflow-auto"
            >
              <img
                src={lightboxImage.src}
                alt={lightboxImage.title}
                className="max-h-[82vh] max-w-full object-contain rounded-xs shadow-2xl bg-[#FFFFFF] p-2 sm:p-4"
              />
            </div>

            {/* Modal Bottom Bar */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-between text-[11px] font-mono-code text-[#A09E96] pt-3 border-t border-[#FFFFFF]/15"
            >
              <span>Press ESC or click anywhere outside to close</span>
              <span>ROYCE’ Retail Interior Architectural Study</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
};
