import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ActivePage, CartItem, OrderDetails, Product } from './types';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Checkout from './pages/Checkout';
import Upsell from './pages/Upsell';
import Downsell from './pages/Downsell';
import OrderConfirmed from './pages/OrderConfirmed';
import TrackOrder from './pages/TrackOrder';
import Dashboard from './pages/Dashboard';
import Contact from './pages/Contact';

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>('HOME');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentOrder, setCurrentOrder] = useState<OrderDetails | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Global toast helper
  const triggerToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
  };

  // Auto-dismiss toast
  const dismissToast = () => setToast(null);

  // Helper to add products to global checkout cart
  const addToCart = (product: Product, size?: string) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === (size || 'M')
      );

      if (existingItemIndex > -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += 1;
        return updatedCart;
      } else {
        return [
          ...prevCart,
          {
            product,
            quantity: 1,
            selectedColor: product.color || 'Charcoal Grey',
            selectedSize: size || 'M'
          }
        ];
      }
    });
    triggerToast(`"${product.name}" (${size || 'M'}) added to your shopping bag.`, 'success');
  };

  // Auto dismiss side effect
  useState(() => {
    const checkTimer = setInterval(() => {
      if (toast) {
        // Just let timeout dismiss
      }
    }, 1000);
    return () => clearInterval(checkTimer);
  });

  // Determine if a page is transactional (uses specialized minimalist footers)
  const isTransactionalPage = ['CHECKOUT', 'ORDER_CONFIRMED', 'UPSELL', 'DOWNSELL'].includes(activePage);

  // Transition animations for screen shifts
  const pageVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.3, ease: 'easeIn' } }
  };

  return (
    <div className="bg-background text-on-surface font-sans antialiased min-h-screen flex flex-col justify-between selection:bg-primary-container selection:text-on-primary-container">
      {/* Universal header navigation */}
      <Navigation
        activePage={activePage}
        setActivePage={setActivePage}
        cart={cart}
        setCart={setCart}
        setCurrentOrder={setCurrentOrder}
        triggerToast={triggerToast}
      />

      {/* Slide / Fade Screen Area */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {activePage === 'HOME' && (
              <Home setActivePage={setActivePage} addToCart={addToCart} />
            )}
            {activePage === 'PRODUCT_DETAILS' && (
              <ProductDetails setActivePage={setActivePage} addToCart={addToCart} triggerToast={triggerToast} />
            )}
            {activePage === 'CHECKOUT' && (
              <Checkout
                activePage={activePage}
                setActivePage={setActivePage}
                cart={cart}
                setCart={setCart}
                setCurrentOrder={setCurrentOrder}
                triggerToast={triggerToast}
              />
            )}
            {activePage === 'UPSELL' && (
              <Upsell
                setActivePage={setActivePage}
                currentOrder={currentOrder}
                setCurrentOrder={setCurrentOrder}
                triggerToast={triggerToast}
              />
            )}
            {activePage === 'DOWNSELL' && (
              <Downsell
                setActivePage={setActivePage}
                currentOrder={currentOrder}
                setCurrentOrder={setCurrentOrder}
                triggerToast={triggerToast}
              />
            )}
            {activePage === 'ORDER_CONFIRMED' && (
              <OrderConfirmed setActivePage={setActivePage} currentOrder={currentOrder} triggerToast={triggerToast} />
            )}
            {activePage === 'TRACK_ORDER' && <TrackOrder setActivePage={setActivePage} triggerToast={triggerToast} />}
            {activePage === 'DASHBOARD' && (
              <Dashboard setActivePage={setActivePage} addToCart={addToCart} triggerToast={triggerToast} />
            )}
            {activePage === 'CONTACT' && <Contact setActivePage={setActivePage} triggerToast={triggerToast} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating Modern Toast Notification */}
      <AnimatePresence>
        {toast && (
          <ToastContainer toast={toast} onClose={dismissToast} />
        )}
      </AnimatePresence>

      {/* Conditionally render standard footer. Transactional pages have their footers integrated directly */}
      {!isTransactionalPage && <Footer setActivePage={setActivePage} />}
    </div>
  );
}

// Minimalist designer Toast popup component
interface ToastContainerProps {
  toast: { message: string; type: 'success' | 'info' | 'error' };
  onClose: () => void;
}
function ToastContainer({ toast, onClose }: ToastContainerProps) {
  useState(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: -40, scale: 0.92, x: '-50%' }}
      animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
      exit={{ opacity: 0, y: -20, scale: 0.95, x: '-50%' }}
      transition={{ type: 'spring', damping: 22, stiffness: 280 }}
      style={{ left: '50%' }}
      className="fixed top-24 z-50 bg-inverse-surface/95 backdrop-blur-md text-inverse-on-surface px-xl py-[1.12rem] rounded-xl shadow-[0_10px_35px_rgba(0,0,0,0.15)] flex items-center gap-md border border-outline-variant/15 min-w-[340px] max-w-[90vw]"
    >
      <span className={`material-symbols-outlined text-xl ${
        toast.type === 'success' ? 'text-primary' : toast.type === 'error' ? 'text-error' : 'text-on-primary-container'
      }`}>
        {toast.type === 'success' ? 'check_circle' : toast.type === 'error' ? 'error' : 'info'}
      </span>
      <span className="font-sans text-[12px] tracking-wide font-medium flex-grow">{toast.message}</span>
      <button onClick={onClose} className="opacity-60 hover:opacity-100 transition-opacity cursor-pointer p-1 rounded-full hover:bg-white/10">
        <span className="material-symbols-outlined text-sm block">close</span>
      </button>
    </motion.div>
  );
}
