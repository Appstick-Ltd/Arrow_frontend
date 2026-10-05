import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { createFloatingBoardModel, createHeartMesh } from '../three/floatingBoardModel';
import { spawnColorfulSnakeMaze } from '../three/colorfulMazeBuilder';
import { COLORFUL_MAZE_ARROWS } from '../three/colorfulMazeData';

export default function Canvas3D({ onTileChange, soundEnabled, onTone }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animId;
    let autoTimer = null;
    let initialStartTimer = null;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Scene & Clean Atmosphere (Zero blinding bloom / Zero flash)
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030a12, 0.022);

    const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 180);
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
    renderer.toneMappingExposure = 1.0;
    renderer.setClearColor(0x02070c, 1);

    // 2. Pure Balanced Studio Lighting (NO point lights, NO flash, NO harsh glare)
    scene.add(new THREE.AmbientLight(0xdcf3ff, 0.85));

    const key = new THREE.DirectionalLight(0xffffff, 1.8);
    key.position.set(-6, 10, 12);
    key.castShadow = true;
    scene.add(key);

    const boardKey = new THREE.DirectionalLight(0xe8f6ff, 1.4);
    boardKey.position.set(5, 5, 10);
    scene.add(boardKey);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.6);
    fillLight.position.set(-4, -4, 6);
    scene.add(fillLight);

    // 3. Arrow Geometry Generator for mini-boards
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

    const tileMaterial = new THREE.MeshStandardMaterial({
      color: 0x1f3c55,
      metalness: 0.8,
      roughness: 0.3,
    });

    const litMaterial = new THREE.MeshStandardMaterial({
      color: 0x00f3ff,
      emissive: 0x0088aa,
      emissiveIntensity: 0.5,
      metalness: 0.3,
      roughness: 0.2,
    });

    // 4. Large, Prominent Floating 3D Puzzle Board (No phone frame, No flash)
    const { boardGroup, boardZ } = createFloatingBoardModel();
    const board = boardGroup;
    let arrowGroups = [];
    const hearts = [];
    let lives = 3;
    let escapedCount = 0;
    const totalArrows = COLORFUL_MAZE_ARROWS.length;

    // 3 Large, Glossy 3D Game Hearts floating above the board (❤️❤️❤️)
    const heartSpacing = 0.7;
    for (let h = 0; h < 3; h++) {
      const heart = createHeartMesh();
      heart.scale.setScalar(0.72);
      heart.position.set((h - 1) * heartSpacing, 3.75, boardZ + 0.06);
      board.add(heart);
      hearts.push(heart);
    }

    // Spawn the Large, Colorful Snake Maze on the board
    function spawnMaze() {
      // Clean up previous arrows
      board.children = board.children.filter((c) => !c.name.startsWith('Arrow_'));
      arrowGroups = spawnColorfulSnakeMaze(board, 1.6, { x: 0, y: -0.1 }, boardZ + 0.04);
      escapedCount = 0;
      if (onTileChange) onTileChange(0, totalArrows);
    }
    spawnMaze();

    const mobileBoard = window.innerWidth < 800;
    board.position.set(mobileBoard ? 0.0 : 4.4, mobileBoard ? -2.2 : -0.05, 0);
    board.rotation.set(-0.12, 0.18, -0.04);
    board.scale.setScalar(mobileBoard ? 0.88 : 1.25);
    scene.add(board);

    // Subtle framing orbit ring
    const orbit = new THREE.Mesh(
      new THREE.TorusGeometry(5.4, 0.01, 6, 128),
      new THREE.MeshBasicMaterial({ color: 0x00f3ff, transparent: true, opacity: 0.12 })
    );
    orbit.position.copy(board.position);
    orbit.rotation.x = 1.1;
    scene.add(orbit);

    // 5. Section 2: Mini boards in depth (z = -21)
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

    // 6. Section 3: Sequence group (z = -40)
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

    // 7. Ambient Dust Particles (Subtle, non-distracting)
    const particleCount = window.innerWidth < 800 ? 60 : 120;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(particleCount * 3);
    for (let p = 0; p < particleCount; p++) {
      pPos[p * 3] = (Math.random() - 0.5) * 44;
      pPos[p * 3 + 1] = (Math.random() - 0.5) * 25;
      pPos[p * 3 + 2] = -Math.random() * 70 - 5;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const points = new THREE.Points(
      pGeo,
      new THREE.PointsMaterial({
        color: 0x8df9ff,
        size: 0.024,
        transparent: true,
        opacity: 0.35,
        depthWrite: false,
      })
    );
    scene.add(points);

    // 8. Raycasting & Interaction Logic
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2(9, 9);
    let hoveredGroup = null;
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
        userRot.y += dx * 0.003;
        userRot.x += dy * 0.0025;
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
      } catch (x) { }
    };

    // "saper moto jabe" - True snake path-following slither escape!
    function activateArrow(group) {
      if (!group || group.userData.isEscaped) return;
      if (scrollRef.current > 0.16) return;

      const isUnblocked = group.userData.blockedBy.length === 0;

      if (isUnblocked) {
        escapedCount++;
        if (onTone) onTone(480 + escapedCount * 24, 0.2, 0.05);

        // TRUE SNAKE SLITHER: Body and tail follow each corner around the winding path
        group.userData.slitherOut(board, () => {
          // Unblock all other arrows waiting for this snake to leave
          arrowGroups.forEach((other) => {
            if (!other.userData.isEscaped) {
              other.userData.blockedBy = other.userData.blockedBy.filter(
                (bId) => bId !== group.userData.id
              );
              if (other.userData.blockedBy.length === 0) {
                // Subtle pulse to indicate it is now free
                gsap.fromTo(
                  other.scale,
                  { x: 1, y: 1, z: 1 },
                  { x: 1.05, y: 1.05, z: 1.05, duration: 0.2, yoyo: true, repeat: 1 }
                );
              }
            }
          });

          if (onTileChange) onTileChange(escapedCount, totalArrows);
          if (escapedCount >= totalArrows) solve();
        });
      } else {
        // Blocked wiggle
        if (onTone) onTone(160, 0.15, 0.06);
        group.userData.wiggleBlocked();

        // Shake lives display
        if (hearts.length > 0) {
          const activeHeart = hearts[Math.min(hearts.length - 1, Math.max(0, lives - 1))];
          gsap.fromTo(
            activeHeart.scale,
            { x: 0.9, y: 0.9, z: 0.9 },
            { x: 0.72, y: 0.72, z: 0.72, duration: 0.4, ease: 'elastic.out(1, .3)' }
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
            delay: 1.2,
            onComplete: resetPuzzle,
          });
      } else {
        setTimeout(resetPuzzle, 1400);
      }
    }

    function resetPuzzle() {
      spawnMaze();
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
      } catch (x) { }
    });

    // CONTINUOUS AUTO-ANIMATION:
    // Starts after a 2-second initial pause so the user can appreciate the full colorful puzzle first!
    let isAutoLooping = true;
    initialStartTimer = setTimeout(() => {
      autoTimer = setInterval(() => {
        if (!isAutoLooping || scrollRef.current > 0.16) return;

        const freeArrows = arrowGroups.filter(
          (g) => !g.userData.isEscaped && g.userData.blockedBy.length === 0
        );

        if (freeArrows.length > 0) {
          const targetArrow = freeArrows[0];
          activateArrow(targetArrow);
        } else {
          const remaining = arrowGroups.filter((g) => !g.userData.isEscaped);
          if (remaining.length === 0) {
            isAutoLooping = false;
            setTimeout(() => {
              resetPuzzle();
              isAutoLooping = true;
            }, 1600);
          }
        }
      }, 1300); // Relaxed, enjoyable pace: 1.3s per snake slither
    }, 2000);

    // 9. Scroll and Mouse Coordination
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

    // 10. Animation Loop
    const clock = new THREE.Clock();
    const cursor = document.querySelector('.cursor');

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      scrollRef.current += (targetScroll - scrollRef.current) * 0.05;
      const scroll = scrollRef.current;
      const hero = Math.max(0, 1 - scroll * 5.5);
      const baseX = window.innerWidth < 800 ? 0.0 : 4.4;
      const baseY = window.innerWidth < 800 ? -2.2 : -0.05;

      // Clean Floating 3D Board motion
      board.position.x += (baseX - scroll * 3.2 + mouse.x * 0.4 * hero - board.position.x) * 0.045;
      board.position.y += (baseY + Math.sin(t * 0.58) * 0.08 - mouse.y * 0.28 * hero - board.position.y) * 0.045;
      board.position.z = -scroll * 23;
      board.rotation.y += (0.18 + userRot.y + mouse.x * 0.12 * hero - board.rotation.y) * 0.025;
      board.rotation.x += (-0.12 + userRot.x + mouse.y * 0.08 * hero - board.rotation.x) * 0.025;
      board.rotation.z = -0.04 + Math.sin(t * 0.32) * 0.012;
      userRot.x *= 0.98;
      userRot.y *= 0.98;

      orbit.position.copy(board.position);
      orbit.rotation.z += reduced ? 0 : 0.0012;

      // Pulse floating hearts gently
      hearts.forEach((h, idx) => {
        h.position.y = 3.75 + Math.sin(t * 2.2 + idx * 0.8) * 0.04;
      });

      // Camera motion
      const camZ = 20 - scroll * 62;
      camera.position.z += (camZ - camera.position.z) * 0.055;
      camera.position.x += (mouse.x * 0.32 - camera.position.x) * 0.025;
      camera.position.y += (-mouse.y * 0.24 - camera.position.y) * 0.025;
      camera.lookAt(0, 0, camera.position.z - 18);

      // Hover detection on arrow groups
      if (scroll < 0.16) {
        raycaster.setFromCamera(pointer, camera);
        const allSegments = [];
        arrowGroups.forEach((g) => {
          if (!g.userData.isEscaped) {
            g.userData.segments.forEach((s) => {
              s.userData.parentGroup = g;
              allSegments.push(s);
            });
          }
        });

        const hit = raycaster.intersectObjects(allSegments, true)[0];
        let nextGroup = null;
        if (hit) {
          let curr = hit.object;
          while (curr && curr !== board) {
            if (curr.userData && curr.userData.slitherOut) {
              nextGroup = curr;
              break;
            }
            curr = curr.parent;
          }
        }

        if (nextGroup !== hoveredGroup) {
          if (hoveredGroup && !hoveredGroup.userData.isEscaped) {
            hoveredGroup.position.z = 0;
            hoveredGroup.scale.set(1, 1, 1);
          }
          hoveredGroup = nextGroup;
          if (hoveredGroup && !hoveredGroup.userData.isEscaped) {
            hoveredGroup.position.z = 0.08;
            hoveredGroup.scale.set(1.04, 1.04, 1.04);
          }
          if (cursor) cursor.classList.toggle('active', !!hoveredGroup);
        }
      }

      points.rotation.z = t * 0.002;

      // Clean Standard Render (Zero Bloom Flash / 100% Crisp Visual Clarity)
      renderer.render(scene, camera);
    };

    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 800 ? 1.25 : 1.75));
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      if (initialStartTimer) clearTimeout(initialStartTimer);
      if (autoTimer) clearInterval(autoTimer);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onWindowMouseMove);
      window.removeEventListener('scroll', onWindowScroll);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, []);

  return <canvas id="world" ref={canvasRef} aria-label="Interactive 3D arrow puzzle board" />;
}
