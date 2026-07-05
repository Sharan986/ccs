import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default function Galaxy() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ── Scene Setup ───────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.03);

    const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(4, 3, 6);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // ── Controls ──────────────────────────────────────────────────
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = false;
    controls.autoRotate = false;
    controls.dampingFactor = 0.05;

    // ── Configuration ─────────────────────────────────────────────
    const parameters = {
      count: 80000,
      size: 0.015,
      radius: 8,
      branches: 4,
      spin: 1,
      randomness: 0.3,
      randomnessPower: 3,
      insideColor: '#ff6030',
      outsideColor: '#1b3984',
      jetCount: 6000,
      jetHeight: 6,
      jetSpeed: 0.04
    };

    let galaxyGeometry: THREE.BufferGeometry | null = null;
    let galaxyMaterial: THREE.PointsMaterial | null = null;
    let galaxyPoints: THREE.Points | null = null;

    let jetGeometry: THREE.BufferGeometry | null = null;
    let jetMaterial: THREE.PointsMaterial | null = null;
    let jetPoints: THREE.Points | null = null;
    let jetVelocities: { vx: number, vy: number, vz: number, direction: number }[] = [];

    let blackHoleMesh: THREE.Mesh | null = null;
    let accretionMesh: THREE.Mesh | null = null;
    let accretionMeshHalo: THREE.Mesh | null = null;
    let accretionPoints: THREE.Points | null = null;
    let bgStars: THREE.Points | null = null;

    // ── Black Hole ────────────────────────────────────────────────
    const generateBlackHole = () => {
      // Event Horizon
      const bhGeometry = new THREE.SphereGeometry(0.3, 64, 64);
      const bhMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
      blackHoleMesh = new THREE.Mesh(bhGeometry, bhMaterial);
      scene.add(blackHoleMesh);

      // Accretion Disk
      const diskGeometry = new THREE.RingGeometry(0.35, 0.85, 64, 8);
      const diskMaterial = new THREE.MeshBasicMaterial({
        color: 0xffaa00,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending
      });
      accretionMesh = new THREE.Mesh(diskGeometry, diskMaterial);
      accretionMesh.rotation.x = Math.PI / 2;
      scene.add(accretionMesh);

      // Accretion Halo
      const haloGeometry = new THREE.RingGeometry(0.32, 0.55, 64, 8);
      const haloMaterial = new THREE.MeshBasicMaterial({
        color: 0xff4400,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending
      });
      accretionMeshHalo = new THREE.Mesh(haloGeometry, haloMaterial);
      accretionMeshHalo.rotation.y = Math.PI / 3;
      scene.add(accretionMeshHalo);

      // Accretion Particles
      const accParticlesCount = 6000;
      const accGeo = new THREE.BufferGeometry();
      const accPos = new Float32Array(accParticlesCount * 3);
      const accCol = new Float32Array(accParticlesCount * 3);
      const baseColor = new THREE.Color(0xffaa55);

      for (let i = 0; i < accParticlesCount; i++) {
        const i3 = i * 3;
        const r = 0.32 + Math.random() * 0.45;
        const angle = Math.random() * Math.PI * 2;
        const y = (Math.random() - 0.5) * 0.02;

        accPos[i3] = Math.cos(angle) * r;
        accPos[i3 + 1] = y;
        accPos[i3 + 2] = Math.sin(angle) * r;

        const heat = 1 - ((r - 0.32) / 0.45);
        const pColor = baseColor.clone();
        pColor.offsetHSL(0, 0, heat * 0.5);

        accCol[i3] = pColor.r;
        accCol[i3 + 1] = pColor.g;
        accCol[i3 + 2] = pColor.b;
      }

      accGeo.setAttribute('position', new THREE.BufferAttribute(accPos, 3));
      accGeo.setAttribute('color', new THREE.BufferAttribute(accCol, 3));

      const accMat = new THREE.PointsMaterial({
        size: 0.012,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      accretionPoints = new THREE.Points(accGeo, accMat);
      scene.add(accretionPoints);
    };

    // ── Galaxy ────────────────────────────────────────────────────
    const generateGalaxy = () => {
      galaxyGeometry = new THREE.BufferGeometry();
      const positions = new Float32Array(parameters.count * 3);
      const colors = new Float32Array(parameters.count * 3);
      const colorInside = new THREE.Color(parameters.insideColor);
      const colorOutside = new THREE.Color(parameters.outsideColor);

      for (let i = 0; i < parameters.count; i++) {
        const i3 = i * 3;

        let radius = Math.random() * parameters.radius;
        // Push galaxy start further out so it doesn't clip the black hole
        if (radius < 1.2) radius += 1.2;

        const spinAngle = radius * parameters.spin;
        const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2;

        const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
        const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;

        const x = Math.cos(branchAngle + spinAngle) * radius + randomX;
        const y = randomY / 2;
        const z = Math.sin(branchAngle + spinAngle) * radius + randomZ;

        positions[i3] = x;
        positions[i3 + 1] = y;
        positions[i3 + 2] = z;

        const mixedColor = colorInside.clone();
        mixedColor.lerp(colorOutside, radius / parameters.radius);

        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;
      }

      galaxyGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      galaxyGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      galaxyMaterial = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
      });

      galaxyPoints = new THREE.Points(galaxyGeometry, galaxyMaterial);
      scene.add(galaxyPoints);
    };

    // ── Jets ──────────────────────────────────────────────────────
    const generateJet = () => {
      jetGeometry = new THREE.BufferGeometry();
      const positions = new Float32Array(parameters.jetCount * 3);
      const colors = new Float32Array(parameters.jetCount * 3);

      jetVelocities = [];
      const colorCore = new THREE.Color('#aaccff');

      for (let i = 0; i < parameters.jetCount; i++) {
        const i3 = i * 3;

        const rStart = Math.random() * 0.1;
        const angle = Math.random() * Math.PI * 2;

        positions[i3] = Math.cos(angle) * rStart;
        const direction = Math.random() > 0.5 ? 1 : -1;
        positions[i3 + 1] = direction * 0.3;
        positions[i3 + 2] = Math.sin(angle) * rStart;

        const spread = 0.005;
        const vx = (Math.random() - 0.5) * spread;
        const vy = (Math.random() * 0.2 + 1.2) * parameters.jetSpeed * direction;
        const vz = (Math.random() - 0.5) * spread;

        jetVelocities.push({ vx, vy, vz, direction });

        colors[i3] = colorCore.r;
        colors[i3 + 1] = colorCore.g;
        colors[i3 + 2] = colorCore.b;
      }

      jetGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      jetGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      jetMaterial = new THREE.PointsMaterial({
        size: 0.03,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
        transparent: true,
        opacity: 0.9
      });

      jetPoints = new THREE.Points(jetGeometry, jetMaterial);
      scene.add(jetPoints);
    };

    // ── Background Stars ──────────────────────────────────────────
    const generateBgStars = () => {
      const starGeometry = new THREE.BufferGeometry();
      const starCount = 3000;
      const starPositions = new Float32Array(starCount * 3);

      for (let i = 0; i < starCount; i++) {
        const i3 = i * 3;

        const r = 15 + Math.random() * 90;
        const theta = 2 * Math.PI * Math.random();
        const phi = Math.acos(2 * Math.random() - 1);

        starPositions[i3] = r * Math.sin(phi) * Math.cos(theta);
        starPositions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        starPositions[i3 + 2] = r * Math.cos(phi);
      }

      starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));

      const starMaterial = new THREE.PointsMaterial({
        color: 0x888888,
        size: 0.03,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.5,
        depthWrite: false
      });

      bgStars = new THREE.Points(starGeometry, starMaterial);
      scene.add(bgStars);
    };

    generateBlackHole();
    generateGalaxy();
    generateJet();
    generateBgStars();

    // ── Resize Handler ────────────────────────────────────────────
    let resizeTimeout: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (!mount) return;
        camera.aspect = mount.clientWidth / mount.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(mount.clientWidth, mount.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      }, 150);
    };
    window.addEventListener('resize', onResize);

    // ── Animation Loop ────────────────────────────────────────────
    const clock = new THREE.Clock();
    let rafId: number;

    const tick = () => {
      rafId = requestAnimationFrame(tick);
      const elapsedTime = clock.getElapsedTime();

      if (galaxyPoints) galaxyPoints.rotation.y = elapsedTime * 0.05;

      if (accretionPoints) accretionPoints.rotation.y = elapsedTime * 2.0;
      if (accretionMesh) accretionMesh.rotation.z = elapsedTime * 1.5;
      if (accretionMeshHalo) accretionMeshHalo.rotation.z = -elapsedTime * 0.5;

      if (jetPoints && jetGeometry) {
        jetPoints.rotation.y = elapsedTime * 0.05;

        const positions = jetGeometry.attributes.position.array as Float32Array;
        const colors = jetGeometry.attributes.color.array as Float32Array;

        for (let i = 0; i < parameters.jetCount; i++) {
          const i3 = i * 3;
          const velocity = jetVelocities[i];

          positions[i3] += velocity.vx;
          positions[i3 + 1] += velocity.vy;
          positions[i3 + 2] += velocity.vz;

          positions[i3] += positions[i3] * 0.01;
          positions[i3 + 2] += positions[i3 + 2] * 0.01;

          const dist = Math.abs(positions[i3 + 1]);
          const lifeRatio = Math.max(0, 1 - (dist / parameters.jetHeight));

          colors[i3] = 1.0 - (0.4 * lifeRatio);
          colors[i3 + 1] = 0.8 * lifeRatio;
          colors[i3 + 2] = 1.0 * lifeRatio + 0.3;

          if (Math.abs(positions[i3 + 1]) > parameters.jetHeight || Math.random() < 0.002) {
            const rStart = Math.random() * 0.05;
            const angle = Math.random() * Math.PI * 2;
            const direction = velocity.direction;

            positions[i3] = Math.cos(angle) * rStart;
            positions[i3 + 1] = direction * 0.16;
            positions[i3 + 2] = Math.sin(angle) * rStart;
          }
        }

        jetGeometry.attributes.position.needsUpdate = true;
        jetGeometry.attributes.color.needsUpdate = true;
      }

      controls.update();
      renderer.render(scene, camera);
    };
    tick();

    // ── Cleanup ───────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      clearTimeout(resizeTimeout);
      controls.dispose();
      renderer.dispose();

      // Dispose geometries and materials
      if (galaxyGeometry) galaxyGeometry.dispose();
      if (galaxyMaterial) galaxyMaterial.dispose();
      if (jetGeometry) jetGeometry.dispose();
      if (jetMaterial) jetMaterial.dispose();
      if (bgStars) {
        bgStars.geometry.dispose();
        (bgStars.material as THREE.Material).dispose();
      }
      if (blackHoleMesh) {
        blackHoleMesh.geometry.dispose();
        (blackHoleMesh.material as THREE.Material).dispose();
      }
      if (accretionMesh) {
        accretionMesh.geometry.dispose();
        (accretionMesh.material as THREE.Material).dispose();
      }
      if (accretionMeshHalo) {
        accretionMeshHalo.geometry.dispose();
        (accretionMeshHalo.material as THREE.Material).dispose();
      }
      if (accretionPoints) {
        accretionPoints.geometry.dispose();
        (accretionPoints.material as THREE.Material).dispose();
      }

      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'auto'
      }}
    />
  );
}
