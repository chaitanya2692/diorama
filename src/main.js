import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { LDrawCatalog } from './ldraw.js';
import { createApartment } from './apartment.js';
import { createLighting } from './lighting.js';
import './style.css';

const root = document.querySelector('#scene');
const status = document.querySelector('#status');

async function initScene() {
  try {
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.domElement.setAttribute('aria-label', 'Interactive isometric LEGO bedroom');
    root.append(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#000000');

    let applyLighting = null;

    let isDay = false;
    let lightsOff = false;
    let apartment = null;
    const toggle = document.createElement('button');
    toggle.className = 'scene-toggle day-toggle';
    toggle.type = 'button';
    toggle.addEventListener('click', () => {
      isDay = !isDay;
      updateSceneState();
    });
    root.append(toggle);

    const lightsToggle = document.createElement('button');
    lightsToggle.className = 'scene-toggle lights-toggle';
    lightsToggle.type = 'button';
    lightsToggle.addEventListener('click', () => {
      lightsOff = !lightsOff;
      updateSceneState();
    });
    root.append(lightsToggle);

    function updateSceneState() {
      applyLighting?.(isDay, lightsOff, apartment);
      toggle.setAttribute('aria-pressed', String(isDay));
      toggle.textContent = isDay ? 'Switch to night' : 'Switch to day';
      lightsToggle.setAttribute('aria-pressed', String(lightsOff));
      lightsToggle.textContent = lightsOff ? 'Lights on' : 'Lights off';
      lightsToggle.hidden = isDay;
    }
    updateSceneState();

    const catalog = await new LDrawCatalog().init();
    apartment = createApartment(catalog);
    scene.add(apartment);
    const bounds = new THREE.Box3().setFromObject(apartment);
    applyLighting = createLighting(scene, bounds);
    updateSceneState();
    const sphere = bounds.getBoundingSphere(new THREE.Sphere());
    const target = sphere.center;
    const radius = sphere.radius;
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, radius * 8);
    camera.position.copy(target).addScaledVector(new THREE.Vector3(-1, 1, -1).normalize(), radius * 4);
    camera.lookAt(target);
    camera.updateMatrixWorld(true);
    let paddedHalfX = 0;
    let paddedHalfY = 0;
    for (const x of [bounds.min.x, bounds.max.x]) {
      for (const y of [bounds.min.y, bounds.max.y]) {
        for (const z of [bounds.min.z, bounds.max.z]) {
          const corner = new THREE.Vector3(x, y, z).applyMatrix4(camera.matrixWorldInverse);
          paddedHalfX = Math.max(paddedHalfX, Math.abs(corner.x) * 1.08);
          paddedHalfY = Math.max(paddedHalfY, Math.abs(corner.y) * 1.08);
        }
      }
    }

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.copy(target);
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.minZoom = 0.55;
    controls.maxZoom = 3.5;
    controls.minPolarAngle = 0.35;
    controls.maxPolarAngle = 1.4;
    controls.update();

    function resize() {
      const width = Math.max(root.clientWidth, 1);
      const height = Math.max(root.clientHeight, 1);
      renderer.setSize(width, height, false);
      const aspect = width / height;
      const halfHeight = Math.max(paddedHalfY, paddedHalfX / aspect);
      camera.left = -halfHeight * aspect;
      camera.right = halfHeight * aspect;
      camera.top = halfHeight;
      camera.bottom = -halfHeight;
      camera.updateProjectionMatrix();
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(root);
    resize();

    status.remove();

    renderer.setAnimationLoop(() => {
      controls.update();
      renderer.render(scene, camera);
    });
  } catch (error) {
    console.error('Unable to initialize the 3D bedroom scene.', error);
    status.textContent = 'This browser could not start the 3D scene. Enable WebGL or try a supported browser.';
    status.classList.add('error');
  }
}

initScene();
