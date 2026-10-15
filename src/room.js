import * as THREE from 'three';
import {
  BRICK_PARTS,
  LDrawCatalog,
  PLATE,
  PLATE_PARTS,
  STUD,
  TILE_PARTS,
} from './ldraw.js';

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

function buildFloorAndBorder(cat, parent) {
  const M = MATERIALS;

  // Sub-floor foundation along the two visible front edges (p = -2..0)
  for (let p = -2; p < 0; p++) {
    cat.fillStrip(parent, PLATE_PARTS, M.borderDark, 0, 43, 44, 44, p, [8, 6, 4, 2]);
    cat.fillStrip(parent, PLATE_PARTS, M.borderDark, 43, 0, 44, 43, p, [8, 6, 4, 2]);
    cat.fillStrip(parent, PLATE_PARTS, M.subFloor, 0, 0, 43, 1, p, [8, 6, 4, 2]);
    cat.fillStrip(parent, PLATE_PARTS, M.subFloor, 0, 1, 1, 43, p, [8, 6, 4, 2]);
  }

  // Open-front Medium Stone Gray studded border
  cat.fillStrip(parent, PLATE_PARTS, M.borderGray, 2, 43, 44, 44, 0, [8, 6, 4, 2]);
  cat.fillStrip(parent, PLATE_PARTS, M.borderGray, 43, 12, 44, 43, 0, [8, 6, 4, 3, 2, 1]);

  // Hardwood floor planks: smooth LDraw tiles (1x8, 1x6, 1x4, 1x2) laid along Z
  const floorMats = [M.floor1, M.floor2, M.floor3, M.floor4];
  for (let sx = 1; sx < 43; sx++) {
    const zStart = 1;
    const zEnd = sx >= 42 ? 12 : 43;
    const stagger = (sx * 3) % 7;
    const segs = cat.decomposeLengths(zEnd - zStart, [8, 6, 4, 3, 2, 1], stagger);
    segs.forEach(([a, b], idx) => {
      const mat = floorMats[(sx * 5 + idx * 3) % floorMats.length];
      cat.placeSpan(parent, TILE_PARTS, mat, sx, zStart + a, sx + 1, zStart + b, 0);
    });
  }
  // Fill remaining floor strip sx in [42..43], sz in [12..43]
  for (let sx = 42; sx < 43; sx++) {
    const segs = cat.decomposeLengths(31, [8, 6, 4, 3, 2, 1], 3);
    segs.forEach(([a, b], idx) => {
      const mat = floorMats[(sx + idx * 2) % floorMats.length];
      cat.placeSpan(parent, TILE_PARTS, mat, sx, 12 + a, sx + 1, 12 + b, 0);
    });
  }
}

function buildWallsAndWindows(cat, parent) {
  const M = MATERIALS;
  const wallMats = [M.wall1, M.wall2, M.wall3];

  // Left wall with the front-left pilaster, expanded to the 44-stud footprint.
  cat.placeSpan(parent, PLATE_PARTS, M.white, 0, 42, 2, 44, 0);
  cat.placeSpan(parent, PLATE_PARTS, M.white, 0, 42, 2, 44, 1);
  cat.fillStrip(parent, PLATE_PARTS, M.white, 0, 0, 1, 42, 0, [8, 6, 4, 2], 0);
  cat.fillStrip(parent, PLATE_PARTS, M.white, 0, 0, 1, 42, 1, [8, 6, 4, 2], 2);

  for (let course = 0; course < 9; course++) {
    const p = 2 + course * 3;
    cat.placeSpan(parent, BRICK_PARTS, wallMats[course % wallMats.length], 0, 42, 2, 44, p);
    cat.fillStrip(parent, BRICK_PARTS, wallMats, 0, 0, 1, 42, p, [8, 6, 4, 3, 2], course * 2);
  }
  cat.placeSpan(parent, PLATE_PARTS, M.wallTop, 0, 42, 2, 44, 29);
  cat.fillStrip(parent, PLATE_PARTS, M.wallTop, 0, 0, 1, 42, 29, [8, 6, 4, 2], 1);

  // Back wall with windows.
  cat.fillStrip(parent, PLATE_PARTS, M.white, 1, 0, 44, 1, 0, [8, 6, 4, 3, 2, 1], 1);
  cat.fillStrip(parent, PLATE_PARTS, M.white, 1, 0, 44, 1, 1, [8, 6, 4, 3, 2, 1], 3);
  for (let course = 0; course < 9; course++) {
    const p = 2 + course * 3;
    if (course <= 1 || course >= 8) {
      cat.fillStrip(parent, BRICK_PARTS, wallMats, 1, 0, 43, 1, p, [8, 6, 4, 3, 2, 1], course);
    } else {
      cat.fillStrip(parent, BRICK_PARTS, wallMats, 1, 0, 6, 1, p, [4, 3, 2, 1], course);
      cat.fillStrip(parent, BRICK_PARTS, wallMats, 12, 0, 32, 1, p, [6, 4, 3, 2], course + 1);
      cat.fillStrip(parent, BRICK_PARTS, wallMats, 38, 0, 43, 1, p, [8, 6, 4, 3, 2, 1], course + 2);
    }
  }
  cat.fillStrip(parent, PLATE_PARTS, M.wallTop, 1, 0, 44, 1, 29, [8, 6, 4, 3, 2, 1], 2);

  buildWindowAssembly(cat, parent, 6, 12);
  buildWindowAssembly(cat, parent, 32, 38);
  buildCutawayDoorWall(cat, parent);
}

