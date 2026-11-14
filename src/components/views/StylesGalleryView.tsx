import React, { useState, useRef } from 'react';
import { Upload, Check, ArrowRight, Search } from 'lucide-react';
import { BUILT_IN_FONTS } from '../../constants';
import { HandwritingFont } from '../../types';
import { FONT_DESCRIPTIONS } from '../../data/platformContent';
import MiniPaperSample from '../MiniPaperSample';

interface StylesGalleryViewProps {
  theme: 'dark' | 'light';
  activeFontId: string;
  customFonts: HandwritingFont[];
  onSelectStyle: (fontId: string) => void;
  onUploadCustomFont: (file: File) => void;
}

export default function StylesGalleryView({
  theme,
  activeFontId,
  customFonts,
  onSelectStyle,
  onUploadCustomFont,
}: StylesGalleryViewProps) {
  const isLight = theme === 'light';
  const fontInputRef = useRef<HTMLInputElement | null>(null);

  const [category, setCategory] = useState<'all' | 'neat' | 'cursive' | 'casual' | 'messy'>('all');
  const [customSampleText, setCustomSampleText] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const allFonts = [...customFonts, ...BUILT_IN_FONTS];

  const filteredFonts = allFonts.filter((font) => {
    const matchesCategory = category === 'all' || font.category === category;
    const q = searchQuery.trim().toLowerCase();
    const meta = FONT_DESCRIPTIONS[font.id];
    const matchesSearch =
      !q ||
      font.name.toLowerCase().includes(q) ||
      font.category.toLowerCase().includes(q) ||
      (meta?.description.toLowerCase().includes(q) ?? false);
    return matchesCategory && matchesSearch;
  });

  const surfaceClass = isLight
    ? 'bg-white border-slate-200 text-slate-900'
    : 'bg-[#13141a] border-white/10 text-zinc-100';
  const mutedText = isLight ? 'text-slate-600' : 'text-zinc-400';

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="max-w-2xl space-y-3">
          <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            Handwriting Styles Gallery
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance">
            Compare authentic handwriting styles before you write.
          </h1>
          <p className={`text-sm sm:text-base leading-relaxed ${mutedText}`}>
            Every preview card uses the exact handwriting script rendered in the editor and PDF exporter. Type your own phrase below to test all {allFonts.length} styles live.
          </p>
        </div>

        {/* Upload Custom Font Button */}
        <div>
          <button
            type="button"
            onClick={() => fontInputRef.current?.click()}
            className={`cursor-pointer min-h-[44px] px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold inline-flex items-center gap-2 transition-colors ${
              isLight
                ? 'bg-white hover:bg-slate-50 border-slate-300 text-slate-800'
                : 'bg-white/5 hover:bg-white/10 border-white/15 text-white'
            }`}
          >
            <Upload className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Upload Your Font (.ttf / .otf / .woff)</span>
          </button>
          <input
            ref={fontInputRef}
            type="file"
            accept=".ttf,.otf,.woff,.woff2"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                onUploadCustomFont(file);
                e.target.value = '';
              }
            }}
            className="hidden"
          />
        </div>
      </div>

      {/* Interactive Filter + Live Custom Sample Tester Bar */}
      <div className={`rounded-2xl border p-4 sm:p-5 space-y-4 ${surfaceClass}`}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-7">
            <label htmlFor="style-sample-input" className="block text-xs font-semibold mb-1.5">
              Preview Custom Sentence Across All Styles
            </label>
            <input
              id="style-sample-input"
              type="text"
              value={customSampleText}
              onChange={(e) => setCustomSampleText(e.target.value)}
              placeholder="Type your own sentence here to test every handwriting script..."
              className={`w-full min-h-[42px] px-3.5 py-2 rounded-xl border text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/40 ${
                isLight
                  ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'
                  : 'bg-[#0b0c10] border-white/10 text-zinc-100 placeholder:text-zinc-500'
              }`}
            />
          </div>

          <div className="md:col-span-5">
            <label htmlFor="style-search-input" className="block text-xs font-semibold mb-1.5">
              Search Styles
            </label>
            <div className="relative">
              <Search className="w-4 h-4 opacity-50 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="style-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by name, cursive, messy, lab..."
                className={`w-full min-h-[42px] pl-9 pr-3.5 py-2 rounded-xl border text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/40 ${
                  isLight
                    ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'
                    : 'bg-[#0b0c10] border-white/10 text-zinc-100 placeholder:text-zinc-500'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Category Segmented Tabs */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          {[
            { id: 'all', label: `All Styles (${allFonts.length})` },
            { id: 'neat', label: 'Neat Notes' },
            { id: 'cursive', label: 'Cursive & Penmanship' },
            { id: 'casual', label: 'Casual Classroom' },
            { id: 'messy', label: 'Quick / Ballpoint' },
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
      </div>

      {/* Styles Grid */}
      {filteredFonts.length === 0 ? (
        <div className={`rounded-2xl border p-12 text-center space-y-3 ${surfaceClass}`}>
          <div className="text-base font-semibold">No handwriting styles matched "{searchQuery}"</div>
          <p className={`text-sm ${mutedText}`}>Try clearing your search or switching category tabs.</p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setCategory('all');
            }}
            className="cursor-pointer px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
          >
            Show All Styles
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredFonts.map((font) => {
            const meta = FONT_DESCRIPTIONS[font.id];
            const isSelected = activeFontId === font.id;
            const previewSentence =
              customSampleText.trim() ||
              meta?.sampleLine ||
              'The quick brown fox writes neatly across the ruled page.';

            return (
              <article
                key={font.id}
                className={`rounded-2xl border p-5 flex flex-col justify-between gap-4 transition-colors ${
                  isSelected
                    ? isLight
                      ? 'bg-white border-indigo-500 ring-2 ring-indigo-500/20'
                      : 'bg-[#151722] border-indigo-400 ring-2 ring-indigo-400/20'
                    : surfaceClass
                }`}
              >
                <div className="space-y-3">
                  {/* Card Metadata (unboxed typography, zero pills) */}
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className={`capitalize font-medium ${mutedText}`}>
                      {font.isCustom ? 'Custom Upload' : font.category}
                      {meta?.bestFor ? ` · ${meta.bestFor}` : ''}
                    </span>
                    {isSelected && (
                      <span className="text-indigo-600 dark:text-indigo-400 font-semibold inline-flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        Selected
                      </span>
                    )}
                  </div>

                  {/* Real Handwriting Specimen on Ruled Sheet */}
                  <MiniPaperSample
                    paperType="ruled"
                    fontFamily={font.fontFamily}
                    inkColor="#002699"
                    text={previewSentence}
                    fontSize={19}
                    lineHeight={26}
                    className="min-h-[126px]"
                  />

                  <div className="space-y-1">
                    <h2 className="text-base font-bold tracking-tight">{font.name}</h2>
                    <p className={`text-xs leading-relaxed ${mutedText}`}>
                      {meta?.description ||
                        'Uploaded custom handwriting font ready for multi-page A4 rendering.'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectStyle(font.id)}
                  className={`cursor-pointer w-full min-h-[42px] px-4 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                    isSelected
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      : isLight
                      ? 'bg-slate-100 hover:bg-indigo-600 text-slate-900 hover:text-white'
                      : 'bg-white/10 hover:bg-indigo-600 text-white'
                  }`}
                >
                  <span>{isSelected ? 'Continue in Editor' : 'Select Style'}</span>
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
