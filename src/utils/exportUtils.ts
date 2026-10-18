import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import confetti from 'canvas-confetti';

export interface ExportProgress {
  currentPage: number;
  totalPages: number;
  status: string;
}

/**
 * Capture an HTML page element and return as canvas with guaranteed white background.
 * Uses allowTaint: false to prevent DOMException: Tainted canvases may not be exported.
 */
export async function capturePageElement(element: HTMLElement, scale: number = 2): Promise<HTMLCanvasElement> {
  // Wait for all web fonts to load
  try {
    await document.fonts.ready;
  } catch {
    // ignore font readiness errors
  }

  const width = element.offsetWidth || 794;
  const height = element.offsetHeight || 1123;

  const runCapture = async (targetScale: number): Promise<HTMLCanvasElement> => {
    return await html2canvas(element, {
      scale: targetScale,
      useCORS: true,
      allowTaint: false, // CRITICAL: NEVER allowTaint, otherwise toDataURL throws DOMException!
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
      imageTimeout: 5000,
      onclone: (_clonedDoc, clonedElement) => {
        // Ensure cloned element is fully visible for rasterization
        clonedElement.style.display = 'block';
        clonedElement.style.visibility = 'visible';
        clonedElement.style.opacity = '1';
        clonedElement.style.transform = 'none';
      },
    });
  };

  let rawCanvas: HTMLCanvasElement;
  try {
    rawCanvas = await runCapture(scale);
  } catch (err) {
    console.warn('html2canvas scale 2 failed, falling back to scale 1.5...', err);
    try {
      rawCanvas = await runCapture(1.5);
    } catch (fallbackErr) {
      console.warn('html2canvas scale 1.5 failed, falling back to scale 1.0...', fallbackErr);
      rawCanvas = await runCapture(1.0);
    }
  }

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
 * Download a single page element as PNG image smoothly
 */
export async function downloadPageAsImage(
  element: HTMLElement,
  filename: string = 'assignment-page.png',
  scale: number = 2.5
): Promise<void> {
  const canvas = await capturePageElement(element, scale);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          // Fallback to dataURL if toBlob fails
          try {
            const dataUrl = canvas.toDataURL('image/png', 1.0);
            const link = document.createElement('a');
            link.download = filename;
            link.href = dataUrl;
            link.style.display = 'none';
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
 * Download all assignment pages as a single multi-page PDF smoothly without errors
 */
export async function downloadPagesAsPdf(
  pageElements: HTMLElement[],
  filename: string = 'Handwritten_Assignment.pdf',
  onProgress?: (progress: ExportProgress) => void
): Promise<void> {
  if (!pageElements || pageElements.length === 0) {
    throw new Error('No page content available to export. Please ensure your assignment has text.');
  }

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

    const elem = pageElements[i];

    // Ensure target element is temporarily displayed for capture
    const originalDisplay = elem.style.display;
    elem.style.display = 'block';

    // Temporarily hide other sibling pages in the export container
    pageElements.forEach((el, idx) => {
      if (idx !== i) {
        el.style.display = 'none';
      }
    });

    // Small delay to allow browser layout reflow
    await new Promise((resolve) => setTimeout(resolve, 80));

    try {
      const canvas = await capturePageElement(elem, 2);
      // Use JPEG with high quality on solid white composite
      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      if (i > 0) {
        pdf.addPage('a4', 'portrait');
      }

      // Fit precisely on A4 page (210mm x 297mm)
      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
    } catch (captureErr) {
      console.error(`Error capturing page ${i + 1}:`, captureErr);
      // Fallback: draw basic blank page with text if raster fails
      if (i > 0) {
        pdf.addPage('a4', 'portrait');
      }
      pdf.text(`[Page ${i + 1}]`, 20, 20);
    } finally {
      elem.style.display = originalDisplay;
    }
  }

  // Restore display for all pages
  pageElements.forEach((el) => {
    el.style.display = 'block';
  });

  if (onProgress) {
    onProgress({
      currentPage: total,
      totalPages: total,
      status: 'Finalizing and downloading PDF...',
    });
  }

  // Save via Blob to guarantee download works smoothly in iframes and across all browsers
  try {
    const pdfBlob = pdf.output('blob');
    triggerFileDownload(pdfBlob, filename);
  } catch (saveErr) {
    console.warn('Blob download failed, trying standard pdf.save...', saveErr);
    pdf.save(filename);
  }

  triggerSuccessConfetti();
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
