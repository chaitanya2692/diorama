import * as THREE from 'three';
import { LDrawLoader } from 'three/addons/loaders/LDrawLoader.js';
import { LDrawConditionalLineMaterial } from 'three/addons/materials/LDrawConditionalLineMaterial.js';
import { LDrawUtils } from 'three/addons/utils/LDrawUtils.js';

// 1 stud = 20 LDU = 0.375 Three.js units; room builders choose their display scale.
// 1 plate = 8 LDU = 0.15 Three.js units (3 plates = 1 brick = 0.45 units)
export const STUD = 0.375;
export const LDU = STUD / 20;
export const PLATE = 8 * LDU;
export const BRICK = 24 * LDU;

// Canonical bottom Y in LDraw coordinates (before flipping Y with rotateX(Math.PI))
const PART_ORIGINS = {
  // 1-brick tall (24 LDU)
  '3005.dat': [0, 24, 0],
  '3004.dat': [0, 24, 0],
  '3622.dat': [0, 24, 0],
  '3010.dat': [0, 24, 0],
  '3009.dat': [0, 24, 0],
  '3008.dat': [0, 24, 0],
  '3003.dat': [0, 24, 0],
  '3002.dat': [0, 24, 0],
  '3001.dat': [0, 24, 0],
  '37352.dat': [0, 24, 0],
  '1871.dat': [0, 32, 0],
  '49307.dat': [0, 16, 0],
  '3062b.dat': [0, 24, 0],
  '3941.dat': [0, 24, 0],
  '24309.dat': [0, 24, 0],

  // 1-plate / 1-tile tall (8 LDU)
  '3024.dat': [0, 8, 0],
  '3023b.dat': [0, 8, 0],
  '3623.dat': [0, 8, 0],
  '3710.dat': [0, 8, 0],
  '3666.dat': [0, 8, 0],
  '3460.dat': [0, 8, 0],
  '3022.dat': [0, 8, 0],
  '3021.dat': [0, 8, 0],
  '3020.dat': [0, 8, 0],
  '3795.dat': [0, 8, 0],
  '3034.dat': [0, 8, 0],
  '3031.dat': [0, 8, 0],
  '3032.dat': [0, 8, 0],
  '3070b.dat': [0, 8, 0],
  '3069b.dat': [0, 8, 0],
  '63864.dat': [0, 8, 0],
  '2431.dat': [0, 8, 0],
  '6636.dat': [0, 8, 0],
  '4162.dat': [0, 8, 0],
  '3068b.dat': [0, 8, 0],
  '26603.dat': [0, 8, 0],
  '87079.dat': [0, 8, 0],
  '14769.dat': [0, 8, 0],
  '98138.dat': [0, 8, 0],
  '3794b.dat': [0, 8, 0],
  '87580.dat': [0, 8, 0],
  '6141.dat': [0, 8, 0],
  '85861.dat': [0, 8, 0],
  '4032a.dat': [0, 8, 0],
  '60474.dat': [0, 8, 0],
  '11833.dat': [0, 8, 0],
  '2654a.dat': [0, 8, 0],
  '4740.dat': [0, 8, 0],
  '32607.dat': [0, 8, 0],
  '2423.dat': [0, 8, 0],
  '2412b.dat': [0, 8, 0],
  '24866.dat': [0, 8, 0],

  // 2-plate tall dishes (16 LDU)
  '3960.dat': [0, 16, 0],
  '43898.dat': [0, 16, 0],

  // 2/3-height slopes & plant stems (0 LDU bottom)
  '11477.dat': [0, 0, 0],
  '15068.dat': [0, 0, 0],
  '54200.dat': [0, 0, 0],
  '85984.dat': [0, 0, 0],
  '37695.dat': [0, 0, 0],
  '24855.dat': [0, 20, 0],

  // Bars
  '30374.dat': [0, 80, 0],
  '87994.dat': [0, 60, 0],

  // Door frame & door (6 bricks = 144 LDU tall)
  '60596.dat': [0, 144, 0],
  '60616b.dat': [31.5, 144, 0],
  '60623.dat': [31.5, 144, 0],
};

// Map (width, length) in studs to official LDraw part files
export const BRICK_PARTS = {
  '1x1': '3005.dat',
  '1x2': '3004.dat',
  '1x3': '3622.dat',
  '1x4': '3010.dat',
  '1x6': '3009.dat',
  '1x8': '3008.dat',
  '2x2': '3003.dat',
  '2x3': '3002.dat',
  '2x4': '3001.dat',
};

