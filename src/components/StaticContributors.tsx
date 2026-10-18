import React, { useState } from 'react';
import {
  Users,
  ExternalLink,
  Sparkles,
  HelpCircle,
  ChevronDown,
  GitCommit,
  GitPullRequest,
  Heart,
} from 'lucide-react';
import { FAQS_LIST } from './FrontPageMarquee';

interface StaticContributorsProps {
  onOpenHowItWorks: () => void;
}

export default function StaticContributors({
  onOpenHowItWorks,
}: StaticContributorsProps) {
  const [openFaqIds, setOpenFaqIds] = useState<Set<string>>(new Set());
  const [showFaqs, setShowFaqs] = useState<boolean>(false);

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
      aria-label="Contributors and student FAQs"
      className="bg-[#0e0e12] border-t border-white/10 select-none shrink-0"
    >
      {/* Student FAQs Accordion Drop Down Header (Compact & Optional) */}
      <div className="border-b border-white/5 bg-[#121216] px-4 sm:px-8 py-2.5 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setShowFaqs(!showFaqs)}
          className="cursor-pointer flex items-center gap-2 text-xs font-mono-code text-zinc-300 hover:text-white transition-colors group"
        >
          <HelpCircle className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
          <span className="font-bold uppercase tracking-wider">Student FAQs &amp; Help</span>
          <span className="text-[10px] bg-white/10 text-zinc-400 px-1.5 py-0.5 rounded">
            {FAQS_LIST.length} Questions
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${
              showFaqs ? 'rotate-180 text-emerald-400' : ''
            }`}
          />
        </button>

        <button
          type="button"
          onClick={onOpenHowItWorks}
          className="cursor-pointer text-[11px] font-mono-code text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all"
        >
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Why I Built This (Story)</span>
        </button>
      </div>

      {/* Expanded FAQs Drop Down Buttons */}
      {showFaqs && (
        <div className="px-4 sm:px-8 py-4 bg-[#0a0a0d] border-b border-white/10 grid grid-cols-1 md:grid-cols-2 gap-2.5 font-mono-code max-h-[340px] overflow-y-auto">
          {FAQS_LIST.map((faq) => {
            const isOpen = openFaqIds.has(faq.id);

            return (
              <div
                key={faq.id}
                className={`rounded-xl border transition-all overflow-hidden ${
                  isOpen
                    ? 'bg-[#15151b] border-emerald-500/50 shadow-md ring-1 ring-emerald-500/20'
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
                        isOpen ? 'text-emerald-400' : 'text-zinc-500 group-hover:text-emerald-400'
                      }`}
                    >
                      Q:
                    </span>
                    <span
                      className={`text-xs font-semibold truncate ${
                        isOpen ? 'text-white' : 'text-zinc-300 group-hover:text-white'
                      }`}
                    >
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 text-emerald-400' : 'text-zinc-500'
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-3.5 pb-3.5 pt-1 border-t border-white/5 font-sans text-xs text-[#e4e4e7]/85 leading-relaxed bg-[#0c0c10]">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Static Contributors Space (Right Above Footer) */}
      <div className="px-4 sm:px-8 py-5">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#6366f1]" />
            <h3 className="font-syne text-xs sm:text-sm font-extrabold uppercase tracking-tight text-white">
              Project Contributors
            </h3>
            <span className="text-[9px] font-mono-code bg-white/10 text-zinc-300 px-1.5 py-0.5 rounded uppercase">
              Core Team
            </span>
          </div>
          <span className="font-mono-code text-[10px] text-zinc-400 hidden sm:inline">
            Open-Source Community Driven
          </span>
        </div>

        {/* Small Stylish Profile Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* 1. PLENTY (Only this profile links to his GitHub projects & follow) */}
          <a
            href="https://github.com/jjohnernest212-oss"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer group bg-gradient-to-br from-[#16161d] via-[#121217] to-[#101014] border border-amber-500/40 hover:border-amber-400 rounded-2xl p-3.5 flex flex-col justify-between transition-all shadow-md hover:shadow-xl hover:shadow-amber-950/20 relative overflow-hidden"
            title="Click to visit Plenty's GitHub profile, see projects, and follow!"
          >
            <div className="absolute top-0 right-0 bg-amber-500/20 border-b border-l border-amber-500/30 text-amber-300 text-[8px] font-mono-code font-bold px-2 py-0.5 rounded-bl-lg uppercase tracking-wider flex items-center gap-1">
              <span>LEAD ARCHITECT</span>
              <ExternalLink className="w-2.5 h-2.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>

            <div className="flex items-center gap-3">
              {/* Plenty Avatar */}
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0 shadow-sm font-mono-code text-xs font-bold group-hover:scale-105 transition-transform">
                &lt;/&gt;
              </div>

              <div className="min-w-0">
                <h4 className="font-syne text-sm font-extrabold text-white group-hover:text-amber-300 transition-colors flex items-center gap-1">
                  <span>Plenty</span>
                </h4>
                <span className="font-mono-code text-[11px] text-amber-400 font-bold block">
                  @plenty
                </span>
                <span className="font-mono-code text-[9px] text-zinc-400 block truncate">
                  github.com/jjohnernest212-oss
                </span>
              </div>
            </div>

            <p className="mt-2.5 font-sans text-xs text-zinc-300 leading-normal">
              Engineered ink physics, custom font engine, and PhonePe tipping.
            </p>

            <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono-code text-amber-300">
              <span className="flex items-center gap-1">
                <span>View My Projects &amp; Follow</span>
              </span>
              <span className="font-bold group-hover:translate-x-1 transition-transform">
                ↗
              </span>
            </div>
          </a>

          {/* 2. SAURABH DAWARE (No external GitHub link as requested) */}
          <div className="bg-[#121216] border border-white/10 rounded-2xl p-3.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold font-syne text-sm shrink-0">
                    SD
                  </div>
                  <div>
                    <h4 className="font-syne text-sm font-bold text-white">Saurabh Daware</h4>
                    <span className="font-mono-code text-[11px] text-blue-400 block">
                      @saurabhdaware
                    </span>
                  </div>
                </div>
                <span className="text-[8px] font-mono-code bg-white/10 text-zinc-400 px-1.5 py-0.5 rounded uppercase">
                  FOUNDER
                </span>
              </div>

              <p className="mt-2.5 font-sans text-xs text-zinc-400 leading-normal">
                Original author of the open-source text-to-handwriting concept and mathematical CSS line-height.
              </p>
            </div>

            <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono-code text-zinc-400">
              <span>Original Creator</span>
              <span className="text-emerald-400">Core Pioneer</span>
            </div>
          </div>

          {/* 3. RUTH QUEEN (No external GitHub link as requested) */}
          <div className="bg-[#121216] border border-white/10 rounded-2xl p-3.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold font-syne text-sm shrink-0">
                    RQ
                  </div>
                  <div>
                    <h4 className="font-syne text-sm font-bold text-white">Ruth Queen</h4>
                    <span className="font-mono-code text-[11px] text-emerald-400 block">
                      @ruthqueen
                    </span>
                  </div>
                </div>
                <span className="text-[8px] font-mono-code bg-white/10 text-zinc-400 px-1.5 py-0.5 rounded uppercase">
                  DESIGN
                </span>
              </div>

              <p className="mt-2.5 font-sans text-xs text-zinc-400 leading-normal">
                Scribe UI workbench styling, typography calibration, and high-DPI canvas PDF rasterization.
              </p>
            </div>

            <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono-code text-zinc-400">
              <span>Style Systems</span>
              <span className="text-emerald-400">Retina DPI</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
