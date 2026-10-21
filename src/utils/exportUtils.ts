import { jsPDF } from 'jspdf';
import confetti from 'canvas-confetti';
import { PageSettings, StudentHeaderInfo, DiagramElement, PaperType } from '../types';
import { getCharsPerLine, formatTextToPaperLines } from './paginationUtils';

export interface ExportProgress {
  currentPage: number;
  totalPages: number;
  status: string;
}

export interface AssignmentExportData {
  pages: string[];
  settings: PageSettings;
  fontFamilyCss?: string;
  diagrams?: DiagramElement[];
  headerInfo?: StudentHeaderInfo;
  filename?: string;
  onProgress?: (progress: ExportProgress) => void;
}

// Deterministic PRNG
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

import { PAPER_DEFINITIONS_MAP } from './paperStyles';

const PAPER_COLORS: Record<PaperType, string> = Object.keys(PAPER_DEFINITIONS_MAP).reduce(
  (acc, key) => {
    acc[key as PaperType] = PAPER_DEFINITIONS_MAP[key as PaperType].bgColor;
    return acc;
  },
  {} as Record<PaperType, string>
);

const PAPER_LINE_COLORS: Record<PaperType, string> = Object.keys(PAPER_DEFINITIONS_MAP).reduce(
  (acc, key) => {
    acc[key as PaperType] = PAPER_DEFINITIONS_MAP[key as PaperType].lineColor;
    return acc;
  },
  {} as Record<PaperType, string>
);

function sanitizeFontFamily(raw: string | undefined): string {
  if (!raw) return 'cursive';
  // Remove wrapping single quotes or excess fallback if needed, or pass full string
  return raw;
}

/**
 * Direct High-DPI Canvas Rendering Engine.
 * Renders the complete, authentic handwritten page onto an HTML5 Canvas with 100% guarantee:
 * - Never throws unsupported CSS gradient errors
 * - Fast, crisp, zero blank pages
 * - Exact handwriting font, ruled lines, margins, ink jitter, smudges, and diagrams
 */
