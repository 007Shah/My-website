import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { Navigation } from './Navigation';
import { ThemeSwitcher } from './ThemeSwitcher';

interface LayoutProps {
  children?: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-obsidian flex flex-col relative md:pl-[80px]">
      {/* Side Rail */}
      <aside className="fixed top-0 left-0 bottom-0 w-[80px] border-r border-gray-deep/50 hidden md:flex flex-col items-center justify-center gap-[15px] z-50 bg-obsidian/95 backdrop-blur-md">
        <div className="w-1 h-6 bg-theme rounded-full transition-colors duration-500 shadow-[0_0_10px_rgba(var(--theme-color-rgb),0.5)]"></div>
        {[...Array(10)].map((_, i) => (
          <div key={i} className="w-1.5 h-1.5 bg-white/10 rounded-full"></div>
        ))}
        <div className="rotate-180 text-[11px] font-medium tracking-[0.2em] text-white/40 mt-6" style={{ writingMode: 'vertical-rl' }}>
          Architecture x Flavor
        </div>
      </aside>

      <Navigation />
      
      <main className="flex-grow flex flex-col pt-[72px] md:pt-[104px]">
        {children}
      </main>

      <ThemeSwitcher />

      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/1234567890" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 w-[52px] h-[52px] bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-full flex items-center justify-center shadow-[0_8px_24px_rgba(37,211,102,0.4)] transition-all duration-300 hover:scale-105 active:scale-95 md:bottom-8 md:right-8"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle fill="currentColor" size={28} />
      </a>

      <footer className="bg-obsidian border-t border-gray-deep/50 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 max-w-7xl mx-auto">
          <div className="border-b md:border-b-0 md:border-r border-gray-deep/50 p-8 flex flex-col justify-between min-h-[140px]">
            <span className="text-[11px] font-semibold uppercase text-white/40 tracking-widest block mb-4">Brand</span>
            <div>
              <h3 className="text-[18px] font-extrabold text-theme mb-2 tracking-tight transition-colors duration-500">J Jamera</h3>
              <p className="text-[13px] text-white/50 leading-relaxed font-medium">The ultimate modern brand experience.</p>
            </div>
          </div>
          <div className="border-b md:border-b-0 md:border-r border-gray-deep/50 p-8 flex flex-col justify-between min-h-[140px]">
            <span className="text-[11px] font-semibold uppercase text-white/40 tracking-widest block mb-4">Products</span>
            <ul className="space-y-3 text-[14px] font-medium text-white/80">
              <li><Link to="/signatures" className="hover:text-theme transition-colors duration-300 flex items-center gap-2"><span className="text-theme opacity-0 transition-opacity hover:opacity-100">&rarr;</span>Signature Dishes</Link></li>
              <li><Link to="/menu" className="hover:text-theme transition-colors duration-300 flex items-center gap-2"><span className="text-theme opacity-0 transition-opacity hover:opacity-100">&rarr;</span>Full Menu</Link></li>
              <li><Link to="/deals" className="hover:text-theme transition-colors duration-300 flex items-center gap-2"><span className="text-theme opacity-0 transition-opacity hover:opacity-100">&rarr;</span>Deals & Offers</Link></li>
            </ul>
          </div>
          <div className="border-b md:border-b-0 md:border-r border-gray-deep/50 p-8 flex flex-col justify-between min-h-[140px]">
            <span className="text-[11px] font-semibold uppercase text-white/40 tracking-widest block mb-4">Locations</span>
            <ul className="space-y-3 text-[14px] font-medium text-white/80">
              <li><Link to="/locations" className="hover:text-theme transition-colors duration-300 flex items-center gap-2"><span className="text-theme opacity-0 transition-opacity hover:opacity-100">&rarr;</span>All Locations</Link></li>
            </ul>
          </div>
          <div className="p-8 flex flex-col justify-between min-h-[140px]">
            <span className="text-[11px] font-semibold uppercase text-white/40 tracking-widest block mb-4">Company</span>
            <ul className="space-y-3 text-[14px] font-medium text-white/80">
              <li><Link to="/story" className="hover:text-theme transition-colors duration-300 flex items-center gap-2"><span className="text-theme opacity-0 transition-opacity hover:opacity-100">&rarr;</span>Our Story</Link></li>
              <li><Link to="/blog" className="hover:text-theme transition-colors duration-300 flex items-center gap-2"><span className="text-theme opacity-0 transition-opacity hover:opacity-100">&rarr;</span>Blog</Link></li>
              <li><Link to="/contact" className="hover:text-theme transition-colors duration-300 flex items-center gap-2"><span className="text-theme opacity-0 transition-opacity hover:opacity-100">&rarr;</span>Contact</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
