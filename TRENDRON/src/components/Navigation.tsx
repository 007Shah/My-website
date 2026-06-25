import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ActivePage, CartItem } from '../types';

interface NavigationProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  cart: CartItem[];
  setCart: Dispatch<SetStateAction<CartItem[]>>;
  setCurrentOrder: (order: any) => void;
  triggerToast?: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export default function Navigation({
  activePage,
  setActivePage,
  cart,
  setCart,
  setCurrentOrder,
  triggerToast
}: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showDemoMenu, setShowDemoMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll handler for navbar background blur transition
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const pagesList: { id: ActivePage; label: string; icon: string }[] = [
    { id: 'HOME', label: '1. Homepage', icon: 'home' },
    { id: 'PRODUCT_DETAILS', label: '2. Product Details', icon: 'apparel' },
    { id: 'CHECKOUT', label: '3. Secure Checkout', icon: 'credit_card' },
    { id: 'UPSELL', label: '4. Upsell (Watch Roll)', icon: 'add_shopping_cart' },
    { id: 'DOWNSELL', label: '5. Downsell (Bundle)', icon: 'loyalty' },
    { id: 'ORDER_CONFIRMED', label: '6. Order Confirmed', icon: 'task_alt' },
    { id: 'TRACK_ORDER', label: '7. Order Tracking', icon: 'local_shipping' },
    { id: 'DASHBOARD', label: '8. User Dashboard', icon: 'dashboard' },
    { id: 'CONTACT', label: '9. Contact Us', icon: 'mail' },
  ];

  // Helper to pre-fill order details when skipping to thank you page
  const handleQuickPageChange = (page: ActivePage) => {
    if (page === 'ORDER_CONFIRMED' || page === 'TRACK_ORDER') {
      // Pre-fill a realistic mock order if empty
      setCurrentOrder({
        orderNumber: 'TR-8942',
        date: 'Sept 12, 2024',
        items: cart.length > 0 ? cart : [
          {
            product: {
              id: 'blazer',
              name: 'The Minimalist Blazer',
              price: 129,
              image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCht-EiYXpJi09oYl05KuNpW5oy8JajuoYzmHpDww1_fYcV85p3XfdFWbYNAnRG8fdSs5im2rW8FKdasHSSwFDBLwqdXHXrv4GUEnqUcN2sK-exV3srhXY5Q85A-IT-vGAgWhzqBFGDfB53wRs2oT7mqD7XMi0lKE54QiuAq7OHAQUYY9Z6ngf-sY7hNGWAWpS5fKKaHrTMmnhvWYSRjLd473pCVUpiaRhhKFaV5kxrginSGt_9bv-hP36J0poxXXilzdOdfGvezVbP',
              rating: 4.8,
              reviewsCount: 124
            },
            quantity: 1,
            selectedColor: 'Charcoal Grey',
            selectedSize: 'S'
          }
        ],
        subtotal: cart.length > 0 ? cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0) : 129,
        tax: 10.64,
        shipping: 0,
        total: cart.length > 0 ? cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0) + 10.64 : 139.64,
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
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsOpen(false);
  };

  // Transactional layout check to show simple/clean navbar for checkout pages
  const isTransactionalPage = ['CHECKOUT', 'ORDER_CONFIRMED', 'UPSELL', 'DOWNSELL'].includes(activePage);

  return (
    <>
      <header
        className={`fixed top-0 w-full z-40 transition-all duration-500 ${
          isScrolled
            ? 'bg-surface-container-lowest/80 backdrop-blur-xl border-b border-outline-variant/15 shadow-[0_2px_20px_rgba(0,0,0,0.02)] py-1'
            : 'bg-transparent border-b border-transparent py-3'
        }`}
      >
        <div className="max-w-container-max mx-auto px-gutter flex items-center justify-between h-20">
          {/* Brand Logo */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleQuickPageChange('HOME')}
            className="font-display text-lg md:text-xl tracking-[0.24em] text-on-surface font-bold cursor-pointer uppercase select-none text-left"
          >
            Trendora
          </motion.button>

          {/* Regular Navigation - Hidden on Transactional Checkout Flows */}
          {!isTransactionalPage && (
            <nav className="hidden md:flex items-center gap-10">
              {[
                { id: 'HOME', label: 'New Arrivals' },
                { id: 'PRODUCT_DETAILS', label: 'Collections' },
                { id: 'DASHBOARD', label: 'Bestsellers' },
                { id: 'CONTACT', label: 'Contact' }
              ].map((item) => {
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleQuickPageChange(item.id as ActivePage)}
                    className={`font-display text-[11px] tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer relative py-2 font-medium ${
                      isActive
                        ? 'text-primary'
                        : 'text-on-surface-variant/85 hover:text-primary'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeUnderline"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </nav>
          )}

          {/* Right Toolbar / Status Indicators */}
          <div className="flex items-center gap-sm md:gap-md">
            {isTransactionalPage ? (
              <div className="flex items-center gap-xs text-on-surface-variant font-display text-[11px] tracking-[0.15em] uppercase font-semibold">
                <span className="material-symbols-outlined text-primary text-base animate-pulse">lock</span>
                <span>Secure Server</span>
              </div>
            ) : (
              <>
                <button
                  onClick={() => handleQuickPageChange('TRACK_ORDER')}
                  className={`p-2 transition-all cursor-pointer relative group rounded-full hover:bg-surface-container-low ${
                    activePage === 'TRACK_ORDER' ? 'text-primary bg-primary/5' : 'text-on-surface-variant hover:text-primary'
                  }`}
                  title="Track Order"
                >
                  <span className="material-symbols-outlined text-xl">local_shipping</span>
                  <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-[10px] tracking-wider px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none scale-95 group-hover:scale-100">
                    Track Order
                  </span>
                </button>

                <button
                  onClick={() => handleQuickPageChange('DASHBOARD')}
                  className={`p-2 transition-all cursor-pointer relative group rounded-full hover:bg-surface-container-low ${
                    activePage === 'DASHBOARD' ? 'text-primary bg-primary/5' : 'text-on-surface-variant hover:text-primary'
                  }`}
                  title="Membership Dashboard"
                >
                  <span className="material-symbols-outlined text-xl">person</span>
                  <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-[10px] tracking-wider px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none scale-95 group-hover:scale-100">
                    Dashboard
                  </span>
                </button>

                <button
                  onClick={() => handleQuickPageChange('CHECKOUT')}
                  className="p-2 text-on-surface-variant hover:text-primary transition-all cursor-pointer relative rounded-full hover:bg-surface-container-low"
                  title="Shopping Bag"
                >
                  <span className="material-symbols-outlined text-xl">shopping_bag</span>
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-0 right-0 bg-primary text-on-primary text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md border-2 border-surface"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </button>

                {/* Mobile Menu Icon */}
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="md:hidden p-2 text-on-surface-variant hover:text-primary cursor-pointer rounded-full hover:bg-surface-container-low transition-colors"
                  aria-label="Toggle Menu"
                >
                  <motion.span 
                    animate={{ rotate: isOpen ? 90 : 0 }}
                    className="material-symbols-outlined text-xl block"
                  >
                    {isOpen ? 'close' : 'menu'}
                  </motion.span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isOpen && !isTransactionalPage && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="md:hidden border-t border-outline-variant/15 bg-surface-container-lowest/95 backdrop-blur-2xl overflow-hidden shadow-xl"
            >
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.08 } }
                }}
                className="px-gutter py-md flex flex-col gap-sm"
              >
                {[
                  { id: 'HOME', label: 'New Arrivals', icon: 'home' },
                  { id: 'PRODUCT_DETAILS', label: 'Collections', icon: 'apparel' },
                  { id: 'DASHBOARD', label: 'Bestsellers & Dashboard', icon: 'dashboard' },
                  { id: 'CONTACT', label: 'Contact Concierge', icon: 'mail' },
                  { id: 'TRACK_ORDER', label: 'Track Your Order', icon: 'local_shipping' }
                ].map((item) => {
                  const isActive = activePage === item.id;
                  return (
                    <motion.button
                      key={item.id}
                      variants={{
                        hidden: { opacity: 0, x: -10 },
                        visible: { opacity: 1, x: 0 }
                      }}
                      onClick={() => handleQuickPageChange(item.id as ActivePage)}
                      className={`text-left font-display text-[12px] tracking-[0.18em] uppercase py-3 px-3 rounded-lg flex items-center gap-md transition-all ${
                        isActive 
                          ? 'bg-primary/8 text-primary font-bold border-l-4 border-primary' 
                          : 'text-on-surface-variant/90 hover:bg-surface-container-low hover:text-primary'
                      }`}
                    >
                      <span className="material-symbols-outlined text-lg">{item.icon}</span>
                      <span>{item.label}</span>
                    </motion.button>
                  );
                })}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Elegant Floating Demo Control Panel (Professional Developer Showcase Tool) */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          onClick={() => setShowDemoMenu(!showDemoMenu)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-14 h-14 bg-inverse-surface text-inverse-on-surface rounded-full shadow-2xl flex items-center justify-center cursor-pointer border border-outline-variant/20 hover:bg-on-surface-variant transition-colors relative"
          title="Demo Page Navigator"
        >
          <span className="material-symbols-outlined text-2xl">route</span>
          {showDemoMenu && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
          )}
        </motion.button>

        <AnimatePresence>
          {showDemoMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="absolute bottom-16 right-0 w-80 bg-surface-container-lowest border border-outline-variant/50 rounded-xl shadow-[0px_12px_40px_rgba(0,0,0,0.12)] p-md flex flex-col gap-sm"
            >
              <div className="border-b border-outline-variant/30 pb-sm mb-xs flex items-center justify-between">
                <div>
                  <h4 className="font-display font-semibold text-body-md text-on-surface">Trendora Sandbox</h4>
                  <p className="text-[10px] text-on-surface-variant">Seamlessly view all 9 fully-optimized views</p>
                </div>
                <button
                  onClick={() => setShowDemoMenu(false)}
                  className="p-1 hover:bg-surface-container rounded-full text-on-surface-variant"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>

              <div className="flex flex-col gap-1 max-h-90 overflow-y-auto no-scrollbar">
                {pagesList.map((p) => {
                  const isActive = activePage === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        handleQuickPageChange(p.id);
                        setShowDemoMenu(false);
                      }}
                      className={`w-full text-left font-sans text-body-sm px-md py-base rounded-lg flex items-center gap-sm cursor-pointer transition-all ${
                        isActive
                          ? 'bg-primary/15 text-primary font-bold border-l-4 border-primary'
                          : 'hover:bg-surface-container text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      <span className="material-symbols-outlined text-lg">{p.icon}</span>
                      <span>{p.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="border-t border-outline-variant/30 pt-sm mt-xs flex justify-between items-center">
                <span className="text-[9px] text-on-surface-variant font-mono">VITE REACT • SPA ROUTER</span>
                <button
                  onClick={() => {
                    setCart([]);
                    if (triggerToast) {
                      triggerToast('Cart and session state cleared successfully.', 'info');
                    } else {
                      alert('Cart cleared successfully.');
                    }
                  }}
                  className="text-[10px] text-primary font-bold hover:underline"
                >
                  Clear Demo State
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
