import React, { useRef, useState } from 'react';
import {
  FilePlus,
  Trash2,
  Sparkles,
  Upload,
  FileText,
  Type,
} from 'lucide-react';
import { ASSIGNMENT_PRESETS } from '../constants';
import { AssignmentPreset } from '../types';

interface TextInputPanelProps {
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
  onCustomFontUpload,
  onNotify,
}: TextInputPanelProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);
  const [isDraggingFile, setIsDraggingFile] = useState<boolean>(false);

  const wordCount = rawText.trim() ? rawText.trim().split(/\s+/).length : 0;
  const charCount = rawText.length;

  const handleInsertDelimiter = () => {
    const textarea = textareaRef.current;
    if (!textarea) {
      onInsertPageBreak();
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const delimiter = '\n\n---page---\n\n';

    const newText = rawText.substring(0, start) + delimiter + rawText.substring(end);
    onChangeText(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + delimiter.length, start + delimiter.length);
    }, 10);
  };

  const handleProcessFile = (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase() || '';

    // If it's a font file, route to font loader
    if (['ttf', 'otf', 'woff', 'woff2'].includes(ext)) {
      if (onCustomFontUpload) {
        onCustomFontUpload(file);
      } else {
        onNotify?.(`Loaded font "${file.name}"`, 'info');
      }
      return;
    }

    // Read text from file
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      if (typeof content === 'string') {
        onChangeText(content);
        onNotify?.(`File "${file.name}" loaded successfully (${content.length} characters)!`, 'success');
        // Auto-split if very long
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
      className={`flex flex-col h-full bg-[#0c0c0e] rounded-lg border overflow-hidden relative transition-colors ${
        isDraggingFile ? 'border-[#6366f1] ring-2 ring-[#6366f1]/40' : 'border-[#27272a]'
      }`}
    >
      {/* Pane Label & Toolbar */}
      <div className="px-4 py-3 border-b border-[#27272a] bg-[#121214] flex items-center justify-between gap-2 flex-wrap">
        <div>
          <span className="font-mono-code text-[11px] text-[#6366f1] tracking-widest uppercase font-bold block">
            01 // Assignment Input
          </span>
          <span className="font-mono-code text-[10px] text-[#e4e4e7]/50 tracking-wider">
            RAW SOURCE BUFFER
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Load File Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer font-mono-code text-[11px] bg-[#18181b] hover:bg-[#222226] border border-[#27272a] hover:border-[#6366f1] rounded px-2.5 py-1 text-[#e4e4e7] flex items-center gap-1.5 transition-colors"
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
                onApplyPreset(found);
              }
            }}
            defaultValue=""
            className="font-mono-code text-[11px] bg-[#18181b] border border-[#27272a] rounded px-2.5 py-1 text-[#e4e4e7] cursor-pointer hover:border-[#6366f1] focus:outline-hidden focus:border-[#6366f1] transition-colors"
          >
            <option value="" disabled>
              LOAD PRESET ASSIGNMENT...
            </option>
            {ASSIGNMENT_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>

          {/* Clear button with safe inline confirmation */}
          {showClearConfirm ? (
            <div className="flex items-center gap-1 bg-[#18181b] border border-rose-500/40 rounded px-1.5 py-0.5 animate-in fade-in duration-100">
              <span className="text-[10px] text-rose-400 font-bold uppercase">Clear?</span>
              <button
                onClick={() => {
                  onClearText();
                  setShowClearConfirm(false);
                }}
                className="cursor-pointer text-[10px] bg-rose-600 hover:bg-rose-500 text-white font-bold px-1.5 py-0.5 rounded transition-colors uppercase"
              >
                Yes
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="cursor-pointer text-[10px] bg-[#27272a] hover:bg-[#3f3f46] text-[#e4e4e7] px-1.5 py-0.5 rounded transition-colors uppercase"
              >
                No
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                if (!rawText.trim()) return;
                setShowClearConfirm(true);
              }}
              disabled={!rawText.trim()}
              className="cursor-pointer p-1 text-[#e4e4e7]/50 hover:text-rose-400 disabled:opacity-20 disabled:hover:text-[#e4e4e7]/50 rounded hover:bg-[#18181b] transition-colors"
              title="Clear all text"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Dynamic Font Size Adjustment Slider in Editor */}
      {onUpdateFontSize && typeof fontSize === 'number' && (
        <div className="px-3.5 py-2 bg-[#141418] border-b border-[#27272a] flex items-center justify-between gap-3 select-none flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-1.5 shrink-0">
            <Type className="w-3.5 h-3.5 text-[#6366f1]" />
            <span className="font-mono-code text-[11px] text-[#e4e4e7]/70 font-medium">
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
              className="cursor-pointer px-2 py-1 rounded bg-[#18181b] hover:bg-[#27272a] disabled:opacity-30 border border-[#27272a] text-[10px] font-mono-code text-[#e4e4e7] transition-colors shrink-0"
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
              className="w-full accent-[#6366f1] cursor-pointer h-1.5 bg-[#27272a] rounded-lg"
              title={`Drag to dynamically adjust handwriting size (${fontSize}px)`}
              aria-label="Handwriting font size slider"
            />
            <button
              type="button"
              onClick={() => onUpdateFontSize(Math.min(32, fontSize + 1))}
              disabled={fontSize >= 32}
              className="cursor-pointer px-2 py-1 rounded bg-[#18181b] hover:bg-[#27272a] disabled:opacity-30 border border-[#27272a] text-[10px] font-mono-code text-[#e4e4e7] transition-colors shrink-0"
              title="Increase Font Size (A+)"
            >
              A+
            </button>
          </div>
        </div>
      )}

      {/* Main Textarea */}
      <div className="flex-1 p-3 flex flex-col relative bg-[#0c0c0e]">
        <textarea
          ref={textareaRef}
          value={rawText}
          onChange={(e) => onChangeText(e.target.value)}
          placeholder={`Type, paste, or drop your assignment text file here...\n\nTo divide into multiple pages, type:\n---page---\n\nor click [+ ADD PAGE BREAK] or [AUTO-SPLIT] below.`}
          className="w-full flex-1 p-3 font-mono-code text-xs sm:text-[13px] text-[#e4e4e7] bg-[#18181b] border border-[#27272a] rounded-md resize-none focus:outline-hidden focus:border-[#6366f1] transition-all leading-relaxed tracking-wide placeholder:text-zinc-600"
          spellCheck={false}
        />

        {/* Drag and Drop File Overlay */}
        {isDraggingFile && (
          <div className="absolute inset-3 bg-[#18181b]/95 border-2 border-dashed border-[#6366f1] rounded-md flex flex-col items-center justify-center gap-2 pointer-events-none z-20 animate-in fade-in duration-100">
            <FileText className="w-10 h-10 text-[#6366f1] animate-bounce" />
            <div className="font-syne text-sm font-bold text-white uppercase tracking-wider">
              Drop File to Load Assignment
            </div>
            <div className="font-mono-code text-[11px] text-[#e4e4e7]/60">
              Supports .txt, .md, .doc, .json, and font files
            </div>
          </div>
        )}
      </div>

      {/* Bottom Status & Action Bar */}
      <div className="px-3 py-2 border-t border-[#27272a] bg-[#121214] flex items-center justify-between text-[11px] font-mono-code text-[#e4e4e7]/60 flex-wrap gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={handleInsertDelimiter}
            className="cursor-pointer font-mono-code text-[11px] uppercase tracking-wider transition-all border border-[#27272a] hover:border-[#6366f1] hover:bg-[#18181b] hover:text-white text-[#e4e4e7] px-2.5 py-1 rounded flex items-center gap-1.5"
            title="Split assignment onto next page with ---page--- delimiter"
          >
            <FilePlus className="w-3 h-3 text-[#6366f1]" />
            <span>+ Page Break</span>
          </button>

          {onAutoSplitPages && (
            <button
              onClick={onAutoSplitPages}
              className="cursor-pointer font-mono-code text-[11px] uppercase tracking-wider transition-all border border-amber-500/30 hover:border-amber-400 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded flex items-center gap-1.5"
              title="Automatically divide long text into multiple A4 pages to prevent overflow"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Auto-Split</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          <span>
            WORDS: <strong className="text-[#e4e4e7] font-bold">{wordCount}</strong>
          </span>
          <span className="hidden sm:inline">
            CHARS: <strong className="text-[#e4e4e7] font-bold">{charCount}</strong>
          </span>
          <span className="text-[#6366f1] bg-[#6366f1]/10 px-2 py-0.5 rounded border border-[#6366f1]/20 font-bold">
            {totalPages} {totalPages === 1 ? 'PAGE' : 'PAGES'}
          </span>
        </div>
      </div>
    </div>
  );
}
