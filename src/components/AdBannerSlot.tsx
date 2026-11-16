import React from 'react';
import { Coffee } from 'lucide-react';

interface AdBannerSlotProps {
  variant: 'top' | 'sidebar' | 'horizontal';
  slotId?: string;
  onOpenBuyCoffee?: () => void;
  className?: string;
}

/**
 * Clean, non-blocking Creamy Light banner containers (Top, Side, Above-Footer)
 * with zero popups, zero full-page overlays, and zero overlap with studio controls.
 */
export default function AdBannerSlot({
  variant,
  slotId = 'responsive-banner-slot',
  onOpenBuyCoffee,
  className = '',
}: AdBannerSlotProps) {
  if (variant === 'top') {
    return (
      <aside
        aria-label="Top banner container"
        data-ad-slot={slotId}
        data-ad-format="top-banner"
        className={`w-full rounded-2xl border border-[#DDD2BC] bg-[#FFFDF8] px-3.5 py-2.5 text-[#4A433A] shadow-2xs shrink-0 ${className}`}
      >
        <div
          id={slotId}
          className="w-full min-h-[54px] sm:min-h-[64px] rounded-xl border border-[#EAE0CD] bg-[#FAF4E8] px-3.5 py-2 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left"
        >
          <div className="flex items-center gap-2.5 flex-wrap justify-center sm:justify-start">
            <span className="text-[11px] font-medium uppercase tracking-wider text-[#6E655A]">
              Advertisement
            </span>
            <span aria-hidden="true" className="hidden sm:inline text-[#C5B8A2]">
              ·
            </span>
            <span className="text-xs font-medium text-[#1E1B18]">
              Top Banner Slot (728×90 desktop · 320×50 mobile) — Non-intrusive inline placement
            </span>
          </div>

          {onOpenBuyCoffee && (
            <button
              type="button"
              onClick={onOpenBuyCoffee}
              className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-semibold text-[#9A4319] hover:text-[#7D3411] hover:underline whitespace-nowrap shrink-0 transition-colors"
            >
              <Coffee className="w-3.5 h-3.5" />
              <span>Support Creator</span>
            </button>
          )}
        </div>
      </aside>
    );
  }

  if (variant === 'sidebar') {
    return (
      <aside
        aria-label="Sidebar banner container"
        data-ad-slot={slotId}
        data-ad-format="sidebar-rectangle"
        className={`w-full rounded-2xl border border-[#DDD2BC] bg-[#FFFDF8] p-3 text-[#4A433A] shadow-2xs shrink-0 ${className}`}
      >
        <div className="flex items-center justify-between gap-2 mb-2 px-0.5 text-[11px] text-[#6E655A]">
          <span className="font-medium tracking-wide uppercase">Advertisement</span>
          {onOpenBuyCoffee && (
            <button
              type="button"
              onClick={onOpenBuyCoffee}
              className="cursor-pointer inline-flex items-center gap-1 font-semibold text-[#9A4319] hover:text-[#7D3411] hover:underline transition-colors"
            >
              <Coffee className="w-3 h-3" />
              <span>Tip Creator</span>
            </button>
          )}
        </div>

        <div
          id={slotId}
          className="w-full min-h-[156px] rounded-xl border border-[#EAE0CD] bg-[#FAF4E8] px-4 py-4 flex flex-col items-center justify-center gap-1.5 text-center"
        >
          <p className="text-xs font-semibold text-[#1E1B18]">
            Sidebar Ad Slot (300×250)
          </p>
          <p className="text-[11px] text-[#6E655A] max-w-[260px] leading-relaxed">
            Fixed inside editor sidebar flow—never blocks typing, formatting sliders, or download buttons.
          </p>
        </div>
      </aside>
    );
  }

  return (
    <aside
      aria-label="Footer horizontal banner container"
      data-ad-slot={slotId}
      data-ad-format="horizontal-banner"
      className={`w-full rounded-2xl border border-[#DDD2BC] bg-[#FFFDF8] p-3 sm:p-3.5 text-[#4A433A] shadow-2xs shrink-0 ${className}`}
    >
      <div className="flex items-center justify-between gap-2 mb-2 px-0.5 text-[11px] text-[#6E655A] flex-wrap">
        <span className="font-medium tracking-wide uppercase">Advertisement</span>
        {onOpenBuyCoffee && (
          <button
            type="button"
            onClick={onOpenBuyCoffee}
            className="cursor-pointer inline-flex items-center gap-1 font-semibold text-[#9A4319] hover:text-[#7D3411] hover:underline transition-colors"
          >
            <Coffee className="w-3 h-3" />
            <span>Support with a Coffee</span>
          </button>
        )}
      </div>

      <div
        id={slotId}
        className="w-full min-h-[76px] sm:min-h-[90px] rounded-xl border border-[#EAE0CD] bg-[#FAF4E8] px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left"
      >
        <div className="space-y-0.5">
          <p className="text-xs font-semibold text-[#1E1B18]">
            Free Forever Studio — Clean Above-Footer Banner Slot
          </p>
          <p className="text-[11px] text-[#6E655A]">
            Responsive 728×90 desktop / 320×90 mobile container · Zero popups and zero page interruption
          </p>
        </div>
        <span className="text-[11px] font-mono-code font-semibold text-[#9A4319] whitespace-nowrap shrink-0">
          banner · footer-top
        </span>
      </div>
    </aside>
  );
}
