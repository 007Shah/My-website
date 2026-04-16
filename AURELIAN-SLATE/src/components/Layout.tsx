import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { animate as anime, stagger } from 'animejs';
import Navbar from './Navbar';
import ThreeBackground from './ThreeBackground';
import CustomCursor from './CustomCursor';
import Chatbot from './Chatbot';
import WhatsAppButton from './WhatsAppButton';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const curtainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Page transition animation
    if (curtainRef.current) {
      anime(curtainRef.current, {
        translateY: ['100%', '0%'],
        duration: 600,
        easing: 'easeInOutExpo',
        complete: () => {
          anime(curtainRef.current, {
            translateY: ['0%', '-100%'],
            duration: 600,
            easing: 'easeInOutExpo',
            delay: 200
          });
        }
      });
    }

    // Staggered reveal for page content
    anime('.reveal', {
      opacity: [0, 1],
      translateY: [20, 0],
      delay: stagger(100, { start: 800 }),
      duration: 1000,
      easing: 'easeOutExpo'
    });
  }, [location.pathname]);

  return (
    <div className="min-h-screen relative">
      <div ref={curtainRef} className="page-transition-curtain" />
      <ThreeBackground />
      <CustomCursor />
      <Navbar />
      
      <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
        {children}
      </main>

      <Chatbot />
      <WhatsAppButton />

      <footer className="py-12 border-t border-white/5 text-center text-white/30 text-xs uppercase tracking-widest">
        &copy; 2026 Aurelian Slate. All Rights Reserved.
      </footer>
    </div>
  );
};

export default Layout;
