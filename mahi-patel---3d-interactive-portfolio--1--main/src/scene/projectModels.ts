import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { FeaturedProject, ProjectModelKey } from '../types';

/**
 * Procedural architectural models for the Content page projects.
 *
 * Models are built at real-world scale (metres) with physically based materials,
 * procedurally generated surface textures (brick, timber, terrazzo, plaster…)
 * using metric UVs, and are lit by an environment map with soft cast shadows
 * (see `createStageLighting`). Meshes tagged `userData.roof` are hidden in the
 * generated plan view so the plan reads as a cut through the building.
 */

export interface BuiltModel {
  group: THREE.Group;
  dispose: () => void;
}

type Vec3 = [number, number, number];
type Mat = THREE.Material | THREE.Material[];

interface MeshOpts {
  roof?: boolean;
  rot?: Vec3;
  parent?: THREE.Object3D;
}

// ---------------------------------------------------------------------------
// Procedural textures
// ---------------------------------------------------------------------------

type TexKind =
  | 'wood'
  | 'plaster'
  | 'concrete'
  | 'terrazzo'
  | 'brick'
  | 'tile'
  | 'stone'
  | 'fabric'
  | 'grass'
  | 'marble';

/** Real-world size (m) one texture repeat covers. */
const TILE: Record<TexKind, number> = {
  wood: 1.2,
  plaster: 2.5,
  concrete: 2,
  terrazzo: 1.2,
  brick: 0.96,
  tile: 1.6,
  stone: 1.6,
  fabric: 0.4,
  grass: 2.5,
  marble: 1.4,
};

const BUMP: Record<TexKind, number> = {
  wood: 0.15,
  plaster: 0.25,
  concrete: 0.3,
  terrazzo: 0.1,
  brick: 1.1,
  tile: 1.6,
  stone: 1.1,
  fabric: 0.5,
  grass: 0.7,
  marble: 0,
};

const S = 512;

const rng = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const rgb = (hex: number, f = 1, a = 1) => {
  const c = (v: number) => Math.max(0, Math.min(255, Math.round(v * f)));
  return `rgba(${c((hex >> 16) & 255)},${c((hex >> 8) & 255)},${c(hex & 255)},${a})`;
};

function speckle(ctx: CanvasRenderingContext2D, r: () => number, hex: number, n: number, size: number, spread: number, alpha: number) {
  for (let i = 0; i < n; i++) {
    ctx.fillStyle = rgb(hex, 1 + (r() - 0.5) * spread, alpha * (0.4 + r() * 0.6));
    const s = 0.5 + r() * size;
    ctx.fillRect(r() * S, r() * S, s, s);
  }
}

function blotches(ctx: CanvasRenderingContext2D, r: () => number, hex: number, n: number, alpha: number) {
  for (let i = 0; i < n; i++) {
    const x = r() * S;
    const y = r() * S;
    const rad = 30 + r() * 110;
    const g = ctx.createRadialGradient(x, y, 0, x, y, rad);
    g.addColorStop(0, rgb(hex, r() > 0.5 ? 0.88 : 1.08, alpha));
    g.addColorStop(1, rgb(hex, 1, 0));
    ctx.fillStyle = g;
    ctx.fillRect(x - rad, y - rad, rad * 2, rad * 2);
  }
}

const PAINTERS: Record<TexKind, (ctx: CanvasRenderingContext2D, hex: number, r: () => number) => void> = {
  wood: (ctx, hex, r) => {
    ctx.fillStyle = rgb(hex);
    ctx.fillRect(0, 0, S, S);
    for (let i = 0; i < 240; i++) {
      const y = r() * S;
      const amp = 1 + r() * 5;
      const freq = 1 + Math.floor(r() * 3);
      const ph = r() * 6.28;
      ctx.strokeStyle = rgb(hex, 0.72 + r() * 0.45, 0.18 + r() * 0.35);
      ctx.lineWidth = 0.5 + r() * 2.5;
      ctx.beginPath();
      for (let x = 0; x <= S; x += 16) {
        const yy = y + Math.sin((x / S) * Math.PI * 2 * freq + ph) * amp;
        x === 0 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy);
      }
      ctx.stroke();
    }
    // plank joints
    for (let p = 0; p < 4; p++) {
      ctx.fillStyle = rgb(hex, 0.55, 0.5);
      ctx.fillRect(0, p * (S / 4), S, 1.5);
    }
  },
  plaster: (ctx, hex, r) => {
    ctx.fillStyle = rgb(hex);
    ctx.fillRect(0, 0, S, S);
    blotches(ctx, r, hex, 26, 0.05);
    speckle(ctx, r, hex, 7000, 1.5, 0.12, 0.25);
  },
  concrete: (ctx, hex, r) => {
    ctx.fillStyle = rgb(hex);
    ctx.fillRect(0, 0, S, S);
    blotches(ctx, r, hex, 40, 0.09);
    speckle(ctx, r, hex, 9000, 1.8, 0.3, 0.35);
    for (let i = 0; i < 60; i++) {
      ctx.fillStyle = rgb(hex, 0.7, 0.35);
      ctx.beginPath();
      ctx.arc(r() * S, r() * S, 0.6 + r() * 1.4, 0, Math.PI * 2);
      ctx.fill();
    }
  },
  terrazzo: (ctx, hex, r) => {
    ctx.fillStyle = rgb(hex);
    ctx.fillRect(0, 0, S, S);
    speckle(ctx, r, hex, 4000, 1.2, 0.15, 0.3);
    const chips = [0xffffff, 0x8c8a85, 0xb89a72, 0x55514d, 0xd9cdb8, 0xa86a4a];
    for (let i = 0; i < 1600; i++) {
      const x = r() * S;
      const y = r() * S;
      const s = 1.5 + r() * 6;
      ctx.fillStyle = rgb(chips[Math.floor(r() * chips.length)], 0.9 + r() * 0.2, 0.92);
      ctx.beginPath();
      for (let p = 0; p < 5; p++) {
        const a = (p / 5) * Math.PI * 2 + r() * 0.8;
        const rr = s * (0.5 + r() * 0.6);
        p === 0 ? ctx.moveTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr) : ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
      }
      ctx.closePath();
      ctx.fill();
    }
  },
  brick: (ctx, hex, r) => {
    ctx.fillStyle = '#cdbfac';
    ctx.fillRect(0, 0, S, S);
    const rows = 12;
    const cols = 4;
    const bh = S / rows;
    const bw = S / cols;
    const m = 5;
    for (let row = 0; row < rows; row++) {
      const off = row % 2 ? bw / 2 : 0;
      for (let c = -1; c <= cols; c++) {
        const x = c * bw + off;
        const f = 0.78 + r() * 0.34;
        ctx.fillStyle = rgb(hex, f);
        ctx.fillRect(x + m / 2, row * bh + m / 2, bw - m, bh - m);
        // fired-face variation
        const g = ctx.createLinearGradient(x, row * bh, x + bw, row * bh + bh);
        g.addColorStop(0, rgb(hex, f * 1.1, 0.25));
        g.addColorStop(1, rgb(hex, f * 0.8, 0.3));
        ctx.fillStyle = g;
        ctx.fillRect(x + m / 2, row * bh + m / 2, bw - m, bh - m);
      }
    }
    speckle(ctx, r, hex, 6000, 1.6, 0.5, 0.35);
  },
  tile: (ctx, hex, r) => {
    // Clay roof tiles: courses run across the canvas X (down the roof slope)
    const n = 8;
    const cw = S / n;
    for (let i = 0; i < n; i++) {
      const g = ctx.createLinearGradient(i * cw, 0, (i + 1) * cw, 0);
      const f = 0.9 + r() * 0.2;
      g.addColorStop(0, rgb(hex, f * 0.62));
      g.addColorStop(0.25, rgb(hex, f * 1.12));
      g.addColorStop(0.7, rgb(hex, f));
      g.addColorStop(1, rgb(hex, f * 0.7));
      ctx.fillStyle = g;
      ctx.fillRect(i * cw, 0, cw, S);
      const joints = 6;
      const off = (i % 2) * (S / joints / 2);
      for (let j = 0; j <= joints; j++) {
        const y = j * (S / joints) + off;
        ctx.fillStyle = rgb(hex, 0.45, 0.8);
        ctx.fillRect(i * cw, y, cw, 2);
        ctx.fillStyle = rgb(hex, f * (0.85 + r() * 0.3), 0.35);
        ctx.fillRect(i * cw, y + 2, cw, S / joints - 2);
      }
    }
    speckle(ctx, r, hex, 5000, 1.5, 0.5, 0.3);
  },
  stone: (ctx, hex, r) => {
    ctx.fillStyle = rgb(hex, 0.7);
    ctx.fillRect(0, 0, S, S);
    const rows = 5;
    const rh = S / rows;
    for (let row = 0; row < rows; row++) {
      let x = -r() * 120;
      while (x < S) {
        const w = 90 + r() * 150;
        const f = 0.85 + r() * 0.28;
        ctx.fillStyle = rgb(hex, f);
        ctx.fillRect(x + 2, row * rh + 2, w - 4, rh - 4);
        x += w;
      }
    }
    blotches(ctx, r, hex, 30, 0.08);
    speckle(ctx, r, hex, 7000, 1.6, 0.35, 0.35);
  },
  fabric: (ctx, hex, r) => {
    ctx.fillStyle = rgb(hex);
    ctx.fillRect(0, 0, S, S);
    for (let i = 0; i < S; i += 3) {
      ctx.fillStyle = rgb(hex, 0.85, 0.18);
      ctx.fillRect(0, i, S, 1);
      ctx.fillStyle = rgb(hex, 1.1, 0.14);
      ctx.fillRect(i, 0, 1, S);
    }
    speckle(ctx, r, hex, 5000, 1.2, 0.2, 0.25);
  },
  grass: (ctx, hex, r) => {
    ctx.fillStyle = rgb(hex);
    ctx.fillRect(0, 0, S, S);
    blotches(ctx, r, hex, 40, 0.12);
    ctx.lineWidth = 1;
    for (let i = 0; i < 12000; i++) {
      const x = r() * S;
      const y = r() * S;
      const len = 2 + r() * 6;
      const a = -Math.PI / 2 + (r() - 0.5) * 0.9;
      ctx.strokeStyle = rgb(hex, 0.7 + r() * 0.6, 0.5);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len);
      ctx.stroke();
    }
  },
  marble: (ctx, hex, r) => {
    ctx.fillStyle = rgb(hex);
    ctx.fillRect(0, 0, S, S);
    blotches(ctx, r, hex, 20, 0.05);
    for (let i = 0; i < 16; i++) {
      ctx.strokeStyle = `rgba(120,116,110,${0.08 + r() * 0.22})`;
      ctx.lineWidth = 0.5 + r() * 2;
      ctx.beginPath();
      const y = r() * S;
      ctx.moveTo(-20, y);
      ctx.bezierCurveTo(S * 0.3, y + (r() - 0.5) * 300, S * 0.7, y + (r() - 0.5) * 300, S + 20, y + (r() - 0.5) * 120);
      ctx.stroke();
    }
  },
};

