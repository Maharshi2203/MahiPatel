export interface CategoryContentDetail {
  id: string;
  number: string; // '01', '02', '03', '04'
  title: string; // '1. RESIDENTIAL SPACE', etc.
  name: string; // 'Residential Space'
  categoryKey: 'residential' | 'store' | 'hospitality' | 'thesis';
  filterKey: 'Residential' | 'Commercial' | 'Hospitality' | 'Thesis';
  subtitle: string;
  leadQuote: string;
  philosophy: string;
  spatialStrategy: string[];
  metrics: {
    label: string;
    value: string;
  }[];
  materialFocus: {
    name: string;
    hex: string;
    description: string;
  }[];
  featuredProjectSlugs: string[];
  coverImage: string;
}

export const CONTENT_PILLARS: CategoryContentDetail[] = [
  {
    id: 'residential-space',
    number: '01',
    title: '1. RESIDENTIAL SPACE',
    name: 'Residential Space',
    categoryKey: 'residential',
    filterKey: 'Residential',
    subtitle: 'Private Sanctuaries & Domestic Choreography',
    leadQuote: 'Homes designed around how people actually live — balancing tactile serenity with proportional intimacy.',
    philosophy:
      'In our residential practice, architecture is treated as a container for daily rituals and quiet contemplation. We reject ostentatious luxury in favor of quiet materiality: solid timber that warms under foot, hand-troweled lime wash that softens morning daylight, and deep courtyard lightwells that pull diurnal rhythms into the heart of the home.',
    spatialStrategy: [
      'Sequential threshold compression: entering through low, shadowed foyers before opening into soaring double-height courtyards.',
      'Subterranean daylight wells: carving sunken rock gardens that invite diffused northern light into basement listening rooms and spas.',
      'Bespoke joinery as wall partitions: floating storage plinths and sliding shoji screens eliminating redundant structural corridors.',
    ],
    metrics: [
      { label: 'Built Works', value: '06 Commissions' },
      { label: 'Scale Range', value: '3,800 — 7,200 sq ft' },
      { label: 'Locations', value: 'Kyoto, Ahmedabad, Zurich, Oslo' },
      { label: 'Primary Tone', value: 'Basalt, Cedar & Washed Linen' },
    ],
    materialFocus: [
      { name: 'Charred Yakisugi Cedar', hex: '#1C1B1A', description: 'Fire-treated surface providing natural moisture resistance and deep velvet textures.' },
      { name: 'Honed Kyoto Basalt', hex: '#3E3C39', description: 'Monolithic floor slabs cool to touch in summer and retentive of underfloor hydronic warmth.' },
      { name: 'Washi Paper Shoji', hex: '#F5F3EF', description: 'Handmade mulberry fiber screens diffusing stark exterior light into soothing ambient glow.' },
    ],
    featuredProjectSlugs: ['kyoto-pavilion-residence', 'house-of-seven-lightwells', 'monolithic-cliffside-villa'],
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop',
  },
  {
    id: 'commercial',
    number: '02',
    title: '2. COMMERCIAL',
    name: 'Commercial',
    categoryKey: 'store',
    filterKey: 'Commercial',
    subtitle: 'Tactile Retail, Slow-Commerce & Experiential Pavilions',
    leadQuote: 'Retail environments built to slow visitors down and sell a feeling — treating commercial space as spatial narrative rather than mere transaction.',
    philosophy:
      'In an era dominated by frictionless digital consumption, physical retail spaces must offer what screens cannot: scent, temperature, tactile friction, and acoustic weight. Our commercial interiors prioritize generous negative space, sculptural monolithic product plinths, and bespoke lighting choreographies that invite clients to linger, touch, and reflect.',
    spatialStrategy: [
      'The "Slow Threshold": extended transitional entry galleries that visually and acoustically decouple shoppers from congested city streets.',
      'Monolithic product plinths: massive raw travertine and sand-cast aluminum pedestals that elevate objects into gallery artifacts.',
      'Acoustic dampening membranes: heavy draped undyed wool and slatted acoustic timber eliminating reverberant shopping noise.',
    ],
    metrics: [
      { label: 'Flagship Spaces', value: '06 Built Boutiques' },
      { label: 'Locations', value: 'Ginza, Copenhagen, London, NYC' },
      { label: 'Dwell Time Shift', value: '+42% Over Standard Retail' },
      { label: 'Materiality', value: 'Travertine, Cast Bronze & Wool' },
    ],
    materialFocus: [
      { name: 'Roman Travertine', hex: '#D8CFBC', description: 'Unfilled honed stone with natural sediment banding anchoring central counters.' },
      { name: 'Sandblasted Aluminum', hex: '#B8B5AE', description: 'Precision aerospace metal softened with uniform micro-bead blasting.' },
      { name: 'Raw Belgian Linen', hex: '#EAE6DD', description: 'Floor-to-ceiling heavy drapery defining intimate fitting chambers.' },
    ],
    featuredProjectSlugs: ['kinfolk-nordic-concept-store', 'raw-silk-ochre-atelier', 'brutalist-ceramic-gallery-cafe'],
    coverImage: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?q=80&w=1600&auto=format&fit=crop',
  },
  {
    id: 'hospitality',
    number: '03',
    title: '3. HOSPITALITY',
    name: 'Hospitality',
    categoryKey: 'hospitality',
    filterKey: 'Hospitality',
    subtitle: 'Sanctuaries of Slowness, Onsen Spas & Dining Rooms',
    leadQuote: 'Designed for the first five seconds of a guest’s arrival — calibrating acoustics, shadow, and scent to disarm the senses.',
    philosophy:
      'Hospitality design is sensory stagecraft. We orchestrate transitions from harsh outdoor urban stimuli into cocoon-like interior atmospheres. By calibrating low-lumen indirect lighting, sub-audible mechanical ventilation, and natural stone heated water bodies, we create immersive spaces of genuine restorative luxury.',
    spatialStrategy: [
      'Sub-15 lumen ambient illumination: eliminating glare through hidden LED coves beneath bench plinths and raked plaster sconces.',
      'Thermal zoning choreography: transitioning through progressively warmer microclimates in wellness and bathhouse pavilions.',
      'Acoustically tuned dining envelopes: micro-perforated dark oak paneling and deep-pile carpeting facilitating intimate conversations.',
    ],
    metrics: [
      { label: 'Destinations', value: '06 Properties' },
      { label: 'Spatial Typologies', value: 'Spas, Onsens, Tea Lounges' },
      { label: 'Accolades', value: 'AIA Hospitality Honor Award' },
      { label: 'Atmosphere', value: 'Smoked Oak, Alabaster & Steam' },
    ],
    materialFocus: [
      { name: 'Smoked European Oak', hex: '#3B332B', description: 'Deeply oxidized tannin timber resilient to humid vapor and warm lighting.' },
      { name: 'Honed Black Slate', hex: '#26282B', description: 'Slip-resistant split-face stone framing thermal immersion pools.' },
      { name: 'Translucent Spanish Alabaster', hex: '#F0ECE1', description: 'Naturally veined gypsum diffusing warm candlelight and concealed pendants.' },
    ],
    featuredProjectSlugs: ['aman-kyoto-subterranean-onsen', 'kissa-soba-listening-room', 'lumina-alpine-chalet-spa'],
    coverImage: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1600&auto=format&fit=crop',
  },
  {
    id: 'thesis',
    number: '04',
    title: '4. THESIS',
    name: 'Thesis',
    categoryKey: 'thesis',
    filterKey: 'Thesis',
    subtitle: 'Speculative Inquiry & Climate-Adaptive Vernacular Systems',
    leadQuote: 'Academic and speculative design research — concept-first inquiry unconstrained by commercial briefs or budgets.',
    philosophy:
      'Our speculative and thesis research forms the intellectual bedrock of the studio. Here, we interrogate extreme climatic conditions, non-visual spatial perception, and ancient vernacular thermodynamics. These speculative pavilions and bio-material experiments directly inform our commercial and residential construction details.',
    spatialStrategy: [
      'Passive evaporative cooling shrouds: unglazed terracotta capillary tiles utilizing desert wind to drop interior temps by up to 8°C.',
      'Sensory deprivation sound chambers: sound-dampening volcanic pumice matrices exploring spatial memory without visual cues.',
      'Nocturnal circadian architecture: calibration of nocturnal light levels below 10 lumens to restore melatonin cycles.',
    ],
    metrics: [
      { label: 'Research Works', value: '06 Prototypes' },
      { label: 'Academic Honors', value: 'RIBA Bronze Medal Nominee' },
      { label: 'Field Deployments', value: 'Kutch Desert, Hokkaido, Iceland' },
      { label: 'Biomaterials', value: 'Capillary Terracotta & Adobe' },
    ],
    materialFocus: [
      { name: 'Capillary Terracotta Flutes', hex: '#C0704E', description: 'Porous unglazed clay engineered for evaporative water wicking and thermal draft generation.' },
      { name: 'Lime & Dune Adobe Mortar', hex: '#877764', description: 'Locally gathered subsoil stabilized with natural slaked lime for zero-carbon envelopes.' },
      { name: 'Woven Vetiver Root Screens', hex: '#9E9473', description: 'Aromatic desert grass lattices filtering sand and infusing cooling breezes with fragrance.' },
    ],
    featuredProjectSlugs: ['nocturnal-sanctuary-circadian', 'breathing-enclosures-evaporative-cooling', 'acoustic-monastery-silence'],
    coverImage: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=1600&auto=format&fit=crop',
  },
];
