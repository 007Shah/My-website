import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, ExternalLink, RefreshCw, Zap } from 'lucide-react';
import { NodeData } from '../types';

interface ControlsProps {
  onGenerate: (topic: string, subtopics: string, relations: string) => void;
  onSearch: (query: string) => void;
  selectedNode: NodeData | null;
  matchCount: number;
  currentMatchIndex: number;
  onNextMatch: () => void;
  onPrevMatch: () => void;
}

export default function Controls({ 
  onGenerate, 
  onSearch, 
  selectedNode, 
  matchCount, 
  currentMatchIndex,
  onNextMatch,
  onPrevMatch
}: ControlsProps) {
  const [topic, setTopic] = useState("Artificial Intelligence");
  const [subtopics, setSubtopics] = useState("Machine Learning, Neural Networks, Robotics, NLP, Computer Vision, Ethics");
  const [relations, setRelations] = useState("Machine Learning -> Neural Networks\nNLP -> Machine Learning\nRobotics -> Computer Vision\nEthics -> AI");
  const [isOpen, setIsOpen] = useState(true);
  const [searchVal, setSearchVal] = useState("");

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(topic, subtopics, relations);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none flex flex-col justify-between p-6 z-10 font-sans">
      
      {/* Header */}
      <div className="w-full flex justify-between items-start pointer-events-auto">
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg blur opacity-30 group-hover:opacity-75 transition duration-200"></div>
            <div className="relative flex items-center gap-2 bg-black/80 backdrop-blur-xl border border-white/10 p-2.5 rounded-lg w-72">
                <Search size={18} className="text-cyan-400" />
                <input 
                  type="text" 
                  placeholder="Search nodes..." 
                  className="bg-transparent border-none outline-none text-white text-sm w-full placeholder-gray-600 focus:placeholder-gray-400"
                  value={searchVal}
                  onChange={handleSearch}
                />
            </div>
          </div>
          
          {/* Navigation */}
          {matchCount > 0 && (
            <div className="flex items-center gap-1 bg-black/80 backdrop-blur-xl border border-cyan-500/30 p-1.5 rounded-lg text-white">
              <button onClick={onPrevMatch} className="p-1 hover:bg-cyan-500/20 rounded text-cyan-400">
                <ChevronLeft size={18} />
              </button>
              <span className="text-xs font-mono w-16 text-center text-gray-300">
                {currentMatchIndex + 1} / {matchCount}
              </span>
              <button onClick={onNextMatch} className="p-1 hover:bg-cyan-500/20 rounded text-cyan-400">
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Title */}
        <div className="flex flex-col items-end">
            <h1 className="text-3xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                NEUROGRAPH
            </h1>
            <div className="flex items-center gap-2 text-xs text-cyan-300/80 uppercase tracking-[0.2em]">
                <Zap size={10} className="fill-current" />
                Visualizer
            </div>
        </div>
      </div>

      {/* Input Panel */}
      <div className="pointer-events-auto w-80 self-start mt-auto relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-b from-purple-500 to-pink-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
        <div className={`relative bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[80vh]' : 'max-h-14'}`}>
          
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="w-full p-4 flex justify-between items-center bg-white/5 hover:bg-white/10 border-b border-white/5"
          >
            <div className="flex items-center gap-2 text-pink-400">
                <RefreshCw size={16} className={isOpen ? "rotate-180" : ""} />
                <span className="tracking-wide font-bold text-gray-200">DATA INPUT</span>
            </div>
            {isOpen ? <ChevronDown size={16} className="text-white" /> : <ChevronUp size={16} className="text-white" />}
          </button>

          <div className="p-5 space-y-5 overflow-y-auto max-h-[calc(80vh-4rem)]">
            <div className="space-y-1.5">
              <label className="text-[10px] text-pink-400 font-bold uppercase tracking-wider">Main Topic</label>
              <input 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-md p-2.5 text-sm text-white focus:border-pink-500 outline-none transition-all"
                placeholder="Topic..."
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">Subtopics</label>
              <textarea 
                value={subtopics}
                onChange={(e) => setSubtopics(e.target.value)}
                rows={3}
                className="w-full bg-black/50 border border-white/10 rounded-md p-2.5 text-sm text-white focus:border-cyan-500 outline-none resize-none transition-all"
                placeholder="Comma separated..."
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">Relationships</label>
              <textarea 
                value={relations}
                onChange={(e) => setRelations(e.target.value)}
                rows={4}
                className="w-full bg-black/50 border border-white/10 rounded-md p-2.5 text-sm text-white focus:border-purple-500 outline-none resize-none font-mono text-xs transition-all"
                placeholder="A -> B"
              />
            </div>
            <button 
              onClick={handleGenerate}
              className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-lg font-bold text-sm transition-all active:scale-95 border border-white/10"
            >
              GENERATE GRAPH
            </button>
          </div>
        </div>
      </div>

      {/* Node Info */}
      {selectedNode && (
        <div className="absolute bottom-6 right-6 w-72 pointer-events-auto">
            <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg blur opacity-50"></div>
                <div className="relative bg-black/90 backdrop-blur-xl border border-white/10 rounded-lg p-5 text-white shadow-2xl">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-white leading-tight">{selectedNode.name}</h3>
                        <div className={`w-2 h-2 rounded-full shadow-[0_0_8px] ${selectedNode.group === 'main' ? 'bg-pink-500 shadow-pink-500' : 'bg-cyan-400 shadow-cyan-400'}`}></div>
                    </div>
                    
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-white/5 border border-white/10 text-gray-400 mb-4">
                        {selectedNode.group} Node
                    </span>
                    
                    <a 
                        href={selectedNode.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-2 bg-white/10 hover:bg-white/20 border border-white/5 rounded-md text-xs font-bold uppercase tracking-wide transition-all"
                    >
                        View Wiki <ExternalLink size={14} />
                    </a>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}