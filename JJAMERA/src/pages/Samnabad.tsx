import React from 'react';
import { LocationPage } from '../components/LocationPage';

export default function Samnabad() {
  return (
    <LocationPage 
      title="Samnabad, Lahore"
      address="123 Main Boulevard, Samnabad, Lahore, Pakistan"
      hours="Mon-Sun: 12:00 PM - 2:00 AM"
      phone="+92 42 1234567"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-[30px] md:text-[50px] font-black uppercase tracking-[-2px] leading-tight mb-6">
            The Original <span className="text-theme transition-colors duration-500">HQ</span>
          </h2>
          <p className="text-white/70 text-[14px] leading-[1.6] mb-6">
            This is where the magic began. Our Samnabad location brings the raw energy of street dining mixed with our precision culinary engineering.
          </p>
          <div className="p-6 bg-gray-deep border border-gray-deep/50 relative overflow-hidden group">
            <div className="absolute inset-0 bg-theme/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
            <h3 className="text-[14px] font-bold uppercase tracking-[0.1em] text-theme transition-colors duration-500 mb-2">Location Exclusive</h3>
            <p className="text-white/90 text-[12px] uppercase">Flash your student ID for an instant 15% discount on all Smash Burgers during lunch hours.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="relative aspect-square overflow-hidden group">
            <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Kitchen" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-obsidian/20 group-hover:bg-transparent transition-colors duration-500" />
          </div>
          <div className="relative aspect-square overflow-hidden group">
            <img src="https://images.unsplash.com/photo-1588168333986-5078d3ae3976?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Dining" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-obsidian/20 group-hover:bg-transparent transition-colors duration-500" />
          </div>
        </div>
      </div>
    </LocationPage>
  );
}
