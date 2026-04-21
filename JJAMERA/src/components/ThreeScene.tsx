import React, { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, PresentationControls, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

// Stylized Burger Component
function StylizedBurger() {
  const groupRef = useRef<THREE.Group>(null);
  const topBunRef = useRef<THREE.Mesh>(null);
  const pattyRef = useRef<THREE.Mesh>(null);
  const bottomBunRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      // Simple rotation
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
    
    // Assembly animation based on scroll
    const scrollY = window.scrollY;
    const progress = Math.min(scrollY / 500, 1);
    
    if (topBunRef.current) {
      topBunRef.current.position.y = THREE.MathUtils.lerp(5, 1.2, progress);
    }
    if (pattyRef.current) {
      pattyRef.current.position.y = 0;
    }
    if (bottomBunRef.current) {
      bottomBunRef.current.position.y = THREE.MathUtils.lerp(-5, -1.2, progress);
    }
  });

  return (
    <group ref={groupRef} position={[2, 0, 0]}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        {/* Top Bun */}
        <mesh ref={topBunRef} castShadow>
          <cylinderGeometry args={[1.5, 1.5, 0.8, 32]} />
          <meshStandardMaterial color="#E2A75D" roughness={0.4} />
        </mesh>
        
        {/* Patty */}
        <mesh ref={pattyRef} castShadow>
          <cylinderGeometry args={[1.6, 1.6, 0.5, 32]} />
          <meshStandardMaterial color="#4A2511" roughness={0.8} />
        </mesh>
        
        {/* Bottom Bun */}
        <mesh ref={bottomBunRef} castShadow>
          <cylinderGeometry args={[1.5, 1.5, 0.6, 32]} />
          <meshStandardMaterial color="#E2A75D" roughness={0.4} />
        </mesh>
        
        {/* Orbiting Ingredients */}
        <OrbitingIngredients />
      </Float>
    </group>
  );
}

// Stylized Pizza Component
function StylizedPizza() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      const scrollY = window.scrollY;
      const progress = Math.min(scrollY / 500, 1);
      
      groupRef.current.position.x = THREE.MathUtils.lerp(-10, -2, progress);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(0, -Math.PI * 2, progress);
    }
  });

  return (
    <group ref={groupRef} rotation-x={Math.PI / 6}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.8}>
        <mesh castShadow>
          <cylinderGeometry args={[2, 2, 0.4, 32]} />
          <meshStandardMaterial color="#D9381E" roughness={0.3} />
        </mesh>
        {/* Crust */}
        <mesh position-y={0.1}>
          <torusGeometry args={[1.9, 0.2, 16, 32]} />
          <meshStandardMaterial color="#E2A75D" roughness={0.5} />
        </mesh>
      </Float>
    </group>
  );
}

function OrbitingIngredients() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <group ref={groupRef}>
      {[...Array(5)].map((_, i) => (
        <mesh key={i} position={[Math.cos((i / 5) * Math.PI * 2) * 2.5, Math.sin((i / 5) * Math.PI * 2) * 0.5, Math.sin((i / 5) * Math.PI * 2) * 2.5]}>
          <boxGeometry args={[0.2, 0.2, 0.2]} />
          <meshStandardMaterial color={i % 2 === 0 ? "#4CAF50" : "#F44336"} />
        </mesh>
      ))}
    </group>
  );
}

function Scene() {
  const { viewport } = useThree();
  const isMobile = viewport.width < 5;

  if (isMobile) {
    // Reduced motion fallback for mobile
    return (
      <group>
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[4, 4]} />
          <meshBasicMaterial color="#FFCC00" wireframe />
        </mesh>
      </group>
    );
  }

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <Environment preset="city" />
      
      <PresentationControls
        global
        snap={true}
        rotation={[0, 0, 0]}
        polar={[-Math.PI / 3, Math.PI / 3]}
        azimuth={[-Math.PI / 1.4, Math.PI / 2]}
      >
        <StylizedBurger />
        <StylizedPizza />
      </PresentationControls>
      
      <ContactShadows position={[0, -3, 0]} opacity={0.4} scale={20} blur={2} far={4.5} />
    </>
  );
}

export function ThreeScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas shadows camera={{ position: [0, 0, 10], fov: 45 }}>
        <Scene />
      </Canvas>
    </div>
  );
}
