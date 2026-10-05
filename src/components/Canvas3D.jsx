import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { AUTHENTIC_MAZE_ARROWS } from '../three/authenticMazeData';
import { createHeartMesh, createWindingArrowGroup } from '../three/mazeGeometry';

export default function Canvas3D({ onTileChange, soundEnabled, onTone }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animId;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Scene & Atmosphere
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x02080b, 0.028);

    const camera = new THREE.PerspectiveCamera(44, window.innerWidth / window.innerHeight, 0.1, 180);
    camera.position.set(0, 0, 20);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 800 ? 1.25 : 1.75));
    renderer.shadowMap.enabled = window.innerWidth > 800;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.setClearColor(0x020608, 1);

    // 2. Post-processing Bloom (Tasteful, silky neon aura without harsh glare)
    let composer = null;
    if (window.innerWidth > 800) {
      try {
        composer = new EffectComposer(renderer);
        composer.addPass(new RenderPass(scene, camera));
        composer.addPass(
          new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            0.32,
            0.42,
            0.72
          )
        );
      } catch (e) {
        composer = null;
      }
    }

    // 3. Cinematic Studio Lights (Clean, balanced illumination — NO blinding hotspots)
    scene.add(new THREE.HemisphereLight(0xc4f5ff, 0x05131d, 0.85));

    const key = new THREE.DirectionalLight(0xe7fcff, 2.2);
    key.position.set(-6, 10, 12);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.left = -12;
    key.shadow.camera.right = 12;
    key.shadow.camera.top = 12;
    key.shadow.camera.bottom = -12;
    scene.add(key);

    // Dedicated Balanced Studio Light for Maze Board
    const boardKey = new THREE.DirectionalLight(0xe0f7ff, 2.8);
    boardKey.position.set(5.5, 4.5, 9.5);
    scene.add(boardKey);

    // Soft Electric Cyan Accent Fill (uniform, non-blinding)
    const boardCyanAccent = new THREE.DirectionalLight(0x00d4ff, 1.4);
    boardCyanAccent.position.set(7.5, 1.5, 6.0);
    scene.add(boardCyanAccent);

    // Electric cyan under-fill light
    const boardBottomFill = new THREE.DirectionalLight(0x38bdf8, 1.6);
    boardBottomFill.position.set(2.5, -4.5, 8.0);
    scene.add(boardBottomFill);

    const rim = new THREE.PointLight(0x31eaff, 2.6, 26);
    rim.position.set(8, -2, 3);
    scene.add(rim);

    // 4. Arrow Geometry Generator for background elements
    function createArrowGeometry(scale = 1, depth = 0.34) {
      const s = scale;
      const d = depth;
      const shape = new THREE.Shape();
      shape.moveTo(-1.22 * s, -0.33 * s);
      shape.lineTo(0.24 * s, -0.33 * s);
      shape.lineTo(0.24 * s, -0.80 * s);
      shape.lineTo(1.34 * s, 0);
      shape.lineTo(0.24 * s, 0.80 * s);
      shape.lineTo(0.24 * s, 0.33 * s);
      shape.lineTo(-1.22 * s, 0.33 * s);
      shape.closePath();

      const geom = new THREE.ExtrudeGeometry(shape, {
        depth: d,
        bevelEnabled: true,
        bevelSegments: 3,
        steps: 1,
        bevelSize: 0.075 * s,
        bevelThickness: 0.07 * s,
      });
      geom.center();
      return geom;
    }

    const arrowGeo = createArrowGeometry(0.52, 0.34);

    // Default titanium slate arrow material (high-contrast, crisp specular sheen)
    const defaultArrowMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x1f3c55,
      metalness: 0.88,
      roughness: 0.16,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      emissive: 0x092b3f,
      emissiveIntensity: 0.75,
    });

    // Lit electric cyan arrow material (blinding neon bloom)
    const litArrowMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xf0feff,
      metalness: 0.25,
      roughness: 0.06,
      clearcoat: 1.0,
      emissive: 0x00f3ff,
      emissiveIntensity: 2.8,
    });

    const tileMaterial = defaultArrowMaterial;
    const litMaterial = litArrowMaterial;

    // 5. Authentic Arrow Labyrinth Board (Matching the Mobile Game)
    const board = new THREE.Group();
    const arrowGroups = [];
    const hearts = [];
    let lives = 3;
    let escapedCount = 0;
    const totalArrows = AUTHENTIC_MAZE_ARROWS.length;

    // Board Backing Tray (Physical Dark Carbon/Obsidian Cyber Console)
    const boardW = 9.2;
    const boardH = 9.4;
    const back = new THREE.Mesh(
      new THREE.BoxGeometry(boardW, boardH, 0.36),
      new THREE.MeshPhysicalMaterial({
        color: 0x07111a,
        metalness: 0.9,
        roughness: 0.25,
        clearcoat: 1.0,
        clearcoatRoughness: 0.12,
        transparent: true,
        opacity: 0.95,
      })
    );
    back.position.z = -0.45;
    back.castShadow = true;
    back.receiveShadow = true;
    board.add(back);

    // Outer Glowing Frame Border
    const backEdge = new THREE.LineSegments(
      new THREE.EdgesGeometry(back.geometry),
      new THREE.LineBasicMaterial({
        color: 0x00f3ff,
        transparent: true,
        opacity: 0.55,
      })
    );
    backEdge.position.copy(back.position);
    board.add(backEdge);

    // Cybernetic Corner Brackets
    const bracketMat = new THREE.LineBasicMaterial({
      color: 0x00f3ff,
      transparent: true,
      opacity: 0.85,
    });
    const bracketSize = 0.95;
    const halfW = boardW / 2;
    const halfH = boardH / 2;
    const corners = [
      [-halfW, halfH],
      [halfW, halfH],
      [halfW, -halfH],
      [-halfW, -halfH],
    ];
    corners.forEach(([cx, cy]) => {
      const dirX = cx > 0 ? -1 : 1;
      const dirY = cy > 0 ? -1 : 1;
      const bracketPts = [
        new THREE.Vector3(cx, cy + dirY * bracketSize, -0.2),
        new THREE.Vector3(cx, cy, -0.2),
        new THREE.Vector3(cx + dirX * bracketSize, cy, -0.2),
      ];
      const bracketGeo = new THREE.BufferGeometry().setFromPoints(bracketPts);
      board.add(new THREE.Line(bracketGeo, bracketMat));
    });

    // Subtle Holographic Grid matrix lines on the board surface
    const gridLinesMat = new THREE.LineBasicMaterial({
      color: 0x00f3ff,
      transparent: true,
      opacity: 0.08,
    });
    for (let gx = -3.6; gx <= 3.6; gx += 1.2) {
      const gPts = [new THREE.Vector3(gx, -3.8, -0.25), new THREE.Vector3(gx, 3.8, -0.25)];
      board.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(gPts), gridLinesMat));
    }
    for (let gy = -3.6; gy <= 3.6; gy += 1.2) {
      const gPts = [new THREE.Vector3(-3.8, gy, -0.25), new THREE.Vector3(3.8, gy, -0.25)];
      board.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(gPts), gridLinesMat));
    }

    // Cybernetic Header Dock for the 3 Lives Hearts (matching ❤️❤️❤️ from game screenshot)
    const dockGeo = new THREE.BoxGeometry(2.35, 0.74, 0.1);
    const dockMesh = new THREE.Mesh(
      dockGeo,
      new THREE.MeshPhysicalMaterial({
        color: 0x050e16,
        metalness: 0.9,
        roughness: 0.2,
        clearcoat: 0.9,
        transparent: true,
        opacity: 0.85,
      })
    );
    dockMesh.position.set(0, 4.02, 0.05);
    board.add(dockMesh);

    const dockEdge = new THREE.LineSegments(
      new THREE.EdgesGeometry(dockGeo),
      new THREE.LineBasicMaterial({ color: 0x00f3ff, transparent: true, opacity: 0.45 })
    );
    dockEdge.position.copy(dockMesh.position);
    board.add(dockEdge);

    const heartSpacing = 0.65;
    for (let h = 0; h < 3; h++) {
      const heart = createHeartMesh();
      heart.position.set((h - 1) * heartSpacing, 4.02, 0.18);
      board.add(heart);
      hearts.push(heart);
    }

    // Materials dictionary for winding arrows
    const arrowMaterials = {
      default: defaultArrowMaterial,
      lit: litArrowMaterial,
    };

    // Build and add the 26 Authentic Winding Arrows
    function spawnMazeArrows() {
      AUTHENTIC_MAZE_ARROWS.forEach((arrowData) => {
        const group = createWindingArrowGroup(arrowData, arrowMaterials);
        board.add(group);
        arrowGroups.push(group);
      });
      if (onTileChange) onTileChange(0, totalArrows);
    }
    spawnMazeArrows();

    // High-Resolution Neon Level Tag Badge
    function addLevelBadge() {
      const c = document.createElement('canvas');
      c.width = 360;
      c.height = 72;
      const ctx = c.getContext('2d');
      ctx.clearRect(0, 0, 360, 72);

      ctx.fillStyle = 'rgba(4, 24, 38, 0.85)';
      ctx.strokeStyle = '#00f3ff';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(10, 8, 340, 56, 10);
      ctx.fill();
      ctx.stroke();

      ctx.shadowColor = '#00f3ff';
      ctx.shadowBlur = 8;
      ctx.font = '700 24px Chakra Petch, sans-serif';
      ctx.letterSpacing = '5px';
      ctx.fillStyle = '#00f3ff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('UNTANGLE // PROTOCOL', 180, 36);

      const tex = new THREE.CanvasTexture(c);
      tex.minFilter = THREE.LinearFilter;
      const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false })
      );
      sprite.position.set(0, -4.15, 0.25);
      sprite.scale.set(2.4, 0.48, 1);
      sprite.renderOrder = 6;
      board.add(sprite);
    }
    addLevelBadge();

    const mobileBoard = window.innerWidth < 800;
    board.position.set(mobileBoard ? 0.55 : 5.15, mobileBoard ? -2.35 : -0.1, 0);
    board.rotation.set(-0.16, 0.25, -0.08);
    if (mobileBoard) board.scale.setScalar(0.62);
    scene.add(board);

    // Orbit torus ring
    const orbit = new THREE.Mesh(
      new THREE.TorusGeometry(5.95, 0.012, 6, 128),
      new THREE.MeshBasicMaterial({ color: 0x41efff, transparent: true, opacity: 0.18 })
    );
    orbit.position.copy(board.position);
    orbit.rotation.x = 1.1;
    scene.add(orbit);

    // 6. Section 2: Mini boards in depth (z = -21)
    function createMiniBoard(x, y, z, scale, complexity) {
      const g = new THREE.Group();
      for (let j = 0; j < complexity; j++) {
        const m = new THREE.Mesh(arrowGeo, j % 5 === 0 ? litMaterial : tileMaterial);
        m.scale.setScalar(0.3);
        const cols = complexity > 12 ? 4 : 3;
        const row = Math.floor(j / cols);
        m.position.set((j % cols - (cols - 1) / 2) * 0.7, (Math.ceil(complexity / cols) - 1 - row) * 0.65, 0);
        m.rotation.z = (((j * 3 + complexity) % 4) * Math.PI) / 2;
        g.add(m);
      }
      g.position.set(x, y, z);
      g.scale.setScalar(scale);
      g.rotation.set(0.16, (x / 10) * 0.6, 0.08);
      scene.add(g);
      return g;
    }
    const levelBoards = [
      createMiniBoard(-5, -2.1, -21, 1.35, 9),
      createMiniBoard(0, -2.25, -21, 1.45, 12),
      createMiniBoard(5, -2.1, -21, 1.5, 16),
    ];

    // 7. Section 3: Sequence group (z = -40)
    const sequenceGroup = new THREE.Group();
    for (let q = 0; q < 15; q++) {
      const qm = new THREE.Mesh(arrowGeo, q % 4 === 0 ? litMaterial : tileMaterial);
      qm.position.set((q % 5 - 2) * 1.65, (1 - Math.floor(q / 5)) * 1.65, (q % 3) * 0.35);
      qm.rotation.set((q % 2) * 0.08, ((q + 1) % 3) * 0.08, ((q * 3) % 4) * (Math.PI / 2));
      sequenceGroup.add(qm);
    }
    sequenceGroup.position.set(-4.7, 0, -40);
    sequenceGroup.rotation.set(0.05, -0.32, -0.05);
    scene.add(sequenceGroup);

    // 8. Section 4: Giant Monolith Arrow (z = -59)
    const giant = new THREE.Mesh(createArrowGeometry(2.15, 0.75), litMaterial);
    giant.position.set(0, 0, -59);
    giant.rotation.set(0.15, 0.45, 0);
    giant.castShadow = true;
    scene.add(giant);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(5.8, 0.015, 8, 140),
      new THREE.MeshBasicMaterial({ color: 0x43efff, transparent: true, opacity: 0.14 })
    );
    ring.position.copy(giant.position);
    ring.rotation.x = 1.35;
    scene.add(ring);

    // 9. Ambient Star-Dust Particles (Clean, atmospheric deep-space field)
    const particleCount = window.innerWidth < 800 ? 120 : 310;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(particleCount * 3);
    for (let p = 0; p < particleCount; p++) {
      pPos[p * 3] = (Math.random() - 0.5) * 44;
      pPos[p * 3 + 1] = (Math.random() - 0.5) * 25;
      pPos[p * 3 + 2] = -Math.random() * 80 + 12;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const points = new THREE.Points(
      pGeo,
      new THREE.PointsMaterial({
        color: 0x8df9ff,
        size: 0.032,
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    scene.add(points);

    // Volumetric beam
    const beam = new THREE.Mesh(
      new THREE.CylinderGeometry(0.25, 3, 30, 20, 1, true),
      new THREE.MeshBasicMaterial({
        color: 0x43efff,
        transparent: true,
        opacity: 0.018,
        side: THREE.DoubleSide,
        depthWrite: false,
      })
    );
    beam.position.set(7, 8, -8);
    beam.rotation.z = 0.58;
    scene.add(beam);

    // 10. Raycasting & Drag Interaction
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2(9, 9);
    let hovered = null;
    let drag = false;
    let moved = false;
    let lastX = 0;
    let lastY = 0;
    const userRot = { x: 0, y: 0 };

    function ndc(e) {
      const r = canvas.getBoundingClientRect();
      pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      pointer.y = -((e.clientY - r.top) / r.height) * 2 + 1;
    }

    const onPointerMove = (e) => {
      ndc(e);
      if (drag) {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        if (Math.abs(dx) + Math.abs(dy) > 2) moved = true;
        userRot.y += dx * 0.004;
        userRot.x += dy * 0.003;
        lastX = e.clientX;
        lastY = e.clientY;
      }
    };

    const onPointerDown = (e) => {
      drag = true;
      moved = false;
      lastX = e.clientX;
      lastY = e.clientY;
      ndc(e);
      try {
        canvas.setPointerCapture(e.pointerId);
      } catch (x) {}
    };

    const onPointerUp = (e) => {
      drag = false;
      if (!moved) activateTile();
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch (x) {}
    };
    function burstAt(pos) {
      const pulse = new THREE.Mesh(
        new THREE.RingGeometry(0.12, 0.28, 32),
        new THREE.MeshBasicMaterial({
          color: 0x00f3ff,
          transparent: true,
          opacity: 0.95,
          side: THREE.DoubleSide,
          depthTest: false,
        })
      );
      pulse.position.copy(pos);
      pulse.position.z += 0.35;
      board.add(pulse);

      gsap.to(pulse.scale, { x: 8, y: 8, z: 8, duration: 0.55, ease: 'power2.out' });
      gsap.to(pulse.material, {
        opacity: 0,
        duration: 0.55,
        onComplete: () => {
          board.remove(pulse);
          pulse.geometry.dispose();
          pulse.material.dispose();
        },
      });
    }

    function activateArrow(group) {
      if (!group || group.userData.isEscaped) return;
      if (scrollRef.current > 0.16) return;

      const isUnblocked = group.userData.blockedBy.length === 0;

      if (isUnblocked) {
        // SUCCESS: Arrow escapes along its trajectory!
        group.userData.isEscaped = true;
        escapedCount++;

        if (onTone) onTone(520 + escapedCount * 18, 0.25, 0.05);
        burstAt(group.position);

        const [vx, vy] = group.userData.exitVector;
        gsap.to(group.position, {
          x: group.position.x + vx * 1.5,
          y: group.position.y + vy * 1.5,
          z: group.position.z + 1.8,
          duration: 0.55,
          ease: 'power3.in',
        });
        gsap.to(group.scale, {
          x: 0.1,
          y: 0.1,
          z: 0.1,
          duration: 0.55,
          ease: 'power2.in',
          onComplete: () => {
            board.remove(group);
          },
        });

        // Unblock all other arrows waiting for this arrow to escape!
        arrowGroups.forEach((other) => {
          if (!other.userData.isEscaped) {
            other.userData.blockedBy = other.userData.blockedBy.filter(
              (bId) => bId !== group.userData.id
            );
            if (other.userData.blockedBy.length === 0) {
              // Highlight that this arrow is now free!
              other.userData.segments.forEach((m) => {
                m.material.color.setHex(0xe0f7ff);
                m.material.emissive.setHex(0x00f3ff);
                m.material.emissiveIntensity = 1.8;
              });
            }
          }
        });

        if (onTileChange) onTileChange(escapedCount, totalArrows);
        if (escapedCount >= totalArrows) solve();
      } else {
        // BLOCKED / COLLISION: Error reaction
        if (onTone) onTone(160, 0.15, 0.06);

        const dir = group.userData.dir;
        const nudgeX = dir === 'RIGHT' ? 0.22 : dir === 'LEFT' ? -0.22 : 0;
        const nudgeY = dir === 'UP' ? 0.22 : dir === 'DOWN' ? -0.22 : 0;

        // Flash warning crimson red
        group.userData.segments.forEach((m) => {
          m.material.color.setHex(0xff1e56);
          m.material.emissive.setHex(0xff0033);
          m.material.emissiveIntensity = 3.2;
        });

        gsap
          .timeline()
          .to(group.position, {
            x: group.userData.baseX + nudgeX,
            y: group.userData.baseY + nudgeY,
            duration: 0.08,
            ease: 'power2.out',
          })
          .to(group.position, {
            x: group.userData.baseX - nudgeX * 0.4,
            y: group.userData.baseY - nudgeY * 0.4,
            duration: 0.08,
          })
          .to(group.position, {
            x: group.userData.baseX,
            y: group.userData.baseY,
            duration: 0.12,
            onComplete: () => {
              group.userData.segments.forEach((m) => {
                m.material.color.setHex(0x1f3c55);
                m.material.emissive.setHex(0x092b3f);
                m.material.emissiveIntensity = 0.75;
              });
            },
          });

        // Shake lives display
        if (hearts.length > 0) {
          const activeHeart = hearts[Math.min(hearts.length - 1, Math.max(0, lives - 1))];
          gsap.fromTo(
            activeHeart.scale,
            { x: 1.15, y: 1.15, z: 1.15 },
            { x: 0.7, y: 0.7, z: 0.7, duration: 0.4, ease: 'elastic.out(1, .3)' }
          );
        }
      }
    }

    function solve() {
      if (onTone) onTone(780, 0.75, 0.075);
      const solvedEl = document.querySelector('.solved');
      if (solvedEl) {
        gsap
          .timeline()
          .to(solvedEl, { opacity: 1, duration: 0.4 })
          .fromTo(
            solvedEl.querySelector('strong'),
            { scale: 0.8, letterSpacing: '.22em' },
            { scale: 1, letterSpacing: '.08em', duration: 0.7, ease: 'expo.out' },
            '<'
          )
          .to(camera.position, { z: 18.2, duration: 0.8, ease: 'power2.inOut' }, '<')
          .to(solvedEl, {
            opacity: 0,
            duration: 0.55,
            delay: 1.5,
            onComplete: resetPuzzle,
          });
      }
    }

    function resetPuzzle() {
      // Clean up escaped arrows and respawn full maze
      board.children = board.children.filter((c) => !c.name.startsWith('Arrow_'));
      arrowGroups.length = 0;
      escapedCount = 0;
      AUTHENTIC_MAZE_ARROWS.forEach((arrowData) => {
        const group = createWindingArrowGroup(arrowData, arrowMaterials);
        board.add(group);
        arrowGroups.push(group);
      });
      if (onTileChange) onTileChange(0, totalArrows);
    }

    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointerup', (e) => {
      drag = false;
      if (!moved && hoveredGroup) {
        activateArrow(hoveredGroup);
      }
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch (x) {}
    });

    // 11. Scroll and Mouse Coordination
    const mouse = { x: 0, y: 0 };
    const onWindowMouseMove = (e) => {
      mouse.x = e.clientX / window.innerWidth - 0.5;
      mouse.y = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener('pointermove', onWindowMouseMove);

    const scrollRef = { current: 0 };
    let targetScroll = 0;
    const onWindowScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      targetScroll = max ? window.scrollY / max : 0;
    };
    window.addEventListener('scroll', onWindowScroll, { passive: true });

    // 12. Animation Loop
    const clock = new THREE.Clock();
    const cursor = document.querySelector('.cursor');
    let hoveredGroup = null;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      scrollRef.current += (targetScroll - scrollRef.current) * 0.05;
      const scroll = scrollRef.current;
      const hero = Math.max(0, 1 - scroll * 5.5);
      const baseX = window.innerWidth < 800 ? 0.55 : 5.15;
      const baseY = window.innerWidth < 800 ? -2.35 : -0.1;

      // Board motion
      board.position.x += (baseX - scroll * 3.2 + mouse.x * 0.52 * hero - board.position.x) * 0.045;
      board.position.y += (baseY + Math.sin(t * 0.58) * 0.08 - mouse.y * 0.34 * hero - board.position.y) * 0.045;
      board.position.z = -scroll * 23;
      board.rotation.y += (0.25 + userRot.y + mouse.x * 0.16 * hero - board.rotation.y) * 0.025;
      board.rotation.x += (-0.16 + userRot.x + mouse.y * 0.11 * hero - board.rotation.x) * 0.025;
      board.rotation.z = -0.08 + Math.sin(t * 0.32) * 0.015;
      userRot.x *= 0.98;
      userRot.y *= 0.98;

      orbit.position.copy(board.position);
      orbit.rotation.z += reduced ? 0 : 0.0012;

      // Pulse floating hearts
      hearts.forEach((h, idx) => {
        h.position.y = 4.05 + Math.sin(t * 2.2 + idx * 0.8) * 0.04;
      });

      // Camera motion
      const camZ = 20 - scroll * 62;
      camera.position.z += (camZ - camera.position.z) * 0.055;
      camera.position.x += (mouse.x * 0.32 - camera.position.x) * 0.025;
      camera.position.y += (-mouse.y * 0.24 - camera.position.y) * 0.025;
      camera.lookAt(0, 0, camera.position.z - 18);

      rim.position.z = camera.position.z - 8;
      rim.position.x = 7 + mouse.x * 3;

      // Hover detection across authentic maze arrows
      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(board.children, true);
      let foundGroup = null;
      for (let hit of intersects) {
        if (hit.object.userData && hit.object.userData.parentArrowGroup) {
          const g = hit.object.userData.parentArrowGroup;
          if (!g.userData.isEscaped) {
            foundGroup = g;
            break;
          }
        }
      }

      const nextGroup = foundGroup && scroll < 0.16 ? foundGroup : null;
      if (nextGroup !== hoveredGroup) {
        if (hoveredGroup && !hoveredGroup.userData.isEscaped) {
          gsap.to(hoveredGroup.position, { z: hoveredGroup.userData.baseZ, duration: 0.25 });
          const isFree = hoveredGroup.userData.blockedBy.length === 0;
          hoveredGroup.userData.segments.forEach((m) => {
            m.material.color.setHex(isFree ? 0xd0f0ff : 0x1f3c55);
            m.material.emissive.setHex(isFree ? 0x00f3ff : 0x092b3f);
            m.material.emissiveIntensity = isFree ? 1.4 : 0.75;
          });
        }
        hoveredGroup = nextGroup;
        if (hoveredGroup && !hoveredGroup.userData.isEscaped) {
          gsap.to(hoveredGroup.position, { z: hoveredGroup.userData.baseZ + 0.16, duration: 0.25 });
          hoveredGroup.userData.segments.forEach((m) => {
            m.material.color.setHex(0xf0feff);
            m.material.emissive.setHex(0x00f3ff);
            m.material.emissiveIntensity = 2.8;
          });
        }
        if (cursor) cursor.classList.toggle('active', !!hoveredGroup);
      }

      // Disassemble on scroll
      arrowGroups.forEach((g, i) => {
        if (!g.userData.isEscaped) {
          if (g !== hoveredGroup) {
            g.position.z = g.userData.baseZ + Math.sin(t * 0.7 + i * 0.4) * 0.015;
          }
          const separation = Math.max(0, (scroll - 0.05) * 2.2);
          g.position.x = g.userData.baseX + (g.userData.baseX * 0.22) * separation;
          g.position.y = g.userData.baseY + (g.userData.baseY * 0.18) * separation;
        }
      });

      levelBoards.forEach((g, i) => {
        g.rotation.y += reduced ? 0 : 0.0012 * (i % 2 ? 1 : -1);
        g.position.y += Math.sin(t * 0.45 + i) * 0.0008;
      });

      sequenceGroup.rotation.y = 0.08 * Math.sin(t * 0.28);
      sequenceGroup.children.forEach((m, i) => {
        m.position.z = (i % 3) * 0.35 + Math.sin(t * 0.55 + i) * 0.05;
        m.rotation.z += reduced ? 0 : (i % 2 ? 1 : -1) * 0.0015;
      });

      giant.rotation.y += reduced ? 0 : 0.003;
      giant.rotation.z = Math.sin(t * 0.26) * 0.13;
      ring.rotation.z += reduced ? 0 : 0.001;

      // Section 3 sequence text highlight
      const wordIndex = Math.min(2, Math.max(0, Math.floor((scroll - 0.49) / 0.065)));
      document.querySelectorAll('.sequence h2 span').forEach((el, i) => {
        el.classList.toggle('active', i === wordIndex);
      });

      points.rotation.z = t * 0.003;
      beam.material.opacity = 0.014 + 0.008 * Math.sin(t * 0.6);

      if (composer) {
        composer.render();
      } else {
        renderer.render(scene, camera);
      }
    };

    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 800 ? 1.25 : 1.75));
      if (composer) composer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointermove', onWindowMouseMove);
      window.removeEventListener('scroll', onWindowScroll);
      window.removeEventListener('resize', onResize);
      if (composer) composer.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas id="world" ref={canvasRef} aria-label="Interactive 3D arrow puzzle board" />;
}
