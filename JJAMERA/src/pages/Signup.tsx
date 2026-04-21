import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PageTransition } from '../components/PageTransition';
import { MagneticButton } from '../components/MagneticButton';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && password) {
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };

  return (
    <PageTransition className="flex-grow flex items-center justify-center pt-24 pb-12 px-6">
      <div className="w-full max-w-md bg-obsidian border border-gray-deep/50 p-8 md:p-12 relative overflow-hidden rounded-[2rem] shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-theme/5 to-transparent pointer-events-none" />
        <AnimatePresence>
          {isSubmitted && (
            <motion.div 
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="absolute top-0 left-0 right-0 bg-theme text-theme-content transition-colors duration-500 p-4 text-center font-bold text-[14px] tracking-wide z-20 shadow-md"
            >
              Account Created!
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           className="text-center mb-10"
        >
          <div className="w-12 h-1 bg-theme mx-auto rounded-full mb-6 transition-colors duration-500" />
          <h1 className="text-[32px] md:text-[40px] font-extrabold tracking-tight mb-3">
            Join The <span className="text-theme transition-colors duration-500 font-black">Club</span>
          </h1>
          <p className="text-white/60 text-[15px] font-medium">Create your account to get started.</p>
        </motion.div>

        <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
          <div>
            <label className="block text-[12px] font-semibold tracking-wider text-white/70 mb-2 ml-1">Full Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-deep/30 border border-gray-deep/50 p-4 rounded-xl text-white focus:outline-none focus:border-theme focus:ring-1 focus:ring-theme transition-all duration-300 placeholder:text-white/20 font-medium"
              placeholder="John Doe"
              required
            />
          </div>
          <div>
            <label className="block text-[12px] font-semibold tracking-wider text-white/70 mb-2 ml-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-deep/30 border border-gray-deep/50 p-4 rounded-xl text-white focus:outline-none focus:border-theme focus:ring-1 focus:ring-theme transition-all duration-300 placeholder:text-white/20 font-medium"
              placeholder="name@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-[12px] font-semibold tracking-wider text-white/70 mb-2 ml-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-deep/30 border border-gray-deep/50 p-4 rounded-xl text-white focus:outline-none focus:border-theme focus:ring-1 focus:ring-theme transition-all duration-300 placeholder:text-white/20 font-medium"
              placeholder="••••••••"
              required
            />
          </div>
          <MagneticButton type="submit" className="w-full mt-8 shadow-md">Create Account</MagneticButton>
        </form>
        
        <div className="mt-8 text-center relative z-10 border-t border-gray-deep/50 pt-6">
          <p className="text-white/60 text-[14px] font-medium">
            Already have an account? <Link to="/login" className="text-theme transition-colors duration-500 hover:text-white font-bold ml-1">Sign In</Link>
          </p>
        </div>
      </div>
    </PageTransition>
  );
}
