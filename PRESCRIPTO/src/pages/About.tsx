import React from 'react';
import { motion } from 'motion/react';
import { Stethoscope, Shield, Zap, Heart } from 'lucide-react';

export default function About() {
  return (
    <div className="relative overflow-hidden min-h-screen">
      <div className="absolute inset-0 bg-mesh opacity-[0.05] pointer-events-none" />
      
      {/* Background Image Overlay */}
      <div className="absolute top-0 left-0 w-full h-[600px] opacity-10 pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=2000" 
          alt="Medical Facility" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white dark:to-slate-950" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-24"
        >
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest mb-4"
          >
            Our Journey
          </motion.span>
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 tracking-tight">Revolutionizing Healthcare <br /><span className="text-primary">With Artificial Intelligence</span></h1>
          <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Prescripto is at the forefront of medical technology, combining world-class medical expertise with cutting-edge AI to provide instant, accurate diagnostic insights for a healthier world.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
          {[
            { icon: Stethoscope, title: 'Expert Doctors', desc: 'Access to a global network of specialized medical professionals verified by our platform.' },
            { icon: Zap, title: 'AI Diagnostics', desc: 'Instant analysis of medical imaging using state-of-the-art neural networks trained on millions of cases.' },
            { icon: Shield, title: 'Secure Data', desc: 'Enterprise-grade encryption and HIPAA compliance for all patient records and medical data.' },
            { icon: Heart, title: 'Patient First', desc: 'Designed with empathy to provide the best possible care experience for patients and providers.' },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-8 text-center group hover:shadow-2xl transition-all duration-500"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-3">{feature.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-20 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              We believe that high-quality healthcare should be accessible to everyone, everywhere. By leveraging the power of AI, we're reducing diagnostic wait times from weeks to seconds, allowing doctors to focus on what matters most: treatment and care.
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              Our platform is built on trust, transparency, and a commitment to medical excellence. Every AI model we deploy is rigorously tested and validated by leading medical institutions to ensure the highest standards of safety and accuracy.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5">
                <p className="text-2xl font-bold text-primary mb-1">100%</p>
                <p className="text-[10px] font-bold opacity-60 uppercase tracking-wider">Secure Data</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5">
                <p className="text-2xl font-bold text-primary mb-1">24/7</p>
                <p className="text-[10px] font-bold opacity-60 uppercase tracking-wider">AI Monitoring</p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="glass-card p-4 shadow-2xl rounded-[40px] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&q=80&w=800"
                alt="Lab Research"
                className="rounded-[32px] w-full h-[450px] object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-10 -left-10 glass-card p-8 shadow-2xl hidden sm:block border-white/20">
              <p className="text-4xl font-bold text-primary mb-1">99.9%</p>
              <p className="text-[10px] font-bold opacity-60 uppercase tracking-wider">Uptime Reliability</p>
            </div>
          </motion.div>
        </div>

        {/* Core Values */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              The principles that guide our innovation and commitment to healthcare.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Integrity', desc: 'We maintain the highest ethical standards in AI development and data privacy.' },
              { title: 'Innovation', desc: 'Constantly pushing the boundaries of what is possible in medical technology.' },
              { title: 'Inclusivity', desc: 'Building tools that serve diverse populations and healthcare needs globally.' }
            ].map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-10 border-white/10"
              >
                <h4 className="text-lg font-bold mb-4 text-primary">{value.title}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
