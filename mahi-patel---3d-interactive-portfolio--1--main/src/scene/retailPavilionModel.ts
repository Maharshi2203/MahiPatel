import * as THREE from 'three';

export interface BuiltRetailModel {
  group: THREE.Group;
  setColorProgress: (progress: number) => void;
  getColorProgress: () => number;
  dispose: () => void;
}

// -------------------------------------------------------------
// Procedural Canvas Texture Generators
// -------------------------------------------------------------

/** Light Scandinavian Bleached Ash / Birch Wood Flooring (Matching Mahi's Renders) */
function createBleachedAshWoodTexture(): { map: THREE.CanvasTexture; bump: THREE.CanvasTexture } {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = 1024;
  bumpCanvas.height = 1024;
  const bCtx = bumpCanvas.getContext('2d')!;

  // Base soft bleached ash tone
  ctx.fillStyle = '#E5E2DA';
  ctx.fillRect(0, 0, 1024, 1024);

  bCtx.fillStyle = '#808080';
  bCtx.fillRect(0, 0, 1024, 1024);

  const plankHeight = 52;
  const numPlanks = Math.ceil(1024 / plankHeight);

  for (let i = 0; i < numPlanks; i++) {
    const y = i * plankHeight;
    const toneVar = (Math.sin(i * 5.1) * 0.5 + 0.5) * 16;
    const r = Math.floor(226 + toneVar * 0.8);
    const g = Math.floor(222 + toneVar * 0.7);
    const b = Math.floor(214 + toneVar * 0.6);

    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(0, y, 1024, plankHeight - 2);

    // Delicate woodgrain striations
    ctx.fillStyle = 'rgba(180, 172, 160, 0.35)';
    for (let gIdx = 0; gIdx < 6; gIdx++) {
      const gy = y + Math.random() * (plankHeight - 4);
      ctx.fillRect(0, gy, 1024, 1);
    }

    // Groove seam
    ctx.fillStyle = '#C8C4BA';
    ctx.fillRect(0, y + plankHeight - 2, 1024, 2);

    bCtx.fillStyle = '#505050';
    bCtx.fillRect(0, y + plankHeight - 2, 1024, 2);
  }

  // Cross joint seams
  ctx.fillStyle = '#C8C4BA';
  bCtx.fillStyle = '#505050';
  for (let i = 0; i < numPlanks; i++) {
    const y = i * plankHeight;
    const stagger = (i % 3) * 320;
    for (let x = stagger; x < 1024; x += 320) {
      ctx.fillRect(x, y, 2, plankHeight);
      bCtx.fillRect(x, y, 2, plankHeight);
    }
  }

  const map = new THREE.CanvasTexture(canvas);
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(1.6, 1.6);

  const bump = new THREE.CanvasTexture(bumpCanvas);
  bump.wrapS = THREE.RepeatWrapping;
  bump.wrapT = THREE.RepeatWrapping;
  bump.repeat.set(1.6, 1.6);

  return { map, bump };
}

