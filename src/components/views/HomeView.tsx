import React, { useState } from 'react';
import {
  ArrowRight,
  PenTool,
  Layers,
  SlidersHorizontal,
  Download,
  ShieldCheck,
  FileText,
  Sparkles,
  Check,
  Ruler,
  BookOpen,
} from 'lucide-react';
import { AppPage, PaperType } from '../../types';
import MiniPaperSample from '../MiniPaperSample';
import StudentTestimonials from '../StudentTestimonials';

interface HomeViewProps {
  theme: 'dark' | 'light';
  onNavigate: (page: AppPage) => void;
  onStartWithSetup: (text: string, fontId: string, paperType: PaperType, inkColor: string) => void;
  onOpenBuyCoffee: () => void;
}

const HERO_STYLE_OPTIONS = [
  { id: 'kalam', label: 'Neat College', fontFamily: "'Kalam', cursive" },
  { id: 'caveat', label: 'Natural Note', fontFamily: "'Caveat', cursive" },
  { id: 'homemade-apple', label: 'Classic Cursive', fontFamily: "'Homemade Apple', cursive" },
  { id: 'patrick-hand', label: 'Classroom Print', fontFamily: "'Patrick Hand', cursive" },
];

const HERO_PAPER_OPTIONS: { id: PaperType; label: string }[] = [
  { id: 'ruled', label: 'Ruled Notebook' },
  { id: 'aesthetic-cream', label: 'Warm Cream' },
  { id: 'cornell-notes', label: 'Cornell Notes' },
  { id: 'grid', label: 'Quad Grid' },
];

