import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { motion } from 'motion/react';
import { ActivePage, CartItem, OrderDetails } from '../types';

interface CheckoutProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  cart: CartItem[];
  setCart: Dispatch<SetStateAction<CartItem[]>>;
  setCurrentOrder: (order: OrderDetails) => void;
  triggerToast?: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export default function Checkout({
  setActivePage,
  cart,
  setCart,
  setCurrentOrder,
  triggerToast
}: CheckoutProps) {
  const [email, setEmail] = useState('alex@example.com');
  const [firstName, setFirstName] = useState('Alex');
  const [lastName, setLastName] = useState('Thorne');
  const [address, setAddress] = useState('123 Minimalism St');
  const [city, setCity] = useState('New York');
  const [zip, setZip] = useState('10011');
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fallback demo items if checkout loaded empty
  const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([]);

  useEffect(() => {
    if (cart.length > 0) {
      setCheckoutItems(cart);
    } else {
      // Default premium items to make the checkout screen gorgeous
      setCheckoutItems([
        {
          product: {
            id: 'signature_cashmere',
            name: 'Signature Cashmere Sweater',
            price: 295,
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUdaN-fQqHRWXclDGUiD5t17f7aChfQTml3cvRpuWvU_O68c0NckK6cLcbplFy8YT6Yo6M969YclGyLnvkql2J_nkvxQo93HMea6QoLmBnDkst4B3RjlTqIJ_D8Iwx45yoTYstqKMuUskvjc194K9hhu6B2xM0VuYyTp1jVTs0am3L89QylTa7pKC6_1YV8N8oY93PRR6n8zhmNoUkaSx3J_yTq_mn0J_0RNyw-MOmCIC04SZm2I9tr3MHcW940GYqhVPbZWJZvAa5',
            rating: 4.9,
            reviewsCount: 221
          },
          quantity: 1,
          selectedColor: 'Charcoal Grey',
          selectedSize: 'Large'
        },
        {
          product: {
            id: 'leather_loafers',
            name: 'Artisan Leather Loafers',
            price: 133,
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLgNasXD04ozalRfjy2iZ7UiKtVKsUkiYYB5ILo9zjuoPZxkTvMG1ccxbNFKdLxhIjuiOi90vV8FyBrpWL2jJ2k7SdIwUxr8oY3waxrAkWE_x60gat33kMH733T43YrP8wsSQayJUBA-Ro_YSDKG4mxVh4oJEFGYti8Dx400xixgggLkDGLab84tFygQq-AhrouahilugR3ZrOplTRWhgj750K1EeGY0zQ1Ka-BA_Jh55LC42EFuYRC1yxDrz9H-NG7TbkCJtfJmFC',
            rating: 4.7,
            reviewsCount: 65
          },
          quantity: 1,
          selectedColor: 'Cognac',
          selectedSize: '10'
        }
      ]);
    }
  }, [cart]);

  const subtotal = checkoutItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discount = subtotal * (discountPercent / 100);
  const discountedSubtotal = subtotal - discount;
  const shipping = discountedSubtotal > 200 ? 0 : 15;
  const tax = discountedSubtotal * 0.0825; // 8.25% NY sales tax
  const total = discountedSubtotal + shipping + tax;

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'WELCOME10') {
      setDiscountPercent(10);
      if (triggerToast) {
        triggerToast('Promo code WELCOME10 applied! 10% discount subtracted from your order.', 'success');
      } else {
        alert('Promo code WELCOME10 applied! 10% discount subtracted from your order.');
      }
    } else {
      if (triggerToast) {
        triggerToast('Invalid coupon. Try WELCOME10 for 10% off.', 'error');
      } else {
        alert('Invalid code. Try using WELCOME10 for 10% off.');
      }
    }
  };

  const handlePay = () => {
    if (!email || !firstName || !lastName || !address || !city || !zip) {
      if (triggerToast) {
        triggerToast('Please fill out all shipping details before proceeding.', 'error');
      } else {
        alert('Please fill out all shipping details before proceeding.');
      }
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      // Create and save final purchase order details
      const finalOrder: OrderDetails = {
        orderNumber: 'TR-8942',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        items: checkoutItems,
        subtotal,
        tax,
        shipping,
        total,
        shippingAddress: {
          firstName,
          lastName,
          email,
          address,
          city,
          zip
        }
      };

      setCurrentOrder(finalOrder);
      setIsProcessing(false);
      // Clear physical shopping cart upon order checkout submission
      setCart([]);
      // Proceed to the premium upsell flow
      setActivePage('UPSELL');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2000);
  };

  return (
    <div className="pt-24 max-w-container-max mx-auto px-gutter py-xl bg-background">
      {/* Universal Backward Navigation Button */}
      <div className="mb-md">
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
        {/* Left Column: Checkout Forms */}
        <div className="lg:col-span-7 space-y-xl">
          {/* Section 1: Customer & Shipping */}
          <section className="space-y-lg">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-xl md:text-2xl text-on-surface">1. Shipping Information</h2>
              <span className="text-primary font-sans text-xs font-semibold tracking-wide uppercase">Step 1 of 2</span>
            </div>
            <div className="space-y-md">
              {/* Email */}
              <div className="grid grid-cols-1 gap-xs">
                <label className="font-sans text-[10px] tracking-wider font-bold text-on-surface-variant uppercase" htmlFor="email">
                  EMAIL ADDRESS
                </label>
                <input
                  className="w-full bg-surface-container border border-outline-variant rounded p-sm font-sans text-body-sm text-on-surface outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                  id="email"
                  type="email"
                  placeholder="alex@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Name row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                <div className="grid grid-cols-1 gap-xs">
                  <label className="font-sans text-[10px] tracking-wider font-bold text-on-surface-variant uppercase" htmlFor="first-name">
                    FIRST NAME
                  </label>
                  <input
                    className="w-full bg-surface-container border border-outline-variant rounded p-sm font-sans text-body-sm text-on-surface outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                    id="first-name"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 gap-xs">
                  <label className="font-sans text-[10px] tracking-wider font-bold text-on-surface-variant uppercase" htmlFor="last-name">
                    LAST NAME
                  </label>
                  <input
                    className="w-full bg-surface-container border border-outline-variant rounded p-sm font-sans text-body-sm text-on-surface outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                    id="last-name"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              {/* Street Address */}
              <div className="grid grid-cols-1 gap-xs">
                <label className="font-sans text-[10px] tracking-wider font-bold text-on-surface-variant uppercase" htmlFor="address">
                  STREET ADDRESS
                </label>
                <input
                  className="w-full bg-surface-container border border-outline-variant rounded p-sm font-sans text-body-sm text-on-surface outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                  id="address"
                  type="text"
                  placeholder="123 Minimalism St"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              {/* City and Zip */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
                <div className="md:col-span-2 grid grid-cols-1 gap-xs">
                  <label className="font-sans text-[10px] tracking-wider font-bold text-on-surface-variant uppercase" htmlFor="city">
                    CITY
                  </label>
                  <input
                    className="w-full bg-surface-container border border-outline-variant rounded p-sm font-sans text-body-sm text-on-surface outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                    id="city"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 gap-xs">
                  <label className="font-sans text-[10px] tracking-wider font-bold text-on-surface-variant uppercase" htmlFor="zip">
                    POSTAL CODE
                  </label>
                  <input
                    className="w-full bg-surface-container border border-outline-variant rounded p-sm font-sans text-body-sm text-on-surface outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                    id="zip"
                    type="text"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Payment (Stripe-inspired interface) */}
          <section className="pt-lg border-t border-outline-variant/30 space-y-lg">
            <h2 className="font-display font-bold text-xl md:text-2xl text-on-surface">2. Payment Method</h2>
            <div className="p-lg bg-surface-container-low rounded-xl border border-outline-variant/30 shadow-sm">
              <div className="space-y-md">
                <div className="grid grid-cols-1 gap-xs">
                  <label className="font-sans text-[10px] tracking-wider font-bold text-on-surface-variant uppercase">
                    CARD INFORMATION
                  </label>
                  <div className="relative w-full bg-surface-container-lowest border border-outline-variant/60 px-md py-sm rounded flex items-center gap-sm">
                    <span className="material-symbols-outlined text-on-surface-variant text-xl">credit_card</span>
                    <input
                      className="bg-transparent border-none focus:ring-0 w-full font-mono text-body-sm text-on-surface outline-none"
                      placeholder="1234 5678 9101 1121"
                      type="text"
                      maxLength={19}
                    />
                    <div className="flex gap-sm text-body-sm text-on-surface-variant font-mono">
                      <input className="bg-transparent border-none focus:ring-0 w-14 text-center outline-none" placeholder="MM/YY" type="text" maxLength={5} />
                      <input className="bg-transparent border-none focus:ring-0 w-10 text-center outline-none" placeholder="CVC" type="text" maxLength={3} />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-sm pt-sm">
                  <input
                    defaultChecked
                    className="w-4 h-4 text-primary bg-surface border-outline-variant rounded focus:ring-primary/20 accent-primary"
                    id="billing-same"
                    type="checkbox"
                  />
                  <label className="font-sans text-body-sm text-on-surface-variant font-medium cursor-pointer" htmlFor="billing-same">
                    Billing address same as shipping
                  </label>
                </div>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handlePay}
              disabled={isProcessing}
              className="w-full bg-inverse-surface text-on-primary py-md px-xl rounded-lg font-display font-semibold text-headline-sm hover:opacity-90 transition-all flex items-center justify-center gap-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Processing Payment...</span>
                </>
              ) : (
                <>
                  <span>Pay ${total.toFixed(2)}</span>
                  <span className="material-symbols-outlined">arrow_forward</span>
                </>
              )}
            </motion.button>

            {/* Trust Badges */}
            <div className="mt-lg flex flex-wrap justify-center md:justify-start gap-lg opacity-65 grayscale hover:grayscale-0 transition-all duration-300">
              <div className="flex items-center gap-xs">
                <span className="material-symbols-outlined text-primary text-xl">verified_user</span>
                <span className="font-sans text-[10px] font-bold tracking-widest text-on-surface">SSL SECURE CONNECTION</span>
              </div>
              <div className="flex items-center gap-xs">
                <span className="material-symbols-outlined text-primary text-xl">shield</span>
                <span className="font-sans text-[10px] font-bold tracking-widest text-on-surface">ENCRYPTED GATEWAY</span>
              </div>
              <div className="flex items-center gap-xs">
                <span className="material-symbols-outlined text-primary text-xl">history</span>
                <span className="font-sans text-[10px] font-bold tracking-widest text-on-surface">30-DAY ASSURED RETURN</span>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Order Summary */}
        <aside className="lg:col-span-5">
          <div className="sticky top-28 bg-surface-container-low p-lg rounded-xl border border-outline-variant/30 shadow-sm space-y-lg">
            <h3 className="font-display font-bold text-headline-sm text-on-surface border-b border-outline-variant/30 pb-sm">Your Order</h3>
            <div className="space-y-md max-h-[300px] overflow-y-auto no-scrollbar">
              {checkoutItems.map((item, idx) => (
                <div key={idx} className="flex gap-md">
                  <div className="relative h-24 w-20 flex-shrink-0 bg-surface-container overflow-hidden rounded-lg border border-outline-variant/20 shadow-sm">
                    <img className="w-full h-full object-cover" src={item.product.image} alt={item.product.name} />
                  </div>
                  <div className="flex flex-col justify-between py-xs flex-grow">
                    <div>
                      <h4 className="font-display font-semibold text-body-md text-on-surface leading-tight">
                        {item.product.name}
                      </h4>
                      <p className="text-body-sm text-on-surface-variant font-medium mt-xs">
                        {item.selectedColor || 'Neutral'} • Size {item.selectedSize || 'M'} • Qty {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-body-md text-on-surface">${item.product.price * item.quantity}.00</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Price breakdown details */}
            <div className="pt-md border-t border-outline-variant/30 space-y-sm font-sans text-body-sm">
              <div className="flex justify-between">
                <span className="text-on-surface-variant font-medium">Subtotal</span>
                <span className="text-on-surface font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount (10%)</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-on-surface-variant font-medium">Shipping</span>
                <span className="text-on-surface font-semibold">
                  {shipping === 0 ? 'Complimentary' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant font-medium">Estimated Tax</span>
                <span className="text-on-surface font-semibold">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-md text-headline-sm font-bold border-t border-outline-variant/50">
                <span className="text-on-surface font-display">Total</span>
                <span className="text-primary font-display">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Promo code integration */}
            <div className="pt-md">
              <div className="flex gap-sm">
                <input
                  className="flex-grow bg-surface border border-outline-variant rounded px-md py-sm text-body-sm outline-none transition-all focus:border-primary"
                  placeholder="Promo code (e.g. WELCOME10)"
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <button
                  onClick={handleApplyPromo}
                  className="px-md bg-surface-container-highest hover:bg-outline-variant transition-colors text-[10px] font-sans font-bold uppercase tracking-wider rounded cursor-pointer"
                >
                  APPLY
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
