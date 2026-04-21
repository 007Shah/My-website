import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, X, Moon, Sun, Monitor } from 'lucide-react';
import { cn } from '../utils/cn';

const themes = [
  { id: 'mustard', name: 'Mustard', color: '#FFCC00' },
  { id: 'crimson', name: 'Crimson', color: '#FF3333' },
  { id: 'toxic', name: 'Toxic', color: '#00FF66' },
  { id: 'cyber', name: 'Cyber', color: '#00E5FF' },
  { id: 'violet', name: 'Violet', color: '#B026FF' }
];

const bgThemes = [
  { id: 'dark', name: 'Obsidian', icon: Monitor },
  { id: 'light', name: 'Daylight', icon: Sun },
  { id: 'midnight', name: 'Midnight', icon: Moon }
];

export function ThemeSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState('mustard');
  const [activeBgTheme, setActiveBgTheme] = useState('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('app-theme') || 'mustard';
    const savedBgTheme = localStorage.getItem('app-bg-theme') || 'dark';
    
    setActiveTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    setActiveBgTheme(savedBgTheme);
    document.documentElement.setAttribute('data-bg-theme', savedBgTheme);
  }, []);

  const changeTheme = (themeId: string) => {
    setActiveTheme(themeId);
    document.documentElement.setAttribute('data-theme', themeId);
    localStorage.setItem('app-theme', themeId);
  };
  
  const changeBgTheme = (bgThemeId: string) => {
    setActiveBgTheme(bgThemeId);
    document.documentElement.setAttribute('data-bg-theme', bgThemeId);
    localStorage.setItem('app-bg-theme', bgThemeId);
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50 w-12 h-12 bg-obsidian border border-gray-deep rounded-full flex items-center justify-center text-white hover:border-theme transition-all duration-300 shadow-xl hover:shadow-theme/20 md:bottom-8 md:left-8"
      >
        <Palette size={20} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="fixed bottom-[80px] left-6 z-50 bg-obsidian/95 backdrop-blur-xl border border-gray-deep p-5 rounded-2xl shadow-2xl min-w-[260px] max-w-[calc(100vw-3rem)] md:bottom-[90px] md:left-8 overflow-hidden"
          >
            <div className="flex justify-between items-center mb-5 border-b border-gray-deep/50 pb-3">
              <h3 className="text-[14px] font-bold text-white tracking-wide">Personalize</h3>
              <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-theme transition-colors p-1 bg-white/5 rounded-full">
                <X size={16} />
              </button>
            </div>
            
            <div className="mb-6">
              <span className="text-[11px] uppercase text-white/50 tracking-wider block mb-3 font-semibold">Accent Color</span>
              <div className="flex flex-col gap-1">
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => changeTheme(theme.id)}
                    className={cn(
                      "flex items-center gap-3 w-full p-2 text-left text-[14px] font-medium transition-all duration-300 rounded-xl hover:bg-white/5",
                      activeTheme === theme.id ? "text-white bg-white/5" : "text-white/60"
                    )}
                  >
                    <div 
                      className={cn(
                        "w-5 h-5 rounded-full border border-gray-deep transition-transform duration-300 shadow-inner",
                        activeTheme === theme.id ? "scale-110 shadow-md ring-2 ring-white/20" : ""
                      )}
                      style={{ backgroundColor: theme.color }}
                    />
                    {theme.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[11px] uppercase text-white/50 tracking-wider block mb-3 font-semibold">Background Vibe</span>
              <div className="grid grid-cols-3 gap-2">
                {bgThemes.map((bgTheme) => {
                  const Icon = bgTheme.icon;
                  return (
                    <button
                      key={bgTheme.id}
                      onClick={() => changeBgTheme(bgTheme.id)}
                      className={cn(
                        "flex flex-col items-center justify-center p-3 border transition-all duration-300 rounded-xl",
                        activeBgTheme === bgTheme.id 
                          ? "border-theme text-theme bg-theme/10 shadow-sm" 
                          : "border-gray-deep/50 text-white/50 hover:border-white/20 hover:text-white bg-white/5"
                      )}
                      title={bgTheme.name}
                    >
                      <Icon size={18} className="mb-2" />
                      <span className="text-[10px] font-semibold tracking-wide">{bgTheme.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
