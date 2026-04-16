import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { UserPlus, ShieldCheck } from 'lucide-react';

const Signup: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl bg-white/5 border border-white/10 p-12 rounded-[2.5rem] backdrop-blur-xl shadow-2xl overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 blur-[100px] -mr-32 -mt-32" />
        
        <div className="text-center mb-12 relative z-10">
          <h1 className="text-4xl font-display font-bold gold-gradient mb-3 tracking-tight">JOIN THE CIRCLE</h1>
          <p className="text-white/40 uppercase tracking-[0.3em] text-[10px]">Unlock priority reservations and exclusive culinary events</p>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 ml-1">First Name</label>
              <input 
                type="text" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-gold/50 outline-none transition-all"
                placeholder="Aurelian"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 ml-1">Last Name</label>
              <input 
                type="text" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-gold/50 outline-none transition-all"
                placeholder="Slate"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 ml-1">Email Address</label>
              <input 
                type="email" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-gold/50 outline-none transition-all"
                placeholder="member@aurelian.com"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 ml-1">Password</label>
              <input 
                type="password" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-gold/50 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 ml-1">Confirm Password</label>
              <input 
                type="password" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-gold/50 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 ml-1">Phone (Optional)</label>
              <input 
                type="tel" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-gold/50 outline-none transition-all"
                placeholder="+44 7000 000000"
              />
            </div>
          </div>

          <div className="md:col-span-2 space-y-8 mt-4">
            <div className="flex items-start space-x-4 bg-white/5 p-5 rounded-2xl border border-white/5">
              <ShieldCheck className="text-gold shrink-0 mt-1" size={20} />
              <p className="text-[11px] text-white/40 leading-relaxed uppercase tracking-widest">
                By creating an account, you agree to our <a href="#" className="text-gold hover:underline">Terms of Service</a> and <a href="#" className="text-gold hover:underline">Privacy Policy</a>. We value your privacy and will never share your data.
              </p>
            </div>

            <button className="w-full bg-gold text-black font-bold uppercase tracking-[0.3em] py-5 rounded-2xl hover:bg-white transition-all duration-500 flex items-center justify-center space-x-4 shadow-xl shadow-gold/10 group">
              <span>Create Membership</span>
              <UserPlus size={20} className="group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </form>

        <div className="mt-12 pt-8 border-t border-white/10 text-center relative z-10">
          <p className="text-white/40 text-[10px] uppercase tracking-[0.2em]">
            Already a member? {' '}
            <Link to="/login" className="text-gold hover:text-white transition-colors ml-2 font-bold">Sign In Here</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
