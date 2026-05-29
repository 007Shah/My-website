import React from 'react';
import { motion } from 'motion/react';
import AnimatedPage from '../components/AnimatedPage';
import { ArrowUpRight } from 'lucide-react';

export default function Archive() {
  const archives = [
    { year: "2023", name: "Form & Function Vol. 1", desc: "Our inaugural lookbook showcasing the intersection of architectural forms and domestic utility.", status: "Retired", img: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=500&q=80" },
    { year: "2022", name: "Essence Collection", desc: "A limited run of seating arrangements carved entirely from single blocks of reclaimed oak.", status: "Sold Out", img: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=500&q=80" },
    { year: "2022", name: "Shadow Series", desc: "An exploration into lighting design using matte black metals and diffused glass.", status: "Retired", img: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=500&q=80" },
    { year: "2021", name: "Monolith Pre-Release", desc: "The original prototypes that started our journey into monolithic audio equipment.", status: "Archived", img: "https://images.unsplash.com/photo-1628202926206-c63a34b1618f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHdpcmVsZXNzJTIwaGVhZHBob25lc3xlbnwwfHwwfHx8MA%3D%3D" },
    { year: "2020", name: "Concept Zero", desc: "Early sketches, raw models, and unreleased concepts that never made it to production.", status: "Archived", img: "https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=500&q=80" }
  ];

  return (
    <AnimatedPage className="min-h-screen pt-12 pb-32 px-4 sm:px-6 lg:px-12 max-w-[1400px] mx-auto">
      <div className="mb-16 md:mb-24 mt-8 md:mt-12 max-w-2xl">
        <motion.h1 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="text-4xl md:text-6xl font-light tracking-tight mb-6 text-white"
        >
           Archive.
        </motion.h1>
        <motion.p 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.1 }}
           className="text-[#888888] text-lg leading-relaxed"
        >
          Historical pieces and past collections that shaped our design language. These items are no longer in production.
        </motion.p>
      </div>
      <div className="flex flex-col gap-0 border-t border-[#222222]">
        {archives.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
            className="group flex flex-col md:flex-row items-start md:items-center justify-between py-12 border-b border-[#222222] hover:bg-black/40 hover:backdrop-blur-md transition-all cursor-pointer px-6 -mx-6 rounded-3xl"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-12 w-full">
              <span className="text-[10px] uppercase tracking-widest text-[#555555] w-12 font-bold block shrink-0">{item.year}</span>
              
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-[16px] overflow-hidden hidden sm:block shrink-0 border border-[#222222]">
                 <img src={item.img} alt={item.name} className="w-full h-full object-cover mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-500 opacity-60 group-hover:opacity-100 group-hover:scale-105" />
              </div>

              <div className="flex flex-col gap-2 max-w-lg">
                 <span className="text-2xl md:text-3xl font-light text-[#BBBBBB] group-hover:text-white transition-colors">{item.name}</span>
                 <span className="text-sm text-[#666666] leading-relaxed group-hover:text-[#888888] transition-colors">{item.desc}</span>
              </div>
            </div>
            <div className="flex items-center gap-8 mt-8 md:mt-0 w-full md:w-auto justify-between md:justify-end shrink-0">
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#444444] block">{item.status}</span>
              <div className="w-12 h-12 rounded-full border border-[#333333] flex items-center justify-center text-[#666666] group-hover:text-black group-hover:bg-white transition-all">
                <ArrowUpRight className="w-5 h-5 pointer-events-none" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </AnimatedPage>
  );
}
