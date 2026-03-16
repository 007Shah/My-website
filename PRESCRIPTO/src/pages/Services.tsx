import React from 'react';
import { motion } from 'motion/react';
import { Activity, Brain, Heart, Microscope, Shield, Zap, Clock, Users } from 'lucide-react';

const services = [
  {
    icon: Brain,
    title: 'Neurological AI',
    desc: 'Advanced brain tumor detection and segmentation with 99% accuracy using deep learning models.',
    color: 'purple'
  },
  {
    icon: Heart,
    title: 'Cardiovascular Analysis',
    desc: 'Predictive heart failure analysis and risk assessment based on medical imaging and patient history.',
    color: 'red'
  },
  {
    icon: Activity,
    title: 'Glaucoma Screening',
    desc: 'Early detection of glaucoma through retinal scan analysis, preventing vision loss before it starts.',
    color: 'emerald'
  },
  {
    icon: Microscope,
    title: 'Renal Health AI',
    desc: 'Automated kidney stone detection and renal function monitoring for proactive healthcare.',
    color: 'blue'
  },
  {
    icon: Shield,
    title: 'Secure Health Vault',
    desc: 'Enterprise-grade encryption for your medical records, ensuring complete privacy and compliance.',
    color: 'indigo'
  },
  {
    icon: Zap,
    title: 'Real-time Diagnostics',
    desc: 'Get diagnostic insights in seconds, not weeks. Our AI works 24/7 to provide instant feedback.',
    color: 'amber'
  }
];

export default function Services() {
  return (
    <div className="min-h-screen bg-mesh pt-24 pb-16 relative overflow-hidden">
      {/* Background Image Overlay */}
      <div className="absolute top-0 right-0 w-1/2 h-[700px] opacity-10 pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1200" 
          alt="Medical Background" 
          className="w-full h-full object-cover rounded-bl-[300px]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-white dark:to-slate-950" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest mb-4"
          >
            Our Capabilities
          </motion.span>
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 tracking-tight">AI-Powered Medical Services</h1>
          <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            We combine cutting-edge artificial intelligence with medical expertise to provide 
            the most advanced diagnostic tools available today, ensuring precision and speed in every analysis.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-8 group hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 border-white/20"
            >
              <div className={`w-14 h-14 rounded-2xl bg-${service.color}-500/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                <service.icon className={`w-7 h-7 text-${service.color}-500`} />
              </div>
              <h3 className="text-lg font-bold mb-4">{service.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                {service.desc}
              </p>
              <ul className="space-y-3">
                {['99.9% Accuracy', 'Real-time Analysis', 'Expert Verified'].map((item, index) => (
                  <li key={index} className="flex items-center gap-2 text-[11px] font-bold opacity-60 uppercase tracking-wider">
                    <div className={`w-1.5 h-1.5 rounded-full bg-${service.color}-500`} />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Technology Stack Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/30 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Technology Stack</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">We leverage state-of-the-art AI architectures to ensure the highest diagnostic accuracy.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { name: 'Neural Networks', tech: 'CNN & Transformers', desc: 'Deep learning models optimized for medical imaging.' },
              { name: 'Edge Computing', tech: 'Low Latency', desc: 'Real-time processing at the point of care.' },
              { name: 'Data Security', tech: 'AES-256 & HIPAA', desc: 'Military-grade encryption for all patient data.' },
              { name: 'Cloud Sync', tech: 'Global Availability', desc: 'Seamless access to reports from any device.' },
            ].map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 border-primary/5 hover:border-primary/20 transition-all"
              >
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">{item.tech}</p>
                <h3 className="text-lg font-bold mb-2">{item.name}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose Prescripto AI?</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              We are redefining the standards of medical diagnostics through innovation and security.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Shield, title: 'HIPAA Compliant', desc: 'Your data is protected by enterprise-grade security protocols.' },
              { icon: Clock, title: 'Instant Results', desc: 'Get diagnostic insights in seconds, significantly reducing wait times.' },
              { icon: Users, title: 'Expert Network', desc: 'Access to a global network of verified medical specialists.' },
              { icon: Zap, title: 'Advanced AI', desc: 'Proprietary neural networks trained on millions of medical images.' }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h4 className="text-base font-bold mb-2">{feature.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-32 glass-card p-10 lg:p-16 bg-primary/5 border-primary/20 relative overflow-hidden rounded-[40px]"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="max-w-xl">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6 leading-tight">Ready to experience the future of healthcare?</h2>
              <p className="text-base text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
                Join thousands of patients and doctors who are already using Prescripto AI 
                to improve diagnostic accuracy and speed. Our platform is designed for excellence.
              </p>
              <div className="flex flex-wrap gap-6">
                <button className="px-10 py-4 bg-primary text-white rounded-full text-sm font-bold hover:bg-primary-hover transition-all shadow-2xl shadow-primary/30">
                  Get Started Now
                </button>
                <button className="px-10 py-4 glass rounded-full text-sm font-bold hover:bg-white/50 dark:hover:bg-slate-800 transition-all border-white/20">
                  View Case Studies
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6 w-full lg:w-auto">
              {[
                { val: '50k+', label: 'Diagnoses' },
                { val: '99.9%', label: 'Accuracy' },
                { val: '24/7', label: 'Availability' },
                { val: '150+', label: 'Doctors' }
              ].map((stat, i) => (
                <div key={i} className="glass-card p-6 rounded-3xl text-center border-white/10">
                  <p className="text-2xl font-bold text-primary mb-1">{stat.val}</p>
                  <p className="text-[10px] uppercase font-bold opacity-60 tracking-widest">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
