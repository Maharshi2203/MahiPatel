export type DisciplineMode = 'ux' | 'interior';

export type CursorState = 'default' | 'link' | 'drag-3d' | 'view' | 'copy' | 'next';

export type ProjectCategory = 'residential' | 'store' | 'hospitality' | 'thesis';

export interface ProjectMaterial {
  name: string;
  hex: string;
  swatchImage?: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: ProjectCategory;
  location: string;
  year: string;
  size?: string;
  role: string;
  coverImage: string;
  gallery: string[];
  materials: ProjectMaterial[];
  summary: string;
  isThesis: boolean;
  gridSpan?: 'wide' | 'standard';
  client?: string;
}

export interface ProjectWaypoint {
  position: [number, number, number];
  target: [number, number, number];
  title: string;
  subtitle: string;
  description: string;
  badge?: string;
  metric?: string;
}

export interface CaseStudy {
  id: string;
  slug: string;
  index: string; // e.g. "01"
  title: string;
  subtitle: string;
  category: 'Mobile Platform' | 'Enterprise SaaS' | 'Spatial UI' | 'Design System' | 'Fintech OS';
  year: string;
  client: string;
  role: string;
  duration: string;
  summary: string;
  heroImage: string;
  overview: string;
  challenge: string;
  solution: string;
  impact: string[];
  screens: {
    title: string;
    caption: string;
    color: string;
    aspect: string;
    type: 'wireframe' | 'ui' | 'flow' | 'metric';
  }[];
  waypoints: ProjectWaypoint[];
  tools: string[];
}

export interface SpaceProject {
  id: string;
  slug: string;
  index: string;
  title: string;
  subtitle: string;
  typology: 'Residential Penthouse' | 'Creative Studio' | 'Boutique Gallery' | 'Pavilion' | 'Hospitality Lounge';
  year: string;
  location: string;
  area: string;
  client: string;
  summary: string;
  heroImage: string;
  materials: string[];
  lightingConcept: string;
  overview: string;
  spatialStrategy: string;
  details: {
    zone: string;
    description: string;
    specs: string;
  }[];
  waypoints: ProjectWaypoint[];
}

export type PageRoute = 
  | { name: 'home' }
  | { name: 'work' }
  | { name: 'work-detail'; slug: string }
  | { name: 'spaces' }
  | { name: 'space-detail'; slug: string }
  | { name: 'royce' }
  | { name: 'about' }
  | { name: 'contact' };

// ---------------------------------------------------------------------------
// Content page — featured projects (one-at-a-time 3D selector)
// ---------------------------------------------------------------------------

export type ProjectModelKey = 'royce-store' | 'villa' | 'urben-hatch' | 'thesis-bar';

export interface FeaturedProject {
  id: number;
  number: string; // always zero-padded: "01"
  slug: string;
  name: string;
  type: string;
  description: string;
  /** Procedural 3D representation used when no modelUrl is supplied. */
  modelKey: ProjectModelKey;
  /** Optional .glb/.gltf path (e.g. /projects/royce-store/model.glb). Takes precedence over modelKey. */
  modelUrl?: string;
  /** Project photographs/renders (e.g. /projects/royce-store/01.jpg). Shown before the generated model views. */
  images: { src: string; caption: string }[];
  details: { label: string; value: string }[];
}
