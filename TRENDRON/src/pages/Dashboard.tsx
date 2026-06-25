import { useState, useRef, MouseEvent } from 'react';
import { motion } from 'motion/react';
import { ActivePage, Product } from '../types';

interface DashboardProps {
  setActivePage: (page: ActivePage) => void;
  addToCart: (product: Product, size?: string) => void;
  triggerToast?: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export default function Dashboard({ setActivePage, addToCart, triggerToast }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'downloads' | 'settings'>('dashboard');
  const carouselRef = useRef<HTMLDivElement>(null);

  const recommendedItems: Product[] = [
    {
      id: 'classic_loafers',
      name: 'Classic Leather Loafers',
      price: 210,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBeIVJjEr6pwVouzhr17Z1ONHL1DFhvqe-bybE8LsOKNXMAwMzrr2sbyJ2rMCvrMw44_ngHy2nLBVlBTxvhrj96TiVk9kRmR2S3Dy4Qorm4wdEIfoqL8dcsS2ZUeL6Ry3EHEKazu4L7wL4B1GGx_M-ySyVQ0WpGlPKKEClrL_5ltqUzq1vNjd46Xg18IsoO--ni1fF0lbT23jA2c2DtrNyXa1jEJjAQCZ2B0_5zDXn4ghXb0Hfsth-IXjNMKuRZP9qBQM9QKmYrb6RE',
      rating: 4.8,
      reviewsCount: 112,
      tags: ['BESTSELLER']
    },
    {
      id: 'titanium_watch',
      name: 'Titanium Chronograph',
      price: 450,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7PR0TTsFzWI8Jb_K9lz4Q24PliDbIAP_FuzxKHJQuDPT2hxnp1I2kk2Rri-GDJR2sdesaH0NUXhjoSpStRBQaO0rE_S3HORzaYSqjMe-gd0NQr1afxyhzLa2pXs1eIUTp2xAaVxk8R2aL8XzubnEKT_t2ZmmoRIsctKKopWfFdpuAWAdZpASWFdBVyMKWFJbw3mN_5XdzhNCyNHo4dby-iy-8iyXxVMuyyKfVV95Lw8erQRKc0OG2Vq6xe7L_KkvJoIXo2nJe3AEM',
      rating: 4.9,
      reviewsCount: 54,
      tags: ['NEW ARRIVAL']
    },
    {
      id: 'leather_portfolio',
      name: 'Grain Leather Portfolio',
      price: 185,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWftvcojMOg-QzI3sbxDfG8cHgpafqn-cGvkYLzChxkgycr5DttyzgAXa9E1W04gwF5oz5jF-VDHoMPjqz0Uu-hN6p_ZO734gAuBzSarYYdltryLnyb8dn09VSjrwYAKE5X7dOiZoMdPrsBb_6tlTfr2f3n0PHpmPEhho17oPJhf46sv0BmuNqh2L7mhXcmiJUQE_2NqLeklumFyWdxCTlKgDkgq0ewFloxau2k_uOgP29sPy2Hvi3P_Typ88Xcmiqe7-8LGtn3i-o',
      rating: 4.7,
      reviewsCount: 38,
      tags: ['LIMITED EDITION']
    },
    {
      id: 'knit_turtleneck',
      name: 'Heavy Knit Turtleneck',
      price: 160,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBc5_TuQhK2oFGUT2zc0ZG0YVaIJXcUzyc8nSHoZELZQRIhskvCPEKpYthkqaZ5NvZMrz8nxbCLgZgI_q0LW6VPNsxKP5HAPQ9dIjZrhntF3YAH3TFQCD3CMwhWMbwM1vrPw-s2kC6fMyid8BpHMhhrhPLgG4KlPbt3ANkcltHy_0KtpzRU73iTkxI0B3scyi_yQa6xJmvwdPCZPHolNozC5zlHfXl0cozqbCAryihNE3mOxll147uzSRK9LONG8OBFIJw5iC-mJ7Bw',
      rating: 4.8,
      reviewsCount: 92,
      tags: ['SEASONAL']
    }
  ];

  const [recommendScrollIndex, setRecommendScrollIndex] = useState(0);

  const handleScroll = () => {
    if (carouselRef.current) {
      const scrollLeft = carouselRef.current.scrollLeft;
      const index = Math.round(scrollLeft / 300);
      setRecommendScrollIndex(index);
    }
  };

  const scrollToItem = (index: number) => {
    if (carouselRef.current) {
      carouselRef.current.scrollTo({
        left: index * 300,
        behavior: 'smooth'
      });
    }
  };

  const handleCarouselScroll = (direction: number) => {
    if (carouselRef.current) {
      const scrollAmount = 300;
      carouselRef.current.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleLogout = (e: MouseEvent) => {
    e.preventDefault();
    if (confirm('Are you sure you want to log out of your Trendora account?')) {
      if (triggerToast) {
        triggerToast('Logged out of Trendora successfully.', 'info');
      } else {
        alert('Logging out...');
      }
      setActivePage('HOME');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="pt-32 pb-xl max-w-container-max mx-auto px-gutter bg-background">
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

      <div className="flex flex-col lg:flex-row gap-lg">
        {/* Sidebar Navigation */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="sticky top-32 space-y-md">
            <div className="mb-md">
              <h1 className="font-display font-bold text-headline-md text-on-surface">Hello, Alex</h1>
              <p className="text-on-surface-variant font-sans text-body-sm">Gold Tier Member • Since 2023</p>
            </div>
            <nav className="space-y-xs flex flex-row lg:flex-col overflow-x-auto no-scrollbar pb-sm lg:pb-0 gap-sm lg:gap-xs border-b border-outline-variant/20 lg:border-b-0">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: 'grid_view' },
                { id: 'orders', label: 'My Orders', icon: 'package_2' },
                { id: 'downloads', label: 'Downloads', icon: 'download' },
                { id: 'settings', label: 'Account Settings', icon: 'settings' }
              ].map((tab) => {
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-sm px-md py-sm rounded-lg font-sans text-body-sm font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                      isSelected
                        ? 'bg-primary-container/20 text-primary border-l-4 border-primary'
                        : 'text-on-surface-variant hover:text-primary hover:bg-surface-container'
                    }`}
                  >
                    <span
                      className="material-symbols-outlined text-lg"
                      style={{ fontVariationSettings: isSelected ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      {tab.icon}
                    </span>
                    <span>{tab.label}</span>
                  </button>
                );
              })}

              <div className="hidden lg:block pt-md mt-md border-t border-outline-variant/30">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-sm px-md py-sm text-error hover:bg-error-container/10 transition-all rounded-lg font-sans text-body-sm font-bold cursor-pointer text-left"
                >
                  <span className="material-symbols-outlined text-lg">logout</span>
                  <span>Log out</span>
                </button>
              </div>
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-grow min-w-0 space-y-xl overflow-hidden">
          {activeTab === 'dashboard' && (
            <>
              {/* Latest Purchase Section */}
              <section className="space-y-md">
                <h2 className="font-display font-bold text-headline-sm text-on-surface">Your Latest Purchase</h2>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
                  {/* Featured Product Card */}
                  <div className="md:col-span-8 bg-surface-container-lowest p-md rounded-3xl shadow-[0px_4px_25px_rgba(0,0,0,0.04)] border border-outline-variant/20 flex flex-col md:flex-row gap-md items-center">
                    <div className="w-full md:w-40 aspect-[4/5] bg-surface-container rounded-2xl overflow-hidden flex-shrink-0">
                      <img
                        className="w-full h-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7Zzg42j0f3DnPfm4_qVx7iKgaoGjJMnL1J4m55gpklMkgLQwwYaqb7XWqkj1796CvupBKD4rL26OY2-gZLyj5aqovyNi2MQHrEfqtkcxCMcZqRdaLvknHGmnc7i8iaQv4RWrq1brB3tPG8Vz4r3SFM-zD8T6aaoENt_0M2ENwoTMPNn9tjZi1f3phBGbW3rlzkQywL0FeDNfkK4LIdT5nEyXG5XffwqZcQCd-qWtWrI6OndjEUqqU4ZgQ7nw688nuZcaQ4FzIF-G1"
                        alt="Signature Cashmere Overcoat"
                      />
                    </div>
                    <div className="flex-grow space-y-sm text-center md:text-left">
                      <span className="px-sm py-0.5 bg-surface-container text-sans font-bold text-[9px] tracking-wider text-on-surface-variant rounded">
                        ORDER #TRD-8821
                      </span>
                      <h3 className="font-display font-bold text-headline-sm text-on-surface">
                        Signature Cashmere Overcoat
                      </h3>
                      <p className="text-on-surface-variant font-sans text-body-md">Midnight Blue • Size L</p>
                      <div className="flex flex-wrap gap-sm justify-center md:justify-start pt-sm">
                        <button
                          onClick={() => setActivePage('TRACK_ORDER')}
                          className="px-md py-base bg-inverse-surface text-on-primary font-sans text-[11px] font-bold tracking-wider uppercase rounded-full hover:opacity-90 transition-opacity flex items-center gap-xs cursor-pointer shadow-sm"
                        >
                          <span className="material-symbols-outlined text-lg">local_shipping</span>
                          Track Package
                        </button>
                        <button
                          onClick={() => {
                            if (triggerToast) {
                              triggerToast('Invoice downloaded successfully! (Simulated PDF download completed.)', 'success');
                            } else {
                              alert('Downloading PDF invoice for Order #TRD-8821');
                            }
                          }}
                          className="px-md py-base border border-outline-variant text-on-surface font-sans text-[11px] font-bold tracking-wider uppercase rounded-full hover:bg-surface-container transition-colors flex items-center gap-xs cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-lg">receipt_long</span>
                          Invoice
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Digital Style Guide product card */}
                  <div className="md:col-span-4 bg-surface-container p-md md:p-lg rounded-3xl border border-outline-variant/30 flex flex-col justify-between shadow-sm space-y-md">
                    <div>
                      <span className="px-sm py-0.5 bg-surface-container-highest text-sans font-bold text-[9px] tracking-wider text-on-surface-variant rounded uppercase">
                        Digital Access
                      </span>
                      <h3 className="font-display font-bold text-headline-sm text-on-surface mt-sm">Seasonal Style Guide</h3>
                      <p className="text-on-surface-variant font-sans text-body-sm mt-xs leading-relaxed">
                        Winter 2024 Capsule Collection Details & Minimalist Styling Advice from our designers.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        if (triggerToast) {
                          triggerToast('Style Guide downloaded successfully! (Simulated PDF download completed.)', 'success');
                        } else {
                          alert('Downloading Trendora Winter 2024 Style Guide PDF');
                        }
                      }}
                      className="w-full px-md py-base bg-primary text-on-primary font-sans text-[10px] font-bold uppercase tracking-wider rounded-full hover:opacity-90 transition-all flex items-center justify-center gap-xs cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-lg">download</span>
                      Download PDF
                    </button>
                  </div>
                </div>
              </section>

              {/* Account Status Stats grid */}
              <section className="grid grid-cols-1 sm:grid-cols-3 gap-md">
                <div className="bg-surface-container-low p-md rounded-3xl border border-outline-variant/20 shadow-sm flex items-center gap-md hover:scale-[1.01] transition-transform">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>redeem</span>
                  </div>
                  <div>
                    <p className="font-sans text-[9px] font-bold text-on-surface-variant tracking-widest uppercase">REWARDS POINTS</p>
                    <p className="font-display font-bold text-headline-sm text-on-surface">1,240 pts</p>
                  </div>
                </div>

                <div className="bg-surface-container-low p-md rounded-3xl border border-outline-variant/20 shadow-sm flex items-center gap-md hover:scale-[1.01] transition-transform">
                  <div className="w-12 h-12 rounded-full bg-secondary/15 flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                  </div>
                  <div>
                    <p className="font-sans text-[9px] font-bold text-on-surface-variant tracking-widest uppercase">WISHLIST SAVED</p>
                    <p className="font-display font-bold text-headline-sm text-on-surface">8 Items</p>
                  </div>
                </div>

                <div className="bg-surface-container-low p-md rounded-3xl border border-outline-variant/20 shadow-sm flex items-center gap-md hover:scale-[1.01] transition-transform">
                  <div className="w-12 h-12 rounded-full bg-tertiary/15 flex items-center justify-center text-tertiary">
                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>mail</span>
                  </div>
                  <div>
                    <p className="font-sans text-[9px] font-bold text-on-surface-variant tracking-widest uppercase">NOTIFICATIONS</p>
                    <p className="font-display font-bold text-headline-sm text-on-surface">2 New</p>
                  </div>
                </div>
              </section>

              {/* Recommended Carousel Section */}
              <section className="space-y-md">
                <div className="flex items-center justify-between border-b border-outline-variant/10 pb-xs">
                  <h2 className="font-display font-bold text-headline-sm text-on-surface">Recommended for You</h2>
                  <div className="flex gap-sm">
                    <button
                      className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-container transition-colors cursor-pointer"
                      onClick={() => handleCarouselScroll(-1)}
                    >
                      <span className="material-symbols-outlined text-lg">chevron_left</span>
                    </button>
                    <button
                      className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-container transition-colors cursor-pointer"
                      onClick={() => handleCarouselScroll(1)}
                    >
                      <span className="material-symbols-outlined text-lg">chevron_right</span>
                    </button>
                  </div>
                </div>

                <div
                  ref={carouselRef}
                  onScroll={handleScroll}
                  className="flex gap-md overflow-x-auto no-scrollbar scroll-smooth pb-base"
                >
                  {recommendedItems.map((item) => (
                    <div
                      key={item.id}
                      className="min-w-[280px] w-[280px] group cursor-pointer flex flex-col justify-between"
                      onClick={() => {
                        setActivePage('PRODUCT_DETAILS');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      <div>
                        <div className="aspect-[4/5] bg-surface-container rounded-3xl overflow-hidden mb-sm relative border border-outline-variant/20 shadow-sm">
                          <img
                            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                            src={item.image}
                            alt={item.name}
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(item, 'One Size');
                            }}
                            className="absolute bottom-md right-md w-11 h-11 bg-surface rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:text-on-primary cursor-pointer border border-black/5"
                          >
                            <span className="material-symbols-outlined text-lg">add_shopping_cart</span>
                          </button>
                        </div>
                        {item.tags && (
                          <span className="font-sans text-[8px] tracking-wider font-bold text-on-surface-variant block uppercase">
                            {item.tags[0]}
                          </span>
                        )}
                        <h4 className="font-display font-semibold text-body-md text-on-surface leading-tight">
                          {item.name}
                        </h4>
                      </div>
                      <p className="text-primary font-sans font-bold text-body-md mt-xs">${item.price}.00</p>
                    </div>
                  ))}
                </div>

                {/* Slider Button Dots */}
                <div className="flex justify-center gap-xs mt-sm pb-md">
                  {recommendedItems.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => scrollToItem(idx)}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        recommendScrollIndex === idx ? 'w-8 bg-primary' : 'w-2 bg-outline-variant hover:bg-outline'
                      }`}
                      aria-label={`Go to item ${idx + 1}`}
                    />
                  ))}
                </div>
              </section>
            </>
          )}

          {activeTab === 'orders' && (
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white p-lg rounded-xl border border-outline-variant/30 space-y-md"
            >
              <h2 className="font-display font-bold text-headline-sm text-on-surface">Your Orders</h2>
              <div className="divide-y divide-outline-variant/20">
                {[
                  { id: 'TRD-8821', date: 'Sept 10, 2024', total: '$642.00', status: 'In Transit' },
                  { id: 'TRD-7614', date: 'June 04, 2024', total: '$185.00', status: 'Delivered' }
                ].map((ord) => (
                  <div key={ord.id} className="py-md flex items-center justify-between gap-md">
                    <div className="space-y-xs">
                      <p className="font-display font-semibold text-body-md text-on-surface">Order {ord.id}</p>
                      <p className="font-sans text-body-sm text-on-surface-variant">{ord.date} • Total: {ord.total}</p>
                    </div>
                    <div className="flex items-center gap-sm">
                      <span className={`px-sm py-1 rounded-full font-sans text-[10px] font-bold tracking-wider uppercase ${
                        ord.status === 'In Transit' ? 'bg-primary-container/20 text-primary' : 'bg-surface-container text-on-surface-variant'
                      }`}>
                        {ord.status}
                      </span>
                      <button
                        onClick={() => setActivePage('TRACK_ORDER')}
                        className="text-primary font-bold text-body-sm hover:underline cursor-pointer"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {activeTab === 'downloads' && (
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white p-lg rounded-xl border border-outline-variant/30 space-y-md"
            >
              <h2 className="font-display font-bold text-headline-sm text-on-surface">Digital Downloads</h2>
              <div className="divide-y divide-outline-variant/20">
                {[
                  { name: 'Trendora Autumn Winter 2024 Styling Manual.pdf', size: '12.4 MB' },
                  { name: 'Minimalist Wardrobe Organization Blueprint.pdf', size: '4.8 MB' }
                ].map((dl, idx) => (
                  <div key={idx} className="py-md flex items-center justify-between gap-md">
                    <div className="space-y-xs">
                      <p className="font-sans text-body-md font-semibold text-on-surface">{dl.name}</p>
                      <p className="font-sans text-body-sm text-on-surface-variant">Size: {dl.size}</p>
                    </div>
                    <button
                      onClick={() => {
                        if (triggerToast) {
                          triggerToast(`Downloading: ${dl.name} (Simulated download completed.)`, 'success');
                        } else {
                          alert(`Downloading: ${dl.name}`);
                        }
                      }}
                      className="px-md py-base bg-surface-container hover:bg-outline-variant transition-colors text-[10px] font-sans font-bold uppercase tracking-wider rounded cursor-pointer"
                    >
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {activeTab === 'settings' && (
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white p-lg rounded-xl border border-outline-variant/30 space-y-lg"
            >
              <h2 className="font-display font-bold text-headline-sm text-on-surface">Account Settings</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                if (triggerToast) {
                  triggerToast('Trendora profile and communications settings updated.', 'success');
                } else {
                  alert('Settings updated.');
                }
              }} className="space-y-md max-w-xl">
                <div className="grid grid-cols-2 gap-md">
                  <div className="space-y-xs">
                    <label className="font-sans text-[10px] tracking-wider font-bold text-on-surface-variant uppercase">First Name</label>
                    <input className="w-full bg-surface-container border border-outline-variant rounded p-sm text-body-sm outline-none" defaultValue="Alex" type="text" />
                  </div>
                  <div className="space-y-xs">
                    <label className="font-sans text-[10px] tracking-wider font-bold text-on-surface-variant uppercase">Last Name</label>
                    <input className="w-full bg-surface-container border border-outline-variant rounded p-sm text-body-sm outline-none" defaultValue="Thorne" type="text" />
                  </div>
                </div>
                <div className="space-y-xs">
                  <label className="font-sans text-[10px] tracking-wider font-bold text-on-surface-variant uppercase">Email Address</label>
                  <input className="w-full bg-surface-container border border-outline-variant rounded p-sm text-body-sm outline-none" defaultValue="alex@example.com" type="email" />
                </div>
                <button type="submit" className="px-lg py-md bg-inverse-surface text-on-primary rounded font-sans text-xs font-bold uppercase tracking-wider cursor-pointer">
                  Save Changes
                </button>
              </form>
            </motion.section>
          )}
        </div>
      </div>
    </div>
  );
}
