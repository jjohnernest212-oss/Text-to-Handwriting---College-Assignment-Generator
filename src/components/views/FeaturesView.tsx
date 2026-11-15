import React from 'react';
import { ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import { AppPage } from '../../types';
import { FEATURE_CATEGORIES } from '../../data/platformContent';

interface FeaturesViewProps {
  theme: 'dark' | 'light';
  onNavigate: (page: AppPage) => void;
}

export default function FeaturesView({ onNavigate }: FeaturesViewProps) {
  const scrollToCategory = (id: string) => {
    const el = document.getElementById(`feature-${id}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12 text-[#1E1B18]">
      {/* Page Header */}
      <div className="max-w-3xl space-y-4">
        <div className="text-xs font-semibold text-[#9A4319] uppercase tracking-wider">
          Features Overview
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance text-[#1E1B18]">
          Built to make digital text look like real handwritten pages.
        </h1>
        <p className="text-base leading-relaxed text-[#4A433A]">
          Explore every capability available in Human Handwriting AI today. Proposed features under active planning are labeled clearly so you always know what works right now.
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate('editor')}
            className="cursor-pointer min-h-[44px] px-5 py-2.5 rounded-xl bg-[#24201C] hover:bg-[#38322C] text-[#FFFDF8] text-sm font-bold inline-flex items-center gap-2 transition-colors"
          >
            <span>Open Handwriting Editor</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Category Jump Links */}
      <div className="p-2 rounded-xl border border-[#DDD2BC] bg-[#FFFDF8]/94 flex items-center gap-1.5 overflow-x-auto shadow-2xs">
        {FEATURE_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => scrollToCategory(cat.id)}
            className="cursor-pointer px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 text-[#4A433A] hover:bg-[#FAF4E8] hover:text-[#9A4319] transition-colors"
          >
            {cat.code}. {cat.title}
          </button>
        ))}
      </div>

      {/* Detailed Feature Categories A-F */}
      <div className="space-y-8">
        {FEATURE_CATEGORIES.map((category) => (
          <section
            key={category.id}
            id={`feature-${category.id}`}
            className="rounded-2xl border border-[#DDD2BC] bg-[#FFFDF8]/94 p-6 sm:p-8 space-y-6 shadow-2xs"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5 border-[#EAE0CD]">
              <div className="space-y-1.5 max-w-2xl">
                <div className="text-xs font-semibold text-[#9A4319]">
                  Category {category.code}
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1E1B18]">
                  {category.title}
                </h2>
                <p className="text-sm leading-relaxed text-[#4A433A]">
                  {category.summary}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onNavigate(category.targetPage)}
                className="cursor-pointer min-h-[42px] px-4 py-2 rounded-xl border border-[#D7CCB5] bg-[#FAF4E8] hover:bg-[#EFE5D3] text-[#9A4319] text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 shrink-0 transition-colors"
              >
                <span>{category.ctaLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {category.items.map((item) => {
                const isProposed = item.status === 'proposed';
                return (
                  <div
                    key={item.title}
                    className="p-4 rounded-xl border border-[#DDD2BC] bg-[#FAF4E8]/90 flex items-start gap-3"
                  >
                    {isProposed ? (
                      <Clock className="w-4 h-4 text-[#B45309] shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-[#9A4319] shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-semibold text-[#1E1B18]">{item.title}</h3>
                        {isProposed && (
                          <span className="text-[11px] font-medium text-[#B45309]">
                            · Proposed
                          </span>
                        )}
                      </div>
                      <p className="text-xs leading-relaxed text-[#4A433A]">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
