import React, { useState } from 'react';
import {
  ArrowRight,
  PenTool,
  Layers,
  SlidersHorizontal,
  Download,
  FileText,
  Ruler,
  Coffee,
  Heart,
  Zap,
} from 'lucide-react';
import { AppPage, PaperType } from '../../types';
import { getPaperBackgroundStyle } from '../../utils/paperStyles';
import MiniPaperSample from '../MiniPaperSample';
import StudentTestimonials from '../StudentTestimonials';

interface HomeViewProps {
  onNavigate: (page: AppPage) => void;
  onStartWithSetup: (text: string, fontId: string, paperType: PaperType, inkColor: string) => void;
  onOpenBuyCoffee: () => void;
}

const HERO_STYLE_OPTIONS = [
  { id: 'kalam', label: 'Neat College', fontFamily: "'Kalam', cursive" },
  { id: 'caveat', label: 'Natural Flow', fontFamily: "'Caveat', cursive" },
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
  onNavigate,
  onStartWithSetup,
  onOpenBuyCoffee,
}: HomeViewProps) {
  const [heroText, setHeroText] = useState(
    `F = ma · the second law of motion\n\nAcceleration of a body is directly proportional to net force applied and inversely proportional to mass.\n\nWork = Force × Displacement · Check units before printing.`
  );
  const [heroFontId, setHeroFontId] = useState('caveat');
  const [heroPaper, setHeroPaper] = useState<PaperType>('ruled');
  const [heroInk, setHeroInk] = useState('#18181b');
  const [heroGuides, setHeroGuides] = useState(false);

  const activeFont =
    HERO_STYLE_OPTIONS.find((f) => f.id === heroFontId) || HERO_STYLE_OPTIONS[0];

  const heroPaperBg = getPaperBackgroundStyle(heroPaper, 32, 24);

  return (
    <div className="flex flex-col bg-[#faf7f0] text-[#18181b]">
      {/* ===================================================================== */}
      {/* 1. EDITORIAL HERO SECTION + TILTED LIVE NOTEBOOK SHEET                */}
      {/* ===================================================================== */}
      <section className="relative overflow-hidden border-b border-[#e5dfd2] bg-[#faf7f0]">
        {/* Subtle decorative corner notebook pages like editorial desk layout */}
        <div
          aria-hidden="true"
          className="hidden lg:block pointer-events-none absolute -top-12 -left-14 w-56 h-72 rounded-2xl bg-white/70 border border-[#ebe6da] shadow-sm -rotate-12"
        />
        <div
          aria-hidden="true"
          className="hidden lg:block pointer-events-none absolute -top-10 -right-10 w-60 h-64 rounded-2xl bg-white/65 border border-[#ebe6da] shadow-sm rotate-12"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-14 sm:pt-12 sm:pb-20">
          {/* Clean Unboxed Top Editorial Line */}
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-[#57534e] mb-8 sm:mb-10">
            <span className="font-mono-code tracking-wider uppercase text-[11px] text-[#78716c]">
              01 — Realistic Handwriting Generator
            </span>
            <span aria-hidden="true" className="text-[#a8a29e]">·</span>
            <span className="font-semibold text-[#18181b]">19 realistic handwriting styles</span>
            <span aria-hidden="true" className="text-[#a8a29e]">·</span>
            <span>23 notebook papers</span>
            <span aria-hidden="true" className="text-[#a8a29e]">·</span>
            <span>100% free PDF, no watermark</span>
          </div>

          {/* Two-Column Editorial Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Copy Column */}
            <div className="lg:col-span-6 space-y-6">
              <h1
                className="font-extrabold tracking-tight text-[#18181b] leading-[1.03] text-balance"
                style={{ fontSize: 'clamp(2.35rem, 4.4vw, 3.85rem)' }}
              >
                <span className="block">Free AI</span>
                <span
                  className="block text-[#a68426] font-normal italic pt-1 pb-2"
                  style={{ fontFamily: "'Caveat', cursive", fontSize: '1.18em', lineHeight: 0.94 }}
                >
                  Realistic Handwriting
                </span>
                <span className="block">
                  Generator — Convert Text to Handwriting
                </span>
              </h1>

              <p className="text-base sm:text-lg leading-relaxed text-[#57534e] max-w-xl">
                Turn typed notes, essays, and study sheets into natural handwritten A4 pages in seconds. Fast browser rendering, zero watermarks, and completely free for everyone.
              </p>

              {/* Primary + Secondary CTAs */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() =>
                    onStartWithSetup(heroText, heroFontId, heroPaper, heroInk)
                  }
                  className="cursor-pointer min-h-[48px] px-7 py-3 rounded-xl bg-[#18181b] hover:bg-[#27272a] text-[#faf7f0] text-sm sm:text-base font-semibold inline-flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] whitespace-nowrap"
                >
                  <span>Start Creating Free</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('features')}
                  className="cursor-pointer min-h-[48px] px-6 py-3 rounded-xl border border-[#dcd6c8] bg-white hover:bg-[#f4efe6] text-[#18181b] text-sm sm:text-base font-semibold inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                >
                  <span>Explore Features</span>
                </button>
              </div>

              {/* Quiet Support / Tip Line */}
              <div className="pt-1 flex items-center gap-2 text-xs text-[#57534e]">
                <span>No sign-up needed · Runs locally in your browser</span>
                <span aria-hidden="true">·</span>
                <button
                  type="button"
                  onClick={onOpenBuyCoffee}
                  className="cursor-pointer font-semibold text-[#856514] hover:underline inline-flex items-center gap-1"
                >
                  <Coffee className="w-3.5 h-3.5" />
                  <span>Buy Plenty a Coffee</span>
                </button>
              </div>
            </div>

            {/* Right Column: Tilted Interactive Notebook Sheet + Compact Quick Bar */}
            <div className="lg:col-span-6 space-y-4">
              {/* Realistic Tilted Notebook Card */}
              <div className="lg:rotate-[-1.25deg] hover:rotate-0 transition-transform duration-300 rounded-2xl bg-white border border-[#e2ddd0] shadow-xl overflow-hidden">
                {/* Notebook Paper Header */}
                <div className="px-5 py-2.5 border-b border-[#ece7dc] bg-[#fcfaf5] flex items-center justify-between text-[11px] text-[#78716c]">
                  <span className="font-medium">Interactive Paper Sheet — Click text to edit</span>
                  <span className="font-mono-code">{activeFont.label}</span>
                </div>

                {/* Live Editable Ruled Notebook Surface */}
                <div
                  className="relative min-h-[300px] sm:min-h-[330px]"
                  style={heroPaperBg}
                >
                  {/* Vertical Red Margin Line */}
                  {heroPaper !== 'plain' && (
                    <div
                      aria-hidden="true"
                      className="absolute top-0 bottom-0 left-[46px] w-[1.5px] bg-[#ef4444]/65 pointer-events-none"
                    />
                  )}

                  {/* Optional Margin Guides Preview Overlay */}
                  {heroGuides && (
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-4 border border-dashed border-[#a68426]/65 rounded-sm z-20"
                    >
                      <span className="absolute -top-2.5 left-2 px-1.5 py-0.5 text-[10px] font-mono-code bg-white/95 text-[#7c5d10] border border-[#e6d5a3] rounded">
                        Margin Guides · Preview Only
                      </span>
                    </div>
                  )}

                  <textarea
                    aria-label="Try typing live handwriting on notebook paper"
                    value={heroText}
                    onChange={(e) => setHeroText(e.target.value)}
                    rows={7}
                    className="relative z-10 w-full h-full min-h-[300px] sm:min-h-[330px] bg-transparent resize-none focus:outline-hidden pr-5 sm:pr-7 pb-6"
                    style={{
                      paddingTop: '24px',
                      paddingLeft: heroPaper !== 'plain' ? '60px' : '28px',
                      fontFamily: activeFont.fontFamily,
                      fontSize: heroFontId === 'caveat' ? '23px' : '19px',
                      lineHeight: '32px',
                      color: heroInk,
                    }}
                    spellCheck={false}
                  />
                </div>
              </div>

              {/* Compact Quick Style / Paper / Ink Control Strip */}
              <div className="rounded-xl border border-[#e5dfd2] bg-white p-3 flex flex-wrap items-center justify-between gap-2.5 text-xs shadow-2xs">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {HERO_STYLE_OPTIONS.map((style) => {
                    const active = heroFontId === style.id;
                    return (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => setHeroFontId(style.id)}
                        className={`cursor-pointer px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                          active
                            ? 'bg-[#18181b] text-[#faf7f0]'
                            : 'bg-[#f6f2e8] hover:bg-[#ece5d5] text-[#44403c]'
                        }`}
                      >
                        {style.label}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2 ml-auto">
                  <select
                    aria-label="Preview paper style"
                    value={heroPaper}
                    onChange={(e) => setHeroPaper(e.target.value as PaperType)}
                    className="px-2.5 py-1.5 rounded-lg border border-[#e2ddd0] bg-[#faf7f0] text-xs font-medium text-[#18181b] cursor-pointer"
                  >
                    {HERO_PAPER_OPTIONS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.label}
                      </option>
                    ))}
                  </select>

                  <div className="flex items-center gap-1.5">
                    {[
                      { label: 'Black Ink', hex: '#18181b' },
                      { label: 'Royal Blue', hex: '#002699' },
                      { label: 'Warm Sepia', hex: '#6b4f0b' },
                    ].map((c) => (
                      <button
                        key={c.hex}
                        type="button"
                        onClick={() => setHeroInk(c.hex)}
                        aria-label={c.label}
                        title={c.label}
                        className={`cursor-pointer w-5 h-5 rounded-full border-2 transition-transform ${
                          heroInk === c.hex
                            ? 'border-[#a68426] scale-115'
                            : 'border-[#d6cfc0]'
                        }`}
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setHeroGuides((prev) => !prev)}
                    aria-pressed={heroGuides}
                    title="Toggle Margin Guides preview"
                    className={`cursor-pointer px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-colors ${
                      heroGuides
                        ? 'bg-[#a68426] text-white border-[#a68426]'
                        : 'bg-[#faf7f0] border-[#e2ddd0] text-[#44403c] hover:bg-[#f1eadc]'
                    }`}
                  >
                    <Ruler className="w-3 h-3" />
                    <span>Guides</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 4-Column Trust & Instant Speed Strip */}
          <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {[
              {
                title: '100% Free Forever',
                desc: 'Every font, paper sheet, and PDF download is free—tip coffee only if happy.',
              },
              {
                title: 'Instant Fast Results',
                desc: 'Live keystroke preview and local PDF export in seconds without server queues.',
              },
              {
                title: '19 Handwriting Styles',
                desc: 'Neat student, cursive, casual scripts, plus .ttf / .otf custom font import.',
              },
              {
                title: '23 Notebook Papers',
                desc: 'Ruled, college, Cornell, dot grid, French Séyès & clean watermark-free A4 PDFs.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-4 sm:p-5 rounded-xl border border-[#e5dfd2] bg-white"
              >
                <div className="text-sm font-bold text-[#18181b]">{item.title}</div>
                <p className="text-xs mt-1 leading-relaxed text-[#57534e]">
                  {item.desc}
                </p>
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
          <div className="text-xs font-semibold text-[#856514] uppercase tracking-wider mb-2">
            How it works
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-balance text-[#18181b]">
            From typed text to printable handwritten pages in three fast steps.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: '01.',
              title: 'Add or upload your text',
              desc: 'Type directly, paste notes, choose a subject preset, or import a .txt / .md document.',
              preview: (
                <div className="p-3.5 rounded-xl border border-[#e5dfd2] bg-[#faf7f0] text-xs font-mono-code space-y-1.5 text-[#44403c]">
                  <div className="font-semibold text-[#856514]">
                    notes_chapter_3.md
                  </div>
                  <div>1. State Newton’s Second Law...</div>
                  <div className="opacity-70">F = dp/dt = m · a</div>
                </div>
              ),
            },
            {
              step: '02.',
              title: 'Choose handwriting style & paper',
              desc: 'Pick any of 19 scripts, adjust ink and line height, select ruled or study paper, and toggle Margin Guides.',
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
              title: 'Generate & export A4 PDF instantly',
              desc: 'Split long documents across pages automatically and download clean A4 PDF or 2.5× PNG files.',
              preview: (
                <div className="p-3.5 rounded-xl border border-[#e5dfd2] bg-[#faf7f0] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-[#18181b] text-[#faf7f0] flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold truncate text-[#18181b]">
                        Handwritten_Notes.pdf
                      </div>
                      <div className="text-[11px] tabular-nums text-[#78716c]">
                        A4 · Zero watermarks
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 shrink-0">
                    Ready
                  </span>
                </div>
              ),
            },
          ].map((item) => (
            <div
              key={item.step}
              className="rounded-2xl border border-[#e5dfd2] bg-white p-6 flex flex-col justify-between gap-5"
            >
              <div className="space-y-2.5">
                <span className="text-sm font-bold text-[#856514] tabular-nums">
                  {item.step}
                </span>
                <h3 className="text-lg font-bold tracking-tight text-[#18181b]">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-[#57534e]">
                  {item.desc}
                </p>
              </div>
              {item.preview}
            </div>
          ))}
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 3. BEFORE & AFTER COMPARISON                                          */}
      {/* ===================================================================== */}
      <section className="border-y border-[#e5dfd2] bg-white py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <div className="text-xs font-semibold text-[#856514] uppercase tracking-wider mb-2">
              Before &amp; After
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-balance text-[#18181b]">
              See how plain typed text turns into natural handwritten sheets.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            <div className="rounded-2xl border border-[#e5dfd2] bg-[#faf7f0] p-6 flex flex-col justify-between gap-4">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-[#18181b]">Before — Plain Typed Text</span>
                <span className="text-[#78716c]">Unformatted raw text</span>
              </div>
              <pre className="flex-1 p-4 rounded-xl border border-[#e5dfd2] bg-white text-xs sm:text-sm font-mono-code whitespace-pre-wrap leading-relaxed text-[#44403c]">
{`LAB REPORT: DATA STRUCTURES

Topic: Binary Search Tree Traversal
1. Inorder (Left -> Root -> Right)
   Always yields elements in sorted ascending order.

2. Time Complexity:
   Average search: O(log n)
   Balanced trees prevent O(n) skew.`}
              </pre>
            </div>

            <div className="rounded-2xl border border-[#e5dfd2] bg-[#faf7f0] p-6 flex flex-col justify-between gap-4">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-[#856514]">
                  After — Handwritten College Ruled Output
                </span>
                <span className="text-[#78716c]">Kalam · Royal Blue Gel</span>
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
      {/* 4. PLATFORM CAPABILITIES BENTO GRID                                   */}
      {/* ===================================================================== */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold text-[#856514] uppercase tracking-wider mb-2">
              Platform Capabilities
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-balance text-[#18181b]">
              Everything included free for crisp handwritten documents.
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('features')}
            className="cursor-pointer text-sm font-semibold text-[#18181b] hover:text-[#856514] inline-flex items-center gap-1 shrink-0"
          >
            <span>View all features</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Card 1 */}
          <div className="md:col-span-7 rounded-2xl border border-[#e5dfd2] bg-white p-6 sm:p-7 flex flex-col justify-between gap-5">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#faf3e0] text-[#856514] flex items-center justify-center">
                <PenTool className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-[#18181b]">
                19 Handwriting Styles + Custom Font Upload
              </h3>
              <p className="text-sm leading-relaxed max-w-xl text-[#57534e]">
                Switch between neat student notes, expressive cursive scripts, casual pens, or upload your own .ttf / .otf handwriting font file with natural pen jitter.
              </p>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-[#ece7dc]">
              <span className="text-xs text-[#78716c]">Neat · Cursive · Casual · Rapid</span>
              <button
                type="button"
                onClick={() => onNavigate('styles')}
                className="cursor-pointer text-xs font-semibold text-[#18181b] hover:text-[#856514] inline-flex items-center gap-1"
              >
                <span>Explore Styles</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2 */}
          <div className="md:col-span-5 rounded-2xl border border-[#e5dfd2] bg-white p-6 sm:p-7 flex flex-col justify-between gap-5">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#faf3e0] text-[#856514] flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-[#18181b]">
                23 Notebook &amp; Paper Templates
              </h3>
              <p className="text-sm leading-relaxed text-[#57534e]">
                School ruled, college ruled, French Séyès, Cornell notes, 5mm dot grid, vintage parchment, spiral rings, and clean white A4 sheets.
              </p>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-[#ece7dc]">
              <span className="text-xs text-[#78716c]">A4 Print Proportions</span>
              <button
                type="button"
                onClick={() => onNavigate('papers')}
                className="cursor-pointer text-xs font-semibold text-[#18181b] hover:text-[#856514] inline-flex items-center gap-1"
              >
                <span>Explore Papers</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 3 */}
          <div className="md:col-span-5 rounded-2xl border border-[#e5dfd2] bg-white p-6 sm:p-7 flex flex-col justify-between gap-5">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#faf3e0] text-[#856514] flex items-center justify-center">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-[#18181b]">
                Margin Guides &amp; Sketch Canvas
              </h3>
              <p className="text-sm leading-relaxed text-[#57534e]">
                Toggle faint preview-only Margin Guides to align headings and hand-drawn or uploaded diagrams cleanly before exporting.
              </p>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-[#ece7dc]">
              <span className="text-xs text-[#78716c]">Guides never print in PDF</span>
              <button
                type="button"
                onClick={() => onNavigate('editor')}
                className="cursor-pointer text-xs font-semibold text-[#18181b] hover:text-[#856514] inline-flex items-center gap-1"
              >
                <span>Explore Editor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 4 */}
          <div className="md:col-span-7 rounded-2xl border border-[#e5dfd2] bg-white p-6 sm:p-7 flex flex-col justify-between gap-5">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#faf3e0] text-[#856514] flex items-center justify-center">
                <Download className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-[#18181b]">
                Super Fast Multi-Page Split &amp; PDF Export
              </h3>
              <p className="text-sm leading-relaxed max-w-xl text-[#57534e]">
                Paste long essays or import .txt / .md files. Automatic pagination splits content cleanly across sheets, exporting watermark-free PDFs locally in seconds.
              </p>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-[#ece7dc]">
              <span className="text-xs text-[#78716c]">Multi-page PDF &amp; 2.5× PNG</span>
              <button
                type="button"
                onClick={() => onNavigate('tools')}
                className="cursor-pointer text-xs font-semibold text-[#18181b] hover:text-[#856514] inline-flex items-center gap-1"
              >
                <span>Explore Tools</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 5. STUDENT REVIEWS                                                    */}
      {/* ===================================================================== */}
      <StudentTestimonials theme="light" onOpenCoffeeModal={onOpenBuyCoffee} />

      {/* ===================================================================== */}
      {/* 6. 100% FREE + OPTIONAL COFFEE TIP FOR HAPPY USERS                    */}
      {/* ===================================================================== */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="rounded-2xl border border-[#e5dfd2] bg-white p-8 sm:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#856514]">
              <Zap className="w-3.5 h-3.5" />
              <span>Always 100% Free · Zero Paywalls</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#18181b]">
              Happy with the smooth, super-fast results?
            </h2>
            <p className="text-sm sm:text-base text-[#57534e] leading-relaxed">
              Every tool on Human Handwriting AI is completely free with unlimited pages and zero watermarks. If my work saved you hours tonight, you’re welcome to buy me a coffee via UPI (India) or Bitcoin fast approvals!
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('editor')}
              className="cursor-pointer min-h-[46px] px-6 py-3 rounded-xl bg-[#18181b] hover:bg-[#27272a] text-[#faf7f0] text-sm font-semibold inline-flex items-center gap-2 transition-colors"
            >
              <span>Start Creating Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onOpenBuyCoffee}
              className="cursor-pointer min-h-[46px] px-5 py-3 rounded-xl border border-[#e6d5a3] bg-[#fbf5e3] hover:bg-[#f6ebd0] text-[#6b4f0b] text-sm font-semibold inline-flex items-center gap-2 transition-colors"
            >
              <Heart className="w-4 h-4 text-[#a68426] fill-current" />
              <span>Tip / Buy Plenty a Coffee</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
