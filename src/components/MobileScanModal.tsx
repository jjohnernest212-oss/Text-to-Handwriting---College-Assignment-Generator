import { useState, useRef, useEffect } from 'react';
import { X, Copy, Check, QrCode, Smartphone, ExternalLink } from 'lucide-react';
import QRCode from 'qrcode';

interface MobileScanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileScanModal({ isOpen, onClose }: MobileScanModalProps) {
  const targetUrl = 'https://handwrite.ai.com';
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) return;

    // Render the actual high-contrast QR code directly to canvas for instant camera recognition
    const timer = setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      QRCode.toCanvas(
        canvas,
        targetUrl,
        {
          width: 220,
          margin: 1.5,
          color: {
            dark: '#09090b', // crisp dark ink for instant scanner detection
            light: '#ffffff', // pure white background for highest contrast ratio
          },
          errorCorrectionLevel: 'M',
        },
        (error) => {
          if (error) {
            console.error('Error generating QR code:', error);
          }
        }
      );
    }, 40);

    return () => clearTimeout(timer);
  }, [isOpen, targetUrl]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-[#0c0c0e] rounded-xl shadow-2xl border border-[#27272a] max-w-sm w-full flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#27272a] bg-[#121214] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#6366f1]/20 border border-[#6366f1]/40 text-[#6366f1] flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-syne text-sm font-extrabold uppercase text-white tracking-tight">
                Mobile Access Scanner
              </h2>
              <p className="font-mono-code text-[10px] text-[#6366f1] tracking-wider uppercase">
                Scan to Open on Phone
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer p-1 rounded text-[#e4e4e7]/60 hover:text-white hover:bg-[#18181b] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Code Presentation Box */}
        <div className="p-6 flex flex-col items-center text-center space-y-4">
          {/* Actual high-contrast scannable QR Code */}
          <div className="p-3 bg-white rounded-xl shadow-xl border border-zinc-200 flex items-center justify-center">
            <canvas ref={canvasRef} className="rounded" width={220} height={220} />
          </div>

          {/* Scanner Guidance */}
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1.5 font-mono-code text-xs text-white font-bold uppercase tracking-wider">
              <Smartphone className="w-3.5 h-3.5 text-[#6366f1]" />
              <span>Scan with Phone Camera</span>
            </div>
            <p className="font-mono-code text-[11px] text-[#e4e4e7]/70">
              Instantly opens <span className="text-[#6366f1] font-bold">https://handwrite.ai.com</span>
            </p>
          </div>

          {/* Direct URL copy bar */}
          <div className="w-full flex items-center gap-1.5 bg-[#18181b] border border-[#27272a] rounded-md p-1.5 px-3">
            <span className="font-mono-code text-xs text-[#e4e4e7] flex-1 truncate text-left font-medium">
              {targetUrl}
            </span>
            <button
              onClick={handleCopy}
              className={`cursor-pointer px-2.5 py-1 rounded font-mono-code text-[11px] font-bold uppercase transition-all flex items-center gap-1 ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#6366f1] hover:bg-[#4f46e5] text-white'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          <div className="font-mono-code text-[10px] text-emerald-400 font-semibold">
            ✓ 100% Free Mobile Access • No App Download Required
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#27272a] bg-[#121214] flex items-center justify-between font-mono-code text-[11px]">
          <span className="text-[#e4e4e7]/50">EASY MOBILE SCAN</span>
          <button
            onClick={onClose}
            className="cursor-pointer px-3.5 py-1.5 bg-[#27272a] hover:bg-[#3f3f46] text-white text-xs font-bold rounded transition-colors uppercase"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
