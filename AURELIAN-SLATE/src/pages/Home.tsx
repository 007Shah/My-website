import React from 'react';
import ReservationBar from '../components/ReservationBar';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center w-full">
      {/* Advanced Hero Section */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center px-6 lg:px-20 py-20 overflow-hidden">
        {/* Background Visual Portal (Behind Text) */}
        <div className="absolute inset-0 z-0 flex items-center justify-center lg:justify-end pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.3, scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="relative w-full h-full lg:w-[60%] lg:h-[80%] rounded-none lg:rounded-[10rem] overflow-hidden"
          >
            <img 
              src="https://picsum.photos/seed/luxury-restaurant-hero-interior/1000/1500" 
              alt="Aurelian Slate Interior" 
              className="w-full h-full object-cover grayscale"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent" />
          </motion.div>
        </div>

        {/* Background Accents */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
          <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-gold/5 blur-[150px] rounded-full" />
          <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-gold/5 blur-[150px] rounded-full" />
        </div>

        {/* Content: Typography & Branding */}
        <div className="relative z-10 w-full max-w-7xl flex flex-col items-center lg:items-start text-center lg:text-left space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex items-center space-x-4"
          >
            <div className="h-[1px] w-12 bg-gold" />
            <span className="text-gold text-xs uppercase tracking-[0.8em] font-medium">Est. 2026</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="relative"
          >
            <h1 className="text-7xl md:text-[10rem] lg:text-[12rem] font-display font-light leading-[0.85] tracking-tighter text-white/90">
              AURELIAN
            </h1>
            <motion.span 
              initial={{ opacity: 0, scale: 0.8, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
              className="absolute -bottom-4 right-0 lg:-right-20 text-6xl md:text-8xl lg:text-9xl font-sans font-black gold-gradient italic tracking-tight drop-shadow-[0_10px_30px_rgba(212,175,55,0.3)]"
            >
              SLATE
            </motion.span>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-white/60 max-w-md text-lg md:text-xl leading-relaxed font-light pt-8"
          >
            An avant-garde sanctuary where the primal depth of obsidian meets the celestial brilliance of gold. A journey beyond the palate.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="pt-8 flex flex-col sm:flex-row items-center space-y-6 sm:space-y-0 sm:space-x-8"
          >
            <Link to="/reservations" className="px-10 py-4 glass-gold text-gold text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-gold hover:text-black transition-all rounded-full shadow-2xl shadow-gold/20">
              Reserve a Table
            </Link>
            <Link to="/menu" className="text-[10px] uppercase tracking-[0.4em] text-white/50 hover:text-gold transition-colors">
              Explore Menu →
            </Link>
          </motion.div>
        </div>

        {/* Vertical Rail Text */}
        <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center space-y-8 opacity-20 z-10">
          <span className="writing-vertical text-[10px] uppercase tracking-[1em] text-white">Obsidian & Gold</span>
          <div className="h-24 w-[1px] bg-white" />
        </div>
      </section>

      {/* Carousel 1: Culinary Highlights */}
      <div className="w-full py-20 space-y-12 bg-black/20 backdrop-blur-sm border-y border-white/5 reveal">
        <div className="text-center space-y-2">
          <h2 className="text-gold text-[10px] uppercase tracking-[1em]">Culinary Highlights</h2>
        </div>
        
        <div className="w-full overflow-hidden relative">
          <div className="flex space-x-8 animate-scroll whitespace-nowrap px-6">
            {[
              { name: "Obsidian Risotto", img: "https://picsum.photos/seed/gourmet-risotto-plating/400/500" },
              { name: "Gold Wagyu", img: "https://picsum.photos/seed/wagyu-beef-gold-leaf/400/500" },
              { name: "Charcoal Lobster", img: "https://picsum.photos/seed/lobster-dish-luxury/400/500" },
              { name: "Slate Scallops", img: "https://picsum.photos/seed/scallops-plating-art/400/500" },
              { name: "Liquid Gold Soup", img: "https://picsum.photos/seed/gourmet-soup-luxury/400/500" },
              { name: "Obsidian Sphere", img: "https://picsum.photos/seed/luxury-chocolate-dessert/400/500" },
              { name: "Obsidian Risotto", img: "https://picsum.photos/seed/gourmet-risotto-plating/400/500" },
              { name: "Gold Wagyu", img: "https://picsum.photos/seed/wagyu-beef-gold-leaf/400/500" },
              { name: "Charcoal Lobster", img: "https://picsum.photos/seed/lobster-dish-luxury/400/500" },
              { name: "Slate Scallops", img: "https://picsum.photos/seed/scallops-plating-art/400/500" },
              { name: "Liquid Gold Soup", img: "https://picsum.photos/seed/gourmet-soup-luxury/400/500" },
              { name: "Obsidian Sphere", img: "https://picsum.photos/seed/luxury-chocolate-dessert/400/500" },
            ].map((dish, i) => (
              <div key={i} className="inline-block w-48 h-64 rounded-2xl overflow-hidden glass border border-white/10 relative group shrink-0">
                <img 
                  src={dish.img} 
                  alt={dish.name} 
                  className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-80 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <p className="text-gold font-display text-[9px] uppercase tracking-widest">{dish.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="reveal w-full max-w-4xl px-6 -mt-10 relative z-20">
        <div className="glass-gold p-2 rounded-full">
          <ReservationBar />
        </div>
      </div>

      {/* Carousel 2: Interior & Ambiance */}
      <div className="w-full py-32 space-y-16 reveal">
        <div className="text-center space-y-4">
          <h2 className="text-gold text-[10px] uppercase tracking-[1em]">The Sanctuary</h2>
          <h3 className="text-4xl font-display text-white uppercase tracking-widest">Atmospheric Design</h3>
        </div>
        
        <div className="w-full overflow-hidden relative">
          <div className="flex space-x-12 animate-scroll-reverse whitespace-nowrap px-6">
            {[
              { name: "The Vault", img: "https://picsum.photos/seed/luxury-dining-room-obsidian-interior/800/600" },
              { name: "Gold Bar", img: "https://picsum.photos/seed/luxury-bar-stools-gold/800/600" },
              { name: "The Hearth", img: "https://picsum.photos/seed/modern-restaurant-kitchen-chef/800/600" },
              { name: "Obsidian Lounge", img: "https://picsum.photos/seed/luxury-restaurant-furniture-gold-velvet/800/600" },
              { name: "Wine Cellar", img: "https://picsum.photos/seed/wine-cellar-interior-luxury-vault/800/600" },
              { name: "The Vault", img: "https://picsum.photos/seed/luxury-dining-room-obsidian-interior/800/600" },
              { name: "Gold Bar", img: "https://picsum.photos/seed/luxury-bar-stools-gold/800/600" },
              { name: "The Hearth", img: "https://picsum.photos/seed/modern-restaurant-kitchen-chef/800/600" },
              { name: "Obsidian Lounge", img: "https://picsum.photos/seed/luxury-restaurant-furniture-gold-velvet/800/600" },
              { name: "Wine Cellar", img: "https://picsum.photos/seed/wine-cellar-interior-luxury-vault/800/600" },
            ].map((item, i) => (
              <div key={i} className="inline-block w-[400px] h-[300px] rounded-[3rem] overflow-hidden glass border border-white/5 relative group shrink-0">
                <img 
                  src={item.img} 
                  alt={item.name} 
                  className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-60 transition-all duration-1000"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8">
                  <p className="text-gold font-display text-sm uppercase tracking-[0.4em]">{item.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Carousel 3: Rare Ingredients */}
      <div className="w-full py-32 space-y-16 bg-gold/[0.02] border-y border-white/5 reveal">
        <div className="text-center space-y-4">
          <h2 className="text-gold text-[10px] uppercase tracking-[1em]">The Essence</h2>
          <h3 className="text-4xl font-display text-white uppercase tracking-widest">Rare Ingredients</h3>
        </div>
        
        <div className="w-full overflow-hidden relative">
          <div className="flex space-x-8 animate-scroll whitespace-nowrap px-6">
            {[
              { name: "White Truffle", img: "https://picsum.photos/seed/gourmet-ingredient-purity/400/400" },
              { name: "24K Gold Leaf", img: "https://picsum.photos/seed/gold-leaf-macarons-display-luxury/400/400" },
              { name: "A5 Wagyu", img: "https://picsum.photos/seed/wagyu-beef-marbling-detail/400/400" },
              { name: "Beluga Caviar", img: "https://picsum.photos/seed/caviar-luxury-presentation/400/400" },
              { name: "Saffron Silk", img: "https://picsum.photos/seed/saffron-infused-luxury-dish/400/400" },
              { name: "White Truffle", img: "https://picsum.photos/seed/gourmet-ingredient-purity/400/400" },
              { name: "24K Gold Leaf", img: "https://picsum.photos/seed/gold-leaf-macarons-display-luxury/400/400" },
              { name: "A5 Wagyu", img: "https://picsum.photos/seed/wagyu-beef-marbling-detail/400/400" },
              { name: "Beluga Caviar", img: "https://picsum.photos/seed/caviar-luxury-presentation/400/400" },
              { name: "Saffron Silk", img: "https://picsum.photos/seed/saffron-infused-luxury-dish/400/400" },
            ].map((item, i) => (
              <div key={i} className="inline-block w-48 h-48 rounded-full overflow-hidden glass border border-gold/20 relative group shrink-0">
                <img 
                  src={item.img} 
                  alt={item.name} 
                  className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-500" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-white text-[9px] uppercase tracking-[0.3em] font-bold opacity-0 group-hover:opacity-100 transition-opacity">{item.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full mt-32 px-6 reveal">
        {[
          { title: "The Vault", desc: "Private dining in a sound-proof obsidian chamber.", img: "https://picsum.photos/seed/luxury-dining-room-obsidian-interior/800/1000" },
          { title: "Liquid Gold", desc: "Our signature cocktail bar featuring rare distillates.", img: "https://picsum.photos/seed/luxury-bar-stools-gold/800/1000" },
          { title: "The Hearth", desc: "Open-fire cooking with ancient techniques.", img: "https://picsum.photos/seed/modern-restaurant-kitchen-chef/800/1000" }
        ].map((item, i) => (
          <div key={i} className="group relative overflow-hidden rounded-[2.5rem] aspect-[3/4] border border-white/10 glass floating" style={{ animationDelay: `${i * 0.5}s` }}>
            <img 
              src={item.img} 
              alt={item.title} 
              className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-60 group-hover:scale-110 transition-all duration-1000 ease-out"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-12 text-left">
              <h3 className="text-2xl font-display text-gold mb-3 uppercase tracking-widest">{item.title}</h3>
              <div className="h-[1px] w-8 bg-gold/50 mb-4 group-hover:w-16 transition-all duration-500" />
              <p className="text-white/40 text-xs leading-relaxed uppercase tracking-widest">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chef's Special Highlight */}
      <div className="w-full py-40 px-6 reveal">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center glass p-12 rounded-[4rem] border border-white/5">
          <div className="relative group overflow-hidden rounded-[3rem]">
            <div className="absolute -inset-4 bg-gold/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <img 
              src="https://picsum.photos/seed/luxury-restaurant-table-furniture/1000/1200" 
              alt="Chef's Special" 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="text-left space-y-10">
            <div className="space-y-4">
              <h2 className="text-gold text-sm uppercase tracking-[0.8em]">Seasonal Masterpiece</h2>
              <h3 className="text-6xl font-display font-bold leading-tight">THE <span className="gold-gradient">AURELIAN</span> <br /> TRUFFLE SYMPHONY</h3>
            </div>
            <p className="text-white/40 text-lg leading-relaxed font-light">
              A meticulously crafted journey through the forests of Piedmont. <br />
              Featuring hand-foraged white truffles, 24-month aged parmesan silk, and a whisper of edible gold.
            </p>
            <div className="pt-6">
              <Link to="/menu" className="inline-block px-12 py-5 border border-gold text-gold uppercase tracking-[0.4em] text-[10px] font-bold hover:bg-gold hover:text-black transition-all duration-500 rounded-full">
                View Seasonal Menu
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="w-full py-32 border-y border-white/5 reveal bg-white/[0.02] backdrop-blur-3xl">
        <div className="max-w-5xl mx-auto space-y-16 px-6">
          <h2 className="text-white/20 text-[10px] uppercase tracking-[1em]">Guest Perspectives</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
            {[
              { quote: "An otherworldly experience. The attention to detail in the obsidian chamber is unparalleled.", author: "Elena Vance", role: "Vogue Living" },
              { quote: "Aurelian Slate isn't just a restaurant; it's a sensory manifestation of luxury.", author: "Marcus Thorne", role: "Culinary Critic" }
            ].map((t, i) => (
              <div key={i} className="space-y-8 text-left border-l border-gold/20 pl-10">
                <p className="text-3xl font-display italic text-white/70 leading-relaxed font-light">"{t.quote}"</p>
                <div>
                  <h4 className="text-gold uppercase tracking-[0.3em] text-sm font-bold">{t.author}</h4>
                  <p className="text-white/20 text-[10px] uppercase tracking-[0.4em] mt-2">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Join the Circle CTA */}
      <div className="w-full py-40 px-6 reveal">
        <div className="glass-gold rounded-[5rem] p-24 text-center space-y-12 relative overflow-hidden group border border-gold/10">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gold/5 blur-[150px] -mr-[400px] -mt-[400px] group-hover:bg-gold/10 transition-colors duration-1000" />
          <div className="space-y-6 relative z-10">
            <h2 className="text-7xl md:text-8xl font-display font-bold gold-gradient tracking-tight">JOIN THE CIRCLE</h2>
            <p className="text-white/40 max-w-xl mx-auto uppercase tracking-[0.3em] text-xs leading-loose">
              Unlock priority access to seasonal menus, private cellar tastings, and exclusive culinary events.
            </p>
          </div>
          <div className="relative z-10">
            <Link to="/signup" className="inline-block bg-gold text-black font-bold px-16 py-6 rounded-full uppercase tracking-[0.4em] text-xs hover:bg-white transition-all duration-500 shadow-2xl shadow-gold/20 hover:scale-105">
              Become a Member
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
