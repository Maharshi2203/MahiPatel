import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Maximize2,
  X,
  Layers,
  Home,
  Tag,
  GraduationCap,
} from 'lucide-react';
import { CursorState, PageRoute } from '../types';
import { FEATURED_PROJECTS, wrapProjectIndex, projectIndexBySlug } from '../data/featuredProjects';

interface VillaProjectPageProps {
  onBack?: () => void;
  onNavigate?: (route: PageRoute) => void;
  onOpenProject?: (index: number) => void;
  onCursorChange?: (state: CursorState, text?: string) => void;
}

// Material palette sampled directly from the rendered villa sheets
const MATERIAL_PALETTE = [
  {
    name: 'White Statuario Marble',
    hex: '#E6E6E6',
    description: 'Continuous ground floor flooring through living, dining & circulation',
  },
  {
    name: 'Blush Ceramic Tile',
    hex: '#E9D7D0',
    description: 'Feature wall cladding in the first floor bathrooms',
  },
  {
    name: 'Natural Oak Veneer',
    hex: '#BC9069',
    description: 'Kitchen tall units, wall paneling & bedroom joinery',
  },
  {
    name: 'Walnut Timber',
    hex: '#845434',
    description: 'Entrance deck, dining table & fluted headboard panels',
  },
  {
    name: 'Sage Green Tile',
    hex: '#818F7C',
    description: 'Ground floor wet areas & accent upholstery',
  },
  {
    name: 'Nero Marquina Stone',
    hex: '#3E3E3E',
    description: 'Staircase treads, kitchen counter & dark accent reveals',
  },
];

interface PlanZone {
  marker: string;
  title: string;
  note: string;
}

interface Drawing {
  id: string;
  title: string;
  shortTitle: string;
  sheet: string;
  src: string;
  caption: string;
  highlights: string[];
  zones?: PlanZone[];
}

// 1–2 · Furniture layout plans
const FLOOR_PLANS: Drawing[] = [
  {
    id: 'ground-floor',
    title: 'Ground Floor Plan — Furniture Layout',
    shortTitle: 'Ground Floor',
    sheet: '13',
    src: '/projects/villa/01-ground-floor-plan.jpg',
    caption:
      'The public level of the house. Kitchen, dining and living run as one open marble-floored volume beside the staircase, with a guest bedroom and wet areas along the west edge. A timber deck and covered car porch form the entrance, set within a landscaped garden with a lily pond and shaded seating.',
    highlights: ['Open kitchen–dining–living', 'Guest bedroom', 'Car porch & timber deck', 'Landscaped garden & pond'],
    zones: [
      { marker: '1', title: 'Kitchen', note: 'Parallel counter with hob, sink & breakfast island' },
      { marker: '2', title: 'Dining', note: 'Six-seater walnut table at the heart of the plan' },
      { marker: '3', title: 'Living', note: 'Sofa lounge with round coffee table facing the deck' },
      { marker: '4', title: 'Guest Bedroom', note: 'Double bed with full-height wardrobe & attached bath' },
      { marker: '5', title: 'Entrance & Car Porch', note: 'Stone-paved porch, walnut deck & garden path' },
    ],
  },
  {
    id: 'first-floor',
    title: 'First Floor Plan — Furniture Layout',
    shortTitle: 'First Floor',
    sheet: '14',
    src: '/projects/villa/02-first-floor-plan.jpg',
    caption:
      'The private level. Two bedroom suites sit at either end of the plan, linked by a family lounge at the top of the stair. Each bedroom has its own bathroom and dressing storage, keeping the upper floor quiet and self-contained.',
    highlights: ['Two bedroom suites', 'Family lounge', 'Attached bathrooms', 'Dressing & wardrobe walls'],
    zones: [
      { marker: '1', title: 'Bedroom 1', note: 'Double bed, wardrobe wall & attached bathroom' },
      { marker: '2', title: 'Family Lounge', note: 'Curved sofa and accent chair at the stair landing' },
      { marker: '3', title: 'Bedroom 2', note: 'Grey marble suite with dressing & wardrobe' },
      { marker: '4', title: 'Bathrooms', note: 'Terrazzo & tiled wet areas serving each suite' },
    ],
  },
];

