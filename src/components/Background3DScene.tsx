import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

/**
 * Procedural 3D spatial backdrop:
 * Translucent ruled parchment sheets, lacquered & brass fountain pens,
 * soft kinetic wave surface, and drifting champagne droplets over a warm creamy canvas.
 * Mouse & touch parallax smoothly orbits camera without blocking UI interaction.
 */

function createRuledPaperTexture(tintBg: string, ruleColor: string, marginColor: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 680;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = tintBg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle horizontal notebook rules
    ctx.strokeStyle = ruleColor;
    ctx.lineWidth = 1.5;
    for (let y = 64; y < canvas.height - 32; y += 28) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Left red-sienna margin rule
    ctx.strokeStyle = marginColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(76, 0);
    ctx.lineTo(76, canvas.height);
    ctx.stroke();

    // Graceful stylized handwriting wave strokes for visual texture
    ctx.strokeStyle = 'rgba(72, 46, 26, 0.34)';
    ctx.lineWidth = 2.2;
    ctx.lineCap = 'round';
    for (let row = 0; row < 14; row++) {
      const baseY = 86 + row * 28;
      const maxWidth = 220 + ((row * 53) % 160);
      ctx.beginPath();
      ctx.moveTo(96, baseY);
      for (let x = 96; x < 96 + maxWidth; x += 12) {
        const wave = Math.sin(x * 0.11 + row * 1.7) * 3.2;
        ctx.lineTo(x, baseY + wave);
      }
      ctx.stroke();
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function createFountainPen(
  barrelColor: number,
  trimColor: number,
  disposables: { geometries: THREE.BufferGeometry[]; materials: THREE.Material[] }
): THREE.Group {
  const pen = new THREE.Group();

  const barrelMat = new THREE.MeshPhysicalMaterial({
    color: barrelColor,
    roughness: 0.2,
    metalness: 0.14,
    clearcoat: 0.9,
    clearcoatRoughness: 0.12,
  });
  const trimMat = new THREE.MeshStandardMaterial({
    color: trimColor,
    roughness: 0.24,
    metalness: 0.9,
  });
  const gripMat = new THREE.MeshStandardMaterial({
    color: 0x261c15,
    roughness: 0.42,
    metalness: 0.2,
  });
  disposables.materials.push(barrelMat, trimMat, gripMat);

  // Main barrel
  const barrelGeo = new THREE.CylinderGeometry(0.11, 0.095, 2.2, 24);
  const barrel = new THREE.Mesh(barrelGeo, barrelMat);
  barrel.position.y = 0.25;
  pen.add(barrel);

  // End cap fin + metallic ring
  const capEndGeo = new THREE.SphereGeometry(0.095, 20, 12);
  const capEnd = new THREE.Mesh(capEndGeo, trimMat);
  capEnd.position.y = -0.85;
  pen.add(capEnd);

  const ringGeo = new THREE.CylinderGeometry(0.116, 0.116, 0.09, 24);
  const ring = new THREE.Mesh(ringGeo, trimMat);
  ring.position.y = 1.32;
  pen.add(ring);

  // Pocket clip
  const clipGeo = new THREE.BoxGeometry(0.03, 0.85, 0.025);
  const clip = new THREE.Mesh(clipGeo, trimMat);
  clip.position.set(0, 0.85, 0.12);
  pen.add(clip);

  // Grip taper section
  const gripGeo = new THREE.CylinderGeometry(0.075, 0.105, 0.46, 24);
  const grip = new THREE.Mesh(gripGeo, gripMat);
  grip.position.y = 1.56;
  pen.add(grip);

  // Gold / Brass nib cone
  const nibGeo = new THREE.ConeGeometry(0.068, 0.44, 4);
  const nib = new THREE.Mesh(nibGeo, trimMat);
  nib.position.y = 1.98;
  nib.rotation.y = Math.PI / 4;
  pen.add(nib);

  disposables.geometries.push(barrelGeo, capEndGeo, ringGeo, clipGeo, gripGeo, nibGeo);
  return pen;
}

export default function Background3DScene() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const disposables: {
      geometries: THREE.BufferGeometry[];
      materials: THREE.Material[];
      textures: THREE.Texture[];
    } = { geometries: [], materials: [], textures: [] };

    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5eee0);
    scene.fog = new THREE.FogExp2(0xf5eee0, 0.032);

    const camera = new THREE.PerspectiveCamera(44, width / height, 0.1, 100);
    camera.position.set(0, 0.5, 11.5);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: 'high-performance',
        alpha: false,
      });
    } catch {
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    const glCtx = renderer.getContext();
    const debugExt = glCtx ? glCtx.getExtension('WEBGL_debug_renderer_info') : null;
    const glRendererName = debugExt
      ? String(glCtx.getParameter(debugExt.UNMASKED_RENDERER_WEBGL) || '')
      : '';
    const isSoftwareGl = /SwiftShader|llvmpipe|Software Rasterizer/i.test(glRendererName);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTarget = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;
    disposables.textures.push(envTarget.texture);

    container.appendChild(renderer.domElement);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';

    // Warm Daylight Three-Point Lighting
    const hemiLight = new THREE.HemisphereLight(0xfffdf8, 0xd8c8ae, 0.95);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff7e6, 1.8);
    keyLight.position.set(6, 9, 8);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xf3d4a0, 1.0);
    rimLight.position.set(-8, -3, -5);
    scene.add(rimLight);

    // Subtle kinetic wireframe wave ground
    const waveGeo = new THREE.PlaneGeometry(36, 22, 46, 28);
    waveGeo.rotateX(-Math.PI / 2.25);
    const waveBasePositions = new Float32Array(
      (waveGeo.attributes.position as THREE.BufferAttribute).array
    );
    const waveMat = new THREE.MeshBasicMaterial({
      color: 0xcab799,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });
    disposables.geometries.push(waveGeo);
    disposables.materials.push(waveMat);
    const waveMesh = new THREE.Mesh(waveGeo, waveMat);
    waveMesh.position.set(0, -4.4, -5.5);
    scene.add(waveMesh);

    // Ruled ivory parchment textures
    const paperTexA = createRuledPaperTexture(
      '#fffdf7',
      'rgba(166, 134, 96, 0.34)',
      'rgba(180, 75, 42, 0.45)'
    );
    const paperTexB = createRuledPaperTexture(
      '#faf2e1',
      'rgba(154, 118, 78, 0.32)',
      'rgba(180, 75, 42, 0.4)'
    );
    disposables.textures.push(paperTexA, paperTexB);

    const paperMatA = new THREE.MeshPhysicalMaterial({
      map: paperTexA,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.88,
      roughness: 0.62,
      metalness: 0.02,
      clearcoat: 0.08,
    });
    const paperMatB = new THREE.MeshPhysicalMaterial({
      map: paperTexB,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
      roughness: 0.68,
      metalness: 0.02,
      clearcoat: 0.06,
    });
    disposables.materials.push(paperMatA, paperMatB);

    interface FloatingSheet {
      mesh: THREE.Mesh;
      basePos: THREE.Vector3;
      baseRot: THREE.Euler;
      speed: number;
      phase: number;
      ampY: number;
    }

    const sheets: FloatingSheet[] = [];
    const sheetConfigs = [
      { pos: [-5.6, 1.3, -2.2], rot: [0.18, 0.42, -0.14], scale: 1.15, mat: paperMatA, phase: 0.0 },
      { pos: [5.9, -0.8, -1.8], rot: [-0.12, -0.48, 0.16], scale: 1.25, mat: paperMatA, phase: 1.5 },
      { pos: [-2.8, -2.5, -4.8], rot: [0.24, 0.22, -0.22], scale: 0.95, mat: paperMatB, phase: 2.8 },
      { pos: [3.2, 2.7, -4.2], rot: [0.15, -0.3, 0.12], scale: 1.0, mat: paperMatB, phase: 4.1 },
      { pos: [0.3, -0.6, -7.2], rot: [0.08, 0.12, -0.06], scale: 1.5, mat: paperMatB, phase: 5.2 },
    ];

    sheetConfigs.forEach((cfg) => {
      const geo = new THREE.PlaneGeometry(3.0, 4.0, 14, 18);
      // Gentle natural arch in each sheet
      const posAttr = geo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < posAttr.count; i++) {
        const vx = posAttr.getX(i);
        const vy = posAttr.getY(i);
        const bend = Math.sin(vx * 0.9 + cfg.phase) * 0.14 + Math.cos(vy * 0.7) * 0.08;
        posAttr.setZ(i, bend);
      }
      geo.computeVertexNormals();
      disposables.geometries.push(geo);

      const mesh = new THREE.Mesh(geo, cfg.mat);
      mesh.position.set(cfg.pos[0], cfg.pos[1], cfg.pos[2]);
      mesh.rotation.set(cfg.rot[0], cfg.rot[1], cfg.rot[2]);
      mesh.scale.setScalar(cfg.scale);
      scene.add(mesh);

      sheets.push({
        mesh,
        basePos: mesh.position.clone(),
        baseRot: mesh.rotation.clone(),
        speed: 0.55 + (cfg.phase % 0.4),
        phase: cfg.phase,
        ampY: 0.24,
      });
    });

    // Floating fountain pens in warm espresso lacquer, moss green, & champagne gold
    const pen1 = createFountainPen(0x3d2314, 0xd97706, disposables);
    pen1.position.set(-4.3, -0.7, 0.6);
    pen1.rotation.set(0.5, 0.2, -0.65);
    pen1.scale.setScalar(0.95);
    scene.add(pen1);

    const pen2 = createFountainPen(0x283830, 0xb45309, disposables);
    pen2.position.set(4.5, 1.5, -0.2);
    pen2.rotation.set(-0.4, -0.35, 0.55);
    pen2.scale.setScalar(0.88);
    scene.add(pen2);

    const pen3 = createFountainPen(0x5c2428, 0xd97706, disposables);
    pen3.position.set(0.6, 3.0, -3.5);
    pen3.rotation.set(0.25, 0.6, 1.05);
    pen3.scale.setScalar(0.76);
    scene.add(pen3);

    // Floating warm gold/amber ink droplets (InstancedMesh)
    const particleCount = 72;
    const dropGeo = new THREE.OctahedronGeometry(0.065, 1);
    const dropMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.25,
      metalness: 0.65,
      emissive: 0xd97706,
      emissiveIntensity: 0.14,
    });
    disposables.geometries.push(dropGeo);
    disposables.materials.push(dropMat);

    const droplets = new THREE.InstancedMesh(dropGeo, dropMat, particleCount);
    const dummy = new THREE.Object3D();
    const dropletSeeds: {
      x: number;
      y: number;
      z: number;
      scale: number;
      speed: number;
      phase: number;
    }[] = [];

    const paletteColors = [
      new THREE.Color(0xd97706),
      new THREE.Color(0x9a4319),
      new THREE.Color(0xf59e0b),
    ];

    for (let i = 0; i < particleCount; i++) {
      const seed = {
        x: (Math.random() - 0.5) * 18,
        y: (Math.random() - 0.5) * 10,
        z: -1.5 - Math.random() * 8,
        scale: 0.55 + Math.random() * 1.15,
        speed: 0.4 + Math.random() * 0.7,
        phase: Math.random() * Math.PI * 2,
      };
      dropletSeeds.push(seed);
      dummy.position.set(seed.x, seed.y, seed.z);
      dummy.scale.setScalar(seed.scale);
      dummy.updateMatrix();
      droplets.setMatrixAt(i, dummy.matrix);
      droplets.setColorAt(i, paletteColors[i % paletteColors.length]);
    }
    droplets.instanceMatrix.needsUpdate = true;
    if (droplets.instanceColor) droplets.instanceColor.needsUpdate = true;
    scene.add(droplets);

    // Subtle pointer parallax target
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handlePointerMove = (e: PointerEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Context loss handler
    let isContextLost = false;
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      isContextLost = true;
    };
    const handleContextRestored = () => {
      isContextLost = false;
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', handleContextRestored);

    let rafId = 0;
    const startTime = performance.now();

    const renderFrame = (now: number) => {
      const t = (now - startTime) * 0.001;

      if (!isContextLost) {
        currentMouseX += (targetMouseX - currentMouseX) * 0.045;
        currentMouseY += (targetMouseY - currentMouseY) * 0.045;

        camera.position.x = currentMouseX * 1.15;
        camera.position.y = 0.5 - currentMouseY * 0.75;
        camera.lookAt(0, 0, -2.5);

        // Animate curved papers
        sheets.forEach((s) => {
          s.mesh.position.y = s.basePos.y + Math.sin(t * s.speed + s.phase) * s.ampY;
          s.mesh.rotation.x = s.baseRot.x + Math.sin(t * 0.4 + s.phase) * 0.04;
          s.mesh.rotation.y = s.baseRot.y + Math.cos(t * 0.35 + s.phase) * 0.05;
        });

        // Animate pens floating smoothly
        pen1.position.y = -0.7 + Math.sin(t * 0.9) * 0.22;
        pen1.rotation.z = -0.65 + Math.sin(t * 0.6) * 0.08;
        pen1.rotation.y = 0.2 + t * 0.18;

        pen2.position.y = 1.5 + Math.cos(t * 0.8) * 0.24;
        pen2.rotation.z = 0.55 + Math.cos(t * 0.55) * 0.08;
        pen2.rotation.y = -0.35 - t * 0.15;

        pen3.position.y = 3.0 + Math.sin(t * 0.7 + 1.2) * 0.18;
        pen3.rotation.y = 0.6 + t * 0.14;

        // Kinetic floor wireframe undulation
        const wavePos = waveGeo.attributes.position as THREE.BufferAttribute;
        for (let i = 0; i < wavePos.count; i++) {
          const bx = waveBasePositions[i * 3];
          const by = waveBasePositions[i * 3 + 1];
          const bz = waveBasePositions[i * 3 + 2];
          wavePos.setY(
            i,
            by + Math.sin(bx * 0.38 + t * 0.9) * 0.32 + Math.cos(bz * 0.42 + t * 0.7) * 0.25
          );
        }
        wavePos.needsUpdate = true;

        // Drift particles
        for (let i = 0; i < particleCount; i++) {
          const seed = dropletSeeds[i];
          const driftY = ((seed.y + t * seed.speed * 0.35 + 5) % 10) - 5;
          dummy.position.set(
            seed.x + Math.sin(t * 0.6 + seed.phase) * 0.25,
            driftY,
            seed.z
          );
          dummy.rotation.set(t * 0.5 + seed.phase, t * 0.7, 0);
          dummy.scale.setScalar(seed.scale);
          dummy.updateMatrix();
          droplets.setMatrixAt(i, dummy.matrix);
        }
        droplets.instanceMatrix.needsUpdate = true;

        renderer.render(scene, camera);
      }

      if (!prefersReducedMotion && !isSoftwareGl) {
        rafId = requestAnimationFrame(renderFrame);
      }
    };

    renderFrame(performance.now());

    // Soft fallback animation on slow software rasterizers
    let slowIntervalId: ReturnType<typeof setInterval> | null = null;
    if (!prefersReducedMotion && isSoftwareGl) {
      slowIntervalId = setInterval(() => {
        if (document.visibilityState === 'visible') {
          renderFrame(performance.now());
        }
      }, 100);
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (slowIntervalId) clearInterval(slowIntervalId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', handleContextRestored);

      disposables.geometries.forEach((g) => g.dispose());
      disposables.materials.forEach((m) => m.dispose());
      disposables.textures.forEach((tex) => tex.dispose());
      pmremGenerator.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none select-none overflow-hidden"
    />
  );
}
