import React from 'react';
import {
  CheckCircle2,
  Heart,
  ShieldCheck,
  ArrowRight,
  Clock,
  Bitcoin,
  Smartphone,
} from 'lucide-react';
import { AppPage } from '../../types';

interface PricingViewProps {
  theme: 'dark' | 'light';
  onNavigate: (page: AppPage) => void;
  onOpenBuyCoffee: () => void;
}

const FREE_PLAN_FEATURES = [
  'Unlimited browser-rendered handwritten A4 pages',
  'All 19 built-in handwriting styles (Neat, Cursive, Casual, Rapid)',
  'Custom handwriting font upload (.ttf, .otf, .woff)',
  'All 23 notebook, aesthetic, book, and engineering grid papers',
  'Preview-only Margin Guides toggle & 4-side margin controls',
  'Freehand & shape Diagram Sketch modal',
  'Watermark-free multi-page PDF & 2.5× PNG downloads',
  '100% local processing — zero account walls or server uploads',
];

const CAPABILITY_STATUS_ROWS = [
  {
    feature: 'Multi-Page Text to Handwriting Conversion',
    freeStatus: 'Included Today (Unlimited)',
    note: 'Runs locally via Canvas & jsPDF',
  },
  {
    feature: 'Custom .ttf / .otf Handwriting Font Import',
    freeStatus: 'Included Today',
    note: 'Instant browser font-face loading',
  },
  {
    feature: 'Plain Text & Markdown Import (.txt, .md)',
    freeStatus: 'Included Today',
    note: 'Auto-splits long files across A4 sheets',
  },
  {
    feature: 'Show Margin Guides Preview Overlay',
    freeStatus: 'Included Today',
    note: 'Strict preview-only alignment markers',
  },
  {
    feature: 'Direct Binary PDF & DOCX OCR Extraction',
    freeStatus: 'Proposed',
    note: 'Planned future release (paste PDF text today)',
  },
  {
    feature: 'Dotted Tracing Handwriting Worksheets',
    freeStatus: 'Proposed',
    note: 'Planned future release (use Séyès sheets today)',
  },
];

export default function PricingView({
  theme,
  onNavigate,
  onOpenBuyCoffee,
}: PricingViewProps) {
  const isLight = theme === 'light';
  const surfaceClass = isLight
    ? 'bg-white border-slate-200 text-slate-900'
    : 'bg-[#13141a] border-white/10 text-zinc-100';
  const mutedText = isLight ? 'text-slate-600' : 'text-zinc-400';

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-14">
      {/* Page Header */}
      <div className="max-w-3xl space-y-4">
        <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
          Pricing &amp; Creator Support
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance">
          Free forever for every student, writer, and learner.
        </h1>
        <p className={`text-base leading-relaxed ${mutedText}`}>
          Human Handwriting AI has no paid subscriptions, no hidden page limits, and no export watermarks. Everything runs cleanly inside your browser—supported voluntarily by community tips.
        </p>
      </div>

      {/* Two Honest Cards: Free Forever + Voluntary Creator Support */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
        {/* Card 1: Free Forever ($0) */}
        <div
          className={`rounded-2xl border p-6 sm:p-8 flex flex-col justify-between gap-8 ${
            isLight
              ? 'bg-white border-indigo-200 ring-1 ring-indigo-100'
              : 'bg-[#13141a] border-indigo-500/35'
          }`}
        >
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Core Platform
                </span>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  No Account Required
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold tracking-tight">$0</span>
                <span className={`text-sm font-medium ${mutedText}`}>
                  / Free Forever
                </span>
              </div>
              <p className={`text-sm leading-relaxed ${mutedText}`}>
                Full access to every built-in handwriting style, paper template, customization control, and clean A4 PDF/PNG export.
              </p>
            </div>

            <ul className="space-y-3 pt-2 border-t border-inherit">
              {FREE_PLAN_FEATURES.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('editor')}
            className="cursor-pointer w-full min-h-[48px] px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors"
          >
            <span>Start Creating Free</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Card 2: Voluntary Creator Support (UPI + Bitcoin) */}
        <div
          className={`rounded-2xl border p-6 sm:p-8 flex flex-col justify-between gap-8 ${surfaceClass}`}
        >
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Voluntary Tip Jar
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Support Plenty’s Open Work
              </h2>
              <p className={`text-sm leading-relaxed ${mutedText}`}>
                If Human Handwriting AI helped you finish an assignment or study sheet faster, you can send an optional tip—zero extra paywalls or feature locks.
              </p>
            </div>

            <div className="space-y-3 pt-2 border-t border-inherit">
              <div
                className={`p-4 rounded-xl border flex items-start gap-3 ${
                  isLight
                    ? 'bg-slate-50 border-slate-200'
                    : 'bg-[#0e0f14] border-white/10'
                }`}
              >
                <Smartphone className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="text-sm font-semibold">
                    India — PhonePe / UPI Instant Tip
                  </div>
                  <p className={`text-xs leading-relaxed ${mutedText}`}>
                    Scan QR or pay directly via PhonePe, Google Pay, or Paytm UPI with instant confirmation.
                  </p>
                </div>
              </div>

              <div
                className={`p-4 rounded-xl border flex items-start gap-3 ${
                  isLight
                    ? 'bg-slate-50 border-slate-200'
                    : 'bg-[#0e0f14] border-white/10'
                }`}
              >
                <Bitcoin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div className="space-y-1 min-w-0">
                  <div className="text-sm font-semibold">
                    International — Bitcoin (BTC Fast Approvals)
                  </div>
                  <p className={`text-xs leading-relaxed ${mutedText}`}>
                    Native SegWit Bech32 address with fast mempool acknowledgment for supporters outside India:
                  </p>
                  <code className="block text-[11px] font-mono-code break-all opacity-90 pt-0.5">
                    bc1qcesau7vdktgprrvc7hk6c04mh9z4yp2tlg42sa
                  </code>
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenBuyCoffee}
            className={`cursor-pointer w-full min-h-[48px] px-5 py-3 rounded-xl border text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors ${
              isLight
                ? 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-950'
                : 'bg-amber-500/15 hover:bg-amber-500/25 border-amber-400/30 text-amber-200'
            }`}
          >
            <Heart className="w-4 h-4 text-amber-500 fill-current" />
            <span>Open Tip Modal (UPI &amp; Bitcoin QR)</span>
          </button>
        </div>
      </div>

      {/* Feature Availability Matrix */}
      <section className={`rounded-2xl border overflow-hidden ${surfaceClass}`}>
        <div className="px-6 py-5 border-b border-inherit flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold tracking-tight">
              Included Capabilities vs. Proposed Roadmap
            </h2>
            <p className={`text-xs ${mutedText}`}>
              Everything marked &ldquo;Included Today&rdquo; works right now with zero paywalls.
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Zero Watermarks · 100% Local</span>
          </div>
        </div>

        <div className="divide-y divide-inherit">
          {CAPABILITY_STATUS_ROWS.map((row) => {
            const isProposed = row.freeStatus === 'Proposed';
            return (
              <div
                key={row.feature}
                className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm"
              >
                <div>
                  <div className="font-semibold">{row.feature}</div>
                  <div className={`text-xs ${mutedText}`}>{row.note}</div>
                </div>
                <div
                  className={`text-xs font-semibold inline-flex items-center gap-1.5 shrink-0 ${
                    isProposed
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  {isProposed ? (
                    <Clock className="w-3.5 h-3.5" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  )}
                  <span>{row.freeStatus}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
