import React from 'react';
import { X, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'privacy' | 'terms';
}

export default function PolicyModal({ isOpen, onClose, type }: PolicyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto select-none">
      <div className="bg-[#121216] border border-white/10 rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150 my-6">
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10 bg-[#16161b] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              {type === 'privacy' ? <ShieldCheck className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
            </div>
            <h3 className="font-syne text-base font-bold text-white uppercase tracking-tight">
              {type === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-xs font-sans text-zinc-300 leading-relaxed max-h-[60vh] overflow-y-auto">
          {type === 'privacy' ? (
            <>
              <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-3 flex items-start gap-2.5 text-emerald-300">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  <strong>100% Client-Side Privacy:</strong> Your text, uploaded fonts, and generated PDFs never leave your browser. Zero server-side logging or tracking.
                </span>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-white uppercase text-[11px] font-mono-code">1. Information We Process</h4>
                <p>
                  Text to Handwriting processes your homework text, font files, and diagram drawings exclusively in your local browser memory (DOM and Canvas). No user text or uploaded files are sent to external cloud servers.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-white uppercase text-[11px] font-mono-code">2. Local Storage</h4>
                <p>
                  Any saved preferences (such as custom font selections or scanner images) are stored locally in your browser's LocalStorage for your personal convenience.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-white uppercase text-[11px] font-mono-code">3. Third-Party Services</h4>
                <p>
                  We load open-source Google Fonts (Kalam, Caveat, Indie Flower, Homemade Apple) over standard HTTPS CDN. No advertising tracking scripts or behavioral cookies are used.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="bg-indigo-950/20 border border-indigo-500/30 rounded-xl p-3 flex items-start gap-2.5 text-indigo-300">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  <strong>Educational &amp; Creative Utility:</strong> Free forever open-source software built by students, for students worldwide.
                </span>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-white uppercase text-[11px] font-mono-code">1. Acceptance of Terms</h4>
                <p>
                  By using Text to Handwriting, you agree that you are using this educational utility for learning, homework drafting, and creative handwriting simulation.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-white uppercase text-[11px] font-mono-code">2. Academic Integrity</h4>
                <p>
                  Students are responsible for complying with their institution's academic guidelines and assignment policies. This utility is designed to assist formatting and save repetitive manual transcription time.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-white uppercase text-[11px] font-mono-code">3. Open-Source License</h4>
                <p>
                  Distributed under the Apache-2.0 / MIT Open Source License. Maintained by Plenty and the community.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/10 bg-[#16161b] flex items-center justify-between font-mono-code text-[11px]">
          <span className="text-zinc-500">TEXT TO HANDWRITING // PLENTY</span>
          <button
            onClick={onClose}
            className="cursor-pointer px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold transition-colors uppercase"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
