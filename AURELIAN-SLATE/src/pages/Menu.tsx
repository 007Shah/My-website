import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';

interface MenuItem {
  id: number;
  name: string;
  price: string;
  desc: string;
  img: string;
  category: string;
  isSignature?: boolean;
  isDeal?: boolean;
}

const menuData: MenuItem[] = [
  // Starters
  { id: 1, name: "Slate Scallops", price: "$32", desc: "Pan-seared scallops, cauliflower silk, black garlic.", img: "https://picsum.photos/seed/gourmet-scallops-plating/600/800", category: "Starters" },
  { id: 2, name: "Liquid Gold Soup", price: "$28", desc: "Saffron-infused consommé, gold-wrapped dumplings.", img: "https://picsum.photos/seed/saffron-soup-luxury/600/800", category: "Starters" },
  { id: 3, name: "Charcoal Beetroot", price: "$24", desc: "Salt-baked beets, goat cheese snow, balsamic pearls.", img: "https://picsum.photos/seed/beetroot-salad-gourmet/600/800", category: "Starters" },
  { id: 4, name: "Truffle Arancini", price: "$26", desc: "Wild mushroom risotto balls, truffle aioli, gold dust.", img: "https://picsum.photos/seed/truffle-arancini-plating/600/800", category: "Starters" },
  
  // Signature Dishes
  { id: 5, name: "Obsidian Risotto", price: "$48", desc: "Truffle-infused black rice, edible gold leaf, wild mushrooms.", img: "https://picsum.photos/seed/black-risotto-gold-leaf/600/800", category: "Mains", isSignature: true },
  { id: 6, name: "Gold Wagyu", price: "$120", desc: "A5 Wagyu, smoked charcoal salt, gold-dusted asparagus.", img: "https://picsum.photos/seed/wagyu-beef-luxury-plating/600/800", category: "Mains", isSignature: true },
  { id: 7, name: "Charcoal Lobster", price: "$85", desc: "Butter-poached lobster tail, charcoal-infused bisque.", img: "https://picsum.photos/seed/lobster-dish-gourmet/600/800", category: "Mains", isSignature: true },
  
  // Mains
  { id: 8, name: "Blackened Sea Bass", price: "$52", desc: "Squid ink crust, lemon verbena foam, samphire.", img: "https://picsum.photos/seed/seabass-plating-luxury/600/800", category: "Mains" },
  { id: 9, name: "Venison Loin", price: "$58", desc: "Cocoa-rubbed venison, blackberry reduction, parsnip puree.", img: "https://picsum.photos/seed/venison-dish-gourmet/600/800", category: "Mains" },
  { id: 10, name: "Gold Leaf Pasta", price: "$42", desc: "Hand-rolled tagliatelle, 24k gold flakes, sage butter.", img: "https://picsum.photos/seed/gold-leaf-pasta-plating/600/800", category: "Mains" },
  
  // Desserts
  { id: 11, name: "Obsidian Sphere", price: "$24", desc: "Dark chocolate shell, gold leaf, raspberry core.", img: "https://picsum.photos/seed/chocolate-sphere-dessert/600/800", category: "Desserts" },
  { id: 12, name: "Gold Soufflé", price: "$26", desc: "Grand Marnier soufflé, gold-dusted vanilla bean ice cream.", img: "https://picsum.photos/seed/souffle-dessert-luxury/600/800", category: "Desserts" },
  { id: 13, name: "Slate Panna Cotta", price: "$22", desc: "Charcoal-infused cream, honey honeycomb, gold pearls.", img: "https://picsum.photos/seed/pannacotta-dessert-gourmet/600/800", category: "Desserts" },

  // Deals
  { id: 14, name: "The Aurelian Tasting", price: "$180", desc: "7-course signature journey with curated wine pairing.", img: "https://picsum.photos/seed/tasting-menu-luxury/600/800", category: "Deals", isDeal: true },
  { id: 15, name: "Sunset Soirée", price: "$95", desc: "3-course early dinner with a signature gold cocktail.", img: "https://picsum.photos/seed/luxury-dinner-cocktail/600/800", category: "Deals", isDeal: true },
];

const FloatingPortal: React.FC<{ img: string; x: number; y: number }> = ({ img, x, y }) => {
  return createPortal(
    <motion.div 
      initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      exit={{ opacity: 0, scale: 0.8, rotate: 5 }}
      className="fixed pointer-events-none z-[100] w-72 h-96 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(212,175,55,0.3)] border-2 border-gold/50"
      style={{ 
        left: x + 40,
        top: y - 200,
      }}
    >
      <img src={img} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
    </motion.div>,
    document.body
  );
};

