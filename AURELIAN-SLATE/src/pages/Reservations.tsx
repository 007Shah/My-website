import React from 'react';
import ReservationBar from '../components/ReservationBar';

const Reservations: React.FC = () => {
  return (
    <div className="py-20 flex flex-col items-center text-center space-y-32 px-6">
      <div className="space-y-8 relative">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-gold/5 blur-[100px] rounded-full pointer-events-none" />
        <h2 className="text-gold text-sm uppercase tracking-[0.8em] reveal">Secure Your Table</h2>
        <h1 className="text-7xl font-display font-bold reveal tracking-tight">JOIN THE <span className="gold-gradient">EXPERIENCE</span></h1>
        <div className="h-[1px] w-12 bg-gold/30 mx-auto" />
        <p className="text-white/40 max-w-2xl mx-auto reveal text-lg font-light leading-relaxed">
          Due to our intimate setting and high demand, we recommend booking at least 14 days in advance. <br />
          For parties larger than 8, please contact our concierge directly.
        </p>
      </div>

      <div className="w-full max-w-4xl reveal glass p-4 rounded-full border border-white/10">
        <ReservationBar />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 w-full max-w-5xl text-left reveal">
        <div className="glass p-16 rounded-[3rem] space-y-10 border border-white/5 hover:border-gold/20 transition-all duration-700">
          <h3 className="text-3xl font-display text-gold uppercase tracking-[0.2em]">Policies</h3>
          <ul className="space-y-6 text-white/40 text-sm font-light uppercase tracking-widest">
            <li className="flex items-center space-x-4">
              <span className="w-1.5 h-1.5 bg-gold rounded-full" />
              <span>Dress Code: Avant-Garde / Formal</span>
            </li>
            <li className="flex items-center space-x-4">
              <span className="w-1.5 h-1.5 bg-gold rounded-full" />
              <span>Cancellation: 48 hours notice required</span>
            </li>
            <li className="flex items-center space-x-4">
              <span className="w-1.5 h-1.5 bg-gold rounded-full" />
              <span>Children: 12+ years only after 7 PM</span>
            </li>
            <li className="flex items-center space-x-4">
              <span className="w-1.5 h-1.5 bg-gold rounded-full" />
              <span>Valet: Complimentary for all guests</span>
            </li>
          </ul>
        </div>

        <div className="glass p-16 rounded-[3rem] space-y-10 border border-white/5 hover:border-gold/20 transition-all duration-700">
          <h3 className="text-3xl font-display text-gold uppercase tracking-[0.2em]">Concierge</h3>
          <div className="space-y-8 text-white/40 text-sm font-light uppercase tracking-widest">
            <div className="space-y-2">
              <p className="text-white/20 text-[10px]">Location</p>
              <p>123 Obsidian Way, Neo-Tokyo District</p>
            </div>
            <div className="space-y-2">
              <p className="text-white/20 text-[10px]">Direct Line</p>
              <p>+1 (234) 567-890</p>
            </div>
            <div className="space-y-2">
              <p className="text-white/20 text-[10px]">Email</p>
              <p>concierge@aurelianslate.com</p>
            </div>
            <div className="pt-4 border-t border-white/5">
              <p className="text-gold uppercase tracking-[0.4em] text-[10px] mb-4">Service Hours</p>
              <p>Tue - Sun: 06:00 PM - 12:00 AM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Private Events Section */}
      <div className="w-full max-w-5xl reveal py-20">
        <div className="glass-gold rounded-[4rem] p-20 text-left space-y-12 relative overflow-hidden group border border-gold/10">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/5 blur-[120px] -mr-[300px] -mt-[300px] group-hover:bg-gold/10 transition-colors duration-1000" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-gold text-sm uppercase tracking-[0.8em]">Private Dining</h2>
                <h3 className="text-5xl font-display font-bold leading-tight">THE <span className="gold-gradient">OBSIDIAN</span> <br /> CHAMBER</h3>
              </div>
              <p className="text-white/40 text-lg leading-relaxed font-light">
                Host your most exclusive gatherings in our sound-proof obsidian chamber. <br />
                Customized menus, private sommelier service, and complete discretion.
              </p>
              <button className="px-12 py-5 border border-gold text-gold uppercase tracking-[0.4em] text-[10px] font-bold hover:bg-gold hover:text-black transition-all duration-500 rounded-full">
                Inquire for Events
              </button>
            </div>
            <div className="relative rounded-[3rem] overflow-hidden aspect-square border border-white/10">
              <img 
                src="https://picsum.photos/seed/private-dining-luxury/800/800" 
                alt="Private Dining" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </div>

      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FoodEstablishment",
          "name": "Aurelian Slate",
          "image": "https://picsum.photos/seed/aurelian-luxury/1200/800",
          "priceRange": "$$$$",
          "servesCuisine": "Avant-Garde Fusion",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "123 Obsidian Way",
            "addressLocality": "Neo-Tokyo District",
            "addressRegion": "NT",
            "postalCode": "00000",
            "addressCountry": "JP"
          },
          "telephone": "+1234567890",
          "openingHours": "Tu-Su 18:00-00:00"
        })}
      </script>
    </div>
  );
};

export default Reservations;
