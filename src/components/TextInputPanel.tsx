import React, { useRef, useState, useEffect } from 'react';
import {
  FilePlus,
  Trash2,
  Sparkles,
  Upload,
  Type,
  Undo2,
  Redo2,
} from 'lucide-react';
import { ASSIGNMENT_PRESETS } from '../constants';
import { AssignmentPreset } from '../types';

interface TextInputPanelProps {
  theme?: 'dark' | 'light';
  rawText: string;
  currentPageIndex: number;
  totalPages: number;
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

  // Undo / Redo History State Management
  const [history, setHistory] = useState<string[]>([rawText]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const isUndoRedoActionRef = useRef<boolean>(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const wordCount = rawText.trim() ? rawText.trim().split(/\s+/).length : 0;
  const charCount = rawText.length;

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
        pushImmediateSnapshot(content);
        onChangeText(content);
        onNotify?.(`File "${file.name}" loaded successfully (${content.length} characters)!`, 'success');
        if (content.length > 2000 && onAutoSplitPages) {
          setTimeout(() => {
            onAutoSplitPages();
          }, 300);
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
            className={`cursor-pointer font-mono-code text-[11px] rounded-lg px-2.5 py-1 flex items-center gap-1.5 transition-colors border ${
              isLight
                ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-800 shadow-2xs'
                : 'bg-[#18181b] hover:bg-[#222226] border-[#27272a] hover:border-[#6366f1] text-[#e4e4e7]'
            }`}
            title="Import assignment file (.txt, .md, .doc, .json)"
          >
            <Upload className="w-3 h-3 text-[#6366f1]" />
            <span>Load File</span>
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

      {/* Main Textarea with Undo/Redo key listeners */}
      <div className={`flex-1 p-3 flex flex-col relative ${isLight ? 'bg-white' : 'bg-[#0c0c0e]'}`}>
        <textarea
          ref={textareaRef}
          value={rawText}
          onChange={(e) => onChangeText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Type, paste, or drop your assignment text file here...\n\nKeyboard Shortcuts:\n• Ctrl+Z / Cmd+Z: Undo\n• Ctrl+Y / Cmd+Shift+Z: Redo\n\nTo divide into multiple pages, type:\n---page---\n\nor click [+ ADD PAGE BREAK] or [AUTO-SPLIT] below.`}
          className={`w-full flex-1 p-3 font-mono-code text-xs sm:text-[13px] rounded-lg resize-none border focus:outline-hidden focus:border-[#6366f1] transition-all leading-relaxed tracking-wide ${
            isLight
              ? 'bg-slate-50 text-slate-900 border-slate-300 placeholder:text-slate-400 focus:bg-white'
              : 'bg-[#18181b] text-[#e4e4e7] border-[#27272a] placeholder:text-zinc-600'
          }`}
          spellCheck={false}
        />

        {/* Drag over overlay visual feedback */}
        {isDraggingFile && (
          <div className="absolute inset-3 bg-[#6366f1]/20 border-2 border-dashed border-[#6366f1] rounded-lg flex flex-col items-center justify-center pointer-events-none backdrop-blur-xs font-mono-code text-white">
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
          className={`flex items-center gap-3 text-[11px] w-full sm:w-auto justify-between sm:justify-start ${
            isLight ? 'text-slate-600' : 'text-zinc-400'
          }`}
        >
          <span>{wordCount} words</span>
          <span>·</span>
          <span>{charCount} chars</span>
          <span>·</span>
          <span className="text-[#6366f1] font-semibold">{totalPages} {totalPages === 1 ? 'page' : 'pages'}</span>
          {canUndo && (
            <span className={`text-[10px] hidden md:inline ${isLight ? 'text-slate-500' : 'text-zinc-500'}`}>
              (Undo ready)
            </span>
          )}
        </div>

        {/* Insertion Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {onAutoSplitPages && (
            <button
              type="button"
              onClick={onAutoSplitPages}
              className={`cursor-pointer px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition-colors border ${
                isLight
                  ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800'
                  : 'bg-[#18181b] hover:bg-[#222226] border-[#27272a] text-[#e4e4e7]'
              }`}
              title="Auto-calculate line capacity and split into pages"
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Auto-Split</span>
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
