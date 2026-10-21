import { PaperType } from '../types';

export interface PaperDefinition {
  id: PaperType;
  name: string;
  category: 'school' | 'aesthetic' | 'realistic' | 'math';
  badge: string;
  description: string;
  bgColor: string;
  lineColor: string;
  marginColor: string;
  recommendedLineHeight: number;
  recommendedTopMargin: number;
}

export const PAPER_DEFINITIONS: PaperDefinition[] = [
  // =========================================================================
  // CATEGORY 1: AUTHENTIC SCHOOL NOTEBOOKS (Classroom & Homework)
  // =========================================================================
  {
    id: 'ruled',
    name: 'Classic Blue Ruled School Notebook',
    category: 'school',
    badge: 'Standard School',
    description: 'Traditional school notebook with light blue ruling and red vertical margin rule.',
    bgColor: '#fafaf9',
    lineColor: '#93c5fd',
    marginColor: '#ef4444',
    recommendedLineHeight: 28,
    recommendedTopMargin: 56,
  },
  {
    id: 'college-ruled',
    name: 'US/UK College Ruled Notebook',
    category: 'school',
    badge: 'Popular College',
    description: 'Crisp 7.1mm dense lines with soft gray-blue rules and standard red margin.',
    bgColor: '#ffffff',
    lineColor: '#cbd5e1',
    marginColor: '#ef4444',
    recommendedLineHeight: 26,
    recommendedTopMargin: 56,
  },
  {
    id: 'wide-ruled',
    name: 'Wide Ruled School Notebook',
    category: 'school',
    badge: 'Wide Spaced',
    description: 'Generous 8.7mm line spacing for larger cursive or print handwriting with pink margin.',
    bgColor: '#ffffff',
    lineColor: '#93c5fd',
    marginColor: '#f43f5e',
    recommendedLineHeight: 32,
    recommendedTopMargin: 60,
  },
  {
    id: 'composition-book',
    name: 'Classic Marble Composition Book',
    category: 'school',
    badge: 'Classroom Classic',
    description: 'Signature dual top header line and classic classroom notebook blue ruling.',
    bgColor: '#fdfdfc',
    lineColor: '#93c5fd',
    marginColor: '#ef4444',
    recommendedLineHeight: 28,
    recommendedTopMargin: 64,
  },
  {
    id: 'spiral-notebook',
    name: 'Spiral Bound Wire Notebook',
    category: 'school',
    badge: 'Spiral Rings',
    description: 'Authentic metallic spiral rings on left margin with micro-perforated tear guide line.',
    bgColor: '#fafaf9',
    lineColor: '#93c5fd',
    marginColor: '#ef4444',
    recommendedLineHeight: 28,
    recommendedTopMargin: 56,
  },
  {
    id: 'perforated-binder',
    name: '3-Hole Punched Binder Paper',
    category: 'school',
    badge: 'Loose-Leaf',
    description: 'Standard 3-hole punched notebook loose-leaf sheet with realistic hole cutouts and red margin.',
    bgColor: '#ffffff',
    lineColor: '#93c5fd',
    marginColor: '#ef4444',
    recommendedLineHeight: 28,
    recommendedTopMargin: 56,
  },
  {
    id: 'french-seyes',
    name: 'French Ruled (Grands Carreaux Séyès)',
    category: 'school',
    badge: 'French Séyès',
    description: 'Authentic 8mm purple major rules with 2mm fine auxiliary lines for cursive calligraphy.',
    bgColor: '#fcfcfc',
    lineColor: '#818cf8',
    marginColor: '#ef4444',
    recommendedLineHeight: 32,
    recommendedTopMargin: 64,
  },
  {
    id: 'yellow-legal',
    name: 'Canary Yellow Legal Pad',
    category: 'school',
    badge: 'Legal Pad',
    description: 'Canary yellow tinted writing tablet with double vertical red left margin line.',
    bgColor: '#fef9c3',
    lineColor: '#93c5fd',
    marginColor: '#ef4444',
    recommendedLineHeight: 28,
    recommendedTopMargin: 56,
  },
  {
    id: 'cornell-notes',
    name: 'Cornell System Study Notes',
    category: 'school',
    badge: 'Cornell System',
    description: 'Cue column on the left (25% width), main note area, and summary review footer box.',
    bgColor: '#ffffff',
    lineColor: '#cbd5e1',
    marginColor: '#6366f1',
    recommendedLineHeight: 28,
    recommendedTopMargin: 56,
  },

  // =========================================================================
  // CATEGORY 2: AESTHETIC & STUDY JOURNAL PAGES
  // =========================================================================
  {
    id: 'aesthetic-cream',
    name: 'Aesthetic Warm Cream Journal',
    category: 'aesthetic',
    badge: 'Studygram Vibe',
    description: 'Soft warm ivory sheet with delicate muted taupe lines. Highly aesthetic study notes.',
    bgColor: '#faf6ee',
    lineColor: '#d6cfc4',
    marginColor: '#b45309',
    recommendedLineHeight: 28,
    recommendedTopMargin: 56,
  },
  {
    id: 'aesthetic-blush',
    name: 'Pastel Blush Rose Journal',
    category: 'aesthetic',
    badge: 'Pastel Rose',
    description: 'Delicate pastel pink parchment with gentle rose-tinted ruled lines.',
    bgColor: '#fff1f2',
    lineColor: '#fecdd3',
    marginColor: '#f43f5e',
    recommendedLineHeight: 28,
    recommendedTopMargin: 56,
  },
  {
    id: 'aesthetic-sage',
    name: 'Matcha Sage Green Notes',
    category: 'aesthetic',
    badge: 'Matcha Sage',
    description: 'Calm earthy sage-green sheet with soft botanical olive ruling.',
    bgColor: '#f0fdf4',
    lineColor: '#bbf7d0',
    marginColor: '#16a34a',
    recommendedLineHeight: 28,
    recommendedTopMargin: 56,
  },
  {
    id: 'aesthetic-lavender',
    name: 'Pastel Lavender Lilac Journal',
    category: 'aesthetic',
    badge: 'Lilac Vibe',
    description: 'Gentle pastel lavender sheet with dreamy violet ruled lines.',
    bgColor: '#faf5ff',
    lineColor: '#e9d5ff',
    marginColor: '#9333ea',
    recommendedLineHeight: 28,
    recommendedTopMargin: 56,
  },
  {
    id: 'dot-grid',
    name: 'Modern Bullet Journal (Dot Grid)',
    category: 'aesthetic',
    badge: 'Dot Matrix 5mm',
    description: 'Minimalist 5mm slate dot grid for neat aesthetic student bullet journaling.',
    bgColor: '#fafaf7',
    lineColor: '#94a3b8',
    marginColor: '#6366f1',
    recommendedLineHeight: 26,
    recommendedTopMargin: 50,
  },
  {
    id: 'korean-grid',
    name: 'Korean Aesthetic Study Grid',
    category: 'aesthetic',
    badge: 'K-Study Grid',
    description: 'Soft pastel square grid notebook popular in Korean and Japanese study planners.',
    bgColor: '#fcfbf7',
    lineColor: '#e2e8f0',
    marginColor: '#f43f5e',
    recommendedLineHeight: 28,
    recommendedTopMargin: 56,
  },

  // =========================================================================
  // CATEGORY 3: REALISTIC & TEXTURED BOOK PAGES
  // =========================================================================
  {
    id: 'crinkled-paper',
    name: 'Crinkled / Scanned Physical Paper',
    category: 'realistic',
    badge: 'Realistic Scanned',
    description: 'Real wrinkled paper light folds, organic lighting gradients, completely undetectable.',
    bgColor: '#f8f7f4',
    lineColor: '#93c5fd',
    marginColor: '#ef4444',
    recommendedLineHeight: 28,
    recommendedTopMargin: 56,
  },
  {
    id: 'vintage',
    name: 'Vintage Aged Book Paper',
    category: 'realistic',
    badge: 'Aged Book',
    description: 'Warm sepia-tinted aged book paper with natural edge foxing and sepia ruling.',
    bgColor: '#fbf4dc',
    lineColor: '#cfb78f',
    marginColor: '#b45309',
    recommendedLineHeight: 28,
    recommendedTopMargin: 56,
  },
  {
    id: 'parchment',
    name: 'Antique Vellum Parchment',
    category: 'realistic',
    badge: 'Parchment',
    description: 'Organic vellum parchment with subtle fiber variations and rich antique ruling.',
    bgColor: '#f6eed9',
    lineColor: '#be9f77',
    marginColor: '#92400e',
    recommendedLineHeight: 28,
    recommendedTopMargin: 56,
  },
  {
    id: 'kraft-recycled',
    name: 'Recycled Kraft Eco Notebook',
    category: 'realistic',
    badge: 'Kraft Eco',
    description: 'Natural brown cardboard pulp paper with organic specks and earth-tone ruling.',
    bgColor: '#ebdccb',
    lineColor: '#9c846d',
    marginColor: '#78350f',
    recommendedLineHeight: 28,
    recommendedTopMargin: 56,
  },
  {
    id: 'leather-diary',
    name: 'Hardcover Diary Page',
    category: 'realistic',
    badge: 'Hardcover Diary',
    description: 'Subtle gilded edge lighting, rich antique ivory tone, and fine fountain pen ruling.',
    bgColor: '#f5efe0',
    lineColor: '#b0a18f',
    marginColor: '#b45309',
    recommendedLineHeight: 28,
    recommendedTopMargin: 56,
  },

  // =========================================================================
  // CATEGORY 4: MATH, SCIENCE & DARK MODES
  // =========================================================================
  {
    id: 'grid',
    name: 'Engineering Quad Graph (5mm x 5mm)',
    category: 'math',
    badge: 'Math/Physics',
    description: 'High-precision 5mm x 5mm quad grid for math formulas, science labs, and engineering diagrams.',
    bgColor: '#ffffff',
    lineColor: '#e2e8f0',
    marginColor: '#6366f1',
    recommendedLineHeight: 28,
    recommendedTopMargin: 56,
  },
  {
    id: 'dark-aesthetic',
    name: 'Dark Obsidian Blackboard',
    category: 'math',
    badge: 'Dark Mode',
    description: 'Deep obsidian matte chalkboard with faint light ruled lines for white or pastel ink.',
    bgColor: '#18181f',
    lineColor: '#2e2e38',
    marginColor: '#6366f1',
    recommendedLineHeight: 28,
    recommendedTopMargin: 56,
  },
  {
    id: 'plain',
    name: 'Plain White A4 Bond Paper',
    category: 'math',
    badge: 'Clean Plain',
    description: 'Clean unruled 80gsm copier sheet for freehand essays and assignments without guidelines.',
    bgColor: '#ffffff',
    lineColor: 'transparent',
    marginColor: 'transparent',
    recommendedLineHeight: 28,
    recommendedTopMargin: 56,
  },
];

