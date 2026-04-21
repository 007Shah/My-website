import React from 'react';
import { motion } from 'framer-motion';

export function PageTransition({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20, scale: 0.98 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className={className}
      >
        {children}
      </motion.div>

      {/* Sweep to reveal page (Slide Out) */}
      <motion.div
        className="fixed inset-0 z-[100] bg-theme pointer-events-none transition-colors duration-500"
        initial={{ y: "0%" }}
        animate={{ y: "-100%" }}
        exit={{ y: "-100%" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Sweep to hide page (Slide In) */}
      <motion.div
        className="fixed inset-0 z-[100] bg-theme pointer-events-none transition-colors duration-500"
        initial={{ y: "100%" }}
        animate={{ y: "100%" }}
        exit={{ y: "0%" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      />
    </>
  );
}
