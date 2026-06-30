export interface NodeData {
  id: string;
  name: string;
  group: string;
  url: string;
  x?: number;
  y?: number;
  z?: number;
  vx?: number;
  vy?: number;
  vz?: number;
}

export interface EdgeData {
  source: string;
  target: string;
  value?: number;
}

export interface GraphData {
  nodes: NodeData[];
  edges: EdgeData[];
}

export interface SimulationConfig {
  repulsion: number;
  attraction: number;
  damping: number;
  centerStrength: number;
}