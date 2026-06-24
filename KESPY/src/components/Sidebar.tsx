import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "../lib/utils";
import { 
  Home,
  LayoutGrid, 
  Users, 
  MessageSquare, 
  AtSign,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();
  const [counts, setCounts] = React.useState({ commentsCount: 0, mentionsCount: 0 });

  React.useEffect(() => {
    let active = true;
    const fetchCounts = async () => {
      try {
        const res = await fetch("/api/users/me/counts");
        const contentType = res.headers.get("content-type");
        if (res.ok && active && contentType && contentType.includes("application/json")) {
          const json = await res.json();
          setCounts({
            commentsCount: json.commentsCount || 0,
            mentionsCount: json.mentionsCount || 0
          });
        }
      } catch (err) {
        console.error("Error fetching Sidebar counts:", err);
      }
    };
    fetchCounts();
    const interval = setInterval(fetchCounts, 8000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const links = [
    { 
      to: "/", 
      name: "Home", 
      icon: Home,
      color: "text-indigo-600 bg-indigo-50/50"
    },
    { 
      to: "/pages", 
      name: "Pages Directory", 
      icon: LayoutGrid,
      color: "text-amber-600 bg-amber-50/50"
    },
    { 
      to: "/network?tab=friends", 
      name: "My Friends", 
      icon: Users,
      color: "text-emerald-600 bg-emerald-50/50"
    },
    { 
      to: "/network?tab=mentions", 
      name: "Mentions", 
      icon: AtSign,
      color: "text-indigo-600 bg-indigo-50/50"
    },
  ];

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Sidebar Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col h-full overflow-hidden p-3 min-h-[480px]">
        {/* Toggle / Header section */}
        <div className="flex items-center justify-between border-b border-slate-50 pb-3 mb-3 px-2">
          {!collapsed && (
            <div className="flex items-center gap-2 group select-none">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#7C3AED] via-[#C084FC] to-[#F43F5E] flex items-center justify-center shadow-sm">
                <span className="font-serif font-black text-white text-xs tracking-normal">K</span>
              </div>
              <span className="font-serif font-black tracking-tighter text-base bg-gradient-to-r from-[#1E1B4B] via-[#7C3AED] to-[#F43F5E] bg-clip-text text-transparent">
                Kespy
              </span>
            </div>
          )}
          <button
            onClick={onToggle}
            className={cn(
              "p-1.5 rounded-xl hover:bg-slate-50 text-slate-450 hover:text-indigo-600 transition-colors cursor-pointer",
              collapsed ? "mx-auto" : ""
            )}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Links list */}
        <ul className="space-y-1.5 flex-1 col-expanded">
          {links.map((link) => {
            const Icon = link.icon;
            
            // Checking active states properly for exact queries or parent routes
            const currentTab = new URLSearchParams(location.search).get("tab");
            const targetTab = new URLSearchParams(link.to.split("?")[1] || "").get("tab");
            
            const isTabActive = link.to.startsWith("/network") 
              ? (location.pathname === "/network" && currentTab === targetTab)
              : (location.pathname === link.to);

            const badge = link.name === "Comments" 
              ? counts.commentsCount 
              : link.name === "Mentions" 
                ? counts.mentionsCount 
                : 0;

            return (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  title={collapsed ? `${link.name} ${badge > 0 ? `(${badge})` : ""}` : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl text-[12px] font-bold uppercase tracking-wider transition-all duration-250 cursor-pointer p-3 relative",
                    isTabActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50",
                    collapsed ? "justify-center px-0 w-11 h-11 mx-auto" : ""
                  )}
                >
                  <div className={cn(
                    "flex items-center justify-center rounded-xl transition-colors relative",
                    collapsed ? "" : "p-1.5",
                    isTabActive 
                      ? "text-white bg-white/10" 
                      : link.color
                  )}>
                    <Icon className="w-4 h-4 shrink-0 font-medium" />
                    {collapsed && badge > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[8px] font-extrabold text-white ring-2 ring-white">
                        {badge}
                      </span>
                    )}
                  </div>
                  {!collapsed && <span className="font-semibold text-slate-700 truncate flex-1">{link.name}</span>}
                  
                  {!collapsed && badge > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-500 hover:bg-rose-600 hover:scale-105 transition-all text-white font-black text-[9px] min-w-[18px] text-center shadow-sm">
                      {badge}
                    </span>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>

        {/* Mini version brand indicator */}
        {!collapsed && (
          <div className="pt-3 border-t border-slate-50 text-center text-[10px] text-slate-550 font-bold">
            Kespy © 2026
          </div>
        )}
      </div>
    </div>
  );
}
