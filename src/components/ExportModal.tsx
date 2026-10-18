import { useState } from 'react';
import {
  X,
  FileDown,
  Image as ImageIcon,
  Printer,
  CheckCircle2,
  Loader2,
  Sparkles,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import {
  downloadPageAsImage,
  downloadPagesAsPdf,
  ExportProgress,
} from '../utils/exportUtils';

interface ExportModalProps {
  theme?: 'dark' | 'light';
  isOpen: boolean;
  onClose: () => void;
  currentPageIndex: number;
  totalPages: number;
  paperRef: React.RefObject<HTMLDivElement | null>;
  onPrepareAllPages: () => Promise<HTMLElement[]>;
  onCleanupExport?: () => void;
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
}: ExportModalProps) {
  const isLight = theme === 'light';
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [progress, setProgress] = useState<ExportProgress | null>(null);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownloadSingleImage = async () => {
    setErrorMessage(null);
    try {
      setIsExporting(true);
      const elements = await onPrepareAllPages();
      const targetElement =
        (elements && elements[currentPageIndex]) || paperRef.current;

      if (!targetElement) {
        throw new Error('No page element found to render as image.');
      }

      // Small delay for layout reflow
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
        totalPages,
        status: 'Preparing assignment pages for PDF...',
      });

      let elements = await onPrepareAllPages();

      // If multi-page export container returned nothing, fallback to visible paper
      if (!elements || elements.length === 0) {
        if (paperRef.current) {
          elements = [paperRef.current];
        } else {
          throw new Error('No page content available to generate PDF.');
        }
      }

      await downloadPagesAsPdf(elements, 'Handwritten_Assignment.pdf', (p) => {
        setProgress(p);
      });

      setExportSuccess(`All ${totalPages} ${totalPages === 1 ? 'page' : 'pages'} compiled and downloaded successfully!`);
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
          {/* Error Banner if any error occurred */}
          {errorMessage && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-500 text-xs flex items-start gap-2.5 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold">{errorMessage}</p>
                <p className="text-[11px] opacity-80 mt-0.5">
                  You can try downloading page 1 as PNG or retry with the visible sheet below.
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
                Generating crisp A4 pages with ink bleed physics and diagrams...
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
              {/* Option 1: Multi-Page PDF (Recommended & Instant) */}
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
    </div>
  );
}
