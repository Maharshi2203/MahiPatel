import { FeaturedProject } from '../types';

/**
 * Content page projects, in presentation order (01 → 04): Urben Hatch, Royce', Villa, Miscellaneous.
 *
 * To add real media, drop files into /public/projects/<slug>/ and reference them:
 *   images: [{ src: '/projects/royce-store/01.jpg', caption: 'Storefront' }]
 *   modelUrl: '/projects/royce-store/model.glb'
 * Generated model views (axonometric, plan, elevation…) are appended after any images.
 */
export const FEATURED_PROJECTS: FeaturedProject[] = [
  {
    id: 1,
    number: '01',
    slug: 'urben-hatch',
    name: 'URBEN HATCH',
    type: 'Adaptive Reuse Hostel Hotel',
    description:
      'Adaptive reuse of the historic R.C. High School of Commerce in Gheekanta, Old City Ahmedabad into an energetic boutique hostel and co-living hotel. Preserving historic colonial arcades, brick jaali screens, and timber roof trusses while inserting cantilevered steel stairs, mezzanine sleeping pods, public cafe, and communal co-working spaces.',
    modelKey: 'urben-hatch',
    images: [
      { src: '/projects/urben-hatch/sheet-01-concept.jpg', caption: '01 · Concept & Site Analysis — Heritage Adaptive Reuse, Objectives & Spatial Connectivity' },
      { src: '/projects/urben-hatch/sheet-02-ground-floor-plan.jpg', caption: '02 · Ground Floor Plan (1:250) — Public Amenities, Co-Working Hub, Reception & Cafe' },
      { src: '/projects/urben-hatch/sheet-03-first-floor-plan.jpg', caption: '03 · First Floor Plan (1:250) — Single, Double & Dormitory Accommodations' },
      { src: '/projects/urben-hatch/sheet-04-sections.jpg', caption: '04 · Architectural Sections (1:250) — Section AA’, BB’, and CC’ Spatial Hierarchy' },
      { src: '/projects/urben-hatch/sheet-05-reception.jpg', caption: '05 · Reception & Central Atrium — Multi-Level Plans (2300, 4700, 6200) & Crimson Staircase Renders' },
      { src: '/projects/urben-hatch/sheet-06-double-room.jpg', caption: '06 · Double Room Suite (1:25) — Detailed Plan, Material Palette & Mezzanine Loft Renders' },
      { src: '/projects/urben-hatch/sheet-07-single-room.jpg', caption: '07 · Single Room Suite (1:25) — Detailed Plan, Material Palette & Crimson Bedroom Renders' },
    ],
    details: [
      { label: 'Location', value: 'Gheekanta, Old City Ahmedabad' },
      { label: 'Original Site', value: 'R.C. High School of Commerce' },
      { label: 'Typology', value: 'Adaptive Reuse & Boutique Hostel' },
      { label: 'Academic Studio', value: 'Design Studio VI · Semester 6' },
    ],
  },
  {
    id: 2,
    number: '02',
    slug: 'royce-store',
    name: "ROYCE’",
    type: 'Retail Store Interior Design',
    description:
      'A Japanese luxury chocolate retail interior at Shilp Aaron, Bodakdev, Ahmedabad. Guided by the Kanso philosophy — simplicity and purity — translating brand identity into a serene, minimal spatial experience.',
    modelKey: 'royce-store',
    images: [
      { src: '/royce/storefront-hero.png', caption: 'Storefront Facade Elevation (1:20)' },
      { src: '/royce/plan-drawing.png', caption: 'Floor Plan (1:20)' },
      { src: '/royce/mood-board.png', caption: 'Concept Mood Board & Material Palette' },
    ],
    details: [
      { label: 'Location', value: 'Shilp Aaron, Bodakdev, Ahmedabad' },
      { label: 'Concept', value: 'Kanso — Simplicity & Purity' },
      { label: 'Discipline', value: 'Retail Interior Design' },
    ],
  },
  {
    id: 3,
    number: '03',
    slug: 'villa',
    name: 'Villa',
    type: 'Residential Villa',
    description:
      'A two-storey residential villa set within a landscaped garden plot with a covered car porch. The ground floor opens kitchen, dining and living into one continuous space alongside a guest bedroom, while the first floor holds the private bedroom suites, a family lounge and bathrooms. Developed as a complete set of rendered furniture layouts and interior sections.',
    modelKey: 'villa',
    images: [
      { src: '/projects/villa/01-ground-floor-plan.jpg?v=2', caption: 'Ground Floor Plan — Furniture Layout' },
      { src: '/projects/villa/02-first-floor-plan.jpg?v=2', caption: 'First Floor Plan — Furniture Layout' },
      { src: '/projects/villa/03-section-aa.jpg?v=2', caption: 'Section AA’ — Living, Dining & Upper Bedrooms' },
      { src: '/projects/villa/04-section-bb.jpg?v=2', caption: 'Section BB’ — Kitchen, Staircase & Bathrooms' },
      { src: '/projects/villa/05-section-cc.jpg?v=2', caption: 'Section CC’ — Bedroom & Kitchen Elevations' },
    ],
    details: [
      { label: 'Typology', value: 'Residential Villa (G+1)' },
      { label: 'Programme', value: 'Living, Dining, Kitchen & Bedroom Suites' },
      { label: 'Discipline', value: 'Interior & Spatial Design' },
      { label: 'Academic Studio', value: 'CAD IV · IDS, Indus University' },
    ],
  },
  {
    id: 4,
    number: '04',
    slug: 'miscellaneous',
    name: 'Miscellaneous',
    type: 'Selected Works',
    description:
      'A collection of miscellaneous design works and studies. (Placeholder description — replace with project details.)',
    modelKey: 'thesis-bar',
    images: [],
    details: [
      { label: 'Category', value: 'Miscellaneous' },
      { label: 'Discipline', value: 'Interior & Spatial Design' },
    ],
  },
];

export const wrapProjectIndex = (i: number) =>
  ((i % FEATURED_PROJECTS.length) + FEATURED_PROJECTS.length) % FEATURED_PROJECTS.length;

/** Position of a project in FEATURED_PROJECTS by slug (0 if not found). */
export const projectIndexBySlug = (slug: string) =>
  Math.max(0, FEATURED_PROJECTS.findIndex((p) => p.slug === slug));
