import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { CursorState, PageRoute } from '../types';
import { FEATURED_PROJECTS, wrapProjectIndex } from '../data/featuredProjects';
import { ProjectSelector } from '../components/projects/ProjectSelector';
import { ProjectDetail } from '../components/projects/ProjectDetail';
import { RoyceProjectPage } from './RoyceProjectPage';
import { UrbenHatchProjectPage } from './UrbenHatchProjectPage';
import { VillaProjectPage } from './VillaProjectPage';
import { PixelTransition, PixelTransitionHandle } from '../components/projects/PixelTransition';

interface WorkPageProps {
  onNavigate: (route: PageRoute) => void;
  onCursorChange?: (state: CursorState, text?: string) => void;
  onDetailChange?: (isOpen: boolean) => void;
}

const ACTIVE_KEY = 'mahi_content_active_project';

const readActiveIndex = () => {
  try {
    const v = Number(sessionStorage.getItem(ACTIVE_KEY));
    return Number.isInteger(v) ? wrapProjectIndex(v) : 0;
  } catch {
    return 0;
  }
};

/**
 * Content page: one project at a time as a 3D object. Next/Prev spin between
 * projects; clicking the project pixelates the screen into its detail view.
 */
export const WorkPage: React.FC<WorkPageProps> = ({
  onNavigate,
  onCursorChange,
  onDetailChange,
}) => {
  const reduced = !!useReducedMotion();
  const pixelRef = useRef<PixelTransitionHandle>(null);
  const [activeIndex, setActiveIndex] = useState(readActiveIndex);
  const [detailIndex, setDetailIndex] = useState<number | null>(null);
  const [isOpening, setIsOpening] = useState(false);
  const busy = useRef(false);

  useEffect(() => {
    onDetailChange?.(detailIndex !== null);
  }, [detailIndex, onDetailChange]);

  useEffect(() => {
    try {
      sessionStorage.setItem(ACTIVE_KEY, String(activeIndex));
    } catch {}
  }, [activeIndex]);

  const transition = useCallback(
    async (swap: () => void, source?: HTMLCanvasElement | null, rect?: DOMRect | null) => {
      if (busy.current) return;
      busy.current = true;
      setIsOpening(true);
      onCursorChange?.('default');
      try {
        await (pixelRef.current?.run({
          source,
          sourceRect: rect,
          reducedMotion: reduced,
          onCovered: () => {
            swap();
            window.scrollTo({ top: 0, behavior: 'instant' });
          },
        }) ?? Promise.resolve(swap()));
      } finally {
        busy.current = false;
        setIsOpening(false);
      }
    },
    [onCursorChange, reduced]
  );

  const openProject = useCallback(
    (index: number, source?: HTMLCanvasElement | null, rect?: DOMRect | null) =>
      transition(() => {
        setActiveIndex(index); // the selector returns to this project
        setDetailIndex(index);
      }, source, rect),
    [transition]
  );

  const closeDetail = useCallback(
    () =>
      transition(() => {
        setDetailIndex(null);
        setTimeout(() => {
          const el = document.getElementById('project-selector') || document.getElementById('content-section');
          el?.scrollIntoView({ behavior: 'instant' });
        }, 30);
      }),
    [transition]
  );

  return (
    <div id="work-page-container" className="relative min-h-screen bg-[#FFFFFF] text-[#141413] px-6 md:px-12 overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        {detailIndex === null ? (
          <ProjectSelector
            activeIndex={activeIndex}
            onActiveIndexChange={setActiveIndex}
            onOpen={openProject}
            locked={isOpening}
            onCursorChange={onCursorChange}
          />
        ) : FEATURED_PROJECTS[detailIndex].slug === 'royce-store' ? (
          <RoyceProjectPage
            onBack={closeDetail}
            onNavigate={onNavigate}
            onOpenProject={(i) => openProject(i)}
            onCursorChange={onCursorChange}
          />
        ) : FEATURED_PROJECTS[detailIndex].slug === 'urben-hatch' ? (
          <UrbenHatchProjectPage
            onBack={closeDetail}
            onNavigate={onNavigate}
            onOpenProject={(i) => openProject(i)}
            onCursorChange={onCursorChange}
          />
        ) : FEATURED_PROJECTS[detailIndex].slug === 'villa' ? (
          <VillaProjectPage
            onBack={closeDetail}
            onNavigate={onNavigate}
            onOpenProject={(i) => openProject(i)}
            onCursorChange={onCursorChange}
          />
        ) : (
          <ProjectDetail
            project={FEATURED_PROJECTS[detailIndex]}
            index={detailIndex}
            onBack={closeDetail}
            onOpenProject={(i) => openProject(i)}
            onCursorChange={onCursorChange}
          />
        )}

        <div className="pb-16" />
      </div>

      <PixelTransition ref={pixelRef} />
    </div>
  );
};
