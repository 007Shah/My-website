import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Stars, Billboard } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { NodeData, EdgeData, SimulationConfig } from '../types';
import { updatePhysics } from '../utils/physics';

interface GraphCanvasProps {
  nodes: NodeData[];
  edges: EdgeData[];
  matchingNodeIds: string[];
  onNodeClick: (node: NodeData) => void;
  selectedNodeId: string | null;
}

const PHYS_CONFIG: SimulationConfig = {
  repulsion: 2.0,
  attraction: 0.015,
  damping: 0.92,
  centerStrength: 0.012
};

// --- Edge Component ---
interface EdgeProps {
  source: NodeData;
  target: NodeData;
  isConnectedToSelected: boolean;
}
const Edge: React.FC<EdgeProps> = ({ source, target, isConnectedToSelected }) => {
  const lineRef = useRef<any>(null);

  useFrame(() => {
    if (lineRef.current) {
        const start = new THREE.Vector3(source.x || 0, source.y || 0, source.z || 0);
        const end = new THREE.Vector3(target.x || 0, target.y || 0, target.z || 0);
        const geom = lineRef.current.geometry;
        if (geom) geom.setFromPoints([start, end]);
    }
  });

  return (
    <line ref={lineRef}>
      <bufferGeometry />
      <lineBasicMaterial 
        color={isConnectedToSelected ? "#00ffff" : "#333333"} 
        transparent 
        opacity={isConnectedToSelected ? 0.8 : 0.3} 
        linewidth={1}
        blending={THREE.AdditiveBlending} 
      />
    </line>
  );
};

// --- Node Component ---
interface NodeProps {
  node: NodeData;
  isHighlighted: boolean;
  isDimmed: boolean;
  onClick: (n: NodeData) => void;
}
const Node: React.FC<NodeProps> = ({ node, isHighlighted, isDimmed, onClick }) => {
  const groupRef = useRef<THREE.Group>(null);
  const textGroupRef = useRef<THREE.Group>(null);
  
  const targetPos = useMemo(() => new THREE.Vector3(), []);
  const tempDir = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    if (groupRef.current) {
      // Physics position update
      targetPos.set(node.x || 0, node.y || 0, node.z || 0);
      groupRef.current.position.lerp(targetPos, 0.1);
      
      // Dynamic text positioning (facing camera)
      if (textGroupRef.current) {
        const cameraPos = state.camera.position;
        const nodeWorldPos = groupRef.current.position;
        
        tempDir.subVectors(cameraPos, nodeWorldPos).normalize();
        const radius = isHighlighted ? 0.5 : 0.3;
        const distance = radius + 0.35;
        
        textGroupRef.current.position.set(
          tempDir.x * distance,
          tempDir.y * distance,
          tempDir.z * distance
        );
      }
    }
  });

  const getBaseColor = (group: string) => {
    switch(group) {
        case 'main': return '#ff0055'; 
        case 'subtopic': return '#00ffff'; 
        default: return '#ccff00';
    }
  };

  const baseColor = getBaseColor(node.group);
  const activeColor = isHighlighted ? '#ffffff' : baseColor;
  const radius = isHighlighted ? 0.5 : 0.3;

  return (
    <group ref={groupRef}>
      <mesh 
        onClick={(e) => { e.stopPropagation(); onClick(node); }}
        onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { document.body.style.cursor = 'auto'; }}
      >
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial 
          color={activeColor}
          emissive={activeColor}
          emissiveIntensity={isHighlighted ? 4.0 : 1.5} 
          toneMapped={false} 
          transparent
          opacity={isDimmed ? 0.1 : 1}
        />
      </mesh>
      
      <group ref={textGroupRef}>
        <Billboard follow={true}>
          <Text
            fontSize={isHighlighted ? 0.4 : 0.25}
            color={isHighlighted ? "#ffffff" : "#e0f2fe"} 
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.03}
            outlineColor="#000000"
            fillOpacity={isDimmed ? 0.2 : 1}
          >
            {node.name}
          </Text>
        </Billboard>
      </group>
    </group>
  );
};

