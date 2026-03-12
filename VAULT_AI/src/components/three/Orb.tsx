import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Float } from '@react-three/drei'
import * as THREE from 'three'

// Circuit lines on sphere surface
function CircuitLines({ radius = 2 }: { radius?: number }) {
  const linesRef = useRef<THREE.Group>(null)
  
  const lines = useMemo(() => {
    const circuitPaths = []
    const numLines = 24
    
    for (let i = 0; i < numLines; i++) {
      const phi = Math.acos(-1 + (2 * i) / numLines)
      const theta = Math.sqrt(numLines * Math.PI) * phi
      
      const points = []
      for (let j = 0; j <= 32; j++) {
        const t = j / 32
        const x = radius * Math.sin(phi) * Math.cos(theta + t * Math.PI * 2)
        const y = radius * Math.cos(phi)
        const z = radius * Math.sin(phi) * Math.sin(theta + t * Math.PI * 2)
        points.push(new THREE.Vector3(x, y, z))
      }
      
      circuitPaths.push(points)
    }
    
    return circuitPaths
  }, [radius])

  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.rotation.y = state.clock.elapsedTime * 0.05
      linesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.03) * 0.1
    }
  })

  return (
    <group ref={linesRef}>
      {lines.map((points, i) => (
        <line key={i}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array(points.flatMap(p => [p.x, p.y, p.z])), 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial 
            color="#FF4D2E" 
            transparent 
            opacity={0.4 + Math.sin(i * 0.5) * 0.2}
          />
        </line>
      ))}
    </group>
  )
}

// Main sphere with iridescent material
function Sphere({ radius = 2 }: { radius?: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  const shaderData = useMemo(() => ({
    uniforms: {
      uTime: { value: 0 },
      uColor1: { value: new THREE.Color('#1a1a2e') },
      uColor2: { value: new THREE.Color('#16213e') },
      uAccent: { value: new THREE.Color('#FF4D2E') },
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;
      uniform float uTime;
      
      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        
        vec3 pos = position;
        float noise = sin(pos.x * 2.0 + uTime * 0.5) * cos(pos.y * 2.0 + uTime * 0.3) * sin(pos.z * 2.0 + uTime * 0.4);
        pos += normal * noise * 0.03;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      uniform vec3 uAccent;
      
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;
      
      void main() {
        vec3 viewDirection = normalize(cameraPosition - vPosition);
        float fresnel = pow(1.0 - abs(dot(viewDirection, vNormal)), 2.0);
        
        float circuitPattern = step(0.92, sin(vUv.x * 50.0) * sin(vUv.y * 50.0));
        
        vec3 baseColor = mix(uColor1, uColor2, vUv.y + sin(uTime * 0.2) * 0.1);
        vec3 finalColor = mix(baseColor, uAccent, fresnel * 0.4 + circuitPattern * 0.15);
        
        float alpha = 0.85 + fresnel * 0.15;
        
        gl_FragColor = vec4(finalColor, alpha);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide,
  }), [])

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.08
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.05) * 0.05
    }
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
    }
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[radius, 64, 64]} />
      <shaderMaterial ref={materialRef} {...shaderData} />
    </mesh>
  )
}

// Particle field around the orb
function Particles({ count = 100 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null)
  
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const vel = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 3 + Math.random() * 3
      
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)
      
      vel[i * 3] = (Math.random() - 0.5) * 0.002
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.002
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.002
    }
    
    return [pos, vel]
  }, [count])

  useFrame(() => {
    if (pointsRef.current) {
      const positionArray = pointsRef.current.geometry.attributes.position.array as Float32Array
      
      for (let i = 0; i < count; i++) {
        positionArray[i * 3] += velocities[i * 3]
        positionArray[i * 3 + 1] += velocities[i * 3 + 1]
        positionArray[i * 3 + 2] += velocities[i * 3 + 2]
        
        const dist = Math.sqrt(
          positionArray[i * 3] ** 2 + 
          positionArray[i * 3 + 1] ** 2 + 
          positionArray[i * 3 + 2] ** 2
        )
        
        if (dist < 2.5 || dist > 7) {
          velocities[i * 3] *= -1
          velocities[i * 3 + 1] *= -1
          velocities[i * 3 + 2] *= -1
        }
      }
      
      pointsRef.current.geometry.attributes.position.needsUpdate = true
      pointsRef.current.rotation.y += 0.001
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#FF4D2E"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

// Main Orb Scene
function OrbScene() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#FF4D2E" />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#FFBF00" />
      
      <Float
        speed={1.5}
        rotationIntensity={0.2}
        floatIntensity={0.3}
      >
        <Sphere radius={2} />
        <CircuitLines radius={2.05} />
      </Float>
      
      <Particles count={150} />
      
      <Environment preset="city" />
    </>
  )
}

// Main export component
export default function Orb() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        dpr={[1, 2]}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance'
        }}
      >
        <OrbScene />
      </Canvas>
    </div>
  )
}
