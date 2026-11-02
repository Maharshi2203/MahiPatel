import React, { useState } from 'react';
import { PageRoute } from '../types';
import { SPATIAL_PROJECTS } from '../data/projects';
import { INTERIOR_PROJECTS } from '../data/interiorProjects';
import { CameraPathViewer } from '../scene/CameraPathViewer';
import { ArrowLeft, ArrowRight, ArrowUpRight, Compass, ShieldCheck } from 'lucide-react';

interface SpaceDetailPageProps {
  slug: string;
  onNavigate: (route: PageRoute) => void;
  onCursorChange?: (state: 'default' | 'link' | 'drag-3d' | 'view' | 'copy') => void;
}

export const SpaceDetailPage: React.FC<SpaceDetailPageProps> = ({
  slug,
  onNavigate,
  onCursorChange,
}) => {
  const interiorMatch = INTERIOR_PROJECTS.find((p) => p.slug === slug);
  const spatialIndex = SPATIAL_PROJECTS.findIndex((p) => p.slug === slug);

  const [waypointIndex, setWaypointIndex] = useState(0);

  // Unified project object
  const space = interiorMatch
    ? {
        id: interiorMatch.id,
        slug: interiorMatch.slug,
        index: interiorMatch.id.toUpperCase(),
        title: interiorMatch.title,
        subtitle: interiorMatch.summary,
        typology:
          interiorMatch.category === 'thesis'
            ? 'Research & Speculative Thesis'
            : interiorMatch.category.charAt(0).toUpperCase() + interiorMatch.category.slice(1) + ' Interior',
        year: interiorMatch.year,
        location: interiorMatch.location,
        area: interiorMatch.size || 'Spatial Installation',
        client: interiorMatch.client || 'Commission',
        summary: interiorMatch.summary,
        heroImage: interiorMatch.coverImage,
        materials: interiorMatch.materials.map((m) => m.name),
        lightingConcept: interiorMatch.category === 'thesis'
          ? 'Diurnal circadian illumination calibration and sub-10 lumen nocturnal adaptation'
          : 'Diffused architectural daylight washing monolithic stone and textured timber',
        overview: `${interiorMatch.title} exemplifies Mahi Patel’s practice of quiet spatial luxury and tectonic craftsmanship. Located in ${interiorMatch.location}, this project orchestrates natural illumination, haptic materiality, and proportional restraint.`,
        spatialStrategy:
          'Structured around sequential threshold transitions, spatial compression, and monolithic plinths that anchor contemplation.',
        details: [
          {
            zone: 'Primary Volume',
            description: 'Volumetric sequencing balancing floor-to-ceiling daylight with textured acoustic dampening.',
            specs: interiorMatch.materials[0]?.name || 'Natural Honed Stone',
          },
          {
            zone: 'Haptic Materiality',
            description: 'Hand-rubbed finishes that patinate gracefully with age and touch.',
            specs: interiorMatch.materials[1]?.name || 'Aged Brass Hardware',
          },
        ],
        waypoints: SPATIAL_PROJECTS[0].waypoints,
      }
    : SPATIAL_PROJECTS[spatialIndex >= 0 ? spatialIndex : 0];

  const prevSpace =
    spatialIndex > 0
      ? SPATIAL_PROJECTS[spatialIndex - 1]
      : SPATIAL_PROJECTS[SPATIAL_PROJECTS.length - 1];
  const nextSpace =
    spatialIndex >= 0 && spatialIndex < SPATIAL_PROJECTS.length - 1
      ? SPATIAL_PROJECTS[spatialIndex + 1]
      : SPATIAL_PROJECTS[0];

  const currentWaypoint = space.waypoints[waypointIndex] || space.waypoints[0];
  const spaceImages = interiorMatch?.gallery?.length
    ? [interiorMatch.coverImage, ...interiorMatch.gallery]
    : [
        space.heroImage,
        'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1200&auto=format&fit=crop',
      ];

  return (
    <div id="space-detail-page" className="relative min-h-screen bg-[#FFFFFF] text-[#141413]">
      {/* ---------------------------------------------------- */}
      {/* 1. SPACE HEADER                                      */}
      {/* ---------------------------------------------------- */}
      <section className="pt-28 pb-12 px-6 md:px-14 max-w-7xl mx-auto">
        <button
          onClick={() => onNavigate({ name: 'spaces' })}
          onMouseEnter={() => onCursorChange?.('link')}
          onMouseLeave={() => onCursorChange?.('default')}
          className="inline-flex items-center gap-2 font-mono-code text-xs text-[#7A7770] hover:text-[#9A773E] transition-colors mb-8"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Spaces Index</span>
        </button>

        <div className="space-y-6">
          <div className="flex items-center gap-3 font-mono-code text-xs text-[#9A773E] uppercase tracking-widest">
            <span>Space {space.index}</span>
            <span>/</span>
            <span>{space.typology}</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-[#141413] leading-[0.95]">
            {space.title}
          </h1>

          <p className="font-sans text-base md:text-xl text-[#6E6C65] max-w-3xl leading-relaxed">
            {space.subtitle}
          </p>

          {/* Space Meta Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-[#E5E3DD] font-mono-code text-xs">
            <div>
              <span className="text-[#7A7770] block text-[10px] uppercase">Location</span>
              <span className="text-[#141413] font-medium">{space.location}</span>
            </div>
            <div>
              <span className="text-[#7A7770] block text-[10px] uppercase">Enclosed Area</span>
              <span className="text-[#141413] font-medium">{space.area}</span>
            </div>
            <div>
              <span className="text-[#7A7770] block text-[10px] uppercase">Typology / Year</span>
              <span className="text-[#141413] font-medium">{space.typology} ({space.year})</span>
            </div>
            <div>
              <span className="text-[#7A7770] block text-[10px] uppercase">Client / Context</span>
              <span className="text-[#9A773E] font-medium">{space.client}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 2. 3D CAMERA PATH SPATIAL WALKTHROUGH                */}
      {/* ---------------------------------------------------- */}
      <section className="relative w-full h-[70vh] min-h-[500px] max-h-[750px] border-t border-b border-[#E5E3DD] bg-[#FFFFFF] overflow-hidden">
        <CameraPathViewer
          type="interior"
          waypoints={space.waypoints}
          currentWaypointIndex={waypointIndex}
          onWaypointSelect={setWaypointIndex}
          screensOrImages={spaceImages}
        />

        {/* Pinned Real-time Caption Card overlay */}
        <div className="absolute top-6 left-6 md:left-12 max-w-md z-20 pointer-events-none">
          <div className="bg-[#FFFFFF]/95 backdrop-blur-md border border-[#E5E3DD] p-5 rounded-xl space-y-2 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="font-mono-code text-[10px] text-[#9A773E] uppercase tracking-widest">
                {currentWaypoint.title}
              </span>
              {currentWaypoint.metric && (
                <span className="font-mono-code text-[11px] px-2 py-0.5 rounded bg-[#F2F0EB] text-[#141413] border border-[#E5E3DD]">
                  {currentWaypoint.metric}
                </span>
              )}
            </div>
            <h4 className="font-display text-lg text-[#141413] font-light">
              {currentWaypoint.subtitle}
            </h4>
            <p className="font-sans text-xs text-[#6E6C65] leading-relaxed">
              {currentWaypoint.description}
            </p>
          </div>
        </div>

        {/* Waypoint stepper controls top right */}
        <div className="absolute top-6 right-6 md:right-12 z-20 flex items-center gap-2">
          <button
            onClick={() =>
              setWaypointIndex((prev) => (prev > 0 ? prev - 1 : space.waypoints.length - 1))
            }
            onMouseEnter={() => onCursorChange?.('link')}
            onMouseLeave={() => onCursorChange?.('default')}
            className="h-9 w-9 rounded-full bg-[#FFFFFF]/90 backdrop-blur-md border border-[#E5E3DD] flex items-center justify-center text-[#7A7770] hover:text-[#141413] hover:border-[#9A773E] shadow-sm transition-all"
            title="Previous Waypoint"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() =>
              setWaypointIndex((prev) => (prev < space.waypoints.length - 1 ? prev + 1 : 0))
            }
            onMouseEnter={() => onCursorChange?.('link')}
            onMouseLeave={() => onCursorChange?.('default')}
            className="h-9 w-9 rounded-full bg-[#FFFFFF]/90 backdrop-blur-md border border-[#E5E3DD] flex items-center justify-center text-[#7A7770] hover:text-[#141413] hover:border-[#9A773E] shadow-sm transition-all"
            title="Next Waypoint"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 3. ARCHITECTURAL MANUSCRIPT & DETAILS                */}
      {/* ---------------------------------------------------- */}
      <section className="py-20 px-6 md:px-14 max-w-5xl mx-auto space-y-20">
        {/* Concept & Strategy */}
        <div className="space-y-4">
          <span className="font-mono-code text-xs text-[#9A773E] uppercase tracking-widest block">
            01 / Spatial Intent & Volume Narrative
          </span>
          <p className="font-sans text-lg md:text-xl text-[#141413] leading-relaxed">
            {space.overview}
          </p>
        </div>

        {/* Spatial Strategy vs Lighting Concept */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-8 border-t border-[#E5E3DD]">
          <div className="space-y-3 bg-[#F8F8F6] border border-[#E5E3DD] p-8 rounded-xl">
            <span className="font-mono-code text-xs text-[#7A7770] uppercase tracking-widest block">
              Circulation & Threshold Strategy
            </span>
            <p className="font-sans text-sm text-[#6E6C65] leading-relaxed">
              {space.spatialStrategy}
            </p>
          </div>

          <div className="space-y-3 bg-[#FFFFFF] border border-[#9A773E]/40 p-8 rounded-xl shadow-sm">
            <span className="font-mono-code text-xs text-[#9A773E] uppercase tracking-widest block">
              Lighting Philosophy (Tanizaki Shadows)
            </span>
            <p className="font-sans text-sm text-[#141413] leading-relaxed">
              {space.lightingConcept}
            </p>
          </div>
        </div>

        {/* Material Library Tokens */}
        <div className="space-y-6 pt-8 border-t border-[#E5E3DD]">
          <span className="font-mono-code text-xs text-[#9A773E] uppercase tracking-widest block">
            02 / Tactile Material Specifications
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {space.materials.map((mat, idx) => (
              <div
                key={idx}
                className="bg-[#F8F8F6] border border-[#E5E3DD] p-5 rounded-xl space-y-2"
              >
                <span className="font-mono-code text-[10px] text-[#9A773E] uppercase">Spec 0{idx + 1}</span>
                <p className="font-display text-sm text-[#141413] font-light">
                  {mat}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Architectural Zones */}
        <div className="space-y-8 pt-8 border-t border-[#E5E3DD]">
          <div className="flex items-center justify-between">
            <span className="font-mono-code text-xs text-[#9A773E] uppercase tracking-widest">
              03 / Programmatic Zones & Micro-Details
            </span>
            <span className="font-mono-code text-xs text-[#7A7770]">
              {space.details.length} Zones Documented
            </span>
          </div>

          <div className="space-y-6">
            {space.details.map((detail, idx) => (
              <div
                key={idx}
                className="border border-[#E5E3DD] bg-[#FFFFFF] p-8 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-[#9A773E] shadow-sm transition-colors"
              >
                <div className="space-y-2">
                  <span className="font-mono-code text-xs text-[#9A773E]">Zone 0{idx + 1}</span>
                  <h4 className="font-display text-xl text-[#141413] font-light">
                    {detail.zone}
                  </h4>
                  <p className="font-sans text-xs text-[#6E6C65] max-w-xl">
                    {detail.description}
                  </p>
                </div>
                <div className="font-mono-code text-xs text-[#141413]/80 border-t md:border-t-0 md:border-l border-[#E5E3DD] pt-4 md:pt-0 md:pl-6">
                  <span className="text-[10px] uppercase text-[#7A7770] block">Material Assembly</span>
                  <span>{detail.specs}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 4. PREV / NEXT SPACE NAV                             */}
      {/* ---------------------------------------------------- */}
      <section className="border-t border-[#E5E3DD] bg-[#F8F8F6]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#E5E3DD]">
          {/* Prev */}
          <div
            onClick={() => onNavigate({ name: 'space-detail', slug: prevSpace.slug })}
            onMouseEnter={() => onCursorChange?.('link')}
            onMouseLeave={() => onCursorChange?.('default')}
            className="group cursor-pointer p-8 md:p-14 flex items-center justify-between hover:bg-[#F2F1ED] transition-colors"
          >
            <div className="space-y-2">
              <span className="font-mono-code text-xs text-[#7A7770] block">
                ← Previous Space
              </span>
              <h3 className="font-display text-2xl md:text-3xl text-[#141413] font-light group-hover:text-[#9A773E] transition-colors">
                {prevSpace.title}
              </h3>
            </div>
            <span className="font-mono-code text-xs text-[#7A7770]">{prevSpace.index}</span>
          </div>

          {/* Next */}
          <div
            onClick={() => onNavigate({ name: 'space-detail', slug: nextSpace.slug })}
            onMouseEnter={() => onCursorChange?.('link')}
            onMouseLeave={() => onCursorChange?.('default')}
            className="group cursor-pointer p-8 md:p-14 flex items-center justify-between text-right hover:bg-[#F2F1ED] transition-colors"
          >
            <span className="font-mono-code text-xs text-[#7A7770]">{nextSpace.index}</span>
            <div className="space-y-2">
              <span className="font-mono-code text-xs text-[#7A7770] block">
                Next Space →
              </span>
              <h3 className="font-display text-2xl md:text-3xl text-[#141413] font-light group-hover:text-[#9A773E] transition-colors">
                {nextSpace.title}
              </h3>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
