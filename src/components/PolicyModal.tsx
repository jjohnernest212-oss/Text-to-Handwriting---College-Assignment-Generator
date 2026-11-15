import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  FileText,
  Scale,
  Mail,
  CheckCircle2,
  Trash2,
  Send,
  Info,
} from 'lucide-react';

export type PolicyTab = 'about' | 'contact' | 'privacy' | 'terms' | 'copyright';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: PolicyTab;
  onClearLocalData?: () => void;
}

export default function PolicyModal({
  isOpen,
  onClose,
  type,
  onClearLocalData,
}: PolicyModalProps) {
  const [activeTab, setActiveTab] = useState<PolicyTab>(type);
  const [clearedLocal, setClearedLocal] = useState(false);

  // Contact form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('Feedback & Suggestion');
  const [message, setMessage] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    setActiveTab(type);
    setClearedLocal(false);
    setFormError(null);
    setFormSubmitted(false);
  }, [type, isOpen]);

  if (!isOpen) return null;

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const trimmedEmail = email.trim();
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);
    if (!name.trim()) {
      setFormError('Please enter your name or nickname.');
      return;
    }
    if (!emailValid) {
      setFormError('Please enter a valid email address so we can reply.');
      return;
    }
    if (message.trim().length < 10) {
      setFormError('Please enter at least 10 characters describing your message.');
      return;
    }

    try {
      const existing = JSON.parse(
        localStorage.getItem('hh_ai_support_notes') || '[]'
      );
      existing.unshift({
        name: name.trim(),
        email: trimmedEmail,
        topic,
        message: message.trim(),
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem(
        'hh_ai_support_notes',
        JSON.stringify(existing.slice(0, 10))
      );
    } catch {
      // Ignore storage limits
    }

    setFormSubmitted(true);
    setName('');
    setEmail('');
    setMessage('');
  };

  const handleWipeStorage = () => {
    try {
      localStorage.removeItem('hh_ai_draft_v1');
      localStorage.removeItem('student_testimonials_data');
      localStorage.removeItem('phonepe_upi_scanner_image');
      localStorage.removeItem('hh_ai_support_notes');
    } catch {
      // Ignore
    }
    onClearLocalData?.();
    setClearedLocal(true);
  };

  const tabs: { id: PolicyTab; label: string }[] = [
    { id: 'about', label: 'About' },
    { id: 'privacy', label: 'Privacy Policy' },
    { id: 'terms', label: 'Terms of Service' },
    { id: 'contact', label: 'Contact' },
    { id: 'copyright', label: 'Copyright & Fonts' },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="About, legal policies, and support"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E1B18]/45 p-3 sm:p-4 overflow-y-auto"
    >
      <div className="bg-[#FFFDF8] text-[#1E1B18] border border-[#DDD2BC] rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl my-6">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#EAE0CD] bg-[#FAF4E8] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#F6EBE0] border border-[#E2C2A8] text-[#9A4319] flex items-center justify-center shrink-0">
              {activeTab === 'about' && <Info className="w-4 h-4" />}
              {activeTab === 'privacy' && <ShieldCheck className="w-4 h-4" />}
              {activeTab === 'terms' && <FileText className="w-4 h-4" />}
              {activeTab === 'copyright' && <Scale className="w-4 h-4" />}
              {activeTab === 'contact' && <Mail className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight text-[#1E1B18]">
                {activeTab === 'about' && 'About Human Handwriting AI'}
                {activeTab === 'privacy' && 'Privacy & Browser Data Policy'}
                {activeTab === 'terms' && 'Terms of Service'}
                {activeTab === 'copyright' && 'Copyright, Licensing & Font Credits'}
                {activeTab === 'contact' && 'Contact & Feedback'}
              </h3>
              <p className="text-xs text-[#6E655A]">
                Human Handwriting AI · Transparent Documentation
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="cursor-pointer p-2 rounded-lg text-[#6E655A] hover:text-[#1E1B18] hover:bg-[#EDE4D2] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-5 pt-2.5 pb-2 border-b border-[#EAE0CD] bg-[#F5EEE0] flex items-center gap-1.5 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#24201C] text-[#FFFDF8] font-bold'
                  : 'text-[#4A433A] hover:bg-[#EDE4D2] hover:text-[#1E1B18]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-4 text-sm text-[#4A433A] leading-relaxed max-h-[62vh] overflow-y-auto">
          {activeTab === 'about' && (
            <>
              <div className="bg-[#F6EBE0] border border-[#E2C2A8] rounded-xl p-3.5 flex items-start gap-2.5 text-[#7D3411] text-xs">
                <Info className="w-4 h-4 text-[#9A4319] shrink-0 mt-0.5" />
                <span>
                  <strong>Human Handwriting AI:</strong> A free, browser-first digital penmanship studio built by <strong>Plenty</strong> to turn typed drafts, study outlines, and plain text into realistic handwritten sheets without accounts or paywalls.
                </span>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-bold text-[#1E1B18] text-sm">
                  What This Studio Offers
                </h4>
                <p className="text-xs text-[#4A433A]">
                  Choose from 19 open handwriting scripts (or upload custom .ttf/.otf/.woff files), pair them with 23 notebook, Cornell, grid, or vintage papers, sketch diagrams directly on pages, toggle Margin Guides for alignment, and export clean multi-page PDFs or PNG images.
                </p>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-bold text-[#1E1B18] text-sm">
                  Built for Privacy, Speed &amp; Accessibility
                </h4>
                <p className="text-xs text-[#4A433A]">
                  Every line of text, custom font upload, and diagram is processed locally inside your own browser tab. No sign-ups, watermarks, or usage meters block your exports. Voluntary coffee tips and non-intrusive ads keep hosting sustainable for everyone.
                </p>
              </div>

              <div className="pt-2 border-t border-[#EAE0CD] flex items-center justify-between flex-wrap gap-2 text-xs">
                <span className="text-[#6E655A]">
                  Maintained by <strong className="text-[#1E1B18]">Plenty (@plenty)</strong>
                </span>
                <a
                  href="https://github.com/plenty"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#9A4319] hover:underline"
                >
                  View GitHub Profile ↗
                </a>
              </div>
            </>
          )}

          {activeTab === 'privacy' && (
            <>
              <div className="bg-[#F6EBE0] border border-[#E2C2A8] rounded-xl p-3.5 flex items-start gap-2.5 text-[#7D3411] text-xs">
                <CheckCircle2 className="w-4 h-4 text-[#9A4319] shrink-0 mt-0.5" />
                <span>
                  <strong>Local Browser Processing:</strong> Your text notes, uploaded .txt/.md files, custom fonts, and PDF/PNG exports are processed exclusively inside your own browser memory. No user documents are stored on external servers.
                </span>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-bold text-[#1E1B18] text-sm">
                  1. Auto-Saved Drafts &amp; LocalStorage
                </h4>
                <p className="text-xs text-[#4A433A]">
                  To prevent losing work on page refresh, your active editor draft, formatting preferences, and optional student reviews are stored locally in your browser&apos;s <code className="font-mono-code text-[#9A4319]">localStorage</code>. You can erase all locally stored data at any moment below.
                </p>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-bold text-[#1E1B18] text-sm">
                  2. Third-Party Fonts &amp; Advertising Disclosure
                </h4>
                <p className="text-xs text-[#4A433A]">
                  Built-in handwriting styles are loaded over HTTPS from Google Fonts. This free site also includes optional voluntary tipping links and non-intrusive Monetag ad scripts (without full-screen popup interruptions) that may set standard functional cookies according to their respective policies.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#EAE0CD]">
                {clearedLocal ? (
                  <span className="text-xs font-semibold text-emerald-700 inline-flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>All local browser drafts cleared.</span>
                  </span>
                ) : (
                  <span className="text-xs text-[#6E655A]">
                    Want a fresh start? Clear saved drafts from this browser.
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleWipeStorage}
                  className="cursor-pointer px-3 py-1.5 rounded-lg border border-[#D7CCB5] bg-[#FAF4E8] hover:bg-rose-50 hover:border-rose-300 hover:text-rose-700 text-xs font-semibold text-[#4A433A] inline-flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Saved Browser Data</span>
                </button>
              </div>
            </>
          )}

          {activeTab === 'terms' && (
            <>
              <div className="bg-[#FAF4E8] border border-[#DDD2BC] rounded-xl p-3.5 flex items-start gap-2.5 text-[#1E1B18] text-xs">
                <CheckCircle2 className="w-4 h-4 text-[#9A4319] shrink-0 mt-0.5" />
                <span>
                  <strong>Free Personal &amp; Study Utility:</strong> Human Handwriting AI is provided free of charge for note drafting, personal study sheets, letters, and print formatting.
                </span>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-bold text-[#1E1B18] text-sm">1. Acceptable Use</h4>
                <p className="text-xs text-[#4A433A]">
                  Users are solely responsible for ensuring their exported documents comply with applicable school policies, academic integrity codes, and local laws. Do not use simulated handwriting for fraudulent signatures or forged official documents.
                </p>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-bold text-[#1E1B18] text-sm">2. Voluntary Support &amp; No Warranty</h4>
                <p className="text-xs text-[#4A433A]">
                  All features are accessible at zero cost without paywalls. Tips sent via UPI or Bitcoin are voluntary gifts to support ongoing hosting and maintenance. The application is provided &ldquo;as is&rdquo; without express warranties.
                </p>
              </div>
            </>
          )}

          {activeTab === 'copyright' && (
            <>
              <div className="bg-amber-50 border border-amber-300 rounded-xl p-3.5 flex items-start gap-2.5 text-amber-950 text-xs">
                <Scale className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Original Assets &amp; Open Font Licenses:</strong> Every paper ruling, interface component, logo mark, and copy line in Human Handwriting AI is independently created or backed by permissive open font licenses.
                </span>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-bold text-[#1E1B18] text-sm">
                  1. Open-Source Handwriting Font Credits
                </h4>
                <p className="text-xs text-[#4A433A]">
                  All 19 built-in handwriting scripts (Kalam, Caveat, Homemade Apple, Patrick Hand, Shadows Into Light, Indie Flower, Reenie Beanie, Architects Daughter, Gloria Hallelujah, and companions) are open-source fonts served from Google Fonts under the SIL Open Font License (OFL) or Apache 2.0 License. Custom fonts uploaded by users remain the sole responsibility and property of their respective owners.
                </p>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-bold text-[#1E1B18] text-sm">
                  2. Procedural Notebook Papers (No Scraped Stock Assets)
                </h4>
                <p className="text-xs text-[#4A433A]">
                  All 23 notebook rulings (college-ruled, Cornell notes, French Séyès, quad grid, spiral binding, and vintage cream textures) are rendered cleanly via CSS gradients and inline SVG patterns rather than external watermarked stock images.
                </p>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-bold text-[#1E1B18] text-sm">
                  3. Copyright Inquiries &amp; DMCA Contact
                </h4>
                <p className="text-xs text-[#4A433A]">
                  If you believe any content or attribution needs correction, please switch to the Contact tab or reach Plenty via GitHub (@plenty) for prompt review and resolution.
                </p>
              </div>
            </>
          )}

          {activeTab === 'contact' && (
            <form onSubmit={handleContactSubmit} className="space-y-3">
              {formSubmitted ? (
                <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-900 space-y-2 text-xs">
                  <div className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Feedback note saved!</span>
                  </div>
                  <p>
                    Thank you for reaching out. Because this studio runs client-side with no tracking backend, for direct developer replies please also open an issue or message on{' '}
                    <a
                      href="https://github.com/plenty"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold underline text-emerald-700"
                    >
                      GitHub (@plenty) ↗
                    </a>
                    .
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-xs text-[#4A433A]">
                    Report a layout issue, request a notebook ruling, or send feedback directly.
                  </p>

                  {formError && (
                    <div className="p-2.5 rounded-lg border border-rose-300 bg-rose-50 text-rose-800 text-xs font-medium">
                      {formError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-[#1E1B18]">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Jordan"
                        className="w-full px-3 py-2 rounded-lg border border-[#D7CCB5] bg-[#FAF4E8] focus:border-[#9A4319] text-xs text-[#1E1B18] placeholder:text-[#6E655A] outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-[#1E1B18]">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-3 py-2 rounded-lg border border-[#D7CCB5] bg-[#FAF4E8] focus:border-[#9A4319] text-xs text-[#1E1B18] placeholder:text-[#6E655A] outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1 text-[#1E1B18]">
                      Topic
                    </label>
                    <select
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[#D7CCB5] bg-[#FAF4E8] text-xs text-[#1E1B18] outline-hidden cursor-pointer"
                    >
                      <option>Feedback &amp; Suggestion</option>
                      <option>Bug Report / Export Issue</option>
                      <option>Copyright / Attribution Inquiry</option>
                      <option>Tipping &amp; Coffee Support</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1 text-[#1E1B18]">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe how we can improve Human Handwriting AI..."
                      className="w-full px-3 py-2 rounded-lg border border-[#D7CCB5] bg-[#FAF4E8] focus:border-[#9A4319] text-xs text-[#1E1B18] placeholder:text-[#6E655A] outline-hidden resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <a
                      href="https://github.com/plenty"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-[#9A4319] hover:underline"
                    >
                      Or message on GitHub (@plenty) ↗
                    </a>
                    <button
                      type="submit"
                      className="cursor-pointer px-4 py-2 rounded-xl bg-[#24201C] hover:bg-[#38322C] text-[#FFFDF8] text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Message</span>
                    </button>
                  </div>
                </>
              )}
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#EAE0CD] bg-[#FAF4E8] flex items-center justify-between text-xs text-[#6E655A]">
          <span>&copy; 2026 Human Handwriting AI · Plenty</span>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer px-4 py-1.5 rounded-lg bg-[#FFFDF8] hover:bg-[#EDE4D2] border border-[#D7CCB5] text-[#1E1B18] font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
