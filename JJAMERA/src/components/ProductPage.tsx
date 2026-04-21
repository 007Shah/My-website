import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { PageTransition } from '../components/PageTransition';
import { MagneticButton } from '../components/MagneticButton';
import { AnimatedText } from '../components/AnimatedText';

interface ProductPageProps {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  price: string;
  features?: string[];
  children?: React.ReactNode;
}

export function ProductPage({ title, subtitle, description, image, price, features = [], children }: ProductPageProps) {
  const [isOrdered, setIsOrdered] = useState(false);

  const handleOrder = () => {
    setIsOrdered(true);
    setTimeout(() => setIsOrdered(false), 3000);
  };

  return (
    <PageTransition className="flex-grow pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto relative mt-12">
        <AnimatePresence>
          {isOrdered && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -50 }}
              className="fixed bottom-10 right-10 bg-theme text-theme-content p-6 rounded-2xl shadow-2xl z-50 md:right-10 md:bottom-10 right-6 bottom-24 transition-colors duration-500"
            >
              <h4 className="font-extrabold tracking-tight text-[20px] mb-2">Added to Cart!</h4>
              <p className="text-[14px] font-medium opacity-80">{title} has been added.</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-20 items-center mb-32">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', damping: 15 }}
            className="order-2 lg:order-1 flex flex-col justify-center"
          >
            <div className="flex items-center gap-3 mb-6">
               <div className="w-8 h-[2px] bg-theme transition-colors duration-500 rounded-full"></div>
               <h2 className="text-theme transition-colors duration-500 font-bold uppercase tracking-[0.15em] text-[12px]">{subtitle}</h2>
            </div>
            
            <h1 className="text-[48px] md:text-[64px] font-extrabold mb-8 leading-[1.05] tracking-tight">{title}</h1>
            
            <AnimatedText 
              text={description}
              className="text-[16px] text-white/80 max-w-[500px] leading-[1.7] border-l-[3px] border-theme pl-5 mb-8 transition-colors duration-500 font-medium bg-white/5 py-3 rounded-r-xl"
            />

            {features && features.length > 0 && (
              <ul className="mb-12 space-y-3">
                {features.map((feature, idx) => (
                  <motion.li 
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * idx }}
                    className="flex items-start gap-3 text-white/80 text-[15px] font-medium"
                  >
                    <Check className="text-theme mt-1 shrink-0" size={18} />
                    <span>{feature}</span>
                  </motion.li>
                ))}
              </ul>
            )}
            
            <div className="flex items-center space-x-8 bg-gray-deep/20 p-6 rounded-2xl w-fit border border-gray-deep/50">
              <span className="text-[36px] font-black tracking-tight">{price}</span>
              <div onClick={handleOrder}>
                <MagneticButton className="shadow-lg">Order Now</MagneticButton>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="order-1 lg:order-2 relative aspect-[4/5] lg:aspect-square group rounded-[2rem] overflow-hidden shadow-2xl"
          >
            <div className="absolute inset-0 bg-theme/10 transition-colors duration-500 group-hover:bg-transparent z-10 pointer-events-none" />
            <img 
              src={image} 
              alt={title} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </motion.div>
        </div>

        {children && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="border-t border-gray-deep/50 pt-20"
          >
            {children}
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}
