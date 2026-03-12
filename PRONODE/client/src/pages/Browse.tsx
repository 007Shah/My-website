import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Briefcase, MapPin, X } from "lucide-react";
import { useLocation } from "wouter";

// Mock Data
const experts = [
  {
    id: 1,
    name: "Dr. Robert Chen",
    role: "Former CTO at TechGiant",
    expertise: ["Cloud Architecture", "Strategic Planning", "AI Implementation"],
    location: "San Francisco, CA",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400&h=400",
    rate: "$250/hr"
  },
  {
    id: 2,
    name: "Sarah Williams",
    role: "Retired VP of Marketing",
    expertise: ["Brand Strategy", "Crisis Management", "Global Expansion"],
    location: "London, UK",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=400",
    rate: "$200/hr"
  },
  {
    id: 3,
    name: "James Wilson",
    role: "Ex-CFO Banking Sector",
    expertise: ["Mergers & Acquisitions", "Risk Management", "Fiscal Policy"],
    location: "New York, NY",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400&h=400",
    rate: "$300/hr"
  },
  {
    id: 4,
    name: "Eleanor Rigby",
    role: "Former Director of Operations",
    expertise: ["Supply Chain", "Lean Manufacturing", "Team Leadership"],
    location: "Chicago, IL",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400&h=400",
    rate: "$180/hr"
  },
  {
    id: 5,
    name: "Michael Chang",
    role: "Retired Legal Counsel",
    expertise: ["Corporate Law", "IP Rights", "Contract Negotiation"],
    location: "Singapore",
    image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=400&h=400",
    rate: "$275/hr"
  },
  {
    id: 6,
    name: "Margaret Thatcher",
    role: "Former Education Administrator",
    expertise: ["Curriculum Development", "Policy Making", "Staff Training"],
    location: "Boston, MA",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&h=400",
    rate: "$150/hr"
  }
];

export default function Browse() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [, setLocation] = useLocation();

  const filteredExperts = experts.filter(expert => 
    expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expert.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expert.expertise.some(e => e.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleViewProfile = (expertId: number) => {
    setLocation(`/profile/${expertId}`);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 container mx-auto px-6">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto mb-16 text-center"
      >
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-5xl font-serif font-bold mb-6"
        >
          Find World-Class Expertise
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-muted-foreground text-lg mb-8"
        >
          Connect with vetted professionals who have decades of experience in your field.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex gap-4 max-w-xl mx-auto"
        >
          <div className="relative flex-1 group">
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 pointer-events-none"
            >
              <Search />
            </motion.div>
            <Input 
              placeholder="Search by name, role, or expertise..." 
              className="pl-10 py-6 bg-secondary/50 border-primary/20 focus-visible:ring-primary transition-all group-hover:border-primary/40"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              variant="outline" 
              className="h-12 px-6 border-primary/20 hover:border-primary/40 transition-colors"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-5 h-5 mr-2" /> Filters
            </Button>
          </motion.div>
        </motion.div>

        {/* Filters Panel */}
        {showFilters && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-8 p-6 bg-card/40 border border-border/50 rounded-xl max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Filter Results</h3>
              <button onClick={() => setShowFilters(false)} className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium block mb-2">Expertise</label>
                <Input placeholder="e.g., Cloud Architecture" className="bg-background/50" />
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Location</label>
                <Input placeholder="e.g., New York, NY" className="bg-background/50" />
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Hourly Rate</label>
                <Input placeholder="e.g., $150-$300" className="bg-background/50" />
              </div>
            </div>
            <Button className="mt-4 w-full bg-primary text-primary-foreground hover:bg-primary/90">Apply Filters</Button>
          </motion.div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredExperts.map((expert, index) => (
          <motion.div
            key={expert.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="group relative bg-card/40 border border-border/50 rounded-2xl overflow-hidden hover:border-primary/50 transition-colors duration-300"
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img 
                src={expert.image} 
                alt={expert.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-90" />
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex justify-between items-end mb-2">
                <div>
                  <h3 className="text-xl font-bold font-serif text-foreground group-hover:text-primary transition-colors">{expert.name}</h3>
                  <p className="text-sm text-primary font-medium">{expert.role}</p>
                </div>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 backdrop-blur-md">
                  {expert.rate}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                <MapPin className="w-3 h-3" /> {expert.location}
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {expert.expertise.slice(0, 2).map((skill: string, i: number) => (
                  <span key={i} className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground border border-border/50">
                    {skill}
                  </span>
                ))}
                {expert.expertise.length > 2 && (
                  <span className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground border border-border/50">
                    +{expert.expertise.length - 2} more
                  </span>
                )}
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  onClick={() => handleViewProfile(expert.id)}
                  className="w-full bg-white/5 hover:bg-primary hover:text-primary-foreground border border-white/10 backdrop-blur-md transition-all"
                >
                  View Profile
                </Button>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
