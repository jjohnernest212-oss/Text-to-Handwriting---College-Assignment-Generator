import React, { useMemo } from 'react';

interface InkBlotsOverlayProps {
  pageIndex: number;
  pageText: string;
  inkColor: string;
  intensity: number; // 1 to 5
  seed: number;
  topMargin?: number;
  leftMargin?: number;
  rightMargin?: number;
  bottomMargin?: number;
  lineHeight?: number;
}

interface InkBlotItem {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  type: 'micro-dot' | 'finger-smudge' | 'nib-pool' | 'palm-haze' | 'flick-streak';
  opacity: number;
  borderRadius: string;
  filter?: string;
  background: string;
}

// Pseudo-random generator (Mulberry32)
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function InkBlotsOverlay({
  pageIndex,
  pageText,
  inkColor,
  intensity = 2,
  seed = 42,
  topMargin = 56,
  leftMargin = 65,
  rightMargin = 40,
  bottomMargin = 48,
  lineHeight = 28,
}: InkBlotsOverlayProps) {
  const blots = useMemo<InkBlotItem[]>(() => {
    // Number of artifacts based on intensity:
    // 1: 5-7, 2: 9-12, 3: 15-18, 4: 22-26, 5: 30-36
    const baseCount = Math.round(4 + intensity * 5.5);
    const prng = mulberry32((seed + 101) * 31 + pageIndex * 997);

    // Approximate lines where text exists
    const lines = pageText ? pageText.split('\n') : [];
    const textLineCount = Math.max(1, Math.min(32, lines.length));
    const maxTextY = topMargin + textLineCount * lineHeight;

    const items: InkBlotItem[] = [];

    for (let i = 0; i < baseCount; i++) {
      const rollType = prng();
      let type: InkBlotItem['type'] = 'micro-dot';
      let w = 2.5;
      let h = 2.5;
      let opacity = 0.8;
      let borderRadius = '50%';
      let filter = undefined;
      let rot = Math.round((prng() - 0.5) * 30);

      // Distribute coordinates: 75% on or near active text lines, 25% in margins (thumb/palm smudge)
      let x = 0;
      let y = 0;

      if (prng() < 0.75) {
        // Near written text
        const targetLine = Math.floor(prng() * textLineCount);
        const lineY = topMargin + targetLine * lineHeight;
        y = Math.max(topMargin, Math.min(1080 - bottomMargin, lineY + (prng() - 0.3) * (lineHeight * 0.75)));
        // Text horizontal range
        x = leftMargin + 10 + prng() * Math.max(100, 794 - leftMargin - rightMargin - 40);
      } else {
        // Margin / finger grip smudges
        if (prng() < 0.5) {
          // Left margin (thumb/hand anchor)
          x = leftMargin - 30 + prng() * 40;
          y = topMargin + prng() * Math.min(800, maxTextY + 100);
        } else {
          // Right margin / bottom corner
          x = 794 - rightMargin - 40 + prng() * 35;
          y = topMargin + prng() * Math.min(900, maxTextY + 120);
        }
      }

      if (rollType < 0.35) {
        // Micro-dot / pen splatter (tiny droplet from pen flick or period)
        type = 'micro-dot';
        const size = 1.5 + prng() * 2.2;
        w = size;
        h = size;
        opacity = 0.75 + prng() * 0.2;
        borderRadius = '50%';
      } else if (rollType < 0.65) {
        // Finger smudge (horizontal or angled soft drag across fresh ink)
        type = 'finger-smudge';
        w = 16 + prng() * 24;
        h = 4 + prng() * 6;
        rot = (prng() - 0.5) * 20;
        opacity = 0.12 + prng() * 0.14;
        borderRadius = '45% 55% 50% 50% / 60% 40% 60% 40%';
        filter = 'blur(0.6px)';
      } else if (rollType < 0.85) {
        // Nib pool (pen paused on paper while thinking)
        type = 'nib-pool';
        const size = 3.5 + prng() * 4.5;
        w = size * (0.8 + prng() * 0.4);
        h = size * (0.8 + prng() * 0.4);
        opacity = 0.65 + prng() * 0.25;
        borderRadius = `${35 + Math.round(prng() * 25)}% ${40 + Math.round(prng() * 20)}% ${35 + Math.round(prng() * 30)}% ${40 + Math.round(prng() * 20)}%`;
      } else {
        // Palm haze / streak
        type = 'palm-haze';
        w = 24 + prng() * 28;
        h = 7 + prng() * 10;
        rot = (prng() - 0.5) * 16;
        opacity = 0.05 + prng() * 0.08;
        borderRadius = '40% 60% 45% 55% / 50% 50% 50% 50%';
        filter = 'blur(1.2px)';
      }

      // Background gradient to give realistic feathered ink look
      let bg = inkColor;
      if (type === 'finger-smudge' || type === 'palm-haze') {
        bg = `radial-gradient(ellipse at center, ${inkColor} 0%, ${inkColor} 40%, transparent 75%)`;
      } else if (type === 'nib-pool') {
        bg = `radial-gradient(circle at 45% 45%, ${inkColor} 0%, ${inkColor} 75%, transparent 100%)`;
      }

      items.push({
        id: `blot-${pageIndex}-${i}`,
        x: Math.round(x),
        y: Math.round(y),
        width: Math.round(w * 10) / 10,
        height: Math.round(h * 10) / 10,
        rotation: Math.round(rot),
        type,
        opacity: Math.round(opacity * 100) / 100,
        borderRadius,
        filter,
        background: bg,
      });
    }

    return items;
  }, [pageIndex, pageText, inkColor, intensity, seed, topMargin, leftMargin, rightMargin, bottomMargin, lineHeight]);

  return (
    <div
      className="absolute inset-0 pointer-events-none select-none z-15"
      style={{
        mixBlendMode: 'multiply',
      }}
      aria-hidden="true"
    >
      {blots.map((blot) => (
        <div
          key={blot.id}
          style={{
            position: 'absolute',
            left: `${blot.x}px`,
            top: `${blot.y}px`,
            width: `${blot.width}px`,
            height: `${blot.height}px`,
            transform: `rotate(${blot.rotation}deg)`,
            opacity: blot.opacity,
            background: blot.background,
            borderRadius: blot.borderRadius,
            filter: blot.filter,
            boxShadow: blot.type === 'micro-dot' ? `0 0 1px ${inkColor}` : undefined,
          }}
        />
      ))}
    </div>
  );
}
