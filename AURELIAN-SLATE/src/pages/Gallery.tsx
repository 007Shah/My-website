import React from 'react';

const Gallery: React.FC = () => {
  const imageSeeds = [
    "luxury-restaurant-furniture-gold-velvet", "modern-dining-chair-obsidian-leather", "elegant-restaurant-table-setting-gold", "luxury-booth-seating-interior-dark", "designer-restaurant-lighting-fixture",
    "obsidian-dining-table-luxury-interior", "gold-accent-restaurant-chair-detail", "velvet-dining-sofa-luxury-interior", "marble-bar-counter-interior-luxury", "luxury-restaurant-cabinet-furniture-gold",
    "gourmet-plating-michelin-star-dish", "luxury-restaurant-dining-room-interior", "gold-leaf-wagyu-beef-plating", "obsidian-plate-risotto-gourmet", "fine-dining-appetizer-art-plating",
    "modern-restaurant-interior-design-luxury", "truffle-pasta-gourmet-dish", "caviar-serving-luxury-presentation", "chef-plating-dessert-precision-action", "luxury-cocktail-bar-interior-ambiance",
    "seafood-platter-fine-dining-luxury", "charcoal-grilled-lobster-dish", "molecular-gastronomy-dish-plating", "elegant-table-setting-restaurant-interior", "wine-cellar-interior-luxury-vault",
    "artisan-bread-basket-gourmet-luxury", "fresh-oysters-on-ice-luxury-plating", "gold-dusted-chocolate-cake-dessert", "luxury-restaurant-booth-seating-area", "chef-hands-plating-food-action",
    "scallops-with-gold-leaf-plating", "modern-kitchen-chef-action-luxury", "luxury-restaurant-entrance-interior-design", "exotic-fruit-dessert-plating-art", "aged-steak-presentation-luxury-dish",
    "crystal-glassware-restaurant-table-setting", "luxury-bar-counter-obsidian-stone", "gourmet-soup-pour-action-luxury", "fine-dining-salad-aesthetic-plating", "chef-torching-dessert-luxury-action",
    "luxury-restaurant-lighting-ambiance-interior", "saffron-risotto-plating-luxury", "wagyu-beef-tartare-gourmet-dish", "luxury-seafood-tower-presentation", "gold-leaf-macarons-display-luxury",
    "modern-restaurant-architecture-interior-design", "chef-plating-microgreens-precision", "luxury-wine-tasting-setup-interior", "obsidian-stone-food-presentation-luxury", "gourmet-lamb-chops-plating-luxury",
    "luxury-restaurant-private-room-interior", "fine-dining-pasta-detail-plating", "gold-leaf-sushi-luxury-presentation", "chef-preparing-seafood-luxury-action", "luxury-restaurant-bar-stools-interior",
    "gourmet-duck-breast-plating-luxury", "luxury-dessert-trolley-interior", "modern-restaurant-ceiling-design-luxury", "chef-plating-with-tweezers-action", "luxury-restaurant-floor-design-interior"
  ];

  const images = imageSeeds.map((seed, i) => ({
    url: `https://picsum.photos/seed/${seed}/${i % 2 === 0 ? '800/800' : (i % 3 === 0 ? '800/1200' : '1200/800')}`,
    title: seed.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }));

  return (
    <div className="py-20 space-y-20">
      <div className="text-center space-y-6">
        <h2 className="text-gold text-sm uppercase tracking-[0.6em] reveal">The Visual Narrative</h2>
        <h1 className="text-7xl font-display font-bold reveal">AESTHETIC <span className="gold-gradient">MOMENTS</span></h1>
        <p className="text-white/40 uppercase tracking-[0.3em] text-[10px] max-w-lg mx-auto leading-loose reveal">
          A curated visual journey through the intersection of obsidian depth and aurelian light.
        </p>
      </div>

      <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6 px-6 reveal">
        {images.map((img, i) => (
          <div 
            key={i} 
            className="relative group overflow-hidden rounded-[2rem] border border-white/10 break-inside-avoid glass hover:border-gold/40 transition-all duration-700 shadow-2xl"
          >
            <img 
              src={img.url} 
              alt={img.title} 
              className="w-full h-auto opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000 ease-out grayscale-[30%] group-hover:grayscale-0"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian/90 via-obsidian/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-10 backdrop-blur-[2px]">
              <div className="translate-y-6 group-hover:translate-y-0 transition-transform duration-700 ease-out">
                <span className="text-gold font-display text-xl tracking-widest uppercase block mb-2">{img.title}</span>
                <div className="h-[1px] w-12 bg-gold/50 mb-4" />
                <span className="text-white/40 text-[10px] uppercase tracking-[0.3em]">Aurelian Slate Archive</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center pt-32">
        <div className="inline-block px-8 py-4 glass rounded-full">
          <p className="text-white/20 text-[10px] uppercase tracking-[0.8em]">End of Visual Narrative</p>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
