import * as THREE from 'three';
import { BRICK_PARTS, PLATE, PLATE_PARTS, STUD, TILE_PARTS } from '../ldraw.js';
import { MATERIALS } from './materials.js';

function tileTop(cat, parent, material, sx0, sz0, sx1, sz1, p) {
  for (let tx = sx0; tx < sx1; tx += 2) {
    for (let tz = sz0; tz < sz1; tz += 2) {
      cat.placeSpan(parent, TILE_PARTS, material, tx, tz, tx + 2, tz + 2, p);
    }
  }
}

export function buildRug(cat, parent) {
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

export function buildBed(cat, parent) {
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
    backPillow.position.set(3.0 * STUD, 11.2 * PLATE, centerZ * STUD);
    backPillow.rotation.z = -0.22;
    parent.add(backPillow);

    for (let zOff = -2.5; zOff < 2.0; zOff += 1.0) {
      cat.placePart(backPillow, '3004.dat', M.white, 0, 0, zOff + 0.5);
      cat.placePart(backPillow, '11477.dat', M.white, 0, 3, zOff + 0.5, { rotY: Math.PI / 2 });
    }

    const frontPillow = new THREE.Group();
    frontPillow.position.set(4.65 * STUD, 11.15 * PLATE, centerZ * STUD);
    frontPillow.rotation.z = -0.38;
    parent.add(frontPillow);

    // 2x4 stud pillow base
    cat.placePart(frontPillow, '3020.dat', M.whiteSoft, 0, 0, 0, { rotY: Math.PI / 2 });
    cat.placePart(frontPillow, '3020.dat', M.pillowGray, 0, 1, 0, { rotY: Math.PI / 2 });

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
      cat.placePart(frontPillow, part, pMat, lx, 2, lz);
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

export function buildNightstandAndLamp(cat, parent, sx0, sz0) {
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
  tileTop(cat, parent, M.medGray, sx0, sz0, sx1, sz1, 12);

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

export function buildCornerPlantAndStools(cat, parent) {
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

export function buildFramedWallArt(cat, parent) {
  const M = MATERIALS;
  const artGroup = new THREE.Group();
  artGroup.position.set(22.0 * STUD, 18.5 * PLATE, 1.18 * STUD);
  artGroup.rotation.x = Math.PI / 2;
  parent.add(artGroup);

  // Full 6x6 white backing plate & inner white mat so zero wall gaps show through
  cat.placeSpan(artGroup, PLATE_PARTS, M.white, -3, -3, 3, 3, 0);
  cat.placeSpan(artGroup, TILE_PARTS, M.white, -2, -2, 2, 2, 1);

  // Outer Reddish-Brown / Nougat frame border around [-3..3] x [-3..3]
  cat.placeSpan(artGroup, TILE_PARTS, M.frameBrown, -3, -3, 2, -2, 1);
  cat.placeSpan(artGroup, TILE_PARTS, M.frameBrown, 2, -3, 3, 2, 1);
  cat.placeSpan(artGroup, TILE_PARTS, M.frameBrown, -2, 2, 3, 3, 1);
  cat.placeSpan(artGroup, TILE_PARTS, M.frameBrown, -3, -2, -2, 3, 1);

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
    cat.placePart(artGroup, part, mat, mx, 2, mz, { rotY });
  }
}

export function buildArmchair(cat, parent) {
  const M = MATERIALS;

  // Angled Beige Armchair (cx = 22.0, cz = 8.5, rotated -30 deg toward the room)
  const chair = new THREE.Group();
  chair.position.set(22.0 * STUD, 1 * PLATE, 8.5 * STUD);
  chair.rotation.y = -0.52;
  parent.add(chair);

  // Beige base feet (p = 0..1)
  cat.placeSpan(chair, PLATE_PARTS, M.chairBeigeDark, -2, -2, 2, 2, 0);

  // Solid Beige Lower Chair Base (X in [-2.5..2.5], Z in [-2..2], p = 1..4)
  cat.placeSpan(chair, BRICK_PARTS, M.chairBeige, -2.5, -2, 2.5, 2, 1);

  // Smooth Beige Tiled Seat Cushion (X in [-1.5..1.5], Z in [-1..2], p = 4..5)
  cat.placeSpan(chair, TILE_PARTS, M.chairBeigeLight, -1.5, -1, 0.5, 1, 4);
  cat.placeSpan(chair, TILE_PARTS, M.chairBeigeLight, 0.5, -1, 1.5, 1, 4);
  cat.placeSpan(chair, TILE_PARTS, M.chairBeigeDark, -1.5, 1, 1.5, 2, 4);

  // Left Armrest (X in [-2.5..-1.5], Z in [-2..2], p = 4..8)
  cat.placeSpan(chair, BRICK_PARTS, M.chairBeige, -2.5, -2, -1.5, 2, 4);
  cat.placeSpan(chair, TILE_PARTS, M.chairBeigeLight, -2.5, -2, -1.5, 2, 7);

  // Right Armrest (X in [1.5..2.5], Z in [-2..2], p = 4..8)
  cat.placeSpan(chair, BRICK_PARTS, M.chairBeige, 1.5, -2, 2.5, 2, 4);
  cat.placeSpan(chair, TILE_PARTS, M.chairBeigeLight, 1.5, -2, 2.5, 2, 7);

  // Backrest (X in [-2.5..2.5], Z in [-2..-1], p = 4..10)
  cat.placeSpan(chair, BRICK_PARTS, M.chairBeige, -2.5, -2, 2.5, -1, 4);
  cat.placeSpan(chair, BRICK_PARTS, M.chairBeige, -2.5, -2, 2.5, -1, 7);
  cat.placeSpan(chair, TILE_PARTS, M.chairBeigeDark, -2.5, -2, 2.5, -1, 10);

}

export function buildTallDresser(cat, parent) {
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
  tileTop(cat, parent, M.medGray, sx0, sz0, sx1, sz1, 19);

}
