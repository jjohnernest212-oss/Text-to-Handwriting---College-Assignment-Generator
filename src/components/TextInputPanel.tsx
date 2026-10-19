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
} from 'lucide-react';
import { ASSIGNMENT_PRESETS } from '../constants';
import { AssignmentPreset, PageSettings } from '../types';
import { calculateAssignmentStats, autoSplitLongText } from '../utils/paginationUtils';

interface TextInputPanelProps {
  theme?: 'dark' | 'light';
  rawText: string;
  currentPageIndex: number;
  totalPages: number;
  settings?: PageSettings;
  fontSize?: number;
  onUpdateFontSize?: (size: number) => void;
  onChangeText: (text: string) => void;
  onApplyPreset: (preset: AssignmentPreset) => void;
  onInsertPageBreak: () => void;
  onAutoSplitPages?: () => void;
  onClearText: () => void;
  onCustomFontUpload?: (file: File) => void;
  onNotify?: (message: string, type: 'success' | 'error' | 'info') => void;
}

export default function TextInputPanel({
  theme = 'dark',
  rawText,
  currentPageIndex: _currentPageIndex,
  totalPages,
  settings,
  fontSize,
  onUpdateFontSize,
  onChangeText,
  onApplyPreset,
  onInsertPageBreak,
  onAutoSplitPages,
  onClearText,
  onCustomFontUpload: _onCustomFontUpload,
  onNotify,
}: TextInputPanelProps) {
  const isLight = theme === 'light';
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);
  const [isDraggingFile, setIsDraggingFile] = useState<boolean>(false);

  // Automatic multi-page allocation mode (defaults to enabled for seamless student experience)
  const [autoPaginateEnabled, setAutoPaginateEnabled] = useState<boolean>(true);

  // Undo / Redo History State Management
  const [history, setHistory] = useState<string[]>([rawText]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const isUndoRedoActionRef = useRef<boolean>(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Assignment text statistics & dynamic page requirements
  const stats = calculateAssignmentStats(rawText, settings);
  const wordCount = stats.totalWords;
  const charCount = stats.totalChars;

  // Sync external text changes into history
  useEffect(() => {
    if (isUndoRedoActionRef.current) {
      isUndoRedoActionRef.current = false;
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Debounce updates when typing so words group naturally into undo steps
    debounceTimerRef.current = setTimeout(() => {
      setHistory((prev) => {
        if (prev[historyIndex] === rawText) return prev;
        const next = prev.slice(0, historyIndex + 1);
        next.push(rawText);
        if (next.length > 50) next.shift(); // Keep up to 50 states
        setHistoryIndex(next.length - 1);
        return next;
      });
    }, 350);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
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
    // Undo: Ctrl+Z or Cmd+Z (without shift)
    if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z') && !e.shiftKey) {
      e.preventDefault();
      handleUndo();
      return;
    }
    // Redo: Ctrl+Y, Cmd+Y, or Ctrl+Shift+Z, Cmd+Shift+Z
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
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    setHistory((prev) => {
      const next = prev.slice(0, historyIndex + 1);
      next.push(newText);
      if (next.length > 50) next.shift();
      setHistoryIndex(next.length - 1);
      return next;
    });
  };

  /**
   * Quick Paste from Clipboard with automatic page calculation
   */
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
              `Assignment (${splitStats.totalWords} words) pasted & auto-divided across ${splitStats.currentPagesCount} pages!`,
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
      // Clipboard read may be blocked by browser permission
    }
    textareaRef.current?.focus();
    onNotify?.('Tap inside the rectangle below and paste your assignment (Ctrl+V / Cmd+V)', 'info');
  };

  /**
   * Handle native Ctrl+V paste event in textarea
   */
  const handleTextareaPaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    if (!autoPaginateEnabled) return;
    const pasted = e.clipboardData.getData('text');
    if (!pasted || !pasted.trim()) return;

    const target = e.currentTarget;
    const start = target.selectionStart;
    const end = target.selectionEnd;
    const nextText = rawText.substring(0, start) + pasted + rawText.substring(end);

    const newStats = calculateAssignmentStats(nextText, settings);
    // If the combined text requires more than 1 page, automatically distribute it
    if (newStats.needsMorePages) {
      e.preventDefault();
      const splitText = autoSplitLongText(nextText, settings);
      const splitStats = calculateAssignmentStats(splitText, settings);
      pushImmediateSnapshot(splitText);
      onChangeText(splitText);
      onNotify?.(
        `Assignment (${splitStats.totalWords} words) automatically divided across ${splitStats.currentPagesCount} pages!`,
        'success'
      );
    }
  };

  const handleInsertDelimiter = () => {
    const textarea = textareaRef.current;
    if (!textarea) {
      onInsertPageBreak();
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = rawText;
    const before = text.substring(0, start);
    const after = text.substring(end);

    const delimiter = '\n\n---page---\n\n';
    const newText = before + delimiter + after;
    pushImmediateSnapshot(newText);
    onChangeText(newText);

    setTimeout(() => {
      textarea.focus();
      const newPos = start + delimiter.length;
      textarea.setSelectionRange(newPos, newPos);
    }, 50);

    onNotify?.('Page break inserted', 'info');
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
            `File "${file.name}" loaded (${splitStats.totalWords} words) and auto-split into ${splitStats.currentPagesCount} pages!`,
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

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessFile(file);
      e.target.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(true);
  };

  const handleDragLeave = () => {
    setIsDraggingFile(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col h-full rounded-lg border overflow-hidden relative transition-colors ${
        isLight
          ? isDraggingFile
            ? 'bg-slate-50 border-[#6366f1] ring-2 ring-[#6366f1]/40'
            : 'bg-white border-slate-200 shadow-xs'
          : isDraggingFile
          ? 'bg-[#0c0c0e] border-[#6366f1] ring-2 ring-[#6366f1]/40'
          : 'bg-[#0c0c0e] border-[#27272a]'
      }`}
    >
      {/* Pane Label & Toolbar */}
      <div
        className={`px-4 py-3 border-b flex items-center justify-between gap-2 flex-wrap ${
          isLight
            ? 'border-slate-200 bg-slate-50'
            : 'border-[#27272a] bg-[#121214]'
        }`}
      >
        <div>
          <span className="font-mono-code text-[11px] text-[#6366f1] tracking-widest uppercase font-bold block">
            Assignment Text Input
          </span>
          <span
            className={`font-mono-code text-[10px] tracking-wider ${
              isLight ? 'text-slate-500' : 'text-[#e4e4e7]/60'
            }`}
          >
            PASTE HOMEWORK OR LOAD FILE
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Auto-Pagination Mode Switch */}
          <button
            type="button"
            onClick={() => {
              const next = !autoPaginateEnabled;
              setAutoPaginateEnabled(next);
              onNotify?.(
                next
                  ? 'Auto-Pagination ON: Automatically adds pages according to word count'
                  : 'Auto-Pagination OFF: Manual ---page--- delimiters only',
                'info'
              );
            }}
            className={`cursor-pointer font-mono-code text-[11px] font-bold rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 transition-all active:scale-95 border ${
              autoPaginateEnabled
                ? isLight
                  ? 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-800 shadow-2xs'
                  : 'bg-amber-950/40 hover:bg-amber-900/50 border-amber-500/50 text-amber-300'
                : isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-500'
                : 'bg-zinc-800/60 hover:bg-zinc-800 border-zinc-700 text-zinc-500'
            }`}
            title={
              autoPaginateEnabled
                ? 'Auto-Pagination is ON (adds pages automatically based on assignment total words)'
                : 'Auto-Pagination is OFF (click to enable automatic multi-page allocation)'
            }
          >
            <Sparkles className={`w-3.5 h-3.5 ${autoPaginateEnabled ? 'text-amber-500 animate-pulse' : 'text-zinc-400'}`} />
            <span className="hidden sm:inline">Auto-Pages:</span>
            <span>{autoPaginateEnabled ? 'ON' : 'OFF'}</span>
          </button>

          {/* Quick Paste Assignment Button */}
          <button
            type="button"
            onClick={handlePasteClipboard}
            className={`cursor-pointer font-mono-code text-[11px] font-bold rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 transition-all active:scale-95 border ${
              isLight
                ? 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-700 shadow-2xs'
                : 'bg-[#6366f1]/20 hover:bg-[#6366f1]/30 border-[#6366f1]/50 text-indigo-300'
            }`}
            title="Paste assignment text from clipboard"
          >
            <ClipboardPaste className="w-3.5 h-3.5 text-[#6366f1]" />
            <span>Paste</span>
          </button>

          {/* Undo and Redo Button Group */}
          <div
            className={`flex items-center p-0.5 border rounded-lg ${
              isLight
                ? 'bg-white border-slate-200 shadow-2xs'
                : 'bg-[#18181b] border-[#27272a]'
            }`}
          >
            <button
              type="button"
              onClick={handleUndo}
              disabled={!canUndo}
              className={`cursor-pointer p-1.5 rounded-md transition-colors ${
                isLight
                  ? 'text-slate-700 hover:text-slate-950 disabled:opacity-25 hover:bg-slate-100'
                  : 'text-zinc-300 hover:text-white disabled:opacity-25 hover:bg-white/10'
              }`}
              title="Undo change (Ctrl+Z / Cmd+Z)"
              aria-label="Undo"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <div className={`w-[1px] h-3.5 ${isLight ? 'bg-slate-200' : 'bg-white/10'}`} />
            <button
              type="button"
              onClick={handleRedo}
              disabled={!canRedo}
              className={`cursor-pointer p-1.5 rounded-md transition-colors ${
                isLight
                  ? 'text-slate-700 hover:text-slate-950 disabled:opacity-25 hover:bg-slate-100'
                  : 'text-zinc-300 hover:text-white disabled:opacity-25 hover:bg-white/10'
              }`}
              title="Redo change (Ctrl+Y / Cmd+Shift+Z)"
              aria-label="Redo"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Load File Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer font-mono-code text-[11px] rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 transition-colors border ${
              isLight
                ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-800 shadow-2xs'
                : 'bg-[#18181b] hover:bg-[#222226] border-[#27272a] hover:border-[#6366f1] text-[#e4e4e7]'
            }`}
            title="Import assignment file (.txt, .md, .doc, .json)"
          >
            <Upload className="w-3 h-3 text-[#6366f1]" />
            <span className="hidden sm:inline">Load File</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.md,.markdown,.text,.rtf,.json,.doc,.docx,.pdf"
            onChange={handleFileInputChange}
            className="hidden"
          />

          {/* Preset Selector */}
          <select
            onChange={(e) => {
              const found = ASSIGNMENT_PRESETS.find((p) => p.id === e.target.value);
              if (found) {
                pushImmediateSnapshot(found.content);
                onApplyPreset(found);
              }
            }}
            defaultValue=""
            className={`font-mono-code text-[11px] rounded-lg px-2.5 py-1 cursor-pointer transition-colors border ${
              isLight
                ? 'bg-white border-slate-200 text-slate-800 hover:border-[#6366f1]'
                : 'bg-[#18181b] border-[#27272a] text-[#e4e4e7] hover:border-[#6366f1]'
            }`}
          >
            <option value="" disabled>
              PRESETS...
            </option>
            {ASSIGNMENT_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>

          {/* Clear button with safe inline confirmation */}
          {showClearConfirm ? (
            <div
              className={`flex items-center gap-1 rounded-lg px-1.5 py-0.5 border animate-in fade-in duration-100 ${
                isLight ? 'bg-white border-rose-300' : 'bg-[#18181b] border-rose-500/40'
              }`}
            >
              <span className="text-[10px] text-rose-500 font-bold uppercase">Clear?</span>
              <button
                type="button"
                onClick={() => {
                  pushImmediateSnapshot('');
                  onClearText();
                  setShowClearConfirm(false);
                }}
                className="cursor-pointer text-[10px] bg-rose-600 hover:bg-rose-500 text-white font-bold px-1.5 py-0.5 rounded transition-colors uppercase"
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className={`cursor-pointer text-[10px] px-1.5 py-0.5 rounded transition-colors uppercase ${
                  isLight ? 'bg-slate-200 hover:bg-slate-300 text-slate-800' : 'bg-[#27272a] hover:bg-[#3f3f46] text-[#e4e4e7]'
                }`}
              >
                No
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (!rawText.trim()) return;
                setShowClearConfirm(true);
              }}
              disabled={!rawText.trim()}
              className={`cursor-pointer p-1 rounded-lg transition-colors ${
                isLight
                  ? 'text-slate-400 hover:text-rose-600 hover:bg-slate-100 disabled:opacity-20'
                  : 'text-[#e4e4e7]/50 hover:text-rose-400 hover:bg-[#18181b] disabled:opacity-20'
              }`}
              title="Clear all text"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Dynamic Font Size Adjustment Slider in Editor */}
      {onUpdateFontSize && typeof fontSize === 'number' && (
        <div
          className={`px-3.5 py-2 border-b flex items-center justify-between gap-3 select-none flex-wrap sm:flex-nowrap ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#141418] border-[#27272a]'
          }`}
        >
          <div className="flex items-center gap-1.5 shrink-0">
            <Type className="w-3.5 h-3.5 text-[#6366f1]" />
            <span
              className={`font-mono-code text-[11px] font-medium ${
                isLight ? 'text-slate-600' : 'text-[#e4e4e7]/70'
              }`}
            >
              Font Size:
            </span>
            <span className="font-mono-code text-[11px] font-bold text-[#6366f1] bg-[#6366f1]/15 px-1.5 py-0.5 rounded border border-[#6366f1]/30">
              {fontSize}px
            </span>
          </div>

          <div className="flex items-center gap-2 flex-1 min-w-[170px] max-w-full sm:max-w-[240px]">
            <button
              type="button"
              onClick={() => onUpdateFontSize(Math.max(11, fontSize - 1))}
              disabled={fontSize <= 11}
              className={`cursor-pointer px-2 py-1 rounded disabled:opacity-30 border text-[10px] font-mono-code transition-colors shrink-0 ${
                isLight
                  ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800'
                  : 'bg-[#18181b] hover:bg-[#27272a] border-[#27272a] text-[#e4e4e7]'
              }`}
              title="Decrease Font Size (A-)"
            >
              A-
            </button>
            <input
              type="range"
              min="11"
              max="32"
              step="1"
              value={fontSize}
              onChange={(e) => onUpdateFontSize(Number(e.target.value))}
              className={`w-full accent-[#6366f1] cursor-pointer h-1.5 rounded-lg ${
                isLight ? 'bg-slate-200' : 'bg-[#27272a]'
              }`}
              title={`Drag to dynamically adjust handwriting size (${fontSize}px)`}
              aria-label="Handwriting font size slider"
            />
            <button
              type="button"
              onClick={() => onUpdateFontSize(Math.min(32, fontSize + 1))}
              disabled={fontSize >= 32}
              className={`cursor-pointer px-2 py-1 rounded disabled:opacity-30 border text-[10px] font-mono-code transition-colors shrink-0 ${
                isLight
                  ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800'
                  : 'bg-[#18181b] hover:bg-[#27272a] border-[#27272a] text-[#e4e4e7]'
              }`}
              title="Increase Font Size (A+)"
            >
              A+
            </button>
          </div>
        </div>
      )}

      {/* Prominent Multi-Page Requirement Banner */}
      {stats.needsMorePages && (
        <div className="px-3 sm:px-4 pt-2.5">
          <div
            className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 text-xs font-mono-code transition-all animate-in fade-in slide-in-from-top-1 ${
              isLight
                ? 'bg-amber-50/90 border-amber-300 text-amber-950 shadow-xs'
                : 'bg-[#1a1612] border-amber-500/40 text-amber-200 shadow-inner'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0 border border-amber-500/40">
                <BookOpen className="w-3.5 h-3.5 text-amber-500" />
              </div>
              <div className="min-w-0">
                <p className="font-bold flex items-center gap-1.5 flex-wrap">
                  <span>{wordCount} words detected</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40 font-bold">
                    ~{stats.recommendedPages} pages needed
                  </span>
                </p>
                <p className="text-[11px] opacity-80 truncate">
                  Currently {totalPages} page{totalPages === 1 ? '' : 's'}. Auto-divide across {stats.recommendedPages} pages?
                </p>
              </div>
            </div>

            {onAutoSplitPages && (
              <button
                type="button"
                onClick={onAutoSplitPages}
                className="cursor-pointer bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs shadow-xs uppercase tracking-wider flex items-center gap-1.5 shrink-0 transition-all active:scale-95"
              >
                <Sparkles className="w-3 h-3" />
                <span>Auto-Add {stats.recommendedPages} Pages</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Spacious Rectangular Assignment Workspace (Mobile-Friendly & High Contrast) */}
      <div className={`flex-1 p-3 sm:p-4 flex flex-col relative ${isLight ? 'bg-slate-100/60' : 'bg-[#08080a]'}`}>
        <div
          className={`flex-1 flex flex-col rounded-xl border-2 transition-all overflow-hidden ${
            isLight
              ? 'bg-white border-slate-300 focus-within:border-[#6366f1] focus-within:ring-2 focus-within:ring-[#6366f1]/20 shadow-xs'
              : 'bg-[#141418] border-zinc-700/80 focus-within:border-[#6366f1] focus-within:ring-2 focus-within:ring-[#6366f1]/30 shadow-inner'
          }`}
        >
          {/* Rectangular Workspace Header Tag */}
          <div
            className={`px-3 py-1.5 border-b flex items-center justify-between text-[10px] font-mono-code select-none ${
              isLight ? 'bg-slate-50 border-slate-200 text-slate-500' : 'bg-[#18181f] border-zinc-700/60 text-zinc-400'
            }`}
          >
            <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6366f1]" />
              Assignment Paste &amp; Edit Box
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePasteClipboard}
                className={`hover:text-[#6366f1] cursor-pointer flex items-center gap-1 font-bold ${
                  isLight ? 'text-indigo-600' : 'text-indigo-400'
                }`}
              >
                <ClipboardPaste className="w-3 h-3" />
                <span>Tap to Paste</span>
              </button>
            </div>
          </div>

          <textarea
            ref={textareaRef}
            value={rawText}
            onChange={(e) => onChangeText(e.target.value)}
            onPaste={handleTextareaPaste}
            onKeyDown={handleKeyDown}
            placeholder={`Paste or type your assignment text here...\n\n• Paste from Word, PDF, Google Docs, or code\n• Automatic Multi-Page: automatically adds needed pages according to total words!\n• Manual delimiters: use ---page--- to split pages manually\n• Undo (Ctrl+Z) and Redo (Ctrl+Y) supported`}
            className={`w-full flex-1 p-3 sm:p-4 font-mono-code text-xs sm:text-[13px] resize-none border-0 focus:outline-hidden leading-relaxed tracking-wide min-h-[300px] sm:min-h-[420px] ${
              isLight
                ? 'bg-white text-slate-900 placeholder:text-slate-400'
                : 'bg-[#141418] text-[#f4f4f5] placeholder:text-zinc-600'
            }`}
            spellCheck={false}
          />
        </div>

        {/* Drag over overlay visual feedback */}
        {isDraggingFile && (
          <div className="absolute inset-3 bg-[#6366f1]/20 border-2 border-dashed border-[#6366f1] rounded-xl flex flex-col items-center justify-center pointer-events-none backdrop-blur-xs font-mono-code text-white">
            <Upload className="w-8 h-8 text-[#a5b4fc] animate-bounce mb-2" />
            <p className="font-bold text-sm">Drop Assignment File Here</p>
            <p className="text-xs text-[#a5b4fc]">Supports .txt, .md, .docx, .json</p>
          </div>
        )}
      </div>

      {/* Bottom Action Footer for text editor */}
      <div
        className={`p-3 border-t flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono-code ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#121214] border-[#27272a]'
        }`}
      >
        {/* Telemetry info */}
        <div
          className={`flex items-center gap-2.5 text-[11px] w-full sm:w-auto justify-between sm:justify-start flex-wrap ${
            isLight ? 'text-slate-600' : 'text-zinc-400'
          }`}
        >
          <span>{wordCount} words</span>
          <span>·</span>
          <span>{charCount} chars</span>
          <span>·</span>
          <span className="text-[#6366f1] font-semibold">
            {totalPages} {totalPages === 1 ? 'page' : 'pages'}
            {stats.needsMorePages && (
              <span className="text-amber-500 font-bold ml-1">
                (~{stats.recommendedPages} needed)
              </span>
            )}
          </span>
          {canUndo && (
            <span className={`text-[10px] hidden md:inline ${isLight ? 'text-slate-500' : 'text-zinc-500'}`}>
              (Undo ready)
            </span>
          )}
        </div>

        {/* Insertion Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
          {onAutoSplitPages && (
            <button
              type="button"
              onClick={onAutoSplitPages}
              className={`cursor-pointer px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1.5 transition-all border ${
                stats.needsMorePages
                  ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-600 shadow-xs animate-pulse'
                  : isLight
                  ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800'
                  : 'bg-[#18181b] hover:bg-[#222226] border-[#27272a] text-[#e4e4e7]'
              }`}
              title="Automatically calculate total words and divide into required pages"
            >
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Auto-Add Pages {stats.needsMorePages ? `(${stats.recommendedPages})` : ''}</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleInsertDelimiter}
            className="cursor-pointer px-3 py-1 rounded bg-[#6366f1] hover:bg-[#4f46e5] text-white text-[11px] font-bold flex items-center gap-1.5 transition-colors shadow-xs uppercase tracking-wider"
            title="Insert a page break at cursor or add page"
          >
            <FilePlus className="w-3.5 h-3.5" />
            <span>+ Page Break</span>
          </button>
        </div>
      </div>
    </div>
  );
}
