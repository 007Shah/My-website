import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PageTransition, DigitalRainReveal } from '../components/Animations';
import { Shield, Key, MapPin, EyeOff, Smartphone, Lock, AlertCircle, Fingerprint } from 'lucide-react';
import { cn } from '@/src/lib/utils';

const SecurityToggle = ({ label, description, icon: Icon, active, onToggle }: any) => (
  <div className="flex items-center justify-between p-6 glass-panel rounded-2xl border-white/5 hover:border-cyan/30 transition-all group">
    <div className="flex gap-4">
      <div className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
        active ? "bg-cyan/20 text-cyan cyan-glow" : "bg-white/5 text-white/30"
      )}>
        <Icon size={24} />
      </div>
      <div>
        <h4 className="font-display text-sm font-bold uppercase tracking-widest mb-1">{label}</h4>
        <p className="text-[10px] font-mono text-white/40 uppercase leading-relaxed">{description}</p>
      </div>
    </div>
    <button 
      onClick={onToggle}
      className={cn(
        "w-14 h-7 rounded-full relative transition-all duration-500 p-1",
        active ? "bg-cyan/40" : "bg-white/10"
      )}
    >
      <motion.div
        animate={{ x: active ? 28 : 0 }}
        className={cn(
          "w-5 h-5 rounded-full shadow-lg",
          active ? "bg-cyan cyan-glow" : "bg-white/30"
        )}
      />
    </button>
  </div>
);

export const SecuritySettingsPage = () => {
  const [biometric, setBiometric] = useState(true);
  const [twoFactor, setTwoFactor] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [locationLock, setLocationLock] = useState(false);

  return (
    <PageTransition>
      <div className="space-y-8">
        <DigitalRainReveal>
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-display font-black tracking-tighter mb-2">
                SECURITY <span className="text-magenta text-glow-magenta">CENTER</span>
              </h1>
              <p className="text-magenta/50 font-mono text-xs uppercase tracking-widest">
                Protect Your Account // Multi-Layer Defense
              </p>
            </div>
            <div className="flex gap-4">
              <button className="glass-panel px-6 py-2 rounded-lg text-xs font-display font-bold hover:bg-rose-600/40 transition-colors border-rose-600/40 bg-rose-600/20 text-rose-600 flex items-center gap-2">
                <Lock size={14} />
                BLOCK ALL CARDS
              </button>
            </div>
          </div>
        </DigitalRainReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <SecurityToggle
              label="Biometric Login"
              description="Use Fingerprint or Face ID to access your account securely"
              icon={Fingerprint}
              active={biometric}
              onToggle={() => setBiometric(!biometric)}
            />
            <SecurityToggle
              label="Two-Factor Auth (2FA)"
              description="Require a code sent to your mobile for all transfers"
              icon={Smartphone}
              active={twoFactor}
              onToggle={() => setTwoFactor(!twoFactor)}
            />
            <SecurityToggle
              label="SMS Transaction Alerts"
              description="Get instant notifications for every debit or credit"
              icon={AlertCircle}
              active={smsAlerts}
              onToggle={() => setSmsAlerts(!smsAlerts)}
            />
            <SecurityToggle
              label="Location-Based Security"
              description="Restrict account access to your primary city/region"
              icon={MapPin}
              active={locationLock}
              onToggle={() => setLocationLock(!locationLock)}
            />

            <div className="glass-panel p-8 rounded-3xl border-white/5 bg-gradient-to-br from-void to-petrol">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-cyan/20 flex items-center justify-center text-cyan">
                  <Shield size={20} />
                </div>
                <div>
                  <h4 className="font-display text-sm font-bold uppercase tracking-widest mb-2">End-to-End Encryption</h4>
                  <p className="text-xs font-mono text-white/50 leading-relaxed mb-4">
                    Indus Digital Bank uses industry-standard AES-256 encryption for all data. 
                    Your personal information and financial records are stored in highly secure, 
                    geographically redundant data centers within Pakistan.
                  </p>
                  <button className="text-[10px] font-mono text-cyan hover:text-white transition-colors uppercase tracking-widest border-b border-cyan/30 pb-1">
                    View Privacy Policy
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-panel p-8 rounded-3xl border-white/5">
              <h3 className="font-display text-sm font-black tracking-tighter mb-6 uppercase">Security Score</h3>
              <div className="flex flex-col items-center py-4">
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90 transform">
                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-white/5" />
                    <motion.circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="currentColor"
                      strokeWidth="10"
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 70}
                      initial={{ strokeDashoffset: 2 * Math.PI * 70 }}
                      animate={{ strokeDashoffset: (2 * Math.PI * 70) * (1 - 0.85) }}
                      className="text-cyan cyan-glow"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-display font-black text-white">85</span>
                    <span className="text-[10px] font-mono text-cyan uppercase">Excellent</span>
                  </div>
                </div>
                <p className="text-[10px] font-mono text-white/30 text-center mt-6 uppercase leading-relaxed">
                  Your account is highly secure. Enable Location Lock to reach 100%.
                </p>
              </div>
            </div>

            <div className="glass-panel p-8 rounded-3xl border-white/5">
              <h3 className="font-display text-sm font-black tracking-tighter mb-6 uppercase">Active Sessions</h3>
              <div className="space-y-4">
                {[
                  { device: 'iPhone 15 Pro', loc: 'Karachi, PK', status: 'Current' },
                  { device: 'MacBook Pro', loc: 'Lahore, PK', status: '2h ago' },
                ].map((session, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-display font-bold">{session.device}</span>
                      <span className={cn("text-[8px] font-mono uppercase", session.status === 'Current' ? "text-cyan" : "text-white/30")}>
                        {session.status}
                      </span>
                    </div>
                    <p className="text-[10px] font-mono text-white/30 uppercase">{session.loc}</p>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-3 rounded-xl border border-white/5 text-[10px] font-mono text-white/30 hover:text-white transition-colors uppercase tracking-widest">
                Logout All Devices
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
