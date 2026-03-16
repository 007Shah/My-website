import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: "How accurate is the AI diagnosis?",
    answer: "Our AI models are trained on millions of clinical images and have achieved up to 99.9% accuracy in controlled environments. However, they are intended to assist, not replace, professional medical judgment."
  },
  {
    question: "Is my medical data secure?",
    answer: "Yes, we use end-to-end encryption and are fully HIPAA compliant. Your data is stored securely and is only accessible by you and authorized healthcare providers."
  },
  {
    question: "How do I book an appointment?",
    answer: "Simply browse our list of doctors, select a specialty, and click 'Book Appointment'. You can choose a time slot that works best for you."
  },
  {
    question: "Can I use Prescripto AI for emergencies?",
    answer: "No. If you are experiencing a medical emergency, please call your local emergency services (e.g., 911) immediately."
  },
  {
    question: "What types of medical images can I upload?",
    answer: "We currently support MRI, CT scans, X-rays, and high-resolution retinal images for various diagnostic categories including brain, kidney, heart, and eyes."
  }
];

function FAQItem({ question, answer, index }: { question: string, answer: string, index: number }) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="glass-card mb-4 overflow-hidden"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
      >
        <span className="text-sm font-bold">{question}</span>
        {isOpen ? <Minus className="w-4 h-4 text-primary" /> : <Plus className="w-4 h-4 text-slate-400" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-6 pb-4"
          >
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-white/5 pt-4">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-[0.03] pointer-events-none" />
      
      <div className="relative max-w-3xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex p-3 bg-primary/10 rounded-2xl mb-4">
            <HelpCircle className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Everything you need to know about Prescripto AI.</p>
        </motion.div>

        <div className="mt-12">
          {faqs.map((faq, index) => (
            <FAQItem key={index} {...faq} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Still have questions?</p>
          <a
            href="/contact"
            className="inline-flex items-center px-6 py-2.5 bg-primary text-white rounded-full text-[11px] font-bold hover:bg-primary-hover transition-all shadow-lg shadow-primary/20"
          >
            Contact Support
          </a>
        </motion.div>
      </div>
    </div>
  );
}
