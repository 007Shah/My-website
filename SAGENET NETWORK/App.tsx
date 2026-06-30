import React, { useState, useEffect, useCallback, useMemo } from 'react';
import GraphCanvas from './components/GraphCanvas';
import Controls from './components/Controls';
import { parseInputToGraph } from './services/mockBackend';
import { GraphData, NodeData } from './types';

export default function App() {
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], edges: [] });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Initial load
  useEffect(() => {
    handleGenerate(
      "Artificial Intelligence",
      "Machine Learning, Neural Networks, Robotics, NLP, Computer Vision, Ethics",
      "Machine Learning -> Neural Networks\nNLP -> Machine Learning\nRobotics -> Computer Vision\nEthics -> AI"
    );
  }, []);

  const handleGenerate = (topic: string, sub: string, rel: string) => {
    const data = parseInputToGraph(topic, sub, rel);
    setGraphData(data);
    setSelectedNodeId(null);
  };

  const matches = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return graphData.nodes.filter(n => n.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery, graphData.nodes]);

  useEffect(() => {
    if (matches.length > 0) {
      setSelectedNodeId(matches[0].id);
    } else if (searchQuery.trim()) {
      setSelectedNodeId(null);
    }
  }, [matches, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleNextMatch = () => {
    if (matches.length === 0) return;
    const currentIndex = matches.findIndex(n => n.id === selectedNodeId);
    const nextIndex = (currentIndex + 1) % matches.length;
    setSelectedNodeId(matches[nextIndex].id);
  };

  const handlePrevMatch = () => {
    if (matches.length === 0) return;
    const currentIndex = matches.findIndex(n => n.id === selectedNodeId);
    const prevIndex = (currentIndex - 1 + matches.length) % matches.length;
    setSelectedNodeId(matches[prevIndex].id);
  };

  const handleNodeClick = useCallback((node: NodeData) => {
    setSelectedNodeId(node.id);
    window.open(node.url, '_blank');
  }, []);

  const selectedNode = graphData.nodes.find(n => n.id === selectedNodeId) || null;
  const currentMatchIndex = matches.findIndex(n => n.id === selectedNodeId);
  const matchingNodeIds = useMemo(() => matches.map(n => n.id), [matches]);

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden">
      <div className="absolute inset-0 z-0">
        <GraphCanvas 
          nodes={graphData.nodes} 
          edges={graphData.edges}
          matchingNodeIds={matchingNodeIds}
          onNodeClick={handleNodeClick}
          selectedNodeId={selectedNodeId}
        />
      </div>

      <Controls 
        onGenerate={handleGenerate} 
        onSearch={handleSearch}
        selectedNode={selectedNode}
        matchCount={matches.length}
        currentMatchIndex={currentMatchIndex === -1 ? 0 : currentMatchIndex}
        onNextMatch={handleNextMatch}
        onPrevMatch={handlePrevMatch}
      />
    </div>
  );
}