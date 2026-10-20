import React, { useRef, useState, useEffect } from 'react';
import {
  FilePlus,
  Trash2,
  Sparkles,
  Upload,
  Type,
  Undo2,
  Redo2,
  ClipboardPaste,
  BookOpen,
  Palette,
  Sliders,
  ChevronDown,
  ChevronUp,
  Download,
  FileText,
  AlignLeft,
  AlignJustify,
  Layers,
  Droplet,
  Shuffle,
  PenTool,
  Check,
  Eye,
} from 'lucide-react';
import { ASSIGNMENT_PRESETS, BUILT_IN_FONTS, INK_PRESETS } from '../constants';
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
}

const PAPER_TYPE_LABELS: { id: PaperType; label: string; badge: string }[] = [
  { id: 'ruled', label: 'Ruled Notebook', badge: 'Standard' },
  { id: 'college-ruled', label: 'College Ruled', badge: 'Popular' },
  { id: 'plain', label: 'Plain White A4', badge: 'Clean' },
  { id: 'yellow-legal', label: 'Yellow Legal Pad', badge: 'Formal' },
  { id: 'grid', label: 'Engineering Grid', badge: 'Math/Code' },
  { id: 'vintage', label: 'Vintage Book Page', badge: 'Classic' },
  { id: 'parchment', label: 'Antique Parchment', badge: 'Texture' },
  { id: 'dot-grid', label: 'Dot Grid Journal', badge: 'Modern' },
  { id: 'leather-diary', label: 'Hardcover Diary', badge: 'Dark' },
  { id: 'kraft-recycled', label: 'Recycled Kraft Paper', badge: 'Eco' },
];

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
  onDeleteDiagram,
  onChangeText,
  onApplyPreset,
  onInsertPageBreak,
  onAutoSplitPages,
  onClearText,
  onDownloadPdf,
  onDownloadImage,
  isExporting = false,
  exportProgress = null,
  onNotify,
  onSwitchToPreviewMobile,
}: UnifiedControlsPanelProps) {
  const isLight = theme === 'light';
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const textFileInputRef = useRef<HTMLInputElement | null>(null);
  const fontFileInputRef = useRef<HTMLInputElement | null>(null);

  // Collapsible section states for a clean, non-overwhelming UI
  const [openSections, setOpenSections] = useState<{
    font: boolean;
    ink: boolean;
    paper: boolean;
    effects: boolean;
    header: boolean;
  }>({
    font: true,
    ink: true,
    paper: true,
    effects: false,
    header: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);
  const [isDraggingFile, setIsDraggingFile] = useState<boolean>(false);
  const [autoPaginateEnabled, setAutoPaginateEnabled] = useState<boolean>(true);

  // Undo / Redo History
  const [history, setHistory] = useState<string[]>([rawText]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const isUndoRedoActionRef = useRef<boolean>(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stats = calculateAssignmentStats(rawText, settings);
  const wordCount = stats.totalWords;
  const charCount = stats.totalChars;

  const allFonts = [...customFonts, ...BUILT_IN_FONTS];
  const pageDiagrams = diagrams.filter((d) => d.pageIndex === currentPageIndex);

  // Sync external text changes into history
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

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const handleUndo = () => {
    if (!canUndo) return;
    const targetIdx = historyIndex - 1;
    const targetText = history[targetIdx];
    isUndoRedoActionRef.current = true;
    setHistoryIndex(targetIdx);
    onChangeText(targetText);
    onNotify?.('Reverted change (Undo)', 'info');
  };

  const handleRedo = () => {
    if (!canRedo) return;
    const targetIdx = historyIndex + 1;
    const targetText = history[targetIdx];
    isUndoRedoActionRef.current = true;
    setHistoryIndex(targetIdx);
    onChangeText(targetText);
    onNotify?.('Restored change (Redo)', 'info');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z') && !e.shiftKey) {
      e.preventDefault();
      handleUndo();
      return;
    }
    if (
      ((e.ctrlKey || e.metaKey) && (e.key === 'y' || e.key === 'Y')) ||
      ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'z' || e.key === 'Z'))
    ) {
      e.preventDefault();
      handleRedo();
      return;
    }
  };

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

          if (autoPaginateEnabled && newStats.needsMorePages) {
            const splitText = autoSplitLongText(nextText, settings);
            const splitStats = calculateAssignmentStats(splitText, settings);
            pushImmediateSnapshot(splitText);
            onChangeText(splitText);
            onNotify?.(
              `Assignment (${splitStats.totalWords} words) pasted & divided into ${splitStats.currentPagesCount} pages!`,
              'success'
            );
          } else {
            pushImmediateSnapshot(nextText);
            onChangeText(nextText);
            onNotify?.('Assignment text pasted successfully!', 'success');
          }
          return;
        }
      }
    } catch {
      // Clipboard read blocked
    }
    textareaRef.current?.focus();
    onNotify?.('Tap inside the box below and paste your text (Ctrl+V / Cmd+V)', 'info');
  };

  const handleTextareaPaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    if (!autoPaginateEnabled) return;
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
        `Assignment (${splitStats.totalWords} words) auto-divided into ${splitStats.currentPagesCount} pages!`,
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
        if (autoPaginateEnabled && fileStats.needsMorePages) {
          const splitText = autoSplitLongText(content, settings);
          const splitStats = calculateAssignmentStats(splitText, settings);
          pushImmediateSnapshot(splitText);
          onChangeText(splitText);
          onNotify?.(
            `File "${file.name}" loaded (${splitStats.totalWords} words) across ${splitStats.currentPagesCount} pages!`,
            'success'
          );
        } else {
          pushImmediateSnapshot(content);
          onChangeText(content);
          onNotify?.(`File "${file.name}" loaded successfully (${content.length} characters)!`, 'success');
        }
      }
    };
    reader.onerror = () => {
      onNotify?.(`Could not read file "${file.name}". Please ensure it is a valid text document.`, 'error');
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

  return (
    <div
      className={`flex flex-col h-full overflow-y-auto scrollbar-thin transition-colors ${
        isLight ? 'bg-slate-50 text-slate-900' : 'bg-[#0e0e12] text-zinc-100'
      }`}
    >
      {/* 1. TOP BAR: TITLE & QUICK ACTIONS */}
      <div
        className={`p-3 sm:p-4 border-b flex items-center justify-between gap-2 sticky top-0 z-20 backdrop-blur-md ${
          isLight ? 'bg-white/95 border-slate-200 shadow-2xs' : 'bg-[#121216]/95 border-white/10'
        }`}
      >
        <div className="min-w-0">
          <h2 className="text-sm font-bold tracking-tight uppercase font-mono-code flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-[#6366f1]" />
            <span>Handwriting Options</span>
          </h2>
          <p className={`text-[11px] truncate ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
            Configure text, handwriting font, ink, and paper
          </p>
        </div>

        {/* Mobile Switch to View Paper button */}
        {onSwitchToPreviewMobile && (
          <button
            type="button"
            onClick={onSwitchToPreviewMobile}
            className="lg:hidden cursor-pointer px-3 py-1.5 rounded-lg bg-[#6366f1] hover:bg-indigo-600 text-white font-mono-code text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 shrink-0"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Paper</span>
          </button>
        )}
      </div>

      <div className="p-3 sm:p-4 space-y-3.5 flex-1">
        {/* ========================================================================= */}
        {/* SECTION 1: INPUT TEXT AREA */}
        {/* ========================================================================= */}
        <div
          className={`rounded-xl border transition-all overflow-hidden ${
            isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-[#141418] border-white/10'
          }`}
        >
          {/* Header & Quick Action Buttons */}
          <div
            className={`px-3 py-2 border-b flex items-center justify-between gap-2 flex-wrap ${
              isLight ? 'bg-slate-100/70 border-slate-200' : 'bg-[#18181f] border-white/5'
            }`}
          >
            <span className="font-mono-code text-[11px] font-bold tracking-wider uppercase flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#6366f1]" />
              Text to Convert
            </span>

            <div className="flex items-center gap-1.5 flex-wrap">
              {/* Quick Paste Button */}
              <button
                type="button"
                onClick={handlePasteClipboard}
                className={`cursor-pointer font-mono-code text-[11px] font-bold rounded-md px-2 py-1 flex items-center gap-1 transition-all border ${
                  isLight
                    ? 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-700'
                    : 'bg-[#6366f1]/20 hover:bg-[#6366f1]/30 border-[#6366f1]/40 text-indigo-300'
                }`}
                title="Paste text from clipboard"
              >
                <ClipboardPaste className="w-3 h-3 text-[#6366f1]" />
                <span>Paste</span>
              </button>

              {/* Load File Button */}
              <button
                type="button"
                onClick={() => textFileInputRef.current?.click()}
                className={`cursor-pointer font-mono-code text-[11px] rounded-md px-2 py-1 flex items-center gap-1 transition-colors border ${
                  isLight
                    ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700'
                    : 'bg-[#1e1e24] hover:bg-[#282830] border-white/10 text-zinc-300'
                }`}
                title="Upload .txt, .md, or doc file"
              >
                <Upload className="w-3 h-3 text-[#6366f1]" />
                <span>File</span>
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

              {/* Undo / Redo */}
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={handleUndo}
                  disabled={!canUndo}
                  className={`cursor-pointer p-1 rounded-l disabled:opacity-25 transition-colors border ${
                    isLight
                      ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700'
                      : 'bg-[#1e1e24] hover:bg-[#282830] border-white/10 text-zinc-300'
                  }`}
                  title="Undo (Ctrl+Z)"
                >
                  <Undo2 className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={handleRedo}
                  disabled={!canRedo}
                  className={`cursor-pointer p-1 rounded-r disabled:opacity-25 transition-colors border-y border-r ${
                    isLight
                      ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700'
                      : 'bg-[#1e1e24] hover:bg-[#282830] border-white/10 text-zinc-300'
                  }`}
                  title="Redo (Ctrl+Y)"
                >
                  <Redo2 className="w-3 h-3" />
                </button>
              </div>

              {/* Clear */}
              {showClearConfirm ? (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      pushImmediateSnapshot('');
                      onClearText();
                      setShowClearConfirm(false);
                    }}
                    className="cursor-pointer text-[10px] bg-rose-600 hover:bg-rose-500 text-white font-bold px-1.5 py-0.5 rounded"
                  >
                    Clear?
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowClearConfirm(false)}
                    className="cursor-pointer text-[10px] bg-slate-300 text-slate-800 px-1.5 py-0.5 rounded"
                  >
                    No
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(true)}
                  disabled={!rawText.trim()}
                  className={`cursor-pointer p-1 rounded disabled:opacity-25 transition-colors ${
                    isLight ? 'text-slate-400 hover:text-rose-600' : 'text-zinc-500 hover:text-rose-400'
                  }`}
                  title="Clear text"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Textarea */}
          <div className="p-2 sm:p-2.5">
            <textarea
              ref={textareaRef}
              value={rawText}
              onChange={(e) => onChangeText(e.target.value)}
              onPaste={handleTextareaPaste}
              onKeyDown={handleKeyDown}
              placeholder="Paste or type your assignment text here...&#10;&#10;• Changes transform into handwriting in real-time&#10;• Supports multi-page automatic splitting&#10;• Use ---page--- for manual page breaks"
              rows={8}
              className={`w-full p-2.5 sm:p-3 font-mono-code text-xs sm:text-[13px] rounded-lg resize-y focus:outline-hidden focus:ring-2 focus:ring-[#6366f1]/50 border transition-all leading-relaxed ${
                isLight
                  ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'
                  : 'bg-[#0c0c0e] border-zinc-800 text-zinc-100 placeholder:text-zinc-600'
              }`}
              spellCheck={false}
            />
          </div>

          {/* Text stats and Auto-Pages notice */}
          <div
            className={`px-3 py-2 border-t flex items-center justify-between gap-2 text-[11px] font-mono-code flex-wrap ${
              isLight ? 'bg-slate-100/60 text-slate-600 border-slate-200' : 'bg-[#18181f]/80 text-zinc-400 border-white/5'
            }`}
          >
            <div className="flex items-center gap-2">
              <span>{wordCount} words</span>
              <span>·</span>
              <span>{charCount} chars</span>
              <span>·</span>
              <span className="text-[#6366f1] font-bold">
                {totalPages} {totalPages === 1 ? 'page' : 'pages'}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {stats.needsMorePages && onAutoSplitPages && (
                <button
                  type="button"
                  onClick={onAutoSplitPages}
                  className="cursor-pointer px-2 py-0.5 rounded bg-amber-500 hover:bg-amber-600 text-white font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-2xs active:scale-95 animate-pulse"
                  title="Click to automatically allocate words into needed pages"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Auto-Split ({stats.recommendedPages} Pages)</span>
                </button>
              )}

              <button
                type="button"
                onClick={onInsertPageBreak}
                className="cursor-pointer px-2 py-0.5 rounded bg-[#6366f1] hover:bg-indigo-600 text-white font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 transition-colors"
                title="Insert page break at end"
              >
                <FilePlus className="w-3 h-3" />
                <span>+ Page Break</span>
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 2: HANDWRITING FONT & SIZE */}
        {/* ========================================================================= */}
        <div
          className={`rounded-xl border transition-all overflow-hidden ${
            isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-[#141418] border-white/10'
          }`}
        >
          <button
            type="button"
            onClick={() => toggleSection('font')}
            className={`w-full px-3 py-2.5 flex items-center justify-between text-left cursor-pointer transition-colors ${
              isLight ? 'hover:bg-slate-50' : 'hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4 text-[#6366f1]" />
              <span className="font-mono-code text-xs font-bold uppercase tracking-wider">
                Handwriting Font &amp; Size
              </span>
            </div>
            {openSections.font ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {openSections.font && (
            <div className="p-3 pt-1 border-t space-y-3 font-mono-code text-xs border-inherit">
              {/* Font Selector Dropdown */}
              <div>
                <label className="block text-[11px] font-semibold mb-1 opacity-75">
                  Select Handwriting Font:
                </label>
                <div className="flex items-center gap-2">
                  <select
                    value={settings.fontId}
                    onChange={(e) => onUpdateSettings({ fontId: e.target.value })}
                    className={`flex-1 px-3 py-2 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
                      isLight
                        ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#6366f1]'
                        : 'bg-[#1e1e24] border-zinc-700 text-zinc-100 focus:border-[#6366f1]'
                    }`}
                  >
                    {allFonts.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name} {f.isCustom ? '★ (Custom)' : ''}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => fontFileInputRef.current?.click()}
                    className={`cursor-pointer px-2.5 py-2 rounded-lg border text-[11px] font-bold flex items-center gap-1 shrink-0 transition-colors ${
                      isLight
                        ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                        : 'bg-[#1e1e24] hover:bg-[#282830] border-zinc-700 text-zinc-200'
                    }`}
                    title="Upload your custom handwriting font file (.ttf, .otf, .woff)"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#6366f1]" />
                    <span>Upload Font</span>
                  </button>
                  <input
                    ref={fontFileInputRef}
                    type="file"
                    accept=".ttf,.otf,.woff,.woff2"
                    onChange={handleFontFileChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Font Size Slider */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-semibold opacity-75">Font Size:</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onUpdateSettings({ fontSize: Math.max(12, settings.fontSize - 1) })}
                      disabled={settings.fontSize <= 12}
                      className="px-1.5 py-0.5 rounded border text-[10px] disabled:opacity-30 cursor-pointer"
                    >
                      A-
                    </button>
                    <span className="font-bold text-[#6366f1] px-1">{settings.fontSize}px</span>
                    <button
                      type="button"
                      onClick={() => onUpdateSettings({ fontSize: Math.min(32, settings.fontSize + 1) })}
                      disabled={settings.fontSize >= 32}
                      className="px-1.5 py-0.5 rounded border text-[10px] disabled:opacity-30 cursor-pointer"
                    >
                      A+
                    </button>
                  </div>
                </div>
                <input
                  type="range"
                  min="12"
                  max="32"
                  step="1"
                  value={settings.fontSize}
                  onChange={(e) => onUpdateSettings({ fontSize: Number(e.target.value) })}
                  className="w-full accent-[#6366f1] cursor-pointer h-1.5 rounded-lg"
                />
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* SECTION 3: HANDWRITING INK COLOR */}
        {/* ========================================================================= */}
        <div
          className={`rounded-xl border transition-all overflow-hidden ${
            isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-[#141418] border-white/10'
          }`}
        >
          <button
            type="button"
            onClick={() => toggleSection('ink')}
            className={`w-full px-3 py-2.5 flex items-center justify-between text-left cursor-pointer transition-colors ${
              isLight ? 'hover:bg-slate-50' : 'hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-[#6366f1]" />
              <span className="font-mono-code text-xs font-bold uppercase tracking-wider">
                Handwriting Ink Color
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="w-4 h-4 rounded-full border border-black/20 shadow-2xs inline-block"
                style={{ backgroundColor: settings.inkColor }}
              />
              {openSections.ink ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          {openSections.ink && (
            <div className="p-3 pt-1 border-t space-y-3 font-mono-code text-xs border-inherit">
              {/* Quick Swatches */}
              <div>
                <label className="block text-[11px] font-semibold mb-1.5 opacity-75">
                  Popular Ink Swatches:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {INK_PRESETS.slice(0, 6).map((preset) => {
                    const isSelected = settings.inkColor.toLowerCase() === preset.color.toLowerCase();
                    return (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() =>
                          onUpdateSettings({
                            inkColor: preset.color,
                            inkOpacity: preset.opacity,
                          })
                        }
                        className={`cursor-pointer px-2 py-1.5 rounded-lg border text-left flex items-center gap-2 transition-all ${
                          isSelected
                            ? 'ring-2 ring-[#6366f1] border-[#6366f1] bg-[#6366f1]/10 font-bold'
                            : isLight
                            ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                            : 'bg-[#1e1e24] hover:bg-[#282830] border-zinc-700 text-zinc-200'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full shrink-0 border border-black/20 shadow-2xs"
                          style={{ backgroundColor: preset.color }}
                        />
                        <span className="truncate text-[11px]">{preset.name.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Color Picker & Opacity */}
              <div className="flex items-center justify-between gap-3 pt-1 border-t border-inherit">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold opacity-75">Custom Ink:</span>
                  <input
                    type="color"
                    value={settings.inkColor}
                    onChange={(e) => onUpdateSettings({ inkColor: e.target.value })}
                    className="w-7 h-7 rounded border border-slate-300 cursor-pointer p-0.5 bg-transparent"
                    title="Choose custom ink color"
                  />
                  <span className="text-[11px] uppercase font-bold text-[#6366f1]">
                    {settings.inkColor}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] opacity-75">Intensity:</span>
                  <input
                    type="range"
                    min="0.75"
                    max="1"
                    step="0.02"
                    value={settings.inkOpacity}
                    onChange={(e) => onUpdateSettings({ inkOpacity: Number(e.target.value) })}
                    className="w-20 accent-[#6366f1] cursor-pointer h-1.5 rounded-lg"
                    title="Ink flow opacity"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* SECTION 4: PAPER TYPE & MARGINS */}
        {/* ========================================================================= */}
        <div
          className={`rounded-xl border transition-all overflow-hidden ${
            isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-[#141418] border-white/10'
          }`}
        >
          <button
            type="button"
            onClick={() => toggleSection('paper')}
            className={`w-full px-3 py-2.5 flex items-center justify-between text-left cursor-pointer transition-colors ${
              isLight ? 'hover:bg-slate-50' : 'hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#6366f1]" />
              <span className="font-mono-code text-xs font-bold uppercase tracking-wider">
                Paper Style &amp; Margins
              </span>
            </div>
            {openSections.paper ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {openSections.paper && (
            <div className="p-3 pt-1 border-t space-y-3 font-mono-code text-xs border-inherit">
              {/* Paper Type Dropdown */}
              <div>
                <label className="block text-[11px] font-semibold mb-1 opacity-75">
                  Paper Texture &amp; Ruling:
                </label>
                <select
                  value={settings.paperType}
                  onChange={(e) => onUpdateSettings({ paperType: e.target.value as PaperType })}
                  className={`w-full px-3 py-2 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
                    isLight
                      ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#6366f1]'
                      : 'bg-[#1e1e24] border-zinc-700 text-zinc-100 focus:border-[#6366f1]'
                  }`}
                >
                  {PAPER_TYPE_LABELS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label} ({p.badge})
                    </option>
                  ))}
                </select>
              </div>

              {/* Justification Toggle */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold opacity-75">Text Alignment:</span>
                <div className="flex items-center p-0.5 rounded-lg border border-inherit">
                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ justification: 'left' })}
                    className={`cursor-pointer px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition-all ${
                      settings.justification === 'left'
                        ? 'bg-[#6366f1] text-white shadow-2xs'
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <AlignLeft className="w-3.5 h-3.5" />
                    <span>Left</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ justification: 'full' })}
                    className={`cursor-pointer px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition-all ${
                      settings.justification === 'full'
                        ? 'bg-[#6366f1] text-white shadow-2xs'
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <AlignJustify className="w-3.5 h-3.5" />
                    <span>Justify</span>
                  </button>
                </div>
              </div>

              {/* Line Height & Top Margin Sliders */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="opacity-75">Line Height:</span>
                    <span className="font-bold text-[#6366f1]">{settings.lineHeight}px</span>
                  </div>
                  <input
                    type="range"
                    min="22"
                    max="44"
                    step="1"
                    value={settings.lineHeight}
                    onChange={(e) => onUpdateSettings({ lineHeight: Number(e.target.value) })}
                    className="w-full accent-[#6366f1] cursor-pointer h-1.5 rounded-lg"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="opacity-75">Top Margin:</span>
                    <span className="font-bold text-[#6366f1]">{settings.topMargin}px</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="140"
                    step="2"
                    value={settings.topMargin}
                    onChange={(e) => onUpdateSettings({ topMargin: Number(e.target.value) })}
                    className="w-full accent-[#6366f1] cursor-pointer h-1.5 rounded-lg"
                  />
                </div>
              </div>

              {/* Red Margin Line Toggle */}
              <div className="flex items-center justify-between pt-1 border-t border-inherit">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={settings.showMarginLine}
                    onChange={(e) => onUpdateSettings({ showMarginLine: e.target.checked })}
                    className="accent-[#6366f1] w-4 h-4 rounded cursor-pointer"
                  />
                  <span className="text-[11px] font-semibold">Show Red Margin Line</span>
                </label>
                {settings.showMarginLine && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] opacity-75">Position:</span>
                    <input
                      type="range"
                      min="40"
                      max="120"
                      step="2"
                      value={settings.marginLinePosition}
                      onChange={(e) => onUpdateSettings({ marginLinePosition: Number(e.target.value) })}
                      className="w-16 accent-[#6366f1] cursor-pointer h-1.5 rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* SECTION 5: NATURAL JITTER & INK SMUDGE EFFECTS */}
        {/* ========================================================================= */}
        <div
          className={`rounded-xl border transition-all overflow-hidden ${
            isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-[#141418] border-white/10'
          }`}
        >
          <button
            type="button"
            onClick={() => toggleSection('effects')}
            className={`w-full px-3 py-2.5 flex items-center justify-between text-left cursor-pointer transition-colors ${
              isLight ? 'hover:bg-slate-50' : 'hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-2">
              <Shuffle className="w-4 h-4 text-[#6366f1]" />
              <span className="font-mono-code text-xs font-bold uppercase tracking-wider">
                Natural Handwriting Jitter &amp; Inks
              </span>
            </div>
            {openSections.effects ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {openSections.effects && (
            <div className="p-3 pt-1 border-t space-y-3 font-mono-code text-xs border-inherit">
              {/* Jitter */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={settings.humanJitter}
                    onChange={(e) => onUpdateSettings({ humanJitter: e.target.checked })}
                    className="accent-[#6366f1] w-4 h-4 rounded cursor-pointer"
                  />
                  <span className="text-[11px] font-semibold">Natural Pen Pressure Jitter</span>
                </label>
                {settings.humanJitter && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] opacity-75">Level {settings.jitterIntensity}:</span>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      value={settings.jitterIntensity}
                      onChange={(e) => onUpdateSettings({ jitterIntensity: Number(e.target.value) })}
                      className="w-16 accent-[#6366f1] cursor-pointer h-1.5 rounded-lg"
                    />
                  </div>
                )}
              </div>

              {/* Ink Blots */}
              <div className="flex items-center justify-between pt-1 border-t border-inherit">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={settings.inkBlots}
                    onChange={(e) => onUpdateSettings({ inkBlots: e.target.checked })}
                    className="accent-[#6366f1] w-4 h-4 rounded cursor-pointer"
                  />
                  <span className="text-[11px] font-semibold">Ink Smudges &amp; End Blots</span>
                </label>
                {settings.inkBlots && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] opacity-75">Intensity:</span>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      value={settings.inkBlotIntensity}
                      onChange={(e) => onUpdateSettings({ inkBlotIntensity: Number(e.target.value) })}
                      className="w-16 accent-[#6366f1] cursor-pointer h-1.5 rounded-lg"
                    />
                  </div>
                )}
              </div>

              {/* Paper Effect */}
              <div className="flex items-center justify-between pt-1 border-t border-inherit">
                <span className="text-[11px] font-semibold opacity-75">Lighting Effect:</span>
                <select
                  value={settings.paperEffect}
                  onChange={(e) => onUpdateSettings({ paperEffect: e.target.value as PaperEffect })}
                  className={`px-2 py-1 rounded border text-xs cursor-pointer ${
                    isLight ? 'bg-slate-50 border-slate-300' : 'bg-[#1e1e24] border-zinc-700'
                  }`}
                >
                  <option value="none">None (Clean Print)</option>
                  <option value="subtle-shadow">Subtle Desk Shadow</option>
                  <option value="mobile-scan">Mobile Cam Scan Light</option>
                  <option value="desk-light">Warm Study Lamp</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* SECTION 6: STUDENT SUBMISSION HEADER & DIAGRAMS */}
        {/* ========================================================================= */}
        <div
          className={`rounded-xl border transition-all overflow-hidden ${
            isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-[#141418] border-white/10'
          }`}
        >
          <button
            type="button"
            onClick={() => toggleSection('header')}
            className={`w-full px-3 py-2.5 flex items-center justify-between text-left cursor-pointer transition-colors ${
              isLight ? 'hover:bg-slate-50' : 'hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#6366f1]" />
              <span className="font-mono-code text-xs font-bold uppercase tracking-wider">
                Student Header &amp; Diagrams
              </span>
            </div>
            {openSections.header ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {openSections.header && (
            <div className="p-3 pt-1 border-t space-y-3 font-mono-code text-xs border-inherit">
              {/* Header Toggle */}
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={headerInfo.enabled}
                  onChange={(e) => onUpdateHeader({ enabled: e.target.checked })}
                  className="accent-[#6366f1] w-4 h-4 rounded cursor-pointer"
                />
                <span className="text-[11px] font-semibold">Enable Student Header on Pages</span>
              </label>

              {headerInfo.enabled && (
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-inherit">
                  <div>
                    <label className="text-[10px] opacity-75 block mb-0.5">Name:</label>
                    <input
                      type="text"
                      value={headerInfo.name}
                      onChange={(e) => onUpdateHeader({ name: e.target.value })}
                      placeholder="Student Name"
                      className={`w-full px-2 py-1 rounded border text-xs ${
                        isLight ? 'bg-slate-50 border-slate-300' : 'bg-[#1e1e24] border-zinc-700'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] opacity-75 block mb-0.5">Roll No / ID:</label>
                    <input
                      type="text"
                      value={headerInfo.rollNo}
                      onChange={(e) => onUpdateHeader({ rollNo: e.target.value })}
                      placeholder="Roll No"
                      className={`w-full px-2 py-1 rounded border text-xs ${
                        isLight ? 'bg-slate-50 border-slate-300' : 'bg-[#1e1e24] border-zinc-700'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] opacity-75 block mb-0.5">Subject:</label>
                    <input
                      type="text"
                      value={headerInfo.subject}
                      onChange={(e) => onUpdateHeader({ subject: e.target.value })}
                      placeholder="Subject"
                      className={`w-full px-2 py-1 rounded border text-xs ${
                        isLight ? 'bg-slate-50 border-slate-300' : 'bg-[#1e1e24] border-zinc-700'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] opacity-75 block mb-0.5">Date:</label>
                    <input
                      type="text"
                      value={headerInfo.date}
                      onChange={(e) => onUpdateHeader({ date: e.target.value })}
                      placeholder="Date"
                      className={`w-full px-2 py-1 rounded border text-xs ${
                        isLight ? 'bg-slate-50 border-slate-300' : 'bg-[#1e1e24] border-zinc-700'
                      }`}
                    />
                  </div>
                </div>
              )}

              {/* Diagrams Action */}
              <div className="pt-2 border-t border-inherit flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold">Sketches &amp; Diagrams:</span>
                <button
                  type="button"
                  onClick={onOpenDiagramModal}
                  className={`cursor-pointer px-2.5 py-1 rounded-lg border text-[11px] font-bold flex items-center gap-1 transition-colors ${
                    isLight
                      ? 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-700'
                      : 'bg-[#6366f1]/20 hover:bg-[#6366f1]/30 border-[#6366f1]/40 text-indigo-300'
                  }`}
                >
                  <PenTool className="w-3.5 h-3.5 text-[#6366f1]" />
                  <span>+ Add Diagram ({pageDiagrams.length})</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 7: STICKY EXPORT ACTIONS BAR (SAURABH DAWARE STYLE) */}
      {/* ========================================================================= */}
      <div
        className={`p-3 sm:p-4 border-t sticky bottom-0 z-20 backdrop-blur-md shadow-lg transition-colors ${
          isLight ? 'bg-white/95 border-slate-200' : 'bg-[#121216]/95 border-white/10'
        }`}
      >
        {isExporting && exportProgress && (
          <div className="mb-2.5 p-2 rounded-lg bg-[#6366f1]/15 border border-[#6366f1]/30 text-xs font-mono-code">
            <div className="flex items-center justify-between mb-1 font-bold">
              <span>Generating Authentic Output...</span>
              <span>
                Page {exportProgress.currentPage} of {exportProgress.totalPages}
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#6366f1] h-full transition-all duration-200"
                style={{
                  width: `${(exportProgress.currentPage / exportProgress.totalPages) * 100}%`,
                }}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* Download PDF Button */}
          <button
            type="button"
            onClick={onDownloadPdf}
            disabled={isExporting}
            className="cursor-pointer bg-[#6366f1] hover:bg-indigo-600 disabled:opacity-50 text-white font-mono-code font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 text-xs uppercase tracking-wider"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF ({totalPages} {totalPages === 1 ? 'Page' : 'Pages'})</span>
          </button>

          {/* Download Image Button */}
          <button
            type="button"
            onClick={onDownloadImage}
            disabled={isExporting}
            className={`cursor-pointer font-mono-code font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-all border text-xs uppercase tracking-wider active:scale-98 ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                : 'bg-[#1e1e24] hover:bg-[#282830] border-white/10 text-white'
            }`}
          >
            <FileText className="w-4 h-4 text-[#6366f1]" />
            <span>Download Page {currentPageIndex + 1} (PNG)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
