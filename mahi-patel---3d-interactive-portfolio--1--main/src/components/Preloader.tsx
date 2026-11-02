import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface PreloaderProps {
  onComplete: () => void;
  onCursorChange?: (state: 'default' | 'link' | 'drag-3d' | 'view' | 'copy') => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete, onCursorChange }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'snapping' | 'done'>('loading');

  useEffect(() => {
    // Check session storage
    const hasVisited = sessionStorage.getItem('mahi_portfolio_visited');
    if (hasVisited === 'true') {
      onComplete();
      return;
    }

    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // Three.js Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xFFFFFF);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Create 3D Wireframe Assembly Object
    // We combine an Icosahedron (UI shard) and an interior architectural frame
    const baseGeo = new THREE.IcosahedronGeometry(1.2, 1);
    const wireframeGeo = new THREE.WireframeGeometry(baseGeo);

    // Line segments with dynamic vertex colors and opacity
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x141413,
      transparent: true,
      opacity: 0.85,
      linewidth: 1.5,
    });

    const wireframeMesh = new THREE.LineSegments(wireframeGeo, lineMat);
    scene.add(wireframeMesh);

    // Transparent inner core that starts hidden and emerges as transparent glass
    const solidGeo = new THREE.IcosahedronGeometry(1.15, 1);
    const solidMat = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF,
      roughness: 0.1,
      metalness: 0.05,
      flatShading: true,
      transparent: true,
      depthWrite: false,
      opacity: 0,
    });
    const solidMesh = new THREE.Mesh(solidGeo, solidMat);
    scene.add(solidMesh);

    // Neutral Colorless Lighting (No color cast)
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1.0);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xFFFFFF, 2.5, 20);
    pointLight.position.set(3, 3, 3);
    scene.add(pointLight);

    const rimLight = new THREE.PointLight(0xEEEEEE, 1.5, 15);
    rimLight.position.set(-3, -2, -2);
    scene.add(rimLight);

    // Animation variables
    let reqId: number;
    let currentProgress = 0;
    const targetProgress = 100;
    const startTime = performance.now();
    const duration = 2200; // 2.2s cinematic build

    const animate = (time: number) => {
      reqId = requestAnimationFrame(animate);

      const elapsed = time - startTime;
      const t = Math.min(elapsed / duration, 1);

      // Smooth progress count with slight easing
      const easedT = t * t * (3 - 2 * t);
      currentProgress = Math.floor(easedT * targetProgress);
      setProgress(currentProgress);

      // Rotate assembling mesh
      wireframeMesh.rotation.x += 0.008;
      wireframeMesh.rotation.y += 0.012;
      solidMesh.rotation.x = wireframeMesh.rotation.x;
      solidMesh.rotation.y = wireframeMesh.rotation.y;

      // Scale up as it assembles
      const scale = 0.5 + 0.5 * easedT;
      wireframeMesh.scale.set(scale, scale, scale);
      solidMesh.scale.set(scale, scale, scale);

      // Flash & snap into transparent form when reaching 100%
      if (currentProgress >= 100) {
        setPhase('snapping');
        // Fade in transparent glass, pull camera back smoothly
        solidMat.opacity = Math.min(solidMat.opacity + 0.02, 0.28);
        camera.position.z += (5.8 - camera.position.z) * 0.05;

        if (solidMat.opacity >= 0.24) {
          setPhase('done');
          sessionStorage.setItem('mahi_portfolio_visited', 'true');
          setTimeout(() => {
            onComplete();
          }, 350);
        }
      }

      renderer.render(scene, camera);
    };

    reqId = requestAnimationFrame(animate);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      baseGeo.dispose();
      wireframeGeo.dispose();
      lineMat.dispose();
      solidGeo.dispose();
      solidMat.dispose();
      renderer.dispose();
    };
  }, [onComplete]);

  const handleSkip = () => {
    sessionStorage.setItem('mahi_portfolio_visited', 'true');
    onComplete();
  };

  return (
    <div
      id="portfolio-preloader"
      className={`fixed inset-0 z-50 flex flex-col justify-between bg-[#FFFFFF] p-8 md:p-14 transition-opacity duration-700 ${
        phase === 'done' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Top minimal bar */}
      <div className="flex items-center justify-between text-xs tracking-widest uppercase font-mono-code text-[#7A7770]">
        <div className="flex items-center gap-3">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#9A773E] animate-pulse" />
          <span className="text-[#141413]">Mahi Patel — Spatial Assembly</span>
        </div>
        <button
          onClick={handleSkip}
          onMouseEnter={() => onCursorChange?.('link')}
          onMouseLeave={() => onCursorChange?.('default')}
          className="text-[#7A7770] hover:text-[#141413] transition-colors border-b border-transparent hover:border-[#141413]"
        >
          [skip preloader]
        </button>
      </div>

      {/* 3D Wireframe Canvas Container */}
      <div ref={mountRef} className="absolute inset-0 flex items-center justify-center pointer-events-none" />

      {/* Bottom status & tabular numerals */}
      <div className="relative z-10 flex items-end justify-between">
        <div className="space-y-1">
          <div className="text-[10px] uppercase tracking-widest font-mono-code text-[#7A7770]">
            Initializing Stage & Geometry
          </div>
          <div className="text-xs text-[#141413]/80 font-mono-code">
            {progress < 40 && 'Compiling spatial meshes...'}
            {progress >= 40 && progress < 80 && 'Calculating photometrics & materials...'}
            {progress >= 80 && progress < 100 && 'Aligning viewport camera...'}
            {progress === 100 && 'Ready.'}
          </div>
        </div>

        {/* Huge Tabular Mono Counter */}
        <div className="flex items-baseline gap-2 font-mono-code">
          <span className="text-5xl md:text-7xl font-light tracking-tighter text-[#141413] tabular-nums">
            {progress.toString().padStart(3, '0')}
          </span>
          <span className="text-xl md:text-2xl text-[#9A773E] font-light">%</span>
        </div>
      </div>
    </div>
  );
};
