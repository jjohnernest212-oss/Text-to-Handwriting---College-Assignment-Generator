import { X, Code2, Lightbulb, CheckCircle2, Heart, Sparkles, BookOpen, Clock, AlertTriangle } from 'lucide-react';
import AppLogo from './AppLogo';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HowItWorksModal({ isOpen, onClose }: HowItWorksModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto select-none">
      <div className="bg-[#0c0c0e] rounded-xl shadow-2xl border border-[#27272a] max-w-3xl w-full flex flex-col my-6 max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-[#27272a] flex items-center justify-between bg-[#121214] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#6366f1] to-indigo-800 border border-indigo-400/30 text-white flex items-center justify-center p-1.5 shrink-0 shadow-md">
              <AppLogo size={24} />
            </div>
            <div>
              <h2 className="font-syne text-base sm:text-lg font-extrabold uppercase tracking-tight text-white flex items-center gap-2">
                <span>How I Came Up With The Idea</span>
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-mono-code px-2 py-0.5 rounded uppercase">
                  College Story
                </span>
              </h2>
              <p className="font-mono-code text-[10px] sm:text-[11px] text-[#6366f1] tracking-wider uppercase">
                &ldquo;Because I Hated Doing Handwritten Assignments In College&rdquo;
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
        <div className="px-5 sm:px-6 py-5 overflow-y-auto space-y-5 text-[#e4e4e7] text-sm leading-relaxed font-sans">
          {/* Motivation & Origin Story Card */}
          <div className="bg-gradient-to-br from-[#18181b] via-[#151518] to-[#121215] border border-amber-500/40 rounded-xl p-4 sm:p-5 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-amber-500/10 text-amber-400 font-mono-code text-[9px] px-2.5 py-0.5 rounded-bl uppercase font-bold border-b border-l border-amber-500/20">
              REAL ORIGIN STORY
            </div>

            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <Lightbulb className="w-4 h-4" />
              </div>
              <h3 className="font-syne font-extrabold text-white text-sm sm:text-base uppercase tracking-tight">
                &ldquo;Why I Hated College Handwritten Homework&rdquo;
              </h3>
            </div>
            
            <p className="text-[#e4e4e7]/90 text-xs sm:text-[13px] leading-relaxed">
              Every college student knows the Sunday night panic. Our engineering professors had a strict rule: <strong>every assignment, lab record, and tutorial had to be handwritten on ruled notebook paper</strong>. Their goal was preventing students from copying and pasting text into Word or Google Docs.
            </p>

            <div className="my-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="bg-rose-950/20 border border-rose-500/30 rounded-lg p-3">
                <div className="flex items-center gap-1.5 text-rose-400 text-xs font-mono-code font-bold uppercase mb-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>The Painful College Way</span>
                </div>
                <ul className="text-[11px] text-[#e4e4e7]/75 space-y-1 list-disc list-inside">
                  <li>3 to 5 hours spent hand-copying textbook solutions</li>
                  <li>Painful wrist cramps and aching fingers</li>
                  <li>Ruined whole pages because of a single ink mistake</li>
                  <li>Mindless transcription with zero real learning</li>
                </ul>
              </div>

              <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-lg p-3">
                <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-mono-code font-bold uppercase mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>The Scribe Engine Way</span>
                </div>
                <ul className="text-[11px] text-[#e4e4e7]/75 space-y-1 list-disc list-inside">
                  <li>Paste text or drop homework file in 2 seconds</li>
                  <li>Authentic notebook lines matched to font line-height</li>
                  <li>Natural ink bleed, letter jitter, and paper lighting</li>
                  <li>Instant 300-DPI A4 PDF ready for classroom upload</li>
                </ul>
              </div>
            </div>

            <blockquote className="my-3 pl-3.5 border-l-2 border-amber-400 py-1 bg-amber-500/5 rounded-r text-amber-300 font-mono-code text-xs leading-relaxed">
              &ldquo;I asked myself: If professors only care that the submission looks like human handwriting on ruled paper, why not write an open-source engine that simulates pen-on-paper physics so students never have to waste weekend hours hand-transcribing assignments again? That is how this app was born!&rdquo;
            </blockquote>

            {/* Creator GitHub Profile Box */}
            <div className="mt-3 pt-3 border-t border-[#27272a] flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-[10px] font-bold">
                  P
                </div>
                <span className="text-xs font-mono-code text-zinc-300">
                  Architected by <strong>Plenty (@plenty)</strong>
                </span>
              </div>

              <a
                href="https://github.com/plenty"
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer text-[11px] font-mono-code font-bold bg-[#27272a] hover:bg-[#3f3f46] text-white px-3 py-1 rounded-full transition-colors flex items-center gap-1.5 border border-[#3f3f46] active:scale-95 shadow-sm"
              >
                <div className="w-3.5 h-3.5 rounded-full bg-white/20 flex items-center justify-center">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </div>
                <span>Follow Plenty</span>
                <span>↗</span>
              </a>
            </div>
          </div>

          {/* Technical Pillars */}
          <div className="space-y-3">
            <h3 className="font-mono-code font-bold text-[#6366f1] text-xs uppercase tracking-widest flex items-center gap-2">
              <Code2 className="w-4 h-4 text-[#6366f1]" />
              5 Core Technical Inventions
            </h3>

            {/* Pillar 1 */}
            <div className="border border-[#27272a] bg-[#121214] rounded-lg p-3.5 hover:border-[#6366f1]/50 transition-colors">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded bg-[#6366f1]/20 text-[#6366f1] font-mono-code font-bold flex items-center justify-center text-xs">
                  01
                </span>
                <div className="flex-1">
                  <h4 className="font-mono-code font-bold text-white text-xs uppercase">
                    CSS Gradient Ruled Lines Synchronized with Line-Height
                  </h4>
                  <p className="text-xs text-[#e4e4e7]/70 mt-1">
                    Instead of injecting hundreds of DOM line divs, notebook paper is rendered via mathematical CSS repeating gradients locked to exact line-height:
                  </p>
                  <pre className="bg-[#0c0c0e] border border-[#27272a] text-emerald-400 text-[11px] p-2 rounded mt-2 overflow-x-auto font-mono-code">
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
            <div className="border border-[#27272a] bg-[#121214] rounded-lg p-3.5 hover:border-[#6366f1]/50 transition-colors">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded bg-[#6366f1]/20 text-[#6366f1] font-mono-code font-bold flex items-center justify-center text-xs">
                  02
                </span>
                <div>
                  <h4 className="font-mono-code font-bold text-white text-xs uppercase">
                    Handwriting Typography &amp; Dynamic FontFace API
                  </h4>
                  <p className="text-xs text-[#e4e4e7]/70 mt-1">
                    Uses curated authentic handwriting web fonts (Kalam, Caveat, Indie Flower, Homemade Apple) plus a browser-native <code className="text-[#6366f1] font-mono-code">new FontFace()</code> base64 data loader allowing students to upload their own Calligraphr .TTF/.OTF font files dynamically.
                  </p>
                </div>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="border border-[#27272a] bg-[#121214] rounded-lg p-3.5 hover:border-[#6366f1]/50 transition-colors">
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
            <div className="border border-[#27272a] bg-[#121214] rounded-lg p-3.5 hover:border-[#6366f1]/50 transition-colors">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded bg-[#6366f1]/20 text-[#6366f1] font-mono-code font-bold flex items-center justify-center text-xs">
                  04
                </span>
                <div>
                  <h4 className="font-mono-code font-bold text-white text-xs uppercase">
                    Anti-Plagiarism Realism: Lighting, Tilt &amp; Ink Blots
                  </h4>
                  <p className="text-xs text-[#e4e4e7]/70 mt-1">
                    Eliminates &ldquo;printed look&rdquo; suspicion with subtle study lamp radial lighting gradients, paper tilt (-0.5° to +1°), and micro letter-rotation jitter mimicking human hand pressure.
                  </p>
                </div>
              </div>
            </div>

            {/* Pillar 5 */}
            <div className="border border-[#27272a] bg-[#121214] rounded-lg p-3.5 hover:border-[#6366f1]/50 transition-colors">
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
            <div className="font-mono-code text-xs text-emerald-300 space-y-1">
              <div>RESULT: 100% authentic handwritten assignment appearance, zero wrist fatigue, generated in seconds!</div>
              <div className="text-[11px] text-emerald-400/80">
                Official Free Web Link: <strong className="text-white underline">handwrite.ai.com</strong> (Free Forever for all students)
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-3 border-t border-[#27272a] bg-[#121214] flex items-center justify-between font-mono-code shrink-0">
          <span className="text-[11px] text-[#e4e4e7]/50">SCRIBE_OS // COLLEGE ORIGIN STORY</span>
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
