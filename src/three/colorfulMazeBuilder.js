import * as THREE from 'three';
import gsap from 'gsap';
import {
  COLORFUL_MAZE_ARROWS,
  COLOR_PALETTE,
} from './colorfulMazeData';

// Creates 3D Arrowhead geometry
function createArrowHeadGeom(headSize = 0.38) {
  const shape = new THREE.Shape();
  const hs = headSize;
  shape.moveTo(0, hs * 1.05);
  shape.lineTo(hs * 0.72, -hs * 0.45);
  shape.lineTo(-hs * 0.72, -hs * 0.45);
  shape.closePath();

  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: 0.16,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.04,
    bevelThickness: 0.04,
  });
  geom.center();
  return geom;
}

const cachedHeadGeom = createArrowHeadGeom(0.38);

// Builds an authentic snake arrow with true piecewise sub-polyline slither
export function buildColorfulSnakeArrow(arrowData, scale = 1.6, center = { x: 0, y: 0 }, zPos = 0.04) {
  const group = new THREE.Group();
  group.name = `Arrow_${arrowData.id}`;

  const hexColor = COLOR_PALETTE[arrowData.colorKey] || 0x00e5ff;

  // Vibrant saturated material without blinding over-glow
  const material = new THREE.MeshStandardMaterial({
    color: hexColor,
    emissive: hexColor,
    emissiveIntensity: 0.35, // Rich, vibrant, eye-catching glow with ZERO flash
    roughness: 0.25,
    metalness: 0.3,
  });

  const tubeRadius = 0.115;

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

  // Extended path for exiting
  const tipPos = waypoints[waypoints.length - 1];
  const extendedTip = tipPos.clone().add(exitDir.clone().multiplyScalar(15.0));
  const fullPath = [...waypoints, extendedTip];

  // 2. Pre-calculate segment lengths & cumulative distances
  const segLengths = [];
  const cumDistances = [0];
  let totalRestLength = 0;

  for (let i = 0; i < fullPath.length - 1; i++) {
    const d = fullPath[i].distanceTo(fullPath[i + 1]);
    segLengths.push(d);
    cumDistances.push(cumDistances[i] + d);
    if (i < waypoints.length - 1) {
      totalRestLength += d;
    }
  }

  const maxDist = cumDistances[cumDistances.length - 1];

  function getPointAndTangent(d) {
    const clamped = Math.max(0, Math.min(d, maxDist));
    let idx = 0;
    for (let i = 0; i < cumDistances.length - 1; i++) {
      if (clamped >= cumDistances[i] && clamped <= cumDistances[i + 1]) {
        idx = i;
        break;
      }
    }
    const len = segLengths[idx];
    const alpha = len > 0.0001 ? (clamped - cumDistances[idx]) / len : 0;
    const pos = new THREE.Vector3().lerpVectors(fullPath[idx], fullPath[idx + 1], alpha);
    const tangent = new THREE.Vector3().subVectors(fullPath[idx + 1], fullPath[idx]).normalize();
    return { pos, tangent, segIdx: idx };
  }

  // 3. Dynamic container for segments
  const bodyContainer = new THREE.Group();
  group.add(bodyContainer);

  const headMesh = new THREE.Mesh(cachedHeadGeom, material);
  headMesh.castShadow = true;
  group.add(headMesh);

  // Rebuilds sub-polyline between dTail and dHead
  function renderSubPolyline(dTail, dHead) {
    // Clear previous segment meshes
    while (bodyContainer.children.length > 0) {
      const child = bodyContainer.children[0];
      bodyContainer.remove(child);
      if (child.geometry) child.geometry.dispose();
    }

    if (dHead <= dTail || dTail >= totalRestLength + 12.0) {
      headMesh.visible = false;
      return;
    }

    headMesh.visible = true;

    // Collect all vertices on the polyline between dTail and dHead
    const startInfo = getPointAndTangent(dTail);
    const endInfo = getPointAndTangent(dHead);

    const subPts = [startInfo.pos];

    // Add intermediate fullPath corners between startInfo.segIdx and endInfo.segIdx
    for (let k = startInfo.segIdx + 1; k <= endInfo.segIdx; k++) {
      subPts.push(fullPath[k].clone());
    }

    subPts.push(endInfo.pos);

    // Build straight cylinder tubes between consecutive points
    for (let i = 0; i < subPts.length - 1; i++) {
      const p1 = subPts[i];
      const p2 = subPts[i + 1];
      const dist = p1.distanceTo(p2);
      if (dist < 0.015) continue;

      const cylGeom = new THREE.CylinderGeometry(tubeRadius, tubeRadius, dist, 14);
      const cylMesh = new THREE.Mesh(cylGeom, material);
      cylMesh.position.set((p1.x + p2.x) / 2, (p1.y + p2.y) / 2, zPos);

      const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) - Math.PI / 2;
      cylMesh.rotation.z = angle;
      cylMesh.castShadow = true;
      bodyContainer.add(cylMesh);
    }

    // Build corner spheres at interior joints
    for (let i = 1; i < subPts.length - 1; i++) {
      const jointGeom = new THREE.SphereGeometry(tubeRadius, 12, 12);
      const jointMesh = new THREE.Mesh(jointGeom, material);
      jointMesh.position.copy(subPts[i]);
      bodyContainer.add(jointMesh);
    }

    // Tail sphere cap
    const tailGeom = new THREE.SphereGeometry(tubeRadius, 12, 12);
    const tailMesh = new THREE.Mesh(tailGeom, material);
    tailMesh.position.copy(subPts[0]);
    bodyContainer.add(tailMesh);

    // Position and rotate Arrowhead at end
    headMesh.position.copy(endInfo.pos);
    const headAngle = Math.atan2(endInfo.tangent.y, endInfo.tangent.x) - Math.PI / 2;
    headMesh.rotation.z = headAngle;
  }

  // Initial render at rest
  renderSubPolyline(0, totalRestLength);

  // 4. True Snake Slither Escape ("saper moto jabe")
  function slitherOut(parentGroup, onComplete) {
    group.userData.isEscaped = true;

    const exitDistance = 8.5;
    const animObj = { progress: 0 };

    gsap.to(animObj, {
      progress: 1,
      duration: 1.05,
      ease: 'power2.in',
      onUpdate: () => {
        const p = animObj.progress;
        // Head advances forward into exit corridor
        const curHead = totalRestLength + p * exitDistance;
        // Tail catches up around every corner
        const curTail = p * (totalRestLength + exitDistance);

        renderSubPolyline(curTail, curHead);
      },
      onComplete: () => {
        parentGroup.remove(group);
        if (onComplete) onComplete();
      },
    });
  }

  // Wiggle error reaction when tapped while blocked
  function wiggleBlocked() {
    const nudge = exitDir.clone().multiplyScalar(0.18);
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
    slitherOut,
    wiggleBlocked,
    tipPoint: { x: tipPos.x, y: tipPos.y },
    segments: [headMesh, bodyContainer],
  };

  return group;
}

// Spawns the entire colorful snake maze
export function spawnColorfulSnakeMaze(parentGroup, scale = 1.6, center = { x: 0, y: 0 }, zPos = 0.04) {
  const arrowGroups = [];

  COLORFUL_MAZE_ARROWS.forEach((arrowData) => {
    const snakeGroup = buildColorfulSnakeArrow(arrowData, scale, center, zPos);
    parentGroup.add(snakeGroup);
    arrowGroups.push(snakeGroup);
  });

  return arrowGroups;
}