// 3–6 · Interior sections
const SECTIONS: Drawing[] = [
  {
    id: 'section-aa',
    title: 'Section AA’ — Living, Dining & Bedrooms',
    shortTitle: 'Section AA’',
    sheet: '15',
    src: '/projects/villa/03-section-aa.jpg',
    caption:
      'A longitudinal cut through the main rooms. At ground level the living room’s sculptural wall art leads to the dining area under pendant lights and the curtained guest bedroom. Above, a bedroom opens onto a balcony, followed by the brick-walled lounge and a bedroom with an arched feature wallpaper.',
    highlights: ['Sculptural living wall art', 'Pendant-lit dining', 'Balcony bedroom', 'Arched wallpaper niche'],
  },
  {
    id: 'section-bb',
    title: 'Section BB’ — Kitchen, Staircase & Bathrooms',
    shortTitle: 'Section BB’',
    sheet: '16',
    src: '/projects/villa/04-section-bb.jpg',
    caption:
      'A cross-section through the service core. The kitchen shows grey and oak cabinetry with a black chimney hood, next to the black-marble staircase and a brick-clad wall. Above, the bathroom pairs blush wall tiles with a fluted vanity and an arched mirror. The car porch sits to the right.',
    highlights: ['Kitchen cabinetry elevation', 'Black marble staircase', 'Fluted vanity & arched mirror', 'Car porch'],
  },
  {
    id: 'section-cc',
    title: 'Section CC’ — Bedroom & Kitchen Elevations',
    shortTitle: 'Section CC’',
    sheet: '17',
    src: '/projects/villa/05-section-cc.jpg',
    caption:
      'A cut showing the guest bedroom headboard wall: fluted walnut panels, terracotta tiles and brass pendant lights, followed by the kitchen’s tall units and refrigerator. Upstairs, a bedroom with a green upholstered day-bed sits beside full-height sliding glass, next to the blush-tiled bathroom.',
    highlights: ['Fluted walnut headboard wall', 'Brass bedside pendants', 'Kitchen tall units', 'Sliding glass & day-bed'],
  },
  {
    id: 'section-dd',
    title: 'Section DD’ — Entrance, Swing Lounge & Bedroom',
    shortTitle: 'Section DD’',
    sheet: '18',
    src: '/projects/villa/06-section-dd.jpg',
    caption:
      'A cut through the front of the house. At ground level a fluted walnut entrance door sits against a whitewashed brick wall, opening into a double-glazed lounge with a timber swing hung from the ceiling. Above, the bathroom’s white stack-bond tiles and wire-frame vanity sit beside a bedroom with a striped day-bed and twisted pendant lights. The landscaped courtyard sits to the right.',
    highlights: ['Fluted walnut entrance door', 'Hanging timber swing', 'Striped day-bed & pendants', 'Courtyard planting'],
  },
];

