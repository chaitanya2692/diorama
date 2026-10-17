import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import * as THREE from 'three';
import { buildBedroom } from '../src/rooms/bedroom.js';
import { MATERIALS } from '../src/rooms/materials.js';
import { LDrawCatalog, STUD } from '../src/ldraw.js';

const CM = STUD / 10;
const catalog = await new LDrawCatalog().init(JSON.parse(await readFile(new URL('../public/ldraw/parts-bundle.json', import.meta.url))));
const room = buildBedroom(catalog);
assert.deepEqual(room.position.toArray(), [0, 0, 0]);
assert.deepEqual(room.scale.toArray(), [1, 1, 1]);
room.updateMatrixWorld(true);
const meshes = (object) => {
  const result = [];
  object.traverse((child) => { if (child.isMesh) result.push(child); });
  return result;
};
const all = meshes(room);
const shell = meshes(room.getObjectByName('shell'));
// Survey faces exclude the 2 cm projecting decorative baseboards.
const masonry = shell.filter((mesh) => mesh.material !== MATERIALS.white);
const floor = meshes(room.getObjectByName('floor'));
const cast = (objects, origin, direction, range = 1000) => new THREE.Raycaster(
  new THREE.Vector3(...origin).multiplyScalar(CM), new THREE.Vector3(...direction), 0, range * CM,
).intersectObjects(objects, false);
const close = (actual, expected, message) => assert.ok(Math.abs(actual / CM - expected) < 0.1, `${message}: ${actual / CM} != ${expected}`);
for (const origin of [[20, 50, 200], [80, 50, -5]]) {
  close(cast(floor, origin, [0, -1, 0])[0].point.y, 0, 'Finished floor');
}
assert.equal(cast(floor, [20, 50, -5], [0, -1, 0]).length, 0, 'North return must remain stepped');
close(cast(masonry, [140, 150, 250], [1, 0, 0])[0].point.x, 280, 'East wall');
close(cast(masonry, [20, 6, 250], [-1, 0, 0])[0].point.x, 0, 'West low wall');
close(cast(masonry, [238, 150, 400], [0, 0, 1])[0].point.z, 453, 'South wall');
for (const [x, solid] of [[31.5, true], [32.5, false], [195.5, false], [196.5, true]]) {
  assert.equal(cast(shell, [x, 150, 400], [0, 0, 1]).length > 0, solid, `Window edge X=${x}`);
}
assert.equal(cast(all, [100, 150, 400], [0, 0, 1], 100).length, 0, 'Window has no backdrop');
for (const [z, solid] of [[35, true], [36.5, false], [110.5, false], [112, true]]) {
  assert.equal(cast(all, [20, 100, z], [-1, 0, 0], 40).length > 0, solid, `Entrance Z=${z}`);
}
for (const [x, solid] of [[105, true], [106.5, false], [171.5, false], [173, true]]) {
  assert.equal(cast(all, [x, 100, 20], [0, 0, -1], 50).length > 0, solid, `Wardrobe opening X=${x}`);
}
const bedAndPillow = room.children.find((child) => child.name === 'bed-and-pillow');
assert.ok(bedAndPillow, 'Bed and pillow share one assembly');
const bounds = new THREE.Box3().setFromObject(bedAndPillow);
assert.ok(Math.abs((bounds.min.z + bounds.max.z) / (2 * CM) - 245) < 0.1, 'Bed and pillow move together to the midpoint between tables');
for (const mesh of all) {
  assert.ok(mesh.castShadow && mesh.receiveShadow, 'Merged geometry retains shadows');
  for (const value of mesh.geometry.attributes.position.array) assert.ok(Number.isFinite(value), 'Finite geometry');
}
console.log('Bedroom survey, clear openings, finite geometry and shadow checks passed.');
