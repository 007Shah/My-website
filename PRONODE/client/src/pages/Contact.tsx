import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent",
      description: "We'll get back to you within 24 hours.",
    });
  };

  return (
    <div className="min-h-screen pt-24 pb-20 container mx-auto px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto"
      >
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Get in Touch</h1>
          <p className="text-muted-foreground text-lg">We're here to help you find the right expertise.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="bg-card/30 border-border/50 backdrop-blur-sm hover:border-primary/30 transition-colors">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl">Contact Information</CardTitle>
                  <CardDescription>Reach out to us directly.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {[
                    { icon: Mail, label: "Email", value: "contact@pronode.com" },
                    { icon: Phone, label: "Phone", value: "+1 (555) 123-4567" },
                    { icon: MapPin, label: "Office", value: "123 Business Ave, Suite 100\nNew York, NY 10001" }
                  ].map((item, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-center gap-4 group"
                    >
                      <motion.div 
                        className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors"
                        whileHover={{ scale: 1.15, rotate: 10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <item.icon size={20} />
                      </motion.div>
                      <div>
                        <div className="font-medium group-hover:text-primary transition-colors">{item.label}</div>
                        <div className="text-sm text-muted-foreground">{item.value}</div>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              className="p-8 rounded-2xl bg-primary/5 border border-primary/10 hover:border-primary/30 hover:bg-primary/10 transition-all cursor-pointer"
            >
              <h3 className="font-bold text-lg mb-2">FAQ</h3>
              <p className="text-sm text-muted-foreground mb-4">Check our knowledge base for quick answers to common questions about hiring experts or joining as a professional.</p>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  variant="outline" 
                  className="w-full border-primary/20 hover:bg-primary/10 transition-all"
                  onClick={() => window.open('https://help.example.com', '_blank')}
                >
                  Visit Help Center
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="bg-card border-border/50 hover:border-primary/30 transition-colors">
              <CardHeader>
                <CardTitle className="font-serif text-2xl">Send us a Message</CardTitle>
                <CardDescription>Fill out the form below and we'll be in touch.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div className="space-y-2">
                      <label className="text-sm font-medium">First Name</label>
                      <motion.div whileFocus={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                        <Input placeholder="John" className="bg-background/50 transition-all focus:bg-background/70" required />
                      </motion.div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Last Name</label>
                      <motion.div whileFocus={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                        <Input placeholder="Doe" className="bg-background/50 transition-all focus:bg-background/70" required />
                      </motion.div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="space-y-2"
                  >
                    <label className="text-sm font-medium">Email</label>
                    <motion.div whileFocus={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                      <Input type="email" placeholder="john@example.com" className="bg-background/50 transition-all focus:bg-background/70" required />
                    </motion.div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="space-y-2"
                  >
                    <label className="text-sm font-medium">Subject</label>
                    <motion.div whileFocus={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                      <Input placeholder="Inquiry about..." className="bg-background/50 transition-all focus:bg-background/70" required />
                    </motion.div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="space-y-2"
                  >
                    <label className="text-sm font-medium">Message</label>
                    <motion.div whileFocus={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                      <Textarea placeholder="How can we help you?" className="min-h-[150px] bg-background/50 transition-all focus:bg-background/70" required />
                    </motion.div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all">Send Message</Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