function buildWindowAssembly(cat, parent, sx0, sx1) {
  const M = MATERIALS;
  const cx = (sx0 + sx1) / 2;

  // White windowsill at p = 7..8
  cat.placeSpan(parent, PLATE_PARTS, M.white, sx0, 0.15, sx1, 1.15, 7);
  cat.placeSpan(parent, TILE_PARTS, M.white, sx0, 0.3, sx1, 1.3, 8);

  // White side jambs & top header
  for (let p = 9; p < 25; p += 3) {
    cat.placePart(parent, '3005.dat', M.white, sx0 + 0.35, p, 0.65);
    cat.placePart(parent, '3005.dat', M.white, sx1 - 0.35, p, 0.65);
  }
  cat.placeSpan(parent, PLATE_PARTS, M.white, sx0, 0.15, sx1, 1.15, 25);

  // Dark backdrop behind the windows for a night scene.
  cat.placeSpan(parent, BRICK_PARTS, M.black, sx0 + 0.5, -0.6, sx1 - 0.5, 0.4, 8);
  cat.placeSpan(parent, BRICK_PARTS, M.black, sx0 + 0.5, -0.6, sx1 - 0.5, 0.4, 11);
  cat.placeSpan(parent, BRICK_PARTS, M.black, sx0 + 0.5, -0.6, sx1 - 0.5, 0.4, 14);
  cat.placeSpan(parent, BRICK_PARTS, M.black, sx0 + 0.5, -0.6, sx1 - 0.5, 0.4, 17);
  cat.placeSpan(parent, BRICK_PARTS, M.black, sx0 + 0.5, -0.6, sx1 - 0.5, 0.4, 20);
  cat.placeSpan(parent, BRICK_PARTS, M.black, sx0 + 0.5, -0.6, sx1 - 0.5, 0.4, 23);

  // Thin horizontal white Venetian blind slats with clear gaps showing the blue/green view behind
  for (let p = 9.2; p <= 24.0; p += 1.85) {
    cat.placePart(parent, '6636.dat', M.white, cx, p, 0.72, {
      scale: [0.88, 0.48, 0.45],
    });
  }
  // Two vertical white blind cord lines per window
  for (const cordX of [cx - 1.5, cx + 1.5]) {
    cat.placePart(parent, '30374.dat', M.whiteSoft, cordX, 8.5, 0.85, { scale: [0.55, 1.0, 0.55] });
    cat.placePart(parent, '30374.dat', M.whiteSoft, cordX, 16.0, 0.85, { scale: [0.55, 1.0, 0.55] });
  }

  // Full-height Tan LEGO curtains on left and right of window
  for (const panelStart of [sx0 - 1.85, sx1 - 0.15]) {
    for (let col = 0; col < 2; col++) {
      const colX = panelStart + 0.5 + col * 1.0;
      const colMat = col % 2 === 0 ? M.curtain : M.curtainAlt;
      for (let course = 0; course < 8; course++) {
        cat.placePart(parent, '3062b.dat', colMat, colX, 2 + course * 3, 1.45);
      }
    }
    cat.placePart(parent, '3023b.dat', M.curtain, panelStart + 1.0, 26, 1.45);
  }
}

