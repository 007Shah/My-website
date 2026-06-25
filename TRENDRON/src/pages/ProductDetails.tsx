import { useState } from 'react';
import { motion } from 'motion/react';
import { ActivePage, Product, Review } from '../types';

interface ProductDetailsProps {
  setActivePage: (page: ActivePage) => void;
  addToCart: (product: Product, size?: string) => void;
  triggerToast?: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export default function ProductDetails({ setActivePage, addToCart, triggerToast }: ProductDetailsProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('S');
  const [selectedColor, setSelectedColor] = useState('Charcoal Grey');
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'shipping'>('overview');

  const product: Product = {
    id: 'minimalist_blazer',
    name: 'The Minimalist Blazer',
    price: 129,
    rating: 4.8,
    reviewsCount: 124,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCht-EiYXpJi09oYl05KuNpW5oy8JajuoYzmHpDww1_fYcV85p3XfdFWbYNAnRG8fdSs5im2rW8FKdasHSSwFDBLwqdXHXrv4GUEnqUcN2sK-exV3srhXY5Q85A-IT-vGAgWhzqBFGDfB53wRs2oT7mqD7XMi0lKE54QiuAq7OHAQUYY9Z6ngf-sY7hNGWAWpS5fKKaHrTMmnhvWYSRjLd473pCVUpiaRhhKFaV5kxrginSGt_9bv-hP36J0poxXXilzdOdfGvezVbP',
    description: 'Our Minimalist Blazer is the cornerstone of the modern capsule wardrobe. Engineered for versatility, it transitions seamlessly from a high-stakes boardroom to an evening at the gallery.'
  };

  const galleryImages = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCht-EiYXpJi09oYl05KuNpW5oy8JajuoYzmHpDww1_fYcV85p3XfdFWbYNAnRG8fdSs5im2rW8FKdasHSSwFDBLwqdXHXrv4GUEnqUcN2sK-exV3srhXY5Q85A-IT-vGAgWhzqBFGDfB53wRs2oT7mqD7XMi0lKE54QiuAq7OHAQUYY9Z6ngf-sY7hNGWAWpS5fKKaHrTMmnhvWYSRjLd473pCVUpiaRhhKFaV5kxrginSGt_9bv-hP36J0poxXXilzdOdfGvezVbP',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBqirJYVESWygY4zu2IA6Eyk7jgmnBjHWK-P3rcLKPONvsFbnqkLMwpx63X2kdBOiox85pDQ6ir23EoQ2669fDBGfshY2a_gXP7uMlvbSD5zuDOrIs--ZwB7UxBAOjWkhhLS0BGmk2BPG9JIFYMbhBEa_Khf-mWzrr7JH3NgmB_RxhMJUJRUboYfZpwHayEwEQRWucFTXxMK1cEXdmtD1wjmG85xCOkPqH-3Ug3lCiGAUCnkrprSO7wBOdBj1Ax7MM6nEzmGmZ7eViJ',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDckOA0SQGqFp1ZS40QmmnooDnPa6Xf_6MhqAWKJtqMfVrLqYfZYLJX3nMR24S0_LAy4T7GPpf9YkIP9Sn17LlzRwziQVaqeTv7iK_sdjAh8ROuWhm4hbotrxtORsM6PDQWPrBoR3RacSPh84IR_Izu-Vz5usznRVXfxUmE5rNi-fN-OuGmrU7tiujTxA9NBKwWz-YDF_9mbiU0qQAVnrEqZMeDYNcKaKEmb_pmEEQilfCTPAc82klMEL5rAJAD0CnYyRkbFhYnEPbc',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBh_PWQyQc3BQdLEqvmXVImZKbXxUugjFfMKEXg-u_FvDcQ0YAksRXo2M-EO2wekplbeJWfV-tGkcKCJFE71d9jwposB4maPOMqok7qoQOR9PzVtB04ZOtb4IAGT8lH0jg188LRwUcD3JJbvAKEhx-pOnDQ2FTgGFTCVNNharFYlUdzVMYcox47oMzkIC2xlfBtN9SP8gDNRWIXTcgTSq9XtbHCFu5euOElIQnQvOCwQGcCpSditDkcMRhbDQGjsSb--izS3h-JZ3F5',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD81tI-0o5gitUI2aGvd1iK1c6XnqYgF_ASGgHE0ZUp3arNiewlVqKwpeDAOy5ajdNq2fdkmCHQoNkKsHnNAf7dVzCpCjYkDxu5oKl2YDAirU74R2Qsbuz64p_shbqtyIlWT_JzZ11u5fW7w2BBdqL7xPljNYV_1VXqNr5vFlB-wsSMActaCyuqdx1rn1wLoLfDYCJRb5vNNvRXHK1XsdfOCLcn7YS_9aT4y9dtVQ0Xb25mYuGfrvFpDHGFJWU6WYTVTO2po3UyR5gw'
  ];

