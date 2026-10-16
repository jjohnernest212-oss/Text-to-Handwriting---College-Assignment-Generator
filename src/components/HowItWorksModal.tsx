import { X, Code2, Lightbulb, CheckCircle2 } from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HowItWorksModal({ isOpen, onClose }: HowItWorksModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-[#0c0c0e] rounded-xl shadow-2xl border border-[#27272a] max-w-3xl w-full flex flex-col my-8 max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-[#27272a] flex items-center justify-between bg-[#121214]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-[#18181b] border border-[#27272a] text-[#6366f1] flex items-center justify-center font-bold text-lg font-mono-code">
              01
            </div>
            <div>
              <h2 className="font-syne text-lg font-extrabold uppercase tracking-tight text-white">
                How Saurabh Daware Built Text-to-Handwriting
              </h2>
              <p className="font-mono-code text-[11px] text-[#6366f1] tracking-wider uppercase">
                Technical Architecture &amp; Engineering Secrets
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

        {/* Content body */}
        <div className="px-6 py-6 overflow-y-auto space-y-5 text-[#e4e4e7] text-sm leading-relaxed">
          {/* Motivation card */}
          <div className="bg-[#18181b] border border-[#27272a] rounded-lg p-4">
            <h3 className="font-mono-code font-bold text-white text-xs uppercase tracking-wider mb-1.5 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              The College Problem: &ldquo;Why Spend 4 Hours Writing by Hand?&rdquo;
            </h3>
            <p className="text-[#e4e4e7]/80 text-xs sm:text-[13px] leading-relaxed">
              During online classes, college professors insisted all homework be submitted as handwritten papers to stop digital copy-pasting. Saurabh thought:
              <em className="text-amber-300 font-mono-code text-xs block my-2 pl-3 border-l-2 border-amber-500 py-0.5">
                &ldquo;Instead of spending 3 hours writing assignments by hand every week, why not spend 3 hours building an automated web app that writes assignments for me forever?&rdquo;
              </em>
              He built it, shared it on GitHub, and it became a global sensation for engineering and college students.
            </p>
          </div>

          {/* Technical Pillars */}
          <div className="space-y-3.5">
            <h3 className="font-mono-code font-bold text-[#6366f1] text-xs uppercase tracking-widest flex items-center gap-2">
              <Code2 className="w-4 h-4 text-[#6366f1]" />
              5 Core Technical Inventions
            </h3>

            {/* Pillar 1 */}
            <div className="border border-[#27272a] bg-[#121214] rounded-lg p-4 hover:border-[#6366f1]/50 transition-colors">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded bg-[#6366f1]/20 text-[#6366f1] font-mono-code font-bold flex items-center justify-center text-xs">
                  01
                </span>
                <div className="flex-1">
                  <h4 className="font-mono-code font-bold text-white text-xs uppercase">
                    CSS Gradient Ruled Lines Synchronized with Line-Height
                  </h4>
                  <p className="text-xs text-[#e4e4e7]/70 mt-1">
                    Instead of injecting hundreds of DOM line divs, notebook paper is rendered via mathematical CSS gradients:
                  </p>
                  <pre className="bg-[#0c0c0e] border border-[#27272a] text-emerald-400 text-[11px] p-2.5 rounded mt-2 overflow-x-auto font-mono-code">
{`background-image: repeating-linear-gradient(
  transparent 0px,
  transparent 27px,
  #93c5fd 27px,
  #93c5fd 28px
);
line-height: 28px; /* Locks text onto notebook lines! */`}
                  </pre>
                </div>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="border border-[#27272a] bg-[#121214] rounded-lg p-4 hover:border-[#6366f1]/50 transition-colors">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded bg-[#6366f1]/20 text-[#6366f1] font-mono-code font-bold flex items-center justify-center text-xs">
                  02
                </span>
                <div>
                  <h4 className="font-mono-code font-bold text-white text-xs uppercase">
                    Handwriting Typography &amp; Dynamic FontFace API
                  </h4>
                  <p className="text-xs text-[#e4e4e7]/70 mt-1">
                    Uses curated authentic handwriting web fonts (Kalam, Caveat, Indie Flower, Homemade Apple) plus a browser-native <code className="text-[#6366f1] font-mono-code">new FontFace()</code> loader allowing students to upload their own Calligraphr .TTF/.OTF font files dynamically.
                  </p>
                </div>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="border border-[#27272a] bg-[#121214] rounded-lg p-4 hover:border-[#6366f1]/50 transition-colors">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded bg-[#6366f1]/20 text-[#6366f1] font-mono-code font-bold flex items-center justify-center text-xs">
                  03
                </span>
                <div>
                  <h4 className="font-mono-code font-bold text-white text-xs uppercase">
                    Vector Diagram &amp; Schematic Canvas Overlay
                  </h4>
                  <p className="text-xs text-[#e4e4e7]/70 mt-1">
                    Solves the STEM homework bottleneck by letting students draw electrical circuits, physics vectors, and flowchart diagrams right onto the simulated paper with pen strokes and arrows, or paste schematic images.
                  </p>
                </div>
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="border border-[#27272a] bg-[#121214] rounded-lg p-4 hover:border-[#6366f1]/50 transition-colors">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded bg-[#6366f1]/20 text-[#6366f1] font-mono-code font-bold flex items-center justify-center text-xs">
                  04
                </span>
                <div>
                  <h4 className="font-mono-code font-bold text-white text-xs uppercase">
                    Anti-Plagiarism Realism: Lighting, Tilt &amp; Jitter
                  </h4>
                  <p className="text-xs text-[#e4e4e7]/70 mt-1">
                    Eliminates &ldquo;printed look&rdquo; suspicion with subtle study lamp radial lighting gradients, paper tilt (-0.5° to +1°), and micro letter-rotation jitter mimicking human hand pressure.
                  </p>
                </div>
              </div>
            </div>

            {/* Pillar 5 */}
            <div className="border border-[#27272a] bg-[#121214] rounded-lg p-4 hover:border-[#6366f1]/50 transition-colors">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded bg-[#6366f1]/20 text-[#6366f1] font-mono-code font-bold flex items-center justify-center text-xs">
                  05
                </span>
                <div>
                  <h4 className="font-mono-code font-bold text-white text-xs uppercase">
                    High-DPI Rasterization (html2canvas) &amp; Multi-Page PDF (jsPDF)
                  </h4>
                  <p className="text-xs text-[#e4e4e7]/70 mt-1">
                    Splits pages on <code className="text-[#6366f1] font-mono-code">---page---</code>, renders the styled DOM element at 2.5x retina canvas DPI, and packages every page into a crisp multi-page A4 PDF file ready for college portal uploads.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Summary */}
          <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-lg p-3.5 flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div className="font-mono-code text-xs text-emerald-300">
              RESULT: 100% authentic handwritten assignment appearance, zero wrist fatigue, generated in seconds!
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#27272a] bg-[#121214] flex items-center justify-between font-mono-code">
          <span className="text-[11px] text-[#e4e4e7]/50">SCRIBE_OS // CORE ARCHITECTURE</span>
          <button
            onClick={onClose}
            className="cursor-pointer px-4 py-1.5 bg-[#6366f1] hover:bg-[#4f46e5] text-white text-xs font-bold rounded transition-colors uppercase"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}

