import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Philosophy', path: '/philosophy' },
    { name: 'Menu', path: '/menu' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'FAQs', path: '/faqs' },
    { name: 'Contact', path: '/contact' },
    { name: 'Reservations', path: '/reservations' },
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 w-full z-50 transition-all duration-500 px-6 py-4",
      scrolled ? "bg-obsidian/40 backdrop-blur-2xl border-b border-white/5" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-display font-bold gold-gradient tracking-widest hover:scale-105 transition-transform">
          AURELIAN SLATE
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex space-x-6 items-center bg-white/5 backdrop-blur-md px-8 py-3 rounded-full border border-white/10">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "text-[10px] uppercase tracking-[0.2em] hover:text-gold transition-all duration-300 relative group",
                location.pathname === link.path ? "text-gold" : "text-white/70"
              )}
            >
              {link.name}
              <span className={cn(
                "absolute -bottom-1 left-0 w-0 h-[1px] bg-gold transition-all duration-300 group-hover:w-full",
                location.pathname === link.path && "w-full"
              )} />
            </Link>
          ))}
          <div className="w-[1px] h-4 bg-white/10 mx-2" />
          <Link 
            to="/login" 
            className="px-5 py-2 border border-gold/30 text-gold text-[10px] uppercase tracking-widest hover:bg-gold hover:text-black transition-all rounded-full"
          >
            Member Login
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="lg:hidden text-white p-2 glass rounded-full"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "fixed inset-0 bg-obsidian/95 backdrop-blur-3xl z-40 flex flex-col items-center justify-center space-y-8 transition-all duration-700 lg:hidden",
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}>
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            onClick={() => setIsOpen(false)}
            className="text-2xl font-display uppercase tracking-[0.3em] hover:text-gold transition-all"
          >
            {link.name}
          </Link>
        ))}
        <Link 
          to="/login" 
          onClick={() => setIsOpen(false)}
          className="px-10 py-4 border border-gold text-gold text-sm uppercase tracking-widest hover:bg-gold hover:text-black transition-all rounded-full"
        >
          Member Login
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
