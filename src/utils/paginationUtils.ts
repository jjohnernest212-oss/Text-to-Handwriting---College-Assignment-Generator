import { PageSettings } from '../types';

/**
 * Splits text into discrete assignment pages.
 * Supports manual delimiters: '---page---', '===page===', '--- Page N ---', form feeds
 * Handles unlimited multi-page assignments.
 */
export function parsePagesFromText(rawText: string): string[] {
  if (rawText === undefined || rawText === null) return [''];

  // Match common page dividers: ---page---, ===page===, --- Page 1 ---, form feeds, etc.
  const delimiterRegex = /\n?\s*(?:---|===)\s*page(?:\s*\d+)?\s*(?:---|===)\s*\n?|\f/i;
  const parts = rawText.split(delimiterRegex);

  // Return non-empty array of page strings
  return parts.length > 0 ? parts : [''];
}

export function joinPagesToText(pages: string[]): string {
  return pages.join('\n\n---page---\n\n');
}

/**
 * Calculate printable lines per page based on A4 dimensions (1123px height at 96 DPI)
 * and active margins and line-height.
 */
export function getLinesPerPage(settings?: Partial<PageSettings>): number {
  const topMargin = settings?.topMargin ?? 80;
  const bottomMargin = settings?.bottomMargin ?? 80;
  const lineHeight = settings?.lineHeight ?? 32;
  const printableHeight = Math.max(300, 1123 - topMargin - bottomMargin);
  // Reserve 1 line of safety padding at the bottom so text never touches or cuts off the bottom margin
  const capacity = Math.floor(printableHeight / Math.max(20, lineHeight)) - 1;
  return Math.max(12, Math.min(45, capacity));
}

/**
 * Calculate average characters per line based on A4 dimensions (794px width at 96 DPI)
 * and active margins and font size.
 */
export function getCharsPerLine(settings?: Partial<PageSettings>): number {
  const leftMargin = settings?.leftMargin ?? 95;
  const rightMargin = settings?.rightMargin ?? 50;
  const fontSize = settings?.fontSize ?? 18;
  const printableWidth = Math.max(200, 794 - leftMargin - rightMargin);
  // In typical handwriting fonts, average character width is ~0.56 of font-size
  const avgCharWidth = Math.max(8, fontSize * 0.56);
  const chars = Math.floor(printableWidth / avgCharWidth);
  return Math.max(30, Math.min(100, chars));
}

/**
 * Wraps a single paragraph into formatted lines that fit within maxCharsPerLine,
 * respecting word boundaries.
 */
