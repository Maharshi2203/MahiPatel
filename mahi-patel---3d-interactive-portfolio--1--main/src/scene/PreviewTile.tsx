import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface PreviewTileProps {
  imageUrl: string;
  title: string;
  category: string;
  visible: boolean;
  mousePos: { x: number; y: number };
}

export const PreviewTile: React.FC<PreviewTileProps> = ({
  imageUrl,
  title,
  category,
  visible,
  mousePos,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const textureLoaderRef = useRef<THREE.TextureLoader>(new THREE.TextureLoader());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = 280;
    const height = 190;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0, 0, 3.4);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 3D Card Geometry with slight curved extrusion
    const geometry = new THREE.BoxGeometry(2.1, 1.35, 0.08);

    // Transparent Colorless material
    const material = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF,
      roughness: 0.1,
      metalness: 0.05,
      transparent: true,
      opacity: 0.25,
      depthWrite: false,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    meshRef.current = mesh;

    // Subtle dark edge highlight
    const edgeGeo = new THREE.EdgesGeometry(geometry);
    const edgeMat = new THREE.LineBasicMaterial({ color: 0x141413, transparent: true, opacity: 0.55 });
    const edgeLine = new THREE.LineSegments(edgeGeo, edgeMat);
    mesh.add(edgeLine);

    // Lights (Neutral, Colorless)
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1.0);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xFFFFFF, 2.0, 10);
    pointLight.position.set(2, 2, 2.5);
    scene.add(pointLight);

    let reqId: number;
    const animate = () => {
      reqId = requestAnimationFrame(animate);

      if (meshRef.current) {
        meshRef.current.rotation.y += 0.008;
        meshRef.current.rotation.x = Math.sin(Date.now() * 0.002) * 0.1;
      }

      renderer.render(scene, camera);
    };

    reqId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(reqId);
      geometry.dispose();
      material.dispose();
      edgeGeo.dispose();
      edgeMat.dispose();
      renderer.dispose();
    };
  }, []);

  // Update texture when imageUrl changes
  useEffect(() => {
    if (!imageUrl || !meshRef.current) return;

    textureLoaderRef.current.load(imageUrl, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      if (meshRef.current && meshRef.current.material instanceof THREE.MeshStandardMaterial) {
        meshRef.current.material.map = texture;
        meshRef.current.material.needsUpdate = true;
      }
    });
  }, [imageUrl]);

  // Smooth position tracking with lag
  const posRef = useRef({ x: mousePos.x, y: mousePos.y });

  useEffect(() => {
    let animId: number;
    const updatePosition = () => {
      animId = requestAnimationFrame(updatePosition);
      if (!containerRef.current) return;

      const targetX = mousePos.x + 35;
      const targetY = mousePos.y - 100;

      posRef.current.x += (targetX - posRef.current.x) * 0.15;
      posRef.current.y += (targetY - posRef.current.y) * 0.15;

      // Keep inside screen bounds
      const clampedX = Math.min(posRef.current.x, window.innerWidth - 320);
      const clampedY = Math.max(80, Math.min(posRef.current.y, window.innerHeight - 240));

      containerRef.current.style.transform = `translate3d(${clampedX}px, ${clampedY}px, 0)`;
    };

    animId = requestAnimationFrame(updatePosition);
    return () => cancelAnimationFrame(animId);
  }, [mousePos]);

  return (
    <div
      ref={containerRef}
      id="cursor-preview-tile"
      className={`pointer-events-none fixed top-0 left-0 z-40 flex flex-col transition-opacity duration-300 ${
        visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
      }`}
    >
      <div className="relative rounded-lg overflow-hidden border border-[#E5E3DD] bg-[#FFFFFF]/95 backdrop-blur-md p-1 shadow-[0_12px_40px_rgba(0,0,0,0.12)]">
        <canvas ref={canvasRef} className="block w-[280px] h-[180px] rounded" />
        <div className="px-3 py-2 border-t border-[#E5E3DD] flex items-center justify-between">
          <span className="font-mono-code text-[10px] text-[#9A773E] uppercase tracking-wider truncate max-w-[170px]">
            {category}
          </span>
          <span className="font-mono-code text-[9px] text-[#7A7770] uppercase">3D Preview</span>
        </div>
      </div>
    </div>
  );
};
