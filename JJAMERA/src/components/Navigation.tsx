import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight, ShoppingCart } from 'lucide-react';
import { cn } from '../utils/cn';
import { useCart } from '../context/CartContext';

const links = [
  { name: 'Home', path: '/' },
  { name: 'Signatures', path: '/signatures' },
  { name: 'Full Menu', path: '/menu' },
  { name: 'Locations', path: '/locations' },
  { name: 'Contact', path: '/contact' },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { totalItems, setIsCartOpen } = useCart();

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 bg-theme text-theme-content text-[12px] font-medium py-2 px-4 text-center md:pl-[80px]">
        <Link to="/menu" className="inline-flex items-center gap-1 hover:opacity-80 transition-opacity">
          <span>Free delivery on orders over $30!</span>
          <strong className="underline underline-offset-2 ml-1">Order Now</strong>
          <ChevronRight size={14} className="mt-[1px]"/>
        </Link>
      </div>

      <header className="fixed top-[32px] left-0 md:left-[80px] right-0 z-40 bg-obsidian/85 backdrop-blur-lg border-b border-gray-deep h-[72px] flex items-center justify-between px-6 md:px-10 transition-colors duration-500 shadow-sm">
        <Link to="/" className="text-[20px] font-extrabold tracking-tight text-white hover:text-theme transition-colors duration-500 flex items-center gap-2">
          <span className="text-theme">J</span> Jamera
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-[14px] font-medium transition-colors relative py-2",
                  isActive ? "text-theme" : "text-white/70 hover:text-white"
                )}
              >
                {link.name}
                {isActive && (
                  <motion.div
                    layoutId="active-nav-indicator"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-theme rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
          
          <div className="flex items-center space-x-6 ml-4 border-l border-gray-deep pl-6 h-[40px]">
            {/* Cart Button desktop */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative text-white/70 hover:text-theme transition-colors flex items-center pr-2"
            >
              <ShoppingCart size={20} />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-2 -right-1 bg-theme text-theme-content text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-lg"
                  >
                    {totalItems}
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
            <Link to="/login" className="text-[14px] font-medium text-white/70 hover:text-white transition-colors">Login</Link>
            <Link to="/signup" className="text-[14px] font-medium rounded-full text-theme-content bg-theme px-5 py-2 hover:opacity-90 hover:shadow-lg transition-all duration-300">Sign Up</Link>
          </div>
        </nav>

        <div className="md:hidden flex items-center gap-5 z-50">
          {/* Cart Button mobile */}
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative text-white hover:text-theme transition-colors mt-1"
            aria-label="Open Cart"
          >
            <ShoppingCart size={22} />
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-2 -right-2 bg-theme text-theme-content text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-lg"
                >
                  {totalItems}
                </motion.div>
              )}
            </AnimatePresence>
          </button>
          <button 
            className="text-white hover:text-theme transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-[72px] left-0 right-0 bg-obsidian/95 backdrop-blur-xl border-b border-gray-deep md:hidden shadow-2xl"
            >
              <div className="px-6 py-6 flex flex-col space-y-2">
                {links.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "text-[16px] font-medium transition-colors py-3 border-b border-gray-deep/50 flex items-center justify-between",
                        isActive ? "text-theme" : "text-white/80 hover:text-theme"
                      )}
                    >
                      {link.name}
                      {isActive && (
                        <motion.div
                          layoutId="active-nav-mobile"
                          className="w-2 h-2 rounded-full bg-theme"
                        />
                      )}
                    </Link>
                  );
                })}
                <div className="pt-6 flex flex-col space-y-4">
                  <Link to="/login" onClick={() => setIsOpen(false)} className="text-[15px] font-medium text-center text-white/80 hover:text-white transition-colors bg-white/5 py-3 rounded-xl">Log In</Link>
                  <Link to="/signup" onClick={() => setIsOpen(false)} className="text-[15px] font-medium text-center text-theme-content bg-theme rounded-xl py-3 shadow-md hover:opacity-90 transition-opacity">Sign Up Free</Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
