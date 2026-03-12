import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import * as THREE from 'three';
import { animate } from 'animejs';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Terminal, 
  Database, 
  Brain, 
  Cpu, 
  Activity, 
  Zap, 
  LayoutDashboard, 
  Network, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Sun, 
  Moon,
  ChevronRight,
  Lock,
  User,
  GitBranch,
  Code,
  BarChart3,
  Globe,
  Layers,
  Search,
  Bell,
  ArrowUpRight,
  Play,
  Pause,
  RefreshCw,
  FileText,
  Users,
  Eye,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  Filter
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  Legend
} from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Utility ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
type Theme = 'dark' | 'light';
type Page = 'home' | 'auth' | 'neural' | 'fleet' | 'admin' | 'doctor' | 'about';
type AgentType = 'brain' | 'kidney' | 'heart' | 'glaucoma';

interface AgentData {
  id: AgentType;
  name: string;
  icon: React.ReactNode;
  description: string;
  color: string;
  gradient: string;
  features: string[];
}

// --- Constants ---
const AGENTS: AgentData[] = [
  {
    id: 'brain',
    name: 'Cerebro-Scan',
    icon: <Brain className="w-8 h-8" />,
    description: 'Advanced neural imaging agent for precise brain tumor localization and classification.',
    color: 'indigo',
    gradient: 'from-indigo-500 to-violet-600',
    features: ['Tumor Segmentation', 'Tissue Density Analysis', 'Growth Prediction']
  },
  {
    id: 'kidney',
    name: 'Renal-Vision',
    icon: <Database className="w-8 h-8" />,
    description: 'Specialized nephrology agent for detecting renal calculi and structural abnormalities.',
    color: 'cyan',
    gradient: 'from-cyan-500 to-blue-600',
    features: ['Stone Composition', 'Obstruction Mapping', 'Volume Calculation']
  },
  {
    id: 'heart',
    name: 'Cardio-Sync',
    icon: <Activity className="w-8 h-8" />,
    description: 'Cardiovascular diagnostic agent for identifying signs of heart failure and valve dysfunction.',
    color: 'rose',
    gradient: 'from-rose-500 to-red-600',
    features: ['Ejection Fraction', 'Wall Motion Analysis', 'Vascular Resistance']
  },
  {
    id: 'glaucoma',
    name: 'Optic-Nexus',
    icon: <Shield className="w-8 h-8" />,
    description: 'Ophthalmology agent focused on optic nerve analysis and early glaucoma detection.',
    color: 'emerald',
    gradient: 'from-emerald-500 to-teal-600',
    features: ['Cup-to-Disc Ratio', 'Nerve Fiber Mapping', 'Intraocular Pressure']
  }
];

// --- Three.js Components ---

