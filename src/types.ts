export type PaperType =
  | 'ruled'
  | 'college-ruled'
  | 'wide-ruled'
  | 'spiral-notebook'
  | 'composition-book'
  | 'perforated-binder'
  | 'french-seyes'
  | 'yellow-legal'
  | 'cornell-notes'
  | 'grid'
  | 'korean-grid'
  | 'plain'
  | 'aesthetic-blush'
  | 'aesthetic-sage'
  | 'aesthetic-lavender'
  | 'aesthetic-cream'
  | 'dot-grid'
  | 'dark-aesthetic'
  | 'vintage'
  | 'parchment'
  | 'crinkled-paper'
  | 'leather-diary'
  | 'kraft-recycled';

export type PaperEffect = 'none' | 'subtle-shadow' | 'mobile-scan' | 'desk-light';

export interface HandwritingFont {
  id: string;
  name: string;
  fontFamily: string;
  category: 'casual' | 'cursive' | 'neat' | 'messy';
  isCustom?: boolean;
}

export interface InkPreset {
  name: string;
  color: string;
  type: string;
  opacity: number;
}

export interface DiagramElement {
  id: string;
  pageIndex: number;
  dataUrl: string;
  x: number;
  y: number;
  width: number;
  height: number;
  title?: string;
}

export interface StudentHeaderInfo {
  enabled: boolean;
  name: string;
  rollNo: string;
  subject: string;
  date: string;
  showPageNumber: boolean;
}

export interface PageSettings {
  fontId: string;
  customFontFamily?: string;
  customFontUrl?: string;
  fontSize: number; // in px
  lineHeight: number; // in px
  letterSpacing: number; // in px
  wordSpacing: number; // in px
  inkColor: string;
  inkThickness: number; // 0.8 to 1.5
  inkOpacity: number; // 0.85 to 1.0
  paperType: PaperType;
  topMargin: number; // in px
  leftMargin: number; // in px
  rightMargin: number; // in px
  bottomMargin: number; // in px
  showMarginLine: boolean;
  marginLinePosition: number; // in px from left
  marginLineColor: string;
  paperEffect: PaperEffect;
  humanJitter: boolean;
  jitterIntensity: number; // 1 to 5
  justification: 'left' | 'full'; // 'left' natural or 'full' formal assignment justify
  paperTilt: number; // -3 to 3 deg
  snapLinesToText: boolean;
  inkBlots: boolean; // randomly generate small ink smudge artifacts
  inkBlotIntensity: number; // 1 to 5 (Subtle to Heavy)
  inkBlotSeed: number; // randomizer seed for blot placement
}

export interface AssignmentPreset {
  id: string;
  title: string;
  subject: string;
  description: string;
  content: string;
  recommendedFont: string;
  recommendedInk: string;
  recommendedPaper: PaperType;
}
