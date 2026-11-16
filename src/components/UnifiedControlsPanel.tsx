import React, { useRef, useState, useEffect } from 'react';
import {
  Sparkles,
  Upload,
  Type,
  ClipboardPaste,
  ChevronDown,
  ChevronUp,
  Download,
  FileText,
  AlignLeft,
  AlignJustify,
  PenTool,
  SlidersHorizontal,
  FolderOpen,
  RotateCcw,
  Ruler,
  Copy,
  Check,
} from 'lucide-react';
import { BUILT_IN_FONTS } from '../constants';
import {
  AssignmentPreset,
  PageSettings,
  StudentHeaderInfo,
  HandwritingFont,
  DiagramElement,
  PaperType,
  PaperEffect,
} from '../types';
import { calculateAssignmentStats, autoSplitLongText } from '../utils/paginationUtils';
import { PAPER_DEFINITIONS, PAPER_DEFINITIONS_MAP } from '../utils/paperStyles';
import AdBannerSlot from './AdBannerSlot';

interface UnifiedControlsPanelProps {
  theme?: 'dark' | 'light';
  rawText: string;
  currentPageIndex: number;
  totalPages: number;
  settings: PageSettings;
  onUpdateSettings: (newSettings: Partial<PageSettings>) => void;
  headerInfo: StudentHeaderInfo;
  onUpdateHeader: (newHeader: Partial<StudentHeaderInfo>) => void;
  customFonts: HandwritingFont[];
  onCustomFontUpload: (file: File) => void;
  diagrams: DiagramElement[];
  onOpenDiagramModal: () => void;
  onDeleteDiagram: (id: string) => void;
  onChangeText: (text: string) => void;
  onApplyPreset: (preset: AssignmentPreset) => void;
  onInsertPageBreak: () => void;
  onAutoSplitPages?: () => void;
  onClearText: () => void;
  onDownloadPdf: () => void;
  onDownloadImage: () => void;
  isExporting?: boolean;
  exportProgress?: { currentPage: number; totalPages: number; status: string } | null;
  onNotify?: (message: string, type: 'success' | 'error' | 'info') => void;
  onSwitchToPreviewMobile?: () => void;
  onGenerateHandwriting?: () => void;
  onOpenPaperGallery?: () => void;
  onOpenStylesGallery?: () => void;
  onOpenBuyCoffee?: () => void;
}

