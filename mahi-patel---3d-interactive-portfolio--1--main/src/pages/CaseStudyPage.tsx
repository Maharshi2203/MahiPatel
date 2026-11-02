import React, { useState } from 'react';
import { PageRoute } from '../types';
import { UX_PROJECTS } from '../data/projects';
import { CameraPathViewer } from '../scene/CameraPathViewer';
import { ArrowLeft, ArrowRight, ArrowUpRight, Compass, ShieldCheck, Zap } from 'lucide-react';

interface CaseStudyPageProps {
  slug: string;
  onNavigate: (route: PageRoute) => void;
  onCursorChange?: (state: 'default' | 'link' | 'drag-3d' | 'view' | 'copy') => void;
}

export const CaseStudyPage: React.FC<CaseStudyPageProps> = ({
  slug,
  onNavigate,
  onCursorChange,
}) => {
  const currentIndex = UX_PROJECTS.findIndex((p) => p.slug === slug);
  const project = UX_PROJECTS[currentIndex] || UX_PROJECTS[0];
  const [waypointIndex, setWaypointIndex] = useState(0);

  const prevProject =
    currentIndex > 0 ? UX_PROJECTS[currentIndex - 1] : UX_PROJECTS[UX_PROJECTS.length - 1];
  const nextProject =
    currentIndex < UX_PROJECTS.length - 1 ? UX_PROJECTS[currentIndex + 1] : UX_PROJECTS[0];

  const currentWaypoint = project.waypoints[waypointIndex] || project.waypoints[0];
  const projectImages = [
    project.heroImage,
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop',
  ];

  return (
    <div id="case-study-page" className="relative min-h-screen bg-[#FFFFFF] text-[#141413]">
      {/* ---------------------------------------------------- */}
      {/* 1. PROJECT HEADER                                    */}
      {/* ---------------------------------------------------- */}
      <section className="pt-28 pb-12 px-6 md:px-14 max-w-7xl mx-auto">
        <button
          onClick={() => onNavigate({ name: 'work' })}
          onMouseEnter={() => onCursorChange?.('link')}
          onMouseLeave={() => onCursorChange?.('default')}
          className="inline-flex items-center gap-2 font-mono-code text-xs text-[#7A7770] hover:text-[#9A773E] transition-colors mb-8"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Case Study Index</span>
        </button>

        <div className="space-y-6">
          <div className="flex items-center gap-3 font-mono-code text-xs text-[#9A773E] uppercase tracking-widest">
            <span>Project {project.index}</span>
            <span>/</span>
            <span>{project.category}</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-[#141413] leading-[0.95]">
            {project.title}
          </h1>

          <p className="font-sans text-base md:text-xl text-[#6E6C65] max-w-3xl leading-relaxed">
            {project.subtitle}
          </p>

          {/* Project Meta Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-[#E5E3DD] font-mono-code text-xs">
            <div>
              <span className="text-[#7A7770] block text-[10px] uppercase">Client</span>
              <span className="text-[#141413] font-medium">{project.client}</span>
            </div>
            <div>
              <span className="text-[#7A7770] block text-[10px] uppercase">Role</span>
              <span className="text-[#141413] font-medium">{project.role}</span>
            </div>
            <div>
              <span className="text-[#7A7770] block text-[10px] uppercase">Timeline</span>
              <span className="text-[#141413] font-medium">{project.duration} ({project.year})</span>
            </div>
            <div>
              <span className="text-[#7A7770] block text-[10px] uppercase">Core Tools</span>
              <span className="text-[#9A773E] font-medium">{project.tools.slice(0, 2).join(', ')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 2. 3D CAMERA PATH STAGE                              */}
      {/* ---------------------------------------------------- */}
      <section className="relative w-full h-[70vh] min-h-[500px] max-h-[750px] border-t border-b border-[#E5E3DD] bg-[#FFFFFF] overflow-hidden">
        <CameraPathViewer
          type="ux"
          waypoints={project.waypoints}
          currentWaypointIndex={waypointIndex}
          onWaypointSelect={setWaypointIndex}
          screensOrImages={projectImages}
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
              setWaypointIndex((prev) => (prev > 0 ? prev - 1 : project.waypoints.length - 1))
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
              setWaypointIndex((prev) => (prev < project.waypoints.length - 1 ? prev + 1 : 0))
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
      {/* 3. CASE STUDY IN-DEPTH STORY                         */}
      {/* ---------------------------------------------------- */}
      <section className="py-20 px-6 md:px-14 max-w-5xl mx-auto space-y-20">
        {/* Executive Overview */}
        <div className="space-y-4">
          <span className="font-mono-code text-xs text-[#9A773E] uppercase tracking-widest block">
            01 / Executive Overview
          </span>
          <p className="font-sans text-lg md:text-xl text-[#141413] leading-relaxed">
            {project.overview}
          </p>
        </div>

        {/* Challenge vs Solution Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-8 border-t border-[#E5E3DD]">
          <div className="space-y-3 bg-[#F8F8F6] border border-[#E5E3DD] p-8 rounded-xl">
            <span className="font-mono-code text-xs text-[#7A7770] uppercase tracking-widest block">
              The Fundamental Challenge
            </span>
            <p className="font-sans text-sm text-[#6E6C65] leading-relaxed">
              {project.challenge}
            </p>
          </div>

          <div className="space-y-3 bg-[#FFFFFF] border border-[#9A773E]/40 p-8 rounded-xl shadow-sm">
            <span className="font-mono-code text-xs text-[#9A773E] uppercase tracking-widest block">
              Spatial Architecture Solution
            </span>
            <p className="font-sans text-sm text-[#141413] leading-relaxed">
              {project.solution}
            </p>
          </div>
        </div>

        {/* Quantified Impact Badges */}
        <div className="space-y-6 pt-8 border-t border-[#E5E3DD]">
          <span className="font-mono-code text-xs text-[#9A773E] uppercase tracking-widest block">
            02 / Quantified Outcomes & Industry Impact
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {project.impact.map((metric, idx) => (
              <div
                key={idx}
                className="bg-[#F8F8F6] border border-[#E5E3DD] p-6 rounded-xl space-y-3"
              >
                <span className="font-mono-code text-xs text-[#7A7770]">Impact Vector 0{idx + 1}</span>
                <p className="font-display text-base text-[#141413] font-light leading-snug">
                  {metric}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Screen Deliverables Gallery */}
        <div className="space-y-8 pt-8 border-t border-[#E5E3DD]">
          <div className="flex items-center justify-between">
            <span className="font-mono-code text-xs text-[#9A773E] uppercase tracking-widest">
              03 / High-Fidelity Deliverables
            </span>
            <span className="font-mono-code text-xs text-[#7A7770]">
              {project.screens.length} Screens Documented
            </span>
          </div>

          <div className="space-y-10">
            {project.screens.map((screen, idx) => (
              <div
                key={idx}
                className="border border-[#E5E3DD] bg-[#FFFFFF] rounded-xl overflow-hidden shadow-sm"
              >
                <div className="aspect-[16/9] bg-[#F2F1ED] relative overflow-hidden flex items-center justify-center">
                  <img
                    src={projectImages[idx % projectImages.length]}
                    alt={screen.title}
                    className="w-full h-full object-cover brightness-95"
                  />
                  <div className="absolute top-4 right-4 px-3 py-1 bg-[#FFFFFF]/90 backdrop-blur-md rounded border border-[#E5E3DD] font-mono-code text-xs text-[#9A773E]">
                    FIG 0{idx + 1} // {screen.type.toUpperCase()}
                  </div>
                </div>
                <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-[#E5E3DD]">
                  <h4 className="font-display text-xl text-[#141413] font-light">
                    {screen.title}
                  </h4>
                  <p className="font-sans text-xs text-[#6E6C65] max-w-md">
                    {screen.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 4. PREV / NEXT PROJECT NAV                           */}
      {/* ---------------------------------------------------- */}
      <section className="border-t border-[#E5E3DD] bg-[#F8F8F6]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#E5E3DD]">
          {/* Prev */}
          <div
            onClick={() => onNavigate({ name: 'work-detail', slug: prevProject.slug })}
            onMouseEnter={() => onCursorChange?.('link')}
            onMouseLeave={() => onCursorChange?.('default')}
            className="group cursor-pointer p-8 md:p-14 flex items-center justify-between hover:bg-[#F2F1ED] transition-colors"
          >
            <div className="space-y-2">
              <span className="font-mono-code text-xs text-[#7A7770] block">
                ← Previous Case Study
              </span>
              <h3 className="font-display text-2xl md:text-3xl text-[#141413] font-light group-hover:text-[#9A773E] transition-colors">
                {prevProject.title}
              </h3>
            </div>
            <span className="font-mono-code text-xs text-[#7A7770]">{prevProject.index}</span>
          </div>

          {/* Next */}
          <div
            onClick={() => onNavigate({ name: 'work-detail', slug: nextProject.slug })}
            onMouseEnter={() => onCursorChange?.('link')}
            onMouseLeave={() => onCursorChange?.('default')}
            className="group cursor-pointer p-8 md:p-14 flex items-center justify-between text-right hover:bg-[#F2F1ED] transition-colors"
          >
            <span className="font-mono-code text-xs text-[#7A7770]">{nextProject.index}</span>
            <div className="space-y-2">
              <span className="font-mono-code text-xs text-[#7A7770] block">
                Next Case Study →
              </span>
              <h3 className="font-display text-2xl md:text-3xl text-[#141413] font-light group-hover:text-[#9A773E] transition-colors">
                {nextProject.title}
              </h3>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
