import { motion } from "framer-motion";
import { Award, Users, Globe, Shield } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-6">
        
        {/* Mission */}
        <div className="max-w-4xl mx-auto text-center mb-24">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-serif font-bold mb-8"
          >
            Bridging Generations
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground leading-relaxed"
          >
            We believe that retirement shouldn't mean the end of contribution. 
            ProNode exists to unlock the vast reservoir of knowledge held by retired professionals 
            and make it accessible to the next generation of leaders and businesses.
          </motion.p>
        </div>

        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24 border-y border-border/40 py-12"
        >
          {[
            { label: "Active Experts", value: "2,500+" },
            { label: "Companies Served", value: "500+" },
            { label: "Countries", value: "45" },
            { label: "Years of Experience", value: "50,000+" }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="text-center group"
            >
              <motion.div 
                className="text-3xl md:text-4xl font-bold text-primary mb-2 group-hover:text-primary/80 transition-colors"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
              >
                {stat.value}
              </motion.div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <motion.h2 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl font-serif font-bold mb-6"
            >
              Our Core Values
            </motion.h2>
            <div className="space-y-8">
              {[
                { icon: Award, title: "Excellence", desc: "We vet every professional to ensure the highest quality of mentorship." },
                { icon: Users, title: "Community", desc: "Building meaningful relationships that transcend transactional value." },
                { icon: Globe, title: "Accessibility", desc: "Making elite expertise available to startups and established firms alike." },
                { icon: Shield, title: "Integrity", desc: "Trust is the foundation of every connection we facilitate." }
              ].map((value, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ x: 8 }}
                  className="flex gap-4 group cursor-pointer"
                >
                  <motion.div 
                    className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-primary group-hover:bg-primary/20 transition-colors"
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <value.icon />
                  </motion.div>
                  <div>
                    <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{value.title}</h3>
                    <p className="text-muted-foreground text-sm group-hover:text-foreground/70 transition-colors">{value.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative h-[600px] rounded-2xl overflow-hidden bg-secondary/30 group"
          >
             {/* Abstract decorative element */}
             <motion.div 
               animate={{ opacity: [0.2, 0.3, 0.2] }}
               transition={{ duration: 4, repeat: Infinity }}
               className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent"
             />
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6, delay: 0.3 }}
               viewport={{ once: true }}
               className="absolute bottom-0 left-0 right-0 p-12 bg-gradient-to-t from-background to-transparent"
             >
               <blockquote className="text-2xl font-serif italic text-white/90">
                 "The only source of knowledge is experience."
               </blockquote>
               <cite className="text-primary mt-4 block not-italic">— Albert Einstein</cite>
             </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