const baseTextures = new Map<string, THREE.CanvasTexture>();

function baseTexture(kind: TexKind, hex: number) {
  const key = `${kind}:${hex}`;
  let t = baseTextures.get(key);
  if (!t) {
    const c = document.createElement('canvas');
    c.width = c.height = S;
    PAINTERS[kind](c.getContext('2d')!, hex, rng(hex ^ kind.length * 7919));
    t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.anisotropy = 8;
    baseTextures.set(key, t);
  }
  return t;
}

// ---------------------------------------------------------------------------
// Geometry helpers (metric UVs so textures keep real-world scale)
// ---------------------------------------------------------------------------

function scaleUV(g: THREE.BufferGeometry, su: number, sv: number, from = 0, to?: number) {
  const uv = g.attributes.uv as THREE.BufferAttribute;
  const end = to ?? uv.count;
  for (let i = from; i < end; i++) uv.setXY(i, uv.getX(i) * su, uv.getY(i) * sv);
  uv.needsUpdate = true;
  return g;
}

function metricBox(w: number, h: number, d: number) {
  const g = new THREE.BoxGeometry(w, h, d);
  const dims: [number, number][] = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]];
  dims.forEach(([a, b], f) => scaleUV(g, a, b, f * 4, f * 4 + 4));
  return g;
}

function metricCyl(rT: number, rB: number, h: number, seg: number) {
  const g = new THREE.CylinderGeometry(rT, rB, h, seg);
  const torso = (seg + 1) * 2;
  const r = Math.max(rT, rB);
  scaleUV(g, Math.PI * (rT + rB), h, 0, torso);
  scaleUV(g, 2 * r, 2 * r, torso);
  return g;
}

/** Wall of length `len` (along X), face at z=0 extending to z=-thick, with arched openings. */
function archWall(len: number, height: number, thick: number, holes: { x: number; w: number; bottom: number; spring: number }[]) {
  const s = new THREE.Shape();
  s.moveTo(-len / 2, 0);
  s.lineTo(len / 2, 0);
  s.lineTo(len / 2, height);
  s.lineTo(-len / 2, height);
  s.closePath();
  holes.forEach((h) => {
    const r = h.w / 2;
    const p = new THREE.Path();
    p.moveTo(h.x - r, h.bottom);
    p.lineTo(h.x + r, h.bottom);
    p.lineTo(h.x + r, h.spring);
    p.absarc(h.x, h.spring, r, 0, Math.PI, false);
    p.lineTo(h.x - r, h.bottom);
    s.holes.push(p);
  });
  const g = new THREE.ExtrudeGeometry(s, { depth: thick, bevelEnabled: false, curveSegments: 18 });
  g.translate(0, 0, -thick);
  return g;
}

/** Perforated brick jaali screen (along X), face at z=0. */
function jaali(w: number, h: number, thick: number, cell = 0.22, hole = 0.1) {
  const s = new THREE.Shape();
  s.moveTo(-w / 2, 0);
  s.lineTo(w / 2, 0);
  s.lineTo(w / 2, h);
  s.lineTo(-w / 2, h);
  s.closePath();
  const nx = Math.floor((w - 0.3) / cell);
  const ny = Math.floor((h - 0.5) / cell);
  const x0 = -((nx - 1) * cell) / 2;
  for (let i = 0; i < nx; i++)
    for (let j = 0; j < ny; j++) {
      const cx = x0 + i * cell + (j % 2 ? cell / 2 : 0);
      if (Math.abs(cx) > w / 2 - 0.15) continue;
      const cy = 0.35 + j * cell;
      const p = new THREE.Path();
      p.moveTo(cx, cy - hole / 2);
      p.lineTo(cx + hole / 2, cy);
      p.lineTo(cx, cy + hole / 2);
      p.lineTo(cx - hole / 2, cy);
      p.closePath();
      s.holes.push(p);
    }
  const g = new THREE.ExtrudeGeometry(s, { depth: thick, bevelEnabled: false });
  g.translate(0, 0, -thick);
  return g;
}

/** Triangular prism roof running along X. Group 0 = gable ends, group 1 = roof planes. */
function gableRoof(width: number, rise: number, length: number) {
  const s = new THREE.Shape();
  s.moveTo(-width / 2, 0);
  s.lineTo(width / 2, 0);
  s.lineTo(0, rise);
  s.closePath();
  const g = new THREE.ExtrudeGeometry(s, { depth: length, bevelEnabled: false });
  g.translate(0, 0, -length / 2);
  g.rotateY(Math.PI / 2);
  return g;
}

/** Slightly lumpy blob used for foliage. */
function foliage(radius: number, seed: number) {
  const g = new THREE.IcosahedronGeometry(radius, 3);
  const p = g.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const n = Math.sin(v.x * 4.1 + seed) * Math.cos(v.z * 3.7 - v.y * 2.3) + Math.sin(v.y * 6.3 + v.x * 1.7) * 0.5;
    v.multiplyScalar(1 + n * 0.09);
    p.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  return g;
}

const isTransparent = (m: Mat) => (Array.isArray(m) ? m.some((x) => x.transparent) : m.transparent);

// ---------------------------------------------------------------------------
// Kit: builds a model and tracks everything it allocates
// ---------------------------------------------------------------------------

