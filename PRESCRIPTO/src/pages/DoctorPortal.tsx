import React from 'react';
import { motion } from 'motion/react';
import { Users, Calendar, FileText, Settings, Bell, Search } from 'lucide-react';
import { cn } from '../lib/utils';

export default function DoctorPortal() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050505] p-4 sm:p-8 relative overflow-hidden">
      {/* Background Mesh */}
      <div className="absolute inset-0 bg-mesh opacity-[0.03] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">Doctor Dashboard</h1>
            <p className="text-sm text-slate-500 font-medium">Welcome back, <span className="text-primary">Dr. Richard James</span></p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Search patients..."
                className="pl-11 pr-6 py-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all w-full md:w-64 shadow-sm"
              />
            </div>
            <button className="p-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl relative hover:bg-slate-50 dark:hover:bg-white/10 transition-all shadow-sm">
              <Bell className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#050505]"></span>
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total Patients', value: '1,284', icon: Users, color: 'blue' },
            { label: 'Appointments', value: '42', icon: Calendar, color: 'emerald' },
            { label: 'AI Reports', value: '156', icon: FileText, color: 'purple' },
            { label: 'Pending Tasks', value: '12', icon: Bell, color: 'red' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-5"
            >
              <div className={`w-10 h-10 rounded-xl bg-${stat.color}-500/10 flex items-center justify-center mb-3`}>
                <stat.icon className={`w-5 h-5 text-${stat.color}-500`} />
              </div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
              <p className="text-xl font-bold">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <section className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-base font-bold">Patient Management</h2>
                <button className="text-[10px] font-bold text-primary hover:underline">View All Patients</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-white/5">
                      <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Patient</th>
                      <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Last Visit</th>
                      <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">AI Status</th>
                      <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {[
                      { name: 'John Doe', id: 'JD-882', date: '2 hours ago', status: 'High Risk', color: 'red' },
                      { name: 'Sarah Smith', id: 'SS-124', date: 'Yesterday', status: 'Normal', color: 'emerald' },
                      { name: 'Michael Chen', id: 'MC-901', date: '3 days ago', status: 'Moderate', color: 'amber' },
                      { name: 'Emma Wilson', id: 'EW-442', date: '1 week ago', status: 'High Risk', color: 'red' },
                    ].map((patient) => (
                      <tr key={patient.id} className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-[10px]">
                              {patient.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="text-xs font-bold">{patient.name}</p>
                              <p className="text-[9px] text-slate-500">ID: {patient.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 text-[10px] text-slate-500">{patient.date}</td>
                        <td className="py-4">
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider",
                            patient.color === 'red' ? "bg-red-500/10 text-red-500" : 
                            patient.color === 'emerald' ? "bg-emerald-500/10 text-emerald-500" : 
                            "bg-amber-500/10 text-amber-500"
                          )}>
                            {patient.status}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <button className="p-2 hover:bg-primary/10 rounded-lg transition-colors group-hover:text-primary">
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="glass-card p-6">
              <h2 className="text-base font-bold mb-5">Recent AI Diagnoses</h2>
              <div className="space-y-2">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-xs">
                        JD
                      </div>
                      <div>
                        <p className="text-sm font-bold">John Doe</p>
                        <p className="text-[10px] text-slate-500">Brain Tumor Analysis • 2 hours ago</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-0.5 bg-red-500/10 text-red-500 text-[9px] font-bold rounded-full">High Risk</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="glass-card p-6">
              <h2 className="text-base font-bold mb-5">Upcoming Schedule</h2>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="flex gap-3">
                    <div className="text-center min-w-[40px]">
                      <p className="text-[10px] font-bold text-primary">10:00</p>
                      <p className="text-[8px] text-slate-500 uppercase">AM</p>
                    </div>
                    <div className="flex-1 pb-3 border-b border-slate-100 dark:border-white/5">
                      <p className="font-bold text-xs">Consultation: Sarah Smith</p>
                      <p className="text-[10px] text-slate-500">General Checkup</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
