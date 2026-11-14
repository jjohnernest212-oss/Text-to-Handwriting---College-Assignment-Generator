import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react';
import { AppPage, PageSettings, ToolSlug } from '../../types';
import { BUILT_IN_FONTS } from '../../constants';
import { TOOLS_CATALOG, ToolDefinition } from '../../data/platformContent';
import MiniPaperSample from '../MiniPaperSample';

interface ToolsViewProps {
  theme: 'dark' | 'light';
  selectedToolSlug: ToolSlug | null;
  onSelectTool: (slug: ToolSlug | null) => void;
  onOpenToolInEditor: (tool: ToolDefinition, customText?: string) => void;
  onNavigate: (page: AppPage) => void;
}

export default function ToolsView({
  theme,
  selectedToolSlug,
  onSelectTool,
  onOpenToolInEditor,
  onNavigate,
}: ToolsViewProps) {
  const isLight = theme === 'light';
  const surfaceClass = isLight
    ? 'bg-white border-slate-200 text-slate-900'
    : 'bg-[#13141a] border-white/10 text-zinc-100';
  const mutedText = isLight ? 'text-slate-600' : 'text-zinc-400';

  const activeTool = selectedToolSlug
    ? TOOLS_CATALOG.find((t) => t.slug === selectedToolSlug) || null
    : null;

  const [previewText, setPreviewText] = useState<string>('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    if (activeTool) {
      setPreviewText(activeTool.sampleText);
      setOpenFaqIndex(0);
    }
  }, [activeTool?.slug]);

  const getFontFamily = (fontId?: string) => {
    const match = BUILT_IN_FONTS.find((f) => f.id === fontId);
    return match ? match.fontFamily : BUILT_IN_FONTS[0].fontFamily;
  };

  // =========================================================================
  // INDIVIDUAL TOOL DETAIL PAGE
  // =========================================================================
  if (activeTool) {
    const isProposed = activeTool.status === 'proposed';
    const fontFamily = getFontFamily(activeTool.presetSettings.fontId);
    const paperType = activeTool.presetSettings.paperType || 'ruled';
    const inkColor = activeTool.presetSettings.inkColor || '#002699';
    const lineHeight = activeTool.presetSettings.lineHeight || 28;
    const fontSize = activeTool.presetSettings.fontSize || 17;

    return (
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
        {/* Back Breadcrumb */}
        <div>
          <button
            type="button"
            onClick={() => onSelectTool(null)}
            className={`cursor-pointer inline-flex items-center gap-2 text-xs sm:text-sm font-semibold transition-colors ${
              isLight
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Tools</span>
          </button>
        </div>

        {/* Tool Header + Live Interactive Preview */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left: Info & Interactive Input */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold">
                <span className="text-indigo-600 dark:text-indigo-400">
                  {activeTool.badge}
                </span>
                <span aria-hidden="true" className="opacity-40">
                  ·
                </span>
                {isProposed ? (
                  <span className="text-amber-600 dark:text-amber-400 inline-flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Proposed Feature (Not Yet Built)
                  </span>
                ) : (
                  <span className="text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Available Live Now
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                {activeTool.title}
              </h1>
              <p className={`text-base leading-relaxed ${mutedText}`}>
                {activeTool.description}
              </p>
            </div>

            {/* Interactive Preview Input for Active Tools */}
            {!isProposed ? (
              <div className={`rounded-2xl border p-4 space-y-3 ${surfaceClass}`}>
                <label className="block text-xs font-semibold opacity-80">
                  Try sample text for this tool
                </label>
                <textarea
                  rows={5}
                  value={previewText}
                  onChange={(e) => setPreviewText(e.target.value)}
                  className={`w-full p-3 rounded-xl border text-sm leading-relaxed resize-y focus:outline-hidden focus:ring-2 focus:ring-indigo-500/40 ${
                    isLight
                      ? 'bg-slate-50 border-slate-200 text-slate-900'
                      : 'bg-[#0b0c10] border-white/10 text-zinc-100'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => onOpenToolInEditor(activeTool, previewText)}
                  className="cursor-pointer w-full min-h-[46px] px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Open in Editor with This Setup</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                className={`rounded-2xl border p-5 space-y-3 ${
                  isLight
                    ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                    : 'bg-amber-500/10 border-amber-400/25 text-amber-100'
                }`}
              >
                <div className="flex items-center gap-2 text-sm font-bold">
                  <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Proposed Tool — Available Workaround Today</span>
                </div>
                <p className="text-xs leading-relaxed opacity-90">
                  {activeTool.slug === 'pdf-to-handwriting'
                    ? 'Automatic binary PDF parsing is not yet built. Right now you can open .txt / .md files or paste copied PDF text directly into the Handwriting Editor.'
                    : 'Dedicated dotted stroke tracing generators are proposed for a future update. Right now you can pair French Séyès or Wide Ruled paper with light pencil ink in the Editor.'}
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate('editor')}
                  className={`cursor-pointer min-h-[42px] px-4 py-2 rounded-xl border text-xs font-semibold inline-flex items-center gap-2 transition-colors ${
                    isLight
                      ? 'bg-white hover:bg-amber-100/70 border-amber-300 text-amber-900'
                      : 'bg-white/10 hover:bg-white/15 border-amber-300/30 text-amber-100'
                  }`}
                >
                  <span>Use Available Editor Workflow</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Right: Live Real-Font Paper Output */}
          <div className="lg:col-span-7">
            <div className={`rounded-2xl border p-5 sm:p-6 space-y-4 ${surfaceClass}`}>
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-semibold">{activeTool.sampleTitle}</span>
                <span className={mutedText}>
                  {activeTool.presetSettings.paperType || 'ruled'} · Real font preview
                </span>
              </div>

              <MiniPaperSample
                paperType={paperType}
                fontFamily={fontFamily}
                inkColor={inkColor}
                fontSize={fontSize}
                lineHeight={lineHeight}
                text={previewText || activeTool.sampleText}
                className="min-h-[280px] sm:min-h-[320px]"
              />
            </div>
          </div>
        </section>

        {/* Step-by-Step Instructions */}
        <section className={`rounded-2xl border p-6 sm:p-8 space-y-5 ${surfaceClass}`}>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight">
            How this workflow works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activeTool.steps.map((step, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border space-y-2 ${
                  isLight
                    ? 'bg-slate-50/70 border-slate-200/80'
                    : 'bg-[#0e0f14] border-white/10'
                }`}
              >
                <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  Step {idx + 1}
                </div>
                <p className={`text-sm leading-relaxed ${mutedText}`}>{step}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tool-specific FAQs */}
        {activeTool.faqs.length > 0 && (
          <section className={`rounded-2xl border p-6 sm:p-8 space-y-4 ${surfaceClass}`}>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight">
              Frequently Asked Questions
            </h2>
            <div className="divide-y divide-inherit">
              {activeTool.faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div key={faq.q} className="py-3.5 first:pt-1 last:pb-1">
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="cursor-pointer w-full flex items-center justify-between gap-4 text-left"
                    >
                      <span className="text-sm font-semibold">{faq.q}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 opacity-60 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 opacity-60 shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <p className={`mt-2 text-sm leading-relaxed ${mutedText}`}>
                        {faq.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    );
  }

  // =========================================================================
  // TOOLS DIRECTORY VIEW
  // =========================================================================
  const liveTools = TOOLS_CATALOG.filter((t) => t.status === 'available');
  const proposedTools = TOOLS_CATALOG.filter((t) => t.status === 'proposed');

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-14">
      {/* Page Header */}
      <div className="max-w-3xl space-y-4">
        <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
          Handwriting Tools
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance">
          Focused handwriting workflows for every assignment and note.
        </h1>
        <p className={`text-base leading-relaxed ${mutedText}`}>
          Select an active tool below to preview its preset typography and open it directly in the handwriting editor. Planned capabilities are listed separately as Proposed.
        </p>
      </div>

      {/* Live Tools Grid */}
      <section className="space-y-5">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold tracking-tight">Available Tools</h2>
          <span className={`text-xs font-medium ${mutedText}`}>
            {liveTools.length} active workflows
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {liveTools.map((tool) => {
            const fontFamily = getFontFamily(tool.presetSettings.fontId);
            const paperType = tool.presetSettings.paperType || 'ruled';
            const inkColor = tool.presetSettings.inkColor || '#002699';

            return (
              <div
                key={tool.slug}
                className={`rounded-2xl border p-5 flex flex-col justify-between gap-5 transition-colors ${surfaceClass}`}
              >
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-medium">
                      <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                        {tool.badge}
                      </span>
                      <span aria-hidden="true" className="opacity-40">
                        ·
                      </span>
                      <span className="text-emerald-600 dark:text-emerald-400">
                        Live
                      </span>
                    </div>
                    <h3 className="text-lg font-bold tracking-tight">{tool.title}</h3>
                    <p className={`text-xs leading-relaxed ${mutedText}`}>
                      {tool.tagline}
                    </p>
                  </div>

                  <MiniPaperSample
                    paperType={paperType}
                    fontFamily={fontFamily}
                    inkColor={inkColor}
                    fontSize={14}
                    lineHeight={22}
                    text={tool.sampleText.split('\n').slice(0, 3).join('\n')}
                    className="h-[132px]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => onSelectTool(tool.slug)}
                    className={`cursor-pointer flex-1 min-h-[42px] px-3.5 rounded-xl border text-xs font-semibold transition-colors ${
                      isLight
                        ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-900'
                        : 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
                    }`}
                  >
                    View Tool Page
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenToolInEditor(tool)}
                    className="cursor-pointer min-h-[42px] px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors shrink-0"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Launch</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Proposed / Planned Tools Section (Transparently Labeled) */}
      <section className="space-y-5 pt-4 border-t border-inherit">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5" />
            <span>Proposed Roadmap Tools</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">
            Upcoming Tools (Proposed — Not Yet Released)
          </h2>
          <p className={`text-sm ${mutedText}`}>
            These tools are part of our design roadmap and do not have automated processing active yet. You can inspect their details and currently available workarounds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {proposedTools.map((tool) => (
            <div
              key={tool.slug}
              className={`rounded-2xl border p-6 flex flex-col justify-between gap-4 ${surfaceClass}`}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-medium text-amber-600 dark:text-amber-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Proposed Feature</span>
                </div>
                <h3 className="text-lg font-bold">{tool.title}</h3>
                <p className={`text-sm leading-relaxed ${mutedText}`}>
                  {tool.description}
                </p>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => onSelectTool(tool.slug)}
                  className={`cursor-pointer min-h-[40px] px-4 rounded-xl border text-xs font-semibold inline-flex items-center gap-1.5 transition-colors ${
                    isLight
                      ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 text-zinc-200'
                  }`}
                >
                  <span>View Proposed Details &amp; Workaround</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