class Kit {
  readonly group = new THREE.Group();
  private geos = new Map<string, THREE.BufferGeometry>();
  private memo = new Map<string, unknown>();
  private disposables = new Set<{ dispose(): void }>();
  readonly glass: THREE.MeshPhysicalMaterial;

  constructor() {
    this.glass = this.track(
      new THREE.MeshPhysicalMaterial({
        color: 0xcfdcdc,
        roughness: 0.03,
        metalness: 0,
        ior: 1.5,
        transparent: true,
        opacity: 0.24,
        envMapIntensity: 1.6,
        depthWrite: false,
        side: THREE.DoubleSide,
      })
    );
  }

  track<T extends { dispose(): void }>(m: T): T {
    this.disposables.add(m);
    return m;
  }

  shared<T>(key: string, make: () => T): T {
    if (!this.memo.has(key)) this.memo.set(key, make());
    return this.memo.get(key) as T;
  }

  mat(color: number, o: { opacity?: number; roughness?: number; metalness?: number; emissive?: number; emissiveIntensity?: number } = {}) {
    const opacity = o.opacity ?? 1;
    const transparent = opacity < 1;
    return this.track(
      new THREE.MeshStandardMaterial({
        color,
        roughness: o.roughness ?? 0.65,
        metalness: o.metalness ?? 0,
        transparent,
        opacity,
        depthWrite: !transparent,
        emissive: o.emissive ?? 0x000000,
        emissiveIntensity: o.emissiveIntensity ?? 1,
      })
    );
  }

  /** Textured surface material; `tile` is the real-world size (m) of one texture repeat. */
  surface(kind: TexKind, color: number, o: { tile?: number; roughness?: number; metalness?: number } = {}) {
    const map = this.track(baseTexture(kind, color).clone());
    const rep = 1 / (o.tile ?? TILE[kind]);
    map.repeat.set(rep, rep);
    return this.track(
      new THREE.MeshStandardMaterial({
        map,
        bumpMap: BUMP[kind] ? map : null,
        bumpScale: BUMP[kind],
        roughness: o.roughness ?? 0.75,
        metalness: o.metalness ?? 0,
      })
    );
  }

  geo(key: string, make: () => THREE.BufferGeometry) {
    let g = this.geos.get(key);
    if (!g) {
      g = this.track(make());
      this.geos.set(key, g);
    }
    return g;
  }

  add(geo: THREE.BufferGeometry, mat: Mat, pos: Vec3, opts: MeshOpts = {}) {
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(...pos);
    if (opts.rot) mesh.rotation.set(...opts.rot);
    if (opts.roof) mesh.userData.roof = true;
    mesh.castShadow = !isTransparent(mat);
    mesh.receiveShadow = true;
    (opts.parent ?? this.group).add(mesh);
    return mesh;
  }

  /** Sub-group (e.g. a building wing) placed and rotated about Y. */
  sub(pos: Vec3, rotY = 0) {
    const g = new THREE.Group();
    g.position.set(...pos);
    g.rotation.y = rotY;
    this.group.add(g);
    return g;
  }

  /** Box whose base sits at y (x/z are centred). */
  box(w: number, h: number, d: number, x: number, y: number, z: number, mat: Mat, opts?: MeshOpts) {
    return this.add(this.geo(`b${w}:${h}:${d}`, () => metricBox(w, h, d)), mat, [x, y + h / 2, z], opts);
  }

  /** Box centred on (x, y, z). */
  boxC(w: number, h: number, d: number, x: number, y: number, z: number, mat: Mat, opts?: MeshOpts) {
    return this.add(this.geo(`b${w}:${h}:${d}`, () => metricBox(w, h, d)), mat, [x, y, z], opts);
  }

  /** Rounded box (furniture, cushions) whose base sits at y. */
  rbox(w: number, h: number, d: number, r: number, x: number, y: number, z: number, mat: Mat, opts?: MeshOpts) {
    const g = this.geo(`r${w}:${h}:${d}:${r}`, () => new RoundedBoxGeometry(w, h, d, 3, Math.min(r, w / 2, h / 2, d / 2)));
    return this.add(g, mat, [x, y + h / 2, z], opts);
  }

  /** Cylinder whose base sits at y. */
  cyl(rTop: number, rBot: number, h: number, x: number, y: number, z: number, mat: Mat, opts?: MeshOpts, seg = 32) {
    return this.add(this.geo(`c${rTop}:${rBot}:${h}:${seg}`, () => metricCyl(rTop, rBot, h, seg)), mat, [x, y + h / 2, z], opts);
  }

  custom(key: string, make: () => THREE.BufferGeometry, mat: Mat, pos: Vec3, opts?: MeshOpts) {
    return this.add(this.geo(key, make), mat, pos, opts);
  }

  /** A broadleaf tree: tapered trunk with a few branches and a clustered canopy. */
  tree(x: number, y: number, z: number, h: number, spread: number, seed: number, parent?: THREE.Object3D) {
    const bark = this.shared('bark', () => this.surface('wood', 0x5b4634, { tile: 0.5, roughness: 0.95 }));
    const leaves = this.shared('leaves', () => [
      this.mat(0x5f7a4a, { roughness: 0.9 }),
      this.mat(0x728c55, { roughness: 0.9 }),
      this.mat(0x4f6a3e, { roughness: 0.9 }),
    ]);
    const r = rng(seed);
    const o = { parent };
    const trunkH = h * 0.5;
    this.cyl(h * 0.018, h * 0.03, trunkH, x, y, z, bark, o, 12);
    for (let b = 0; b < 3; b++) {
      const a = (b / 3) * Math.PI * 2 + r();
      const len = h * 0.25;
      const m = this.cyl(h * 0.008, h * 0.014, len, 0, 0, 0, bark, o, 8);
      m.position.set(x + Math.cos(a) * len * 0.3, y + trunkH * 0.9 + len * 0.4, z + Math.sin(a) * len * 0.3);
      m.rotation.set(Math.sin(a) * 0.7, 0, -Math.cos(a) * 0.7);
    }
    const blobs = 7;
    for (let i = 0; i < blobs; i++) {
      const rad = Math.round(spread * (0.38 + r() * 0.22) * 20) / 20;
      const a = r() * Math.PI * 2;
      const d = i === 0 ? 0 : spread * (0.35 + r() * 0.3);
      this.custom(`leaf${rad}:${i % 3}`, () => foliage(rad, i), leaves[i % 3], [
        x + Math.cos(a) * d,
        y + h * 0.66 + (i === 0 ? h * 0.12 : r() * h * 0.22),
        z + Math.sin(a) * d,
      ], o);
    }
  }

  /** Low shrub / potted plant. */
  shrub(x: number, y: number, z: number, rad: number, seed: number, parent?: THREE.Object3D) {
    const leaves = this.shared('shrubLeaves', () => [this.mat(0x5c7a45, { roughness: 0.9 }), this.mat(0x6e8a52, { roughness: 0.9 })]);
    const r = rng(seed);
    for (let i = 0; i < 3; i++) {
      const rr = Math.round(rad * (0.55 + r() * 0.35) * 40) / 40;
      this.custom(`shrub${rr}:${i}`, () => foliage(rr, i + 3), leaves[i % 2], [
        x + (r() - 0.5) * rad,
        y + rr * 0.8,
        z + (r() - 0.5) * rad,
      ], { parent });
    }
  }

  build(): BuiltModel {
    normalize(this.group);
    return {
      group: this.group,
      dispose: () => this.disposables.forEach((d) => d.dispose()),
    };
  }
}

/** Centre the model on the origin and scale it to a consistent size for the stage. */
function normalize(group: THREE.Group) {
  group.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(group);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const diag = Math.hypot(size.x, size.z);
  const scale = Math.min(5.2 / diag, 3.3 / size.y);
  const inner = new THREE.Group();
  while (group.children.length) inner.add(group.children[0]);
  inner.position.set(-center.x, -center.y, -center.z);
  group.add(inner);
  group.scale.setScalar(scale);
}

// ---------------------------------------------------------------------------
// Stage lighting shared by the live viewer and the rendered views
// ---------------------------------------------------------------------------

