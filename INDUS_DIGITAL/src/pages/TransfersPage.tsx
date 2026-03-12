import React from 'react';
import { PageTransition, DigitalRainReveal } from '../components/Animations';
import { Zap, User, Send, Globe, ShieldCheck } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export const TransfersPage = () => {
  return (
    <PageTransition>
      <div className="space-y-8">
        <DigitalRainReveal>
          <h1 className="text-4xl font-display font-black tracking-tighter mb-2">
            MONEY <span className="text-cyan text-glow-cyan">TRANSFERS</span>
          </h1>
          <p className="text-cyan/50 font-mono text-xs uppercase tracking-widest">
            Raast // IBAN // Internal Transfers
          </p>
        </DigitalRainReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-panel p-8 rounded-3xl border-white/5">
              <h3 className="font-display text-lg font-black tracking-tighter mb-6 uppercase">Quick Transfer</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Select Account</label>
                    <select className="w-full bg-void/50 border border-white/10 rounded-xl p-4 text-sm font-mono text-white focus:outline-none focus:border-cyan transition-all">
                      <option>Current Account (...420)</option>
                      <option>Savings Account (...000)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Transfer Type</label>
                    <div className="flex gap-2">
                      <button className="flex-1 py-4 rounded-xl bg-cyan text-void font-display font-bold text-xs">RAAST</button>
                      <button className="flex-1 py-4 rounded-xl border border-white/10 text-white/50 font-display font-bold text-xs hover:border-cyan transition-all">IBAN</button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Recipient Number / ID</label>
                  <input 
                    type="text" 
                    placeholder="03XX-XXXXXXX" 
                    className="w-full bg-void/50 border border-white/10 rounded-xl p-4 text-sm font-mono text-white focus:outline-none focus:border-cyan transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Amount (PKR)</label>
                  <input 
                    type="number" 
                    placeholder="0.00" 
                    className="w-full bg-void/50 border border-white/10 rounded-xl p-4 text-2xl font-display font-black text-cyan focus:outline-none focus:border-cyan transition-all"
                  />
                </div>

                <button className="w-full py-5 bg-cyan text-void font-display font-black text-sm rounded-xl cyan-glow hover:scale-[1.01] transition-all active:scale-95">
                  INITIATE SECURE TRANSFER
                </button>
              </div>
            </div>

            <div className="glass-panel p-8 rounded-3xl border-white/5">
              <h3 className="font-display text-lg font-black tracking-tighter mb-6 uppercase">Recent Beneficiaries</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'Ahmed Ali', bank: 'HBL' },
                  { name: 'Sara Khan', bank: 'Meezan' },
                  { name: 'Zainab B.', bank: 'Alfalah' },
                  { name: 'Hamza S.', bank: 'Indus' },
                ].map((b, i) => (
                  <button key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-cyan/30 transition-all group text-center">
                    <div className="w-12 h-12 rounded-full bg-cyan/10 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <User size={20} className="text-cyan" />
                    </div>
                    <p className="text-[10px] font-display font-bold uppercase truncate">{b.name}</p>
                    <p className="text-[8px] font-mono text-white/30 uppercase">{b.bank}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-panel p-8 rounded-3xl border-white/5">
              <h3 className="font-display text-sm font-black tracking-tighter mb-6 uppercase">Raast Status</h3>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-cyan/5 border border-cyan/10">
                <div className="w-10 h-10 rounded-full bg-cyan/20 flex items-center justify-center">
                  <Zap size={20} className="text-cyan" />
                </div>
                <div>
                  <p className="text-xs font-display font-bold text-cyan">RAAST ACTIVE</p>
                  <p className="text-[10px] font-mono text-cyan/50">Instant Payments Enabled</p>
                </div>
              </div>
            </div>

            <div className="glass-panel p-8 rounded-3xl border-white/5">
              <h3 className="font-display text-sm font-black tracking-tighter mb-6 uppercase">Transfer Limits</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-[10px] font-mono mb-2">
                    <span className="text-white/30 uppercase">Daily Limit</span>
                    <span className="text-cyan">PKR 250,000 / 500,000</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="w-1/2 h-full bg-cyan cyan-glow" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-mono mb-2">
                    <span className="text-white/30 uppercase">Monthly Limit</span>
                    <span className="text-magenta">PKR 1.2M / 5M</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="w-1/4 h-full bg-magenta magenta-glow" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
