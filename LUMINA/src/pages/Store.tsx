import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Product } from '../types';
import AnimatedPage from '../components/AnimatedPage';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ListFilter } from 'lucide-react';

export default function Store() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  const categories = ['Audio', 'Peripherals', 'Home', 'Wearables', 'Furniture', 'Travel'];
  const filteredProducts = activeCategory === 'All' ? products : products.filter(p => p.category === activeCategory);

  if (loading) {
    return (
      <AnimatedPage className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#222222] border-t-white rounded-full animate-spin" />
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage className="min-h-screen pb-20 max-w-[1400px] mx-auto overflow-hidden">
      
      {/* Hero Section with Marquee */}
      <div className="pt-12 px-4 sm:px-6 lg:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 mt-8 text-left max-w-3xl flex flex-col md:flex-row md:items-end justify-between"
        >
          <div>
            <h1 className="text-4xl md:text-6xl font-light tracking-tight mb-4 text-white">
              Curated Essentials.
            </h1>
            <p className="text-[#888888] text-sm md:text-base leading-relaxed max-w-xl">
              Elevate your workspace and lifestyle with our collection of minimalist, meticulously designed tools.
            </p>
          </div>
          
          <div className="mt-8 md:mt-0 relative group">
             <button 
                onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                className="flex items-center gap-2 border border-[#333333] px-6 h-12 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold text-[#CCCCCC] hover:text-white hover:bg-[#111111] transition-all"
              >
                <ListFilter className="w-4 h-4" /> 
                {activeCategory} Categories
             </button>
             
             {isCategoryMenuOpen && (
               <div className="absolute top-14 right-0 w-48 bg-[#080808] border border-[#222222] rounded-2xl flex flex-col py-2 shadow-2xl z-20">
                 <button onClick={() => { setActiveCategory('All'); setIsCategoryMenuOpen(false); }} className={`text-left px-6 py-3 text-[10px] uppercase tracking-[0.2em] font-bold ${activeCategory === 'All' ? 'text-white bg-[#111111]' : 'text-[#666666] hover:text-white hover:bg-[#111111]'}`}>All Objects</button>
                 {categories.map(c => (
                   <button key={c} onClick={() => { setActiveCategory(c); setIsCategoryMenuOpen(false); }} className={`text-left px-6 py-3 text-[10px] uppercase tracking-[0.2em] font-bold ${activeCategory === c ? 'text-white bg-[#111111]' : 'text-[#666666] hover:text-white hover:bg-[#111111]'}`}>{c}</button>
                 ))}
               </div>
             )}
          </div>
        </motion.div>
      </div>

      {/* Categories Marquee */}
      <div className="w-full border-y border-[#222222] py-6 my-12 bg-black/40 backdrop-blur-md flex overflow-hidden">
        <div className="flex min-w-full animate-marquee">
          <div className="flex whitespace-nowrap px-4 gap-12 text-[#555555]">
           {[...categories, ...categories, ...categories, ...categories].map((c, i) => (
             <div key={i} className="flex items-center gap-12 hover:text-[#E5E5E5] transition-colors cursor-pointer" onClick={() => setActiveCategory(c)}>
               <span className="text-[12px] uppercase tracking-[0.4em] font-bold select-none">{c}</span>
               <span className="w-1.5 h-1.5 rounded-full bg-[#333333]"></span>
             </div>
           ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-12 px-4 sm:px-6 lg:px-12">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full py-24 text-center border border-[#111111] rounded-[32px] bg-[#080808]">
             <p className="text-[#666666] text-sm uppercase tracking-[0.2em] font-bold">No objects found in this category.</p>
          </div>
        ) : (
          filteredProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
              className="group block"
            >
            <Link to={`/product/${product.id}`} className="block relative overflow-hidden rounded-[40px] bg-gradient-to-b from-[#111111] to-[#050505] border border-[#222222] shadow-2xl aspect-[4/5] mb-6 flex-shrink-0">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100 mix-blend-luminosity group-hover:mix-blend-normal hover:mix-blend-normal"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="absolute top-6 left-6">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#666666] font-bold block mb-2">
                  Object Ref / {product.id.padStart(4, '0')}
                </span>
                <div className="h-[1px] w-8 bg-[#222222]"></div>
              </div>
              
              <div className="absolute bottom-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <div className="w-14 h-14 bg-white text-black flex items-center justify-center rounded-full">
                   <ArrowUpRight className="w-6 h-6" />
                </div>
              </div>
            </Link>
            
            <div className="flex justify-between items-start gap-4 px-2">
              <div>
                <h3 className="font-light text-xl leading-tight group-hover:text-white text-[#CCCCCC] transition-colors mb-1">
                  <Link to={`/product/${product.id}`}>
                    {product.name}
                  </Link>
                </h3>
                <p className="text-[11px] uppercase tracking-widest text-[#666666]">{product.category}</p>
              </div>
              <p className="text-xl font-light">${product.price.toFixed(2)}</p>
            </div>
          </motion.div>
        ))
        )}
      </div>
    </AnimatedPage>
  );
}
