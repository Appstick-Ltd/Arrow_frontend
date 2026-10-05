import * as THREE from 'three';
import gsap from 'gsap';
import {
  COLORFUL_MAZE_ARROWS,
  COLOR_PALETTE,
  COLOR_EMISSIVES,
} from './colorfulMazeData';

// Creates the 3D Arrowhead geometry
function createArrowHeadGeom(headSize = 0.26) {
  const shape = new THREE.Shape();
  const hs = headSize;
  // Equilateral / isosceles triangle pointing UP (+Y)
  shape.moveTo(0, hs * 1.05);
  shape.lineTo(hs * 0.72, -hs * 0.45);
  shape.lineTo(-hs * 0.72, -hs * 0.45);
  shape.closePath();

  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: 0.12,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.03,
    bevelThickness: 0.03,
  });
  geom.center();
  return geom;
}

const cachedHeadGeom = createArrowHeadGeom(0.26);

// Build a single winding snake arrow with path-following slither animation
export function buildColorfulSnakeArrow(arrowData, scale = 1.0, center = { x: 0, y: 0 }, zPos = 0.04) {
  const group = new THREE.Group();
  group.name = `Arrow_${arrowData.id}`;

  const hexColor = COLOR_PALETTE[arrowData.colorKey] || 0x00e5ff;
  const hexEmissive = COLOR_EMISSIVES[arrowData.colorKey] || 0x006688;

  // Saturated lacquer material matching game aesthetic
  const material = new THREE.MeshPhysicalMaterial({
    color: hexColor,
    emissive: hexEmissive,
    emissiveIntensity: 1.5,
    metalness: 0.2,
    roughness: 0.12,
    clearcoat: 1.0,
    clearcoatRoughness: 0.06,
  });

  const tubeRadius = 0.082 * scale;

  // 1. Waypoints in 3D
  const waypoints = arrowData.points.map(
    ([px, py]) => new THREE.Vector3(center.x + px * scale, center.y + py * scale, zPos)
  );

  // Exit unit vector
  let exitDir = new THREE.Vector3(0, 1, 0);
  if (arrowData.dir === 'UP') exitDir.set(0, 1, 0);
  else if (arrowData.dir === 'DOWN') exitDir.set(0, -1, 0);
  else if (arrowData.dir === 'RIGHT') exitDir.set(1, 0, 0);
  else if (arrowData.dir === 'LEFT') exitDir.set(-1, 0, 0);

  // Extend path forward along exit direction for the escape slither
  const tipPos = waypoints[waypoints.length - 1];
  const extendedTip = tipPos.clone().add(exitDir.clone().multiplyScalar(12.0));
  const fullPathPoints = [...waypoints, extendedTip];

  // 2. Pre-calculate segment lengths and cumulative distances
  const segLengths = [];
  const cumDistances = [0];
  let totalRestLength = 0;

  for (let i = 0; i < fullPathPoints.length - 1; i++) {
    const d = fullPathPoints[i].distanceTo(fullPathPoints[i + 1]);
    segLengths.push(d);
    cumDistances.push(cumDistances[i] + d);
    if (i < waypoints.length - 1) {
      totalRestLength += d;
    }
  }

  // Helper to interpolate 3D position and tangent along the polyline at any distance
  function getPointOnPath(dist) {
    const maxDist = cumDistances[cumDistances.length - 1];
    const clampedDist = Math.max(0, Math.min(dist, maxDist));

    let segIdx = 0;
    for (let i = 0; i < cumDistances.length - 1; i++) {
      if (clampedDist >= cumDistances[i] && clampedDist <= cumDistances[i + 1]) {
        segIdx = i;
        break;
      }
    }

    const segLen = segLengths[segIdx];
    const alpha = segLen > 0.0001 ? (clampedDist - cumDistances[segIdx]) / segLen : 0;
    const p1 = fullPathPoints[segIdx];
    const p2 = fullPathPoints[segIdx + 1];

    const pos = new THREE.Vector3().lerpVectors(p1, p2, alpha);
    const tangent = new THREE.Vector3().subVectors(p2, p1).normalize();
    return { pos, tangent };
  }

  // 3. Generate initial curve and TubeGeometry at resting state
  function samplePathPoints(sStart, sEnd, count = 24) {
    const pts = [];
    const len = sEnd - sStart;
    for (let j = 0; j < count; j++) {
      const d = sStart + (j / (count - 1)) * len;
      pts.push(getPointOnPath(d).pos);
    }
    return pts;
  }

  const initialSamples = samplePathPoints(0, totalRestLength, 24);
  const initialCurve = new THREE.CatmullRomCurve3(initialSamples, false, 'catmullrom', 0.05);
  let tubeGeom = new THREE.TubeGeometry(initialCurve, 28, tubeRadius, 8, false);

  const tubeMesh = new THREE.Mesh(tubeGeom, material);
  tubeMesh.castShadow = true;
  group.add(tubeMesh);

  // Tail rounded sphere cap
  const tailGeom = new THREE.SphereGeometry(tubeRadius, 10, 10);
  const tailMesh = new THREE.Mesh(tailGeom, material);
  tailMesh.position.copy(initialSamples[0]);
  group.add(tailMesh);

  // Arrowhead at leading tip
  const headMesh = new THREE.Mesh(cachedHeadGeom, material);
  headMesh.scale.setScalar(scale);
  const initialHeadPt = getPointOnPath(totalRestLength);
  headMesh.position.copy(initialHeadPt.pos);

  // Initial head rotation matching exit direction
  const initialAngle = Math.atan2(initialHeadPt.tangent.y, initialHeadPt.tangent.x) - Math.PI / 2;
  headMesh.rotation.z = initialAngle;
  headMesh.castShadow = true;
  group.add(headMesh);

  // 4. Snake Slithering Out ("saper moto jabe")
  // The snake follows its own exact body path, slithering forward around every bend!
  function slitherOut(parentGroup, onComplete) {
    group.userData.isEscaped = true;

    const exitDistance = 7.5;
    const animObj = { progress: 0 };

    gsap.to(animObj, {
      progress: 1,
      duration: 0.95,
      ease: 'power2.in',
      onUpdate: () => {
        const p = animObj.progress;
        const headDist = totalRestLength + p * exitDistance;
        // Tail catches up smoothly, slithering along every single bend of the path
        const tailDist = p * (totalRestLength + exitDistance);
        const currentLength = headDist - tailDist;

        if (currentLength < 0.08 || tailDist >= totalRestLength + exitDistance) {
          tubeMesh.visible = false;
          headMesh.visible = false;
          tailMesh.visible = false;
          return;
        }

        // Resample along current visible body interval [tailDist, headDist]
        const currentSamples = samplePathPoints(tailDist, headDist, 24);
        const newCurve = new THREE.CatmullRomCurve3(currentSamples, false, 'catmullrom', 0.05);

        tubeMesh.geometry.dispose();
        tubeMesh.geometry = new THREE.TubeGeometry(newCurve, 24, tubeRadius, 8, false);

        // Advance Arrowhead at leading tip
        const currentHead = getPointOnPath(headDist);
        headMesh.position.copy(currentHead.pos);
        const currentAngle = Math.atan2(currentHead.tangent.y, currentHead.tangent.x) - Math.PI / 2;
        headMesh.rotation.z = currentAngle;

        // Advance Tail cap along the exact path
        const currentTail = getPointOnPath(tailDist);
        tailMesh.position.copy(currentTail.pos);
      },
      onComplete: () => {
        parentGroup.remove(group);
        if (tubeMesh.geometry) tubeMesh.geometry.dispose();
        if (onComplete) onComplete();
      },
    });
  }

  // Wiggle error reaction when tapped while blocked
  function wiggleBlocked() {
    const nudge = exitDir.clone().multiplyScalar(0.14);
    gsap
      .timeline()
      .to(group.position, {
        x: nudge.x,
        y: nudge.y,
        duration: 0.08,
        ease: 'power2.out',
      })
      .to(group.position, {
        x: -nudge.x * 0.4,
        y: -nudge.y * 0.4,
        duration: 0.08,
      })
      .to(group.position, {
        x: 0,
        y: 0,
        duration: 0.1,
      });
  }

  group.userData = {
    id: arrowData.id,
    dir: arrowData.dir,
    blockedBy: [...arrowData.blockedBy],
    isEscaped: false,
    material,
    segments: [tubeMesh, headMesh, tailMesh],
    slitherOut,
    wiggleBlocked,
    tipPoint: { x: tipPos.x, y: tipPos.y },
  };

  return group;
}

// Spawns the entire colorful snake maze
export function spawnColorfulSnakeMaze(parentGroup, scale = 1.05, center = { x: 0, y: 0 }, zPos = 0.04) {
  const arrowGroups = [];

  COLORFUL_MAZE_ARROWS.forEach((arrowData) => {
    const snakeGroup = buildColorfulSnakeArrow(arrowData, scale, center, zPos);
    parentGroup.add(snakeGroup);
    arrowGroups.push(snakeGroup);
  });

  return arrowGroups;
}
