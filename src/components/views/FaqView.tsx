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
  onOpenPolicy: (type: 'privacy' | 'terms' | 'copyright' | 'contact') => void;
  onOpenBuyCoffee: () => void;
}

export default function FaqView({
  onNavigate,
  onOpenPolicy,
  onOpenBuyCoffee,
}: FaqViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

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
    <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12 text-[#1E1B18]">
      <div className="max-w-3xl space-y-4">
        <div className="text-xs font-semibold text-[#9A4319] uppercase tracking-wider">
          FAQ &amp; Help Center
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance text-[#1E1B18]">
          Answers on fonts, papers, privacy, and PDF export.
        </h1>
        <p className="text-base leading-relaxed text-[#4A433A]">
          Everything you need to get started creating handwritten notes, study sheets, and print-ready documents.
        </p>
      </div>

      {/* Quick Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#6E655A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search questions (e.g. privacy, custom font, PDF, margin guides)..."
          className="w-full min-h-[46px] pl-10 pr-4 rounded-xl border border-[#D7CCB5] bg-[#FFFDF8] text-sm text-[#1E1B18] placeholder:text-[#8C7F6E] focus:border-[#9A4319] focus:outline-hidden shadow-2xs"
        />
      </div>

      {/* Interactive FAQ Accordion */}
      <section className="rounded-2xl border border-[#DDD2BC] bg-[#FFFDF8]/94 divide-y divide-[#EAE0CD] shadow-2xs">
        {filteredFaqs.length === 0 ? (
          <div className="p-8 text-center text-sm text-[#6E655A]">
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
                    <div className="text-xs font-semibold text-[#9A4319]">
                      {faq.category}
                    </div>
                    <h2 className="text-base font-bold text-[#1E1B18]">{faq.q}</h2>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#6E655A] shrink-0 mt-1" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#6E655A] shrink-0 mt-1" />
                  )}
                </button>
                {isOpen && (
                  <p className="mt-3 text-sm leading-relaxed text-[#4A433A]">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })
        )}
      </section>

      {/* Quick Start 3-Step Guide */}
      <section className="rounded-2xl border border-[#DDD2BC] bg-[#FFFDF8]/94 p-6 sm:p-8 space-y-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-xl font-bold tracking-tight text-[#1E1B18]">
            Quick 3-Step Onboarding Guide
          </h2>
          <button
            type="button"
            onClick={() => onNavigate('editor')}
            className="cursor-pointer min-h-[40px] px-4 py-2 rounded-xl bg-[#24201C] hover:bg-[#38322C] text-[#FFFDF8] text-xs font-bold inline-flex items-center gap-1.5 transition-colors self-start"
          >
            <span>Open Editor</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="p-4 rounded-xl border border-[#DDD2BC] bg-[#FAF4E8]/90 space-y-1.5">
            <div className="text-xs font-bold text-[#9A4319]">
              1. Add your content
            </div>
            <p className="text-xs leading-relaxed text-[#4A433A]">
              Type directly, paste from your clipboard, or click File to upload a .txt or .md document. Long text prompts an instant Auto-Split.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-[#DDD2BC] bg-[#FAF4E8]/90 space-y-1.5">
            <div className="text-xs font-bold text-[#9A4319]">
              2. Style &amp; check margins
            </div>
            <p className="text-xs leading-relaxed text-[#4A433A]">
              Select any handwriting font and notebook sheet. Enable Show Margin Guides to verify alignment or expand Advanced settings for jitter and sketches.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-[#DDD2BC] bg-[#FAF4E8]/90 space-y-1.5">
            <div className="text-xs font-bold text-[#9A4319]">
              3. Generate &amp; export
            </div>
            <p className="text-xs leading-relaxed text-[#4A433A]">
              Click Generate Handwriting to refresh the preview, then download all pages as one clean A4 PDF or save individual PNG images.
            </p>
          </div>
        </div>
      </section>

      {/* Privacy, Policies & Creator Support */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-[#DDD2BC] bg-[#FFFDF8]/94 p-6 space-y-4 shadow-2xs">
          <div className="flex items-center gap-2 text-[#9A4319] text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>100% Client-Side Privacy</span>
          </div>
          <h3 className="text-lg font-bold text-[#1E1B18]">Your documents stay on your device</h3>
          <p className="text-xs leading-relaxed text-[#4A433A]">
            No typed assignment, uploaded .txt file, custom .ttf font, or sketch is ever transmitted to a backend server. All rendering happens in browser Canvas memory.
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => onOpenPolicy('privacy')}
              className="cursor-pointer min-h-[38px] px-3.5 rounded-xl border border-[#D7CCB5] bg-[#FAF4E8] hover:bg-[#EFE5D3] text-[#1E1B18] text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#9A4319]" />
              <span>Privacy Policy</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenPolicy('terms')}
              className="cursor-pointer min-h-[38px] px-3.5 rounded-xl border border-[#D7CCB5] bg-[#FAF4E8] hover:bg-[#EFE5D3] text-[#1E1B18] text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-[#9A4319]" />
              <span>Terms</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenPolicy('copyright')}
              className="cursor-pointer min-h-[38px] px-3.5 rounded-xl border border-[#D7CCB5] bg-[#FAF4E8] hover:bg-[#EFE5D3] text-[#1E1B18] text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
            >
              <span>Copyright &amp; Fonts</span>
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-[#DDD2BC] bg-[#FFFDF8]/94 p-6 space-y-4 shadow-2xs">
          <div className="text-xs font-bold uppercase tracking-wider text-[#9A4319]">
            Community &amp; Support
          </div>
          <h3 className="text-lg font-bold text-[#1E1B18]">Maintained openly by Plenty</h3>
          <p className="text-xs leading-relaxed text-[#4A433A]">
            Send feedback, report bugs, follow progress on GitHub, or tip Plenty a coffee via PhonePe UPI or Bitcoin.
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => onOpenPolicy('contact')}
              className="cursor-pointer min-h-[38px] px-4 rounded-xl bg-[#24201C] hover:bg-[#38322C] text-[#FFFDF8] text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
            >
              <span>Contact / Report Issue</span>
            </button>
            <button
              type="button"
              onClick={onOpenBuyCoffee}
              className="cursor-pointer min-h-[38px] px-3.5 rounded-xl border border-[#E2C2A8] bg-[#F6EBE0] hover:bg-[#EDD9C5] text-[#8F3D15] text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
            >
              <Heart className="w-3.5 h-3.5 text-[#9A4319] fill-current" />
              <span>Tip Plenty (UPI / BTC)</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