/** Image-based lighting + a soft shadow-casting sun. Call once per renderer/scene. */
export function createStageLighting(renderer: THREE.WebGLRenderer, scene: THREE.Scene) {
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;

  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const env = pmrem.fromScene(room, 0.04);
  room.dispose();
  pmrem.dispose();
  scene.environment = env.texture;
  scene.environmentIntensity = 0.55;

  const hemi = new THREE.HemisphereLight(0xfffaf2, 0xcfc6b8, 0.4);
  const sun = new THREE.DirectionalLight(0xfff0dc, 2.6);
  sun.position.set(-6, 9, 3.5);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  const cam = sun.shadow.camera;
  cam.left = cam.bottom = -4.2;
  cam.right = cam.top = 4.2;
  cam.near = 1;
  cam.far = 30;
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.015;
  sun.shadow.radius = 3;
  scene.add(hemi, sun, sun.target);

  return {
    dispose: () => {
      scene.remove(hemi, sun, sun.target);
      sun.dispose();
      hemi.dispose();
      env.dispose();
      scene.environment = null;
    },
  };
}

// ---------------------------------------------------------------------------
// 01 — Urben Hatch (Adaptive reuse of a colonial-era school into a hostel)
// ---------------------------------------------------------------------------
function buildUrbenHatch(): BuiltModel {
  const k = new Kit();
  const brick = k.surface('brick', 0x9a5638, { roughness: 0.92 });
  const lime = k.surface('plaster', 0xe8dfcc, { roughness: 0.9 });
  const tile = k.surface('tile', 0xa65a39, { roughness: 0.85 });
  const terrazzo = k.surface('terrazzo', 0xe4d9c6, { roughness: 0.35 });
  const paving = k.surface('stone', 0xbcb2a2, { roughness: 0.9 });
  const timber = k.surface('wood', 0x7a5436, { roughness: 0.7, tile: 0.8 });
  const crimson = k.mat(0xa1222a, { roughness: 0.38, metalness: 0.35 });
  const darkGlass = k.mat(0x263034, { roughness: 0.08, metalness: 0.4 });
  const steel = k.mat(0x2e2e2c, { roughness: 0.4, metalness: 0.75 });
  const shutters = k.mat(0x4d6b5e, { roughness: 0.7 });
  const roofMats = [brick, tile];

  const H = 6.4; // eaves height
  const FF = 3.0; // first floor slab level
  const D = 5.15; // wing depth: arcade 0.35 + verandah 1.8 + rooms 3.0
  const arcT = 0.35;
  const corD = 1.8;
  const blockD = 3;

  k.box(20, 0.1, 15.6, 0, -0.1, -1.3, paving);
  k.box(8, 0.12, 7.8, 0, 0, 0.4, terrazzo);

  const window = (x: number, y: number, z: number, parent: THREE.Object3D) => {
    const o = { parent };
    k.box(1.2, 1.95, 0.08, x, y - 0.12, z - 0.02, lime, o);
    k.box(0.9, 1.6, 0.06, x, y, z - 0.07, darkGlass, o);
    k.box(0.05, 1.6, 0.075, x, y, z - 0.075, timber, o);
    k.box(0.42, 1.55, 0.04, x - 0.68, y + 0.02, z - 0.06, shutters, o);
    k.box(0.42, 1.55, 0.04, x + 0.68, y + 0.02, z - 0.06, shutters, o);
    k.box(1.35, 0.08, 0.18, x, y - 0.2, z - 0.07, lime, o);
  };

  /** A two-storey wing: rooms behind a verandah, with a brick arcade facing the courtyard (local +z). */
  const wing = (len: number, pos: Vec3, rotY: number, opts: { trussFrom?: number; railSkip?: number } = {}) => {
    const g = k.sub(pos, rotY);
    const o = { parent: g };
    k.box(len, H, blockD, 0, 0, -(arcT + corD + blockD / 2), brick, o);
    k.box(len, 0.15, corD, 0, 0, -(arcT + corD / 2), terrazzo, o);
    k.box(len, 0.25, corD + arcT, 0, FF, -(corD + arcT) / 2, lime, o);

    const n = Math.max(2, Math.round(len / 2.6));
    const pitch = len / n;
    const aw = pitch * 0.62;
    const holes: { x: number; w: number; bottom: number; spring: number }[] = [];
    for (let i = 0; i < n; i++) {
      const x = -len / 2 + pitch * (i + 0.5);
      holes.push({ x, w: aw, bottom: 0.15, spring: 1.95 }, { x, w: aw, bottom: FF + 0.25, spring: FF + 1.95 });
      // steel balustrade in the upper arches
      if (opts.railSkip !== i) {
        k.boxC(aw, 0.05, 0.05, x, FF + 1.2, -arcT / 2, steel, o);
        for (let b = 1; b < 7; b++) k.box(0.025, 0.95, 0.025, x - aw / 2 + (aw / 7) * b, FF + 0.25, -arcT / 2, steel, o);
      }
      // arch keystone & impost bands in lime
      k.box(0.22, 0.32, 0.06, x, 1.95 + aw / 2 - 0.12, 0.03, lime, o);
      k.box(0.22, 0.32, 0.06, x, FF + 1.95 + aw / 2 - 0.12, 0.03, lime, o);
      // outer windows on the rooms' back face
      window(x, 0.9, -D, g);
      window(x, FF + 0.9, -D, g);
    }
    k.custom(`arcade${len}`, () => archWall(len, H, arcT, holes), brick, [0, 0, 0], o);
    k.box(len, 0.24, 0.14, 0, FF, 0.07, lime, o); // string course
    k.box(len, 0.24, 0.1, 0, FF, -D - 0.05, lime, o);
    k.box(len + 0.1, 0.32, D + 0.24, 0, H, -D / 2, lime, o); // eaves cornice

    const RW = D + 0.9;
    const rise = 1.75;
    const y0 = H + 0.32;
    const zc = -D / 2;
    if (opts.trussFrom === undefined) {
      k.custom(`gable${len}`, () => gableRoof(RW, rise, len + 0.4), roofMats, [0, y0, zc], { ...o, roof: true });
    } else {
      // Part of the roof is left open to show the restored timber king-post trusses
      const x1 = opts.trussFrom;
      const Lc = x1 - (-len / 2 - 0.2);
      k.custom(`gableP${len}`, () => gableRoof(RW, rise, Lc), roofMats, [-len / 2 - 0.2 + Lc / 2, y0, zc], { ...o, roof: true });
      const half = (RW - 0.6) / 2;
      const rr = rise * 0.92;
      const th = Math.atan2(rr, half);
      const rl = Math.hypot(half, rr);
      const ro = { ...o, roof: true };
      for (let x = x1 + 0.1; x <= len / 2; x += 1.25) {
        k.boxC(0.14, 0.18, RW - 0.6, x, y0 + 0.09, zc, timber, ro);
        k.boxC(0.12, 0.18, rl, x, y0 + rr / 2 + 0.05, zc - half / 2, timber, { ...ro, rot: [-th, 0, 0] });
        k.boxC(0.12, 0.18, rl, x, y0 + rr / 2 + 0.05, zc + half / 2, timber, { ...ro, rot: [th, 0, 0] });
        k.boxC(0.12, rr, 0.12, x, y0 + rr / 2, zc, timber, ro);
      }
      const PL = len / 2 + 0.2 - x1;
      for (let s = 1; s <= 4; s++) {
        const f = s / 4.4;
        [-1, 1].forEach((side) =>
          k.boxC(PL, 0.1, 0.1, x1 + PL / 2, y0 + rr * f + 0.16, zc + side * half * (1 - f), timber, ro)
        );
      }
    }
    return g;
  };

  wing(8, [0, 0, -3.5], 0, { trussFrom: 0.4, railSkip: 2 });
  wing(7.8, [-4, 0, 0.4], Math.PI / 2);
  wing(7.8, [4, 0, 0.4], -Math.PI / 2);

  // Corner pavilions with hipped tile roofs
  const hip = () => {
    const r = 2.95 * Math.SQRT2;
    const g = new THREE.ConeGeometry(r, 2.0, 4, 1);
    g.rotateY(Math.PI / 4);
    return scaleUV(g, 4 * 5.9, 3.5);
  };
  [-1, 1].forEach((side) => {
    const x = side * (4 + D / 2);
    const z = -3.5 - D / 2;
    k.box(D, H, D, x, 0, z, brick);
    k.box(D + 0.24, 0.32, D + 0.24, x, H, z, lime);
    k.box(D + 0.1, 0.24, D + 0.1, x, FF, z, lime);
    k.custom('hip', hip, tile, [x, H + 0.32 + 1.0, z], { roof: true });
    const g = k.sub([x, 0, z], 0);
    [-1.2, 1.2].forEach((dx) => {
      window(dx, 0.9, -D / 2, g);
      window(dx, FF + 0.9, -D / 2, g);
    });
  });

  // Minaret tower at the front corner with a chhatri on top
  const mx = -7.7;
  const mz = 4.95;
  k.box(1.7, 9, 1.7, mx, 0, mz, brick);
  [FF, H].forEach((y) => k.box(1.86, 0.26, 1.86, mx, y, mz, lime));
  k.box(2.3, 0.26, 2.3, mx, 9, mz, lime);
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sz]) => k.box(0.18, 1.5, 0.18, mx + sx * 0.85, 9.26, mz + sz * 0.85, lime));
  k.box(2.1, 0.16, 2.1, mx, 10.76, mz, lime);
  k.custom('dome', () => new THREE.SphereGeometry(0.88, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), lime, [mx, 10.92, mz]);
  k.cyl(0.03, 0.05, 0.6, mx, 11.75, mz, steel, undefined, 8);
  [4.2, 7.3].forEach((y) => {
    k.box(0.4, 0.9, 0.04, mx, y, mz + 0.86, darkGlass);
    k.box(0.04, 0.9, 0.4, mx + 0.86, y, mz, darkGlass);
    k.box(0.04, 0.9, 0.4, mx - 0.86, y, mz, darkGlass);
  });

  // Front boundary: brick jaali screens either side of the gateway
  [-1, 1].forEach((side) => {
    const x = side * 2.65;
    k.custom('jaali', () => jaali(2.7, 2.0, 0.24), brick, [x, 0, 4.3]);
    k.box(2.8, 0.1, 0.34, x, 2.0, 4.18, lime);
    k.box(0.55, 2.6, 0.55, side * 1.55, 0, 4.18, lime);
    k.custom('pierCap', () => new THREE.SphereGeometry(0.2, 20, 12), lime, [side * 1.55, 2.82, 4.18]);
  });

  // Courtyard: neem tree in a raised planter, café tables
  k.cyl(1.0, 1.0, 0.45, 2.3, 0.12, 1.4, lime, undefined, 40);
  k.tree(2.3, 0.57, 1.4, 6, 2.0, 11);
  [[-2.3, 0.7], [-0.5, 2.6], [-2.6, 3.1]].forEach(([x, z]) => {
    k.cyl(0.42, 0.42, 0.04, x, 0.86, z, timber, undefined, 32);
    k.cyl(0.035, 0.035, 0.72, x, 0.14, z, steel, undefined, 10);
    k.cyl(0.22, 0.22, 0.02, x, 0.12, z, steel, undefined, 24);
    [-1, 1].forEach((s) => {
      k.rbox(0.44, 0.05, 0.44, 0.015, x + s * 0.72, 0.56, z, timber);
      k.rbox(0.44, 0.42, 0.04, 0.012, x + s * 0.92, 0.6, z, timber);
      [[-0.18, -0.18], [0.18, -0.18], [-0.18, 0.18], [0.18, 0.18]].forEach(([lx, lz]) =>
        k.box(0.025, 0.44, 0.025, x + s * 0.72 + lx, 0.12, z + lz, steel)
      );
    });
  });
  k.shrub(-3.5, 0.12, -2.0, 0.6, 3);
  k.shrub(3.5, 0.12, 3.6, 0.55, 5);

  // Sculptural crimson steel stair up to the first-floor verandah
  const steps = 16;
  const top = FF + 0.25;
  const rise = (top - 0.12) / steps;
  const going = 0.28;
  const lx0 = 1.9;
  const sx0 = lx0 - steps * going;
  const sz = -2.85;
  for (let i = 0; i < steps; i++) k.box(0.3, 0.05, 1.1, sx0 + going * i + 0.14, 0.12 + rise * (i + 1) - 0.05, sz, crimson);
  const run = steps * going;
  const L = Math.hypot(run, top - 0.12);
  const th = Math.atan2(top - 0.12, run);
  [-0.58, 0.58].forEach((dz) => {
    k.boxC(L, 0.3, 0.06, sx0 + run / 2, 0.12 + (top - 0.12) / 2 - 0.12, sz + dz, crimson, { rot: [0, 0, th] });
    k.boxC(L, 0.05, 0.05, sx0 + run / 2, 0.12 + (top - 0.12) / 2 + 0.95, sz + dz, crimson, { rot: [0, 0, th] });
    for (let i = 2; i < steps; i += 4) k.box(0.035, 0.95, 0.035, sx0 + going * i + 0.14, 0.12 + rise * (i + 1), sz + dz, crimson);
  });
  k.box(1.55, 0.12, 1.55, lx0 + 0.775, top - 0.12, -3.075, crimson);
  k.boxC(1.55, 0.05, 0.05, lx0 + 0.775, top + 0.95, -2.3, crimson);
  k.box(0.035, 0.95, 0.035, lx0 + 1.53, top, -2.3, crimson);
  [lx0 + 0.15, lx0 + 1.4].forEach((x) => k.cyl(0.06, 0.06, top - 0.24, x, 0.12, -2.45, crimson, undefined, 16));

  return k.build();
}

