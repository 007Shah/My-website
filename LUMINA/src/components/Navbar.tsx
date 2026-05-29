import React from 'react';
import { ShoppingBag, Menu, X, User as UserIcon, LogOut, ChevronDown, ListFilter } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const { totalItems, setIsCartOpen } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const location = useLocation();

  const getLinkClasses = (path: string) => {
    return location.pathname === path 
      ? "text-white border-b border-white pb-1"
      : "hover:text-white transition-colors border-b border-transparent pb-1";
  };

  return (
    <nav className="fixed top-0 inset-x-0 z-40 bg-black/60 backdrop-blur-xl border-b border-[#222222]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          <div className="flex-1 flex items-center justify-start gap-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-black rounded-sm rotate-45"></div>
            </div>
            <Link to="/" className="text-xl font-medium tracking-tighter uppercase text-white focus:outline-none">
              LUMINA.
            </Link>
          </div>

          <div className="hidden md:flex gap-10 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#888888]">
             <Link to="/" className={getLinkClasses('/')}>Collection</Link>
             <Link to="/studio" className={getLinkClasses('/studio')}>Studio</Link>
             <Link to="/archive" className={getLinkClasses('/archive')}>Archive</Link>
             <Link to="/about" className={getLinkClasses('/about')}>About</Link>
          </div>

          <div className="flex-1 flex items-center justify-end gap-6">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative text-[#888888] hover:text-white transition-colors outline-none"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5 transition-transform" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-white text-black text-[9px] flex items-center justify-center rounded-full font-bold">
                  {totalItems}
                </span>
              )}
            </button>
            
            <div className="hidden md:flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#666666] font-bold">{user?.name}</span>
                  <button onClick={logout} className="text-[#888888] hover:text-white transition-colors" title="Sign Out">
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <Link to="/auth" className="text-[#888888] hover:text-white transition-colors" title="Sign In">
                  <UserIcon className="w-4 h-4" />
                </Link>
              )}
            </div>

            <button 
              className="md:hidden p-2 text-[#888888] hover:text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-xl border-b border-[#222222] absolute top-20 inset-x-0">
          <div className="px-4 pt-4 pb-6 space-y-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#888888]">
             <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 hover:text-white">Collection</Link>
             <Link to="/studio" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 hover:text-white">Studio</Link>
             <Link to="/archive" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 hover:text-white">Archive</Link>
             <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 border-b border-[#222222] hover:text-white">About</Link>
             
             {isAuthenticated ? (
                <div className="px-3 pt-2">
                  <span className="block text-white mb-4">Hello, {user?.name}</span>
                  <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="flex items-center gap-2 hover:text-white">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
             ) : (
               <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 pt-2 hover:text-white text-white">
                 Sign In / Register
               </Link>
             )}
          </div>
        </div>
      )}
    </nav>
  );
}
