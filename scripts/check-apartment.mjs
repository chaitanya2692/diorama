import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import * as THREE from 'three';
import { LDrawCatalog, PLATE, STUD } from '../src/ldraw.js';
import { MATERIALS } from '../src/rooms/materials.js';
import { buildBedroom } from '../src/rooms/bedroom.js';
import { createApartment } from '../src/apartment.js';
import { createLighting } from '../src/lighting.js';

const bundle = JSON.parse(await readFile(new URL('../public/ldraw/parts-bundle.json', import.meta.url)));
const catalog = await new LDrawCatalog().init(bundle);
const parent = new THREE.Group();
const part = catalog.placePart(parent, '3005.dat', MATERIALS.white, 2, 3, 4);
assert.deepEqual(part.position.toArray(), [2 * STUD, 3 * PLATE, 4 * STUD]);
assert.throws(() => catalog.placePart(parent, 'missing.dat', MATERIALS.white, 0, 0, 0), {
  message: 'LDraw template not loaded: missing.dat',
});
assert.equal(createApartment(catalog, []).children.length, 0);

function geometryData(geometry) {
  return {
    attributes: Object.fromEntries(Object.entries(geometry.attributes).map(([key, attr]) => [key, {
      itemSize: attr.itemSize, normalized: attr.normalized, array: attr.array.slice(),
    }])),
    index: geometry.index?.array.slice(),
  };
}
function templateData() {
  return [...catalog.templates].map(([key, template]) => [key, {
    meshes: template.meshes.map(geometryData), lines: template.lines.map(geometryData),
  }]);
}
const templatesBefore = templateData();
const apartment = createApartment(catalog, [
  { build: buildBedroom },
  { build: buildBedroom, x: 100, z: 0, rotationY: Math.PI / 2 },
]);
const [first, second] = apartment.children;
assert.equal(apartment.children.length, 2);
assert.notEqual(first, second);
apartment.updateMatrixWorld(true);
assert.deepEqual(first.position.toArray(), [0, 0, 0]);
assert.deepEqual(second.position.toArray(), [100 * STUD, 0, 0]);
assert.equal(second.rotation.y, Math.PI / 2);
assert(!new THREE.Box3().setFromObject(first).intersectsBox(new THREE.Box3().setFromObject(second)));
const placement = new THREE.Matrix4().makeRotationY(Math.PI / 2).setPosition(100 * STUD, 0, 0);
const normalPlacement = new THREE.Matrix3().getNormalMatrix(placement);
function closeVector(actual, expected) {
  assert(actual.distanceTo(expected) < 2e-5, `${actual.toArray()} != ${expected.toArray()}`);
}
function descendants(group, predicate) {
  const objects = [];
  group.traverse((object) => { if (predicate(object)) objects.push(object); });
  return objects;
}
const geometryA = descendants(first, (object) => object.geometry);
const geometryB = descendants(second, (object) => object.geometry);
assert.equal(geometryA.length, geometryB.length);
for (let i = 0; i < geometryA.length; i++) {
  const a = geometryA[i];
  const b = geometryB[i];
  assert.equal(a.type, b.type);
  assert.equal(a.material, b.material);
  assert.deepEqual(geometryData(a.geometry), geometryData(b.geometry));
  if (a.isMesh) {
    assert(a.castShadow && a.receiveShadow);
    assert(b.castShadow && b.receiveShadow);
  }
  for (const name of ['position', 'normal']) {
    const attribute = a.geometry.getAttribute(name);
    if (!attribute) continue;
    for (let vertex = 0; vertex < attribute.count; vertex++) {
      const local = new THREE.Vector3().fromBufferAttribute(attribute, vertex);
      const expected = local.clone();
      const actual = local.clone();
      if (name === 'position') {
        expected.applyMatrix4(a.matrixWorld).applyMatrix4(placement);
        actual.applyMatrix4(b.matrixWorld);
      } else {
        expected.applyNormalMatrix(new THREE.Matrix3().getNormalMatrix(a.matrixWorld)).applyNormalMatrix(normalPlacement);
        actual.applyNormalMatrix(new THREE.Matrix3().getNormalMatrix(b.matrixWorld));
      }
      closeVector(actual, expected);
    }
  }
}
assert.deepEqual(templateData(), templatesBefore);

const scene = new THREE.Scene();
scene.add(apartment);
const applyLighting = createLighting(scene, new THREE.Box3().setFromObject(apartment));
function visibleLights() { return descendants(scene, (object) => {
  if (!object.isLight) return false;
  for (let node = object; node; node = node.parent) if (!node.visible) return false;
  return true;
}); }
applyLighting(false, false, apartment);
const nightLights = visibleLights();
assert.deepEqual(nightLights.filter((light) => light.isDirectionalLight).map((light) => [light.intensity, light.castShadow]), [[0.8, true], [0.12, true]]);
const ambientOnly = () => {
  const active = visibleLights();
  assert.equal(active.length, 1);
  assert(active[0].isHemisphereLight);
  assert.equal(active[0].intensity, 0.12);
};
applyLighting(false, true, apartment);
ambientOnly();
applyLighting(true, true, apartment);
assert.deepEqual(visibleLights().map((light) => [light.type, light.intensity]), [['HemisphereLight', 1], ['DirectionalLight', 4]]);
applyLighting(false, true, apartment);
ambientOnly();
applyLighting(false, false, apartment);
assert.deepEqual(visibleLights(), nightLights);
console.log('Apartment checks passed: local placement, two transformed bedrooms, shared assets, immutable templates, shadows, global lighting, and loading-state replay.');
