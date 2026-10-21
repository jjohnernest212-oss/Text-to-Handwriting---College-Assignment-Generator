import React, { useRef, useState, useEffect } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Trash2,
  Move,
  ChevronLeft,
  ChevronRight,
  Eye,
  Sparkles,
  Plus,
  AlertTriangle,
  Download,
  FileText,
  Layers,
} from 'lucide-react';
import {
  PageSettings,
  StudentHeaderInfo,
  DiagramElement,
  PaperType,
} from '../types';
import InkBlotsOverlay from './InkBlotsOverlay';
import PenStrokeJitterCanvas from './PenStrokeJitterCanvas';
import { getLinesPerPage, getCharsPerLine, formatTextToPaperLines } from '../utils/paginationUtils';
import { getPaperBackgroundStyle, PAPER_DEFINITIONS_MAP } from '../utils/paperStyles';

interface PaperPreviewProps {
  theme?: 'dark' | 'light';
  pageIndex: number;
  totalPages: number;
  pageText: string;
  settings: PageSettings;
  headerInfo: StudentHeaderInfo;
  diagrams: DiagramElement[];
  fontFamilyCss: string;
  onPageChange: (newIndex: number) => void;
  onUpdateDiagram: (updated: DiagramElement) => void;
  onDeleteDiagram: (id: string) => void;
  paperRef: React.RefObject<HTMLDivElement | null>;
  onAddPage?: () => void;
  onDeletePage?: () => void;
  onAutoSplitPages?: () => void;
  onUpdateFontSize?: (size: number) => void;
  onDownloadPdf?: () => void;
  onDownloadImage?: () => void;
  onOpenPaperGallery?: () => void;
}

