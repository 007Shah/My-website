import React from 'react';
import { motion } from 'motion/react';
import { Search, Filter, Star, Clock, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const doctors = [
  { id: 1, name: 'Dr. Richard James', specialty: 'General Physician', image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400', rating: 4.9, experience: '12 years' },
  { id: 2, name: 'Dr. Emily Larson', specialty: 'Cardiologist', image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=400', rating: 4.8, experience: '8 years' },
  { id: 3, name: 'Dr. Michael Chen', specialty: 'Neurologist', image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400', rating: 5.0, experience: '15 years' },
  { id: 4, name: 'Dr. Sarah Johnson', specialty: 'Dermatologist', image: 'https://images.unsplash.com/photo-1559839734-2b71f153678f?auto=format&fit=crop&q=80&w=400', rating: 4.7, experience: '10 years' },
  { id: 5, name: 'Dr. David Wilson', specialty: 'Pediatrician', image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400', rating: 4.9, experience: '20 years' },
  { id: 6, name: 'Dr. Lisa Park', specialty: 'Gastroenterologist', image: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=400', rating: 4.8, experience: '7 years' },
];

export default function Doctors() {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-2xl font-bold mb-1">Find Your Specialist</h1>
          <p className="text-xs text-slate-500">Browse through our extensive list of trusted doctors.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or specialty..."
              className="pl-9 pr-4 py-2 glass rounded-xl text-xs w-full md:w-72 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <button className="p-2.5 glass rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doc, i) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -5 }}
            className="glass-card overflow-hidden group"
          >
            <div className="relative h-56 overflow-hidden">
              <img
                src={doc.image}
                alt={doc.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 right-3 px-2 py-0.5 glass rounded-full text-[10px] font-bold flex items-center gap-1">
                <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" /> {doc.rating}
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-1.5 text-emerald-500 text-[9px] font-bold uppercase tracking-widest mb-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Available
              </div>
              <h3 className="text-base font-bold mb-0.5">{doc.name}</h3>
              <p className="text-primary text-xs font-medium mb-4">{doc.specialty}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-3 text-[10px] text-slate-500">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {doc.experience}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> NY, USA</span>
                </div>
                <button 
                  onClick={() => navigate(`/doctor/${doc.id}`)}
                  className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-[10px] font-bold hover:bg-primary hover:text-white transition-all"
                >
                  Book Now
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
