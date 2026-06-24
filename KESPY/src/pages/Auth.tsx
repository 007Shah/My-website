import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import GoogleSignInModal from '../components/GoogleSignInModal';

export default function Auth() {
  const { user, checkAuth } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  if (user) {
    return <Navigate to="/" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const body = isLogin ? { username, password } : { username, password, displayName };
      
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      await checkAuth(); // Will update user context
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setError('');
    const id = Math.floor(Math.random() * 100000);
    const guestUser = {
      username: `guest${id}`,
      password: `guest${id}pass`,
      displayName: `Guest ${id}`
    };
    
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(guestUser)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Guest login failed');
      await checkAuth();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (email: string, name: string, avatar: string) => {
    setError('');
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, displayName: name, avatar })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Google Login failed');
      await checkAuth();
      setShowGoogleModal(false);
    } catch (err: any) {
      setError(err.message);
      setShowGoogleModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-[10%] left-[10%] w-[300px] h-[300px] bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-[10%] justify-center w-[300px] h-[300px] bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[20%] left-[20%] w-[300px] h-[300px] bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl relative z-10 border border-white/20"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-[1.25rem] bg-gradient-to-br from-[#7C3AED] via-[#C084FC] to-[#F43F5E] flex items-center justify-center text-white font-serif font-black text-3xl shadow-xl shadow-[#F43F5E]/25 mx-auto mb-4 border-2 border-white transition-all duration-300 hover:rotate-6 select-none">
            K
          </div>
          <h1 className="text-4xl font-serif italic font-black tracking-tighter bg-gradient-to-r from-[#1E1B4B] via-[#7C3AED] to-[#F43F5E] bg-clip-text text-transparent">Kespy</h1>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-2.5">Connect · Share · Radiate</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="popLayout">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label className="block text-sm font-medium text-slate-700 mb-1">Display Name</label>
                <input
                  type="text"
                  required={!isLogin}
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-800"
                  placeholder="John Doe"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-800"
              placeholder="johndoe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-800"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-rose-500 bg-rose-50 p-3 rounded-xl border border-rose-100">
              {error}
            </motion.div>
          )}

          <div className="flex flex-col space-y-3 mt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-slate-900/20 transition-all active:scale-[0.98] flex justify-center items-center"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (isLogin ? 'Sign In' : 'Create Account')}
            </button>

            <button
              type="button"
              onClick={handleGuestLogin}
              disabled={loading}
              className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold py-3.5 rounded-xl transition-all active:scale-[0.98] flex justify-center items-center"
            >
              Continue as Guest
            </button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="ml-1 text-indigo-600 hover:text-indigo-700 font-semibold"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col gap-3">
            <button 
              type="button" 
              onClick={() => setShowGoogleModal(true)}
              className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium py-3 rounded-xl transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
              Continue with Google
            </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {showGoogleModal && (
          <GoogleSignInModal 
            onClose={() => setShowGoogleModal(false)}
            onSuccess={handleGoogleSuccess}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
