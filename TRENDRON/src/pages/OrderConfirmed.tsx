import { useState, useEffect, FormEvent } from 'react';
import { motion } from 'motion/react';
import { ActivePage, OrderDetails } from '../types';

interface OrderConfirmedProps {
  setActivePage: (page: ActivePage) => void;
  currentOrder: OrderDetails | null;
  triggerToast?: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export default function OrderConfirmed({ setActivePage, currentOrder, triggerToast }: OrderConfirmedProps) {
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (currentOrder) {
      setOrder(currentOrder);
    } else {
      // Mock fallback order details for standalone review and demo
      setOrder({
        orderNumber: 'TR-8942',
        date: 'Sept 12, 2024',
        items: [
          {
            product: {
              id: 'essential_cashmere',
              name: 'Essential Cashmere Sweater',
              price: 185,
              image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwqZtIocDAW3BuLP8aixcYZMwdYl-ge5CXCHmt64U0HgC8seO3VvUef3z9_dGnfqXM_Et6Q_LOHwQqgo_3jUUZsw6ajzY94tuIKbRwTlJbBcrdmSS5cmJKvOIwqp7N8o1ELRCUkoZxiONqsWEC3sry9_X_7LyXs07aayEAaUWMOTSplxuzVTM-7q7EPWdAcO1y9fmc5kobUFWHYcjJ1vxNbSHH5m8H-YbXPwct4Rwc1bxcDFLVgf2doxpv8YXLFqYsOdwmHPoM7mDc',
              rating: 4.8,
              reviewsCount: 142
            },
            quantity: 1,
            selectedColor: 'Midnight Black',
            selectedSize: 'Medium'
          },
          {
            product: {
              id: 'chelsea_boot',
              name: 'Handcrafted Chelsea Boot',
              price: 310,
              image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAFGb4_cTNzMV0eTTb7sH8GlyeQtq6OQ3gKrtHxJKN5lBZwdZcYKMLmLFVVNhGfUnSWGoV1vZ2wlDfSRmqY7X1pb3zkvJWOuyz68zUcXqRsui6J5dlCMnZHdlPIcb0674ZkH7u14-Ih0cjoL44l3a7uUKAU4N6tqRhgN5vhiTS5SZiCmQv45-0SBJk_GL6h-zD8zWBhPTbrg_MYXKQsk4v9IoXo3ZwyK_ci9E0rbD7ik4hY0jzKOe-kV6HTkRNYXiHUKBQ87_TObfR',
              rating: 4.9,
              reviewsCount: 78
            },
            quantity: 1,
            selectedColor: 'Vintage Tan',
            selectedSize: '10'
          }
        ],
        subtotal: 495,
        tax: 40.84,
        shipping: 0,
        total: 535.84,
        shippingAddress: {
          firstName: 'Julian',
          lastName: 'Kensington',
          email: 'julian@example.com',
          address: '1428 Westbury Avenue, Suite 4B',
          city: 'New York, NY',
          zip: '10011'
        }
      });
    }
  }, [currentOrder]);

  if (!order) return null;

  const handleTrackRedirect = () => {
    setActivePage('TRACK_ORDER');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReceiptDownload = () => {
    if (triggerToast) {
      triggerToast('Invoice downloaded successfully! (Simulated PDF download completed.)', 'success');
    } else {
      alert('Invoice download simulation: PDF receipt generated and downloaded successfully.');
    }
  };

  const handleSignupSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribing(true);
      setTimeout(() => {
        setIsSubscribing(false);
        setEmail('');
        if (triggerToast) {
          triggerToast('Welcome to the Inner Circle. Early private collection access is granted.', 'success');
        } else {
          alert('Welcome to the Inner Circle. Early access is granted.');
        }
      }, 1000);
    }
  };

  return (
    <div className="pt-24 pb-xl bg-background">
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

      {/* Success Hero Section */}
      <section className="max-w-container-max mx-auto px-gutter mt-lg text-center mb-xl space-y-md">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 15 }}
          className="inline-flex items-center justify-center w-20 h-20 bg-primary-container rounded-full mb-md shadow-md animate-bounce-subtle"
        >
          <span className="material-symbols-outlined text-on-primary-container text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            check_circle
          </span>
        </motion.div>
        <h1 className="font-display font-bold text-3xl md:text-5xl text-on-surface leading-tight tracking-tight">
          Your Style is on the Way!
        </h1>
        <p className="font-sans text-body-lg text-on-surface-variant max-w-xl mx-auto">
          Order confirmed. We have sent a confirmation email with complete styling details to your inbox.
        </p>
        <div className="inline-block bg-surface-container-high px-lg py-sm rounded-lg border border-outline-variant/30 shadow-sm">
          <span className="text-on-surface-variant font-sans text-[10px] font-bold tracking-widest block mb-1 uppercase">
            Order Reference
          </span>
          <span className="font-display text-headline-md tracking-widest text-primary font-bold">
            {order.orderNumber}
          </span>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="max-w-container-max mx-auto px-gutter">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg items-start">
          {/* Left Column: Order Items */}
          <div className="lg:col-span-8 space-y-md">
            <div className="bg-white p-md md:p-lg rounded-xl shadow-sm border border-outline-variant/30 space-y-md">
              <h2 className="font-display font-bold text-headline-sm text-on-surface flex items-center gap-2 border-b border-outline-variant/20 pb-sm mb-sm">
                <span className="material-symbols-outlined text-primary text-xl">inventory_2</span>
                Order Items
              </h2>

              <div className="space-y-md">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex gap-md py-sm border-b border-outline-variant/10 last:border-0 last:pb-0">
                    <div className="w-24 h-32 bg-surface-container-lowest rounded-lg overflow-hidden flex-shrink-0 border border-outline-variant/20 shadow-sm">
                      <img className="w-full h-full object-cover" src={item.product.image} alt={item.product.name} />
                    </div>
                    <div className="flex flex-col justify-between py-xs flex-grow">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-display font-semibold text-body-md text-on-surface leading-tight">
                            {item.product.name}
                          </h3>
                          <span className="font-sans font-bold text-body-md text-on-surface">
                            ${item.product.price * item.quantity}.00
                          </span>
                        </div>
                        <p className="text-on-surface-variant font-sans text-body-sm mt-1">
                          {item.selectedColor || 'Neutral'} / Size {item.selectedSize || 'M'}
                        </p>
                        <p className="text-on-surface-variant font-sans text-body-sm">Qty: {item.quantity}</p>
                      </div>
                      <div className="flex items-center gap-1 text-primary">
                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                          verified
                        </span>
                        <span className="font-sans text-[9px] font-bold tracking-widest uppercase">IN STOCK</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals Breakdown */}
              <div className="pt-md border-t border-outline-variant/40 space-y-sm font-sans text-body-sm">
                <div className="flex justify-between text-on-surface-variant">
                  <span>Subtotal</span>
                  <span className="text-on-surface font-semibold">${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Shipping</span>
                  <span className="text-primary font-bold">Complimentary Standard</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Estimated Tax</span>
                  <span className="text-on-surface font-semibold">${order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-on-surface font-body-lg font-bold pt-sm border-t border-outline-variant/20">
                  <span className="font-display">Total Charged</span>
                  <span className="text-primary font-display">${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Next Steps Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              <div className="bg-surface-container-low p-lg rounded-xl border border-outline-variant/20 shadow-sm space-y-sm">
                <h3 className="font-display font-semibold text-body-md text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-xl">local_shipping</span>
                  Transit Details
                </h3>
                <p className="font-sans text-body-sm text-on-surface-variant leading-relaxed">
                  Your tracking details will arrive via email within 24 hours. Enjoy Complimentary Ground shipping, dispatching directly from our regional New York boutique center.
                </p>
              </div>
              <div className="bg-surface-container-low p-lg rounded-xl border border-outline-variant/20 shadow-sm space-y-sm">
                <h3 className="font-display font-semibold text-body-md text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-xl">edit_note</span>
                  Modifications
                </h3>
                <p className="font-sans text-body-sm text-on-surface-variant leading-relaxed">
                  Need to change your size or delivery details? We maintain a 2-hour window from checkout to edit any confirmed order details. Contact concierge directly for swift modifications.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Delivery Details & Actions */}
          <div className="lg:col-span-4 space-y-md">
            <div className="bg-surface-container-highest p-md md:p-lg rounded-xl border border-outline-variant/20 shadow-sm space-y-md">
              <h2 className="font-display font-bold text-headline-sm text-on-surface">Delivery Logistics</h2>
              <div className="space-y-sm">
                <div>
                  <h4 className="font-sans text-[10px] font-bold text-on-surface-variant mb-1 uppercase tracking-wider">
                    ESTIMATED ARRIVAL
                  </h4>
                  <p className="font-display font-bold text-lg text-primary">Wed, Sept 14 - Fri, Sept 16</p>
                  <p className="text-on-surface-variant font-sans text-body-sm">Carbon-Neutral Ground Carrier</p>
                </div>

                <div className="border-t border-outline-variant/30 pt-md">
                  <h4 className="font-sans text-[10px] font-bold text-on-surface-variant mb-2 uppercase tracking-wider">
                    SHIPPING ADDRESS
                  </h4>
                  <address className="not-italic font-sans text-body-sm text-on-surface leading-relaxed">
                    <span className="font-semibold text-on-surface">
                      {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                    </span>
                    <br />
                    {order.shippingAddress.address}
                    <br />
                    {order.shippingAddress.city}, {order.shippingAddress.zip}
                    <br />
                    United States
                  </address>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-sm">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleTrackRedirect}
                className="w-full bg-on-surface text-surface py-md rounded font-display font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:opacity-90 transition-opacity"
              >
                <span className="material-symbols-outlined text-lg">near_me</span>
                Track Your Order
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleReceiptDownload}
                className="w-full bg-surface border border-outline py-md rounded font-display font-bold text-xs tracking-wider uppercase text-on-surface flex items-center justify-center gap-2 cursor-pointer hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined text-lg">receipt_long</span>
                Download Invoice
              </motion.button>
            </div>

            {/* Concierge Help Box */}
            <div className="bg-white p-md rounded-xl border border-outline-variant/30 text-center space-y-md">
              <p className="font-sans text-body-sm text-on-surface-variant leading-relaxed">
                Have questions about sizing, styling, or package location? Our concierge support team is online 24/7.
              </p>
              <div className="flex justify-center gap-lg border-t border-outline-variant/10 pt-sm">
                <button
                  onClick={() => {
                    if (triggerToast) {
                      triggerToast('Live chat initialized. Connecting to luxury representative Elias...', 'info');
                    } else {
                      alert('Trendora Support: Chat initialized with Representative Elias.');
                    }
                  }}
                  className="flex flex-col items-center group cursor-pointer"
                >
                  <span className="material-symbols-outlined text-secondary group-hover:text-primary transition-colors text-xl">chat</span>
                  <span className="font-sans text-[10px] font-bold mt-1 tracking-wider uppercase">LIVE CHAT</span>
                </button>
                <button
                  onClick={() => {
                    if (triggerToast) {
                      triggerToast('Support ticket drafted. Address copied: support@trendora.com', 'success');
                    } else {
                      alert('Trendora Support: Drafted ticket and copied address support@trendora.com.');
                    }
                  }}
                  className="flex flex-col items-center group cursor-pointer"
                >
                  <span className="material-symbols-outlined text-secondary group-hover:text-primary transition-colors text-xl">mail</span>
                  <span className="font-sans text-[10px] font-bold mt-1 tracking-wider uppercase">EMAIL CONCIERGE</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="max-w-container-max mx-auto px-gutter mt-xl">
        <div className="bg-primary text-on-primary p-xl rounded-2xl flex flex-col md:flex-row items-center justify-between gap-md overflow-hidden relative shadow-md">
          <div className="z-10 text-center md:text-left space-y-xs">
            <h2 className="font-display font-bold text-2xl md:text-3xl">Join the Inner Circle</h2>
            <p className="font-sans text-body-md opacity-90 max-w-md">
              Unlock early access to our seasonal capsule collections and invitation-only style journals.
            </p>
          </div>
          <div className="z-10 w-full md:w-auto">
            <form onSubmit={handleSignupSubmit} className="flex flex-col sm:flex-row gap-sm">
              <input
                className="bg-white/10 border border-white/30 text-white placeholder-white/60 px-md py-sm rounded-lg focus:ring-1 focus:ring-white outline-none sm:min-w-[280px] font-sans text-body-sm"
                placeholder="Email address"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                className="bg-white text-primary px-lg py-sm rounded-lg font-display font-bold text-xs uppercase tracking-wider hover:bg-opacity-90 transition-all cursor-pointer whitespace-nowrap"
                type="submit"
              >
                {isSubscribing ? 'Registering...' : 'Sign Up'}
              </button>
            </form>
          </div>

          <div className="absolute right-[-10%] top-[-50%] w-64 h-64 bg-primary-container/20 rounded-full blur-3xl"></div>
          <div className="absolute left-[20%] bottom-[-50%] w-96 h-96 bg-primary-container/10 rounded-full blur-3xl"></div>
        </div>
      </section>
    </div>
  );
}
