import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';

export default function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();
  const { token, user } = useAuth();
  const navigate = useNavigate();
  
  const [processing, setProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod'>('card');

  const [formData, setFormData] = useState({
    email: user?.email || '',
    name: user?.name || '',
    address: '',
    city: '',
    country: '',
    zip: ''
  });

  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvc: ''
  });

  if (cart.length === 0 && !orderComplete) {
    return (
      <AnimatedPage className="min-h-screen pt-32 px-4 text-center">
        <h2 className="text-2xl font-mono mb-4 text-white">Your cart is empty</h2>
        <Link to="/" className="text-neutral-400 hover:text-white underline">Return to store</Link>
      </AnimatedPage>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          items: cart,
          total: totalPrice,
          customerDetails: formData,
          paymentMethod
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setOrderComplete(data.orderId);
        clearCart();
      }
    } catch (error) {
      console.error('Order failed:', error);
    } finally {
      setProcessing(false);
    }
  };

  if (orderComplete) {
    return (
      <AnimatedPage className="min-h-screen pt-32 px-4 flex flex-col items-center justify-center text-center max-w-lg mx-auto">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-8"
        >
          <CheckCircle2 className="w-10 h-10" />
        </motion.div>
        
        <h1 className="text-3xl font-mono font-bold text-white mb-4">Order Confirmed</h1>
        <p className="text-neutral-400 mb-2">Thank you! Your order <span className="text-white font-mono">{orderComplete}</span> has been received.</p>
        <p className="text-neutral-500 text-sm mb-12">We'll send you an email with shipping details soon.</p>
        
        <Link 
          to="/"
          className="bg-white text-black hover:bg-neutral-200 px-8 py-3 rounded-lg font-medium transition-colors w-full"
        >
          Return to Store
        </Link>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
       <Link to="/" className="inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase font-bold text-[#888888] hover:text-white mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Cart
      </Link>
      
      <div className="grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7">
          <h2 className="text-3xl font-light text-white mb-8 tracking-tight">Checkout</h2>
          
          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
            <section>
              <h3 className="text-[10px] uppercase font-bold text-[#666666] mb-4 tracking-[0.2em]">Contact Information</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="sr-only">Email</label>
                  <input
                    type="email" id="email" required placeholder="Email address"
                    className="w-full bg-[#111111] border border-[#222222] rounded-2xl px-6 py-4 text-white placeholder-[#666666] focus:outline-none focus:border-[#444444] transition-all"
                    value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>
            </section>
            
            <section>
              <h3 className="text-[10px] uppercase font-bold text-[#666666] mb-4 tracking-[0.2em]">Shipping Address</h3>
              <div className="space-y-4">
                 <div>
                  <label htmlFor="name" className="sr-only">Full Name</label>
                  <input
                    type="text" id="name" required placeholder="Full Name"
                    className="w-full bg-[#111111] border border-[#222222] rounded-2xl px-6 py-4 text-white placeholder-[#666666] focus:outline-none focus:border-[#444444] transition-all"
                    value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label htmlFor="address" className="sr-only">Address</label>
                  <input
                    type="text" id="address" required placeholder="Street Address"
                    className="w-full bg-[#111111] border border-[#222222] rounded-2xl px-6 py-4 text-white placeholder-[#666666] focus:outline-none focus:border-[#444444] transition-all"
                    value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="sr-only">City</label>
                    <input
                      type="text" id="city" required placeholder="City"
                      className="w-full bg-[#111111] border border-[#222222] rounded-2xl px-6 py-4 text-white placeholder-[#666666] focus:outline-none focus:border-[#444444] transition-all"
                      value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})}
                    />
                  </div>
                  <div>
                    <label htmlFor="zip" className="sr-only">Postal Code</label>
                    <input
                      type="text" id="zip" required placeholder="Postal Code"
                      className="w-full bg-[#111111] border border-[#222222] rounded-2xl px-6 py-4 text-white placeholder-[#666666] focus:outline-none focus:border-[#444444] transition-all"
                      value={formData.zip} onChange={(e) => setFormData({...formData, zip: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </section>

            <section>
               <h3 className="text-[10px] uppercase font-bold text-[#666666] mb-4 tracking-[0.2em]">Payment Method</h3>
               <div className="grid grid-cols-2 gap-4 mb-6">
                 <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 rounded-2xl border text-[11px] uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2 transition-all ${paymentMethod === 'card' ? 'border-white text-white bg-[#111111]' : 'border-[#222222] text-[#666666] hover:text-white hover:bg-[#0A0A0A]'}`}
                 >
                   Credit Card
                 </button>
                 <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-4 rounded-2xl border text-[11px] uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2 transition-all ${paymentMethod === 'cod' ? 'border-white text-white bg-[#111111]' : 'border-[#222222] text-[#666666] hover:text-white hover:bg-[#0A0A0A]'}`}
                 >
                   Cash / Delivery
                 </button>
               </div>

               {paymentMethod === 'card' ? (
                 <div className="space-y-4">
                   <input
                      type="text" placeholder="Card Number" required
                      className="w-full bg-[#111111] border border-[#222222] rounded-2xl px-6 py-4 text-white placeholder-[#666666] focus:outline-none focus:border-[#444444] transition-all font-mono text-sm"
                      value={cardData.number} onChange={(e) => setCardData({...cardData, number: e.target.value})}
                   />
                   <div className="grid grid-cols-2 gap-4">
                     <input
                        type="text" placeholder="MM/YY" required
                        className="w-full bg-[#111111] border border-[#222222] rounded-2xl px-6 py-4 text-white placeholder-[#666666] focus:outline-none focus:border-[#444444] transition-all font-mono text-sm"
                        value={cardData.expiry} onChange={(e) => setCardData({...cardData, expiry: e.target.value})}
                     />
                     <input
                        type="text" placeholder="CVC" required
                        className="w-full bg-[#111111] border border-[#222222] rounded-2xl px-6 py-4 text-white placeholder-[#666666] focus:outline-none focus:border-[#444444] transition-all font-mono text-sm"
                        value={cardData.cvc} onChange={(e) => setCardData({...cardData, cvc: e.target.value})}
                     />
                   </div>
                 </div>
               ) : (
                 <div className="p-6 bg-black/40 backdrop-blur-md border border-[#222222] rounded-2xl">
                   <p className="text-[#888888] text-sm leading-relaxed">
                     You will pay the full amount in cash when your order is delivered to the provided address.
                   </p>
                 </div>
               )}
            </section>
          </form>
        </div>
        
        <div className="lg:col-span-5">
          <div className="bg-black/40 backdrop-blur-md rounded-[32px] p-8 border border-[#222222] sticky top-24">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#666666]">Current Order</h3>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white">Process</span>
            </div>
            
            <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
              {cart.map(item => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-16 h-16 rounded-[12px] bg-[#111111] overflow-hidden flex-shrink-0 relative border border-[#222222]">
                     <span className="absolute -top-1 -right-1 w-4 h-4 bg-white text-black text-[9px] flex items-center justify-center rounded-full z-10 font-bold">
                        {item.quantity}
                     </span>
                     <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-luminosity opacity-80" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <p className="text-[12px] font-medium text-white line-clamp-1">{item.name}</p>
                    <p className="text-[11px] text-[#666666]">{item.category} / {item.quantity} Unit(s)</p>
                  </div>
                  <div className="flex items-center">
                    <p className="text-[13px] font-bold text-white">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-4 pt-6 border-t border-[#222222] text-sm">
              <div className="flex justify-between text-[#888888] text-[12px]">
                 <span>Subtotal</span>
                <span className="text-white">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#888888] text-[12px]">
                <span>Shipping</span>
                <span className="text-white tracking-widest uppercase text-[10px]">Free</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-[#222222]">
                <span className="text-[11px] uppercase tracking-widest text-[#666666]">Total</span>
                <span className="text-2xl font-light text-white">${totalPrice.toFixed(2)}</span>
              </div>
            </div>
            
            <button
              type="submit"
              form="checkout-form"
              disabled={processing}
              className="w-full bg-white text-black hover:bg-neutral-200 h-14 mt-8 rounded-full text-[11px] uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {processing ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Processing</>
              ) : (
                'Process Payment'
              )}
            </button>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}
