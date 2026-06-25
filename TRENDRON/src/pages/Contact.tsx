import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface ContactProps {
  setActivePage: (page: any) => void;
  triggerToast?: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export default function Contact({ setActivePage, triggerToast }: ContactProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Order Inquiry');
  const [message, setMessage] = useState('');
  const [isLiveChatPulsing, setIsLiveChatPulsing] = useState(true);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Status pulse effect simulation
  useEffect(() => {
    const pulse = setInterval(() => {
      setIsLiveChatPulsing((prev) => !prev);
    }, 1200);
    return () => clearInterval(pulse);
  }, []);

  const handleContactSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      if (triggerToast) {
        triggerToast('Please fill out all fields before sending your inquiry.', 'error');
      } else {
        alert('Please fill out all fields before sending.');
      }
      return;
    }
    setFormSubmitted(true);
    if (triggerToast) {
      triggerToast('Message sent! Our luxury customer concierge will reach out to you shortly.', 'success');
    }
    setName('');
    setEmail('');
    setMessage('');
    setTimeout(() => {
      setFormSubmitted(false);
    }, 4000);
  };

  return (
    <div className="pt-24 min-h-screen bg-background">
      {/* Universal Backward Navigation Button */}
      <div className="max-w-container-max mx-auto px-gutter mb-md">
        <motion.button
          whileHover={{ x: -4 }}
          onClick={() => {
            setActivePage('HOME');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-xs font-display text-[10px] tracking-[0.2em] font-bold text-on-surface-variant uppercase hover:text-primary transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg leading-none">west</span>
          <span>Back to Gallery</span>
        </motion.button>
      </div>

      <section className="max-w-container-max mx-auto px-gutter mb-xl">
        {/* Hero Header */}
        <div className="text-center mb-xl space-y-md">
          <span className="font-sans text-label-caps text-primary tracking-widest font-bold uppercase block">
            CONCIERGE & ATELIER
          </span>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-on-surface">
            We’re here to help.
          </h1>
          <p className="font-sans text-body-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            Whether you have a question about sizing, custom tailoring, shipping, or our sustainable materials, our dedicated team is at your assistance.
          </p>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl items-start">
          {/* Left: Contact Form */}
          <div className="bg-surface-container-lowest p-md md:p-lg rounded-3xl shadow-[0px_4px_30px_rgba(0,0,0,0.03)] border border-outline-variant/30 space-y-lg">
            <h2 className="font-display font-bold text-headline-md text-on-surface">Get in Touch</h2>
            <form onSubmit={handleContactSubmit} className="space-y-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                <div className="space-y-xs">
                  <label className="font-sans text-[10px] tracking-wider font-bold text-on-surface-variant uppercase">
                    Your Name
                  </label>
                  <input
                    className="w-full bg-surface border border-outline-variant rounded p-sm font-sans text-body-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    type="text"
                    required
                    placeholder="Elias Thorne"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-xs">
                  <label className="font-sans text-[10px] tracking-wider font-bold text-on-surface-variant uppercase">
                    Email Address
                  </label>
                  <input
                    className="w-full bg-surface border border-outline-variant rounded p-sm font-sans text-body-sm outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                    type="email"
                    placeholder="elias@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-xs">
                <label className="font-sans text-[10px] tracking-wider font-bold text-on-surface-variant uppercase">
                  Subject Category
                </label>
                <select
                  className="w-full bg-surface border border-outline-variant rounded p-sm font-sans text-body-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                >
                  <option>Order Inquiry</option>
                  <option>Shipping & Returns</option>
                  <option>Product Feedback</option>
                  <option>General Inquiry</option>
                </select>
              </div>

              <div className="space-y-xs">
                <label className="font-sans text-[10px] tracking-wider font-bold text-on-surface-variant uppercase">
                  Your Message
                </label>
                <textarea
                  rows={5}
                  required
                  className="w-full bg-surface border border-outline-variant rounded p-sm font-sans text-body-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                  placeholder="How can we help you today?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-inverse-surface text-on-secondary font-display font-semibold text-body-md py-md rounded-lg hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer shadow-sm"
              >
                Send Message
              </motion.button>
            </form>

            <AnimatePresence>
              {formSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-sm bg-primary/10 text-primary border border-primary/20 rounded font-sans text-body-sm text-center font-bold"
                >
                  Thank you! Your message has been sent. Our concierge will respond shortly.
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right: Showroom & Support Channels */}
          <div className="space-y-lg">
            {/* Live Chat Status block */}
            <div className="bg-surface-container-low p-lg rounded-3xl border border-outline-variant/30 flex items-center gap-md shadow-sm">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <span className="material-symbols-outlined text-2xl">forum</span>
              </div>
              <div className="flex-grow space-y-xs">
                <div className="flex items-center gap-base">
                  <h3 className="font-display font-semibold text-body-md text-on-surface">Live Chat</h3>
                  <span
                    className={`inline-block px-sm py-[2px] text-[9px] font-bold rounded-full uppercase tracking-wider transition-opacity duration-500 ${
                      isLiveChatPulsing ? 'bg-emerald-100 text-emerald-800' : 'bg-emerald-100 text-emerald-800 opacity-60'
                    }`}
                  >
                    Online
                  </span>
                </div>
                <p className="font-sans text-body-sm text-on-surface-variant">Typical response time: &lt; 2 mins</p>
              </div>
              <button
                onClick={() => {
                  if (triggerToast) {
                    triggerToast('Live chat initialized. Connecting to luxury representative Elias...', 'info');
                  } else {
                    alert('Trendora Concierge Chat initialized. Connecting to Representative Elias.');
                  }
                }}
                className="text-primary font-bold font-sans text-body-sm hover:underline cursor-pointer"
              >
                Chat Now
              </button>
            </div>

            {/* Support cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              <a
                href="mailto:support@trendora.com"
                className="bg-surface-container-low p-lg rounded-3xl border border-outline-variant/20 shadow-sm flex flex-col items-start gap-sm hover:translate-y-[-2px] transition-transform"
              >
                <span className="material-symbols-outlined text-primary text-xl">mail</span>
                <h4 className="font-display font-semibold text-body-md text-on-surface">Email Support</h4>
                <p className="font-sans text-body-sm text-on-surface-variant">support@trendora.com</p>
              </a>
              <button
                onClick={() => {
                  if (triggerToast) {
                    triggerToast('Trendora WhatsApp Concierge initialized on +1 (555) 098-7654.', 'success');
                  } else {
                    alert('Trendora WhatsApp Concierge: Initialized chat on +1 (555) 098-7654.');
                  }
                }}
                className="bg-surface-container-low p-lg rounded-3xl border border-outline-variant/20 shadow-sm flex flex-col items-start gap-sm hover:translate-y-[-2px] transition-transform text-left cursor-pointer"
              >
                <span className="material-symbols-outlined text-[#25D366] text-xl">chat</span>
                <h4 className="font-display font-semibold text-body-md text-on-surface font-bold">WhatsApp Direct</h4>
                <p className="font-sans text-body-sm text-on-surface-variant">+1 (555) 098-7654</p>
              </button>
            </div>

            {/* Showroom Image */}
            <div className="rounded-3xl overflow-hidden shadow-sm h-[300px] relative group border border-outline-variant/20">
              <img
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBx9bs-XnvnfjtRGGG7YZvIrKk_mi_Pn2_UvfmA87L7f0ly2pYjZ08EH6zZS9Lc84134p69PyaDcSr8wQxvdv8xVL48pddqQb9gw0_ML-v_1N7nJJkT5hO3SmZXLvUDcGwT57lespoQejgJfBB2xc8-hC3xH766wVitR4lcFLbxcXyhi8bW3i0dFjF3tmmONub7KS0gIZgsXw1B9GpeW4ri5uDsowYmEBGypWHkVPp7w2eUhRNb0O06IFTDfVri6YCIt3YOHbk7YMVN"
                alt="Flagship showroom"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white space-y-xs">
                <p className="font-display text-body-lg font-bold">Visit our Flagship Atelier</p>
                <p className="font-sans text-body-sm opacity-90">42 Madison Avenue, New York, NY</p>
              </div>
            </div>

            {/* Business Hours */}
            <div className="border-t border-outline-variant/30 pt-lg space-y-sm">
              <h4 className="font-sans text-label-caps text-on-surface-variant tracking-widest font-bold uppercase">
                Atelier Hours
              </h4>
              <div className="flex justify-between font-sans text-body-sm text-on-surface-variant">
                <span>Monday — Friday</span>
                <span className="text-on-surface font-semibold">9:00 AM — 6:00 PM EST</span>
              </div>
              <div className="flex justify-between font-sans text-body-sm text-on-surface-variant">
                <span>Saturday</span>
                <span className="text-on-surface font-semibold">10:00 AM — 4:00 PM EST</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
