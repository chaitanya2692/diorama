import * as THREE from 'three';
import { PLATE_PARTS, TILE_PARTS } from '../ldraw.js';
import { CM, addBlock, addCourse } from './geometry.js';
import { MATERIALS } from './materials.js';

export function buildRadiator(cat, parent) {
  const M = MATERIALS;
  addBlock(cat, parent, M.radiator, 45, 445, 185, 451, 15, 73);
  addCourse(cat, parent, TILE_PARTS, M.radiator, 45, 443, 185, 451, 73, 2);
  const face = new THREE.Group();
  face.position.set(45 * CM, 15 * CM, 443 * CM);
  face.rotation.x = -Math.PI / 2;
  parent.add(face);
  for (let col = 0; col < 14; col++) {
    for (let row = 0; row < 3; row++) {
      cat.placePart(face, '2412b.dat', M.radiator, col + 0.5, 0, row * 2 + 1, {
        rotY: Math.PI / 2, scale: [1, 0.5, 1],
      });
    }
  }
  for (const x of [42, 188]) {
    cat.placePart(parent, '6141.dat', M.silver, x / 10, 65 / 4, 447 / 10, {
      rotZ: Math.PI / 2, scale: 0.5,
    });
    cat.placePart(parent, '98138.dat', M.black, (x - 2) / 10, 65 / 4, 447 / 10, {
      rotZ: Math.PI / 2, scale: 0.4,
    });
  }
}

export function buildBed(cat, parent) {
  const M = MATERIALS;
  for (const x of [80, 265]) {
    for (const z of [190, 330]) {
      cat.placePart(parent, '3941.dat', M.tan, x / 10, 0, z / 10, {
        scale: [0.4, 10 / 14, 0.4],
      });
    }
  }
  addBlock(cat, parent, M.bedFrame, 70, 180, 280, 340, 10, 36);
  addCourse(cat, parent, TILE_PARTS, M.bedFrame, 70, 180, 280, 340, 36, 4);
  addBlock(cat, parent, M.whiteSoft, 75, 185, 270, 335, 40, 51);
  addCourse(cat, parent, TILE_PARTS, M.whiteSoft, 75, 185, 270, 335, 51, 4);
  addBlock(cat, parent, M.headboard, 266, 175, 280, 345, 10, 115);

  for (let z = 170; z < 340; z += 10) {
    cat.placePart(parent, '49307.dat', M.headboard, 273 / 10, 115 / 4.4, (z + 10) / 10, {
      rotY: Math.PI / 2,
    });
  }

  // West-facing padded panels; tile gaps and round buttons remain LEGO geometry.
  const face = new THREE.Group();
  face.position.x = 266 * CM;
  face.rotation.z = Math.PI / 2;
  parent.add(face);
  for (let z = 175; z < 345; z += 34) {
    for (const y of [15, 65]) {
      addCourse(cat, face, TILE_PARTS, M.headboard, y, z + 0.5, y + 49, z + 33.5, 0, 2);
    }
    for (const y of [42, 90]) {
      cat.placePart(face, '98138.dat', M.bedFrame, y / 10, 0.5, (z + 17) / 10, {
        scale: [0.35, 0.25, 0.35],
      });
    }
  }
  addBlock(cat, parent, M.duvet, 75, 180, 242, 185, 44, 55);
  addBlock(cat, parent, M.duvet, 75, 335, 242, 340, 44, 55);
  addBlock(cat, parent, M.duvet, 75, 185, 80, 335, 44, 55);
  for (let x = 85, col = 0; x < 242; x += 20, col++) {
    for (let z = 190 - (col % 2) * 10; z < 330; z += 40) {
      addCourse(cat, parent, TILE_PARTS, M.duvet, x, Math.max(190, z), Math.min(x + 20, 242), Math.min(z + 40, 330), 55, 6);
    }
  }
  for (let x = 85; x < 242; x += 10) {
    for (const [z, rotation] of [[185, Math.PI], [335, 0]]) {
      cat.placePart(parent, '11477.dat', M.duvet, (x + Math.min(10, 242 - x) / 2) / 10, 55 / 4, z / 10, {
        rotY: rotation, scale: [Math.min(10, 242 - x) / 10, 0.75, 0.5],
      });
    }
  }
  for (let z = 190; z < 330; z += 20) {
    cat.placePart(parent, '15068.dat', M.duvet, 80 / 10, 55 / 4, (z + 10) / 10, {
      rotY: -Math.PI / 2, scale: [1, 0.75, 0.5],
    });
  }
}

