import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function TopologyField({
  nodeCount = 70,
  nodeColor = 0xa855f7,      // fuchsia/purple nodes
  linkColor = 0x6366f1,      // indigo links
  bgColor = 0x050510,        // deep space black
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ── Scene / Camera / Renderer ────────────────
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(bgColor);

    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // ── Nodes on a sphere (Fibonacci lattice) ────
    const nodes = [];
    const phi = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < nodeCount; i++) {
      const y = 1 - (i / (nodeCount - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = phi * i;
      nodes.push(
        new THREE.Vector3(
          Math.cos(theta) * radius,
          y,
          Math.sin(theta) * radius
        ).multiplyScalar(2.2)
      );
    }

    // ── Sharp node points ────────────────────────
    const pointsGeo = new THREE.BufferGeometry().setFromPoints(nodes);
    const pointsMat = new THREE.PointsMaterial({
      color: nodeColor,
      size: 0.08,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const points = new THREE.Points(pointsGeo, pointsMat);
    scene.add(points);

    // ── Soft glow behind each node ───────────────
    const glowMat = new THREE.PointsMaterial({
      color: nodeColor,
      size: 0.25,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const glow = new THREE.Points(pointsGeo, glowMat);
    scene.add(glow);

    // ── Links between nearby nodes ───────────────
    const linkPositions = [];
    const maxDistance = 1.45;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].distanceTo(nodes[j]) < maxDistance) {
          linkPositions.push(
            nodes[i].x, nodes[i].y, nodes[i].z,
            nodes[j].x, nodes[j].y, nodes[j].z
          );
        }
      }
    }
    const linkGeo = new THREE.BufferGeometry();
    linkGeo.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(linkPositions, 3)
    );
    const linkMat = new THREE.LineBasicMaterial({
      color: linkColor,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const links = new THREE.LineSegments(linkGeo, linkMat);
    scene.add(links);

    // ── Faint wireframe shell ────────────────────
    const shellGeo = new THREE.SphereGeometry(2.4, 32, 32);
    const shellMat = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      transparent: true,
      opacity: 0.04,
      wireframe: true,
    });
    const shell = new THREE.Mesh(shellGeo, shellMat);
    scene.add(shell);

    // ── Mouse parallax ───────────────────────────
    const mouse = { x: 0, y: 0 };
    const onMouseMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove);

    // ── Resize ───────────────────────────────────
    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // ── Animation loop ───────────────────────────
    let frameId;
    let t = 0;
    const animate = () => {
      t += 0.0025;

      points.rotation.y = t;
      glow.rotation.y = t;
      links.rotation.y = t;
      shell.rotation.y = t * 0.4;
      shell.rotation.x = Math.sin(t * 0.3) * 0.15;

      pointsMat.size = 0.08 + Math.sin(t * 8) * 0.015;

      camera.position.x += (mouse.x * 0.6 - camera.position.x) * 0.04;
      camera.position.y += (mouse.y * 0.6 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    // ── Cleanup ──────────────────────────────────
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      pointsGeo.dispose();
      pointsMat.dispose();
      glowMat.dispose();
      linkGeo.dispose();
      linkMat.dispose();
      shellGeo.dispose();
      shellMat.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [nodeCount, nodeColor, linkColor, bgColor]);

  return <div ref={containerRef} className="absolute inset-0" />;
}