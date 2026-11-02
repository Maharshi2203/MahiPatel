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
      { src: '/projects/urben-hatch/01-mezzanine-room-stairs.png', caption: 'Mezzanine Guestroom Suite — Custom Orange Floating Stair & Lounge' },
      { src: '/projects/urben-hatch/02-mezzanine-bed-interior.png', caption: 'Mezzanine Loft Sleeping Pod & Perforated Timber Railing' },
      { src: '/projects/urben-hatch/03-atrium-hall-colonnade.png', caption: 'Central Atrium Colonnade — Heritage Arches & Terrazzo Floor' },
      { src: '/projects/urben-hatch/04-atrium-jaali-seating.png', caption: 'Atrium Gathering Space & Contemporary Brick Jaali Partition' },
      { src: '/projects/urben-hatch/05-architectural-section-aa.png', caption: 'Longitudinal Section AA’ (1:100) — Roof Trusses & Courtyard Infill' },
      { src: '/projects/urben-hatch/06-sections-bb-cc.png', caption: 'Transverse Sections BB’ & CC’ — Minaret Tower & Wing Spatial Hierarchy' },
      { src: '/projects/urben-hatch/07-ground-first-floor-plans.png', caption: 'Comparative Floor Plans (1:250) — Ground Public Hub & First Floor Accommodations' },
      { src: '/projects/urben-hatch/08-concept-programme-zoning.png', caption: 'Concept Framework, Arch Typologies & Spatial Flow Diagram' },
      { src: '/projects/urben-hatch/09-urban-site-analysis.png', caption: 'Old City Ahmedabad Urban Site Analysis & Heritage Connectivity Matrix' },
      { src: '/projects/urben-hatch/10-crimson-atrium-stairs.png', caption: 'Sculptural Crimson Steel Staircase & Pedestrian Bridge Insertion' },
      { src: '/projects/urben-hatch/11-single-room-suite.png', caption: 'Single Room Suite Layout (1:25) & Striped Accent Moodboard' },
      { src: '/projects/urben-hatch/12-double-room-suite.png', caption: 'Double Room Suite Layout (1:25) & Material Board' },
      { src: '/projects/urben-hatch/13-cafe-atrium-plan.png', caption: 'Atrium Cafe Detailed Layout (1:50) & Custom Furnishings' },
    ],
    details: [
      { label: 'Location', value: 'Gheekanta, Old City Ahmedabad' },
      { label: 'Original Site', value: 'R.C. High School of Commerce (19,091 m²)' },
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
      { src: '/royce/plan-drawing.png', caption: 'Floor Plan (1:20 · 30 sq.m)' },
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
      { src: '/projects/villa/01-ground-floor-plan.jpg', caption: 'Ground Floor Plan — Furniture Layout' },
      { src: '/projects/villa/02-first-floor-plan.jpg', caption: 'First Floor Plan — Furniture Layout' },
      { src: '/projects/villa/03-section-aa.jpg', caption: 'Section AA’ — Living, Dining & Upper Bedrooms' },
      { src: '/projects/villa/04-section-bb.jpg', caption: 'Section BB’ — Kitchen, Staircase & Bathrooms' },
      { src: '/projects/villa/05-section-cc.jpg', caption: 'Section CC’ — Bedroom & Kitchen Elevations' },
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
