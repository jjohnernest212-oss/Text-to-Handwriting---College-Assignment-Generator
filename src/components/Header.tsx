import { QrCode } from 'lucide-react';
import AppLogo from './AppLogo';

interface HeaderProps {
  onOpenHowItWorks: () => void;
  onOpenBuyCoffee: () => void;
  onOpenExport: () => void;
  onOpenMobileScan: () => void;
  onOpenContributors?: () => void;
}

export default function Header({
  onOpenHowItWorks,
  onOpenBuyCoffee,
  onOpenExport,
  onOpenMobileScan,
  onOpenContributors,
}: HeaderProps) {
  return (
    <header className="bg-[#18181b] border-b border-[rgba(228,228,231,0.1)] sticky top-0 z-30 select-none h-16 px-4 sm:px-6 flex items-center justify-between gap-2">
      {/* Logo Area */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-[#6366f1] to-indigo-800 rounded-lg flex items-center justify-center text-white shrink-0 shadow-md shadow-indigo-950/50 p-1 border border-indigo-400/30">
          <AppLogo size={26} className="text-white drop-shadow-xs" />
        </div>
        <div className="flex items-center gap-2 min-w-0">
          <h1 className="font-syne text-[1.05rem] sm:text-[1.2rem] font-extrabold uppercase tracking-tight text-[#e4e4e7] leading-none truncate">
            Text to Handwriting
          </h1>
          <span className="bg-[#6366f1]/20 text-[#a5b4fc] border border-[#6366f1]/30 px-2 py-0.5 rounded-[3px] font-mono-code text-[9px] sm:text-[10px] font-bold uppercase tracking-wider hidden sm:inline-block shrink-0">
            COLLEGE ED.
          </span>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onOpenHowItWorks}
          className="cursor-pointer bg-[rgba(228,228,231,0.1)] hover:bg-[rgba(228,228,231,0.18)] text-[#e4e4e7] px-3 sm:px-4 py-2 rounded text-xs font-mono-code transition-colors hidden sm:flex items-center gap-1.5"
          title="Read technical architecture breakdown"
        >
          <span>How He Did It</span>
        </button>

        <button
          onClick={onOpenBuyCoffee}
          className="cursor-pointer bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 sm:px-3.5 py-2 rounded text-xs font-mono-code transition-all flex items-center gap-1.5 shadow-xs hover:border-amber-400/60"
          title="Buy Me a Coffee / Tip with Scanner"
        >
          <span>☕</span>
          <span className="font-semibold hidden sm:inline">Buy Me Coffee</span>
          <span className="font-semibold sm:hidden">Coffee</span>
        </button>

        <button
          onClick={onOpenExport}
          className="cursor-pointer bg-[#6366f1] hover:bg-[#4f46e5] text-white px-3 sm:px-4 py-2 rounded text-xs font-bold font-mono-code uppercase tracking-wider transition-all shadow-md shadow-indigo-950/50 shrink-0"
        >
          <span className="hidden sm:inline">Download PDF</span>
          <span className="sm:hidden">PDF</span>
        </button>

        {/* User's GitHub Profile link in Top Right Corner */}
        <a
          href="https://github.com/jjohnernest212-oss"
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer bg-[#24292e] hover:bg-[#2f363d] text-white px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-mono-code transition-all flex items-center gap-1.5 border border-zinc-700 hover:border-zinc-400 shadow-md shrink-0 group hover:ring-1 hover:ring-white/20"
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


