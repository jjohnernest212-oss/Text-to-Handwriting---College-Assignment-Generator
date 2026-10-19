import React, { useState, useRef } from 'react';
import {
  X,
  FileDown,
  Image as ImageIcon,
  Printer,
  CheckCircle2,
  Loader2,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import {
  downloadPageAsImage,
  downloadPagesAsPdf,
  ExportProgress,
} from '../utils/exportUtils';
import {
  PageSettings,
  StudentHeaderInfo,
  DiagramElement,
  PaperType,
} from '../types';
import InkBlotsOverlay from './InkBlotsOverlay';
import PenStrokeJitterCanvas from './PenStrokeJitterCanvas';

interface ExportModalProps {
  theme?: 'dark' | 'light';
  isOpen: boolean;
  onClose: () => void;
  currentPageIndex: number;
  totalPages: number;
  paperRef?: React.RefObject<HTMLDivElement | null>;
  onPrepareAllPages?: () => Promise<HTMLElement[]>;
  onCleanupExport?: () => void;
  pages?: string[];
  settings?: PageSettings;
  fontFamilyCss?: string;
  diagrams?: DiagramElement[];
  headerInfo?: StudentHeaderInfo;
}

export default function ExportModal({
  theme = 'dark',
  isOpen,
  onClose,
  currentPageIndex,
  totalPages,
  paperRef,
  onPrepareAllPages,
  onCleanupExport,
  pages = [],
  settings,
  fontFamilyCss = 'cursive',
  diagrams = [],
  headerInfo,
}: ExportModalProps) {
  const isLight = theme === 'light';
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [progress, setProgress] = useState<ExportProgress | null>(null);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const exportContainerRef = useRef<HTMLDivElement | null>(null);

  if (!isOpen) return null;

  // Background styling generator matching PaperPreview
  const getPaperBackgroundStyle = (paperType: PaperType, lineHeight: number, topMargin: number) => {
    switch (paperType) {
      case 'ruled':
        return {
          backgroundColor: '#fafaf9',
          backgroundImage: `
            radial-gradient(circle at 50% 50%, rgba(255,255,255,0.4) 0%, rgba(0,0,0,0.015) 100%),
            repeating-linear-gradient(transparent 0px, transparent ${lineHeight - 1}px, #93c5fd ${lineHeight - 1}px, #93c5fd ${lineHeight}px)
          `,
          backgroundPosition: `0 0, 0px ${topMargin}px`,
        };
      case 'college-ruled':
        return {
          backgroundColor: '#ffffff',
          backgroundImage: `
            linear-gradient(to right, rgba(0,0,0,0.01) 1px, transparent 1px),
            repeating-linear-gradient(transparent 0px, transparent ${lineHeight - 1}px, #cbd5e1 ${lineHeight - 1}px, #cbd5e1 ${lineHeight}px)
          `,
          backgroundPosition: `0 0, 0px ${topMargin}px`,
        };
      case 'grid':
        return {
          backgroundColor: '#ffffff',
          backgroundImage: `
            linear-gradient(to right, #e2e8f0 1px, transparent 1px),
            repeating-linear-gradient(transparent 0px, transparent ${lineHeight - 1}px, #e2e8f0 ${lineHeight - 1}px, #e2e8f0 ${lineHeight}px)
          `,
          backgroundSize: `20px 20px, 100% ${lineHeight}px`,
          backgroundPosition: `0px 0px, 0px ${topMargin}px`,
        };
      case 'vintage':
        return {
          backgroundColor: '#fbf4dc',
          backgroundImage: `
            radial-gradient(ellipse at center, rgba(255,255,255,0.2) 0%, rgba(138, 103, 58, 0.08) 100%),
            repeating-linear-gradient(transparent 0px, transparent ${lineHeight - 1}px, #cfb78f ${lineHeight - 1}px, #cfb78f ${lineHeight}px)
          `,
          backgroundPosition: `0 0, 0px ${topMargin}px`,
        };
      case 'parchment':
        return {
          backgroundColor: '#f6eed9',
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(205, 175, 130, 0.15) 0%, transparent 40%),
            radial-gradient(circle at 80% 70%, rgba(180, 140, 95, 0.12) 0%, transparent 50%),
            repeating-linear-gradient(transparent 0px, transparent ${lineHeight - 1}px, #be9f77 ${lineHeight - 1}px, #be9f77 ${lineHeight}px)
          `,
          backgroundPosition: `0 0, 0 0, 0px ${topMargin}px`,
        };
      case 'yellow-legal':
        return {
          backgroundColor: '#fef9c3',
          backgroundImage: `
            radial-gradient(circle at 50% 50%, rgba(255,255,255,0.4) 0%, rgba(202, 138, 4, 0.05) 100%),
            repeating-linear-gradient(transparent 0px, transparent ${lineHeight - 1}px, #93c5fd ${lineHeight - 1}px, #93c5fd ${lineHeight}px)
          `,
          backgroundPosition: `0 0, 0px ${topMargin}px`,
        };
      case 'dot-grid':
        return {
          backgroundColor: '#fafaf7',
          backgroundImage: `radial-gradient(#94a3b8 1.2px, transparent 1.2px)`,
          backgroundSize: '20px 20px',
          backgroundPosition: `0px ${topMargin % 20}px`,
        };
      case 'leather-diary':
        return {
          backgroundColor: '#f5efe0',
          backgroundImage: `
            radial-gradient(circle at 10% 20%, rgba(0,0,0,0.03) 0%, transparent 50%),
            radial-gradient(circle at 90% 80%, rgba(0,0,0,0.04) 0%, transparent 60%),
            repeating-linear-gradient(transparent 0px, transparent ${lineHeight - 1}px, #b0a18f ${lineHeight - 1}px, #b0a18f ${lineHeight}px)
          `,
          backgroundPosition: `0 0, 0 0, 0px ${topMargin}px`,
        };
      case 'kraft-recycled':
        return {
          backgroundColor: '#ebdccb',
          backgroundImage: `
            radial-gradient(circle at 30% 40%, rgba(120, 80, 40, 0.06) 0%, transparent 60%),
            radial-gradient(circle at 70% 60%, rgba(255,255,255,0.18) 0%, transparent 50%),
            repeating-linear-gradient(transparent 0px, transparent ${lineHeight - 1}px, #9c846d ${lineHeight - 1}px, #9c846d ${lineHeight}px)
          `,
          backgroundPosition: `0 0, 0 0, 0px ${topMargin}px`,
        };
      case 'plain':
      default:
        return {
          backgroundColor: '#ffffff',
          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,255,255,1) 0%, rgba(248, 250, 252, 0.8) 100%)`,
        };
    }
  };

  const getPageElements = async (): Promise<HTMLElement[]> => {
    if (typeof onPrepareAllPages === 'function') {
      try {
        const elems = await onPrepareAllPages();
        if (elems && elems.length > 0) return elems;
      } catch (err) {
        console.warn('onPrepareAllPages failed, using internal export container:', err);
      }
    }

    if (exportContainerRef.current) {
      const pageNodes = Array.from(
        exportContainerRef.current.querySelectorAll<HTMLElement>('.export-paper-sheet')
      );
      if (pageNodes.length > 0) return pageNodes;
    }

    if (paperRef?.current) {
      return [paperRef.current];
    }

    throw new Error('No page content available to generate assignment export.');
  };

  const handleDownloadSingleImage = async () => {
    setErrorMessage(null);
    try {
      setIsExporting(true);
      const elements = await getPageElements();
      const targetElement = elements[currentPageIndex] || elements[0] || paperRef?.current;

      if (!targetElement) {
        throw new Error('No page element found to render as image.');
      }

      await new Promise((r) => setTimeout(r, 60));

      await downloadPageAsImage(
        targetElement,
        `Assignment_Page_${currentPageIndex + 1}.png`,
        2.5
      );
      setExportSuccess(`Page ${currentPageIndex + 1} PNG downloaded successfully!`);
      setTimeout(() => {
        setExportSuccess(null);
        onClose();
      }, 1600);
    } catch (err: unknown) {
      console.error('Image export failed:', err);
      const message = err instanceof Error ? err.message : 'Unknown image export error';
      setErrorMessage(`Failed to export image: ${message}`);
    } finally {
      onCleanupExport?.();
      setIsExporting(false);
    }
  };

  const handleDownloadPdf = async () => {
    setErrorMessage(null);
    try {
      setIsExporting(true);
      setProgress({
        currentPage: 1,
        totalPages: Math.max(1, pages.length || totalPages),
        status: 'Preparing assignment pages for PDF...',
      });

      const elements = await getPageElements();

      await downloadPagesAsPdf(elements, 'Handwritten_Assignment.pdf', (p) => {
        setProgress(p);
      });

      setExportSuccess(
        `All ${elements.length} ${elements.length === 1 ? 'page' : 'pages'} compiled and downloaded successfully!`
      );
      setTimeout(() => {
        setExportSuccess(null);
        onClose();
      }, 1800);
    } catch (err: unknown) {
      console.error('PDF export failed:', err);
      const message = err instanceof Error ? err.message : 'Unknown PDF export error';
      setErrorMessage(`PDF Generation error: ${message}`);
    } finally {
      onCleanupExport?.();
      setIsExporting(false);
      setProgress(null);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 select-none">
      <div
        className={`rounded-2xl shadow-2xl border max-w-lg w-full flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 transition-colors ${
          isLight
            ? 'bg-white border-slate-300 text-slate-800'
            : 'bg-[#0c0c0e] border-[#27272a] text-[#e4e4e7]'
        }`}
      >
        {/* Header */}
        <div
          className={`px-6 py-4.5 border-b flex items-center justify-between ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#121214] border-[#27272a]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#6366f1]/15 border border-[#6366f1]/30 text-[#6366f1] flex items-center justify-center shadow-xs">
              <FileDown className="w-4 h-4" />
            </div>
            <div>
              <h3
                className={`font-syne text-base font-extrabold uppercase tracking-tight ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                Download Handwritten PDF
              </h3>
              <p
                className={`font-mono-code text-[10px] uppercase tracking-wider ${
                  isLight ? 'text-slate-500' : 'text-[#e4e4e7]/60'
                }`}
              >
                {totalPages} {totalPages === 1 ? 'PAGE' : 'PAGES'} READY FOR SUBMISSION
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isExporting}
            className={`cursor-pointer p-1.5 rounded-lg transition-colors ${
              isLight
                ? 'text-slate-400 hover:text-slate-900 hover:bg-slate-200'
                : 'text-[#e4e4e7]/60 hover:text-white hover:bg-[#18181b]'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Export Body */}
        <div className="p-6 space-y-4 font-mono-code">
          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-500 text-xs flex items-start gap-2.5 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold">{errorMessage}</p>
                <p className="text-[11px] opacity-80 mt-0.5">
                  Try downloading as PNG or review your text lines.
                </p>
              </div>
            </div>
          )}

          {isExporting ? (
            <div className="py-8 text-center space-y-3.5">
              <Loader2 className="w-10 h-10 text-[#6366f1] animate-spin mx-auto" />
              <div
                className={`text-xs font-bold uppercase tracking-wider ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                {progress?.status || 'RENDERING RETINA CANVAS...'}
              </div>
              {progress && (
                <div
                  className={`w-full h-2 rounded-full overflow-hidden max-w-xs mx-auto border ${
                    isLight ? 'bg-slate-200 border-slate-300' : 'bg-[#18181b] border-[#27272a]'
                  }`}
                >
                  <div
                    className="bg-[#6366f1] h-full transition-all duration-300 rounded-full"
                    style={{
                      width: `${Math.max(5, (progress.currentPage / progress.totalPages) * 100)}%`,
                    }}
                  />
                </div>
              )}
              <p
                className={`text-[10px] ${
                  isLight ? 'text-slate-500' : 'text-[#e4e4e7]/60'
                }`}
              >
                Compiling crisp A4 pages with ink physics and diagrams...
              </p>
            </div>
          ) : exportSuccess ? (
            <div className="py-8 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-in zoom-in-75 duration-200" />
              <h4
                className={`font-syne text-base font-bold uppercase ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                {exportSuccess}
              </h4>
              <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-[#e4e4e7]/70'}`}>
                Downloaded to your device. Ready for Google Classroom, Canvas, or Moodle!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Option 1: Multi-Page PDF */}
              <button
                type="button"
                onClick={handleDownloadPdf}
                className={`cursor-pointer w-full p-4 rounded-xl border text-left transition-all flex items-start gap-3.5 group shadow-sm active:scale-[0.99] ${
                  isLight
                    ? 'border-[#6366f1] bg-[#6366f1]/10 hover:bg-[#6366f1]/15 hover:shadow-md'
                    : 'border-[#6366f1] bg-[#6366f1]/15 hover:bg-[#6366f1]/25 hover:shadow-indigo-950/40'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-[#6366f1] text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                  <FileDown className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider ${
                        isLight ? 'text-slate-900' : 'text-white'
                      }`}
                    >
                      Download Multi-Page PDF ({totalPages} {totalPages === 1 ? 'Page' : 'Pages'})
                    </span>
                    <span className="bg-[#6366f1] text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                      RECOMMENDED
                    </span>
                  </div>
                  <p
                    className={`text-[11px] mt-1 leading-relaxed ${
                      isLight ? 'text-slate-600' : 'text-[#e4e4e7]/70'
                    }`}
                  >
                    Smoothly compiles all {totalPages} assignment pages into a high-resolution, watermark-free A4 PDF document.
                  </p>
                </div>
              </button>

              {/* Option 2: Current Page as High-Res Image */}
              <button
                type="button"
                onClick={handleDownloadSingleImage}
                className={`cursor-pointer w-full p-3.5 rounded-xl border text-left transition-all flex items-start gap-3.5 group active:scale-[0.99] ${
                  isLight
                    ? 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                    : 'bg-[#18181b] hover:bg-[#222226] border-[#27272a]'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    isLight
                      ? 'bg-slate-200 text-slate-700 group-hover:bg-slate-300'
                      : 'bg-[#27272a] text-[#e4e4e7] group-hover:text-white'
                  }`}
                >
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <span
                    className={`text-xs font-bold uppercase tracking-wider block ${
                      isLight ? 'text-slate-900' : 'text-white'
                    }`}
                  >
                    Download Current Page {currentPageIndex + 1} (PNG)
                  </span>
                  <p
                    className={`text-[10px] mt-0.5 ${
                      isLight ? 'text-slate-500' : 'text-[#e4e4e7]/60'
                    }`}
                  >
                    Crisp 2.5x retina image raster of the active page sheet.
                  </p>
                </div>
              </button>

              {/* Option 3: Direct Print */}
              <button
                type="button"
                onClick={handlePrint}
                className={`cursor-pointer w-full p-3 rounded-xl border text-left transition-all flex items-center gap-3 group active:scale-[0.99] ${
                  isLight
                    ? 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                    : 'bg-[#18181b] hover:bg-[#222226] border-[#27272a]'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    isLight ? 'bg-slate-200 text-slate-700' : 'bg-[#27272a] text-[#e4e4e7]'
                  }`}
                >
                  <Printer className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1">
                  <span
                    className={`text-xs font-bold uppercase tracking-wider ${
                      isLight ? 'text-slate-900' : 'text-white'
                    }`}
                  >
                    Print / Browser System Print
                  </span>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className={`px-6 py-3.5 border-t flex items-center justify-between font-mono-code text-[10px] ${
            isLight
              ? 'bg-slate-50 border-slate-200 text-slate-500'
              : 'bg-[#121214] border-[#27272a] text-[#e4e4e7]/50'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>CALIBRATED FOR A4 (210 × 297 MM)</span>
          </span>
          <button
            onClick={onClose}
            disabled={isExporting}
            className={`cursor-pointer px-3 py-1 uppercase rounded-lg transition-colors ${
              isLight
                ? 'hover:bg-slate-200 text-slate-700'
                : 'hover:bg-white/10 text-[#e4e4e7]/80 hover:text-white'
            }`}
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Off-screen Pristine A4 Pages for High-Res HTML2Canvas & PDF capture */}
      {settings && pages.length > 0 && (
        <div
          ref={exportContainerRef}
          style={{
            position: 'fixed',
            left: '0px',
            top: '0px',
            width: '794px',
            height: '1123px',
            opacity: 0.001,
            pointerEvents: 'none',
            zIndex: -9999,
            overflow: 'hidden',
          }}
          aria-hidden="true"
        >
          {pages.map((pText, pIdx) => {
            const currentDiagrams = diagrams.filter((d) => d.pageIndex === pIdx);
            return (
              <div
                key={`export-page-${pIdx}`}
                className="export-paper-sheet relative rounded-none overflow-hidden"
                style={{
                  width: '794px',
                  height: '1123px',
                  display: pIdx === 0 ? 'block' : 'none',
                  ...getPaperBackgroundStyle(settings.paperType, settings.lineHeight, settings.topMargin),
                }}
              >
                {/* Horizontal Top Margin Rule */}
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

                {/* Vertical Margin Rule */}
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

                {/* Secondary Red Margin Rule for Legal Pad */}
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

                {/* Student Header */}
                {headerInfo?.enabled && (
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
                          Page {pIdx + 1}/{pages.length}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Handwritten Body */}
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
                    textAlign: settings.justification === 'full' ? 'justify' : 'left',
                    textJustify: settings.justification === 'full' ? 'inter-word' : undefined,
                  }}
                >
                  <div className="whitespace-pre-wrap select-text leading-inherit">
                    {pText}
                  </div>
                </div>

                {/* Pen Pressure & Jitter Canvas in Export */}
                <PenStrokeJitterCanvas
                  pageIndex={pIdx}
                  pageText={pText}
                  settings={settings}
                  fontFamilyCss={fontFamilyCss}
                />

                {/* Ink Blots in Export */}
                {settings.inkBlots && (
                  <InkBlotsOverlay
                    pageIndex={pIdx}
                    pageText={pText}
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

                {/* Diagrams in Export */}
                {currentDiagrams.map((diag) => (
                  <div
                    key={diag.id}
                    className="absolute z-20 pointer-events-none"
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
                      className="w-full h-full object-contain"
                    />
                    {diag.title && (
                      <div
                        className="text-center mt-1 text-[11px] font-medium"
                        style={{ fontFamily: fontFamilyCss, color: settings.inkColor }}
                      >
                        {diag.title}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
