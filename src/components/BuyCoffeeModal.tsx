import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Coffee,
  Check,
  QrCode,
  Smartphone,
  Heart,
  Upload,
  Trash2,
  Download,
  Copy,
  CheckCheck,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import QRCode from 'qrcode';

interface BuyCoffeeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CREATOR_UPI_IDS = [
  { id: '7065548037-f0ef@ybl', handle: '7065548037-f0ef@ybl', bank: 'PhonePe / Yes Bank', tag: 'RECOMMENDED' },
  { id: '7065548037-f0ef@ibl', handle: '7065548037-f0ef@ibl', bank: 'PhonePe / ICICI Bank', tag: 'ACTIVE' },
  { id: '7065548037-f0ef@axl', handle: '7065548037-f0ef@axl', bank: 'PhonePe / Axis Bank', tag: 'ACTIVE' },
];

export default function BuyCoffeeModal({ isOpen, onClose }: BuyCoffeeModalProps) {
  const [selectedUpiIndex, setSelectedUpiIndex] = useState<number>(0);
  const [selectedAmount, setSelectedAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [supporterName, setSupporterName] = useState<string>('');
  const [thankYouNote, setThankYouNote] = useState<boolean>(false);
  const [customScannerImage, setCustomScannerImage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [generatedQrDataUrl, setGeneratedQrDataUrl] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const activeUpi = CREATOR_UPI_IDS[selectedUpiIndex] || CREATOR_UPI_IDS[0];
  const currentAmount = customAmount
    ? Number(customAmount) || selectedAmount
    : selectedAmount;

  const payeeName = 'Plenty';
  const upiDeepLink = `upi://pay?pa=${encodeURIComponent(activeUpi.id)}&pn=${encodeURIComponent(payeeName)}&am=${currentAmount}&cu=INR&tn=${encodeURIComponent('Buy Me Coffee - Text to Handwriting')}`;

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

  const handleCopy = (idText: string) => {
    try {
      navigator.clipboard.writeText(idText);
      setCopiedId(idText);
      setTimeout(() => setCopiedId(null), 2500);
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
    link.download = `PhonePe_Scanner_${activeUpi.id.split('@')[0]}.png`;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 overflow-y-auto select-none">
      <div className="bg-[#0c0c0e] rounded-2xl shadow-2xl border border-white/10 max-w-md w-full flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-4 max-h-[95vh]">
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-white/10 bg-[#121215] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-300 flex items-center justify-center text-xl shrink-0 shadow-sm">
              ☕
            </div>
            <div>
              <h2 className="font-syne text-base font-extrabold uppercase text-white tracking-tight flex items-center gap-2">
                <span>Buy Me A Coffee</span>
                <span className="text-[9px] font-mono-code bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.5 rounded font-bold uppercase">
                  Tip
                </span>
              </h2>
              <p className="font-mono-code text-[10px] text-zinc-400 uppercase tracking-wider">
                Scan QR code above or copy UPI ID to support
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {thankYouNote ? (
          <div className="p-8 text-center space-y-4 font-mono-code">
            <div className="w-16 h-16 bg-amber-500/15 border border-amber-400/40 text-amber-400 rounded-full flex items-center justify-center mx-auto text-3xl animate-bounce">
              ☕
            </div>
            <h3 className="font-syne text-lg font-bold text-white uppercase">
              Thank You For Supporting!
            </h3>
            <p className="text-xs text-[#e4e4e7]/80 leading-relaxed font-sans">
              {supporterName ? `"${supporterName}", your` : 'Your'} coffee tip keeps Text to Handwriting 100% free, fast, and constantly updated for students worldwide! 🚀
            </p>
            <button
              type="button"
              onClick={() => setThankYouNote(false)}
              className="cursor-pointer px-4 py-2 text-xs bg-[#18181b] border border-white/10 text-white rounded-lg hover:border-amber-400 uppercase transition-colors"
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
              className={`bg-[#141418] border rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-center text-center transition-colors relative ${
                isDragOver ? 'border-amber-400 bg-amber-950/20' : 'border-white/10'
              }`}
            >
              <div className="flex items-center gap-1.5 text-[11px] text-amber-300 font-bold mb-2 uppercase tracking-wide">
                <QrCode className="w-3.5 h-3.5 text-amber-400" />
                <span>PhonePe UPI QR Scanner (Scan Above)</span>
              </div>

              {/* The Scanner QR Image */}
              <div className="bg-white p-3 rounded-2xl border border-zinc-200 shadow-2xl max-w-[250px] w-full text-slate-800 flex flex-col items-center">
                {customScannerImage ? (
                  <div className="relative group w-full flex flex-col items-center">
                    <img
                      src={customScannerImage}
                      alt="Custom Scanner"
                      className="w-full max-h-[240px] object-contain rounded-lg"
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
                    <div className="relative p-1 bg-white rounded-lg flex items-center justify-center">
                      {generatedQrDataUrl ? (
                        <img
                          src={generatedQrDataUrl}
                          alt="PhonePe UPI QR Scanner"
                          className="w-48 h-48 sm:w-52 sm:h-52 object-contain"
                        />
                      ) : (
                        <div className="w-48 h-48 flex items-center justify-center">
                          <QrCode className="w-16 h-16 text-zinc-400 animate-pulse" />
                        </div>
                      )}

                      {/* Centered PhonePe Emblem (Round black badge with white border and white पे) */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-10 h-10 rounded-full bg-[#18181b] border-[3px] border-white flex items-center justify-center text-white font-extrabold text-lg shadow-lg select-none font-sans leading-none pt-0.5">
                          पे
                        </div>
                      </div>
                    </div>

                    {/* Bottom Bank Account Banner */}
                    <div className="w-full py-1 px-2.5 bg-zinc-50 border border-zinc-200 rounded-lg flex items-center justify-between font-sans text-[10px] text-slate-700 shadow-xs">
                      <span className="font-semibold text-slate-800 truncate">
                        Linked Account Verified
                      </span>
                      <span className="text-emerald-600 font-bold text-[9px] flex items-center gap-0.5 shrink-0">
                        <ShieldCheck className="w-3 h-3" />
                        VERIFIED
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action for QR code: Save QR Only */}
              <div className="mt-3 flex items-center justify-center">
                <button
                  type="button"
                  onClick={handleDownloadQr}
                  className="cursor-pointer text-xs font-mono-code font-bold text-white hover:text-emerald-300 flex items-center gap-1.5 py-1.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-950/40 border border-emerald-400/30 transition-all active:scale-95"
                  title="Save high-resolution PhonePe UPI QR code image to your device"
                >
                  <Download className="w-4 h-4 text-white" />
                  <span>Save QR</span>
                </button>
              </div>

              <div className="mt-2 text-[10px] text-zinc-400 font-medium tracking-wide">
                Scan with PhonePe · Google Pay · Paytm · BHIM · Cred · Mobile Banking
              </div>
            </div>

            {/* UPI IDS LISTED BELLOW SCANNER AS REQUESTED */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] text-zinc-400 uppercase tracking-widest block font-bold">
                  UPI IDs (Click To Copy):
                </label>
                <span className="text-[9px] text-amber-400">
                  Beneficiary: Plenty
                </span>
              </div>

              <div className="space-y-1.5">
                {CREATOR_UPI_IDS.map((upi, index) => {
                  const isCopied = copiedId === upi.id;
                  const isSelected = selectedUpiIndex === index;

                  return (
                    <div
                      key={upi.id}
                      onClick={() => setSelectedUpiIndex(index)}
                      className={`cursor-pointer rounded-xl p-2.5 flex items-center justify-between gap-2 border transition-all ${
                        isSelected
                          ? 'bg-[#18181f] border-amber-400/60 shadow-sm ring-1 ring-amber-400/30'
                          : 'bg-[#121215] border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs shrink-0 ${
                            isSelected ? 'bg-amber-400 text-black' : 'bg-white/10 text-zinc-400'
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div className="min-w-0">
                          <div className="font-mono-code text-xs text-white font-bold truncate flex items-center gap-1.5">
                            <span>{upi.id}</span>
                            <span className="text-[8px] bg-white/10 text-zinc-300 px-1 rounded uppercase font-semibold">
                              {upi.tag}
                            </span>
                          </div>
                          <div className="text-[9px] text-zinc-400 truncate">
                            {upi.bank}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(upi.id);
                        }}
                        className={`cursor-pointer px-2.5 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 shrink-0 transition-all ${
                          isCopied
                            ? 'bg-emerald-500 text-white shadow-xs'
                            : 'bg-white/10 hover:bg-white/20 text-zinc-200 hover:text-white'
                        }`}
                        title={`Copy ${upi.id}`}
                      >
                        {isCopied ? (
                          <>
                            <CheckCheck className="w-3 h-3" />
                            <span>COPIED</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-amber-400" />
                            <span>COPY</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* COFFEE AMOUNT SELECTION */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[10px] text-zinc-400 uppercase tracking-widest block flex items-center gap-1 font-bold">
                  <Coffee className="w-3 h-3 text-amber-400" />
                  <span>Choose Tip Amount:</span>
                </label>
                <span className="text-xs text-amber-400 font-bold font-mono-code">
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
                    className={`cursor-pointer py-1.5 px-1 rounded-lg text-center transition-all border ${
                      selectedAmount === item.amt && !customAmount
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300 ring-1 ring-amber-400 font-bold'
                        : 'border-white/10 bg-[#141418] text-zinc-300 hover:border-white/20'
                    }`}
                  >
                    <div className="text-xs font-bold">₹{item.amt}</div>
                    <div className="text-[8px] text-zinc-400 truncate">{item.label}</div>
                  </button>
                ))}
              </div>

              {/* Custom amount */}
              <div className="mt-2 flex items-center gap-2">
                <span className="text-[10px] text-zinc-400 uppercase font-semibold">Custom ₹:</span>
                <input
                  type="number"
                  placeholder="e.g. 150"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="flex-1 px-2.5 py-1 text-xs bg-[#121215] border border-white/10 rounded-lg text-white focus:outline-hidden focus:border-amber-400"
                />
              </div>

              {/* Supporter Name */}
              <div className="mt-2 flex items-center gap-2">
                <span className="text-[10px] text-zinc-400 uppercase font-semibold">Your Name:</span>
                <input
                  type="text"
                  placeholder="Optional supporter name"
                  value={supporterName}
                  onChange={(e) => setSupporterName(e.target.value)}
                  className="flex-1 px-2.5 py-1 text-xs bg-[#121215] border border-white/10 rounded-lg text-white focus:outline-hidden focus:border-amber-400"
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
                className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all uppercase tracking-wider shadow-md text-center"
              >
                <Coffee className="w-3.5 h-3.5" />
                <span>Pay via UPI App</span>
              </a>

              <button
                type="button"
                onClick={handleSimulatePayment}
                className="cursor-pointer px-4 py-2.5 bg-[#1f1f23] hover:bg-[#2a2a30] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all uppercase tracking-wider border border-white/10"
                title="Confirm payment"
              >
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Paid</span>
              </button>
            </div>

            {/* Note */}
            <div className="text-center pt-2 border-t border-white/10">
              <p className="text-[10px] text-zinc-400 flex items-center justify-center gap-1 uppercase">
                <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
                <span>Made with love by PLENTY</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
