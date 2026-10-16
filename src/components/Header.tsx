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
    <header className="bg-[#18181b] border-b border-[rgba(228,228,231,0.1)] sticky top-0 z-30 select-none h-16 px-6 flex items-center justify-between">
      {/* Logo Area */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-[#6366f1] rounded flex items-center justify-center text-white flex-shrink-0 shadow-sm">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <div className="flex items-center gap-2.5">
          <h1 className="font-syne text-[1.2rem] font-extrabold uppercase tracking-tight text-[#e4e4e7] leading-none">
            Text to Handwriting
          </h1>
          <span className="bg-[rgba(228,228,231,0.1)] text-[#fbbf24] px-2 py-0.5 rounded-[2px] font-mono-code text-[10px] font-bold uppercase tracking-wider">
            COLLEGE ED.
          </span>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenHowItWorks}
          className="cursor-pointer bg-[rgba(228,228,231,0.1)] hover:bg-[rgba(228,228,231,0.18)] text-[#e4e4e7] px-4 py-2 rounded text-xs font-mono-code transition-colors flex items-center gap-1.5"
          title="Read technical architecture breakdown"
        >
          <span>How He Did It</span>
        </button>

        <button
          onClick={onOpenBuyCoffee}
          className="cursor-pointer bg-[rgba(228,228,231,0.1)] hover:bg-[rgba(228,228,231,0.18)] text-[#e4e4e7] px-4 py-2 rounded text-xs font-mono-code transition-colors flex items-center gap-1.5"
          title="Support project with Indian UPI or Coffee"
        >
          <span>Coffee / UPI</span>
        </button>

        <button
          onClick={onOpenExport}
          className="cursor-pointer bg-[#6366f1] hover:bg-[#4f46e5] text-white px-5 py-2 rounded text-xs font-bold font-mono-code uppercase tracking-wider transition-all shadow-md shadow-indigo-950/50"
        >
          Generate &amp; Download PDF
        </button>
      </div>
    </header>
  );
}


