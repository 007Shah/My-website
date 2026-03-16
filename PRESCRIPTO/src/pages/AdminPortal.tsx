import React from 'react';
import { motion } from 'motion/react';
import { Shield, Server, Database, Globe, Activity, AlertTriangle, Users, Cpu, BarChart3, PieChart as PieChartIcon, TrendingUp } from 'lucide-react';
import { cn } from '../lib/utils';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Cell,
  Pie
} from 'recharts';

const performanceData = [
  { name: '00:00', requests: 400, latency: 120 },
  { name: '04:00', requests: 300, latency: 110 },
  { name: '08:00', requests: 900, latency: 150 },
  { name: '12:00', requests: 1200, latency: 180 },
  { name: '16:00', requests: 1500, latency: 200 },
  { name: '20:00', requests: 1100, latency: 160 },
  { name: '23:59', requests: 600, latency: 130 },
];

const modelAccuracyData = [
  { name: 'Glaucoma', accuracy: 98.2 },
  { name: 'Brain Tumor', accuracy: 96.5 },
  { name: 'Kidney Stone', accuracy: 94.1 },
  { name: 'Retinal', accuracy: 97.8 },
];

const diagnosticDistribution = [
  { name: 'Normal', value: 45, color: '#10b981' },
  { name: 'High Risk', value: 25, color: '#ef4444' },
  { name: 'Moderate', value: 30, color: '#f59e0b' },
];

export default function AdminPortal() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050505] p-4 sm:p-8 relative overflow-hidden">
      {/* Background Mesh for better contrast in light theme */}
      <div className="absolute inset-0 bg-mesh opacity-[0.03] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-12 flex items-end justify-between">
          <div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 mb-2"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Admin Command Center</h1>
            </motion.div>
            <p className="text-sm text-slate-500 font-medium">System Health & AI Model Monitoring • Real-time Data</p>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 rounded-full text-[10px] font-bold uppercase tracking-widest border border-emerald-500/20">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              All Systems Operational
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <section className="lg:col-span-2 space-y-6">
            {/* Real-time Stats Grid */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">+12%</span>
                </div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Total Requests</p>
                <p className="text-2xl font-bold">142,842</p>
              </div>

              <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-emerald-500" />
                  </div>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">+5%</span>
                </div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Active Users</p>
                <p className="text-2xl font-bold">1,284</p>
              </div>

              <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
                    <Cpu className="w-5 h-5 text-amber-500" />
                  </div>
                  <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-1 rounded-full">Stable</span>
                </div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">AI Nodes</p>
                <p className="text-2xl font-bold">24 / 24</p>
              </div>
            </div>

            {/* AI Request Volume Chart */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-base font-bold">AI Request Volume</h2>
                  <p className="text-[10px] text-slate-500">Hourly request distribution across all models</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-[10px] font-medium text-slate-500">Requests</span>
                  </div>
                </div>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData}>
                    <defs>
                      <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#5f6fff" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#5f6fff" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#94a3b8' }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#94a3b8' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        borderRadius: '12px', 
                        border: 'none', 
                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' 
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="requests" 
                      stroke="#5f6fff" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorRequests)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {/* Model Accuracy Chart */}
              <div className="glass-card p-6">
                <div className="flex items-center gap-2 mb-6">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  <h2 className="text-sm font-bold">Model Accuracy</h2>
                </div>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={modelAccuracyData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 8, fill: '#94a3b8' }}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 8, fill: '#94a3b8' }}
                        domain={[90, 100]}
                      />
                      <Tooltip />
                      <Bar dataKey="accuracy" fill="#5f6fff" radius={[4, 4, 0, 0]} barSize={30} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Diagnostic Distribution */}
              <div className="glass-card p-6">
                <div className="flex items-center gap-2 mb-6">
                  <PieChartIcon className="w-4 h-4 text-primary" />
                  <h2 className="text-sm font-bold">Diagnostic Distribution</h2>
                </div>
                <div className="h-[200px] w-full flex items-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={diagnosticDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {diagnosticDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2 ml-4">
                    {diagnosticDistribution.map((item) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-[10px] font-medium text-slate-500">{item.name} ({item.value}%)</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* System Logs Section */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-base font-bold">Recent System Logs</h2>
                <button className="text-[10px] font-bold text-primary hover:underline">Download Logs</button>
              </div>
              <div className="space-y-3">
                {[
                  { time: '12:45:22', event: 'Model Deployment', desc: 'Glaucoma Detection v2.4 successfully deployed to edge nodes.', status: 'success' },
                  { time: '12:30:15', event: 'Security Alert', desc: 'Multiple failed login attempts detected from IP 192.168.1.45.', status: 'warning' },
                  { time: '12:15:00', event: 'Database Backup', desc: 'Full system backup completed. 4.2GB stored in AWS S3.', status: 'success' },
                  { time: '11:55:42', event: 'API Key Rotation', desc: 'Automated rotation of production API keys completed.', status: 'info' },
                ].map((log, i) => (
                  <div key={i} className="flex gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                    <div className="text-[10px] font-mono text-slate-400 pt-1">{log.time}</div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold">{log.event}</span>
                        <span className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          log.status === 'success' ? "bg-emerald-500" :
                          log.status === 'warning' ? "bg-amber-500" :
                          "bg-primary"
                        )} />
                      </div>
                      <p className="text-[10px] text-slate-500 leading-relaxed">{log.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Sidebar Info */}
          <aside className="space-y-6">
            {/* System Health Summary */}
            <div className="glass-card p-6">
              <h2 className="text-base font-bold mb-6">System Health</h2>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Server className="w-4 h-4 text-emerald-500" />
                      <span className="text-xs font-bold">Server Load</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-500">32%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '32%' }}
                      className="h-full bg-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-primary" />
                      <span className="text-xs font-bold">API Latency</span>
                    </div>
                    <span className="text-[10px] font-bold text-primary">120ms</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '15%' }}
                      className="h-full bg-primary"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <h2 className="text-base font-bold mb-5">Quick Actions</h2>
              <div className="grid grid-cols-1 gap-3">
                <button className="flex items-center gap-4 p-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl shadow-sm hover:bg-primary/5 hover:border-primary/30 transition-all text-left group">
                  <Database className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-xs font-bold">Backup Database</p>
                    <p className="text-[9px] text-slate-500">Last: 2 hours ago</p>
                  </div>
                </button>
                <button className="flex items-center gap-4 p-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl shadow-sm hover:bg-primary/5 hover:border-primary/30 transition-all text-left group">
                  <Globe className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-xs font-bold">Flush CDN Cache</p>
                    <p className="text-[9px] text-slate-500">Global edge nodes</p>
                  </div>
                </button>
              </div>
            </div>

            <div className="glass-card p-6 border-red-500/20">
              <h2 className="text-base font-bold mb-4 flex items-center gap-2 text-red-500">
                <AlertTriangle className="w-4 h-4" /> Critical Alerts
              </h2>
              <div className="space-y-3">
                <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                  <p className="text-[10px] font-bold text-red-500 mb-1">Security Breach Attempt</p>
                  <p className="text-[9px] text-slate-500">IP: 192.168.1.45 blocked by firewall.</p>
                </div>
                <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
                  <p className="text-[10px] font-bold text-amber-500 mb-1">Model Latency Spike</p>
                  <p className="text-[9px] text-slate-500">Kidney Stone Analysis (v1.8) slow responses.</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
