import React, { useEffect, useRef } from 'react';
import { Coffee, ExternalLink } from 'lucide-react';

export const ADSTERRA_DIRECT_LINK =
  'https://arwf.org/4/ec71957df439a4e1333d03b8fc903723';

interface AdsterraFrameBannerProps {
  adKey: string;
  width: number;
  height: number;
  title: string;
}

/**
 * Isolates each Adsterra `atOptions` invoke inside an iframe srcDoc so
 * multiple banner sizes (728x90 & 468x60) never clobber global `window.atOptions`.
 */
function AdsterraFrameBanner({
  adKey,
  width,
  height,
  title,
}: AdsterraFrameBannerProps) {
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
      referrerPolicy="no-referrer-when-downgrade"
      className="max-w-full border-0 overflow-hidden rounded-lg block mx-auto"
      style={{ width: `${width}px`, height: `${height}px` }}
    />
  );
}

interface AdBannerSlotProps {
  variant: 'horizontal' | 'sidebar' | 'compact';
  slotId?: string;
  onOpenBuyCoffee?: () => void;
  className?: string;
}

/**
 * Clean, responsive Creamy Light ad container engineered to maintain zero CLS,
 * render Adsterra 728x90, 468x60, Native, and opt-in Direct Link units cleanly,
 * and never overlap editing controls, modals, or download toolbars.
 */
export default function AdBannerSlot({
  variant,
  slotId = 'adsterra-responsive-slot',
  onOpenBuyCoffee,
  className = '',
}: AdBannerSlotProps) {
  const nativeWrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (variant !== 'sidebar' || !nativeWrapperRef.current) return;

    const host = nativeWrapperRef.current;
    // Prevent duplicate injection inside React StrictMode / re-mounts
    if (host.querySelector('script[data-adsterra-native="true"]')) return;

    const script = document.createElement('script');
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.setAttribute('data-adsterra-native', 'true');
    script.referrerPolicy = 'no-referrer-when-downgrade';
    script.src = 'https://bicea.org/21/8b609c91d52b2ebe7b251b23e844fb05';
    host.appendChild(script);
  }, [variant]);

  if (variant === 'horizontal') {
    return (
      <aside
        aria-label="Sponsored banner container"
        data-ad-slot={slotId}
        data-ad-format="horizontal"
        className={`w-full rounded-2xl border border-[#DDD2BC] bg-[#FFFDF8] p-3 sm:p-3.5 text-[#4A433A] shadow-2xs shrink-0 ${className}`}
      >
        <div className="flex items-center justify-between gap-2 mb-2 px-0.5 text-[11px] text-[#6E655A] flex-wrap">
          <span className="font-medium tracking-wide uppercase">Advertisement</span>
          <div className="flex items-center gap-3">
            <a
              href={ADSTERRA_DIRECT_LINK}
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

        {/* Dedicated 728x90 Desktop + 468x60 Compact Adsterra Banner Zone */}
        <div
          id={slotId}
          className="w-full min-h-[72px] sm:min-h-[96px] rounded-xl border border-[#EAE0CD] bg-[#FAF4E8] flex items-center justify-center px-2 py-1.5 overflow-hidden"
        >
          <div className="hidden md:flex items-center justify-center w-full">
            <AdsterraFrameBanner
              adKey="13bdeef2cd440aa7fed7c42651c9f7e1"
              width={728}
              height={90}
              title="Sponsored Horizontal Banner (728x90)"
            />
          </div>
          <div className="flex md:hidden items-center justify-center w-full overflow-hidden">
            <AdsterraFrameBanner
              adKey="4098ebc96e9c8ea220c65c7cdacc17ca"
              width={468}
              height={60}
              title="Sponsored Compact Banner (468x60)"
            />
          </div>
        </div>
      </aside>
    );
  }

  if (variant === 'compact') {
    return (
      <aside
        aria-label="Compact sponsored banner"
        data-ad-slot={slotId}
        data-ad-format="banner-468x60"
        className={`w-full rounded-2xl border border-[#DDD2BC] bg-[#FFFDF8] p-3 text-[#4A433A] shadow-2xs shrink-0 ${className}`}
      >
        <div className="flex items-center justify-between gap-2 mb-2 px-0.5 text-[11px] text-[#6E655A] flex-wrap">
          <span className="font-medium tracking-wide uppercase">Sponsored Banner</span>
          <div className="flex items-center gap-3">
            <a
              href={ADSTERRA_DIRECT_LINK}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="inline-flex items-center gap-1 font-medium text-[#6E655A] hover:text-[#9A4319] hover:underline transition-colors"
            >
              <span>Explore Partner</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            {onOpenBuyCoffee && (
              <button
                type="button"
                onClick={onOpenBuyCoffee}
                className="cursor-pointer inline-flex items-center gap-1 font-semibold text-[#9A4319] hover:text-[#7D3411] hover:underline transition-colors"
              >
                <Coffee className="w-3 h-3" />
                <span>Buy Plenty a Coffee</span>
              </button>
            )}
          </div>
        </div>

        <div
          id={slotId}
          className="w-full min-h-[68px] rounded-xl border border-[#EAE0CD] bg-[#FAF4E8] flex items-center justify-center px-2 py-1 overflow-hidden"
        >
          <AdsterraFrameBanner
            adKey="4098ebc96e9c8ea220c65c7cdacc17ca"
            width={468}
            height={60}
            title="Sponsored Standard Banner (468x60)"
          />
        </div>
      </aside>
    );
  }

  return (
    <aside
      aria-label="Sponsored sidebar container"
      data-ad-slot={slotId}
      data-ad-format="native-sidebar"
      className={`w-full rounded-2xl border border-[#DDD2BC] bg-[#FFFDF8] p-3.5 text-[#4A433A] shadow-2xs shrink-0 ${className}`}
    >
      <div className="flex items-center justify-between gap-2 mb-2 text-[11px] text-[#6E655A]">
        <span className="font-medium tracking-wide uppercase">Sponsored</span>
        <div className="flex items-center gap-2.5">
          <a
            href={ADSTERRA_DIRECT_LINK}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="inline-flex items-center gap-1 font-medium text-[#6E655A] hover:text-[#9A4319] hover:underline transition-colors"
          >
            <span>Offer</span>
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

      {/* Dedicated Adsterra Native Banner Container */}
      <div
        ref={nativeWrapperRef}
        id={slotId}
        className="w-full min-h-[140px] rounded-xl border border-[#EAE0CD] bg-[#FAF4E8] p-2.5 flex flex-col items-center justify-center overflow-hidden"
      >
        <div id="container-8b609c91d52b2ebe7b251b23e844fb05" className="w-full" />
      </div>
    </aside>
  );
}
