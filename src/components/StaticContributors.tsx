import React, { useState } from 'react';
import {
  Users,
  ExternalLink,
  Sparkles,
  HelpCircle,
  ChevronDown,
} from 'lucide-react';
import { FAQS_LIST } from './FrontPageMarquee';

interface StaticContributorsProps {
  theme?: 'dark' | 'light';
  onOpenHowItWorks: () => void;
}

export default function StaticContributors({
  theme = 'dark',
  onOpenHowItWorks,
}: StaticContributorsProps) {
  const [openFaqIds, setOpenFaqIds] = useState<Set<string>>(new Set());
  const [showFaqs, setShowFaqs] = useState<boolean>(false);

  const isLight = theme === 'light';

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

  return (
    <section
      id="contributors-faqs"
      aria-label="Contributors and student FAQs"
      className={`border-t select-none shrink-0 transition-colors ${
        isLight
          ? 'bg-slate-100 border-slate-200 text-slate-800'
          : 'bg-[#0e0e12] border-white/10 text-white'
      }`}
    >
      {/* Student FAQs Accordion Drop Down Header (Compact & Optional) */}
      <div
        className={`px-4 sm:px-8 py-2.5 flex items-center justify-between border-b ${
          isLight
            ? 'bg-slate-200/70 border-slate-300'
            : 'bg-[#121216] border-white/5'
        }`}
      >
        <button
          type="button"
          onClick={() => setShowFaqs(!showFaqs)}
          className={`cursor-pointer flex items-center gap-2 text-xs font-mono-code transition-colors group ${
            isLight
              ? 'text-slate-800 hover:text-slate-950'
              : 'text-zinc-300 hover:text-white'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5 text-emerald-500 group-hover:scale-110 transition-transform" />
          <span className="font-bold uppercase tracking-wider">Student FAQs &amp; Help</span>
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded font-mono-code ${
              isLight ? 'bg-slate-300 text-slate-700' : 'bg-white/10 text-zinc-400'
            }`}
          >
            {FAQS_LIST.length} Questions
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              showFaqs ? 'rotate-180 text-emerald-500' : isLight ? 'text-slate-500' : 'text-zinc-400'
            }`}
          />
        </button>

        <button
          type="button"
          onClick={onOpenHowItWorks}
          className="cursor-pointer text-[11px] font-mono-code text-amber-500 hover:text-amber-600 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all"
        >
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span>Why I Built This (Story)</span>
        </button>
      </div>

      {/* Expanded FAQs Drop Down Buttons */}
      {showFaqs && (
        <div
          className={`px-4 sm:px-8 py-4 border-b grid grid-cols-1 md:grid-cols-2 gap-2.5 font-mono-code max-h-[380px] overflow-y-auto ${
            isLight
              ? 'bg-white border-slate-200'
              : 'bg-[#0a0a0d] border-white/10'
          }`}
        >
          {FAQS_LIST.map((faq) => {
            const isOpen = openFaqIds.has(faq.id);

            return (
              <div
                key={faq.id}
                className={`rounded-xl border transition-all overflow-hidden ${
                  isOpen
                    ? isLight
                      ? 'bg-slate-50 border-emerald-500 shadow-xs ring-1 ring-emerald-500/20'
                      : 'bg-[#15151b] border-emerald-500/50 shadow-md ring-1 ring-emerald-500/20'
                    : isLight
                    ? 'bg-slate-50/50 border-slate-200 hover:border-slate-300'
                    : 'bg-[#101014] border-white/5 hover:border-white/20'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  className="cursor-pointer w-full text-left p-3 flex items-center justify-between gap-2 transition-colors group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`text-xs font-bold shrink-0 ${
                        isOpen
                          ? 'text-emerald-500'
                          : isLight
                          ? 'text-slate-400 group-hover:text-emerald-500'
                          : 'text-zinc-500 group-hover:text-emerald-400'
                      }`}
                    >
                      Q:
                    </span>
                    <span
                      className={`text-xs font-semibold truncate ${
                        isOpen
                          ? isLight
                            ? 'text-slate-900 font-bold'
                            : 'text-white'
                          : isLight
                          ? 'text-slate-800 group-hover:text-slate-950'
                          : 'text-zinc-300 group-hover:text-white'
                      }`}
                    >
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                      isOpen
                        ? 'rotate-180 text-emerald-500'
                        : isLight
                        ? 'text-slate-400'
                        : 'text-zinc-500'
                    }`}
                  />
                </button>

                {isOpen && (
                  <div
                    className={`px-3.5 pb-3.5 pt-1 border-t font-sans text-xs leading-relaxed ${
                      isLight
                        ? 'bg-white border-slate-200 text-slate-700'
                        : 'bg-[#0c0c10] border-white/5 text-[#e4e4e7]/85'
                    }`}
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Static Contributors Space (Right Above Footer) */}
      <div className="px-4 sm:px-8 py-6">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#6366f1]" />
            <h3
              className={`font-syne text-xs sm:text-sm font-extrabold uppercase tracking-tight ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}
            >
              Project Contributors
            </h3>
            <span
              className={`text-[9px] font-mono-code px-1.5 py-0.5 rounded uppercase ${
                isLight ? 'bg-slate-200 text-slate-700' : 'bg-white/10 text-zinc-300'
              }`}
            >
              Core Team
            </span>
          </div>
          <span
            className={`font-mono-code text-[10px] hidden sm:inline ${
              isLight ? 'text-slate-500' : 'text-zinc-400'
            }`}
          >
            Open-Source Community Driven
          </span>
        </div>

        {/* Small Stylish Profile Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* 1. PLENTY (Only this profile links to his GitHub projects & follow) */}
          <a
            href="https://github.com/plenty"
            target="_blank"
            rel="noopener noreferrer"
            className={`cursor-pointer group rounded-2xl p-3.5 flex flex-col justify-between transition-all shadow-sm hover:shadow-xl relative overflow-hidden border ${
              isLight
                ? 'bg-white border-amber-400/80 hover:border-amber-500 shadow-slate-200'
                : 'bg-gradient-to-br from-[#16161d] via-[#121217] to-[#101014] border-amber-500/40 hover:border-amber-400 shadow-amber-950/20'
            }`}
            title="Click to visit Plenty's GitHub profile, see projects, and follow!"
          >
            <div
              className={`absolute top-0 right-0 text-[8px] font-mono-code font-bold px-2 py-0.5 rounded-bl-lg uppercase tracking-wider flex items-center gap-1 border-b border-l ${
                isLight
                  ? 'bg-amber-100 border-amber-300 text-amber-900'
                  : 'bg-amber-500/20 border-amber-500/30 text-amber-300'
              }`}
            >
              <span>LEAD ARCHITECT</span>
              <ExternalLink className="w-2.5 h-2.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>

            <div className="flex items-center gap-3">
              {/* Plenty Avatar */}
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center shrink-0 shadow-sm font-mono-code text-xs font-bold group-hover:scale-105 transition-transform">
                &lt;/&gt;
              </div>

              <div className="min-w-0">
                <h4
                  className={`font-syne text-sm font-extrabold group-hover:text-amber-500 transition-colors flex items-center gap-1 ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}
                >
                  <span>Plenty</span>
                </h4>
                <span className="font-mono-code text-[11px] text-amber-500 font-bold block">
                  @plenty
                </span>
                <span
                  className={`font-mono-code text-[9px] block truncate ${
                    isLight ? 'text-slate-500' : 'text-zinc-400'
                  }`}
                >
                  github.com/plenty
                </span>
              </div>
            </div>

            <p
              className={`mt-2.5 font-sans text-xs leading-normal ${
                isLight ? 'text-slate-600' : 'text-zinc-300'
              }`}
            >
              Engineered ink physics, custom font engine, and PhonePe &amp; Bitcoin (BTC) international tipping.
            </p>

            <div
              className={`mt-3 pt-2 border-t flex items-center justify-between text-[10px] font-mono-code text-amber-500 ${
                isLight ? 'border-slate-100' : 'border-white/10'
              }`}
            >
              <span className="flex items-center gap-1 font-bold">
                <span>View My Projects &amp; Follow</span>
              </span>
              <span className="font-bold group-hover:translate-x-1 transition-transform">
                ↗
              </span>
            </div>
          </a>

          {/* 2. SAURABH DAWARE (No external GitHub link as requested) */}
          <div
            className={`rounded-2xl p-3.5 flex flex-col justify-between border ${
              isLight
                ? 'bg-white border-slate-200 shadow-xs'
                : 'bg-[#121216] border-white/10'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-500 flex items-center justify-center font-bold font-syne text-sm shrink-0">
                    SD
                  </div>
                  <div>
                    <h4
                      className={`font-syne text-sm font-bold ${
                        isLight ? 'text-slate-900' : 'text-white'
                      }`}
                    >
                      Saurabh Daware
                    </h4>
                    <span className="font-mono-code text-[11px] text-blue-500 block">
                      @saurabhdaware
                    </span>
                  </div>
                </div>
                <span
                  className={`text-[8px] font-mono-code px-1.5 py-0.5 rounded uppercase ${
                    isLight ? 'bg-slate-100 text-slate-600' : 'bg-white/10 text-zinc-400'
                  }`}
                >
                  FOUNDER
                </span>
              </div>

              <p
                className={`mt-2.5 font-sans text-xs leading-normal ${
                  isLight ? 'text-slate-600' : 'text-zinc-400'
                }`}
              >
                Original author of the open-source text-to-handwriting concept and mathematical CSS line-height.
              </p>
            </div>

            <div
              className={`mt-3 pt-2 border-t flex items-center justify-between text-[10px] font-mono-code ${
                isLight ? 'border-slate-100 text-slate-500' : 'border-white/5 text-zinc-400'
              }`}
            >
              <span>Original Creator</span>
              <span className="text-emerald-500 font-bold">Core Pioneer</span>
            </div>
          </div>

          {/* 3. RUTH QUEEN (No external GitHub link as requested) */}
          <div
            className={`rounded-2xl p-3.5 flex flex-col justify-between border ${
              isLight
                ? 'bg-white border-slate-200 shadow-xs'
                : 'bg-[#121216] border-white/10'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center justify-center font-bold font-syne text-sm shrink-0">
                    RQ
                  </div>
                  <div>
                    <h4
                      className={`font-syne text-sm font-bold ${
                        isLight ? 'text-slate-900' : 'text-white'
                      }`}
                    >
                      Ruth Queen
                    </h4>
                    <span className="font-mono-code text-[11px] text-emerald-500 block">
                      @ruthqueen
                    </span>
                  </div>
                </div>
                <span
                  className={`text-[8px] font-mono-code px-1.5 py-0.5 rounded uppercase ${
                    isLight ? 'bg-slate-100 text-slate-600' : 'bg-white/10 text-zinc-400'
                  }`}
                >
                  DESIGN
                </span>
              </div>

              <p
                className={`mt-2.5 font-sans text-xs leading-normal ${
                  isLight ? 'text-slate-600' : 'text-zinc-400'
                }`}
              >
                Scribe UI workbench styling, typography calibration, and high-DPI canvas PDF rasterization.
              </p>
            </div>

            <div
              className={`mt-3 pt-2 border-t flex items-center justify-between text-[10px] font-mono-code ${
                isLight ? 'border-slate-100 text-slate-500' : 'border-white/5 text-zinc-400'
              }`}
            >
              <span>Style Systems</span>
              <span className="text-emerald-500 font-bold">Retina DPI</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
