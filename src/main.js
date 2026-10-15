import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
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

    const nightLights = new THREE.Group();
    const nightAmbient = new THREE.HemisphereLight('#ffffff', '#b9b3a8', 0.8);
    const lightsOffAmbient = new THREE.HemisphereLight('#ffffff', '#b9b3a8', 0.12);
    lightsOffAmbient.visible = false;
    nightLights.add(nightAmbient, lightsOffAmbient);

    const fill = new THREE.DirectionalLight('#ffffff', 0.8);
    fill.position.set(-12, 12, 6);
    fill.castShadow = true;
    nightLights.add(fill);

    const rim = new THREE.DirectionalLight('#ffffff', 0.12);
    rim.position.set(-6, 11, -12);
    rim.castShadow = true;
    nightLights.add(rim);
    scene.add(nightLights);

    const dayLights = new THREE.Group();
    dayLights.add(new THREE.HemisphereLight('#ffffff', '#d4c7af', 1));
    const sunlight = new THREE.DirectionalLight('#fff1cf', 4.0);
    sunlight.position.set(-280, 700, -1000);
    sunlight.castShadow = true;
    sunlight.shadow.mapSize.set(1024, 1024);
    sunlight.shadow.camera.left = -10;
    sunlight.shadow.camera.right = 10;
    sunlight.shadow.camera.top = 10;
    sunlight.shadow.camera.bottom = -10;
    sunlight.shadow.camera.far = 1500;
    dayLights.add(sunlight);

    const sunrays = new THREE.Group();
    for (const x of [-2.6, 7.1]) {
      const ray = new THREE.Mesh(
        new THREE.BoxGeometry(2.25, 0.06, 4.5),
        new THREE.MeshBasicMaterial({
          color: '#ffe7a8',
          transparent: true,
          depthWrite: false,
        }),
      );
      ray.position.set(x, 2.0, -3.6);
      ray.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        new THREE.Vector3(0.28, -0.48, 0.83).normalize(),
      );
      sunrays.add(ray);
    }

    sunlight.shadow.camera.updateProjectionMatrix();
    dayLights.visible = false;
    scene.add(dayLights);

    let isDay = false;
    let lightsOff = false;
    let room = null;
    const toggle = document.createElement('button');
    toggle.className = 'scene-toggle day-toggle';
    toggle.type = 'button';
    toggle.setAttribute('aria-pressed', 'false');
    toggle.textContent = 'Switch to day';
    toggle.addEventListener('click', () => {
      isDay = !isDay;
      dayLights.visible = isDay;
      sunrays.visible = isDay;
      nightLights.visible = !isDay;
      nightAmbient.visible = !isDay && !lightsOff;
      lightsOffAmbient.visible = !isDay && lightsOff;
      fill.visible = !isDay && !lightsOff;
      rim.visible = !isDay && !lightsOff;
      if (room) room.traverse((object) => {
        if (object.isLight) object.visible = !isDay && !lightsOff;
      });
      lightsToggle.hidden = isDay;
      toggle.setAttribute('aria-pressed', String(isDay));
      toggle.textContent = isDay ? 'Switch to night' : 'Switch to day';
    });
    root.append(toggle);

    const lightsToggle = document.createElement('button');
    lightsToggle.className = 'scene-toggle lights-toggle';
    lightsToggle.type = 'button';
    lightsToggle.setAttribute('aria-pressed', 'false');
    lightsToggle.textContent = 'Lights off';
    lightsToggle.addEventListener('click', () => {
      lightsOff = !lightsOff;
      nightLights.visible = !isDay;
      nightAmbient.visible = !isDay && !lightsOff;
      lightsOffAmbient.visible = !isDay && lightsOff;
      fill.visible = !isDay && !lightsOff;
      rim.visible = !isDay && !lightsOff;
      if (room) room.traverse((object) => {
        if (object.isLight) object.visible = !isDay && !lightsOff;
      });
      lightsToggle.setAttribute('aria-pressed', String(lightsOff));
      lightsToggle.textContent = lightsOff ? 'Lights on' : 'Lights off';
    });
    root.append(lightsToggle);


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

    room = await createRoom();
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