// 7–10 · Interior views — Bedroom 1, Bedroom 2, Bathroom, Kitchen
const INTERIOR_VIEWS: Drawing[] = [
  {
    id: 'bedroom-1',
    title: 'Bedroom 1 — Plan & Elevations',
    shortTitle: 'Bedroom 1',
    sheet: '19',
    src: '/projects/villa/07-bedroom-1.jpg',
    caption:
      'A sage-green bedroom drawn in plan and four elevations. The bed sits under an arched niche of patterned wallpaper, with a green upholstered headboard and walnut side tables. The other walls hold a window seat, a TV and dressing wall with a sculptural mirror panel, and a wardrobe with arched oak-and-white shutters.',
    highlights: ['Arched wallpaper niche', 'Green upholstered headboard', 'Arched wardrobe shutters', 'Dressing & TV wall'],
  },
  {
    id: 'bedroom-2',
    title: 'Bedroom 2 — Folding Elevation',
    shortTitle: 'Bedroom 2',
    sheet: '21',
    src: '/projects/villa/08-bedroom-2.jpg',
    caption:
      'The four walls of the second bedroom unfolded around a terrazzo-floored plan. A walnut wardrobe with cream inlays, a dressing unit with a full-length mirror and abstract art, and a curtained window lead to the headboard wall: fluted walnut panels, terracotta tiles and brass bedside lights.',
    highlights: ['Folding elevation', 'Walnut wardrobe', 'Fluted headboard & terracotta tiles', 'Terrazzo flooring'],
  },
  {
    id: 'bathroom',
    title: 'Bathroom — Plan & Elevations',
    shortTitle: 'Bathroom',
    sheet: '20',
    src: '/projects/villa/09-bathroom.jpg',
    caption:
      'A compact bathroom finished in blush ceramic tiles and oak. A fluted vanity with a vessel basin sits under a tall arched mirror, with brushed-brass fittings throughout. A glass partition separates the shower, and a terrazzo floor marks the wet zone in plan.',
    highlights: ['Blush ceramic tiles', 'Fluted vanity & arched mirror', 'Brass fittings', 'Terrazzo wet zone'],
  },
  {
    id: 'kitchen',
    title: 'Kitchen — Plan & Sections',
    shortTitle: 'Kitchen',
    sheet: '22',
    src: '/projects/villa/10-kitchen.jpg',
    caption:
      'A parallel kitchen in grey and natural oak, drawn in plan and four sections. The cooking wall pairs a black chimney hood with fluted-glass wall cabinets, while the opposite run holds the tall oak units, a built-in oven and the refrigerator. A fluted-glass sliding door closes the utility area.',
    highlights: ['Parallel layout', 'Grey & oak cabinetry', 'Chimney hood & hob', 'Tall units & refrigerator'],
  },
];

