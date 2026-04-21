import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PageTransition } from '../components/PageTransition';
import { MenuCard } from '../components/MenuCard';

const menuItems = [
  {
    category: "Deep Dish Pizza",
    link: "/pizza",
    items: [
      { title: "Classic Chicago", desc: "Original Chicago style with extra cheese and chunky tomato sauce.", price: "$22.99", img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
      { title: "Spicy Meatball", desc: "Loaded with house-made spicy meatballs and fresh jalapeños.", price: "$25.99", img: "https://images.unsplash.com/photo-1604381536154-1a31c2de02f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
      { title: "Truffle Mushroom", desc: "Wild mushrooms, truffle oil, and aged mozzarella.", price: "$28.99", img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
      { title: "BBQ Chicken", desc: "Smoked chicken, red onions, cilantro, and tangy BBQ sauce.", price: "$24.99", img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    ]
  },
  {
    category: "Signature Broast",
    link: "/broast",
    items: [
      { title: "Original Injected", desc: "Our signature spicy injected broast, double fried for maximum crunch.", price: "$18.99", img: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
      { title: "Garlic Parmesan", desc: "Crispy broast coated in rich garlic butter and aged parmesan.", price: "$19.99", img: "https://images.unsplash.com/photo-1569691899455-88464f6d3ab1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
      { title: "Nashville Hot", desc: "Dipped in our fiery chili oil and served with pickles.", price: "$20.99", img: "https://images.unsplash.com/photo-1606851094655-b25cb281dbfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
      { title: "Honey Butter", desc: "Sweet and savory glaze over our crispy golden broast.", price: "$19.99", img: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    ]
  },
  {
    category: "Smash Burgers",
    link: "/burger",
    items: [
      { title: "Wagyu Smash", desc: "Double smacked premium wagyu patties, truffle aioli.", price: "$18.99", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
      { title: "Spicy Chicken", desc: "Crispy buttermilk chicken breast, spicy mayo, jalapeño slaw.", price: "$13.99", img: "https://images.unsplash.com/photo-1615719413546-198b25453f85?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
      { title: "The Behemoth", desc: "Triple patty, bacon, onion rings, and smoked cheddar.", price: "$18.99", img: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
      { title: "Mushroom Swiss", desc: "Roasted mushrooms, melted swiss cheese, truffle aioli.", price: "$15.99", img: "https://images.unsplash.com/photo-1594212887859-62325ab374db?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    ]
  },
  {
    category: "Sides & Extras",
    link: "/deals",
    items: [
      { title: "Loaded Fries", desc: "Crispy fries topped with cheese sauce, bacon, and scallions.", price: "$8.99", img: "https://images.unsplash.com/photo-1576107232684-1279f3908594?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
      { title: "Onion Rings", desc: "Beer-battered, thick-cut onion rings with ranch.", price: "$7.99", img: "https://images.unsplash.com/photo-1639024471283-03518883512d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
      { title: "Garlic Bread", desc: "Toasted sourdough loaded with garlic butter and herbs.", price: "$6.99", img: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
      { title: "Spicy Wings", desc: "6pcs classic wings tossed in buffalo sauce.", price: "$11.99", img: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    ]
  }
];

export default function FullMenu() {
  return (
    <PageTransition className="flex-grow pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 max-w-2xl"
        >
          <h1 className="text-[44px] md:text-[64px] leading-[1.1] font-extrabold tracking-tight mb-4">
            Full <span className="text-theme transition-colors duration-500 font-black">Menu</span>
          </h1>
          <p className="text-white/60 text-[16px] font-medium leading-[1.6]">
            Every dish is crafted for intensity. Browse our complete selection of bold flavors.
          </p>
        </motion.div>

        {menuItems.map((section, idx) => (
          <motion.div 
            key={idx} 
            className="mb-20 w-full"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-[28px] font-bold mb-8 border-b border-gray-deep/50 pb-4 tracking-tight group flex items-center">
              <span className="text-theme mr-3">/</span> {section.category}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {section.items.map((item, i) => (
                <div key={i}>
                  <MenuCard 
                    title={item.title}
                    description={item.desc}
                    price={item.price}
                    image={item.img}
                    delay={i * 0.1}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </PageTransition>
  );
}
