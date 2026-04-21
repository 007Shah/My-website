import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { cn } from '../utils/cn';
import { useCart } from '../context/CartContext';

interface MenuCardProps {
  title: string;
  description: string;
  price: string;
  image: string;
  className?: string;
  delay?: number;
}

export function MenuCard({ title, description, price, image, className, delay = 0 }: MenuCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const { addToCart } = useCart();

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // In case it's wrapped in a Link
    const numericPrice = parseFloat(price.replace(/[^0-9.]/g, ''));
    addToCart({
      id: title.toLowerCase().replace(/\s+/g, '-'),
      name: title,
      price: isNaN(numericPrice) ? 0 : numericPrice,
      quantity: 1,
      image
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay }}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={cn(
        "relative w-full max-w-sm group cursor-pointer",
        className
      )}
    >
      <div 
        className="flex flex-col bg-obsidian rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-theme/10 transition-all duration-500 border border-gray-deep h-full"
        style={{ transform: "translateZ(0px)" }}
      >
        {/* Top Image Section */}
        <div className="relative h-64 overflow-hidden w-full bg-gray-deep">
          <motion.div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
            style={{ backgroundImage: `url(${image})` }}
          />
        </div>
        
        {/* Bottom Content Section */}
        <div 
          className="p-6 flex flex-col flex-grow relative bg-obsidian"
          style={{ transform: "translateZ(20px)" }}
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-[20px] font-bold text-white tracking-tight leading-tight group-hover:text-theme transition-colors duration-300">{title}</h3>
            <span className="text-[18px] font-bold text-white bg-white/5 px-2 py-1 rounded-md">{price}</span>
          </div>
          <p className="text-white/60 font-sans text-[14px] mb-6 line-clamp-2 leading-relaxed flex-grow">{description}</p>
          
          <button 
            onClick={handleAddToCart}
            className="w-full py-3 px-4 rounded-xl font-semibold text-[14px] transition-all duration-300 flex items-center justify-center gap-2 bg-theme text-theme-content opacity-90 group-hover:opacity-100 group-hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
          >
            <ShoppingBag size={16} />
            <span>Add to Order</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
