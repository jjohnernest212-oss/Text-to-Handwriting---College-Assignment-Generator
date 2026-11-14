import { PageSettings, ToolSlug, AppPage } from '../types';

export interface FontDetailMeta {
  id: string;
  description: string;
  bestFor: string;
  sampleLine: string;
}

export const FONT_DESCRIPTIONS: Record<string, FontDetailMeta> = {
  kalam: {
    id: 'kalam',
    description: 'Balanced, clear ballpoint/gel pen script modeled after everyday college notebooks.',
    bestFor: 'Assignments & lab records',
    sampleLine: 'Newton’s Second Law states that F = m × a.',
  },
  caveat: {
    id: 'caveat',
    description: 'Relaxed natural brush-pen handwriting with smooth letter flow and warm rhythm.',
    bestFor: 'Study notes & summaries',
    sampleLine: 'Binary Search Trees keep lookup fast at O(log n).',
  },
  'indie-flower': {
    id: 'indie-flower',
    description: 'Open, bubbly, friendly penmanship with slightly rounded loops and wide spacing.',
    bestFor: 'Journals & personal letters',
    sampleLine: 'Remember to review Chapter 4 before Friday!',
  },
  shadows: {
    id: 'shadows',
    description: 'Tall, neat, slightly narrow marker-like script that stays legible on dense pages.',
    bestFor: 'Clean revision sheets',
    sampleLine: 'Key formula: Terminal velocity v_t = 2r²(ρ - σ)g / 9η.',
  },
  'patrick-hand': {
    id: 'patrick-hand',
    description: 'Tidy vertical print-style handwriting inspired by structured classroom notebooks.',
    bestFor: 'Worksheets & definitions',
    sampleLine: 'Cellular respiration yields ~30 to 32 ATP molecules.',
  },
  'homemade-apple': {
    id: 'homemade-apple',
    description: 'Expressive traditional cursive with sweeping ascenders and organic slant.',
    bestFor: 'Essays & formal letters',
    sampleLine: 'These fragments I have shored against my ruins.',
  },
  'reenie-beanie': {
    id: 'reenie-beanie',
    description: 'Fast lecture-hall ballpoint scribble with lively natural height variations.',
    bestFor: 'Quick rough lecture notes',
    sampleLine: 'Todo: verify edge cases on recursive tree delete.',
  },
  mansalva: {
    id: 'mansalva',
    description: 'Loose organic felt-nib script with energetic letter widths and natural tilt.',
    bestFor: 'Brainstorming & flashcards',
    sampleLine: 'Energy can neither be created nor destroyed.',
  },
  'nanum-pen': {
    id: 'nanum-pen',
    description: 'Light, swift fountain-nib flow with subtle strokes well suited to dot-grid journals.',
    bestFor: 'Aesthetic study planners',
    sampleLine: 'Daily study focus: Thermodynamics & Entropy.',
  },
  'just-another-hand': {
    id: 'just-another-hand',
    description: 'Narrow, condensed vertical notes that pack plenty of words per ruled line.',
    bestFor: 'Dense exam cheat sheets',
    sampleLine: 'Quick theorem summary: P(A|B) = P(B|A)P(A) / P(B).',
  },
  gloria: {
    id: 'gloria',
    description: 'Bold felt-tip classroom handwriting with clear strokes and generous legibility.',
    bestFor: 'Headings & study posters',
    sampleLine: 'Experiment 2: Acid-Base Titration Lab Results.',
  },
  'cedarville-cursive': {
    id: 'cedarville-cursive',
    description: 'Classic schoolbook cursive script with connected strokes and gentle right slant.',
    bestFor: 'Cursive letters & literature',
    sampleLine: 'Sincerely yours, drafted in classic penmanship.',
  },
  'marck-script': {
    id: 'marck-script',
    description: 'Flowing calligraphic cursive with soft curves and high readability.',
    bestFor: 'Greeting notes & poems',
    sampleLine: 'The rhythmic cadence mirrored modern machinery.',
  },
  sacramento: {
    id: 'sacramento',
    description: 'Monoline semi-connected fountain pen script inspired by mid-century penmanship.',
    bestFor: 'Letters & diary entries',
    sampleLine: 'October 15 — Reflections on Modernist Verse.',
  },
  'gochi-hand': {
    id: 'gochi-hand',
    description: 'Clean teenager/student notebook print with friendly even stroke weight.',
    bestFor: 'Homework & math problems',
    sampleLine: 'Step 1: Isolate variable x on the left-hand side.',
  },
  dawning: {
    id: 'dawning',
    description: 'Fine-tip pencil and light pen script with delicate, airy strokes.',
    bestFor: 'Delicate journal pages',
    sampleLine: 'Observation log: clear precipitate formed at 40°C.',
  },
  'covered-grace': {
    id: 'covered-grace',
    description: 'Expressive all-around notebook script with subtle character bounce.',
    bestFor: 'Personal notes & memos',
    sampleLine: 'Don’t forget to attach the free-body diagram!',
  },
  'beth-ellen': {
    id: 'beth-ellen',
    description: 'Natural uneven handwriting that mimics quick real-world note-taking.',
    bestFor: 'Authentic rough drafts',
    sampleLine: 'Note to self: double-check units before printing.',
  },
  architects: {
    id: 'architects',
    description: 'Crisp technical draftsman lettering ideal for engineering grids and labels.',
    bestFor: 'Engineering & physics labs',
    sampleLine: 'FIG 1.2 — Load distribution across truss beam.',
  },
};

