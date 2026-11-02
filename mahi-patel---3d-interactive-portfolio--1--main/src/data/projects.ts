import { CaseStudy, SpaceProject } from '../types';

export const UX_PROJECTS: CaseStudy[] = [
  {
    id: 'kairo-os',
    slug: 'kairo-spatial-os',
    index: '01',
    title: 'Kairo Spatial OS',
    subtitle: 'Next-generation spatial canvas & gestural operating system for mixed-reality hardware',
    category: 'Spatial UI',
    year: '2025',
    client: 'Kairo Computing Labs',
    role: 'Lead Product & Spatial Designer',
    duration: '6 months',
    summary: 'A glass-morphic, depth-adaptive OS canvas built for gaze-and-pinch input paradigms.',
    heroImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop',
    overview: 'Kairo is a spatial operating interface designed to harmonize high-density creative workflows with ergonomic eye-tracking and micro-gestural inputs. We dismantled traditional windowing hierarchies in favor of infinite depth planes.',
    challenge: 'Existing spatial interfaces either clone 2D desktop flat panels or overwhelm cognitive load with gratuitous floating 3D gizmos. The goal was finding pure ergonomic zero-fatigue depth harmony.',
    solution: 'Designed an anchored focal-depth system where auxiliary tool palettes recess into subtle atmospheric occlusion, while active canvases scale smoothly according to user vergence angles.',
    impact: [
      '42% reduction in visual fatigue during continuous 4-hour sessions',
      'Adopted by 18,000 developer previewers worldwide',
      'Winner, Spatial Design Awards 2025'
    ],
    tools: ['Figma Spatial', 'Three.js', 'ShaderLab', 'VisionOS SDK', 'Cinema 4D'],
    screens: [
      {
        title: 'Depth Hierarchy & Spatial Dock',
        caption: 'The adaptive dock anchors dynamically 12 degrees below resting ocular axis.',
        color: '#1A1815',
        aspect: '16/9',
        type: 'ui'
      },
      {
        title: 'Gaze Focus Micro-Occlusion',
        caption: 'Unfocused panels drop 30% contrast with real-time blur attenuation.',
        color: '#121211',
        aspect: '4/3',
        type: 'flow'
      },
      {
        title: 'Gestural Precision Controller',
        caption: 'Sub-millimeter finger haptics translated into tactile auditory chime feedback.',
        color: '#1F1B16',
        aspect: '16/9',
        type: 'wireframe'
      }
    ],
    waypoints: [
      {
        position: [0, 1.8, 4.5],
        target: [0, 0.4, 0],
        title: '01 / Origin Viewport',
        subtitle: 'Initial spatial alignment',
        description: 'The spatial canvas initiates in balanced perspective, calibrating to the user’s ocular elevation.',
        badge: 'Spatial Core',
        metric: '60 FPS'
      },
      {
        position: [-2.4, 0.9, 2.8],
        target: [-0.6, 0.2, 0.2],
        title: '02 / Depth Layering',
        subtitle: 'Multi-plane cognitive hierarchy',
        description: 'Panels translate along the Z-axis, creating clear depth separation between active and peripheral workspaces.',
        badge: 'Depth Index',
        metric: '120mm Z-Offset'
      },
      {
        position: [2.1, -0.4, 2.2],
        target: [0.3, 0.1, -0.4],
        title: '03 / Gestural Palette',
        subtitle: 'Micro-pinch context hub',
        description: 'Contextual controls orbit the focal point, reachable within effortless micro-pinch radius.',
        badge: 'Ergonomics',
        metric: '0.4s Access'
      },
      {
        position: [0, 2.4, 1.6],
        target: [0, 0, -0.8],
        title: '04 / Immersion Corridor',
        subtitle: 'Full workspace synthesis',
        description: 'The entire spatial cluster converges into an uninterrupted ambient productivity environment.',
        badge: 'Synthesis',
        metric: '99.4% Latency-Free'
      }
    ]
  },
  {
    id: 'aether-wealth',
    slug: 'aether-wealth-engine',
    index: '02',
    title: 'Aether Wealth Engine',
    subtitle: 'Institutional algorithmic portfolio suite for family offices and private endowments',
    category: 'Fintech OS',
    year: '2024',
    client: 'Aether Capital Zurich',
    role: 'Principal UI/UX Architect',
    duration: '8 months',
    summary: 'High-density, low-latency financial dashboard delivering calm comprehension to $4B+ asset flows.',
    heroImage: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?q=80&w=1200&auto=format&fit=crop',
    overview: 'Designed a high-throughput institutional terminal that discards chaotic Bloomberg-style noise in favor of Japanese architectural restraint and Swiss typographic precision.',
    challenge: 'Portfolio managers were navigating through 14 disconnected browser windows to execute real-time hedging strategies during market turbulence.',
    solution: 'Built a unified unified state engine featuring micro-sparkline topography, instant keyboard command palette, and multi-asset liquidity corridors.',
    impact: [
      '$4.2B in annualized transactional volume executed through the engine',
      'Time-to-hedging order shortened from 3.8 minutes to 24 seconds',
      '100% executive adoption across Zurich, Geneva, and Singapore desks'
    ],
    tools: ['Figma', 'TypeScript', 'D3.js', 'Tailwind', 'WebSockets'],
    screens: [
      {
        title: 'Liquidity Heat Field',
        caption: 'Monochrome density gradients replace gaudy green-red indicators for psychological composure.',
        color: '#151412',
        aspect: '16/9',
        type: 'ui'
      },
      {
        title: 'Command Matrix & Yield Curves',
        caption: 'Keyboard-first navigation with sub-millisecond local filtering.',
        color: '#0F0F0E',
        aspect: '4/3',
        type: 'flow'
      },
      {
        title: 'Cross-Border Custody Tree',
        caption: 'Hierarchical multi-entity ownership structure rendered in clean vector lines.',
        color: '#1B1814',
        aspect: '16/9',
        type: 'metric'
      }
    ],
    waypoints: [
      {
        position: [0, 1.5, 4.2],
        target: [0, 0.2, 0],
        title: '01 / Global Liquidity View',
        subtitle: 'High-level macroscopic posture',
        description: 'A serene dark panoramic terminal visualizing cross-continental capital allocations.',
        badge: 'Macro Level',
        metric: '$4.2B'
      },
      {
        position: [-2.0, 0.6, 2.5],
        target: [-0.4, 0.1, 0.1],
        title: '02 / Yield Topography',
        subtitle: 'Mathematical precision curves',
        description: 'Multi-duration sovereign bond spreads plotted with razor-thin hairline curves.',
        badge: 'Analytics',
        metric: '10ms Refresh'
      },
      {
        position: [1.8, -0.3, 1.9],
        target: [0.2, 0.0, -0.2],
        title: '03 / Instant Execution Rail',
        subtitle: 'Frictionless order dispatch',
        description: 'Keyboard-driven command bar with instant dry-run simulated execution.',
        badge: 'Trading Rail',
        metric: '24s Turnaround'
      },
      {
        position: [0, 2.0, 1.4],
        target: [0, -0.2, -0.6],
        title: '04 / Settlement Topology',
        subtitle: 'Complete clearing verification',
        description: 'Multi-party institutional sign-off chain verified with zero visual clutter.',
        badge: 'Finality',
        metric: '100% Audit'
      }
    ]
  },
  {
    id: 'luminary-studio',
    slug: 'luminary-studio-suite',
    index: '03',
    title: 'Luminary Studio Suite',
    subtitle: 'Non-linear generative design workstation for architectural visualizers and film colorists',
    category: 'Enterprise SaaS',
    year: '2024',
    client: 'Luminary Software Tokyo',
    role: 'UX Director & Design Systems Lead',
    duration: '5 months',
    summary: 'A modular dark-mode workstation honoring the tactile weight of physical editing consoles.',
    heroImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
    overview: 'Luminary bridges procedural 3D world-building with cinematic grading timelines. We engineered an adaptive canvas that collapses complex node graphs into serene, human-legible visual flows.',
    challenge: 'Modern node-based applications suffer from tangled spaghetti graphs that hinder creative flow and cause cognitive paralysis in high-stakes visual pipelines.',
    solution: 'Introduced semantic node clusters, magnetic wire routing, and a warm bronze indicator accent scheme that highlights active compute shaders without blinding the editor.',
    impact: [
      '68% faster onboarding curve for junior digital artists',
      'Adopted by 4 international visual effects and architectural bureaus',
      'Nominated for Design System of the Year'
    ],
    tools: ['Figma', 'WebGL', 'GLSL Shaders', 'React', 'Design Tokens'],
    screens: [
      {
        title: 'Node Graph Orchestra',
        caption: 'Semantic bundling of procedural geometry pipelines with real-time preview thumbnails.',
        color: '#131312',
        aspect: '16/9',
        type: 'ui'
      },
      {
        title: 'Spectral Color Scopes',
        caption: 'Custom vectorscope and waveform monitors rendered with hairline GPU precision.',
        color: '#181715',
        aspect: '4/3',
        type: 'flow'
      },
      {
        title: 'Render Queue & Shader Cache',
        caption: 'Granular resource allocation tracking per GPU thread in warm minimal typography.',
        color: '#141413',
        aspect: '16/9',
        type: 'metric'
      }
    ],
    waypoints: [
      {
        position: [0, 1.6, 4.0],
        target: [0, 0.1, 0],
        title: '01 / Creative Canvas Stage',
        subtitle: 'Infinite procedural viewport',
        description: 'The creative stage provides unobstructed visual priority for render outputs.',
        badge: 'Viewport',
        metric: '4K Native'
      },
      {
        position: [-1.9, 0.4, 2.4],
        target: [-0.3, 0.0, 0.2],
        title: '02 / Semantic Node Network',
        subtitle: 'Self-organizing pipeline trees',
        description: 'Logical operations snap into clean architectural modules that reduce cognitive drag.',
        badge: 'Nodes',
        metric: '0 Spaghetti'
      },
      {
        position: [1.7, -0.2, 1.8],
        target: [0.1, -0.1, -0.3],
        title: '03 / Photometric Lighting Dial',
        subtitle: 'Physical rotary analog feel',
        description: 'Simulating the tactile resistance of premium physical studio hardware.',
        badge: 'Haptics',
        metric: 'Rotary Dial'
      },
      {
        position: [0, 2.2, 1.2],
        target: [0, -0.3, -0.7],
        title: '04 / Render Pipeline Matrix',
        subtitle: 'Real-time raytraced compile',
        description: 'Complete synthesis of texture, geometry, and atmospheric lighting passes.',
        badge: 'Compile',
        metric: 'Instant'
      }
    ]
  },
  {
    id: 'nexus-design-lang',
    slug: 'nexus-design-language',
    index: '04',
    title: 'Nexus System & Spec',
    subtitle: 'Unified design language and component architecture for multi-platform automotive OS',
    category: 'Design System',
    year: '2023',
    client: 'Nexus Mobility Group',
    role: 'Lead Systems Designer',
    duration: '7 months',
    summary: 'A mathematically rigorous token system spanning center-stack touchscreens, heads-up displays, and companion mobile apps.',
    heroImage: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1200&auto=format&fit=crop',
    overview: 'Nexus is a multi-modal design system built for the safety and elegance of next-generation electric vehicles. Every button, dial, and indicator complies with ISO driver distraction standards while projecting a bespoke sense of luxury.',
    challenge: 'Designing an aesthetic that reads effortlessly in direct desert sunlight, pitch-black night drives, and peripheral vision glances without losing its signature visual tone.',
    solution: 'Constructed an adaptive contrast token matrix with 3 dynamic luminance modes, custom optical kerning rules, and haptic vibration fingerprints.',
    impact: [
      'Zero safety violations across 50,000 km of closed-circuit test track trials',
      'Unified 4 engineering teams across Munich, Tokyo, and San Francisco',
      'Reduced component variation by 74%'
    ],
    tools: ['Figma Tokens', 'Crank Storyboard', 'Qt / QML', 'Design Architecture'],
    screens: [
      {
        title: 'Heads-Up Display HUD Projection',
        caption: 'Essential speed and navigation vectors mapped to infinite focal distance.',
        color: '#111110',
        aspect: '16/9',
        type: 'ui'
      },
      {
        title: 'Center Console Media & Climate Grid',
        caption: 'Large touch target zones designed for muscle memory activation without gaze diversion.',
        color: '#171614',
        aspect: '4/3',
        type: 'flow'
      },
      {
        title: 'Token Math & Variable Contrast',
        caption: 'Ambient light sensor dynamically shifts gray tones between #0D0D0D and #1F1F1E.',
        color: '#151412',
        aspect: '16/9',
        type: 'wireframe'
      }
    ],
    waypoints: [
      {
        position: [0, 1.4, 3.8],
        target: [0, 0.1, 0],
        title: '01 / Cockpit Baseline',
        subtitle: 'Driver ocular alignment',
        description: 'Calibrating essential driver telemetry within the critical 15-degree visual cone.',
        badge: 'HUD Array',
        metric: 'ISO Safe'
      },
      {
        position: [-1.8, 0.3, 2.2],
        target: [-0.3, 0.0, 0.1],
        title: '02 / Center Glass Interface',
        subtitle: 'Ergonomic touch zones',
        description: 'Primary controls positioned for instinctive muscle memory without ocular deflection.',
        badge: 'Touch UI',
        metric: '44mm Minimum'
      },
      {
        position: [1.6, -0.2, 1.7],
        target: [0.1, -0.1, -0.2],
        title: '03 / Night Luminescence Engine',
        subtitle: 'Warm brass nocturnal palette',
        description: 'Preserving natural scotopic eye adaptation while driving on unlit country roads.',
        badge: 'Photometry',
        metric: '2.1 Nits'
      },
      {
        position: [0, 2.1, 1.1],
        target: [0, -0.2, -0.5],
        title: '04 / Complete Mobility Ecosystem',
        subtitle: 'Seamless cockpit-to-mobile sync',
        description: 'Harmonious transition as user approaches the vehicle and hands off navigation.',
        badge: 'Handoff',
        metric: 'Instant Sync'
      }
    ]
  }
];