export const PLATE_PARTS = {
  '1x1': '3024.dat',
  '1x2': '3023b.dat',
  '1x3': '3623.dat',
  '1x4': '3710.dat',
  '1x6': '3666.dat',
  '1x8': '3460.dat',
  '2x2': '3022.dat',
  '2x3': '3021.dat',
  '2x4': '3020.dat',
  '2x6': '3795.dat',
  '2x8': '3034.dat',
  '4x4': '3031.dat',
  '4x6': '3032.dat',
};

export const TILE_PARTS = {
  '1x1': '3070b.dat',
  '1x2': '3069b.dat',
  '1x3': '63864.dat',
  '1x4': '2431.dat',
  '1x6': '6636.dat',
  '1x8': '4162.dat',
  '2x2': '3068b.dat',
  '2x3': '26603.dat',
  '2x4': '87079.dat',
};

const edgeMaterialFor = new WeakMap();
export function getEdgeMaterial(meshMaterial) {
  let edgeMat = edgeMaterialFor.get(meshMaterial);
  if (!edgeMat) {
    const edgeColor = meshMaterial.color.clone().multiplyScalar(0.42);
    edgeMat = new THREE.LineBasicMaterial({
      color: edgeColor,
      transparent: true,
      opacity: meshMaterial.transparent ? 0.15 : 0.24,
      depthWrite: false,
    });
    edgeMaterialFor.set(meshMaterial, edgeMat);
  }
  return edgeMat;
}

export class LDrawCatalog {
  constructor() {
    this.loader = new LDrawLoader();
    this.loader.setPartsLibraryPath('./ldraw/');
    this.loader.setConditionalLineMaterial(LDrawConditionalLineMaterial);
    this.loader.addDefaultMaterials();
    this.templates = new Map();
  }

  async init(bundleData = null) {
    if (!bundleData) {
      const response = await fetch('./ldraw/parts-bundle.json');
      bundleData = await response.json();
    }
    for (const [key, text] of Object.entries(bundleData)) {
      this.loader.partsCache.parseCache.setData(key, text);
    }
    const partNames = Object.keys(PART_ORIGINS);
    await Promise.all(partNames.map((name) => this.loadTemplate(name)));
    return this;
  }

  async loadTemplate(partName) {
    if (this.templates.has(partName)) return this.templates.get(partName);
    const rawGroup = await this.loader.partsCache.loadModel(partName);
    const [ox, oy, oz] = PART_ORIGINS[partName] || [0, 8, 0];

    const translateMat = new THREE.Matrix4().makeTranslation(-ox, -oy, -oz);
    const flipMat = new THREE.Matrix4().makeRotationX(Math.PI);
    const scaleMat = new THREE.Matrix4().makeScale(LDU, LDU, LDU);
    const transform = new THREE.Matrix4().multiplyMatrices(scaleMat, flipMat).multiply(translateMat);

    const template = { meshes: [], lines: [] };
    rawGroup.updateMatrixWorld(true);
    rawGroup.traverse((child) => {
      if (child.isMesh || (child.isLineSegments && !child.isConditionalLine)) {
        const geom = child.geometry.clone();
        geom.applyMatrix4(child.matrixWorld);
        geom.applyMatrix4(transform);
        // Strip material groups so a single material applies cleanly to the whole part
        geom.clearGroups();
        (child.isMesh ? template.meshes : template.lines).push(geom);
      }
    });

    this.templates.set(partName, template);
    return template;
  }

  /**
   * Places an LDraw part centered at stud coordinates (cx, cz) with its base at plate height `p`.
   * Coordinates are local to the parent; apartment placement supplies room offsets.
   */
  placePart(parent, partName, material, cx, p, cz, { rotX = 0, rotY = 0, rotZ = 0, scale = null } = {}) {
    const template = this.templates.get(partName);
    if (!template) throw new Error(`LDraw template not loaded: ${partName}`);

    const group = new THREE.Group();
    const edgeMat = getEdgeMaterial(material);

    for (const meshGeom of template.meshes) {
      const mesh = new THREE.Mesh(meshGeom, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);
    }
    for (const lineGeom of template.lines) {
      const lines = new THREE.LineSegments(lineGeom, edgeMat);
      group.add(lines);
    }

    group.position.set(cx * STUD, p * PLATE, cz * STUD);
    if (rotX || rotY || rotZ) {
      group.rotation.set(rotX, rotY, rotZ);
    }
    if (scale) {
      if (typeof scale === 'number') group.scale.setScalar(scale);
      else group.scale.set(scale[0], scale[1], scale[2]);
    }
    parent.add(group);
    return group;
  }

