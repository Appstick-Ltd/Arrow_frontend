import * as THREE from 'three';

// Builds an ultra-sleek 3D Smartphone chassis and screen for the game display
export function create3DPhoneModel() {
  const phoneGroup = new THREE.Group();
  phoneGroup.name = 'Smartphone_Chassis';

  const width = 4.4;
  const height = 8.2;
  const depth = 0.38;
  const cornerRadius = 0.55;

  // 1. 2D Rounded Rectangle Shape for Extruded Phone Body
  function createRoundedRectShape(w, h, r) {
    const shape = new THREE.Shape();
    const hw = w / 2;
    const hh = h / 2;
    shape.moveTo(-hw + r, -hh);
    shape.lineTo(hw - r, -hh);
    shape.absarc(hw - r, -hh + r, r, -Math.PI / 2, 0, false);
    shape.lineTo(hw, hh - r);
    shape.absarc(hw - r, hh - r, r, 0, Math.PI / 2, false);
    shape.lineTo(-hw + r, hh);
    shape.absarc(-hw + r, hh - r, r, Math.PI / 2, Math.PI, false);
    shape.lineTo(-hw, -hh + r);
    shape.absarc(-hw + r, -hh + r, r, Math.PI, Math.PI * 1.5, false);
    return shape;
  }

  // 2. Physical Titanium Outer Chassis
  const bodyShape = createRoundedRectShape(width, height, cornerRadius);
  const bodyGeom = new THREE.ExtrudeGeometry(bodyShape, {
    depth: depth,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: 0.08,
    bevelThickness: 0.08,
  });
  bodyGeom.center();

  // Dark brushed titanium metallic material
  const titaniumMat = new THREE.MeshPhysicalMaterial({
    color: 0x090d14,
    metalness: 0.95,
    roughness: 0.22,
    clearcoat: 0.9,
    clearcoatRoughness: 0.12,
    reflectivity: 0.8,
  });

  const bodyMesh = new THREE.Mesh(bodyGeom, titaniumMat);
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  phoneGroup.add(bodyMesh);

  // 3. Polished Metallic Chamfer Edge Rail (Chrome Accent)
  const edgeLine = new THREE.LineSegments(
    new THREE.EdgesGeometry(bodyGeom, 32),
    new THREE.LineBasicMaterial({
      color: 0x4fe6ff,
      transparent: true,
      opacity: 0.35,
    })
  );
  phoneGroup.add(edgeLine);

  // 4. Physical Side Buttons (Volume buttons on left, Power button on right)
  const btnMat = new THREE.MeshPhysicalMaterial({
    color: 0x141b24,
    metalness: 0.9,
    roughness: 0.2,
  });

  // Power button (Right)
  const powerBtn = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.72, 0.14), btnMat);
  powerBtn.position.set(width / 2 + 0.08, 1.2, 0);
  phoneGroup.add(powerBtn);

  // Volume Up & Down (Left)
  const volUp = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.55, 0.14), btnMat);
  volUp.position.set(-width / 2 - 0.08, 1.6, 0);
  phoneGroup.add(volUp);

  const volDown = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.55, 0.14), btnMat);
  volDown.position.set(-width / 2 - 0.08, 0.85, 0);
  phoneGroup.add(volDown);

  // 5. OLED Display Screen (Deep Navy matching user's game screenshot)
  const screenWidth = width - 0.38;
  const screenHeight = height - 0.42;
  const screenRadius = cornerRadius - 0.15;
  const screenShape = createRoundedRectShape(screenWidth, screenHeight, screenRadius);
  const screenGeom = new THREE.ShapeGeometry(screenShape);

  const screenZ = depth / 2 + 0.082;

  // Navy game screen material
  const screenMat = new THREE.MeshPhysicalMaterial({
    color: 0x070e1c, // Authentic deep navy from user's screenshot
    metalness: 0.1,
    roughness: 0.2,
    clearcoat: 0.95,
    clearcoatRoughness: 0.08,
  });

  const screenMesh = new THREE.Mesh(screenGeom, screenMat);
  screenMesh.position.z = screenZ;
  screenMesh.receiveShadow = true;
  phoneGroup.add(screenMesh);

  // 6. Maze Game Border inside Screen
  const mazeFrameSize = 3.65;
  const mazeFrameShape = createRoundedRectShape(mazeFrameSize, mazeFrameSize, 0.15);
  const mazeFrameGeom = new THREE.EdgesGeometry(new THREE.ShapeGeometry(mazeFrameShape));
  const mazeFrameLine = new THREE.LineSegments(
    mazeFrameGeom,
    new THREE.LineBasicMaterial({
      color: 0x0f2b48,
      transparent: true,
      opacity: 0.8,
    })
  );
  mazeFrameLine.position.set(0, -0.25, screenZ + 0.005);
  phoneGroup.add(mazeFrameLine);

  // 7. Dynamic Island / Speaker Notch
  const notchShape = createRoundedRectShape(0.92, 0.26, 0.13);
  const notchGeom = new THREE.ShapeGeometry(notchShape);
  const notchMesh = new THREE.Mesh(
    notchGeom,
    new THREE.MeshBasicMaterial({ color: 0x020406 })
  );
  notchMesh.position.set(0, height / 2 - 0.48, screenZ + 0.008);
  phoneGroup.add(notchMesh);

  // Camera lens glint inside notch
  const cameraDot = new THREE.Mesh(
    new THREE.CircleGeometry(0.045, 16),
    new THREE.MeshBasicMaterial({ color: 0x112233 })
  );
  cameraDot.position.set(0.24, height / 2 - 0.48, screenZ + 0.01);
  phoneGroup.add(cameraDot);

  // 8. Mobile Status Bar (9:41, Battery, Signal)
  function createStatusBarTexture() {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 64;
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, 512, 64);

    ctx.fillStyle = '#cbe4f7';
    ctx.font = '600 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('9:41', 28, 32);

    // Battery & Signal on right
    ctx.textAlign = 'right';
    ctx.fillText('5G  100% 🔋', 484, 32);

    const tex = new THREE.CanvasTexture(c);
    tex.minFilter = THREE.LinearFilter;
    return tex;
  }

  const statusBarSprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: createStatusBarTexture(),
      transparent: true,
      depthTest: false,
    })
  );
  statusBarSprite.position.set(0, height / 2 - 0.48, screenZ + 0.012);
  statusBarSprite.scale.set(3.4, 0.42, 1);
  phoneGroup.add(statusBarSprite);

  // 9. Bottom Home Indicator Bar (White pill)
  const homeBar = new THREE.Mesh(
    new THREE.PlaneGeometry(1.2, 0.06),
    new THREE.MeshBasicMaterial({ color: 0x88aacc, transparent: true, opacity: 0.65 })
  );
  homeBar.position.set(0, -height / 2 + 0.38, screenZ + 0.01);
  phoneGroup.add(homeBar);

  return {
    phoneGroup,
    screenWidth,
    screenHeight,
    screenZ,
    mazeFrameCenter: { x: 0, y: -0.25 },
  };
}

