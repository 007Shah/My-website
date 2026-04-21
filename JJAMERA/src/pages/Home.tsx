import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ThreeScene } from '../components/ThreeScene';
import { AnimatedText } from '../components/AnimatedText';
import { MagneticButton } from '../components/MagneticButton';
import { MenuCard } from '../components/MenuCard';
import { PageTransition } from '../components/PageTransition';
import { ScrollCarousel } from '../components/ScrollCarousel';

const galleryImages = [
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1588168333986-5078d3ae3976?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
];

export default function Home() {
  return (
    <PageTransition className="flex-grow flex flex-col relative pt-[40px]">
      {/* 3D Hero Section */}
      <section className="relative min-h-[calc(100vh-80px)] flex items-center overflow-hidden">
        <ThreeScene />
        
        <div className="absolute top-[40px] left-[40px] font-mono text-[11px] font-semibold text-white/30 hidden md:block z-10">
          X: 512 | Y: 384 | 60FPS
        </div>
        <div className="absolute bottom-[40px] right-[40px] text-[10px] bg-theme/10 border border-theme/30 transition-colors duration-500 px-[10px] py-[4px] text-theme rounded-md font-semibold hidden md:block z-10 shadow-[0_0_15px_rgba(var(--theme-color-rgb),0.2)]">
          GPU: ACCELERATED RENDERING ACTIVE
        </div>

        <div className="max-w-7xl mx-auto px-6 w-full relative z-10 pointer-events-none mt-[-50px]">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', damping: 12, stiffness: 100, delay: 0.2 }}
            >
              <h1 className="text-[52px] md:text-[80px] leading-[1.05] font-extrabold tracking-tight mb-6 mix-blend-difference drop-shadow-xl text-white">
                Taste The <br />
                <span className="text-theme transition-colors duration-500 font-black drop-shadow-2xl">Revolution.</span>
              </h1>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: 'spring', damping: 12, stiffness: 100, delay: 0.4 }}
              className="mb-10"
            >
              <AnimatedText 
                text="Experience the ultimate deep-dish pizza and spicy injected broast. Crafted with premium ingredients for bold flavor."
                className="text-[16px] md:text-[18px] text-white/90 max-w-[480px] leading-[1.6] border-l-[3px] border-theme pl-5 transition-colors duration-500 font-medium bg-black/20 backdrop-blur-sm py-2 rounded-r-lg"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', damping: 12, stiffness: 100, delay: 0.6 }}
              className="pointer-events-auto flex flex-wrap items-center gap-4"
            >
              <Link to="/menu">
                <MagneticButton className="shadow-lg shadow-theme/20">Order Now</MagneticButton>
              </Link>
              <Link to="/locations" className="hidden sm:block">
                <MagneticButton variant="outline" className="bg-obsidian/50 backdrop-blur-md">Find a Location</MagneticButton>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Menu Section */}
      <section className="py-24 bg-obsidian relative z-10 border-t border-gray-deep/50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <h2 className="text-[36px] md:text-[52px] leading-[1] font-extrabold tracking-tight">Our <br/><span className="text-theme transition-colors duration-500 font-black">Signatures</span></h2>
            <Link to="/menu" className="mt-8 md:mt-0">
              <MagneticButton variant="outline">View Full Menu</MagneticButton>
            </Link>
          </div>
        </div>
        
        <div className="pt-8">
            <ScrollCarousel className="max-w-7xl mx-auto pb-10">
              <div className="block w-full px-2">
                <MenuCard 
                  title="Classic Chicago Deep Dish"
                  description="Thick crust, overflowing with premium cheese and our signature spicy pepperoni."
                  price="$24.99"
                  image="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  delay={0}
                />
              </div>
              <div className="block w-full px-2">
                <MenuCard 
                  title="Signature Injected Broast"
                  description="Injected with our secret spicy marinade, crispy on the outside, juicy inside."
                  price="$18.99"
                  image="https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  delay={0}
                />
              </div>
              <div className="block w-full px-2">
                <MenuCard 
                  title="Double Smashed Wagyu"
                  description="Double smashed premium wagyu, slow-caramelized onions, truffle sauce."
                  price="$18.99"
                  image="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  delay={0}
                />
              </div>
              <div className="block w-full px-2">
                <MenuCard 
                  title="Truffle Mushroom"
                  description="A rich white sauce base topped with fresh mushrooms and truffle oil."
                  price="$26.99"
                  image="https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  delay={0}
                />
              </div>
            </ScrollCarousel>
        </div>
      </section>

      {/* Vibe / Aesthetic Carousel Section */}
      <section className="py-24 bg-gray-deep/10 border-t border-gray-deep/50 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-[36px] md:text-[52px] leading-[1] font-extrabold tracking-tight mb-4">
              The <span className="text-theme transition-colors duration-500 font-black">Experience</span>
            </h2>
            <p className="text-white/70 text-[16px] max-w-lg leading-[1.7] font-medium">
              We built an environment that reflects the intensity of our flavors. Step into a world where modern design and legendary taste collide.
            </p>
          </motion.div>
        </div>

        {/* Auto Scrolling Marquee */}
        <div className="relative w-full flex overflow-hidden py-10">
          <motion.div
            className="flex gap-6 px-3 w-fit"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ ease: "linear", duration: 45, repeat: Infinity }}
          >
            {[...galleryImages, ...galleryImages].map((img, idx) => (
              <div key={idx} className="relative w-[300px] sm:w-[420px] aspect-[4/5] sm:aspect-[4/3] flex-shrink-0 group overflow-hidden rounded-[2rem] shadow-xl border border-gray-deep/50">
                <div className="absolute inset-0 bg-theme/10 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <img 
                  src={img} 
                  alt={`Aesthetic ${idx}`} 
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" 
                />
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-obsidian border-t border-gray-deep/50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-[36px] md:text-[52px] leading-[1] font-extrabold tracking-tight mb-4">
              Real <span className="text-theme transition-colors duration-500 font-black">Love</span>
            </h2>
            <p className="text-white/60 text-[16px] font-medium">Because our flavor speaks for itself.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                text: "The spicy injected broast is literally life-changing. Never had anything with this much flavor packed into every single bite.",
                name: "Ali Raza",
                role: "Local Foodie"
              },
              {
                text: "I've tried deep dish everywhere, but J Jamera's crust is exactly what I've been looking for. Perfectly balanced, ridiculously heavy.",
                name: "Sara Ahmed",
                role: "Pizza Connoisseur"
              },
              {
                text: "The vibes are immaculate, but the double smashed beef burger? Out of this world. Top tier spot.",
                name: "Uzair Khan",
                role: "Designer"
              }
            ].map((review, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="border border-gray-deep/50 p-8 rounded-[2rem] hover:border-theme/50 hover:shadow-2xl hover:shadow-theme/10 transition-all duration-500 bg-gray-deep/20 group relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-theme to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, star) => (
                    <svg key={star} className="w-5 h-5 text-theme transition-colors duration-500 drop-shadow-sm" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-[15px] leading-[1.7] mb-8 text-white/80 group-hover:text-white transition-colors duration-300 font-medium italic">
                  "{review.text}"
                </p>
                <div className="mt-auto flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-theme border-[2px] border-obsidian flex items-center justify-center text-theme-content font-bold text-[16px] shadow-lg">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-[15px] text-white group-hover:text-theme transition-colors duration-500">{review.name}</h4>
                    <span className="text-[13px] text-white/60 font-medium">{review.role}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
