/**
 * Splits text into discrete assignment pages.
 * Supports manual delimiter: '---page---' or '===page==='
 * Also handles automatic overflow splitting if desired.
 */

export function parsePagesFromText(rawText: string): string[] {
  if (!rawText) return [''];

  // Split on manual page dividers (case-insensitive, trims whitespace)
  const delimiterRegex = /\n?\s*---\s*page\s*---\s*\n?|\n?\s*===\s*page\s*===\s*\n?/i;
  const parts = rawText.split(delimiterRegex);

  return parts.length > 0 ? parts : [''];
}

export function joinPagesToText(pages: string[]): string {
  return pages.join('\n\n---page---\n\n');
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
