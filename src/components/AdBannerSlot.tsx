import React, { useEffect, useRef } from 'react';
import { Coffee, ExternalLink } from 'lucide-react';

export const PARTNER_OFFER_URL =
  'https://arwf.org/4/ec71957df439a4e1333d03b8fc903723';

interface BoundedBannerFrameProps {
  adKey: string;
  width: number;
  height: number;
  title: string;
}

/**
 * Renders a strict fixed-size sandboxed iframe banner so inline display units
 * keep generating revenue cleanly inside Top & Above-Footer boxes while being
 * physically incapable of navigating the top tab or spawning page-covering overlays.
 */
function BoundedBannerFrame({
  adKey,
  width,
  height,
  title,
}: BoundedBannerFrameProps) {
  const srcDoc = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="referrer" content="no-referrer-when-downgrade" />
    <style>
      html, body {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background: transparent;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    </style>
  </head>
  <body>
    <script>
      atOptions = {
        'key' : '${adKey}',
        'format' : 'iframe',
        'height' : ${height},
        'width' : ${width},
        'params' : {}
      };
    </script>
    <script async="async" data-cfasync="false" src="https://bicea.org/22/${adKey}"></script>
  </body>
</html>`;

  return (
    <iframe
      title={title}
      srcDoc={srcDoc}
      width={width}
      height={height}
      scrolling="no"
      frameBorder={0}
      sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms"
      referrerPolicy="no-referrer-when-downgrade"
      className="max-w-full border-0 overflow-hidden rounded-lg block mx-auto"
      style={{ width: `${width}px`, height: `${height}px` }}
    />
  );
}

interface AdBannerSlotProps {
  variant: 'top' | 'sidebar' | 'horizontal';
  slotId?: string;
  onOpenBuyCoffee?: () => void;
  className?: string;
}

/**
 * Clean, bounded Creamy Light ad banner containers (Top, Side, Above-Footer).
 * Only displays strict inline banner & native units inside bounded slots—zero popups
 * and zero page-blocking overlays.
 */
export default function AdBannerSlot({
  variant,
  slotId = 'responsive-banner-slot',
  onOpenBuyCoffee,
  className = '',
}: AdBannerSlotProps) {
  const nativeWrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (variant !== 'sidebar' || !nativeWrapperRef.current) return;

    const host = nativeWrapperRef.current;
    if (host.querySelector('script[data-inline-native="true"]')) return;

    const script = document.createElement('script');
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.setAttribute('data-inline-native', 'true');
    script.referrerPolicy = 'no-referrer-when-downgrade';
    script.src = 'https://bicea.org/21/8b609c91d52b2ebe7b251b23e844fb05';
    host.appendChild(script);
  }, [variant]);

  if (variant === 'top') {
    return (
      <aside
        aria-label="Top sponsored banner"
        data-ad-slot={slotId}
        data-ad-format="top-banner"
        className={`w-full rounded-2xl border border-[#DDD2BC] bg-[#FFFDF8] px-3 py-2 text-[#4A433A] shadow-2xs shrink-0 ${className}`}
      >
        <div className="flex items-center justify-between gap-2 mb-1.5 px-1 text-[11px] text-[#6E655A]">
          <span className="font-medium tracking-wide uppercase">Advertisement</span>
          <div className="flex items-center gap-3">
            <a
              href={PARTNER_OFFER_URL}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="inline-flex items-center gap-1 font-medium text-[#6E655A] hover:text-[#9A4319] hover:underline transition-colors"
            >
              <span>Partner Link</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            {onOpenBuyCoffee && (
              <button
                type="button"
                onClick={onOpenBuyCoffee}
                className="cursor-pointer inline-flex items-center gap-1 font-semibold text-[#9A4319] hover:text-[#7D3411] hover:underline transition-colors"
              >
                <Coffee className="w-3 h-3" />
                <span>Support Creator</span>
              </button>
            )}
          </div>
        </div>

        <div
          id={slotId}
          className="w-full min-h-[64px] sm:min-h-[92px] rounded-xl border border-[#EAE0CD] bg-[#FAF4E8] px-2 py-1 flex items-center justify-center overflow-hidden"
        >
          <div className="hidden md:flex items-center justify-center w-full">
            <BoundedBannerFrame
              adKey="13bdeef2cd440aa7fed7c42651c9f7e1"
              width={728}
              height={90}
              title="Top Sponsored Leaderboard Banner"
            />
          </div>
          <div className="flex md:hidden items-center justify-center w-full overflow-hidden">
            <BoundedBannerFrame
              adKey="4098ebc96e9c8ea220c65c7cdacc17ca"
              width={468}
              height={60}
              title="Top Sponsored Mobile Banner"
            />
          </div>
        </div>
      </aside>
    );
  }

  if (variant === 'sidebar') {
    return (
      <aside
        aria-label="Sidebar sponsored banner"
        data-ad-slot={slotId}
        data-ad-format="sidebar-native"
        className={`w-full rounded-2xl border border-[#DDD2BC] bg-[#FFFDF8] p-3 text-[#4A433A] shadow-2xs shrink-0 ${className}`}
      >
        <div className="flex items-center justify-between gap-2 mb-2 px-0.5 text-[11px] text-[#6E655A]">
          <span className="font-medium tracking-wide uppercase">Sponsored</span>
          <div className="flex items-center gap-2.5">
            <a
              href={PARTNER_OFFER_URL}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="inline-flex items-center gap-1 font-medium text-[#6E655A] hover:text-[#9A4319] hover:underline transition-colors"
            >
              <span>Partner</span>
              <ExternalLink className="w-3 h-3" />
            </a>
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
        </div>

        <div
          ref={nativeWrapperRef}
          id={slotId}
          className="w-full min-h-[156px] rounded-xl border border-[#EAE0CD] bg-[#FAF4E8] p-2.5 flex flex-col items-center justify-center overflow-hidden"
        >
          <div id="container-8b609c91d52b2ebe7b251b23e844fb05" className="w-full" />
        </div>
      </aside>
    );
  }

  return (
    <aside
      aria-label="Above footer horizontal banner"
      data-ad-slot={slotId}
      data-ad-format="horizontal-banner"
      className={`w-full rounded-2xl border border-[#DDD2BC] bg-[#FFFDF8] p-3 sm:p-3.5 text-[#4A433A] shadow-2xs shrink-0 ${className}`}
    >
      <div className="flex items-center justify-between gap-2 mb-2 px-0.5 text-[11px] text-[#6E655A] flex-wrap">
        <span className="font-medium tracking-wide uppercase">Advertisement</span>
        <div className="flex items-center gap-3">
          <a
            href={PARTNER_OFFER_URL}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="inline-flex items-center gap-1 font-medium text-[#6E655A] hover:text-[#9A4319] hover:underline transition-colors"
          >
            <span>Partner Offer</span>
            <ExternalLink className="w-3 h-3" />
          </a>
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
      </div>

      <div
        id={slotId}
        className="w-full min-h-[68px] sm:min-h-[96px] rounded-xl border border-[#EAE0CD] bg-[#FAF4E8] px-2 py-1.5 flex items-center justify-center overflow-hidden"
      >
        <div className="hidden md:flex items-center justify-center w-full">
          <BoundedBannerFrame
            adKey="13bdeef2cd440aa7fed7c42651c9f7e1"
            width={728}
            height={90}
            title="Above Footer Sponsored Leaderboard Banner"
          />
        </div>
        <div className="flex md:hidden items-center justify-center w-full overflow-hidden">
          <BoundedBannerFrame
            adKey="4098ebc96e9c8ea220c65c7cdacc17ca"
            width={468}
            height={60}
            title="Above Footer Sponsored Mobile Banner"
          />
        </div>
      </div>
    </aside>
  );
}
