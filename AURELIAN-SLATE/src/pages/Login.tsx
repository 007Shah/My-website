import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, LogIn } from 'lucide-react';

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white/5 border border-white/10 p-10 rounded-3xl backdrop-blur-xl shadow-2xl"
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl font-display font-bold gold-gradient mb-2">WELCOME BACK</h1>
          <p className="text-white/40 uppercase tracking-widest text-xs">Access your exclusive dining rewards</p>
        </div>

        <form className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 ml-1">Email Address</label>
            <input 
              type="email" 
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold/50 outline-none transition-all"
              placeholder="concierge@aurelian.com"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] uppercase tracking-[0.2em] text-white/40">Password</label>
              <button type="button" className="text-[10px] uppercase tracking-[0.2em] text-gold hover:text-white transition-colors">Forgot?</button>
            </div>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold/50 outline-none transition-all pr-12"
                placeholder="••••••••"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-gold transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-3 px-1">
            <input type="checkbox" id="remember" className="w-4 h-4 rounded border-white/10 bg-white/5 text-gold focus:ring-gold" />
            <label htmlFor="remember" className="text-xs text-white/40 uppercase tracking-widest cursor-pointer">Remember me</label>
          </div>

          <button className="w-full bg-gold text-black font-bold uppercase tracking-[0.2em] py-4 rounded-xl hover:bg-white transition-all duration-500 flex items-center justify-center space-x-3 mt-4">
            <span>Sign In</span>
            <LogIn size={18} />
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-white/10 text-center">
          <p className="text-white/40 text-xs uppercase tracking-widest">
            New to Aurelian Slate? {' '}
            <Link to="/signup" className="text-gold hover:text-white transition-colors ml-2">Create Account</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
