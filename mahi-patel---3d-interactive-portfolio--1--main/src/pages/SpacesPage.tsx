import React, { useState } from 'react';
import { PageRoute } from '../types';
import { SPATIAL_PROJECTS } from '../data/projects';
import { PreviewTile } from '../scene/PreviewTile';
import { ArrowUpRight } from 'lucide-react';

interface SpacesPageProps {
  onNavigate: (route: PageRoute) => void;
  onCursorChange?: (state: 'default' | 'link' | 'drag-3d' | 'view' | 'copy') => void;
}

export const SpacesPage: React.FC<SpacesPageProps> = ({ onNavigate, onCursorChange }) => {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [hoveredProject, setHoveredProject] = useState<typeof SPATIAL_PROJECTS[0] | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const typologies = ['All', 'Residential Penthouse', 'Creative Studio', 'Boutique Gallery', 'Hospitality Lounge'];

  const filteredSpaces =
    activeFilter === 'All'
      ? SPATIAL_PROJECTS
      : SPATIAL_PROJECTS.filter((p) => p.typology === activeFilter);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <div
      id="spaces-page"
      onMouseMove={handleMouseMove}
      className="relative min-h-screen bg-[#FFFFFF] text-[#141413] pt-28 pb-32 px-6 md:px-14"
    >
      {/* Floating 3D Preview Canvas */}
      <PreviewTile
        imageUrl={hoveredProject?.heroImage || ''}
        title={hoveredProject?.title || ''}
        category={hoveredProject?.typology || ''}
        visible={!!hoveredProject}
        mousePos={mousePos}
      />

      {/* Page Header */}
      <div className="max-w-7xl mx-auto mb-16 space-y-6">
        <div className="flex items-center gap-3 font-mono-code text-xs text-[#9A773E] uppercase tracking-widest">
          <span className="h-1.5 w-1.5 rounded-full bg-[#9A773E]" />
          <span>Index 01 / Spatial Architecture & Interior Sanctuaries</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#E5E3DD]">
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-light text-[#141413]">
            Spaces & Volumes
          </h1>
          <p className="max-w-md font-mono-code text-xs text-[#7A7770] leading-relaxed">
            Atmospheric residences, subterranean galleries, and tactile ateliers. Hover to summon real-time 3D spatial models.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {typologies.map((t) => (
            <button
              key={t}
              onClick={() => setActiveFilter(t)}
              onMouseEnter={() => onCursorChange?.('link')}
              onMouseLeave={() => onCursorChange?.('default')}
              className={`px-4 py-1.5 rounded-full text-xs font-mono-code whitespace-nowrap transition-all duration-300 ${
                activeFilter === t
                  ? 'bg-[#9A773E] text-[#FFFFFF] font-medium shadow-sm'
                  : 'text-[#7A7770] border border-[#E5E3DD] hover:text-[#141413] hover:border-[#141413]/40'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Full-Bleed Editorial Space Rows */}
      <div className="max-w-7xl mx-auto divide-y divide-[#E5E3DD]">
        {filteredSpaces.map((space) => (
          <div
            key={space.id}
            id={`space-row-${space.slug}`}
            onClick={() => onNavigate({ name: 'space-detail', slug: space.slug })}
            onMouseEnter={() => {
              setHoveredProject(space);
              onCursorChange?.('view');
            }}
            onMouseLeave={() => {
              setHoveredProject(null);
              onCursorChange?.('default');
            }}
            className="group relative cursor-pointer py-10 md:py-14 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-500 hover:pl-4"
          >
            {/* Left: Index + Big Display Title */}
            <div className="flex items-start md:items-center gap-6 md:gap-12">
              <span className="font-mono-code text-xs md:text-sm text-[#7A7770] group-hover:text-[#9A773E] transition-colors pt-2 md:pt-0">
                {space.index}
              </span>

              <div className="space-y-2">
                <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-light text-[#141413] group-hover:text-[#9A773E] transition-colors leading-tight">
                  {space.title}
                </h2>
                <p className="font-sans text-xs md:text-sm text-[#6E6C65] group-hover:text-[#141413]/90 transition-colors max-w-xl">
                  {space.subtitle}
                </p>
              </div>
            </div>

            {/* Right: Meta Tags & Arrow */}
            <div className="flex items-center justify-between md:justify-end gap-6 md:gap-10 font-mono-code text-xs text-[#7A7770]">
              <span className="hidden sm:inline px-3 py-1 rounded-full border border-[#E5E3DD] bg-[#F8F8F6] text-[11px] text-[#9A773E]">
                {space.typology}
              </span>
              <span>{space.location}</span>
              <span>{space.area}</span>
              <div className="h-10 w-10 rounded-full border border-[#E5E3DD] flex items-center justify-center group-hover:border-[#9A773E] group-hover:bg-[#9A773E] group-hover:text-[#FFFFFF] transition-all duration-300">
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