function buildCutawayDoorWall(cat, parent) {
  const M = MATERIALS;
  const wallMats = [M.wall1, M.wall2, M.wall3];

  // White baseboard at p = 0..2 on both sides of door (sz in [1..4] and sz in [9..12])
  cat.placeSpan(parent, PLATE_PARTS, M.white, 42, 1, 44, 4, 0);
  cat.placeSpan(parent, PLATE_PARTS, M.white, 42, 1, 44, 4, 1);
  cat.placeSpan(parent, PLATE_PARTS, M.white, 42, 9, 44, 12, 0);
  cat.placeSpan(parent, PLATE_PARTS, M.white, 42, 9, 44, 12, 1);

  for (let course = 0; course < 7; course++) {
    const p = 2 + course * 3;
    const mat = wallMats[course % wallMats.length];
    cat.placeSpan(parent, BRICK_PARTS, mat, 42, 1, 44, 4, p);
  }
  cat.placeSpan(parent, BRICK_PARTS, M.wall1, 42, 1, 44, 3, 23);
  cat.placeSpan(parent, BRICK_PARTS, M.wall2, 42, 0, 44, 2, 26);
  cat.placeSpan(parent, PLATE_PARTS, M.wallTop, 42, 0, 44, 2, 29);
  cat.placeSpan(parent, PLATE_PARTS, M.wallTop, 42, 2, 44, 3, 26);
  cat.placeSpan(parent, PLATE_PARTS, M.wallTop, 42, 3, 44, 4, 23);

  for (let course = 0; course < 6; course++) {
    const p = 2 + course * 3;
    const mat = wallMats[(course + 1) % wallMats.length];
    cat.placeSpan(parent, BRICK_PARTS, mat, 42, 9, 44, 12, p);
  }
  cat.placeSpan(parent, PLATE_PARTS, M.wallTop, 42, 8, 44, 12, 20);
  cat.placeSpan(parent, PLATE_PARTS, M.wallTop, 43, 4, 44, 8, 20);

  const doorCenterZ = 6.5;
  cat.placePart(parent, '60596.dat', M.white, 43.45, 1, doorCenterZ, { rotY: Math.PI / 2 });
  cat.placePart(parent, '60616b.dat', M.white, 43.5, 1, doorCenterZ, { rotY: Math.PI / 2 });

  for (let p = 1; p < 19; p += 3) {
    cat.placePart(parent, '3005.dat', M.white, 43.65, p, 4.15);
    cat.placePart(parent, '3005.dat', M.white, 43.65, p, 8.85);
  }
  cat.placePart(parent, '6636.dat', M.white, 43.7, 19, doorCenterZ, { rotY: Math.PI / 2 });

  for (const rowP of [3.4, 8.8, 14.2]) {
    for (const colZ of [doorCenterZ - 0.9, doorCenterZ + 0.9]) {
      cat.placePart(parent, '3069b.dat', M.whiteSoft, 43.68, rowP, colZ, {
        rotY: Math.PI / 2,
        rotZ: -Math.PI / 2,
      });
      cat.placePart(parent, '3070b.dat', M.white, 43.78, rowP + 0.5, colZ, {
        rotY: Math.PI / 2,
        rotZ: -Math.PI / 2,
      });
    }
  }
  cat.placePart(parent, '6141.dat', M.silver, 43.78, 9.2, 8.05, { rotZ: -Math.PI / 2 });
  cat.placePart(parent, '98138.dat', M.silver, 43.95, 9.2, 8.05, { rotZ: -Math.PI / 2 });
}

function buildRug(cat, parent) {
  const M = MATERIALS;
  const sx0 = 4;
  const sx1 = 24;
  const sz0 = 8;
  const sz1 = 26;

  const rugColors = [M.rugTan, M.rugSand, M.rugLightGray, M.rugDarkGray];
  function rugColorAt() {
    return rugColors[Math.floor(Math.random() * rugColors.length)];
  }

  for (let sz = sz0; sz < sz1; sz += 2) {
    for (let sx = sx0; sx < sx1; sx += 2) {
      const c00 = rugColorAt(sx, sz);
      const c10 = rugColorAt(sx + 1, sz);
      const c01 = rugColorAt(sx, sz + 1);
      const c11 = rugColorAt(sx + 1, sz + 1);
      if (c00 === c10 && c00 === c01 && c00 === c11) {
        cat.placeSpan(parent, PLATE_PARTS, c00, sx, sz, sx + 2, sz + 2, 1);
      } else {
        if (c00 === c10) {
          cat.placeSpan(parent, PLATE_PARTS, c00, sx, sz, sx + 2, sz + 1, 1);
        } else {
          cat.placeSpan(parent, PLATE_PARTS, c00, sx, sz, sx + 1, sz + 1, 1);
          cat.placeSpan(parent, PLATE_PARTS, c10, sx + 1, sz, sx + 2, sz + 1, 1);
        }
        if (c01 === c11) {
          cat.placeSpan(parent, PLATE_PARTS, c01, sx, sz + 1, sx + 2, sz + 2, 1);
        } else {
          cat.placeSpan(parent, PLATE_PARTS, c01, sx, sz + 1, sx + 1, sz + 2, 1);
          cat.placeSpan(parent, PLATE_PARTS, c11, sx + 1, sz + 1, sx + 2, sz + 2, 1);
        }
      }
    }
  }
}