export interface FeatureItem {
  title: string;
  description: string;
  status: 'available' | 'proposed';
}

export interface FeatureCategory {
  id: string;
  code: string;
  title: string;
  summary: string;
  targetPage: AppPage;
  ctaLabel: string;
  items: FeatureItem[];
}

export const FEATURE_CATEGORIES: FeatureCategory[] = [
  {
    id: 'handwriting-styles',
    code: 'A',
    title: 'Handwriting Styles',
    summary:
      'Choose from 19 built-in handwriting scripts across Neat, Cursive, Casual, and Rapid styles—or upload your own font file.',
    targetPage: 'styles',
    ctaLabel: 'Browse Styles Gallery',
    items: [
      {
        title: '19 distinct handwriting scripts',
        description: 'Includes Kalam, Caveat, Homemade Apple, Patrick Hand, Sacramento, Cedarville Cursive, and more.',
        status: 'available',
      },
      {
        title: 'Live preview before exporting',
        description: 'Test any sentence across all styles in the gallery or watch your paper update live in the editor.',
        status: 'available',
      },
      {
        title: 'Custom font file upload (.ttf / .otf / .woff)',
        description: 'Upload a font generated from your own handwriting and render multi-page documents immediately.',
        status: 'available',
      },
      {
        title: 'Natural pen stroke jitter & ink pooling',
        description: 'Subtle line tilt, word-level micro-rotation, and stroke-end ink deposits keep pages from looking robotic.',
        status: 'available',
      },
    ],
  },
  {
    id: 'paper-styles',
    code: 'B',
    title: 'Paper Styles',
    summary:
      '23 realistic A4 notebook, journal, grid, and textured book templates ready for digital viewing or physical printing.',
    targetPage: 'papers',
    ctaLabel: 'Browse Paper Templates',
    items: [
      {
        title: 'Ruled, College, & Wide Ruled notebooks',
        description: 'Standard school and university ruling with authentic red vertical margins and top header rule.',
        status: 'available',
      },
      {
        title: 'Blank, Grid, Dot Matrix & Cornell notes',
        description: 'Plain 80gsm A4 sheets, 5mm engineering quad grid, bullet dot grid, French Séyès, and Cornell cue columns.',
        status: 'available',
      },
      {
        title: 'Aesthetic & Textured paper templates',
        description: 'Warm cream, blush, matcha sage, lavender, crinkled scanned paper, vintage book, parchment, and kraft.',
        status: 'available',
      },
      {
        title: 'Preview-only Margin Guides overlay',
        description: 'Toggle faint visual alignment brackets, line counters, and diagram snap guides without printing them.',
        status: 'available',
      },
    ],
  },
  {
    id: 'converter',
    code: 'C',
    title: 'Text-to-Handwriting Converter',
    summary:
      'A distraction-free editor designed like a clean note-taking app, with real-time A4 layout feedback.',
    targetPage: 'editor',
    ctaLabel: 'Open Handwriting Editor',
    items: [
      {
        title: 'Instant typing, clipboard paste & subject presets',
        description: 'Paste long notes or start from Physics, Computer Science, Biology, or Literature templates.',
        status: 'available',
      },
      {
        title: 'Real-time paper output & overflow alerts',
        description: 'See exact line capacity and one-click Auto-Split whenever text exceeds a single sheet.',
        status: 'available',
      },
      {
        title: 'Manual page breaks & multi-page navigation',
        description: 'Insert ---page--- breaks anywhere or add/remove individual pages in the preview toolbar.',
        status: 'available',
      },
      {
        title: 'Interactive diagram & sketch overlay',
        description: 'Draw diagrams with pen, lines, arrows, and shapes or upload sketches and drag them onto any page.',
        status: 'available',
      },
    ],
  },
  {
    id: 'document-upload',
    code: 'D',
    title: 'Document Upload',
    summary:
      'Import text documents directly in your browser without uploading your private notes to external servers.',
    targetPage: 'editor',
    ctaLabel: 'Import Text Document',
    items: [
      {
        title: 'Plain text & Markdown file import (.txt, .md, .rtf)',
        description: 'Load notes directly from local files, preview the extracted content in the editor, and auto-paginate.',
        status: 'available',
      },
      {
        title: 'Automatic multi-page splitting on import',
        description: 'Long imported text files automatically wrap and split cleanly across A4 sheets.',
        status: 'available',
      },
      {
        title: 'Direct binary PDF & Word (.docx) OCR extraction',
        description: 'Automatic parsing of binary PDF and DOCX formatting into plain editable text.',
        status: 'proposed',
      },
    ],
  },
  {
    id: 'customization',
    code: 'E',
    title: 'Customization',
    summary:
      'Start with essential controls—font, ink, size, spacing, and margin guides—and expand Advanced Settings only when needed.',
    targetPage: 'editor',
    ctaLabel: 'Customize in Editor',
    items: [
      {
        title: 'Font size, line spacing & ink palette',
        description: 'Choose gel blue, ballpoint black, red, green, graphite pencil, or any custom hex ink color.',
        status: 'available',
      },
      {
        title: 'Left, right, top & bottom page margins',
        description: 'Fine-tune all four margins in pixels alongside optional Margin Guides for exact alignment.',
        status: 'available',
      },
      {
        title: 'Student header & text justification',
        description: 'Optional Name, Roll No, Subject, Date, and Page X/Y header plus left or full justification.',
        status: 'available',
      },
      {
        title: 'Lighting, scanner look & ink smudges',
        description: 'Simulate flat scans, subtle desk shadow, warm lamp lighting, and subtle random ink blot intensity.',
        status: 'available',
      },
    ],
  },
  {
    id: 'export-download',
    code: 'F',
    title: 'Export and Download',
    summary:
      'Generate crisp, watermark-free A4 documents locally using high-DPI Canvas rendering and jsPDF.',
    targetPage: 'editor',
    ctaLabel: 'Create & Export PDF',
    items: [
      {
        title: 'Multi-page A4 PDF export',
        description: 'Compile every page, custom font, margin, smudge, and diagram into one print-ready PDF file.',
        status: 'available',
      },
      {
        title: 'Single-page high-resolution PNG export',
        description: 'Download the active page as a 2.5× scaled PNG image for quick sharing or embedding.',
        status: 'available',
      },
      {
        title: 'Browser print-ready dimensions (210 × 297 mm)',
        description: 'Every sheet renders at exact 96 DPI A4 proportions so printed output aligns with standard paper.',
        status: 'available',
      },
    ],
  },
];

