import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { createPortal } from 'react-dom';

export interface PixelTransitionRun {
  /** Frame to pixelate in place before the screen breaks into blocks (optional). */
  source?: HTMLCanvasElement | null;
  sourceRect?: DOMRect | null;
  /** Called once the screen is fully covered — swap the view here. */
  onCovered: () => void;
  reducedMotion?: boolean;
}

export interface PixelTransitionHandle {
  run: (opts: PixelTransitionRun) => Promise<void>;
}

const PALETTE = ['#F2F1ED', '#ECEAE4', '#E5E3DD', '#F8F8F6', '#EFE9DC'];
const ACCENT = ['#141413', '#9A773E', '#C9A47E'];

const raf = () => new Promise<number>((r) => requestAnimationFrame(r));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp01 = (t: number) => Math.max(0, Math.min(1, t));

/**
 * Pixelated screen transition:
 *   1. the source frame (the live 3D stage) coarsens into growing pixels,
 *   2. blocks sweep across the viewport from the click point until it is covered,
 *   3. the view underneath is swapped,
 *   4. blocks dissolve away to reveal the new view.
 */
export const PixelTransition = forwardRef<PixelTransitionHandle>((_, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const running = useRef(false);

  useImperativeHandle(ref, () => ({
    run: async ({ source, sourceRect, onCovered, reducedMotion }) => {
      const canvas = canvasRef.current;
      if (!canvas || running.current) {
        onCovered();
        return;
      }
      running.current = true;
      try {
        await play(canvas, { source, sourceRect, onCovered, reducedMotion });
      } finally {
        running.current = false;
      }
    },
  }));

  return createPortal(
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 z-[60] pointer-events-none"
      style={{ width: '100vw', height: '100vh', visibility: 'hidden', imageRendering: 'pixelated' }}
    />,
    document.body
  );
});

PixelTransition.displayName = 'PixelTransition';

async function play(canvas: HTMLCanvasElement, { source, sourceRect, onCovered, reducedMotion }: PixelTransitionRun) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  canvas.width = vw;
  canvas.height = vh;
  canvas.style.visibility = 'visible';
  canvas.style.pointerEvents = 'auto';
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  const cell = Math.round(Math.max(28, Math.min(64, Math.min(vw, vh) / 12)));
  const cols = Math.ceil(vw / cell);
  const rows = Math.ceil(vh / cell);

  // Origin of the sweep: centre of the source frame (or the screen)
  const ox = sourceRect ? sourceRect.left + sourceRect.width / 2 : vw / 2;
  const oy = sourceRect ? sourceRect.top + sourceRect.height / 2 : vh / 2;
  const maxD = Math.hypot(Math.max(ox, vw - ox), Math.max(oy, vh - oy));

  // Tiny copy of the source for block colours & the coarsening effect
  const tiny = document.createElement('canvas');
  const tctx = tiny.getContext('2d')!;

  const cells = Array.from({ length: cols * rows }, (_, i) => {
    const c = i % cols;
    const r = Math.floor(i / cols);
    const cx = c * cell + cell / 2;
    const cy = r * cell + cell / 2;
    const d = Math.hypot(cx - ox, cy - oy) / maxD;
    const rnd = Math.random();
    const accent = rnd > 0.965;
    return {
      x: c * cell,
      y: r * cell,
      delay: clamp01(d * 0.7 + Math.random() * 0.3),
      color: accent ? ACCENT[Math.floor(Math.random() * ACCENT.length)] : PALETTE[Math.floor(rnd * PALETTE.length) % PALETTE.length],
    };
  });

  const drawSource = (block: number) => {
    if (!source || !sourceRect) return;
    const w = Math.max(1, Math.round(sourceRect.width / block));
    const h = Math.max(1, Math.round(sourceRect.height / block));
    tiny.width = w;
    tiny.height = h;
    tctx.imageSmoothingEnabled = true;
    tctx.clearRect(0, 0, w, h);
    tctx.drawImage(source, 0, 0, w, h);
    ctx.drawImage(tiny, 0, 0, w, h, sourceRect.left, sourceRect.top, sourceRect.width, sourceRect.height);
  };

  const animate = async (duration: number, frame: (t: number) => void) => {
    const start = performance.now();
    for (;;) {
      const t = clamp01((performance.now() - start) / duration);
      frame(t);
      if (t >= 1) break;
      await raf();
    }
  };

  const drawCells = (progress: number, reveal: boolean) => {
    for (const cl of cells) {
      // each block grows over a short window around its own delay
      const local = clamp01((progress - cl.delay * 0.75) / 0.25);
      const s = reveal ? 1 - easeOut(local) : easeOut(local);
      if (s <= 0.001) continue;
      const size = cell * s;
      ctx.fillStyle = cl.color;
      ctx.fillRect(cl.x + (cell - size) / 2, cl.y + (cell - size) / 2, Math.ceil(size), Math.ceil(size));
    }
  };

  const fillAll = () => {
    for (const cl of cells) {
      ctx.fillStyle = cl.color;
      ctx.fillRect(cl.x, cl.y, cell, cell);
    }
  };

  if (reducedMotion) {
    await animate(160, (t) => {
      ctx.clearRect(0, 0, vw, vh);
      ctx.globalAlpha = t;
      fillAll();
      ctx.globalAlpha = 1;
    });
    onCovered();
    await raf();
    await raf();
    await animate(200, (t) => {
      ctx.clearRect(0, 0, vw, vh);
      ctx.globalAlpha = 1 - t;
      fillAll();
      ctx.globalAlpha = 1;
    });
  } else {
    // 1 — coarsen the source frame in place (with the sweep starting underneath)
    const PIX = source && sourceRect ? 320 : 0;
    const COVER = 380;
    if (PIX) {
      await animate(PIX, (t) => {
        ctx.clearRect(0, 0, vw, vh);
        const block = 1 + Math.pow(t, 1.6) * (cell - 1);
        drawSource(block);
        drawCells(t * 0.35, false);
      });
    }
    // 2 — blocks cover the screen
    await animate(COVER, (t) => {
      ctx.clearRect(0, 0, vw, vh);
      if (PIX) drawSource(cell);
      drawCells(PIX ? 0.35 + t * 0.65 : t, false);
    });
    ctx.clearRect(0, 0, vw, vh);
    fillAll();

    // 3 — swap the view underneath, give React a couple of frames to paint
    onCovered();
    await raf();
    await raf();
    await new Promise((r) => setTimeout(r, 60));

    // 4 — dissolve
    await animate(420, (t) => {
      ctx.clearRect(0, 0, vw, vh);
      drawCells(t, true);
    });
  }

  ctx.clearRect(0, 0, vw, vh);
  canvas.style.visibility = 'hidden';
  canvas.style.pointerEvents = 'none';
}
