import * as THREE from 'three';

export function createLighting(scene) {
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

  sunlight.shadow.camera.updateProjectionMatrix();
  dayLights.visible = false;
  scene.add(dayLights);

  return function applyLighting(isDay, lightsOff, apartment = null) {
    const nightOn = !isDay && !lightsOff;
    dayLights.visible = isDay;
    nightLights.visible = !isDay;
    nightAmbient.visible = nightOn;
    fill.visible = nightOn;
    rim.visible = nightOn;
    lightsOffAmbient.visible = !isDay && lightsOff;
    if (apartment) apartment.traverse((object) => {
      if (object.isLight) object.visible = nightOn;
    });
  };
}
