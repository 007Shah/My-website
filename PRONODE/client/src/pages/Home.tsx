import heroImage from "@assets/generated_images/senior_professionals_collaborating_in_dark_modern_office.png";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Professionals collaborating" 
            className="w-full h-full object-cover opacity-40 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
        </div>

        <div className="container relative z-10 px-6 mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-serif font-bold tracking-tight mb-6"
          >
            Experience Meets <span className="text-primary">Opportunity</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 font-light"
          >
            Connect with distinguished retired professionals for mentorship, consulting, and board advisory roles.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col md:flex-row gap-4 justify-center"
          >
            <Link href="/browse">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6 rounded-full">
                Find an Expert
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="border-primary/20 hover:bg-primary/10 text-lg px-8 py-6 rounded-full text-foreground">
                Learn More
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-secondary/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/50 pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-serif font-bold mb-4">Why Choose ProNode</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Unlocking expertise through carefully vetted connections</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: "Curated Expertise", desc: "Access a vetted network of industry veterans with proven track records." },
              { title: "Flexible Engagement", desc: "From hourly consultations to long-term board positions." },
              { title: "Knowledge Transfer", desc: "Bridge the generational gap and preserve institutional wisdom." }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.15, ease: "easeOut" }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="p-8 border border-border/40 rounded-2xl bg-card/50 hover:bg-card/80 hover:border-primary/30 transition-all duration-300 backdrop-blur-sm group cursor-pointer"
              >
                <motion.div 
                  className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <CheckCircle2 size={24} />
                </motion.div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"
        />
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
            className="max-w-4xl mx-auto text-center p-12 border border-primary/20 rounded-3xl bg-gradient-to-b from-card/80 to-background backdrop-blur-md hover:border-primary/40 transition-colors duration-300"
          >
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-4xl font-serif font-bold mb-6"
            >
              Ready to share your wisdom?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto"
            >
              Join thousands of retired professionals who are staying active, earning income, and shaping the next generation of leaders.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Link href="/login">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 py-6 text-lg group transition-all hover:shadow-lg hover:shadow-primary/50">
                  Join ProNode Today
                  <motion.span 
                    className="ml-2"
                    animate={{ x: 0 }}
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.span>
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