export interface ToolDefinition {
  slug: ToolSlug;
  title: string;
  shortTitle: string;
  tagline: string;
  description: string;
  status: 'available' | 'proposed';
  badge: string;
  sampleTitle: string;
  sampleText: string;
  presetSettings: Partial<PageSettings>;
  steps: string[];
  faqs: { q: string; a: string }[];
}

export const TOOLS_CATALOG: ToolDefinition[] = [
  {
    slug: 'text-to-handwriting',
    title: 'Text to Handwriting',
    shortTitle: 'Text to Handwriting',
    tagline: 'Convert typed text into realistic handwritten pages in seconds.',
    description:
      'Paste essays, homework answers, or letters and convert them into natural handwritten sheets on ruled, plain, or grid paper.',
    status: 'available',
    badge: 'Core Tool',
    sampleTitle: 'Mechanics Notes',
    sampleText: `Newton's Second Law states that the rate of change of momentum is directly proportional to the applied force.\n\nF = m * a\n\nWhere m is mass (kg) and a is acceleration (m/s²).`,
    presetSettings: {
      fontId: 'kalam',
      paperType: 'ruled',
      inkColor: '#002699',
      fontSize: 18,
      lineHeight: 28,
      humanJitter: true,
    },
    steps: [
      'Paste or type your content into the editor text area.',
      'Select your preferred handwriting font, ink color, and paper template.',
      'Click Generate Handwriting to review the preview and download as PDF or PNG.',
    ],
    faqs: [
      {
        q: 'Does my text leave my device?',
        a: 'No. All text formatting, Canvas rendering, and PDF generation run 100% locally inside your browser.',
      },
      {
        q: 'Can I upload my own handwriting font?',
        a: 'Yes. Upload any .ttf, .otf, or .woff font file directly in the Pen & Paper Settings panel.',
      },
    ],
  },
  {
    slug: 'handwritten-notes',
    title: 'Handwritten Notes',
    shortTitle: 'Handwritten Notes',
    tagline: 'Structured study sheets, Cornell notes, and aesthetic revision journals.',
    description:
      'Organize lecture summaries on Cornell cue-column sheets, dot grids, or warm cream study paper with optional diagrams.',
    status: 'available',
    badge: 'Study Notes',
    sampleTitle: 'Cornell Revision Sheet',
    sampleText: `CELLULAR RESPIRATION SUMMARY\n\n1. Glycolysis (Cytoplasm)\n- Breaks 6C glucose into 2 pyruvate molecules.\n- Net yield: 2 ATP and 2 NADH.\n\n2. Krebs Cycle (Mitochondria)\n- Generates 2 ATP, 6 NADH, and 2 FADH2.`,
    presetSettings: {
      fontId: 'caveat',
      paperType: 'cornell-notes',
      inkColor: '#1a365d',
      fontSize: 19,
      lineHeight: 28,
      humanJitter: true,
    },
    steps: [
      'Choose Cornell Notes, Dot Grid, or Warm Cream paper.',
      'Write concise bullet points and add freehand or shape diagrams if needed.',
      'Toggle Margin Guides to align sketches neatly, then export your study sheet.',
    ],
    faqs: [
      {
        q: 'Can I add diagrams or sketches to my notes?',
        a: 'Yes. Open Advanced settings -> Add Sketch to draw lines, arrows, shapes, or upload an image and drag it onto the page.',
      },
      {
        q: 'Will Margin Guides show up in my exported PDF?',
        a: 'No. Margin Guides are preview-only helpers and are automatically excluded from PDF and PNG exports.',
      },
    ],
  },
  {
    slug: 'cursive-handwriting-generator',
    title: 'Cursive Handwriting Generator',
    shortTitle: 'Cursive Generator',
    tagline: 'Fluid cursive penmanship for essays, letters, and French Séyès notebooks.',
    description:
      'Pair classic cursive fonts like Homemade Apple, Sacramento, and Cedarville Cursive with fountain-pen inks and vintage or Séyès ruling.',
    status: 'available',
    badge: 'Cursive Scripts',
    sampleTitle: 'Cursive Letter Draft',
    sampleText: `Dear Reader,\n\nIn the quiet morning light, words written by hand carry a warmth and deliberateness that typed pages rarely match.\n\nWarm regards,\nAlex`,
    presetSettings: {
      fontId: 'homemade-apple',
      paperType: 'vintage',
      inkColor: '#1e293b',
      fontSize: 16,
      lineHeight: 28,
      humanJitter: true,
    },
    steps: [
      'Select a cursive script such as Homemade Apple, Sacramento, Marck Script, or Cedarville Cursive.',
      'Pair with French Séyès, Vintage Aged Book, or Aesthetic Cream paper.',
      'Adjust font size and line spacing so descenders sit cleanly on the rules, then download.',
    ],
    faqs: [
      {
        q: 'Which paper works best with cursive styles?',
        a: 'French Séyès, Aesthetic Warm Cream, and Vintage Aged Book paper give cursive strokes classic spacing and contrast.',
      },
      {
        q: 'Can I adjust spacing for taller cursive loops?',
        a: 'Yes. Use the Font Size and Line Spacing sliders right in Pen & Paper Settings.',
      },
    ],
  },
  {
    slug: 'assignment-formatting',
    title: 'Assignment Formatting',
    shortTitle: 'Assignment Formatting',
    tagline: 'University-ready margins, student headers, and justified lines.',
    description:
      'Format college assignments with Name, Roll No, Subject, Date, Page X/Y headers, printed red margins, and full text justification.',
    status: 'available',
    badge: 'Academic',
    sampleTitle: 'Lab Assignment Header',
    sampleText: `EXPERIMENT #4: BINARY SEARCH TREES\n\nA Binary Search Tree maintains keys such that left subtree keys are smaller and right subtree keys are larger.\n\nAverage Search Complexity: O(log n).`,
    presetSettings: {
      fontId: 'patrick-hand',
      paperType: 'college-ruled',
      inkColor: '#002699',
      fontSize: 18,
      lineHeight: 26,
      justification: 'full',
      showMarginLine: true,
    },
    steps: [
      'Open Advanced settings to customize your Student Header (Name, Roll No, Subject, Date).',
      'Enable Show Margin Guides to check top, bottom, left, and right page margins.',
      'Switch Text Alignment to Justify for clean block formatting and export multi-page PDF.',
    ],
    faqs: [
      {
        q: 'Does every page automatically number itself?',
        a: 'Yes. When Student Header is enabled with page numbering, each page automatically displays Page X/Y.',
      },
      {
        q: 'Can I change the top and left margin widths?',
        a: 'Yes. Use the four Page Margins sliders inside Advanced settings to match your notebook spacing.',
      },
    ],
  },
  {
    slug: 'long-document-conversion',
    title: 'Long Document Conversion',
    shortTitle: 'Long Documents',
    tagline: 'Auto-paginate multi-page reports, essays, and imported text files.',
    description:
      'Paste thousands of words or import a .txt / .md file. Automatic pagination splits content cleanly across unlimited A4 pages without cutting off lines.',
    status: 'available',
    badge: 'Multi-Page',
    sampleTitle: 'Multi-Page Split',
    sampleText: `Section 1: Overview\nLong documents are measured against your active font size and line spacing so every paragraph breaks neatly between pages.\n\n---page---\n\nSection 2: Continuation\nPage 2 starts cleanly below the top margin without clipping lines.`,
    presetSettings: {
      fontId: 'kalam',
      paperType: 'ruled',
      inkColor: '#111827',
      fontSize: 18,
      lineHeight: 28,
      humanJitter: true,
    },
    steps: [
      'Paste a long essay or click File to upload a .txt or .md document.',
      'When content exceeds one sheet, click Auto-Split to divide text cleanly across A4 pages.',
      'Review each page with the page navigation controls and download all pages in one PDF.',
    ],
    faqs: [
      {
        q: 'Is there a page limit?',
        a: 'No hard page limit is enforced. You can generate and export multi-page PDFs locally in your browser.',
      },
      {
        q: 'How do I insert a manual page break?',
        a: 'Click "+ New Page" below the editor box or type ---page--- on its own line.',
      },
    ],
  },
  {
    slug: 'pdf-to-handwriting',
    title: 'PDF to Handwriting',
    shortTitle: 'PDF to Handwriting',
    tagline: 'Extract text from binary PDF files and convert directly into handwriting.',
    description:
      'Proposed workflow: direct browser parsing of uploaded binary .pdf documents into editable text pages. Currently, plain .txt and .md file upload is supported live in the editor.',
    status: 'proposed',
    badge: 'Proposed Feature',
    sampleTitle: 'Text Import Alternative Available',
    sampleText: `Copy text from your PDF or save as a .txt / .md file, then paste or import it in the Handwriting Editor for instant multi-page conversion.`,
    presetSettings: {
      fontId: 'kalam',
      paperType: 'ruled',
    },
    steps: [
      'Proposed: Automatic binary PDF text extraction is planned for a future release.',
      'Available today: Copy text from any PDF or upload a .txt / .md file in the editor.',
      'Click Auto-Split and export your converted pages as a multi-page handwritten PDF.',
    ],
    faqs: [
      {
        q: 'Can I upload a .pdf file directly right now?',
        a: 'Not yet — direct binary PDF parsing is a proposed feature. Right now you can import .txt and .md files or paste copied PDF text directly into the editor.',
      },
    ],
  },
  {
    slug: 'handwriting-worksheets',
    title: 'Handwriting Worksheets',
    shortTitle: 'Worksheets',
    tagline: 'Dotted letter-tracing practice sheets for classrooms and calligraphy practice.',
    description:
      'Proposed workflow: printable dotted-stroke tracing worksheets with directional practice grids. Today you can print French Séyès and Wide Ruled practice sheets with typed guide text.',
    status: 'proposed',
    badge: 'Proposed Feature',
    sampleTitle: 'French Séyès Practice Alternative',
    sampleText: `a b c d e f g h i j k l m n o p q r s t u v w x y z\nPractice neat ascenders and descenders using French Séyès ruling.`,
    presetSettings: {
      fontId: 'cedarville-cursive',
      paperType: 'french-seyes',
      lineHeight: 32,
    },
    steps: [
      'Proposed: Dedicated dotted tracing-outline generator is in our product roadmap.',
      'Available today: Use French Séyès or Wide Ruled paper with light gray pencil ink to print practice sheets.',
    ],
    faqs: [
      {
        q: 'Are dotted letter-tracing worksheets available yet?',
        a: 'Dotted tracing outlines are proposed and not yet built. You can still generate light pencil-colored practice text on French Séyès or Wide Ruled paper.',
      },
    ],
  },
];

