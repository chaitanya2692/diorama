import * as THREE from 'three';
import { BRICK_PARTS, PLATE, PLATE_PARTS, STUD, TILE_PARTS } from '../ldraw.js';
import {
  buildArmchair,
  buildBed,
  buildCornerPlantAndStools,
  buildFramedWallArt,
  buildNightstandAndLamp,
  buildRug,
  buildTallDresser,
} from './furniture.js';
import { MATERIALS } from './materials.js';

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

function addWarmRoomLights(room) {
  for (const sz of [8, 38]) {
    const position = new THREE.Vector3(2.85 * STUD, 21.15 * PLATE, sz * STUD);

    const bulb = new THREE.PointLight('#ff9d2e', 3.5, 3.5, 1.7);
    bulb.position.copy(position);
    bulb.castShadow = true;
    room.add(bulb);

    const wash = new THREE.PointLight('#ffb84d', 1.5, 3.5, 1.8);
    wash.position.copy(position);
    room.add(wash);
  }
}

export function buildBedroom(catalog) {
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
