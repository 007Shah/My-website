import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PageTransition, DigitalRainReveal } from '../components/Animations';
import { BarChart3, PieChart, LineChart, Download, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export const AnalyticsPage = () => {
  const [timeframe, setTimeframe] = useState('30D');

  return (
    <PageTransition>
      <div className="space-y-8">
        <DigitalRainReveal>
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-display font-black tracking-tighter mb-2">
                SPENDING <span className="text-cyan text-glow-cyan">ANALYTICS</span>
              </h1>
              <p className="text-cyan/50 font-mono text-xs uppercase tracking-widest">
                Detailed Financial Insights // Monthly Breakdown
              </p>
            </div>
            <div className="flex gap-4">
              <button className="glass-panel px-6 py-2 rounded-lg text-xs font-display font-bold hover:bg-white/10 transition-colors border-white/10 flex items-center gap-2">
                <Download size={14} />
                EXPORT PDF
              </button>
            </div>
          </div>
        </DigitalRainReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-panel p-8 rounded-3xl border-white/5 h-[400px] relative overflow-hidden flex flex-col">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-display text-lg font-black tracking-tighter uppercase">Income vs Expenses</h3>
                <div className="flex gap-2">
                  {['7D', '30D', '3M', '1Y'].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTimeframe(t)}
                      className={cn(
                        "px-3 py-1 rounded-lg font-mono text-[10px] transition-all",
                        timeframe === t ? "bg-cyan text-void" : "text-white/20 hover:text-white/40"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 flex items-end gap-4 px-4">
                {[30, 45, 25, 60, 40, 75, 50, 90, 65, 80, 55, 70].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col gap-1">
                    <div className="flex-1 flex items-end gap-1">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        className="flex-1 bg-cyan/40 rounded-t-sm"
                      />
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${h * 0.6}%` }}
                        className="flex-1 bg-magenta/40 rounded-t-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-4 text-[10px] font-mono text-white/20 uppercase tracking-widest px-4">
                <span>Week 1</span>
                <span>Week 2</span>
                <span>Week 3</span>
                <span>Week 4</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-panel p-8 rounded-3xl border-white/5">
                <h3 className="font-display text-sm font-black tracking-tighter mb-6 uppercase">Top Categories</h3>
                <div className="space-y-4">
                  {[
                    { name: 'Shopping', val: 42, color: 'cyan' },
                    { name: 'Food & Dining', val: 28, color: 'magenta' },
                    { name: 'Utilities', val: 18, color: 'cyber-blue' },
                    { name: 'Others', val: 12, color: 'white/20' },
                  ].map((cat, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-[10px] font-mono mb-1 uppercase">
                        <span className="text-white/50">{cat.name}</span>
                        <span className="text-white">{cat.val}%</span>
                      </div>
                      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className={cn("h-full", cat.color === 'cyan' ? "bg-cyan" : cat.color === 'magenta' ? "bg-magenta" : "bg-white/20")} style={{ width: `${cat.val}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-panel p-8 rounded-3xl border-white/5">
                <h3 className="font-display text-sm font-black tracking-tighter mb-6 uppercase">Monthly Summary</h3>
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-cyan/10 flex items-center justify-center text-cyan">
                        <TrendingUp size={16} />
                      </div>
                      <span className="text-xs font-display font-bold uppercase">Total Income</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-cyan">PKR 450,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-magenta/10 flex items-center justify-center text-magenta">
                        <TrendingDown size={16} />
                      </div>
                      <span className="text-xs font-display font-bold uppercase">Total Expenses</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-magenta">PKR 312,400</span>
                  </div>
                  <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                    <span className="text-xs font-display font-bold uppercase">Net Savings</span>
                    <span className="text-lg font-display font-black text-white">PKR 137,600</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-panel p-8 rounded-3xl border-white/5">
              <h3 className="font-display text-sm font-black tracking-tighter mb-6 uppercase">Upcoming Payments</h3>
              <div className="space-y-4">
                {[
                  { name: 'Car Loan EMI', val: 'PKR 45,000', date: '15 MAR' },
                  { name: 'House Rent', val: 'PKR 85,000', date: '01 APR' },
                  { name: 'Insurance', val: 'PKR 12,000', date: '05 APR' },
                ].map((p, i) => (
                  <div key={i} className="flex justify-between items-center p-4 rounded-xl bg-white/5 border border-white/5">
                    <div>
                      <p className="text-[10px] font-display font-bold uppercase">{p.name}</p>
                      <p className="text-[8px] font-mono text-white/30">{p.date}</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-white">{p.val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel p-8 rounded-3xl border-white/5 bg-cyan/5 border-cyan/10">
              <div className="flex items-center gap-3 text-cyan mb-4">
                <Calendar size={18} />
                <h3 className="font-display text-xs font-black uppercase tracking-widest">Financial Goal</h3>
              </div>
              <p className="text-[10px] font-mono text-white/50 leading-relaxed uppercase mb-4">
                You are on track to save PKR 1.5M by the end of this year. Keep it up!
              </p>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="w-3/4 h-full bg-cyan cyan-glow" />
              </div>
              <p className="text-[8px] font-mono text-cyan/50 mt-2 uppercase text-right">75% Achieved</p>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
