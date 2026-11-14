import React, { useState, useMemo } from 'react';
import {
  Search,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  FileText,
  ArrowRight,
  Heart,
} from 'lucide-react';
import { AppPage } from '../../types';
import { GENERAL_FAQS } from '../../data/platformContent';

interface FaqViewProps {
  theme: 'dark' | 'light';
  onNavigate: (page: AppPage) => void;
  onOpenPolicy: (type: 'privacy' | 'terms') => void;
  onOpenBuyCoffee: () => void;
}

export default function FaqView({
  theme,
  onNavigate,
  onOpenPolicy,
  onOpenBuyCoffee,
}: FaqViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const isLight = theme === 'light';
  const surfaceClass = isLight
    ? 'bg-white border-slate-200 text-slate-900'
    : 'bg-[#13141a] border-white/10 text-zinc-100';
  const mutedText = isLight ? 'text-slate-600' : 'text-zinc-400';

  const filteredFaqs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return GENERAL_FAQS;
    return GENERAL_FAQS.filter(
      (item) =>
        item.q.toLowerCase().includes(q) ||
        item.a.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
          FAQ &amp; Help Center
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance">
          Answers on fonts, papers, privacy, and PDF export.
        </h1>
        <p className={`text-base leading-relaxed ${mutedText}`}>
          Everything you need to get started creating handwritten notes, study sheets, and print-ready documents.
        </p>
      </div>

      {/* Quick Search */}
      <div className="relative">
        <Search className="w-4 h-4 opacity-50 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search questions (e.g. privacy, custom font, PDF, margin guides)..."
          className={`w-full min-h-[46px] pl-10 pr-4 rounded-xl border text-sm transition-colors ${
            isLight
              ? 'bg-white border-slate-200 text-slate-900 focus:border-indigo-500'
              : 'bg-[#13141a] border-white/10 text-white focus:border-indigo-500'
          } focus:outline-hidden`}
        />
      </div>

      {/* Interactive FAQ Accordion */}
      <section className={`rounded-2xl border divide-y divide-inherit ${surfaceClass}`}>
        {filteredFaqs.length === 0 ? (
          <div className="p-8 text-center text-sm opacity-75">
            No matching questions found. Try clearing your search term.
          </div>
        ) : (
          filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={faq.q} className="px-6 py-5">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="cursor-pointer w-full flex items-start justify-between gap-4 text-left"
                >
                  <div className="space-y-1">
                    <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                      {faq.category}
                    </div>
                    <h2 className="text-base font-bold">{faq.q}</h2>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 opacity-60 shrink-0 mt-1" />
                  ) : (
                    <ChevronDown className="w-4 h-4 opacity-60 shrink-0 mt-1" />
                  )}
                </button>
                {isOpen && (
                  <p className={`mt-3 text-sm leading-relaxed ${mutedText}`}>
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })
        )}
      </section>

      {/* Quick Start 3-Step Guide */}
      <section className={`rounded-2xl border p-6 sm:p-8 space-y-5 ${surfaceClass}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-xl font-bold tracking-tight">
            Quick 3-Step Onboarding Guide
          </h2>
          <button
            type="button"
            onClick={() => onNavigate('editor')}
            className="cursor-pointer min-h-[40px] px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors self-start"
          >
            <span>Open Editor</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div
            className={`p-4 rounded-xl border space-y-1.5 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0e0f14] border-white/10'
            }`}
          >
            <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
              1. Add your content
            </div>
            <p className={`text-xs leading-relaxed ${mutedText}`}>
              Type directly, paste from your clipboard, or click File to upload a .txt or .md document. Long text prompts an instant Auto-Split.
            </p>
          </div>
          <div
            className={`p-4 rounded-xl border space-y-1.5 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0e0f14] border-white/10'
            }`}
          >
            <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
              2. Style &amp; check margins
            </div>
            <p className={`text-xs leading-relaxed ${mutedText}`}>
              Select any handwriting font and notebook sheet. Enable Show Margin Guides to verify alignment or expand Advanced settings for jitter and sketches.
            </p>
          </div>
          <div
            className={`p-4 rounded-xl border space-y-1.5 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0e0f14] border-white/10'
            }`}
          >
            <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
              3. Generate &amp; export
            </div>
            <p className={`text-xs leading-relaxed ${mutedText}`}>
              Click Generate Handwriting to refresh the preview, then download all pages as one clean A4 PDF or save individual PNG images.
            </p>
          </div>
        </div>
      </section>

      {/* Privacy, Policies & Creator Support */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`rounded-2xl border p-6 space-y-4 ${surfaceClass}`}>
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>100% Client-Side Privacy</span>
          </div>
          <h3 className="text-lg font-bold">Your documents stay on your device</h3>
          <p className={`text-xs leading-relaxed ${mutedText}`}>
            No typed assignment, uploaded .txt file, custom .ttf font, or sketch is ever transmitted to a backend server. All rendering happens in browser Canvas memory.
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => onOpenPolicy('privacy')}
              className={`cursor-pointer min-h-[38px] px-3.5 rounded-xl border text-xs font-semibold inline-flex items-center gap-1.5 transition-colors ${
                isLight
                  ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-zinc-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Read Privacy Policy</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenPolicy('terms')}
              className={`cursor-pointer min-h-[38px] px-3.5 rounded-xl border text-xs font-semibold inline-flex items-center gap-1.5 transition-colors ${
                isLight
                  ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-zinc-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-indigo-500" />
              <span>Terms of Service</span>
            </button>
          </div>
        </div>

        <div className={`rounded-2xl border p-6 space-y-4 ${surfaceClass}`}>
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Community &amp; Support
          </div>
          <h3 className="text-lg font-bold">Maintained openly by Plenty</h3>
          <p className={`text-xs leading-relaxed ${mutedText}`}>
            Follow development progress on GitHub or support hosting and updates with a voluntary PhonePe UPI or Bitcoin tip.
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <a
              href="https://github.com/plenty"
              target="_blank"
              rel="noopener noreferrer"
              className={`min-h-[38px] px-4 rounded-xl border text-xs font-semibold inline-flex items-center gap-1.5 transition-colors ${
                isLight
                  ? 'bg-slate-900 hover:bg-slate-800 border-slate-900 text-white'
                  : 'bg-white/10 hover:bg-white/15 border-white/15 text-white'
              }`}
            >
              <span>GitHub (@plenty) ↗</span>
            </a>
            <button
              type="button"
              onClick={onOpenBuyCoffee}
              className={`cursor-pointer min-h-[38px] px-3.5 rounded-xl border text-xs font-semibold inline-flex items-center gap-1.5 transition-colors ${
                isLight
                  ? 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-900'
                  : 'bg-amber-500/15 hover:bg-amber-500/25 border-amber-400/25 text-amber-200'
              }`}
            >
              <Heart className="w-3.5 h-3.5 text-amber-500 fill-current" />
              <span>Tip Plenty (UPI / BTC)</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
