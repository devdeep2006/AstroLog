"use client";
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const SpaceBackground = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Setup scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mount.appendChild(renderer.domElement);

    // Background fog
    scene.fog = new THREE.FogExp2(0x0a0a1a, 0.0012);

    // Stars
    const starsGeometry = new THREE.BufferGeometry();
    const starVertices: number[] = [];
    const starIntensities: number[] = [];

    for (let i = 0; i < 2000; i++) {
      const x = (Math.random() - 0.5) * 4000;
      const y = (Math.random() - 0.5) * 4000;
      const z = (Math.random() - 0.5) * 4000;
      starVertices.push(x, y, z);
      starIntensities.push(0.6 + Math.random() * 0.4);
    }

    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    starsGeometry.setAttribute('intensity', new THREE.Float32BufferAttribute(starIntensities, 1));

    const starsMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        attribute float intensity;
        varying float vIntensity;
        void main() {
          vIntensity = intensity;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = 2.0;
        }
      `,
      fragmentShader: `
        varying float vIntensity;
        void main() {
          float twinkle = 0.5 + 0.5 * sin(vIntensity * 20.0 + gl_FragCoord.x * 0.05 + gl_FragCoord.y * 0.05);
          gl_FragColor = vec4(1.0, 1.0, 1.0, twinkle);
        }
      `,
      transparent: true,
    });

    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Meteor
    const meteorGeometry = new THREE.SphereGeometry(56, 56, 56);
    const meteorMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true });
    const meteor = new THREE.Mesh(meteorGeometry, meteorMaterial);
    meteor.position.set(-500, 0, -300);
    scene.add(meteor);

    // Meteor trail
    const trailGeometry = new THREE.BufferGeometry();
    const trailVertices = new Float32Array(3000); // 100 points * 3 coords
    trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailVertices, 3));
    const trailMaterial = new THREE.LineBasicMaterial({ color: 0xffd700, transparent: true, opacity: 0.8 });
    const trail = new THREE.Line(trailGeometry, trailMaterial);
    scene.add(trail);

    // Lighting
    scene.add(new THREE.AmbientLight(0x101010));
    const dirLight = new THREE.DirectionalLight(0xffffff, 18);
    dirLight.position.set(100, 50, 100);
    scene.add(dirLight);

    // Camera
    camera.position.z = 500;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      const floatTime = Date.now() * 0.001;
      camera.position.x = Math.sin(floatTime * 0.2) * 20;
      camera.position.y = Math.sin(floatTime * 0.3) * 10;
      camera.lookAt(scene.position);
      // Rotate stars
      stars.rotation.x += 0.002;
      stars.rotation.y += 0.002;

      const t = Date.now() * 0.0005;
      meteor.position.x = -500 + t * 800;
      meteor.position.y = Math.sin(t * 2) * 100;
      meteor.position.z = -300 + Math.cos(t * 2) * 50;
      meteorMaterial.opacity = 0.9 - (meteor.position.x + 500) / 300;

      // Update trail
      for (let i = 0; i < 100; i++) {
        const p = i / 100;
        const index = i * 3;
        trailVertices[index] = meteor.position.x - (1 - p) * 50;
        trailVertices[index + 1] = meteor.position.y - (1 - p) * 20;
        trailVertices[index + 2] = meteor.position.z - (1 - p) * 30;
      }

      trailGeometry.attributes.position.needsUpdate = true;
      trailMaterial.opacity = 0.8 * (1 - (meteor.position.x + 500) / 1300);

      if (meteor.position.x > 500) {
        meteor.position.set(-500, Math.random() * 200 - 100, -300 + Math.random() * 100);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const onResize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', onResize);

    return () => {
      mount.removeChild(renderer.domElement);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        background: 'transparent',
        pointerEvents: 'none', // Allow interactions to pass through
      }}
    />
  );
};

export default SpaceBackground;