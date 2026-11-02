import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { FeaturedProject } from '../../types';
import { BuiltModel, createStageLighting, loadProjectModel } from '../../scene/projectModels';

export interface Project3DViewerHandle {
  /** Spin the current model out and the next project's model in. Resolves when settled. */
  spinTo: (next: FeaturedProject, direction: 1 | -1, reducedMotion: boolean) => Promise<void>;
  /** Copy of the current frame, used as the source for the pixel transition. */
  snapshot: () => HTMLCanvasElement | null;
  setHover: (hover: boolean) => void;
}

interface Project3DViewerProps {
  initialProject: FeaturedProject;
  className?: string;
}

const BASE_YAW = -Math.PI / 5;
const SPIN_DURATION = 0.95;

export const Project3DViewer = forwardRef<Project3DViewerHandle, Project3DViewerProps>(
  ({ initialProject, className }, ref) => {
    const mountRef = useRef<HTMLDivElement>(null);
    const api = useRef<Project3DViewerHandle | null>(null);

    useImperativeHandle(ref, () => ({
      spinTo: (...args) => api.current?.spinTo(...args) ?? Promise.resolve(),
      snapshot: () => api.current?.snapshot() ?? null,
      setHover: (h) => api.current?.setHover(h),
    }));

    useEffect(() => {
      const container = mountRef.current;
      if (!container) return;
      let disposed = false;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.domElement.style.display = 'block';
      container.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);

      const lighting = createStageLighting(renderer, scene);

      // Ground: soft contact shadow + a thin plan-line ring
      const shadowCanvas = document.createElement('canvas');
      shadowCanvas.width = shadowCanvas.height = 256;
      const sctx = shadowCanvas.getContext('2d')!;
      const grad = sctx.createRadialGradient(128, 128, 0, 128, 128, 128);
      grad.addColorStop(0, 'rgba(20,20,19,0.16)');
      grad.addColorStop(0.55, 'rgba(20,20,19,0.05)');
      grad.addColorStop(1, 'rgba(20,20,19,0)');
      sctx.fillStyle = grad;
      sctx.fillRect(0, 0, 256, 256);
      const shadowTex = new THREE.CanvasTexture(shadowCanvas);
      const shadowGeo = new THREE.PlaneGeometry(7, 7);
      const shadowMat = new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false });
      const shadow = new THREE.Mesh(shadowGeo, shadowMat);
      shadow.rotation.x = -Math.PI / 2;
      shadow.position.y = -1.68;
      scene.add(shadow);

      const ringGeo = new THREE.RingGeometry(3.05, 3.065, 128);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0xc9a47e, transparent: true, opacity: 0.35, depthWrite: false });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = -1.67;
      scene.add(ring);

      // turntable (idle rotation + pointer tilt) → spinner (Next/Prev spin) → model
      const turntable = new THREE.Group();
      turntable.rotation.y = BASE_YAW;
      scene.add(turntable);
      const spinner = new THREE.Group();
      turntable.add(spinner);

      let current: BuiltModel | null = null;
      let currentSlug = initialProject.slug;
      const mount = (m: BuiltModel) => {
        if (current) {
          spinner.remove(current.group);
          current.dispose();
        }
        current = m;
        spinner.add(m.group);
      };
      loadProjectModel(initialProject).then((m) => {
        if (disposed) return m.dispose();
        if (!current && currentSlug === initialProject.slug) mount(m);
        else m.dispose();
      });

      // Sizing — pull the camera back on narrow stages so the model always fits
      const resize = () => {
        const w = container.clientWidth || 1;
        const h = container.clientHeight || 1;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        const dist = Math.max(9.6, 8.4 / camera.aspect);
        camera.position.set(0, dist * 0.3, dist);
        camera.lookAt(0, -0.25, 0);
        camera.updateProjectionMatrix();
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(container);

      // Pointer tilt (desktop) — subtle, never required for any function
      const pointer = { x: 0, y: 0 };
      const onPointerMove = (e: PointerEvent) => {
        if (e.pointerType !== 'mouse') return;
        const r = container.getBoundingClientRect();
        pointer.x = THREE.MathUtils.clamp(((e.clientX - r.left) / r.width) * 2 - 1, -1.5, 1.5);
        pointer.y = THREE.MathUtils.clamp(((e.clientY - r.top) / r.height) * 2 - 1, -1.5, 1.5);
      };
      window.addEventListener('pointermove', onPointerMove, { passive: true });

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      let hover = false;
      let spinning = false;
      let idleYaw = 0;
      let visible = true;
      const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
      io.observe(container);

      let last = performance.now();
      let raf = 0;
      const tick = () => {
        raf = requestAnimationFrame(tick);
        const now = performance.now();
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        if (!visible || document.hidden) return;
        if (!spinning && !hover && !reduceMotion.matches) idleYaw += dt * 0.12;
        const tiltY = pointer.x * 0.22;
        const tiltX = pointer.y * 0.06;
        turntable.rotation.y += (BASE_YAW + idleYaw + tiltY - turntable.rotation.y) * 0.06;
        turntable.rotation.x += (tiltX - turntable.rotation.x) * 0.06;
        const targetScale = hover && !spinning ? 1.035 : 1;
        turntable.scale.setScalar(turntable.scale.x + (targetScale - turntable.scale.x) * 0.1);
        ringMat.opacity += ((hover ? 0.75 : 0.35) - ringMat.opacity) * 0.1;
        renderer.render(scene, camera);
      };
      tick();

      api.current = {
        spinTo: (next, direction, reduced) =>
          new Promise<void>((resolve) => {
            spinning = true;
            currentSlug = next.slug;
            const nextModel = loadProjectModel(next);
            const half = reduced ? 0.18 : SPIN_DURATION / 2;
            const angle = reduced ? 0 : direction * Math.PI;

            const finish = () => {
              spinner.rotation.y = 0;
              spinning = false;
              resolve();
            };

            gsap.killTweensOf([spinner.rotation, spinner.scale, spinner.position]);
            const tl = gsap.timeline();
            tl.to(spinner.rotation, { y: angle, duration: half, ease: 'power2.in' }, 0)
              .to(spinner.scale, { x: 0.72, y: 0.72, z: 0.72, duration: half, ease: 'power2.in' }, 0)
              .to(spinner.position, { y: reduced ? 0 : 0.18, duration: half, ease: 'power2.in' }, 0);

            tl.eventCallback('onComplete', async () => {
              const m = await nextModel;
              if (disposed || currentSlug !== next.slug) {
                m.dispose();
                return finish();
              }
              mount(m);
              if (reduced) spinner.rotation.y = 0;
              const tl2 = gsap.timeline({ onComplete: finish });
              tl2.to(spinner.rotation, { y: angle * 2, duration: half, ease: 'power3.out' }, 0)
                .to(spinner.scale, { x: 1, y: 1, z: 1, duration: half, ease: 'power3.out' }, 0)
                .to(spinner.position, { y: 0, duration: half, ease: 'power3.out' }, 0);
            });
          }),
        snapshot: () => {
          renderer.render(scene, camera);
          const src = renderer.domElement;
          const c = document.createElement('canvas');
          c.width = src.width;
          c.height = src.height;
          c.getContext('2d')?.drawImage(src, 0, 0);
          return c;
        },
        setHover: (h) => (hover = h),
      };

      return () => {
        disposed = true;
        api.current = null;
        cancelAnimationFrame(raf);
        gsap.killTweensOf([spinner.rotation, spinner.scale, spinner.position]);
        window.removeEventListener('pointermove', onPointerMove);
        ro.disconnect();
        io.disconnect();
        current?.dispose();
        lighting.dispose();
        shadowGeo.dispose();
        shadowMat.dispose();
        shadowTex.dispose();
        ringGeo.dispose();
        ringMat.dispose();
        renderer.dispose();
        renderer.forceContextLoss();
        renderer.domElement.remove();
      };
      // The stage mounts once; later project changes go through spinTo().
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <div ref={mountRef} className={className} aria-hidden="true" />;
  }
);

Project3DViewer.displayName = 'Project3DViewer';
