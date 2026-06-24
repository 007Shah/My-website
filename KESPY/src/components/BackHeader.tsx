import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";

export default function BackHeader() {
  const navigate = useNavigate();
  const location = useLocation();

  // Highlight or omit on Home
  if (location.pathname === "/") {
    return null;
  }

  // Format the crumb elegantly and cleanly
  const pathParts = location.pathname.split("/").filter(Boolean);
  const formattedCrumb = pathParts
    .map((part) => decodeURIComponent(part).replace(/[-_]/g, " "))
    .join(" / ");

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6 px-2">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white hover:bg-slate-50 border border-slate-100 text-slate-700 hover:text-slate-900 shadow-sm transition-all text-xs font-bold uppercase tracking-wider cursor-pointer active:scale-95 shrink-0"
      >
        <ArrowLeft className="w-4 h-4 text-indigo-500" />
        Back
      </button>
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-850 transition-all text-xs font-bold uppercase tracking-wider cursor-pointer shrink-0"
        title="Go to Home"
      >
        <Home className="w-3.5 h-3.5" />
        Home
      </button>

      {/* Elegant location breadcrumb */}
      <span className="text-[10px] uppercase font-black tracking-widest text-[#94a3b8] select-none pl-3 border-l border-slate-200/80 truncate max-w-[200px] sm:max-w-md hidden sm:inline-block">
        {formattedCrumb}
      </span>
    </div>
  );
}
