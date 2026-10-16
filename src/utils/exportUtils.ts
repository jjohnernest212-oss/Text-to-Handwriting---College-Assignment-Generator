import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import confetti from 'canvas-confetti';

export interface ExportProgress {
  currentPage: number;
  totalPages: number;
  status: string;
}

/**
 * Capture an HTML page element and return as canvas
 */
export async function capturePageElement(element: HTMLElement, scale: number = 2): Promise<HTMLCanvasElement> {
  // Ensure all fonts are ready
  await document.fonts.ready;

  const canvas = await html2canvas(element, {
    scale: scale,
    useCORS: true,
    allowTaint: true,
    logging: false,
    backgroundColor: null,
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
  });

  return canvas;
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
  const dataUrl = canvas.toDataURL('image/png', 0.95);

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

    const elem = pageElements[i];
    const canvas = await capturePageElement(elem, 2);
    const imgData = canvas.toDataURL('image/jpeg', 0.92);

    if (i > 0) {
      pdf.addPage('a4', 'portrait');
    }

    // Fit precisely on A4 page
    pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
  }

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
  } catch (e) {
    // ignore
  }
}
