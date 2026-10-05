import * as THREE from 'three';

// Creates a prominent, large floating 3D puzzle board (No phone screen, No flash, No glare)
export function createFloatingBoardModel() {
  const boardGroup = new THREE.Group();
  boardGroup.name = 'Floating_Puzzle_Board';

  const size = 6.8;
  const depth = 0.28;
  const cornerRadius = 0.55;

  // 1. 2D Rounded Square Base
  function createRoundedSquareShape(s, r) {
    const shape = new THREE.Shape();
    const half = s / 2;
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

  const baseShape = createRoundedSquareShape(size, cornerRadius);
  const baseGeom = new THREE.ExtrudeGeometry(baseShape, {
    depth: depth,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: 0.08,
    bevelThickness: 0.08,
  });
  baseGeom.center();

  // Dark obsidian/navy matte material - NO harsh specular reflections, NO flash
  const baseMat = new THREE.MeshStandardMaterial({
    color: 0x071120, // Authentic dark navy from user's screenshot
    metalness: 0.4,
    roughness: 0.65, // Matte surface prevents any blinding white flash
  });

  const baseMesh = new THREE.Mesh(baseGeom, baseMat);
  baseMesh.castShadow = true;
  baseMesh.receiveShadow = true;
  boardGroup.add(baseMesh);

  // 2. Crisp Cyan Perimeter Edge Border
  const edgeLine = new THREE.LineSegments(
    new THREE.EdgesGeometry(baseGeom, 35),
    new THREE.LineBasicMaterial({
      color: 0x00f3ff,
      transparent: true,
      opacity: 0.35,
    })
  );
  boardGroup.add(edgeLine);

  // 3. Cyber Corner Brackets
  const bracketMat = new THREE.LineBasicMaterial({
    color: 0x00f3ff,
    transparent: true,
    opacity: 0.65,
  });
  const bSize = 0.85;
  const half = size / 2;
  const corners = [
    [-half, half],
    [half, half],
    [half, -half],
    [-half, -half],
  ];
  corners.forEach(([cx, cy]) => {
    const dirX = cx > 0 ? -1 : 1;
    const dirY = cy > 0 ? -1 : 1;
    const pts = [
      new THREE.Vector3(cx, cy + dirY * bSize, depth / 2 + 0.015),
      new THREE.Vector3(cx, cy, depth / 2 + 0.015),
      new THREE.Vector3(cx + dirX * bSize, cy, depth / 2 + 0.015),
    ];
    boardGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), bracketMat));
  });

  // 4. Inner Dark Grid Plate (Matching user's game screenshot background)
  const gridPlateGeom = new THREE.PlaneGeometry(size - 0.4, size - 0.4);
  const gridPlateMat = new THREE.MeshBasicMaterial({
    color: 0x081226,
  });
  const gridPlate = new THREE.Mesh(gridPlateGeom, gridPlateMat);
  gridPlate.position.z = depth / 2 + 0.005;
  boardGroup.add(gridPlate);

  // Subtle maze grid lines
  const gridHelper = new THREE.GridHelper(size - 0.4, 10, 0x143454, 0x0d2038);
  gridHelper.position.set(0, 0, depth / 2 + 0.01);
  gridHelper.rotation.x = Math.PI / 2;
  boardGroup.add(gridHelper);

  return {
    boardGroup,
    boardZ: depth / 2 + 0.04,
  };
}

// Large, Upright, Glossy 3D Game Heart (❤️❤️❤️)
export function createHeartMesh() {
  const heartShape = new THREE.Shape();
  heartShape.moveTo(0, 0.32);
  heartShape.bezierCurveTo(0, 0.55, 0.44, 0.72, 0.55, 0.4);
  heartShape.bezierCurveTo(0.65, 0.12, 0.35, -0.15, 0, -0.48);
  heartShape.bezierCurveTo(-0.35, -0.15, -0.65, 0.12, -0.55, 0.4);
  heartShape.bezierCurveTo(-0.44, 0.72, 0, 0.55, 0, 0.32);

  const geom = new THREE.ExtrudeGeometry(heartShape, {
    depth: 0.18,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: 0.06,
    bevelThickness: 0.06,
  });
  geom.center();

  const mat = new THREE.MeshStandardMaterial({
    color: 0xff1646,
    emissive: 0x880022,
    roughness: 0.25,
    metalness: 0.2,
  });

  const mesh = new THREE.Mesh(geom, mat);
  mesh.castShadow = true;
  return mesh;
}
