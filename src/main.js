import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { PLATE } from './ldraw.js';
import { createRoom } from './room.js';
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

    scene.environmentIntensity = 0;
    scene.add(new THREE.PointLight('#ffffff', 15, 24, 1.2).translateY(30 * PLATE));

    const fill = new THREE.DirectionalLight('#ffffff', 0.18);
    fill.position.set(-12, 12, 6);
    scene.add(fill);

    const rim = new THREE.DirectionalLight('#ffffff', 0.12);
    rim.position.set(-6, 11, -12);
    scene.add(rim);

    // True isometric OrthographicCamera matching Isometric LEGO Bedroom Diorama.png framing
    const target = new THREE.Vector3(1.2, 1.05, 1.2);
    const initialOffset = new THREE.Vector3(13.0, 14.2, 14.8);
    const camera = new THREE.OrthographicCamera(-9, 9, 7, -7, 0.1, 100);
    camera.position.copy(target).add(initialOffset);
    camera.lookAt(target);

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
      const baseHalfHeight = aspect < 1.25 ? 10.0 / Math.max(aspect * 0.82, 0.55) : 9.0;
      camera.left = -baseHalfHeight * aspect;
      camera.right = baseHalfHeight * aspect;
      camera.top = baseHalfHeight;
      camera.bottom = -baseHalfHeight;
      camera.updateProjectionMatrix();
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(root);
    resize();

    const room = await createRoom();
    scene.add(room);
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