const ThreeBackground: React.FC<{ theme: Theme; page: Page; activeAgent: AgentType | null }> = ({ theme, page, activeAgent }) => {
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

    // Dynamic Objects
    let sphere: THREE.Mesh | null = null;
    let particles: THREE.Points | null = null;
    let grid: THREE.GridHelper | null = null;

    const createHeroScene = () => {
      const geometry = new THREE.IcosahedronGeometry(2, 2);
      const material = new THREE.MeshBasicMaterial({ 
        color: theme === 'dark' ? 0x6366f1 : 0xf43f5e, 
        wireframe: true,
        transparent: true,
        opacity: 0.4
      });
      sphere = new THREE.Mesh(geometry, material);
      scene.add(sphere);

      // Add stars
      const starGeometry = new THREE.BufferGeometry();
      const starCount = 2000;
      const posArray = new Float32Array(starCount * 3);
      for (let i = 0; i < starCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 10;
      }
      starGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
      const starMaterial = new THREE.PointsMaterial({ 
        size: 0.005, 
        color: theme === 'dark' ? 0xffffff : 0x000000,
        transparent: true,
        opacity: 0.5
      });
      particles = new THREE.Points(starGeometry, starMaterial);
      scene.add(particles);
    };

    const createDashboardScene = () => {
      grid = new THREE.GridHelper(20, 20, theme === 'dark' ? 0x333333 : 0xcccccc, theme === 'dark' ? 0x222222 : 0xdddddd);
      grid.rotation.x = Math.PI / 2;
      grid.position.z = -5;
      scene.add(grid);
    };

    if (page === 'home' || page === 'auth') createHeroScene();
    if (page === 'fleet' || page === 'neural') createDashboardScene();

    camera.position.z = 5;

    const onMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', onMouseMove);

    const animate = () => {
      requestAnimationFrame(animate);
      
      if (sphere) {
        sphere.rotation.y += 0.002;
        sphere.rotation.x += 0.001;
        sphere.position.x += (mouse.current.x * 0.5 - sphere.position.x) * 0.05;
        sphere.position.y += (mouse.current.y * 0.5 - sphere.position.y) * 0.05;
      }

      if (particles) {
        particles.rotation.y += 0.0005;
        particles.position.x += (mouse.current.x * 0.2 - particles.position.x) * 0.02;
      }

      if (grid) {
        grid.rotation.z += 0.001;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [theme, page]);

  return <div ref={containerRef} className="fixed inset-0 -z-10 pointer-events-none opacity-50" />;
};

// --- Charts ---

const ModelPerformanceChart: React.FC<{ theme: Theme; color: string }> = ({ theme, color }) => {
  const data = [
    { epoch: 1, train: 65, val: 60 },
    { epoch: 2, train: 75, val: 72 },
    { epoch: 3, train: 82, val: 78 },
    { epoch: 4, train: 88, val: 82 },
    { epoch: 5, train: 92, val: 85 },
    { epoch: 6, train: 95, val: 87 },
    { epoch: 7, train: 97, val: 88 },
    { epoch: 8, train: 98, val: 89 },
    { epoch: 9, train: 99, val: 89.5 },
    { epoch: 10, train: 99.5, val: 90 },
  ];

  const strokeColor = color === 'indigo' ? '#6366f1' : color === 'cyan' ? '#06b6d4' : color === 'rose' ? '#f43f5e' : '#10b981';

  return (
    <div className="h-64 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorTrain" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={strokeColor} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={strokeColor} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
          <XAxis 
            dataKey="epoch" 
            stroke={theme === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)'} 
            fontSize={10}
            label={{ value: 'Epochs', position: 'insideBottom', offset: -5, fontSize: 10, fill: theme === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}
          />
          <YAxis 
            stroke={theme === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)'} 
            fontSize={10}
            label={{ value: 'Accuracy %', angle: -90, position: 'insideLeft', fontSize: 10, fill: theme === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff', 
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              fontSize: '12px'
            }} 
          />
          <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
          <Area type="monotone" dataKey="train" name="Training Accuracy" stroke={strokeColor} fillOpacity={1} fill="url(#colorTrain)" />
          <Area type="monotone" dataKey="val" name="Validation Accuracy" stroke="#94a3b8" fillOpacity={0} />
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex justify-between mt-2 px-2">
        <div className="flex items-center gap-1 text-[10px] opacity-60">
          <AlertCircle className="w-3 h-3 text-amber-500" />
          <span>Slight Overfitting detected after Epoch 8</span>
        </div>
        <div className="text-[10px] font-bold text-emerald-500">OPTIMAL_FIT</div>
      </div>
    </div>
  );
};

// --- UI Components ---

const Navbar: React.FC<{ 
  theme: Theme; 
  setTheme: (t: Theme) => void; 
  setPage: (p: Page) => void;
  page: Page;
  siteName: string;
}> = ({ theme, setTheme, setPage, page, siteName }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'HOME' },
    { id: 'about', label: 'ABOUT' },
    { id: 'neural', label: 'MESH' },
    { id: 'fleet', label: 'FLEET' },
  ];

  const handlePageChange = (p: Page) => {
    setPage(p);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className={cn(
        "fixed top-6 left-1/2 -translate-x-1/2 z-50 px-8 py-4 transition-all duration-500 rounded-[2rem] border w-[90%] max-w-6xl",
        isScrolled 
          ? (theme === 'dark' ? "glass-dark border-white/10 shadow-2xl" : "glass-light border-black/10 shadow-xl")
          : (theme === 'dark' ? "bg-transparent border-transparent" : "bg-transparent border-transparent")
      )}>
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => handlePageChange('home')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
              <Cpu className="w-6 h-6" />
            </div>
            <span className="text-2xl font-display font-bold tracking-tighter uppercase hidden sm:block">{siteName}</span>
          </div>

          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map(link => (
              <button 
                key={link.id}
                onClick={() => handlePageChange(link.id as Page)} 
                className={cn("text-sm font-bold transition-all", page === link.id ? "text-indigo-500" : "opacity-60 hover:opacity-100")}
              >
                {link.label}
              </button>
            ))}
            
            <div className="w-px h-4 bg-white/10 mx-2" />
            
            <button 
              onClick={() => handlePageChange('doctor')} 
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2",
                page === 'doctor' ? "bg-indigo-500 text-white" : "bg-white/5 hover:bg-white/10"
              )}
            >
              <User className="w-3 h-3" /> DOCTOR_PORTAL
            </button>
            <button 
              onClick={() => handlePageChange('admin')} 
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2",
                page === 'admin' ? "bg-rose-500 text-white" : "bg-white/5 hover:bg-white/10"
              )}
            >
              <Lock className="w-3 h-3" /> ADMIN_CONSOLE
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={cn(
                "p-2.5 rounded-xl transition-all",
                theme === 'dark' ? "bg-white/5 hover:bg-white/10 text-amber-400" : "bg-black/5 hover:bg-black/10 text-indigo-600"
              )}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button 
              onClick={() => handlePageChange('auth')}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 hidden sm:block"
            >
              SIGN_IN
            </button>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-white/5 border border-white/10"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className={cn(
          "fixed inset-0 z-40 lg:hidden flex flex-col items-center justify-center gap-8 p-6 pt-32",
          theme === 'dark' ? "bg-slate-950/95 backdrop-blur-xl" : "bg-white/95 backdrop-blur-xl"
        )}>
          {navLinks.map(link => (
            <button 
              key={link.id}
              onClick={() => handlePageChange(link.id as Page)} 
              className={cn("text-3xl font-display font-bold", page === link.id ? "text-indigo-500" : "opacity-60")}
            >
              {link.label}
            </button>
          ))}
          <div className="w-full h-px bg-white/10 max-w-xs" />
          <button 
            onClick={() => handlePageChange('doctor')} 
            className={cn("text-2xl font-display font-bold flex items-center gap-3", page === 'doctor' ? "text-indigo-500" : "opacity-60")}
          >
            <User className="w-6 h-6" /> DOCTOR_PORTAL
          </button>
          <button 
            onClick={() => handlePageChange('admin')} 
            className={cn("text-2xl font-display font-bold flex items-center gap-3", page === 'admin' ? "text-rose-500" : "opacity-60")}
          >
            <Lock className="w-6 h-6" /> ADMIN_CONSOLE
          </button>
          <button 
            onClick={() => handlePageChange('auth')}
            className="mt-4 px-12 py-4 rounded-2xl bg-indigo-600 text-white font-bold shadow-xl shadow-indigo-500/20"
          >
            SIGN_IN
          </button>
        </div>
      )}
    </>
  );
};

const AgentCard: React.FC<{ 
  agent: AgentData; 
  onClick: () => void;
  theme: Theme;
}> = ({ agent, onClick, theme }) => {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "group relative p-8 rounded-3xl cursor-pointer transition-all duration-500 hover:-translate-y-2",
        theme === 'dark' ? "glass-dark" : "glass-light"
      )}
    >
      <div className={cn(
        "w-16 h-16 rounded-2xl mb-6 flex items-center justify-center text-white bg-gradient-to-br shadow-xl transition-transform group-hover:scale-110",
        agent.gradient
      )}>
        {agent.icon}
      </div>
      <h3 className="text-2xl font-display font-bold mb-3">{agent.name}</h3>
      <p className="text-sm opacity-60 mb-6 leading-relaxed">{agent.description}</p>
      
      <div className="space-y-2">
        {agent.features.map((f, i) => (
          <div key={i} className="flex items-center gap-2 text-xs font-medium opacity-80">
            <div className={cn("w-1 h-1 rounded-full bg-current")} />
            {f}
          </div>
        ))}
      </div>

      <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
        <ArrowUpRight className="w-6 h-6" />
      </div>
    </div>
  );
};

