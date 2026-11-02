import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ProjectWaypoint } from '../types';

interface CameraPathViewerProps {
  type: 'ux' | 'interior';
  waypoints: ProjectWaypoint[];
  currentWaypointIndex: number;
  onWaypointSelect: (index: number) => void;
  screensOrImages: string[];
}

export const CameraPathViewer: React.FC<CameraPathViewerProps> = ({
  type,
  waypoints,
  currentWaypointIndex,
  onWaypointSelect,
  screensOrImages,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const targetLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const currentLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const targetCamPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 1.8, 4.5));
  const [isLoaded, setIsLoaded] = useState(false);

  // Sync target camera coordinates when currentWaypointIndex updates
  useEffect(() => {
    if (!waypoints || waypoints.length === 0) return;
    const wp = waypoints[currentWaypointIndex] || waypoints[0];
    targetCamPosRef.current.set(wp.position[0], wp.position[1], wp.position[2]);
    targetLookAtRef.current.set(wp.target[0], wp.target[1], wp.target[2]);
  }, [currentWaypointIndex, waypoints]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xFFFFFF);
    scene.fog = new THREE.FogExp2(0xFFFFFF, 0.06);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 80);
    const initialWp = waypoints[0] || { position: [0, 1.8, 4.5], target: [0, 0, 0] };
    camera.position.set(initialWp.position[0], initialWp.position[1], initialWp.position[2]);
    cameraRef.current = camera;

    currentLookAtRef.current.set(initialWp.target[0], initialWp.target[1], initialWp.target[2]);
    camera.lookAt(currentLookAtRef.current);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.appendChild(renderer.domElement);

    // Lights - Neutral, Colorless
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1.0);
    scene.add(ambientLight);

    const neutralKeyLight = new THREE.PointLight(0xFFFFFF, 2.0, 25);
    neutralKeyLight.position.set(2, 3, 2);
    scene.add(neutralKeyLight);

    const neutralRimLight = new THREE.PointLight(0xEEEEEE, 1.2, 20);
    neutralRimLight.position.set(-3, -1, -2);
    scene.add(neutralRimLight);

    // Subtle guide grid floor in mono lines
    const gridHelper = new THREE.GridHelper(24, 24, 0xDCD9D1, 0xEDEAE3);
    gridHelper.position.y = -1.2;
    scene.add(gridHelper);

    // Texture loader
    const textureLoader = new THREE.TextureLoader();

    // Group for spatial stage
    const stageGroup = new THREE.Group();
    scene.add(stageGroup);

    if (type === 'ux') {
      // ----------------------------------------------------
      // UX TUNNEL: Floating layered app screens along corridor
      // ----------------------------------------------------
      const panelCount = 4;
      const panelGeo = new THREE.PlaneGeometry(2.4, 1.45);

      for (let i = 0; i < panelCount; i++) {
        const panelGroup = new THREE.Group();
        
        // Crisp gallery white frame with brass edging
        const frameGeo = new THREE.BoxGeometry(2.44, 1.49, 0.04);
        const frameMat = new THREE.MeshStandardMaterial({
          color: 0xFFFFFF,
          roughness: 0.3,
          metalness: 0.1,
        });
        const frame = new THREE.Mesh(frameGeo, frameMat);
        panelGroup.add(frame);

        // Screen plane
        const screenMat = new THREE.MeshBasicMaterial({
          color: 0xF2F0EB,
          side: THREE.DoubleSide,
        });

        const imageSrc = screensOrImages[i % screensOrImages.length];
        if (imageSrc) {
          textureLoader.load(imageSrc, (tex) => {
            tex.colorSpace = THREE.SRGBColorSpace;
            screenMat.map = tex;
            screenMat.color.set(0xffffff);
            screenMat.needsUpdate = true;
          });
        }

        const screenMesh = new THREE.Mesh(panelGeo, screenMat);
        screenMesh.position.z = 0.025;
        panelGroup.add(screenMesh);

        // Wireframe border
        const wireGeo = new THREE.EdgesGeometry(frameGeo);
        const wireMat = new THREE.LineBasicMaterial({
          color: 0x9A773E,
          transparent: true,
          opacity: 0.6,
        });
        const wire = new THREE.LineSegments(wireGeo, wireMat);
        panelGroup.add(wire);

        // Position staggered along depth corridor
        const zOffset = -i * 2.2;
        const xOffset = (i % 2 === 0 ? -0.7 : 0.7) * (1 - i * 0.15);
        const yOffset = (i % 2 === 0 ? 0.3 : -0.2);
        panelGroup.position.set(xOffset, yOffset, zOffset);
        panelGroup.rotation.y = (i % 2 === 0 ? 0.15 : -0.15);

        stageGroup.add(panelGroup);
      }
    } else {
      // ----------------------------------------------------
      // INTERIOR WALKTHROUGH: Transparent Architectural Model
      // ----------------------------------------------------
      const roomGroup = new THREE.Group();

      // Shared edge material for architectural definition
      const archEdgeMat = new THREE.LineBasicMaterial({
        color: 0x141413,
        transparent: true,
        opacity: 0.45,
      });

      // Floor slab (Transparent & Colorless)
      const floorGeo = new THREE.BoxGeometry(7, 0.2, 8);
      const floorMat = new THREE.MeshStandardMaterial({
        color: 0xFFFFFF,
        transparent: true,
        opacity: 0.2,
        roughness: 0.1,
        metalness: 0.05,
        depthWrite: false,
      });
      const floor = new THREE.Mesh(floorGeo, floorMat);
      floor.position.set(0, -1.2, -1.5);
      const floorEdges = new THREE.LineSegments(new THREE.EdgesGeometry(floorGeo), archEdgeMat);
      floor.add(floorEdges);
      roomGroup.add(floor);

      // Back gallery wall (Transparent & Colorless)
      const wallGeo = new THREE.BoxGeometry(7, 3.2, 0.15);
      const wallMat = new THREE.MeshStandardMaterial({
        color: 0xFFFFFF,
        transparent: true,
        opacity: 0.18,
        roughness: 0.1,
        metalness: 0.05,
        depthWrite: false,
      });
      const backWall = new THREE.Mesh(wallGeo, wallMat);
      backWall.position.set(0, 0.4, -5.4);
      const backWallEdges = new THREE.LineSegments(new THREE.EdgesGeometry(wallGeo), archEdgeMat);
      backWall.add(backWallEdges);
      roomGroup.add(backWall);

      // Side partition with pass-through doorway
      const sideWallGeo = new THREE.BoxGeometry(0.15, 3.2, 5);
      const sideWall = new THREE.Mesh(sideWallGeo, wallMat);
      sideWall.position.set(-3.4, 0.4, -2);
      const sideWallEdges = new THREE.LineSegments(new THREE.EdgesGeometry(sideWallGeo), archEdgeMat);
      sideWall.add(sideWallEdges);
      roomGroup.add(sideWall);

      // Suspended architectural artwork / render planes on walls
      for (let i = 0; i < 3; i++) {
        const artGeo = new THREE.PlaneGeometry(2.0, 1.3);
        const artMat = new THREE.MeshStandardMaterial({
          color: 0xFFFFFF,
          roughness: 0.3,
          metalness: 0.05,
          transparent: true,
          opacity: 0.85,
        });

        const imageSrc = screensOrImages[i % screensOrImages.length];
        if (imageSrc) {
          textureLoader.load(imageSrc, (tex) => {
            tex.colorSpace = THREE.SRGBColorSpace;
            artMat.map = tex;
            artMat.needsUpdate = true;
          });
        }

        const art = new THREE.Mesh(artGeo, artMat);
        if (i === 0) {
          art.position.set(0, 0.5, -5.3);
        } else if (i === 1) {
          art.position.set(-3.3, 0.5, -2.2);
          art.rotation.y = Math.PI / 2;
        } else {
          art.position.set(2.4, 0.2, -1.5);
          art.rotation.y = -Math.PI / 4;
        }

        // Neutral dark picture frame
        const frameGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(2.04, 1.34, 0.04));
        const frameMat = new THREE.LineBasicMaterial({ color: 0x141413, transparent: true, opacity: 0.55 });
        const frameMesh = new THREE.LineSegments(frameGeo, frameMat);
        art.add(frameMesh);

        roomGroup.add(art);
      }

      // Architectural plinth/bench (Transparent & Colorless)
      const plinthGeo = new THREE.BoxGeometry(2.2, 0.35, 0.8);
      const plinthMat = new THREE.MeshStandardMaterial({
        color: 0xFFFFFF,
        transparent: true,
        opacity: 0.28,
        roughness: 0.1,
        metalness: 0.05,
        depthWrite: false,
      });
      const plinth = new THREE.Mesh(plinthGeo, plinthMat);
      plinth.position.set(0.4, -0.9, -2.4);
      const plinthEdges = new THREE.LineSegments(new THREE.EdgesGeometry(plinthGeo), archEdgeMat);
      plinth.add(plinthEdges);
      roomGroup.add(plinth);

      stageGroup.add(roomGroup);
    }

    setIsLoaded(true);

    // Animation loop: smoothly interpolate camera position & lookAt
    let reqId: number;
    const animate = () => {
      reqId = requestAnimationFrame(animate);

      // Lerp camera position
      camera.position.lerp(targetCamPosRef.current, 0.045);

      // Lerp camera lookAt target
      currentLookAtRef.current.lerp(targetLookAtRef.current, 0.045);
      camera.lookAt(currentLookAtRef.current);

      // Subtle float movement on stage
      stageGroup.position.y = Math.sin(Date.now() * 0.001) * 0.03;

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
      renderer.dispose();
      gridHelper.dispose();
    };
  }, [type, waypoints, screensOrImages]);

  return (
    <div className="relative w-full h-full">
      {/* Three.js Canvas Container */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full select-none" />

      {/* Floating 3D Waypoint scrubber overlay */}
      <div className="absolute bottom-6 left-6 right-6 md:left-12 md:right-auto z-20 flex items-center gap-3 bg-[#FFFFFF]/90 backdrop-blur-md border border-[#E5E3DD] px-4 py-2.5 rounded-full shadow-lg">
        <span className="font-mono-code text-[10px] uppercase text-[#7A7770] tracking-widest mr-1">
          Camera Waypoints:
        </span>
        <div className="flex items-center gap-1.5">
          {waypoints.map((wp, idx) => (
            <button
              key={idx}
              id={`waypoint-btn-${idx}`}
              onClick={() => onWaypointSelect(idx)}
              className={`group flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono-code transition-all duration-300 ${
                currentWaypointIndex === idx
                  ? 'bg-[#9A773E] text-[#FFFFFF] font-medium shadow-sm'
                  : 'text-[#7A7770] hover:text-[#141413] hover:bg-[#F2F1ED]'
              }`}
            >
              <span>{`0${idx + 1}`}</span>
              {currentWaypointIndex === idx && (
                <span className="hidden sm:inline text-[10px] tracking-tight">{wp.badge || 'Focal'}</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
