import React, { useRef } from 'react';
import {
  FilePlus,
  Trash2,
} from 'lucide-react';
import { ASSIGNMENT_PRESETS } from '../constants';
import { AssignmentPreset } from '../types';

interface TextInputPanelProps {
  rawText: string;
  currentPageIndex: number;
  totalPages: number;
  onChangeText: (text: string) => void;
  onApplyPreset: (preset: AssignmentPreset) => void;
  onInsertPageBreak: () => void;
  onClearText: () => void;
}

export default function TextInputPanel({
  rawText,
  currentPageIndex,
  totalPages,
  onChangeText,
  onApplyPreset,
  onInsertPageBreak,
  onClearText,
}: TextInputPanelProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

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

  return (
    <div className="flex flex-col h-full bg-[#0c0c0e] rounded-lg border border-[#27272a] overflow-hidden">
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

          {/* Clear button */}
          <button
            onClick={onClearText}
            className="cursor-pointer p-1 text-[#e4e4e7]/50 hover:text-rose-400 rounded hover:bg-[#18181b] transition-colors"
            title="Clear all text"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Textarea */}
      <div className="flex-1 p-3 flex flex-col relative bg-[#0c0c0e]">
        <textarea
          ref={textareaRef}
          value={rawText}
          onChange={(e) => onChangeText(e.target.value)}
          placeholder={`Type or paste your assignment here...\n\nTo divide into multiple pages, type:\n---page---\n\nor click [+ ADD PAGE BREAK] below.`}
          className="w-full flex-1 p-3 font-mono-code text-xs sm:text-[13px] text-[#e4e4e7] bg-[#18181b] border border-[#27272a] rounded-md resize-none focus:outline-hidden focus:border-[#6366f1] transition-all leading-relaxed tracking-wide placeholder:text-zinc-600"
          spellCheck={false}
        />
      </div>

      {/* Bottom Status & Action Bar */}
      <div className="px-3.5 py-2.5 border-t border-[#27272a] bg-[#121214] flex items-center justify-between text-[11px] font-mono-code text-[#e4e4e7]/60">
        <button
          onClick={handleInsertDelimiter}
          className="cursor-pointer font-mono-code text-[11px] uppercase tracking-wider transition-all border border-[#27272a] hover:border-[#6366f1] hover:bg-[#18181b] hover:text-white text-[#e4e4e7] px-2.5 py-1 rounded flex items-center gap-1.5"
          title="Split assignment onto next page with ---page--- delimiter"
        >
          <FilePlus className="w-3 h-3 text-[#6366f1]" />
          <span>+ Add Page Break</span>
        </button>

        <div className="flex items-center gap-3">
          <span>
            WORDS: <strong className="text-[#e4e4e7] font-bold">{wordCount}</strong>
          </span>
          <span className="hidden sm:inline">
            CHARS: <strong className="text-[#e4e4e7] font-bold">{charCount}</strong>
          </span>
          <span className="text-[#6366f1] bg-[#6366f1]/10 px-2 py-0.5 rounded border border-[#6366f1]/20">
            {totalPages} {totalPages === 1 ? 'PAGE' : 'PAGES'}
          </span>
        </div>
      </div>
    </div>
  );
}

