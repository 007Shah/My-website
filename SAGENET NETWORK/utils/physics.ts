import { NodeData, EdgeData, SimulationConfig } from '../types';

export const updatePhysics = (
  nodes: NodeData[],
  edges: EdgeData[],
  config: SimulationConfig
) => {
  const { repulsion, attraction, damping, centerStrength } = config;

  // 1. Repulsion (Nodes repel each other)
  for (let i = 0; i < nodes.length; i++) {
    const nodeA = nodes[i];
    for (let j = i + 1; j < nodes.length; j++) {
      const nodeB = nodes[j];

      const dx = (nodeA.x || 0) - (nodeB.x || 0);
      const dy = (nodeA.y || 0) - (nodeB.y || 0);
      const dz = (nodeA.z || 0) - (nodeB.z || 0);

      const distSq = dx * dx + dy * dy + dz * dz || 1;
      const force = repulsion / distSq;
      const dist = Math.sqrt(distSq);

      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;
      const fz = (dz / dist) * force;

      nodeA.vx = (nodeA.vx || 0) + fx;
      nodeA.vy = (nodeA.vy || 0) + fy;
      nodeA.vz = (nodeA.vz || 0) + fz;

      nodeB.vx = (nodeB.vx || 0) - fx;
      nodeB.vy = (nodeB.vy || 0) - fy;
      nodeB.vz = (nodeB.vz || 0) - fz;
    }
  }

  // 2. Attraction (Edges pull nodes together)
  edges.forEach(edge => {
    const sourceNode = nodes.find(n => n.id === edge.source);
    const targetNode = nodes.find(n => n.id === edge.target);

    if (sourceNode && targetNode) {
      const dx = (targetNode.x || 0) - (sourceNode.x || 0);
      const dy = (targetNode.y || 0) - (sourceNode.y || 0);
      const dz = (targetNode.z || 0) - (sourceNode.z || 0);

      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
      const force = (dist - 2) * attraction; // Spring rest length = 2

      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;
      const fz = (dz / dist) * force;

      sourceNode.vx = (sourceNode.vx || 0) + fx;
      sourceNode.vy = (sourceNode.vy || 0) + fy;
      sourceNode.vz = (sourceNode.vz || 0) + fz;

      targetNode.vx = (targetNode.vx || 0) - fx;
      targetNode.vy = (targetNode.vy || 0) - fy;
      targetNode.vz = (targetNode.vz || 0) - fz;
    }
  });

  // 3. Center Gravity & Damping
  nodes.forEach(node => {
    node.vx = (node.vx || 0) - (node.x || 0) * centerStrength;
    node.vy = (node.vy || 0) - (node.y || 0) * centerStrength;
    node.vz = (node.vz || 0) - (node.z || 0) * centerStrength;

    node.vx *= damping;
    node.vy *= damping;
    node.vz *= damping;

    node.x = (node.x || 0) + node.vx;
    node.y = (node.y || 0) + node.vy;
    node.z = (node.z || 0) + node.vz;
  });
};