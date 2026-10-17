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

/**
 * Automatically splits long continuous text into multiple pages based on ruled A4 page capacity
 * (approx 26-28 lines per page to prevent text overflowing off the page).
 */
export function autoSplitLongText(text: string, linesPerPage: number = 26): string {
  // If the text already has explicit page breaks, leave them intact or re-paginate within
  const rawParagraphs = text.split('\n');
  const pages: string[] = [];
  let currentLines: string[] = [];
  let lineCount = 0;

  for (let i = 0; i < rawParagraphs.length; i++) {
    const para = rawParagraphs[i];
    // Check if user manually placed a page break
    if (/^\s*(?:---|===)\s*page/i.test(para.trim())) {
      pages.push(currentLines.join('\n'));
      currentLines = [];
      lineCount = 0;
      continue;
    }

    // Estimate lines for this paragraph based on ~65 chars per line
    const estimated = para.length === 0 ? 1 : Math.max(1, Math.ceil(para.length / 65));

    if (lineCount + estimated > linesPerPage && currentLines.length > 0) {
      pages.push(currentLines.join('\n'));
      currentLines = [para];
      lineCount = estimated;
    } else {
      currentLines.push(para);
      lineCount += estimated;
    }
  }

  if (currentLines.length > 0) {
    pages.push(currentLines.join('\n'));
  }

  return joinPagesToText(pages.length > 0 ? pages : ['']);
}

/**
 * Estimate if a page text might exceed A4 ruled page capacity
 */
export function estimatePageLines(text: string, charsPerLine: number = 65): number {
  const rawLines = text.split('\n');
  let totalLines = 0;
  for (const line of rawLines) {
    if (line.length === 0) {
      totalLines += 1;
    } else {
      totalLines += Math.max(1, Math.ceil(line.length / charsPerLine));
    }
  }
  return totalLines;
}