export default function PaperPreview({
  theme = 'dark',
  pageIndex,
  totalPages,
  pageText,
  settings,
  headerInfo,
  diagrams,
  fontFamilyCss,
  onPageChange,
  onUpdateDiagram,
  onDeleteDiagram,
  paperRef,
  onAddPage,
  onDeletePage,
  onAutoSplitPages,
  onUpdateFontSize,
  onDownloadPdf,
  onDownloadImage,
  onOpenPaperGallery,
}: PaperPreviewProps) {
  const isLight = theme === 'light';
  const scrollportRef = useRef<HTMLDivElement | null>(null);

  const calculateFitZoom = () => {
    const containerWidth = scrollportRef.current?.clientWidth || window.innerWidth;
    const padding = containerWidth < 640 ? 24 : 64;
    const availWidth = Math.max(280, containerWidth - padding);
    return Math.min(1.0, Math.max(0.35, Number((availWidth / 804).toFixed(2))));
  };

  const [zoomLevel, setZoomLevel] = useState<number>(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      const padding = window.innerWidth < 640 ? 24 : 64;
      const availWidth = Math.max(280, window.innerWidth - padding);
      return Math.min(1.0, Math.max(0.35, Number((availWidth / 804).toFixed(2))));
    }
    return 0.85;
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setZoomLevel(calculateFitZoom());
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [activeDiagramId, setActiveDiagramId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Current paper metadata
  const currentPaperDef =
    PAPER_DEFINITIONS_MAP[settings.paperType] || PAPER_DEFINITIONS_MAP['ruled'];

  // Page capacity & overflow detection
  const charsPerLine = getCharsPerLine(settings);
  const linesPerPage = getLinesPerPage(settings);
  const formattedLines = formatTextToPaperLines(pageText, charsPerLine);
  const isPageOverflowing = formattedLines.length > linesPerPage;
  const overflowLinesCount = Math.max(0, formattedLines.length - linesPerPage);
  const overflowWordsCount = isPageOverflowing
    ? formattedLines.slice(linesPerPage).join(' ').trim().split(/\s+/).filter(Boolean).length
    : 0;

  // Filter diagrams for current page
  const pageDiagrams = diagrams.filter((d) => d.pageIndex === pageIndex);

  // Diagram drag start
  const handleDiagramMouseDown = (e: React.MouseEvent, diag: DiagramElement) => {
    e.stopPropagation();
    setActiveDiagramId(diag.id);
    setDraggingId(diag.id);
    setDragOffset({
      x: e.clientX - diag.x,
      y: e.clientY - diag.y,
    });
  };

  const handlePaperMouseMove = (e: React.MouseEvent) => {
    if (!draggingId) return;
    const diag = pageDiagrams.find((d) => d.id === draggingId);
    if (!diag) return;

    // Calculate new position constrained to paper boundaries
    const newX = Math.max(10, Math.min(794 - diag.width - 10, e.clientX - dragOffset.x));
    const newY = Math.max(10, Math.min(1123 - diag.height - 10, e.clientY - dragOffset.y));

    onUpdateDiagram({
      ...diag,
      x: newX,
      y: newY,
    });
  };

  const handlePaperMouseUp = () => {
    setDraggingId(null);
  };

  const handleResizeDiagram = (e: React.MouseEvent, diag: DiagramElement, delta: number) => {
    e.stopPropagation();
    const newW = Math.max(100, Math.min(600, diag.width + delta));
    const newH = Math.round(newW * (diag.height / diag.width));
    onUpdateDiagram({
      ...diag,
      width: newW,
      height: newH,
    });
  };

  // Human jitter simulation: render text lines with subtle human variations and justification
  const renderHumanizedText = (text: string) => {
    const lines = formatTextToPaperLines(text, charsPerLine);

    if (!settings.humanJitter) {
      return (
        <div
          className="select-text space-y-0"
          style={{
            textAlign: settings.justification === 'full' ? 'justify' : 'left',
          }}
        >
          {lines.map((line, lIdx) => {
            if (line.trim() === '') {
              return <div key={lIdx} style={{ height: `${settings.lineHeight}px` }}>&nbsp;</div>;
            }
            return (
              <div
                key={lIdx}
                style={{
                  height: `${settings.lineHeight}px`,
                  lineHeight: `${settings.lineHeight}px`,
                  width: '100%',
                }}
              >
                {line}
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <div
        className="select-text space-y-0"
        style={{
          textAlign: settings.justification === 'full' ? 'justify' : 'left',
        }}
      >
        {lines.map((line, lIdx) => {
          if (line.trim() === '') {
            return <div key={lIdx} style={{ height: `${settings.lineHeight}px` }}>&nbsp;</div>;
          }

          // Split words to apply subtle micro-variations
          const words = line.split(' ');
          // Pseudo-random deterministic shift based on line index
          const lineTilt = ((lIdx % 5) - 2) * (0.05 * settings.jitterIntensity);
          const baselineShift = ((lIdx % 3) - 1) * (0.4 * settings.jitterIntensity);

          // Full justification for formal assignment submission
          const isJustified =
            settings.justification === 'full' &&
            words.length > 1 &&
            lIdx < lines.length - 1 &&
            lines[lIdx + 1]?.trim() !== '';

          return (
            <div
              key={lIdx}
              style={{
                height: `${settings.lineHeight}px`,
                lineHeight: `${settings.lineHeight}px`,
                transform: `rotate(${lineTilt}deg) translateY(${baselineShift}px)`,
                transformOrigin: 'left center',
                display: 'flex',
                flexWrap: 'nowrap',
                justifyContent: isJustified ? 'space-between' : 'flex-start',
                alignItems: 'baseline',
                width: '100%',
              }}
            >
              {words.map((word, wIdx) => {
                const wordJitter = ((wIdx % 4) - 1.5) * (0.08 * settings.jitterIntensity);
                return (
                  <span
                    key={wIdx}
                    style={{
                      marginRight: isJustified ? undefined : `${settings.wordSpacing}px`,
                      transform: `rotate(${wordJitter}deg)`,
                      display: 'inline-block',
                    }}
                  >
                    {word}
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div
      className={`flex flex-col h-full rounded-lg border overflow-hidden shadow-2xl transition-colors ${
        isLight
          ? 'bg-slate-100 border-slate-300 text-slate-800'
          : 'bg-[#121214] border-[#27272a] text-[#e4e4e7]'
      }`}
    >
      {/* Top Bar: Zoom Controls & Pagination */}
      <div
        className={`px-4 py-2.5 border-b flex items-center justify-between gap-3 flex-wrap select-none ${
          isLight ? 'bg-slate-50 border-slate-300' : 'bg-[#0c0c0e] border-[#27272a]'
        }`}
      >
        {/* Pagination navigator */}
        <div className="flex items-center gap-1.5 font-mono-code">
          <button
            onClick={() => onPageChange(Math.max(0, pageIndex - 1))}
            disabled={pageIndex === 0}
            className={`cursor-pointer p-1 rounded disabled:opacity-20 disabled:hover:bg-transparent transition-colors ${
              isLight
                ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                : 'text-[#e4e4e7]/60 hover:text-white hover:bg-[#18181b]'
            }`}
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span
            className={`text-[11px] font-bold px-2.5 py-0.5 rounded tracking-wider border ${
              isLight
                ? 'text-slate-900 bg-white border-slate-300 shadow-2xs'
                : 'text-[#e4e4e7] bg-[#18181b] border-[#27272a]'
            }`}
          >
            PAGE {String(pageIndex + 1).padStart(2, '0')} / {String(totalPages).padStart(2, '0')}
          </span>

          <button
            onClick={() => onPageChange(Math.min(totalPages - 1, pageIndex + 1))}
            disabled={pageIndex >= totalPages - 1}
            className={`cursor-pointer p-1 rounded disabled:opacity-20 disabled:hover:bg-transparent transition-colors ${
              isLight
                ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                : 'text-[#e4e4e7]/60 hover:text-white hover:bg-[#18181b]'
            }`}
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Direct + Add Page Button */}
          {onAddPage && (
            <button
              onClick={onAddPage}
              className="cursor-pointer ml-1 px-2.5 py-1 rounded bg-[#6366f1] hover:bg-[#4f46e5] text-white text-[11px] font-bold flex items-center gap-1 transition-all shadow-xs uppercase tracking-wider active:scale-95"
              title="Add another handwritten assignment page (unlimited)"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Page</span>
            </button>
          )}

          {/* Auto-Add Needed Pages quick action if this page has overflow */}
          {isPageOverflowing && onAutoSplitPages && (
            <button
              type="button"
              onClick={onAutoSplitPages}
              className="cursor-pointer ml-1 px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold flex items-center gap-1 transition-all shadow-xs uppercase tracking-wider active:scale-95 animate-pulse"
              title={`This page has ${overflowLinesCount} lines overflowing. Click to auto-add needed pages.`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Auto-Add Pages</span>
              <span className="sm:hidden">Auto-Split</span>
            </button>
          )}

          {/* Delete current page button (only if > 1 page) */}
          {totalPages > 1 && onDeletePage && (
            <button
              onClick={onDeletePage}
              className={`cursor-pointer p-1 rounded transition-colors ml-0.5 ${
                isLight
                  ? 'text-slate-400 hover:text-rose-600 hover:bg-slate-200'
                  : 'text-[#e4e4e7]/50 hover:text-rose-400 hover:bg-[#18181b]'
              }`}
              title={`Delete Page ${pageIndex + 1}`}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Paper title / prompt info */}
        <div
          className={`hidden sm:flex items-center gap-2 font-mono-code text-[10px] uppercase tracking-widest ${
            isLight ? 'text-slate-500' : 'text-[#e4e4e7]/50'
          }`}
        >
          <Eye className="w-3.5 h-3.5 text-[#6366f1]" />
          <span>A4 SIMULATION // 300 DPI</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Paper Style Selector Button */}
          {onOpenPaperGallery && (
            <button
              type="button"
              onClick={onOpenPaperGallery}
              className={`cursor-pointer px-2.5 py-1 rounded-lg font-mono-code text-[11px] font-bold flex items-center gap-1.5 border transition-all active:scale-95 ${
                isLight
                  ? 'bg-white hover:bg-slate-50 border-slate-300 text-slate-800 shadow-2xs'
                  : 'bg-[#18181b] hover:bg-[#222226] border-[#27272a] text-white'
              }`}
              title="Change Notebook Paper Style / Texture"
            >
              <Layers className="w-3.5 h-3.5 text-[#6366f1]" />
              <span className="truncate max-w-[120px] sm:max-w-[150px]">
                {currentPaperDef.name.split(' ')[0]} {currentPaperDef.name.split(' ')[1] || ''}
              </span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-[#6366f1]/20 text-[#6366f1] hidden sm:inline">
                {currentPaperDef.badge}
              </span>
            </button>
          )}

          {/* Real-time Font Size Quick Tuning */}
          {onUpdateFontSize && (
            <div
              className={`flex items-center gap-1.5 px-2 py-1 rounded font-mono-code text-[11px] border ${
                isLight
                  ? 'bg-white border-slate-300 text-slate-800'
                  : 'bg-[#18181b] border-[#27272a] text-[#e4e4e7]'
              }`}
            >
              <span className={`text-[10px] hidden md:inline ${isLight ? 'text-slate-500' : 'text-[#e4e4e7]/60'}`}>
                Font:
              </span>
              <button
                type="button"
                onClick={() => onUpdateFontSize(Math.max(11, settings.fontSize - 1))}
                disabled={settings.fontSize <= 11}
                className={`cursor-pointer text-[10px] disabled:opacity-30 px-1 py-0.5 rounded transition-colors ${
                  isLight
                    ? 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                    : 'text-[#e4e4e7] hover:text-white hover:bg-[#27272a]'
                }`}
                title="Decrease font size (A-)"
              >
                A-
              </button>
              <input
                type="range"
                min="11"
                max="32"
                step="1"
                value={settings.fontSize}
                onChange={(e) => onUpdateFontSize(Number(e.target.value))}
                className="w-14 sm:w-20 accent-[#6366f1] cursor-pointer h-1.5 hidden sm:inline-block"
                title={`Font Size: ${settings.fontSize}px`}
                aria-label="Font size slider"
              />
              <span className="text-[#6366f1] font-bold min-w-[28px] text-center text-[10px] sm:text-[11px]">
                {settings.fontSize}px
              </span>
              <button
                type="button"
                onClick={() => onUpdateFontSize(Math.min(32, settings.fontSize + 1))}
                disabled={settings.fontSize >= 32}
                className={`cursor-pointer text-[10px] disabled:opacity-30 px-1 py-0.5 rounded transition-colors ${
                  isLight
                    ? 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                    : 'text-[#e4e4e7] hover:text-white hover:bg-[#27272a]'
                }`}
                title="Increase font size (A+)"
              >
                A+
              </button>
            </div>
          )}

          {/* Zoom controls */}
          <div
            className={`flex items-center gap-1 p-0.5 rounded font-mono-code border ${
              isLight
                ? 'bg-white border-slate-300'
                : 'bg-[#18181b] border-[#27272a]'
            }`}
          >
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.4, Number((z - 0.1).toFixed(2))))}
              className={`cursor-pointer px-1.5 py-0.5 rounded text-[11px] transition-colors ${
                isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-[#27272a] text-[#e4e4e7]/70 hover:text-white'
              }`}
              title="Zoom Out"
            >
              <ZoomOut className="w-3 h-3" />
            </button>
            <span className="text-[11px] text-[#6366f1] font-bold px-1.5">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.3, Number((z + 0.1).toFixed(2))))}
              className={`cursor-pointer px-1.5 py-0.5 rounded text-[11px] transition-colors ${
                isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-[#27272a] text-[#e4e4e7]/70 hover:text-white'
              }`}
              title="Zoom In"
            >
              <ZoomIn className="w-3 h-3" />
            </button>
            <button
              onClick={() => setZoomLevel(calculateFitZoom())}
              className={`cursor-pointer px-1.5 py-0.5 rounded text-[11px] transition-colors ${
                isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-[#27272a] text-[#e4e4e7]/70 hover:text-white'
              }`}
              title="Fit Paper to Screen"
            >
              <Maximize2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Paper Scrollport (Desk background) */}
      <div
        ref={scrollportRef}
        className={`flex-1 overflow-auto p-4 sm:p-8 flex items-start justify-center transition-colors ${
          isLight ? 'bg-slate-200/90' : 'bg-[#121216]'
        }`}
        onMouseMove={handlePaperMouseMove}
        onMouseUp={handlePaperMouseUp}
        onClick={() => setActiveDiagramId(null)}
      >
        <div
          style={{
            transform: `scale(${zoomLevel}) rotate(${settings.paperTilt}deg)`,
            transformOrigin: 'top center',
            transition: 'transform 0.1s ease-out',
          }}
          className="relative"
        >
          {/* THE PHYSICAL A4 PAPER SHEET */}
          <div
            ref={paperRef}
            id={`paper-page-${pageIndex}`}
            className="relative select-none paper-shadow-realistic rounded-xs overflow-hidden"
            style={{
              width: '794px', // Standard 96 DPI A4 dimension (210mm)
              height: '1123px', // Standard 96 DPI A4 dimension (297mm)
              ...getPaperBackgroundStyle(settings.paperType, settings.lineHeight, settings.topMargin),
            }}
          >
            {/* Spiral Bound Left Wire Rings & Micro-Perforations */}
            {settings.paperType === 'spiral-notebook' && (
              <div className="absolute left-0 top-0 bottom-0 w-8 pointer-events-none z-20 flex flex-col justify-between py-4 select-none">
                <div className="absolute right-0 top-0 bottom-0 border-r border-dashed border-slate-400/40" />
                {[...Array(26)].map((_, i) => (
                  <div key={i} className="relative flex items-center pl-2">
                    <div className="w-3.5 h-2 rounded-full bg-slate-900 border border-black/40 shadow-inner" />
                    <div className="absolute -left-1 w-4.5 h-3 rounded-full border-2 border-slate-400 bg-transparent shadow-xs -rotate-12" />
                  </div>
                ))}
              </div>
            )}

            {/* 3-Hole Punched Binder Loose-Leaf Paper */}
            {settings.paperType === 'perforated-binder' && (
              <div className="absolute left-0 top-0 bottom-0 w-12 pointer-events-none z-20 select-none">
                {[0.15, 0.5, 0.85].map((posRatio, i) => (
                  <div
                    key={i}
                    className="absolute left-3 w-5 h-5 rounded-full bg-slate-800/80 border border-black/30 shadow-inner -translate-y-1/2"
                    style={{ top: `${posRatio * 100}%` }}
                  />
                ))}
              </div>
            )}

            {/* Cornell Study Notes Dividing Lines */}
            {settings.paperType === 'cornell-notes' && (
              <>
                <div className="absolute top-0 bottom-36 left-[25%] w-[1.5px] bg-indigo-400/70 pointer-events-none z-10" />
                <div className="absolute bottom-36 left-0 right-0 h-[1.5px] bg-indigo-400/70 pointer-events-none z-10" />
                <div className="absolute bottom-32 left-4 text-[10px] font-mono-code font-bold text-indigo-500/60 uppercase tracking-widest pointer-events-none z-10">
                  SUMMARY / KEY TAKEAWAYS:
                </div>
              </>
            )}

            {/* Realistic Wrinkled / Crinkled Scanned Paper Overlay */}
            {settings.paperType === 'crinkled-paper' && (
              <div
                className="absolute inset-0 pointer-events-none z-10"
                style={{
                  backgroundImage: `
                    linear-gradient(135deg, rgba(0,0,0,0.03) 0%, transparent 40%, rgba(255,255,255,0.35) 50%, transparent 60%, rgba(0,0,0,0.04) 100%),
                    linear-gradient(45deg, rgba(0,0,0,0.02) 0%, transparent 45%, rgba(255,255,255,0.25) 55%, transparent 65%, rgba(0,0,0,0.03) 100%)
                  `,
                }}
              />
            )}

            {/* Top Red Header Separator Line (traditional notebook feature) */}
            {settings.paperType !== 'plain' && settings.showMarginLine && (
              <div
                className="absolute left-0 right-0 pointer-events-none"
                style={{
                  top: `${settings.topMargin - 4}px`,
                  height: '1.5px',
                  backgroundColor: settings.marginLineColor,
                  opacity: 0.65,
                }}
              />
            )}

            {/* Vertical Margin Line (Left notebook red rule) */}
            {settings.showMarginLine && (
              <div
                className="absolute top-0 bottom-0 pointer-events-none z-10"
                style={{
                  left: `${settings.marginLinePosition}px`,
                  width: '1.5px',
                  backgroundColor: settings.marginLineColor,
                  opacity: 0.85,
                }}
              />
            )}

            {/* Secondary Red Margin Line for Yellow Legal Pad (Classic legal pad double red line) */}
            {settings.paperType === 'yellow-legal' && settings.showMarginLine && (
              <div
                className="absolute top-0 bottom-0 pointer-events-none z-10"
                style={{
                  left: `${settings.marginLinePosition + 4}px`,
                  width: '1px',
                  backgroundColor: settings.marginLineColor,
                  opacity: 0.65,
                }}
              />
            )}

            {/* Student Header at Top of Page (Name, Roll, Subject, Page #) */}
            {headerInfo.enabled && (
              <div
                className="absolute left-0 right-0 px-8 flex justify-between items-center text-xs pointer-events-none select-none z-10"
                style={{
                  top: '18px',
                  fontFamily: fontFamilyCss,
                  color: settings.inkColor,
                  opacity: settings.inkOpacity * 0.9,
                }}
              >
                <div className="flex items-center gap-4">
                  {headerInfo.name && <span>Name: <strong>{headerInfo.name}</strong></span>}
                  {headerInfo.rollNo && <span>Roll No: <strong>{headerInfo.rollNo}</strong></span>}
                </div>
                <div className="flex items-center gap-4">
                  {headerInfo.subject && <span>Sub: {headerInfo.subject}</span>}
                  {headerInfo.date && <span>Date: {headerInfo.date}</span>}
                  {headerInfo.showPageNumber && (
                    <span className="border-b border-current px-1 font-bold">
                      Page {pageIndex + 1}/{totalPages}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Handwritten Content Body */}
            <div
              className="relative z-10"
              style={{
                paddingTop: `${settings.topMargin}px`,
                paddingLeft: `${settings.leftMargin}px`,
                paddingRight: `${settings.rightMargin}px`,
                paddingBottom: `${settings.bottomMargin}px`,
                fontFamily: fontFamilyCss,
                fontSize: `${settings.fontSize}px`,
                lineHeight: `${settings.lineHeight}px`,
                letterSpacing: `${settings.letterSpacing}px`,
                color: settings.inkColor,
                opacity: settings.inkOpacity,
                fontWeight: settings.inkThickness > 1.2 ? 600 : settings.inkThickness < 0.9 ? 300 : 400,
              }}
            >
              {pageText ? (
                renderHumanizedText(pageText)
              ) : (
                <div className="text-slate-400 italic font-sans text-sm pt-8">
                  (Type or paste your assignment text in the editor on the left to see your handwritten page live...)
                </div>
              )}
            </div>

            {/* Dynamic Natural Pen Pressure Jitter & Stroke Endpoint Ink Accumulation Canvas */}
            <PenStrokeJitterCanvas
              pageIndex={pageIndex}
              pageText={pageText}
              settings={settings}
              fontFamilyCss={fontFamilyCss}
            />

            {/* Realistic Random Ink Blot & Smudge Artifacts */}
            {settings.inkBlots && (
              <InkBlotsOverlay
                pageIndex={pageIndex}
                pageText={pageText}
                inkColor={settings.inkColor}
                intensity={settings.inkBlotIntensity}
                seed={settings.inkBlotSeed}
                topMargin={settings.topMargin}
                leftMargin={settings.leftMargin}
                rightMargin={settings.rightMargin}
                bottomMargin={settings.bottomMargin}
                lineHeight={settings.lineHeight}
              />
            )}

            {/* Placed Diagram / Sketch Overlays */}
            {pageDiagrams.map((diag) => {
              const isSelected = activeDiagramId === diag.id;
              return (
                <div
                  key={diag.id}
                  onMouseDown={(e) => handleDiagramMouseDown(e, diag)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveDiagramId(diag.id);
                  }}
                  className={`absolute z-20 cursor-move transition-shadow ${
                    isSelected ? 'ring-2 ring-indigo-500 shadow-lg' : 'hover:ring-1 hover:ring-indigo-300'
                  }`}
                  style={{
                    left: `${diag.x}px`,
                    top: `${diag.y}px`,
                    width: `${diag.width}px`,
                    height: `${diag.height}px`,
                  }}
                >
                  <img
                    src={diag.dataUrl}
                    alt={diag.title || 'Diagram'}
                    className="w-full h-full object-contain pointer-events-none"
                    draggable={false}
                  />

                  {/* Caption if provided */}
                  {diag.title && (
                    <div
                      className="text-center mt-1 text-[11px] font-medium pointer-events-none"
                      style={{ fontFamily: fontFamilyCss, color: settings.inkColor }}
                    >
                      {diag.title}
                    </div>
                  )}

                  {/* Edit Controls when selected */}
                  {isSelected && (
                    <div className="absolute -top-7 right-0 flex items-center gap-1 bg-white border border-slate-300 rounded-md shadow-md p-0.5 z-30">
                      <button
                        onClick={(e) => handleResizeDiagram(e, diag, -20)}
                        className="px-1.5 py-0.5 text-[10px] font-bold text-slate-600 hover:bg-slate-100 rounded"
                        title="Smaller"
                      >
                        -
                      </button>
                      <button
                        onClick={(e) => handleResizeDiagram(e, diag, 20)}
                        className="px-1.5 py-0.5 text-[10px] font-bold text-slate-600 hover:bg-slate-100 rounded"
                        title="Larger"
                      >
                        +
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteDiagram(diag.id);
                        }}
                        className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                        title="Delete diagram"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Realistic Paper Lighting & Scanner Effects */}
            {settings.paperEffect === 'mobile-scan' && (
              <div className="absolute inset-0 paper-scanner-lighting" />
            )}
            {settings.paperEffect === 'subtle-shadow' && (
              <div className="absolute inset-0 desk-shadow-overlay" />
            )}
            {settings.paperEffect === 'desk-light' && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(circle at 80% 15%, rgba(255,255,230,0.35) 0%, transparent 60%)',
                }}
              />
            )}
          </div>
        </div>
        {/* Floating Overflow Alert for seamless Auto-Pagination */}
        {isPageOverflowing && onAutoSplitPages && (
          <div className="fixed sm:absolute bottom-4 left-1/2 -translate-x-1/2 z-30 max-w-lg w-[92%] px-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div
              className={`p-3 rounded-xl border shadow-xl flex items-center justify-between gap-3 text-xs backdrop-blur-md transition-all ${
                isLight
                  ? 'bg-amber-50/95 border-amber-300 text-amber-950 shadow-amber-900/10'
                  : 'bg-[#181512]/95 border-amber-500/50 text-amber-200 shadow-black/50'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0 border border-amber-500/40">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold flex items-center gap-1.5 flex-wrap">
                    <span>Assignment overflows Page {pageIndex + 1}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-mono-code bg-amber-500/20 border border-amber-500/40 text-amber-700 dark:text-amber-300 font-bold">
                      +{overflowLinesCount} lines / ~{overflowWordsCount} words
                    </span>
                  </div>
                  <p className="text-[11px] opacity-80 truncate">
                    Text exceeds physical page height. Auto-add needed pages?
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onAutoSplitPages}
                className="cursor-pointer bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs shadow-md uppercase tracking-wider flex items-center gap-1.5 shrink-0 transition-all active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Auto-Add Pages</span>
              </button>
            </div>
          </div>
        )}

        {/* Mobile Quick Action Export Bar when viewing paper */}
        {(onDownloadPdf || onDownloadImage) && (
          <div className="lg:hidden sticky bottom-2 left-0 right-0 px-3 z-20 pointer-events-auto mt-2">
            <div
              className={`p-2 rounded-xl border shadow-lg flex items-center justify-between gap-2 backdrop-blur-md ${
                isLight ? 'bg-white/95 border-slate-300' : 'bg-[#18181f]/95 border-white/10'
              }`}
            >
              {onDownloadPdf && (
                <button
                  type="button"
                  onClick={onDownloadPdf}
                  className="flex-1 cursor-pointer bg-[#6366f1] hover:bg-indigo-600 text-white font-mono-code font-bold py-2 px-2.5 rounded-lg text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF ({totalPages}p)</span>
                </button>
              )}
              {onDownloadImage && (
                <button
                  type="button"
                  onClick={onDownloadImage}
                  className={`cursor-pointer font-mono-code font-bold py-2 px-2.5 rounded-lg text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 border active:scale-95 ${
                    isLight
                      ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                      : 'bg-[#1e1e24] hover:bg-[#282830] border-white/10 text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-[#6366f1]" />
                  <span>PNG</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
