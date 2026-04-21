import React from 'react';
import { motion } from 'framer-motion';
import { PageTransition } from '../components/PageTransition';
import { AnimatedText } from '../components/AnimatedText';

export default function OurStory() {
  return (
    <PageTransition className="flex-grow pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           className="text-center mb-16"
        >
          <h1 className="text-[52px] md:text-[76px] leading-[1] font-extrabold tracking-tight mb-4">
            Our <span className="text-theme transition-colors duration-500 font-black">Story</span>
          </h1>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-32 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <AnimatedText 
              text="Born from a passion for bold flavors and a relentless drive for perfection. J Jamera is more than just a restaurant. It's a lifestyle."
              className="text-[16px] text-white/80 leading-[1.7] border-l-[3px] border-theme transition-colors duration-500 pl-5 mb-8 font-medium"
            />
            <p className="text-[15px] text-white/60 leading-[1.8] mb-6">
              We started in the heart of Lahore with a simple mission: to create the most intense, flavor-packed deep-dish pizza and broast imaginable. No compromises, no shortcuts.
            </p>
            <p className="text-[15px] text-white/60 leading-[1.8]">
              Every ingredient is carefully selected, every recipe rigorously tested. We believe in high-impact food for high-impact individuals. We built an aesthetic that is as unapologetic as our taste: clean lines, maximum contrast, premium quality.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative aspect-square group rounded-[2rem] overflow-hidden shadow-2xl"
          >
            <div className="absolute inset-0 bg-theme/20 transition-colors duration-500 group-hover:bg-transparent z-10" />
            <img 
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
              alt="Kitchen" 
              className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
            />
          </motion.div>
        </div>

        <div className="border-t border-gray-deep/50 pt-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[36px] md:text-[52px] leading-[1] font-extrabold tracking-tight mb-16 text-center"
          >
            The <span className="text-theme transition-colors duration-500 font-black">Method</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { title: "Dough", desc: "Fermented for 72 hours. Thick, buttery, yet surprisingly light. It's the foundation of everything.", img: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
              { title: "Fire", desc: "We bake our deep dish in heavy iron cast pans at high precise temperatures to achieve the perfect crust edge.", img: "https://images.unsplash.com/photo-1507914464560-a5534c568014?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
              { title: "Spice", desc: "Our broast relies on a proprietary spice blend injected directly to the bone, followed by a double crunch fry.", img: "https://images.unsplash.com/photo-1596622527585-611ff34fcb98?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" }
            ].map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: idx * 0.2 }}
                className="group cursor-pointer bg-gray-deep/10 border border-gray-deep/50 p-6 rounded-2xl hover:shadow-xl hover:border-theme/30 transition-all duration-300"
              >
                <div className="relative aspect-[4/3] overflow-hidden mb-6 rounded-xl shadow-md">
                   <div className="absolute inset-0 bg-theme/10 group-hover:bg-transparent transition-colors duration-500 z-10 pointer-events-none" />
                   <img src={step.img} alt={step.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <h3 className="text-[20px] font-bold tracking-tight mb-3 text-white group-hover:text-theme transition-colors duration-300">{step.title}</h3>
                <p className="text-[14px] text-white/70 leading-[1.7]">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
