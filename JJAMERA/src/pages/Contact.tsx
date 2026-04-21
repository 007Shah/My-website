import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition } from '../components/PageTransition';
import { MagneticButton } from '../components/MagneticButton';
import { AnimatedText } from '../components/AnimatedText';
import { cn } from '../utils/cn';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({ name: false, email: false, message: false });
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = {
      name: !formData.name,
      email: !formData.email || !/^\S+@\S+\.\S+$/.test(formData.email),
      message: !formData.message,
    };
    setErrors(newErrors);
    
    if (!Object.values(newErrors).some(Boolean)) {
      setIsSent(true);
      setTimeout(() => setIsSent(false), 3000);
      setFormData({ name: '', email: '', message: '' });
    }
  };

  const shakeAnimation = {
    shake: {
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.4 }
    }
  };

  return (
    <PageTransition className="flex-grow pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto relative">
        <AnimatePresence>
          {isSent && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -50 }}
              className="fixed bottom-10 right-10 bg-theme text-theme-content p-6 rounded-2xl shadow-2xl z-50 md:right-10 md:bottom-10 right-6 bottom-24"
            >
              <h4 className="font-extrabold tracking-tight text-[20px] mb-2">Message Sent!</h4>
              <p className="text-[14px] font-medium opacity-80">We'll get back to you shortly.</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 item-center">
          <div className="flex flex-col justify-center">
            <h1 className="text-[52px] md:text-[76px] leading-[1] font-extrabold tracking-tight mb-8">
              Get In <br/><span className="text-theme transition-colors duration-500 font-black">Touch</span>
            </h1>
            <AnimatedText 
              text="Have a question about our menu, catering, or just want to say hi? Drop us a line."
              className="text-[16px] text-white/80 max-w-[400px] leading-[1.7] font-medium border-l-[3px] border-theme transition-colors duration-500 pl-5 mb-12"
            />
            
            <div className="space-y-8 text-[15px] font-medium text-white/90">
              <p><strong className="text-theme/80 transition-colors duration-500 tracking-wider text-[11px] block mb-2 font-bold">EMAIL</strong> hello@jjamera.com</p>
              <p><strong className="text-theme/80 transition-colors duration-500 tracking-wider text-[11px] block mb-2 font-bold">PHONE</strong> +92 300 1234567</p>
              <p><strong className="text-theme/80 transition-colors duration-500 tracking-wider text-[11px] block mb-2 font-bold">HQ</strong> 123 Flavor Street, Lahore</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 bg-obsidian border border-gray-deep/50 p-8 md:p-10 rounded-3xl shadow-xl">
            <motion.div animate={errors.name ? "shake" : ""} variants={shakeAnimation}>
              <label className="block text-[12px] uppercase tracking-wider font-semibold text-white/50 mb-2">Name</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => { setFormData({...formData, name: e.target.value}); setErrors({...errors, name: false}); }}
                className={cn(
                  "w-full bg-white/5 border rounded-xl p-4 text-white focus:outline-none transition-colors",
                  errors.name ? "border-red-500" : "border-gray-deep/50 focus:border-theme focus:bg-white/10"
                )}
                placeholder="John Doe"
              />
            </motion.div>
            
            <motion.div animate={errors.email ? "shake" : ""} variants={shakeAnimation}>
              <label className="block text-[12px] uppercase tracking-wider font-semibold text-white/50 mb-2">Email</label>
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => { setFormData({...formData, email: e.target.value}); setErrors({...errors, email: false}); }}
                className={cn(
                  "w-full bg-white/5 border rounded-xl p-4 text-white focus:outline-none transition-colors",
                  errors.email ? "border-red-500" : "border-gray-deep/50 focus:border-theme focus:bg-white/10"
                )}
                placeholder="john@example.com"
              />
            </motion.div>

            <motion.div animate={errors.message ? "shake" : ""} variants={shakeAnimation}>
              <label className="block text-[12px] uppercase tracking-wider font-semibold text-white/50 mb-2">Message</label>
              <textarea 
                rows={5}
                value={formData.message}
                onChange={(e) => { setFormData({...formData, message: e.target.value}); setErrors({...errors, message: false}); }}
                className={cn(
                  "w-full bg-white/5 border rounded-xl p-4 text-white focus:outline-none transition-colors resize-none",
                  errors.message ? "border-red-500" : "border-gray-deep/50 focus:border-theme focus:bg-white/10"
                )}
                placeholder="How can we help?"
              />
            </motion.div>

            <MagneticButton type="submit" className="w-full shadow-md hover:shadow-lg mt-4">Send Message</MagneticButton>
          </form>
        </div>
      </div>
    </PageTransition>
  );
}