const Menu: React.FC = () => {
  const [hoveredItem, setHoveredItem] = useState<MenuItem | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const categories = ["Starters", "Mains", "Desserts"];
  const signatureDishes = menuData.filter(item => item.isSignature);
  const deals = menuData.filter(item => item.isDeal);

  return (
    <div className="py-20 space-y-40 px-6" onMouseMove={handleMouseMove}>
      <div className="text-center space-y-6 relative">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-gold/5 blur-[100px] rounded-full pointer-events-none" />
        <h2 className="text-gold text-sm uppercase tracking-[0.8em] reveal">The Culinary Collection</h2>
        <h1 className="text-7xl font-display font-bold reveal tracking-tight">THE <span className="gold-gradient">SLATE</span></h1>
        <div className="h-[1px] w-12 bg-gold/30 mx-auto" />
      </div>

      {/* Signature Dishes Section */}
      <div className="space-y-20 reveal">
        <div className="flex items-center space-x-8">
          <h3 className="text-4xl font-display text-gold uppercase tracking-[0.2em]">Signature Masterpieces</h3>
          <div className="h-[1px] flex-1 bg-gold/10" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {signatureDishes.map((item, i) => (
            <div 
              key={item.id}
              className="group relative overflow-hidden rounded-[3rem] glass-gold p-10 hover:bg-gold/10 transition-all duration-700 cursor-pointer floating"
              style={{ animationDelay: `${i * 0.3}s` }}
              onMouseEnter={() => setHoveredItem(item)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className="absolute top-6 right-6 bg-gold text-black text-[9px] font-bold px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg">Signature</div>
              <div className="space-y-6">
                <h4 className="text-3xl font-display group-hover:text-gold transition-colors leading-tight">{item.name}</h4>
                <p className="text-white/40 text-sm leading-relaxed font-light">{item.desc}</p>
                <div className="pt-6 flex justify-between items-center border-t border-white/5">
                  <span className="text-gold font-display text-3xl">{item.price}</span>
                  <button className="text-[9px] uppercase tracking-[0.3em] text-white/30 group-hover:text-gold transition-all group-hover:translate-x-2">View Details →</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Standard Categories */}
      <div className="grid grid-cols-1 gap-32">
        {categories.map((cat) => (
          <div key={cat} className="space-y-16 reveal">
            <div className="flex items-center space-x-6">
              <h3 className="text-2xl font-display text-gold uppercase tracking-[0.4em]">{cat}</h3>
              <div className="h-[1px] flex-1 bg-white/5" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-32 gap-y-16">
              {menuData.filter(item => item.category === cat && !item.isSignature).map((item) => (
                <div 
                  key={item.id}
                  className="group flex justify-between items-start cursor-pointer py-6 border-b border-white/5 hover:border-gold/30 transition-all duration-500 relative"
                  onMouseEnter={() => setHoveredItem(item)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div className="space-y-3">
                    <h4 className="text-2xl font-display group-hover:text-gold transition-colors tracking-wide">{item.name}</h4>
                    <p className="text-white/30 text-sm max-w-md font-light leading-relaxed">{item.desc}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span className="text-gold font-display text-xl">{item.price}</span>
                    <div className="w-0 h-[1px] bg-gold group-hover:w-full transition-all duration-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Exclusive Deals Section */}
      <div className="space-y-20 reveal pb-20">
        <div className="flex items-center space-x-8">
          <div className="h-[1px] flex-1 bg-gold/10" />
          <h3 className="text-4xl font-display text-gold uppercase tracking-[0.2em]">Exclusive Experiences</h3>
          <div className="h-[1px] flex-1 bg-gold/10" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {deals.map((item) => (
            <div 
              key={item.id}
              className="group flex flex-col lg:flex-row items-center glass rounded-[4rem] border border-white/5 overflow-hidden hover:border-gold/30 transition-all duration-1000 cursor-pointer shadow-2xl"
              onMouseEnter={() => setHoveredItem(item)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className="w-full lg:w-2/5 h-80 lg:h-full overflow-hidden">
                <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" referrerPolicy="no-referrer" />
              </div>
              <div className="p-12 space-y-6 flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="text-3xl font-display text-gold leading-tight">{item.name}</h4>
                  <span className="bg-gold/10 text-gold text-[9px] px-4 py-1.5 rounded-full uppercase tracking-[0.2em] border border-gold/20">Limited Offer</span>
                </div>
                <p className="text-white/30 text-sm leading-relaxed font-light">{item.desc}</p>
                <div className="pt-8 flex items-center justify-between border-t border-white/5">
                  <span className="text-white font-display text-4xl">{item.price}</span>
                  <button className="px-8 py-3 glass-gold text-gold text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-gold hover:text-black transition-all rounded-full">Book Experience</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {hoveredItem && (
          <FloatingPortal img={hoveredItem.img} x={mousePos.x} y={mousePos.y} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Menu;
