import { X, Code2, Lightbulb, CheckCircle2, Heart, Sparkles, BookOpen, Clock, AlertTriangle } from 'lucide-react';
import AppLogo from './AppLogo';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HowItWorksModal({ isOpen, onClose }: HowItWorksModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E1B18]/45 p-3 sm:p-4 overflow-y-auto select-none">
      <div className="bg-[#FFFDF8] text-[#1E1B18] rounded-2xl shadow-2xl border border-[#DDD2BC] max-w-3xl w-full flex flex-col my-6 max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-[#EAE0CD] flex items-center justify-between bg-[#FAF4E8] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFFDF8] border border-[#D7CCB5] text-[#9A4319] flex items-center justify-center p-1.5 shrink-0 shadow-xs">
              <AppLogo size={24} />
            </div>
            <div>
              <h2 className="font-syne text-base sm:text-lg font-extrabold tracking-tight text-[#1E1B18] flex items-center gap-2 flex-wrap">
                <span>How Human Handwriting AI Started</span>
                <span className="bg-[#F6EBE0] text-[#9A4319] border border-[#E2C2A8] text-[10px] font-mono-code px-2 py-0.5 rounded uppercase">
                  Origin Story
                </span>
              </h2>
              <p className="font-mono-code text-[10px] sm:text-[11px] text-[#9A4319] tracking-wider uppercase">
                Built to turn digital drafts into neat notebook sheets
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close origin story modal"
            className="cursor-pointer p-1.5 rounded-lg text-[#6E655A] hover:text-[#1E1B18] hover:bg-[#EDE4D2] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="px-5 sm:px-6 py-5 overflow-y-auto space-y-5 text-[#4A433A] text-sm leading-relaxed font-sans bg-[#FFFDF8]">
          {/* Motivation & Origin Story Card */}
          <div className="bg-[#FAF4E8] border border-[#DDD2BC] rounded-xl p-4 sm:p-5 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#EDE4D2] text-[#9A4319] font-mono-code text-[9px] px-2.5 py-0.5 rounded-bl uppercase font-bold border-b border-l border-[#D7CCB5]">
              CREATOR STORY
            </div>

            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-full bg-[#F6EBE0] text-[#9A4319] flex items-center justify-center shrink-0">
                <Lightbulb className="w-4 h-4" />
              </div>
              <h3 className="font-syne font-extrabold text-[#1E1B18] text-sm sm:text-base tracking-tight">
                Why Hours of Manual Re-Copying Needed a Better Tool
              </h3>
            </div>

            <p className="text-[#4A433A] text-xs sm:text-[13px] leading-relaxed">
              Late-night lab records, study notes, and multi-page coursework often require formatting typed notes onto physical ruled sheets. Re-transcribing pages line by line wastes study time and leads to hand fatigue whenever a single line needs updating.
            </p>

            <div className="my-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="bg-[#FFFDF8] border border-rose-300 rounded-lg p-3">
                <div className="flex items-center gap-1.5 text-rose-700 text-xs font-mono-code font-bold uppercase mb-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Manual Transcription</span>
                </div>
                <ul className="text-[11px] text-[#4A433A] space-y-1 list-disc list-inside">
                  <li>Hours spent copying already-written notes</li>
                  <li>Wrist strain across long lab records</li>
                  <li>Re-starting entire pages over minor edits</li>
                  <li>Hard to insert crisp schematics quickly</li>
                </ul>
              </div>

              <div className="bg-[#FFFDF8] border border-emerald-300 rounded-lg p-3">
                <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-mono-code font-bold uppercase mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Human Handwriting AI</span>
                </div>
                <ul className="text-[11px] text-[#4A433A] space-y-1 list-disc list-inside">
                  <li>Paste text or import PDF/DOCX/TXT locally</li>
                  <li>Line-height matched across 23+ paper types</li>
                  <li>Natural ink variation, tilt, and warm lighting</li>
                  <li>Instant high-DPI A4 PDF &amp; PNG download</li>
                </ul>
              </div>
            </div>

            <blockquote className="my-3 pl-3.5 border-l-2 border-[#9A4319] py-1.5 bg-[#FFFDF8] rounded-r text-[#1E1B18] font-mono-code text-xs leading-relaxed">
              &ldquo;With browser-native typography, synchronized ruling geometry, and client-side PDF rendering, anyone can turn clean notes into legible handwritten pages in seconds—free and private.&rdquo;
            </blockquote>

            {/* Creator GitHub Profile Box */}
            <div className="mt-3 pt-3 border-t border-[#EAE0CD] flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#9A4319] flex items-center justify-center text-[#FFFDF8] text-[10px] font-bold">
                  P
                </div>
                <span className="text-xs font-mono-code text-[#4A433A]">
                  Architected by <strong className="text-[#1E1B18]">Plenty (@plenty)</strong>
                </span>
              </div>

              <a
                href="https://github.com/plenty"
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer text-[11px] font-mono-code font-bold bg-[#FFFDF8] hover:bg-[#EDE4D2] text-[#1E1B18] px-3 py-1 rounded-full transition-colors flex items-center gap-1.5 border border-[#D7CCB5] active:scale-95 shadow-2xs"
              >
                <span>Follow Plenty</span>
                <span>↗</span>
              </a>
            </div>
          </div>

          {/* Technical Pillars */}
          <div className="space-y-3">
            <h3 className="font-mono-code font-bold text-[#9A4319] text-xs uppercase tracking-widest flex items-center gap-2">
              <Code2 className="w-4 h-4 text-[#9A4319]" />
              5 Core Technical Foundations
            </h3>

            {/* Pillar 1 */}
            <div className="border border-[#EAE0CD] bg-[#FAF4E8] rounded-lg p-3.5">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded bg-[#F6EBE0] text-[#9A4319] font-mono-code font-bold flex items-center justify-center text-xs">
                  01
                </span>
                <div className="flex-1">
                  <h4 className="font-mono-code font-bold text-[#1E1B18] text-xs uppercase">
                    Line-Height Synchronized Paper Geometry
                  </h4>
                  <p className="text-xs text-[#4A433A] mt-1">
                    Each paper ruling repeats mathematically in lockstep with your chosen font baseline and vertical offset.
                  </p>
                  <pre className="bg-[#FFFDF8] border border-[#D7CCB5] text-[#9A4319] text-[11px] p-2 rounded mt-2 overflow-x-auto font-mono-code">
{`background-image: repeating-linear-gradient(
  transparent 0px,
  transparent 27px,
  #93c5fd 27px,
  #93c5fd 28px
);
line-height: 28px;`}
                  </pre>
                </div>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="border border-[#EAE0CD] bg-[#FAF4E8] rounded-lg p-3.5">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded bg-[#F6EBE0] text-[#9A4319] font-mono-code font-bold flex items-center justify-center text-xs">
                  02
                </span>
                <div>
                  <h4 className="font-mono-code font-bold text-[#1E1B18] text-xs uppercase">
                    SIL Open Font Scripts &amp; Custom FontFace API
                  </h4>
                  <p className="text-xs text-[#4A433A] mt-1">
                    Includes multiple script, print, and cursive handwriting styles plus a local <code className="text-[#9A4319] font-mono-code">new FontFace()</code> loader for your own TTF/OTF/WOFF files.
                  </p>
                </div>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="border border-[#EAE0CD] bg-[#FAF4E8] rounded-lg p-3.5">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded bg-[#F6EBE0] text-[#9A4319] font-mono-code font-bold flex items-center justify-center text-xs">
                  03
                </span>
                <div>
                  <h4 className="font-mono-code font-bold text-[#1E1B18] text-xs uppercase">
                    Diagram &amp; Schematic Canvas Overlay
                  </h4>
                  <p className="text-xs text-[#4A433A] mt-1">
                    Sketch circuits, vectors, and flowcharts directly onto any page or drop schematic images alongside written notes.
                  </p>
                </div>
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="border border-[#EAE0CD] bg-[#FAF4E8] rounded-lg p-3.5">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded bg-[#F6EBE0] text-[#9A4319] font-mono-code font-bold flex items-center justify-center text-xs">
                  04
                </span>
                <div>
                  <h4 className="font-mono-code font-bold text-[#1E1B18] text-xs uppercase">
                    Micro-Jitter, Lighting &amp; Paper Tilt
                  </h4>
                  <p className="text-xs text-[#4A433A] mt-1">
                    Adjust letter irregularity, subtle desk lighting gradients, page tilt, and preview-only margin guides.
                  </p>
                </div>
              </div>
            </div>

            {/* Pillar 5 */}
            <div className="border border-[#EAE0CD] bg-[#FAF4E8] rounded-lg p-3.5">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded bg-[#F6EBE0] text-[#9A4319] font-mono-code font-bold flex items-center justify-center text-xs">
                  05
                </span>
                <div>
                  <h4 className="font-mono-code font-bold text-[#1E1B18] text-xs uppercase">
                    Client-Side High-DPI Canvas &amp; Multi-Page PDF Export
                  </h4>
                  <p className="text-xs text-[#4A433A] mt-1">
                    Splits pages on <code className="text-[#9A4319] font-mono-code">---page---</code>, rasterizes locally at high resolution, and exports clean A4 PDF or PNG files.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Summary */}
          <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-3.5 flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div className="font-mono-code text-xs text-emerald-900 space-y-1">
              <div>Free browser-local workflow—no account required and no paywalls.</div>
              <div className="text-[11px] text-emerald-700">
                Web App: <strong className="underline">humanhandwritting.ai.studio</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-3 border-t border-[#EAE0CD] bg-[#FAF4E8] flex items-center justify-between font-mono-code shrink-0">
          <span className="text-[11px] text-[#6E655A]">Human Handwriting AI // Origin Story</span>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer px-4 py-1.5 bg-[#24201C] hover:bg-[#38322C] text-[#FFFDF8] text-xs font-bold rounded-lg transition-colors uppercase"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
