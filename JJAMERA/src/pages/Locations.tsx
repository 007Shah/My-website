import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Clock } from 'lucide-react';
import { PageTransition } from '../components/PageTransition';
import { MagneticButton } from '../components/MagneticButton';

const locations = [
  {
    id: 'samnabad',
    name: 'Samnabad',
    subtitle: 'The Original Hub',
    address: '123 Main Boulevard, Samnabad, Lahore',
    phone: '+92 300 1234567',
    hours: '11:00 AM - 3:00 AM',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    description: 'Where the revolution started. Our Samnabad branch offers the classic styling and dining experience with our full original menu.',
    mapLink: 'https://maps.google.com'
  },
  {
    id: 'bahria',
    name: 'Bahria Town',
    subtitle: 'The Modern Outpost',
    address: 'Commercial Zone, Bahria Town, Lahore',
    phone: '+92 300 7654321',
    hours: '12:00 PM - 2:00 AM',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    description: 'A larger space for a bigger crowd. Featuring an expanded seating area, exclusive hidden menu items, and a dedicated pick-up window.',
    mapLink: 'https://maps.google.com'
  }
];

export default function Locations() {
  return (
    <PageTransition className="flex-grow flex flex-col py-24 mt-10">
      <div className="max-w-7xl mx-auto px-6 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h1 className="text-[44px] md:text-[64px] leading-[1.1] font-extrabold tracking-tight mb-4">
            Find <span className="text-theme transition-colors duration-500 font-black">Us</span>
          </h1>
          <p className="text-white/60 mx-auto max-w-xl text-[16px] leading-[1.6] font-medium">
            Two iconic locations, one unmatched experience. Visit our architectural spaces to dive deep into flavors crafted for the bold.
          </p>
        </motion.div>

        <div className="flex flex-col gap-12 max-w-5xl mx-auto">
          {locations.map((loc, index) => (
            <motion.div 
              key={loc.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="group border border-gray-deep rounded-3xl bg-obsidian transition-all duration-300 relative overflow-hidden flex flex-col md:flex-row shadow-sm hover:shadow-2xl hover:shadow-theme/5"
            >
              {/* Image Section */}
              <div className="md:w-5/12 relative overflow-hidden min-h-[300px]">
                <div className="absolute inset-0 bg-theme/10 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <img 
                  src={loc.image} 
                  alt={loc.name} 
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" 
                />
              </div>

              {/* Info Section */}
              <div className="md:w-7/12 p-8 md:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-[2px] bg-theme transition-colors duration-500 rounded-full"></div>
                  <span className="text-theme font-bold uppercase tracking-[0.15em] text-[12px] transition-colors duration-500">{loc.subtitle}</span>
                </div>
                
                <h2 className="text-[32px] md:text-[40px] font-extrabold tracking-tight mb-4">{loc.name}</h2>
                
                <p className="text-white/70 text-[15px] leading-[1.7] mb-8 font-medium">
                  {loc.description}
                </p>

                <div className="space-y-4 mb-10 bg-gray-deep/20 p-6 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <MapPin className="text-theme shrink-0" size={20} />
                    <span className="text-[15px] text-white/90 font-medium">{loc.address}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Phone className="text-theme shrink-0" size={20} />
                    <span className="text-[15px] text-white/90 font-medium">{loc.phone}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Clock className="text-theme shrink-0" size={20} />
                    <span className="text-[15px] text-white/90 font-medium">{loc.hours}</span>
                  </div>
                </div>

                <div className="mt-auto flex flex-wrap gap-4">
                  <a href={loc.mapLink} target="_blank" rel="noopener noreferrer">
                    <MagneticButton>Get Directions</MagneticButton>
                  </a>
                  <a href={`tel:${loc.phone}`}>
                    <MagneticButton variant="outline">Call Now</MagneticButton>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