// ---------------------------------------------------------------------------
// 02 — Royce' (Japanese chocolate retail interior, Kanso minimalism)
// ---------------------------------------------------------------------------
function buildRoyceStore(): BuiltModel {
  const k = new Kit();
  const floor = k.surface('concrete', 0xd9d3c9, { roughness: 0.45 });
  const pave = k.surface('stone', 0xc4beb3, { roughness: 0.85, tile: 1.2 });
  const plaster = k.surface('plaster', 0xf1ebe1, { roughness: 0.92 });
  const oak = k.surface('wood', 0xc49a6c, { roughness: 0.5, tile: 0.9 });
  const walnut = k.surface('wood', 0x3d261a, { roughness: 0.45, tile: 0.9 });
  const marble = k.surface('marble', 0xf3f0ea, { roughness: 0.15 });
  const cocoa = k.mat(0x6b3f26, { roughness: 0.55 });
  const gold = k.mat(0xc9a47e, { roughness: 0.25, metalness: 0.9 });
  const cream = k.mat(0xf2ede4, { roughness: 0.6 });
  const bronze = k.mat(0x2b211b, { roughness: 0.32, metalness: 0.75 });
  const glow = k.mat(0xffe2b8, { emissive: 0xffd29a, emissiveIntensity: 1.6, roughness: 0.5 });
  const ceramic = k.mat(0xe9e4da, { roughness: 0.35 });

  k.box(9, 0.12, 1.8, 0, 0, 3.9, pave);
  k.box(8, 0.15, 6, 0, 0, 0, floor);
  k.box(8, 3.4, 0.2, 0, 0.15, -2.9, plaster);
  k.box(0.2, 3.4, 6, -3.9, 0.15, 0, plaster);
  k.box(0.2, 3.4, 6, 3.9, 0.15, 0, plaster);

  // Glazed shopfront in bronze frames with a central entrance
  k.box(2.85, 3, 0.03, -2.45, 0.27, 2.97, k.glass);
  k.box(2.85, 3, 0.03, 2.45, 0.27, 2.97, k.glass);
  k.box(2, 0.6, 0.03, 0, 2.67, 2.97, k.glass);
  k.box(0.98, 2.4, 0.03, 0.5, 0.27, 2.97, k.glass);
  k.box(0.03, 0.5, 0.05, 0.1, 1.2, 3.02, gold);
  [-3.8, -1, 1, 3.8].forEach((x) => k.box(0.07, 3.12, 0.12, x, 0.15, 2.97, bronze));
  k.box(7.6, 0.12, 0.14, 0, 0.15, 2.97, bronze);
  k.box(2, 0.06, 0.12, 0, 2.64, 2.97, bronze);

  // Fascia with the brass name band
  k.box(8.2, 0.55, 0.3, 0, 3.27, 2.95, walnut);
  k.box(2.4, 0.14, 0.03, 0, 3.47, 3.11, gold);
  k.box(0.9, 0.05, 0.02, 0, 3.36, 3.11, gold);

  // Central display island: oak plinth, marble top, glass vitrine
  k.box(3.2, 0.85, 1.3, 0, 0.15, 0.4, oak);
  k.box(3.3, 0.05, 1.4, 0, 1.0, 0.4, marble);
  k.box(3.1, 0.4, 1.2, 0, 1.05, 0.4, k.glass);
  for (let i = 0; i < 6; i++) {
    const x = -1.25 + i * 0.5;
    k.rbox(0.32, 0.1, 0.32, 0.02, x, 1.05, 0.2, i % 2 ? gold : cocoa);
    k.rbox(0.32, 0.1, 0.32, 0.02, x, 1.05, 0.6, i % 2 ? cocoa : cream);
  }

  // Back-wall oak shelving with warm LED lines and product boxes
  k.box(6.4, 2.5, 0.05, 0, 0.15, -2.77, oak);
  [-3.2, -1.6, 0, 1.6, 3.2].forEach((x) => k.box(0.05, 2.5, 0.45, x, 0.15, -2.58, oak));
  const products = [walnut, cocoa, gold, cream];
  [0.55, 1.1, 1.65, 2.2].forEach((y, row) => {
    k.box(6.4, 0.04, 0.45, 0, y, -2.58, oak);
    k.box(6.3, 0.012, 0.02, 0, y - 0.012, -2.4, glow);
    for (let i = 0; i < 12; i++) {
      const x = -2.4 + Math.floor(i / 3) * 1.6 + ((i % 3) - 1) * 0.45;
      k.rbox(0.3, 0.26 + (i % 3) * 0.04, 0.3, 0.015, x, y + 0.04, -2.6, products[(i + row) % 4]);
    }
  });

  // Service counter with stone top
  k.box(0.7, 1.0, 2.6, 2.9, 0.15, -0.6, walnut);
  k.box(0.8, 0.04, 2.7, 2.9, 1.15, -0.6, marble);
  k.rbox(0.35, 0.22, 0.3, 0.03, 2.9, 1.19, -1.2, bronze);
  k.cyl(0.16, 0.1, 0.08, 2.9, 1.19, 0.1, ceramic, undefined, 32);

  // Bench and planter
  k.rbox(1.6, 0.08, 0.45, 0.02, -3.45, 0.55, -0.6, oak);
  k.box(0.08, 0.4, 0.4, -3.45 - 0.7, 0.15, -0.6, oak);
  k.box(0.08, 0.4, 0.4, -3.45 + 0.7, 0.15, -0.6, oak);
  k.cyl(0.24, 0.2, 0.55, -3.4, 0.15, 1.9, ceramic, undefined, 32);
  k.shrub(-3.4, 0.6, 1.9, 0.45, 7);

  // Pendant lights over the island
  [-1, 0, 1].forEach((x) => {
    k.cyl(0.006, 0.006, 1.45, x, 2.0, 0.4, bronze, undefined, 6);
    k.cyl(0.07, 0.25, 0.26, x, 1.74, 0.4, gold, undefined, 40);
    k.cyl(0.18, 0.18, 0.01, x, 1.735, 0.4, glow, undefined, 32);
  });

  return k.build();
}

