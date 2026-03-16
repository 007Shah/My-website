import React from 'react';
import { motion } from 'motion/react';
import { Shield, FileText, Scale, AlertCircle } from 'lucide-react';

export default function Terms() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: "By accessing and using Prescripto AI, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.",
      icon: Shield
    },
    {
      title: "2. Medical Disclaimer",
      content: "Prescripto AI is an AI-powered diagnostic assistant. It is NOT a replacement for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.",
      icon: AlertCircle
    },
    {
      title: "3. User Responsibilities",
      content: "Users are responsible for providing accurate information and maintaining the confidentiality of their account credentials. Any misuse of the platform may result in termination of access.",
      icon: FileText
    },
    {
      title: "4. Intellectual Property",
      content: "All content, algorithms, and technology on Prescripto AI are the property of Prescripto AI and are protected by international copyright and trademark laws.",
      icon: Scale
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-mesh opacity-50 pointer-events-none" />
      
      <div className="relative max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Last updated: March 15, 2026</p>
        </motion.div>

        <div className="space-y-8">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card p-6"
            >
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <section.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-bold mb-2">{section.title}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {section.content}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 p-6 rounded-2xl bg-primary/5 border border-primary/10 text-center"
        >
          <p className="text-xs text-slate-500 dark:text-slate-400">
            If you have any questions about these Terms, please contact us at legal@prescripto.ai
          </p>
        </motion.div>
      </div>
    </div>
  );
}
