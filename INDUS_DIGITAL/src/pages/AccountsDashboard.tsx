import React from 'react';
import { motion } from 'framer-motion';
import { PageTransition, DigitalRainReveal } from '../components/Animations';
import { TrendingUp, TrendingDown, DollarSign, Globe, Zap, Shield } from 'lucide-react';
import { cn } from '@/src/lib/utils';

const StatCard = ({ label, value, change, icon: Icon, color = 'cyan' }: any) => (
  <motion.div
    whileHover={{ y: -5, scale: 1.02 }}
    className={cn(
      "glass-panel p-6 rounded-2xl relative overflow-hidden group",
      color === 'cyan' ? "cyan-glow" : "magenta-glow"
    )}
  >
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
      <Icon size={48} />
    </div>
    <div className="relative z-10">
      <div className="flex items-center gap-2 mb-4">
        <div className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center",
          color === 'cyan' ? "bg-cyan/10 text-cyan" : "bg-magenta/10 text-magenta"
        )}>
          <Icon size={16} />
        </div>
        <span className="text-[10px] font-mono text-white/50 uppercase tracking-[0.2em]">{label}</span>
      </div>
      <div className="flex items-end gap-3">
        <h3 className="text-3xl font-display font-black tracking-tighter leading-none">
          {value}
        </h3>
        <div className={cn(
          "flex items-center text-[10px] font-mono mb-1",
          change.startsWith('+') ? "text-emerald-400" : "text-rose-400"
        )}>
          {change.startsWith('+') ? <TrendingUp size={10} className="mr-1" /> : <TrendingDown size={10} className="mr-1" />}
          {change}
        </div>
      </div>
    </div>
    <div className={cn(
      "absolute bottom-0 left-0 w-full h-[2px]",
      color === 'cyan' ? "bg-cyan/20" : "bg-magenta/20"
    )} />
  </motion.div>
);

export const AccountsDashboard = () => {
  return (
    <PageTransition>
      <div className="space-y-8">
        <DigitalRainReveal>
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-display font-black tracking-tighter mb-2">
                ACCOUNT <span className="text-cyan text-glow-cyan">SUMMARY</span>
              </h1>
              <p className="text-cyan/50 font-mono text-xs uppercase tracking-widest">
                Welcome back, Mansoor // Indus Premier
              </p>
            </div>
            <div className="flex gap-4">
              <button className="glass-panel px-6 py-2 rounded-lg text-xs font-display font-bold hover:bg-cyan/10 transition-colors border-cyan/20 text-cyan">
                SEND MONEY
              </button>
              <button className="glass-panel px-6 py-2 rounded-lg text-xs font-display font-bold hover:bg-magenta/10 transition-colors border-magenta/20 text-magenta">
                PAY BILLS
              </button>
            </div>
          </div>
        </DigitalRainReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            label="Current Account" 
            value="PKR 1,240,420.00" 
            change="+2.4% (This Month)" 
            icon={DollarSign} 
            color="cyan"
          />
          <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group cyan-glow">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Globe size={48} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-cyan/10 text-cyan">
                  <Globe size={16} />
                </div>
                <span className="text-[10px] font-mono text-white/50 uppercase tracking-[0.2em]">Savings Account</span>
              </div>
              <div className="flex items-end gap-3">
                <h3 className="text-3xl font-display font-black tracking-tighter leading-none">
                  PKR 4,295,000.00
                </h3>
              </div>
            </div>
          </div>
          <StatCard 
            label="Total Rewards" 
            value="12,840 PTS" 
            change="+420 (Last Week)" 
            icon={Zap} 
            color="magenta"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-panel p-8 rounded-3xl border-white/5 relative overflow-hidden">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-display text-lg font-black tracking-tighter uppercase">Spending Analysis</h3>
              <div className="flex gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
                <span className="text-[10px] font-mono text-cyan uppercase tracking-widest">Live Updates</span>
              </div>
            </div>
            
            <div className="h-64 flex items-end gap-2">
              {[40, 60, 45, 80, 55, 90, 70, 85, 65, 75, 50, 95].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: i * 0.05, duration: 1, ease: "easeOut" }}
                  className={cn(
                    "flex-1 rounded-t-sm relative group",
                    i % 3 === 0 ? "bg-magenta/40" : "bg-cyan/40"
                  )}
                >
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-[10px] font-mono text-white/20 uppercase tracking-widest">
              <span>JAN</span>
              <span>FEB</span>
              <span>MAR</span>
              <span>APR</span>
              <span>MAY</span>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-3xl border-white/5">
            <h3 className="font-display text-lg font-black tracking-tighter mb-8 uppercase">Recent Transactions</h3>
            <div className="space-y-4">
              {[
                { name: 'K-ELECTRIC BILL', val: 'PKR 12,400', type: 'DEBIT', color: 'magenta' },
                { name: 'RAAST TRANSFER IN', val: 'PKR 45,000', type: 'CREDIT', color: 'cyan' },
                { name: 'FOODPANDA PAKISTAN', val: 'PKR 2,450', type: 'DEBIT', color: 'magenta' },
                { name: 'ATM WITHDRAWAL', val: 'PKR 10,000', type: 'DEBIT', color: 'magenta' },
              ].map((tx, i) => (
                <div key={i} className="flex justify-between items-center p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                  <div className="flex items-center gap-4">
                    <div className={cn("w-2 h-2 rounded-full", tx.type === 'CREDIT' ? "bg-cyan" : "bg-magenta")} />
                    <span className="text-xs font-mono text-white/70 uppercase tracking-widest">{tx.name}</span>
                  </div>
                  <span className={cn("text-xs font-display font-bold", tx.type === 'CREDIT' ? "text-cyan" : "text-magenta")}>
                    {tx.type === 'CREDIT' ? '+' : '-'}{tx.val}
                  </span>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-3 rounded-xl border border-white/5 text-[10px] font-mono text-white/30 hover:text-white transition-colors uppercase tracking-widest">
              View Full Statement
            </button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
