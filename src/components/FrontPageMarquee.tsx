import React, { useState } from 'react';
import {
  Zap,
  HelpCircle,
  Users,
  ChevronDown,
  Sparkles,
  ChevronUp,
} from 'lucide-react';
import { CONTRIBUTORS } from './ContributorsModal';

interface FrontPageMarqueeProps {
  onOpenContributors: () => void;
  onOpenHowItWorks: () => void;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'detection' | 'origin' | 'fonts' | 'export' | 'submission';
}

export const FAQS_LIST: FaqItem[] = [
  {
    id: 'professor-notice',
    question: 'Will my college professor notice it was generated online?',
    answer:
      'No! The Scribe Engine uses line-height synchronized CSS rules so handwritten letters sit precisely on ruled paper lines. Combined with randomized human micro-jitter, authentic ink bleeding, and realistic smudge overlays, it prints and scans with 100% natural pen-on-paper physics.',
    category: 'detection',
  },
  {
    id: 'why-built',
    question: 'Why was Text-to-Handwriting created?',
    answer:
      'I built this tool because I absolutely hated wasting 3 to 4 painful hours every single weekend writing tedious college homework assignments by hand. Professors demanded handwritten submissions just to stop digital copy-pasting, so I engineered an automated web tool that writes assignments for me forever.',
    category: 'origin',
  },
  {
    id: 'custom-handwriting',
    question: 'Can I upload and use my own personal handwriting font?',
    answer:
      'Yes! You can drop any .ttf, .otf, or .woff handwriting font file directly into the editor or upload it in the Style System tab. It loads instantaneously in live preview and rasterizes into high-res multi-page PDF exports.',
    category: 'fonts',
  },
  {
    id: 'multi-page-free',
    question: 'Is multi-page PDF generation unlimited and free?',
    answer:
      'Yes! You can write 1 page, 10 pages, or 50+ pages. Simply type "---page---" or click [+ Page Break] / [Auto-Split]. The export pipeline compiles high-resolution 300-DPI A4 sheets with zero watermarks.',
    category: 'export',
  },
  {
    id: 'diagrams-support',
    question: 'Can I draw diagrams, graphs, and circuit schematics?',
    answer:
      'Yes! Click Diagrams in the style panel to sketch physics, chemistry, or mathematics diagrams directly on our canvas or upload screenshot figures to reposition anywhere on the paper.',
    category: 'submission',
  },
  {
    id: 'classroom-submission',
    question: 'How do I submit on Google Classroom or college portals?',
    answer:
      'Click "Download PDF" (or use Mobile Scan on your phone). Save the multi-page PDF document to your device and upload it directly as your assignment attachment.',
    category: 'submission',
  },
  {
    id: 'font-slider',
    question: 'How do I adjust handwriting font size dynamically?',
    answer:
      'Use the real-time Font Size slider right above the text editor or in the floating quick-action pill (A- / A+) to watch your handwriting rescale live on the notebook lines.',
    category: 'fonts',
  },
];

