import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Loader2 } from "lucide-react";
import AnimatedPage from "../components/AnimatedPage";
import { useAuth } from "../context/AuthContext";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      
      if (response.ok) {
        login(data.token, data.user);
        navigate(from, { replace: true });
      } else {
        setError(data.error || "An error occurred");
      }
    } catch (err) {
      setError("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedPage className="min-h-screen pt-24 pb-20 px-4 sm:px-6 flex items-center justify-center relative">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1a1a1a] via-[#050505] to-[#050505] opacity-50" />
      
      <div className="w-full max-w-md relative z-10">
        <motion.div
          layout
          className="bg-[#111111] border border-[#222222] p-8 md:p-12 rounded-[40px] shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full blur-3xl" />
          
          <h2 className="text-3xl font-light tracking-tight mb-2">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-[#888888] text-[11px] uppercase tracking-widest mb-8">
            {isLogin ? "Access your studio" : "Join the collective"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="popLayout">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <label className="sr-only">Full Name</label>
                  <input
                    type="text"
                    required={!isLogin}
                    placeholder="Full Name"
                    className="w-full bg-[#050505] border border-[#222222] rounded-2xl px-6 py-4 text-white placeholder-[#666666] focus:outline-none focus:border-[#444444] transition-all"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            
            <div>
              <label className="sr-only">Email</label>
              <input
                type="email"
                required
                placeholder="Email Address"
                className="w-full bg-[#050505] border border-[#222222] rounded-2xl px-6 py-4 text-white placeholder-[#666666] focus:outline-none focus:border-[#444444] transition-all"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            
            <div>
              <label className="sr-only">Password</label>
              <input
                type="password"
                required
                placeholder="Password"
                className="w-full bg-[#050505] border border-[#222222] rounded-2xl px-6 py-4 text-white placeholder-[#666666] focus:outline-none focus:border-[#444444] transition-all"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-xs tracking-wide">
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black hover:bg-neutral-200 h-14 rounded-full text-[11px] uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
              ) : (
                <>{isLogin ? "Sign In" : "Register"} <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="text-[#666666] hover:text-white text-[11px] uppercase tracking-widest transition-colors"
            >
              {isLogin ? "No account? Register instead" : "Already have an account? Sign in"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatedPage>
  );
}
