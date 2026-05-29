import React from 'react';
import { motion } from 'motion/react';
import AnimatedPage from '../components/AnimatedPage';

export default function About() {
  return (
    <AnimatedPage className="min-h-screen pt-12 pb-32 px-4 sm:px-6 lg:px-12 max-w-[1400px] mx-auto">
      <div className="max-w-3xl mx-auto text-center mt-12 md:mt-24 mb-20 md:mb-32">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-light tracking-tight mb-8"
        >
          About Lumina
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-[#888888] text-lg leading-relaxed mb-12"
        >
          Lumina is a design studio exploring the intersection of minimalism, functionality, and enduring craftsmanship. We believe that everyday objects should elevate your space and bring quiet joy to your routines.
        </motion.p>
        <motion.img 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80" 
          alt="Lumina Studio Workspace" 
          className="w-full h-[300px] md:h-[500px] object-cover rounded-[40px] border border-[#222222] mix-blend-luminosity mb-12" 
        />
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-[#CCCCCC] text-xl font-light leading-relaxed"
        >
          Our products are meticulously designed and sourced from sustainable materials, prioritizing longevity over fleeting trends. We strive for a world where less is truly more.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
        {[
          { title: "Precision", text: "Every angle and curve is calculated to provide both visual balance and ergonomic comfort." },
          { title: "Material", text: "We source aerospace-grade aluminum, sustainable woods, and premium synthetics tailored for decades of use." },
          { title: "Aesthetics", text: "By stripping away the unnecessary, we expose the purest form of the object—honest and unassuming." }
        ].map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="p-8 rounded-[32px] bg-black/40 backdrop-blur-sm border border-[#222222]"
          >
            <h3 className="text-[12px] uppercase tracking-[0.2em] font-bold text-[#E5E5E5] mb-4">{item.title}</h3>
            <p className="text-[#888888] text-sm leading-relaxed">{item.text}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
        >
          <img 
            src="https://images.unsplash.com/photo-1552581234-26160f608093?auto=format&fit=crop&q=80" 
            alt="Founders" 
            className="w-full h-[600px] object-cover rounded-[40px] mix-blend-luminosity opacity-80" 
          />
        </motion.div>
        <motion.div
           initial={{ opacity: 0, x: 20 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
           className="p-8 lg:p-12"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#666666] mb-4 block">The Founders</span>
          <h2 className="text-3xl lg:text-5xl font-light tracking-tight text-white mb-6">Born from frustration.</h2>
          <p className="text-[#888888] mb-6 leading-relaxed">
            Lumina was started in 2021 by two industrial designers who grew tired of planned obsolescence and overly complex technology.
          </p>
          <p className="text-[#888888] leading-relaxed">
            We wanted tools that felt human, that didn't demand attention through constant notifications or bright colors, but rather blended seamlessly into our creative processes. What started as a single desk lamp has evolved into a comprehensive philosophy of spatial living.
          </p>
        </motion.div>
      </div>
    </AnimatedPage>
  );
}
