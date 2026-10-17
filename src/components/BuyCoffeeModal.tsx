import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Coffee,
  Check,
  QrCode,
  Smartphone,
  Heart,
  Sparkles,
  Upload,
  Trash2,
  Download,
  Copy,
  CheckCheck,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import QRCode from 'qrcode';

interface BuyCoffeeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BuyCoffeeModal({ isOpen, onClose }: BuyCoffeeModalProps) {
  const [selectedAmount, setSelectedAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [supporterName, setSupporterName] = useState<string>('');
  const [thankYouNote, setThankYouNote] = useState<boolean>(false);
  const [customScannerImage, setCustomScannerImage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);
  const [generatedQrDataUrl, setGeneratedQrDataUrl] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const currentAmount = customAmount
    ? Number(customAmount) || selectedAmount
    : selectedAmount;

  const upiId = '123ruthqueen@gmail.com';
  const payeeName = 'Ruth Queen';
  const upiDeepLink = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${currentAmount}&cu=INR&tn=${encodeURIComponent('Buy Me Coffee - Text to Handwriting')}`;

  // Generate dynamic high-res QR code
  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(upiDeepLink, {
      width: 320,
      margin: 1,
      errorCorrectionLevel: 'H',
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    })
      .then((url) => {
        if (isMounted) {
          setGeneratedQrDataUrl(url);
        }
      })
      .catch((err) => {
        console.error('Error generating QR code:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [upiDeepLink]);

  // Load saved custom scanner if stored
  useEffect(() => {
    try {
      const saved = localStorage.getItem('phonepe_upi_scanner_image');
      if (saved) {
        setCustomScannerImage(saved);
      }
    } catch {
      // LocalStorage might be restricted in some sandboxes
    }
  }, []);

  if (!isOpen) return null;

  const handleSimulatePayment = () => {
    try {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981', '#6366f1', '#ec4899', '#3b82f6'],
      });
    } catch {
      // Ignore if canvas-confetti is not loaded
    }
    setThankYouNote(true);
  };

  const handleCopyUpiId = () => {
    try {
      navigator.clipboard.writeText(upiId);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2200);
    } catch {
      // fallback
    }
  };

  const handleFileProcess = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setCustomScannerImage(result);
        try {
          localStorage.setItem('phonepe_upi_scanner_image', result);
        } catch {
          // ignore storage error
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleRemoveCustomImage = () => {
    setCustomScannerImage(null);
    try {
      localStorage.removeItem('phonepe_upi_scanner_image');
    } catch {
      // ignore
    }
  };

  const handleDownloadQr = () => {
    const link = document.createElement('a');
    link.href = customScannerImage || generatedQrDataUrl;
    link.download = `Buy_Me_Coffee_Scanner_Rs${currentAmount}.png`;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto select-none">
      <div className="bg-[#0c0c0e] rounded-xl shadow-2xl border border-[#27272a] max-w-md w-full flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-4 max-h-[95vh]">
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-[#27272a] bg-[#121214] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center text-xl shrink-0 shadow-xs">
              ☕
            </div>
            <div>
              <h2 className="font-syne text-base font-extrabold uppercase text-white tracking-tight flex items-center gap-1.5">
                <span>Buy Me Coffee</span>
                <span className="text-[10px] font-mono-code bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded">
                  Tip
                </span>
              </h2>
              <p className="font-mono-code text-[10px] text-amber-300/80 uppercase tracking-wider">
                Scan the QR scanner below to tip or buy coffee
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer p-1.5 rounded text-[#e4e4e7]/60 hover:text-white hover:bg-[#18181b] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {thankYouNote ? (
          <div className="p-8 text-center space-y-4 font-mono-code">
            <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full flex items-center justify-center mx-auto text-3xl animate-bounce">
              ☕
            </div>
            <h3 className="font-syne text-lg font-bold text-white uppercase">
              Thank You For The Coffee!
            </h3>
            <p className="text-xs text-[#e4e4e7]/70 leading-relaxed">
              {supporterName ? `"${supporterName}", your` : 'Your'} coffee support helps keep this text-to-handwriting tool 100% free, fast, and updated for students everywhere! 🚀
            </p>
            <button
              type="button"
              onClick={() => setThankYouNote(false)}
              className="cursor-pointer px-4 py-2 text-xs bg-[#18181b] border border-[#27272a] text-white rounded hover:border-amber-500 uppercase transition-colors"
            >
              Back to options
            </button>
          </div>
        ) : (
          <div className="p-4 sm:p-5 space-y-4 font-mono-code overflow-y-auto">
            {/* SCANNER PLACED ABOVE AS REQUESTED */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              className={`bg-[#18181b] border rounded-xl p-3.5 flex flex-col items-center justify-center text-center transition-colors relative ${
                isDragOver ? 'border-amber-500 bg-amber-950/20' : 'border-[#27272a]'
              }`}
            >
              <div className="flex items-center gap-1.5 text-[11px] text-amber-300 font-bold mb-2 uppercase tracking-wide">
                <QrCode className="w-3.5 h-3.5 text-amber-400" />
                <span>Scan Code to Tip / Buy Coffee:</span>
              </div>

              <div className="bg-white p-3 rounded-2xl border border-zinc-200 shadow-2xl max-w-[260px] w-full text-slate-800 flex flex-col items-center">
                {/* Scanner display */}
                {customScannerImage ? (
                  <div className="relative group w-full flex flex-col items-center">
                    <img
                      src={customScannerImage}
                      alt="Custom Scanner"
                      className="w-full max-h-[250px] object-contain rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveCustomImage}
                      className="cursor-pointer absolute top-2 right-2 p-1.5 bg-black/80 hover:bg-rose-600 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Reset to default scanner"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 w-full flex flex-col items-center">
                    {/* High-fidelity PhonePe QR code with centered circular "पे" logo */}
                    <div className="relative p-1 bg-white rounded-lg flex items-center justify-center">
                      {generatedQrDataUrl ? (
                        <img
                          src={generatedQrDataUrl}
                          alt="QR Scanner to buy coffee"
                          className="w-48 h-48 sm:w-52 sm:h-52 object-contain"
                        />
                      ) : (
                        <div className="w-48 h-48 flex items-center justify-center">
                          <QrCode className="w-16 h-16 text-zinc-400 animate-pulse" />
                        </div>
                      )}

                      {/* Centered PhonePe Emblem */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-10 h-10 rounded-full bg-[#18181b] border-[3px] border-white flex items-center justify-center text-white font-extrabold text-lg shadow-lg select-none font-sans leading-none pt-0.5">
                          पे
                        </div>
                      </div>
                    </div>

                    {/* Bottom Bank Account Banner */}
                    <div className="w-full py-1.5 px-2.5 bg-zinc-50 border border-zinc-200 rounded-xl flex items-center justify-between font-sans text-[11px] text-slate-700 shadow-xs">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="font-semibold text-slate-800 truncate text-[11px]">
                          Indian Overseas Bank - 7762
                        </span>
                      </div>
                      <span className="text-emerald-600 font-bold text-[10px] flex items-center gap-1 shrink-0">
                        <ShieldCheck className="w-3 h-3" />
                        VERIFIED
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Copy UPI / Payment ID Pill */}
              <div className="mt-2.5 w-full max-w-[260px] flex items-center justify-between bg-[#121214] border border-[#27272a] rounded-lg px-2.5 py-1.5 text-[11px]">
                <span className="text-zinc-400 truncate">ID: <strong>{upiId}</strong></span>
                <button
                  type="button"
                  onClick={handleCopyUpiId}
                  className="cursor-pointer text-amber-400 hover:text-amber-300 p-1 rounded hover:bg-[#18181b] transition-colors shrink-0"
                  title="Copy payment ID"
                >
                  {copiedUpi ? (
                    <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Actions for QR code: Upload & Save */}
              <div className="mt-2 flex items-center justify-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer text-[10px] text-[#e4e4e7]/70 hover:text-white flex items-center gap-1 py-1 px-2.5 rounded bg-[#27272a]/60 hover:bg-[#27272a] transition-colors"
                  title="Upload custom scanner screenshot"
                >
                  <Upload className="w-3 h-3 text-amber-400" />
                  <span>{customScannerImage ? 'Replace Image' : 'Upload Scanner'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadQr}
                  className="cursor-pointer text-[10px] text-[#e4e4e7]/70 hover:text-white flex items-center gap-1 py-1 px-2.5 rounded hover:bg-[#27272a] transition-colors"
                  title="Save QR Code to gallery to scan in scanner apps"
                >
                  <Download className="w-3 h-3 text-emerald-400" />
                  <span>Save QR</span>
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* Supported payment apps info */}
              <div className="mt-1.5 text-[9px] text-zinc-400 font-medium uppercase tracking-wider flex items-center justify-center gap-1 flex-wrap">
                <span>Scan with PhonePe · GPay · Paytm · BHIM · Cred · Mobile Banking</span>
              </div>
            </div>

            {/* COFFEE AMOUNT SELECTION BELOW SCANNER */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[10px] text-[#e4e4e7]/60 uppercase tracking-widest block flex items-center gap-1">
                  <Coffee className="w-3 h-3 text-amber-400" />
                  <span>Select Coffee Tip:</span>
                </label>
                <span className="text-[11px] text-amber-400 font-bold font-mono-code">
                  ₹{currentAmount}
                </span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {[
                  { amt: 50, label: '1 Coffee ☕' },
                  { amt: 100, label: '2 Coffees ☕☕' },
                  { amt: 200, label: '3 Coffees ☕☕☕' },
                  { amt: 300, label: 'Lunch 🍱' },
                  { amt: 500, label: 'Hero ⭐' },
                ].map((item) => (
                  <button
                    key={item.amt}
                    type="button"
                    onClick={() => {
                      setSelectedAmount(item.amt);
                      setCustomAmount('');
                    }}
                    className={`cursor-pointer py-1.5 px-1 rounded text-center transition-all border ${
                      selectedAmount === item.amt && !customAmount
                        ? 'bg-amber-950/50 border-amber-500 text-amber-300 ring-1 ring-amber-500 font-bold'
                        : 'border-[#27272a] bg-[#18181b] text-[#e4e4e7]/70 hover:border-[#3f3f46]'
                    }`}
                  >
                    <div className="text-xs font-bold">₹{item.amt}</div>
                    <div className="text-[8px] text-[#e4e4e7]/50 truncate">{item.label}</div>
                  </button>
                ))}
              </div>

              {/* Custom tip amount input */}
              <div className="mt-2 flex items-center gap-2">
                <span className="text-[10px] text-zinc-500 uppercase">Custom Amount:</span>
                <input
                  type="number"
                  placeholder="e.g. 150"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="flex-1 px-2.5 py-1 text-xs bg-[#18181b] border border-[#27272a] rounded text-[#e4e4e7] focus:outline-hidden focus:border-amber-500"
                />
              </div>

              {/* Supporter Name input */}
              <div className="mt-2 flex items-center gap-2">
                <span className="text-[10px] text-zinc-500 uppercase">Your Name:</span>
                <input
                  type="text"
                  placeholder="Optional note / name"
                  value={supporterName}
                  onChange={(e) => setSupporterName(e.target.value)}
                  className="flex-1 px-2.5 py-1 text-xs bg-[#18181b] border border-[#27272a] rounded text-[#e4e4e7] focus:outline-hidden focus:border-amber-500"
                />
              </div>
            </div>

            {/* Direct Pay & Confirm Buttons */}
            <div className="flex gap-2 pt-1">
              <a
                href={upiDeepLink}
                onClick={() => {
                  setTimeout(handleSimulatePayment, 1200);
                }}
                className="flex-1 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded text-xs font-bold flex items-center justify-center gap-2 transition-all uppercase tracking-wider shadow-md text-center"
              >
                <Coffee className="w-3.5 h-3.5" />
                <span>Buy Coffee via App</span>
              </a>

              <button
                type="button"
                onClick={handleSimulatePayment}
                className="cursor-pointer px-4 py-2.5 bg-[#27272a] hover:bg-[#3f3f46] text-white rounded text-xs font-bold flex items-center justify-center gap-1.5 transition-all uppercase tracking-wider"
                title="Confirm you have sent the coffee tip"
              >
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Paid</span>
              </button>
            </div>

            {/* Note */}
            <div className="text-center pt-2 border-t border-[#27272a]">
              <p className="text-[10px] text-[#e4e4e7]/50 flex items-center justify-center gap-1 uppercase">
                <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
                <span>Made with love by PLENTY for students worldwide</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
