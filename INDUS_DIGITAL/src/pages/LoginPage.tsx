import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { NeuralGateCore } from '../components/NeuralGateCore';
import { DigitalRainReveal } from '../components/Animations';
import { Shield, Cpu, Fingerprint } from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [cnic, setCnic] = useState('');
  const [password, setPassword] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConnecting(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <DigitalRainReveal>
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block mb-4"
          >
            <div className="w-20 h-20 bg-cyan rounded-2xl flex items-center justify-center cyan-glow">
              <span className="text-void font-display font-black text-4xl">I</span>
            </div>
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-display font-black tracking-tighter text-white mb-2">
            INDUS <span className="text-cyan text-glow-cyan">DIGITAL</span>
          </h1>
          <p className="text-cyan/60 font-mono text-sm tracking-widest uppercase">
            Premium Banking // Pakistan
          </p>
        </div>
      </DigitalRainReveal>

      <div className="w-full max-w-md relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-panel p-8 rounded-2xl cyan-glow relative z-10"
        >
          <form onSubmit={handleConnect} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-mono text-cyan/70 uppercase tracking-widest">CNIC / Username</label>
              <input
                type="text"
                value={cnic}
                onChange={(e) => setCnic(e.target.value)}
                className="w-full bg-void/50 border border-cyan/20 rounded-lg p-3 text-cyan font-mono focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan/50 transition-all"
                placeholder="42101-XXXXXXX-X"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-mono text-cyan/70 uppercase tracking-widest">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-void/50 border border-cyan/20 rounded-lg p-3 text-cyan font-mono focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan/50 transition-all"
                placeholder="••••••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isConnecting}
              className="w-full group relative overflow-hidden bg-cyan text-void font-display font-bold py-4 rounded-lg transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
              <span className="relative flex items-center justify-center gap-2">
                {isConnecting ? (
                  <>
                    <Fingerprint className="animate-pulse" />
                    SECURE LOGIN...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    LOGIN SECURELY
                  </>
                )}
              </span>
            </button>
          </form>
          
          <div className="mt-6 flex justify-between text-[10px] font-mono text-cyan/40 uppercase tracking-tighter">
            <span>End-to-End Encrypted</span>
            <button type="button" className="hover:text-cyan transition-colors">Forgot Password?</button>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-8 flex gap-4">
        <div className="glass-panel px-4 py-2 rounded-lg border-cyan/20">
          <span className="text-[10px] font-mono text-cyan/50 block">SERVER STATUS</span>
          <span className="text-cyan font-mono">OPERATIONAL</span>
        </div>
      </div>
      
      <div className="absolute bottom-8 right-8">
        <div className="glass-panel px-4 py-2 rounded-lg border-magenta/20">
          <span className="text-[10px] font-mono text-magenta/50 block">LAST LOGIN</span>
          <span className="text-magenta font-mono">10 MAR 2026</span>
        </div>
      </div>
    </div>
  );
};
