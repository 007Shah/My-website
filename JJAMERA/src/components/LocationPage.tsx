import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition } from '../components/PageTransition';
import { MagneticButton } from '../components/MagneticButton';

interface LocationPageProps {
  title: string;
  address: string;
  hours: string;
  phone: string;
  children?: React.ReactNode;
}

export function LocationPage({ title, address, hours, phone, children }: LocationPageProps) {
  const [isRouting, setIsRouting] = useState(false);

  const handleDirections = () => {
    setIsRouting(true);
    setTimeout(() => setIsRouting(false), 3000);
  };

  return (
    <PageTransition className="flex-grow pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto relative">
        <AnimatePresence>
          {isRouting && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -50 }}
              className="fixed bottom-10 right-10 bg-theme text-theme-content p-6 border-2 border-theme-content shadow-[8px_8px_0px_0px_var(--theme-content)] z-50 md:right-10 md:bottom-10 right-6 bottom-24 transition-colors duration-500"
            >
              <h4 className="font-black uppercase tracking-[-1px] text-[20px] mb-2">Opening Maps...</h4>
              <p className="text-[12px] font-bold uppercase tracking-[0.1em]">Routing to {title}.</p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[60px] md:text-[90px] leading-[0.85] font-black uppercase tracking-[-3px] mb-12"
        >
          {title}
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', damping: 15, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-[10px] uppercase tracking-[0.1em] text-theme transition-colors duration-500 font-bold mb-2">Address</h3>
              <p className="text-[14px] text-white/70 leading-[1.6]">{address}</p>
            </div>
            <div>
              <h3 className="text-[10px] uppercase tracking-[0.1em] text-theme transition-colors duration-500 font-bold mb-2">Hours</h3>
              <p className="text-[14px] text-white/70 leading-[1.6]">{hours}</p>
            </div>
            <div>
              <h3 className="text-[10px] uppercase tracking-[0.1em] text-theme transition-colors duration-500 font-bold mb-2">Phone</h3>
              <p className="text-[14px] text-white/70 leading-[1.6]">{phone}</p>
            </div>
            <div className="pt-8" onClick={handleDirections}>
              <MagneticButton>Get Directions</MagneticButton>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 15, delay: 0.4 }}
            className="relative aspect-video bg-gray-deep border border-gray-deep/50 flex items-center justify-center overflow-hidden"
          >
            {/* Simulated Map */}
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
            
            {/* Pulsing Pin */}
            <div className="relative z-10 flex flex-col items-center">
              <motion.div 
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute w-12 h-12 bg-theme transition-colors duration-500 rounded-full opacity-50"
              />
              <div className="w-4 h-4 bg-theme transition-colors duration-500 rounded-full z-10" />
              <div className="w-1 h-8 bg-theme transition-colors duration-500 mt-1" />
            </div>
          </motion.div>
        </div>

        {children && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="border-t border-gray-deep pt-16"
          >
            {children}
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}