// ---------------------------------------------------------------------------
// 03 — Villa (contemporary courtyard residence)
// ---------------------------------------------------------------------------
function buildVilla(): BuiltModel {
  const k = new Kit();
  const grass = k.surface('grass', 0x7d9459, { roughness: 1 });
  const stone = k.surface('stone', 0xb9ad9a, { roughness: 0.85 });
  const plaster = k.surface('plaster', 0xf3f0ea, { roughness: 0.9 });
  const oak = k.surface('wood', 0xb7895c, { roughness: 0.55 });
  const teak = k.surface('wood', 0x8a5e3b, { roughness: 0.6, tile: 0.8 });
  const fabric = k.surface('fabric', 0xd8cfc1, { roughness: 1 });
  const rug = k.surface('fabric', 0x9c8c7a, { roughness: 1, tile: 0.3 });
  const frame = k.mat(0x2a2a28, { roughness: 0.35, metalness: 0.7 });
  const darkGlass = k.mat(0x2b3336, { roughness: 0.06, metalness: 0.4 });
  const water = k.track(
    new THREE.MeshPhysicalMaterial({
      color: 0x3e8f9c,
      roughness: 0.03,
      metalness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0.02,
      transparent: true,
      opacity: 0.92,
      envMapIntensity: 1.4,
    })
  );
  const white = k.mat(0xf5f3ee, { roughness: 0.5 });

  // Lawn and stone podium
  k.box(19, 0.1, 15, 0, -0.1, -0.5, grass);
  k.box(14, 0.45, 10, 0, 0, -0.6, stone);
  [0, 1, 2].forEach((i) => k.box(2.2, 0.15 * (3 - i), 0.35, -4.5, 0, 4.58 + i * 0.35, stone));

  // Ground floor: glass living pavilion
  k.box(7, 0.04, 4.5, 2.5, 0.45, -2.75, oak);
  k.box(7, 3.1, 0.25, 2.5, 0.45, -5.1, plaster);
  k.box(6.9, 3.05, 0.03, 2.5, 0.49, -0.52, k.glass);
  k.box(0.03, 3.05, 4.4, 5.98, 0.49, -2.75, k.glass);
  [-0.95, 1.4, 3.75, 5.95].forEach((x) => k.box(0.1, 3.1, 0.1, x, 0.45, -0.52, frame));
  k.box(0.1, 3.1, 0.1, 5.95, 0.45, -2.75, frame);
  k.box(7, 0.08, 0.1, 2.5, 3.47, -0.52, frame);
  k.box(8.4, 0.32, 6.1, 2.6, 3.55, -2.65, plaster, { roof: true });

  // Living furniture
  k.box(3.2, 0.015, 2.2, 3.2, 0.49, -2.6, rug);
  k.rbox(2.4, 0.42, 0.9, 0.08, 3.2, 0.5, -3.9, fabric);
  k.rbox(2.4, 0.42, 0.2, 0.06, 3.2, 0.92, -4.25, fabric);
  k.rbox(0.9, 0.42, 0.9, 0.08, 4.7, 0.5, -2.7, fabric);
  k.box(1.1, 0.32, 0.6, 3.2, 0.5, -2.5, teak);
  k.box(2.0, 0.05, 0.95, 0.4, 1.22, -2.6, oak);
  [[-0.6, -0.35], [1.4, -0.35], [-0.6, 0.35], [1.4, 0.35]].forEach(([dx, dz]) =>
    k.box(0.05, 0.73, 0.05, -0.15 + dx * 0.5 + 0.25, 0.49, -2.6 + dz * 1.1, frame)
  );
  [-0.25, 0.5, 1.25].forEach((x) =>
    [-1, 1].forEach((s) => k.rbox(0.42, 0.45, 0.42, 0.05, x - 0.1, 0.49, -2.6 + s * 0.75, teak))
  );

  // Ground floor: solid service / kitchen block and stone feature wall
  k.box(5, 3.1, 3.8, -3.5, 0.45, -3.1, plaster);
  k.box(3.6, 0.6, 0.04, -3.5, 2.3, -1.18, darkGlass);
  k.box(0.9, 2.3, 0.04, -1.8, 0.45, -1.18, teak);
  k.box(0.45, 3.5, 5.6, -6.3, 0.45, -2.5, stone);

  // Upper floor: cantilevered bedroom volume with timber louvres
  const up = 3.87;
  k.box(7.5, 3.0, 5.4, -1.25, up, -2.4, plaster, { roof: true });
  k.box(7.7, 0.16, 5.6, -1.25, up + 3.0, -2.4, plaster, { roof: true });
  k.box(3.4, 2.2, 0.04, 0.85, up + 0.4, 0.31, darkGlass, { roof: true });
  k.box(3.5, 0.08, 0.08, 0.85, up + 2.6, 0.33, frame, { roof: true });
  for (let x = -4.85; x <= -1.05; x += 0.28) k.box(0.06, 2.8, 0.22, x, up + 0.1, 0.42, teak, { roof: true });
  k.box(0.04, 1.8, 2.6, 2.51, up + 0.6, -2.4, darkGlass, { roof: true });
  k.box(1.6, 0.04, 1.0, -3.5, up + 3.16, -3.2, k.glass, { roof: true });

  // Pool with stone coping, timber deck and loungers
  k.box(6.5, 0.03, 2.8, 2.75, 0.45, 2.4, water);
  k.box(6.9, 0.07, 0.2, 2.75, 0.45, 0.9, stone);
  k.box(6.9, 0.07, 0.2, 2.75, 0.45, 3.9, stone);
  k.box(0.2, 0.07, 2.8, -0.6, 0.45, 2.4, stone);
  k.box(0.2, 0.07, 2.8, 6.1, 0.45, 2.4, stone);
  k.box(4.4, 0.06, 3.2, -3.1, 0.45, 2.4, teak);
  [-4.2, -2.6].forEach((x) => {
    k.box(0.7, 0.25, 1.9, x, 0.51, 2.5, white);
    k.rbox(0.66, 0.1, 1.85, 0.04, x, 0.76, 2.5, fabric);
    k.rbox(0.66, 0.1, 0.6, 0.04, x, 0.86, 1.65, fabric, { rot: [-0.5, 0, 0] });
  });

  // Landscape
  k.tree(7.6, 0, 3.4, 6.5, 2.2, 21);
  k.tree(-7.9, 0, 2.4, 5.5, 1.9, 33);
  k.tree(6.4, 0, -6.6, 7, 2.4, 47);
  [-6.6, -5.4, 6.6, 5.4].forEach((x, i) => k.shrub(x, 0, 4.6 - (i % 2) * 0.2, 0.55, 60 + i));
  k.shrub(-1.3, 0.45, 0.6, 0.45, 71);

  return k.build();
}