function buildBed(cat, parent) {
  const M = MATERIALS;
  // Bed spans sx in [1..18], sz in [11..25] (14 studs wide frame, 12 studs wide mattress sz in [12..24])
  const sx0 = 1;
  const sx1 = 18;
  const sz0 = 11;
  const sz1 = 25;

  cat.placeSpan(parent, BRICK_PARTS, M.black, sx0 + 0.5, sz0 + 0.5, sx0 + 2.5, sz0 + 2.5, 2);
  cat.placeSpan(parent, BRICK_PARTS, M.black, sx0 + 0.5, sz1 - 2.5, sx0 + 2.5, sz1 - 0.5, 2);
  cat.placeSpan(parent, BRICK_PARTS, M.black, sx1 - 2.5, sz0 + 0.5, sx1 - 0.5, sz0 + 2.5, 2);
  cat.placeSpan(parent, BRICK_PARTS, M.black, sx1 - 2.5, sz1 - 2.5, sx1 - 0.5, sz1 - 0.5, 2);

  const frameMats = [M.bedTan, M.bedTanDark];
  cat.fillStrip(parent, BRICK_PARTS, M.bedTanDark, sx0, sz0, sx1, sz0 + 1, 5, [6, 4, 3, 2], 0);
  cat.fillStrip(parent, BRICK_PARTS, M.bedTanDark, sx0, sz1 - 1, sx1, sz1, 5, [6, 4, 3, 2], 2);
  cat.fillStrip(parent, BRICK_PARTS, M.bedTanDark, sx1 - 1, sz0 + 1, sx1, sz1 - 1, 5, [6, 4, 2], 1);
  cat.fillStrip(parent, BRICK_PARTS, M.bedTanDark, sx0, sz0 + 1, sx0 + 1, sz1 - 1, 5, [6, 4, 2], 3);

  cat.fillStrip(parent, TILE_PARTS, M.bedTan, sx0 + 1, sz0, sx1, sz0 + 1, 8, [6, 4, 3, 2], 1);
  cat.fillStrip(parent, TILE_PARTS, M.bedTan, sx0 + 1, sz1 - 1, sx1, sz1, 8, [6, 4, 3, 2], 2);
  cat.fillStrip(parent, TILE_PARTS, M.bedTan, sx1 - 1, sz0 + 1, sx1, sz1 - 1, 8, [6, 4, 2], 0);

  for (let course = 0; course < 3; course++) {
    const p = 8 + course * 3;
    cat.fillStrip(parent, BRICK_PARTS, M.bedTan, sx0, sz0, sx0 + 1, sz1, p, [6, 4, 3, 2], course * 2);
  }
  cat.fillStrip(parent, TILE_PARTS, M.bedTan, sx0, sz0, sx0 + 1, sz1, 17, [6, 4, 2], 1);

  // White Studded Mattress: sx in [2..17], sz in [12..24] (12 studs wide)
  for (let sz = 12; sz < 24; sz += 2) {
    cat.fillStrip(parent, BRICK_PARTS, M.white, 2, sz, 17, sz + 2, 7, [4, 3, 2], sz);
  }
  for (let sz = 12; sz < 24; sz += 4) {
    cat.placeSpan(parent, PLATE_PARTS, M.white, 2, sz, 8, sz + 4, 10);
    cat.placeSpan(parent, PLATE_PARTS, M.white, 8, sz, 14, sz + 4, 10);
    cat.placeSpan(parent, PLATE_PARTS, M.white, 14, sz, 16, sz + 4, 10);
  }
  cat.fillStrip(parent, PLATE_PARTS, M.white, 16, 12, 17, 24, 10, [6, 4, 2], 0);

  // Folded White Top Sheet at sx in [5.5..7.0] (leaving 3 full rows of 12 white mattress studs in sx=[7..10])
  for (let sz = 12; sz < 24; sz += 2) {
    cat.placeSpan(parent, TILE_PARTS, M.whiteSoft, 5.5, sz, 6.5, sz + 2, 11);
    cat.placeSpan(parent, TILE_PARTS, M.white, 6.5, sz, 7.0, sz + 2, 11);
  }
  cat.placePart(parent, '11477.dat', M.whiteSoft, 6.25, 10.0, 11.6, { rotY: Math.PI });
  cat.placePart(parent, '11477.dat', M.whiteSoft, 6.25, 10.0, 24.4, { rotY: 0 });
  cat.placeSpan(parent, BRICK_PARTS, M.whiteSoft, 5.5, 11.2, 6.5, 12.0, 7.5);
  cat.placeSpan(parent, BRICK_PARTS, M.whiteSoft, 5.5, 24.0, 6.5, 24.8, 7.5);

  // Two Back White Pillows + Two Smaller Front Geometric Relief Pillows
  for (const centerZ of [15.0, 21.0]) {
    const backPillow = new THREE.Group();
    backPillow.position.set((3.0 - 16) * STUD, 11.2 * PLATE, (centerZ - 16) * STUD);
    backPillow.rotation.z = -0.22;
    parent.add(backPillow);

    for (let zOff = -2.5; zOff < 2.0; zOff += 1.0) {
      cat.placePart(backPillow, '3004.dat', M.white, 0, 0, zOff + 0.5, { localCoords: true });
      cat.placePart(backPillow, '11477.dat', M.white, 0, 3, zOff + 0.5, {
        rotY: Math.PI / 2,
        localCoords: true,
      });
    }

    const frontPillow = new THREE.Group();
    frontPillow.position.set((4.65 - 16) * STUD, 11.15 * PLATE, (centerZ - 16) * STUD);
    frontPillow.rotation.z = -0.38;
    parent.add(frontPillow);

    // 2x4 stud pillow base
    cat.placePart(frontPillow, '3020.dat', M.whiteSoft, 0, 0, 0, {
      rotY: Math.PI / 2,
      localCoords: true,
    });
    cat.placePart(frontPillow, '3020.dat', M.pillowGray, 0, 1, 0, {
      rotY: Math.PI / 2,
      localCoords: true,
    });

    // Intricate 1x1 & 1x2 light-gray and white Greek-key relief across the front pillow
    const reliefPattern = [
      [-0.5, -1.5, '3024.dat', M.white],
      [-0.5, -0.5, '3070b.dat', M.pillowGray],
      [-0.5, 0.5, '3024.dat', M.white],
      [-0.5, 1.5, '3070b.dat', M.pillowGray],
      [0.5, -1.5, '3070b.dat', M.pillowGray],
      [0.5, -0.5, '3024.dat', M.white],
      [0.5, 0.5, '3070b.dat', M.pillowGray],
      [0.5, 1.5, '3024.dat', M.white],
    ];
    for (const [lx, lz, part, pMat] of reliefPattern) {
      cat.placePart(frontPillow, part, pMat, lx, 2, lz, { localCoords: true });
    }
  }

  // Subtle Dark-Charcoal & Black Checkered Blanket (sx in [10..16], sz in [11.2..24.8])
  // Leaves 3 rows of 12 white mattress studs in sx=[7..10] and 1 row in sx=[16..17]
  for (let col = 0; col < 6; col++) {
    const bx = 10 + col;
    for (let row = 0; row < 12; row++) {
      const bz = 12 + row;
      const checkMat = (col + row) % 2 === 0 ? M.blanketBlack : M.blanketDark;
      cat.placeSpan(parent, PLATE_PARTS, checkMat, bx, bz, bx + 1, bz + 1, 11);
      cat.placeSpan(parent, TILE_PARTS, checkMat, bx, bz, bx + 1, bz + 1, 12);
    }

    // Curved blanket edge & vertical side drop on -Z (sz = 11..12) and +Z (sz = 24..25)
    const matNeg = col % 2 === 0 ? M.blanketDark : M.blanketBlack;
    const matPos = col % 2 === 0 ? M.blanketBlack : M.blanketDark;
    cat.placePart(parent, '11477.dat', matNeg, bx + 0.5, 11.0, 11.75, { rotY: Math.PI });
    cat.placePart(parent, '11477.dat', matPos, bx + 0.5, 11.0, 24.25, { rotY: 0 });

    // Solid vertical blanket drop along both sides of the mattress (p = 6..11)
    for (let p = 6; p < 11; p++) {
      const sideDropNeg = (col + Math.floor((p - 6) / 2)) % 2 === 0 ? M.blanketBlack : M.blanketDark;
      const sideDropPos = (col + Math.floor((p - 6) / 2)) % 2 === 0 ? M.blanketDark : M.blanketBlack;
      cat.placePart(parent, '3024.dat', sideDropNeg, bx + 0.5, p, 11.35);
      cat.placePart(parent, '3024.dat', sideDropPos, bx + 0.5, p, 24.65);
    }
  }
}

