import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ActivePage, OrderDetails } from '../types';

interface UpsellProps {
  setActivePage: (page: ActivePage) => void;
  currentOrder: OrderDetails | null;
  setCurrentOrder: (order: OrderDetails) => void;
  triggerToast?: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export default function Upsell({ setActivePage, currentOrder, setCurrentOrder, triggerToast }: UpsellProps) {
  const [timeLeft, setTimeLeft] = useState(599); // 9m 59s
  const [isAdding, setIsAdding] = useState(false);

  // Tick the countdown timer downwards every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleAddUpsell = () => {
    setIsAdding(true);
    setTimeout(() => {
      if (currentOrder) {
        // Build new Watch Roll product
        const watchRollItem = {
          product: {
            id: 'premium_watch_roll',
            name: 'Premium Leather Watch Roll',
            price: 49,
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLj1_bZc1kxrKRRURtqYonJpdM9zPn-1QxmJ8J2Q_VEy_xAHBDYWT3_7RKZH4AY5E7WGF1CdzBqCg47wTgyxguSgSkDh9UVxb6wdi1j8HNH38OON6Iit0atm6dfT_0sNORFcbK64V6E3hzpvQopcSKMtqgkNMef_YYCs-5iGNKmp-_83WaukrNUMrOabzovtBcMqh1O34j3D6cP5b4TASihO1-2mxeRqGMlcFM2-387vpC5nJsWYBtHnZ_C_t47apJCABq_ztsrx9u',
            rating: 4.9,
            reviewsCount: 104
          },
          quantity: 1,
          selectedColor: 'Espresso Brown',
          selectedSize: 'One Size'
        };

        const updatedItems = [...currentOrder.items, watchRollItem];
        const updatedSubtotal = currentOrder.subtotal + 49;
        const updatedTotal = currentOrder.total + 49;

        setCurrentOrder({
          ...currentOrder,
          items: updatedItems,
          subtotal: updatedSubtotal,
          total: updatedTotal
        });
      }

      setIsAdding(false);
      if (triggerToast) {
        triggerToast('Tuscan Leather Watch Roll added successfully! Your order has been updated.', 'success');
      } else {
        alert('Tuscan Leather Watch Roll added successfully! Your order has been updated.');
      }
      setActivePage('ORDER_CONFIRMED');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1200);
  };

  const handleDecline = () => {
    // Go to Downsell for standard conversion funnel demonstration
    setActivePage('DOWNSELL');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="pt-24 min-h-[calc(100vh-64px)] flex flex-col items-center py-xl px-gutter bg-background">
      {/* Universal Backward Navigation Button */}
      <div className="w-full max-w-4xl text-left mb-md">
        <motion.button
          whileHover={{ x: -4 }}
          onClick={() => {
            setActivePage('HOME');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-xs font-display text-[10px] tracking-[0.2em] font-bold text-on-surface-variant uppercase hover:text-primary transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg leading-none">west</span>
          <span>Back to Gallery</span>
        </motion.button>
      </div>

      {/* Urgency Banner */}
      <div className="mb-lg text-center space-y-xs">
        <h1 className="font-display font-bold text-3xl md:text-5xl text-on-surface leading-tight tracking-tight">
          Wait! Don't Miss This Special Offer 🔥
        </h1>
        <p className="font-sans text-body-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
          As a thank you for your order, we are offering our best-selling leather accessory at an exclusive, one-time-only price.
        </p>
      </div>

      {/* Upsell Bento Grid Card */}
      <div className="max-w-[1000px] w-full grid grid-cols-1 md:grid-cols-12 gap-md bg-white rounded-xl overflow-hidden shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-outline-variant/20">
        {/* Product Showcase */}
        <div className="md:col-span-7 relative bg-surface-container-low flex items-center justify-center p-md">
          <div className="absolute top-sm left-sm bg-primary text-on-primary px-sm py-xs rounded-full font-sans text-[10px] font-bold tracking-widest z-10 uppercase">
            One-Time Opportunity
          </div>
          <img
            className="w-full aspect-[4/5] object-cover rounded-lg shadow-sm"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLj1_bZc1kxrKRRURtqYonJpdM9zPn-1QxmJ8J2Q_VEy_xAHBDYWT3_7RKZH4AY5E7WGF1CdzBqCg47wTgyxguSgSkDh9UVxb6wdi1j8HNH38OON6Iit0atm6dfT_0sNORFcbK64V6E3hzpvQopcSKMtqgkNMef_YYCs-5iGNKmp-_83WaukrNUMrOabzovtBcMqh1O34j3D6cP5b4TASihO1-2mxeRqGMlcFM2-387vpC5nJsWYBtHnZ_C_t47apJCABq_ztsrx9u"
            alt="Premium Leather Watch Roll"
          />
        </div>

        {/* Offer Details */}
        <div className="md:col-span-5 flex flex-col justify-center p-lg bg-surface-container-lowest">
          <div className="mb-sm">
            <span className="font-sans text-label-caps text-primary uppercase text-xs tracking-wider font-bold">
              Limited Edition Accessory
            </span>
            <h2 className="font-display font-bold text-2xl md:text-3xl mt-xs text-on-surface leading-tight">
              Premium Leather Watch Roll
            </h2>
          </div>

          <div className="flex items-baseline gap-sm mb-md">
            <span className="text-4xl font-bold text-primary">$49</span>
            <span className="text-on-surface-variant line-through text-lg font-medium">$125</span>
            <span className="bg-error-container text-on-error-container px-2 py-0.5 rounded font-sans text-[10px] font-bold uppercase tracking-wide">
              60% OFF
            </span>
          </div>

          <div className="space-y-sm mb-lg">
            <div className="flex items-start gap-sm">
              <span className="material-symbols-outlined text-primary text-xl mt-0.5">check_circle</span>
              <p className="font-sans text-body-sm text-on-surface-variant leading-relaxed">
                Handcrafted from 100% full-grain Tuscan leather with premium stitching.
              </p>
            </div>
            <div className="flex items-start gap-sm">
              <span className="material-symbols-outlined text-primary text-xl mt-0.5">check_circle</span>
              <p className="font-sans text-body-sm text-on-surface-variant leading-relaxed">
                Soft micro-suede lining protects up to 3 luxury watches from friction.
              </p>
            </div>
            <div className="flex items-start gap-sm">
              <span className="material-symbols-outlined text-primary text-xl mt-0.5">check_circle</span>
              <p className="font-sans text-body-sm text-on-surface-variant leading-relaxed">
                Compact cylinder structure fits elegantly inside premium duffle bags.
              </p>
            </div>
          </div>

          {/* Main CTA */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddUpsell}
            disabled={isAdding}
            className="w-full py-md bg-primary text-on-primary rounded-lg font-display font-semibold text-body-md shadow-lg flex items-center justify-center gap-sm cursor-pointer animate-pulse-gold disabled:opacity-50"
          >
            {isAdding ? (
              <span>Updating order details...</span>
            ) : (
              <>
                <span className="material-symbols-outlined">add_shopping_cart</span>
                <span>Add to My Order - Only $49</span>
              </>
            )}
          </motion.button>
          <p className="mt-sm text-center font-sans text-[11px] text-on-surface-variant italic">
            Secure checkout is pre-authorized. This is your final chance to secure this price.
          </p>
        </div>
      </div>

      {/* Timer & Social Proof */}
      <div className="mt-lg flex flex-col md:flex-row items-center gap-md">
        <div className="flex items-center gap-xs font-sans text-body-sm text-on-surface-variant font-medium">
          <span className="material-symbols-outlined text-error text-xl font-bold">timer</span>
          <span>Offer expires in:</span>
          <span className="font-bold text-on-surface font-mono text-body-sm bg-surface-container-high px-2 py-0.5 rounded">
            {formatTime()}
          </span>
        </div>
        <div className="h-1.5 w-1.5 bg-outline-variant/60 rounded-full hidden md:block"></div>
        <div className="flex -space-x-2">
          <div className="w-8 h-8 rounded-full border-2 border-white bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200')" }}></div>
          <div className="w-8 h-8 rounded-full border-2 border-white bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200')" }}></div>
          <div className="w-8 h-8 rounded-full border-2 border-white bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=200')" }}></div>
        </div>
        <span className="font-sans text-body-sm text-on-surface-variant font-medium">
          42 others added this to their order today
        </span>
      </div>

      {/* Skip Button */}
      <button
        onClick={handleDecline}
        className="mt-xl text-on-surface-variant hover:text-on-surface font-sans text-body-sm underline transition-colors cursor-pointer"
      >
        No thanks, I'll pass on this $76 discount
      </button>
    </div>
  );
}
