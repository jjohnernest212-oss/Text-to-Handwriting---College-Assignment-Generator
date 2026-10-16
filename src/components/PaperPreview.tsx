import React, { useRef, useState } from 'react';
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
} from 'lucide-react';
import {
  PageSettings,
  StudentHeaderInfo,
  DiagramElement,
  PaperType,
} from '../types';
import InkBlotsOverlay from './InkBlotsOverlay';

interface PaperPreviewProps {
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
}

export default function PaperPreview({
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
}: PaperPreviewProps) {
  const [zoomLevel, setZoomLevel] = useState<number>(0.85);
  const [activeDiagramId, setActiveDiagramId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Filter diagrams for current page
  const pageDiagrams = diagrams.filter((d) => d.pageIndex === pageIndex);

  // Background styling generator
  const getPaperBackgroundStyle = (paperType: PaperType, lineHeight: number, topMargin: number) => {
    switch (paperType) {
      case 'ruled':
        return {
          backgroundColor: '#fafaf9',
          backgroundImage: `repeating-linear-gradient(transparent 0px, transparent ${lineHeight - 1}px, #93c5fd ${lineHeight - 1}px, #93c5fd ${lineHeight}px)`,
          backgroundPosition: `0px ${topMargin}px`,
        };
      case 'college-ruled':
        return {
          backgroundColor: '#ffffff',
          backgroundImage: `repeating-linear-gradient(transparent 0px, transparent ${lineHeight - 1}px, #cbd5e1 ${lineHeight - 1}px, #cbd5e1 ${lineHeight}px)`,
          backgroundPosition: `0px ${topMargin}px`,
        };
      case 'grid':
        return {
          backgroundColor: '#ffffff',
          backgroundImage: `linear-gradient(to right, #e2e8f0 1px, transparent 1px), repeating-linear-gradient(transparent 0px, transparent ${lineHeight - 1}px, #e2e8f0 ${lineHeight - 1}px, #e2e8f0 ${lineHeight}px)`,
          backgroundSize: `20px 20px, 100% ${lineHeight}px`,
          backgroundPosition: `0px 0px, 0px ${topMargin}px`,
        };
      case 'vintage':
        return {
          backgroundColor: '#fbf5e5',
          backgroundImage: `repeating-linear-gradient(transparent 0px, transparent ${lineHeight - 1}px, #d4be98 ${lineHeight - 1}px, #d4be98 ${lineHeight}px)`,
          backgroundPosition: `0px ${topMargin}px`,
        };
      case 'plain':
      default:
        return {
          backgroundColor: '#ffffff',
        };
    }
  };

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

  // Human jitter simulation: render text lines with subtle human variations
  const renderHumanizedText = (text: string) => {
    if (!settings.humanJitter) {
      return (
        <div className="whitespace-pre-wrap select-text">
          {text}
        </div>
      );
    }

    // Split text into paragraphs/lines
    const lines = text.split('\n');

    return (
      <div className="select-text space-y-0">
        {lines.map((line, lIdx) => {
          if (line.trim() === '') {
            return <div key={lIdx} style={{ height: `${settings.lineHeight}px` }}>&nbsp;</div>;
          }

          // Split words to apply subtle micro-variations
          const words = line.split(' ');
          // Pseudo-random deterministic shift based on line index
          const lineTilt = ((lIdx % 5) - 2) * (0.05 * settings.jitterIntensity);
          const baselineShift = ((lIdx % 3) - 1) * (0.4 * settings.jitterIntensity);

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
                alignItems: 'baseline',
              }}
            >
              {words.map((word, wIdx) => {
                const wordJitter = ((wIdx % 4) - 1.5) * (0.08 * settings.jitterIntensity);
                return (
                  <span
                    key={wIdx}
                    style={{
                      marginRight: `${settings.wordSpacing}px`,
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
    <div className="flex flex-col h-full bg-[#121214] rounded-lg border border-[#27272a] overflow-hidden shadow-2xl">
      {/* Top Bar: Zoom Controls & Pagination */}
      <div className="px-4 py-2.5 bg-[#0c0c0e] border-b border-[#27272a] flex items-center justify-between gap-3 flex-wrap select-none">
        {/* Pagination navigator */}
        <div className="flex items-center gap-1.5 font-mono-code">
          <button
            onClick={() => onPageChange(Math.max(0, pageIndex - 1))}
            disabled={pageIndex === 0}
            className="cursor-pointer p-1 rounded text-[#e4e4e7]/60 hover:text-white hover:bg-[#18181b] disabled:opacity-20 disabled:hover:bg-transparent transition-colors"
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-[11px] font-bold text-[#e4e4e7] bg-[#18181b] border border-[#27272a] px-2.5 py-0.5 rounded tracking-wider">
            PAGE {String(pageIndex + 1).padStart(2, '0')} / {String(totalPages).padStart(2, '0')}
          </span>

          <button
            onClick={() => onPageChange(Math.min(totalPages - 1, pageIndex + 1))}
            disabled={pageIndex >= totalPages - 1}
            className="cursor-pointer p-1 rounded text-[#e4e4e7]/60 hover:text-white hover:bg-[#18181b] disabled:opacity-20 disabled:hover:bg-transparent transition-colors"
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Paper title / prompt info */}
        <div className="hidden sm:flex items-center gap-2 font-mono-code text-[10px] text-[#e4e4e7]/50 uppercase tracking-widest">
          <Eye className="w-3.5 h-3.5 text-[#6366f1]" />
          <span>REAL-TIME A4 SIMULATION // 300 DPI EQUIV</span>
        </div>

        {/* Zoom controls */}
        <div className="flex items-center gap-1 bg-[#18181b] border border-[#27272a] p-0.5 rounded font-mono-code">
          <button
            onClick={() => setZoomLevel((z) => Math.max(0.4, Number((z - 0.1).toFixed(2))))}
            className="cursor-pointer px-1.5 py-0.5 rounded text-[11px] hover:bg-[#27272a] text-[#e4e4e7]/70 hover:text-white transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3 h-3" />
          </button>
          <span className="text-[11px] text-[#6366f1] font-bold px-1.5">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={() => setZoomLevel((z) => Math.min(1.3, Number((z + 0.1).toFixed(2))))}
            className="cursor-pointer px-1.5 py-0.5 rounded text-[11px] hover:bg-[#27272a] text-[#e4e4e7]/70 hover:text-white transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3 h-3" />
          </button>
          <button
            onClick={() => setZoomLevel(0.85)}
            className="cursor-pointer px-1.5 py-0.5 rounded text-[11px] hover:bg-[#27272a] text-[#e4e4e7]/70 hover:text-white transition-colors"
            title="Fit View"
          >
            <Maximize2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Paper Scrollport */}
      <div
        className="flex-1 overflow-auto p-4 sm:p-8 flex items-start justify-center"
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
      </div>
    </div>
  );
}
