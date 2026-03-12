import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, MessageCircle, Calendar, MapPin } from "lucide-react";

// Mock expert data
const experts: Record<string, any> = {
  1: {
    id: 1,
    name: "Dr. Robert Chen",
    role: "Former CTO at TechGiant",
    expertise: ["Cloud Architecture", "Strategic Planning", "AI Implementation", "DevOps"],
    location: "San Francisco, CA",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400&h=400",
    rate: "$250/hr",
    bio: "With 25+ years of experience in tech leadership, Dr. Chen has guided multiple Fortune 500 companies through digital transformation.",
    experience: "CTO at TechGiant, VP Engineering at CloudSoft, Senior Software Architect at WebScale Inc.",
    availability: "Available for 1-hour sessions Mon-Fri, 9am-5pm PST"
  },
  2: {
    id: 2,
    name: "Sarah Williams",
    role: "Retired VP of Marketing",
    expertise: ["Brand Strategy", "Crisis Management", "Global Expansion", "Market Research"],
    location: "London, UK",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=400",
    rate: "$200/hr",
    bio: "Sarah has built and scaled global marketing teams across 15+ countries, managing billion-dollar budgets.",
    experience: "VP Marketing at GlobalBrand, CMO at InnovateCorp, Marketing Director at GrowthCo.",
    availability: "Available for sessions Tue-Thu, 2pm-8pm GMT"
  },
  3: {
    id: 3,
    name: "James Wilson",
    role: "Ex-CFO Banking Sector",
    expertise: ["Mergers & Acquisitions", "Risk Management", "Fiscal Policy", "Financial Planning"],
    location: "New York, NY",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400&h=400",
    rate: "$300/hr",
    bio: "James oversaw $50B+ in M&A transactions and led financial strategies for major banking institutions.",
    experience: "CFO at FinanceGlobal, VP Finance at InvestBank, Controller at MoneyCore.",
    availability: "Available for sessions Mon, Wed, Fri, 1pm-5pm EST"
  },
  4: {
    id: 4,
    name: "Eleanor Rigby",
    role: "Former Director of Operations",
    expertise: ["Supply Chain", "Lean Manufacturing", "Team Leadership", "Process Optimization"],
    location: "Chicago, IL",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400&h=400",
    rate: "$180/hr",
    bio: "Eleanor streamlined operations for manufacturing companies, reducing costs by up to 40%.",
    experience: "Director of Operations at FactoryPro, VP Operations at MakeWell, COO at ProduceMax.",
    availability: "Available for sessions all weekdays, 10am-6pm CST"
  },
  5: {
    id: 5,
    name: "Michael Chang",
    role: "Retired Legal Counsel",
    expertise: ["Corporate Law", "IP Rights", "Contract Negotiation", "Compliance"],
    location: "Singapore",
    image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=400&h=400",
    rate: "$275/hr",
    bio: "Michael negotiated complex international contracts and protected IP rights for tech startups.",
    experience: "Legal Counsel at TechLegal, Partner at InnovateLaw, Senior Attorney at CorpAdvise.",
    availability: "Available for sessions daily, 9pm-midnight SGT (flexible for timezones)"
  },
  6: {
    id: 6,
    name: "Margaret Thatcher",
    role: "Former Education Administrator",
    expertise: ["Curriculum Development", "Policy Making", "Staff Training", "Educational Strategy"],
    location: "Boston, MA",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&h=400",
    rate: "$150/hr",
    bio: "Margaret transformed educational institutions and mentored thousands of educators and administrators.",
    experience: "Principal at BostonAcademy, Director of Education at StateSchools, Superintendent at DistrictEd.",
    availability: "Available for sessions Tue-Sat, 2pm-7pm EST"
  }
};

export default function Profile() {
  const [currentLocation, setLocation] = useLocation();
  const expertId = currentLocation.split('/').pop() || '1';
  const expert = experts[expertId];

  if (!expert) {
    return (
      <div className="min-h-screen pt-32 pb-20 container mx-auto px-6 text-center">
        <h1 className="text-2xl font-serif font-bold mb-4">Expert not found</h1>
        <Button onClick={() => setLocation('/browse')}>Back to Browse</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 bg-background">
      <div className="container mx-auto px-6">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => setLocation('/browse')}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft size={20} /> Back to Experts
        </motion.button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="md:col-span-1"
          >
            <Card className="bg-card/50 border-border/50 overflow-hidden">
              <div className="aspect-square overflow-hidden">
                <img 
                  src={expert.image} 
                  alt={expert.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6 space-y-6">
                <div>
                  <h1 className="text-2xl font-serif font-bold mb-2">{expert.name}</h1>
                  <p className="text-primary font-semibold">{expert.role}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin size={16} /> {expert.location}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-border/30">
                    <span className="text-sm font-medium">Rate</span>
                    <span className="text-lg font-bold text-primary">{expert.rate}</span>
                  </div>
                </div>

                <button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg py-3 font-semibold transition-all flex items-center justify-center gap-2">
                  <MessageCircle size={18} /> Schedule Session
                </button>
                <button className="w-full border border-primary/20 text-foreground hover:bg-primary/10 rounded-lg py-3 font-semibold transition-all">
                  Contact Directly
                </button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Profile Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-2 space-y-6"
          >
            {/* About */}
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="font-serif">About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{expert.bio}</p>
              </CardContent>
            </Card>

            {/* Expertise */}
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="font-serif">Areas of Expertise</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {expert.expertise.map((skill: string, i: number) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-4 py-2">
                        {skill}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Experience */}
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="font-serif">Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{expert.experience}</p>
              </CardContent>
            </Card>

            {/* Availability */}
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="font-serif flex items-center gap-2">
                  <Calendar size={20} className="text-primary" /> Availability
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{expert.availability}</p>
              </CardContent>
            </Card>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 border border-primary/20 rounded-lg bg-gradient-to-r from-primary/5 to-transparent"
            >
              <h3 className="font-serif font-bold mb-2">Ready to work together?</h3>
              <p className="text-muted-foreground text-sm mb-4">Schedule a consultation to discuss your needs.</p>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Book a Session Now
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
