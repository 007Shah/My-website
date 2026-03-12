import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function Octahedron({ speed = 1 }: { speed?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += 0.01 * speed;
    meshRef.current.rotation.z += 0.005 * speed;
  });

  return (
    <Float speed={5} rotationIntensity={2} floatIntensity={2}>
      <mesh ref={meshRef}>
        <octahedronGeometry args={[1.5, 0]} />
        <MeshDistortMaterial
          color="#00f2ff"
          speed={2 * speed}
          distort={0.4}
          wireframe
          emissive="#00f2ff"
          emissiveIntensity={0.5}
        />
      </mesh>
    </Float>
  );
}

export const NeuralGateCore = ({ rotationSpeed = 1 }: { rotationSpeed?: number }) => {
  return (
    <div className="w-full h-64 md:h-96">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} color="#00f2ff" intensity={2} />
        <pointLight position={[-10, -10, -10]} color="#ff00ff" intensity={1} />
        <Octahedron speed={rotationSpeed} />
      </Canvas>
    </div>
  );
};
