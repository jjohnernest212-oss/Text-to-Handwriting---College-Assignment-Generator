import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import confetti from 'canvas-confetti';

export interface ExportProgress {
  currentPage: number;
  totalPages: number;
  status: string;
}

/**
 * Capture an HTML page element and return as canvas with guaranteed white background
 */
export async function capturePageElement(element: HTMLElement, scale: number = 2): Promise<HTMLCanvasElement> {
  // Ensure all fonts are ready
  try {
    await document.fonts.ready;
  } catch {
    // ignore
  }

  const width = element.offsetWidth || 794;
  const height = element.offsetHeight || 1123;

  const rawCanvas = await html2canvas(element, {
    scale: scale,
    useCORS: true,
    allowTaint: true,
    logging: false,
    backgroundColor: '#ffffff', // Guarantee solid white base
    scrollX: 0,
    scrollY: 0,
    x: 0,
    y: 0,
    width: width,
    height: height,
    windowWidth: width,
    windowHeight: height,
  });

  // Create a composite canvas with an explicit white background fill
  // This prevents any transparent pixel from turning black when converting to JPEG/PNG in PDF engines
  const compositeCanvas = document.createElement('canvas');
  compositeCanvas.width = rawCanvas.width;
  compositeCanvas.height = rawCanvas.height;
  const ctx = compositeCanvas.getContext('2d');

  if (ctx) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, compositeCanvas.width, compositeCanvas.height);
    ctx.drawImage(rawCanvas, 0, 0);
    return compositeCanvas;
  }

  return rawCanvas;
}

/**
 * Download a single page element as PNG
 */
export async function downloadPageAsImage(
  element: HTMLElement,
  filename: string = 'assignment-page.png',
  scale: number = 2.5
): Promise<void> {
  const canvas = await capturePageElement(element, scale);
  const dataUrl = canvas.toDataURL('image/png', 1.0);

  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();

  triggerSuccessConfetti();
}

/**
 * Download all assignment pages as a single multi-page PDF
 */
export async function downloadPagesAsPdf(
  pageElements: HTMLElement[],
  filename: string = 'Handwritten_Assignment.pdf',
  onProgress?: (progress: ExportProgress) => void
): Promise<void> {
  if (pageElements.length === 0) return;

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

  const total = pageElements.length;

  for (let i = 0; i < total; i++) {
    if (onProgress) {
      onProgress({
        currentPage: i + 1,
        totalPages: total,
        status: `Rendering Page ${i + 1} of ${total}...`,
      });
    }

    // Isolate page i at (0, 0)
    pageElements.forEach((el, idx) => {
      el.style.display = idx === i ? 'block' : 'none';
    });

    // Small delay to allow layout reflow
    await new Promise((resolve) => setTimeout(resolve, 60));

    const elem = pageElements[i];
    const canvas = await capturePageElement(elem, 2);
    // Use JPEG with high quality on solid white composite
    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    if (i > 0) {
      pdf.addPage('a4', 'portrait');
    }

    // Fit precisely on A4 page (210mm x 297mm)
    pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
  }

  // Restore display for all pages
  pageElements.forEach((el) => {
    el.style.display = 'block';
  });

  if (onProgress) {
    onProgress({
      currentPage: total,
      totalPages: total,
      status: 'Finalizing PDF document...',
    });
  }

  pdf.save(filename);
  triggerSuccessConfetti();
}

/**
 * Celebrate with fun confetti on assignment completion
 */
export function triggerSuccessConfetti() {
  try {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#6366f1'],
    });
  } catch {
    // ignore
  }
}