// ---------------------------------------------------------------------------
// 04 — Miscellaneous (hospitality study — mocktail bar)
// ---------------------------------------------------------------------------
function buildThesisBar(): BuiltModel {
  const k = new Kit();
  const terrazzo = k.surface('terrazzo', 0xe8e2d8, { roughness: 0.35 });
  const plaster = k.surface('plaster', 0xe9dfd0, { roughness: 0.92 });
  const amber = k.surface('wood', 0xa8703f, { roughness: 0.45, tile: 0.7 });
  const marble = k.surface('marble', 0xf1eee8, { roughness: 0.15 });
  const walnut = k.surface('wood', 0x5e3d27, { roughness: 0.5 });
  const fabric = k.surface('fabric', 0xc9b29a, { roughness: 1 });
  const velvet = k.surface('fabric', 0x6d4a3a, { roughness: 1, tile: 0.25 });
  const concrete = k.surface('concrete', 0x8f8a84, { roughness: 0.8 });
  const ink = k.mat(0x2b211b, { roughness: 0.4, metalness: 0.6 });
  const gold = k.mat(0xc9a47e, { roughness: 0.25, metalness: 0.9 });
  const glow = k.mat(0xffe2b8, { emissive: 0xffc985, emissiveIntensity: 1.8 });
  const bottleMats = [0xe3a857, 0xd9785b, 0x9db27c, 0xe8c9a0, 0xc45f4a].map((c) =>
    k.track(new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.05, transparent: true, opacity: 0.78, envMapIntensity: 1.5 }))
  );

  k.box(9, 0.15, 7, 0, 0, 0, terrazzo);
  k.box(9, 3.2, 0.15, 0, 0.15, -3.425, plaster);
  k.box(0.15, 3.2, 7, -4.425, 0.15, 0, plaster);

  // Curved bar counter (annular sector) with marble top and under-glow
  const cx = 0.4;
  const cz = -1.9;
  const arc = (rIn: number, rOut: number, h: number) => () => {
    const a0 = Math.PI * 1.18;
    const a1 = Math.PI * 1.82;
    const s = new THREE.Shape();
    s.absarc(0, 0, rOut, a0, a1, false);
    s.absarc(0, 0, rIn, a1, a0, true);
    s.closePath();
    const g = new THREE.ExtrudeGeometry(s, { depth: h, bevelEnabled: false, curveSegments: 64 });
    g.rotateX(-Math.PI / 2);
    return g;
  };
  k.custom('bar', arc(2.0, 2.6, 0.98), amber, [cx, 0.19, cz]);
  k.custom('barKick', arc(2.1, 2.5, 0.04), glow, [cx, 0.15, cz]);
  k.custom('barTop', arc(1.95, 2.72, 0.06), marble, [cx, 1.17, cz]);

  for (let i = 0; i < 6; i++) {
    const a = Math.PI * (1.24 + i * 0.105);
    const x = cx + Math.cos(a) * 3.05;
    const z = cz - Math.sin(a) * 3.05;
    k.cyl(0.2, 0.2, 0.02, x, 0.15, z, ink, undefined, 24);
    k.cyl(0.025, 0.025, 0.62, x, 0.17, z, ink, undefined, 10);
    k.custom('footRing', () => new THREE.TorusGeometry(0.17, 0.01, 8, 32), ink, [x, 0.45, z], { rot: [Math.PI / 2, 0, 0] });
    k.rbox(0.42, 0.1, 0.42, 0.05, x, 0.79, z, velvet);
  }

  // Back bar with walnut cabinets and lit shelves of bottles
  k.box(5.4, 0.95, 0.6, cx, 0.15, -3.05, walnut);
  k.box(5.5, 0.04, 0.65, cx, 1.1, -3.05, marble);
  [1.45, 1.95, 2.45].forEach((y, row) => {
    k.box(5.4, 0.04, 0.3, cx, y, -3.2, walnut);
    k.box(5.3, 0.01, 0.02, cx, y - 0.01, -3.06, glow);
    for (let i = 0; i < 14; i++) {
      const h = 0.24 + ((i + row) % 3) * 0.05;
      const bx = cx - 2.5 + i * 0.385;
      k.cyl(0.05, 0.06, h, bx, y + 0.04, -3.2, bottleMats[(i + row * 2) % 5], undefined, 16);
      k.cyl(0.015, 0.02, 0.08, bx, y + 0.04 + h, -3.2, bottleMats[(i + row * 2) % 5], undefined, 8);
    }
  });

  // Ring pendant above the bar
  k.custom('lightRing', () => new THREE.TorusGeometry(1.9, 0.035, 12, 96), gold, [cx, 2.75, cz + 0.4], { rot: [Math.PI / 2, 0, 0] });
  k.custom('lightRingGlow', () => new THREE.TorusGeometry(1.9, 0.015, 8, 96), glow, [cx, 2.72, cz + 0.4], { rot: [Math.PI / 2, 0, 0] });
  [0, 2.1, 4.2].forEach((a) =>
    k.cyl(0.004, 0.004, 0.45, cx + Math.cos(a) * 1.9, 2.75, cz + 0.4 + Math.sin(a) * 1.9, ink, undefined, 4)
  );

  // Lounge: sofas and coffee table
  k.rbox(1.9, 0.42, 0.8, 0.08, -2.9, 0.15, 1.6, fabric);
  k.rbox(1.9, 0.45, 0.2, 0.07, -2.9, 0.57, 1.3, fabric);
  k.rbox(0.8, 0.42, 1.7, 0.08, -3.8, 0.15, 2.9, fabric);
  k.rbox(0.2, 0.45, 1.7, 0.07, -4.1, 0.57, 2.9, fabric);
  k.cyl(0.45, 0.45, 0.35, -2.7, 0.15, 2.7, marble, undefined, 48);

  // Café tables
  [[2.6, 2.2], [3.6, 0.9]].forEach(([x, z]) => {
    k.cyl(0.4, 0.4, 0.04, x, 0.75, z, walnut, undefined, 40);
    k.cyl(0.04, 0.04, 0.6, x, 0.15, z, ink, undefined, 10);
    k.cyl(0.22, 0.22, 0.02, x, 0.15, z, ink, undefined, 24);
    k.rbox(0.42, 0.42, 0.42, 0.08, x - 0.62, 0.15, z, velvet);
    k.rbox(0.42, 0.42, 0.42, 0.08, x + 0.62, 0.15, z, velvet);
  });

  k.cyl(0.3, 0.24, 0.55, -3.8, 0.15, -2.8, concrete, undefined, 32);
  k.shrub(-3.8, 0.7, -2.8, 0.5, 9);

  return k.build();
}

