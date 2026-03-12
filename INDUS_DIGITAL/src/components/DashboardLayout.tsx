import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Wallet, 
  Activity, 
  Share2, 
  ShieldCheck, 
  BarChart3, 
  LogOut,
  Cpu,
  Bell,
  Search,
  Menu,
  ChevronLeft,
  Fingerprint
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { CustomCursor } from './CustomCursor';
import { SceneBackground } from './SceneBackground';
import { motion, AnimatePresence } from 'framer-motion';

const NavItem = ({ to, icon: Icon, label, collapsed }: { to: string, icon: any, label: string, collapsed?: boolean }) => (
  <NavLink
    to={to}
    className={({ isActive }) => cn(
      "flex items-center gap-4 px-6 py-4 transition-all relative group",
      isActive ? "text-cyan" : "text-cyan/40 hover:text-cyan/70",
      collapsed && "justify-center px-0"
    )}
  >
    {({ isActive }) => (
      <>
        <Icon size={20} className={cn("transition-transform group-hover:scale-110 shrink-0", isActive && "drop-shadow-[0_0_8px_rgba(0,242,255,0.8)]")} />
        {!collapsed && (
          <motion.span 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-display text-xs font-bold uppercase tracking-widest whitespace-nowrap"
          >
            {label}
          </motion.span>
        )}
        {isActive && (
          <motion.div
            layoutId="nav-active"
            className="absolute left-0 w-1 h-8 bg-cyan cyan-glow rounded-r-full"
          />
        )}
      </>
    )}
  </NavLink>
);