export function buildPillow(cat, parent) {
  const M = MATERIALS;
  addCourse(cat, parent, PLATE_PARTS, M.whiteSoft, 238, 235, 268, 285, 56, 8);
  for (let z = 240; z < 285; z += 10) {
    for (const [x, rotY] of [[245.5, -Math.PI / 2], [260.5, Math.PI / 2]]) {
      cat.placePart(parent, '15068.dat', M.whiteSoft, x / 10, 64 / 4, z / 10, {
        rotY, scale: [0.5, 1, 0.75],
      });
    }
  }
}

export function buildBedsideTable(cat, parent, z0) {
  const M = MATERIALS;
  addBlock(cat, parent, M.white, 245, z0, 280, z0 + 40, 46, 56);
  addCourse(cat, parent, TILE_PARTS, M.white, 245, z0, 280, z0 + 40, 56, 2);
  addBlock(cat, parent, M.wood, 244, z0 + 2, 246, z0 + 38, 48, 54);
  addCourse(cat, parent, TILE_PARTS, M.black, 244, z0 + 2, 245, z0 + 38, 54, 0.5);
}

export function buildSillAppliance(cat, parent) {
  const M = MATERIALS;
  addBlock(cat, parent, M.white, 55, 433, 79, 453, 90, 103);
  addBlock(cat, parent, M.glass, 55, 433, 79, 453, 103, 122);
  addCourse(cat, parent, TILE_PARTS, M.white, 55, 433, 79, 453, 122, 2);
  const front = new THREE.Group();
  front.position.set(67 * CM, 97 * CM, 433 * CM);
  front.rotation.x = -Math.PI / 2;
  parent.add(front);
  cat.placePart(front, '3069b.dat', M.black, 0, 0, 0, {
    scale: [0.4, 0.15, 0.4],
  });
}

export function buildSillPlant(cat, parent) {
  const M = MATERIALS;
  cat.placePart(parent, '4740.dat', M.white, 14.8, 90 / 4, 44.3, {
    scale: [0.8, 1, 0.8],
  });
  cat.placePart(parent, '3941.dat', M.white, 14.8, 94 / 4, 44.3, {
    scale: [0.9, 1, 0.9],
  });
  cat.placePart(parent, '4032a.dat', M.soilBrown, 14.8, 105 / 4, 44.3, {
    scale: [0.75, 0.35, 0.75],
  });
  for (let i = 0; i < 6; i++) {
    cat.placePart(parent, i % 2 ? '37695.dat' : '32607.dat', i % 2 ? M.leafBright : M.leafGreen,
      14.8, 104 / 4, 44.3, {
      rotY: i * Math.PI / 3, scale: [0.85, 0.65, 0.45],
    });
  }
  for (const [x, height] of [[140, 141], [148, 150], [156, 132]]) {
    cat.placePart(parent, '30374.dat', M.leafGreen, x / 10, 108 / 4, 44.3, {
      scale: [0.3, (height - 108) / 40, 0.3],
    });
  }
  // Two short branches support the additional blossoms rather than floating them.
  for (const [x, y, dx, dy] of [[140, 130, -7, 7], [148, 139, 8, 7]]) {
    const branch = new THREE.Group();
    branch.position.set(x * CM, y * CM, 443 * CM);
    branch.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(dx, dy, 0).normalize());
    parent.add(branch);
    cat.placePart(branch, '87994.dat', M.leafGreen, 0, 0, 0, {
      scale: [0.3, Math.hypot(dx, dy) / 30, 0.3],
    });
  }
  for (const [x, y] of [[140, 141], [148, 150], [156, 132], [133, 137], [156, 146]]) {
    const flower = new THREE.Group();
    flower.position.set(x * CM, y * CM, 443 * CM);
    flower.rotation.x = -Math.PI / 3;
    parent.add(flower);
    cat.placePart(flower, '24866.dat', M.white, 0, 0, 0);
    cat.placePart(flower, '98138.dat', M.yellow, 0, 4 / 4, 0, {
      scale: [0.3, 0.2, 0.3],
    });
  }
}
