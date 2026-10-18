import React, { useRef } from 'react';
import {
  PenTool,
  FileSpreadsheet,
  UserCheck,
  Shapes,
  Upload,
  Palette,
  Sparkles,
  Plus,
  Droplet,
  Shuffle,
} from 'lucide-react';
import {
  PageSettings,
  StudentHeaderInfo,
  HandwritingFont,
  PaperType,
  PaperEffect,
  DiagramElement,
} from '../types';
import { BUILT_IN_FONTS, INK_PRESETS } from '../constants';

interface EditorControlsProps {
  theme?: 'dark' | 'light';
  settings: PageSettings;
  headerInfo: StudentHeaderInfo;
  customFonts: HandwritingFont[];
  diagrams: DiagramElement[];
  currentPageIndex: number;
  onUpdateSettings: (newSettings: Partial<PageSettings>) => void;
  onUpdateHeader: (newHeader: Partial<StudentHeaderInfo>) => void;
  onCustomFontUpload: (file: File) => void;
  onOpenDiagramModal: () => void;
  onDeleteDiagram: (id: string) => void;
}

export default function EditorControls({
  theme = 'dark',
  settings,
  headerInfo,
  customFonts,
  diagrams,
  currentPageIndex,
  onUpdateSettings,
  onUpdateHeader,
  onCustomFontUpload,
  onOpenDiagramModal,
  onDeleteDiagram,
}: EditorControlsProps) {
  const isLight = theme === 'light';
  const [activeTab, setActiveTab] = React.useState<'ink' | 'paper' | 'header' | 'diagrams'>('ink');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const allFonts = [...customFonts, ...BUILT_IN_FONTS];
  const pageDiagrams = diagrams.filter((d) => d.pageIndex === currentPageIndex);

  const handleFontFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onCustomFontUpload(file);
      e.target.value = '';
    }
  };

  return (
    <div
      className={`flex flex-col h-full rounded-lg border overflow-hidden ${
        isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-[#0c0c0e] border-[#27272a] text-[#e4e4e7]'
      }`}
    >
      {/* Pane Label Header */}
      <div
        className={`px-4 py-3 border-b flex items-center justify-between ${
          isLight ? 'border-slate-200 bg-slate-50' : 'border-[#27272a] bg-[#121214]'
        }`}
      >
        <div>
          <span className="font-mono-code text-[11px] text-[#6366f1] tracking-widest uppercase font-bold block">
            Style &amp; Handwriting Controls
          </span>
          <span
            className={`font-mono-code text-[10px] tracking-wider ${
              isLight ? 'text-slate-500' : 'text-[#e4e4e7]/60'
            }`}
          >
            FONTS, INK, PAPER &amp; MARGINS
          </span>
        </div>
      </div>

      {/* Navigation tabs */}
      <div
        className={`flex border-b p-1 gap-1 ${
          isLight ? 'border-slate-200 bg-slate-100/80' : 'border-[#27272a] bg-[#121214]'
        }`}
      >
        <button
          onClick={() => setActiveTab('ink')}
          className={`flex-1 py-1.5 px-2 rounded font-mono-code text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold flex items-center justify-center gap-1 transition-all ${
            activeTab === 'ink'
              ? isLight
                ? 'bg-white text-slate-900 border border-slate-300 shadow-2xs font-bold'
                : 'bg-[#18181b] text-white border border-[#6366f1]/60 shadow-xs'
              : isLight
              ? 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              : 'text-[#e4e4e7]/60 hover:text-white hover:bg-[#18181b]/50'
          }`}
        >
          <PenTool className="w-3 h-3 text-[#6366f1]" />
          <span>Ink &amp; Script</span>
        </button>

        <button
          onClick={() => setActiveTab('paper')}
          className={`flex-1 py-1.5 px-2 rounded font-mono-code text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold flex items-center justify-center gap-1 transition-all ${
            activeTab === 'paper'
              ? isLight
                ? 'bg-white text-slate-900 border border-slate-300 shadow-2xs font-bold'
                : 'bg-[#18181b] text-white border border-[#6366f1]/60 shadow-xs'
              : isLight
              ? 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              : 'text-[#e4e4e7]/60 hover:text-white hover:bg-[#18181b]/50'
          }`}
        >
          <FileSpreadsheet className="w-3 h-3 text-[#6366f1]" />
          <span>Paper</span>
        </button>

        <button
          onClick={() => setActiveTab('header')}
          className={`flex-1 py-1.5 px-2 rounded font-mono-code text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold flex items-center justify-center gap-1 transition-all ${
            activeTab === 'header'
              ? isLight
                ? 'bg-white text-slate-900 border border-slate-300 shadow-2xs font-bold'
                : 'bg-[#18181b] text-white border border-[#6366f1]/60 shadow-xs'
              : isLight
              ? 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              : 'text-[#e4e4e7]/60 hover:text-white hover:bg-[#18181b]/50'
          }`}
        >
          <UserCheck className="w-3 h-3 text-[#6366f1]" />
          <span>Header</span>
        </button>

        <button
          onClick={() => setActiveTab('diagrams')}
          className={`flex-1 py-1.5 px-2 rounded font-mono-code text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold flex items-center justify-center gap-1 transition-all ${
            activeTab === 'diagrams'
              ? isLight
                ? 'bg-white text-slate-900 border border-slate-300 shadow-2xs font-bold'
                : 'bg-[#18181b] text-white border border-[#6366f1]/60 shadow-xs'
              : isLight
              ? 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              : 'text-[#e4e4e7]/60 hover:text-white hover:bg-[#18181b]/50'
          }`}
        >
          <Shapes className="w-3 h-3 text-[#6366f1]" />
          <span>Diagrams {pageDiagrams.length > 0 && `(${pageDiagrams.length})`}</span>
        </button>
      </div>

      {/* Quick Direct Ink Blot Sliders Bar (Always Visible Across All Tabs!) */}
      <div
        className={`px-3.5 py-2.5 border-b font-mono-code text-xs transition-colors ${
          isLight
            ? 'bg-amber-50/90 border-slate-200 text-slate-800'
            : 'bg-[#141419] border-white/10 text-[#e4e4e7]'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Droplet className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
            <span className="font-bold uppercase tracking-wider text-[11px]">
              Live Ink Blots &amp; Smudges
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                settings.inkBlots && settings.inkBlotIntensity > 0
                  ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30'
                  : isLight
                  ? 'bg-slate-200 text-slate-500'
                  : 'bg-zinc-800 text-zinc-500'
              }`}
            >
              {settings.inkBlots && settings.inkBlotIntensity > 0
                ? `Density ${settings.inkBlotIntensity} • Seed #${settings.inkBlotSeed || 42}`
                : 'Blots Off'}
            </span>
            <button
              type="button"
              onClick={() => {
                const randomSeed = Math.floor(Math.random() * 900) + 10;
                onUpdateSettings({
                  inkBlots: true,
                  inkBlotIntensity:
                    settings.inkBlots && settings.inkBlotIntensity > 0 ? settings.inkBlotIntensity : 2,
                  inkBlotSeed: randomSeed,
                });
              }}
              className={`cursor-pointer px-1.5 py-0.5 rounded text-[10px] flex items-center gap-1 transition-all active:scale-95 border ${
                isLight
                  ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300 shadow-2xs'
                  : 'bg-white/10 hover:bg-white/20 text-zinc-200 border-white/10'
              }`}
              title="Instantly re-roll smudge positions"
            >
              <Shuffle className="w-2.5 h-2.5 text-amber-500" />
              <span>Re-roll</span>
            </button>
          </div>
        </div>

        {/* 2 Interactive Sliders: Intensity & Seed directly on the paper */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-0.5">
          {/* Slider 1: Intensity (0 to 5) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px]">
              <span className={isLight ? 'text-slate-600' : 'text-zinc-400'}>
                Intensity / Density:
              </span>
              <span className="text-[#6366f1] font-bold">
                {!settings.inkBlots || settings.inkBlotIntensity === 0
                  ? '0 (Clean Paper)'
                  : settings.inkBlotIntensity === 1
                  ? '1 (Subtle)'
                  : settings.inkBlotIntensity === 2
                  ? '2 (Natural)'
                  : settings.inkBlotIntensity === 3
                  ? '3 (Medium)'
                  : settings.inkBlotIntensity === 4
                  ? '4 (Heavy)'
                  : '5 (Messy)'}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="5"
              step="1"
              value={settings.inkBlots ? settings.inkBlotIntensity : 0}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val === 0) {
                  onUpdateSettings({ inkBlots: false, inkBlotIntensity: 0 });
                } else {
                  onUpdateSettings({ inkBlots: true, inkBlotIntensity: val });
                }
              }}
              className="w-full accent-amber-500 cursor-pointer h-1.5"
              title="Adjust ink blot intensity (0 = Clean/Off, 5 = Messy)"
              aria-label="Ink blot intensity slider"
            />
          </div>

          {/* Slider 2: Seed / Variation Position (1 to 100) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px]">
              <span className={isLight ? 'text-slate-600' : 'text-zinc-400'}>
                Placement Seed:
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() =>
                    onUpdateSettings({
                      inkBlots: true,
                      inkBlotIntensity:
                        settings.inkBlots && settings.inkBlotIntensity > 0 ? settings.inkBlotIntensity : 2,
                      inkBlotSeed: Math.max(1, (settings.inkBlotSeed || 42) - 1),
                    })
                  }
                  className="cursor-pointer px-1 py-0.5 rounded hover:bg-black/10 text-[9px] font-bold"
                  title="Previous Seed"
                >
                  -
                </button>
                <span className="text-amber-500 font-bold min-w-[20px] text-center">
                  #{settings.inkBlotSeed || 42}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onUpdateSettings({
                      inkBlots: true,
                      inkBlotIntensity:
                        settings.inkBlots && settings.inkBlotIntensity > 0 ? settings.inkBlotIntensity : 2,
                      inkBlotSeed: (settings.inkBlotSeed || 42) + 1,
                    })
                  }
                  className="cursor-pointer px-1 py-0.5 rounded hover:bg-black/10 text-[9px] font-bold"
                  title="Next Seed"
                >
                  +
                </button>
              </div>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              step="1"
              value={((settings.inkBlotSeed || 42) % 100) || 1}
              onChange={(e) =>
                onUpdateSettings({
                  inkBlots: true,
                  inkBlotIntensity:
                    settings.inkBlots && settings.inkBlotIntensity > 0 ? settings.inkBlotIntensity : 2,
                  inkBlotSeed: Number(e.target.value),
                })
              }
              className="w-full accent-amber-500 cursor-pointer h-1.5"
              title="Slide to change blot placement across paper"
              aria-label="Ink blot seed slider"
            />
          </div>
        </div>
      </div>

      {/* Tab Content Panels */}
      <div
        className={`flex-1 overflow-y-auto p-4 space-y-5 ${
          isLight ? 'bg-slate-50/50' : 'bg-[#0c0c0e]'
        }`}
      >
        {/* TAB 1: HANDWRITING & INK */}
        {activeTab === 'ink' && (
          <div className="space-y-5 animate-in fade-in-50 duration-150">
            {/* Handwriting Profile (Variation 2 font-grid cards) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-mono-code text-[11px] text-[#e4e4e7]/70 uppercase tracking-widest block">
                  Handwriting Profile
                </label>
                <span className="font-mono-code text-[10px] text-[#6366f1]">
                  {allFonts.length} STYLES AVAILABLE
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                {allFonts.map((f) => {
                  const isSelected = settings.fontId === f.id;
                  return (
                    <button
                      key={f.id}
                      onClick={() => onUpdateSettings({ fontId: f.id })}
                      className={`cursor-pointer p-2.5 rounded-md border text-center transition-all bg-[#18181b] ${
                        isSelected
                          ? 'border-[#6366f1] bg-[#6366f1]/15 ring-1 ring-[#6366f1]'
                          : 'border-[#27272a] hover:border-[#3f3f46]'
                      }`}
                    >
                      <div className="font-mono-code text-[10px] text-[#e4e4e7]/60 truncate flex items-center justify-center gap-1">
                        <span>{f.name.split(' ')[0]}</span>
                        {f.isCustom && (
                          <span className="bg-amber-500/20 text-amber-400 text-[8px] px-1 rounded font-bold">
                            CUSTOM
                          </span>
                        )}
                      </div>
                      <div
                        className="text-2xl mt-1 text-white truncate"
                        style={{ fontFamily: f.fontFamily }}
                      >
                        Aa Bb
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Upload Custom Font Button with Drag & Drop */}
              {/* Upload Custom Font Button with Drag & Drop & Helpful Note */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (file) {
                    onCustomFontUpload(file);
                  }
                }}
                className="mt-2.5 space-y-1.5"
              >
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer w-full py-2.5 px-3 border border-indigo-500/40 hover:border-indigo-400 bg-indigo-950/20 hover:bg-indigo-950/40 text-white rounded-lg font-mono-code text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xs"
                  title="Upload font file (.ttf, .otf, .woff)"
                >
                  <Upload className="w-4 h-4 text-indigo-400" />
                  <span className="font-bold">Upload Custom Handwriting Font</span>
                </button>
                <p className="text-[10px] text-zinc-400 font-sans leading-tight">
                  💡 Tip: Create a font of your handwriting on <strong className="text-zinc-200">Calligraphr</strong> or other online tools and upload the .ttf/.otf file to write in your own handwriting!
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".ttf,.otf,.woff,.woff2"
                  onChange={handleFontFileChange}
                  className="hidden"
                />

                {/* Draw Diagrams Quick Action */}
                <button
                  onClick={onOpenDiagramModal}
                  className="cursor-pointer w-full py-2 px-3 border border-[#27272a] hover:border-emerald-500/50 bg-[#18181b] hover:bg-[#222226] text-emerald-300 rounded-lg font-mono-code text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                  title="Draw diagrams, flowcharts, circuits on paper"
                >
                  <PenTool className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Draw / Add Diagrams to Paper</span>
                </button>
              </div>
            </div>

            {/* Pen Chemistry (Variation 2 ink picker) */}
            <div>
              <label className="font-mono-code text-[11px] text-[#e4e4e7]/70 uppercase tracking-widest block mb-2">
                Pen Chemistry
              </label>
              <div className="flex gap-2 flex-wrap items-center">
                {INK_PRESETS.map((ink) => {
                  const isSelected = settings.inkColor === ink.color;
                  return (
                    <button
                      key={ink.name}
                      onClick={() =>
                        onUpdateSettings({
                          inkColor: ink.color,
                          inkOpacity: ink.opacity,
                        })
                      }
                      title={ink.name}
                      className={`cursor-pointer w-7 h-7 rounded-md transition-all border-2 ${
                        isSelected
                          ? 'border-[#6366f1] ring-2 ring-[#6366f1]/40 scale-110'
                          : 'border-transparent hover:scale-105'
                      }`}
                      style={{ backgroundColor: ink.color }}
                    />
                  );
                })}

                {/* Custom Color Picker */}
                <label
                  className="cursor-pointer relative w-7 h-7 rounded-md border border-[#27272a] hover:border-[#6366f1] bg-[#18181b] flex items-center justify-center transition-all"
                  title="Custom Hex Color"
                >
                  <Palette className="w-3.5 h-3.5 text-[#e4e4e7]/70" />
                  <input
                    type="color"
                    value={settings.inkColor}
                    onChange={(e) => onUpdateSettings({ inkColor: e.target.value })}
                    className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                  />
                </label>

                <span className="font-mono-code text-[11px] text-[#e4e4e7]/60 ml-1 uppercase">
                  {settings.inkColor}
                </span>
              </div>
            </div>

            {/* Human Jitter Intensity (Variation 2 Slider) */}
            <div className="p-3 bg-[#18181b] border border-[#27272a] rounded-md space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-mono-code text-[11px] text-[#e4e4e7] uppercase tracking-wider flex items-center gap-1.5 font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Human Jitter Intensity
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.humanJitter}
                    onChange={(e) => onUpdateSettings({ humanJitter: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4.5 bg-[#27272a] peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-[#6366f1]"></div>
                </label>
              </div>

              {settings.humanJitter && (
                <>
                  <input
                    type="range"
                    min="1"
                    max="4"
                    step="1"
                    value={settings.jitterIntensity}
                    onChange={(e) => onUpdateSettings({ jitterIntensity: Number(e.target.value) })}
                    className="w-full accent-[#6366f1] cursor-pointer"
                  />
                  <div className="flex justify-between font-mono-code text-[10px] text-[#e4e4e7]/50 uppercase tracking-widest">
                    <span>Robot</span>
                    <span className="text-[#6366f1] font-bold">Level {settings.jitterIntensity}</span>
                    <span>Authentic</span>
                  </div>
                </>
              )}
            </div>

            {/* Ink Blot & Smudge Artifacts Direct Tuning Card */}
            <div
              className={`p-3.5 border rounded-xl space-y-3 transition-colors ${
                isLight ? 'bg-white border-slate-200 shadow-2xs' : 'bg-[#18181b] border-[#27272a]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center">
                    <Droplet className="w-3.5 h-3.5 fill-current" />
                  </div>
                  <div>
                    <label
                      className={`font-mono-code text-[11px] uppercase tracking-wider font-bold block leading-tight ${
                        isLight ? 'text-slate-900' : 'text-[#e4e4e7]'
                      }`}
                    >
                      Ink Blot &amp; Smudges
                    </label>
                    <span
                      className={`font-mono-code text-[9px] block ${
                        isLight ? 'text-slate-500' : 'text-[#e4e4e7]/60'
                      }`}
                    >
                      Live pen pooling, finger drag &amp; thumb smudges
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 font-mono-code">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
                      settings.inkBlots && settings.inkBlotIntensity > 0
                        ? 'bg-amber-500/20 text-amber-500 border-amber-500/30'
                        : isLight
                        ? 'bg-slate-100 text-slate-500 border-slate-200'
                        : 'bg-zinc-800 text-zinc-500 border-zinc-700'
                    }`}
                  >
                    {settings.inkBlots && settings.inkBlotIntensity > 0
                      ? `Active (${settings.inkBlotIntensity})`
                      : 'Disabled'}
                  </span>
                </div>
              </div>

              {/* Slider 1: Intensity / Density (0 to 5) */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between font-mono-code text-[11px]">
                  <span className={isLight ? 'text-slate-600' : 'text-zinc-400'}>
                    Smudge Intensity:
                  </span>
                  <span className="text-[#6366f1] font-bold">
                    {!settings.inkBlots || settings.inkBlotIntensity === 0
                      ? '0 — None (Clean Paper)'
                      : settings.inkBlotIntensity === 1
                      ? '1 — Subtle (5 micro specks)'
                      : settings.inkBlotIntensity === 2
                      ? '2 — Natural (10 notebook smudges)'
                      : settings.inkBlotIntensity === 3
                      ? '3 — Medium (16 homework pools)'
                      : settings.inkBlotIntensity === 4
                      ? '4 — Heavy (24 intense smudges)'
                      : '5 — Messy Scribe (32 lab stains)'}
                  </span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="5"
                  step="1"
                  value={settings.inkBlots ? settings.inkBlotIntensity : 0}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val === 0) {
                      onUpdateSettings({ inkBlots: false, inkBlotIntensity: 0 });
                    } else {
                      onUpdateSettings({ inkBlots: true, inkBlotIntensity: val });
                    }
                  }}
                  className="w-full accent-amber-500 cursor-pointer h-1.5"
                  title="Drag to adjust ink blot intensity without needing to toggle full settings"
                  aria-label="Ink blot intensity"
                />

                <div className="flex justify-between font-mono-code text-[9px] text-[#e4e4e7]/50 uppercase tracking-widest">
                  <span className={isLight ? 'text-slate-400' : 'text-zinc-500'}>0 (Off)</span>
                  <span className={isLight ? 'text-slate-400' : 'text-zinc-500'}>2 (Natural)</span>
                  <span className={isLight ? 'text-slate-400' : 'text-zinc-500'}>5 (Heavy)</span>
                </div>
              </div>

              {/* Slider 2: Seed / Variation Position (1 to 100) */}
              <div className="space-y-1.5 pt-2 border-t border-white/5">
                <div className="flex items-center justify-between font-mono-code text-[11px]">
                  <span className={isLight ? 'text-slate-600' : 'text-zinc-400'}>
                    Placement Seed (Variation):
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateSettings({
                          inkBlots: true,
                          inkBlotIntensity:
                            settings.inkBlots && settings.inkBlotIntensity > 0 ? settings.inkBlotIntensity : 2,
                          inkBlotSeed: Math.max(1, (settings.inkBlotSeed || 42) - 1),
                        })
                      }
                      className={`cursor-pointer px-1.5 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                        isLight
                          ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                          : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300'
                      }`}
                      title="Nudge seed back (-1)"
                    >
                      -1
                    </button>
                    <span className="text-amber-500 font-bold min-w-[32px] text-center">
                      #{settings.inkBlotSeed || 42}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateSettings({
                          inkBlots: true,
                          inkBlotIntensity:
                            settings.inkBlots && settings.inkBlotIntensity > 0 ? settings.inkBlotIntensity : 2,
                          inkBlotSeed: (settings.inkBlotSeed || 42) + 1,
                        })
                      }
                      className={`cursor-pointer px-1.5 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                        isLight
                          ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                          : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300'
                      }`}
                      title="Nudge seed forward (+1)"
                    >
                      +1
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const randomSeed = Math.floor(Math.random() * 900) + 10;
                        onUpdateSettings({
                          inkBlots: true,
                          inkBlotIntensity:
                            settings.inkBlots && settings.inkBlotIntensity > 0 ? settings.inkBlotIntensity : 2,
                          inkBlotSeed: randomSeed,
                        });
                      }}
                      className={`cursor-pointer px-2 py-0.5 rounded text-[10px] flex items-center gap-1 transition-all active:scale-95 border ${
                        isLight
                          ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300'
                          : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/40'
                      }`}
                      title="Randomize smudge positions"
                    >
                      <Shuffle className="w-2.5 h-2.5 text-amber-500" />
                      <span>Dice</span>
                    </button>
                  </div>
                </div>

                <input
                  type="range"
                  min="1"
                  max="100"
                  step="1"
                  value={((settings.inkBlotSeed || 42) % 100) || 1}
                  onChange={(e) =>
                    onUpdateSettings({
                      inkBlots: true,
                      inkBlotIntensity:
                        settings.inkBlots && settings.inkBlotIntensity > 0 ? settings.inkBlotIntensity : 2,
                      inkBlotSeed: Number(e.target.value),
                    })
                  }
                  className="w-full accent-amber-500 cursor-pointer h-1.5"
                  title="Drag slider to instantly reposition blots across the paper"
                  aria-label="Ink blot seed slider"
                />
              </div>

              {/* Quick Presets Pills */}
              <div className="pt-1.5 flex items-center gap-1.5 flex-wrap font-mono-code text-[10px]">
                <span className={`text-[9px] uppercase ${isLight ? 'text-slate-400' : 'text-zinc-500'}`}>
                  Presets:
                </span>
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ inkBlots: false, inkBlotIntensity: 0 })}
                  className={`cursor-pointer px-2 py-0.5 rounded border transition-colors ${
                    !settings.inkBlots || settings.inkBlotIntensity === 0
                      ? 'bg-indigo-600 text-white border-indigo-500 font-bold'
                      : isLight
                      ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                      : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300'
                  }`}
                >
                  Off
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ inkBlots: true, inkBlotIntensity: 1 })}
                  className={`cursor-pointer px-2 py-0.5 rounded border transition-colors ${
                    settings.inkBlots && settings.inkBlotIntensity === 1
                      ? 'bg-amber-500 text-white border-amber-600 font-bold'
                      : isLight
                      ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                      : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300'
                  }`}
                >
                  Subtle
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ inkBlots: true, inkBlotIntensity: 2 })}
                  className={`cursor-pointer px-2 py-0.5 rounded border transition-colors ${
                    settings.inkBlots && settings.inkBlotIntensity === 2
                      ? 'bg-amber-500 text-white border-amber-600 font-bold'
                      : isLight
                      ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                      : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300'
                  }`}
                >
                  Natural
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ inkBlots: true, inkBlotIntensity: 4 })}
                  className={`cursor-pointer px-2 py-0.5 rounded border transition-colors ${
                    settings.inkBlots && settings.inkBlotIntensity === 4
                      ? 'bg-amber-500 text-white border-amber-600 font-bold'
                      : isLight
                      ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                      : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300'
                  }`}
                >
                  Heavy
                </button>
              </div>
            </div>

            {/* Font Size & Pen Nib Thickness */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 bg-[#18181b] border border-[#27272a] rounded-md">
                <div className="flex justify-between font-mono-code text-[11px] text-[#e4e4e7]/70 mb-1.5">
                  <span>Font Size:</span>
                  <span className="text-[#6366f1] font-bold bg-[#6366f1]/15 px-1.5 py-0.5 rounded border border-[#6366f1]/30">
                    {settings.fontSize}px
                  </span>
                </div>
                <input
                  type="range"
                  min="11"
                  max="32"
                  step="1"
                  value={settings.fontSize}
                  onChange={(e) => onUpdateSettings({ fontSize: Number(e.target.value) })}
                  className="w-full accent-[#6366f1] cursor-pointer"
                  aria-label="Font size"
                />
                <div className="flex items-center justify-between gap-1 mt-2 font-mono-code text-[10px]">
                  {[14, 18, 22, 26].map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => onUpdateSettings({ fontSize: sz })}
                      className={`cursor-pointer px-1.5 py-0.5 rounded border transition-colors ${
                        settings.fontSize === sz
                          ? 'border-[#6366f1] bg-[#6366f1]/20 text-white font-bold'
                          : 'border-[#27272a] hover:border-[#3f3f46] text-[#e4e4e7]/60 hover:text-white'
                      }`}
                    >
                      {sz}px
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-2.5 bg-[#18181b] border border-[#27272a] rounded-md">
                <div className="flex justify-between font-mono-code text-[11px] text-[#e4e4e7]/70 mb-1.5">
                  <span>Nib Pressure:</span>
                  <span className="text-[#6366f1] font-bold">{settings.inkThickness.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="1.5"
                  step="0.1"
                  value={settings.inkThickness}
                  onChange={(e) => onUpdateSettings({ inkThickness: Number(e.target.value) })}
                  className="w-full accent-[#6366f1] cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PAPER & MATRIX */}
        {activeTab === 'paper' && (
          <div className="space-y-4 animate-in fade-in-50 duration-150">
            {/* Paper Substrate Type */}
            <div>
              <label className="font-mono-code text-[11px] text-[#e4e4e7]/70 uppercase tracking-widest block mb-2">
                Paper Substrate
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'ruled', name: 'Ruled Notebook', desc: 'Standard blue rules' },
                  { id: 'college-ruled', name: 'College Ruled', desc: 'Dense gray rules' },
                  { id: 'grid', name: 'Math / Grid Paper', desc: 'Engineering matrix' },
                  { id: 'plain', name: 'Plain A4 Sheet', desc: 'Clean white sheet' },
                  { id: 'vintage', name: 'Vintage Parchment', desc: 'Aged sepia paper' },
                ].map((paper) => {
                  const isSelected = settings.paperType === paper.id;
                  return (
                    <button
                      key={paper.id}
                      onClick={() => onUpdateSettings({ paperType: paper.id as PaperType })}
                      className={`cursor-pointer p-2.5 rounded-md border text-left transition-all bg-[#18181b] ${
                        isSelected
                          ? 'border-[#6366f1] bg-[#6366f1]/15 ring-1 ring-[#6366f1]'
                          : 'border-[#27272a] hover:border-[#3f3f46]'
                      }`}
                    >
                      <div className="font-mono-code text-[11px] font-bold text-white uppercase">
                        {paper.name}
                      </div>
                      <div className="font-mono-code text-[10px] text-[#e4e4e7]/50 mt-0.5">
                        {paper.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Rule Pitch (Line Height) */}
            <div className="p-3 bg-[#18181b] border border-[#27272a] rounded-md">
              <div className="flex justify-between font-mono-code text-[11px] text-[#e4e4e7]/70 mb-1.5">
                <span>Rule Pitch (Line Height):</span>
                <span className="text-[#6366f1] font-bold">{settings.lineHeight}px</span>
              </div>
              <input
                type="range"
                min="20"
                max="40"
                step="1"
                value={settings.lineHeight}
                onChange={(e) => onUpdateSettings({ lineHeight: Number(e.target.value) })}
                className="w-full accent-[#6366f1] cursor-pointer"
              />
            </div>

            {/* Letter & Word Spacing */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-2.5 bg-[#18181b] border border-[#27272a] rounded-md">
                <div className="flex justify-between font-mono-code text-[11px] text-[#e4e4e7]/70 mb-1">
                  <span>Letter Space:</span>
                  <span className="text-[#6366f1]">{settings.letterSpacing}px</span>
                </div>
                <input
                  type="range"
                  min="-1"
                  max="4"
                  step="0.5"
                  value={settings.letterSpacing}
                  onChange={(e) => onUpdateSettings({ letterSpacing: Number(e.target.value) })}
                  className="w-full accent-[#6366f1] cursor-pointer"
                />
              </div>

              <div className="p-2.5 bg-[#18181b] border border-[#27272a] rounded-md">
                <div className="flex justify-between font-mono-code text-[11px] text-[#e4e4e7]/70 mb-1">
                  <span>Word Space:</span>
                  <span className="text-[#6366f1]">{settings.wordSpacing}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="8"
                  step="1"
                  value={settings.wordSpacing}
                  onChange={(e) => onUpdateSettings({ wordSpacing: Number(e.target.value) })}
                  className="w-full accent-[#6366f1] cursor-pointer"
                />
              </div>
            </div>

            {/* Margin Line & Layout */}
            <div className="p-3 bg-[#18181b] border border-[#27272a] rounded-md space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono-code text-[11px] text-[#e4e4e7] uppercase font-bold">
                  Red Vertical Margin Line
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.showMarginLine}
                    onChange={(e) => onUpdateSettings({ showMarginLine: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4.5 bg-[#27272a] peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-rose-600"></div>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <div className="flex justify-between font-mono-code text-[10px] text-[#e4e4e7]/60 mb-1">
                    <span>Margin X:</span>
                    <span>{settings.marginLinePosition}px</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="100"
                    step="2"
                    value={settings.marginLinePosition}
                    onChange={(e) => onUpdateSettings({ marginLinePosition: Number(e.target.value) })}
                    className="w-full accent-rose-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-mono-code text-[10px] text-[#e4e4e7]/60 mb-1">
                    <span>Top Margin:</span>
                    <span>{settings.topMargin}px</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="110"
                    step="2"
                    value={settings.topMargin}
                    onChange={(e) => onUpdateSettings({ topMargin: Number(e.target.value) })}
                    className="w-full accent-[#6366f1] cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* CamScanner & Lighting Effects */}
            <div>
              <label className="font-mono-code text-[11px] text-[#e4e4e7]/70 uppercase tracking-widest block mb-2">
                CamScanner Optics &amp; Lighting
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'none', label: 'Flat Scan' },
                  { id: 'subtle-shadow', label: 'Desk Shadow' },
                  { id: 'mobile-scan', label: 'CamScanner' },
                  { id: 'desk-light', label: 'Lamp Glow' },
                ].map((eff) => (
                  <button
                    key={eff.id}
                    onClick={() => onUpdateSettings({ paperEffect: eff.id as PaperEffect })}
                    className={`cursor-pointer py-1.5 px-2 rounded font-mono-code text-[10px] uppercase border text-center transition-all ${
                      settings.paperEffect === eff.id
                        ? 'border-[#6366f1] bg-[#6366f1]/20 text-white font-bold'
                        : 'border-[#27272a] bg-[#18181b] text-[#e4e4e7]/70 hover:border-[#3f3f46]'
                    }`}
                  >
                    {eff.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Paper Tilt Slider */}
            <div className="p-3 bg-[#18181b] border border-[#27272a] rounded-md">
              <div className="flex justify-between font-mono-code text-[11px] text-[#e4e4e7]/70 mb-1.5">
                <span>Subtle Paper Tilt (Anti-Machine):</span>
                <span className="text-[#6366f1] font-bold">{settings.paperTilt}°</span>
              </div>
              <input
                type="range"
                min="-3"
                max="3"
                step="0.5"
                value={settings.paperTilt}
                onChange={(e) => onUpdateSettings({ paperTilt: Number(e.target.value) })}
                className="w-full accent-[#6366f1] cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* TAB 3: STUDENT HEADER */}
        {activeTab === 'header' && (
          <div className="space-y-4 animate-in fade-in-50 duration-150">
            <div className="flex items-center justify-between p-3 bg-[#18181b] border border-[#27272a] rounded-md">
              <div>
                <span className="font-mono-code text-[11px] font-bold text-white uppercase block">
                  Student Assignment Header
                </span>
                <span className="font-mono-code text-[10px] text-[#e4e4e7]/50">
                  Renders name, roll, subject &amp; page counter at top
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={headerInfo.enabled}
                  onChange={(e) => onUpdateHeader({ enabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-8 h-4.5 bg-[#27272a] peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-[#6366f1]"></div>
              </label>
            </div>

            {headerInfo.enabled && (
              <div className="space-y-3 pt-1">
                <div>
                  <label className="font-mono-code text-[10px] text-[#e4e4e7]/70 uppercase block mb-1">
                    Student Full Name:
                  </label>
                  <input
                    type="text"
                    value={headerInfo.name}
                    onChange={(e) => onUpdateHeader({ name: e.target.value })}
                    placeholder="e.g. Alex Johnson"
                    className="w-full px-3 py-1.5 font-mono-code text-xs bg-[#18181b] border border-[#27272a] rounded text-[#e4e4e7] focus:outline-hidden focus:border-[#6366f1]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-mono-code text-[10px] text-[#e4e4e7]/70 uppercase block mb-1">
                      Roll / Student ID:
                    </label>
                    <input
                      type="text"
                      value={headerInfo.rollNo}
                      onChange={(e) => onUpdateHeader({ rollNo: e.target.value })}
                      placeholder="e.g. CS-2024-042"
                      className="w-full px-3 py-1.5 font-mono-code text-xs bg-[#18181b] border border-[#27272a] rounded text-[#e4e4e7] focus:outline-hidden focus:border-[#6366f1]"
                    />
                  </div>

                  <div>
                    <label className="font-mono-code text-[10px] text-[#e4e4e7]/70 uppercase block mb-1">
                      Date:
                    </label>
                    <input
                      type="text"
                      value={headerInfo.date}
                      onChange={(e) => onUpdateHeader({ date: e.target.value })}
                      placeholder="e.g. October 15, 2026"
                      className="w-full px-3 py-1.5 font-mono-code text-xs bg-[#18181b] border border-[#27272a] rounded text-[#e4e4e7] focus:outline-hidden focus:border-[#6366f1]"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-mono-code text-[10px] text-[#e4e4e7]/70 uppercase block mb-1">
                    Subject / Course:
                  </label>
                  <input
                    type="text"
                    value={headerInfo.subject}
                    onChange={(e) => onUpdateHeader({ subject: e.target.value })}
                    placeholder="e.g. Physics & Classical Mechanics (PHY-101)"
                    className="w-full px-3 py-1.5 font-mono-code text-xs bg-[#18181b] border border-[#27272a] rounded text-[#e4e4e7] focus:outline-hidden focus:border-[#6366f1]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="showPageNumDark"
                    checked={headerInfo.showPageNumber}
                    onChange={(e) => onUpdateHeader({ showPageNumber: e.target.checked })}
                    className="accent-[#6366f1] rounded"
                  />
                  <label htmlFor="showPageNumDark" className="font-mono-code text-[11px] text-[#e4e4e7]/80 cursor-pointer">
                    Stamp &ldquo;Page X of Y&rdquo; in top right corner
                  </label>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: DIAGRAMS & SKETCHES */}
        {activeTab === 'diagrams' && (
          <div className="space-y-4 animate-in fade-in-50 duration-150">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono-code text-[11px] font-bold text-white uppercase block">
                  Page {currentPageIndex + 1} Diagrams
                </span>
                <span className="font-mono-code text-[10px] text-[#e4e4e7]/50">
                  Circuits, graphs, and schematics
                </span>
              </div>

              <button
                onClick={onOpenDiagramModal}
                className="cursor-pointer px-3 py-1.5 bg-[#6366f1] hover:bg-[#4f46e5] text-white rounded font-mono-code text-[11px] font-bold uppercase flex items-center gap-1.5 transition-all shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Diagram</span>
              </button>
            </div>

            {pageDiagrams.length === 0 ? (
              <div className="p-8 border border-dashed border-[#27272a] rounded-md text-center space-y-2 bg-[#18181b]/40">
                <Shapes className="w-7 h-7 text-[#e4e4e7]/30 mx-auto" />
                <p className="font-mono-code text-xs text-[#e4e4e7]/60">NO DIAGRAMS ON THIS PAGE</p>
                <p className="font-mono-code text-[10px] text-[#e4e4e7]/40">
                  Click &ldquo;+ Add Diagram&rdquo; to sketch or upload schematic!
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {pageDiagrams.map((diag, idx) => (
                  <div
                    key={diag.id}
                    className="p-2.5 bg-[#18181b] border border-[#27272a] rounded-md flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={diag.dataUrl}
                        alt="Preview"
                        className="w-12 h-10 object-contain bg-white rounded border border-[#27272a]"
                      />
                      <div>
                        <div className="font-mono-code text-xs font-bold text-white">
                          {diag.title || `DIAGRAM #${idx + 1}`}
                        </div>
                        <div className="font-mono-code text-[10px] text-[#e4e4e7]/50">
                          {diag.width}x{diag.height}px • POS: ({diag.x}, {diag.y})
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteDiagram(diag.id)}
                      className="cursor-pointer px-2 py-1 text-xs text-rose-400 hover:bg-rose-500/10 rounded font-mono-code uppercase transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

