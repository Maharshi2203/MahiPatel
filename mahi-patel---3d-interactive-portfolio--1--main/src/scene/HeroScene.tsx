import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { DisciplineMode } from '../types';
import { BuiltRetailModel, createRetailPavilionModel } from './retailPavilionModel';
import { audioHaptics } from '../utils/audioHaptics';

interface HeroSceneProps {
  mode: DisciplineMode;
  onColorProgressChange?: (progress: number) => void;
  onCursorChange?: (state: 'default' | 'link' | 'drag-3d' | 'view' | 'copy') => void;
  resetTrigger?: number; // Increment to reset color fill back to clay
  spinTrigger?: number;  // Increment to trigger rotation animation externally
}

export const HeroScene: React.FC<HeroSceneProps> = ({
  onColorProgressChange,
  onCursorChange,
  resetTrigger = 0,
  spinTrigger = 0,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const retailModelRef = useRef<BuiltRetailModel | null>(null);
  const colorProgressRef = useRef<{ target: number; current: number }>({ target: 0, current: 0 });
  const triggerSpinRef = useRef<(() => void) | null>(null);
  // Latest callbacks in refs so the WebGL scene mounts once instead of rebuilding on every parent render
  const onColorProgressChangeRef = useRef(onColorProgressChange);
  const onCursorChangeRef = useRef(onCursorChange);
  onColorProgressChangeRef.current = onColorProgressChange;
  onCursorChangeRef.current = onCursorChange;

  // Handle external reset to clay trigger
  useEffect(() => {
    if (resetTrigger > 0) {
      colorProgressRef.current.target = 0;
      colorProgressRef.current.current = 0;
      retailModelRef.current?.setColorProgress(0);
      onColorProgressChangeRef.current?.(0);
    }
  }, [resetTrigger]);

  // Handle external spin & materialize trigger
  useEffect(() => {
    if (spinTrigger > 0) {
      triggerSpinRef.current?.();
    }
  }, [spinTrigger]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // Scene
    const scene = new THREE.Scene();

    // Camera: Calibrated perspective angle matching reference render
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 2.3, 6.4);
    camera.lookAt(0, 0.05, 0);

    // Renderer: High-fidelity PBR renderer with soft shadow mapping
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    container.appendChild(renderer.domElement);

    // Group for objects
    const mainGroup = new THREE.Group();
    // Isometric angle matching user reference image
    mainGroup.rotation.y = -0.62;
    mainGroup.rotation.x = 0.04;
    mainGroup.position.y = -0.32; // Lower the model as requested

    scene.add(mainGroup);

    // ----------------------------------------------------
    // ARCHITECTURAL STUDIO GROUND (RECEIVES SHADOWS)
    // ----------------------------------------------------
    // Shadow-only ground: blends into the page background instead of showing a hard horizon edge
    const studioGroundGeo = new THREE.PlaneGeometry(60, 60);
    const studioGroundMat = new THREE.ShadowMaterial({ opacity: 0.08 });
    const studioGround = new THREE.Mesh(studioGroundGeo, studioGroundMat);
    studioGround.rotation.x = -Math.PI / 2;
    studioGround.position.set(0, -0.695, 0); // Positioned directly beneath lowered plinth
    studioGround.receiveShadow = true;
    // No ground plane in the scene: long hard-edged projected shadows cluttered the hero; the model's own soft contact shadow grounds it

    // ----------------------------------------------------
    // BOUTIQUE RETAIL PAVILION MODEL (Starts in pure Clay mode)
    // ----------------------------------------------------
    const retailModel = createRetailPavilionModel();
    retailModelRef.current = retailModel;
    retailModel.group.scale.setScalar(0.92);
    retailModel.group.position.set(0.12, -0.28, 0);
    mainGroup.add(retailModel.group);

    // Auto-frame: fit the model's on-screen extent (worst case over a full turn, so it never clips while
    // spinning) into the free part of the stage. On wide screens the hero copy sits on the left, so the
    // model is framed into the right-hand part of the canvas via a projection view offset.
    mainGroup.updateMatrixWorld(true);
    // Frame only the visible architecture (skip the hidden floor slab and the flat contact-shadow decal)
    const modelBox = new THREE.Box3();
    retailModel.group.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh || !o.visible || !o.parent?.visible) return;
      const mat = mesh.material as THREE.Material;
      if (!Array.isArray(mesh.material) && mat.transparent && !mat.depthWrite) return;
      modelBox.expandByObject(mesh);
    });
    const modelCenter = modelBox.getCenter(new THREE.Vector3());
    const turnRadius = Math.max(
      ...[modelBox.min.x, modelBox.max.x].flatMap((x) =>
        [modelBox.min.z, modelBox.max.z].map((z) => Math.hypot(x - mainGroup.position.x, z - mainGroup.position.z))
      )
    );
    // Low, near eye-level view so the ceiling and floor read as thin planes instead of dominating the frame
    const viewDir = new THREE.Vector3(0, 0.75, 6.4).normalize();
    const elevation = Math.asin(viewDir.y);
    const extentW = turnRadius * 2 * 0.72;
    const extentH = (modelBox.max.y - modelBox.min.y) * Math.cos(elevation) + turnRadius * 2 * Math.sin(elevation);
    const fitCamera = (w: number, h: number) => {
      const wide = w >= 640 && w / h > 0.95;
      const usableW = wide ? w * 0.62 : w * 0.96;
      const usableH = h * (wide ? 0.9 : 0.2);
      const tanV = Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
      const dist = Math.max((extentH / 2) / (tanV * usableH / h), (extentW / 2) / (tanV * usableW / h)) + turnRadius * 0.15;
      camera.aspect = w / h;
      camera.position.copy(modelCenter).addScaledVector(viewDir, dist);
      camera.lookAt(modelCenter);
      if (wide) camera.setViewOffset(w, h, -(w - usableW) / 2, -h * 0.03, w, h);
      // Portrait/mobile: the copy fills the middle, so park the model in the gap below the CTAs
      else camera.setViewOffset(w, h, 0, -h * 0.3, w, h);
      camera.updateProjectionMatrix();
    };
    fitCamera(width, height);

    // ----------------------------------------------------
    // REALISTIC STUDIO & ARCHITECTURAL LIGHTING
    // ----------------------------------------------------
    const hemiLight = new THREE.HemisphereLight(0xFFFFFF, 0xEBE8E1, 1.35);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xFFFAF2, 2.5);
    sunLight.position.set(6.0, 9.0, 5.0);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 1.0;
    sunLight.shadow.camera.far = 28;
    sunLight.shadow.camera.left = -9;
    sunLight.shadow.camera.right = 9;
    sunLight.shadow.camera.top = 9;
    sunLight.shadow.camera.bottom = -9;
    sunLight.shadow.bias = -0.0002;
    sunLight.shadow.radius = 2.0;
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0xE0ECF8, 0.9);
    fillLight.position.set(-6, 5, -3.5);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xFFF4E6, 1.15);
    rimLight.position.set(2, 6, -5.5);
    scene.add(rimLight);

    // Warm interior boutique accent bounce light (illuminates as materials emerge)
    const interiorLight = new THREE.PointLight(0xFDB374, 0, 4.2, 1.3);
    interiorLight.position.set(0.1, 0.9, 0.1);
    scene.add(interiorLight);

    // Raycaster for click and hover inspection
    const raycaster = new THREE.Raycaster();
    const mouseVec = new THREE.Vector2();

    // Smootherstep (Ken Perlin's C2-continuous easing function for zero acceleration jerk)
    const smootherstep = (t: number) => {
      const clamped = Math.max(0, Math.min(1, t));
      return clamped * clamped * clamped * (clamped * (clamped * 6 - 15) + 10);
    };

    // State tracking for pointer interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;
    let isDragging = false;
    let previousPointerX = 0;
    let previousPointerY = 0;
    let dragVelocityX = 0;
    let dragVelocityY = 0;

    let pointerDownTime = 0;
    let pointerDownX = 0;
    let pointerDownY = 0;

    // Auto 360° turn with the material filling in over the same duration
    const spinAnim = {
      active: false,
      startTime: 0,
      duration: 1300,
      startRotY: 0,
      deltaRotY: Math.PI * 2,
    };
    const fillAnim = {
      active: false,
      startTime: 0,
      duration: 1400,
      startProgress: 0,
    };

    const triggerSmoothRotation = (silent = false, direction: 1 | -1 = 1) => {
      if (!silent) audioHaptics.playClick();
      const now = performance.now();
      spinAnim.active = true;
      spinAnim.startTime = now;
      spinAnim.duration = 1300;
      spinAnim.startRotY = mainGroup.rotation.y; // start from where the model is drawn, so there is no jump
      spinAnim.deltaRotY = Math.PI * 2 * direction;
      if (colorProgressRef.current.current < 1) {
        fillAnim.active = true;
        fillAnim.startTime = now;
        fillAnim.duration = spinAnim.duration;
        fillAnim.startProgress = colorProgressRef.current.current;
      }
      dragVelocityX = 0;
      dragVelocityY = 0;
    };

    triggerSpinRef.current = triggerSmoothRotation;

    let accumulatedDragDist = 0;

    // Hold + drag: once the model has been turned DRAG_SPIN_THRESHOLD of a full turn by hand, it takes
    // over and plays a full 360° on its own while the material is applied
    const DRAG_SPIN_THRESHOLD = 0.3;
    let dragTurn = 0;

    const endDrag = () => {
      isDragging = false;
      onCursorChangeRef.current?.('default');
      if (document.pointerLockElement === container) {
        try {
          document.exitPointerLock?.();
        } catch {}
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      isDragging = true;
      pointerDownTime = performance.now();
      pointerDownX = e.clientX;
      pointerDownY = e.clientY;
      previousPointerX = e.clientX;
      previousPointerY = e.clientY;
      accumulatedDragDist = 0;
      dragTurn = 0;
      dragVelocityX = 0;
      dragVelocityY = 0;

      // If user starts manual drag, release automatic spin
      if (spinAnim.active) {
        spinAnim.active = false;
      }
      onCursorChangeRef.current?.('drag-3d');

      // Request Pointer Lock for mouse so cursor stays in place and allows infinite 360° rotation without hitting screen edges
      if (e.pointerType === 'mouse') {
        try {
          if (document.pointerLockElement !== container) {
            const lockPromise = container.requestPointerLock?.();
            if (lockPromise && typeof (lockPromise as any).catch === 'function') {
              (lockPromise as any).catch(() => {});
            }
          }
        } catch {
          // Fallback if browser restricts pointer lock
        }
      } else {
        // Touch devices: capture pointer for smooth tracking
        try {
          container.setPointerCapture?.(e.pointerId);
        } catch {}
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (isDragging) {
        const isLocked = document.pointerLockElement === container;
        let deltaX = 0;
        let deltaY = 0;

        if (isLocked) {
          // With pointer lock, cursor stays in place! movementX and movementY allow infinite 360 rotation!
          deltaX = e.movementX ?? 0;
          deltaY = e.movementY ?? 0;
        } else {
          deltaX = e.clientX - previousPointerX;
          deltaY = e.clientY - previousPointerY;
          previousPointerX = e.clientX;
          previousPointerY = e.clientY;
        }

        // Clamp extreme single-event spikes
        deltaX = Math.max(-80, Math.min(80, deltaX));
        deltaY = Math.max(-80, Math.min(80, deltaY));

        const dist = Math.hypot(deltaX, deltaY);
        accumulatedDragDist += dist;

        const rotSpeed = 0.0038;
        dragVelocityX = deltaX * rotSpeed;
        dragVelocityY = 0; // Axis locked: strictly sideways rotation, no up/down movement!
        targetRotationY += dragVelocityX;
        targetRotationX = 0.04; // Fixed architectural elevation angle

        dragTurn += Math.abs(dragVelocityX) / (Math.PI * 2);
        if (dragTurn >= DRAG_SPIN_THRESHOLD && colorProgressRef.current.current < 1 && !spinAnim.active) {
          mainGroup.rotation.y = targetRotationY;
          endDrag();
          triggerSmoothRotation(false, deltaX < 0 ? -1 : 1);
        }
      } else {
        const rect = container.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
        mouseX = x * 0.22;
        mouseY = y * 0.18;
        container.style.cursor = 'grab';
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      if (isDragging) {
        isDragging = false;
        onCursorChangeRef.current?.('default');

        // Exit pointer lock when click is released
        if (document.pointerLockElement === container) {
          try {
            document.exitPointerLock?.();
          } catch {}
        }

        // Release pointer capture for touch
        try {
          if (container.hasPointerCapture?.(e.pointerId)) {
            container.releasePointerCapture?.(e.pointerId);
          }
        } catch {}

        const timeElapsed = performance.now() - pointerDownTime;

        // CLICK ON 3D MODEL:
        // If movement is minimal (< 8px) and quick (< 350ms), user just clicked -> trigger smooth 360 rotation & material fill!
        if (accumulatedDragDist < 8 && timeElapsed < 350) {
          triggerSmoothRotation();
        }
      }
    };

    const onPointerLockChange = () => {
      if (document.pointerLockElement !== container && isDragging) {
        previousPointerX = pointerDownX;
        previousPointerY = pointerDownY;
      }
    };

    container.addEventListener('pointermove', onPointerMove, { passive: true });
    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);
    document.addEventListener('pointerlockchange', onPointerLockChange);

    // Animation loop with frame-rate independent delta time and zero-lag smoothing
    let animationFrameId: number;
    let lastReportedProgress = -1;
    let lastTime = performance.now();
    const FIXED_ROTATION_X = 0.04; // Locked vertical axis angle

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      // Subtle architectural idle floating elevation & gentle breathing
      const timeSec = now * 0.001;
      const floatY = Math.sin(timeSec * 0.8) * 0.012;
      retailModel.group.position.y = -0.28 + floatY;
      retailModel.group.rotation.z = Math.sin(timeSec * 0.5) * 0.004;

      // Lock vertical axis in all states
      mainGroup.rotation.x = FIXED_ROTATION_X;

      if (spinAnim.active) {
        const elapsed = now - spinAnim.startTime;
        const progress = Math.min(1.0, elapsed / spinAnim.duration);
        const eased = smootherstep(progress);

        // Direct mathematical rotation angle: zero lag, zero overshoot, buttery smooth deceleration!
        const currentSpinY = spinAnim.startRotY + spinAnim.deltaRotY * eased;
        targetRotationY = currentSpinY;
        mainGroup.rotation.y = currentSpinY;

        if (progress >= 1.0) spinAnim.active = false;
      } else if (isDragging) {
        // High-framerate responsive manual dragging (purely horizontal / sideways)
        const dragFollow = 1.0 - Math.exp(-28.0 * delta);
        mainGroup.rotation.y += (targetRotationY - mainGroup.rotation.y) * dragFollow;
      } else {
        // Silky, frame-rate independent inertia damping
        const friction = Math.exp(-5.2 * delta);
        dragVelocityX *= friction;
        dragVelocityY = 0; // Strictly sideways
        targetRotationY += dragVelocityX;

        // Calm, subtle ambient drift only when completely idle
        if (Math.abs(dragVelocityX) < 0.0001) {
          targetRotationY += 0.0005 * (delta / 0.016);
        }

        // Camera follow with smooth damping (strictly sideways)
        const followRate = 1.0 - Math.exp(-10.0 * delta);
        mainGroup.rotation.y += (targetRotationY - mainGroup.rotation.y) * followRate;

        // Smooth color progress blend if manual drag increments progress
        const { target, current } = colorProgressRef.current;
        if (Math.abs(target - current) > 0.001) {
          const nextCurrent = current + (target - current) * (1.0 - Math.exp(-12.0 * delta));
          colorProgressRef.current.current = nextCurrent;
          retailModel.setColorProgress(nextCurrent);
        }
      }

      if (fillAnim.active) {
        const t = Math.min(1.0, (now - fillAnim.startTime) / fillAnim.duration);
        const fill = THREE.MathUtils.lerp(fillAnim.startProgress, 1.0, smootherstep(t));
        colorProgressRef.current.target = fill;
        colorProgressRef.current.current = fill;
        retailModel.setColorProgress(fill);
        if (t >= 1.0) fillAnim.active = false;
      }

      // Dynamic architectural lighting reaction as materials materialize
      const p = colorProgressRef.current.current;
      hemiLight.intensity = THREE.MathUtils.lerp(1.15, 1.45, p);
      sunLight.intensity = THREE.MathUtils.lerp(2.2, 2.7, p) + Math.sin(p * Math.PI) * 0.35;
      rimLight.intensity = THREE.MathUtils.lerp(0.85, 1.4, p);
      interiorLight.intensity = p * 1.5;

      // Report progress to UI if changed meaningfully
      const rounded = Math.round(p * 100);
      if (rounded !== lastReportedProgress) {
        lastReportedProgress = rounded;
        onColorProgressChangeRef.current?.(p);
      }

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    const handleResize = () => {
      const w = container.clientWidth || 1;
      const h = container.clientHeight || 1;
      renderer.setSize(w, h);
      fitCamera(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      document.removeEventListener('pointerlockchange', onPointerLockChange);
      if (document.pointerLockElement === container) {
        try {
          document.exitPointerLock?.();
        } catch {}
      }
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      studioGroundGeo.dispose();
      studioGroundMat.dispose();
      renderer.dispose();
      retailModel.dispose();
      retailModelRef.current = null;
    };
  }, []);

  return (
    <div
      ref={mountRef}
      id="hero-3d-stage"
      className="absolute inset-0 select-none cursor-grab active:cursor-grabbing"
    />
  );
};