/** Perforated Architectural Pattern for Yellow Cubes */
function createPerforatedTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#EDE2A4'; // Soft butter/lime yellow
  ctx.fillRect(0, 0, 256, 256);

  ctx.fillStyle = '#D6C87C';
  const step = 16;
  for (let x = 8; x < 256; x += step) {
    for (let y = 8; y < 256; y += step) {
      ctx.beginPath();
      ctx.arc(x, y, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  return texture;
}

/** Totem Signage "New Arrivals" */
function createTotemSignageTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#FAF8F4';
  ctx.fillRect(0, 0, 512, 1024);

  // Delicate outer border
  ctx.strokeStyle = '#E2B8AB';
  ctx.lineWidth = 8;
  ctx.strokeRect(16, 16, 480, 992);

  // Botanical floral wreath circle (as in Mahi's render)
  ctx.save();
  ctx.translate(256, 320);
  ctx.strokeStyle = '#93A891';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, 140, 0, Math.PI * 2);
  ctx.stroke();

  for (let a = 0; a < Math.PI * 2; a += 0.32) {
    const lx = Math.cos(a) * 140;
    const ly = Math.sin(a) * 140;
    ctx.fillStyle = '#A3B899';
    ctx.beginPath();
    ctx.arc(lx, ly, 8, 0, Math.PI * 2);
    ctx.fill();
    if (Math.sin(a * 2.5) > 0) {
      ctx.fillStyle = '#E5989B';
      ctx.beginPath();
      ctx.arc(lx + 8, ly - 4, 6, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Typography
  ctx.fillStyle = '#2A2926';
  ctx.font = 'italic 52px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('New', 0, -12);
  ctx.font = 'bold 36px "Geist Mono", monospace';
  ctx.letterSpacing = '4px';
  ctx.fillText('ARRIVALS', 0, 45);
  ctx.restore();

  // Bottom section: Graphic Ochre Disc & Pattern
  ctx.fillStyle = '#C8933E';
  ctx.beginPath();
  ctx.arc(256, 680, 85, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#22211F';
  ctx.font = '900 36px "Geist Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('NEW', 256, 665);
  ctx.fillText('NEW', 256, 700);

  ctx.fillStyle = '#8C8983';
  ctx.font = '16px "Geist Mono", monospace';
  ctx.fillText('POP UP SHOP · CAD V', 256, 880);
  ctx.fillText('MAHI PATEL · INDUS UNIV', 256, 915);

  return new THREE.CanvasTexture(canvas);
}

/** Recessed Ceiling LED Light Tile Texture */
function createLEDTileTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, 256, 256);

  ctx.strokeStyle = '#D5D3CC';
  ctx.lineWidth = 10;
  ctx.strokeRect(5, 5, 246, 246);

  return new THREE.CanvasTexture(canvas);
}

/** Desktop Monitor Screen Texture */
function createMonitorScreenTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 160;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#1E232A';
  ctx.fillRect(0, 0, 256, 160);

  ctx.fillStyle = '#2C3440';
  ctx.fillRect(0, 0, 256, 24);

  // Window dots
  ctx.fillStyle = '#FF5F56';
  ctx.beginPath();
  ctx.arc(12, 12, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#FFBD2E';
  ctx.beginPath();
  ctx.arc(24, 12, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#27C93F';
  ctx.beginPath();
  ctx.arc(36, 12, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#425166';
  ctx.fillRect(16, 40, 140, 14);
  ctx.fillRect(16, 62, 110, 10);
  ctx.fillRect(16, 80, 125, 10);

  ctx.fillStyle = '#9A773E';
  ctx.fillRect(180, 40, 60, 28);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 12px monospace';
  ctx.fillText('POS', 196, 58);

  return new THREE.CanvasTexture(canvas);
}

// -------------------------------------------------------------
// Retail Pavilion 3D Assembly with Rotation-Driven Color Fill
// -------------------------------------------------------------

interface MaterialTransitionDef {
  mat: THREE.MeshStandardMaterial;
  clayColor: THREE.Color;
  targetColor: THREE.Color;
  clayRoughness: number;
  targetRoughness: number;
  clayMetalness: number;
  targetMetalness: number;
  textureMap?: THREE.Texture | null;
  bumpMap?: THREE.Texture | null;
  emissiveIntensity?: { clay: number; target: number };
}

export function createRetailPavilionModel(): BuiltRetailModel {
  const group = new THREE.Group();
  let currentProgress = 0.0;
  let prevHasMap = false;
  const disposables: { dispose: () => void }[] = [];
  const transitions: MaterialTransitionDef[] = [];

  const track = <T extends { dispose: () => void }>(obj: T): T => {
    disposables.push(obj);
    return obj;
  };

  // Crisp Charcoal Architectural Edge Outline Material
  const edgeLineMat = track(
    new THREE.LineBasicMaterial({
      color: 0x1A1918,
      transparent: true,
      opacity: 0.55,
    })
  );

  // Textures
  const woodPlanks = createBleachedAshWoodTexture();
  const woodTexture = track(woodPlanks.map);
  const woodBump = track(woodPlanks.bump);
  const perfYellowTex = track(createPerforatedTexture());
  const totemSignTex = track(createTotemSignageTexture());
  const ledTileTex = track(createLEDTileTexture());
  const monitorTex = track(createMonitorScreenTexture());

  // Shared reveal uniforms across all pavilion materials
  const revealUniforms = {
    uRevealProgress: { value: 0.0 },
  };

  // Helper to create a color-fillable PBR standard material with procedural reveal
  const createTransitionMat = (
    clayHex: number,
    targetHex: number,
    clayRoughness = 0.88,
    targetRoughness = 0.4,
    clayMetalness = 0.01,
    targetMetalness = 0.02,
    textureMap: THREE.Texture | null = null,
    bumpMap: THREE.Texture | null = null,
    emissiveIntensity?: { clay: number; target: number }
  ): THREE.MeshStandardMaterial => {
    const mat = track(
      new THREE.MeshStandardMaterial({
        color: clayHex,
        roughness: clayRoughness,
        metalness: clayMetalness,
      })
    );

    if (textureMap) {
      mat.map = textureMap;
    }
    if (bumpMap) {
      mat.bumpMap = bumpMap;
    }

    if (emissiveIntensity) {
      mat.emissive = new THREE.Color(targetHex);
      mat.emissiveIntensity = emissiveIntensity.clay;
    }

    // Inject clean architectural spatial elevation reveal
    mat.customProgramCacheKey = () => 'retail-rev-' + clayHex.toString(16) + (textureMap ? '-map' : '-col');
    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uRevealProgress = revealUniforms.uRevealProgress;
      shader.uniforms.uClayColor = { value: new THREE.Color(clayHex) };

      shader.vertexShader = `
varying vec3 vRevealWorldPos;
` + shader.vertexShader;

      shader.vertexShader = shader.vertexShader.replace(
        '#include <project_vertex>',
        `#include <project_vertex>
vRevealWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;`
      );

      shader.fragmentShader = `
uniform float uRevealProgress;
uniform vec3 uClayColor;
varying vec3 vRevealWorldPos;
` + shader.fragmentShader;

      // In map_fragment, blend albedo BEFORE lighting!
      // This guarantees physically accurate PBR lighting, soft shadows, and clean architectural plaster in clay mode without dirty noise or muddy color distortion.
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <map_fragment>',
        `#include <map_fragment>
    // Pure architectural elevation sweep rising smoothly from floor foundation upwards through pavilion
    float sweepCoord = (vRevealWorldPos.y * 0.72 + (vRevealWorldPos.x + vRevealWorldPos.z) * 0.18);
    float threshold = mix(-0.65, 2.25, uRevealProgress);
    float diff = sweepCoord - threshold;
    float revealFactor = smoothstep(0.14, -0.14, diff);

    // Pristine architectural clay albedo blends cleanly into authentic material albedo:
    diffuseColor.rgb = mix(uClayColor, diffuseColor.rgb, revealFactor);`
      );

      // In dithering_fragment, add a subtle, delicate warm architectural light sheen along the active wavefront
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <dithering_fragment>',
        `#include <dithering_fragment>
    float sweepCoord2 = (vRevealWorldPos.y * 0.72 + (vRevealWorldPos.x + vRevealWorldPos.z) * 0.18);
    float threshold2 = mix(-0.65, 2.25, uRevealProgress);
    float diff2 = sweepCoord2 - threshold2;
    float edgeMask = smoothstep(0.09, 0.0, abs(diff2));
    float edgeActivity = smoothstep(0.02, 0.10, uRevealProgress) * smoothstep(0.98, 0.90, uRevealProgress);
    // Subtle, soft architectural studio light sheen (warm ivory, delicate 0.35 intensity):
    gl_FragColor.rgb += vec3(0.98, 0.92, 0.82) * (edgeMask * edgeActivity * 0.35);`
      );
    };

    transitions.push({
      mat,
      clayColor: new THREE.Color(clayHex),
      targetColor: new THREE.Color(targetHex),
      clayRoughness,
      targetRoughness,
      clayMetalness,
      targetMetalness,
      textureMap,
      bumpMap,
      emissiveIntensity,
    });

    return mat;
  };

  // -----------------------------------------------------------
  // Materials Library
  // -----------------------------------------------------------
  // 1. Bleached Ash Timber Floor (Clay #EDEAE1 -> Ash Woodgrain)
  const ashFloorMat = createTransitionMat(
    0xEDEAE1,
    0xFFFFFF,
    0.85,
    0.36,
    0.01,
    0.02,
    woodTexture,
    woodBump
  );

  // Floor side plinth
  const floorPlinthMat = createTransitionMat(0xEDEAE1, 0xD0CCC2, 0.85, 0.6, 0.01, 0.05);

  // 2. Primrose Butter Yellow (Cashier Desk)
  const butterYellowMat = createTransitionMat(0xE2DFD5, 0xEFE0A2, 0.86, 0.38, 0.01, 0.02);

  // 3. Perforated Grid Material (Clay #D8D4C8 -> Perforated Yellow)
  const perfYellowMat = createTransitionMat(
    0xD8D4C8,
    0xFFFFFF,
    0.86,
    0.42,
    0.02,
    0.02,
    perfYellowTex
  );

  // 4. Muted Slate-Teal (Center Table)
  const slateTealMat = createTransitionMat(0xE2DFD5, 0x3E4E58, 0.88, 0.45, 0.01, 0.05);

  // 5. Soft Salmon / Dusty Rose (Wardrobes & Totem)
  const salmonRoseMat = createTransitionMat(0xD8D4C8, 0xE2A599, 0.86, 0.48, 0.01, 0.02);

  // 6. Sky Blue Column
  const skyBlueMat = createTransitionMat(0xD8D4C8, 0xAEC8D8, 0.86, 0.35, 0.01, 0.05);

  // 7. Crisp Gallery White (Plinths & Ceiling)
  const whiteMat = createTransitionMat(0xF5F4EE, 0xFAF9F6, 0.9, 0.3, 0.01, 0.02);

  // 8. Dark Charcoal / Slate Trim
  const darkCharcoalMat = createTransitionMat(0x625E56, 0x242322, 0.9, 0.55, 0.02, 0.1);

  // 9. Chrome Metal (Hanging Rails & Monitor Stands)
  const chromeMat = createTransitionMat(0xE5E2D8, 0xDADBDD, 0.45, 0.15, 0.25, 0.9);

  // 10. Brushed Brass & Pale Gold (Shoe Heels, Bag Hardware)
  const goldBrassMat = createTransitionMat(0xE5E2D8, 0xD4AF37, 0.45, 0.22, 0.25, 0.85);

  // Folded Fabric Knitwear Materials
  const fabricNavyMat = createTransitionMat(0xCCC7B9, 0x222C38, 0.85, 0.88);
  const fabricTealMat = createTransitionMat(0xCCC7B9, 0x2E424D, 0.85, 0.88);
  const fabricGreyMat = createTransitionMat(0xCCC7B9, 0x545350, 0.85, 0.85);
  const fabricCamelMat = createTransitionMat(0xCCC7B9, 0xA8865C, 0.85, 0.85);

  // LED Ceiling Panels
  const ledTileMat = createTransitionMat(
    0xFFFDF8,
    0xFFFAF0,
    0.3,
    0.2,
    0.01,
    0.01,
    ledTileTex,
    null,
    { clay: 0.4, target: 1.4 }
  );

  // Totem Graphic Signage
  const totemSignMat = createTransitionMat(
    0xD8D4C8,
    0xFFFFFF,
    0.86,
    0.25,
    0.01,
    0.01,
    totemSignTex,
    null,
    { clay: 0.1, target: 0.25 }
  );

  // Monitor POS Screen
  const monitorScrMat = createTransitionMat(
    0x625E56,
    0xFFFFFF,
    0.9,
    0.18,
    0.02,
    0.02,
    monitorTex,
    null,
    { clay: 0.1, target: 0.5 }
  );

  // Edge helper with architectural contour lines
  const withEdges = (mesh: THREE.Mesh, thresholdAngle = 28, materialId?: string): THREE.Mesh => {
    if (materialId) {
      mesh.userData.materialId = materialId;
    }
    const eg = track(new THREE.EdgesGeometry(mesh.geometry, thresholdAngle));
    const lines = new THREE.LineSegments(eg, edgeLineMat);
    mesh.add(lines);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  };

  // -----------------------------------------------------------
  // 1. FLOOR DECK PLATFORM
  // -----------------------------------------------------------
  const deckWidth = 3.8;
  const deckDepth = 3.8;
  const deckHeight = 0.1;

  const floorGeo = track(new THREE.BoxGeometry(deckWidth, deckHeight, deckDepth));
  const floorMesh = withEdges(
    new THREE.Mesh(floorGeo, [
      floorPlinthMat,
      floorPlinthMat,
      ashFloorMat,
      floorPlinthMat,
      floorPlinthMat,
      floorPlinthMat,
    ]),
    28,
    'bleached-ash'
  );
  floorMesh.position.set(0, -deckHeight / 2, 0);
  group.add(floorMesh);

  // -----------------------------------------------------------
  // 2. CEILING CANOPY WITH RECESSED SQUARE LED PANELS
  // -----------------------------------------------------------
  const ceilingY = 2.45;
  const ceilingW = 3.6;
  const ceilingD = 3.6;
  const ceilingGeo = track(new THREE.BoxGeometry(ceilingW, 0.08, ceilingD));
  const ceilingMesh = withEdges(new THREE.Mesh(ceilingGeo, whiteMat), 28, 'perforated-yellow');
  ceilingMesh.position.set(0, ceilingY, 0);
  group.add(ceilingMesh);

  // 4 Recessed Square LED Tiles in Ceiling
  const addLEDTile = (x: number, z: number) => {
    const tileGeo = track(new THREE.PlaneGeometry(0.55, 0.55));
    const tileMesh = new THREE.Mesh(tileGeo, ledTileMat);
    tileMesh.userData.materialId = 'butter-yellow';
    tileMesh.rotation.x = Math.PI / 2;
    tileMesh.position.set(x, ceilingY - 0.045, z);
    group.add(tileMesh);

    // Warm soft architectural downlight under each LED tile
    const light = new THREE.PointLight(0xFFF7EC, 1.2, 3.8, 1.2);
    light.position.set(x, ceilingY - 0.2, z);
    light.castShadow = true;
    light.shadow.bias = -0.0003;
    group.add(light);
  };

  addLEDTile(-1.1, -0.9);
  addLEDTile(1.1, -0.9);
  addLEDTile(-1.1, 0.9);
  addLEDTile(1.1, 0.9);

  // Suspended Geometric Ceiling Box
  const suspCeilGeo = track(new THREE.BoxGeometry(0.72, 0.32, 0.72));
  const suspCeilMesh = withEdges(new THREE.Mesh(suspCeilGeo, perfYellowMat), 28, 'perforated-yellow');
  suspCeilMesh.position.set(0.05, ceilingY - 0.25, -0.95);
  group.add(suspCeilMesh);

  // -----------------------------------------------------------
  // 3. LEFT FOREGROUND: TALL SIGNAGE TOTEM ("New Arrivals")
  // -----------------------------------------------------------
  const totemX = -1.62;
  const totemZ = 0.1;
  const totemW = 0.42;
  const totemD = 0.16;
  const totemH = 2.0;

  const totemGeo = track(new THREE.BoxGeometry(totemW, totemH, totemD));
  const totemMesh = withEdges(new THREE.Mesh(totemGeo, salmonRoseMat), 28, 'salmon-rose');
  totemMesh.position.set(totemX, totemH / 2, totemZ);
  group.add(totemMesh);

  // Front Graphic Signage Panel
  const totemSignGeo = track(new THREE.PlaneGeometry(totemW * 0.9, totemH * 0.92));
  const totemSign = new THREE.Mesh(totemSignGeo, totemSignMat);
  totemSign.userData.materialId = 'salmon-rose';
  totemSign.position.set(totemX, totemH / 2, totemZ + totemD / 2 + 0.005);
  group.add(totemSign);

  // Back Graphic Signage Panel
  const totemSignBack = new THREE.Mesh(totemSignGeo, totemSignMat);
  totemSignBack.userData.materialId = 'salmon-rose';
  totemSignBack.rotation.y = Math.PI;
  totemSignBack.position.set(totemX, totemH / 2, totemZ - totemD / 2 - 0.005);
  group.add(totemSignBack);

  // -----------------------------------------------------------
  // 4. STEPPED WHITE DISPLAY PLINTHS WITH SHOES & BAGS
  // -----------------------------------------------------------
  const stepLowerGeo = track(new THREE.BoxGeometry(0.62, 0.28, 0.62));
  const stepLower = withEdges(new THREE.Mesh(stepLowerGeo, whiteMat), 28, 'butter-yellow');
  stepLower.position.set(-0.95, 0.28 / 2, 0.45);
  group.add(stepLower);

  const stepUpperGeo = track(new THREE.BoxGeometry(0.48, 0.48, 0.48));
  const stepUpper = withEdges(new THREE.Mesh(stepUpperGeo, whiteMat), 28, 'butter-yellow');
  stepUpper.position.set(-0.88, 0.48 / 2, -0.05);
  group.add(stepUpper);

  // Handbag helper
  const addHandbag = (x: number, y: number, z: number, color: number, scale = 1) => {
    const bagGroup = new THREE.Group();
    bagGroup.position.set(x, y, z);
    bagGroup.scale.setScalar(scale);

    const bodyGeo = track(new THREE.BoxGeometry(0.12, 0.1, 0.06));
    const bagMat = createTransitionMat(0xE2DFD5, color, 0.85, 0.35, 0.01, 0.08);
    const body = withEdges(new THREE.Mesh(bodyGeo, bagMat), 28, 'butter-yellow');
    bagGroup.add(body);

    const handleGeo = track(new THREE.TorusGeometry(0.04, 0.007, 8, 16, Math.PI));
    const handle = new THREE.Mesh(handleGeo, goldBrassMat);
    handle.userData.materialId = 'champagne-brass';
    handle.position.set(0, 0.05, 0);
    bagGroup.add(handle);

    group.add(bagGroup);
  };

  addHandbag(-1.08, 0.28 + 0.06, 0.52, 0x1C1B1A, 1.15);
  addHandbag(-0.85, 0.28 + 0.05, 0.36, 0xBA7E52, 0.95);
  addHandbag(-0.88, 0.48 + 0.06, -0.02, 0x1C1B1A, 1.2);
  addHandbag(-0.74, 0.48 + 0.05, -0.14, 0xEDE2D1, 0.92);

  // High Heel Shoes Helper
  const addShoePair = (x: number, y: number, z: number, rot = 0) => {
    const shoeGroup = new THREE.Group();
    shoeGroup.position.set(x, y, z);
    shoeGroup.rotation.y = rot;

    const soleGeo = track(new THREE.BoxGeometry(0.05, 0.012, 0.12));
    const sole1 = withEdges(new THREE.Mesh(soleGeo, darkCharcoalMat), 28, 'champagne-brass');
    sole1.position.set(-0.035, 0.006, 0);
    shoeGroup.add(sole1);

    const sole2 = withEdges(new THREE.Mesh(soleGeo, darkCharcoalMat), 28, 'champagne-brass');
    sole2.position.set(0.035, 0.006, 0);
    shoeGroup.add(sole2);

    const heelGeo = track(new THREE.CylinderGeometry(0.005, 0.004, 0.065));
    const heel1 = new THREE.Mesh(heelGeo, goldBrassMat);
    heel1.userData.materialId = 'champagne-brass';
    heel1.position.set(-0.035, 0.032, -0.045);
    shoeGroup.add(heel1);

    const heel2 = new THREE.Mesh(heelGeo, goldBrassMat);
    heel2.userData.materialId = 'champagne-brass';
    heel2.position.set(0.035, 0.032, -0.045);
    shoeGroup.add(heel2);

    group.add(shoeGroup);
  };

  addShoePair(-0.85, 0.28 + 0.01, 0.58, 0.3);
  addShoePair(-0.95, 0.48 + 0.01, 0.06, -0.2);

  // -----------------------------------------------------------
  // 5. CENTER APPAREL ISLAND: MUTED SLATE-TEAL TABLE
  // -----------------------------------------------------------
  const centerTableGeo = track(new THREE.BoxGeometry(0.95, 0.54, 0.72));
  const centerTable = withEdges(new THREE.Mesh(centerTableGeo, slateTealMat), 28, 'slate-teal');
  centerTable.position.set(0.25, 0.54 / 2, 0.65);
  group.add(centerTable);

  // Folded Garment Stacks
  const addFoldedStack = (x: number, y: number, z: number, colors: THREE.MeshStandardMaterial[]) => {
    const sGroup = new THREE.Group();
    sGroup.position.set(x, y, z);
    colors.forEach((mat, idx) => {
      const gGeo = track(new THREE.BoxGeometry(0.22, 0.034, 0.25));
      const gMesh = withEdges(new THREE.Mesh(gGeo, mat), 40, 'folded-knitwear');
      gMesh.position.set(0, idx * 0.036 + 0.017, 0);
      sGroup.add(gMesh);
    });
    group.add(sGroup);
  };

  addFoldedStack(0.12, 0.54, 0.55, [fabricNavyMat, fabricGreyMat, fabricTealMat]);
  addFoldedStack(0.38, 0.54, 0.55, [fabricGreyMat, fabricNavyMat, fabricCamelMat, fabricTealMat]);
  addFoldedStack(0.25, 0.54, 0.82, [fabricTealMat, fabricNavyMat, fabricGreyMat]);

  // Beside Center: Perforated Yellow Cube
  const perfCubeGeo = track(new THREE.BoxGeometry(0.52, 0.45, 0.52));
  const perfCube = withEdges(new THREE.Mesh(perfCubeGeo, perfYellowMat), 28, 'perforated-yellow');
  perfCube.position.set(-0.38, 0.45 / 2, 0.62);
  group.add(perfCube);

  addShoePair(-0.38, 0.45 + 0.01, 0.62, -0.4);

  // -----------------------------------------------------------
  // 6. DUAL WARDROBE UNITS (SALMON/ROSE FRAMES & HANGING APPAREL)
  // -----------------------------------------------------------
  const addWardrobe = (x: number, z: number) => {
    const wGroup = new THREE.Group();
    wGroup.position.set(x, 0, z);

    // Frame
    const frameGeo = track(new THREE.BoxGeometry(0.62, 1.45, 0.35));
    const frameMesh = withEdges(new THREE.Mesh(frameGeo, salmonRoseMat), 28, 'salmon-rose');
    frameMesh.position.set(0, 1.45 / 2, 0);
    wGroup.add(frameMesh);

    // Interior cavity
    const cavityGeo = track(new THREE.BoxGeometry(0.52, 1.25, 0.32));
    const cavityMat = createTransitionMat(0xF5F4EE, 0xFDFBF7, 0.9, 0.3);
    const cavityMesh = new THREE.Mesh(cavityGeo, cavityMat);
    cavityMesh.userData.materialId = 'salmon-rose';
    cavityMesh.position.set(0, 1.45 / 2, 0.02);
    wGroup.add(cavityMesh);

    // Chrome hanging rail
    const railGeo = track(new THREE.CylinderGeometry(0.008, 0.008, 0.52));
    const rail = new THREE.Mesh(railGeo, chromeMat);
    rail.userData.materialId = 'champagne-brass';
    rail.rotation.z = Math.PI / 2;
    rail.position.set(0, 1.35, 0.02);
    wGroup.add(rail);

    // Hanging coats on hangers
    const coatColors = [fabricNavyMat, fabricCamelMat, fabricTealMat, fabricGreyMat];
    for (let i = 0; i < 4; i++) {
      const coatGeo = track(new THREE.BoxGeometry(0.065, 0.42, 0.22));
      const coatMat = coatColors[i % coatColors.length];
      const coat = withEdges(new THREE.Mesh(coatGeo, coatMat), 45, 'folded-knitwear');
      coat.position.set(-0.16 + i * 0.1, 1.1, 0.02);
      wGroup.add(coat);
    }

    // Warm interior downlight
    const wLight = new THREE.PointLight(0xFFF0D6, 0.9, 1.8);
    wLight.position.set(0, 1.35, 0.05);
    wGroup.add(wLight);

    group.add(wGroup);
  };

  // Wardrobe 1: Left-Back
  addWardrobe(-1.15, -0.65);

  // Wardrobe 2: Right-Back (Behind Cashier Desk)
  addWardrobe(1.15, -0.65);

  // -----------------------------------------------------------
  // 7. RIGHT FOREGROUND: BUTTER YELLOW CASHIER / POS DESK
  // -----------------------------------------------------------
  const cashierGeo = track(new THREE.BoxGeometry(1.35, 0.68, 0.72));
  const cashierMesh = withEdges(new THREE.Mesh(cashierGeo, butterYellowMat), 28, 'butter-yellow');
  cashierMesh.position.set(1.02, 0.68 / 2, 0.25);
  group.add(cashierMesh);

  // Desktop all-in-one Computer Monitors
  const addMonitor = (x: number, y: number, z: number, rotY = 0) => {
    const mGroup = new THREE.Group();
    mGroup.position.set(x, y, z);
    mGroup.rotation.y = rotY;

    // Aluminum Stand Base & Stem
    const sBaseGeo = track(new THREE.BoxGeometry(0.09, 0.008, 0.09));
    const sBase = new THREE.Mesh(sBaseGeo, chromeMat);
    sBase.userData.materialId = 'champagne-brass';
    mGroup.add(sBase);

    const sStemGeo = track(new THREE.BoxGeometry(0.02, 0.14, 0.016));
    const sStem = new THREE.Mesh(sStemGeo, chromeMat);
    sStem.userData.materialId = 'champagne-brass';
    sStem.position.set(0, 0.07, 0);
    mGroup.add(sStem);

    // Bezel
    const bGeo = track(new THREE.BoxGeometry(0.26, 0.18, 0.015));
    const bezel = withEdges(new THREE.Mesh(bGeo, darkCharcoalMat), 28, 'slate-teal');
    bezel.position.set(0, 0.14, 0);
    mGroup.add(bezel);

    // Screen Plane
    const scrGeo = track(new THREE.PlaneGeometry(0.24, 0.16));
    const scr = new THREE.Mesh(scrGeo, monitorScrMat);
    scr.userData.materialId = 'butter-yellow';
    scr.position.set(0, 0.14, 0.009);
    mGroup.add(scr);

    group.add(mGroup);
  };

  addMonitor(0.75, 0.68, 0.28, 0.15);
  addMonitor(1.08, 0.68, 0.28, -0.08);

  // Shopping Bags on Cashier Desk
  const addBag = (x: number, y: number, z: number, color: number) => {
    const bg = new THREE.Group();
    bg.position.set(x, y, z);

    const bGeo = track(new THREE.BoxGeometry(0.12, 0.18, 0.08));
    const bMat = createTransitionMat(0xE2DFD5, color, 0.85, 0.4);
    const bMesh = withEdges(new THREE.Mesh(bGeo, bMat), 28, 'butter-yellow');
    bMesh.position.set(0, 0.09, 0);
    bg.add(bMesh);

    const hGeo = track(new THREE.TorusGeometry(0.03, 0.004, 8, 16, Math.PI));
    const hMat = createTransitionMat(0xE5E2D8, 0x222222, 0.5, 0.4);
    const h1 = new THREE.Mesh(hGeo, hMat);
    h1.userData.materialId = 'champagne-brass';
    h1.position.set(0, 0.18, 0.02);
    bg.add(h1);
    const h2 = new THREE.Mesh(hGeo, hMat);
    h2.userData.materialId = 'champagne-brass';
    h2.position.set(0, 0.18, -0.02);
    bg.add(h2);

    group.add(bg);
  };

  addBag(1.42, 0.68, 0.24, 0x1C1B1A);
  addBag(1.54, 0.68, 0.28, 0xF8F6F0);

  // -----------------------------------------------------------
  // 8. CENTER-BACK ARCHITECTURE: COLUMN & CIRCULAR DISC
  // -----------------------------------------------------------
  const columnGeo = track(new THREE.BoxGeometry(0.38, 2.45, 0.38));
  const columnMesh = withEdges(new THREE.Mesh(columnGeo, skyBlueMat), 28, 'salmon-rose');
  columnMesh.position.set(0.05, 2.45 / 2, -0.95);
  group.add(columnMesh);

  const suspCubeGeo = track(new THREE.BoxGeometry(0.44, 0.44, 0.4));
  const suspCube = withEdges(new THREE.Mesh(suspCubeGeo, perfYellowMat), 28, 'perforated-yellow');
  suspCube.position.set(0.24, 1.35, -0.65);
  group.add(suspCube);

  const haloGeo = track(new THREE.CylinderGeometry(0.35, 0.35, 0.12, 32));
  const haloMat = createTransitionMat(0xF5F4EE, 0xF7F4EC, 0.9, 0.2);
  const halo = withEdges(new THREE.Mesh(haloGeo, haloMat), 28, 'salmon-rose');
  halo.rotation.x = Math.PI / 2;
  halo.position.set(0.62, 1.15, -0.85);
  group.add(halo);

  const hugeCubeGeo = track(new THREE.BoxGeometry(0.5, 0.68, 0.45));
  const hugeCube = withEdges(new THREE.Mesh(hugeCubeGeo, butterYellowMat), 28, 'butter-yellow');
  hugeCube.position.set(1.35, 1.72, -0.55);
  group.add(hugeCube);

  // (Note: Plant and Planter Trough removed as requested by user)

  // -----------------------------------------------------------
  // 9. REALISTIC SOFT CONTACT SHADOW UNDER FLOATING SLAB
  // -----------------------------------------------------------
  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = 512;
  shadowCanvas.height = 512;
  const sCtx = shadowCanvas.getContext('2d')!;
  const grad = sCtx.createRadialGradient(256, 256, 80, 256, 256, 245);
  grad.addColorStop(0, 'rgba(18, 16, 14, 0.36)');
  grad.addColorStop(0.5, 'rgba(18, 16, 14, 0.15)');
  grad.addColorStop(1, 'rgba(18, 16, 14, 0)');
  sCtx.fillStyle = grad;
  sCtx.fillRect(0, 0, 512, 512);

  const shadowTex = track(new THREE.CanvasTexture(shadowCanvas));
  const shadowGeo = track(new THREE.PlaneGeometry(deckWidth * 1.4, deckDepth * 1.4));
  const shadowMat = track(
    new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      toneMapped: false,
    })
  );
  const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
  shadowMesh.rotation.x = -Math.PI / 2;
  shadowMesh.position.set(0, -deckHeight - 0.005, 0);
  group.add(shadowMesh);

  // -----------------------------------------------------------
  // Progressive Color & Material Fill Controller (Organic Wavefront Cascade)
  // -----------------------------------------------------------
  const setColorProgress = (progress: number) => {
    const t = Math.max(0, Math.min(1, progress));
    currentProgress = t;

    // Drive shared procedural noise reveal wavefront across all pavilion shaders
    revealUniforms.uRevealProgress.value = t;

    // Architectural drafting edge lines soften gently as tactile materials emerge
    edgeLineMat.opacity = THREE.MathUtils.lerp(0.55, 0.22, t);

    const staggerSpan = 0.25; // 25% staggered wave across components

    for (let i = 0; i < transitions.length; i++) {
      const def = transitions[i];
      const offset = (i / transitions.length) * staggerSpan;
      const rawLocal = Math.max(0, Math.min(1, (t - offset) / (1 - staggerSpan)));
      // Silky cubic S-curve per material component
      const localT = rawLocal * rawLocal * (3 - 2 * rawLocal);

      // Blend base color
      def.mat.color.lerpColors(def.clayColor, def.targetColor, localT);
      // Blend roughness and metalness
      def.mat.roughness = THREE.MathUtils.lerp(def.clayRoughness, def.targetRoughness, localT);
      def.mat.metalness = THREE.MathUtils.lerp(def.clayMetalness, def.targetMetalness, localT);

      // Blend emissive intensity
      if (def.emissiveIntensity) {
        def.mat.emissiveIntensity = THREE.MathUtils.lerp(
          def.emissiveIntensity.clay,
          def.emissiveIntensity.target,
          localT
        );
      }
    }
  };

  // Initialize at 0 (Pure Architectural Clay Mode)
  setColorProgress(0);

  return {
    group,
    setColorProgress,
    getColorProgress: () => currentProgress,
    dispose: () => {
      disposables.forEach((d) => d.dispose());
    },
  };
}
