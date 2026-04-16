import React from 'react';
import { motion } from 'motion/react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: "What is your reservation policy?",
    answer: "We recommend booking at least 2 weeks in advance for weekend dinners. For parties larger than 6, please contact our events team directly."
  },
  {
    question: "Do you offer vegetarian or vegan options?",
    answer: "Yes, our menu features several dedicated vegetarian dishes, and our chefs are happy to accommodate vegan requests with 24-hour notice."
  },
  {
    question: "Is there a dress code?",
    answer: "We suggest smart casual attire. We kindly ask guests to refrain from wearing beachwear or athletic attire."
  },
  {
    question: "Do you have private dining rooms?",
    answer: "Yes, we have two private dining suites: The Slate Room (up to 12 guests) and The Aurelian Hall (up to 40 guests)."
  },
  {
    question: "What are your opening hours?",
    answer: "Dinner: Tue-Sun, 6:00 PM - 11:00 PM. Lunch: Sat-Sun, 12:00 PM - 3:00 PM. Closed on Mondays."
  },
  {
    question: "Is there parking available?",
    answer: "Valet parking is available for all dinner guests starting from 6:00 PM."
  }
];

const FAQItem: React.FC<{ question: string, answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="border-b border-white/10 py-6">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left group"
      >
        <span className="text-lg font-display tracking-wide text-white/90 group-hover:text-gold transition-colors">
          {question}
        </span>
        {isOpen ? <ChevronUp className="text-gold" /> : <ChevronDown className="text-white/40" />}
      </button>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 text-white/60 leading-relaxed max-w-2xl"
        >
          {answer}
        </motion.div>
      )}
    </div>
  );
};

const FAQs: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-20 px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl font-display font-bold gold-gradient mb-4">FREQUENTLY ASKED</h1>
        <p className="text-white/40 uppercase tracking-[0.3em] text-sm">Common inquiries about the Aurelian experience</p>
      </motion.div>

      <div className="space-y-2">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <FAQItem {...faq} />
          </motion.div>
        ))}
      </div>

      <div className="mt-20 p-12 border border-gold/20 bg-gold/5 rounded-2xl text-center">
        <h3 className="text-2xl font-display text-gold mb-4">Still have questions?</h3>
        <p className="text-white/60 mb-8 max-w-md mx-auto">Our concierge team is available 24/7 to assist with any specific requirements or special requests.</p>
        <button className="px-8 py-3 border border-gold text-gold uppercase tracking-widest hover:bg-gold hover:text-black transition-all duration-500">
          Contact Concierge
        </button>
      </div>
    </div>
  );
};

export default FAQs;