const AgentWorkspace: React.FC<{ 
  agent: AgentData; 
  onClose: () => void;
  theme: Theme;
}> = ({ agent, onClose, theme }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
        setIsActive(true);
        startAnalysis();
      };
      reader.readAsDataURL(file);
    }
  };

  const startAnalysis = () => {
    setIsAnalyzing(true);
    setProgress(0);
    setLogs([`[${new Date().toLocaleTimeString()}] Initializing ${agent.name} neural mesh...`]);
    
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 15;
      if (currentProgress >= 100) {
        currentProgress = 100;
        setIsAnalyzing(false);
        clearInterval(interval);
        setLogs(prev => [`[${new Date().toLocaleTimeString()}] Analysis complete. High confidence detection.`, ...prev]);
      } else {
        const logMsg = currentProgress > 50 ? 'Mapping structural anomalies...' : 'Normalizing MRI slices...';
        if (Math.random() > 0.7) setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${logMsg}`, ...prev]);
      }
      setProgress(currentProgress);
    }, 400);
  };

  return (
    <div className={cn(
      "fixed inset-0 z-[100] flex flex-col p-6 md:p-12 transition-all duration-700",
      theme === 'dark' ? "bg-[#050505]" : "bg-[#F8FAFC]"
    )}>
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-4">
          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white bg-gradient-to-br", agent.gradient)}>
            {agent.icon}
          </div>
          <div>
            <h2 className="text-3xl font-display font-bold">{agent.name}</h2>
            <p className="text-sm opacity-60">Medical Diagnostic Agent v5.0.1</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-3 rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-8 h-8" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 overflow-hidden">
        {/* Main Interface */}
        <div className={cn(
          "lg:col-span-2 rounded-3xl p-8 flex flex-col",
          theme === 'dark' ? "glass-dark" : "glass-light"
        )}>
          {!selectedImage ? (
            <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-2xl p-12 text-center">
              <div className={cn("w-20 h-20 rounded-full flex items-center justify-center mb-6 bg-white/5", agent.color === 'indigo' ? 'text-indigo-500' : agent.color === 'cyan' ? 'text-cyan-500' : agent.color === 'rose' ? 'text-rose-500' : 'text-emerald-500')}>
                <Search className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Upload MRI Scan</h3>
              <p className="opacity-60 mb-8 max-w-md">Please provide a high-resolution DICOM or MRI image for neural analysis.</p>
              <label className={cn("px-8 py-4 rounded-xl font-bold text-white cursor-pointer transition-all bg-gradient-to-r", agent.gradient)}>
                Select File
                <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
              </label>
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
                    isAnalyzing ? "bg-amber-500/20 text-amber-500" : "bg-emerald-500/20 text-emerald-500"
                  )}>
                    {isAnalyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                    {isAnalyzing ? 'ANALYZING...' : 'DIAGNOSIS READY'}
                  </div>
                  <div className="text-xs font-mono opacity-50">SCAN_ID: MRI_{Math.floor(Math.random() * 10000)}</div>
                </div>
                <button onClick={() => setSelectedImage(null)} className="text-xs font-bold opacity-40 hover:opacity-100">CLEAR SCAN</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
                <div className="relative rounded-2xl overflow-hidden bg-black/40 border border-white/5 group">
                  <img src={selectedImage} alt="MRI Scan" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000" />
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-indigo-500/10 backdrop-blur-[2px] flex items-center justify-center">
                      <div className="w-full h-1 bg-indigo-500/50 absolute top-0 animate-scan" />
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 right-4 p-4 glass-dark rounded-xl text-[10px] font-mono">
                    COORDINATES: [X: 142.4, Y: 88.2, Z: 12.1]
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                    <h4 className="text-sm font-bold mb-4 opacity-60 uppercase tracking-widest">Neural Confidence</h4>
                    <div className="flex items-end gap-4 mb-2">
                      <span className="text-5xl font-bold">{Math.floor(progress)}%</span>
                      <span className="text-xs opacity-40 mb-2">PROBABILITY</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className={cn("h-full transition-all duration-300 bg-gradient-to-r", agent.gradient)} style={{ width: `${progress}%` }} />
                    </div>
                  </div>

                  <div className="flex-1 p-6 rounded-2xl bg-black/20 border border-white/5 font-mono text-xs overflow-y-auto">
                    <div className="text-indigo-400 mb-4"># ANALYSIS_LOGS</div>
                    <div className="space-y-2">
                      {logs.map((log, i) => (
                        <div key={i} className="opacity-70">{log}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-8">
          <div className={cn(
            "rounded-3xl p-6",
            theme === 'dark' ? "glass-dark" : "glass-light"
          )}>
            <h4 className="text-lg font-display font-bold mb-4">Clinical Parameters</h4>
            <div className="space-y-4">
              {agent.features.map((f, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-2">
                    <span>{f}</span>
                    <span>{isActive ? 'Active' : 'Standby'}</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className={cn("h-full bg-gradient-to-r", agent.gradient)} style={{ width: isActive ? '85%' : '0%' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={cn(
            "rounded-3xl p-6",
            theme === 'dark' ? "glass-dark" : "glass-light"
          )}>
            <h4 className="text-lg font-display font-bold mb-4">Model Performance</h4>
            <p className="text-[10px] opacity-60 mb-2">Training vs Validation Accuracy (Matplotlib-style Neural Visualization)</p>
            <ModelPerformanceChart theme={theme} color={agent.color} />
          </div>

          <div className={cn(
            "rounded-3xl p-6 flex-1",
            theme === 'dark' ? "glass-dark" : "glass-light"
          )}>
            <h4 className="text-lg font-display font-bold mb-4">Clinical Actions</h4>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex flex-col items-center gap-2">
                <Settings className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase">Settings</span>
              </button>
              <button className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex flex-col items-center gap-2">
                <Layers className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase">Export</span>
              </button>
              <button className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex flex-col items-center gap-2">
                <Activity className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase">Vitals</span>
              </button>
              <button className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex flex-col items-center gap-2">
                <LogOut className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase">Reset</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard: React.FC<{ theme: Theme; siteName: string; setSiteName: (s: string) => void }> = ({ theme, siteName, setSiteName }) => {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("System configuration updated successfully.");
    }, 1000);
  };

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="text-5xl font-display font-bold mb-2">Admin Control</h2>
          <p className="opacity-60">System-wide management of medical AI nodes and data integrity.</p>
        </div>
        <div className="flex gap-4">
          <div className={cn(
            "px-6 py-3 rounded-xl border text-sm font-bold flex items-center gap-2",
            maintenanceMode ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
          )}>
            {maintenanceMode ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            {maintenanceMode ? 'MAINTENANCE_MODE' : 'SYSTEM_SECURE'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className={cn("lg:col-span-2 rounded-[2.5rem] p-10", theme === 'dark' ? "glass-dark" : "glass-light")}>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-display font-bold">Site Configuration</h3>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className={cn(
                "text-xs font-bold text-indigo-500 hover:underline disabled:opacity-50",
                isSaving && "animate-pulse"
              )}
            >
              {isSaving ? 'SAVING...' : 'SAVE CHANGES'}
            </button>
          </div>
          
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold opacity-60 uppercase">Platform Name</label>
                <input 
                  type="text" 
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className={cn(
                    "w-full px-4 py-3 rounded-xl outline-none transition-all border",
                    theme === 'dark' ? "bg-white/5 border-white/10 focus:border-indigo-500" : "bg-black/5 border-black/10 focus:border-indigo-500"
                  )}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold opacity-60 uppercase">Primary Accent Color</label>
                <div className="flex gap-3">
                  {['#6366f1', '#06b6d4', '#10b981', '#f43f5e'].map(c => (
                    <button key={c} className="w-10 h-10 rounded-full border-2 border-white/10" style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold">Maintenance Mode</div>
                  <div className="text-xs opacity-40">Disable public access for updates</div>
                </div>
                <button 
                  onClick={() => setMaintenanceMode(!maintenanceMode)}
                  className={cn(
                    "w-12 h-6 rounded-full transition-all relative",
                    maintenanceMode ? "bg-indigo-600" : "bg-white/10"
                  )}
                >
                  <div className={cn("absolute top-1 w-4 h-4 rounded-full bg-white transition-all", maintenanceMode ? "right-1" : "left-1")} />
                </button>
              </div>
              <div className="h-px bg-white/10" />
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold">Neural Mesh Auto-Scaling</div>
                  <div className="text-xs opacity-40">Automatically scale nodes based on demand</div>
                </div>
                <button className="w-12 h-6 rounded-full bg-indigo-600 relative">
                  <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-white" />
                </button>
              </div>
            </div>
          </div>

          <h3 className="text-2xl font-display font-bold mt-12 mb-8">Node Infrastructure</h3>
          <div className="space-y-4">
            {[
              { name: "Neural-Core-Alpha", status: "Active", load: 65, uptime: "142d" },
              { name: "Imaging-Node-Beta", status: "Active", load: 22, uptime: "89d" },
              { name: "Diagnostic-Edge-Gamma", status: "Maintenance", load: 0, uptime: "12h" }
            ].map((node, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={cn("w-3 h-3 rounded-full", node.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500')} />
                  <div>
                    <div className="font-bold">{node.name}</div>
                    <div className="text-xs opacity-40">UPTIME: {node.uptime}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold">{node.load}% LOAD</div>
                  <div className="text-[10px] opacity-40 uppercase font-bold">{node.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-8">
          <div className={cn("rounded-[2.5rem] p-8", theme === 'dark' ? "glass-dark" : "glass-light")}>
            <h4 className="text-xl font-display font-bold mb-6">Security Audit</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                <span className="text-xs font-bold opacity-60">ENCRYPTION</span>
                <span className="text-xs font-bold text-emerald-500">AES-256</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                <span className="text-xs font-bold opacity-60">HIPAA_COMPLIANCE</span>
                <span className="text-xs font-bold text-emerald-500">VERIFIED</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                <span className="text-xs font-bold opacity-60">DATA_RESIDENCY</span>
                <span className="text-xs font-bold text-emerald-500">LOCAL_ONLY</span>
              </div>
            </div>
          </div>
          
          <div className={cn("rounded-[2.5rem] p-8", theme === 'dark' ? "glass-dark" : "glass-light")}>
            <h4 className="text-xl font-display font-bold mb-6">Quick Reports</h4>
            <div className="space-y-3">
              <button className="w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-3">
                <FileText className="w-5 h-5 text-indigo-500" />
                <span className="text-sm font-bold">Monthly Audit PDF</span>
              </button>
              <button className="w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-3">
                <Users className="w-5 h-5 text-cyan-500" />
                <span className="text-sm font-bold">User Access Log</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DoctorDashboard: React.FC<{ theme: Theme }> = ({ theme }) => {
  const [activeTab, setActiveTab] = useState<'patients' | 'consultations' | 'reviews'>('patients');
  const [isConsulting, setIsConsulting] = useState(false);

  const startConsultation = () => {
    setIsConsulting(true);
    setTimeout(() => {
      setIsConsulting(false);
      alert("New consultation session initialized.");
    }, 800);
  };

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
        <div>
          <h2 className="text-5xl font-display font-bold mb-2">Doctor Portal</h2>
          <p className="opacity-60">Patient diagnostics and AI-assisted clinical reviews.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => alert("Filter options: Date, Urgency, Agent Type")}
            className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm font-bold flex items-center gap-2"
          >
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button 
            onClick={startConsultation}
            disabled={isConsulting}
            className="px-8 py-4 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20 flex items-center gap-2 disabled:opacity-50"
          >
            <Users className="w-5 h-5" /> {isConsulting ? 'Initializing...' : 'New Consultation'}
          </button>
        </div>
      </div>

      <div className="flex gap-6 mb-8 border-b border-white/10">
        {['patients', 'consultations', 'reviews'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={cn(
              "pb-4 px-2 text-sm font-bold transition-all relative",
              activeTab === tab ? "text-indigo-500" : "opacity-40 hover:opacity-100"
            )}
          >
            {tab.toUpperCase()}
            {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className={cn("lg:col-span-2 rounded-[2.5rem] p-10", theme === 'dark' ? "glass-dark" : "glass-light")}>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-display font-bold">Active Patient List</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
              <input 
                type="text" 
                placeholder="Search patients..."
                className={cn(
                  "pl-10 pr-4 py-2 rounded-lg outline-none text-xs border",
                  theme === 'dark' ? "bg-white/5 border-white/10 focus:border-indigo-500" : "bg-black/5 border-black/10 focus:border-indigo-500"
                )}
              />
            </div>
          </div>

          <div className="space-y-4">
            {[
              { patient: "John Doe", age: 42, agent: "Cerebro-Scan", result: "Negative", date: "2h ago", status: "Completed" },
              { patient: "Jane Smith", age: 35, agent: "Renal-Vision", result: "Positive (2.4mm)", date: "5h ago", status: "Review Required" },
              { patient: "Robert Brown", age: 58, agent: "Cardio-Sync", result: "Stable", date: "1d ago", status: "Completed" },
              { patient: "Alice Wilson", age: 29, agent: "Optic-Nexus", result: "High Risk", date: "2d ago", status: "Urgent" }
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between hover:bg-white/10 transition-all cursor-pointer group gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold flex items-center gap-2">
                      {item.patient}
                      <span className="text-[10px] font-normal opacity-40">AGE: {item.age}</span>
                    </div>
                    <div className="text-xs opacity-40 flex items-center gap-2">
                      <Brain className="w-3 h-3" /> {item.agent}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-right">
                    <div className={cn("text-sm font-bold", item.result.includes('Positive') || item.result.includes('High') ? 'text-rose-500' : 'text-emerald-500')}>{item.result}</div>
                    <div className="text-[10px] opacity-40 uppercase font-bold flex items-center justify-end gap-1">
                      <Clock className="w-3 h-3" /> {item.date}
                    </div>
                  </div>
                  <div className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold",
                    item.status === 'Urgent' ? "bg-rose-500/20 text-rose-500" : 
                    item.status === 'Review Required' ? "bg-amber-500/20 text-amber-500" : 
                    "bg-emerald-500/20 text-emerald-500"
                  )}>
                    {item.status.toUpperCase()}
                  </div>
                  <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div className={cn("rounded-[2.5rem] p-8", theme === 'dark' ? "glass-dark" : "glass-light")}>
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-xl font-display font-bold">Clinical Stats</h4>
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm opacity-60">Total Scans</span>
                <span className="text-xl font-bold">1,284</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm opacity-60">Accuracy Rate</span>
                <span className="text-xl font-bold text-emerald-500">99.8%</span>
              </div>
              <div className="h-px bg-white/10" />
              <div className="space-y-2">
                <div className="text-xs font-bold opacity-40 uppercase">Agent Utilization</div>
                <div className="flex gap-1 h-2">
                  <div className="flex-[4] bg-indigo-500 rounded-l-full" />
                  <div className="flex-[3] bg-cyan-500" />
                  <div className="flex-[2] bg-rose-500" />
                  <div className="flex-[1] bg-emerald-500 rounded-r-full" />
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2">
                  <div className="flex items-center gap-1 text-[10px] opacity-60"><div className="w-2 h-2 rounded-full bg-indigo-500" /> Brain</div>
                  <div className="flex items-center gap-1 text-[10px] opacity-60"><div className="w-2 h-2 rounded-full bg-cyan-500" /> Kidney</div>
                  <div className="flex items-center gap-1 text-[10px] opacity-60"><div className="w-2 h-2 rounded-full bg-rose-500" /> Heart</div>
                  <div className="flex items-center gap-1 text-[10px] opacity-60"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Glaucoma</div>
                </div>
              </div>
            </div>
          </div>

          <div className={cn("rounded-[2.5rem] p-8", theme === 'dark' ? "glass-dark" : "glass-light")}>
            <h4 className="text-xl font-display font-bold mb-6">Pending Reviews</h4>
            <div className="text-center py-12 opacity-40">
              <Bell className="w-12 h-12 mx-auto mb-4" />
              <p className="text-sm">All reviews completed.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const About: React.FC<{ theme: Theme }> = ({ theme }) => {
  const floatReveal = {
    initial: { opacity: 0, y: 60, scale: 0.95 },
    whileInView: { opacity: 1, y: 0, scale: 1 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] }
  };

  const staggerContainer = {
    initial: {},
    whileInView: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
        className="text-center mb-20"
      >
        <h2 className="text-6xl font-display font-bold mb-6">About Vitalis AI</h2>
        <p className="text-xl opacity-60 max-w-3xl mx-auto leading-relaxed">
          Vitalis AI is a pioneering medical technology platform that integrates advanced neural orchestration with clinical expertise to redefine diagnostic precision.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-32">
        <motion.div 
          {...floatReveal}
          className="space-y-8"
        >
          <h3 className="text-3xl font-display font-bold">Our Mission</h3>
          <p className="opacity-70 leading-relaxed">
            Founded in 2024, Vitalis AI aims to bridge the gap between cutting-edge artificial intelligence and patient care. We believe that every diagnostic decision should be backed by the most advanced computational insights available.
          </p>
          <div className="grid grid-cols-2 gap-6">
            <motion.div variants={floatReveal} className={cn("p-6 rounded-3xl", theme === 'dark' ? "glass-dark" : "glass-light")}>
              <div className="text-4xl font-bold text-indigo-500 mb-2">99.8%</div>
              <div className="text-xs font-bold opacity-40 uppercase">Diagnostic Accuracy</div>
            </motion.div>
            <motion.div variants={floatReveal} className={cn("p-6 rounded-3xl", theme === 'dark' ? "glass-dark" : "glass-light")}>
              <div className="text-4xl font-bold text-cyan-500 mb-2">1.2s</div>
              <div className="text-xs font-bold opacity-40 uppercase">Average Scan Time</div>
            </motion.div>
          </div>
        </motion.div>
        
        <motion.div 
          {...floatReveal}
          className="relative rounded-[3rem] overflow-hidden group"
        >
          <img 
            src="https://picsum.photos/seed/hospital/800/600" 
            alt="Modern Hospital" 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-12">
            <div className="text-white">
              <div className="text-sm font-bold opacity-60 mb-2">VITALIS CENTRAL HOSPITAL</div>
              <div className="text-2xl font-bold">Where Technology Meets Humanity</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Timeline */}
      <section className="mb-32">
        <motion.h3 {...floatReveal} className="text-3xl font-display font-bold mb-16 text-center">Our Journey</motion.h3>
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, amount: 0.1 }}
          className="relative border-l-2 border-indigo-500/20 ml-4 md:ml-0 md:left-1/2"
        >
          {[
            { year: "2024", title: "Vitalis Founded", desc: "Initial neural mesh architecture developed." },
            { year: "2025", title: "Clinical Trials", desc: "Successful validation across 50 global hospitals." },
            { year: "2026", title: "Global Launch", desc: "Vitalis AI becomes the industry standard." }
          ].map((item, i) => (
            <motion.div 
              key={i}
              variants={floatReveal}
              className={cn(
                "mb-12 relative md:w-1/2",
                i % 2 === 0 ? "md:pr-12 md:text-right md:left-[-50%]" : "md:pl-12 md:left-[50%]"
              )}
            >
              <div className="absolute top-0 w-4 h-4 rounded-full bg-indigo-500 left-[-9px] md:left-auto md:right-[-9px] border-4 border-slate-950" />
              <div className="text-indigo-500 font-bold mb-2">{item.year}</div>
              <h4 className="text-xl font-bold mb-2">{item.title}</h4>
              <p className="opacity-60 text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <div className="mb-32">
        <motion.h3 {...floatReveal} className="text-3xl font-display font-bold mb-12 text-center">Our Neural Agents</motion.h3>
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {AGENTS.map((agent) => (
            <motion.div 
              key={agent.id} 
              variants={floatReveal}
              className={cn("p-8 rounded-[2.5rem] flex flex-col items-center text-center", theme === 'dark' ? "glass-dark" : "glass-light")}
            >
              <div className={cn("w-20 h-20 rounded-2xl mb-6 flex items-center justify-center text-white bg-gradient-to-br shadow-xl", agent.gradient)}>
                {agent.icon}
              </div>
              <h4 className="text-xl font-bold mb-4">{agent.name}</h4>
              <p className="text-sm opacity-60 mb-6">{agent.description}</p>
              <div className="mt-auto space-y-2 w-full">
                {agent.features.map((f, i) => (
                  <div key={i} className="text-[10px] font-bold opacity-40 py-1 border-b border-white/5">{f.toUpperCase()}</div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <motion.div 
        {...floatReveal}
        className={cn("p-12 rounded-[3rem] text-center", theme === 'dark' ? "glass-dark" : "glass-light")}
      >
        <h3 className="text-3xl font-display font-bold mb-6">How to Use Vitalis AI</h3>
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-12"
        >
          {[
            { step: 1, title: "Upload MRI", desc: "Securely upload high-resolution DICOM or MRI scans to our encrypted cloud.", color: "text-indigo-500", bg: "bg-indigo-500/20" },
            { step: 2, title: "Neural Analysis", desc: "Our specialized agents perform multi-layer segmentation and anomaly detection.", color: "text-cyan-500", bg: "bg-cyan-500/20" },
            { step: 3, title: "Clinical Review", desc: "Doctors review the AI findings and finalize the diagnostic report.", color: "text-rose-500", bg: "bg-rose-500/20" }
          ].map((item, i) => (
            <motion.div 
              key={i}
              variants={floatReveal}
              className="space-y-4"
            >
              <div className={cn("w-12 h-12 rounded-full flex items-center justify-center mx-auto font-bold", item.bg, item.color)}>{item.step}</div>
              <h4 className="font-bold">{item.title}</h4>
              <p className="text-sm opacity-60">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

// --- Page Components ---

const Home: React.FC<{ theme: Theme; onAgentClick: (a: AgentData) => void; setPage: (p: Page) => void }> = ({ theme, onAgentClick, setPage }) => {
  const floatReveal = {
    initial: { opacity: 0, y: 60, scale: 0.95 },
    whileInView: { opacity: 1, y: 0, scale: 1 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] }
  };

  const staggerContainer = {
    initial: {},
    whileInView: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <main className="relative pt-32 pb-24 px-6 overflow-hidden">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto text-center mb-32">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 text-indigo-500 text-xs font-bold mb-8 animate-float"
        >
          <Zap className="w-3 h-3" />
          DIAGNOSTIC MESH: ONLINE
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
          className="text-6xl md:text-8xl font-display font-bold tracking-tighter mb-8 leading-[0.9]"
        >
          Precision <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500">
            Diagnostics
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.4, ease: "easeOut" }}
          className="max-w-2xl mx-auto text-lg opacity-60 mb-12 leading-relaxed"
        >
          Vitalis AI leverages autonomous neural agents to detect critical diseases from MRI scans with unprecedented accuracy and speed.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.6, ease: "easeOut" }}
          className="flex flex-wrap items-center justify-center gap-6"
        >
          <button onClick={() => setPage('auth')} className="px-8 py-4 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20 flex items-center gap-2">
            Get Started <ChevronRight className="w-5 h-5" />
          </button>
          <button 
            onClick={() => alert("Downloading Clinical Whitepaper: Neural Mesh Diagnostic Accuracy v4.2.pdf")}
            className={cn(
              "px-8 py-4 rounded-2xl font-bold transition-all border",
              theme === 'dark' ? "border-white/10 hover:bg-white/5" : "border-black/10 hover:bg-black/5"
            )}
          >
            Clinical Whitepaper
          </button>
        </motion.div>
      </section>

      {/* Agent Grid */}
      <section className="max-w-7xl mx-auto mb-32">
        <motion.div 
          {...floatReveal}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-display font-bold mb-4">Specialized Agents</h2>
          <p className="opacity-60">Each agent is trained on millions of clinical datasets for specific pathologies.</p>
        </motion.div>
        
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {AGENTS.map((agent) => (
            <motion.div
              key={agent.id}
              variants={floatReveal}
            >
              <AgentCard agent={agent} onClick={() => onAgentClick(agent)} theme={theme} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto mb-32">
        <motion.div {...floatReveal} className="text-center mb-16">
          <h2 className="text-4xl font-display font-bold mb-4">Trusted by Professionals</h2>
          <p className="opacity-60">Clinical feedback from leading medical institutions.</p>
        </motion.div>
        
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            { name: "Dr. Sarah Chen", role: "Head of Radiology", hospital: "Mayo Clinic", text: "Vitalis has reduced our diagnostic turnaround time by 60% while maintaining incredible accuracy." },
            { name: "Dr. James Wilson", role: "Neurosurgeon", hospital: "Johns Hopkins", text: "The Cerebro-Scan agent provides a level of detail that was previously impossible to achieve manually." },
            { name: "Dr. Elena Rossi", role: "Cardiologist", hospital: "St. Mary's", text: "Cardio-Sync's real-time analysis has been a game-changer for our emergency department." }
          ].map((t, i) => (
            <motion.div 
              key={i}
              variants={floatReveal}
              className={cn("p-8 rounded-[2.5rem]", theme === 'dark' ? "glass-dark" : "glass-light")}
            >
              <p className="italic opacity-70 mb-6">"{t.text}"</p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-500 font-bold">
                  {t.name[4]}
                </div>
                <div>
                  <div className="font-bold text-sm">{t.name}</div>
                  <div className="text-[10px] opacity-40 uppercase font-bold">{t.role} • {t.hospital}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Stats Section */}
      <motion.section 
        {...floatReveal}
        className="max-w-7xl mx-auto px-6 py-24"
      >
        <div className={cn(
          "rounded-[3rem] p-8 md:p-12 overflow-hidden relative",
          theme === 'dark' ? "glass-dark" : "glass-light"
        )}>
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8">
            <motion.div variants={floatReveal}>
              <h2 className="text-4xl font-display font-bold mb-2">Network Performance</h2>
              <p className="opacity-60">Global diagnostic throughput and neural mesh latency.</p>
            </motion.div>
            <motion.div variants={floatReveal} className="flex gap-4">
              <div className="text-center px-6 py-3 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-2xl font-bold">99.8%</div>
                <div className="text-[10px] opacity-50 uppercase font-bold">Accuracy</div>
              </div>
              <div className="text-center px-6 py-3 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-2xl font-bold">1.2s</div>
                <div className="text-[10px] opacity-50 uppercase font-bold">Avg Scan Time</div>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div variants={floatReveal} className="space-y-6">
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-indigo-500" />
                    <span className="font-bold">Diagnostic Volume</span>
                  </div>
                  <span className="text-xs opacity-50">Last 24h</span>
                </div>
                <div className="h-32 flex items-end gap-1">
                  {[40, 70, 45, 90, 65, 80, 50, 60, 85, 40, 75, 95, 60, 50, 70].map((h, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ height: 0 }}
                      whileInView={{ height: `${h}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05, duration: 1.2, ease: "easeOut" }}
                      className="flex-1 bg-indigo-500/20 rounded-t-sm hover:bg-indigo-500 transition-colors"
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div variants={floatReveal} className="space-y-6">
              <h4 className="text-xl font-bold">Recent Clinical Events</h4>
              <div className="space-y-4">
                {[
                  { icon: <Brain />, text: "Cerebro-Scan identified early-stage glioma", time: "2m ago", color: "text-indigo-500" },
                  { icon: <Database />, text: "Renal-Vision mapped 3mm stone in left kidney", time: "15m ago", color: "text-cyan-500" },
                  { icon: <Activity />, text: "Cardio-Sync flagged abnormal ejection fraction", time: "1h ago", color: "text-rose-500" }
                ].map((item, i) => (
                  <motion.div 
                    key={i} 
                    variants={floatReveal}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10"
                  >
                    <div className={cn("w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center", item.color)}>
                      {React.cloneElement(item.icon as React.ReactElement, { className: "w-5 h-5" })}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{item.text}</div>
                      <div className="text-[10px] opacity-40">{item.time}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-6 py-24">
        <motion.div {...floatReveal} className="text-center mb-16">
          <h2 className="text-4xl font-display font-bold mb-4">Frequently Asked Questions</h2>
          <p className="opacity-60">Common inquiries about our neural diagnostic mesh.</p>
        </motion.div>
        
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, amount: 0.1 }}
          className="space-y-4"
        >
          {[
            { q: "Is Vitalis AI HIPAA compliant?", a: "Yes, all data is encrypted end-to-end and stored in HIPAA-compliant clinical nodes." },
            { q: "How accurate are the diagnostic agents?", a: "Our agents maintain a validated accuracy rate of 99.8% across millions of clinical datasets." },
            { q: "Can I integrate Vitalis with my existing PACS?", a: "Absolutely. We provide a robust API and standard DICOM integration protocols." }
          ].map((faq, i) => (
            <motion.div 
              key={i}
              variants={floatReveal}
              className={cn("p-6 rounded-2xl", theme === 'dark' ? "glass-dark" : "glass-light")}
            >
              <h4 className="font-bold mb-2">{faq.q}</h4>
              <p className="text-sm opacity-60">{faq.a}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </main>
  );
};

const AuthPortal: React.FC<{ theme: Theme; setPage: (p: Page) => void }> = ({ theme, setPage }) => {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-20">
      <div className={cn(
        "w-full max-w-md p-10 rounded-[2.5rem] relative overflow-hidden",
        theme === 'dark' ? "glass-dark" : "glass-light"
      )}>
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white mx-auto mb-6 shadow-xl">
            <Cpu className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-display font-bold mb-2">Welcome Back</h2>
          <p className="text-sm opacity-60">Enter your credentials to access the mesh.</p>
        </div>

        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setPage('home'); }}>
          <div className="space-y-2">
            <label className="text-xs font-bold opacity-60 uppercase ml-1">Email Address</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40" />
              <input 
                type="email" 
                placeholder="commander@aetherius.ai"
                className={cn(
                  "w-full pl-12 pr-4 py-4 rounded-2xl outline-none transition-all border",
                  theme === 'dark' ? "bg-white/5 border-white/10 focus:border-indigo-500" : "bg-black/5 border-black/10 focus:border-indigo-500"
                )}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold opacity-60 uppercase ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40" />
              <input 
                type="password" 
                placeholder="••••••••"
                className={cn(
                  "w-full pl-12 pr-4 py-4 rounded-2xl outline-none transition-all border",
                  theme === 'dark' ? "bg-white/5 border-white/10 focus:border-indigo-500" : "bg-black/5 border-black/10 focus:border-indigo-500"
                )}
              />
            </div>
          </div>

          <button className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20">
            Establish Connection
          </button>
        </form>

        <div className="mt-8 text-center text-sm opacity-60">
          Don't have access? <button className="text-indigo-500 font-bold hover:underline">Request Node</button>
        </div>
      </div>
    </div>
  );
};

