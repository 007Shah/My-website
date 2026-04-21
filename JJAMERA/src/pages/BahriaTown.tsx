import React from 'react';
import { LocationPage } from '../components/LocationPage';

export default function BahriaTown() {
  return (
    <LocationPage 
      title="Bahria Town, Lahore"
      address="Sector C Commercial Area, Bahria Town, Lahore, Pakistan"
      hours="Mon-Sun: 12:00 PM - 3:00 AM"
      phone="+92 42 7654321"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="grid grid-cols-2 gap-4 order-2 lg:order-1">
          <div className="relative aspect-[4/5] overflow-hidden group">
            <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Interior" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-obsidian/20 group-hover:bg-transparent transition-colors duration-500" />
          </div>
          <div className="relative aspect-[4/5] overflow-hidden group mt-12">
            <img src="https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Plating" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-obsidian/20 group-hover:bg-transparent transition-colors duration-500" />
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <h2 className="text-[30px] md:text-[50px] font-black uppercase tracking-[-2px] leading-tight mb-6">
            The Late <span className="text-theme transition-colors duration-500">Night</span> Hub
          </h2>
          <p className="text-white/70 text-[14px] leading-[1.6] mb-6">
            Our expanded flagship location in Bahria Town features an extended midnight menu and a brutalist cyberpunk aesthetic. Perfect for late-night cravings.
          </p>
          <div className="p-6 bg-gray-deep border border-gray-deep/50 relative overflow-hidden group">
            <div className="absolute inset-0 bg-theme/10 transform translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
            <h3 className="text-[14px] font-bold uppercase tracking-[0.1em] text-theme transition-colors duration-500 mb-2">Midnight Drop</h3>
            <p className="text-white/90 text-[12px] uppercase">Any order placed after Midnight includes a complimentary side of Truffle Fries.</p>
          </div>
        </div>
      </div>
    </LocationPage>
  );
}
