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
  activeFontId,
  customFonts,
  onSelectStyle,
  onUploadCustomFont,
}: StylesGalleryViewProps) {
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

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8 text-[#1E1B18]">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="max-w-2xl space-y-3">
          <div className="text-xs font-semibold text-[#9A4319] uppercase tracking-wider">
            Handwriting Styles Gallery
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance text-[#1E1B18]">
            Compare authentic handwriting styles before you write.
          </h1>
          <p className="text-sm sm:text-base leading-relaxed text-[#4A433A]">
            Every preview card uses the exact handwriting script rendered in the editor and PDF exporter. Type your own phrase below to test all {allFonts.length} styles live.
          </p>
        </div>

        {/* Upload Custom Font Button */}
        <div>
          <button
            type="button"
            onClick={() => fontInputRef.current?.click()}
            className="cursor-pointer min-h-[44px] px-4 py-2.5 rounded-xl border border-[#D7CCB5] bg-[#FFFDF8]/94 hover:bg-[#FAF4E8] text-[#1E1B18] text-xs sm:text-sm font-semibold inline-flex items-center gap-2 transition-colors shadow-2xs"
          >
            <Upload className="w-4 h-4 text-[#9A4319]" />
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
      <div className="rounded-2xl border border-[#DDD2BC] bg-[#FFFDF8]/94 p-4 sm:p-5 space-y-4 shadow-2xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-7">
            <label htmlFor="style-sample-input" className="block text-xs font-semibold mb-1.5 text-[#1E1B18]">
              Preview Custom Sentence Across All Styles
            </label>
            <input
              id="style-sample-input"
              type="text"
              value={customSampleText}
              onChange={(e) => setCustomSampleText(e.target.value)}
              placeholder="Type your own sentence here to test every handwriting script..."
              className="w-full min-h-[42px] px-3.5 py-2 rounded-xl border border-[#D7CCB5] bg-[#FAF4E8] text-sm text-[#1E1B18] placeholder:text-[#8C7F6E] focus:outline-hidden focus:ring-2 focus:ring-[#9A4319]/25 focus:border-[#9A4319]"
            />
          </div>

          <div className="md:col-span-5">
            <label htmlFor="style-search-input" className="block text-xs font-semibold mb-1.5 text-[#1E1B18]">
              Search Styles
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-[#6E655A] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="style-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by name, cursive, messy, lab..."
                className="w-full min-h-[42px] pl-9 pr-3.5 py-2 rounded-xl border border-[#D7CCB5] bg-[#FAF4E8] text-sm text-[#1E1B18] placeholder:text-[#8C7F6E] focus:outline-hidden focus:ring-2 focus:ring-[#9A4319]/25 focus:border-[#9A4319]"
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
                    ? 'bg-[#24201C] text-[#FFFDF8] font-bold'
                    : 'bg-[#FAF4E8] hover:bg-[#EFE5D3] text-[#4A433A] border border-[#D7CCB5]'
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
        <div className="rounded-2xl border border-[#DDD2BC] bg-[#FFFDF8]/94 p-12 text-center space-y-3">
          <div className="text-base font-semibold text-[#1E1B18]">No handwriting styles matched "{searchQuery}"</div>
          <p className="text-sm text-[#4A433A]">Try clearing your search or switching category tabs.</p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setCategory('all');
            }}
            className="cursor-pointer px-4 py-2 rounded-xl bg-[#24201C] hover:bg-[#38322C] text-[#FFFDF8] text-xs font-bold"
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
                className={`rounded-2xl border p-5 flex flex-col justify-between gap-4 transition-colors bg-[#FFFDF8]/94 shadow-2xs ${
                  isSelected
                    ? 'border-[#9A4319] ring-2 ring-[#9A4319]/20'
                    : 'border-[#DDD2BC]'
                }`}
              >
                <div className="space-y-3">
                  {/* Card Metadata */}
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="capitalize font-medium text-[#6E655A]">
                      {font.isCustom ? 'Custom Upload' : font.category}
                      {meta?.bestFor ? ` · ${meta.bestFor}` : ''}
                    </span>
                    {isSelected && (
                      <span className="text-[#9A4319] font-semibold inline-flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        Selected
                      </span>
                    )}
                  </div>

                  {/* Real Handwriting Specimen on Ruled Sheet */}
                  <MiniPaperSample
                    paperType="ruled"
                    fontFamily={font.fontFamily}
                    inkColor="#1E2430"
                    text={previewSentence}
                    fontSize={19}
                    lineHeight={26}
                    className="min-h-[126px]"
                  />

                  <div className="space-y-1">
                    <h2 className="text-base font-bold tracking-tight text-[#1E1B18]">{font.name}</h2>
                    <p className="text-xs leading-relaxed text-[#4A433A]">
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
                      ? 'bg-[#24201C] hover:bg-[#38322C] text-[#FFFDF8] font-bold'
                      : 'bg-[#FAF4E8] hover:bg-[#24201C] text-[#1E1B18] hover:text-[#FFFDF8] border border-[#D7CCB5]'
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
