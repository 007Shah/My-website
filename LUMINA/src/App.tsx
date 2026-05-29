import React from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import Store from './pages/Store';
import ProductDetails from './pages/ProductDetails';
import Checkout from './pages/Checkout';
import Auth from './pages/Auth';
import Studio from './pages/Studio';
import Archive from './pages/Archive';
import About from './pages/About';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#050505]">
      <div className="w-8 h-8 border-2 border-[#222222] border-t-white rounded-full animate-spin" />
    </div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      {/* @ts-ignore */}
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Store />} />
        <Route path="/studio" element={<Studio />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/about" element={<About />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/checkout" element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        } />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen flex flex-col font-sans font-light">
            <Navbar />
            <CartDrawer />
            <main className="flex-1 relative mt-20">
              <AnimatedRoutes />
            </main>
            <footer className="border-t border-[#222222] bg-[#0A0A0A]/50 backdrop-blur-md">
               <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-12 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] uppercase tracking-[0.2em] font-bold text-[#888888]">
                 <div className="flex flex-col items-center md:items-start gap-2">
                   <span className="text-[#E5E5E5] text-[12px] tracking-[0.4em]">LUMINA</span>
                   <span>© {new Date().getFullYear()} Studio. All Rights Reserved.</span>
                 </div>
                 <div className="flex gap-4 sm:gap-8 flex-wrap justify-center text-[#AAAAAA]">
                   <span className="hover:text-[#E5E5E5] transition-colors cursor-pointer">Terms</span>
                   <span className="hover:text-[#E5E5E5] transition-colors cursor-pointer">Privacy</span>
                   <span className="hover:text-[#E5E5E5] transition-colors cursor-pointer">Instagram</span>
                   <span className="hover:text-[#E5E5E5] transition-colors cursor-pointer">Contact</span>
                 </div>
                 <div className="flex items-center gap-2 mt-4 md:mt-0">
                   <span className="w-1.5 h-1.5 bg-[#CCCCCC] rounded-full shadow-[0_0_8px_rgba(204,204,204,0.6)]"></span>
                   <span className="text-[#CCCCCC]">All Systems Nominal</span>
                 </div>
               </div>
            </footer>
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
