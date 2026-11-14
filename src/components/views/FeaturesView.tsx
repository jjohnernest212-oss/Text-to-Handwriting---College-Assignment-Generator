import React from 'react';
import { ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import { AppPage } from '../../types';
import { FEATURE_CATEGORIES } from '../../data/platformContent';

interface FeaturesViewProps {
  theme: 'dark' | 'light';
  onNavigate: (page: AppPage) => void;
}

export default function FeaturesView({ theme, onNavigate }: FeaturesViewProps) {
  const isLight = theme === 'light';
  const surfaceClass = isLight
    ? 'bg-white border-slate-200 text-slate-900'
    : 'bg-[#13141a] border-white/10 text-zinc-100';
  const mutedText = isLight ? 'text-slate-600' : 'text-zinc-400';

  const scrollToCategory = (id: string) => {
    const el = document.getElementById(`feature-${id}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      {/* Page Header */}
      <div className="max-w-3xl space-y-4">
        <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
          Features Overview
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance">
          Built to make digital text look like real handwritten pages.
        </h1>
        <p className={`text-base leading-relaxed ${mutedText}`}>
          Explore every capability available in Human Handwriting AI today. Proposed features under active planning are labeled clearly so you always know what works right now.
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate('editor')}
            className="cursor-pointer min-h-[44px] px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold inline-flex items-center gap-2 transition-colors"
          >
            <span>Open Handwriting Editor</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Category Jump Links */}
      <div
        className={`p-2 rounded-xl border flex items-center gap-1.5 overflow-x-auto ${
          isLight ? 'bg-white border-slate-200' : 'bg-[#13141a] border-white/10'
        }`}
      >
        {FEATURE_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => scrollToCategory(cat.id)}
            className={`cursor-pointer px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
              isLight
                ? 'text-slate-700 hover:bg-slate-100'
                : 'text-zinc-300 hover:bg-white/10'
            }`}
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
            className={`rounded-2xl border p-6 sm:p-8 space-y-6 ${surfaceClass}`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5 border-inherit">
              <div className="space-y-1.5 max-w-2xl">
                <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  Category {category.code}
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                  {category.title}
                </h2>
                <p className={`text-sm leading-relaxed ${mutedText}`}>
                  {category.summary}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onNavigate(category.targetPage)}
                className={`cursor-pointer min-h-[42px] px-4 py-2 rounded-xl border text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 shrink-0 transition-colors ${
                  isLight
                    ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-900'
                    : 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
                }`}
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
                    className={`p-4 rounded-xl border flex items-start gap-3 ${
                      isLight
                        ? 'bg-slate-50/70 border-slate-200/80'
                        : 'bg-[#0e0f14] border-white/10'
                    }`}
                  >
                    {isProposed ? (
                      <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-semibold">{item.title}</h3>
                        {isProposed && (
                          <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400">
                            · Proposed
                          </span>
                        )}
                      </div>
                      <p className={`text-xs leading-relaxed ${mutedText}`}>
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
