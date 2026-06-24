import React, { useState } from "react";
import { X, User, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

interface GoogleSignInModalProps {
  onClose: () => void;
  onSuccess: (email: string, name: string, avatar: string) => void;
}

export default function GoogleSignInModal({ onClose, onSuccess }: GoogleSignInModalProps) {
  const [useCustom, setUseCustom] = useState(false);
  const [customEmail, setCustomEmail] = useState("");
  const [customName, setCustomName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Suggest local metadata user directly
  const googleAccounts = [
    {
      email: "mansoorgillani22@gmail.com",
      name: "Mansoor Gillani",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    }
  ];

  const handleSelectAccount = async (email: string, name: string, avatar: string) => {
    setSubmitting(true);
    try {
      await onSuccess(email, name, avatar);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail || !customName) return;
    
    // Choose a random cool avatar if none provided
    const randomId = Math.floor(Math.random() * 70) + 1;
    const avatar = `https://i.pravatar.cc/150?img=${randomId}`;
    handleSelectAccount(customEmail, customName, avatar);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/45 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Dialog container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl relative z-10 overflow-hidden border border-slate-100"
      >
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="font-serif text-[#1a1a1a] font-bold text-sm">Sign in with Google</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-400 hover:text-slate-600" />
          </button>
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Choose an account</h3>
            <p className="text-xs text-slate-400 mt-1">to continue to Kespy</p>
          </div>

          {submitting ? (
            <div className="py-12 flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
              <p className="text-sm text-slate-500 mt-4 font-medium">Connecting secure session...</p>
            </div>
          ) : !useCustom ? (
            <div className="space-y-3">
              {googleAccounts.map((account, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectAccount(account.email, account.name, account.avatar)}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:bg-slate-50/50 transition-all text-left group"
                >
                  <img
                    src={account.avatar}
                    alt={account.name}
                    className="w-11 h-11 rounded-full object-cover border border-slate-100"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                      {account.name}
                    </p>
                    <p className="text-xs text-slate-400 truncate">{account.email}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors shrink-0">
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                  </div>
                </button>
              ))}

              <button
                onClick={() => setUseCustom(true)}
                className="w-full text-center py-3.5 border border-dashed border-slate-200 hover:border-indigo-200 hover:bg-slate-50/55 rounded-2xl text-xs font-bold text-slate-500 hover:text-indigo-600 transition-all uppercase tracking-wider"
              >
                Use another account
              </button>
            </div>
          ) : (
            <form onSubmit={handleCustomSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Google Email Address
                </label>
                <input
                  type="email"
                  required
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Mansoor Gillani"
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setUseCustom(false)}
                  className="flex-1 py-3 border border-slate-100 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-500 uppercase tracking-wider transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md"
                >
                  Continue
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center text-[10px] text-slate-400 leading-relaxed">
            By continuing, Google will share your name, email address, language preference, and profile picture with Kespy. See our Privacy Policy and Terms.
          </div>
        </div>
      </motion.div>
    </div>
  );
}
