import React from 'react';
import { PageTransition, DigitalRainReveal } from '../components/Animations';
import { Zap, Smartphone, Lightbulb, GraduationCap, Plus } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export const BillPaymentsPage = () => {
  return (
    <PageTransition>
      <div className="space-y-8">
        <DigitalRainReveal>
          <h1 className="text-4xl font-display font-black tracking-tighter mb-2">
            BILL <span className="text-cyan text-glow-cyan">PAYMENTS</span>
          </h1>
          <p className="text-cyan/50 font-mono text-xs uppercase tracking-widest">
            Utility // Mobile Top-up // Education // Government
          </p>
        </DigitalRainReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Lightbulb, label: 'Electricity', color: 'amber' },
                { icon: Smartphone, label: 'Mobile', color: 'cyan' },
                { icon: GraduationCap, label: 'Education', color: 'magenta' },
                { icon: Plus, label: 'Others', color: 'white' },
              ].map((item, i) => (
                <button key={i} className="glass-panel p-6 rounded-3xl border-white/5 hover:border-cyan/30 transition-all group text-center">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform",
                    item.color === 'amber' ? "bg-amber-500/10 text-amber-500" :
                    item.color === 'cyan' ? "bg-cyan/10 text-cyan" :
                    item.color === 'magenta' ? "bg-magenta/10 text-magenta" : "bg-white/10 text-white"
                  )}>
                    <item.icon size={24} />
                  </div>
                  <span className="text-[10px] font-display font-bold uppercase tracking-widest">{item.label}</span>
                </button>
              ))}
            </div>

            <div className="glass-panel p-8 rounded-3xl border-white/5">
              <h3 className="font-display text-lg font-black tracking-tighter mb-6 uppercase">New Bill Payment</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Company / Provider</label>
                    <select className="w-full bg-void/50 border border-white/10 rounded-xl p-4 text-sm font-mono text-white focus:outline-none focus:border-cyan transition-all">
                      <option>K-Electric (KE)</option>
                      <option>Sui Southern Gas (SSGC)</option>
                      <option>PTCL / EVO</option>
                      <option>Jazz / Telenor / Zong</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Consumer Number</label>
                    <input 
                      type="text" 
                      placeholder="Enter 13-digit number" 
                      className="w-full bg-void/50 border border-white/10 rounded-xl p-4 text-sm font-mono text-white focus:outline-none focus:border-cyan transition-all"
                    />
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-cyan/5 border border-cyan/10 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-mono text-cyan/50 uppercase mb-1">Due Amount</p>
                    <p className="text-2xl font-display font-black text-cyan">PKR 12,450.00</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-mono text-white/30 uppercase mb-1">Due Date</p>
                    <p className="text-xs font-display font-bold text-white">15 MAR 2026</p>
                  </div>
                </div>

                <button className="w-full py-5 bg-cyan text-void font-display font-black text-sm rounded-xl cyan-glow hover:scale-[1.01] transition-all active:scale-95">
                  PAY BILL NOW
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-panel p-8 rounded-3xl border-white/5">
              <h3 className="font-display text-sm font-black tracking-tighter mb-6 uppercase">Saved Billers</h3>
              <div className="space-y-4">
                {[
                  { name: 'Home Electricity', id: '100293847', provider: 'KE' },
                  { name: 'Office Internet', id: '992837465', provider: 'PTCL' },
                  { name: 'Gas Connection', id: '882736451', provider: 'SSGC' },
                ].map((biller, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-cyan/30 transition-all cursor-pointer group">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-display font-bold group-hover:text-cyan transition-colors">{biller.name}</span>
                      <span className="text-[10px] font-mono text-white/30">{biller.provider}</span>
                    </div>
                    <span className="text-[10px] font-mono text-white/50">{biller.id}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel p-8 rounded-3xl border-white/5 bg-magenta/5 border-magenta/10">
              <div className="flex items-center gap-3 text-magenta mb-4">
                <Zap size={18} />
                <h3 className="font-display text-xs font-black uppercase tracking-widest">Payment Alert</h3>
              </div>
              <p className="text-[10px] font-mono text-white/50 leading-relaxed uppercase">
                Your PTCL bill for March is now available. Pay before 18th March to avoid late fees.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
