import { useState } from 'react';
import { motion } from 'motion/react';
import { ActivePage, OrderDetails } from '../types';

interface DownsellProps {
  setActivePage: (page: ActivePage) => void;
  currentOrder: OrderDetails | null;
  setCurrentOrder: (order: OrderDetails) => void;
  triggerToast?: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export default function Downsell({ setActivePage, currentOrder, setCurrentOrder, triggerToast }: DownsellProps) {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddDownsell = () => {
    setIsAdding(true);
    setTimeout(() => {
      if (currentOrder) {
        const bundleItem = {
          product: {
            id: 'essentials_bundle',
            name: 'The Essentials Bundle',
            price: 49,
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdL-bxkBz2FnABLeCGylRoydueVnrJKMaKO1s5xCpyxwcaUBlQHL4hkrRim9IqdMiz-x8FczcN1vZBwBEwS1hsJTKlJbnQFF7DbgmSzFkOudEvasZB3IxAfXj3A6Pq3kUSoocKkOmCRSYhzZu_0zCSnH7HuxDn7lS0Ly6313QIumrd7h9qFAQaQppfJttE4yV5ZOVoo4AUywtPvFVp3gSmDOZjU-XAEdX6Ro7FU57Fh453hsYHwYuf3xBeoyf8K4vSpEQqq4Oc7rBm',
            rating: 4.8,
            reviewsCount: 312
          },
          quantity: 1,
          selectedColor: 'Signature Sand',
          selectedSize: 'Standard'
        };

        const updatedItems = [...currentOrder.items, bundleItem];
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
        triggerToast('The Essentials Bundle added successfully! Your order has been updated.', 'success');
      } else {
        alert('The Essentials Bundle added successfully! Your order has been updated.');
      }
      setActivePage('ORDER_CONFIRMED');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1200);
  };

  const handlePass = () => {
    setActivePage('ORDER_CONFIRMED');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="pt-24 min-h-[calc(100vh-64px)] bg-radial from-surface-container-low to-background">
      {/* Universal Backward Navigation Button */}
      <div className="max-w-container-max mx-auto px-gutter pt-md">
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

      {/* Downsell Hero banner */}
      <section className="max-w-container-max mx-auto px-gutter pt-xl pb-lg text-center space-y-md">
        <div className="inline-block px-sm py-xs bg-primary-container/20 text-on-primary-container rounded-full font-sans text-[10px] font-bold tracking-widest uppercase">
          LIMITED TIME OFFER
        </div>
        <h1 className="font-display font-bold text-3xl md:text-5xl text-on-surface tracking-tight">
          Looking for something else?
        </h1>
        <p className="font-sans text-body-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
          We understand that big steps start with small choices. If the full collection wasn't quite what you had in mind today, perhaps our refined Essentials Bundle is the perfect fit.
        </p>
      </section>

      {/* Downsell Offer: Bento Asymmetric Glassmorphism Layout */}
      <section className="max-w-container-max mx-auto px-gutter pb-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-md items-center">
          {/* Left: Product Showcase */}
          <div className="lg:col-span-7 relative group">
            <div className="aspect-[4/5] overflow-hidden rounded-xl shadow-md transition-shadow duration-500 group-hover:shadow-xl">
              <img
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdL-bxkBz2FnABLeCGylRoydueVnrJKMaKO1s5xCpyxwcaUBlQHL4hkrRim9IqdMiz-x8FczcN1vZBwBEwS1hsJTKlJbnQFF7DbgmSzFkOudEvasZB3IxAfXj3A6Pq3kUSoocKkOmCRSYhzZu_0zCSnH7HuxDn7lS0Ly6313QIumrd7h9qFAQaQppfJttE4yV5ZOVoo4AUywtPvFVp3gSmDOZjU-XAEdX6Ro7FU57Fh453hsYHwYuf3xBeoyf8K4vSpEQqq4Oc7rBm"
                alt="The Essentials Bundle"
              />
            </div>
            <div className="absolute top-md left-md bg-white/70 backdrop-blur-md px-md py-sm rounded-lg shadow-sm border border-white/30">
              <p className="font-sans text-[10px] font-bold text-primary tracking-widest uppercase">BEST VALUE</p>
            </div>
          </div>

          {/* Right: Glassmorphism Offer Details Card */}
          <div className="lg:col-span-5">
            <div className="bg-white/70 backdrop-blur-md p-xl rounded-xl shadow-lg border border-white/40 space-y-lg">
              <div>
                <h2 className="font-display font-bold text-headline-md text-on-surface">The Essentials Bundle</h2>
                <div className="flex items-center gap-sm mt-sm">
                  <span className="font-display text-4xl font-bold text-primary">$49</span>
                  <span className="text-on-surface-variant line-through font-sans text-body-md font-medium">$85.00</span>
                  <span className="bg-primary/10 text-primary font-sans text-[10px] font-bold px-sm py-xs rounded">
                    SAVE 42%
                  </span>
                </div>
              </div>

              <p className="font-sans text-body-md text-on-surface-variant leading-relaxed">
                Experience the core of Trendora. This curated selection features our top three performing items, ensuring you get the <span className="font-semibold text-on-surface">Same Quality</span> with <span className="font-semibold text-on-surface">Better Value</span>.
              </p>

              {/* Feature List */}
              <ul className="space-y-sm">
                <li className="flex items-center gap-sm">
                  <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  <span className="font-sans text-body-sm text-on-surface-variant font-medium">Signature Minimalist Design Elements</span>
                </li>
                <li className="flex items-center gap-sm">
                  <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  <span className="font-sans text-body-sm text-on-surface-variant font-medium">Sustainable, High-End Raw Materials</span>
                </li>
                <li className="flex items-center gap-sm">
                  <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  <span className="font-sans text-body-sm text-on-surface-variant font-medium">Premium 24/7 Dedicated Concierge Support</span>
                </li>
              </ul>

              {/* CTA Area */}
              <div className="flex flex-col gap-sm pt-sm">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddDownsell}
                  disabled={isAdding}
                  className="w-full bg-[#1a1c1b] text-white py-md rounded-lg font-display font-semibold text-body-md hover:bg-on-surface-variant transition-colors flex items-center justify-center gap-sm cursor-pointer shadow-md"
                >
                  {isAdding ? (
                    <span>Adding to order...</span>
                  ) : (
                    <>
                      <span>Add to Order</span>
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </>
                  )}
                </motion.button>
                <button
                  onClick={handlePass}
                  className="w-full bg-transparent text-on-surface-variant py-sm rounded text-body-sm font-medium hover:underline cursor-pointer"
                >
                  No thanks, I'll pass on this value
                </button>
              </div>
            </div>

            {/* Support trust indicators */}
            <div className="mt-lg grid grid-cols-2 gap-md text-center">
              <div className="p-md rounded-lg bg-surface-container-low border border-outline-variant/20 shadow-sm flex flex-col items-center justify-center">
                <span className="material-symbols-outlined text-tertiary mb-xs text-xl">local_shipping</span>
                <p className="font-sans text-[10px] font-bold text-on-tertiary-fixed-variant tracking-wider uppercase">FAST SHIPPING</p>
              </div>
              <div className="p-md rounded-lg bg-surface-container-low border border-outline-variant/20 shadow-sm flex flex-col items-center justify-center">
                <span className="material-symbols-outlined text-tertiary mb-xs text-xl">verified_user</span>
                <p className="font-sans text-[10px] font-bold text-on-tertiary-fixed-variant tracking-wider uppercase">1-YEAR WARRANTY</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quality Section */}
      <section className="max-w-container-max mx-auto px-gutter py-xl border-t border-outline-variant/20">
        <div className="text-center mb-xl">
          <h3 className="font-display font-bold text-2xl md:text-3xl text-on-surface">Same Quality, Better Value</h3>
          <div className="w-16 h-1 bg-primary mx-auto mt-sm"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
          {[
            {
              icon: 'inventory_2',
              title: 'Curated Precision',
              desc: "We've removed the extras to focus purely on what you need for daily excellence."
            },
            {
              icon: 'eco',
              title: 'Responsibly Made',
              desc: 'Every component in this bundle follows our strict, verified sustainability charter.'
            },
            {
              icon: 'loyalty',
              title: 'Lifetime Access',
              desc: 'Purchase once and join our exclusive membership for early seasonal drop notifications.'
            }
          ].map((feat, i) => (
            <div key={i} className="p-lg rounded-xl hover:bg-white hover:shadow-md transition-all duration-300 border border-transparent hover:border-outline-variant/20 space-y-sm">
              <span className="material-symbols-outlined text-primary text-3xl mb-1">{feat.icon}</span>
              <h4 className="font-display font-bold text-headline-sm text-on-surface">{feat.title}</h4>
              <p className="text-on-surface-variant font-sans text-body-sm leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
