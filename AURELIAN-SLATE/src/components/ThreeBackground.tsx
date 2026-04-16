import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Create organic silk-like geometry
    const geometry = new THREE.PlaneGeometry(25, 25, 128, 128);
    const material = new THREE.MeshStandardMaterial({
      color: 0x8B6B23, // Deeper, more sophisticated gold
      wireframe: false,
      roughness: 0.3,
      metalness: 0.9,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2.5;
    scene.add(mesh);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xD4AF37, 1.5);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    const blueLight = new THREE.PointLight(0x0000ff, 0.2); // Subtle blue for depth
    blueLight.position.set(-10, -10, 5);
    scene.add(blueLight);

    camera.position.z = 8;

    const handleMouseMove = (event: MouseEvent) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    const animate = (time: number) => {
      requestAnimationFrame(animate);

      const positions = geometry.attributes.position;
      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        
        // Slower, more organic wave effect
        const wave1 = Math.sin(x * 0.3 + time * 0.0005) * 0.4;
        const wave2 = Math.sin(y * 0.2 + time * 0.0007) * 0.3;
        const wave3 = Math.sin((x + y) * 0.1 + time * 0.0003) * 0.2;
        
        positions.setZ(i, wave1 + wave2 + wave3);
      }
      positions.needsUpdate = true;

      // React to mouse more subtly
      mesh.rotation.z += (mouse.current.x * 0.02 - mesh.rotation.z) * 0.02;
      mesh.rotation.y += (mouse.current.y * 0.02 - mesh.rotation.y) * 0.02;

      renderer.render(scene, camera);
    };

    animate(0);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return <div ref={containerRef} className="fixed top-0 left-0 w-full h-full -z-10 opacity-30 pointer-events-none" />;
};

export default ThreeBackground;
