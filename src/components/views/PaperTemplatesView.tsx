import React, { useState, useMemo } from 'react';
import { Search, Check, ArrowRight } from 'lucide-react';
import { PaperType, PageSettings } from '../../types';
import { PAPER_DEFINITIONS } from '../../utils/paperStyles';
import MiniPaperSample from '../MiniPaperSample';

interface PaperTemplatesViewProps {
  theme: 'dark' | 'light';
  activePaper: PaperType;
  onSelectPaper: (paperId: PaperType, recommended?: Partial<PageSettings>) => void;
}

export default function PaperTemplatesView({
  theme,
  activePaper,
  onSelectPaper,
}: PaperTemplatesViewProps) {
  const isLight = theme === 'light';
  const [category, setCategory] = useState<'all' | 'school' | 'aesthetic' | 'realistic' | 'math'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPapers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return PAPER_DEFINITIONS.filter((paper) => {
      const matchesCat = category === 'all' || paper.category === category;
      const matchesSearch =
        !q ||
        paper.name.toLowerCase().includes(q) ||
        paper.description.toLowerCase().includes(q) ||
        paper.badge.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [category, searchQuery]);

  const surfaceClass = isLight
    ? 'bg-white border-slate-200 text-slate-900'
    : 'bg-[#13141a] border-white/10 text-zinc-100';
  const mutedText = isLight ? 'text-slate-600' : 'text-zinc-400';

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
      {/* Page Header */}
      <div className="max-w-2xl space-y-3">
        <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
          Paper Templates Gallery
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance">
          Choose realistic notebook, journal, and grid paper sheets.
        </h1>
        <p className={`text-sm sm:text-base leading-relaxed ${mutedText}`}>
          All {PAPER_DEFINITIONS.length} templates render in exact A4 proportions (210 × 297 mm) and automatically tune line spacing when selected for the editor.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className={`rounded-2xl border p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 ${surfaceClass}`}>
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { id: 'all', label: `All Papers (${PAPER_DEFINITIONS.length})` },
            { id: 'school', label: 'School Notebooks' },
            { id: 'aesthetic', label: 'Aesthetic Journals' },
            { id: 'realistic', label: 'Book & Scanned' },
            { id: 'math', label: 'Grid & Plain' },
          ].map((tab) => {
            const active = category === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setCategory(tab.id as typeof category)}
                className={`cursor-pointer min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap ${
                  active
                    ? 'bg-indigo-600 text-white'
                    : isLight
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    : 'bg-white/5 hover:bg-white/10 text-zinc-300'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 opacity-50 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search paper styles..."
            aria-label="Search paper templates"
            className={`w-full min-h-[40px] pl-9 pr-3.5 py-2 rounded-xl border text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/40 ${
              isLight
                ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'
                : 'bg-[#0b0c10] border-white/10 text-zinc-100 placeholder:text-zinc-500'
            }`}
          />
        </div>
      </div>

      {/* Papers Grid */}
      {filteredPapers.length === 0 ? (
        <div className={`rounded-2xl border p-12 text-center space-y-3 ${surfaceClass}`}>
          <div className="text-base font-semibold">No paper templates matched "{searchQuery}"</div>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setCategory('all');
            }}
            className="cursor-pointer px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPapers.map((paper) => {
            const isSelected = activePaper === paper.id;
            return (
              <article
                key={paper.id}
                className={`rounded-2xl border p-5 flex flex-col justify-between gap-4 transition-colors ${
                  isSelected
                    ? isLight
                      ? 'bg-white border-indigo-500 ring-2 ring-indigo-500/20'
                      : 'bg-[#151722] border-indigo-400 ring-2 ring-indigo-400/20'
                    : surfaceClass
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className={mutedText}>{paper.badge}</span>
                    {isSelected && (
                      <span className="text-indigo-600 dark:text-indigo-400 font-semibold inline-flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        Active
                      </span>
                    )}
                  </div>

                  {/* Realistic Paper Visual Preview */}
                  <MiniPaperSample
                    paperType={paper.id}
                    fontFamily="'Kalam', cursive"
                    inkColor={paper.id === 'dark-aesthetic' ? '#f8fafc' : '#002699'}
                    text={`Sample handwritten notes\non ${paper.name}.`}
                    fontSize={16}
                    lineHeight={paper.recommendedLineHeight}
                    className="min-h-[132px]"
                  />

                  <div className="space-y-1">
                    <h2 className="text-base font-bold tracking-tight">{paper.name}</h2>
                    <p className={`text-xs leading-relaxed ${mutedText}`}>{paper.description}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    onSelectPaper(paper.id, {
                      marginLineColor: paper.marginColor,
                      lineHeight: paper.recommendedLineHeight,
                      topMargin: paper.recommendedTopMargin,
                    })
                  }
                  className={`cursor-pointer w-full min-h-[42px] px-4 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                    isSelected
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      : isLight
                      ? 'bg-slate-100 hover:bg-indigo-600 text-slate-900 hover:text-white'
                      : 'bg-white/10 hover:bg-indigo-600 text-white'
                  }`}
                >
                  <span>{isSelected ? 'Use in Editor' : 'Select Paper Style'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