export default function UnifiedControlsPanel({
  theme = 'dark',
  rawText,
  currentPageIndex,
  totalPages,
  settings,
  onUpdateSettings,
  headerInfo,
  onUpdateHeader,
  customFonts,
  onCustomFontUpload,
  diagrams,
  onOpenDiagramModal,
  onChangeText,
  onInsertPageBreak,
  onAutoSplitPages,
  onClearText,
  onDownloadPdf,
  onDownloadImage,
  isExporting = false,
  exportProgress = null,
  onNotify,
  onSwitchToPreviewMobile,
  onGenerateHandwriting,
  onOpenPaperGallery,
  onOpenStylesGallery,
  onOpenBuyCoffee,
}: UnifiedControlsPanelProps) {
  const isLight = theme === 'light';
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const textFileInputRef = useRef<HTMLInputElement | null>(null);
  const fontFileInputRef = useRef<HTMLInputElement | null>(null);

  // Single optional disclosure for margins, jitter, blots, and student header
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);
  const [justCopied, setJustCopied] = useState<boolean>(false);

  // History snapshot tracking
  const [history, setHistory] = useState<string[]>([rawText]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const isUndoRedoActionRef = useRef<boolean>(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stats = calculateAssignmentStats(rawText, settings);
  const wordCount = stats.totalWords;
  const charCount = stats.totalChars;
  const pageDiagrams = diagrams.filter((d) => d.pageIndex === currentPageIndex);

  useEffect(() => {
    if (isUndoRedoActionRef.current) {
      isUndoRedoActionRef.current = false;
      return;
    }
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(() => {
      setHistory((prev) => {
        if (prev[historyIndex] === rawText) return prev;
        const next = prev.slice(0, historyIndex + 1);
        next.push(rawText);
        if (next.length > 50) next.shift();
        setHistoryIndex(next.length - 1);
        return next;
      });
    }, 350);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [rawText, historyIndex]);

  const pushImmediateSnapshot = (newText: string) => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    setHistory((prev) => {
      const next = prev.slice(0, historyIndex + 1);
      next.push(newText);
      if (next.length > 50) next.shift();
      setHistoryIndex(next.length - 1);
      return next;
    });
  };

  const handlePasteClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text && text.trim()) {
          const nextText = rawText ? rawText + '\n\n' + text : text;
          const newStats = calculateAssignmentStats(nextText, settings);

          if (newStats.needsMorePages) {
            const splitText = autoSplitLongText(nextText, settings);
            const splitStats = calculateAssignmentStats(splitText, settings);
            pushImmediateSnapshot(splitText);
            onChangeText(splitText);
            onNotify?.(
              `Text (${splitStats.totalWords} words) pasted and split into ${splitStats.currentPagesCount} pages.`,
              'success'
            );
          } else {
            pushImmediateSnapshot(nextText);
            onChangeText(nextText);
            onNotify?.('Text pasted.', 'success');
          }
          return;
        }
      }
    } catch {
      // Clipboard read blocked
    }
    textareaRef.current?.focus();
    onNotify?.('Tap inside the text box and paste (Ctrl+V / Cmd+V).', 'info');
  };

  const handleCopyClipboard = async () => {
    if (!rawText) {
      onNotify?.('Nothing to copy yet — type or paste some text first.', 'info');
      return;
    }

    let copied = false;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(rawText);
        copied = true;
      }
    } catch {
      // Fall back to execCommand below when iframe blocks async clipboard API
    }

    if (!copied) {
      try {
        const helper = document.createElement('textarea');
        helper.value = rawText;
        helper.setAttribute('readonly', '');
        helper.style.position = 'fixed';
        helper.style.left = '-9999px';
        document.body.appendChild(helper);
        helper.select();
        copied = document.execCommand('copy');
        document.body.removeChild(helper);
      } catch {
        copied = false;
      }
    }

    if (copied) {
      setJustCopied(true);
      setTimeout(() => setJustCopied(false), 2000);
      onNotify?.('Copied drafted text to clipboard!', 'success');
    } else {
      onNotify?.('Unable to access clipboard automatically.', 'error');
    }
  };

  const handleTextareaPaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pasted = e.clipboardData.getData('text');
    if (!pasted || !pasted.trim()) return;

    const target = e.currentTarget;
    const start = target.selectionStart;
    const end = target.selectionEnd;
    const nextText = rawText.substring(0, start) + pasted + rawText.substring(end);

    const newStats = calculateAssignmentStats(nextText, settings);
    if (newStats.needsMorePages) {
      e.preventDefault();
      const splitText = autoSplitLongText(nextText, settings);
      const splitStats = calculateAssignmentStats(splitText, settings);
      pushImmediateSnapshot(splitText);
      onChangeText(splitText);
      onNotify?.(
        `Text (${splitStats.totalWords} words) split across ${splitStats.currentPagesCount} pages.`,
        'success'
      );
    }
  };

  const handleProcessFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        const fileStats = calculateAssignmentStats(content, settings);
        if (fileStats.needsMorePages) {
          const splitText = autoSplitLongText(content, settings);
          const splitStats = calculateAssignmentStats(splitText, settings);
          pushImmediateSnapshot(splitText);
          onChangeText(splitText);
          onNotify?.(
            `Loaded (${splitStats.totalWords} words) across ${splitStats.currentPagesCount} pages.`,
            'success'
          );
        } else {
          pushImmediateSnapshot(content);
          onChangeText(content);
          onNotify?.(`Loaded "${file.name}".`, 'success');
        }
      }
    };
    reader.onerror = () => {
      onNotify?.('Could not read file. Please choose a valid text document.', 'error');
    };
    reader.readAsText(file);
  };

  const handleFontFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onCustomFontUpload(file);
      e.target.value = '';
    }
  };

  const PRIMARY_INKS = [
    { name: 'Dark Blue', color: '#001b6e', opacity: 0.95 },
    { name: 'Royal Blue', color: '#0033aa', opacity: 0.95 },
    { name: 'Gel Black', color: '#161616', opacity: 0.95 },
    { name: 'Ballpoint', color: '#2b2b2b', opacity: 0.9 },
    { name: 'Red Gel', color: '#9e1c1c', opacity: 0.95 },
  ];

  const currentPaperDef = PAPER_DEFINITIONS_MAP[settings.paperType] || PAPER_DEFINITIONS[0];

  const inputSurfaceClass = isLight
    ? 'bg-[#FAF4E8] border-[#D7CCB5] text-[#1E1B18] focus:border-[#9A4319]'
    : 'bg-[#070D1A] border-sky-300/20 text-slate-100 focus:border-sky-400';

  const cardSurfaceClass = isLight
    ? 'bg-[#FFFDF8] border-[#DDD2BC]'
    : 'bg-[#0E172B] border-sky-300/15';

  return (
    <div
      className={`flex flex-col h-full overflow-y-auto scrollbar-thin transition-colors ${
        isLight ? 'bg-[#F5EEE0] text-[#1E1B18]' : 'bg-[#0B1222]/94 text-slate-100'
      }`}
    >
      <div className="p-4 space-y-4 flex-1">
        {/* ========================================================================= */}
        {/* STEP 1: YOUR TEXT                                                         */}
        {/* ========================================================================= */}
        <section className={`rounded-2xl border overflow-hidden transition-colors ${cardSurfaceClass}`}>
          <div
            className={`px-4 py-3 border-b flex items-center justify-between gap-2 flex-wrap ${
              isLight ? 'bg-[#FAF4E8] border-[#EAE0CD]' : 'bg-[#080F1E] border-sky-300/15'
            }`}
          >
            <div>
              <h2 className={`text-sm font-bold tracking-tight ${isLight ? 'text-[#1E1B18]' : 'text-white'}`}>1. Write or Paste Text</h2>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap shrink-0">
              <button
                type="button"
                onClick={handlePasteClipboard}
                className={`cursor-pointer min-h-[38px] text-xs font-semibold rounded-xl px-2.5 flex items-center gap-1.5 transition-colors border whitespace-nowrap active:scale-95 ${
                  isLight
                    ? 'bg-[#F6EBE0] hover:bg-[#EFE0D0] border-[#E2C2A8] text-[#8F3D15]'
                    : 'bg-sky-500/15 hover:bg-sky-500/25 border-sky-400/35 text-sky-200'
                }`}
                title="Paste text from clipboard"
              >
                <ClipboardPaste className={`w-3.5 h-3.5 ${isLight ? 'text-[#9A4319]' : 'text-sky-300'}`} />
                <span>Paste</span>
              </button>

              <button
                type="button"
                onClick={handleCopyClipboard}
                disabled={!rawText}
                aria-label="Copy to Clipboard"
                title="Copy to Clipboard"
                className={`cursor-pointer min-h-[38px] text-xs font-semibold rounded-xl px-2.5 flex items-center gap-1.5 transition-colors border whitespace-nowrap disabled:opacity-40 active:scale-95 ${
                  justCopied
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : isLight
                    ? 'bg-[#FFFDF8] hover:bg-[#FAF4E8] border-[#D7CCB5] text-[#1E1B18]'
                    : 'bg-[#121D35] hover:bg-[#192847] border-sky-300/20 text-slate-200'
                }`}
              >
                {justCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className={`w-3.5 h-3.5 ${isLight ? 'text-[#9A4319]' : 'text-sky-300'}`} />
                    <span>Copy Text</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => textFileInputRef.current?.click()}
                className={`cursor-pointer min-h-[38px] text-xs font-medium rounded-xl px-2.5 flex items-center gap-1 transition-colors border whitespace-nowrap active:scale-95 ${
                  isLight
                    ? 'bg-[#FFFDF8] hover:bg-[#FAF4E8] border-[#D7CCB5] text-[#4A433A]'
                    : 'bg-[#121D35] hover:bg-[#192847] border-sky-300/20 text-slate-200'
                }`}
                title="Upload .txt, .md, or document"
              >
                <FolderOpen className={`w-3.5 h-3.5 ${isLight ? 'text-[#9A4319]' : 'text-sky-300'}`} />
                <span className="hidden sm:inline">File</span>
              </button>
              <input
                ref={textFileInputRef}
                type="file"
                accept=".txt,.md,.markdown,.text,.rtf,.json,.doc,.docx"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleProcessFile(file);
                    e.target.value = '';
                  }
                }}
                className="hidden"
              />

              {showClearConfirm ? (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      pushImmediateSnapshot('');
                      onClearText();
                      setShowClearConfirm(false);
                    }}
                    className="cursor-pointer min-h-[38px] text-xs bg-rose-600 hover:bg-rose-500 text-white font-semibold px-2.5 rounded-xl"
                  >
                    Clear?
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowClearConfirm(false)}
                    className={`cursor-pointer min-h-[38px] text-xs border px-2.5 rounded-xl ${
                      isLight
                        ? 'bg-[#FFFDF8] border-[#D7CCB5] text-[#4A433A]'
                        : 'bg-[#121D35] border-sky-300/20 text-slate-200'
                    }`}
                  >
                    No
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(true)}
                  disabled={!rawText.trim()}
                  className={`cursor-pointer min-h-[38px] text-xs font-medium rounded-xl px-2.5 flex items-center gap-1 transition-colors border disabled:opacity-30 active:scale-95 ${
                    isLight
                      ? 'bg-[#FFFDF8] hover:bg-rose-50 border-[#D7CCB5] text-[#4A433A] hover:text-rose-700'
                      : 'bg-[#121D35] hover:bg-rose-950/50 border-sky-300/20 text-slate-300 hover:text-rose-300'
                  }`}
                  title="Clear text"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Clear</span>
                </button>
              )}
            </div>
          </div>

          <div className="p-3">
            <textarea
              ref={textareaRef}
              value={rawText}
              onChange={(e) => onChangeText(e.target.value)}
              onPaste={handleTextareaPaste}
              placeholder="Type or paste your notes or assignment here...&#10;&#10;Updates the notebook sheet live. Use '---page---' for a manual page break."
              rows={7}
              className={`w-full p-3 text-sm rounded-xl resize-y focus:outline-hidden focus:ring-2 border transition-colors leading-relaxed ${
                isLight
                  ? 'bg-[#FAF4E8] border-[#D7CCB5] text-[#1E1B18] placeholder:text-[#6E655A]/75 focus:ring-[#9A4319]/25 focus:border-[#9A4319]'
                  : 'bg-[#070D1A] border-sky-300/20 text-slate-100 placeholder:text-slate-500 focus:ring-sky-400/40'
              }`}
              spellCheck={false}
            />
          </div>

          {/* Unboxed clean metadata + page helper */}
          <div
            className={`px-4 py-2.5 border-t flex items-center justify-between gap-2 text-xs flex-wrap ${
              isLight ? 'bg-[#FAF4E8] text-[#4A433A] border-[#EAE0CD]' : 'bg-[#080F1E] text-slate-300 border-sky-300/15'
            }`}
          >
            <div className="flex items-center gap-2 tabular-nums">
              <span>{wordCount} words</span>
              <span aria-hidden="true">·</span>
              <span>{charCount} chars</span>
              <span aria-hidden="true">·</span>
              <span className={`font-semibold ${isLight ? 'text-[#9A4319]' : 'text-sky-300'}`}>
                {totalPages} {totalPages === 1 ? 'page' : 'pages'}
              </span>
            </div>

            {stats.needsMorePages && onAutoSplitPages ? (
              <button
                type="button"
                onClick={onAutoSplitPages}
                className="cursor-pointer px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#1E1B18] font-bold text-xs flex items-center gap-1.5 transition-colors active:scale-95 whitespace-nowrap"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Auto-Split ({stats.recommendedPages}p)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onInsertPageBreak}
                className={`cursor-pointer px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                  isLight ? 'text-[#9A4319] hover:bg-[#F6EBE0]' : 'text-sky-300 hover:bg-sky-500/15'
                }`}
              >
                + New Page
              </button>
            )}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* STEP 2: FONT, INK & PAPER SETTINGS                                        */}
        {/* ========================================================================= */}
        <section className={`rounded-2xl border p-4 space-y-4 transition-colors ${cardSurfaceClass}`}>
          <div className={`flex items-center justify-between border-b pb-3 ${isLight ? 'border-[#EAE0CD]' : 'border-sky-300/15'}`}>
            <h2 className={`text-sm font-bold tracking-tight flex items-center gap-2 ${isLight ? 'text-[#1E1B18]' : 'text-white'}`}>
              <Type className={`w-4 h-4 ${isLight ? 'text-[#9A4319]' : 'text-sky-400'}`} />
              <span>2. Pen &amp; Paper Settings</span>
            </h2>
          </div>

          {/* Font Selector */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <label className={`text-xs font-semibold ${isLight ? 'text-[#1E1B18]' : 'text-slate-200'}`}>Handwriting Style</label>
              <div className="flex items-center gap-3">
                {onOpenStylesGallery && (
                  <button
                    type="button"
                    onClick={onOpenStylesGallery}
                    className={`cursor-pointer text-xs hover:underline font-semibold ${isLight ? 'text-[#9A4319] hover:text-[#7D3411]' : 'text-sky-300 hover:text-amber-300'}`}
                  >
                    Browse Styles ↗
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => fontFileInputRef.current?.click()}
                  className={`cursor-pointer text-xs hover:underline font-semibold flex items-center gap-1 ${isLight ? 'text-[#9A4319] hover:text-[#7D3411]' : 'text-sky-300 hover:text-amber-300'}`}
                >
                  <Upload className="w-3 h-3" />
                  <span>Upload Font</span>
                </button>
              </div>
              <input
                ref={fontFileInputRef}
                type="file"
                accept=".ttf,.otf,.woff,.woff2"
                onChange={handleFontFileChange}
                className="hidden"
              />
            </div>
            <select
              value={settings.fontId}
              onChange={(e) => onUpdateSettings({ fontId: e.target.value })}
              className={`w-full min-h-[44px] px-3 py-2 rounded-xl border text-sm font-medium cursor-pointer transition-colors ${inputSurfaceClass}`}
            >
              {customFonts.length > 0 && (
                <optgroup label="Your Uploaded Fonts">
                  {customFonts.map((f) => (
                    <option key={f.id} value={f.id}>
                      ★ {f.name} (Custom)
                    </option>
                  ))}
                </optgroup>
              )}
              <optgroup label="Cursive &amp; Penmanship Scripts">
                {BUILT_IN_FONTS.filter((f) => f.category === 'cursive').map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Neat Student Handwritings">
                {BUILT_IN_FONTS.filter((f) => f.category === 'neat').map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Casual Classroom Pen">
                {BUILT_IN_FONTS.filter((f) => f.category === 'casual').map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Rapid / Ballpoint Scribes">
                {BUILT_IN_FONTS.filter((f) => f.category === 'messy').map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Ink Color Picker */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold opacity-85">Ink Color</label>
              <span className="text-xs font-mono-code opacity-70 uppercase">{settings.inkColor}</span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {PRIMARY_INKS.map((ink) => {
                const isSelected = settings.inkColor.toLowerCase() === ink.color.toLowerCase();
                return (
                  <button
                    key={ink.name}
                    type="button"
                    onClick={() =>
                      onUpdateSettings({
                        inkColor: ink.color,
                        inkOpacity: ink.opacity,
                      })
                    }
                    className={`cursor-pointer min-h-[38px] px-3 py-1.5 rounded-xl border text-xs flex items-center gap-1.5 transition-all whitespace-nowrap ${
                      isSelected
                        ? isLight
                          ? 'ring-2 ring-[#9A4319] border-[#9A4319] bg-[#F6EBE0] text-[#8F3D15] font-semibold'
                          : 'ring-2 ring-sky-400 border-sky-400 bg-sky-500/20 text-white font-semibold'
                        : isLight
                        ? 'bg-[#FAF4E8] hover:bg-[#F3E9D6] border-[#D7CCB5] text-[#4A433A]'
                        : 'bg-[#070D1A] hover:bg-[#121D35] border-sky-300/20 text-slate-300'
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full shrink-0 border border-black/15"
                      style={{ backgroundColor: ink.color }}
                    />
                    <span>{ink.name}</span>
                  </button>
                );
              })}

              <label
                className={`cursor-pointer min-h-[38px] px-2.5 py-1.5 rounded-xl border flex items-center gap-1.5 transition-colors text-xs ${
                  isLight
                    ? 'bg-[#FAF4E8] hover:bg-[#F3E9D6] border-[#D7CCB5] text-[#4A433A]'
                    : 'bg-[#070D1A] hover:bg-[#121D35] border-sky-300/20 text-slate-300'
                }`}
                title="Pick custom ink color"
              >
                <input
                  type="color"
                  value={settings.inkColor}
                  onChange={(e) => onUpdateSettings({ inkColor: e.target.value })}
                  className="w-4 h-4 rounded border-0 cursor-pointer p-0 bg-transparent"
                />
                <span>Custom</span>
              </label>
            </div>
          </div>

          {/* Notebook Paper Type */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className={`text-xs font-semibold ${isLight ? 'text-[#1E1B18]' : 'text-slate-200'}`}>Notebook Paper</label>
              {onOpenPaperGallery && (
                <button
                  type="button"
                  onClick={onOpenPaperGallery}
                  className={`cursor-pointer text-xs hover:underline font-semibold flex items-center gap-1 ${isLight ? 'text-[#9A4319] hover:text-[#7D3411]' : 'text-sky-300 hover:text-amber-300'}`}
                >
                  <span>Browse 20+ Papers ↗</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <select
                value={settings.paperType}
                onChange={(e) => {
                  const newType = e.target.value as PaperType;
                  const def = PAPER_DEFINITIONS_MAP[newType];
                  if (def) {
                    onUpdateSettings({
                      paperType: newType,
                      marginLineColor: def.marginColor,
                      lineHeight: def.recommendedLineHeight,
                      topMargin: def.recommendedTopMargin,
                    });
                  } else {
                    onUpdateSettings({ paperType: newType });
                  }
                }}
                className={`flex-1 min-h-[44px] px-3 py-2 rounded-xl border text-sm font-medium cursor-pointer transition-colors ${inputSurfaceClass}`}
              >
                <optgroup label="School Notebooks">
                  {PAPER_DEFINITIONS.filter((p) => p.category === 'school').map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Aesthetic Study Journals">
                  {PAPER_DEFINITIONS.filter((p) => p.category === 'aesthetic').map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Real Book &amp; Scanned Pages">
                  {PAPER_DEFINITIONS.filter((p) => p.category === 'realistic').map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Grid &amp; Engineering">
                  {PAPER_DEFINITIONS.filter((p) => p.category === 'math').map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </optgroup>
              </select>

              {onOpenPaperGallery && (
                <button
                  type="button"
                  onClick={onOpenPaperGallery}
                  className={`w-11 h-11 rounded-xl border shrink-0 relative overflow-hidden cursor-pointer hover:scale-105 transition-transform ${
                    isLight ? 'border-[#D7CCB5]' : 'border-sky-300/25'
                  }`}
                  style={{ backgroundColor: currentPaperDef.bgColor }}
                  title="Open Visual Paper Gallery"
                  aria-label="Open Visual Paper Gallery"
                >
                  {currentPaperDef.lineColor !== 'transparent' && (
                    <div
                      className="absolute inset-0 pt-1"
                      style={{
                        backgroundImage: `repeating-linear-gradient(transparent 0px, transparent 5px, ${currentPaperDef.lineColor} 5px, ${currentPaperDef.lineColor} 6px)`,
                      }}
                    />
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Font Size & Line Spacing Sliders */}
          <div className={`grid grid-cols-2 gap-4 pt-2 border-t ${isLight ? 'border-[#EAE0CD]' : 'border-sky-300/15'}`}>
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className={`font-semibold ${isLight ? 'text-[#1E1B18]' : 'text-slate-200'}`}>Font Size</span>
                <span className={`font-semibold tabular-nums ${isLight ? 'text-[#9A4319]' : 'text-sky-300'}`}>{settings.fontSize}px</span>
              </div>
              <input
                type="range"
                min="12"
                max="30"
                step="1"
                value={settings.fontSize}
                onChange={(e) => onUpdateSettings({ fontSize: Number(e.target.value) })}
                className={`w-full cursor-pointer h-2 rounded-lg ${isLight ? 'accent-[#9A4319]' : 'accent-sky-400'}`}
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className={`font-semibold ${isLight ? 'text-[#1E1B18]' : 'text-slate-200'}`}>Line Spacing</span>
                <span className={`font-semibold tabular-nums ${isLight ? 'text-[#9A4319]' : 'text-sky-300'}`}>{settings.lineHeight}px</span>
              </div>
              <input
                type="range"
                min="22"
                max="44"
                step="1"
                value={settings.lineHeight}
                onChange={(e) => onUpdateSettings({ lineHeight: Number(e.target.value) })}
                className={`w-full cursor-pointer h-2 rounded-lg ${isLight ? 'accent-[#9A4319]' : 'accent-sky-400'}`}
              />
            </div>
          </div>

          {/* OPTIONAL 'SHOW MARGIN GUIDES' TOGGLE RIGHT IN PAPER SETTINGS */}
          <div className={`pt-3 border-t ${isLight ? 'border-[#EAE0CD]' : 'border-sky-300/15'}`}>
            <button
              type="button"
              role="switch"
              aria-checked={settings.showMarginGuides}
              onClick={() =>
                onUpdateSettings({ showMarginGuides: !settings.showMarginGuides })
              }
              className={`w-full min-h-[48px] px-3.5 py-2.5 rounded-xl border flex items-center justify-between gap-3 text-left transition-colors cursor-pointer ${
                settings.showMarginGuides
                  ? isLight
                    ? 'bg-[#F6EBE0] border-[#E2C2A8]'
                    : 'bg-sky-500/20 border-sky-400/50'
                  : isLight
                  ? 'bg-[#FAF4E8] hover:bg-[#F3E9D6] border-[#D7CCB5]'
                  : 'bg-[#070D1A] hover:bg-[#121D35] border-sky-300/20'
              }`}
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <Ruler className={`w-4 h-4 shrink-0 mt-0.5 ${isLight ? 'text-[#9A4319]' : 'text-sky-400'}`} />
                <div className="min-w-0">
                  <div className={`text-xs font-semibold ${isLight ? 'text-[#1E1B18]' : 'text-white'}`}>Show Margin Guides</div>
                  <div
                    className={`text-[11px] leading-snug ${
                      isLight ? 'text-[#6E655A]' : 'text-slate-400'
                    }`}
                  >
                    Faint alignment markers on preview for text &amp; diagrams (not printed)
                  </div>
                </div>
              </div>

              <span
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                  settings.showMarginGuides
                    ? isLight
                      ? 'bg-[#9A4319]'
                      : 'bg-sky-400'
                    : isLight
                    ? 'bg-[#D7CCB5]'
                    : 'bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition-transform ${
                    settings.showMarginGuides ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </span>
            </button>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* STEP 3: OPTIONAL FINE-TUNING (Margins, Jitter, Header, Diagrams)          */}
        {/* ========================================================================= */}
        <section className={`rounded-2xl border overflow-hidden transition-colors ${cardSurfaceClass}`}>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`w-full min-h-[48px] px-4 py-3 flex items-center justify-between text-left cursor-pointer transition-colors ${
              isLight ? 'hover:bg-[#FAF4E8]' : 'hover:bg-sky-500/10'
            }`}
          >
            <div className="flex items-center gap-2">
              <SlidersHorizontal className={`w-4 h-4 ${isLight ? 'text-[#9A4319]' : 'text-sky-400'}`} />
              <span className={`text-xs font-semibold ${isLight ? 'text-[#1E1B18]' : 'text-white'}`}>
                Advanced settings
              </span>
            </div>
            {showAdvanced ? (
              <ChevronUp className="w-4 h-4 opacity-70" />
            ) : (
              <ChevronDown className="w-4 h-4 opacity-70" />
            )}
          </button>

          {showAdvanced && (
            <div className={`px-4 pb-4 pt-3 border-t space-y-4 text-xs ${isLight ? 'border-[#EAE0CD]' : 'border-sky-300/15'}`}>
              {/* Custom Margin Sliders */}
              <div className="space-y-2.5">
                <div className={`text-xs font-semibold ${isLight ? 'text-[#1E1B18]' : 'text-slate-200'}`}>Page Margins</div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className={isLight ? 'text-[#4A433A]' : 'text-slate-300'}>Top</span>
                      <span className={`font-semibold tabular-nums ${isLight ? 'text-[#9A4319]' : 'text-sky-300'}`}>{settings.topMargin}px</span>
                    </div>
                    <input
                      type="range"
                      min="28"
                      max="120"
                      step="2"
                      value={settings.topMargin}
                      onChange={(e) => onUpdateSettings({ topMargin: Number(e.target.value) })}
                      className={`w-full cursor-pointer h-1.5 rounded-lg ${isLight ? 'accent-[#9A4319]' : 'accent-sky-400'}`}
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className={isLight ? 'text-[#4A433A]' : 'text-slate-300'}>Bottom</span>
                      <span className={`font-semibold tabular-nums ${isLight ? 'text-[#9A4319]' : 'text-sky-300'}`}>{settings.bottomMargin}px</span>
                    </div>
                    <input
                      type="range"
                      min="24"
                      max="120"
                      step="2"
                      value={settings.bottomMargin}
                      onChange={(e) => onUpdateSettings({ bottomMargin: Number(e.target.value) })}
                      className={`w-full cursor-pointer h-1.5 rounded-lg ${isLight ? 'accent-[#9A4319]' : 'accent-sky-400'}`}
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className={isLight ? 'text-[#4A433A]' : 'text-slate-300'}>Left Text</span>
                      <span className={`font-semibold tabular-nums ${isLight ? 'text-[#9A4319]' : 'text-sky-300'}`}>{settings.leftMargin}px</span>
                    </div>
                    <input
                      type="range"
                      min="28"
                      max="130"
                      step="2"
                      value={settings.leftMargin}
                      onChange={(e) => onUpdateSettings({ leftMargin: Number(e.target.value) })}
                      className={`w-full cursor-pointer h-1.5 rounded-lg ${isLight ? 'accent-[#9A4319]' : 'accent-sky-400'}`}
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className={isLight ? 'text-[#4A433A]' : 'text-slate-300'}>Right Text</span>
                      <span className={`font-semibold tabular-nums ${isLight ? 'text-[#9A4319]' : 'text-sky-300'}`}>{settings.rightMargin}px</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="100"
                      step="2"
                      value={settings.rightMargin}
                      onChange={(e) => onUpdateSettings({ rightMargin: Number(e.target.value) })}
                      className={`w-full cursor-pointer h-1.5 rounded-lg ${isLight ? 'accent-[#9A4319]' : 'accent-sky-400'}`}
                    />
                  </div>
                </div>
              </div>

              {/* Text Alignment */}
              <div className={`flex items-center justify-between pt-3 border-t ${isLight ? 'border-[#EAE0CD]' : 'border-sky-300/15'}`}>
                <span className={`font-semibold ${isLight ? 'text-[#1E1B18]' : 'text-slate-200'}`}>Text Alignment</span>
                <div className={`flex items-center p-0.5 rounded-xl border ${isLight ? 'border-[#D7CCB5] bg-[#FAF4E8]' : 'border-sky-300/20 bg-[#070D1A]'}`}>
                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ justification: 'left' })}
                    className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                      settings.justification === 'left'
                        ? isLight
                          ? 'bg-[#24201C] text-[#FFFDF8] font-bold'
                          : 'bg-sky-500 text-slate-950 font-bold'
                        : isLight
                        ? 'text-[#4A433A] hover:text-[#1E1B18]'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <AlignLeft className="w-3.5 h-3.5" />
                    <span>Left</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ justification: 'full' })}
                    className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                      settings.justification === 'full'
                        ? isLight
                          ? 'bg-[#24201C] text-[#FFFDF8] font-bold'
                          : 'bg-sky-500 text-slate-950 font-bold'
                        : isLight
                        ? 'text-[#4A433A] hover:text-[#1E1B18]'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <AlignJustify className="w-3.5 h-3.5" />
                    <span>Justify</span>
                  </button>
                </div>
              </div>

              {/* Printed Red Margin Line */}
              <div className={`flex items-center justify-between pt-3 border-t ${isLight ? 'border-[#EAE0CD]' : 'border-sky-300/15'}`}>
                <label className={`flex items-center gap-2 cursor-pointer select-none min-h-[36px] ${isLight ? 'text-[#1E1B18]' : 'text-slate-200'}`}>
                  <input
                    type="checkbox"
                    checked={settings.showMarginLine}
                    onChange={(e) => onUpdateSettings({ showMarginLine: e.target.checked })}
                    className={`w-4 h-4 rounded cursor-pointer ${isLight ? 'accent-[#9A4319]' : 'accent-sky-400'}`}
                  />
                  <span className="font-semibold">Printed Red Notebook Margin</span>
                </label>
                {settings.showMarginLine && (
                  <input
                    type="range"
                    min="36"
                    max="110"
                    step="2"
                    value={settings.marginLinePosition}
                    onChange={(e) => onUpdateSettings({ marginLinePosition: Number(e.target.value) })}
                    className={`w-20 cursor-pointer h-1.5 rounded-lg ${isLight ? 'accent-[#9A4319]' : 'accent-sky-400'}`}
                    title="Red margin line position"
                  />
                )}
              </div>

              {/* Human Jitter & Ink Blots */}
              <div className={`grid grid-cols-2 gap-2 pt-3 border-t ${isLight ? 'border-[#EAE0CD]' : 'border-sky-300/15'}`}>
                <label className={`flex items-center gap-2 cursor-pointer select-none min-h-[36px] ${isLight ? 'text-[#1E1B18]' : 'text-slate-200'}`}>
                  <input
                    type="checkbox"
                    checked={settings.humanJitter}
                    onChange={(e) => onUpdateSettings({ humanJitter: e.target.checked })}
                    className={`w-4 h-4 rounded cursor-pointer ${isLight ? 'accent-[#9A4319]' : 'accent-sky-400'}`}
                  />
                  <span className="truncate">Natural Pen Jitter</span>
                </label>

                <label className={`flex items-center gap-2 cursor-pointer select-none min-h-[36px] ${isLight ? 'text-[#1E1B18]' : 'text-slate-200'}`}>
                  <input
                    type="checkbox"
                    checked={settings.inkBlots}
                    onChange={(e) => onUpdateSettings({ inkBlots: e.target.checked })}
                    className={`w-4 h-4 rounded cursor-pointer ${isLight ? 'accent-[#9A4319]' : 'accent-sky-400'}`}
                  />
                  <span className="truncate">Ink Smudges</span>
                </label>
              </div>

              {/* Lighting Effect */}
              <div className={`flex items-center justify-between pt-3 border-t ${isLight ? 'border-[#EAE0CD]' : 'border-sky-300/15'}`}>
                <span className={`font-semibold ${isLight ? 'text-[#1E1B18]' : 'text-slate-200'}`}>Lighting / Scan Look</span>
                <select
                  value={settings.paperEffect}
                  onChange={(e) => onUpdateSettings({ paperEffect: e.target.value as PaperEffect })}
                  className={`px-2.5 py-1.5 rounded-xl border text-xs cursor-pointer ${inputSurfaceClass}`}
                >
                  <option value="none">Clean Flat Scan</option>
                  <option value="subtle-shadow">Subtle Desk Shadow</option>
                  <option value="mobile-scan">Mobile Cam Scan Light</option>
                  <option value="desk-light">Warm Study Lamp</option>
                </select>
              </div>

              {/* Student Header */}
              <div className={`pt-3 border-t space-y-2 ${isLight ? 'border-[#EAE0CD]' : 'border-sky-300/15'}`}>
                <label className={`flex items-center gap-2 cursor-pointer select-none min-h-[36px] ${isLight ? 'text-[#1E1B18]' : 'text-slate-200'}`}>
                  <input
                    type="checkbox"
                    checked={headerInfo.enabled}
                    onChange={(e) => onUpdateHeader({ enabled: e.target.checked })}
                    className={`w-4 h-4 rounded cursor-pointer ${isLight ? 'accent-[#9A4319]' : 'accent-sky-400'}`}
                  />
                  <span className="font-semibold">Student Header (Name, Roll No, Date)</span>
                </label>

                {headerInfo.enabled && (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <input
                      type="text"
                      value={headerInfo.name}
                      onChange={(e) => onUpdateHeader({ name: e.target.value })}
                      placeholder="Name"
                      className={`px-2.5 py-1.5 rounded-xl border text-xs ${inputSurfaceClass}`}
                    />
                    <input
                      type="text"
                      value={headerInfo.rollNo}
                      onChange={(e) => onUpdateHeader({ rollNo: e.target.value })}
                      placeholder="Roll No / ID"
                      className={`px-2.5 py-1.5 rounded-xl border text-xs ${inputSurfaceClass}`}
                    />
                    <input
                      type="text"
                      value={headerInfo.subject}
                      onChange={(e) => onUpdateHeader({ subject: e.target.value })}
                      placeholder="Subject"
                      className={`px-2.5 py-1.5 rounded-xl border text-xs ${inputSurfaceClass}`}
                    />
                    <input
                      type="text"
                      value={headerInfo.date}
                      onChange={(e) => onUpdateHeader({ date: e.target.value })}
                      placeholder="Date"
                      className={`px-2.5 py-1.5 rounded-xl border text-xs ${inputSurfaceClass}`}
                    />
                  </div>
                )}
              </div>

              {/* Add Diagram / Sketch */}
              <div className={`pt-3 border-t flex items-center justify-between ${isLight ? 'border-[#EAE0CD]' : 'border-sky-300/15'}`}>
                <span className={`font-semibold ${isLight ? 'text-[#1E1B18]' : 'text-slate-200'}`}>Sketches &amp; Diagrams</span>
                <button
                  type="button"
                  onClick={onOpenDiagramModal}
                  className={`cursor-pointer px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 ${
                    isLight
                      ? 'bg-[#F6EBE0] hover:bg-[#EFE0D0] border-[#E2C2A8] text-[#8F3D15]'
                      : 'bg-sky-500/15 hover:bg-sky-500/25 border-sky-400/35 text-sky-200'
                  }`}
                >
                  <PenTool className={`w-3.5 h-3.5 ${isLight ? 'text-[#9A4319]' : 'text-sky-300'}`} />
                  <span>Add Sketch ({pageDiagrams.length})</span>
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Prominent Generate Handwriting CTA */}
        <button
          type="button"
          onClick={() => {
            if (onGenerateHandwriting) {
              onGenerateHandwriting();
            } else {
              onSwitchToPreviewMobile?.();
            }
          }}
          className={`cursor-pointer w-full min-h-[48px] font-bold px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm active:scale-[0.99] text-sm ${
            isLight
              ? 'bg-[#24201C] hover:bg-[#38322C] text-[#FFFDF8]'
              : 'bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-lg shadow-sky-500/20'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Generate Handwriting</span>
        </button>

        {/* Sidebar Ad Slot (Sits cleanly in flow above the sticky export footer) */}
        <AdBannerSlot
          variant="sidebar"
          slotId="monetag-sidebar-slot"
          onOpenBuyCoffee={onOpenBuyCoffee}
        />
      </div>

      {/* Desktop Sticky Export Bar (Mobile uses unified thumb bar at bottom of screen) */}
      <div
        className={`hidden lg:block p-4 border-t sticky bottom-0 z-20 transition-colors ${
          isLight ? 'bg-[#FFFDF8]/96 border-[#DDD2BC]' : 'bg-[#080F1E]/95 border-sky-300/15'
        }`}
      >
        {isExporting && exportProgress && (
          <div
            className={`mb-3 p-2.5 rounded-xl border text-xs ${
              isLight
                ? 'bg-[#F6EBE0] border-[#E2C2A8] text-[#8F3D15]'
                : 'bg-sky-500/15 border-sky-400/35 text-sky-200'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5 font-semibold">
              <span>Generating PDF...</span>
              <span className="tabular-nums">
                Page {exportProgress.currentPage} of {exportProgress.totalPages}
              </span>
            </div>
            <div className={`w-full h-1.5 rounded-full overflow-hidden ${isLight ? 'bg-[#E5D7C4]' : 'bg-[#070D1A]'}`}>
              <div
                className={`h-full transition-all duration-200 ${isLight ? 'bg-[#9A4319]' : 'bg-sky-400'}`}
                style={{
                  width: `${(exportProgress.currentPage / exportProgress.totalPages) * 100}%`,
                }}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={onDownloadPdf}
            disabled={isExporting}
            className={`cursor-pointer min-h-[44px] disabled:opacity-50 font-bold px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-xs active:scale-98 text-xs whitespace-nowrap ${
              isLight
                ? 'bg-[#24201C] hover:bg-[#38322C] text-[#FFFDF8]'
                : 'bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-md shadow-sky-500/20'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Download PDF ({totalPages}p)</span>
          </button>

          <button
            type="button"
            onClick={onDownloadImage}
            disabled={isExporting}
            className={`cursor-pointer min-h-[44px] font-semibold px-4 rounded-xl flex items-center justify-center gap-2 transition-colors border text-xs whitespace-nowrap active:scale-98 ${
              isLight
                ? 'bg-[#FAF4E8] hover:bg-[#F3E9D6] border-[#D7CCB5] text-[#1E1B18]'
                : 'bg-[#121D35] hover:bg-[#192847] border-sky-300/25 text-white'
            }`}
          >
            <FileText className={`w-4 h-4 ${isLight ? 'text-[#9A4319]' : 'text-amber-300'}`} />
            <span>Save Page {currentPageIndex + 1} PNG</span>
          </button>
        </div>
      </div>
    </div>
  );
}
