import * as THREE from 'three';

const absMat = (color, roughness = 0.24, extra = {}) =>
  new THREE.MeshStandardMaterial({
    color,
    roughness,
    metalness: 0.02,
    ...extra,
  });

export const MATERIALS = {
  // Hardwood floor planks (dark reddish-brown variations)
  floor1: absMat('#4a2216', 0.2),
  floor2: absMat('#53271a', 0.22),
  floor3: absMat('#421d12', 0.2),
  floor4: absMat('#5b2c1d', 0.23),
  subFloor: absMat('#26150f', 0.35),

  // Perimeter gray studded border
  borderGray: absMat('#8c8e90', 0.25),
  borderDark: absMat('#646669', 0.26),

  // Cream / warm tan walls & subtle brick variations
  wall1: absMat('#e8d2b0', 0.26),
  wall2: absMat('#e1c9a4', 0.27),
  wall3: absMat('#ecd8b8', 0.25),
  wallTop: absMat('#efe0c4', 0.24),

  // Curtains & bed frame tans
  curtain: absMat('#c79f69', 0.26),
  curtainAlt: absMat('#bd935c', 0.27),
  bedTan: absMat('#c69e67', 0.24),
  bedTanDark: absMat('#ad834e', 0.26),

  // Whites used by the room, door, bedding, and props
  white: absMat('#f6f3ec', 0.22),
  whiteSoft: absMat('#e8e3d9', 0.24),

  // Beige shades for the armchair
  chairBeige: absMat('#e8d2b0', 0.26),
  chairBeigeLight: absMat('#f0dfc4', 0.24),
  chairBeigeDark: absMat('#c79f69', 0.26),
  pillowGray: absMat('#b5b4b0', 0.25),

  // Grays & blacks (nightstands, dresser, blanket, legs)
  lightGray: absMat('#989a9c', 0.24),
  medGray: absMat('#63666a', 0.25),
  darkGray: absMat('#45484c', 0.24),
  charcoal: absMat('#2c2e32', 0.24),
  black: absMat('#17181b', 0.22),

  // Rug mosaic colors
  rugTan: absMat('#cfc1a2', 0.28),
  rugSand: absMat('#b7a37e', 0.28),
  rugLightGray: absMat('#979896', 0.28),
  rugDarkGray: absMat('#696a68', 0.28),

  // Plant & pot
  potBlue: absMat('#102e4a', 0.2),
  soilBrown: absMat('#3d2214', 0.35),
  leafGreen: absMat('#237841', 0.24),
  leafBright: absMat('#35924b', 0.24),
  oliveGreen: absMat('#244f32', 0.25),

  // Dresser & picture frame browns / accents
  reddishBrown: absMat('#6b2e16', 0.22),
  frameBrown: absMat('#9b6535', 0.24),
  artGold: absMat('#d4a349', 0.25),

  // Metals, glass & glowing lamp shades
  silver: absMat('#c4c7cc', 0.16, { metalness: 0.82 }),
  brass: absMat('#b5894c', 0.22, { metalness: 0.65 }),
  glass: absMat('#6fa9d2', 0.12, {
    metalness: 0.1,
    transparent: true,
    opacity: 0.42,
  }),
  lampShade: absMat('#ffca66', 0.25, {
    emissive: '#ff961c',
    emissiveIntensity: 0.62,
  }),
  lampCore: absMat('#ffae34', 0.22, {
    emissive: '#ff8800',
    emissiveIntensity: 0.78,
  }),
  blanketDark: absMat('#57585c', 0.24),
  blanketBlack: absMat('#17181b', 0.22),
};
