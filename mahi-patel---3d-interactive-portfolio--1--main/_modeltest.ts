import * as THREE from 'three';
import { createStageLighting, loadProjectModel } from './src/scene/projectModels';
import { FEATURED_PROJECTS } from './src/data/featuredProjects';
const out = document.getElementById('out')!;
const variant = new URLSearchParams(location.search).get('v');
(async () => {
  for (const p of FEATURED_PROJECTS) {
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setSize(600, 420);
    const scene = new THREE.Scene();
    createStageLighting(renderer, scene);
    const cam = new THREE.PerspectiveCamera(30, 600 / 420, 0.1, 100);
    cam.position.set(0, 9.6 * 0.3, 9.6); cam.lookAt(0, -0.25, 0);
    const m = await loadProjectModel(p);
    if (variant === 'nobump') m.group.traverse((o: any) => { if (o.material?.bumpMap) { o.material.bumpMap = null; o.material.needsUpdate = true; } });
    const t = new THREE.Group(); t.rotation.y = -Math.PI / 5; t.add(m.group); scene.add(t);
    renderer.render(scene, cam);
    out.appendChild(renderer.domElement);
  }
  document.title = 'done';
})();
