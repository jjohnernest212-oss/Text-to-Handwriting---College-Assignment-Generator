import React, { useRef, useEffect } from 'react';
import { PageSettings } from '../types';

interface PenStrokeJitterCanvasProps {
  pageIndex: number;
  pageText: string;
  settings: PageSettings;
  fontFamilyCss?: string;
}

// Deterministic Mulberry32 PRNG
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function PenStrokeJitterCanvas({
  pageIndex,
  pageText,
  settings,
  fontFamilyCss = 'cursive',
}: PenStrokeJitterCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fixed A4 dimensions
    const width = 794;
    const height = 1123;
    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);

    if (!settings.humanJitter || !pageText) {
      return;
    }

    const prng = mulberry32((pageIndex + 1) * 3137 + (settings.inkBlotSeed || 42));
    const lines = pageText.split('\n');
    const availableWidth = Math.max(100, width - settings.leftMargin - settings.rightMargin);
    const intensity = settings.jitterIntensity || 2;

    // Approximate character measurement
    const approxCharWidth = settings.fontSize * 0.52 + (settings.letterSpacing || 0);

    ctx.save();
    ctx.fillStyle = settings.inkColor;
    ctx.strokeStyle = settings.inkColor;

    lines.forEach((line, lIdx) => {
      if (!line || line.trim() === '') return;

      const lineY = settings.topMargin + lIdx * settings.lineHeight;
      if (lineY > height - settings.bottomMargin) return;

      // Deterministic line baseline micro-wobble
      const lineBaselineTilt = ((lIdx % 5) - 2) * (0.25 * intensity);
      const lineBaselineY = lineY + settings.fontSize * 0.82 + lineBaselineTilt;

      const words = line.split(' ');
      let currentX = settings.leftMargin;

      // Calculate spacing if justified
      let wordSpacing = settings.wordSpacing + 8;
      if (settings.justification === 'full' && words.length > 1 && lIdx < lines.length - 1) {
        const totalTextLen = words.reduce((acc, w) => acc + w.length * approxCharWidth, 0);
        const remainingSpace = availableWidth - totalTextLen;
        if (remainingSpace > 0) {
          wordSpacing = Math.min(45, remainingSpace / (words.length - 1));
        }
      }

      words.forEach((word, wIdx) => {
        if (!word) {
          currentX += wordSpacing;
          return;
        }

        const wordWidth = word.length * approxCharWidth;
        const wordStartX = currentX;
        const wordEndX = currentX + wordWidth;

        // 1. Natural Pen Pressure Variation:
        // Draw subtle micro-pressure understroke with organic width modulation
        const pressureStep = 12 + prng() * 10;
        ctx.beginPath();
        for (let x = wordStartX; x <= wordEndX; x += pressureStep) {
          // Dynamic pressure oscillation (humans press harder on downstrokes and ease up on connectors)
          const pressureVariation = 0.5 + Math.sin((x + lIdx * 20) * 0.08) * 0.4;
          const strokeAlpha = (settings.inkOpacity * 0.06 * pressureVariation * (intensity * 0.6));
          const strokeY = lineBaselineY + (prng() - 0.5) * (0.8 * intensity);

          ctx.fillStyle = settings.inkColor;
          ctx.globalAlpha = Math.min(0.25, Math.max(0.02, strokeAlpha));
          ctx.beginPath();
          ctx.ellipse(
            x,
            strokeY,
            Math.max(1, 1.2 * intensity * pressureVariation),
            Math.max(0.6, 0.7 * intensity),
            (prng() - 0.5) * 0.4,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }

        // 2. Character Stroke End Ink Accumulation:
        // When pen lifts at the end of word or punctuation (.,!?:-), capillary action deposits extra ink
        const lastChar = word[word.length - 1];
        const isPunctuation = /[.,!?:;'"\-]/.test(lastChar);
        const accumulationChance = isPunctuation ? 0.95 : 0.65;

        if (prng() < accumulationChance) {
          // End of stroke pool coordinates
          const endPoolX = wordEndX + (prng() - 0.5) * 2;
          const endPoolY = lineBaselineY + (isPunctuation ? (prng() * 2) : ((prng() - 0.4) * 2));
          const poolRadius = (isPunctuation ? 1.6 : 1.2) + prng() * (0.9 * intensity);
          const poolAlpha = settings.inkOpacity * (0.28 + prng() * 0.28);

          ctx.globalAlpha = Math.min(0.7, poolAlpha);
          ctx.beginPath();
          // Slightly non-circular droplet
          ctx.ellipse(
            endPoolX,
            endPoolY,
            poolRadius * (0.85 + prng() * 0.3),
            poolRadius * (0.85 + prng() * 0.3),
            prng() * Math.PI,
            0,
            Math.PI * 2
          );
          ctx.fill();

          // Tiny secondary micro-satellite droplet
          if (prng() < 0.4) {
            ctx.globalAlpha = poolAlpha * 0.5;
            ctx.beginPath();
            ctx.arc(
              endPoolX + (prng() - 0.5) * 3,
              endPoolY + (prng() - 0.5) * 3,
              poolRadius * 0.45,
              0,
              Math.PI * 2
            );
            ctx.fill();
          }
        }

        // 3. Random Jitter Tremor Stroke:
        // Occasional micro stroke extension at top or bottom (cross of 't', descender of 'y'/'g')
        if (/[tgjypqfdk]/.test(word) && prng() < 0.45) {
          const jitterX = wordStartX + prng() * wordWidth;
          const isDescender = /[gypqj]/.test(word);
          const jitterY = lineBaselineY + (isDescender ? 4 + prng() * 6 : -settings.fontSize * 0.6 - prng() * 3);
          const tailLen = (2 + prng() * 4) * (intensity * 0.5);

          ctx.globalAlpha = settings.inkOpacity * (0.15 + prng() * 0.15);
          ctx.lineWidth = Math.max(0.6, 0.9 * settings.inkThickness);
          ctx.beginPath();
          ctx.moveTo(jitterX, jitterY);
          ctx.lineTo(jitterX + (prng() - 0.3) * tailLen, jitterY + (prng() - 0.5) * 2);
          ctx.stroke();
        }

        currentX += wordWidth + wordSpacing;
      });
    });

    ctx.restore();
  }, [
    pageIndex,
    pageText,
    settings.humanJitter,
    settings.jitterIntensity,
    settings.inkColor,
    settings.inkOpacity,
    settings.inkThickness,
    settings.fontSize,
    settings.lineHeight,
    settings.letterSpacing,
    settings.wordSpacing,
    settings.topMargin,
    settings.leftMargin,
    settings.rightMargin,
    settings.bottomMargin,
    settings.justification,
    settings.inkBlotSeed,
    fontFamilyCss,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none select-none z-12"
      style={{
        width: '794px',
        height: '1123px',
        mixBlendMode: 'multiply',
      }}
      aria-hidden="true"
    />
  );
}
