import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition } from '../components/PageTransition';

const posts = [
  {
    title: "The Secret Behind Our Spicy Injector",
    date: "OCT 12, 2023",
    category: "BEHIND THE SCENES",
    image: "https://images.unsplash.com/photo-1588168333986-5078d3ae3976?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Why Chicago Style Deep Dish Takes 45 Minutes",
    date: "SEP 28, 2023",
    category: "CULINARY SCIENCE",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Opening Night at Bahria Town",
    date: "AUG 15, 2023",
    category: "EVENTS",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  }
];

export default function Blog() {
  const [readingPost, setReadingPost] = useState<number | null>(null);

  const handleRead = (i: number) => {
    setReadingPost(i);
    setTimeout(() => setReadingPost(null), 3000);
  };

  return (
    <PageTransition className="flex-grow pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto relative flex flex-col items-center">
        <AnimatePresence>
          {readingPost !== null && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -50 }}
              className="fixed bottom-10 right-10 bg-theme text-theme-content p-6 rounded-2xl shadow-2xl z-50 md:right-10 md:bottom-10 right-6 bottom-24"
            >
              <h4 className="font-extrabold tracking-tight text-[20px] mb-2">Opening Article...</h4>
              <p className="text-[14px] font-medium opacity-80">Loading full content.</p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 max-w-2xl w-full"
        >
          <h1 className="text-[44px] md:text-[64px] leading-[1.1] font-extrabold tracking-tight mb-4">
            The <span className="text-theme transition-colors duration-500 font-black">Journal</span>
          </h1>
          <p className="text-white/60 text-[16px] font-medium leading-[1.6]">
            Stories, recipes, and news from the heart of our kitchen.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
          {posts.map((post, idx) => (
            <motion.article 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: idx * 0.1 }}
              className="group cursor-pointer bg-gray-deep/10 border border-gray-deep/50 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-theme/5 hover:border-theme/30 transition-all duration-500"
              onClick={() => handleRead(idx)}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <div className="absolute inset-0 bg-theme/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" />
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-[11px] uppercase tracking-widest text-theme transition-colors duration-500 font-bold bg-theme/10 px-2 py-1 rounded">{post.category}</span>
                  <span className="text-[12px] text-white/50 font-medium">{post.date}</span>
                </div>
                <h2 className="text-[22px] font-bold tracking-tight mb-3 group-hover:text-theme transition-colors duration-500 leading-tight">{post.title}</h2>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
