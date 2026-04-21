import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition } from '../components/PageTransition';
import { MagneticButton } from '../components/MagneticButton';

export default function Deals() {
  const [claimedDeal, setClaimedDeal] = useState<number | null>(null);

  const handleClaim = (i: number) => {
    setClaimedDeal(i);
    setTimeout(() => setClaimedDeal(null), 3000);
  };

  return (
    <PageTransition className="flex-grow pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto relative flex flex-col items-center">
        <AnimatePresence>
          {claimedDeal !== null && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -50 }}
              className="fixed bottom-10 right-10 bg-theme text-theme-content p-6 rounded-2xl shadow-2xl z-50 md:right-10 md:bottom-10 right-6 bottom-24 transition-colors duration-500"
            >
              <h4 className="font-extrabold tracking-tight text-[20px] mb-2">Offer Claimed!</h4>
              <p className="text-[14px] font-medium opacity-80">Combo Deal {claimedDeal} added to your cart.</p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           className="text-center mb-16 max-w-2xl w-full"
        >
          <h1 className="text-[44px] md:text-[64px] leading-[1.1] font-extrabold tracking-tight mb-4">
            Deals & <span className="text-theme transition-colors duration-500 font-black">Offers</span>
          </h1>
          <p className="text-white/60 text-[16px] font-medium leading-[1.6]">
            Exclusive combinations crafted for maximum flavor down to the last bite.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
          {[1, 2, 3, 4].map((i, idx) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: idx * 0.1 }}
              className="bg-obsidian border border-gray-deep/50 p-8 md:p-10 flex flex-col justify-between relative overflow-hidden group rounded-3xl hover:shadow-2xl hover:border-theme/30 transition-all duration-500"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-theme/5 transition-colors duration-500 rounded-full blur-3xl group-hover:bg-theme/20 pointer-events-none" />
              <div className="relative z-10">
                <div className="text-[11px] uppercase tracking-widest text-theme transition-colors duration-500 font-bold mb-4 bg-theme/10 w-fit px-3 py-1 rounded-full">Limited Time</div>
                <h3 className="text-[28px] md:text-[34px] font-bold tracking-tight mb-4 group-hover:text-theme transition-colors duration-300">Combo Deal {i}</h3>
                <p className="text-[15px] text-white/70 leading-[1.7] mb-8 font-medium">1 Large Deep Dish Pizza + 4 Pcs Spicy Broast + 1.5L Drink.</p>
              </div>
              <div className="flex justify-between items-center relative z-10 border-t border-gray-deep/50 pt-6 mt-4">
                <span className="text-[32px] md:text-[40px] font-black tracking-tight">$34.99</span>
                <div onClick={() => handleClaim(i)}>
                  <MagneticButton className="shadow-md">Claim Offer</MagneticButton>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
