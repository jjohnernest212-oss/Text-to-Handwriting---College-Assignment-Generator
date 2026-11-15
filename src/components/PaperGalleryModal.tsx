import React, { useState, useMemo } from 'react';
import {
  X,
  Sparkles,
  BookOpen,
  Search,
  Check,
  Layers,
  Palette,
  Heart,
  HelpCircle,
  FileText,
} from 'lucide-react';
import { PaperType, PageSettings } from '../types';
import { PAPER_DEFINITIONS, PaperDefinition } from '../utils/paperStyles';

interface PaperGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPaper: PaperType;
  theme?: 'dark' | 'light';
  onSelectPaper: (paperId: PaperType, recommendedSettings?: Partial<PageSettings>) => void;
}

export default function PaperGalleryModal({
  isOpen,
  onClose,
  currentPaper,
  theme = 'dark',
  onSelectPaper,
}: PaperGalleryModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<
    'all' | 'school' | 'aesthetic' | 'realistic' | 'math'
  >('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const isLight = theme === 'light';

  const filteredPapers = useMemo(() => {
    return PAPER_DEFINITIONS.filter((paper) => {
      const matchesCat =
        selectedCategory === 'all' || paper.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        paper.name.toLowerCase().includes(q) ||
        paper.badge.toLowerCase().includes(q) ||
        paper.description.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E1B18]/45 p-3 sm:p-4 overflow-y-auto select-none">
      <div
        className={`rounded-2xl shadow-2xl border max-w-4xl w-full flex flex-col my-4 max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150 transition-colors ${
          isLight
            ? 'bg-[#FFFDF8] border-[#DDD2BC] text-[#1E1B18]'
            : 'bg-[#0B1222] border-sky-300/20 text-white'
        }`}
      >
        {/* Header */}
        <div
          className={`px-5 sm:px-6 py-4 border-b flex items-center justify-between shrink-0 ${
            isLight
              ? 'bg-[#FAF4E8] border-[#EAE0CD]'
              : 'bg-[#080F1E] border-sky-300/15'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center p-2 shrink-0 shadow-xs ${
                isLight ? 'bg-[#24201C] text-[#FFFDF8]' : 'bg-sky-500 text-slate-950'
              }`}
            >
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2
                  className={`font-syne text-base sm:text-lg font-extrabold uppercase tracking-tight ${
                    isLight ? 'text-[#1E1B18]' : 'text-white'
                  }`}
                >
                  Choose Notebook &amp; Book Page
                </h2>
                <span className={`text-xs font-mono-code font-bold ${isLight ? 'text-[#9A4319]' : 'text-amber-300'}`}>
                  · 23 Rulings
                </span>
              </div>
              <p className={`font-mono-code text-[10px] sm:text-[11px] tracking-wider ${isLight ? 'text-[#6E655A]' : 'text-slate-400'}`}>
                School notebooks, aesthetic study journals &amp; procedural book pages
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`cursor-pointer p-1.5 rounded-lg transition-colors ${
              isLight
                ? 'text-[#6E655A] hover:text-[#1E1B18] hover:bg-[#EDE4D2]'
                : 'text-slate-400 hover:text-white hover:bg-sky-500/15'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Bar & Search */}
        <div
          className={`px-5 sm:px-6 py-3 border-b flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 ${
            isLight ? 'bg-[#F5EEE0] border-[#EAE0CD]' : 'bg-[#070D1A] border-sky-300/15'
          }`}
        >
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none font-mono-code text-xs">
            {[
              { id: 'all', label: 'All Pages' },
              { id: 'school', label: 'School Notebooks' },
              { id: 'aesthetic', label: 'Aesthetic Journals' },
              { id: 'realistic', label: 'Classic & Parchment' },
              { id: 'math', label: 'Math & Dark' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategory(tab.id as any)}
                className={`cursor-pointer px-3 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === tab.id
                    ? isLight
                      ? 'bg-[#24201C] text-[#FFFDF8] shadow-xs font-bold'
                      : 'bg-sky-500 text-slate-950 shadow-xs font-bold'
                    : isLight
                    ? 'text-[#4A433A] hover:text-[#1E1B18] hover:bg-[#EDE4D2]'
                    : 'text-slate-300 hover:text-white hover:bg-[#121D35]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-60 shrink-0">
            <Search className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 ${isLight ? 'text-[#6E655A]' : 'text-slate-400'}`} />
            <input
              type="text"
              placeholder="Search paper type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-8 pr-3 py-1.5 rounded-lg text-xs font-mono-code transition-colors border outline-none ${
                isLight
                  ? 'bg-[#FFFDF8] border-[#D7CCB5] text-[#1E1B18] placeholder:text-[#6E655A] focus:border-[#9A4319]'
                  : 'bg-[#0E172B] border-sky-300/20 text-white placeholder:text-slate-400 focus:border-sky-400'
              }`}
            />
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[60vh] space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredPapers.map((paper) => {
              const isSelected = currentPaper === paper.id;
              return (
                <div
                  key={paper.id}
                  onClick={() => {
                    onSelectPaper(paper.id, {
                      paperType: paper.id,
                      marginLineColor: paper.marginColor,
                      lineHeight: paper.recommendedLineHeight,
                      topMargin: paper.recommendedTopMargin,
                    });
                    onClose();
                  }}
                  className={`cursor-pointer group rounded-xl p-3 border transition-all flex flex-col justify-between relative overflow-hidden active:scale-[0.98] ${
                    isSelected
                      ? isLight
                        ? 'ring-2 ring-[#9A4319] border-[#9A4319] bg-[#F6EBE0] shadow-md'
                        : 'ring-2 ring-sky-400 border-sky-400 bg-sky-500/10 shadow-md'
                      : isLight
                      ? 'bg-[#FFFDF8] hover:bg-[#FAF4E8] border-[#DDD2BC] hover:border-[#9A4319]/40 shadow-2xs'
                      : 'bg-[#0E172B] hover:bg-[#121D35] border-sky-300/15 hover:border-sky-400/40'
                  }`}
                >
                  {/* Selected Indicator Badge */}
                  {isSelected && (
                    <div
                      className={`absolute top-2 right-2 z-10 w-5 h-5 rounded-full flex items-center justify-center shadow-xs ${
                        isLight ? 'bg-[#9A4319] text-[#FFFDF8]' : 'bg-sky-400 text-slate-950'
                      }`}
                    >
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}

                  <div>
                    {/* Realistic Mini Preview Sheet */}
                    <div
                      className="w-full h-24 rounded-lg border shadow-inner relative overflow-hidden mb-3"
                      style={{
                        backgroundColor: paper.bgColor,
                        borderColor: isLight ? '#e2e8f0' : '#27272a',
                      }}
                    >
                      {/* Spiral Hole Rings Preview */}
                      {paper.id === 'spiral-notebook' && (
                        <div className="absolute left-1 top-0 bottom-0 w-3 flex flex-col justify-between py-1 z-10">
                          {[...Array(6)].map((_, i) => (
                            <div
                              key={i}
                              className="w-2.5 h-1.5 rounded-full bg-slate-800 border border-slate-400 shadow-xs"
                            />
                          ))}
                        </div>
                      )}

                      {/* 3-Hole Binder Punches Preview */}
                      {paper.id === 'perforated-binder' && (
                        <div className="absolute left-1.5 top-0 bottom-0 w-3 flex flex-col justify-around py-1 z-10">
                          {[...Array(3)].map((_, i) => (
                            <div
                              key={i}
                              className="w-2 h-2 rounded-full bg-slate-700/80 border border-black/20"
                            />
                          ))}
                        </div>
                      )}

                      {/* Left Vertical Margin Line */}
                      {paper.lineColor !== 'transparent' && paper.marginColor !== 'transparent' && (
                        <div
                          className="absolute top-0 bottom-0 left-6 w-[1.5px] z-10"
                          style={{ backgroundColor: paper.marginColor, opacity: 0.8 }}
                        />
                      )}

                      {/* Double Margin for Legal Pad */}
                      {paper.id === 'yellow-legal' && (
                        <div
                          className="absolute top-0 bottom-0 left-8 w-[1px] z-10"
                          style={{ backgroundColor: paper.marginColor, opacity: 0.6 }}
                        />
                      )}

                      {/* Ruled Horizontal Lines */}
                      {paper.lineColor !== 'transparent' && (
                        <div
                          className="absolute inset-0 pt-4"
                          style={{
                            backgroundImage: `repeating-linear-gradient(transparent 0px, transparent 11px, ${paper.lineColor} 11px, ${paper.lineColor} 12px)`,
                          }}
                        />
                      )}

                      {/* Engineering Grid / Korean Grid */}
                      {(paper.id === 'grid' || paper.id === 'korean-grid') && (
                        <div
                          className="absolute inset-0"
                          style={{
                            backgroundImage: `linear-gradient(to right, ${paper.lineColor} 1px, transparent 1px), linear-gradient(to bottom, ${paper.lineColor} 1px, transparent 1px)`,
                            backgroundSize: '10px 10px',
                          }}
                        />
                      )}

                      {/* Dot Grid Preview */}
                      {paper.id === 'dot-grid' && (
                        <div
                          className="absolute inset-0"
                          style={{
                            backgroundImage: `radial-gradient(${paper.lineColor} 1px, transparent 1px)`,
                            backgroundSize: '8px 8px',
                          }}
                        />
                      )}

                      {/* French Seyes Auxiliary Lines Preview */}
                      {paper.id === 'french-seyes' && (
                        <div
                          className="absolute inset-0 pt-3"
                          style={{
                            backgroundImage: `
                              linear-gradient(to right, #e0e7ff 1px, transparent 1px),
                              repeating-linear-gradient(transparent 0px, transparent 3px, #e0e7ff 3px, #e0e7ff 4px),
                              repeating-linear-gradient(transparent 0px, transparent 11px, #818cf8 11px, #818cf8 12px)
                            `,
                            backgroundSize: '4mm 100%, 100% 12px, 100% 12px',
                          }}
                        />
                      )}

                      {/* Cornell Split Preview */}
                      {paper.id === 'cornell-notes' && (
                        <>
                          <div className="absolute top-0 bottom-4 left-1/4 w-[1px] bg-indigo-400 z-10" />
                          <div className="absolute bottom-4 left-0 right-0 h-[1px] bg-indigo-400 z-10" />
                        </>
                      )}

                      {/* Crinkled / Wrinkled Realistic Fold Overlay */}
                      {paper.id === 'crinkled-paper' && (
                        <div
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            backgroundImage:
                              'linear-gradient(135deg, rgba(0,0,0,0.04) 0%, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%, rgba(0,0,0,0.05) 100%)',
                          }}
                        />
                      )}

                      {/* Simulated Handwriting Preview Text */}
                      <div className="absolute top-4 left-8 right-2 font-mono-code text-[9px] text-[#002699] opacity-70 truncate font-bold pointer-events-none">
                        Assignment #3: Newton's Laws
                      </div>
                      <div className="absolute top-7 left-8 right-2 font-mono-code text-[8px] text-[#002699] opacity-60 truncate pointer-events-none">
                        F = m · a &amp; frictional acceleration
                      </div>
                    </div>

                    {/* Paper Title & Badge */}
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3
                        className={`font-syne text-xs font-bold leading-snug transition-colors ${
                          isLight
                            ? 'text-[#1E1B18] group-hover:text-[#9A4319]'
                            : 'text-white group-hover:text-sky-300'
                        }`}
                      >
                        {paper.name}
                      </h3>
                      <span
                        className={`text-[8px] font-mono-code px-1.5 py-0.5 rounded uppercase font-bold shrink-0 ${
                          isSelected
                            ? isLight
                              ? 'bg-[#9A4319] text-[#FFFDF8]'
                              : 'bg-sky-500 text-slate-950'
                            : isLight
                            ? 'bg-[#EDE4D2] text-[#4A433A]'
                            : 'bg-[#121D35] border border-sky-300/20 text-slate-200'
                        }`}
                      >
                        {paper.badge}
                      </span>
                    </div>

                    <p
                      className={`text-[10px] leading-relaxed line-clamp-2 ${
                        isLight ? 'text-[#6E655A]' : 'text-slate-400'
                      }`}
                    >
                      {paper.description}
                    </p>
                  </div>

                  <div
                    className={`mt-2.5 pt-2 border-t flex items-center justify-between text-[10px] font-mono-code ${
                      isLight ? 'border-[#EDE4D2]' : 'border-sky-300/10'
                    }`}
                  >
                    <span
                      className={
                        isSelected
                          ? isLight
                            ? 'text-[#9A4319] font-bold'
                            : 'text-sky-300 font-bold'
                          : isLight
                          ? 'text-[#6E655A]'
                          : 'text-slate-400'
                      }
                    >
                      {isSelected ? '✓ Currently Applied' : 'Click to Apply'}
                    </span>
                    <span
                      className={`group-hover:translate-x-0.5 transition-all ${
                        isLight
                          ? 'text-[#6E655A] group-hover:text-[#9A4319]'
                          : 'text-slate-400 group-hover:text-sky-300'
                      }`}
                    >
                      →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div
          className={`px-5 sm:px-6 py-3 border-t flex items-center justify-between font-mono-code text-xs shrink-0 ${
            isLight
              ? 'bg-[#FAF4E8] border-[#DDD2BC] text-[#4A433A]'
              : 'bg-[#080F1E] border-sky-300/15 text-slate-300'
          }`}
        >
          <div className="flex items-center gap-2 text-[11px]">
            <Sparkles className={`w-3.5 h-3.5 ${isLight ? 'text-[#9A4319]' : 'text-amber-300'}`} />
            <span>High-DPI A4 PDF export matches your selected sheet ruling</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`cursor-pointer px-4 py-1.5 text-xs font-bold rounded-lg transition-colors uppercase ${
              isLight
                ? 'bg-[#24201C] hover:bg-[#38322C] text-[#FFFDF8]'
                : 'bg-sky-500 hover:bg-sky-400 text-slate-950'
            }`}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
