import React from 'react';
import { motion } from 'motion/react';
import AnimatedPage from '../components/AnimatedPage';

export default function Studio() {
  const sections = [
    {
      title: "Acoustic Engineering",
      desc: "Every speaker enclosure is mathematically modeled to eliminate standing waves and resonance. We use high-density composites tailored specifically for auditory perfection.",
      image: "https://images.unsplash.com/photo-1542406775-47d3e60155b5?w=800&q=80"
    },
    {
      title: "Material Selection",
      desc: "We prioritize materials that age gracefully. Our leathers develop a unique patina, and our aluminum finishes are anodized to resist scratches while maintaining a soft, natural luster.",
      image: "https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=800&q=80"
    },
    {
      title: "Iterative Prototyping",
      desc: "A single product undergoes dozens of physical iterations. We believe that digital models can only take you so far—the true test of an object is how it feels in the hand.",
      image: "https://images.unsplash.com/photo-1493770348161-369560ae357d?w=800&q=80"
    },
    {
      title: "Assembly & Finish",
      desc: "Final assembly is performed by hand, ensuring that tolerances are exact. Each piece is inspected and signed off before it leaves our facility.",
      image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80"
    }
  ];

  return (
    <AnimatedPage className="min-h-screen pt-12 pb-32 px-4 sm:px-6 lg:px-12 max-w-[1400px] mx-auto">
      <div className="mb-20 md:mb-32 mt-8 md:mt-12 max-w-2xl">
        <motion.h1 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="text-4xl md:text-6xl font-light tracking-tight mb-6 text-white"
        >
          Studio.
        </motion.h1>
        <motion.p 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.1 }}
           className="text-[#888888] text-lg leading-relaxed"
        >
          Behind the scenes. Our design process, material exploration, and spatial studies.
        </motion.p>
      </div>

      <div className="space-y-32">
        {sections.map((section, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className={`flex flex-col ${i % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-12 lg:gap-24 items-center`}
          >
            <div className="w-full md:w-1/2">
               <div className="relative rounded-[40px] overflow-hidden border border-[#222222] bg-black/40 backdrop-blur-sm shadow-2xl aspect-[4/3] group">
                 <img 
                   src={section.image} 
                   alt={section.title} 
                   className="w-full h-full object-cover mix-blend-luminosity hover:mix-blend-normal transition-all duration-[2s] ease-in-out opacity-60 hover:opacity-100 hover:scale-[1.03]" 
                 />
               </div>
            </div>
            <div className="w-full md:w-1/2 py-8 md:py-0">
               <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#666666] mb-4 block">0{i + 1}</span>
               <h2 className="text-3xl lg:text-4xl font-light tracking-tight text-white mb-6">{section.title}</h2>
               <p className="text-[#888888] text-lg leading-relaxed">{section.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </AnimatedPage>
  );
}
