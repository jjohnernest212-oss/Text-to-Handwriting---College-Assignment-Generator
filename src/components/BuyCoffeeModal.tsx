import { useState } from 'react';
import { X, Coffee, Copy, Check, QrCode, Smartphone, Heart, Sparkles } from 'lucide-react';

interface BuyCoffeeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BuyCoffeeModal({ isOpen, onClose }: BuyCoffeeModalProps) {
  const [activeTab, setActiveTab] = useState<'upi' | 'coffee'>('upi');
  const [selectedAmountUpi, setSelectedAmountUpi] = useState<number>(100);
  const [selectedAmountUsd, setSelectedAmountUsd] = useState<number>(5);
  const [copied, setCopied] = useState<boolean>(false);
  const [upiId, setUpiId] = useState<string>('handwriting.tool@upi');
  const [supporterName, setSupporterName] = useState<string>('');
  const [thankYouNote, setThankYouNote] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate UPI deep link & QR Code
  const upiDeepLink = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent('Text To Handwriting Dev')}&am=${selectedAmountUpi}&cu=INR&tn=${encodeURIComponent('Coffee from a happy student!')}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiDeepLink)}`;

  const handleSimulatePayment = () => {
    setThankYouNote(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-[#0c0c0e] rounded-xl shadow-2xl border border-[#27272a] max-w-md w-full flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-[#27272a] bg-[#121214] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center text-lg">
              ☕
            </div>
            <div>
              <h2 className="font-syne text-base font-extrabold uppercase text-white tracking-tight">
                Support Project
              </h2>
              <p className="font-mono-code text-[10px] text-amber-400 uppercase tracking-wider">
                UPI (India) &amp; Global Coffee Sponsorship
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

        {/* Payment Type Tabs */}
        <div className="flex border-b border-[#27272a] bg-[#121214]">
          <button
            onClick={() => { setActiveTab('upi'); setThankYouNote(false); }}
            className={`cursor-pointer flex-1 py-2.5 font-mono-code text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition-colors ${
              activeTab === 'upi'
                ? 'border-emerald-500 text-emerald-400 bg-[#18181b]'
                : 'border-transparent text-[#e4e4e7]/50 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span>UPI (India 🇮🇳)</span>
          </button>
          <button
            onClick={() => { setActiveTab('coffee'); setThankYouNote(false); }}
            className={`cursor-pointer flex-1 py-2.5 font-mono-code text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition-colors ${
              activeTab === 'coffee'
                ? 'border-amber-500 text-amber-400 bg-[#18181b]'
                : 'border-transparent text-[#e4e4e7]/50 hover:text-white'
            }`}
          >
            <Coffee className="w-3.5 h-3.5 text-amber-400" />
            <span>Coffee ($ USD)</span>
          </button>
        </div>

        {thankYouNote ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full flex items-center justify-center mx-auto text-2xl">
              🎉
            </div>
            <h3 className="font-syne text-base font-bold text-white uppercase">You are awesome!</h3>
            <p className="font-mono-code text-xs text-[#e4e4e7]/70 leading-relaxed">
              Thank you {supporterName ? `"${supporterName}"` : ''} for supporting this tool! May your assignments always get an A+ and your wrist never cramp! 🚀
            </p>
            <button
              onClick={() => setThankYouNote(false)}
              className="cursor-pointer px-4 py-2 font-mono-code text-xs bg-[#18181b] border border-[#27272a] text-white rounded hover:border-[#6366f1] uppercase"
            >
              Back to options
            </button>
          </div>
        ) : (
          <div className="p-5 space-y-4 font-mono-code">
            {activeTab === 'upi' ? (
              <>
                {/* Amount chips INR */}
                <div>
                  <label className="text-[10px] text-[#e4e4e7]/60 uppercase tracking-widest block mb-2">
                    Select Contribution Amount:
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[50, 100, 200, 500].map((amt) => (
                      <button
                        key={amt}
                        onClick={() => setSelectedAmountUpi(amt)}
                        className={`cursor-pointer py-1.5 px-2 rounded text-xs font-bold transition-all border ${
                          selectedAmountUpi === amt
                            ? 'bg-emerald-950/40 border-emerald-500 text-emerald-400 ring-1 ring-emerald-500'
                            : 'border-[#27272a] bg-[#18181b] text-[#e4e4e7]/70 hover:border-[#3f3f46]'
                        }`}
                      >
                        ₹{amt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* QR Code Container */}
                <div className="bg-[#18181b] border border-[#27272a] rounded-lg p-3.5 flex flex-col items-center justify-center text-center">
                  <div className="bg-white p-2 rounded border border-slate-300 shadow-md mb-2">
                    <img
                      src={qrCodeUrl}
                      alt="UPI QR Code"
                      className="w-32 h-32 object-contain"
                    />
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <QrCode className="w-3.5 h-3.5" />
                    Scan with GPay, PhonePe, Paytm, BHIM
                  </span>
                </div>

                {/* UPI ID field */}
                <div>
                  <label className="text-[10px] text-[#e4e4e7]/60 uppercase tracking-widest block mb-1">
                    UPI ID:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="px-3 py-1.5 text-xs bg-[#18181b] border border-[#27272a] rounded flex-1 text-[#e4e4e7] focus:outline-hidden focus:border-[#6366f1]"
                    />
                    <button
                      onClick={handleCopyUpi}
                      className="cursor-pointer px-3 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold flex items-center gap-1.5 transition-colors uppercase"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                {/* Mobile Pay Link button */}
                <a
                  href={upiDeepLink}
                  onClick={handleSimulatePayment}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold flex items-center justify-center gap-2 transition-all uppercase tracking-wider shadow-lg"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Open UPI App (Pay ₹{selectedAmountUpi})</span>
                </a>
              </>
            ) : (
              <>
                {/* Coffee cups selector */}
                <div>
                  <label className="text-[10px] text-[#e4e4e7]/60 uppercase tracking-widest block mb-2">
                    Support Quantity:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { amt: 3, label: '1 Coffee', icon: '☕' },
                      { amt: 5, label: '2 Coffees', icon: '☕☕' },
                      { amt: 10, label: '3 Coffees', icon: '☕☕☕' },
                    ].map((item) => (
                      <button
                        key={item.amt}
                        onClick={() => setSelectedAmountUsd(item.amt)}
                        className={`cursor-pointer py-2.5 px-2 rounded text-center border transition-all ${
                          selectedAmountUsd === item.amt
                            ? 'bg-amber-950/40 border-amber-500 text-amber-300 ring-1 ring-amber-500'
                            : 'border-[#27272a] bg-[#18181b] text-[#e4e4e7]/70 hover:border-[#3f3f46]'
                        }`}
                      >
                        <div className="text-base">{item.icon}</div>
                        <div className="text-xs font-bold mt-1">${item.amt}</div>
                        <div className="text-[9px] text-[#e4e4e7]/50">{item.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Supporter note */}
                <div>
                  <label className="text-[10px] text-[#e4e4e7]/60 uppercase tracking-widest block mb-1">
                    Student Call-Sign / Name:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. CS Student"
                    value={supporterName}
                    onChange={(e) => setSupporterName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-[#18181b] border border-[#27272a] rounded text-[#e4e4e7] focus:outline-hidden focus:border-amber-500"
                  />
                </div>

                <button
                  onClick={handleSimulatePayment}
                  className="cursor-pointer w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-black rounded text-xs font-bold flex items-center justify-center gap-2 transition-all uppercase tracking-wider"
                >
                  <Heart className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
                  <span>Sponsor ${selectedAmountUsd} Coffee</span>
                </button>
              </>
            )}

            {/* Note */}
            <div className="text-center pt-2 border-t border-[#27272a]">
              <p className="text-[10px] text-[#e4e4e7]/50 flex items-center justify-center gap-1 uppercase">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Made for students to write assignments faster!</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

