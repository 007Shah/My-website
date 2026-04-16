import React from 'react';
import { Calendar, Clock, Users } from 'lucide-react';

const ReservationBar: React.FC = () => {
  return (
    <div className="glass rounded-full px-8 py-4 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8 shadow-2xl border-gold/20 reveal">
      <div className="flex items-center space-x-3 w-full md:w-auto">
        <Calendar className="text-gold" size={18} />
        <input 
          type="date" 
          className="bg-transparent text-white text-sm focus:outline-none border-none [color-scheme:dark]"
        />
      </div>
      
      <div className="h-8 w-[1px] bg-white/10 hidden md:block" />

      <div className="flex items-center space-x-3 w-full md:w-auto">
        <Clock className="text-gold" size={18} />
        <select className="bg-transparent text-white text-sm focus:outline-none border-none appearance-none cursor-pointer">
          <option value="18:00">06:00 PM</option>
          <option value="19:00">07:00 PM</option>
          <option value="20:00">08:00 PM</option>
          <option value="21:00">09:00 PM</option>
        </select>
      </div>

      <div className="h-8 w-[1px] bg-white/10 hidden md:block" />

      <div className="flex items-center space-x-3 w-full md:w-auto">
        <Users className="text-gold" size={18} />
        <select className="bg-transparent text-white text-sm focus:outline-none border-none appearance-none cursor-pointer">
          <option value="2">2 Guests</option>
          <option value="4">4 Guests</option>
          <option value="6">6 Guests</option>
          <option value="8">8 Guests</option>
        </select>
      </div>

      <button className="bg-gold text-obsidian px-8 py-2 rounded-full font-display text-sm uppercase tracking-widest font-bold hover:bg-white transition-colors duration-300 w-full md:w-auto magnetic">
        Check Availability
      </button>
    </div>
  );
};

export default ReservationBar;
