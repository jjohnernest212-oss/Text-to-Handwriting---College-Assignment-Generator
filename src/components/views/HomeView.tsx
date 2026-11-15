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
  ShieldCheck,
} from 'lucide-react';
import { AppPage, PaperType } from '../../types';
import { getPaperBackgroundStyle } from '../../utils/paperStyles';
import MiniPaperSample from '../MiniPaperSample';
import StudentTestimonials from '../StudentTestimonials';
import AdBannerSlot from '../AdBannerSlot';

interface HomeViewProps {
  onNavigate: (page: AppPage) => void;
  onStartWithSetup: (text: string, fontId: string, paperType: PaperType, inkColor: string) => void;
  onOpenBuyCoffee: () => void;
}

const STUDIO_SAMPLES = [
  {
    id: 'physics',
    label: 'Physics Notes',
    text: `Newton's Second Law\nF = m × a\n\nNet force on an object equals its mass multiplied by acceleration.\nAlways verify SI units (N = kg·m/s²) before submitting.`,
  },
  {
    id: 'letter',
    label: 'Study Letter',
    text: `Dear Study Partner,\n\nHere are the cleaned summary notes from chapter four along with the reading checklist for Friday.\n\nWarm regards,\nAlex`,
  },
  {
    id: 'cs',
    label: 'Algorithm Lab',
    text: `Binary Search Summary\n1. Compare target with middle element.\n2. Narrow active interval by half.\n3. Time Complexity: O(log n).`,
  },
];

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
  const [activeSampleId, setActiveSampleId] = useState('physics');
  const [heroText, setHeroText] = useState(STUDIO_SAMPLES[0].text);
  const [heroFontId, setHeroFontId] = useState('kalam');
  const [heroPaper, setHeroPaper] = useState<PaperType>('ruled');
  const [heroInk, setHeroInk] = useState('#1E2430');
  const [heroGuides, setHeroGuides] = useState(false);

  const activeFont =
    HERO_STYLE_OPTIONS.find((f) => f.id === heroFontId) || HERO_STYLE_OPTIONS[0];
  const heroPaperBg = getPaperBackgroundStyle(heroPaper, 28, 18);
  const wordCount = heroText.trim() ? heroText.trim().split(/\s+/).length : 0;

  return (
    <div className="flex flex-col bg-transparent text-[#1E1B18]">
      {/* ===================================================================== */}
      {/* 1. STUDIO HERO + TWO-PANE LIVE INK WORKBENCH                          */}
      {/* ===================================================================== */}
      <section className="border-b border-[#DDD2BC] bg-gradient-to-b from-[#FAF4E8]/70 via-[#F5EEE0]/30 to-[#FAF4E8]/75">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-14 sm:pt-12 sm:pb-18">
          {/* Unboxed Studio Intro Line */}
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-[#5C5347] mb-7 sm:mb-9">
            <span className="font-semibold text-[#9A4319]">Human Handwriting AI</span>
            <span aria-hidden="true" className="text-[#A89B87]">·</span>
            <span>Digital Penmanship Studio</span>
            <span aria-hidden="true" className="text-[#A89B87]">·</span>
            <span>19 Scripts &amp; 23 Paper Rulings</span>
            <span aria-hidden="true" className="text-[#A89B87]">·</span>
            <span>100% Free &amp; Browser-Private</span>
          </div>

          {/* Balanced Architectural 2-Column Hero */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            {/* Left Copy Column */}
            <div className="lg:col-span-5 flex flex-col justify-center space-y-5">
              <h1
                className="font-extrabold tracking-tight text-[#1E1B18] leading-[1.06] text-balance"
                style={{ fontSize: 'clamp(2.25rem, 3.8vw, 3.35rem)' }}
              >
                Write Typed Notes in{' '}
                <span
                  className="text-[#9A4319] font-normal italic px-0.5"
                  style={{ fontFamily: "'Caveat', cursive", fontSize: '1.16em' }}
                >
                  Authentic Ink
                </span>{' '}
                on Digital Paper
              </h1>

              <p className="text-base leading-relaxed text-[#4A433A] max-w-lg">
                Draft study sheets, lab summaries, letters, and structured assignments directly in your browser. Adjust ink flow, notebook ruling, and alignment guides with instant PDF export.
              </p>

              {/* Primary + Secondary Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() =>
                    onStartWithSetup(heroText, heroFontId, heroPaper, heroInk)
                  }
                  className="cursor-pointer min-h-[48px] px-6 py-3 rounded-xl bg-[#24201C] hover:bg-[#38322C] text-[#FFFDF8] text-sm font-bold inline-flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] whitespace-nowrap"
                >
                  <span>Open Full Studio</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('features')}
                  className="cursor-pointer min-h-[48px] px-5 py-3 rounded-xl border border-[#D7CCB5] bg-[#FFFDF8]/92 hover:bg-[#FAF4E8] text-[#1E1B18] text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                >
                  <span>Explore Capabilities</span>
                </button>
              </div>

              {/* Clean Trust & Support Row */}
              <div className="pt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-[#5C5347]">
                <span className="inline-flex items-center gap-1 text-[#1E1B18] font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#9A4319]" />
                  <span>Runs offline-safe in your browser</span>
                </span>
                <span aria-hidden="true">·</span>
                <button
                  type="button"
                  onClick={onOpenBuyCoffee}
                  className="cursor-pointer font-semibold text-[#9A4319] hover:underline inline-flex items-center gap-1"
                >
                  <Coffee className="w-3.5 h-3.5" />
                  <span>Tip Plenty a Coffee</span>
                </button>
              </div>
            </div>

            {/* Right Column: Original Two-Pane Live Ink Workbench */}
            <div className="lg:col-span-7 flex flex-col rounded-2xl border border-[#DDD2BC] bg-[#FFFDF8]/94 shadow-xl overflow-hidden">
              {/* Studio Frame Top Toolbar */}
              <div className="px-4 py-2.5 border-b border-[#EAE0CD] bg-[#FAF4E8] flex flex-wrap items-center justify-between gap-2">
                {/* Sample Preset Switchers */}
                <div className="flex items-center gap-1 flex-wrap">
                  {STUDIO_SAMPLES.map((sample) => {
                    const isActive = activeSampleId === sample.id;
                    return (
                      <button
                        key={sample.id}
                        type="button"
                        onClick={() => {
                          setActiveSampleId(sample.id);
                          setHeroText(sample.text);
                        }}
                        className={`cursor-pointer px-2.5 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                          isActive
                            ? 'bg-[#24201C] text-[#FFFDF8] font-semibold'
                            : 'text-[#5C5347] hover:bg-[#EFE5D3] hover:text-[#1E1B18]'
                        }`}
                      >
                        {sample.label}
                      </button>
                    );
                  })}
                </div>

                {/* Live Margin Guides Toggle & Paper Select */}
                <div className="flex items-center gap-2">
                  <select
                    aria-label="Preview notebook paper style"
                    value={heroPaper}
                    onChange={(e) => setHeroPaper(e.target.value as PaperType)}
                    className="px-2.5 py-1 rounded-lg border border-[#D7CCB5] bg-[#FFFDF8] text-xs font-medium text-[#1E1B18] cursor-pointer"
                  >
                    {HERO_PAPER_OPTIONS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.label}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => setHeroGuides((prev) => !prev)}
                    aria-pressed={heroGuides}
                    title="Preview alignment Margin Guides"
                    className={`cursor-pointer px-2.5 py-1 rounded-lg border text-xs font-semibold inline-flex items-center gap-1 transition-colors whitespace-nowrap ${
                      heroGuides
                        ? 'bg-[#9A4319] text-[#FFFDF8] border-[#823612]'
                        : 'bg-[#FFFDF8] border-[#D7CCB5] text-[#4A433A] hover:bg-[#EFE5D3]'
                    }`}
                  >
                    <Ruler className="w-3 h-3" />
                    <span>Guides</span>
                  </button>
                </div>
              </div>

              {/* Dual-Pane Live Input -> Handwritten Sheet Body */}
              <div className="grid grid-cols-1 sm:grid-cols-12 flex-1 min-h-[290px]">
                {/* Left Input Pane */}
                <div className="sm:col-span-5 border-b sm:border-b-0 sm:border-r border-[#EAE0CD] bg-[#FAF4E8] p-4 flex flex-col justify-between gap-3">
                  <div className="flex items-center justify-between text-[11px] font-medium text-[#6E655A]">
                    <span>Plain Text Draft</span>
                    <span className="tabular-nums">{wordCount} words</span>
                  </div>
                  <textarea
                    aria-label="Edit typed draft for live handwriting preview"
                    value={heroText}
                    onChange={(e) => {
                      setActiveSampleId('custom');
                      setHeroText(e.target.value);
                    }}
                    rows={8}
                    className="w-full flex-1 bg-[#FFFDF8] border border-[#D7CCB5] rounded-xl p-3 text-xs leading-relaxed text-[#1E1B18] placeholder:text-[#9A8F80] resize-none focus:outline-hidden focus:border-[#9A4319]"
                    placeholder="Type anything here to preview..."
                    spellCheck={false}
                  />
                  <div className="flex items-center justify-between text-[11px] text-[#6E655A]">
                    <span>Updates live</span>
                    <button
                      type="button"
                      onClick={() =>
                        onStartWithSetup(heroText, heroFontId, heroPaper, heroInk)
                      }
                      className="cursor-pointer font-semibold text-[#9A4319] hover:text-[#783211] hover:underline"
                    >
                      Customize in Editor →
                    </button>
                  </div>
                </div>

                {/* Right Live Notebook Output Pane (Realistic paper stays authentic) */}
                <div
                  className="sm:col-span-7 relative overflow-hidden p-0 min-h-[260px]"
                  style={heroPaperBg}
                >
                  {heroPaper !== 'plain' && (
                    <div
                      aria-hidden="true"
                      className="absolute top-0 bottom-0 left-[38px] w-[1.5px] bg-[#ef4444]/65 pointer-events-none"
                    />
                  )}

                  {heroGuides && (
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-3.5 border border-dashed border-[#9A4319]/60 rounded-sm z-20"
                    >
                      <span className="absolute -top-2.5 left-2 px-1.5 py-0.5 text-[10px] font-mono-code bg-[#FFFDF8]/95 text-[#9A4319] border border-[#E2C2A8] rounded">
                        Margin Guides · Preview Only
                      </span>
                    </div>
                  )}

                  <div
                    className="relative z-10 whitespace-pre-wrap break-words pr-5 pb-6 select-text"
                    style={{
                      paddingTop: '18px',
                      paddingLeft: heroPaper !== 'plain' ? '50px' : '24px',
                      fontFamily: activeFont.fontFamily,
                      fontSize: heroFontId === 'caveat' ? '21px' : '17px',
                      lineHeight: '28px',
                      color: heroInk,
                    }}
                  >
                    {heroText || 'Start typing in the draft box to preview your handwritten sheet...'}
                  </div>
                </div>
              </div>

              {/* Studio Frame Bottom Quick Style & Ink Bar */}
              <div className="px-4 py-2.5 border-t border-[#EAE0CD] bg-[#FAF4E8] flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {HERO_STYLE_OPTIONS.map((style) => {
                    const active = heroFontId === style.id;
                    return (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => setHeroFontId(style.id)}
                        className={`cursor-pointer px-2.5 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                          active
                            ? 'bg-[#24201C] text-[#FFFDF8] font-semibold'
                            : 'bg-[#FFFDF8] border border-[#D7CCB5] hover:bg-[#EFE5D3] text-[#4A433A]'
                        }`}
                      >
                        {style.label}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-1.5 ml-auto">
                  <span className="text-[11px] text-[#6E655A] mr-1">Ink:</span>
                  {[
                    { label: 'Espresso Charcoal Ink', hex: '#1E2430' },
                    { label: 'Burnt Sienna Ink', hex: '#8F3D15' },
                    { label: 'Classic Fountain Ink', hex: '#1B4965' },
                  ].map((c) => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => setHeroInk(c.hex)}
                      aria-label={c.label}
                      title={c.label}
                      className={`cursor-pointer w-5 h-5 rounded-full border-2 transition-transform ${
                        heroInk === c.hex
                          ? 'border-[#9A4319] scale-115'
                          : 'border-[#C4B7A3]'
                      }`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 4-Column Platform Guarantees Strip */}
          <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: 'Zero Server Uploads',
                desc: 'Your notes, uploaded files, and custom fonts stay strictly in browser memory.',
              },
              {
                title: 'Instant Browser Export',
                desc: 'Generate clean A4 PDFs and sharp 2.5× PNG pages locally with zero queues.',
              },
              {
                title: '19 Scripts + Custom TTF',
                desc: 'Choose built-in SIL-licensed handwriting fonts or upload your own .ttf / .otf file.',
              },
              {
                title: '23 Original Paper Rulings',
                desc: 'Procedural CSS notebooks including school ruled, Cornell, Séyès, quad & cream.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-4 sm:p-5 rounded-xl border border-[#DDD2BC] bg-[#FFFDF8]/92 shadow-2xs"
              >
                <div className="text-sm font-bold text-[#1E1B18]">{item.title}</div>
                <p className="text-xs mt-1 leading-relaxed text-[#4A433A]">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 2. HOW IT WORKS (3 CLEAR STEPS)                                       */}
      {/* ===================================================================== */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="max-w-2xl mb-10 sm:mb-12">
          <div className="text-xs font-semibold text-[#9A4319] uppercase tracking-wider mb-2">
            Workflow Overview
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-balance text-[#1E1B18]">
            Prepare, style, and print neat handwritten notebooks in three steps.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: '01.',
              title: 'Prepare or import your draft',
              desc: 'Write in the editor, paste study notes, pick an academic template, or load a .txt / .md text file.',
              preview: (
                <div className="p-3.5 rounded-xl border border-[#DDD2BC] bg-[#FAF4E8] text-xs font-mono-code space-y-1.5 text-[#4A433A]">
                  <div className="font-semibold text-[#9A4319]">
                    chapter_04_summary.md
                  </div>
                  <div>1. Conservation of Momentum</div>
                  <div className="opacity-80">p_initial = p_final (closed system)</div>
                </div>
              ),
            },
            {
              step: '02.',
              title: 'Dial in pen style, ink & guides',
              desc: 'Select from 19 handwriting scripts, adjust line height and ink density, and toggle Margin Guides to inspect layout.',
              preview: (
                <div className="grid grid-cols-2 gap-2">
                  <MiniPaperSample
                    paperType="ruled"
                    fontFamily="'Kalam', cursive"
                    inkColor="#1E2430"
                    text="Neat Ink Script"
                    fontSize={13}
                    lineHeight={20}
                    className="min-h-[82px]"
                  />
                  <MiniPaperSample
                    paperType="aesthetic-cream"
                    fontFamily="'Homemade Apple', cursive"
                    inkColor="#8F3D15"
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
              title: 'Paginate & export A4 documents',
              desc: 'Split long drafts cleanly across multiple sheets and download print-calibrated PDF or 2.5× PNG pages.',
              preview: (
                <div className="p-3.5 rounded-xl border border-[#DDD2BC] bg-[#FAF4E8] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-[#24201C] text-[#FFFDF8] flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold truncate text-[#1E1B18]">
                        Study_Notebook_A4.pdf
                      </div>
                      <div className="text-[11px] tabular-nums text-[#6E655A]">
                        210 × 297 mm · High DPI
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
              className="rounded-2xl border border-[#DDD2BC] bg-[#FFFDF8]/92 p-6 flex flex-col justify-between gap-5 shadow-2xs"
            >
              <div className="space-y-2.5">
                <span className="text-sm font-bold text-[#9A4319] tabular-nums">
                  {item.step}
                </span>
                <h3 className="text-lg font-bold tracking-tight text-[#1E1B18]">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-[#4A433A]">
                  {item.desc}
                </p>
              </div>
              {item.preview}
            </div>
          ))}
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 3. TYPED DRAFT VS HANDWRITTEN COMPARISON                              */}
      {/* ===================================================================== */}
      <section className="border-y border-[#DDD2BC] bg-[#FAF4E8]/88 py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <div className="text-xs font-semibold text-[#9A4319] uppercase tracking-wider mb-2">
              Visual Output
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-balance text-[#1E1B18]">
              From plain monospace drafts to aligned notebook pages.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            <div className="rounded-2xl border border-[#DDD2BC] bg-[#FFFDF8] p-6 flex flex-col justify-between gap-4 shadow-2xs">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-[#1E1B18]">Input — Raw Study Outline</span>
                <span className="text-[#6E655A]">Plain text editor</span>
              </div>
              <pre className="flex-1 p-4 rounded-xl border border-[#DDD2BC] bg-[#FAF4E8] text-xs sm:text-sm font-mono-code whitespace-pre-wrap leading-relaxed text-[#4A433A]">
{`LAB REPORT: DATA STRUCTURES

Topic: Binary Search Tree Traversal
1. Inorder (Left -> Root -> Right)
   Always yields elements in sorted ascending order.

2. Time Complexity:
   Average search: O(log n)
   Balanced trees prevent O(n) skew.`}
              </pre>
            </div>

            <div className="rounded-2xl border border-[#DDD2BC] bg-[#FFFDF8] p-6 flex flex-col justify-between gap-4 shadow-2xs">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-[#9A4319]">
                  Rendered Sheet — College Ruled Paper
                </span>
                <span className="text-[#6E655A]">Kalam · Charcoal Ink</span>
              </div>
              <MiniPaperSample
                paperType="college-ruled"
                fontFamily="'Kalam', cursive"
                inkColor="#1E2430"
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
            <div className="text-xs font-semibold text-[#9A4319] uppercase tracking-wider mb-2">
              Studio Capabilities
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-balance text-[#1E1B18]">
              Built-in tools for notebooks, diagrams, and multi-page printouts.
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('features')}
            className="cursor-pointer text-sm font-semibold text-[#9A4319] hover:text-[#783211] inline-flex items-center gap-1 shrink-0"
          >
            <span>View full specification</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Card 1 */}
          <div className="md:col-span-7 rounded-2xl border border-[#DDD2BC] bg-[#FFFDF8]/94 p-6 sm:p-7 flex flex-col justify-between gap-5 shadow-2xs">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#F6EBE0] border border-[#E2C2A8] text-[#9A4319] flex items-center justify-center">
                <PenTool className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-[#1E1B18]">
                19 Penmanship Scripts + Personal Font Upload
              </h3>
              <p className="text-sm leading-relaxed max-w-xl text-[#4A433A]">
                Switch between neat study print, flowing cursive scripts, casual notes, or import your own .ttf / .otf handwriting font file with natural baseline variation.
              </p>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-[#EAE0CD]">
              <span className="text-xs text-[#6E655A]">Neat · Cursive · Casual · Rapid</span>
              <button
                type="button"
                onClick={() => onNavigate('styles')}
                className="cursor-pointer text-xs font-semibold text-[#9A4319] hover:underline inline-flex items-center gap-1"
              >
                <span>Browse Styles</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2 */}
          <div className="md:col-span-5 rounded-2xl border border-[#DDD2BC] bg-[#FFFDF8]/94 p-6 sm:p-7 flex flex-col justify-between gap-5 shadow-2xs">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#F6EBE0] border border-[#E2C2A8] text-[#9A4319] flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-[#1E1B18]">
                23 Custom Notebook Rulings
              </h3>
              <p className="text-sm leading-relaxed text-[#4A433A]">
                Original CSS/SVG notebook textures including school ruled, Cornell, French Séyès, 5mm dot grid, parchment, spiral rings, and clean white A4.
              </p>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-[#EAE0CD]">
              <span className="text-xs text-[#6E655A]">Calibrated A4 Proportions</span>
              <button
                type="button"
                onClick={() => onNavigate('papers')}
                className="cursor-pointer text-xs font-semibold text-[#9A4319] hover:underline inline-flex items-center gap-1"
              >
                <span>Browse Papers</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 3 */}
          <div className="md:col-span-5 rounded-2xl border border-[#DDD2BC] bg-[#FFFDF8]/94 p-6 sm:p-7 flex flex-col justify-between gap-5 shadow-2xs">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#F6EBE0] border border-[#E2C2A8] text-[#9A4319] flex items-center justify-center">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-[#1E1B18]">
                Preview Margin Guides &amp; Sketches
              </h3>
              <p className="text-sm leading-relaxed text-[#4A433A]">
                Toggle faint preview-only Margin Guides to align titles, margin rules, and hand-drawn or uploaded diagrams cleanly before printing.
              </p>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-[#EAE0CD]">
              <span className="text-xs text-[#6E655A]">Guides omitted from exported PDF</span>
              <button
                type="button"
                onClick={() => onNavigate('editor')}
                className="cursor-pointer text-xs font-semibold text-[#9A4319] hover:underline inline-flex items-center gap-1"
              >
                <span>Open Editor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 4 */}
          <div className="md:col-span-7 rounded-2xl border border-[#DDD2BC] bg-[#FFFDF8]/94 p-6 sm:p-7 flex flex-col justify-between gap-5 shadow-2xs">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#F6EBE0] border border-[#E2C2A8] text-[#9A4319] flex items-center justify-center">
                <Download className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-[#1E1B18]">
                Automatic Multi-Page Split &amp; Local Export
              </h3>
              <p className="text-sm leading-relaxed max-w-xl text-[#4A433A]">
                Paste multi-page essays or load .txt / .md notes. Smart pagination flows paragraphs neatly across A4 pages with local auto-save and instant PDF download.
              </p>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-[#EAE0CD]">
              <span className="text-xs text-[#6E655A]">Multi-page PDF &amp; 2.5× PNG</span>
              <button
                type="button"
                onClick={() => onNavigate('tools')}
                className="cursor-pointer text-xs font-semibold text-[#9A4319] hover:underline inline-flex items-center gap-1"
              >
                <span>View Workflows</span>
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

      {/* Clean Sponsored Horizontal Strip */}
      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-10">
        <AdBannerSlot
          variant="horizontal"
          slotId="adsterra-home-horizontal-slot"
          onOpenBuyCoffee={onOpenBuyCoffee}
        />
      </div>

      {/* ===================================================================== */}
      {/* 6. 100% FREE + OPTIONAL COFFEE TIP                                    */}
      {/* ===================================================================== */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="rounded-2xl border border-[#DDD2BC] bg-[#FFFDF8]/94 p-8 sm:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 shadow-sm">
          <div className="space-y-2.5 max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#9A4319]">
              Free Utility · Voluntary Support
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1E1B18]">
              Enjoying the smooth workflow and fast exports?
            </h2>
            <p className="text-sm sm:text-base text-[#4A433A] leading-relaxed">
              Human Handwriting AI is 100% free with unlimited pages and no subscriptions. If this tool saved you hours tonight, you can optionally tip Plenty a coffee via UPI (India) or Bitcoin.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('editor')}
              className="cursor-pointer min-h-[46px] px-6 py-3 rounded-xl bg-[#24201C] hover:bg-[#38322C] text-[#FFFDF8] text-sm font-bold inline-flex items-center gap-2 transition-colors"
            >
              <span>Start Creating Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onOpenBuyCoffee}
              className="cursor-pointer min-h-[46px] px-5 py-3 rounded-xl border border-[#E2C2A8] bg-[#F6EBE0] hover:bg-[#EDD9C5] text-[#8F3D15] text-sm font-semibold inline-flex items-center gap-2 transition-colors"
            >
              <Heart className="w-4 h-4 text-[#9A4319] fill-current" />
              <span>Tip / Buy Plenty a Coffee</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