const BUILDERS: Record<ProjectModelKey, () => BuiltModel> = {
  'urben-hatch': buildUrbenHatch,
  'royce-store': buildRoyceStore,
  villa: buildVilla,
  'thesis-bar': buildThesisBar,
};

// ---------------------------------------------------------------------------
// Loading (procedural or .glb)
// ---------------------------------------------------------------------------

const gltfCache = new Map<string, Promise<THREE.Group>>();

async function loadGltf(url: string): Promise<THREE.Group> {
  let p = gltfCache.get(url);
  if (!p) {
    p = import('three/examples/jsm/loaders/GLTFLoader.js').then(
      ({ GLTFLoader }) =>
        new Promise<THREE.Group>((resolve, reject) =>
          new GLTFLoader().load(url, (gltf) => resolve(gltf.scene), undefined, reject)
        )
    );
    gltfCache.set(url, p);
  }
  return p;
}

/** Build (or load) a fresh model instance for a project. */
export async function loadProjectModel(project: FeaturedProject): Promise<BuiltModel> {
  if (project.modelUrl) {
    try {
      const scene = await loadGltf(project.modelUrl);
      const group = new THREE.Group();
      const clone = scene.clone(true);
      clone.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          o.castShadow = true;
          o.receiveShadow = true;
        }
      });
      group.add(clone);
      normalize(group);
      // Geometry/materials are shared with the cached GLTF, so nothing to dispose per instance.
      return { group, dispose: () => {} };
    } catch (err) {
      console.error(`Failed to load model for ${project.name} (${project.modelUrl}); using procedural model.`, err);
    }
  }
  return BUILDERS[project.modelKey]();
}

// ---------------------------------------------------------------------------
// Static views for the detail slides
// ---------------------------------------------------------------------------

export type ModelViewKind = 'axonometric' | 'perspective' | 'plan' | 'elevation' | 'side';

export const MODEL_VIEW_LABELS: Record<ModelViewKind, string> = {
  axonometric: 'Axonometric',
  perspective: 'Perspective',
  plan: 'Plan',
  elevation: 'Front Elevation',
  side: 'Side Elevation',
};

const VIEW_ORDER: ModelViewKind[] = ['axonometric', 'perspective', 'plan', 'elevation', 'side'];
const viewCache = new Map<string, Promise<{ kind: ModelViewKind; src: string }[]>>();

/** Renders a set of architectural views of a project's model to image URLs (cached per project). */
export function getProjectModelViews(project: FeaturedProject) {
  let p = viewCache.get(project.slug);
  if (!p) {
    p = renderViews(project);
    viewCache.set(project.slug, p);
    p.catch(() => viewCache.delete(project.slug));
  }
  return p;
}

async function renderViews(project: FeaturedProject) {
  const W = 1600;
  const H = 1000;
  const model = await loadProjectModel(project);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(1);
  renderer.setSize(W, H, false);

  const scene = new THREE.Scene();
  const lighting = createStageLighting(renderer, scene);
  scene.add(model.group);
  model.group.updateMatrixWorld(true);

  const out = document.createElement('canvas');
  out.width = W;
  out.height = H;
  const ctx = out.getContext('2d')!;
  const bounds = new THREE.Box3().setFromObject(model.group);
  const center = bounds.getCenter(new THREE.Vector3());
  const radius = bounds.getBoundingSphere(new THREE.Sphere()).radius;
  const roofs: THREE.Object3D[] = [];
  model.group.traverse((o) => o.userData.roof && roofs.push(o));

  const results: { kind: ModelViewKind; src: string }[] = [];

  for (const kind of VIEW_ORDER) {
    roofs.forEach((r) => (r.visible = kind !== 'plan'));
    let camera: THREE.Camera;

    if (kind === 'perspective') {
      const cam = new THREE.PerspectiveCamera(32, W / H, 0.1, 200);
      const dir = new THREE.Vector3(-1.1, 0.42, 1.25).normalize();
      const dist = (radius / Math.sin(THREE.MathUtils.degToRad(16))) * 0.82;
      cam.position.copy(center).addScaledVector(dir, dist);
      cam.lookAt(center.x, center.y - radius * 0.08, center.z);
      camera = cam;
    } else {
      const dir =
        kind === 'plan' ? new THREE.Vector3(0, 1, 0) :
        kind === 'elevation' ? new THREE.Vector3(0, 0, 1) :
        kind === 'side' ? new THREE.Vector3(1, 0, 0) :
        new THREE.Vector3(1, 0.82, 1).normalize();
      const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 200);
      if (kind === 'plan') cam.up.set(0, 0, -1);
      cam.position.copy(center).addScaledVector(dir, radius * 4);
      cam.lookAt(center);
      cam.updateMatrixWorld(true);
      fitOrtho(cam, model.group, W / H);
      camera = cam;
    }

    renderer.render(scene, camera);
    paintBackdrop(ctx, W, H, kind === 'plan' || kind === 'elevation' || kind === 'side');
    ctx.drawImage(renderer.domElement, 0, 0);
    results.push({ kind, src: out.toDataURL('image/jpeg', 0.9) });
    // Yield between views so page animations keep running
    await new Promise((r) => setTimeout(r, 16));
  }

  roofs.forEach((r) => (r.visible = true));
  lighting.dispose();
  model.dispose();
  renderer.dispose();
  renderer.forceContextLoss();
  return results;
}

/** Tighten an orthographic frustum around the model's visible geometry. */
function fitOrtho(cam: THREE.OrthographicCamera, root: THREE.Object3D, aspect: number) {
  const inv = cam.matrixWorldInverse;
  const min = new THREE.Vector2(Infinity, Infinity);
  const max = new THREE.Vector2(-Infinity, -Infinity);
  const v = new THREE.Vector3();
  const box = new THREE.Box3();
  root.traverse((o) => {
    if (!(o instanceof THREE.Mesh) || !isVisible(o)) return;
    box.setFromObject(o);
    for (let i = 0; i < 8; i++) {
      v.set(i & 1 ? box.max.x : box.min.x, i & 2 ? box.max.y : box.min.y, i & 4 ? box.max.z : box.min.z).applyMatrix4(inv);
      min.min(new THREE.Vector2(v.x, v.y));
      max.max(new THREE.Vector2(v.x, v.y));
    }
  });
  const cx = (min.x + max.x) / 2;
  const cy = (min.y + max.y) / 2;
  let hw = ((max.x - min.x) / 2) * 1.14;
  let hh = ((max.y - min.y) / 2) * 1.14;
  if (hw / hh > aspect) hh = hw / aspect;
  else hw = hh * aspect;
  cam.left = cx - hw;
  cam.right = cx + hw;
  cam.top = cy + hh;
  cam.bottom = cy - hh;
  cam.updateProjectionMatrix();
}

function isVisible(o: THREE.Object3D): boolean {
  for (let p: THREE.Object3D | null = o; p; p = p.parent) if (!p.visible) return false;
  return true;
}

function paintBackdrop(ctx: CanvasRenderingContext2D, w: number, h: number, grid: boolean) {
  ctx.fillStyle = '#F8F8F6';
  ctx.fillRect(0, 0, w, h);
  if (grid) {
    ctx.strokeStyle = 'rgba(154, 119, 62, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= w; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x + 0.5, 0);
      ctx.lineTo(x + 0.5, h);
      ctx.stroke();
    }
    for (let y = 0; y <= h; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(w, y + 0.5);
      ctx.stroke();
    }
  } else {
    const g = ctx.createRadialGradient(w / 2, h * 0.55, 0, w / 2, h * 0.55, w * 0.6);
    g.addColorStop(0, '#FFFFFF');
    g.addColorStop(1, '#F2F1ED');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }
}