  const socialGallery = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBofZ9tssrF1MXiggSwz8kVqMIXvKdlZD-DF-s3TKEuxfH-82oGgOZv-4k7uHi19h4ySIvoXEm9ZIfcsngrYyRMbE_Qdq6NQPYXKqMdV9AvT0djD7yR27nMhZVrrA1SZ8vJp86dBKWKQaHpSNDXHvDsecUnpdRjFJhbqtroQmD0CnqCIN4lqeLrV8tbsLvVb4ZQOHMI5oE20eHKqbrcJe8DCBrfAVkXXXQXk9m5wyHj2QUxpdPHj4bF-szGAEGCgEknJIMFnHXgQOso',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCVaKCDRH8IMHbd-sJrkHV-3R4oVxC97K7AWJrHseJajHsx2ODWN3cnxBj6XaWb65-VwCFkMcG-iz0Rs_hon9XnAqplLi8npVsTVOEUFlOKTyTUyNit1-V3ZElTvprUubJxKj8npCaZGu3E5ccA4R-nP1nGJqp8yglR3jp0JfdnxZFUWxSZzl6Em0sjENzqzFGB69c3MOkZqfCy5vZu4m-_slsRXELIuD3NKK7KQTIaoc5ilfmpsU5lwdih9LlDa_w08J6iv3l-INiq',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCwDEkJKWdpMqcRAOVfV1GEdVdI9pRexO0OoKNkPJPmdkYgek6VOwlyKenpfs4UciioBE-IT9JUmcvqAmo8DWfxFUhYh2aGtL1jo5_plxUp5QLLgeGL2CiaGJ260Pcqptn9fKBNlJi1GMKde7L2dRzcimoQ89Ow4qe_bjzCG5Zj6eAGDmeVftJp4ntENgsLgL9Y2rbTyW2BuEpijuLOonu_YoguRo9SIApfZGSU52Wl-ZIeGoVFXgcpqZOlpkkqlmkGgFYeT2KRGHKU',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAqJ2RCLy2gMoUakmRnDVdalUtlsqSKkGqUuo5iM38py7L2rfdcpedO1OKC7FhoUYsJbNsFGJTtMEmWkK0ox6JzC12hRw41RxAuznyJWcrtwcrzrsjK9fAq6BiwtVk57_WXtfcQgLzQrBhuL0U1jX6pj2rmBxuJj9xxtp2wvvj-PkycUbO1WlqosQnn5A6fEq4Pi3M_onlYgISfFqJXYg5EXEphZKJlnm8yN8y_-nijhfyJOEbqSmWCTU0iXjUCiLbCkGKXq77bg2ye'
  ];

  const handleAddToCart = () => {
    addToCart(product, selectedSize);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize);
    setActivePage('CHECKOUT');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="pt-20">
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

      {/* Breadcrumbs */}
      <nav className="max-w-container-max mx-auto px-gutter py-sm">
        <ul className="flex items-center gap-xs font-sans text-[10px] md:text-label-caps text-on-surface-variant/60 font-semibold tracking-wider">
          <li>
            <button onClick={() => setActivePage('HOME')} className="hover:text-primary uppercase cursor-pointer">
              Home
            </button>
          </li>
          <li className="material-symbols-outlined text-[12px] text-outline-variant">chevron_right</li>
          <li className="uppercase">Collections</li>
          <li className="material-symbols-outlined text-[12px] text-outline-variant">chevron_right</li>
          <li className="text-on-surface uppercase font-bold">The Minimalist Blazer</li>
        </ul>
      </nav>

      {/* Product Hero Grid */}
      <section className="max-w-container-max mx-auto px-gutter grid grid-cols-1 md:grid-cols-12 gap-lg items-start mb-xl">
        {/* Left: Interactive Image Gallery */}
        <div className="md:col-span-7 flex flex-col gap-md">
          <div className="relative aspect-[4/5] bg-surface-container-low overflow-hidden rounded-3xl shadow-sm group">
            <motion.img
              key={selectedImage}
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full object-cover"
              src={galleryImages[selectedImage]}
              alt="The Minimalist Blazer"
            />
            {/* Sliding buttons inside image */}
            <button
              onClick={() => setSelectedImage((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-surface/80 backdrop-blur-md rounded-full shadow-md flex items-center justify-center border border-outline-variant/20 hover:bg-surface transition-all cursor-pointer opacity-0 group-hover:opacity-100"
            >
              <span className="material-symbols-outlined text-on-surface text-lg">chevron_left</span>
            </button>
            <button
              onClick={() => setSelectedImage((prev) => (prev + 1) % galleryImages.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-surface/80 backdrop-blur-md rounded-full shadow-md flex items-center justify-center border border-outline-variant/20 hover:bg-surface transition-all cursor-pointer opacity-0 group-hover:opacity-100"
            >
              <span className="material-symbols-outlined text-on-surface text-lg">chevron_right</span>
            </button>
          </div>
          <div className="grid grid-cols-5 gap-sm">
            {galleryImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`aspect-[4/5] bg-surface-container-low rounded-xl overflow-hidden cursor-pointer transition-all ${
                  selectedImage === i ? 'ring-2 ring-primary scale-[1.02]' : 'opacity-60 hover:opacity-100'
                }`}
              >
                <img className="w-full h-full object-cover" src={img} alt={`Detail ${i + 1}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Custom Options & Details */}
        <div className="md:col-span-5 md:sticky md:top-28 space-y-md">
          <div className="space-y-sm">
            <span className="font-sans text-[10px] tracking-[0.2em] font-bold text-primary uppercase">
              Limited Edition Series
            </span>
            <h1 className="font-display text-3xl md:text-4xl font-bold leading-tight text-on-surface">
              The Minimalist Blazer
            </h1>
            <div className="flex items-center gap-sm">
              <div className="flex text-primary">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className="material-symbols-outlined text-[18px]"
                    style={{ fontVariationSettings: i < 4 ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {i < 4 ? 'star' : 'star_half'}
                  </span>
                ))}
              </div>
              <span className="font-sans text-body-sm text-on-surface-variant font-medium">
                (4.8 / 124 Reviews)
              </span>
            </div>
            <p className="font-display text-2xl md:text-3xl font-bold text-primary">${product.price}.00</p>
          </div>

          <p className="font-sans text-body-md text-on-surface-variant leading-relaxed">
            {product.description}
          </p>

          <div className="pt-sm space-y-md border-t border-outline-variant/30">
            {/* Color Selector */}
            <div className="space-y-sm">
              <span className="font-sans text-label-caps text-on-surface-variant uppercase tracking-wider block font-bold">
                Color: {selectedColor}
              </span>
              <div className="flex gap-sm">
                {[
                  { name: 'Charcoal Grey', hex: '#343b48' },
                  { name: 'Midnight Obsidian', hex: '#1a1c1b' },
                  { name: 'Soft Cream', hex: '#f4f4f2' }
                ].map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-10 h-10 rounded-full border p-0.5 transition-all cursor-pointer ${
                      selectedColor === color.name
                        ? 'border-primary ring-2 ring-primary/20 scale-105'
                        : 'border-outline-variant opacity-60 hover:opacity-100'
                    }`}
                    title={color.name}
                  >
                    <span
                      className="block w-full h-full rounded-full border border-black/10"
                      style={{ backgroundColor: color.hex }}
                    ></span>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="space-y-sm">
              <div className="flex justify-between items-center">
                <span className="font-sans text-label-caps text-on-surface-variant uppercase tracking-wider block font-bold">
                  Select Size
                </span>
                <button
                  onClick={() => {
                    if (triggerToast) {
                      triggerToast('Size S corresponds to EU 38 / US 4.', 'info');
                    } else {
                      alert('Trendora Fit Concierge: Size S corresponds to EU 38 / US 4.');
                    }
                  }}
                  className="text-body-sm text-primary underline font-medium cursor-pointer"
                >
                  Size Guide
                </button>
              </div>
              <div className="grid grid-cols-4 gap-sm">
                {['XS', 'S', 'M', 'L'].map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`h-12 rounded flex items-center justify-center font-sans text-body-sm font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'border-2 border-primary bg-primary/5 text-primary'
                          : 'border border-outline-variant hover:border-primary text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-sm pt-md">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                className="w-full h-14 bg-on-surface text-surface font-sans text-xs font-bold uppercase tracking-wider rounded shadow-sm hover:opacity-90 transition-all cursor-pointer"
              >
                Add to Cart
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleBuyNow}
                className="w-full h-14 bg-primary text-on-primary font-sans text-xs font-bold uppercase tracking-wider rounded shadow-sm hover:opacity-95 transition-all cursor-pointer"
              >
                Buy Now
              </motion.button>
            </div>

            <div className="pt-md grid grid-cols-2 gap-md border-t border-outline-variant/30">
              <div className="flex items-center gap-sm">
                <span className="material-symbols-outlined text-primary text-xl">local_shipping</span>
                <span className="font-sans text-body-sm text-on-surface-variant font-medium">Free Shipping</span>
              </div>
              <div className="flex items-center gap-sm">
                <span className="material-symbols-outlined text-primary text-xl">sync</span>
                <span className="font-sans text-body-sm text-on-surface-variant font-medium">30-Day Returns</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Specifications Section */}
      <section className="bg-surface-container-low py-xl">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="flex border-b border-outline-variant/30 mb-lg overflow-x-auto no-scrollbar">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'specs', label: 'Specifications' },
              { id: 'shipping', label: 'Shipping & Returns' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-md px-md font-display font-bold text-body-md whitespace-nowrap cursor-pointer border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="min-h-[220px]">
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-lg"
              >
                <div className="space-y-md">
                  <h3 className="font-display text-xl md:text-2xl font-bold text-on-surface">
                    Sophistication in every stitch.
                  </h3>
                  <p className="font-sans text-body-md text-on-surface-variant leading-relaxed">
                    Designed to frame the body with architectural precision. Our Minimalist Blazer utilizes an Italian virgin wool blend with technical silk highlights, delivering a structural drape that is soft to the touch and wrinkle-resistant.
                  </p>
                  <ul className="space-y-sm">
                    <li className="flex items-center gap-sm">
                      <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                      <span className="font-sans text-body-sm text-on-surface-variant">Italian Virgin Wool Blend with soft satin inner lining</span>
                    </li>
                    <li className="flex items-center gap-sm">
                      <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                      <span className="font-sans text-body-sm text-on-surface-variant">Functional inner utility pocket for minimalist storage</span>
                    </li>
                  </ul>
                </div>
                <div className="aspect-video rounded-xl overflow-hidden shadow-sm bg-surface-container">
                  <img
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnjCu-UgkmoM3_82IXohccpp3vLr_TxVe4w_yTvT9oI18Mst8KUFX9bb6OPKJkoPVBVfVevBy-ygrZimYGC-msVMYGK45gAwo1CtGBdThddzF5x-l3YSR09esIy7rXu1VadTqTkHR6VhvmSxrFoUvF08rHevjY2CgibHT3HParZBA4iJ5YPoAj7rC8RK1xcpeY4wJ7nqb27tbADNMzbceTuRzk1MJMlBkmR7w0gPNrRdT48sl-gICyxAWB387YZwUlPo_7TnT3sfWI"
                    alt="Production process"
                  />
                </div>
              </motion.div>
            )}

            {activeTab === 'specs' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl space-y-md"
              >
                <div className="grid grid-cols-2 py-md border-b border-outline-variant/30">
                  <span className="font-sans text-label-caps text-on-surface-variant uppercase font-bold">Material</span>
                  <span className="font-sans text-body-sm font-semibold">80% Virgin Wool, 20% Technical Silk</span>
                </div>
                <div className="grid grid-cols-2 py-md border-b border-outline-variant/30">
                  <span className="font-sans text-label-caps text-on-surface-variant uppercase font-bold">Lining</span>
                  <span className="font-sans text-body-sm font-semibold">100% Cupro Satin</span>
                </div>
                <div className="grid grid-cols-2 py-md border-b border-outline-variant/30">
                  <span className="font-sans text-label-caps text-on-surface-variant uppercase font-bold">Buttons</span>
                  <span className="font-sans text-body-sm font-semibold">Genuine Horn Accents</span>
                </div>
                <div className="grid grid-cols-2 py-md border-b border-outline-variant/30">
                  <span className="font-sans text-label-caps text-on-surface-variant uppercase font-bold">Origin</span>
                  <span className="font-sans text-body-sm font-semibold">Designed in NY, Crafted in Milan Atelier</span>
                </div>
              </motion.div>
            )}

            {activeTab === 'shipping' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-lg"
              >
                <div className="flex gap-md">
                  <span className="material-symbols-outlined text-4xl text-primary mt-1">local_shipping</span>
                  <div>
                    <h4 className="font-display font-semibold text-body-md text-on-surface mb-xs">Standard Shipping</h4>
                    <p className="font-sans text-body-sm text-on-surface-variant leading-relaxed">
                      Enjoy complimentary worldwide carbon-neutral shipping on orders over $200. Delivery arrives in beautiful eco-friendly signature packaging within 3-5 business days.
                    </p>
                  </div>
                </div>
                <div className="flex gap-md">
                  <span className="material-symbols-outlined text-4xl text-primary mt-1">assignment_return</span>
                  <div>
                    <h4 className="font-display font-semibold text-body-md text-on-surface mb-xs">30-Day Returns</h4>
                    <p className="font-sans text-body-sm text-on-surface-variant leading-relaxed">
                      We offer free returns and exchanges. If the fit is not perfectly satisfying, print a pre-paid shipping label from your member dashboard and request an immediate exchange.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Community Gallery and Review List */}
      <section className="py-xl">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="flex flex-col md:flex-row justify-between items-end gap-md mb-lg">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-xs text-on-surface">
                Community Feedback
              </h2>
              <p className="font-sans text-body-md text-on-surface-variant">
                See how our global community styles the Minimalist Blazer.
              </p>
            </div>
            <button
              onClick={() => {
                if (triggerToast) {
                  triggerToast('Guest submissions are disabled. Please register to submit feedback.', 'error');
                } else {
                  alert('Reviews are closed for guest users. Please register to submit feedback.');
                }
              }}
              className="h-12 px-lg border border-on-surface font-sans text-xs font-bold uppercase tracking-wider hover:bg-on-surface hover:text-surface transition-all rounded-lg cursor-pointer"
            >
              Write a Review
            </button>
          </div>

          {/* Social styling showcase gallery */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-md mb-xl">
            {socialGallery.map((img, i) => (
              <div key={i} className="aspect-square rounded-lg overflow-hidden group relative shadow-sm">
                <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src={img} alt="Social review" />
                <div className="absolute inset-0 bg-on-surface/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="material-symbols-outlined text-surface text-2xl">visibility</span>
                </div>
              </div>
            ))}
            <div
              onClick={() => {
                if (triggerToast) {
                  triggerToast('Social image uploads are currently open only to verified brand ambassadors.', 'info');
                } else {
                  alert('Social integration requires account linking.');
                }
              }}
              className="aspect-square bg-surface-container-high rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-surface-container-highest transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-3xl text-outline mb-1">add_a_photo</span>
              <span className="font-sans text-label-caps text-on-surface uppercase font-bold text-[10px]">Add Yours</span>
            </div>
          </div>

          {/* Customer Review Texts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            {[
              {
                title: 'Perfect fit and finish.',
                content: "I've tried many blazers at this price point, but Trendora's quality is on another level. The wool feels incredibly premium and the fit is exactly as described.",
                author: 'Julian M.',
                days: '2 days ago',
                rating: 5,
                bg: 'bg-primary-container/20'
              },
              {
                title: 'Effortless elegance.',
                content: 'This has become my daily driver for meetings. It doesn\'t wrinkle easily and keeps its shape all day. Highly recommend for any professional wardrobe.',
                author: 'Sarah L.',
                days: '1 week ago',
                rating: 4,
                bg: 'bg-secondary-container/20'
              }
            ].map((review, idx) => (
              <div key={idx} className="p-md md:p-lg bg-surface-bright rounded-xl border border-outline-variant/30 shadow-sm space-y-sm">
                <div className="flex justify-between items-center">
                  <div className="flex text-primary">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className="material-symbols-outlined text-[16px]"
                        style={{ fontVariationSettings: i < review.rating ? "'FILL' 1" : "'FILL' 0" }}
                      >
                        star
                      </span>
                    ))}
                  </div>
                  <span className="font-sans text-body-sm text-on-surface-variant/60 font-medium">{review.days}</span>
                </div>
                <h4 className="font-display font-semibold text-body-md text-on-surface">{review.title}</h4>
                <p className="font-sans text-body-md text-on-surface-variant leading-relaxed">{review.content}</p>
                <div className="flex items-center gap-sm pt-sm">
                  <div className={`w-8 h-8 rounded-full ${review.bg} flex items-center justify-center font-bold text-xs text-on-surface`}>
                    {review.author[0]}
                  </div>
                  <span className="font-sans text-body-sm font-semibold text-on-surface">{review.author}</span>
                  <span className="material-symbols-outlined text-primary text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    verified
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
