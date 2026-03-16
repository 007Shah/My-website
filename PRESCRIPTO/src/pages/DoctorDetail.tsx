import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Star, Clock, MapPin, Calendar, Shield, CheckCircle2, ChevronLeft, MessageSquare, Phone } from 'lucide-react';

const doctors = [
  { id: 1, name: 'Dr. Richard James', specialty: 'General Physician', image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=800', rating: 4.9, experience: '12 years', about: 'Dr. Richard James has a commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. James has a strong background in internal medicine and a passion for helping patients achieve their health goals.', fees: '$50' },
  { id: 2, name: 'Dr. Emily Larson', specialty: 'Cardiologist', image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=800', rating: 4.8, experience: '8 years', about: 'Dr. Emily Larson is a board-certified cardiologist specializing in interventional cardiology and heart failure management. She is dedicated to providing personalized care and utilizing the latest diagnostic technologies to improve patient outcomes.', fees: '$80' },
  { id: 3, name: 'Dr. Michael Chen', specialty: 'Neurologist', image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800', rating: 5.0, experience: '15 years', about: 'Dr. Michael Chen is a highly experienced neurologist with a focus on neurodegenerative diseases and stroke prevention. He has published numerous research papers and is committed to advancing the field of neurology through innovation and patient-centered care.', fees: '$100' },
];

export default function DoctorDetail() {
  const { id } = useParams();
  const doctor = doctors.find(d => d.id === Number(id)) || doctors[0];
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState('');

  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return { day: days[d.getDay()], date: d.getDate() };
  });

  const times = ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <Link to="/doctors" className="inline-flex items-center text-[11px] font-bold uppercase tracking-wider text-slate-500 hover:text-primary mb-8">
        <ChevronLeft className="w-3 h-3 mr-1" /> Back to All Doctors
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Doctor Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 sm:p-8 flex flex-col sm:flex-row gap-8"
          >
            <div className="w-full sm:w-48 h-64 shrink-0 rounded-[32px] overflow-hidden shadow-2xl">
              <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold tracking-tight">{doctor.name}</h1>
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </div>
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{doctor.specialty}</p>
                <div className="px-3 py-1 glass rounded-full text-[10px] font-bold flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> {doctor.rating}
                </div>
                <div className="px-3 py-1 glass rounded-full text-[10px] font-bold text-primary">
                  {doctor.experience} Experience
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold">
                  About <Shield className="w-3 h-3 text-primary" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {doctor.about}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold opacity-60 uppercase tracking-wider mb-1">Appointment Fee</p>
                  <p className="text-xl font-bold text-primary">{doctor.fees}</p>
                </div>
                <div className="flex gap-3">
                  <button className="p-3 glass rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                    <MessageSquare className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                  </button>
                  <button className="p-3 glass rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                    <Phone className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Booking Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-8"
          >
            <h2 className="text-lg font-bold mb-8 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Booking Slots
            </h2>

            <div className="space-y-8">
              <div>
                <p className="text-[10px] font-bold opacity-60 uppercase tracking-wider mb-4">Select Date</p>
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {dates.map((d, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedDate(i)}
                      className={`min-w-[64px] py-4 rounded-2xl border transition-all flex flex-col items-center gap-1 ${
                        selectedDate === i
                          ? 'bg-primary border-primary text-white shadow-lg shadow-primary/30'
                          : 'glass border-white/10 hover:border-primary/50'
                      }`}
                    >
                      <span className="text-[10px] font-bold opacity-60">{d.day}</span>
                      <span className="text-sm font-bold">{d.date}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold opacity-60 uppercase tracking-wider mb-4">Select Time</p>
                <div className="flex flex-wrap gap-3">
                  {times.map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTime(t)}
                      className={`px-6 py-3 rounded-xl border text-[11px] font-bold transition-all ${
                        selectedTime === t
                          ? 'bg-primary border-primary text-white shadow-lg shadow-primary/30'
                          : 'glass border-white/10 hover:border-primary/50'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <button className="w-full py-4 bg-primary text-white rounded-2xl text-sm font-bold hover:bg-primary-hover transition-all shadow-2xl shadow-primary/30 mt-8">
                Book Appointment
              </button>
            </div>
          </motion.div>
        </div>

        <aside className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="text-base font-bold mb-4">Location</h3>
            <div className="aspect-video rounded-2xl overflow-hidden mb-4 bg-slate-100 dark:bg-slate-800 relative">
              <img src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=400" alt="Map" className="w-full h-full object-cover grayscale" />
              <div className="absolute inset-0 bg-primary/10" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <MapPin className="w-8 h-8 text-primary animate-bounce" />
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              123 Medical Plaza, Suite 402<br />
              New York, NY 10001
            </p>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-base font-bold mb-4">Specializations</h3>
            <div className="flex flex-wrap gap-2">
              {['General Medicine', 'Internal Medicine', 'Preventive Care', 'Diagnosis'].map(spec => (
                <span key={spec} className="px-3 py-1 bg-slate-50 dark:bg-white/5 rounded-lg text-[10px] font-bold text-slate-600 dark:text-slate-400">
                  {spec}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
