export interface MaterialBoardItem {
  id: string;
  name: string;
  category: 'Timber' | 'Lacquer & Paint' | 'Plaster & Coatings' | 'Metals' | 'Textiles' | 'Minerals';
  hex: string;
  secondaryHex?: string;
  soundType: 'timber' | 'metal' | 'lacquer' | 'plaster' | 'textile' | 'mineral';
  finish: string;
  application: string;
  tactileFeel: string;
  macroDescription: string;
  textureGrade: {
    relief: 'Ultra Smooth' | 'Micro-Grain' | 'Velvety Matte' | 'Porous Stone' | 'Brushed Striation' | 'Woven Rib';
    sheen: '5% Dead Flat' | '15% Satin Sheen' | '25% Eggshell' | '75% Metallic Sheen';
    thermalTouch: 'Warm Organic' | 'Neutral Matte' | 'Cool Metallic' | 'Cool Mineral';
    acousticValue: string;
  };
  provenance: string;
  specs: string;
  paletteBadge: string;
}

export const MATERIALS_BOARD_DATA: MaterialBoardItem[] = [
  {
    id: 'bleached-ash',
    name: 'Bleached Scandinavian Ash Planking',
    category: 'Timber',
    hex: '#E5E2DA',
    secondaryHex: '#C8C4BA',
    soundType: 'timber',
    finish: 'Wire-brushed & ultra-matte hardwax oil (3% sheen)',
    application: 'Perimeter Raised Deck & Flooring Platform',
    tactileFeel: 'Silky open grain with subtle micro-relief, warm and organic to the bare touch with dry tactile traction.',
    macroDescription: 'Pronounced linear earlywood vascular pores with fine silvery-blonde medullary rays and muted beige growth rings.',
    textureGrade: {
      relief: 'Micro-Grain',
      sheen: '5% Dead Flat',
      thermalTouch: 'Warm Organic',
      acousticValue: 'NRC 0.18 (Softens footfall resonance)',
    },
    provenance: 'FSC-Certified Northern Birch & European Fraxinus',
    specs: '220mm wide engineered timber planks with tongue & groove V-bevel micro-joints.',
    paletteBadge: 'Primary Deck',
  },
  {
    id: 'butter-yellow',
    name: 'Primrose Butter Yellow Satin Lacquer',
    category: 'Lacquer & Paint',
    hex: '#EFE0A2',
    secondaryHex: '#D6C87C',
    soundType: 'lacquer',
    finish: 'Multi-layer catalyzed polyurethane satin lacquer (15% sheen)',
    application: 'Cashier / POS Transaction Counter & Geometric Wall Plinths',
    tactileFeel: 'Soft velvety hand-feel without surface tackiness; non-porous, warm-touch, and finger-print resistant.',
    macroDescription: 'Micro-fine orange peel surface dispersion that diffuses ceiling point lights into a gentle warm golden halo.',
    textureGrade: {
      relief: 'Ultra Smooth',
      sheen: '15% Satin Sheen',
      thermalTouch: 'Neutral Matte',
      acousticValue: 'NRC 0.05 (Acoustically crisp)',
    },
    provenance: 'Custom architectural pigment formulation (CAD V Pop Up Shop)',
    specs: 'Sprayed over high-density MDF core with seamless 2mm eased radii corners.',
    paletteBadge: 'Focal POS Desk',
  },
  {
    id: 'salmon-rose',
    name: 'Dusty Salmon / Rose Matte Powdercoat',
    category: 'Plaster & Coatings',
    hex: '#E2A599',
    secondaryHex: '#C58376',
    soundType: 'plaster',
    finish: 'Architectural micro-texture electrostatic powdercoat',
    application: 'Dual Hanging Wardrobes Portals & Entrance Signage Totem',
    tactileFeel: 'Slightly powdery, fine-grained dry grip reminiscent of raw terracotta bisque and honed lime plaster.',
    macroDescription: 'Uniform granular texture that absorbs glancing architectural light and completely eliminates specular hotspots.',
    textureGrade: {
      relief: 'Velvety Matte',
      sheen: '5% Dead Flat',
      thermalTouch: 'Neutral Matte',
      acousticValue: 'NRC 0.12 (Gentle diffusion)',
    },
    provenance: 'Architectural Grade 2 polyester TGIC-free powder formulation',
    specs: 'Applied onto welded hollow-section steel frame and CNC cut aluminum totem panels.',
    paletteBadge: 'Wardrobe Portals',
  },
  {
    id: 'slate-teal',
    name: 'Muted Slate-Teal Architectural Compact',
    category: 'Lacquer & Paint',
    hex: '#3E4E58',
    secondaryHex: '#25323A',
    soundType: 'lacquer',
    finish: 'Thermal-cured anti-fingerprint solid core resin composite',
    application: 'Center Folded Apparel Island & Accessory Display Table',
    tactileFeel: 'Solid, dense, and cool to the fingertips with low-friction glide and high tactile mass.',
    macroDescription: 'Deep matte pigment depth with optical light absorption; zero directional grain.',
    textureGrade: {
      relief: 'Ultra Smooth',
      sheen: '5% Dead Flat',
      thermalTouch: 'Neutral Matte',
      acousticValue: 'NRC 0.08 (Solid structural dampening)',
    },
    provenance: 'High-pressure phenolic composite with nano-particle seal',
    specs: '16mm self-supporting monolithic compact slab with chamfered shark-nose edge.',
    paletteBadge: 'Center Display',
  },
  {
    id: 'champagne-brass',
    name: 'Brushed Champagne Brass & Pale Gold',
    category: 'Metals',
    hex: '#D4AF37',
    secondaryHex: '#EAD793',
    soundType: 'metal',
    finish: 'Radial mechanical brushing with clear protective nano-ceramic coat',
    application: 'Wardrobe Hanging Rails, Stiletto Heel Stems, Handbag Hardware',
    tactileFeel: 'Distinctly cool to the touch with fine micro-grooves that give tactile directional feedback to fingertips.',
    macroDescription: 'Parallel anisotropic brush striations that catch directional spotlights in luminous metallic ribbons.',
    textureGrade: {
      relief: 'Brushed Striation',
      sheen: '75% Metallic Sheen',
      thermalTouch: 'Cool Metallic',
      acousticValue: 'NRC 0.02 (High resonant ping)',
    },
    provenance: 'Solid C36000 architectural free-cutting brass alloy',
    specs: 'Precision CNC lathe-turned round rods and hand-patinated hardware fittings.',
    paletteBadge: 'Hardware Accents',
  },
  {
    id: 'perforated-yellow',
    name: 'Perforated Acoustic Steel Mesh',
    category: 'Metals',
    hex: '#EDE2A4',
    secondaryHex: '#B8A64E',
    soundType: 'metal',
    finish: 'Powdercoated canary yellow with semi-matte micro-stipple',
    application: 'Suspended Ceiling Cube, Display Plinth Cubes',
    tactileFeel: 'Rhythmic alternation between smooth painted metal and open geometric circular perforations.',
    macroDescription: '4mm staggered round hole array with 42% open architectural porosity and crisp punched hole rims.',
    textureGrade: {
      relief: 'Micro-Grain',
      sheen: '15% Satin Sheen',
      thermalTouch: 'Cool Metallic',
      acousticValue: 'NRC 0.55 (Acoustically transparent with backing)',
    },
    provenance: 'Cold-rolled architectural perforated steel sheet',
    specs: '2mm thickness, folded and Tig-welded box construction with concealed fasteners.',
    paletteBadge: 'Geometric Cubes',
  },
  {
    id: 'folded-knitwear',
    name: 'Natural Merino & Slubbed Linen Textiles',
    category: 'Textiles',
    hex: '#2E424D',
    secondaryHex: '#A8865C',
    soundType: 'textile',
    finish: 'Unfinished natural raw organic fibers',
    application: 'Apparel Display Stacks (Navy, Camel, Slate & Heather Grey)',
    tactileFeel: 'Plush, softly cushioned compressibility with textured knitted ribbing and soothing fiber warmth.',
    macroDescription: 'Interlocking dual-gauge yarn loops with natural slub yarn variations and subtle fuzzy halo fibers.',
    textureGrade: {
      relief: 'Woven Rib',
      sheen: '5% Dead Flat',
      thermalTouch: 'Warm Organic',
      acousticValue: 'NRC 0.72 (Exceptional sound absorption)',
    },
    provenance: 'Sustainably farmed 100% fine Merino wool & Belgian linen yarn',
    specs: '7-gauge flat-bed knitted garment panels folded in 4-tier graduated retail stacks.',
    paletteBadge: 'Apparel Goods',
  },
];
