import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNotify?: (message: string, type: 'success' | 'error' | 'info') => void;
}

export default function ShareModal({
  isOpen,
  onClose,
  onNotify,
}: ShareModalProps) {
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const shareUrl =
    typeof window !== 'undefined' && window.location.origin
      ? `${window.location.origin}${window.location.pathname}`
      : 'https://humanhandwritting.ai.studio';

  const shareTitle = 'Human Handwriting AI — Turn Typed Notes Into Realistic Handwriting';
  const shareText =
    'Turn typed notes, assignments, and study guides into realistic handwritten pages on lined, Cornell, or grid notebook paper—100% free & PDF exportable:';

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(`${shareText} ${shareUrl}`);
  const encodedTitle = encodeURIComponent(shareTitle);

  const handleCopyShareLink = async () => {
    let copied = false;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        copied = true;
      }
    } catch {
      // Fallback below
    }

    if (!copied) {
      try {
        const helper = document.createElement('textarea');
        helper.value = shareUrl;
        helper.setAttribute('readonly', '');
        helper.style.position = 'fixed';
        helper.style.left = '-9999px';
        document.body.appendChild(helper);
        helper.select();
        copied = document.execCommand('copy');
        document.body.removeChild(helper);
      } catch {
        copied = false;
      }
    }

    if (copied) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
      onNotify?.('Share link copied to clipboard!', 'success');
    } else {
      onNotify?.('Select and copy the URL manually.', 'info');
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        onNotify?.('Thanks for sharing Human Handwriting AI!', 'success');
      } catch {
        // User cancelled native share sheet
      }
    } else {
      handleCopyShareLink();
    }
  };

  const socialChannels = [
    {
      name: 'WhatsApp',
      href: `https://wa.me/?text=${encodedText}`,
      badge: 'Chat & Study Groups',
    },
    {
      name: 'X / Twitter',
      href: `https://twitter.com/intent/tweet?text=${encodedText}`,
      badge: 'Post Thread',
    },
    {
      name: 'Telegram',
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(shareText)}`,
      badge: 'Channels & Friends',
    },
    {
      name: 'Reddit',
      href: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
      badge: 'Study Communities',
    },
    {
      name: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      badge: 'Productivity Network',
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Share Human Handwriting AI"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E1B18]/45 p-3 sm:p-4 overflow-y-auto"
    >
      <div className="bg-[#FFFDF8] text-[#1E1B18] border border-[#DDD2BC] rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl my-6">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#EAE0CD] bg-[#FAF4E8] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#F6EBE0] border border-[#E2C2A8] text-[#9A4319] flex items-center justify-center shrink-0">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight text-[#1E1B18]">
                Share With Classmates &amp; Friends
              </h3>
              <p className="text-xs text-[#6E655A]">
                Free text-to-handwriting studio · No signup needed
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close share dialog"
            className="cursor-pointer p-2 rounded-lg text-[#6E655A] hover:text-[#1E1B18] hover:bg-[#EDE4D2] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Copyable Link Box */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#1E1B18]">
              Direct Studio Link
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                onClick={(e) => e.currentTarget.select()}
                className="flex-1 min-w-0 px-3 py-2.5 rounded-xl border border-[#D7CCB5] bg-[#FAF4E8] text-xs font-mono-code text-[#1E1B18] outline-hidden"
              />
              <button
                type="button"
                onClick={handleCopyShareLink}
                className={`cursor-pointer min-h-[40px] px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
                  copiedLink
                    ? 'bg-emerald-700 text-white'
                    : 'bg-[#24201C] hover:bg-[#38322C] text-[#FFFDF8]'
                }`}
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Native System Share CTA */}
          <button
            type="button"
            onClick={handleNativeShare}
            className="cursor-pointer w-full min-h-[44px] px-4 py-2.5 rounded-xl border border-[#E2C2A8] bg-[#F6EBE0] hover:bg-[#EDD9C5] text-[#8F3D15] text-xs font-bold inline-flex items-center justify-center gap-2 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-[#9A4319]" />
            <span>Share via Device / Quick Apps</span>
          </button>

          {/* Direct Social Platform Buttons */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-[#1E1B18]">
              Or share directly to social &amp; study groups
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {socialChannels.map((channel) => (
                <a
                  key={channel.name}
                  href={channel.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-[#DDD2BC] bg-[#FAF4E8] hover:bg-[#EFE5D3] text-[#1E1B18] transition-colors"
                >
                  <div>
                    <div className="text-xs font-bold text-[#1E1B18]">
                      {channel.name}
                    </div>
                    <div className="text-[11px] text-[#6E655A]">{channel.badge}</div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-[#9A4319] shrink-0" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#EAE0CD] bg-[#FAF4E8] flex items-center justify-between text-xs text-[#6E655A]">
          <span>Shared links include preview card automatically</span>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer px-4 py-1.5 rounded-lg bg-[#FFFDF8] hover:bg-[#EDE4D2] border border-[#D7CCB5] text-[#1E1B18] font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