// Upright, Glossy 3D Game Heart (❤️❤️❤️)
export function createHeartMesh() {
  const heartShape = new THREE.Shape();
  // Exact mathematical symmetrical upright heart bezier curve
  heartShape.moveTo(0, 0.32);
  heartShape.bezierCurveTo(0, 0.55, 0.44, 0.72, 0.55, 0.4);
  heartShape.bezierCurveTo(0.65, 0.12, 0.35, -0.15, 0, -0.48);
  heartShape.bezierCurveTo(-0.35, -0.15, -0.65, 0.12, -0.55, 0.4);
  heartShape.bezierCurveTo(-0.44, 0.72, 0, 0.55, 0, 0.32);

  const geom = new THREE.ExtrudeGeometry(heartShape, {
    depth: 0.14,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: 0.05,
    bevelThickness: 0.05,
  });
  geom.center();

  // Glossy ruby red lacquer material
  const mat = new THREE.MeshPhysicalMaterial({
    color: 0xff1646,
    emissive: 0x990022,
    emissiveIntensity: 1.1,
    roughness: 0.14,
    metalness: 0.2,
    clearcoat: 1.0,
    clearcoatRoughness: 0.06,
  });

  const mesh = new THREE.Mesh(geom, mat);
  mesh.castShadow = true;
  return mesh;
}
