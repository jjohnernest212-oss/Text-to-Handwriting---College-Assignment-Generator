import React from 'react';
import { PaperType } from '../types';
import { getPaperBackgroundStyle, PAPER_DEFINITIONS_MAP } from '../utils/paperStyles';

interface MiniPaperSampleProps {
  paperType?: PaperType;
  fontFamily: string;
  inkColor?: string;
  text: string;
  fontSize?: number;
  lineHeight?: number;
  showMarginLine?: boolean;
  className?: string;
}

export default function MiniPaperSample({
  paperType = 'ruled',
  fontFamily,
  inkColor = '#002699',
  text,
  fontSize = 16,
  lineHeight = 24,
  showMarginLine = true,
  className = '',
}: MiniPaperSampleProps) {
  const def = PAPER_DEFINITIONS_MAP[paperType];
  const bgStyle = getPaperBackgroundStyle(paperType, lineHeight, 18);
  const isDarkPaper = paperType === 'dark-aesthetic';
  const effectiveInk =
    isDarkPaper && (inkColor === '#002699' || inkColor === '#111827' || inkColor === '#1e293b')
      ? '#f8fafc'
      : inkColor;

  return (
    <div
      className={`relative rounded-xl overflow-hidden border select-none ${
        isDarkPaper ? 'border-zinc-700' : 'border-slate-200'
      } ${className}`}
      style={{
        ...bgStyle,
        minHeight: '148px',
      }}
    >
      {/* Spiral rings hint */}
      {paperType === 'spiral-notebook' && (
        <div className="absolute left-0 top-0 bottom-0 w-4 flex flex-col justify-between py-2 pointer-events-none">
          {[...Array(7)].map((_, idx) => (
            <div
              key={idx}
              className="w-2.5 h-1.5 ml-1 rounded-full bg-slate-800 border border-slate-400"
            />
          ))}
        </div>
      )}

      {/* 3-hole punch hint */}
      {paperType === 'perforated-binder' && (
        <div className="absolute left-2 top-0 bottom-0 flex flex-col justify-around py-3 pointer-events-none">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-3 h-3 rounded-full bg-slate-700/80" />
          ))}
        </div>
      )}

      {/* Cornell lines hint */}
      {paperType === 'cornell-notes' && (
        <>
          <div className="absolute top-0 bottom-8 left-[24%] w-[1px] bg-indigo-400/70 pointer-events-none" />
          <div className="absolute bottom-8 left-0 right-0 h-[1px] bg-indigo-400/70 pointer-events-none" />
        </>
      )}

      {/* Vertical margin line */}
      {showMarginLine && paperType !== 'plain' && def?.marginColor !== 'transparent' && (
        <div
          className="absolute top-0 bottom-0 pointer-events-none"
          style={{
            left: '34px',
            width: '1.5px',
            backgroundColor: def?.marginColor || '#ef4444',
            opacity: 0.75,
          }}
        />
      )}

      {/* Handwritten Text Preview */}
      <div
        className="relative z-10 whitespace-pre-wrap break-words"
        style={{
          paddingTop: '18px',
          paddingLeft: paperType === 'cornell-notes' ? '28%' : '44px',
          paddingRight: '16px',
          paddingBottom: '16px',
          fontFamily,
          fontSize: `${fontSize}px`,
          lineHeight: `${lineHeight}px`,
          color: effectiveInk,
        }}
      >
        {text}
      </div>
    </div>
  );
}
