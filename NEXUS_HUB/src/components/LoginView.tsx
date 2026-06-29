import { useState } from 'react';
import { KeyRound, ShieldAlert, ArrowRight, ClipboardCheck } from 'lucide-react';
import { User } from '../types';

interface LoginViewProps {
  onLoginSuccess: (user: User) => void;
}

export function LoginView({ onLoginSuccess }: LoginViewProps) {
  const [customId, setCustomId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (idToUse?: string) => {
    const idValue = idToUse !== undefined ? idToUse : customId;
    if (!idValue || idValue.trim().length !== 5) {
      setError('Please supply a valid 5-character alphanumeric ID.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customId: idValue.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Authentication rejected. This ID was not found.');
      } else {
        onLoginSuccess(data.user);
      }
    } catch (e) {
      setError('Connection failure to authentication servers.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const sampleUsers = [
    { id: 'PM100', name: 'Patricia Miller', role: 'MANAGER', desc: 'Can manage all employees, roles, portal accesses and create projects.' },
    { id: 'LD501', name: 'Lucas Vance', role: 'Team Leader', desc: 'Leads Project Alpha. Standard project space controls.' },
    { id: 'LD502', name: 'Devon Chen', role: 'Team Leader', desc: 'Leads Project Beta. Clean styling focus.' },
    { id: 'DV001', name: 'Alex Mercer', role: 'Senior Developer', desc: 'Member of Project Alpha, Spectator on Project Beta.' },
    { id: 'DV003', name: 'James Holden', role: 'Junior Developer', desc: 'Spectator of Project Alpha (requires 5-char code challenge).' },
  ];

  return (
    <div id="login-container" className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-950 via-slate-900 to-forest-dark/40 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Elegant Ambient Background Gradient Blobs using palette colors */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-sage/10 rounded-full blur-[80px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-gold/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-forest/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-white border border-slate-200/80 shadow-2xl rounded-3xl overflow-hidden relative z-10 transition-all duration-300 hover:shadow-forest/20">
        {/* Header decoration with high-aesthetic brand colors */}
        <div className="bg-gradient-to-tr from-slate-950 via-forest-dark to-forest px-6 py-9 text-center text-white relative border-b border-forest-dark/30">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 pointer-events-none" />
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center bg-sage/15 text-sage-light p-3 rounded-2xl mb-4 border border-sage/20 shadow-inner">
              <KeyRound className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-100">Nexus Workspace Login</h2>
            <p className="text-gold-light/90 text-[10px] tracking-widest uppercase font-mono mt-1">Authorized Gateway</p>
          </div>
        </div>

        <div className="p-6 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            className="space-y-4"
          >
            <div>
              <label htmlFor="customId" className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 text-left">
                Enter Your 5-Character ID
              </label>
              <div className="relative">
                <input
                  id="customId"
                  name="customId"
                  type="text"
                  maxLength={5}
                  value={customId}
                  onChange={(e) => setCustomId(e.target.value.toUpperCase().trim())}
                  placeholder="PM100"
                  className="w-full pl-5 pr-14 py-3 bg-slate-50 border border-slate-200 rounded-xl text-lg font-mono font-bold tracking-widest text-slate-800 focus:outline-none focus:ring-1 focus:ring-forest focus:bg-white transition-all placeholder:text-slate-300"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="absolute right-1.5 top-1.5 bottom-1.5 bg-forest hover:bg-forest-light text-white px-4 rounded-lg flex items-center justify-center hover:scale-102 active:scale-97 transition-all duration-200 disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 bg-red-50 text-red-700 p-3.5 rounded-xl border border-red-100 text-xs leading-relaxed text-left">
                <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
          </form>

          {/* Whitelisted personnel sandbox selection index */}
          <div className="mt-8 border-t border-slate-100 pt-6">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5 justify-start">
              <ClipboardCheck className="w-4 h-4 text-forest" />
              Registered Team Profiles
            </h3>
            <p className="text-[11px] text-slate-600 mb-4 bg-cream-light border border-gold-light rounded-xl p-3 leading-relaxed text-left">
              Select one of the registered team profiles below to log in instantly and explore different permission settings:
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {sampleUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleLogin(user.id)}
                  type="button"
                  className="w-full text-left p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200/65 hover:border-sage/40 rounded-xl transition-all duration-200 hover:scale-101 hover:-translate-y-0.5 active:scale-99 group flex items-start gap-2.5 cursor-pointer shadow-2xs"
                >
                  <span className="font-mono text-xs font-bold bg-slate-200 text-slate-700 py-1 px-2 rounded-lg group-hover:bg-sage-light group-hover:text-forest transition-colors shrink-0">
                    {user.id}
                  </span>
                  <div className="flex-1">
                    <div className="text-xs font-bold text-slate-800 flex justify-between items-center">
                      <span>{user.name}</span>
                      <span className="text-[9px] font-bold text-forest tracking-wide bg-sage-light/40 px-1.5 py-0.2 rounded border border-sage-light">
                        {user.role}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5 leading-snug">{user.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-slate-50 border-t border-slate-150 px-4 py-4.5 text-center">
          <p className="text-[10px] text-slate-400 font-medium font-mono">
            Secure Whitelist Framework v3.0 · Powered by Anti-Leak Isolation Rules
          </p>
        </div>
      </div>
    </div>
  );
}