const NeuralDashboard: React.FC<{ theme: Theme }> = ({ theme }) => {
  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="text-5xl font-display font-bold mb-2">Neural Link</h2>
          <p className="opacity-60">Visualizing the agentic mesh communication logic.</p>
        </div>
        <div className="flex gap-4">
          <button className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            <Settings className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className={cn(
        "aspect-video rounded-[3rem] relative overflow-hidden flex items-center justify-center",
        theme === 'dark' ? "glass-dark" : "glass-light"
      )}>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent" />
        </div>
        
        {/* Mock Neural Graph */}
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="absolute w-32 h-32 rounded-full bg-indigo-500/20 blur-3xl animate-pulse" />
          <div className="grid grid-cols-3 gap-24 relative z-10">
            {[AGENTS[0], AGENTS[1], AGENTS[2]].map((a, i) => (
              <div key={i} className="flex flex-col items-center gap-4">
                <div className={cn("w-20 h-20 rounded-2xl flex items-center justify-center text-white bg-gradient-to-br shadow-2xl", a.gradient)}>
                  {a.icon}
                </div>
                <div className="text-xs font-bold opacity-60">{a.name.toUpperCase()}</div>
              </div>
            ))}
          </div>
          {/* SVG Connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
            <line x1="30%" y1="50%" x2="50%" y2="50%" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="50%" y1="50%" x2="70%" y2="50%" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
          </svg>
        </div>

        <div className="absolute bottom-12 left-12 right-12 flex items-center justify-between">
          <div className="flex gap-8">
            <div>
              <div className="text-[10px] opacity-50 uppercase font-bold mb-1">Mesh Nodes</div>
              <div className="text-2xl font-bold">1,284</div>
            </div>
            <div>
              <div className="text-[10px] opacity-50 uppercase font-bold mb-1">Active Links</div>
              <div className="text-2xl font-bold">8,492</div>
            </div>
          </div>
          <button className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all font-bold text-sm">
            Optimize Mesh
          </button>
        </div>
      </div>
    </div>
  );
};

const FleetCommander: React.FC<{ theme: Theme }> = ({ theme }) => {
  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="text-5xl font-display font-bold mb-2">Fleet Commander</h2>
          <p className="opacity-60">Management view for scaling agent instances and resource allocation.</p>
        </div>
        <button className="px-8 py-4 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20">
          Scale Cluster
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className={cn(
          "lg:col-span-2 rounded-[2.5rem] p-10",
          theme === 'dark' ? "glass-dark" : "glass-light"
        )}>
          <h3 className="text-2xl font-display font-bold mb-8">Cluster Status</h3>
          <div className="space-y-8">
            {[
              { name: "US-EAST-1 (Primary)", status: "Optimal", load: 42, color: "bg-emerald-500" },
              { name: "EU-WEST-2 (Secondary)", status: "High Load", load: 88, color: "bg-amber-500" },
              { name: "AP-SOUTH-1 (Edge)", status: "Optimal", load: 15, color: "bg-emerald-500" }
            ].map((cluster, i) => (
              <div key={i} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 opacity-50" />
                    <span className="font-bold">{cluster.name}</span>
                  </div>
                  <span className={cn("text-xs font-bold px-3 py-1 rounded-full bg-white/5", cluster.load > 80 ? "text-amber-500" : "text-emerald-500")}>
                    {cluster.status}
                  </span>
                </div>
                <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className={cn("h-full transition-all duration-1000", cluster.color)} style={{ width: `${cluster.load}%` }} />
                </div>
                <div className="flex justify-between text-[10px] opacity-40 font-bold">
                  <span>UTILIZATION: {cluster.load}%</span>
                  <span>INSTANCES: {Math.floor(cluster.load * 1.5)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div className={cn(
            "rounded-[2.5rem] p-8",
            theme === 'dark' ? "glass-dark" : "glass-light"
          )}>
            <h4 className="text-xl font-display font-bold mb-6">Resource Quota</h4>
            <div className="flex items-center justify-center py-8">
              <div className="relative w-40 h-40">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path
                    className="stroke-white/5"
                    strokeDasharray="100, 100"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    strokeWidth="3"
                  />
                  <path
                    className="stroke-indigo-500"
                    strokeDasharray="65, 100"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold">65%</span>
                  <span className="text-[10px] opacity-50 font-bold">USED</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="opacity-50">Compute Power</span>
                <span className="font-bold">12.4 TFLOPS</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="opacity-50">Memory Pool</span>
                <span className="font-bold">256 GB</span>
              </div>
            </div>
          </div>

          <div className={cn(
            "rounded-[2.5rem] p-8",
            theme === 'dark' ? "glass-dark" : "glass-light"
          )}>
            <h4 className="text-xl font-display font-bold mb-4">Auto-Scaling</h4>
            <p className="text-xs opacity-50 mb-6">System will automatically spin up new instances when load exceeds 85%.</p>
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-sm font-bold">Enabled</span>
              <div className="w-12 h-6 rounded-full bg-indigo-600 relative">
                <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [page, setPage] = useState<Page>('home');
  const [activeAgent, setActiveAgent] = useState<AgentData | null>(null);
  const [siteName, setSiteName] = useState("VITALIS AI");
  const appRef = useRef<HTMLDivElement>(null);

  // Theme Persistence
  useEffect(() => {
    document.body.className = theme === 'dark' ? 'prismatic-dark' : 'prismatic-light';
  }, [theme]);

  // Portal Transitions
  useEffect(() => {
    if (appRef.current) {
      animate(appRef.current, {
        opacity: [0, 1],
        scale: [0.98, 1],
        duration: 1000,
        easing: 'outExpo'
      });
    }
  }, [page]);

  const handleAgentClick = (agent: AgentData) => {
    setActiveAgent(agent);
    // AnimeJS expansion logic would go here, but for simplicity we use state
  };

  return (
    <div ref={appRef} className={cn(
      "min-h-screen transition-colors duration-500",
      theme === 'dark' ? "prismatic-dark" : "prismatic-light"
    )}>
      <ThreeBackground theme={theme} page={page} activeAgent={activeAgent?.id || null} />
      
      <Navbar theme={theme} setTheme={setTheme} setPage={setPage} page={page} siteName={siteName} />

      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading Mesh...</div>}>
            {page === 'home' && <Home theme={theme} onAgentClick={handleAgentClick} setPage={setPage} />}
            {page === 'about' && <About theme={theme} />}
            {page === 'auth' && <AuthPortal theme={theme} setPage={setPage} />}
            {page === 'neural' && <NeuralDashboard theme={theme} />}
            {page === 'fleet' && <FleetCommander theme={theme} />}
            {page === 'admin' && <AdminDashboard theme={theme} siteName={siteName} setSiteName={setSiteName} />}
            {page === 'doctor' && <DoctorDashboard theme={theme} />}
          </Suspense>
        </motion.div>
      </AnimatePresence>

      {activeAgent && (
        <AgentWorkspace 
          agent={activeAgent} 
          onClose={() => setActiveAgent(null)} 
          theme={theme} 
        />
      )}

      {/* Mobile Navigation */}
      <div className={cn(
        "md:hidden fixed bottom-6 left-6 right-6 z-50 p-4 rounded-2xl flex items-center justify-around",
        theme === 'dark' ? "glass-dark" : "glass-light"
      )}>
        <button onClick={() => setPage('home')} className={cn("p-2", page === 'home' ? "text-indigo-500" : "opacity-50")}><LayoutDashboard className="w-6 h-6" /></button>
        <button onClick={() => setPage('about')} className={cn("p-2", page === 'about' ? "text-indigo-500" : "opacity-50")}><Brain className="w-6 h-6" /></button>
        <button onClick={() => setPage('doctor')} className={cn("p-2", page === 'doctor' ? "text-indigo-500" : "opacity-50")}><User className="w-6 h-6" /></button>
        <button onClick={() => setPage('admin')} className={cn("p-2", page === 'admin' ? "text-indigo-500" : "opacity-50")}><Lock className="w-6 h-6" /></button>
      </div>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-white/10 opacity-40 text-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div>© 2026 AETHERIUS MED-AI SYSTEMS. ALL RIGHTS RESERVED.</div>
          <div className="max-w-md italic">DISCLAIMER: This platform is for research and clinical assistance only. AI findings must be verified by a certified medical professional.</div>
        </div>
        <div className="flex gap-8">
          <button className="hover:underline">PRIVACY_PROTOCOL</button>
          <button className="hover:underline">TERMS_OF_MESH</button>
          <button className="hover:underline">NEURAL_SECURITY</button>
        </div>
      </footer>
    </div>
  );
}