export const GENERAL_FAQS: { category: string; q: string; a: string }[] = [
  {
    category: 'Privacy & Data',
    q: 'Does Human Handwriting AI store my text or documents on a server?',
    a: 'No. Everything runs 100% locally in your browser using HTML5 Canvas and jsPDF. Your typed notes, uploaded .txt/.md files, custom fonts, and exported PDFs never leave your device.',
  },
  {
    category: 'Pricing & Limits',
    q: 'Is Human Handwriting AI really free without watermarks?',
    a: 'Yes. Every built-in handwriting style, all 23 paper templates, margin guides, and high-DPI PDF/PNG exports are free with no watermarks or account wall. Optional tips via UPI or Bitcoin help support ongoing maintenance.',
  },
  {
    category: 'Handwriting & Fonts',
    q: 'Can I upload my own real handwriting?',
    a: 'Yes. Create a .ttf, .otf, or .woff font of your handwriting (for example with Calligraphr) and upload it in Pen & Paper Settings -> Upload Font.',
  },
  {
    category: 'Documents & Upload',
    q: 'What document formats can I upload right now?',
    a: 'Plain text and Markdown files (.txt, .md, .rtf) are supported today via browser file import. Binary PDF extraction (PDF to Handwriting) is marked as a proposed feature; meanwhile you can paste text copied from any PDF.',
  },
  {
    category: 'Margins & Printing',
    q: 'Will "Show Margin Guides" appear on my downloaded PDF?',
    a: 'No. Show Margin Guides draws faint alignment markers strictly on the interactive preview canvas to help you position text and diagrams, and is never rendered into downloaded PDF or PNG files.',
  },
  {
    category: 'Export & Quality',
    q: 'What resolution and paper size are exported PDFs?',
    a: 'PDFs are exported at standard A4 size (210 × 297 mm) using 2× scaled Canvas rendering (2.5× for single-page PNGs) so handwritten strokes stay sharp when printed.',
  },
];
