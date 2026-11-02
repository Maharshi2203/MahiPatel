import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { CursorState, FeaturedProject } from '../../types';
import { FEATURED_PROJECTS, wrapProjectIndex } from '../../data/featuredProjects';
import { getProjectModelViews, MODEL_VIEW_LABELS } from '../../scene/projectModels';
import { ProjectImageSlider, Slide } from './ProjectImageSlider';

interface ProjectDetailProps {
  project: FeaturedProject;
  index: number;
  onBack: () => void;
  onOpenProject: (index: number) => void;
  onCursorChange?: (state: CursorState, text?: string) => void;
}

const EASE = [0.76, 0, 0.24, 1] as const;

export const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, index, onBack, onOpenProject, onCursorChange }) => {
  const reduced = !!useReducedMotion();
  const [slides, setSlides] = useState<Slide[] | null>(null);

  // Project photographs first, then generated architectural views of the model
  useEffect(() => {
    let cancelled = false;
    setSlides(project.images.length ? project.images : null);
    // Wait for the pixel reveal to finish before rendering views (they are GPU-heavy)
    const timer = window.setTimeout(() => {
      getProjectModelViews(project)
        .then((views) => {
          if (cancelled) return;
          setSlides([...project.images, ...views.map((v) => ({ src: v.src, caption: MODEL_VIEW_LABELS[v.kind] }))]);
        })
        .catch((err) => {
          console.error(`Could not render model views for ${project.name}`, err);
          if (!cancelled) setSlides(project.images);
        });
    }, 550);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [project]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onBack();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onBack]);

  const prev = FEATURED_PROJECTS[wrapProjectIndex(index - 1)];
  const next = FEATURED_PROJECTS[wrapProjectIndex(index + 1)];

  const rise = (delay: number) => ({
    initial: { y: reduced ? 0 : 24, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.7, ease: EASE, delay: reduced ? 0 : delay },
  });

  const link = (state: CursorState = 'link') => ({
    onMouseEnter: () => onCursorChange?.(state),
    onMouseLeave: () => onCursorChange?.('default'),
  });

  return (
    <article id={`project-detail-${project.slug}`} className="pt-44 sm:pt-32 md:pt-28 pb-16" aria-labelledby="project-detail-title">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          {...link()}
          className="group inline-flex items-center gap-3 font-mono-code text-[11px] tracking-widest uppercase text-[#7A7770] hover:text-[#141413] transition-colors"
        >
          <span className="h-9 w-9 rounded-full border border-[#E5E3DD] flex items-center justify-center group-hover:border-[#141413] transition-colors">
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          </span>
          <span>All projects</span>
        </button>
        <span className="font-mono-code text-[11px] tracking-widest text-[#A09E96]">
          {project.number} / {String(FEATURED_PROJECTS.length).padStart(2, '0')}
        </span>
      </div>

      {/* Title block */}
      <header className="mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-end">
        <div className="md:col-span-7">
          <motion.span {...rise(0.05)} className="block font-display font-light text-7xl md:text-8xl leading-none text-[#141413] tabular-nums">
            {project.number}
          </motion.span>
          <motion.h1
            id="project-detail-title"
            {...rise(0.12)}
            className="mt-4 font-display font-light text-4xl sm:text-5xl md:text-6xl tracking-tight text-[#141413] leading-[1.05]"
          >
            {project.name}
          </motion.h1>
          <motion.div {...rise(0.2)} className="mt-4 flex items-center gap-3">
            <span className="h-px w-10 bg-[#141413]" />
            <span className="font-mono-code text-xs tracking-[0.22em] uppercase text-[#9A773E]">{project.type}</span>
          </motion.div>
        </div>
        <motion.p {...rise(0.28)} className="md:col-span-5 text-sm md:text-base leading-relaxed text-[#6E6C65]">
          {project.description}
        </motion.p>
      </header>

      {/* Slides */}
      <motion.div {...rise(0.3)} className="mt-10 md:mt-14">
        <ProjectImageSlider key={project.slug} slides={slides} projectName={project.name} onCursorChange={onCursorChange} />
      </motion.div>

      {/* Project information */}
      <motion.section {...rise(0.4)} className="mt-14 md:mt-20 grid grid-cols-1 md:grid-cols-12 gap-8 border-t border-[#E5E3DD] pt-8">
        <h2 className="md:col-span-4 font-mono-code text-[11px] tracking-widest uppercase text-[#9A773E]">Project Information</h2>
        <dl className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div>
            <dt className="font-mono-code text-[10px] tracking-widest uppercase text-[#A09E96]">Project</dt>
            <dd className="mt-1 font-display text-lg text-[#141413]">{project.number}</dd>
          </div>
          {project.details.map((d) => (
            <div key={d.label}>
              <dt className="font-mono-code text-[10px] tracking-widest uppercase text-[#A09E96]">{d.label}</dt>
              <dd className="mt-1 font-display text-lg text-[#141413] leading-snug">{d.value}</dd>
            </div>
          ))}
        </dl>
      </motion.section>

      {/* Project-to-project navigation */}
      <nav aria-label="Project navigation" className="mt-14 md:mt-20 grid grid-cols-2 border-t border-b border-[#E5E3DD]">
        <button
          type="button"
          onClick={() => onOpenProject(wrapProjectIndex(index - 1))}
          aria-label={`Open ${prev.name} project`}
          {...link()}
          className="group text-left py-6 md:py-8 pr-4 border-r border-[#E5E3DD]"
        >
          <span className="flex items-center gap-2 font-mono-code text-[10px] tracking-widest uppercase text-[#A09E96]">
            <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" /> Previous · {prev.number}
          </span>
          <span className="mt-2 block font-display text-lg md:text-2xl font-light text-[#141413] group-hover:text-[#9A773E] transition-colors">
            {prev.name}
          </span>
        </button>
        <button
          type="button"
          onClick={() => onOpenProject(wrapProjectIndex(index + 1))}
          aria-label={`Open ${next.name} project`}
          {...link()}
          className="group text-right py-6 md:py-8 pl-4"
        >
          <span className="flex items-center justify-end gap-2 font-mono-code text-[10px] tracking-widest uppercase text-[#A09E96]">
            Next · {next.number} <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </span>
          <span className="mt-2 block font-display text-lg md:text-2xl font-light text-[#141413] group-hover:text-[#9A773E] transition-colors">
            {next.name}
          </span>
        </button>
      </nav>

      <div className="mt-10 flex justify-center">
        <button
          type="button"
          onClick={onBack}
          {...link()}
          className="px-6 py-3 rounded-full border border-[#141413] text-xs font-mono-code tracking-widest uppercase text-[#141413] hover:bg-[#141413] hover:text-[#FFFFFF] transition-colors"
        >
          Back to project selector
        </button>
      </div>
    </article>
  );
};
