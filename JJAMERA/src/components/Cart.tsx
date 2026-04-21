import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { MagneticButton } from './MagneticButton';
import { Link } from 'react-router-dom';

export function Cart() {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, totalPrice } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Cart Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-obsidian border-l border-gray-deep/50 z-[101] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-deep/50">
              <h2 className="text-[20px] font-extrabold flex items-center gap-2">
                <ShoppingBag className="text-theme" />
                <span className="tracking-tight">Your Order</span>
              </h2>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-theme hover:text-theme-content rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-white/50 opacity-80">
                  <ShoppingBag size={48} className="mb-4 opacity-20" />
                  <p className="font-medium text-[15px]">Your cart is empty.</p>
                </div>
              ) : (
                items.map(item => (
                  <div key={item.id} className="flex gap-4 border-b border-gray-deep/30 pb-6 last:border-0 last:pb-0">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-deep/50 shrink-0 border border-white/5">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-theme/10">
                          <ShoppingBag size={24} className="text-theme opacity-50" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <h3 className="font-bold text-[15px] leading-tight mb-1">{item.name}</h3>
                        <p className="text-theme font-semibold text-[14px]">${item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-3 bg-white/5 rounded-lg px-2 py-1 border border-white/10">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="text-white/50 hover:text-white"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-[13px] font-bold w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="text-white/50 hover:text-white"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-[12px] font-semibold text-white/40 hover:text-red-400 transition-colors uppercase tracking-wider"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-deep/50 p-6 bg-obsidian">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white/60 font-medium">Subtotal</span>
                  <span className="text-[20px] font-extrabold tracking-tight">${totalPrice.toFixed(2)}</span>
                </div>
                <p className="text-[12px] text-white/40 font-medium mb-6">Taxes and shipping calculated at checkout.</p>
                <Link to="/checkout" onClick={() => setIsCartOpen(false)} className="block w-full">
                  <MagneticButton className="w-full shadow-lg">Checkout</MagneticButton>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