export default function FrontPageMarquee({
  onOpenContributors,
  onOpenHowItWorks,
}: FrontPageMarqueeProps) {
  // Speed modes for contributors marquee: 'normal' (32s), 'turbo' (12s), 'paused'
  const [speedMode, setSpeedMode] = useState<'normal' | 'turbo' | 'paused'>('normal');

  // Drop-down FAQs state: set of open FAQ IDs
  const [openFaqIds, setOpenFaqIds] = useState<Set<string>>(new Set(['professor-notice']));
  const [isFaqsSectionOpen, setIsFaqsSectionOpen] = useState<boolean>(true);

  const durationSec =
    speedMode === 'turbo' ? '12s' : speedMode === 'normal' ? '32s' : '0s';

  const toggleLightning = () => {
    if (speedMode === 'normal') {
      setSpeedMode('turbo');
    } else if (speedMode === 'turbo') {
      setSpeedMode('paused');
    } else {
      setSpeedMode('normal');
    }
  };

  const toggleFaq = (id: string) => {
    setOpenFaqIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleAllFaqs = () => {
    if (openFaqIds.size === FAQS_LIST.length) {
      setOpenFaqIds(new Set());
    } else {
      setOpenFaqIds(new Set(FAQS_LIST.map((f) => f.id)));
    }
  };

  // Duplicate contributors for seamless infinite marquee loop
  const contributorsLoop = [...CONTRIBUTORS, ...CONTRIBUTORS];

  return (
    <div
      aria-label="Community contributors and student FAQs"
      className="bg-[#0e0e11] border-t border-[#27272a] select-none shrink-0 overflow-hidden relative"
      style={{ '--marquee-duration': durationSec } as React.CSSProperties}
    >
      {/* ========================================================
          ROW 1: CONTRIBUTORS MARQUEE (MOVING LEFT TO RIGHT)
          ======================================================== */}
      <div className="flex items-center border-b border-[#27272a]/70 h-11 relative overflow-hidden bg-[#121215]">
        {/* Fixed Left Header with Interactive Lightning Button */}
        <div className="z-10 bg-[#121215] border-r border-[#27272a] px-3 sm:px-4 h-full flex items-center gap-2 shrink-0 shadow-md">
          <button
            type="button"
            onClick={toggleLightning}
            className={`cursor-pointer px-2 py-1 rounded text-xs font-mono-code font-bold flex items-center gap-1 transition-all ${
              speedMode === 'turbo'
                ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/40 animate-pulse'
                : speedMode === 'paused'
                ? 'bg-zinc-800 text-zinc-400'
                : 'bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30'
            }`}
            title={`Lightning speed toggle: Current [${speedMode.toUpperCase()}]. Click to switch Normal / Turbo / Pause.`}
          >
            <Zap className={`w-3.5 h-3.5 ${speedMode === 'turbo' ? 'fill-black' : 'fill-amber-400 text-amber-400'}`} />
            <span className="hidden sm:inline">
              {speedMode === 'turbo' ? 'TURBO' : speedMode === 'paused' ? 'PAUSED' : 'SPEED'}
            </span>
          </button>

          <button
            type="button"
            onClick={onOpenContributors}
            className="cursor-pointer font-mono-code text-[10px] text-zinc-300 hover:text-white uppercase tracking-wider font-semibold flex items-center gap-1"
            title="Click to view all 3 GitHub Contributors"
          >
            <Users className="w-3 h-3 text-[#6366f1]" />
            <span className="hidden md:inline">CONTRIBUTORS</span>
            <span className="text-zinc-500 text-[9px]">(L→R)</span>
          </button>
        </div>

        {/* Marquee Track Moving from Left to Right */}
        <div className="overflow-hidden flex-1 relative flex items-center h-full">
          <div
            className={`animate-scroll-right flex items-center gap-3 py-1 px-3 ${
              speedMode === 'paused' ? 'style-paused' : ''
            }`}
            style={{ animationPlayState: speedMode === 'paused' ? 'paused' : 'running' }}
          >
            {contributorsLoop.map((c, i) => (
              <div
                key={`${c.id}-${i}`}
                onClick={onOpenContributors}
                className="cursor-pointer shrink-0 bg-[#18181b] hover:bg-[#222226] border border-[#27272a] hover:border-[#6366f1]/60 rounded-md py-1 px-2.5 flex items-center gap-2 transition-all shadow-xs group"
                title={`${c.name} (${c.role}) - Click for details`}
              >
                {/* Micro Avatar */}
                <div className="w-5 h-5 rounded bg-zinc-900 border border-zinc-700 flex items-center justify-center font-mono-code text-[9px] font-bold text-white shrink-0 overflow-hidden">
                  {c.id === 'plenty' ? (
                    <span className="text-orange-400">&lt;/&gt;</span>
                  ) : c.id === 'saurabh' ? (
                    <span className="text-blue-400">SD</span>
                  ) : (
                    <span className="text-emerald-400">RQ</span>
                  )}
                </div>

                <span className="font-syne text-[11px] font-bold text-white group-hover:text-[#a5b4fc] transition-colors truncate">
                  {c.name}
                </span>

                <span className="font-mono-code text-[10px] text-[#6366f1] font-semibold">
                  {c.handle}
                </span>

                <span className="text-[9px] font-mono-code text-zinc-500 hidden sm:inline">
                  · {c.commits} commits
                </span>

                <span className="bg-[#27272a] text-[#e4e4e7]/70 text-[8px] font-mono-code px-1.5 py-0.5 rounded uppercase">
                  {c.featuredBadge}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================
          ROW 2: STUDENT FAQS DROP DOWN BUTTONS (INSTEAD OF MOVING)
          ======================================================== */}
      <div className="bg-[#0c0c0e] border-t border-[#27272a]/80">
        {/* Drop Down Control Bar */}
        <div className="px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3 bg-[#111114] border-b border-[#27272a]/60">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
              <HelpCircle className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-syne text-xs sm:text-sm font-bold text-white uppercase tracking-tight flex items-center gap-2">
                <span>Student FAQs &amp; Help</span>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-mono-code px-1.5 py-0.2 rounded font-normal">
                  Drop-Down
                </span>
              </span>
              <p className="font-mono-code text-[10px] text-zinc-400 hidden sm:block">
                Click any question button to drop down the answer
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleAllFaqs}
              className="cursor-pointer text-[10px] font-mono-code text-zinc-400 hover:text-white bg-[#18181b] hover:bg-[#222226] border border-[#27272a] px-2.5 py-1 rounded transition-colors"
            >
              {openFaqIds.size === FAQS_LIST.length ? 'Collapse All' : 'Expand All'}
            </button>

            <button
              type="button"
              onClick={onOpenHowItWorks}
              className="cursor-pointer text-[10px] font-mono-code text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-2.5 py-1 rounded flex items-center gap-1 transition-colors hidden sm:flex"
              title="Read college origin story"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>College Story</span>
            </button>

            <button
              type="button"
              onClick={() => setIsFaqsSectionOpen(!isFaqsSectionOpen)}
              className="cursor-pointer p-1 rounded text-zinc-400 hover:text-white hover:bg-[#18181b] transition-colors"
              title={isFaqsSectionOpen ? 'Hide FAQs Section' : 'Show FAQs Section'}
            >
              {isFaqsSectionOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Drop Down FAQ Buttons Grid */}
        {isFaqsSectionOpen && (
          <div className="p-3 sm:p-4 grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto font-mono-code">
            {FAQS_LIST.map((faq) => {
              const isOpen = openFaqIds.has(faq.id);

              return (
                <div
                  key={faq.id}
                  className={`border rounded-lg transition-all overflow-hidden ${
                    isOpen
                      ? 'bg-[#141418] border-emerald-500/50 shadow-md ring-1 ring-emerald-500/20'
                      : 'bg-[#121214] border-[#27272a] hover:border-zinc-700'
                  }`}
                >
                  {/* Drop Down Trigger Button */}
                  <button
                    type="button"
                    onClick={() => toggleFaq(faq.id)}
                    className="cursor-pointer w-full text-left p-2.5 flex items-center justify-between gap-2.5 transition-colors group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`text-xs font-bold shrink-0 ${isOpen ? 'text-emerald-400' : 'text-zinc-500 group-hover:text-emerald-400'}`}>
                        Q:
                      </span>
                      <span className={`text-[11px] font-semibold tracking-tight truncate ${isOpen ? 'text-white' : 'text-zinc-300 group-hover:text-white'}`}>
                        {faq.question}
                      </span>
                    </div>

                    <div className={`p-1 rounded shrink-0 transition-transform ${isOpen ? 'rotate-180 text-emerald-400 bg-emerald-950/40' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </div>
                  </button>

                  {/* Dropped Down Answer Content */}
                  {isOpen && (
                    <div className="px-3 pb-3 pt-1 border-t border-[#27272a]/60 bg-[#0c0c0e] animate-in slide-in-from-top-1 duration-150">
                      <p className="font-sans text-[11px] sm:text-xs text-[#e4e4e7]/85 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
