import React, { useRef, useState, useEffect } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Plus,
  AlertTriangle,
  Ruler,
} from 'lucide-react';
import {
  PageSettings,
  StudentHeaderInfo,
  DiagramElement,
} from '../types';
import InkBlotsOverlay from './InkBlotsOverlay';
import PenStrokeJitterCanvas from './PenStrokeJitterCanvas';
import { getLinesPerPage, getCharsPerLine, formatTextToPaperLines } from '../utils/paginationUtils';
import { getPaperBackgroundStyle } from '../utils/paperStyles';

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
  onToggleMarginGuides?: () => void;
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
  onToggleMarginGuides,
}: PaperPreviewProps) {
  const isLight = theme === 'light';
  const scrollportRef = useRef<HTMLDivElement | null>(null);

  const calculateFitZoom = () => {
    const containerWidth = scrollportRef.current?.clientWidth || window.innerWidth;
    const padding = containerWidth < 640 ? 20 : 56;
    const availWidth = Math.max(280, containerWidth - padding);
    return Math.min(1.0, Math.max(0.35, Number((availWidth / 804).toFixed(2))));
  };

  const [zoomLevel, setZoomLevel] = useState<number>(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      const padding = window.innerWidth < 640 ? 20 : 56;
      const availWidth = Math.max(280, window.innerWidth - padding);
      return Math.min(1.0, Math.max(0.35, Number((availWidth / 804).toFixed(2))));
    }
    return 0.85;
  });

  useEffect(() => {
    const updateMobileFit = () => {
      if (window.innerWidth < 1024 && scrollportRef.current && scrollportRef.current.clientWidth > 0) {
        setZoomLevel(calculateFitZoom());
      }
    };

    const observer = new ResizeObserver(() => {
      updateMobileFit();
    });

    if (scrollportRef.current) {
      observer.observe(scrollportRef.current);
    }
    window.addEventListener('resize', updateMobileFit);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateMobileFit);
    };
  }, []);

  const [activeDiagramId, setActiveDiagramId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const dragStartRef = useRef<{
    pointerX: number;
    pointerY: number;
    origX: number;
    origY: number;
  } | null>(null);

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
  const activeDiagram = pageDiagrams.find((d) => d.id === activeDiagramId) || null;

  const isDarkPaper =
    settings.paperType === 'dark-aesthetic' || settings.paperType === 'leather-diary';

  // Zoom-aware unified Pointer dragging (works identically on mobile touch & desktop mouse)
  const handleDiagramPointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
    diag: DiagramElement
  ) => {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    setActiveDiagramId(diag.id);
    setDraggingId(diag.id);
    dragStartRef.current = {
      pointerX: e.clientX,
      pointerY: e.clientY,
      origX: diag.x,
      origY: diag.y,
    };
  };

  const handlePaperPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingId || !dragStartRef.current) return;
    const diag = pageDiagrams.find((d) => d.id === draggingId);
    if (!diag) return;

    const deltaX = (e.clientX - dragStartRef.current.pointerX) / zoomLevel;
    const deltaY = (e.clientY - dragStartRef.current.pointerY) / zoomLevel;

    let newX = Math.max(
      8,
      Math.min(794 - diag.width - 8, Math.round(dragStartRef.current.origX + deltaX))
    );
    let newY = Math.max(
      8,
      Math.min(1123 - diag.height - 8, Math.round(dragStartRef.current.origY + deltaY))
    );

    // Gentle magnetic snap when Margin Guides are visible
    if (settings.showMarginGuides) {
      const centerX = Math.round((794 - diag.width) / 2);
      const rightEdgeX = 794 - settings.rightMargin - diag.width;
      if (Math.abs(newX - settings.leftMargin) < 8) newX = settings.leftMargin;
      else if (Math.abs(newX - centerX) < 8) newX = centerX;
      else if (Math.abs(newX - rightEdgeX) < 8) newX = rightEdgeX;

      if (Math.abs(newY - settings.topMargin) < 8) newY = settings.topMargin;
    }

    onUpdateDiagram({
      ...diag,
      x: newX,
      y: newY,
    });
  };

  const handlePaperPointerUp = () => {
    setDraggingId(null);
    dragStartRef.current = null;
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
              return (
                <div key={lIdx} style={{ height: `${settings.lineHeight}px` }}>
                  &nbsp;
                </div>
              );
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
            return (
              <div key={lIdx} style={{ height: `${settings.lineHeight}px` }}>
                &nbsp;
              </div>
            );
          }

          const words = line.split(' ');
          const lineTilt = ((lIdx % 5) - 2) * (0.05 * settings.jitterIntensity);
          const baselineShift = ((lIdx % 3) - 1) * (0.4 * settings.jitterIntensity);

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

  // Precompute guide geometry for A4 (794 x 1123)
  const guideStroke = isDarkPaper ? 'rgba(165, 180, 252, 0.5)' : 'rgba(154, 67, 25, 0.42)';
  const guideCenterStroke = isDarkPaper
    ? 'rgba(165, 180, 252, 0.24)'
    : 'rgba(154, 67, 25, 0.2)';
  const guideZoneTint = isDarkPaper ? 'rgba(129, 140, 248, 0.08)' : 'rgba(154, 67, 25, 0.045)';
  const guideTagBg = isDarkPaper
    ? 'bg-slate-900/90 text-sky-200 border-sky-400/30'
    : 'bg-[#FFFDF8]/95 text-[#9A4319] border-[#E2C2A8]';
  const safeRightX = 794 - settings.rightMargin;
  const safeBottomY = 1123 - settings.bottomMargin;
  const lineMarkers: number[] = [];
  for (let i = 5; i <= linesPerPage; i += 5) {
    lineMarkers.push(i);
  }

  return (
    <div
      className={`flex flex-col h-full rounded-2xl border overflow-hidden shadow-xs transition-colors ${
        isLight
          ? 'bg-[#FFFDF8] border-[#DDD2BC] text-[#1E1B18]'
          : 'bg-[#0B1222]/92 border-sky-300/15 text-slate-100'
      }`}
    >
      {/* Top Bar: Clean Pagination, Guides Toggle & Zoom Controls */}
      <div
        className={`px-3 sm:px-4 py-2 border-b flex items-center justify-between gap-2 flex-wrap select-none ${
          isLight ? 'bg-[#FAF4E8] border-[#EAE0CD]' : 'bg-[#080F1E]/95 border-sky-300/15'
        }`}
      >
        {/* Left: Pagination & Add Page */}
        <div className="flex items-center gap-1.5">
          <div
            className={`flex items-center rounded-xl border p-0.5 ${
              isLight ? 'bg-[#FFFDF8] border-[#D7CCB5]' : 'bg-[#0E172B] border-sky-300/20'
            }`}
          >
            <button
              type="button"
              onClick={() => onPageChange(Math.max(0, pageIndex - 1))}
              disabled={pageIndex === 0}
              className={`cursor-pointer min-h-[36px] min-w-[36px] rounded-lg flex items-center justify-center disabled:opacity-25 transition-colors ${
                isLight ? 'text-[#4A433A] hover:bg-[#FAF4E8]' : 'text-slate-200 hover:bg-sky-500/15'
              }`}
              title="Previous Page"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-xs font-semibold tabular-nums px-2 whitespace-nowrap">
              Page {pageIndex + 1} / {totalPages}
            </span>

            <button
              type="button"
              onClick={() => onPageChange(Math.min(totalPages - 1, pageIndex + 1))}
              disabled={pageIndex >= totalPages - 1}
              className={`cursor-pointer min-h-[36px] min-w-[36px] rounded-lg flex items-center justify-center disabled:opacity-25 transition-colors ${
                isLight ? 'text-[#4A433A] hover:bg-[#FAF4E8]' : 'text-slate-200 hover:bg-sky-500/15'
              }`}
              title="Next Page"
              aria-label="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {onAddPage && (
            <button
              type="button"
              onClick={onAddPage}
              className={`cursor-pointer min-h-[38px] px-3 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors whitespace-nowrap shrink-0 active:scale-95 ${
                isLight
                  ? 'bg-[#24201C] hover:bg-[#38322C] text-[#FFFDF8]'
                  : 'bg-sky-500 hover:bg-sky-400 text-slate-950'
              }`}
              title="Add a blank page"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Page</span>
            </button>
          )}

          {isPageOverflowing && onAutoSplitPages && (
            <button
              type="button"
              onClick={onAutoSplitPages}
              className="cursor-pointer min-h-[38px] px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#1E1B18] text-xs font-bold flex items-center gap-1 transition-colors whitespace-nowrap shrink-0 active:scale-95"
              title={`Split overflowing text across pages`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Auto-Split</span>
            </button>
          )}

          {totalPages > 1 && onDeletePage && (
            <button
              type="button"
              onClick={onDeletePage}
              className={`cursor-pointer min-h-[38px] min-w-[38px] rounded-xl flex items-center justify-center transition-colors border ${
                isLight
                  ? 'border-[#D7CCB5] text-[#6E655A] hover:text-rose-700 hover:bg-rose-50'
                  : 'border-sky-300/20 text-slate-300 hover:text-rose-300 hover:bg-rose-500/15'
              }`}
              title={`Delete Page ${pageIndex + 1}`}
              aria-label={`Delete Page ${pageIndex + 1}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Right: Quick Margin Guides Toggle + Zoom Controls */}
        <div className="flex items-center gap-2">
          {onToggleMarginGuides && (
            <button
              type="button"
              onClick={onToggleMarginGuides}
              aria-pressed={settings.showMarginGuides}
              title="Toggle faint Margin Guides for aligning text and diagrams (not printed)"
              className={`cursor-pointer min-h-[38px] px-3 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-colors whitespace-nowrap shrink-0 active:scale-95 ${
                settings.showMarginGuides
                  ? isLight
                    ? 'bg-[#F6EBE0] border-[#E2C2A8] text-[#9A4319]'
                    : 'bg-sky-500/20 border-sky-400/60 text-sky-200'
                  : isLight
                  ? 'bg-[#FFFDF8] border-[#D7CCB5] text-[#4A433A] hover:text-[#1E1B18] hover:bg-[#FAF4E8]'
                  : 'bg-[#0E172B] border-sky-300/20 text-slate-300 hover:text-white hover:bg-[#121D35]'
              }`}
            >
              <Ruler className={`w-3.5 h-3.5 ${isLight ? 'text-[#9A4319]' : 'text-sky-400'}`} />
              <span>Guides</span>
            </button>
          )}

          <div
            className={`flex items-center gap-0.5 p-0.5 rounded-xl border ${
              isLight ? 'bg-[#FFFDF8] border-[#D7CCB5]' : 'bg-[#0E172B] border-sky-300/20'
            }`}
          >
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.max(0.35, Number((z - 0.1).toFixed(2))))}
              className={`cursor-pointer min-h-[34px] min-w-[34px] rounded-lg flex items-center justify-center transition-colors ${
                isLight ? 'hover:bg-[#FAF4E8] text-[#4A433A]' : 'hover:bg-sky-500/15 text-slate-200'
              }`}
              title="Zoom Out"
              aria-label="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className={`text-xs font-semibold tabular-nums px-1.5 min-w-[44px] text-center ${isLight ? 'text-[#9A4319]' : 'text-sky-300'}`}>
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(1.3, Number((z + 0.1).toFixed(2))))}
              className={`cursor-pointer min-h-[34px] min-w-[34px] rounded-lg flex items-center justify-center transition-colors ${
                isLight ? 'hover:bg-[#FAF4E8] text-[#4A433A]' : 'hover:bg-sky-500/15 text-slate-200'
              }`}
              title="Zoom In"
              aria-label="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel(calculateFitZoom())}
              className={`cursor-pointer min-h-[34px] min-w-[34px] rounded-lg flex items-center justify-center transition-colors ${
                isLight ? 'hover:bg-[#FAF4E8] text-[#4A433A]' : 'hover:bg-sky-500/15 text-slate-200'
              }`}
              title="Fit Paper to Screen"
              aria-label="Fit Paper to Screen"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Paper Scrollport (Desk background) */}
      <div
        ref={scrollportRef}
        className={`flex-1 overflow-auto p-3 sm:p-6 lg:p-8 flex items-start justify-center transition-colors relative ${
          isLight ? 'bg-[#EDE4D2]/85' : 'bg-[#050914]/65'
        }`}
        onPointerMove={handlePaperPointerMove}
        onPointerUp={handlePaperPointerUp}
        onPointerCancel={handlePaperPointerUp}
        onClick={() => setActiveDiagramId(null)}
      >
        <div
          style={{
            width: `${Math.round(794 * zoomLevel)}px`,
            height: `${Math.round(1123 * zoomLevel)}px`,
          }}
          className="relative shrink-0 mx-auto"
        >
          <div
            style={{
              width: '794px',
              height: '1123px',
              transform: `scale(${zoomLevel}) rotate(${settings.paperTilt}deg)`,
              transformOrigin: 'top left',
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
                  Summary / Key Takeaways:
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

            {/* Secondary Red Margin Line for Yellow Legal Pad */}
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

            {/* Student Header at Top of Page */}
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
                  {headerInfo.name && (
                    <span>
                      Name: <strong>{headerInfo.name}</strong>
                    </span>
                  )}
                  {headerInfo.rollNo && (
                    <span>
                      Roll No: <strong>{headerInfo.rollNo}</strong>
                    </span>
                  )}
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
                fontWeight:
                  settings.inkThickness > 1.2 ? 600 : settings.inkThickness < 0.9 ? 300 : 400,
              }}
            >
              {pageText ? (
                renderHumanizedText(pageText)
              ) : (
                <div className="text-slate-400 italic font-sans text-sm pt-8">
                  Type or paste your assignment text to see your handwritten page live.
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

            {/* ===================================================================== */}
            {/* OPTIONAL MARGIN GUIDES OVERLAY (Preview Only · Never Exported)        */}
            {/* ===================================================================== */}
            {settings.showMarginGuides && (
              <div
                aria-hidden="true"
                data-preview-only="true"
                className="absolute inset-0 pointer-events-none select-none z-20"
              >
                {/* Faint shaded non-printable outer margin zones */}
                <div
                  className="absolute top-0 left-0 right-0"
                  style={{ height: `${settings.topMargin}px`, backgroundColor: guideZoneTint }}
                />
                <div
                  className="absolute bottom-0 left-0 right-0"
                  style={{ height: `${settings.bottomMargin}px`, backgroundColor: guideZoneTint }}
                />
                <div
                  className="absolute left-0"
                  style={{
                    top: `${settings.topMargin}px`,
                    bottom: `${settings.bottomMargin}px`,
                    width: `${settings.leftMargin}px`,
                    backgroundColor: guideZoneTint,
                  }}
                />
                <div
                  className="absolute right-0"
                  style={{
                    top: `${settings.topMargin}px`,
                    bottom: `${settings.bottomMargin}px`,
                    width: `${settings.rightMargin}px`,
                    backgroundColor: guideZoneTint,
                  }}
                />

                {/* Top Margin Guide Line */}
                <div
                  className="absolute left-0 right-0"
                  style={{
                    top: `${settings.topMargin}px`,
                    borderTop: `1px dashed ${guideStroke}`,
                  }}
                />

                {/* Bottom Margin Guide Line */}
                <div
                  className="absolute left-0 right-0"
                  style={{
                    top: `${safeBottomY}px`,
                    borderTop: `1px dashed ${guideStroke}`,
                  }}
                />

                {/* Left Writing Margin Guide Line */}
                <div
                  className="absolute top-0 bottom-0"
                  style={{
                    left: `${settings.leftMargin}px`,
                    borderLeft: `1px dashed ${guideStroke}`,
                  }}
                />

                {/* Right Writing Margin Guide Line */}
                <div
                  className="absolute top-0 bottom-0"
                  style={{
                    left: `${safeRightX}px`,
                    borderLeft: `1px dashed ${guideStroke}`,
                  }}
                />

                {/* Subtle Center Axis Crosshairs (helps center diagrams & headings) */}
                <div
                  className="absolute left-1/2"
                  style={{
                    top: `${settings.topMargin}px`,
                    bottom: `${settings.bottomMargin}px`,
                    borderLeft: `1px dotted ${guideCenterStroke}`,
                  }}
                />
                <div
                  className="absolute top-1/2"
                  style={{
                    left: `${settings.leftMargin}px`,
                    right: `${settings.rightMargin}px`,
                    borderTop: `1px dotted ${guideCenterStroke}`,
                  }}
                />

                {/* Corner Registration Brackets on the Printable Content Frame */}
                <div
                  className="absolute w-3.5 h-3.5 border-t-2 border-l-2"
                  style={{
                    top: `${settings.topMargin - 1}px`,
                    left: `${settings.leftMargin - 1}px`,
                    borderColor: guideStroke,
                  }}
                />
                <div
                  className="absolute w-3.5 h-3.5 border-t-2 border-r-2"
                  style={{
                    top: `${settings.topMargin - 1}px`,
                    left: `${safeRightX - 13}px`,
                    borderColor: guideStroke,
                  }}
                />
                <div
                  className="absolute w-3.5 h-3.5 border-b-2 border-l-2"
                  style={{
                    top: `${safeBottomY - 13}px`,
                    left: `${settings.leftMargin - 1}px`,
                    borderColor: guideStroke,
                  }}
                />
                <div
                  className="absolute w-3.5 h-3.5 border-b-2 border-r-2"
                  style={{
                    top: `${safeBottomY - 13}px`,
                    left: `${safeRightX - 13}px`,
                    borderColor: guideStroke,
                  }}
                />

                {/* Line Interval Ticks along Left Margin (every 5 lines) */}
                {lineMarkers.map((lineNum) => {
                  const yPos = settings.topMargin + (lineNum - 1) * settings.lineHeight;
                  if (yPos > safeBottomY - 10) return null;
                  return (
                    <div
                      key={lineNum}
                      className="absolute flex items-center gap-1"
                      style={{
                        top: `${yPos + settings.lineHeight * 0.45}px`,
                        left: `${Math.max(6, settings.leftMargin - 30)}px`,
                      }}
                    >
                      <span
                        className={`text-[9px] font-mono-code font-semibold px-1 rounded border ${guideTagBg}`}
                      >
                        L{lineNum}
                      </span>
                      <span
                        className="w-2 h-[1px]"
                        style={{ backgroundColor: guideStroke }}
                      />
                    </div>
                  );
                })}

                {/* Dimension Markers & Preview-Only Legend */}
                <div
                  className={`absolute text-[10px] font-mono-code font-medium px-1.5 py-0.5 rounded border ${guideTagBg}`}
                  style={{ top: `${Math.max(4, settings.topMargin - 20)}px`, left: `${settings.leftMargin + 6}px` }}
                >
                  Margin Guides · Preview Only · Top {settings.topMargin}px
                </div>
                <div
                  className={`absolute text-[10px] font-mono-code font-medium px-1.5 py-0.5 rounded border ${guideTagBg}`}
                  style={{
                    top: `${Math.min(1100, safeBottomY + 6)}px`,
                    left: `${settings.leftMargin + 6}px`,
                  }}
                >
                  Safe Width: {794 - settings.leftMargin - settings.rightMargin}px · Bottom {settings.bottomMargin}px
                </div>

                {/* Live Alignment Crosshairs when dragging/selecting a diagram */}
                {activeDiagram && (
                  <>
                    <div
                      className="absolute left-0 right-0 border-t border-dashed border-indigo-500/60"
                      style={{ top: `${activeDiagram.y}px` }}
                    />
                    <div
                      className="absolute top-0 bottom-0 border-l border-dashed border-indigo-500/60"
                      style={{ left: `${activeDiagram.x}px` }}
                    />
                    <div
                      className="absolute top-0 bottom-0 border-l border-dotted border-indigo-400/50"
                      style={{ left: `${activeDiagram.x + activeDiagram.width / 2}px` }}
                    />
                    <div
                      className={`absolute text-[10px] font-mono-code font-bold px-1.5 py-0.5 rounded border ${guideTagBg}`}
                      style={{
                        top: `${Math.max(6, activeDiagram.y - 22)}px`,
                        left: `${activeDiagram.x}px`,
                      }}
                    >
                      X: {activeDiagram.x}px · Y: {activeDiagram.y}px
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Placed Diagram / Sketch Overlays */}
            {pageDiagrams.map((diag) => {
              const isSelected = activeDiagramId === diag.id;
              return (
                <div
                  key={diag.id}
                  onPointerDown={(e) => handleDiagramPointerDown(e, diag)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveDiagramId(diag.id);
                  }}
                  className={`absolute z-20 cursor-move touch-none transition-shadow ${
                    isSelected
                      ? 'ring-2 ring-indigo-500 shadow-lg'
                      : 'hover:ring-1 hover:ring-indigo-300'
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
                    <div
                      className="absolute -top-11 right-0 flex items-center gap-1 bg-white border border-slate-300 rounded-xl shadow-md p-1 z-30"
                      onPointerDown={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={(e) => handleResizeDiagram(e, diag, -20)}
                        className="min-w-[32px] min-h-[32px] px-2.5 text-sm font-bold text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer flex items-center justify-center"
                        title="Smaller"
                        aria-label="Shrink diagram"
                      >
                        -
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleResizeDiagram(e, diag, 20)}
                        className="min-w-[32px] min-h-[32px] px-2.5 text-sm font-bold text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer flex items-center justify-center"
                        title="Larger"
                        aria-label="Enlarge diagram"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteDiagram(diag.id);
                        }}
                        className="min-w-[32px] min-h-[32px] p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer flex items-center justify-center"
                        title="Delete diagram"
                        aria-label="Delete diagram"
                      >
                        <Trash2 className="w-4 h-4" />
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
        </div>

        {/* Overflow Alert for seamless Auto-Pagination */}
        {isPageOverflowing && onAutoSplitPages && (
          <div className="fixed sm:absolute bottom-20 lg:bottom-4 left-1/2 -translate-x-1/2 z-30 max-w-lg w-[92%] px-2">
            <div
              className={`p-3 rounded-2xl border shadow-xl flex items-center justify-between gap-3 text-xs transition-all ${
                isLight
                  ? 'bg-[#FFFDF8]/96 border-amber-300 text-[#1E1B18]'
                  : 'bg-[#0B1222]/95 border-amber-400/45 text-amber-200'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${isLight ? 'bg-amber-100 border-amber-300' : 'bg-amber-400/15 border-amber-400/35'}`}>
                  <AlertTriangle className={`w-4 h-4 ${isLight ? 'text-amber-700' : 'text-amber-300'}`} />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold">
                    Page {pageIndex + 1} has +{overflowLinesCount} extra lines (~{overflowWordsCount} words)
                  </div>
                  <p className="text-[11px] opacity-85 truncate">
                    Split cleanly onto the next sheet so nothing gets cut off.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onAutoSplitPages}
                className="cursor-pointer bg-amber-500 hover:bg-amber-400 text-[#1E1B18] font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 shrink-0 transition-colors active:scale-95 whitespace-nowrap"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Auto-Split</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