function buildNightstandAndLamp(cat, parent, sx0, sz0) {
  const M = MATERIALS;
  const sx1 = sx0 + 4;
  const sz1 = sz0 + 4;
  const cx = (sx0 + sx1) / 2;
  const cz = (sz0 + sz1) / 2;

  for (const lx of [sx0 + 0.5, sx1 - 0.5]) {
    for (const lz of [sz0 + 0.5, sz1 - 0.5]) {
      cat.placePart(parent, '3024.dat', M.darkGray, lx, 1, lz);
      cat.placePart(parent, '3024.dat', M.medGray, lx, 2, lz);
    }
  }

  cat.placeSpan(parent, PLATE_PARTS, M.medGray, sx0, sz0, sx1, sz1, 3);

  cat.placeSpan(parent, BRICK_PARTS, M.medGray, sx0, sz0, sx1, sz0 + 1, 4);
  cat.placeSpan(parent, BRICK_PARTS, M.medGray, sx0, sz1 - 1, sx1, sz1, 4);
  cat.placeSpan(parent, BRICK_PARTS, M.darkGray, sx0, sz0 + 1, sx0 + 1, sz1 - 1, 4);
  cat.placeSpan(parent, PLATE_PARTS, M.lightGray, sx0 + 1.5, sz0 + 1, sx0 + 3.5, sz0 + 3, 4);
  cat.placeSpan(parent, TILE_PARTS, M.darkGray, sx0 + 1.5, sz0 + 1, sx0 + 3.5, sz0 + 3, 5);

  cat.placeSpan(parent, PLATE_PARTS, M.medGray, sx0, sz0, sx1, sz1, 7);

  // Upper drawer with clean horizontal recessed shadow seam and +X round stud knob
  cat.placeSpan(parent, BRICK_PARTS, M.medGray, sx0, sz0, sx0 + 3, sz1, 8);
  cat.placeSpan(parent, PLATE_PARTS, M.charcoal, sx1 - 1, sz0, sx1, sz1, 8);
  cat.placeSpan(parent, PLATE_PARTS, M.medGray, sx1 - 0.85, sz0 + 0.2, sx1 + 0.15, sz1 - 0.2, 9);
  cat.placeSpan(parent, TILE_PARTS, M.medGray, sx1 - 0.85, sz0 + 0.2, sx1 + 0.15, sz1 - 0.2, 10);
  cat.placePart(parent, '6141.dat', M.lightGray, sx1 + 0.22, 9.6, cz, {
    rotZ: -Math.PI / 2,
  });

  // Overhanging smooth 2x2 tiled top
  cat.placeSpan(parent, PLATE_PARTS, M.medGray, sx0, sz0, sx1, sz1, 11);
  for (const tx of [sx0, sx0 + 2]) {
    for (const tz of [sz0, sz0 + 2]) {
      cat.placeSpan(parent, TILE_PARTS, M.medGray, tx, tz, tx + 2, tz + 2, 12);
    }
  }

  // Glowing Bedside Lamp
  const lampX = cx - 0.35;
  const lampZ = cz;
  cat.placePart(parent, '4032a.dat', M.darkGray, lampX, 13, lampZ);
  cat.placePart(parent, '14769.dat', M.medGray, lampX, 13.8, lampZ);
  cat.placePart(parent, '3062b.dat', M.black, lampX, 14.5, lampZ);

  cat.placePart(parent, '4032a.dat', M.lampShade, lampX, 16.8, lampZ, { scale: [1.18, 1.0, 1.18] });
  cat.placePart(parent, '3941.dat', M.lampShade, lampX, 17.6, lampZ, { scale: [1.18, 1.12, 1.18] });
  cat.placePart(parent, '14769.dat', M.lampCore, lampX, 20.8, lampZ, { scale: [1.14, 1.0, 1.14] });
  cat.placePart(parent, '6141.dat', M.lampCore, lampX, 21.5, lampZ);

  // Small Nightstand Top Accessories (black 1x2 sloped clock/box + white 1x1 piece)
  cat.placePart(parent, '3023b.dat', M.black, sx1 - 0.75, 13, sz0 + 0.9, { rotY: Math.PI / 2 });
  cat.placePart(parent, '85984.dat', M.black, sx1 - 0.75, 14, sz0 + 0.9, { rotY: Math.PI / 2 });
  cat.placePart(parent, '3024.dat', M.white, sx1 - 1.55, 13, sz0 + 0.75);
  cat.placePart(parent, '3070b.dat', M.white, sx1 - 1.55, 14, sz0 + 0.75);
}

