import * as THREE from 'three';

const absMat = (color, roughness = 0.24, extra = {}) =>
  new THREE.MeshStandardMaterial({ color, roughness, metalness: 0.02, ...extra });

export const MATERIALS = {
  floor1: absMat('#a96732', 0.2),
  floor2: absMat('#b77a40', 0.22),
  floor3: absMat('#c28a4b', 0.2),
  floor4: absMat('#d09a59', 0.23),
  subFloor: absMat('#704b2e', 0.35),
  wall1: absMat('#dfcfb6', 0.26),
  wall2: absMat('#e7d8bf', 0.27),
  wallAccent: absMat('#8f6b4d', 0.27),
  wallTop: absMat('#ecdec7'),
  white: absMat('#f6f3ec', 0.22),
  whiteSoft: absMat('#e9e4da'),
  duvet: absMat('#d8cfbf'),
  bedFrame: absMat('#383b40'),
  headboard: absMat('#44484e'),
  tan: absMat('#c69e67'),
  wood: absMat('#b77a40'),
  sill: absMat('#74777a'),
  sillTop: absMat('#85888a'),
  black: absMat('#17181b'),
  radiator: absMat('#e5dfc9'),
  soilBrown: absMat('#3d2214', 0.35),
  leafGreen: absMat('#237841'),
  leafBright: absMat('#35924b'),
  silver: absMat('#c4c7cc', 0.16, { metalness: 0.82 }),
  glass: absMat('#d7dfdc', 0.12, { transparent: true, opacity: 0.32, depthWrite: false }),
  toyBlue: absMat('#87c8dd'),
  toyLilac: absMat('#b2a0d5'),
  toyPink: absMat('#e5b1ca'),
  toyBelly: absMat('#edf1e9'),
  yellow: absMat('#e6bf59'),
};
