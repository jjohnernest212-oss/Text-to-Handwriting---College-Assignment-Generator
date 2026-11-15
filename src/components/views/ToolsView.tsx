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
import { AppPage, ToolSlug } from '../../types';
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
  selectedToolSlug,
  onSelectTool,
  onOpenToolInEditor,
  onNavigate,
}: ToolsViewProps) {
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

  if (activeTool) {
    const isProposed = activeTool.status === 'proposed';
    const fontFamily = getFontFamily(activeTool.presetSettings.fontId);
    const paperType = activeTool.presetSettings.paperType || 'ruled';
    const inkColor = activeTool.presetSettings.inkColor || '#1E2430';
    const lineHeight = activeTool.presetSettings.lineHeight || 28;
    const fontSize = activeTool.presetSettings.fontSize || 17;

    return (
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10 text-[#1E1B18]">
        <div>
          <button
            type="button"
            onClick={() => onSelectTool(null)}
            className="cursor-pointer inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#5C5347] hover:text-[#9A4319] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Tools</span>
          </button>
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold">
                <span className="text-[#9A4319]">{activeTool.badge}</span>
                <span aria-hidden="true" className="opacity-40">
                  ·
                </span>
                {isProposed ? (
                  <span className="text-[#B45309] inline-flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Proposed Feature (Not Yet Built)
                  </span>
                ) : (
                  <span className="text-emerald-700 inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Available Live Now
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1E1B18]">
                {activeTool.title}
              </h1>
              <p className="text-base leading-relaxed text-[#4A433A]">
                {activeTool.description}
              </p>
            </div>

            {!isProposed ? (
              <div className="rounded-2xl border border-[#DDD2BC] bg-[#FFFDF8]/94 p-4 space-y-3 shadow-2xs">
                <label className="block text-xs font-semibold text-[#1E1B18]">
                  Try sample text for this tool
                </label>
                <textarea
                  rows={5}
                  value={previewText}
                  onChange={(e) => setPreviewText(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[#D7CCB5] bg-[#FAF4E8] text-sm text-[#1E1B18] leading-relaxed resize-y focus:outline-hidden focus:ring-2 focus:ring-[#9A4319]/25 focus:border-[#9A4319]"
                />
                <button
                  type="button"
                  onClick={() => onOpenToolInEditor(activeTool, previewText)}
                  className="cursor-pointer w-full min-h-[46px] px-5 py-2.5 rounded-xl bg-[#24201C] hover:bg-[#38322C] text-[#FFFDF8] text-sm font-bold inline-flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Open in Editor with This Setup</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="rounded-2xl border border-[#E2C2A8] bg-[#F6EBE0] text-[#5A2D15] p-5 space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-[#1E1B18]">
                  <Clock className="w-4 h-4 text-[#9A4319] shrink-0" />
                  <span>Proposed Tool — Available Workaround Today</span>
                </div>
                <p className="text-xs leading-relaxed text-[#4A433A]">
                  {activeTool.slug === 'pdf-to-handwriting'
                    ? 'Automatic binary PDF parsing is not yet built. Right now you can open .txt / .md files or paste copied PDF text directly into the Handwriting Editor.'
                    : 'Dedicated dotted stroke tracing generators are proposed for a future update. Right now you can pair French Séyès or Wide Ruled paper with light pencil ink in the Editor.'}
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate('editor')}
                  className="cursor-pointer min-h-[42px] px-4 py-2 rounded-xl border border-[#D7CCB5] bg-[#FFFDF8] hover:bg-[#FAF4E8] text-[#9A4319] text-xs font-semibold inline-flex items-center gap-2 transition-colors"
                >
                  <span>Use Available Editor Workflow</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-[#DDD2BC] bg-[#FFFDF8]/94 p-5 sm:p-6 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-semibold text-[#1E1B18]">{activeTool.sampleTitle}</span>
                <span className="text-[#6E655A]">
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

        <section className="rounded-2xl border border-[#DDD2BC] bg-[#FFFDF8]/94 p-6 sm:p-8 space-y-5 shadow-2xs">
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[#1E1B18]">
            How this workflow works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activeTool.steps.map((step, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-[#DDD2BC] bg-[#FAF4E8]/90 space-y-2"
              >
                <div className="text-xs font-bold text-[#9A4319]">
                  Step {idx + 1}
                </div>
                <p className="text-sm leading-relaxed text-[#4A433A]">{step}</p>
              </div>
            ))}
          </div>
        </section>

        {activeTool.faqs.length > 0 && (
          <section className="rounded-2xl border border-[#DDD2BC] bg-[#FFFDF8]/94 p-6 sm:p-8 space-y-4 shadow-2xs">
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[#1E1B18]">
              Frequently Asked Questions
            </h2>
            <div className="divide-y divide-[#EAE0CD]">
              {activeTool.faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div key={faq.q} className="py-3.5 first:pt-1 last:pb-1">
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="cursor-pointer w-full flex items-center justify-between gap-4 text-left"
                    >
                      <span className="text-sm font-semibold text-[#1E1B18]">{faq.q}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-[#6E655A] shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#6E655A] shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <p className="mt-2 text-sm leading-relaxed text-[#4A433A]">
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

  const liveTools = TOOLS_CATALOG.filter((t) => t.status === 'available');
  const proposedTools = TOOLS_CATALOG.filter((t) => t.status === 'proposed');

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-14 text-[#1E1B18]">
      <div className="max-w-3xl space-y-4">
        <div className="text-xs font-semibold text-[#9A4319] uppercase tracking-wider">
          Handwriting Tools
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance text-[#1E1B18]">
          Focused handwriting workflows for every assignment and note.
        </h1>
        <p className="text-base leading-relaxed text-[#4A433A]">
          Select an active tool below to preview its preset typography and open it directly in the handwriting editor. Planned capabilities are listed separately as Proposed.
        </p>
      </div>

      <section className="space-y-5">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold tracking-tight text-[#1E1B18]">Available Tools</h2>
          <span className="text-xs font-medium text-[#6E655A]">
            {liveTools.length} active workflows
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {liveTools.map((tool) => {
            const fontFamily = getFontFamily(tool.presetSettings.fontId);
            const paperType = tool.presetSettings.paperType || 'ruled';
            const inkColor = tool.presetSettings.inkColor || '#1E2430';

            return (
              <div
                key={tool.slug}
                className="rounded-2xl border border-[#DDD2BC] bg-[#FFFDF8]/94 p-5 flex flex-col justify-between gap-5 shadow-2xs"
              >
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-medium">
                      <span className="text-[#9A4319] font-semibold">
                        {tool.badge}
                      </span>
                      <span aria-hidden="true" className="opacity-40">
                        ·
                      </span>
                      <span className="text-emerald-700 font-semibold">Live</span>
                    </div>
                    <h3 className="text-lg font-bold tracking-tight text-[#1E1B18]">{tool.title}</h3>
                    <p className="text-xs leading-relaxed text-[#4A433A]">
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
                    className="cursor-pointer flex-1 min-h-[42px] px-3.5 rounded-xl border border-[#D7CCB5] bg-[#FAF4E8] hover:bg-[#EFE5D3] text-[#1E1B18] text-xs font-semibold transition-colors"
                  >
                    View Tool Page
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenToolInEditor(tool)}
                    className="cursor-pointer min-h-[42px] px-4 rounded-xl bg-[#24201C] hover:bg-[#38322C] text-[#FFFDF8] text-xs font-bold inline-flex items-center gap-1.5 transition-colors shrink-0"
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

      <section className="space-y-5 pt-6 border-t border-[#DDD2BC]">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#9A4319] uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5" />
            <span>Proposed Roadmap Tools</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-[#1E1B18]">
            Upcoming Tools (Proposed — Not Yet Released)
          </h2>
          <p className="text-sm text-[#4A433A]">
            These tools are part of our design roadmap and do not have automated processing active yet. You can inspect their details and currently available workarounds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {proposedTools.map((tool) => (
            <div
              key={tool.slug}
              className="rounded-2xl border border-[#DDD2BC] bg-[#FFFDF8]/94 p-6 flex flex-col justify-between gap-4 shadow-2xs"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-medium text-[#B45309]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Proposed Feature</span>
                </div>
                <h3 className="text-lg font-bold text-[#1E1B18]">{tool.title}</h3>
                <p className="text-sm leading-relaxed text-[#4A433A]">
                  {tool.description}
                </p>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => onSelectTool(tool.slug)}
                  className="cursor-pointer min-h-[40px] px-4 rounded-xl border border-[#D7CCB5] bg-[#FAF4E8] hover:bg-[#EFE5D3] text-[#1E1B18] text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
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