function buildCornerPlantAndStools(cat, parent) {
  const M = MATERIALS;

  // Tall White Round Plant Stand tucked in the top corner (cx = 3.5, cz = 3.3)
  const px = 3.5;
  const pz = 3.3;
  cat.placePart(parent, '11833.dat', M.black, px, 1, pz, { scale: [0.92, 1.0, 0.92] });
  for (const [dx, dz] of [
    [-0.95, -0.95],
    [0.95, -0.95],
    [-0.95, 0.95],
    [0.95, 0.95],
  ]) {
    cat.placePart(parent, '30374.dat', M.black, px + dx, 1.5, pz + dz);
  }
  cat.placePart(parent, '60474.dat', M.whiteSoft, px, 10, pz, { scale: [0.95, 1.0, 0.95] });
  cat.placePart(parent, '60474.dat', M.white, px, 11, pz, { scale: [0.95, 1.0, 0.95] });

  // Dark-Blue Cylindrical Pot on top of the White Stand
  cat.placePart(parent, '4740.dat', M.potBlue, px, 12, pz, { scale: [0.98, 1.0, 0.98] });
  cat.placePart(parent, '3941.dat', M.potBlue, px, 12.8, pz, { scale: [1.02, 1.0, 1.02] });
  cat.placePart(parent, '3941.dat', M.potBlue, px, 15.5, pz, { scale: [1.05, 0.95, 1.05] });
  cat.placePart(parent, '4032a.dat', M.soilBrown, px, 18.0, pz);

  // Compact, organic green LEGO plant leaves arching from the pot
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3 + 0.3;
    const leafMat = i % 2 === 0 ? M.leafGreen : M.leafBright;
    cat.placePart(parent, '37695.dat', leafMat, px + Math.cos(angle) * 0.25, 18.6, pz + Math.sin(angle) * 0.25, {
      rotY: -angle + Math.PI / 2,
      rotX: 0.48,
      scale: 1.02,
    });
    cat.placePart(parent, '32607.dat', leafMat, px + Math.cos(angle + 0.4) * 0.42, 18.5, pz + Math.sin(angle + 0.4) * 0.42, {
      rotY: -angle,
      rotX: 0.38,
      scale: 1.15,
    });
  }
  for (let i = 0; i < 3; i++) {
    const angle = (i * 2 * Math.PI) / 3 + 0.2;
    cat.placePart(parent, '32607.dat', M.leafBright, px + Math.cos(angle) * 0.18, 19.6, pz + Math.sin(angle) * 0.18, {
      rotY: angle,
      rotX: 0.15,
      scale: 1.1,
    });
  }

}

