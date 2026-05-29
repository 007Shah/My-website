import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, cart, updateQuantity, removeFromCart, totalPrice } = useCart();
  const navigate = useNavigate();

  // Close drawer on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsCartOpen(false);
    };
    if (isCartOpen) window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isCartOpen, setIsCartOpen]);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 cursor-pointer"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-[#050505] border-l border-[#222222] z-50 shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-[#222222]">
              <h2 className="text-[11px] uppercase tracking-[0.3em] font-bold text-white flex items-center gap-2">
                Your Cart
              </h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-[#888888] hover:text-white rounded-full hover:bg-[#111111] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#111111] flex items-center justify-center text-[#666666]">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <p className="text-[#888888] text-sm">Your shopping cart is empty.</p>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="text-[11px] uppercase tracking-[0.2em] font-bold hover:text-white transition-colors mt-2"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    key={item.id} 
                    className="flex gap-4 group"
                  >
                    <div className="h-24 w-24 rounded-2xl bg-[#111111] overflow-hidden flex-shrink-0 relative border border-[#222222]">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover mix-blend-luminosity hover:mix-blend-normal opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="text-sm font-light text-[#CCCCCC] group-hover:text-white line-clamp-2">{item.name}</h3>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-[#666666] hover:text-white opacity-0 group-hover:opacity-100 transition-opacity p-1 -mt-1 -mr-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-[10px] uppercase tracking-widest text-[#666666] mt-1">{item.category}</p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center rounded-full border border-[#333333] h-8 px-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 px-2 text-[#888888] hover:text-white transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-[11px] font-bold w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 px-2 text-[#888888] hover:text-white transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-sm font-light">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-[#222222] bg-[#050505]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] uppercase tracking-widest text-[#666666]">Subtotal</span>
                  <span className="text-lg font-light">${totalPrice.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/checkout');
                  }}
                  className="w-full bg-white text-black hover:bg-neutral-200 py-4 rounded-full text-[11px] uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