export const PAPER_DEFINITIONS_MAP: Record<PaperType, PaperDefinition> = PAPER_DEFINITIONS.reduce(
  (acc, def) => {
    acc[def.id] = def;
    return acc;
  },
  {} as Record<PaperType, PaperDefinition>
);

/**
 * Returns CSS background styles for the React paper preview component.
 */
export function getPaperBackgroundStyle(
  paperType: PaperType,
  lineHeight: number,
  topMargin: number
): React.CSSProperties {
  const def = PAPER_DEFINITIONS_MAP[paperType] || PAPER_DEFINITIONS[0];

  switch (paperType) {
    case 'ruled':
    case 'spiral-notebook':
    case 'perforated-binder':
      return {
        backgroundColor: def.bgColor,
        backgroundImage: `
          radial-gradient(circle at 50% 50%, rgba(255,255,255,0.4) 0%, rgba(0,0,0,0.015) 100%),
          repeating-linear-gradient(transparent 0px, transparent ${lineHeight - 1}px, #93c5fd ${lineHeight - 1}px, #93c5fd ${lineHeight}px)
        `,
        backgroundPosition: `0 0, 0px ${topMargin}px`,
      };

    case 'college-ruled':
      return {
        backgroundColor: '#ffffff',
        backgroundImage: `
          linear-gradient(to right, rgba(0,0,0,0.01) 1px, transparent 1px),
          repeating-linear-gradient(transparent 0px, transparent ${lineHeight - 1}px, #cbd5e1 ${lineHeight - 1}px, #cbd5e1 ${lineHeight}px)
        `,
        backgroundPosition: `0 0, 0px ${topMargin}px`,
      };

    case 'wide-ruled':
      return {
        backgroundColor: '#ffffff',
        backgroundImage: `
          repeating-linear-gradient(transparent 0px, transparent ${lineHeight - 1}px, #93c5fd ${lineHeight - 1}px, #93c5fd ${lineHeight}px)
        `,
        backgroundPosition: `0px ${topMargin}px`,
      };

    case 'composition-book':
      return {
        backgroundColor: '#fdfdfc',
        backgroundImage: `
          radial-gradient(circle at 50% 10%, rgba(0,0,0,0.02) 0%, transparent 60%),
          repeating-linear-gradient(transparent 0px, transparent ${lineHeight - 1}px, #93c5fd ${lineHeight - 1}px, #93c5fd ${lineHeight}px)
        `,
        backgroundPosition: `0 0, 0px ${topMargin}px`,
      };

    case 'french-seyes': {
      // Seyes has 2mm auxiliary lines between 8mm main lines
      const subLineH = Math.round(lineHeight / 4);
      return {
        backgroundColor: '#fcfcfc',
        backgroundImage: `
          linear-gradient(to right, #e0e7ff 1px, transparent 1px),
          repeating-linear-gradient(transparent 0px, transparent ${subLineH - 1}px, #e0e7ff ${subLineH - 1}px, #e0e7ff ${subLineH}px),
          repeating-linear-gradient(transparent 0px, transparent ${lineHeight - 1}px, #818cf8 ${lineHeight - 1}px, #818cf8 ${lineHeight}px)
        `,
        backgroundSize: `8mm 100%, 100% ${lineHeight}px, 100% ${lineHeight}px`,
        backgroundPosition: `0 0, 0px ${topMargin}px, 0px ${topMargin}px`,
      };
    }

    case 'cornell-notes':
      return {
        backgroundColor: '#ffffff',
        backgroundImage: `
          repeating-linear-gradient(transparent 0px, transparent ${lineHeight - 1}px, #cbd5e1 ${lineHeight - 1}px, #cbd5e1 ${lineHeight}px)
        `,
        backgroundPosition: `0px ${topMargin}px`,
      };

    case 'yellow-legal':
      return {
        backgroundColor: '#fef9c3',
        backgroundImage: `
          radial-gradient(circle at 50% 50%, rgba(255,255,255,0.4) 0%, rgba(202, 138, 4, 0.05) 100%),
          repeating-linear-gradient(transparent 0px, transparent ${lineHeight - 1}px, #93c5fd ${lineHeight - 1}px, #93c5fd ${lineHeight}px)
        `,
        backgroundPosition: `0 0, 0px ${topMargin}px`,
      };

    case 'grid':
      return {
        backgroundColor: '#ffffff',
        backgroundImage: `
          linear-gradient(to right, #e2e8f0 1px, transparent 1px),
          repeating-linear-gradient(transparent 0px, transparent ${lineHeight - 1}px, #e2e8f0 ${lineHeight - 1}px, #e2e8f0 ${lineHeight}px)
        `,
        backgroundSize: `20px 20px, 100% ${lineHeight}px`,
        backgroundPosition: `0px 0px, 0px ${topMargin}px`,
      };

    case 'korean-grid':
      return {
        backgroundColor: '#fcfbf7',
        backgroundImage: `
          linear-gradient(to right, #e5e7eb 1px, transparent 1px),
          linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
        `,
        backgroundSize: '24px 24px',
        backgroundPosition: `0px ${topMargin % 24}px`,
      };

    case 'dot-grid':
      return {
        backgroundColor: '#fafaf7',
        backgroundImage: `radial-gradient(#94a3b8 1.2px, transparent 1.2px)`,
        backgroundSize: '20px 20px',
        backgroundPosition: `0px ${topMargin % 20}px`,
      };

    case 'aesthetic-cream':
      return {
        backgroundColor: '#faf6ee',
        backgroundImage: `
          radial-gradient(ellipse at 50% 30%, rgba(255,255,255,0.4) 0%, rgba(180, 150, 100, 0.04) 100%),
          repeating-linear-gradient(transparent 0px, transparent ${lineHeight - 1}px, #d6cfc4 ${lineHeight - 1}px, #d6cfc4 ${lineHeight}px)
        `,
        backgroundPosition: `0 0, 0px ${topMargin}px`,
      };

    case 'aesthetic-blush':
      return {
        backgroundColor: '#fff1f2',
        backgroundImage: `
          radial-gradient(circle at 80% 20%, rgba(255,255,255,0.6) 0%, transparent 60%),
          repeating-linear-gradient(transparent 0px, transparent ${lineHeight - 1}px, #fecdd3 ${lineHeight - 1}px, #fecdd3 ${lineHeight}px)
        `,
        backgroundPosition: `0 0, 0px ${topMargin}px`,
      };

    case 'aesthetic-sage':
      return {
        backgroundColor: '#f0fdf4',
        backgroundImage: `
          radial-gradient(circle at 20% 80%, rgba(255,255,255,0.5) 0%, transparent 50%),
          repeating-linear-gradient(transparent 0px, transparent ${lineHeight - 1}px, #bbf7d0 ${lineHeight - 1}px, #bbf7d0 ${lineHeight}px)
        `,
        backgroundPosition: `0 0, 0px ${topMargin}px`,
      };

    case 'aesthetic-lavender':
      return {
        backgroundColor: '#faf5ff',
        backgroundImage: `
          radial-gradient(circle at 50% 50%, rgba(255,255,255,0.5) 0%, transparent 60%),
          repeating-linear-gradient(transparent 0px, transparent ${lineHeight - 1}px, #e9d5ff ${lineHeight - 1}px, #e9d5ff ${lineHeight}px)
        `,
        backgroundPosition: `0 0, 0px ${topMargin}px`,
      };

    case 'crinkled-paper':
      return {
        backgroundColor: '#f8f7f4',
        backgroundImage: `
          linear-gradient(135deg, rgba(0,0,0,0.02) 0%, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%, rgba(0,0,0,0.03) 100%),
          radial-gradient(circle at 40% 30%, rgba(255,255,255,0.4) 0%, transparent 50%),
          repeating-linear-gradient(transparent 0px, transparent ${lineHeight - 1}px, #93c5fd ${lineHeight - 1}px, #93c5fd ${lineHeight}px)
        `,
        backgroundPosition: `0 0, 0 0, 0px ${topMargin}px`,
      };

    case 'vintage':
      return {
        backgroundColor: '#fbf4dc',
        backgroundImage: `
          radial-gradient(ellipse at center, rgba(255,255,255,0.2) 0%, rgba(138, 103, 58, 0.08) 100%),
          repeating-linear-gradient(transparent 0px, transparent ${lineHeight - 1}px, #cfb78f ${lineHeight - 1}px, #cfb78f ${lineHeight}px)
        `,
        backgroundPosition: `0 0, 0px ${topMargin}px`,
      };

    case 'parchment':
      return {
        backgroundColor: '#f6eed9',
        backgroundImage: `
          radial-gradient(circle at 20% 30%, rgba(205, 175, 130, 0.15) 0%, transparent 40%),
          radial-gradient(circle at 80% 70%, rgba(180, 140, 95, 0.12) 0%, transparent 50%),
          repeating-linear-gradient(transparent 0px, transparent ${lineHeight - 1}px, #be9f77 ${lineHeight - 1}px, #be9f77 ${lineHeight}px)
        `,
        backgroundPosition: `0 0, 0 0, 0px ${topMargin}px`,
      };

    case 'leather-diary':
      return {
        backgroundColor: '#f5efe0',
        backgroundImage: `
          radial-gradient(circle at 10% 20%, rgba(0,0,0,0.03) 0%, transparent 50%),
          radial-gradient(circle at 90% 80%, rgba(0,0,0,0.04) 0%, transparent 60%),
          repeating-linear-gradient(transparent 0px, transparent ${lineHeight - 1}px, #b0a18f ${lineHeight - 1}px, #b0a18f ${lineHeight}px)
        `,
        backgroundPosition: `0 0, 0 0, 0px ${topMargin}px`,
      };

    case 'kraft-recycled':
      return {
        backgroundColor: '#ebdccb',
        backgroundImage: `
          radial-gradient(circle at 30% 40%, rgba(120, 80, 40, 0.06) 0%, transparent 60%),
          radial-gradient(circle at 70% 60%, rgba(255,255,255,0.18) 0%, transparent 50%),
          repeating-linear-gradient(transparent 0px, transparent ${lineHeight - 1}px, #9c846d ${lineHeight - 1}px, #9c846d ${lineHeight}px)
        `,
        backgroundPosition: `0 0, 0 0, 0px ${topMargin}px`,
      };

    case 'dark-aesthetic':
      return {
        backgroundColor: '#18181f',
        backgroundImage: `
          radial-gradient(circle at 50% 50%, rgba(255,255,255,0.02) 0%, transparent 100%),
          repeating-linear-gradient(transparent 0px, transparent ${lineHeight - 1}px, #2e2e38 ${lineHeight - 1}px, #2e2e38 ${lineHeight}px)
        `,
        backgroundPosition: `0 0, 0px ${topMargin}px`,
      };

    case 'plain':
    default:
      return {
        backgroundColor: '#ffffff',
        backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,255,255,1) 0%, rgba(248, 250, 252, 0.8) 100%)`,
      };
  }
}