function buildFramedWallArt(cat, parent) {
  const M = MATERIALS;
  const artGroup = new THREE.Group();
  artGroup.position.set((22.0 - 16) * STUD, 18.5 * PLATE, (1.18 - 16) * STUD);
  artGroup.rotation.x = Math.PI / 2;
  parent.add(artGroup);

  // Full 6x6 white backing plate & inner white mat so zero wall gaps show through
  cat.placeSpan(artGroup, PLATE_PARTS, M.white, -3, -3, 3, 3, 0, { localCoords: true });
  cat.placeSpan(artGroup, TILE_PARTS, M.white, -2, -2, 2, 2, 1, { localCoords: true });

  // Outer Reddish-Brown / Nougat frame border around [-3..3] x [-3..3]
  cat.placeSpan(artGroup, TILE_PARTS, M.frameBrown, -3, -3, 2, -2, 1, { localCoords: true });
  cat.placeSpan(artGroup, TILE_PARTS, M.frameBrown, 2, -3, 3, 2, 1, { localCoords: true });
  cat.placeSpan(artGroup, TILE_PARTS, M.frameBrown, -2, 2, 3, 3, 1, { localCoords: true });
  cat.placeSpan(artGroup, TILE_PARTS, M.frameBrown, -3, -2, -2, 3, 1, { localCoords: true });

  // 3x3 abstract geometric relief mosaic in the center of the white mat
  const mosaic = [
    [-1.0, -1.0, '3070b.dat', M.artGold, 0],
    [0.0, -1.0, '54200.dat', M.white, 0],
    [1.0, -1.0, '3070b.dat', M.lightGray, 0],
    [-1.0, 0.0, '54200.dat', M.artGold, Math.PI / 2],
    [0.0, 0.0, '3070b.dat', M.darkGray, 0],
    [1.0, 0.0, '54200.dat', M.charcoal, Math.PI],
    [-1.0, 1.0, '3070b.dat', M.white, 0],
    [0.0, 1.0, '3070b.dat', M.black, 0],
    [1.0, 1.0, '54200.dat', M.lightGray, -Math.PI / 2],
  ];
  for (const [mx, mz, part, mat, rotY] of mosaic) {
    cat.placePart(artGroup, part, mat, mx, 2, mz, { rotY, localCoords: true });
  }
}

function buildArmchair(cat, parent) {
  const M = MATERIALS;

  // Angled Beige Armchair (cx = 22.0, cz = 8.5, rotated -30 deg toward the room)
  const chair = new THREE.Group();
  chair.position.set((22.0 - 16) * STUD, 1 * PLATE, (8.5 - 16) * STUD);
  chair.rotation.y = -0.52;
  parent.add(chair);

  // Beige base feet (p = 0..1)
  cat.placeSpan(chair, PLATE_PARTS, M.chairBeigeDark, -2, -2, 2, 2, 0, { localCoords: true });

  // Solid Beige Lower Chair Base (X in [-2.5..2.5], Z in [-2..2], p = 1..4)
  cat.placeSpan(chair, BRICK_PARTS, M.chairBeige, -2.5, -2, 2.5, 2, 1, { localCoords: true });

  // Smooth Beige Tiled Seat Cushion (X in [-1.5..1.5], Z in [-1..2], p = 4..5)
  cat.placeSpan(chair, TILE_PARTS, M.chairBeigeLight, -1.5, -1, 0.5, 1, 4, { localCoords: true });
  cat.placeSpan(chair, TILE_PARTS, M.chairBeigeLight, 0.5, -1, 1.5, 1, 4, { localCoords: true });
  cat.placeSpan(chair, TILE_PARTS, M.chairBeigeDark, -1.5, 1, 1.5, 2, 4, { localCoords: true });

  // Left Armrest (X in [-2.5..-1.5], Z in [-2..2], p = 4..8)
  cat.placeSpan(chair, BRICK_PARTS, M.chairBeige, -2.5, -2, -1.5, 2, 4, { localCoords: true });
  cat.placeSpan(chair, TILE_PARTS, M.chairBeigeLight, -2.5, -2, -1.5, 2, 7, { localCoords: true });

  // Right Armrest (X in [1.5..2.5], Z in [-2..2], p = 4..8)
  cat.placeSpan(chair, BRICK_PARTS, M.chairBeige, 1.5, -2, 2.5, 2, 4, { localCoords: true });
  cat.placeSpan(chair, TILE_PARTS, M.chairBeigeLight, 1.5, -2, 2.5, 2, 7, { localCoords: true });

  // Backrest (X in [-2.5..2.5], Z in [-2..-1], p = 4..10)
  cat.placeSpan(chair, BRICK_PARTS, M.chairBeige, -2.5, -2, 2.5, -1, 4, { localCoords: true });
  cat.placeSpan(chair, BRICK_PARTS, M.chairBeige, -2.5, -2, 2.5, -1, 7, { localCoords: true });
  cat.placeSpan(chair, TILE_PARTS, M.chairBeigeDark, -2.5, -2, 2.5, -1, 10, { localCoords: true });

}

