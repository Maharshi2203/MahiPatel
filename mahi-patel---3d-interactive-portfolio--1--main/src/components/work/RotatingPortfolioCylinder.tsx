import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { CONTENT_PILLARS, CategoryContentDetail } from '../../data/contentDetails';
import { ChevronLeft, ChevronRight, RotateCw, Compass } from 'lucide-react';

interface RotatingPortfolioCylinderProps {
  activeCategoryIndex: number;
  onSelectCategoryIndex: (index: number) => void;
  onCursorChange?: (state: 'default' | 'link' | 'drag-3d' | 'view' | 'copy') => void;
}

export const RotatingPortfolioCylinder: React.FC<RotatingPortfolioCylinderProps> = ({
  activeCategoryIndex,
  onSelectCategoryIndex,
  onCursorChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const cylinderGroupRef = useRef<THREE.Group | null>(null);
  const reflectionGroupRef = useRef<THREE.Group | null>(null);

  // Rotation physics & tracking
  const currentRotationY = useRef<number>(0);
  const targetRotationY = useRef<number>(0);
  const isDragging = useRef<boolean>(false);
  const previousPointerX = useRef<number>(0);
  const pointerVelocity = useRef<number>(0);
  const autoRotate = useRef<boolean>(true);
  const idleTimer = useRef<number | null>(null);

  // Stable callback refs to prevent any Three.js teardown loops
  const onSelectCategoryIndexRef = useRef(onSelectCategoryIndex);
  onSelectCategoryIndexRef.current = onSelectCategoryIndex;
  const onCursorChangeRef = useRef(onCursorChange);
  onCursorChangeRef.current = onCursorChange;

  const [currentIndex, setCurrentIndex] = useState<number>(activeCategoryIndex);
  const lastReportedIndex = useRef<number>(activeCategoryIndex);

  // Helper to render texture onto canvas (both immediate and with image)
  const drawPanelCanvas = (
    canvas: HTMLCanvasElement,
    pillar: CategoryContentDetail,
    img?: HTMLImageElement
  ) => {
    canvas.width = 1600;
    canvas.height = 900;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Base architectural gradient fill
    const bgGrad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    if (pillar.categoryKey === 'residential') {
      bgGrad.addColorStop(0, '#1E2328');
      bgGrad.addColorStop(0.5, '#2C343D');
      bgGrad.addColorStop(1, '#181C20');
    } else if (pillar.categoryKey === 'store') {
      bgGrad.addColorStop(0, '#2A241F');
      bgGrad.addColorStop(0.5, '#3A322B');
      bgGrad.addColorStop(1, '#1C1916');
    } else if (pillar.categoryKey === 'hospitality') {
      bgGrad.addColorStop(0, '#242220');
      bgGrad.addColorStop(0.5, '#35302B');
      bgGrad.addColorStop(1, '#191816');
    } else {
      bgGrad.addColorStop(0, '#2B231D');
      bgGrad.addColorStop(0.5, '#3D2F25');
      bgGrad.addColorStop(1, '#1E1712');
    }
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Draw image if loaded (cover fit with editorial blending)
    if (img && img.complete && img.naturalWidth > 0) {
      const scale = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
      const x = (canvas.width - img.naturalWidth * scale) / 2;
      const y = (canvas.height - img.naturalHeight * scale) / 2;
      ctx.drawImage(img, x, y, img.naturalWidth * scale, img.naturalHeight * scale);

      // Top and bottom cinematic dark vignettes
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, 'rgba(15, 15, 14, 0.45)');
      grad.addColorStop(0.35, 'rgba(15, 15, 14, 0.15)');
      grad.addColorStop(0.65, 'rgba(15, 15, 14, 0.35)');
      grad.addColorStop(1, 'rgba(15, 15, 14, 0.85)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // 3. Side vignettes to create panoramic curved depth
    const sideGrad = ctx.createLinearGradient(0, 0, canvas.width, 0);
    sideGrad.addColorStop(0, 'rgba(10, 10, 10, 0.6)');
    sideGrad.addColorStop(0.12, 'rgba(10, 10, 10, 0.05)');
    sideGrad.addColorStop(0.88, 'rgba(10, 10, 10, 0.05)');
    sideGrad.addColorStop(1, 'rgba(10, 10, 10, 0.6)');
    ctx.fillStyle = sideGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 4. Top category index tag (e.g. "01 / 04")
    ctx.fillStyle = '#C9A47E';
    ctx.font = '500 28px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${pillar.number} / 04`, canvas.width / 2, 130);

    // 5. Category eyebrow (e.g. "RESIDENTIAL SPACE")
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.font = '500 22px monospace';
    ctx.letterSpacing = '4px';
    ctx.fillText(pillar.subtitle.toUpperCase(), canvas.width / 2, 180);

    // 6. Primary Display Title (like "Journey" in aikawakenichi reference)
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 6;
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'italic 400 115px "Instrument Serif", "Times New Roman", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText(pillar.name, canvas.width / 2, canvas.height / 2 + 35);
    ctx.restore();

    // 7. Lead quote / subtitle preview
    ctx.fillStyle = 'rgba(255, 255, 255, 0.82)';
    ctx.font = '300 26px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(pillar.leadQuote, canvas.width / 2, canvas.height - 110);

    // 8. Thin luxury border frame
    ctx.strokeStyle = 'rgba(201, 164, 126, 0.45)';
    ctx.lineWidth = 4;
    ctx.strokeRect(24, 24, canvas.width - 48, canvas.height - 48);
  };

  // Rotate smoothly to specific index (0, 1, 2, 3)
  const rotateToIndex = useCallback((index: number) => {
    const step = (Math.PI * 2) / 4;
    const targetAngle = -index * step;
    const current = targetRotationY.current;
    const diff = ((targetAngle - current + Math.PI) % (Math.PI * 2)) - Math.PI;
    targetRotationY.current = current + diff;
    autoRotate.current = false;
    setCurrentIndex(index);
    lastReportedIndex.current = index;
    onSelectCategoryIndexRef.current(index);

    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = window.setTimeout(() => {
      autoRotate.current = true;
    }, 6000);
  }, []);

  // Sync external index changes smoothly without re-mounting Three.js
  useEffect(() => {
    if (activeCategoryIndex !== lastReportedIndex.current) {
      rotateToIndex(activeCategoryIndex);
    }
  }, [activeCategoryIndex, rotateToIndex]);

  // Three.js Mount & Animation Lifecycle (Runs ONCE on mount)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 560;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera: slightly elevated perspective looking down at the center of the cylinder
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.35, 8.8);
    camera.lookAt(0, -0.15, 0);
    cameraRef.current = camera;

    // 3. WebGL Renderer with transparent background
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1.3);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xFFF8F0, 1.4);
    keyLight.position.set(4, 6, 8);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xC9A47E, 0.9);
    rimLight.position.set(-6, -2, -5);
    scene.add(rimLight);

    // 5. Main 3D Cylinder Group
    const cylinderGroup = new THREE.Group();
    cylinderGroup.position.set(0, 0.1, 0);
    scene.add(cylinderGroup);
    cylinderGroupRef.current = cylinderGroup;

    // 6. Reflected Group for ground mirror effect (as in aikawakenichi reference)
    const reflectionGroup = new THREE.Group();
    // Inverted Y scale positioned symmetrically below the floor plane
    reflectionGroup.position.set(0, -2.15, 0);
    reflectionGroup.scale.set(1, -0.96, 1);
    scene.add(reflectionGroup);
    reflectionGroupRef.current = reflectionGroup;

    // 7. Ground mirror disc plane with soft translucent gloss
    const floorGeo = new THREE.CircleGeometry(6.5, 48);
    const floorMat = new THREE.MeshBasicMaterial({
      color: 0xFFFFFF,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = -1.08;
    floorMesh.renderOrder = 2;
    scene.add(floorMesh);

    // 8. Build 4 curved cylinder segments for the 4 categories
    const radius = 3.65;
    const cylinderHeight = 2.25;
    const count = 4;
    const stepAngle = (Math.PI * 2) / count;
    const arcLength = stepAngle * 0.88;
    const halfGap = (stepAngle - arcLength) / 2;

    const materials: THREE.MeshStandardMaterial[] = [];
    const reflectionMaterials: THREE.MeshStandardMaterial[] = [];
    const textures: THREE.CanvasTexture[] = [];

    CONTENT_PILLARS.forEach((pillar, i) => {
      const canvas = document.createElement('canvas');
      // Draw immediate rich background so there is NEVER a blank delay
      drawPanelCanvas(canvas, pillar);

      const texture = new THREE.CanvasTexture(canvas);
      texture.generateMipmaps = true;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.needsUpdate = true;
      textures.push(texture);

      // Preload image asynchronously to update texture once loaded
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = pillar.coverImage;
      img.onload = () => {
        drawPanelCanvas(canvas, pillar, img);
        texture.needsUpdate = true;
      };

      const thetaStart = i * stepAngle + halfGap;
      const geometry = new THREE.CylinderGeometry(
        radius,
        radius,
        cylinderHeight,
        48,
        1,
        true,
        thetaStart,
        arcLength
      );

      // Main cylinder panel material
      const material = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        roughness: 0.25,
        metalness: 0.08,
        transparent: true,
        opacity: 0.98,
      });
      materials.push(material);

      const mesh = new THREE.Mesh(geometry, material);
      cylinderGroup.add(mesh);

      // Mirrored reflection panel material (vivid ground mirror effect)
      const reflectMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        roughness: 0.35,
        metalness: 0.05,
        transparent: true,
        opacity: 0.58,
      });
      reflectionMaterials.push(reflectMaterial);

      const reflectMesh = new THREE.Mesh(geometry, reflectMaterial);
      reflectionGroup.add(reflectMesh);
    });

    // 9. Interactive Drag & Pointer Events
    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging.current = true;
      autoRotate.current = false;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      previousPointerX.current = clientX;
      pointerVelocity.current = 0;
      onCursorChangeRef.current?.('drag-3d');
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging.current) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const deltaX = clientX - previousPointerX.current;
      previousPointerX.current = clientX;

      const rotationDelta = deltaX * 0.0055;
      targetRotationY.current += rotationDelta;
      pointerVelocity.current = rotationDelta;
    };

    const handlePointerUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      onCursorChangeRef.current?.('default');

      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = window.setTimeout(() => {
        autoRotate.current = true;
      }, 6000);
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);

    dom.addEventListener('touchstart', handlePointerDown, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerUp);

    // 10. Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = entry.contentRect.width;
        const newHeight = entry.contentRect.height || 560;
        camera.aspect = newWidth / newHeight;
        if (newWidth < 640) {
          camera.position.z = 10.5;
        } else if (newWidth < 1024) {
          camera.position.z = 9.4;
        } else {
          camera.position.z = 8.8;
        }
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
      }
    });
    resizeObserver.observe(container);

    // 11. Animation Loop
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Auto rotation when idle
      if (autoRotate.current && !isDragging.current) {
        targetRotationY.current += 0.003;
      }

      // Momentum deceleration
      if (!isDragging.current && Math.abs(pointerVelocity.current) > 0.0001) {
        targetRotationY.current += pointerVelocity.current;
        pointerVelocity.current *= 0.94;
      }

      // Smooth spring damping
      currentRotationY.current += (targetRotationY.current - currentRotationY.current) * 0.09;

      if (cylinderGroupRef.current) {
        cylinderGroupRef.current.rotation.y = currentRotationY.current;
      }
      if (reflectionGroupRef.current) {
        reflectionGroupRef.current.rotation.y = currentRotationY.current;
      }

      // Compute which category is facing forward
      const normalizedAngle = ((-currentRotationY.current % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      const computedIndex = Math.round(normalizedAngle / stepAngle) % count;
      if (computedIndex !== lastReportedIndex.current) {
        lastReportedIndex.current = computedIndex;
        setCurrentIndex(computedIndex);
        onSelectCategoryIndexRef.current(computedIndex);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      if (idleTimer.current) clearTimeout(idleTimer.current);

      dom.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);

      dom.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);

      resizeObserver.disconnect();
      materials.forEach((m) => m.dispose());
      reflectionMaterials.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []); // Run ONCE on mount

  const activePillar = CONTENT_PILLARS[currentIndex] || CONTENT_PILLARS[0];

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % 4;
    rotateToIndex(nextIdx);
  };

  const handlePrev = () => {
    const prevIdx = (currentIndex - 1 + 4) % 4;
    rotateToIndex(prevIdx);
  };

  return (
    <section
      id="portfolio-rotating-cylinder-section"
      className="relative w-full overflow-hidden select-none bg-[#FFFFFF] pt-2 sm:pt-4 pb-8 -mx-6 md:-mx-12 px-6 md:px-12 transition-all min-h-[580px]"
    >
      {/* =============================================================== */}
      {/* 1. GIANT OVERSIZED BACKGROUND TYPOGRAPHY: "PORTFOLIO"           */}
      {/* Exactly as in the user's uploaded reference image                */}
      {/* =============================================================== */}
      <div
        className="absolute -top-4 sm:-top-8 md:-top-12 lg:-top-16 left-0 right-0 pointer-events-none flex items-center justify-center overflow-hidden z-0"
        aria-hidden="true"
      >
        <h2
          className="font-display font-normal text-[22vw] sm:text-[23vw] lg:text-[24vw] leading-none tracking-tight text-[#141413] select-none text-center whitespace-nowrap"
          style={{
            fontFamily: '"Instrument Serif", "Didot", "Bodoni MT", "Times New Roman", serif',
            letterSpacing: '-0.02em',
          }}
        >
          PORTFOLIO
        </h2>
      </div>

      {/* =============================================================== */}
      {/* 2. THREE.JS ROTATING 3D CYLINDER CANVAS STAGE                   */}
      {/* Curved panels with ground mirror reflection                      */}
      {/* =============================================================== */}
      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center">
        <div
          ref={containerRef}
          id="rotating-cylinder-3d-stage"
          className="relative w-full h-[400px] sm:h-[480px] md:h-[540px] lg:h-[580px] cursor-grab active:cursor-grabbing touch-none focus-visible:outline-none"
          tabIndex={0}
          role="region"
          aria-label="Interactive 3D rotating portfolio cylinder. Drag horizontally to spin."
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'ArrowLeft') handlePrev();
          }}
        />

        {/* =============================================================== */}
        {/* 3. INTERACTIVE HUD CONTROLS & PILL NAVIGATION                   */}
        {/* 1. RESIDENTIAL SPACE, 2. COMMERCIAL, 3. HOSPITALITY, 4. THESIS */}
        {/* =============================================================== */}
        <div className="relative z-20 w-full flex flex-col items-center gap-5 mt-2">
          {/* Active Category Display Bar */}
          <div className="flex items-center justify-between w-full max-w-4xl px-4 font-mono-code text-xs">
            <div className="flex items-center gap-2 text-[#9A773E]">
              <Compass className="h-3.5 w-3.5" />
              <span className="uppercase tracking-widest">
                [ 0{currentIndex + 1} / 04 ] {activePillar.title}
              </span>
            </div>

            <span className="hidden sm:inline-block text-[#7A7770] text-[11px] tracking-wider uppercase">
              Drag horizontally to rotate · Click pill to center
            </span>
          </div>

          {/* Quick-Select Pillar Buttons with Numbering as requested */}
          <div
            role="tablist"
            aria-label="Direct 3D Pillar Selectors"
            className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 md:gap-4 max-w-4xl px-2"
          >
            {CONTENT_PILLARS.map((pillar, idx) => {
              const isActive = currentIndex === idx;
              return (
                <button
                  key={pillar.id}
                  id={`cylinder-pill-${pillar.id}`}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => rotateToIndex(idx)}
                  onMouseEnter={() => onCursorChangeRef.current?.('link')}
                  onMouseLeave={() => onCursorChangeRef.current?.('default')}
                  className={`group relative px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-xs font-mono-code tracking-wider uppercase transition-all duration-300 flex items-center gap-2 border ${
                    isActive
                      ? 'bg-[#141413] text-[#FFFFFF] border-[#141413] shadow-md shadow-black/10 scale-105'
                      : 'bg-[#FFFFFF]/90 hover:bg-[#F5F3EF] text-[#7A7770] hover:text-[#141413] border-[#E5E3DD]'
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full transition-colors ${
                      isActive ? 'bg-[#C9A47E]' : 'bg-[#C5C2BA] group-hover:bg-[#9A773E]'
                    }`}
                  />
                  <span className="font-medium">{pillar.title}</span>
                </button>
              );
            })}
          </div>

          {/* Floating Left/Right Directional Arrows */}
          <div className="flex items-center gap-4 pt-1">
            <button
              id="cylinder-nav-prev"
              onClick={handlePrev}
              aria-label="Rotate to previous category"
              onMouseEnter={() => onCursorChangeRef.current?.('link')}
              onMouseLeave={() => onCursorChangeRef.current?.('default')}
              className="h-10 w-10 rounded-full border border-[#E5E3DD] bg-[#FFFFFF]/95 hover:bg-[#141413] hover:text-[#FFFFFF] text-[#141413] flex items-center justify-center transition-all duration-200 shadow-sm"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <span className="font-mono-code text-[11px] text-[#A09E96] tracking-widest uppercase">
              360° Rotating Cylinder
            </span>

            <button
              id="cylinder-nav-next"
              onClick={handleNext}
              aria-label="Rotate to next category"
              onMouseEnter={() => onCursorChangeRef.current?.('link')}
              onMouseLeave={() => onCursorChangeRef.current?.('default')}
              className="h-10 w-10 rounded-full border border-[#E5E3DD] bg-[#FFFFFF]/95 hover:bg-[#141413] hover:text-[#FFFFFF] text-[#141413] flex items-center justify-center transition-all duration-200 shadow-sm"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
