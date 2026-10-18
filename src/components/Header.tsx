import React from 'react';
import AppLogo from './AppLogo';
import { Sparkles, Download, Coffee } from 'lucide-react';

interface HeaderProps {
  onOpenHowItWorks: () => void;
  onOpenBuyCoffee: () => void;
  onOpenExport: () => void;
}

export default function Header({
  onOpenHowItWorks,
  onOpenBuyCoffee,
  onOpenExport,
}: HeaderProps) {
  return (
    <header className="bg-[#121215]/95 backdrop-blur-md border-b border-white/10 sticky top-0 z-30 select-none h-16 px-4 sm:px-6 flex items-center justify-between gap-3 shadow-md">
      {/* Logo Area (College Ed badge removed as requested) */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 bg-gradient-to-br from-[#6366f1] to-indigo-800 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md shadow-indigo-950/60 p-1 border border-indigo-400/30">
          <AppLogo size={26} className="text-white drop-shadow-xs" />
        </div>
        <div className="flex items-center gap-2 min-w-0">
          <h1 className="font-syne text-[1.1rem] sm:text-[1.25rem] font-extrabold uppercase tracking-tight text-white leading-none truncate">
            Text to Handwriting
          </h1>
        </div>
      </div>

      {/* Header Glassy Buttons Bar - Only one of each on screen for smooth experience */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Glassy "How He Did It" Button */}
        <button
          type="button"
          onClick={onOpenHowItWorks}
          className="cursor-pointer backdrop-blur-md bg-white/[0.08] hover:bg-white/[0.16] border border-white/20 hover:border-white/40 text-white px-3 sm:px-3.5 py-2 rounded-xl text-xs font-mono-code transition-all shadow-xs flex items-center gap-1.5 active:scale-95"
          title="Read the college origin story & how I came up with the idea"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="hidden sm:inline font-medium">How He Did It</span>
          <span className="sm:hidden font-medium">Story</span>
        </button>

        {/* Glassy "Buy Me Coffee" Button */}
        <button
          type="button"
          onClick={onOpenBuyCoffee}
          className="cursor-pointer backdrop-blur-md bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/30 hover:border-amber-400/60 text-amber-200 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-mono-code transition-all shadow-xs flex items-center gap-1.5 active:scale-95"
          title="Buy Me a Coffee / Scanner Tip"
        >
          <Coffee className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="font-semibold hidden sm:inline">Buy Me Coffee</span>
          <span className="font-semibold sm:hidden">Coffee</span>
        </button>

        {/* Primary Download PDF Button */}
        <button
          type="button"
          onClick={onOpenExport}
          className="cursor-pointer bg-gradient-to-r from-[#6366f1] to-indigo-700 hover:from-[#4f46e5] hover:to-indigo-600 text-white px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold font-mono-code uppercase tracking-wider transition-all shadow-md shadow-indigo-950/60 shrink-0 flex items-center gap-1.5 active:scale-95 border border-indigo-400/40"
          title="Download Multi-Page PDF"
        >
          <Download className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden sm:inline">Download PDF</span>
          <span className="sm:hidden">PDF</span>
        </button>

        {/* User's GitHub Profile link in Top Right Corner */}
        <a
          href="https://github.com/jjohnernest212-oss"
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer backdrop-blur-md bg-[#24292e]/90 hover:bg-[#2f363d] text-white px-2.5 sm:px-3 py-2 rounded-xl text-xs font-mono-code transition-all flex items-center gap-1.5 border border-zinc-700 hover:border-zinc-400 shadow-md shrink-0 group active:scale-95"
          title="View my GitHub projects & follow @jjohnernest212-oss"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className="text-white shrink-0 group-hover:scale-110 transition-transform">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
          <span className="hidden xl:inline font-bold">@jjohnernest212-oss</span>
          <span className="hidden sm:inline xl:hidden font-bold">Follow</span>
        </a>
      </div>
    </header>
  );
}
