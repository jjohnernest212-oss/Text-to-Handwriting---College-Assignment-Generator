import { useState, useRef, useEffect } from 'react';
import { X, Copy, Check, QrCode, Smartphone, ExternalLink } from 'lucide-react';
import QRCode from 'qrcode';

interface MobileScanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileScanModal({ isOpen, onClose }: MobileScanModalProps) {
  const targetUrl = 'https://humanhandwritting.ai.studio';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E1B18]/45 p-4 overflow-y-auto">
      <div className="bg-[#FFFDF8] text-[#1E1B18] rounded-2xl shadow-2xl border border-[#DDD2BC] max-w-sm w-full flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#EAE0CD] bg-[#FAF4E8] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#F6EBE0] border border-[#E2C2A8] text-[#9A4319] flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-syne text-sm font-extrabold text-[#1E1B18] tracking-tight">
                Mobile Access Scanner
              </h2>
              <p className="font-mono-code text-[10px] text-[#9A4319] tracking-wider uppercase">
                Scan to Open on Phone
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close mobile scan modal"
            className="cursor-pointer p-1 rounded-lg text-[#6E655A] hover:text-[#1E1B18] hover:bg-[#EDE4D2] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Code Presentation Box */}
        <div className="p-6 flex flex-col items-center text-center space-y-4">
          {/* Actual high-contrast scannable QR Code */}
          <div className="p-3 bg-white rounded-xl shadow-md border border-[#DDD2BC] flex items-center justify-center">
            <canvas ref={canvasRef} className="rounded" width={220} height={220} />
          </div>

          {/* Scanner Guidance */}
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1.5 font-mono-code text-xs text-[#1E1B18] font-bold uppercase tracking-wider">
              <Smartphone className="w-3.5 h-3.5 text-[#9A4319]" />
              <span>Scan with Phone Camera</span>
            </div>
            <p className="font-mono-code text-[11px] text-[#4A433A]">
              Instantly opens <span className="text-[#9A4319] font-bold">humanhandwritting.ai.studio</span>
            </p>
          </div>

          {/* Direct URL copy bar */}
          <div className="w-full flex items-center gap-1.5 bg-[#FAF4E8] border border-[#D7CCB5] rounded-lg p-1.5 px-3">
            <span className="font-mono-code text-xs text-[#1E1B18] flex-1 truncate text-left font-medium">
              {targetUrl}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className={`cursor-pointer px-2.5 py-1 rounded font-mono-code text-[11px] font-bold uppercase transition-all flex items-center gap-1 ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#24201C] hover:bg-[#38322C] text-[#FFFDF8]'
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

          <div className="font-mono-code text-[10px] text-emerald-700 font-semibold">
            ✓ Free Mobile Access • No App Download Required
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#EAE0CD] bg-[#FAF4E8] flex items-center justify-between font-mono-code text-[11px]">
          <span className="text-[#6E655A]">EASY MOBILE SCAN</span>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer px-3.5 py-1.5 bg-[#24201C] hover:bg-[#38322C] text-[#FFFDF8] text-xs font-bold rounded-lg transition-colors uppercase"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
