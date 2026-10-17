import React, { useState } from 'react';
import {
  Download,
  Plus,
  Type,
  ChevronDown,
  ChevronUp,
  Sparkles,
  QrCode,
  Lightbulb,
} from 'lucide-react';

interface FloatingActionsProps {
  totalPages: number;
  currentPageIndex: number;
  fontSize: number;
  onOpenExport: () => void;
  onOpenBuyCoffee: () => void;
  onOpenHowItWorks: () => void;
  onAddPage: () => void;
  onUpdateFontSize: (size: number) => void;
}

export default function FloatingActions({
  totalPages,
  currentPageIndex,
  fontSize,
  onOpenExport,
  onOpenBuyCoffee,
  onOpenHowItWorks,
  onAddPage,
  onUpdateFontSize,
}: FloatingActionsProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  return (
    <div
      aria-label="Floating quick action tools"
      className="fixed bottom-24 sm:bottom-28 right-3 sm:right-6 z-40 flex flex-col items-end gap-2 pointer-events-none select-none font-mono-code"
    >
      {/* Expanded Quick Tool Cluster */}
      {isExpanded && (
        <div className="flex flex-col items-end gap-2 pointer-events-auto animate-in slide-in-from-bottom-2 fade-in duration-150">
          {/* Quick Font Size Adjustment Pill */}
          <div className="bg-[#18181b]/95 backdrop-blur-md border border-[#27272a] shadow-xl rounded-full px-3 py-1.5 flex items-center gap-2 text-xs text-[#e4e4e7]">
            <span className="text-[10px] text-zinc-400 flex items-center gap-1">
              <Type className="w-3 h-3 text-[#6366f1]" />
              <span className="hidden sm:inline">Size:</span>
            </span>
            <button
              type="button"
              onClick={() => onUpdateFontSize(Math.max(11, fontSize - 1))}
              disabled={fontSize <= 11}
              className="cursor-pointer text-[10px] text-[#e4e4e7] hover:text-white disabled:opacity-30 px-1.5 py-0.5 rounded hover:bg-[#27272a] transition-colors"
              title="Decrease Font Size (A-)"
            >
              A-
            </button>
            <span className="text-[#6366f1] font-bold text-xs min-w-[24px] text-center">
              {fontSize}px
            </span>
            <button
              type="button"
              onClick={() => onUpdateFontSize(Math.min(32, fontSize + 1))}
              disabled={fontSize >= 32}
              className="cursor-pointer text-[10px] text-[#e4e4e7] hover:text-white disabled:opacity-30 px-1.5 py-0.5 rounded hover:bg-[#27272a] transition-colors"
              title="Increase Font Size (A+)"
            >
              A+
            </button>
          </div>

          {/* Floating Row: How He Did It, Add Page, UPI Scanner */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-end">
            {/* Small Floating "How He Did It" Story Button */}
            <button
              type="button"
              onClick={onOpenHowItWorks}
              className="cursor-pointer bg-gradient-to-r from-amber-500/20 to-yellow-500/20 hover:from-amber-500/30 text-amber-300 border border-amber-500/40 hover:border-amber-400/80 backdrop-blur-md shadow-lg px-2.5 sm:px-3 py-1.5 rounded-full text-[11px] font-semibold flex items-center gap-1.5 transition-all group hover:scale-105 active:scale-95"
              title="How I came up with the idea: Hated college handwritten assignments!"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="font-syne font-bold">How He Did It</span>
              <span className="text-[9px] bg-amber-400/20 text-amber-200 px-1 rounded hidden sm:inline">Idea</span>
            </button>

            {/* Add Page Floating Pill */}
            <button
              type="button"
              onClick={onAddPage}
              className="cursor-pointer bg-[#18181b]/95 hover:bg-[#222226] text-[#e4e4e7] hover:text-white border border-[#27272a] hover:border-[#6366f1] backdrop-blur-md shadow-lg px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all group"
              title="Add a new blank page to the assignment"
            >
              <Plus className="w-3.5 h-3.5 text-[#6366f1] group-hover:rotate-90 transition-transform" />
              <span>+ Page</span>
            </button>

            {/* Buy Me Coffee Floating Pill */}
            <button
              type="button"
              onClick={onOpenBuyCoffee}
              className="cursor-pointer bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 border border-amber-500/40 backdrop-blur-md shadow-lg shadow-amber-950/20 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
              title="Buy Me a Coffee or Tip with Scanner"
            >
              <span>☕</span>
              <span className="hidden sm:inline">Buy Me Coffee</span>
              <span className="sm:hidden">Coffee</span>
            </button>
          </div>
        </div>
      )}

      {/* Primary Floating Action Pill (Download PDF) */}
      <div className="flex items-center gap-1.5 pointer-events-auto">
        <button
          type="button"
          onClick={onOpenExport}
          className="cursor-pointer bg-gradient-to-r from-[#6366f1] to-indigo-700 hover:from-[#4f46e5] hover:to-indigo-600 text-white font-bold text-xs sm:text-sm px-4 sm:px-5 py-2.5 sm:py-3 rounded-full shadow-2xl shadow-indigo-950/80 border border-indigo-400/40 flex items-center gap-2.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
          title="Compile & Download Assignment PDF"
        >
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <Download className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="tracking-wide">DOWNLOAD PDF</span>
          <span className="bg-black/30 text-indigo-200 text-[10px] px-2 py-0.5 rounded-full font-bold">
            {totalPages} {totalPages === 1 ? 'PAGE' : 'PAGES'}
          </span>
        </button>

        {/* Floating Mini Toggle (Show/Hide secondary cluster) */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="cursor-pointer w-8 h-8 rounded-full bg-[#18181b]/90 hover:bg-[#27272a] text-zinc-400 hover:text-white border border-[#27272a] shadow-lg flex items-center justify-center transition-colors"
          title={isExpanded ? 'Collapse quick tools' : 'Expand quick tools'}
        >
          {isExpanded ? (
            <ChevronDown className="w-3.5 h-3.5" />
          ) : (
            <ChevronUp className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}