  /**
   * Places a rectangular brick/plate/tile over [sx0, sx1] x [sz0, sz1] at plate height `p`.
   * Automatically picks the LDraw part from `partTable` (or decomposes larger spans into official parts).
   */
  placeSpan(parent, partTable, material, sx0, sz0, sx1, sz1, p, opts = {}) {
    const dx = Math.round(sx1 - sx0);
    const dz = Math.round(sz1 - sz0);
    const w = Math.min(dx, dz);
    const l = Math.max(dx, dz);
    const key = `${w}x${l}`;
    const partName = partTable[key];
    if (partName) {
      const rotY = (dz > dx ? Math.PI / 2 : 0) + (opts.extraRotY || 0);
      return this.placePart(parent, partName, material, (sx0 + sx1) / 2, p, (sz0 + sz1) / 2, {
        ...opts,
        rotY,
      });
    }

    // Automatically decompose composite spans into official LDraw parts from partTable
    const alongZ = dz > dx;
    const wSegs = this.decomposeLengths(w, [4, 2, 1]);
    const group = new THREE.Group();
    for (const [wa, wb] of wSegs) {
      const subW = wb - wa;
      const validL = [8, 6, 4, 3, 2, 1].filter((len) => partTable[`${ Math.min(subW, len) }x${ Math.max(subW, len) }`]);
      const lSegs = this.decomposeLengths(l, validL);
      for (const [la, lb] of lSegs) {
        if (alongZ) {
          this.placeSpan(parent, partTable, material, sx0 + wa, sz0 + la, sx0 + wb, sz0 + lb, p, opts);
        } else {
          this.placeSpan(parent, partTable, material, sx0 + la, sz0 + wa, sx0 + lb, sz0 + wb, p, opts);
        }
      }
    }
    return group;
  }

  /**
   * Decomposes a 1D strip of length `totalLen` into standard LEGO lengths (e.g. [8, 6, 4, 3, 2, 1]).
   */
  decomposeLengths(totalLen, allowed = [8, 6, 4, 3, 2, 1], offsetShift = 0) {
    const segments = [];
    let pos = 0;
    let step = 0;
    while (pos < totalLen) {
      const rem = totalLen - pos;
      let chosen = 1;
      for (const len of allowed) {
        if (len <= rem) {
          if (step === 0 && offsetShift > 0 && len > offsetShift && rem >= offsetShift) {
            continue;
          }
          chosen = len;
          break;
        }
      }
      segments.push([pos, pos + chosen]);
      pos += chosen;
      step++;
    }
    return segments;
  }

  /**
   * Fills a 1-stud or 2-stud thick strip along X or Z with staggered courses of bricks or plates.
   */
  fillStrip(parent, partTable, materials, sx0, sz0, sx1, sz1, p, allowedLengths = [8, 6, 4, 3, 2, 1], stagger = 0) {
    const matList = Array.isArray(materials) ? materials : [materials];
    const dx = Math.round(sx1 - sx0);
    const dz = Math.round(sz1 - sz0);
    const alongZ = dz > dx;
    const width = alongZ ? dx : dz;
    const totalLen = alongZ ? dz : dx;
    const lengths = width === 2 ? allowedLengths.filter((l) => [4, 3, 2].includes(l)) : allowedLengths;
    const segs = this.decomposeLengths(totalLen, lengths, stagger % 4);

    segs.forEach(([a, b], idx) => {
      const mat = matList[(idx + stagger) % matList.length];
      if (alongZ) {
        this.placeSpan(parent, partTable, mat, sx0, sz0 + a, sx1, sz0 + b, p);
      } else {
        this.placeSpan(parent, partTable, mat, sx0 + a, sz0, sx0 + b, sz1, p);
      }
    });
  }

  /**
   * Merges all static meshes and edge lines by material for optimal single-pass rendering.
   */
  mergeStaticGroup(group) {
    const merged = LDrawUtils.mergeObject(group);
    merged.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return merged;
  }
}
