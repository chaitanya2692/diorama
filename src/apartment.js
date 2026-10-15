import * as THREE from 'three';
import { STUD } from './ldraw.js';
import { buildBedroom } from './rooms/bedroom.js';

// Builders return merged, room-local groups. Place them only after construction.
export function createApartment(catalog, placements = [{ build: buildBedroom, x: -16, z: -16, rotationY: 0 }]) {
  const apartment = new THREE.Group();
  for (const { build, x = 0, z = 0, rotationY = 0 } of placements) {
    const room = build(catalog);
    room.position.set(x * STUD, 0, z * STUD);
    room.rotation.y = rotationY;
    apartment.add(room);
  }
  return apartment;
}
