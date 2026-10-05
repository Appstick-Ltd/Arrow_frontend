import * as THREE from 'three';

// 3D Heart Geometry for the Lives display matching the mobile game
export function createHeartMesh() {
  const shape = new THREE.Shape();
  // Precise iconic game heart curve (upright, wide top lobes, tapered bottom point)
  // Top center cleft: (0, 0.16)
  shape.moveTo(0, 0.16);
  // Left upper lobe
  shape.bezierCurveTo(-0.06, 0.34, -0.18, 0.46, -0.34, 0.46);
  shape.bezierCurveTo(-0.54, 0.46, -0.58, 0.22, -0.58, 0.08);
  // Left lower curve tapering to bottom tip (0, -0.46)
  shape.bezierCurveTo(-0.58, -0.16, -0.32, -0.32, 0, -0.46);
  // Right lower curve from bottom tip
  shape.bezierCurveTo(0.32, -0.32, 0.58, -0.16, 0.58, 0.08);
  // Right upper lobe
  shape.bezierCurveTo(0.58, 0.22, 0.54, 0.46, 0.34, 0.46);
  shape.bezierCurveTo(0.18, 0.46, 0.06, 0.34, 0, 0.16);

  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: 0.14,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: 0.045,
    bevelThickness: 0.045,
  });
  geom.center();

  // Premium glossy ruby-red enamel material with subtle inner glow
  const mat = new THREE.MeshPhysicalMaterial({
    color: 0xff1646,
    emissive: 0x990022,
    emissiveIntensity: 0.9,
    metalness: 0.15,
    roughness: 0.1,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08,
  });

  const mesh = new THREE.Mesh(geom, mat);
  mesh.scale.setScalar(0.72);
  return mesh;
}

// 3D Winding Arrow Builder (body path + sharp beveled arrowhead)
export function createWindingArrowGroup(arrowData, materials) {
  const { id, dir, path, exitVector, blockedBy } = arrowData;
  const group = new THREE.Group();
  group.name = `Arrow_${id}`;

  const bodyRadius = 0.088;
  const segments = [];

  // 1. Build continuous straight bar segments along path
  for (let i = 0; i < path.length - 1; i++) {
    const p1 = new THREE.Vector3(path[i][0], path[i][1], 0.08);
    const p2 = new THREE.Vector3(path[i + 1][0], path[i + 1][1], 0.08);

    const dist = p1.distanceTo(p2);
    if (dist < 0.01) continue;

    // Cylinder segment oriented between p1 and p2
    const cylGeo = new THREE.CylinderGeometry(bodyRadius, bodyRadius, dist, 12);
    cylGeo.translate(0, dist / 2, 0);
    cylGeo.rotateX(Math.PI / 2);

    const mesh = new THREE.Mesh(cylGeo, materials.default.clone());
    mesh.position.copy(p1);
    mesh.lookAt(p2);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
    segments.push(mesh);

    // Rounded corner sphere joint at vertices to make turns look sleek
    const jointGeo = new THREE.SphereGeometry(bodyRadius * 1.02, 12, 12);
    const jointMesh = new THREE.Mesh(jointGeo, materials.default.clone());
    jointMesh.position.copy(p1);
    group.add(jointMesh);
    segments.push(jointMesh);
  }

  // Joint at final point
  const lastPt = path[path.length - 1];
  const lastPos = new THREE.Vector3(lastPt[0], lastPt[1], 0.08);

  // 2. Sharp 3D Arrowhead at endpoint
  const headLength = 0.36;
  const headWidth = 0.22;
  const headGeo = new THREE.ConeGeometry(headWidth, headLength, 4);
  headGeo.rotateY(Math.PI / 4); // Square pyramid for faceted diamond look

  const headMesh = new THREE.Mesh(headGeo, materials.default.clone());
  headMesh.castShadow = true;
  headMesh.receiveShadow = true;

  // Rotation according to direction
  if (dir === 'UP') {
    headMesh.rotation.z = 0;
    headMesh.position.set(lastPos.x, lastPos.y + headLength * 0.45, lastPos.z);
  } else if (dir === 'RIGHT') {
    headMesh.rotation.z = -Math.PI / 2;
    headMesh.position.set(lastPos.x + headLength * 0.45, lastPos.y, lastPos.z);
  } else if (dir === 'DOWN') {
    headMesh.rotation.z = Math.PI;
    headMesh.position.set(lastPos.x, lastPos.y - headLength * 0.45, lastPos.z);
  } else if (dir === 'LEFT') {
    headMesh.rotation.z = Math.PI / 2;
    headMesh.position.set(lastPos.x - headLength * 0.45, lastPos.y, lastPos.z);
  }

  group.add(headMesh);
  segments.push(headMesh);

  // Attach metadata
  group.userData = {
    id: id,
    dir: dir,
    exitVector: exitVector,
    blockedBy: [...blockedBy],
    isEscaped: false,
    baseX: group.position.x,
    baseY: group.position.y,
    baseZ: group.position.z,
    segments: segments,
  };

  // Tag all meshes so raycasting hits can resolve back to parent arrow group
  segments.forEach((m) => {
    m.userData.parentArrowGroup = group;
  });

  return group;
}
