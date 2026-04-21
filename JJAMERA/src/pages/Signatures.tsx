import React from 'react';
import { motion } from 'framer-motion';
import { PageTransition } from '../components/PageTransition';
import { MenuCard } from '../components/MenuCard';

const signatureDishes = [
  {
    id: 'wagyu-smash',
    title: "Double Smashed Wagyu",
    subtitle: "THE ULTIMATE PATTY",
    description: "Two 4oz premium wagyu beef patties, smashed to crispy perfection, layered with aged sharp cheddar, caramelized onions, and our secret truffle aioli on a toasted brioche bun.",
    price: "$21.99",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    features: [
      "Twin 4oz Premium Wagyu Patties",
      "Signature Truffle Aioli",
      "Artisan Brioche Bun",
      "Triple-Aged Cheddar"
    ]
  },
  {
    id: 'signature-broast',
    title: "Signature Injected Broast",
    subtitle: "DEEP FLAVOR CORE",
    description: "Our world-famous broast, marinated for 24 hours and individually injected to the bone with our proprietary liquid spice blend, then pressure-fried for maximum crispiness.",
    price: "$18.99",
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    features: [
      "Deep-Injection Marinade Technique",
      "Pressure-Fried Flaky Crust",
      "J Jamera Secret Spice Blend",
      "Locally Sourced Fresh Chicken"
    ]
  },
  {
    id: 'chicago-deep',
    title: "Classic Chicago Deep Dish",
    subtitle: "THE ARCHITECTURE OF PIZZA",
    description: "A monumental 2-inch deep buttery cornmeal crust stuffed with an outrageous amount of whole milk mozzarella, our signature spicy fennel sausage, and topped with rich, chunky crushed tomato sauce.",
    price: "$26.99",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    features: [
      "2-Inch Buttery Cornmeal Crust",
      "1lb Whole Milk Mozzarella",
      "Chunky San Marzano Tomato Sauce",
      "House-Made Spicy Fennel Sausage"
    ]
  }
];

export default function Signatures() {
  return (
    <PageTransition className="flex-grow pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
           className="text-center mb-24 mt-12"
        >
          <div className="w-12 h-1 bg-theme mx-auto rounded-full mb-6 transition-colors duration-500" />
          <h1 className="text-[52px] md:text-[72px] leading-[1.05] font-extrabold tracking-tight mb-6">
            Our <span className="text-theme transition-colors duration-500 font-black">Signatures</span>
          </h1>
          <p className="text-white/60 mx-auto max-w-2xl text-[16px] md:text-[18px] leading-[1.6] font-medium border-l border-theme/50 pl-6 text-left">
            Experience the culinary architecture that defines J Jamera. Each signature dish is a testament to our dedication to intense flavor, premium ingredients, and uncompromising technique.
          </p>
        </motion.div>

        <div className="flex flex-col gap-32">
          {signatureDishes.map((dish, index) => {
            const isEven = index % 2 === 0;
            return (
              <div key={dish.id} className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
                <motion.div 
                  initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ type: "spring", damping: 20 }}
                  className={`order-2 ${isEven ? 'lg:order-1' : 'lg:order-2'} flex flex-col justify-center`}
                >
                  <div className="flex items-center gap-3 mb-4">
                     <div className="w-6 h-[2px] bg-theme transition-colors duration-500 rounded-full"></div>
                     <span className="text-theme transition-colors duration-500 font-bold uppercase tracking-[0.2em] text-[11px]">{dish.subtitle}</span>
                  </div>
                  
                  <h2 className="text-[36px] md:text-[48px] font-extrabold mb-6 leading-[1.1] tracking-tight">{dish.title}</h2>
                  
                  <p className="text-[15px] text-white/70 leading-[1.8] mb-8 font-medium">
                    {dish.description}
                  </p>

                  <ul className="mb-10 space-y-3 grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                    {dish.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-white/80 text-[14px] font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-theme mt-1.5 shrink-0 transition-colors duration-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex justify-start">
                    <MenuCard 
                      title={dish.title}
                      description="Add this masterpiece to your order directly."
                      price={dish.price}
                      image={dish.image}
                      className="w-full sm:w-[350px]"
                    />
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8 }}
                  className={`order-1 ${isEven ? 'lg:order-2' : 'lg:order-1'} relative aspect-[4/5] md:aspect-square group rounded-[2rem] overflow-hidden shadow-2xl border border-gray-deep/50`}
                >
                  <div className="absolute inset-0 bg-theme/5 transition-colors duration-500 group-hover:bg-transparent z-10 pointer-events-none" />
                  <img 
                    src={dish.image} 
                    alt={dish.title} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </PageTransition>
  );
}
