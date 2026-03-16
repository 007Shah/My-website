import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Brain, Heart, Activity, Eye, CheckCircle2, Star, Quote, Shield, FileText, AlertTriangle } from 'lucide-react';

const steps = [
  {
    title: 'Upload Image',
    desc: 'Upload your MRI, CT scan, or retinal image securely to our platform.',
    icon: Activity
  },
  {
    title: 'AI Analysis',
    desc: 'Our specialized neural networks process the image in real-time.',
    icon: Brain
  },
  {
    title: 'Get Results',
    desc: 'Receive a detailed diagnostic report with high-precision segmentation.',
    icon: CheckCircle2
  }
];

const testimonials = [
  {
    name: 'Dr. Sarah Chen',
    role: 'Neurologist',
    content: 'The brain tumor segmentation agent has significantly reduced my diagnostic time. The precision is remarkable.',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71f153678e?auto=format&fit=crop&q=80&w=100'
  },
  {
    name: 'James Wilson',
    role: 'Patient',
    content: 'I got my retinal scan results in seconds. It gave me peace of mind before my follow-up appointment.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100'
  }
];
import { Link } from 'react-router-dom';
import Hero3D from '../components/Hero3D';
import { cn } from '../lib/utils';

const agents = [
  {
    id: 'glaucoma',
    name: 'Glaucoma AI',
    icon: Eye,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    description: 'Advanced retinal analysis for early glaucoma detection.'
  },
  {
    id: 'kidney',
    name: 'Kidney Health',
    icon: Activity,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    description: 'Renal imaging analysis for stone and cyst detection.'
  },
  {
    id: 'brain-tumor',
    name: 'Brain Tumor AI',
    icon: Brain,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    description: 'MRI segmentation for precise tumor localization.'
  },
  {
    id: 'heart-failure',
    name: 'Heart Guard',
    icon: Heart,
    color: 'text-red-500',
    bg: 'bg-red-500/10',
    description: 'Cardiac imaging analysis for structural abnormalities.'
  }
];

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-[0.03] pointer-events-none" />
      
      {/* Floating Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            x: [0, -50, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 -right-24 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"
        />
      </div>

      <Hero3D />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-24 pb-32 overflow-hidden">
        {/* Background Image with Immersive Overlay */}
        <div className="absolute inset-0 z-0">
          <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=2000" 
            alt="Medical Background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/80 to-white dark:from-slate-950/95 dark:via-slate-950/80 dark:to-slate-950" />
          <div className="absolute inset-0 bg-grid opacity-[0.05]" />
          
          {/* Decorative Glows */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px] animate-pulse delay-700" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-md text-primary text-[11px] font-bold uppercase tracking-widest mb-10 border border-white/20 shadow-xl"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Next Generation Medical Care
            </motion.div>
            
            <h1 className="text-4xl lg:text-7xl font-bold tracking-tighter mb-8 leading-[1.1] text-slate-900 dark:text-white">
              AI-Powered <br />
              <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary via-indigo-500 to-emerald-500 animate-gradient-x">
                Diagnostic Excellence
              </span>
            </h1>
            
            <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
              Connect with world-class specialists and leverage state-of-the-art AI agents for instant, high-precision medical imaging analysis.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 mb-20">
              <Link
                to="/doctors"
                className="px-10 py-4 bg-primary text-white rounded-full text-[14px] font-bold hover:bg-primary-hover transition-all flex items-center gap-3 group shadow-[0_20px_50px_rgba(95,111,255,0.3)] hover:scale-105 active:scale-95"
              >
                Book appointment
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/services"
                className="px-10 py-4 glass-card rounded-full text-[14px] font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all border-white/20 hover:scale-105 active:scale-95"
              >
                Explore Services
              </Link>
            </div>
            
            <div className="flex flex-col items-center gap-6">
              <div className="flex -space-x-4">
                {[1,2,3,4,5,6,7].map(i => (
                  <motion.img 
                    whileHover={{ y: -10, scale: 1.1 }}
                    key={i}
                    src={`https://i.pravatar.cc/100?img=${i+40}`} 
                    className="w-14 h-14 rounded-full border-4 border-white dark:border-slate-950 shadow-2xl cursor-pointer transition-transform"
                    alt="User"
                  />
                ))}
                <div className="w-14 h-14 rounded-full border-4 border-white dark:border-slate-950 bg-primary flex items-center justify-center text-white text-[10px] font-bold shadow-2xl">
                  +10k
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1.5 text-amber-500 mb-2">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-[11px] font-bold opacity-70 uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Trusted by Patients Worldwide</p>
              </div>
            </div>
          </motion.div>

          {/* Floating Decorative Elements - Repositioned for Centered Layout */}
          <div className="absolute top-1/2 left-10 -translate-y-1/2 hidden 2xl:block">
            <motion.div
              animate={{ y: [0, -40, 0], rotate: [0, 8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="glass-card p-10 rounded-[2.5rem] shadow-2xl border-white/30 backdrop-blur-3xl"
            >
              <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-5">
                <Activity className="w-8 h-8 text-emerald-500" />
              </div>
              <p className="text-[11px] font-bold opacity-50 uppercase tracking-widest mb-1">Live Status</p>
              <p className="text-xl font-bold">Agents Online</p>
            </motion.div>
          </div>

          <div className="absolute top-1/2 right-10 -translate-y-1/2 hidden 2xl:block">
            <motion.div
              animate={{ y: [0, 40, 0], rotate: [0, -8, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="glass-card p-10 rounded-[2.5rem] shadow-2xl border-white/30 backdrop-blur-3xl"
            >
              <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-5">
                <Brain className="w-8 h-8 text-primary" />
              </div>
              <p className="text-[11px] font-bold opacity-50 uppercase tracking-widest mb-1">AI Accuracy</p>
              <p className="text-xl font-bold">99.9% Precision</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="relative py-24 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How it Works</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              Our streamlined process ensures you get the most accurate diagnostic insights in the shortest possible time.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative text-center group"
              >
                <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-3xl shadow-xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500 border border-slate-100 dark:border-white/5">
                  <step.icon className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-3">{step.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{step.desc}</p>
                
                {i < 2 && (
                  <div className="hidden lg:block absolute top-10 left-[70%] w-full h-px bg-gradient-to-r from-primary/20 to-transparent" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Agents Section */}
      <section className="relative bg-mesh py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4">Diagnostic Agents</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Specialized AI models for various medical imaging categories.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {agents.map((agent, index) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Link
                  to={`/agent/${agent.id}`}
                  className="group block glass-card p-8 h-full relative overflow-hidden"
                >
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110", agent.bg)}>
                    <agent.icon className={cn("w-7 h-7", agent.color)} />
                  </div>
                  <h3 className="text-lg font-bold mb-3">{agent.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">{agent.description}</p>
                  <div className="flex items-center text-primary font-bold text-[11px] uppercase tracking-wider">
                    Launch Agent <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                  
                  {/* Decorative background element */}
                  <div className={cn("absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-3xl opacity-20", agent.bg)} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 opacity-50" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">What Experts Say</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Trusted by leading healthcare professionals worldwide.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="glass-card p-10 relative"
              >
                <Quote className="absolute top-6 right-8 w-12 h-12 text-primary/10" />
                <p className="text-sm italic text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">"{t.content}"</p>
                <div className="flex items-center gap-4">
                  <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <h4 className="text-sm font-bold">{t.name}</h4>
                    <p className="text-[10px] font-bold opacity-60 uppercase tracking-wider text-primary">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live AI Analysis Simulation */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/[0.02] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-[10px] font-bold uppercase tracking-widest mb-4"
            >
              <Activity className="w-3 h-3" />
              Live AI Simulation
            </motion.div>
            <h2 className="text-4xl font-bold tracking-tight mb-4">Experience the Precision</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Select a sample scan to see how our AI agents analyze and segment medical images in real-time.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card p-2 bg-white/50 dark:bg-white/5 relative aspect-square overflow-hidden group"
            >
              <img 
                src="https://picsum.photos/seed/mri-scan/800/800" 
                alt="Medical Scan" 
                className="w-full h-full object-cover rounded-xl"
                referrerPolicy="no-referrer"
              />
              {/* AI Analysis Overlay Simulation */}
              <div className="absolute inset-0 pointer-events-none">
                <motion.div 
                  animate={{ 
                    top: ['0%', '100%', '0%'],
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    ease: "linear" 
                  }}
                  className="absolute left-0 right-0 h-1 bg-primary shadow-[0_0_15px_rgba(67,56,202,0.8)] z-20"
                />
                <div className="absolute inset-0 bg-primary/5 mix-blend-overlay" />
                {/* Simulated Bounding Boxes */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  className="absolute top-[20%] left-[30%] w-[15%] h-[15%] border-2 border-red-500 rounded-sm"
                >
                  <span className="absolute -top-5 left-0 text-[8px] bg-red-500 text-white px-1 py-0.5 rounded font-bold">ANOMALY 98%</span>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="absolute top-[50%] left-[60%] w-[10%] h-[10%] border-2 border-emerald-500 rounded-sm"
                >
                  <span className="absolute -top-5 left-0 text-[8px] bg-emerald-500 text-white px-1 py-0.5 rounded font-bold">NORMAL</span>
                </motion.div>
              </div>
            </motion.div>

            <div className="space-y-8">
              {[
                { 
                  title: 'Real-time Segmentation', 
                  desc: 'Our AI identifies and segments anatomical structures with sub-millimeter precision.',
                  icon: Brain,
                  color: 'primary'
                },
                { 
                  title: 'Anomaly Detection', 
                  desc: 'Instant flagging of potential issues with confidence scores and heatmaps.',
                  icon: AlertTriangle,
                  color: 'red'
                },
                { 
                  title: 'Automated Reporting', 
                  desc: 'Generate comprehensive diagnostic reports formatted for clinical use.',
                  icon: FileText,
                  color: 'emerald'
                }
              ].map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-6"
                >
                  <div className={`w-14 h-14 shrink-0 bg-${feature.color}-500/10 rounded-2xl flex items-center justify-center`}>
                    <feature.icon className={`w-7 h-7 text-${feature.color}-500`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
              <div className="pt-4">
                <Link to="/auth" className="px-8 py-4 bg-primary text-white rounded-2xl text-sm font-bold inline-flex items-center gap-2 hover:shadow-xl hover:shadow-primary/30 transition-all">
                  Try it with your data
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portals Section */}
      <section className="relative py-24 bg-slate-50 dark:bg-slate-900/30">
        <div className="absolute inset-0 bg-grid opacity-[0.05] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="glass-card p-10 bg-white/60 dark:bg-primary/5 relative overflow-hidden group border-primary/10"
            >
              <div className="absolute top-0 right-0 p-6 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity">
                <Activity className="w-24 h-24 text-primary" />
              </div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <Activity className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4 tracking-tight">Doctor Portal</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-10 leading-relaxed max-w-sm">
                  A specialized environment for healthcare professionals. Manage patient records, analyze AI diagnostic reports, and streamline your clinical workflow.
                </p>
                <Link to="/portal/doctor" className="px-10 py-4 bg-primary text-white rounded-2xl text-[13px] font-bold inline-flex items-center gap-2 hover:shadow-xl hover:shadow-primary/30 transition-all group/btn">
                  Access Portal
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="glass-card p-10 bg-white/60 dark:bg-purple-500/5 relative overflow-hidden group border-purple-500/10"
            >
              <div className="absolute top-0 right-0 p-6 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity">
                <Shield className="w-24 h-24 text-purple-500" />
              </div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <Shield className="w-7 h-7 text-purple-500" />
                </div>
                <h3 className="text-2xl font-bold mb-4 tracking-tight">Admin Portal</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-10 leading-relaxed max-w-sm">
                  Complete system oversight. Monitor AI model performance, manage user permissions, and access high-level analytics for the entire medical network.
                </p>
                <Link to="/portal/admin" className="px-10 py-4 bg-purple-600 text-white rounded-2xl text-[13px] font-bold inline-flex items-center gap-2 hover:shadow-xl hover:shadow-purple-500/30 transition-all group/btn">
                  Access Portal
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