// --- Camera Controller ---
const CameraController = ({ targetNodeId, nodes }: { targetNodeId: string | null, nodes: NodeData[] }) => {
  const { camera, controls } = useThree();
  const [isFocusing, setIsFocusing] = useState(false);
  const prevTargetId = useRef<string | null>(null);

  useEffect(() => {
    if (targetNodeId && targetNodeId !== prevTargetId.current) {
        setIsFocusing(true);
        const timer = setTimeout(() => setIsFocusing(false), 2000);
        return () => clearTimeout(timer);
    }
    prevTargetId.current = targetNodeId;
  }, [targetNodeId]);

  useFrame(() => {
    if (targetNodeId && controls) {
      const targetNode = nodes.find(n => n.id === targetNodeId);
      if (targetNode) {
        const targetPos = new THREE.Vector3(targetNode.x || 0, targetNode.y || 0, targetNode.z || 0);
        
        // @ts-ignore
        if (controls.target) {
            // @ts-ignore
            controls.target.lerp(targetPos, 0.1);
            // @ts-ignore
            controls.update();
        }
        
        if (isFocusing) {
            const camOffset = new THREE.Vector3(0, 2, 8); 
            const desiredCamPos = targetPos.clone().add(camOffset);
            camera.position.lerp(desiredCamPos, 0.05);
            if (camera.position.distanceTo(desiredCamPos) < 0.5) setIsFocusing(false);
        }
      }
    }
  });
  return null;
};

// --- Main Scene ---
const SceneContent = ({ nodes, edges, matchingNodeIds, onNodeClick, selectedNodeId }: GraphCanvasProps) => {
  useFrame(() => updatePhysics(nodes, edges, PHYS_CONFIG));

  const activeFocusId = selectedNodeId;
  const connectedEdgeIndices = useMemo(() => {
    if (!activeFocusId) return new Set();
    const set = new Set<number>();
    edges.forEach((e, i) => {
      if (e.source === activeFocusId || e.target === activeFocusId) set.add(i);
    });
    return set;
  }, [activeFocusId, edges]);

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={1} fade speed={0.5} />
      
      <CameraController targetNodeId={activeFocusId} nodes={nodes} />
      <OrbitControls makeDefault enableDamping dampingFactor={0.1} minDistance={2} maxDistance={50} />

      {edges.map((edge, i) => {
        const source = nodes.find(n => n.id === edge.source);
        const target = nodes.find(n => n.id === edge.target);
        if (!source || !target) return null;
        return (
          <Edge 
            key={`${edge.source}-${edge.target}`} 
            source={source}
            target={target}
            isConnectedToSelected={connectedEdgeIndices.has(i)}
          />
        );
      })}

      {nodes.map(node => {
        const isMatch = matchingNodeIds.includes(node.id);
        const isSelected = selectedNodeId === node.id;
        const isHighlighted = isMatch || isSelected;
        const isDimmed = !!activeFocusId && !isHighlighted && !edges.some(e => 
            (e.source === activeFocusId && e.target === node.id) || 
            (e.source === node.id && e.target === activeFocusId)
        );

        return (
          <Node 
            key={node.id} 
            node={node} 
            isHighlighted={!!isHighlighted}
            isDimmed={isDimmed}
            onClick={onNodeClick}
          />
        );
      })}

      <EffectComposer enableNormalPass={false}>
        <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} radius={0.6} />
      </EffectComposer>
    </>
  );
};

export default function GraphCanvas(props: GraphCanvasProps) {
  return (
    <Canvas 
      camera={{ position: [0, 0, 20], fov: 60 }}
      gl={{ toneMapping: THREE.ReinhardToneMapping }}
    >
      <SceneContent {...props} />
    </Canvas>
  );
}