export const VillaProjectPage: React.FC<VillaProjectPageProps> = ({
  onBack,
  onNavigate,
  onOpenProject,
  onCursorChange,
}) => {
  const [activeSectionTab, setActiveSectionTab] = useState<string>('all');
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

  const currentProjectIdx = projectIndexBySlug('villa');
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

  const openDrawing = (d: Drawing, kind: string) =>
    setLightboxImage({ src: d.src, title: d.title, subtitle: `Sheet ${d.sheet} · ${kind}` });

  const renderDrawingCard = (d: Drawing, label: string, kind: string) => (
    <div
      key={d.id}
      className="bg-[#FAF8F5] border border-[#E5E3DD] rounded-sm overflow-hidden p-6 sm:p-8 md:p-10 shadow-xs"
    >
      {/* Drawing Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 mb-6 pb-4 border-b border-[#E5E3DD]">
        <div>
          <span className="font-mono-code text-[11px] uppercase tracking-widest text-[#9A773E] block mb-1">
            {label}
          </span>
          <h3 className="font-display text-2xl sm:text-3xl text-[#141413] font-light">
            {d.title}
          </h3>
        </div>
        <span className="font-mono-code text-xs text-[#7A7770] uppercase tracking-widest">
          Sheet {d.sheet}
        </span>
      </div>

      {/* Drawing Image with Lightbox Trigger */}
      <div
        onClick={() => openDrawing(d, kind)}
        {...viewCursor}
        className="group relative cursor-pointer bg-[#FFFFFF] border border-[#E5E3DD] p-4 sm:p-8 rounded-sm overflow-hidden hover:border-[#9A773E] transition-all duration-300"
      >
        <div className="w-full flex items-center justify-center">
          <img
            src={d.src}
            alt={d.title}
            className="w-full max-w-5xl h-auto object-contain transition-transform duration-700 ease-out group-hover:scale-[1.015]"
            loading="lazy"
          />
        </div>

        <div className="absolute top-4 right-4 flex items-center gap-2 bg-[#FFFFFF]/90 backdrop-blur-xs border border-[#E5E3DD] px-3 py-1.5 rounded-full text-[11px] font-mono-code text-[#7A7770] group-hover:text-[#141413] group-hover:border-[#9A773E] transition-all">
          <Maximize2 className="w-3.5 h-3.5 text-[#9A773E]" />
          <span className="hidden sm:inline">Inspect Drawing</span>
        </div>
      </div>

      {/* Description & Highlights */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-start pt-4 border-t border-[#E5E3DD]/70">
        <p className="md:col-span-8 font-mono-code text-xs sm:text-sm text-[#5C5751] leading-relaxed">
          {d.caption}
        </p>

        <div className="md:col-span-4 flex flex-wrap gap-2">
          {d.highlights.map((h) => (
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
  );

  return (
    <article
      id="villa-project-case-study"
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
              <span>Project Case Study {FEATURED_PROJECTS[currentProjectIdx].number}</span>
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
                VILLA
              </h1>
              <p className="font-serif italic text-lg sm:text-xl md:text-2xl text-[#9A773E] tracking-wide">
                Residential Interior Design
              </p>
              <p className="max-w-xl font-mono-code text-xs md:text-sm text-[#7A7770] leading-relaxed pt-2">
                A two-storey family residence set in a landscaped garden — resolved through <span className="text-[#141413] font-medium">rendered furniture layouts and interior sections</span> that carry a warm palette of marble, oak and walnut through every room.
              </p>
            </div>

            {/* Project Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 lg:min-w-[420px] bg-[#FAF8F5] border border-[#E5E3DD] p-6 sm:p-8 rounded-sm">
              <div className="space-y-1">
                <span className="font-mono-code text-[11px] uppercase tracking-widest text-[#9A773E] flex items-center gap-1.5 font-medium">
                  <Home className="w-3.5 h-3.5" /> Typology
                </span>
                <p className="font-display text-base sm:text-lg text-[#141413] leading-snug">
                  Residential Villa (G+1)
                </p>
                <p className="font-mono-code text-xs text-[#7A7770]">Private family residence</p>
              </div>

              <div className="space-y-1">
                <span className="font-mono-code text-[11px] uppercase tracking-widest text-[#9A773E] flex items-center gap-1.5 font-medium">
                  <Layers className="w-3.5 h-3.5" /> Project Focus
                </span>
                <p className="font-display text-base sm:text-lg text-[#141413] leading-snug">
                  Furniture Layout & Interior Sections
                </p>
                <p className="font-mono-code text-xs text-[#7A7770]">Rendered drawing set</p>
              </div>

              <div className="space-y-1 pt-2 sm:pt-0 sm:border-t-0 border-t border-[#E5E3DD]/70">
                <span className="font-mono-code text-[11px] uppercase tracking-widest text-[#9A773E] flex items-center gap-1.5 font-medium">
                  <Tag className="w-3.5 h-3.5" /> Programme
                </span>
                <p className="font-display text-base sm:text-lg text-[#141413] leading-snug">
                  3 Bedrooms · Living · Dining · Kitchen
                </p>
                <p className="font-mono-code text-xs text-[#7A7770]">With family lounge & car porch</p>
              </div>

              <div className="space-y-1 pt-2 sm:pt-0 sm:border-t-0 border-t border-[#E5E3DD]/70">
                <span className="font-mono-code text-[11px] uppercase tracking-widest text-[#9A773E] flex items-center gap-1.5 font-medium">
                  <GraduationCap className="w-3.5 h-3.5" /> Academic Studio
                </span>
                <p className="font-display text-base sm:text-lg text-[#141413] leading-snug">
                  CAD IV
                </p>
                <p className="font-mono-code text-xs text-[#7A7770]">IDS, Indus University</p>
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
                A Home Organised from Public to Private
              </h2>
              <p className="font-mono-code text-xs text-[#7A7770] leading-relaxed pt-2">
                A complete residential interior, drawn from furniture layout down to the finish of each wall.
              </p>
            </div>

            <div className="lg:col-span-8 bg-[#FFFFFF] border border-[#E5E3DD] p-8 sm:p-12 rounded-sm shadow-xs relative">
              <div className="space-y-6 text-[#141413]">
                <p className="font-serif italic text-lg sm:text-xl md:text-2xl leading-relaxed text-[#2C2926]">
                  The ground floor gathers the family — kitchen, dining and living flow into one open space that opens onto the garden.
                </p>
                <div className="w-12 h-px bg-[#9A773E]" />
                <p className="font-display font-light text-base sm:text-lg leading-relaxed text-[#5C5751]">
                  The first floor is kept for rest: two bedroom suites with their own bathrooms, connected by a family lounge at the top of the stair. Sections through every room record the wall finishes, joinery and lighting of each space.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-[#E5E3DD] flex flex-wrap items-center justify-between gap-4 font-mono-code text-xs text-[#7A7770]">
                <span>Drawing Set: Plans, Sections & Room Studies · Sheets 13–22</span>
                <span className="text-[#9A773E] font-medium">CAD IV · Indus University</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. MATERIAL PALETTE                                                       */}
      {/* ========================================================================= */}
      <section className="mt-16 md:mt-24 max-w-7xl mx-auto px-6 md:px-12">
        <div className="bg-[#FAF8F5] border border-[#E5E3DD] p-6 sm:p-10 md:p-14 rounded-sm">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-[#E5E3DD]">
            <div>
              <div className="inline-flex items-center gap-2 font-mono-code text-xs uppercase tracking-widest text-[#9A773E] mb-2">
                <span className="w-2 h-0.5 bg-[#9A773E]" />
                <span>03 / Material Language</span>
              </div>
              <h2 className="font-display font-light text-3xl sm:text-4xl md:text-5xl text-[#141413]">
                Material & Colour Palette
              </h2>
            </div>
            <p className="max-w-md font-mono-code text-xs text-[#7A7770] leading-relaxed">
              Pale marble floors set a calm base, warmed by oak and walnut joinery, with blush and sage tiles giving each wet area its own character.
            </p>
          </div>

          <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#E5E3DD]">
            <span className="font-mono-code text-xs uppercase tracking-[0.2em] text-[#9A773E] font-medium">
              Finishes Across the Residence
            </span>
            <span className="font-mono-code text-[11px] text-[#7A7770]">
              6 Tones Sampled from the Sheets
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {MATERIAL_PALETTE.map((c) => (
              <div
                key={c.hex}
                className="group bg-[#FFFFFF] border border-[#E5E3DD] rounded-sm overflow-hidden p-4 hover:border-[#9A773E] hover:shadow-xs transition-all duration-300"
              >
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
      </section>

      {/* ========================================================================= */}
      {/* 4. FLOOR PLANS — GROUND & FIRST                                           */}
      {/* ========================================================================= */}
      <section className="mt-20 md:mt-32 max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16 pb-6 border-b border-[#E5E3DD]">
          <div>
            <div className="inline-flex items-center gap-2 font-mono-code text-xs uppercase tracking-widest text-[#9A773E] mb-2">
              <span className="w-2 h-0.5 bg-[#9A773E]" />
              <span>04 / Spatial Layout & Drawings</span>
            </div>
            <h2 className="font-display font-light text-4xl sm:text-5xl md:text-6xl text-[#141413]">
              Floor Plans
            </h2>
            <p className="font-mono-code text-xs md:text-sm text-[#7A7770] mt-2">
              Ground & First Floor · Rendered Furniture Layouts
            </p>
          </div>

          <div className="max-w-md">
            <p className="font-mono-code text-xs text-[#5C5751] leading-relaxed">
              Living spaces gather on the ground floor around the central staircase; the bedrooms rise above it, each with its own bathroom.
            </p>
          </div>
        </div>

        <div className="space-y-16">
          {FLOOR_PLANS.map((plan, index) => (
            <div key={plan.id} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Plan Drawing Image */}
              <div
                onClick={() => openDrawing(plan, 'Furniture Layout Plan')}
                {...viewCursor}
                className="lg:col-span-8 group relative cursor-pointer bg-[#FAF8F5] border border-[#E5E3DD] p-4 sm:p-8 rounded-sm hover:border-[#9A773E] transition-all duration-300"
              >
                <div className="w-full flex items-center justify-center">
                  <img
                    src={plan.src}
                    alt={plan.title}
                    className="w-full h-auto object-contain transition-transform duration-700 ease-out group-hover:scale-[1.015]"
                    loading="lazy"
                  />
                </div>

                <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2 bg-[#FFFFFF]/90 backdrop-blur-xs border border-[#E5E3DD] px-3 py-1.5 rounded-full text-[11px] font-mono-code text-[#7A7770] group-hover:text-[#141413] group-hover:border-[#9A773E] transition-all">
                  <Maximize2 className="w-3.5 h-3.5 text-[#9A773E]" />
                  <span className="hidden sm:inline">Inspect Plan</span>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E5E3DD] flex items-center justify-between text-[11px] font-mono-code text-[#7A7770]">
                  <span>Drawing {String(index + 1).padStart(2, '0')} · {plan.title}</span>
                  <span className="text-[#9A773E] font-medium">Sheet {plan.sheet}</span>
                </div>
              </div>

              {/* Spatial Zones Breakdown */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-[#FAF8F5] border border-[#E5E3DD] p-6 rounded-sm">
                  <span className="font-mono-code text-xs uppercase tracking-widest text-[#9A773E] block mb-3 font-medium">
                    {plan.shortTitle} · Spatial Zones
                  </span>
                  <p className="font-mono-code text-xs text-[#7A7770] leading-relaxed mb-4">
                    {plan.caption}
                  </p>

                  <ul className="space-y-3 font-mono-code text-xs text-[#141413]">
                    {plan.zones?.map((z, zi) => (
                      <li
                        key={z.title}
                        className={`flex items-start gap-3 ${zi < (plan.zones?.length ?? 0) - 1 ? 'pb-3 border-b border-[#E5E3DD]/60' : ''}`}
                      >
                        <span
                          className={`h-5 w-5 rounded-full ${zi % 2 ? 'bg-[#9A773E]' : 'bg-[#141413]'} text-[#FFFFFF] flex items-center justify-center text-[10px] shrink-0 font-medium`}
                        >
                          {z.marker}
                        </span>
                        <div>
                          <span className="font-semibold block">{z.title}</span>
                          <span className="text-[#7A7770] text-[11px]">{z.note}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. SECTIONS AA, BB, CC, DD                                                */}
      {/* ========================================================================= */}
      <section className="mt-20 md:mt-32 max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-[#E5E3DD]">
          <div>
            <div className="inline-flex items-center gap-2 font-mono-code text-xs uppercase tracking-widest text-[#9A773E] mb-2">
              <span className="w-2 h-0.5 bg-[#9A773E]" />
              <span>05 / Interior Sections</span>
            </div>
            <h2 className="font-display font-light text-4xl sm:text-5xl md:text-6xl text-[#141413]">
              Sectional Studies
            </h2>
            <p className="font-mono-code text-xs md:text-sm text-[#7A7770] mt-2">
              {SECTIONS.map((s) => s.shortTitle).join(' · ')} · Wall finishes, joinery & lighting
            </p>
          </div>

          {/* Section Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setActiveSectionTab('all')}
              {...linkCursor}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono-code transition-all ${
                activeSectionTab === 'all'
                  ? 'bg-[#141413] text-[#FFFFFF]'
                  : 'border border-[#E5E3DD] text-[#7A7770] hover:text-[#141413]'
              }`}
            >
              All ({SECTIONS.length})
            </button>
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSectionTab(s.id)}
                {...linkCursor}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono-code whitespace-nowrap transition-all ${
                  activeSectionTab === s.id
                    ? 'bg-[#9A773E] text-[#FFFFFF]'
                    : 'border border-[#E5E3DD] text-[#7A7770] hover:text-[#141413]'
                }`}
              >
                {s.shortTitle}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-12">
          {SECTIONS.filter((s) => activeSectionTab === 'all' || activeSectionTab === s.id).map((s) =>
            renderDrawingCard(
              s,
              `Section Study ${String(SECTIONS.indexOf(s) + 1).padStart(2, '0')}`,
              'Interior Section Drawing'
            )
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. INTERIOR VIEWS — BEDROOMS, BATHROOM, KITCHEN (shown once added)        */}
      {/* ========================================================================= */}
      {INTERIOR_VIEWS.length > 0 && (
        <section className="mt-20 md:mt-32 max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-[#E5E3DD]">
            <div>
              <div className="inline-flex items-center gap-2 font-mono-code text-xs uppercase tracking-widest text-[#9A773E] mb-2">
                <span className="w-2 h-0.5 bg-[#9A773E]" />
                <span>06 / Room Interiors</span>
              </div>
              <h2 className="font-display font-light text-4xl sm:text-5xl md:text-6xl text-[#141413]">
                Room Studies
              </h2>
              <p className="font-mono-code text-xs md:text-sm text-[#7A7770] mt-2">
                {INTERIOR_VIEWS.map((v) => v.shortTitle).join(' · ')} · Plans & elevations
              </p>
            </div>
          </div>

          <div className="space-y-12">
            {INTERIOR_VIEWS.map((v, i) =>
              renderDrawingCard(v, `Room Study ${String(i + 1).padStart(2, '0')}`, 'Interior Room Study')
            )}
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 7. PROJECT TAKEAWAY SECTION                                               */}
      {/* ========================================================================= */}
      <section className="mt-24 md:mt-36 bg-[#141413] text-[#FFFFFF] py-20 md:py-28 px-6 md:px-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="w-full h-full bg-[radial-gradient(#FFFFFF_1px,transparent_1px)] [background-size:24px_24px]" />
        </div>

        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 font-mono-code text-xs uppercase tracking-[0.25em] text-[#9A773E]">
            <span className="w-2 h-0.5 bg-[#9A773E]" />
            <span>{INTERIOR_VIEWS.length > 0 ? '07' : '06'} / Project Takeaway</span>
            <span className="w-2 h-0.5 bg-[#9A773E]" />
          </div>

          <h2 className="font-display font-light text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight text-[#FFFFFF] max-w-3xl mx-auto">
            An open, light-filled family level below and calm private suites above — tied together by one consistent palette of marble, oak and walnut.
          </h2>

          <div className="w-16 h-px bg-[#9A773E] mx-auto pt-2" />

          <div className="pt-4 space-y-2">
            <p className="font-mono-code text-xs tracking-widest uppercase text-[#9A773E] font-medium">
              Mahi Patel — Interior & Spatial Architecture
            </p>
            <p className="font-mono-code text-[11px] text-[#A09E96]">
              CAD IV · IDS, Indus University
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

            <div
              onClick={(e) => e.stopPropagation()}
              data-lenis-prevent className="flex-1 flex items-center justify-center p-2 sm:p-6 overflow-auto"
            >
              <img
                src={lightboxImage.src}
                alt={lightboxImage.title}
                className="max-h-[82vh] max-w-full object-contain rounded-xs shadow-2xl bg-[#FFFFFF] p-2 sm:p-4"
              />
            </div>

            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-between text-[11px] font-mono-code text-[#A09E96] pt-3 border-t border-[#FFFFFF]/15"
            >
              <span>Press ESC or click anywhere outside to close</span>
              <span>Villa Residential Interior Study</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
};