export const DashboardLayout = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="h-screen flex text-white relative overflow-hidden">
      <CustomCursor />
      <SceneBackground />

      {/* Left Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ 
          width: isSidebarOpen ? '260px' : '80px',
        }}
        className="glass-panel border-r border-white/5 flex flex-col h-full z-20 shrink-0 overflow-hidden"
      >
        <div className={cn("p-8 flex items-center gap-3", !isSidebarOpen && "justify-center p-6")}>
          <div className="w-10 h-10 bg-cyan rounded-lg flex items-center justify-center cyan-glow shrink-0">
            <span className="text-void font-display font-black text-xl">I</span>
          </div>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="overflow-hidden"
            >
              <h2 className="font-display font-black text-lg leading-none tracking-tighter whitespace-nowrap">INDUS</h2>
              <span className="text-[10px] font-mono text-cyan/50 uppercase tracking-widest whitespace-nowrap">Digital Bank</span>
            </motion.div>
          )}
        </div>

          <nav className="flex-1 mt-8">
            <NavItem to="/dashboard" icon={LayoutDashboard} label="Accounts" collapsed={!isSidebarOpen} />
            <NavItem to="/transfers" icon={Share2} label="Transfers" collapsed={!isSidebarOpen} />
            <NavItem to="/payments" icon={Activity} label="Bill Payments" collapsed={!isSidebarOpen} />
            <NavItem to="/cards" icon={Wallet} label="My Cards" collapsed={!isSidebarOpen} />
            <NavItem to="/analytics" icon={BarChart3} label="Analytics" collapsed={!isSidebarOpen} />
            <NavItem to="/settings" icon={ShieldCheck} label="Security" collapsed={!isSidebarOpen} />
          </nav>

        <div className="p-6 border-t border-white/5">
          <button 
            onClick={() => navigate('/')}
            className={cn(
              "flex items-center gap-4 px-6 py-4 text-magenta/60 hover:text-magenta transition-colors w-full group",
              !isSidebarOpen && "justify-center px-0"
            )}
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform shrink-0" />
            {isSidebarOpen && <span className="font-display text-xs font-bold uppercase tracking-widest">Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Scrollable Content Area (Main + Right Sidebar) */}
      <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
        <div className="flex min-h-full">
          {/* Main Content - 75% of the scrollable area */}
          <main className="flex-1 p-8 border-r border-white/5">
            <header className="flex justify-between items-center mb-12 sticky top-0 z-30 py-4 bg-void/50 backdrop-blur-md -mx-8 px-8 border-b border-white/5">
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="p-2 glass-panel rounded-lg border-white/10 hover:border-cyan/50 transition-colors text-cyan"
                >
                  {isSidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
                </button>
                
                <div className="flex items-center gap-4 glass-panel px-6 py-3 rounded-xl border-white/5">
                  <Search size={18} className="text-cyan/50" />
                  <input 
                    type="text" 
                    placeholder="SEARCH TRANSACTIONS..." 
                    className="bg-transparent border-none outline-none font-mono text-xs text-cyan w-64 placeholder:text-cyan/20"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-mono text-cyan/50 uppercase">Daily Limit</span>
                  <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden mt-1">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '65%' }}
                      className="h-full bg-cyan cyan-glow"
                    />
                  </div>
                </div>
                <button className="relative p-2 glass-panel rounded-lg border-white/10 hover:border-cyan/50 transition-colors">
                  <Bell size={20} className="text-cyan" />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-magenta rounded-full magenta-glow" />
                </button>
                <div className="flex items-center gap-3 pl-6 border-l border-white/10">
                  <div className="text-right">
                    <p className="text-xs font-display font-bold">MANSOOR GILLANI</p>
                    <p className="text-[10px] font-mono text-cyan/50">INDUS PREMIER</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan to-cyber-blue p-[1px]">
                    <div className="w-full h-full bg-void rounded-[7px] flex items-center justify-center">
                      <Fingerprint size={20} className="text-cyan" />
                    </div>
                  </div>
                </div>
              </div>
            </header>

            <Outlet />
          </main>

          {/* Right Sidebar - 25% of the scrollable area */}
          <aside className="w-[320px] p-8 bg-void/20">
            <h3 className="font-display text-sm font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-cyan rounded-full animate-pulse" />
              Recent Activity
            </h3>
            
            <div className="space-y-4">
              {[
                { type: 'TRANSFER', msg: 'Sent PKR 12,000 to Ali Khan (Raast)', time: '2M AGO', color: 'cyan' },
                { type: 'BILL', msg: 'K-Electric bill paid successfully', time: '5M AGO', color: 'cyber-blue' },
                { type: 'SECURITY', msg: 'New login detected from iPhone 15 Pro', time: '12M AGO', color: 'magenta' },
                { type: 'INCOME', msg: 'Salary credited: PKR 250,000', time: '18M AGO', color: 'cyan' },
                { type: 'CARD', msg: 'Online purchase at Amazon: $42.50', time: '24M AGO', color: 'cyber-blue' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={cn(
                    "p-4 rounded-xl border-l-2 glass-panel",
                    item.color === 'amber' ? "border-amber/50" : 
                    item.color === 'cyan' ? "border-cyan/50" :
                    item.color === 'magenta' ? "border-magenta/50" : "border-cyber-blue/50"
                  )}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={cn(
                      "text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase",
                      item.color === 'amber' ? "bg-amber/20 text-amber" : 
                      item.color === 'cyan' ? "bg-cyan/20 text-cyan" :
                      item.color === 'magenta' ? "bg-magenta/20 text-magenta" : "bg-cyber-blue/20 text-cyber-blue"
                    )}>
                      {item.type}
                    </span>
                    <span className="text-[10px] font-mono text-white/30">{item.time}</span>
                  </div>
                  <p className="text-xs font-mono text-white/70 leading-relaxed">{item.msg}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-12">
              <h3 className="font-display text-sm font-black uppercase tracking-[0.2em] mb-6">Savings Progress</h3>
              <div className="space-y-6">
                <div className="glass-panel p-4 rounded-xl">
                  <div className="flex justify-between mb-2">
                    <span className="text-[10px] font-mono text-white/50 uppercase">Car Fund</span>
                    <span className="text-[10px] font-mono text-cyan">75%</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="w-[75%] h-full bg-cyan cyan-glow" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-panel p-4 rounded-xl text-center">
                    <span className="text-[10px] font-mono text-white/50 uppercase block mb-1">Reward Points</span>
                    <span className="text-sm font-display font-bold text-cyan tracking-tighter">12,894</span>
                  </div>
                  <div className="glass-panel p-4 rounded-xl text-center">
                    <span className="text-[10px] font-mono text-white/50 uppercase block mb-1">Cashback</span>
                    <span className="text-sm font-display font-bold text-cyan tracking-tighter">PKR 8.5K</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
