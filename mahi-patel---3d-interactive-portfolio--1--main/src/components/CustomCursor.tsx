import React, { useEffect, useRef, useState } from 'react';
import { CursorState } from '../types';

interface CustomCursorProps {
  cursorState: CursorState;
  cursorText?: string;
}

export const CustomCursor: React.FC<CustomCursorProps> = ({ cursorState, cursorText }) => {
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Detect touch device
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouch(true);
      return;
    }

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let animationFrameId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) setIsVisible(true);

      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    let last = performance.now();
    const render = (now: number = performance.now()) => {
      // Time-based easing for the outer ring: same glide at 60Hz, 120Hz or 144Hz
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      const factor = 1 - Math.exp(-dt * 11);
      ringX += (mouseX - ringX) * factor;
      ringY += (mouseY - ringY) * factor;

      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);
    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible]);

  if (isTouch) return null;

  // Derive label and ring style based on state
  const isDrag = cursorState === 'drag-3d';
  const isLink = cursorState === 'link';
  const isView = cursorState === 'view';
  const isCopy = cursorState === 'copy';

  const displayText = cursorText || (
    isDrag ? 'drag to rotate' :
    isView ? 'view case study' :
    isCopy ? 'copy' :
    isLink ? 'open' : ''
  );

  return (
    <div
      id="custom-cursor-container"
      className={`pointer-events-none fixed inset-0 z-50 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Precision center dot */}
      <div
        ref={cursorDotRef}
        id="cursor-center-dot"
        className={`fixed top-0 left-0 -ml-1 -mt-1 h-2 w-2 rounded-full bg-[#141413] transition-opacity duration-300 will-change-transform ${
          displayText ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* Outer interactive ring */}
      <div
        ref={cursorRingRef}
        id="cursor-outer-ring"
        className="fixed top-0 left-0 -ml-3 -mt-3 flex items-center justify-center transition-opacity duration-300 will-change-transform"
      >
        <div
          className={`flex items-center justify-center rounded-full border transition-all duration-300 ${
            displayText
              ? 'px-3.5 py-1.5 border-[#9A773E] bg-[#FFFFFF]/95 shadow-[0_4px_20px_rgba(0,0,0,0.1)] backdrop-blur-md'
              : isDrag
              ? 'h-12 w-12 border-[#9A773E] bg-[#9A773E]/10'
              : 'h-6 w-6 border-[#141413]/35'
          }`}
        >
          {displayText ? (
            <span className="font-mono-code text-[11px] tracking-wider text-[#141413] uppercase whitespace-nowrap">
              {displayText}
            </span>
          ) : isDrag ? (
            <div className="flex items-center gap-1 text-[9px] text-[#9A773E] font-mono-code">
              <span>◂</span>
              <span>▸</span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
