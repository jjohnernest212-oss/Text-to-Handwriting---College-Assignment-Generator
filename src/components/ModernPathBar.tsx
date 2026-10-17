import React from 'react';
import {
  FileText,
  PenTool,
  Download,
  ChevronRight,
  Sparkles,
  Layers,
  Coffee,
} from 'lucide-react';

interface ModernPathBarProps {
  activeTab: 'editor' | 'preview' | 'settings';
  onSelectTab: (tab: 'editor' | 'preview' | 'settings') => void;
  totalPages: number;
  currentPageIndex: number;
  fontSize: number;
  paperType: string;
  onOpenExport: () => void;
  onOpenBuyCoffee: () => void;
}

export default function ModernPathBar({
  activeTab,
  onSelectTab,
  totalPages,
  currentPageIndex,
  fontSize,
  paperType,
  onOpenExport,
  onOpenBuyCoffee,
}: ModernPathBarProps) {
  const steps = [
    {
      id: 'editor' as const,
      number: '01',
      title: 'Source Buffer',
      detail: 'Raw text & delimiters',
      icon: FileText,
    },
    {
      id: 'preview' as const,
      number: '02',
      title: 'Scribe Matrix',
      detail: `Page ${currentPageIndex + 1}/${totalPages} · ${paperType}`,
      icon: PenTool,
    },
    {
      id: 'settings' as const,
      number: '03',
      title: 'Styling & Physics',
      detail: `${fontSize}px · Ink blots`,
      icon: Layers,
    },
  ];

  return (
    <nav
      aria-label="Workflow pipeline path"
      className="bg-[#101013] border-b border-[#27272a] px-3 sm:px-6 py-2 select-none flex items-center justify-between gap-3 text-xs overflow-x-auto scrollbar-none"
    >
      {/* Visual Pipeline Path */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        <span className="font-mono-code text-[10px] text-zinc-500 uppercase tracking-widest hidden xl:inline-block mr-1">
          PIPELINE //
        </span>

        {steps.map((step, idx) => {
          const isActive = activeTab === step.id;
          const Icon = step.icon;

          return (
            <React.Fragment key={step.id}>
              {idx > 0 && (
                <ChevronRight className="w-3.5 h-3.5 text-zinc-600 shrink-0 mx-0.5" />
              )}

              <button
                type="button"
                onClick={() => onSelectTab(step.id)}
                className={`cursor-pointer group flex items-center gap-2 py-1 px-2.5 rounded-md transition-all text-left ${
                  isActive
                    ? 'bg-[#18181b] border border-[#6366f1]/60 text-white shadow-xs'
                    : 'text-[#e4e4e7]/60 hover:text-white hover:bg-[#18181b]/60 border border-transparent'
                }`}
                title={`Navigate to ${step.title}`}
              >
                <div
                  className={`w-5 h-5 rounded flex items-center justify-center font-mono-code text-[10px] font-bold shrink-0 transition-colors ${
                    isActive
                      ? 'bg-[#6366f1] text-white'
                      : 'bg-[#27272a] text-zinc-400 group-hover:text-white'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                </div>

                <div className="flex flex-col min-w-0 leading-none">
                  <span className="font-mono-code text-[11px] font-semibold tracking-tight truncate">
                    {step.title}
                  </span>
                  <span className="font-mono-code text-[9px] text-zinc-500 truncate hidden sm:inline">
                    {step.detail}
                  </span>
                </div>
              </button>
            </React.Fragment>
          );
        })}
      </div>

      {/* Right Quick Telemetry & Shortcuts */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="hidden md:flex items-center gap-2 font-mono-code text-[10px] text-zinc-400 bg-[#18181b] border border-[#27272a] px-2.5 py-1 rounded">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>RETINA 300 DPI</span>
          <span className="text-zinc-600">|</span>
          <span className="text-[#a5b4fc]">{totalPages} {totalPages === 1 ? 'PAGE' : 'PAGES'}</span>
        </div>

        {/* Quick Buy Coffee trigger */}
        <button
          type="button"
          onClick={onOpenBuyCoffee}
          className="cursor-pointer text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 font-mono-code text-[11px] px-2.5 py-1 rounded flex items-center gap-1.5 transition-colors"
          title="Buy Me a Coffee or Tip with Scanner"
        >
          <span>☕</span>
          <span className="hidden sm:inline">Buy Coffee</span>
        </button>

        {/* Compile trigger */}
        <button
          type="button"
          onClick={onOpenExport}
          className="cursor-pointer bg-[#6366f1] hover:bg-[#4f46e5] text-white font-mono-code text-[11px] font-bold px-3 py-1 rounded flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
        >
          <Download className="w-3 h-3" />
          <span>Export PDF</span>
        </button>
      </div>
    </nav>
  );
}