function buildTallDresser(cat, parent) {
  const M = MATERIALS;
  const sx0 = 32;
  const sx1 = 36;
  const sz0 = 1;
  const sz1 = 9;
  const cx = (sx0 + sx1) / 2;

  cat.placeSpan(parent, PLATE_PARTS, M.darkGray, sx0, sz0, sx1, sz0 + 2, 1);
  cat.placeSpan(parent, PLATE_PARTS, M.darkGray, sx0, sz0, sx1, sz0 + 2, 2);
  cat.placeSpan(parent, PLATE_PARTS, M.darkGray, sx0, sz1 - 2, sx0 + 1, sz1, 1);
  cat.placeSpan(parent, PLATE_PARTS, M.darkGray, sx0, sz1 - 2, sx0 + 1, sz1, 2);
  cat.placeSpan(parent, PLATE_PARTS, M.darkGray, sx1 - 1, sz1 - 2, sx1, sz1, 1);
  cat.placeSpan(parent, PLATE_PARTS, M.darkGray, sx1 - 1, sz1 - 2, sx1, sz1, 2);
  cat.placeSpan(parent, PLATE_PARTS, M.charcoal, sx0 + 1, sz0 + 2, sx1, sz1 - 1, 1);
  cat.placeSpan(parent, PLATE_PARTS, M.charcoal, sx0 + 1, sz0 + 2, sx1, sz1 - 1, 2);

  for (let drawer = 0; drawer < 5; drawer++) {
    const p = 3 + drawer * 3;
    cat.placeSpan(parent, BRICK_PARTS, M.darkGray, sx0, sz0, sx0 + 2, sz1 - 1, p);
    cat.placeSpan(parent, BRICK_PARTS, M.darkGray, sx0 + 2, sz0, sx1, sz1 - 1, p);

    cat.placeSpan(parent, PLATE_PARTS, M.charcoal, sx0, sz1 - 1, sx1, sz1, p);
    cat.placeSpan(parent, PLATE_PARTS, M.darkGray, sx0, sz1 - 1, sx1, sz1, p + 1);
    cat.placeSpan(parent, PLATE_PARTS, M.medGray, sx0, sz1 - 1, sx1, sz1, p + 2);

    cat.placePart(parent, '2431.dat', M.medGray, cx, p + 1.5, sz1 + 0.08, {
      rotX: Math.PI / 2,
    });
    cat.placePart(parent, '6141.dat', M.lightGray, cx, p + 1.5, sz1 + 0.25, {
      rotX: Math.PI / 2,
    });
  }

  cat.placeSpan(parent, PLATE_PARTS, M.darkGray, sx0, sz0, sx1, sz0 + 4, 18);
  cat.placeSpan(parent, PLATE_PARTS, M.darkGray, sx0, sz0 + 4, sx1, sz1, 18);
  for (let tx = sx0; tx < sx1; tx += 2) {
    for (let tz = sz0; tz < sz1; tz += 2) {
      cat.placeSpan(parent, TILE_PARTS, M.medGray, tx, tz, tx + 2, tz + 2, 19);
    }
  }

}

function addWarmRoomLights(room) {
  for (const sz of [8, 38]) {
    const position = new THREE.Vector3((2.85 - 16) * STUD, 21.15 * PLATE, (sz - 16) * STUD);

    const bulb = new THREE.PointLight('#ff9d2e', 3.5, 3.5, 1.7);
    bulb.position.copy(position);
    bulb.castShadow = false;
    room.add(bulb);

    const wash = new THREE.PointLight('#ffb84d', 1.5, 3.5, 1.8);
    wash.position.copy(position);
    room.add(wash);
  }
}

export async function createRoom(bundleData = null) {
  const catalog = new LDrawCatalog();
  await catalog.init(bundleData);

  const rawGroup = new THREE.Group();
  buildFloorAndBorder(catalog, rawGroup);
  buildWallsAndWindows(catalog, rawGroup);

  const buildProp = (builder, dx = 0, dz = 0) => {
    const group = new THREE.Group();
    group.position.set(dx * STUD, 0, dz * STUD);
    rawGroup.add(group);
    builder(group);
  };
  buildProp((group) => buildRug(catalog, group), 2, 5);
  buildProp((group) => buildBed(catalog, group), 1, 4.5);
  buildProp((group) => buildNightstandAndLamp(catalog, group, 1.2, 6));
  buildProp((group) => buildNightstandAndLamp(catalog, group, 1.2, 36));
  buildProp((group) => buildCornerPlantAndStools(catalog, group), 4, 1);
  buildFramedWallArt(catalog, rawGroup);
  buildProp((group) => buildArmchair(catalog, group));
  buildProp((group) => buildTallDresser(catalog, group), 7, 13);

  const room = catalog.mergeStaticGroup(rawGroup);
  addWarmRoomLights(room);
  return room;
}
