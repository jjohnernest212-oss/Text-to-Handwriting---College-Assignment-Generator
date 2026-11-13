import React from 'react';
import AppLogo from './AppLogo';
import { Download, Coffee, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenHowItWorks: () => void;
  onOpenBuyCoffee: () => void;
  onOpenExport: () => void;
  onScrollToSection?: (sectionId: string) => void;
}

export default function Header({
  theme,
  onToggleTheme,
  onOpenBuyCoffee,
  onOpenExport,
}: HeaderProps) {
  const isLight = theme === 'light';

  return (
    <header
      className={`sticky top-0 z-30 select-none h-14 sm:h-16 px-3 sm:px-6 flex items-center justify-between gap-3 transition-colors duration-200 border-b backdrop-blur-md ${
        isLight
          ? 'bg-white/90 border-slate-200/90 text-slate-900'
          : 'bg-[#111114]/90 border-white/10 text-white'
      }`}
    >
      {/* Zone 1: Brand Title */}
      <div className="flex items-center gap-2.5 min-w-0 shrink-0">
        <div className="w-9 h-9 bg-[#6366f1] rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs">
          <AppLogo size={22} className="text-white" />
        </div>
        <span
          className={`text-[15px] sm:text-lg font-bold tracking-tight whitespace-nowrap ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}
        >
          Text to Handwriting
        </span>
      </div>

      {/* Zone 2: Clean single-line utility & primary actions */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Theme Toggle */}
        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          className={`cursor-pointer min-h-[40px] min-w-[40px] rounded-xl flex items-center justify-center transition-colors border active:scale-95 ${
            isLight
              ? 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 border-slate-200'
              : 'bg-white/5 hover:bg-white/10 text-amber-300 border-white/10'
          }`}
        >
          {isLight ? (
            <Moon className="w-4 h-4 text-indigo-600" />
          ) : (
            <Sun className="w-4 h-4 text-amber-300" />
          )}
        </button>

        {/* Tip / Coffee */}
        <button
          type="button"
          onClick={onOpenBuyCoffee}
          title="Tip Plenty / Support (UPI & Bitcoin)"
          className={`cursor-pointer min-h-[40px] px-2.5 sm:px-3.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border whitespace-nowrap shrink-0 active:scale-95 ${
            isLight
              ? 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-900'
              : 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-400/25 text-amber-200'
          }`}
        >
          <Coffee className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span className="hidden sm:inline">Tip</span>
        </button>

        {/* Round GitHub Button: Follow Plenty */}
        <a
          href="https://github.com/plenty"
          target="_blank"
          rel="noopener noreferrer"
          title="Follow Plenty on GitHub"
          className={`cursor-pointer min-h-[40px] px-2.5 sm:px-3.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors border whitespace-nowrap shrink-0 active:scale-95 ${
            isLight
              ? 'bg-slate-900 hover:bg-slate-800 text-white border-slate-900'
              : 'bg-white/10 hover:bg-white/15 text-white border-white/15'
          }`}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-white shrink-0"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            />
          </svg>
          <span className="hidden md:inline">Follow Plenty</span>
        </a>

        {/* Primary Action: Download PDF */}
        <button
          type="button"
          onClick={onOpenExport}
          title="Download Multi-Page PDF"
          className="hidden sm:flex cursor-pointer min-h-[40px] bg-[#6366f1] hover:bg-indigo-600 text-white px-4 rounded-xl text-xs font-semibold items-center gap-1.5 transition-colors shadow-xs whitespace-nowrap shrink-0 active:scale-95"
        >
          <Download className="w-3.5 h-3.5 shrink-0" />
          <span>Export PDF</span>
        </button>
      </div>
    </header>
  );
}