export function wrapParagraphToLines(paragraph: string, maxCharsPerLine: number = 65): string[] {
  if (!paragraph || paragraph.trim() === '') {
    return [''];
  }

  const words = paragraph.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (let i = 0; i < words.length; i++) {
    const word = words[i];

    if (!currentLine) {
      currentLine = word;
    } else if (currentLine.length + 1 + word.length <= maxCharsPerLine) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

/**
 * Format raw text into an array of wrapped lines as it will actually render on ruled paper.
 */
export function formatTextToPaperLines(text: string, maxCharsPerLine: number = 65): string[] {
  const rawParagraphs = text.split('\n');
  const allLines: string[] = [];

  for (const para of rawParagraphs) {
    if (para === '') {
      allLines.push('');
    } else {
      const wrapped = wrapParagraphToLines(para, maxCharsPerLine);
      allLines.push(...wrapped);
    }
  }

  return allLines;
}

export interface AssignmentStats {
  totalWords: number;
  totalChars: number;
  totalParagraphs: number;
  estimatedLines: number;
  linesPerPage: number;
  charsPerLine: number;
  recommendedPages: number;
  currentPagesCount: number;
  needsMorePages: boolean;
  pagesWordCounts: number[];
  overflowWords: number;
}

/**
 * Compute detailed assignment statistics and calculate exact page requirements.
 */
export function calculateAssignmentStats(
  rawText: string,
  settings?: Partial<PageSettings>
): AssignmentStats {
  const text = rawText || '';
  const trimmed = text.trim();
  const totalWords = trimmed ? trimmed.split(/\s+/).length : 0;
  const totalChars = text.length;
  const rawParagraphs = text.split('\n').filter((p) => p.trim().length > 0);
  const totalParagraphs = rawParagraphs.length;

  const linesPerPage = getLinesPerPage(settings);
  const charsPerLine = getCharsPerLine(settings);

  // Calculate current pages
  const currentPages = parsePagesFromText(text);
  const pagesWordCounts = currentPages.map((p) => {
    const pt = p.trim();
    return pt ? pt.split(/\s+/).length : 0;
  });

  // Calculate total rendered lines across all text
  let totalEstimatedLines = 0;
  let hasAnyPageOverflow = false;
  let overflowWords = 0;

  for (const page of currentPages) {
    const lines = formatTextToPaperLines(page, charsPerLine);
    totalEstimatedLines += lines.length;
    if (lines.length > linesPerPage) {
      hasAnyPageOverflow = true;
      // Estimate how many words overflow past the bottom line of the page
      const overflowingLines = lines.slice(linesPerPage);
      const ovWords = overflowingLines.join(' ').trim().split(/\s+/).filter(Boolean).length;
      overflowWords += ovWords;
    }
  }

  const recommendedPages = Math.max(1, Math.ceil(totalEstimatedLines / linesPerPage));
  const needsMorePages = recommendedPages > currentPages.length || hasAnyPageOverflow;

  return {
    totalWords,
    totalChars,
    totalParagraphs,
    estimatedLines: totalEstimatedLines,
    linesPerPage,
    charsPerLine,
    recommendedPages,
    currentPagesCount: currentPages.length,
    needsMorePages,
    pagesWordCounts,
    overflowWords,
  };
}

/**
 * Automatically splits continuous assignment text into the exact number of needed pages
 * based on ruled A4 page capacity and active font/margin settings.
 *
 * If the user has already inserted manual page delimiters ('---page---'), it respects them,
 * but if any individual page has more content than fits on a physical page, it intelligently
 * splits that page across multiple pages so no handwriting overflows off the bottom of the sheet.
 */
export function autoSplitLongText(
  text: string,
  settingsOrLinesPerPage?: Partial<PageSettings> | number
): string {
  if (!text || !text.trim()) {
    return text || '';
  }

  let linesPerPage: number;
  let charsPerLine: number;

  if (typeof settingsOrLinesPerPage === 'number') {
    // Legacy support: if someone passes lines per page as number
    linesPerPage = settingsOrLinesPerPage > 100 ? 27 : settingsOrLinesPerPage;
    charsPerLine = 65;
  } else {
    linesPerPage = getLinesPerPage(settingsOrLinesPerPage);
    charsPerLine = getCharsPerLine(settingsOrLinesPerPage);
  }

  // First, split on any existing explicit page breaks
  const existingPages = parsePagesFromText(text);
  const resultPages: string[] = [];

  for (const pageText of existingPages) {
    const paragraphs = pageText.split('\n');
    let currentPageLines: string[] = [];
    let currentLineCount = 0;

    for (let pIdx = 0; pIdx < paragraphs.length; pIdx++) {
      const para = paragraphs[pIdx];

      if (para === '') {
        // Empty blank line between paragraphs
        if (currentLineCount + 1 > linesPerPage && currentPageLines.length > 0) {
          // Push current page
          resultPages.push(currentPageLines.join('\n'));
          currentPageLines = [];
          currentLineCount = 0;
        } else {
          currentPageLines.push('');
          currentLineCount += 1;
        }
        continue;
      }

      // Wrap this paragraph into paper lines
      const wrappedLines = wrapParagraphToLines(para, charsPerLine);

      // If the entire paragraph fits on the current page, add it
      if (currentLineCount + wrappedLines.length <= linesPerPage) {
        currentPageLines.push(para);
        currentLineCount += wrappedLines.length;
      } else {
        // The paragraph doesn't completely fit on the current page.
        // We will split cleanly line-by-line across page boundaries!
        let remainingLines = [...wrappedLines];

        while (remainingLines.length > 0) {
          const spaceLeft = linesPerPage - currentLineCount;

          if (spaceLeft <= 1 && currentPageLines.length > 0) {
            // Very little or no space left; push current page and start fresh
            resultPages.push(currentPageLines.join('\n'));
            currentPageLines = [];
            currentLineCount = 0;
            continue;
          }

          const takeCount = Math.min(spaceLeft, remainingLines.length);
          const chunkLines = remainingLines.slice(0, takeCount);
          remainingLines = remainingLines.slice(takeCount);

          currentPageLines.push(chunkLines.join(' '));
          currentLineCount += takeCount;

          if (currentLineCount >= linesPerPage && remainingLines.length > 0) {
            resultPages.push(currentPageLines.join('\n'));
            currentPageLines = [];
            currentLineCount = 0;
          }
        }
      }
    }

    if (currentPageLines.length > 0) {
      resultPages.push(currentPageLines.join('\n'));
    }
  }

  return joinPagesToText(resultPages.length > 0 ? resultPages : ['']);
}

/**
 * Add a new blank page at the end of the assignment
 */
export function addNewPageToEnd(rawText: string): { newRawText: string; newPageIndex: number } {
  const pages = parsePagesFromText(rawText);
  pages.push('');
  return {
    newRawText: joinPagesToText(pages),
    newPageIndex: pages.length - 1,
  };
}

/**
 * Add a new page immediately after the specified page index
 */
export function addNewPageAfter(rawText: string, targetPageIndex: number): { newRawText: string; newPageIndex: number } {
  const pages = parsePagesFromText(rawText);
  const insertIndex = Math.max(0, Math.min(pages.length, targetPageIndex + 1));
  pages.splice(insertIndex, 0, '');
  return {
    newRawText: joinPagesToText(pages),
    newPageIndex: insertIndex,
  };
}

/**
 * Delete page at target index (guaranteeing at least 1 page remains)
 */
export function deletePageAtIndex(rawText: string, targetPageIndex: number): { newRawText: string; newPageIndex: number } {
  const pages = parsePagesFromText(rawText);
  if (pages.length <= 1) {
    return {
      newRawText: '',
      newPageIndex: 0,
    };
  }
  pages.splice(targetPageIndex, 1);
  const newIndex = Math.min(targetPageIndex, pages.length - 1);
  return {
    newRawText: joinPagesToText(pages),
    newPageIndex: newIndex,
  };
}
