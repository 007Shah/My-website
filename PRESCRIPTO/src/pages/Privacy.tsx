import React from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-mesh pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 lg:p-12"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">Privacy Policy</h1>
          </div>

          <div className="space-y-8 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            <section>
              <h2 className="text-base font-bold text-foreground mb-3">1. Introduction</h2>
              <p>
                At Prescripto AI, we take your privacy seriously. This Privacy Policy explains how we collect, use, 
                disclose, and safeguard your information when you visit our website and use our AI diagnostic services. 
                Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, 
                please do not access the site.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-foreground mb-3">2. Data Collection</h2>
              <p className="mb-3">
                We collect information that you provide directly to us when you:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Create an account or profile</li>
                <li>Upload medical images for AI analysis</li>
                <li>Communicate with us via email or contact forms</li>
                <li>Request technical support</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-bold text-foreground mb-3">3. Medical Data Security</h2>
              <div className="bg-primary/5 border border-primary/10 p-4 rounded-xl flex gap-4 items-start">
                <Lock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p>
                  Your medical images and data are encrypted both in transit and at rest. We use 
                  enterprise-grade AES-256 encryption and follow HIPAA-compliant protocols to ensure 
                  your sensitive health information remains private and secure.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-base font-bold text-foreground mb-3">4. How We Use Your Information</h2>
              <p className="mb-3">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Provide and maintain our AI diagnostic services</li>
                <li>Improve our AI models and diagnostic accuracy</li>
                <li>Send you technical notices and security alerts</li>
                <li>Respond to your comments and questions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-bold text-foreground mb-3">5. Data Retention</h2>
              <p>
                We retain your information for as long as necessary to fulfill the purposes outlined in this 
                Privacy Policy, unless a longer retention period is required or permitted by law. You can 
                request the deletion of your data at any time through your account settings.
              </p>
            </section>

            <section className="pt-8 border-t border-slate-100 dark:border-white/5">
              <p className="text-[10px] opacity-60">
                Last updated: March 15, 2026. For any questions regarding this policy, 
                please contact us at privacy@prescripto.ai
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
