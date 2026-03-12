import React from 'react';
import { motion } from 'framer-motion';
import { Lock, AlertTriangle, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AccessDeniedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="relative mb-8 inline-block">
          <motion.div
            animate={{ 
              rotate: [0, 5, -5, 0],
              x: [0, 2, -2, 0]
            }}
            transition={{ repeat: Infinity, duration: 0.2 }}
            className="text-magenta"
          >
            <Lock size={120} strokeWidth={1} className="drop-shadow-[0_0_15px_rgba(255,0,255,0.5)]" />
          </motion.div>
          <motion.div
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 0.1 }}
            className="absolute inset-0 text-cyan mix-blend-screen"
          >
            <Lock size={120} strokeWidth={1} />
          </motion.div>
        </div>

        <h1 className="text-4xl md:text-6xl font-display font-black text-white mb-4 tracking-tighter">
          ACCESS <span className="text-magenta text-glow-magenta">DENIED</span>
        </h1>
        
        <div className="glass-panel p-6 rounded-xl border-magenta/30 max-w-md mx-auto mb-8">
          <div className="flex items-center gap-3 text-magenta mb-4 justify-center">
            <AlertTriangle size={20} />
            <span className="font-mono text-sm uppercase tracking-widest">Quantum Encryption Required</span>
          </div>
          <p className="text-cyan/60 font-mono text-xs leading-relaxed">
            Your current neural signature does not match the required clearance level for this sector. 
            Unauthorized access attempts are logged and reported to the Node Governance Council.
          </p>
        </div>

        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 mx-auto bg-void border border-cyan/30 text-cyan px-8 py-3 rounded-lg font-display text-sm hover:bg-cyan/10 transition-all group"
        >
          <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
          RE-ESTABLISH CONNECTION
        </button>
      </motion.div>
    </div>
  );
};
