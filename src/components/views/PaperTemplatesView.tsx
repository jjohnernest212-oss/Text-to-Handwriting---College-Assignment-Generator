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
  activePaper,
  onSelectPaper,
}: PaperTemplatesViewProps) {
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

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8 text-[#1E1B18]">
      {/* Page Header */}
      <div className="max-w-2xl space-y-3">
        <div className="text-xs font-semibold text-[#9A4319] uppercase tracking-wider">
          Paper Templates Gallery
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance text-[#1E1B18]">
          Choose realistic notebook, journal, and grid paper sheets.
        </h1>
        <p className="text-sm sm:text-base leading-relaxed text-[#4A433A]">
          All {PAPER_DEFINITIONS.length} templates render in exact A4 proportions (210 × 297 mm) and automatically tune line spacing when selected for the editor.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="rounded-2xl border border-[#DDD2BC] bg-[#FFFDF8]/94 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
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
                    ? 'bg-[#24201C] text-[#FFFDF8] font-bold'
                    : 'bg-[#FAF4E8] hover:bg-[#EFE5D3] text-[#4A433A] border border-[#D7CCB5]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#6E655A] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search paper styles..."
            aria-label="Search paper templates"
            className="w-full min-h-[40px] pl-9 pr-3.5 py-2 rounded-xl border border-[#D7CCB5] bg-[#FAF4E8] text-sm text-[#1E1B18] placeholder:text-[#8C7F6E] focus:outline-hidden focus:ring-2 focus:ring-[#9A4319]/25 focus:border-[#9A4319]"
          />
        </div>
      </div>

      {/* Papers Grid */}
      {filteredPapers.length === 0 ? (
        <div className="rounded-2xl border border-[#DDD2BC] bg-[#FFFDF8]/94 p-12 text-center space-y-3">
          <div className="text-base font-semibold text-[#1E1B18]">No paper templates matched "{searchQuery}"</div>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setCategory('all');
            }}
            className="cursor-pointer px-4 py-2 rounded-xl bg-[#24201C] hover:bg-[#38322C] text-[#FFFDF8] text-xs font-bold"
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
                className={`rounded-2xl border p-5 flex flex-col justify-between gap-4 transition-colors bg-[#FFFDF8]/94 shadow-2xs ${
                  isSelected
                    ? 'border-[#9A4319] ring-2 ring-[#9A4319]/20'
                    : 'border-[#DDD2BC]'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="text-[#6E655A]">{paper.badge}</span>
                    {isSelected && (
                      <span className="text-[#9A4319] font-semibold inline-flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        Active
                      </span>
                    )}
                  </div>

                  {/* Realistic Paper Visual Preview */}
                  <MiniPaperSample
                    paperType={paper.id}
                    fontFamily="'Kalam', cursive"
                    inkColor={paper.id === 'dark-aesthetic' ? '#f8fafc' : '#1E2430'}
                    text={`Sample handwritten notes\non ${paper.name}.`}
                    fontSize={16}
                    lineHeight={paper.recommendedLineHeight}
                    className="min-h-[132px]"
                  />

                  <div className="space-y-1">
                    <h2 className="text-base font-bold tracking-tight text-[#1E1B18]">{paper.name}</h2>
                    <p className="text-xs leading-relaxed text-[#4A433A]">{paper.description}</p>
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
                      ? 'bg-[#24201C] hover:bg-[#38322C] text-[#FFFDF8] font-bold'
                      : 'bg-[#FAF4E8] hover:bg-[#24201C] text-[#1E1B18] hover:text-[#FFFDF8] border border-[#D7CCB5]'
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