export default function HomeView({
  theme,
  onNavigate,
  onStartWithSetup,
  onOpenBuyCoffee,
}: HomeViewProps) {
  const isLight = theme === 'light';

  const [heroText, setHeroText] = useState(
    `Study Notes — Classical Mechanics\n\nNewton's Second Law states that force equals the rate of change of momentum:\nF = m × a\n\nRemember to check units (kg·m/s²) and attach the free-body diagram before printing.`
  );
  const [heroFontId, setHeroFontId] = useState('kalam');
  const [heroPaper, setHeroPaper] = useState<PaperType>('ruled');
  const [heroInk, setHeroInk] = useState('#002699');
  const [heroGuides, setHeroGuides] = useState(false);

  const activeFont =
    HERO_STYLE_OPTIONS.find((f) => f.id === heroFontId) || HERO_STYLE_OPTIONS[0];

  const surfaceClass = isLight
    ? 'bg-white border-slate-200 text-slate-900'
    : 'bg-[#13141a] border-white/10 text-zinc-100';

  const mutedText = isLight ? 'text-slate-600' : 'text-zinc-400';

  return (
    <div className="flex flex-col">
      {/* ===================================================================== */}
      {/* 1. HERO SECTION + LIVE PRODUCT PREVIEW                                */}
      {/* ===================================================================== */}
      <section
        className={`relative overflow-hidden border-b transition-colors ${
          isLight
            ? 'bg-gradient-to-b from-slate-50 via-white to-slate-50 border-slate-200'
            : 'bg-gradient-to-b from-[#0d0e13] via-[#111218] to-[#0d0e13] border-white/10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-14 sm:pt-16 sm:pb-20">
          {/* Top Centered Editorial Hero Copy */}
          <div className="max-w-3xl mx-auto text-center space-y-5">
            <h1
              className={`font-bold tracking-tight text-balance leading-[1.12] ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}
              style={{ fontSize: 'clamp(2.25rem, 4.2vw, 3.65rem)' }}
            >
              Turn Your Text Into Beautiful Handwriting
            </h1>

            <p className={`text-base sm:text-lg leading-relaxed max-w-2xl mx-auto ${mutedText}`}>
              Create realistic handwriting-style notes, study sheets, letters, and printable documents in minutes with AI.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('editor')}
                className="cursor-pointer w-full sm:w-auto min-h-[48px] px-7 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm sm:text-base font-semibold inline-flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98]"
              >
                <span>Start Creating Free</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('features')}
                className={`cursor-pointer w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-xl border text-sm sm:text-base font-semibold inline-flex items-center justify-center gap-2 transition-colors ${
                  isLight
                    ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                    : 'bg-white/5 hover:bg-white/10 border-white/15 text-zinc-100'
                }`}
              >
                <span>Explore Features</span>
              </button>
            </div>
          </div>

          {/* Interactive Split Live Product Preview */}
          <div
            className={`mt-10 sm:mt-12 rounded-2xl border shadow-sm overflow-hidden transition-colors ${surfaceClass}`}
          >
            {/* Preview Window Header */}
            <div
              className={`px-4 sm:px-6 py-3 border-b flex items-center justify-between gap-3 flex-wrap ${
                isLight ? 'bg-slate-50/80 border-slate-200' : 'bg-[#171820] border-white/10'
              }`}
            >
              <div className="flex items-center gap-2 text-xs font-medium">
                <span className="font-semibold">Live Interactive Preview</span>
                <span aria-hidden="true" className="opacity-40">·</span>
                <span className={mutedText}>Edit text on the left to test handwriting live</span>
              </div>

              <button
                type="button"
                onClick={() => onStartWithSetup(heroText, heroFontId, heroPaper, heroInk)}
                className="cursor-pointer text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1 whitespace-nowrap"
              >
                <span>Open in Full A4 Editor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Split Grid: Left Editor Controls / Right Paper Sheet */}
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              {/* Left Editor Side */}
              <div
                className={`lg:col-span-5 p-4 sm:p-6 border-b lg:border-b-0 lg:border-r flex flex-col justify-between gap-5 ${
                  isLight ? 'border-slate-200 bg-white' : 'border-white/10 bg-[#13141a]'
                }`}
              >
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="hero-live-text"
                      className="block text-xs font-semibold mb-1.5"
                    >
                      Your Text
                    </label>
                    <textarea
                      id="hero-live-text"
                      value={heroText}
                      onChange={(e) => setHeroText(e.target.value)}
                      rows={5}
                      className={`w-full p-3 text-sm rounded-xl border resize-none focus:outline-hidden focus:ring-2 focus:ring-indigo-500/40 leading-relaxed ${
                        isLight
                          ? 'bg-slate-50 border-slate-200 text-slate-900'
                          : 'bg-[#0c0d12] border-white/10 text-zinc-100'
                      }`}
                      placeholder="Type anything here to preview..."
                    />
                  </div>

                  {/* Quick Style Switcher */}
                  <div>
                    <div className="text-xs font-semibold mb-2">Handwriting Style</div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {HERO_STYLE_OPTIONS.map((style) => {
                        const active = heroFontId === style.id;
                        return (
                          <button
                            key={style.id}
                            type="button"
                            onClick={() => setHeroFontId(style.id)}
                            className={`cursor-pointer min-h-[38px] px-3 py-1.5 rounded-xl border text-xs font-medium text-left transition-colors truncate ${
                              active
                                ? 'bg-indigo-600 text-white border-indigo-600'
                                : isLight
                                ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                                : 'bg-white/5 hover:bg-white/10 border-white/10 text-zinc-300'
                            }`}
                          >
                            {style.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quick Paper & Ink Controls */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs font-semibold mb-1.5">Paper</div>
                      <select
                        aria-label="Preview paper template"
                        value={heroPaper}
                        onChange={(e) => setHeroPaper(e.target.value as PaperType)}
                        className={`w-full min-h-[40px] px-2.5 rounded-xl border text-xs font-medium cursor-pointer ${
                          isLight
                            ? 'bg-slate-50 border-slate-200 text-slate-800'
                            : 'bg-[#0c0d12] border-white/10 text-zinc-200'
                        }`}
                      >
                        {HERO_PAPER_OPTIONS.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <div className="text-xs font-semibold mb-1.5">Ink &amp; Guides</div>
                      <div className="flex items-center gap-2 min-h-[40px]">
                        {[
                          { label: 'Blue Gel', hex: '#002699' },
                          { label: 'Black Ink', hex: '#111827' },
                          { label: 'Navy Pen', hex: '#1e3a8a' },
                        ].map((c) => (
                          <button
                            key={c.hex}
                            type="button"
                            onClick={() => setHeroInk(c.hex)}
                            aria-label={c.label}
                            title={c.label}
                            className={`cursor-pointer w-7 h-7 rounded-full border-2 transition-transform ${
                              heroInk === c.hex
                                ? 'border-indigo-500 scale-110'
                                : 'border-slate-300 dark:border-zinc-600'
                            }`}
                            style={{ backgroundColor: c.hex }}
                          />
                        ))}

                        <button
                          type="button"
                          onClick={() => setHeroGuides((prev) => !prev)}
                          aria-pressed={heroGuides}
                          className={`cursor-pointer ml-auto px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold flex items-center gap-1 transition-colors ${
                            heroGuides
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : isLight
                              ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                              : 'bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10'
                          }`}
                        >
                          <Ruler className="w-3 h-3" />
                          <span>Guides</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onStartWithSetup(heroText, heroFontId, heroPaper, heroInk)}
                  className="cursor-pointer w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Customize &amp; Export PDF</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Right Live Paper Sheet */}
              <div
                className={`lg:col-span-7 p-4 sm:p-6 lg:p-8 flex items-center justify-center ${
                  isLight ? 'bg-slate-100/80' : 'bg-[#0b0c10]'
                }`}
              >
                <div className="w-full max-w-xl relative">
                  <MiniPaperSample
                    paperType={heroPaper}
                    fontFamily={activeFont.fontFamily}
                    inkColor={heroInk}
                    text={heroText || 'Start typing on the left to see live handwriting...'}
                    fontSize={18}
                    lineHeight={28}
                    className="min-h-[300px] sm:min-h-[330px] shadow-lg"
                  />

                  {heroGuides && (
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-4 border border-dashed border-indigo-500/50 rounded-sm"
                    >
                      <span className="absolute -top-2.5 left-2 px-1.5 py-0.5 text-[10px] font-mono-code bg-white/95 text-indigo-700 border border-indigo-200 rounded">
                        Margin Guides · Preview Only
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Trust & Simplicity Strip Below Hero */}
          <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                title: '100% Browser Private',
                desc: 'Notes render locally in your browser without server uploads.',
              },
              {
                title: '19 Handwriting Styles',
                desc: 'Neat, casual, cursive, and rapid scripts plus .ttf/.otf upload.',
              },
              {
                title: '23 Paper Templates',
                desc: 'Ruled, college, grid, dot, Cornell notes, French Séyès & vintage.',
              },
              {
                title: 'Clean A4 PDF Output',
                desc: 'Multi-page PDF & high-res PNG downloads with zero watermarks.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className={`p-4 rounded-xl border ${
                  isLight
                    ? 'bg-white border-slate-200/90'
                    : 'bg-[#13141a] border-white/10'
                }`}
              >
                <div className="text-sm font-semibold">{item.title}</div>
                <p className={`text-xs mt-1 leading-relaxed ${mutedText}`}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 2. HOW IT WORKS (3 SIMPLE STEPS)                                      */}
      {/* ===================================================================== */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="max-w-2xl mb-10 sm:mb-12">
          <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">
            How it works
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-balance">
            From typed text to printable handwritten pages in three steps.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: '01.',
              title: 'Add or upload your text',
              desc: 'Type directly, paste from your notes app, load a sample preset, or import a .txt / .md document.',
              preview: (
                <div
                  className={`p-3 rounded-xl border text-xs font-mono-code space-y-1.5 ${
                    isLight
                      ? 'bg-slate-50 border-slate-200 text-slate-700'
                      : 'bg-[#0b0c10] border-white/10 text-zinc-300'
                  }`}
                >
                  <div className="font-semibold text-indigo-600 dark:text-indigo-400">
                    notes_chapter_3.md
                  </div>
                  <div className="opacity-80">
                    1. State Newton’s Second Law...
                  </div>
                  <div className="opacity-60">F = dp/dt = m · a</div>
                </div>
              ),
            },
            {
              step: '02.',
              title: 'Choose a handwriting style & paper',
              desc: 'Pick any of 19 handwriting scripts, set ink color, pick ruled or aesthetic paper, and toggle Margin Guides.',
              preview: (
                <div className="grid grid-cols-2 gap-2">
                  <MiniPaperSample
                    paperType="ruled"
                    fontFamily="'Kalam', cursive"
                    text="Neat Blue Ink"
                    fontSize={13}
                    lineHeight={20}
                    className="min-h-[82px]"
                  />
                  <MiniPaperSample
                    paperType="aesthetic-cream"
                    fontFamily="'Homemade Apple', cursive"
                    inkColor="#1e293b"
                    text="Cursive Notes"
                    fontSize={12}
                    lineHeight={20}
                    className="min-h-[82px]"
                  />
                </div>
              ),
            },
            {
              step: '03.',
              title: 'Generate and download your document',
              desc: 'Auto-split long notes across pages, add sketches if needed, and export a crisp A4 PDF or PNG.',
              preview: (
                <div
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                    isLight
                      ? 'bg-slate-50 border-slate-200'
                      : 'bg-[#0b0c10] border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold truncate">Handwritten_Notes.pdf</div>
                      <div className={`text-[11px] tabular-nums ${mutedText}`}>A4 · 300 DPI ready</div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 shrink-0">
                    Ready
                  </span>
                </div>
              ),
            },
          ].map((item) => (
            <div
              key={item.step}
              className={`rounded-2xl border p-6 flex flex-col justify-between gap-5 ${surfaceClass}`}
            >
              <div className="space-y-2.5">
                <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                  {item.step}
                </span>
                <h3 className="text-lg font-bold tracking-tight">{item.title}</h3>
                <p className={`text-sm leading-relaxed ${mutedText}`}>{item.desc}</p>
              </div>
              {item.preview}
            </div>
          ))}
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 3. BEFORE & AFTER REAL PRODUCT DEMONSTRATION                          */}
      {/* ===================================================================== */}
      <section
        className={`border-y py-14 sm:py-20 transition-colors ${
          isLight
            ? 'bg-white border-slate-200'
            : 'bg-[#101116] border-white/10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">
              Before &amp; After
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-balance">
              See how plain typed notes transform onto realistic notebook paper.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {/* Before: Typed Input */}
            <div
              className={`rounded-2xl border p-6 flex flex-col justify-between gap-4 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#14151c] border-white/10'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-semibold">
                <span>Before — Plain Typed Text</span>
                <span className={mutedText}>Unformatted raw text</span>
              </div>
              <pre
                className={`flex-1 p-4 rounded-xl border text-xs sm:text-sm font-mono-code whitespace-pre-wrap leading-relaxed ${
                  isLight
                    ? 'bg-white border-slate-200 text-slate-700'
                    : 'bg-[#0b0c10] border-white/10 text-zinc-300'
                }`}
              >
{`LAB REPORT: DATA STRUCTURES

Topic: Binary Search Tree Traversal
1. Inorder (Left -> Root -> Right)
   Always yields elements in sorted ascending order.

2. Time Complexity:
   Average search: O(log n)
   Balanced trees prevent O(n) skew.`}
              </pre>
            </div>

            {/* After: Handwritten Notebook Sheet */}
            <div
              className={`rounded-2xl border p-6 flex flex-col justify-between gap-4 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#14151c] border-white/10'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-indigo-600 dark:text-indigo-400">
                  After — Handwritten College Ruled Output
                </span>
                <span className={mutedText}>Kalam · Royal Blue Gel</span>
              </div>
              <MiniPaperSample
                paperType="college-ruled"
                fontFamily="'Kalam', cursive"
                inkColor="#002699"
                fontSize={17}
                lineHeight={26}
                text={`LAB REPORT: DATA STRUCTURES

Topic: Binary Search Tree Traversal
1. Inorder (Left -> Root -> Right)
   Always yields elements in sorted ascending order.

2. Time Complexity:
   Average search: O(log n)
   Balanced trees prevent O(n) skew.`}
                className="flex-1 min-h-[240px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 4. FEATURE OVERVIEW BENTO CARDS                                       */}
      {/* ===================================================================== */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">
              Platform Capabilities
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-balance">
              Everything you need for authentic handwritten documents.
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('features')}
            className="cursor-pointer text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1 shrink-0"
          >
            <span>View all features</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Large Bento Card 1 */}
          <div className={`md:col-span-7 rounded-2xl border p-6 sm:p-7 flex flex-col justify-between gap-5 ${surfaceClass}`}>
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <PenTool className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold tracking-tight">19 Handwriting Styles + Custom Font Upload</h3>
              <p className={`text-sm leading-relaxed max-w-xl ${mutedText}`}>
                Switch between neat student notes, expressive cursive scripts, casual classroom pens, or upload your own .ttf / .otf handwriting font file. Natural stroke jitter keeps lines organic.
              </p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-inherit">
              <span className={`text-xs ${mutedText}`}>Neat · Cursive · Casual · Rapid</span>
              <button
                type="button"
                onClick={() => onNavigate('styles')}
                className="cursor-pointer text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
              >
                <span>Explore Styles</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Bento Card 2 */}
          <div className={`md:col-span-5 rounded-2xl border p-6 sm:p-7 flex flex-col justify-between gap-5 ${surfaceClass}`}>
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold tracking-tight">23 Notebook &amp; Paper Templates</h3>
              <p className={`text-sm leading-relaxed ${mutedText}`}>
                School ruled, college ruled, French Séyès, Cornell notes, 5mm dot grid, vintage parchment, spiral rings, and clean white A4 paper.
              </p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-inherit">
              <span className={`text-xs ${mutedText}`}>A4 Print Proportions</span>
              <button
                type="button"
                onClick={() => onNavigate('papers')}
                className="cursor-pointer text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
              >
                <span>Explore Papers</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Bento Card 3 */}
          <div className={`md:col-span-5 rounded-2xl border p-6 sm:p-7 flex flex-col justify-between gap-5 ${surfaceClass}`}>
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold tracking-tight">Margin Guides &amp; Sketch Canvas</h3>
              <p className={`text-sm leading-relaxed ${mutedText}`}>
                Toggle faint preview-only Margin Guides to align headings and hand-drawn or uploaded diagrams cleanly before exporting.
              </p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-inherit">
              <span className={`text-xs ${mutedText}`}>Guides never print in PDF</span>
              <button
                type="button"
                onClick={() => onNavigate('editor')}
                className="cursor-pointer text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
              >
                <span>Explore Editor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Bento Card 4 */}
          <div className={`md:col-span-7 rounded-2xl border p-6 sm:p-7 flex flex-col justify-between gap-5 ${surfaceClass}`}>
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Download className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold tracking-tight">Multi-Page Auto-Split &amp; Instant PDF Export</h3>
              <p className={`text-sm leading-relaxed max-w-xl ${mutedText}`}>
                Paste long essays or import .txt / .md files. Automatic pagination splits content cleanly across pages, and browser-local Canvas + jsPDF export creates watermark-free A4 PDFs.
              </p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-inherit">
              <span className={`text-xs ${mutedText}`}>Multi-page PDF &amp; 2.5× PNG</span>
              <button
                type="button"
                onClick={() => onNavigate('tools')}
                className="cursor-pointer text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
              >
                <span>Explore Tools</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 5. REAL STUDENT REVIEWS & PROOF                                       */}
      {/* ===================================================================== */}
      <StudentTestimonials theme={theme} onOpenCoffeeModal={onOpenBuyCoffee} />

      {/* ===================================================================== */}
      {/* 6. BOTTOM CONVERSION BANNER                                           */}
      {/* ===================================================================== */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div
          className={`rounded-2xl border p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${surfaceClass}`}
        >
          <div className="space-y-2 max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Ready to turn your notes into handwriting?
            </h2>
            <p className={`text-sm sm:text-base ${mutedText}`}>
              No sign-up required. Open the editor, pick your paper style, and download your A4 PDF in minutes.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('editor')}
              className="cursor-pointer min-h-[46px] px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold inline-flex items-center gap-2 transition-colors"
            >
              <span>Start Creating Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('faq')}
              className={`cursor-pointer min-h-[46px] px-5 py-3 rounded-xl border text-sm font-semibold transition-colors ${
                isLight
                  ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-zinc-200'
              }`}
            >
              Read FAQ
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
