import React, { useRef, useState, useEffect } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

interface ScrollCarouselProps {
  children: React.ReactNode;
  className?: string;
  itemClassName?: string;
}

export function ScrollCarousel({ children, className, itemClassName }: ScrollCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const controls = useAnimation();
  const isInView = useInView(carouselRef, { once: true, margin: "-100px" });

  useEffect(() => {
    const calculateWidth = () => {
      if (carouselRef.current) {
        setWidth(Math.max(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth, 0));
      }
    };
    
    // Give time for children elements (like images or fonts) to layout
    setTimeout(calculateWidth, 150);
    window.addEventListener("resize", calculateWidth);
    return () => window.removeEventListener("resize", calculateWidth);
  }, [children]);

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 50, scale: 0.9 },
    visible: { 
      opacity: 1, 
      x: 0, 
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 200,
        damping: 20,
      }
    }
  };

  return (
    <motion.div 
      ref={carouselRef} 
      className={`cursor-grab active:cursor-grabbing overflow-hidden ${className || ''}`}
      whileTap={{ cursor: "grabbing" }}
      variants={containerVariants}
      initial="hidden"
      animate={controls}
    >
      <motion.div 
        drag="x" 
        dragConstraints={{ right: 0, left: -width }} 
        dragElastic={0.15}
        dragTransition={{ bounceStiffness: 400, bounceDamping: 20 }}
        className="flex gap-8 px-6 pb-12 w-max"
      >
        {React.Children.map(children, (child) => (
          <motion.div 
            variants={itemVariants}
            className={`min-w-[300px] md:min-w-[420px] ${itemClassName || ''}`}
          >
            {child}
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
