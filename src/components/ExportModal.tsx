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
  downloadAssignmentAsPdf,
  downloadAssignmentSinglePage,
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
      const safePages = pages && pages.length > 0 ? pages : [''];
      const targetIndex = Math.max(0, Math.min(currentPageIndex, safePages.length - 1));

      if (settings) {
        await downloadAssignmentSinglePage({
          pages: safePages,
          pageIndex: targetIndex,
          settings,
          fontFamilyCss,
          diagrams,
          headerInfo,
          filename: `Assignment_Page_${targetIndex + 1}.png`,
        });
      } else {
        const elements = await getPageElements();
        const targetElement = elements[targetIndex] || elements[0] || paperRef?.current;
        if (!targetElement) {
          throw new Error('No page element found to render as image.');
        }
        await downloadPageAsImage(targetElement, `Assignment_Page_${targetIndex + 1}.png`);
      }

      setExportSuccess(`Page ${targetIndex + 1} PNG downloaded successfully!`);
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
      const safePages = pages && pages.length > 0 ? pages : [''];
      const total = safePages.length;

      setProgress({
        currentPage: 1,
        totalPages: total,
        status: 'Starting authentic handwritten PDF export...',
      });

      if (settings) {
        await downloadAssignmentAsPdf({
          pages: safePages,
          settings,
          fontFamilyCss,
          diagrams,
          headerInfo,
          filename: 'Handwritten_Assignment.pdf',
          onProgress: (p) => setProgress(p),
        });
      } else {
        const elements = await getPageElements();
        await downloadPagesAsPdf(elements, 'Handwritten_Assignment.pdf', (p) => {
          setProgress(p);
        });
      }

      setExportSuccess(
        `All ${total} ${total === 1 ? 'page' : 'pages'} compiled and downloaded successfully!`
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E1B18]/45 p-4 select-none">
      <div
        className={`rounded-2xl shadow-2xl border max-w-lg w-full flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 transition-colors ${
          isLight
            ? 'bg-[#FFFDF8] border-[#DDD2BC] text-[#1E1B18]'
            : 'bg-[#0B1222] border-sky-300/20 text-slate-100'
        }`}
      >
        {/* Header */}
        <div
          className={`px-6 py-4.5 border-b flex items-center justify-between ${
            isLight ? 'bg-[#FAF4E8] border-[#EAE0CD]' : 'bg-[#080F1E] border-sky-300/15'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl border flex items-center justify-center shadow-xs ${
                isLight
                  ? 'bg-[#F6EBE0] border-[#E2C2A8] text-[#9A4319]'
                  : 'bg-sky-500/15 border-sky-400/35 text-sky-300'
              }`}
            >
              <FileDown className="w-4 h-4" />
            </div>
            <div>
              <h3
                className={`font-syne text-base font-extrabold uppercase tracking-tight ${
                  isLight ? 'text-[#1E1B18]' : 'text-white'
                }`}
              >
                Download Handwritten PDF
              </h3>
              <p
                className={`font-mono-code text-[10px] uppercase tracking-wider ${
                  isLight ? 'text-[#6E655A]' : 'text-slate-400'
                }`}
              >
                {totalPages} {totalPages === 1 ? 'PAGE' : 'PAGES'} READY TO EXPORT
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isExporting}
            className={`cursor-pointer p-1.5 rounded-lg transition-colors ${
              isLight
                ? 'text-[#6E655A] hover:text-[#1E1B18] hover:bg-[#EDE4D2]'
                : 'text-slate-400 hover:text-white hover:bg-sky-500/15'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Export Body */}
        <div className="p-6 space-y-4 font-mono-code">
          {/* Error Banner */}
          {errorMessage && (
            <div
              className={`p-3.5 border rounded-xl text-xs flex items-start gap-2.5 animate-in fade-in duration-150 ${
                isLight
                  ? 'bg-rose-50 border-rose-300 text-rose-800'
                  : 'bg-rose-500/15 border-rose-400/35 text-rose-200'
              }`}
            >
              <AlertCircle className={`w-4 h-4 shrink-0 mt-0.5 ${isLight ? 'text-rose-600' : 'text-rose-300'}`} />
              <div className="flex-1">
                <p className="font-bold">{errorMessage}</p>
                <p className="text-[11px] opacity-85 mt-0.5">
                  Try downloading as PNG or review your text lines.
                </p>
              </div>
            </div>
          )}

          {isExporting ? (
            <div className="py-8 text-center space-y-3.5">
              <Loader2 className={`w-10 h-10 animate-spin mx-auto ${isLight ? 'text-[#9A4319]' : 'text-sky-400'}`} />
              <div
                className={`text-xs font-bold uppercase tracking-wider ${
                  isLight ? 'text-[#1E1B18]' : 'text-white'
                }`}
              >
                {progress?.status || 'RENDERING RETINA CANVAS...'}
              </div>
              {progress && (
                <div
                  className={`w-full h-2 rounded-full overflow-hidden max-w-xs mx-auto border ${
                    isLight ? 'bg-[#EAE0CD] border-[#D7CCB5]' : 'bg-[#070D1A] border-sky-300/20'
                  }`}
                >
                  <div
                    className={`h-full transition-all duration-300 rounded-full ${isLight ? 'bg-[#9A4319]' : 'bg-sky-400'}`}
                    style={{
                      width: `${Math.max(5, (progress.currentPage / progress.totalPages) * 100)}%`,
                    }}
                  />
                </div>
              )}
              <p
                className={`text-[10px] ${
                  isLight ? 'text-[#6E655A]' : 'text-slate-400'
                }`}
              >
                Compiling crisp A4 pages with ink styling and sketches...
              </p>
            </div>
          ) : exportSuccess ? (
            <div className="py-8 text-center space-y-3">
              <CheckCircle2 className={`w-12 h-12 mx-auto animate-in zoom-in-75 duration-200 ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`} />
              <h4
                className={`font-syne text-base font-bold uppercase ${
                  isLight ? 'text-[#1E1B18]' : 'text-white'
                }`}
              >
                {exportSuccess}
              </h4>
              <p className={`text-xs ${isLight ? 'text-[#4A433A]' : 'text-slate-300'}`}>
                Saved directly to your device. Ready for printing or sharing!
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
                    ? 'border-[#E2C2A8] bg-[#F6EBE0] hover:bg-[#EFE0D0] hover:shadow-md'
                    : 'border-sky-400/50 bg-sky-500/15 hover:bg-sky-500/25'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform ${
                    isLight ? 'bg-[#24201C] text-[#FFFDF8]' : 'bg-sky-500 text-slate-950'
                  }`}
                >
                  <FileDown className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider ${
                        isLight ? 'text-[#1E1B18]' : 'text-white'
                      }`}
                    >
                      Download Multi-Page PDF ({totalPages} {totalPages === 1 ? 'Page' : 'Pages'})
                    </span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                        isLight ? 'bg-[#9A4319] text-[#FFFDF8]' : 'bg-sky-500 text-slate-950'
                      }`}
                    >
                      RECOMMENDED
                    </span>
                  </div>
                  <p
                    className={`text-[11px] mt-1 leading-relaxed ${
                      isLight ? 'text-[#4A433A]' : 'text-slate-300'
                    }`}
                  >
                    Compiles all {totalPages} pages locally into a clean, print-ready A4 PDF document.
                  </p>
                </div>
              </button>

              {/* Option 2: Current Page as High-Res Image */}
              <button
                type="button"
                onClick={handleDownloadSingleImage}
                className={`cursor-pointer w-full p-3.5 rounded-xl border text-left transition-all flex items-start gap-3.5 group active:scale-[0.99] ${
                  isLight
                    ? 'bg-[#FAF4E8] hover:bg-[#F3E9D6] border-[#D7CCB5]'
                    : 'bg-[#0E172B] hover:bg-[#121D35] border-sky-300/20'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    isLight
                      ? 'bg-[#EDE4D2] text-[#9A4319] group-hover:bg-[#E2D6BF]'
                      : 'bg-[#121D35] border border-sky-300/20 text-amber-300 group-hover:text-amber-200'
                  }`}
                >
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <span
                    className={`text-xs font-bold uppercase tracking-wider block ${
                      isLight ? 'text-[#1E1B18]' : 'text-white'
                    }`}
                  >
                    Download Current Page {currentPageIndex + 1} (PNG)
                  </span>
                  <p
                    className={`text-[10px] mt-0.5 ${
                      isLight ? 'text-[#6E655A]' : 'text-slate-400'
                    }`}
                  >
                    Crisp 2.5x retina image export of the active page sheet.
                  </p>
                </div>
              </button>

              {/* Option 3: Direct Print */}
              <button
                type="button"
                onClick={handlePrint}
                className={`cursor-pointer w-full p-3 rounded-xl border text-left transition-all flex items-center gap-3 group active:scale-[0.99] ${
                  isLight
                    ? 'bg-[#FAF4E8] hover:bg-[#F3E9D6] border-[#D7CCB5]'
                    : 'bg-[#0E172B] hover:bg-[#121D35] border-sky-300/20'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    isLight ? 'bg-[#EDE4D2] text-[#1E1B18]' : 'bg-[#121D35] border border-sky-300/20 text-sky-300'
                  }`}
                >
                  <Printer className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1">
                  <span
                    className={`text-xs font-bold uppercase tracking-wider ${
                      isLight ? 'text-[#1E1B18]' : 'text-white'
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
              ? 'bg-[#FAF4E8] border-[#EAE0CD] text-[#6E655A]'
              : 'bg-[#080F1E] border-sky-300/15 text-slate-400'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Sparkles className={`w-3 h-3 ${isLight ? 'text-[#9A4319]' : 'text-amber-300'}`} />
            <span>CALIBRATED FOR A4 (210 × 297 MM)</span>
          </span>
          <button
            onClick={onClose}
            disabled={isExporting}
            className={`cursor-pointer px-3 py-1 uppercase rounded-lg transition-colors ${
              isLight
                ? 'hover:bg-[#EDE4D2] text-[#1E1B18]'
                : 'hover:bg-sky-500/15 text-slate-200 hover:text-white'
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
