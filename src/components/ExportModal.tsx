import { useState } from 'react';
import {
  X,
  FileDown,
  Image as ImageIcon,
  Printer,
  CheckCircle2,
  Loader2,
  Sparkles,
  Files,
} from 'lucide-react';
import {
  downloadPageAsImage,
  downloadPagesAsPdf,
  ExportProgress,
} from '../utils/exportUtils';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPageIndex: number;
  totalPages: number;
  paperRef: React.RefObject<HTMLDivElement | null>;
  onPrepareAllPages: () => Promise<HTMLElement[]>;
}

export default function ExportModal({
  isOpen,
  onClose,
  currentPageIndex,
  totalPages,
  paperRef,
  onPrepareAllPages,
}: ExportModalProps) {
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [progress, setProgress] = useState<ExportProgress | null>(null);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownloadSingleImage = async () => {
    if (!paperRef.current) return;
    try {
      setIsExporting(true);
      await downloadPageAsImage(
        paperRef.current,
        `Assignment_Page_${currentPageIndex + 1}.png`,
        2.5
      );
      setExportSuccess(`Page ${currentPageIndex + 1} downloaded successfully!`);
      setTimeout(() => {
        setExportSuccess(null);
        onClose();
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadPdf = async () => {
    try {
      setIsExporting(true);
      setProgress({
        currentPage: 1,
        totalPages,
        status: 'Preparing assignment pages...',
      });

      const elements = await onPrepareAllPages();
      if (elements.length === 0) return;

      await downloadPagesAsPdf(elements, 'Handwritten_Assignment.pdf', (p) => {
        setProgress(p);
      });

      setExportSuccess('Multi-page assignment PDF ready!');
      setTimeout(() => {
        setExportSuccess(null);
        onClose();
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
      setProgress(null);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 select-none">
      <div className="bg-[#0c0c0e] rounded-xl shadow-2xl border border-[#27272a] max-w-lg w-full flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-[#27272a] flex items-center justify-between bg-[#121214]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-[#6366f1]/20 border border-[#6366f1]/40 text-[#6366f1] flex items-center justify-center">
              <FileDown className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-syne text-base font-extrabold uppercase text-white tracking-tight">
                Export &amp; Compile PDF
              </h3>
              <p className="font-mono-code text-[10px] text-[#e4e4e7]/50 uppercase tracking-wider">
                {totalPages} {totalPages === 1 ? 'PAGE' : 'PAGES'} BUFFER READY FOR GENERATION
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isExporting}
            className="cursor-pointer p-1 rounded text-[#e4e4e7]/60 hover:text-white hover:bg-[#18181b] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Export Body */}
        <div className="p-6 space-y-4 font-mono-code">
          {isExporting ? (
            <div className="py-8 text-center space-y-3">
              <Loader2 className="w-9 h-9 text-[#6366f1] animate-spin mx-auto" />
              <div className="text-xs font-bold text-white uppercase tracking-wider">
                {progress?.status || 'RENDERING RETINA CANVAS...'}
              </div>
              {progress && (
                <div className="w-full bg-[#18181b] border border-[#27272a] h-2 rounded-full overflow-hidden max-w-xs mx-auto">
                  <div
                    className="bg-[#6366f1] h-full transition-all duration-300"
                    style={{
                      width: `${(progress.currentPage / progress.totalPages) * 100}%`,
                    }}
                  />
                </div>
              )}
              <p className="text-[10px] text-[#e4e4e7]/50">
                PROCESSING INK LAYERS, RULED BACKGROUNDS, AND VECTOR DIAGRAMS...
              </p>
            </div>
          ) : exportSuccess ? (
            <div className="py-8 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h4 className="font-syne text-base font-bold text-white uppercase">{exportSuccess}</h4>
              <p className="text-xs text-[#e4e4e7]/70">
                Ready for submission to Google Classroom, Canvas, or Moodle!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Option 1: Multi-Page PDF (Recommended) */}
              <button
                onClick={handleDownloadPdf}
                className="cursor-pointer w-full p-4 rounded-lg border border-[#6366f1] bg-[#6366f1]/10 hover:bg-[#6366f1]/20 text-left transition-all flex items-start gap-3.5 group shadow-lg"
              >
                <div className="w-9 h-9 rounded-md bg-[#6366f1] text-white flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-105 transition-transform">
                  <FileDown className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Compile Multi-Page PDF
                    </span>
                    <span className="bg-[#6366f1] text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                      STANDARD
                    </span>
                  </div>
                  <p className="text-[11px] text-[#e4e4e7]/70 mt-1 leading-relaxed">
                    Packages all {totalPages} pages into a 300-DPI equivalent multi-page PDF document, calibrated for online portals.
                  </p>
                </div>
              </button>

              {/* Option 2: Current Page as Image */}
              <button
                onClick={handleDownloadSingleImage}
                className="cursor-pointer w-full p-3.5 rounded-lg border border-[#27272a] hover:border-[#3f3f46] bg-[#18181b] hover:bg-[#222226] text-left transition-all flex items-start gap-3.5 group"
              >
                <div className="w-9 h-9 rounded-md bg-[#27272a] text-[#e4e4e7] flex items-center justify-center flex-shrink-0 group-hover:text-white transition-colors">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-bold text-white uppercase tracking-wider block">
                    Download Current Page {currentPageIndex + 1} (PNG)
                  </span>
                  <p className="text-[10px] text-[#e4e4e7]/50 mt-0.5">
                    Crisp 2.5x retina image raster of active page.
                  </p>
                </div>
              </button>

              {/* Option 3: Direct Print */}
              <button
                onClick={handlePrint}
                className="cursor-pointer w-full p-3 rounded-lg border border-[#27272a] hover:border-[#3f3f46] bg-[#18181b] hover:bg-[#222226] text-left transition-all flex items-center gap-3 group"
              >
                <div className="w-7 h-7 rounded bg-[#27272a] text-[#e4e4e7] flex items-center justify-center flex-shrink-0">
                  <Printer className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Print / Browser Print
                  </span>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#27272a] bg-[#121214] flex items-center justify-between font-mono-code text-[10px] text-[#e4e4e7]/50">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>CALIBRATED FOR A4 SUBMISSIONS</span>
          </span>
          <button
            onClick={onClose}
            disabled={isExporting}
            className="cursor-pointer px-3 py-1 text-[#e4e4e7]/60 hover:text-white uppercase transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
