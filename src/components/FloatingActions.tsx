import React, { useState, useEffect } from 'react';
import {
  Download,
  Plus,
  Type,
  ChevronDown,
  ChevronUp,
  Ruler,
  Lightbulb,
  Coffee,
  ArrowUp,
  Sparkles,
  FileText,
  Layers,
  ShieldCheck,
  Share2,
} from 'lucide-react';
import { AppPage } from '../types';
import { PolicyTab } from './PolicyModal';

interface FloatingActionsProps {
  currentPage: AppPage;
  totalPages: number;
  fontSize: number;
  showMarginGuides: boolean;
  onNavigate: (page: AppPage) => void;
  onOpenExport: () => void;
  onOpenBuyCoffee: () => void;
  onOpenHowItWorks: () => void;
  onOpenPolicy: (type: PolicyTab) => void;
  onOpenShare: () => void;
  onAddPage: () => void;
  onUpdateFontSize: (size: number) => void;
  onToggleMarginGuides: () => void;
}

export default function FloatingActions({
  currentPage,
  totalPages,
  fontSize,
  showMarginGuides,
  onNavigate,
  onOpenExport,
  onOpenBuyCoffee,
  onOpenHowItWorks,
  onOpenPolicy,
  onOpenShare,
  onAddPage,
  onUpdateFontSize,
  onToggleMarginGuides,
}: FloatingActionsProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth >= 1024;
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsExpanded(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isEditor = currentPage === 'editor';

  const secondaryBtnClass =
    'cursor-pointer min-h-[38px] px-3 py-1.5 rounded-xl border border-[#DDD2BC] bg-[#FFFDF8] hover:bg-[#FAF4E8] text-[#1E1B18] text-xs font-semibold flex items-center gap-1.5 shadow-md transition-colors whitespace-nowrap shrink-0';

  return (
    <div
      aria-label="Floating quick actions"
      className={`fixed right-3 sm:right-5 z-30 flex flex-col items-end gap-2 pointer-events-none select-none ${
        isEditor ? 'bottom-[74px] lg:bottom-5' : 'bottom-4 sm:bottom-5'
      }`}
    >
      {/* Expanded Contextual Quick Actions */}
      {isExpanded && (
        <div className="flex flex-col items-end gap-2 pointer-events-auto">
          {isEditor ? (
            <>
              {/* Font Size Stepper */}
              <div className="bg-[#FFFDF8] border border-[#DDD2BC] shadow-lg rounded-xl px-2.5 py-1.5 flex items-center gap-1.5 text-xs text-[#1E1B18]">
                <span className="text-[11px] text-[#6E655A] flex items-center gap-1 pr-1">
                  <Type className="w-3.5 h-3.5 text-[#9A4319]" />
                  <span className="hidden sm:inline">Size</span>
                </span>
                <button
                  type="button"
                  onClick={() => onUpdateFontSize(Math.max(11, fontSize - 1))}
                  disabled={fontSize <= 11}
                  className="cursor-pointer min-w-[28px] min-h-[28px] px-1.5 rounded-lg bg-[#FAF4E8] hover:bg-[#EFE5D3] disabled:opacity-35 text-[11px] font-bold text-[#1E1B18] transition-colors"
                  title="Decrease Handwriting Size"
                >
                  A-
                </button>
                <span className="text-[#9A4319] font-bold text-xs min-w-[34px] text-center tabular-nums">
                  {fontSize}px
                </span>
                <button
                  type="button"
                  onClick={() => onUpdateFontSize(Math.min(32, fontSize + 1))}
                  disabled={fontSize >= 32}
                  className="cursor-pointer min-w-[28px] min-h-[28px] px-1.5 rounded-lg bg-[#FAF4E8] hover:bg-[#EFE5D3] disabled:opacity-35 text-[11px] font-bold text-[#1E1B18] transition-colors"
                  title="Increase Handwriting Size"
                >
                  A+
                </button>
              </div>

              {/* Editor Quick Row: Margin Guides, + Page */}
              <div className="flex items-center gap-1.5 flex-wrap justify-end">
                <button
                  type="button"
                  onClick={onToggleMarginGuides}
                  aria-pressed={showMarginGuides}
                  className={`cursor-pointer min-h-[38px] px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 shadow-md transition-colors whitespace-nowrap ${
                    showMarginGuides
                      ? 'bg-[#F6EBE0] border-[#9A4319] text-[#8F3D15]'
                      : 'bg-[#FFFDF8] hover:bg-[#FAF4E8] border-[#DDD2BC] text-[#1E1B18]'
                  }`}
                  title="Toggle preview margin alignment guides"
                >
                  <Ruler className="w-3.5 h-3.5 text-[#9A4319]" />
                  <span>Guides</span>
                </button>

                <button
                  type="button"
                  onClick={onAddPage}
                  className={secondaryBtnClass}
                  title="Append a new sheet to the current document"
                >
                  <Plus className="w-3.5 h-3.5 text-[#9A4319]" />
                  <span>+ Page</span>
                </button>
              </div>
            </>
          ) : (
            /* Page-Aware Quick Navigation on Non-Editor Views */
            <div className="flex items-center gap-1.5 flex-wrap justify-end">
              {currentPage !== 'styles' && (
                <button
                  type="button"
                  onClick={() => onNavigate('styles')}
                  className={secondaryBtnClass}
                  title="Browse 19 handwriting styles"
                >
                  <FileText className="w-3.5 h-3.5 text-[#9A4319]" />
                  <span>Styles</span>
                </button>
              )}
              {currentPage !== 'papers' && (
                <button
                  type="button"
                  onClick={() => onNavigate('papers')}
                  className={secondaryBtnClass}
                  title="Browse 23 paper templates"
                >
                  <Layers className="w-3.5 h-3.5 text-[#9A4319]" />
                  <span>Papers</span>
                </button>
              )}
            </div>
          )}

          {/* Universal Helpful Floating Tools */}
          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            <button
              type="button"
              onClick={onOpenShare}
              className={secondaryBtnClass}
              title="Share Human Handwriting AI with friends"
            >
              <Share2 className="w-3.5 h-3.5 text-[#9A4319]" />
              <span>Share</span>
            </button>

            <button
              type="button"
              onClick={onOpenHowItWorks}
              className={secondaryBtnClass}
              title="Read How Human Handwriting AI Works"
            >
              <Lightbulb className="w-3.5 h-3.5 text-[#9A4319]" />
              <span>Guide</span>
            </button>

            <button
              type="button"
              onClick={onOpenBuyCoffee}
              className="cursor-pointer min-h-[38px] px-3 py-1.5 rounded-xl border border-[#E2C2A8] bg-[#F6EBE0] hover:bg-[#EDD9C5] text-[#8F3D15] text-xs font-semibold flex items-center gap-1.5 shadow-md transition-colors whitespace-nowrap shrink-0"
              title="Tip Plenty with UPI or Bitcoin"
            >
              <Coffee className="w-3.5 h-3.5 text-[#9A4319]" />
              <span>Coffee</span>
            </button>

            {!isEditor && (
              <button
                type="button"
                onClick={() => onOpenPolicy('about')}
                className={secondaryBtnClass}
                title="About & Privacy Policy"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#9A4319]" />
                <span>About</span>
              </button>
            )}

            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Scroll to top"
              title="Scroll to top"
              className="cursor-pointer min-h-[38px] min-w-[38px] px-2.5 rounded-xl border border-[#DDD2BC] bg-[#FFFDF8] hover:bg-[#FAF4E8] text-[#4A433A] hover:text-[#1E1B18] flex items-center justify-center shadow-md transition-colors shrink-0"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Primary Dock Row */}
      <div className="flex items-center gap-1.5 pointer-events-auto">
        {isEditor ? (
          <button
            type="button"
            onClick={onOpenExport}
            className="cursor-pointer min-h-[42px] bg-[#24201C] hover:bg-[#38322C] text-[#FFFDF8] font-bold text-xs px-4 py-2 rounded-xl shadow-lg border border-[#3D352E] flex items-center gap-2 transition-all active:scale-[0.98] whitespace-nowrap"
            title="Open PDF & PNG Export Dialog"
          >
            <Download className="w-3.5 h-3.5 text-[#E5B88B]" />
            <span>Export PDF</span>
            <span className="bg-[#FFFDF8]/15 text-[#FAF4E8] text-[10px] px-1.5 py-0.5 rounded-md font-semibold tabular-nums">
              {totalPages}p
            </span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onNavigate('editor')}
            className="cursor-pointer min-h-[42px] bg-[#24201C] hover:bg-[#38322C] text-[#FFFDF8] font-bold text-xs px-4 py-2 rounded-xl shadow-lg border border-[#3D352E] flex items-center gap-2 transition-all active:scale-[0.98] whitespace-nowrap"
            title="Launch Handwriting Editor Studio"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E5B88B]" />
            <span>Open Studio</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          aria-expanded={isExpanded}
          aria-label={isExpanded ? 'Collapse quick actions' : 'Expand quick actions'}
          title={isExpanded ? 'Hide quick buttons' : 'Show quick buttons'}
          className="cursor-pointer min-h-[42px] min-w-[42px] rounded-xl bg-[#FFFDF8] hover:bg-[#FAF4E8] text-[#1E1B18] border border-[#DDD2BC] shadow-lg flex items-center justify-center transition-colors shrink-0"
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-[#9A4319]" />
          ) : (
            <ChevronUp className="w-4 h-4 text-[#9A4319]" />
          )}
        </button>
      </div>
    </div>
  );
}
