import React from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto py-20 px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-20"
      >
        <h1 className="text-6xl font-display font-bold gold-gradient mb-4">GET IN TOUCH</h1>
        <p className="text-white/40 uppercase tracking-[0.4em] text-sm">We are here to elevate your dining experience</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* Contact Info */}
        <div className="space-y-12">
          <div className="space-y-8">
            <h2 className="text-3xl font-display text-white/90">Contact Information</h2>
            <p className="text-white/50 leading-relaxed max-w-md">
              Whether you're planning a private event, have dietary concerns, or simply want to share your experience, our team is ready to listen.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-6">
              <div className="w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center text-gold">
                <MapPin size={20} />
              </div>
              <div>
                <h4 className="text-white/90 font-display uppercase tracking-widest text-sm mb-1">Location</h4>
                <p className="text-white/40">123 Slate Avenue, Marble District<br />London, EC1A 1BB</p>
              </div>
            </div>

            <div className="flex items-start space-x-6">
              <div className="w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center text-gold">
                <Phone size={20} />
              </div>
              <div>
                <h4 className="text-white/90 font-display uppercase tracking-widest text-sm mb-1">Reservations</h4>
                <p className="text-white/40">+44 20 7946 0000</p>
              </div>
            </div>

            <div className="flex items-start space-x-6">
              <div className="w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center text-gold">
                <Mail size={20} />
              </div>
              <div>
                <h4 className="text-white/90 font-display uppercase tracking-widest text-sm mb-1">Email</h4>
                <p className="text-white/40">concierge@aurelianslate.com</p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10">
            <h4 className="text-white/90 font-display uppercase tracking-widest text-sm mb-6">Follow Our Journey</h4>
            <div className="flex space-x-6">
              {['Instagram', 'Facebook', 'Twitter'].map(social => (
                <a key={social} href="#" className="text-white/40 hover:text-gold transition-colors uppercase tracking-widest text-xs">
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/5 p-10 rounded-3xl border border-white/10 backdrop-blur-sm"
        >
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-white/40 ml-1">Full Name</label>
                <input 
                  type="text" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold/50 outline-none transition-colors"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-white/40 ml-1">Email Address</label>
                <input 
                  type="email" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold/50 outline-none transition-colors"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-white/40 ml-1">Subject</label>
              <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold/50 outline-none transition-colors appearance-none">
                <option className="bg-obsidian">General Inquiry</option>
                <option className="bg-obsidian">Private Event</option>
                <option className="bg-obsidian">Press & Media</option>
                <option className="bg-obsidian">Careers</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-white/40 ml-1">Message</label>
              <textarea 
                rows={5}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold/50 outline-none transition-colors resize-none"
                placeholder="How can we assist you?"
              />
            </div>

            <button className="w-full bg-gold text-black font-bold uppercase tracking-[0.2em] py-4 rounded-xl hover:bg-white transition-all duration-500 flex items-center justify-center space-x-3">
              <span>Send Message</span>
              <Send size={18} />
            </button>
          </form>
        </motion.div>
      </div>

      {/* Map Placeholder */}
      <div className="mt-32 h-[500px] w-full rounded-3xl overflow-hidden border border-white/10 relative group">
        <img 
          src="https://picsum.photos/seed/map/1920/1080?grayscale" 
          alt="Map Location" 
          className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity duration-1000"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-obsidian/80 backdrop-blur-md border border-gold/30 p-8 rounded-2xl text-center">
            <h3 className="text-gold font-display text-xl mb-2">Aurelian Slate</h3>
            <p className="text-white/60 text-sm">Click to open in Google Maps</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
