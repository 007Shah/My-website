import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ActivePage, CartItem, Product } from '../types';

interface HomeProps {
  setActivePage: (page: ActivePage) => void;
  addToCart: (product: Product, size?: string) => void;
}

export default function Home({ setActivePage, addToCart }: HomeProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const featuredProducts: Product[] = [
    {
      id: 'structured_cashmere',
      name: 'Structured Cashmere',
      price: 240,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBksYBqLDWxAj9fT9MMXgdsUN3Rfr0cIW3WpWnuPs2gP-C7thVDULWJ2LxXVnv9qHpPp2Pb7ss_H3ewM2c_mBRiB5PsQxQO7FXr3H34DdhHPzZzsdq-IXVXtfTvA1oOLqV9a6pdMIwhf1Wr4SyV7HwgxEwLGnrQB4N-g2EaDaPPv6AwyuoGs1Pamf1c0PS7CoV-ZrDIPU5wnOPpNLD1s9d4GTP48lEMRtebDiqi-OBFe1V_BTcyk7Qhy8GGbetMqrCF95bCeLNBsZm1',
      rating: 4,
      reviewsCount: 42,
      category: 'Knitwear'
    },
    {
      id: 'arch_tote',
      name: 'The Arch Tote',
      price: 580,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7zAqpncpc-KjcpV7gRyGuNtGGxQVNZnloJIvrLXVCPZOFhHFl81hPzaXI_-wGbWJ0ce3vLobQAoaibtZ4DqwLsRzZICWqx1PqMwBz1atssUlB1RBOTUMJPEqHsjEocpGxO4B9lkKhas1HWS5CT0PD6RtXegYAsXZlQLHvZ3l5epAio-tMNi9X0xQanKyWfWlg-skObFQixOjd-sFHsa3IfMlznNAMKs4oR6tWqiizqvCmDw3GRfPjDFPF1vBLsYd3uIe_a5DdhknL',
      rating: 5,
      reviewsCount: 18,
      category: 'Leather Goods'
    },
    {
      id: 'series_01_sneaker',
      name: 'Series 01 Sneaker',
      price: 185,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOlwhvUOGLSKj6s0sGReATQReaAduC71S3EY6n2lB-m6aQMgPTTi_pHSmUSpqOshhmI26Eul-uJybRRvIkpYV_feg69DGxvqE-th_R_PY2I4FSZlSoaWOnzWt-Hxh5l150I9N88GzubjG2d1kq30FB9bjdDO5WQRl0mLP7sMkRNze_mA3qW_ySXc3I03kK7ndU01lDoCf93U3nnD-GlTHrRlWPP5UdPQEiLCSCQuKxS0f5N0i-8I-PGoVodgRwox3tgBUQu6g-dzif',
      rating: 4.5,
      reviewsCount: 89,
      category: 'Footwear'
    },
    {
      id: 'horizon_frame',
      name: 'Horizon Frame',
      price: 125,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAICqaIXaaUNkBh7puy--WG9l9i-ksmVtav3dCtAs4lheCZckPh6C35YD43bt_aUm2sm8vu7rZa7JuCcksOt1HGdRjDljKhkDfXd0JIl2ZeMFPNfy0r2BfXI26yZnwzrN5NYKXGLjOV0rncmgIuBtPqVB-fMsE_H0rmWmDiUgy3eeLBeqh372Z-2DuH-1S5ewr5UWnLqUBzOCam28orK1hoxmacgxIccLcB9-d5dKxYxMXJk2ZLUfuaSQhpjJBTq3QV_WFgM6MffhAW',
      rating: 4,
      reviewsCount: 25,
      category: 'Accessories'
    }
  ];

  const testimonials = [
    {
      text: "The quality of the cashmere is unmatched. It feels like a piece that will last a lifetime, not just a season.",
      author: "ELENA VORNE",
      role: "Verified Buyer"
    },
    {
      text: "Trendora has redefined my capsule wardrobe. The fit of the Series 01 sneakers is impeccable.",
      author: "MARCUS REED",
      role: "Verified Buyer"
    },
    {
      text: "Exquisite packaging and even better products. Shopping at Trendora feels like a luxury event.",
      author: "SARAH JENKINS",
      role: "Verified Buyer"
    }
  ];

  const handleTestimonialScroll = (direction: number) => {
    setCurrentSlide((prev) => {
      const next = prev + direction;
      if (next < 0) return testimonials.length - 1;
      if (next >= testimonials.length) return 0;
      return next;
    });
  };

  const handleNewsletterSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setIsSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setIsSubscribed(false), 4000);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  const heroContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.2
      }
    }
  };

  const heroItemVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <div className="pt-20 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-[85vh] md:h-[921px] overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <motion.img
            initial={{ scale: 1.15 }}
            animate={{ scale: 1.0 }}
            transition={{ duration: 2.2, ease: 'easeOut' }}
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhJbgwnpz1p2ALKLppyW0VA5Q_2ZWsZ1lTIDzJSt6D3M4Kew3WagT_dqzbSEhJ7ddAC6_BfCia83wLYRAOHUJaczUfVybLhNkbTwF1kr-i3eI2nyLiZAkoJsIXpUjEx4KmQq-V6kftMlgg5BlS8oLVnCIbm_zbqpmSkCnGja7EXXHKZ6SAofuS6aBC8TxCZXCOfHI7rsZQ2L_TmF98hOyio5CNjsn2OhrdsxThBGAS8Kw9viJNCb7h2A1ggzWxaPaoPXfRDAepo86Y"
            alt="Autumn Winter Collection"
          />
          <div className="absolute inset-0 bg-black/35 backdrop-blur-[2px]"></div>
        </div>

        <div className="relative z-10 max-w-container-max mx-auto px-gutter w-full text-white text-center">
          <motion.div
            variants={heroContainerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-5xl md:max-w-6xl mx-auto flex flex-col items-center justify-center space-y-md w-full"
          >
            <motion.span 
              variants={heroItemVariants}
              className="font-display text-xs md:text-sm tracking-[0.3em] uppercase block text-primary-container font-semibold"
            >
              Autumn Winter 2024
            </motion.span>
            
            <motion.h1 
              variants={heroItemVariants}
              className="font-display text-5xl md:text-8xl font-bold tracking-tight leading-none max-w-5xl drop-shadow-sm w-full"
            >
              Elevate Your Everyday
            </motion.h1>
            
            <motion.p 
              variants={heroItemVariants}
              className="font-sans text-body-lg md:text-2xl max-w-3xl opacity-90 leading-relaxed font-light"
            >
              Discover a curated collection of essentials designed for the modern individual who values architectural precision and effortless elegance.
            </motion.p>
            
            <motion.div variants={heroItemVariants} className="pt-sm">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActivePage('PRODUCT_DETAILS')}
                className="bg-primary hover:bg-primary-container text-white px-lg py-4 font-sans text-xs tracking-[0.15em] font-bold rounded-full shadow-xl cursor-pointer transition-all uppercase"
              >
                SHOP COLLECTION
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-xl bg-surface">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="flex justify-between items-end mb-xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-display text-2xl md:text-4xl font-bold mb-xs">
                Featured Essentials
              </h2>
              <p className="font-sans text-body-md text-on-surface-variant">
                Precision-cut pieces for the refined wardrobe.
              </p>
            </motion.div>
            <button
              onClick={() => setActivePage('PRODUCT_DETAILS')}
              className="font-sans text-xs font-bold border-b border-primary text-primary pb-1 hover:opacity-75 transition-opacity cursor-pointer"
            >
              VIEW ALL
            </button>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter"
          >
            {featuredProducts.map((product) => (
              <motion.div
                key={product.id}
                variants={itemVariants}
                className="group cursor-pointer flex flex-col justify-between"
                onClick={() => setActivePage('PRODUCT_DETAILS')}
              >
                <div>
                  <div className="relative aspect-[4/5] bg-surface-container-low mb-md overflow-hidden rounded-2xl shadow-[0px_4px_25px_rgba(0,0,0,0.05)] border border-outline-variant/10">
                    <img
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      src={product.image}
                      alt={product.name}
                    />
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-md">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product, 'M');
                        }}
                        className="w-full bg-surface/90 backdrop-blur-md text-on-surface py-sm font-sans text-xs font-bold rounded-xl shadow-md hover:bg-surface cursor-pointer tracking-wider"
                      >
                        QUICK ADD
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-display font-semibold text-body-md mb-xs">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-xs mb-xs">
                        <div className="flex text-primary">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span
                              key={i}
                              className="material-symbols-outlined text-[16px]"
                              style={{
                                fontVariationSettings: `'FILL' ${
                                  i < Math.floor(product.rating) ? '1' : '0'
                                }`
                              }}
                            >
                              star
                            </span>
                          ))}
                        </div>
                        <span className="text-body-sm text-on-surface-variant font-mono">
                          ({product.reviewsCount})
                        </span>
                      </div>
                    </div>
                    <span className="font-sans font-bold text-body-md">${product.price}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-xl bg-surface-container-low overflow-hidden">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="text-center mb-xl">
            <h2 className="font-display text-2xl md:text-3xl font-bold">Client Perspectives</h2>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden">
              <motion.div
                animate={{ x: `-${currentSlide * 100}%` }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="flex"
              >
                {testimonials.map((t, index) => (
                  <div key={index} className="w-full shrink-0 px-gutter">
                    <div className="bg-surface p-xl rounded-3xl border border-outline-variant/30 shadow-sm space-y-md text-center max-w-2xl mx-auto">
                      <div className="flex text-primary justify-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className="material-symbols-outlined text-lg"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            star
                          </span>
                        ))}
                      </div>
                      <p className="font-sans text-body-lg italic text-on-surface leading-relaxed">
                        "{t.text}"
                      </p>
                      <div>
                        <p className="font-display text-xs tracking-wider font-bold text-on-surface uppercase">
                          {t.author}
                        </p>
                        <p className="font-sans text-body-sm text-on-surface-variant">{t.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            <div className="flex flex-col items-center mt-xl gap-md">
              {/* Dot Indicators / Slider Buttons */}
              <div className="flex gap-xs">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      currentSlide === idx ? 'w-8 bg-primary' : 'w-2 bg-outline-variant hover:bg-outline'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              <div className="flex gap-md">
                <button
                  className="w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all duration-300 cursor-pointer"
                  onClick={() => handleTestimonialScroll(-1)}
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button
                  className="w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all duration-300 cursor-pointer"
                  onClick={() => handleTestimonialScroll(1)}
                >
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-xl bg-white relative overflow-hidden">
        <div className="max-w-container-max mx-auto px-gutter text-center relative z-10">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-display text-2xl md:text-4xl font-bold mb-md">
              Join the Trendora List
            </h2>
            <p className="font-sans text-body-md text-on-surface-variant mb-xl leading-relaxed">
              Be the first to know about new collection drops, exclusive editorial content, and private seasonal events.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-md max-w-lg mx-auto">
              <input
                className="flex-grow bg-surface-container-low border-none focus:ring-1 focus:ring-primary rounded px-md py-md font-sans text-body-sm text-on-surface placeholder-on-surface-variant/50 outline-none transition-all"
                placeholder="email@address.com"
                required
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
              />
              <button
                className="bg-on-surface text-surface px-xl py-md font-display text-xs tracking-wider font-bold rounded hover:opacity-90 transition-opacity cursor-pointer"
                type="submit"
              >
                SUBSCRIBE
              </button>
            </form>

            <AnimatePresence>
              {isSubscribed && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-primary font-bold text-body-sm mt-md"
                >
                  Welcome to our inner circle. We will be in touch shortly.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      </section>
    </div>
  );
}
