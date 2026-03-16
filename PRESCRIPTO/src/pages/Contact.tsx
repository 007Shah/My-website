import React from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Contact() {
  return (
    <div className="relative overflow-hidden min-h-screen">
      <div className="absolute inset-0 bg-grid opacity-[0.03] pointer-events-none" />
      
      {/* Background Image Overlay */}
      <div className="absolute top-0 right-0 w-1/2 h-[800px] opacity-10 pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1557333610-90ee4a951ecf?auto=format&fit=crop&q=80&w=1200" 
          alt="Contact Background" 
          className="w-full h-full object-cover rounded-bl-[200px]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-white dark:to-slate-950" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <motion.span 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest mb-4"
            >
              Contact Us
            </motion.span>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 tracking-tight">Get in Touch</h1>
            <p className="text-base text-slate-600 dark:text-slate-400 mb-12 leading-relaxed max-w-lg">
              Have questions about our AI diagnostic services or want to partner with us? Our team of experts is here to provide you with the support you need.
            </p>

            <div className="space-y-8">
              {[
                { icon: Mail, label: 'Email', value: 'contact@prescripto.ai', desc: 'Our support team usually responds within 24 hours.' },
                { icon: Phone, label: 'Phone', value: '+1 (212) 456-7890', desc: 'Available Mon-Fri from 9am to 6pm EST.' },
                { icon: MapPin, label: 'Office', value: '123 Medical Plaza, New York, NY 10001', desc: 'Visit our headquarters in the heart of the city.' },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-6 group">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold opacity-60 uppercase tracking-wider mb-1">{item.label}</p>
                    <p className="text-lg font-bold mb-1">{item.value}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-10 shadow-2xl border-white/20 relative"
          >
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/10 rounded-full blur-3xl" />
            <form className="space-y-6 relative z-10">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold opacity-60 uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 text-sm glass rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 border-white/10"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold opacity-60 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 text-sm glass rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 border-white/10"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold opacity-60 uppercase tracking-wider">Subject</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 text-sm glass rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 border-white/10"
                  placeholder="How can we help?"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold opacity-60 uppercase tracking-wider">Message</label>
                <textarea
                  rows={5}
                  className="w-full px-4 py-3 text-sm glass rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 border-white/10"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>
              <button className="w-full py-4 bg-primary text-white rounded-2xl text-sm font-bold flex items-center justify-center gap-3 hover:bg-primary-hover transition-all shadow-2xl shadow-primary/30 group">
                Send Message 
                <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>
          </motion.div>
        </div>

        {/* Support Hours & Map Placeholder */}
        <div className="mt-32 grid lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 glass-card p-4 h-[400px] relative overflow-hidden group"
          >
            <img 
              src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=1200" 
              alt="Map Placeholder" 
              className="w-full h-full object-cover rounded-2xl grayscale group-hover:grayscale-0 transition-all duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-primary/10 pointer-events-none" />
            <div className="absolute bottom-8 left-8 glass-card p-4 shadow-2xl">
              <p className="text-[10px] font-bold opacity-60 uppercase tracking-wider mb-1">Our Location</p>
              <p className="text-sm font-bold">123 Medical Plaza, New York</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-10 flex flex-col justify-center"
          >
            <h3 className="text-xl font-bold mb-6">Support Hours</h3>
            <div className="space-y-4">
              {[
                { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM' },
                { day: 'Saturday', hours: '10:00 AM - 4:00 PM' },
                { day: 'Sunday', hours: 'Closed' }
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-white/5 last:border-0">
                  <p className="text-sm font-medium">{item.day}</p>
                  <p className="text-sm font-bold text-primary">{item.hours}</p>
                </div>
              ))}
            </div>
            <p className="mt-8 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              For emergency medical assistance, please contact your local emergency services immediately.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
