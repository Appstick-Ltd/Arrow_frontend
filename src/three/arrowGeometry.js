import * as THREE from 'three';

// 2D Arrow Polygon for extrusion
export function createArrowShape(scale = 1.0) {
  const shape = new THREE.Shape();
  const s = scale;

  // Arrow pointing UP (+Y)
  shape.moveTo(0, 0.44 * s);
  shape.lineTo(0.32 * s, 0.12 * s);
  shape.lineTo(0.14 * s, 0.12 * s);
  shape.lineTo(0.14 * s, -0.42 * s);
  shape.lineTo(-0.14 * s, -0.42 * s);
  shape.lineTo(-0.14 * s, 0.12 * s);
  shape.lineTo(-0.32 * s, 0.12 * s);
  shape.closePath();

  return shape;
}

// 2D Rounded Square for Puzzle Block Base
export function createRoundedTileShape(size = 0.95, radius = 0.12) {
  const shape = new THREE.Shape();
  const half = size / 2;
  const r = radius;

  shape.moveTo(-half + r, -half);
  shape.lineTo(half - r, -half);
  shape.absarc(half - r, -half + r, r, -Math.PI / 2, 0, false);
  shape.lineTo(half, half - r);
  shape.absarc(half - r, half - r, r, 0, Math.PI / 2, false);
  shape.lineTo(-half + r, half);
  shape.absarc(-half + r, half - r, r, Math.PI / 2, Math.PI, false);
  shape.lineTo(-half, -half + r);
  shape.absarc(-half + r, -half + r, r, Math.PI, Math.PI * 1.5, false);

  return shape;
}

// Pre-cached geometries for 60fps performance
let cachedArrowGeom = null;
let cachedBaseGeom = null;

export function getArrowGeometry() {
  if (!cachedArrowGeom) {
    const shape = createArrowShape(0.78);
    const extrudeSettings = {
      steps: 1,
      depth: 0.12,
      bevelEnabled: true,
      bevelThickness: 0.025,
      bevelSize: 0.02,
      bevelSegments: 3,
    };
    cachedArrowGeom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    cachedArrowGeom.center();
  }
  return cachedArrowGeom;
}

export function getBlockBaseGeometry() {
  if (!cachedBaseGeom) {
    const shape = createRoundedTileShape(0.96, 0.12);
    const extrudeSettings = {
      steps: 1,
      depth: 0.18,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.025,
      bevelSegments: 3,
    };
    cachedBaseGeom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    cachedBaseGeom.center();
  }
  return cachedBaseGeom;
}

// Creates an individual physical 3D arrow block on the 5x5 board
export function createPhysicalArrowBlock({
  index,
  row,
  col,
  initialDir = 0, // 0 = UP, 1 = RIGHT, 2 = DOWN, 3 = LEFT
  isStart = false,
  isExit = false,
}) {
  const group = new THREE.Group();
  group.name = `block_${index}`;

  const baseGeom = getBlockBaseGeometry();
  const arrowGeom = getArrowGeometry();

  // Subtle metallic charcoal physical base
  const baseMat = new THREE.MeshPhysicalMaterial({
    color: 0x0c111a,
    metalness: 0.88,
    roughness: 0.32,
    clearcoat: 0.35,
    clearcoatRoughness: 0.15,
    reflectivity: 0.6,
  });

  const baseMesh = new THREE.Mesh(baseGeom, baseMat);
  baseMesh.castShadow = true;
  baseMesh.receiveShadow = true;
  baseMesh.position.z = 0;
  group.add(baseMesh);

  // Subtle physical beveled arrow glyph
  const arrowMat = new THREE.MeshPhysicalMaterial({
    color: 0x141d2d,
    emissive: 0x00f3ff,
    emissiveIntensity: 0.4,
    metalness: 0.94,
    roughness: 0.18,
    clearcoat: 0.5,
  });

  const arrowMesh = new THREE.Mesh(arrowGeom, arrowMat);
  arrowMesh.castShadow = true;
  arrowMesh.receiveShadow = true;
  arrowMesh.position.z = 0.12;
  // Rotation around Z: 0=UP, 1=RIGHT, 2=DOWN, 3=LEFT
  arrowMesh.rotation.z = -initialDir * (Math.PI / 2);
  group.add(arrowMesh);

  // Minimal 3D START / EXIT marking
  if (isStart) {
    const startPinGeom = new THREE.RingGeometry(0.12, 0.16, 24);
    const startPinMat = new THREE.MeshBasicMaterial({
      color: 0x00f3ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9,
    });
    const startPin = new THREE.Mesh(startPinGeom, startPinMat);
    startPin.position.set(-0.3, -0.3, 0.1);
    group.add(startPin);
  }

  if (isExit) {
    const exitPinGeom = new THREE.RingGeometry(0.12, 0.16, 24);
    const exitPinMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9,
    });
    const exitPin = new THREE.Mesh(exitPinGeom, exitPinMat);
    exitPin.position.set(0.3, 0.3, 0.1);
    group.add(exitPin);
  }

  group.userData = {
    index,
    row,
    col,
    dir: initialDir,
    baseMesh,
    arrowMesh,
    baseMat,
    arrowMat,
    isStart,
    isExit,
    targetRotZ: -initialDir * (Math.PI / 2),
    baseZ: 0,
    isConnected: false,
  };

  return group;
}
