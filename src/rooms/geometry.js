import * as THREE from 'three';
import { BRICK_PARTS, STUD } from '../ldraw.js';

// Survey coordinates: X east, Z south; one stud represents 10 cm.
export const CM = STUD / 10;

export function addCourse(cat, parent, table, material, x0, z0, x1, z1, y0, heightCm) {
  const nx = Math.max(1, Math.round((x1 - x0) / 10));
  const nz = Math.max(1, Math.round((z1 - z0) / 10));
  const group = new THREE.Group();
  cat.placeSpan(group, table, material, 0, 0, nx, nz, 0);
  group.position.set(x0 * CM, y0 * CM, z0 * CM);
  group.scale.set(
    (x1 - x0) / (10 * nx),
    heightCm / (table === BRICK_PARTS ? 12 : 4),
    (z1 - z0) / (10 * nz),
  );
  parent.add(group);
  return group;
}

export function addBlock(cat, parent, material, x0, z0, x1, z1, y0, y1) {
  for (let y = y0; y < y1; y += 12) {
    addCourse(cat, parent, BRICK_PARTS, material, x0, z0, x1, z1, y, Math.min(12, y1 - y));
  }
}
