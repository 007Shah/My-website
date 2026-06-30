import { GraphData, NodeData, EdgeData } from '../types';

export const parseInputToGraph = (
  topic: string, 
  subtopics: string, 
  relationships: string
): GraphData => {
  const nodes: NodeData[] = [];
  const edges: EdgeData[] = [];
  const nodeSet = new Set<string>();

  const addNode = (name: string, group: string) => {
    const trimmedName = name.trim();
    if (!trimmedName) return;
    
    if (!nodeSet.has(trimmedName)) {
      nodeSet.add(trimmedName);
      nodes.push({
        id: trimmedName,
        name: trimmedName,
        group: group,
        url: `https://en.wikipedia.org/wiki/${encodeURIComponent(trimmedName)},
        x: (Math.random() - 0.5) * 10,
        y: (Math.random() - 0.5) * 10,
        z: (Math.random() - 0.5) * 10,
        vx: 0, vy: 0, vz: 0
      });
    }
  };

  if (topic.trim()) addNode(topic, 'main');

  const subtopicList = subtopics.split(',').map(s => s.trim()).filter(s => s);
  subtopicList.forEach(sub => {
    addNode(sub, 'subtopic');
    if (topic.trim()) {
      edges.push({ source: topic.trim(), target: sub });
    }
  });

  const relList = relationships.split('\n');
  relList.forEach(rel => {
    let source = '';
    let target = '';
    if (rel.includes('->')) {
      [source, target] = rel.split('->');
    } else if (rel.includes(',')) {
      [source, target] = rel.split(',');
    }
    source = source?.trim();
    target = target?.trim();

    if (source && target) {
      addNode(source, 'related');
      addNode(target, 'related');
      const edgeExists = edges.some(e => e.source === source && e.target === target);
      if (!edgeExists) edges.push({ source, target });
    }
  });

  return { nodes, edges };
};