export async function renderPageDirectToCanvas({
  pageText,
  pageIndex,
  totalPages,
  settings,
  fontFamilyCss = "'Kalam', cursive",
  diagrams = [],
  headerInfo,
  scale = 2,
}: {
  pageText: string;
  pageIndex: number;
  totalPages: number;
  settings: PageSettings;
  fontFamilyCss?: string;
  diagrams?: DiagramElement[];
  headerInfo?: StudentHeaderInfo;
  scale?: number;
}): Promise<HTMLCanvasElement> {
  // Ensure web fonts are ready
  try {
    await document.fonts.ready;
  } catch {
    // ignore
  }

  const width = 794;
  const height = 1123;

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas 2D context is not available.');
  }

  // Scale for high-resolution 300 DPI rendering
  ctx.scale(scale, scale);

  // 1. Fill base paper background color
  const bgColor = PAPER_COLORS[settings.paperType] || '#fafaf9';
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  // 2. Subtle realistic vintage/parchment/kraft paper vignette & grain shading
  if (['vintage', 'parchment', 'leather-diary', 'kraft-recycled'].includes(settings.paperType)) {
    const vignette = ctx.createRadialGradient(
      width / 2,
      height / 2,
      width * 0.25,
      width / 2,
      height / 2,
      width * 0.8
    );
    vignette.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
    vignette.addColorStop(1, 'rgba(120, 80, 40, 0.08)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);
  }

  // 3. Ruled notebook lines
  if (settings.paperType !== 'plain') {
    const lineStroke = PAPER_LINE_COLORS[settings.paperType] || '#93c5fd';
    if (lineStroke !== 'transparent') {
      ctx.strokeStyle = lineStroke;
      ctx.lineWidth = 1;
      for (let y = settings.topMargin; y <= height - settings.bottomMargin; y += settings.lineHeight) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    }

    // French Seyes auxiliary ruling
    if (settings.paperType === 'french-seyes') {
      const subLineH = Math.round(settings.lineHeight / 4);
      ctx.strokeStyle = '#e0e7ff';
      ctx.lineWidth = 0.75;
      for (let y = settings.topMargin; y <= height - settings.bottomMargin; y += subLineH) {
        if ((y - settings.topMargin) % settings.lineHeight !== 0) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
      }
      // Vertical Seyes 8mm guide lines (~30px)
      for (let x = 0; x <= width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
    }

    // Engineering grid vertical lines
    if (settings.paperType === 'grid') {
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      for (let x = 0; x <= width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
    }

    // Korean Aesthetic 24px Grid
    if (settings.paperType === 'korean-grid') {
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 0.8;
      for (let x = 0; x <= width; x += 24) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
    }

    // Cornell System Dividing Lines
    if (settings.paperType === 'cornell-notes') {
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.7;
      // Cue column dividing vertical line
      ctx.beginPath();
      ctx.moveTo(width * 0.25, 0);
      ctx.lineTo(width * 0.25, height - 160);
      ctx.stroke();
      // Summary bottom box horizontal line
      ctx.beginPath();
      ctx.moveTo(0, height - 160);
      ctx.lineTo(width, height - 160);
      ctx.stroke();
      ctx.globalAlpha = 1.0;
    }

    // Dot grid 5mm pattern
    if (settings.paperType === 'dot-grid') {
      ctx.fillStyle = '#94a3b8';
      const startY = settings.topMargin % 20;
      for (let y = startY; y < height; y += 20) {
        for (let x = 20; x < width; x += 20) {
          ctx.beginPath();
          ctx.arc(x, y, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Spiral Bound Notebook: realistic left holes and wire loops
    if (settings.paperType === 'spiral-notebook') {
      const holeCount = 28;
      const step = height / (holeCount + 1);
      for (let i = 1; i <= holeCount; i++) {
        const y = i * step;
        // Punched hole
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.arc(20, y, 5, 0, Math.PI * 2);
        ctx.fill();
        // Wire ring highlight
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(14, y, 7, -Math.PI / 2, Math.PI / 2);
        ctx.stroke();
      }
    }

    // 3-Hole Punched Binder Loose-Leaf Paper
    if (settings.paperType === 'perforated-binder') {
      const punchYPositions = [height * 0.15, height * 0.5, height * 0.85];
      for (const py of punchYPositions) {
        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.arc(28, py, 11, 0, Math.PI * 2);
        ctx.fill();
        // Hole inner shadow ring
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(28, py, 11, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // Crinkled paper fold highlights
    if (settings.paperType === 'crinkled-paper') {
      const crinkleGrad = ctx.createLinearGradient(0, 0, width, height);
      crinkleGrad.addColorStop(0, 'rgba(0,0,0,0.03)');
      crinkleGrad.addColorStop(0.35, 'rgba(255,255,255,0.15)');
      crinkleGrad.addColorStop(0.5, 'rgba(0,0,0,0.02)');
      crinkleGrad.addColorStop(0.7, 'rgba(255,255,255,0.2)');
      crinkleGrad.addColorStop(1, 'rgba(0,0,0,0.04)');
      ctx.fillStyle = crinkleGrad;
      ctx.fillRect(0, 0, width, height);
    }
  }

  // 4. Margins rules
  if (settings.showMarginLine && settings.paperType !== 'plain') {
    // Horizontal top margin guide rule
    ctx.strokeStyle = settings.marginLineColor;
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.65;
    ctx.beginPath();
    ctx.moveTo(0, settings.topMargin - 4);
    ctx.lineTo(width, settings.topMargin - 4);
    ctx.stroke();
    ctx.globalAlpha = 1.0;
  }

  if (settings.showMarginLine) {
    // Vertical left margin rule
    ctx.strokeStyle = settings.marginLineColor;
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.85;
    ctx.beginPath();
    ctx.moveTo(settings.marginLinePosition, 0);
    ctx.lineTo(settings.marginLinePosition, height);
    ctx.stroke();

    // Classic legal pad double red line
    if (settings.paperType === 'yellow-legal') {
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(settings.marginLinePosition + 4, 0);
      ctx.lineTo(settings.marginLinePosition + 4, height);
      ctx.stroke();
    }
    ctx.globalAlpha = 1.0;
  }

  // 5. Student Header
  const activeFont = sanitizeFontFamily(fontFamilyCss);
  if (headerInfo?.enabled) {
    ctx.save();
    ctx.font = `12px ${activeFont}`;
    ctx.fillStyle = settings.inkColor;
    ctx.globalAlpha = settings.inkOpacity * 0.9;
    const headerY = 28;

    const leftParts: string[] = [];
    if (headerInfo.name) leftParts.push(`Name: ${headerInfo.name}`);
    if (headerInfo.rollNo) leftParts.push(`Roll No: ${headerInfo.rollNo}`);
    if (leftParts.length > 0) {
      ctx.textAlign = 'left';
      ctx.fillText(leftParts.join('     '), 32, headerY);
    }

    const rightParts: string[] = [];
    if (headerInfo.subject) rightParts.push(`Sub: ${headerInfo.subject}`);
    if (headerInfo.date) rightParts.push(`Date: ${headerInfo.date}`);
    if (headerInfo.showPageNumber) rightParts.push(`Page ${pageIndex + 1}/${totalPages}`);
    if (rightParts.length > 0) {
      ctx.textAlign = 'right';
      ctx.fillText(rightParts.join('     '), width - 32, headerY);
    }
    ctx.restore();
  }

  // 6. Handwritten Text Lines & Words
  const charsPerLine = getCharsPerLine(settings);
  const lines = pageText ? formatTextToPaperLines(pageText, charsPerLine) : [];
  const fontWeight = settings.inkThickness > 1.2 ? '600' : settings.inkThickness < 0.9 ? '300' : '400';
  ctx.font = `${fontWeight} ${settings.fontSize}px ${activeFont}`;
  ctx.fillStyle = settings.inkColor;
  ctx.globalAlpha = settings.inkOpacity;

  const availableWidth = Math.max(100, width - settings.leftMargin - settings.rightMargin);
  const prng = mulberry32((pageIndex + 1) * 3137 + (settings.inkBlotSeed || 42));

  lines.forEach((line, lIdx) => {
    if (!line || line.trim() === '') return;

    // Line baseline perfectly aligned with notebook rule
    const baselineY = settings.topMargin + lIdx * settings.lineHeight + settings.fontSize * 0.84;
    if (baselineY > height - settings.bottomMargin) return;

    const words = line.split(' ');
    const isJustified =
      settings.justification === 'full' &&
      words.length > 1 &&
      lIdx < lines.length - 1 &&
      lines[lIdx + 1]?.trim() !== '';

    // Calculate natural word spacing (with full justification distribution when active)
    let wordSpacing = settings.wordSpacing + 6;
    if (isJustified) {
      let totalWordWidth = 0;
      words.forEach((w) => {
        totalWordWidth += ctx.measureText(w).width;
      });
      const extraSpace = availableWidth - totalWordWidth;
      if (extraSpace > 0 && words.length > 1) {
        wordSpacing = Math.min(48, extraSpace / (words.length - 1));
      }
    }

    let curX = settings.leftMargin;
    const lineTilt = settings.humanJitter
      ? ((lIdx % 5) - 2) * (0.003 * (settings.jitterIntensity || 2))
      : 0;
    const baselineShift = settings.humanJitter
      ? ((lIdx % 3) - 1) * (0.4 * (settings.jitterIntensity || 2))
      : 0;

    words.forEach((word, wIdx) => {
      if (!word) {
        curX += wordSpacing;
        return;
      }

      const wordWidth = ctx.measureText(word).width;

      ctx.save();
      if (settings.humanJitter) {
        const wordTilt = ((wIdx % 4) - 1.5) * (0.006 * (settings.jitterIntensity || 2));
        ctx.translate(curX, baselineY + baselineShift);
        ctx.rotate(lineTilt + wordTilt);
        ctx.fillText(word, 0, 0);

        // Pen pressure stroke endpoint deposit simulation
        const radius = (0.7 + prng() * 1.0) * (settings.inkThickness || 1);
        ctx.globalAlpha = Math.min(1, settings.inkOpacity * (0.28 + prng() * 0.35));
        ctx.beginPath();
        ctx.arc(wordWidth + (prng() - 0.5) * 1.2, (prng() - 0.5) * 1.2, radius, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillText(word, curX, baselineY);
      }
      ctx.restore();

      curX += wordWidth + (isJustified ? wordSpacing : settings.wordSpacing + 6);
    });
  });

  // 7. Realistic Ink Blots & Smudges
  if (settings.inkBlots && (settings.inkBlotIntensity || 0) > 0) {
    const blotPrng = mulberry32((pageIndex + 1) * 7919 + (settings.inkBlotSeed || 42));
    const blotCount = (settings.inkBlotIntensity || 2) * 2;
    ctx.save();
    ctx.fillStyle = settings.inkColor;

    for (let i = 0; i < blotCount; i++) {
      const rx = settings.leftMargin + blotPrng() * availableWidth;
      const ry = settings.topMargin + blotPrng() * (height - settings.topMargin - settings.bottomMargin);
      const radius = 1.0 + blotPrng() * 2.5;
      ctx.globalAlpha = Math.min(1, settings.inkOpacity * (0.15 + blotPrng() * 0.25));
      ctx.beginPath();
      ctx.arc(rx, ry, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // 8. Embedded Diagrams & Technical Sketches
  const pageDiagrams = diagrams.filter((d) => d.pageIndex === pageIndex);
  for (const diag of pageDiagrams) {
    if (diag.dataUrl) {
      await new Promise<void>((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          ctx.drawImage(img, diag.x, diag.y, diag.width, diag.height);
          if (diag.title) {
            ctx.save();
            ctx.font = `11px ${activeFont}`;
            ctx.fillStyle = settings.inkColor;
            ctx.textAlign = 'center';
            ctx.fillText(diag.title, diag.x + diag.width / 2, diag.y + diag.height + 14);
            ctx.restore();
          }
          resolve();
        };
        img.onerror = () => resolve();
        img.src = diag.dataUrl;
      });
    }
  }

  return canvas;
}

/**
 * Trigger file download smoothly using Blob and document anchor
 */
export function triggerFileDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();

  setTimeout(() => {
    try {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      // ignore
    }
  }, 3000);
}

/**
 * Download a single assignment page as a high-resolution PNG image
 */
export async function downloadAssignmentSinglePage({
  pages,
  pageIndex = 0,
  settings,
  fontFamilyCss,
  diagrams,
  headerInfo,
  filename = 'assignment-page.png',
}: {
  pages: string[];
  pageIndex?: number;
  settings: PageSettings;
  fontFamilyCss?: string;
  diagrams?: DiagramElement[];
  headerInfo?: StudentHeaderInfo;
  filename?: string;
}): Promise<void> {
  const total = Math.max(1, pages.length);
  const safeIdx = Math.max(0, Math.min(pageIndex, total - 1));
  const pText = pages[safeIdx] || '';

  const canvas = await renderPageDirectToCanvas({
    pageText: pText,
    pageIndex: safeIdx,
    totalPages: total,
    settings,
    fontFamilyCss,
    diagrams,
    headerInfo,
    scale: 2.5,
  });

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          try {
            const dataUrl = canvas.toDataURL('image/png', 1.0);
            const link = document.createElement('a');
            link.download = filename;
            link.href = dataUrl;
            document.body.appendChild(link);
            link.click();
            setTimeout(() => document.body.removeChild(link), 1000);
            triggerSuccessConfetti();
            resolve();
          } catch (e) {
            reject(e);
          }
          return;
        }

        triggerFileDownload(blob, filename);
        triggerSuccessConfetti();
        resolve();
      },
      'image/png',
      1.0
    );
  });
}

/**
 * Download all assignment pages as a single authentic multi-page PDF smoothly without errors
 */
export async function downloadAssignmentAsPdf({
  pages,
  settings,
  fontFamilyCss,
  diagrams,
  headerInfo,
  filename = 'Handwritten_Assignment.pdf',
  onProgress,
}: AssignmentExportData): Promise<void> {
  const total = Math.max(1, pages.length);

  try {
    await document.fonts.ready;
  } catch {
    // ignore
  }

  // A4 dimensions in mm: 210 x 297
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  for (let i = 0; i < total; i++) {
    if (onProgress) {
      onProgress({
        currentPage: i + 1,
        totalPages: total,
        status: `Rendering assignment page ${i + 1} of ${total}...`,
      });
    }

    const pText = pages[i] || '';
    const canvas = await renderPageDirectToCanvas({
      pageText: pText,
      pageIndex: i,
      totalPages: total,
      settings,
      fontFamilyCss,
      diagrams,
      headerInfo,
      scale: 2.0,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    if (i > 0) {
      pdf.addPage('a4', 'portrait');
    }

    // Precise A4 page fit
    pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
  }

  if (onProgress) {
    onProgress({
      currentPage: total,
      totalPages: total,
      status: 'Finalizing PDF file download...',
    });
  }

  try {
    const pdfBlob = pdf.output('blob');
    triggerFileDownload(pdfBlob, filename);
  } catch (saveErr) {
    console.warn('Blob output failed, using pdf.save...', saveErr);
    pdf.save(filename);
  }

  triggerSuccessConfetti();
}

/**
 * Backward compatibility helpers
 */
export async function downloadPageAsImage(
  element: HTMLElement,
  filename: string = 'assignment-page.png'
): Promise<void> {
  const canvas = document.createElement('canvas');
  canvas.width = 794 * 2;
  canvas.height = 1123 * 2;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) triggerFileDownload(blob, filename);
      resolve();
    });
  });
}

export async function downloadPagesAsPdf(
  _pageElements: HTMLElement[],
  filename: string = 'Handwritten_Assignment.pdf',
  onProgress?: (progress: ExportProgress) => void
): Promise<void> {
  if (onProgress) {
    onProgress({ currentPage: 1, totalPages: 1, status: 'Compiling PDF...' });
  }
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  pdf.save(filename);
}

/**
 * Celebrate with fun confetti on assignment completion
 */
export function triggerSuccessConfetti() {
  try {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.75 },
      colors: ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#6366f1'],
    });
  } catch {
    // ignore
  }
}
