import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition, DigitalRainReveal } from '../components/Animations';
import { CreditCard, Shield, Zap, Lock, Unlock, Eye, EyeOff, Plus } from 'lucide-react';
import { cn } from '@/src/lib/utils';

const BankCard = ({ card }: any) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div 
      className="relative h-56 w-full perspective-1000 cursor-pointer group"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        className="w-full h-full relative preserve-3d"
      >
        {/* Front Side */}
        <div className="absolute inset-0 backface-hidden">
          <div className={cn(
            "h-full w-full rounded-2xl p-6 flex flex-col justify-between border border-white/10 relative overflow-hidden shadow-2xl transition-all group-hover:scale-[1.02]",
            card.type === 'PLATINUM' ? "bg-gradient-to-br from-zinc-800 to-black text-white" : "bg-gradient-to-br from-cyan-900 to-cyan-700 text-white"
          )}>
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <CreditCard size={120} />
            </div>
            
            <div className="flex justify-between items-start relative z-10">
              <div className="space-y-1">
                <p className="text-[10px] font-mono opacity-50 uppercase tracking-widest">Indus Digital</p>
                <h3 className="text-lg font-display font-black tracking-tighter uppercase">{card.tier}</h3>
              </div>
              <div className="w-10 h-8 bg-amber-400/20 rounded-md border border-amber-400/30 flex items-center justify-center">
                <div className="w-6 h-4 bg-amber-400/40 rounded-sm" />
              </div>
            </div>

            <div className="relative z-10">
              <p className="text-xl font-mono tracking-[0.2em] mb-4">
                {showDetails ? card.number : "**** **** **** " + card.number.slice(-4)}
              </p>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[8px] font-mono opacity-50 uppercase mb-1">Card Holder</p>
                  <p className="text-xs font-display font-bold uppercase">{card.holder}</p>
                </div>
                <div className="text-right">
                  <p className="text-[8px] font-mono opacity-50 uppercase mb-1">Expires</p>
                  <p className="text-xs font-mono font-bold">{card.expiry}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back Side */}
        <div className="absolute inset-0 backface-hidden rotate-y-180">
          <div className="h-full w-full bg-zinc-900 rounded-2xl p-6 flex flex-col border border-white/10 shadow-2xl">
            <div className="w-full h-10 bg-black -mx-6 mb-6" />
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-8 bg-white/10 rounded flex items-center justify-end px-4">
                <span className="text-xs font-mono font-bold italic">***</span>
              </div>
              <span className="text-[8px] font-mono text-white/30 uppercase">CVV</span>
            </div>
            <p className="text-[8px] font-mono text-white/20 leading-tight uppercase">
              This card is property of Indus Digital Bank. Use is subject to terms and conditions. If found, please return to any branch or call 111-INDUS-111.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export const MyCardsPage = () => {
  const [isLocked, setIsLocked] = useState(false);

  const cards = [
    { 
      tier: 'PREMIER PLATINUM', 
      type: 'PLATINUM', 
      number: '4532 8812 9904 4201', 
      holder: 'MANSOOR GILLANI', 
      expiry: '08/29',
      status: 'ACTIVE'
    },
    { 
      tier: 'DIGITAL DEBIT', 
      type: 'DEBIT', 
      number: '5241 0029 3384 1102', 
      holder: 'MANSOOR GILLANI', 
      expiry: '12/27',
      status: 'ACTIVE'
    },
  ];

  return (
    <PageTransition>
      <div className="space-y-8">
        <DigitalRainReveal>
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-display font-black tracking-tighter mb-2">
                MY <span className="text-cyan text-glow-cyan">CARDS</span>
              </h1>
              <p className="text-cyan/50 font-mono text-xs uppercase tracking-widest">
                Manage Physical & Virtual Cards
              </p>
            </div>
            <button className="glass-panel px-6 py-3 rounded-xl border-white/5 flex items-center gap-3 hover:bg-white/5 transition-all">
              <Plus size={18} className="text-cyan" />
              <span className="text-xs font-display font-bold uppercase tracking-widest">Apply for New Card</span>
            </button>
          </div>
        </DigitalRainReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            {cards.map((card, i) => (
              <div key={i} className="space-y-4">
                <BankCard card={card} />
                <div className="flex gap-4">
                  <button className="flex-1 glass-panel py-3 rounded-xl border-white/5 flex items-center justify-center gap-2 hover:bg-white/5 transition-all">
                    <Lock size={14} className="text-white/50" />
                    <span className="text-[10px] font-display font-bold uppercase tracking-widest">Freeze Card</span>
                  </button>
                  <button className="flex-1 glass-panel py-3 rounded-xl border-white/5 flex items-center justify-center gap-2 hover:bg-white/5 transition-all">
                    <Shield size={14} className="text-cyan" />
                    <span className="text-[10px] font-display font-bold uppercase tracking-widest">Limits</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="glass-panel p-8 rounded-3xl border-white/5">
              <h3 className="font-display text-lg font-black tracking-tighter mb-6 uppercase">Card Security</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs font-display font-bold uppercase">Online Transactions</p>
                    <p className="text-[10px] font-mono text-white/30 uppercase">Enable for e-commerce</p>
                  </div>
                  <div className="w-12 h-6 bg-cyan/20 rounded-full relative p-1 cursor-pointer">
                    <div className="w-4 h-4 bg-cyan rounded-full absolute right-1" />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs font-display font-bold uppercase">International Usage</p>
                    <p className="text-[10px] font-mono text-white/30 uppercase">Enable for travel</p>
                  </div>
                  <div className="w-12 h-6 bg-white/10 rounded-full relative p-1 cursor-pointer">
                    <div className="w-4 h-4 bg-white/30 rounded-full absolute left-1" />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs font-display font-bold uppercase">Contactless Payments</p>
                    <p className="text-[10px] font-mono text-white/30 uppercase">NFC / Tap to Pay</p>
                  </div>
                  <div className="w-12 h-6 bg-cyan/20 rounded-full relative p-1 cursor-pointer">
                    <div className="w-4 h-4 bg-cyan rounded-full absolute right-1" />
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-panel p-8 rounded-3xl border-white/5">
              <h3 className="font-display text-lg font-black tracking-tighter mb-6 uppercase">Recent Card Activity</h3>
              <div className="space-y-4">
                {[
                  { name: 'NETFLIX.COM', val: 'PKR 1,500', date: '10 MAR' },
                  { name: 'SHELL PETROL', val: 'PKR 5,000', date: '08 MAR' },
                  { name: 'DARAZ.PK', val: 'PKR 3,200', date: '05 MAR' },
                ].map((tx, i) => (
                  <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                    <div>
                      <p className="text-[10px] font-display font-bold uppercase">{tx.name}</p>
                      <p className="text-[8px] font-mono text-white/30">{tx.date}</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-magenta">-{tx.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
