import * as THREE from 'three';
import { BRICK_PARTS, PLATE_PARTS, TILE_PARTS } from '../ldraw.js';
import {
  buildBed,
  buildBedsideTable,
  buildPillow,
  buildRadiator,
  buildSillAppliance,
  buildSillPlant,
} from './furniture.js';
import { addBlock, addCourse } from './geometry.js';
import { MATERIALS } from './materials.js';

function buildFloorAndBorder(cat, parent) {
  const M = MATERIALS;
  const palette = [M.floor1, M.floor2, M.floor3, M.floor4];
  for (const [x0, z0, x1, z1] of [[0, 0, 280, 453], [40, -10, 280, 0]]) {
    addCourse(cat, parent, PLATE_PARTS, M.subFloor, x0, z0, x1, z1, -8, 4);
    for (let x = x0; x < x1; x += 10) {
      let z = z0;
      let i = 0;
      const row = x / 10;
      while (z < z1) {
        const length = i === 0 ? 20 + (row % 4) * 20 : [80, 60, 40, 20, 10][(row + i) % 5];
        const end = Math.min(z1, z + length);
        addCourse(cat, parent, TILE_PARTS, palette[(row + i * 3) % 4], x, z, x + 10, end, -4, 4);
        z = end;
        i++;
      }
    }
  }
}

function buildWallsAndWindows(cat, parent) {
  const M = MATERIALS;
  // Each rectangle is a solid wall run; no geometry crosses an opening.
  const runs = [
    [280, -10, 295, 468, 0, 250],
    [0, 453, 280, 468, 0, 90], [0, 453, 280, 468, 220, 250],
    [0, 453, 32, 468, 90, 220], [196, 453, 280, 468, 90, 220],
    [-10, 0, 0, 36, 0, 250], [-10, 111, 0, 131, 0, 250],
    [-10, 131, 0, 453, 0, 12], [-10, 36, 0, 111, 210, 250],
    [-10, -10, 40, 0, 0, 12],
    [40, -20, 94, -10, 0, 12], [94, -20, 106, -10, 0, 250],
    [172, -20, 184, -10, 0, 250], [184, -20, 280, -10, 0, 12],
    [106, -20, 172, -10, 210, 250],
  ];
  for (const [x0, z0, x1, z1, y0, y1] of runs) {
    for (let y = y0, course = 0; y < y1; y += 12, course++) {
      const height = Math.min(12, y1 - y);
      const material = y + height === y1 ? M.wallTop : course % 3 === 1 ? M.wall2 : M.wall1;
      addCourse(cat, parent, BRICK_PARTS, material, x0, z0, x1, z1, y, height);
    }
  }
  for (const bounds of [
    [278, -10, 280, 453], [0, 451, 280, 453],
    [0, 0, 2, 36], [0, 111, 2, 453], [-10, 0, 40, 2],
    [40, -10, 106, -8], [172, -10, 280, -8],
  ]) addBlock(cat, parent, M.white, ...bounds, 0, 8);
}

function buildWindowAssembly(cat, parent) {
  const M = MATERIALS;
  for (const bounds of [
    [32, 453, 36, 459, 90, 220], [192, 453, 196, 459, 90, 220],
    [36, 453, 192, 459, 90, 94], [36, 453, 192, 459, 216, 220],
  ]) addBlock(cat, parent, M.white, ...bounds);
  addCourse(cat, parent, PLATE_PARTS, M.sill, 29, 433, 199, 459, 86, 2);
  addCourse(cat, parent, TILE_PARTS, M.sillTop, 29, 433, 199, 459, 88, 2);
}

function buildEntranceTrim(cat, parent) {
  const M = MATERIALS;
  for (const bounds of [
    [0, 30, 3, 36, 0, 210], [0, 111, 3, 117, 0, 210],
    [0, 30, 3, 117, 210, 216],
    [-10, 35, 0, 36, 0, 210], [-10, 111, 0, 112, 0, 210],
    [-10, 36, 0, 111, 210, 211],
  ]) addBlock(cat, parent, M.white, ...bounds);
}

function buildWardrobeTrim(cat, parent) {
  const M = MATERIALS;
  for (const bounds of [
    [100, -10, 106, -7, 0, 210], [172, -10, 178, -7, 0, 210],
    [100, -10, 178, -7, 210, 216],
    [105, -20, 106, -10, 0, 210], [172, -20, 173, -10, 0, 210],
    [106, -20, 172, -10, 210, 211],
  ]) addBlock(cat, parent, M.white, ...bounds);
}

export function buildBedroom(catalog) {
  const room = new THREE.Group();
  room.name = 'master-bedroom';
  for (const [name, builder] of [
    ['shell', buildWallsAndWindows], ['floor', buildFloorAndBorder],
    ['window', buildWindowAssembly], ['radiator', buildRadiator],
    ['bed', buildBed], ['pillow', buildPillow],
    ['table-north', (cat, parent) => buildBedsideTable(cat, parent, 105)],
    ['table-window', (cat, parent) => buildBedsideTable(cat, parent, 345)],
    ['sill-appliance', buildSillAppliance], ['sill-plant', buildSillPlant],
    ['entrance-trim', buildEntranceTrim], ['wardrobe-trim', buildWardrobeTrim],
  ]) {
    const raw = new THREE.Group();
    builder(catalog, raw);
    const assembly = catalog.mergeStaticGroup(raw);
    assembly.name = name;
    room.add(assembly);
  }
  return room;
}