export const SPATIAL_PROJECTS: SpaceProject[] = [
  {
    id: 'kyoto-residence',
    slug: 'kyoto-pavilion-residence',
    index: '01',
    title: 'Kyoto Pavilion Residence',
    subtitle: 'Minimalist courtyard villa merging sukiya-zukuri carpentry with blackened steel',
    typology: 'Residential Penthouse',
    year: '2025',
    location: 'Higashiyama, Kyoto',
    area: '420 m²',
    client: 'Private Collector',
    summary: 'A quiet architectural sanctuary centered around a framed stone garden and sliding shoji screens.',
    heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
    overview: 'The Kyoto Pavilion Residence was conceived as a meditation on shadow, grain, and seasonal light. We carved out a continuous perimeter veranda (engawa) that dissolves the boundary between the tatami interior and the moss rock garden.',
    materials: ['Charred Yakisugi Cedar', 'Honed Basalt Stone', 'Washi Paper Shoji', 'Aged Unlacquered Brass'],
    lightingConcept: 'Hidden low-cove fixtures (2400K) grazing natural stone textures, allowing deep shadows to shape the interior volume in the spirit of Junichiro Tanizaki’s In Praise of Shadows.',
    spatialStrategy: 'Sequential compression and expansion: a narrow, darkened entryway vestibule opens suddenly into a double-height central pavilion flanked by quiet water reflections.',
    details: [
      {
        zone: 'Central Engawa & Water Terrace',
        description: 'Seamless basalt slabs extending beyond the glazed threshold to create floating garden steps.',
        specs: 'Basalt / Yakisugi / Blackened Steel'
      },
      {
        zone: 'Private Tea Room (Chashitsu)',
        description: 'Intimate four-and-a-half mat chamber lit exclusively by a low horizontal sliding window.',
        specs: 'Kyoto Reed Ceiling / Earth Plaster'
      },
      {
        zone: 'Master Bath & Hinoki Soaking Tub',
        description: 'Custom Japanese cypress tub set within floor-to-ceiling dark textured granite walls.',
        specs: 'Aged Hinoki Wood / Honed Granite'
      }
    ],
    waypoints: [
      {
        position: [0, 1.6, 4.2],
        target: [0, 0.3, 0],
        title: '01 / Arrival Vestibule',
        subtitle: 'Atmospheric compression',
        description: 'Dark yakisugi timber walls filter the outside world into acoustic hush.',
        badge: 'Threshold',
        metric: '2400K Ambient'
      },
      {
        position: [-2.2, 0.8, 2.6],
        target: [-0.5, 0.2, 0.1],
        title: '02 / Living Pavilion & Engawa',
        subtitle: 'Dissolving inside and outside',
        description: 'Floor-to-ceiling sliding glass panels open completely to the moss garden.',
        badge: 'Pavilion',
        metric: '420 m²'
      },
      {
        position: [1.9, -0.3, 2.0],
        target: [0.3, 0.0, -0.3],
        title: '03 / Stone & Fire Hearth',
        subtitle: 'Sculptural brass fixture',
        description: 'A monolithic block of basalt carved with a concealed bio-ethanol ribbon flame.',
        badge: 'Hearth',
        metric: 'Basalt Core'
      },
      {
        position: [0, 2.3, 1.3],
        target: [0, -0.1, -0.7],
        title: '04 / Internal Moss Courtyard',
        subtitle: 'Zen rock garden axis',
        description: 'Ancient river stones positioned according to traditional dry landscape aesthetics.',
        badge: 'Sanctuary',
        metric: 'Natural Daylight'
      }
    ]
  },
  {
    id: 'atelier-noir',
    slug: 'atelier-noir-studio',
    index: '02',
    title: 'Atelier Noir Studio',
    subtitle: 'Converted industrial warehouse into a monolithic photography and furniture design atelier',
    typology: 'Creative Studio',
    year: '2024',
    location: 'Kreuzberg, Berlin',
    area: '680 m²',
    client: 'Studio Klint & Partners',
    summary: 'A dramatic interplay of raw board-formed concrete, matte black steel, and linen acoustic baffles.',
    heroImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop',
    overview: 'A historic Berlin brick warehouse transformed into a multi-disciplinary creative laboratory. We stripped back decades of partition walls to expose the 7-meter vaulted brickwork, inserting a floating steel mezzanine cube.',
    materials: ['Board-Formed Concrete', 'Industrial Hot-Rolled Steel', 'Belgian Natural Linen', 'Smoked Oak Flooring'],
    lightingConcept: 'Gallery-grade high-CRI (98+) directional track projectors balanced by soft floor-grazing linear brass profiles that accentuate the concrete grain.',
    spatialStrategy: 'Open-plan communal work deck anchored by monolithic private meeting capsules and a central espresso bar crafted from a single 4-ton granite boulder.',
    details: [
      {
        zone: 'Floating Steel Mezzanine',
        description: 'Suspended structure housing the architectural model workshop and private library.',
        specs: 'Laser-Cut Steel / Smoked Oak'
      },
      {
        zone: 'Cyclorama Photography Stage',
        description: 'Full curved infinity wall with computerized motorized diffuse softbox rigging overhead.',
        specs: 'Seamless White Plaster / DMX Control'
      },
      {
        zone: 'Acoustic Tasting Lounge',
        description: 'Draped Belgian linen partitions damping reverberation around low mid-century seating.',
        specs: 'Raw Linen / Aniline Leather'
      }
    ],
    waypoints: [
      {
        position: [0, 1.7, 4.4],
        target: [0, 0.4, 0],
        title: '01 / Industrial Nave Entry',
        subtitle: 'Exposed brickwork & steel',
        description: 'A 7-meter vaulted entrance framed by original 19th-century structural arches.',
        badge: 'Warehouse Nave',
        metric: '7m Vault'
      },
      {
        position: [-2.1, 0.7, 2.7],
        target: [-0.4, 0.1, 0.2],
        title: '02 / Floating Mezzanine Bridge',
        subtitle: 'Hot-rolled structural steel',
        description: 'An architectural insertion suspended above the open creative studio floor.',
        badge: 'Mezzanine',
        metric: '4-ton Rigidity'
      },
      {
        position: [1.8, -0.4, 2.1],
        target: [0.2, -0.1, -0.3],
        title: '03 / The Granite Monolith Bar',
        subtitle: 'Raw split-face boulder',
        description: 'A sculptural community anchor with recessed brass tapware and inductive brewing.',
        badge: 'Coffee Bar',
        metric: 'Natural Granite'
      },
      {
        position: [0, 2.4, 1.5],
        target: [0, 0.0, -0.8],
        title: '04 / Material Archive Vault',
        subtitle: 'Tactile tactile specimen wall',
        description: 'Carefully curated drawers of marble, timber, woven textiles, and patina metals.',
        badge: 'Archive',
        metric: '500+ Samples'
      }
    ]
  },
  {
    id: 'obsidian-gallery',
    slug: 'the-obsidian-gallery',
    index: '03',
    title: 'The Obsidian Gallery',
    subtitle: 'Subterranean contemporary art exhibition gallery and private viewing salon',
    typology: 'Boutique Gallery',
    year: '2024',
    location: 'Mayfair, London',
    area: '350 m²',
    client: 'Vandermeer Fine Art',
    summary: 'A dark monolithic cavern crafted with lime plaster and bronze vitrines for rare kinetic sculpture.',
    heroImage: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1200&auto=format&fit=crop',
    overview: 'Located beneath a Grade II listed Mayfair townhouse, The Obsidian Gallery redefines art exhibition. Instead of blinding white cubes, the space uses deep charcoal micro-cement to render background distractions invisible, making the art luminous.',
    materials: ['Dark Charcoal Lime Plaster', 'Cast Bronze Hardware', 'Black Terrazzo Aggregates', 'Fluted Cast Glass'],
    lightingConcept: 'Framed beam-shaper spotlights with zero light spill, illuminating sculptures as if they generate their own internal luminescence.',
    spatialStrategy: 'Labyrinthine sequence of three progressively intimate galleries culminating in an acoustically isolated collectors’ viewing salon.',
    details: [
      {
        zone: 'Subterranean Main Gallery',
        description: 'Seamless dark terrazzo floor reflecting faint silhouettes of monumental kinetic bronzes.',
        specs: 'Black Terrazzo / Lime Wash'
      },
      {
        zone: 'Bronze Portal Thresholds',
        description: 'Hand-patinated antique bronze portals framing axial vistas between gallery chambers.',
        specs: 'Hand-Patinated Bronze'
      },
      {
        zone: 'Collectors’ Private Salon',
        description: 'Concealed motorized art storage racks revealing masterpiece canvases on command.',
        specs: 'Cashmere Felt Walls / Motorized Storage'
      }
    ],
    waypoints: [
      {
        position: [0, 1.5, 4.0],
        target: [0, 0.2, 0],
        title: '01 / Portal Descent',
        subtitle: 'Stepping into the void',
        description: 'A bronze-lined stair descending from street level into acoustic tranquility.',
        badge: 'Portal',
        metric: '-4.5m Depth'
      },
      {
        position: [-1.9, 0.5, 2.4],
        target: [-0.3, 0.1, 0.1],
        title: '02 / Axial Exhibition Hall',
        subtitle: 'Atmospheric darkness',
        description: 'Charcoal lime plaster surfaces eliminate glare, elevating artworks into pure focal points.',
        badge: 'Main Hall',
        metric: 'CRI 99 Light'
      },
      {
        position: [1.7, -0.3, 1.9],
        target: [0.2, -0.1, -0.2],
        title: '03 / Bronze Vitrine Chamber',
        subtitle: 'Museum microclimate display',
        description: 'Hermetically sealed vitrines housing delicate historic artifacts and jewelry.',
        badge: 'Vitrines',
        metric: 'RH 45% Sealed'
      },
      {
        position: [0, 2.1, 1.2],
        target: [0, -0.2, -0.6],
        title: '04 / Collector Salon & Vault',
        subtitle: 'Private acquisition sanctuary',
        description: 'Low wool lounge surrounded by hidden motorized architectural art walls.',
        badge: 'Private Salon',
        metric: 'Soundproofed'
      }
    ]
  },
  {
    id: 'verdant-penthouse',
    slug: 'verdant-courtyard-penthouse',
    index: '04',
    title: 'Verdant Penthouse',
    subtitle: 'Triplex sky residence integrated with cantilevered botanical terraces and travertine baths',
    typology: 'Residential Penthouse',
    year: '2023',
    location: 'Tribeca, New York',
    area: '540 m²',
    client: 'Tech Founder & Family',
    summary: 'A warm sanctuary high above the Hudson River with Roman travertine, walnut cabinetry, and lush foliage.',
    heroImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200&auto=format&fit=crop',
    overview: 'Spanning the top three floors of a classic Tribeca building, this penthouse harmonizes panoramic Manhattan skyline vistas with the grounded organic serenity of natural stone and lush indoor trees.',
    materials: ['Navona Roman Travertine', 'American Black Walnut', 'Fluted Calacatta Marble', 'Brushed Champagne Metal'],
    lightingConcept: 'Biophilic circadian lighting program synchronized to sunset and sunrise times, casting soft amber warmth across stone surfaces.',
    spatialStrategy: 'A central sculptural spiral staircase wrapped in continuous curved plaster ribbons, connecting entertaining floors to private sleeping quarters and sky terrace.',
    details: [
      {
        zone: 'Double-Height Great Room',
        description: 'A 6.5-meter fireplace wall sculpted from bookmatched Navona travertine slabs.',
        specs: 'Navona Travertine / Bronze Ribbon'
      },
      {
        zone: 'Cantilevered Sky Garden',
        description: 'Perennial grasses, Japanese maple trees, and outdoor heated stone plunge pool.',
        specs: 'Weathered Teak / Basalt Plunge'
      },
      {
        zone: 'Sculptural Ribbon Staircase',
        description: 'Hand-troweled Venetian plaster balustrade curving gracefully between three levels.',
        specs: 'Venetian Plaster / Walnut Treads'
      }
    ],
    waypoints: [
      {
        position: [0, 1.6, 4.3],
        target: [0, 0.3, 0],
        title: '01 / Skyline Great Room',
        subtitle: 'Double-height panorama',
        description: 'Floor-to-ceiling glass framing the Hudson River and evening sunset hues.',
        badge: 'Great Room',
        metric: '6.5m Ceiling'
      },
      {
        position: [-2.0, 0.6, 2.6],
        target: [-0.4, 0.1, 0.2],
        title: '02 / Sculptural Spiral Spine',
        subtitle: 'Curved Venetian plaster',
        description: 'A sweeping continuous ribbon linking the triplex levels with seamless elegance.',
        badge: 'Ribbon Stair',
        metric: '3 Levels'
      },
      {
        position: [1.8, -0.3, 2.0],
        target: [0.2, 0.0, -0.3],
        title: '03 / Bookmatched Travertine Hearth',
        subtitle: 'Grounded geological warmth',
        description: 'A monumental stone centerpiece balancing urban glass with timeless mineral presence.',
        badge: 'Hearth Wall',
        metric: 'Navona Stone'
      },
      {
        position: [0, 2.3, 1.4],
        target: [0, -0.1, -0.7],
        title: '04 / Cantilevered Sky Garden',
        subtitle: 'Biophilic canopy terrace',
        description: 'Lush Japanese maples and outdoor plunge pool overlooking the New York skyline.',
        badge: 'Sky Terrace',
        metric: 'Tribeca View'
      }
    ]
  },
  {
    id: 'urben-hatch',
    slug: 'urben-hatch',
    index: '05',
    title: 'Urben Hatch',
    subtitle: 'Adaptive reuse of a historic colonial high school into an energetic hostel and co-living hotel',
    typology: 'Hospitality Lounge',
    year: '2024',
    location: 'Gheekanta, Old City Ahmedabad',
    area: '19,091 m²',
    client: 'Design Studio VI · Indus University',
    summary: 'A vibrant boutique hostel celebrating historic colonial arches, contemporary brick jaali screens, and crimson steel stairs.',
    heroImage: '/projects/urben-hatch/01-mezzanine-room-stairs.png',
    overview: 'Urben Hatch transforms the historic R.C. High School of Commerce into an energetic civic hospitality hub for travelers, backpackers, and creative interns. By preserving the historic brick arcade colonnades, high ceilings, and timber trusses, the design inserts bold crimson steel circulation cores, double-height mezzanine guestroom pods, and a bustling ground-floor cafe and co-working space.',
    materials: [
      'Historic Terracotta Brick & Jaali Screen',
      'Architectural Crimson Steel Framework',
      'Polished Peach Cast Terrazzo',
      'Natural Fluted White Oak Joinery',
      'Warm Breathable Ivory Lime Wash'
    ],
    lightingConcept: 'Diffused daylight filtered through restored colonial archways and contemporary perforated brick screens, complemented by 2700K warm linear LED grazers that highlight heritage masonry textures.',
    spatialStrategy: 'Vertical stratification from public to private: the ground level houses a porous community cafe, co-working atrium, and stepped gathering podium, while high-ceilinged former classrooms are retrofitted with dual-level mezzanine sleeping capsules.',
    details: [
      {
        zone: 'Central Atrium & Arcaded Colonnade',
        description: 'Restored colonial arch colonnade framing double-height gathering zones and stepped wooden amphitheatres.',
        specs: 'Restored Brick / Peach Terrazzo / Stepped Oak'
      },
      {
        zone: 'Crimson Steel Sculptural Staircase',
        description: 'Bold red architectural steel insertion linking ground-level reception with elevated pedestrian bridges.',
        specs: 'Crimson Coated Steel / Mesh Balustrades'
      },
      {
        zone: 'Mezzanine Guestroom Sleeping Pods',
        description: 'Double-tier private rooms with custom orange cantilevered stair, under-stair luggage storage, and slatted oak screen.',
        specs: 'Custom Cantilever Steel / Oak Millwork / Linen'
      },
      {
        zone: 'Atrium Cafe & Co-Working Hub',
        description: 'Public-facing hospitality space with circular dining hubs, integrated planters, and communal work tables.',
        specs: 'Bespoke Millwork / Cast Terrazzo Tops'
      }
    ],
    waypoints: [
      {
        position: [0, 1.7, 4.2],
        target: [0, 0.2, 0],
        title: '01 / Colonnaded Atrium Arrival',
        subtitle: 'Heritage colonial portal',
        description: 'Sunlight cascades through restored segmental archways onto polished peach terrazzo.',
        badge: 'Atrium Portal',
        metric: 'Double-Height'
      },
      {
        position: [-2.1, 0.7, 2.5],
        target: [-0.4, 0.1, 0.1],
        title: '02 / Sculptural Crimson Stair',
        subtitle: 'Dynamic architectural spine',
        description: 'Contrasting crimson steel structure cutting through the neutral brickwork to link mezzanine levels.',
        badge: 'Steel Spine',
        metric: 'Crimson Red'
      },
      {
        position: [1.8, -0.2, 1.9],
        target: [0.2, 0.0, -0.2],
        title: '03 / Brick Jaali Gathering Steps',
        subtitle: 'Porous acoustic amphitheatre',
        description: 'Stepped oak seating podium nestled against a contemporary terracotta jaali screen wall.',
        badge: 'Social Core',
        metric: 'Brick Jaali'
      },
      {
        position: [0, 2.2, 1.3],
        target: [0, -0.1, -0.6],
        title: '04 / Mezzanine Sleeping Loft',
        subtitle: 'Private micro-living sanctuary',
        description: 'Upper-level sleeping quarters with perforated privacy railings and tactile striped wall accents.',
        badge: 'Pod Loft',
        metric: 'Dual-Level'
      }
    ]
  }
];
