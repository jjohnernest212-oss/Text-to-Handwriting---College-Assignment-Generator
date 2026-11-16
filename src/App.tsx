/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Background3DScene from './components/Background3DScene';
import HomeView from './components/views/HomeView';
import FeaturesView from './components/views/FeaturesView';
import StylesGalleryView from './components/views/StylesGalleryView';
import PaperTemplatesView from './components/views/PaperTemplatesView';
import ToolsView from './components/views/ToolsView';
import FaqView from './components/views/FaqView';
import PaperPreview from './components/PaperPreview';
import UnifiedControlsPanel from './components/UnifiedControlsPanel';
import DiagramModal from './components/DiagramModal';
import HowItWorksModal from './components/HowItWorksModal';
import BuyCoffeeModal from './components/BuyCoffeeModal';
import ExportModal from './components/ExportModal';
import PolicyModal, { PolicyTab } from './components/PolicyModal';
import PaperGalleryModal from './components/PaperGalleryModal';
import FloatingActions from './components/FloatingActions';
import AdBannerSlot from './components/AdBannerSlot';
import {
  downloadAssignmentAsPdf,
  downloadAssignmentSinglePage,
  ExportProgress,
} from './utils/exportUtils';
import { PAPER_DEFINITIONS_MAP } from './utils/paperStyles';
import { TOOLS_CATALOG, ToolDefinition } from './data/platformContent';

import {
  DEFAULT_PAGE_SETTINGS,
  DEFAULT_STUDENT_HEADER,
  ASSIGNMENT_PRESETS,
  BUILT_IN_FONTS,
} from './constants';
import {
  AppPage,
  ToolSlug,
  PageSettings,
  StudentHeaderInfo,
  HandwritingFont,
  DiagramElement,
  AssignmentPreset,
  PaperType,
} from './types';
import {
  parsePagesFromText,
  addNewPageToEnd,
  deletePageAtIndex,
  autoSplitLongText,
} from './utils/paginationUtils';
import { loadCustomFontFile } from './utils/fontLoader';
import {
  Edit3,
  Eye,
  Maximize2,
  Minimize2,
  Ruler,
  Download,
} from 'lucide-react';

const VALID_PAGES: AppPage[] = [
  'home',
  'editor',
  'features',
  'styles',
  'papers',
  'tools',
  'faq',
];

const VALID_POLICY_TABS: PolicyTab[] = [
  'about',
  'contact',
  'privacy',
  'terms',
  'copyright',
];

function parseHashRoute(): {
  page: AppPage;
  toolSlug: ToolSlug | null;
  policyTab: PolicyTab | null;
} {
  try {
    const raw = window.location.hash.replace(/^#\/?/, '').trim();
    if (!raw) return { page: 'home', toolSlug: null, policyTab: null };

    if ((VALID_POLICY_TABS as string[]).includes(raw)) {
      return {
        page: 'home',
        toolSlug: null,
        policyTab: raw as PolicyTab,
      };
    }

    if (raw.startsWith('tools/')) {
      const slug = raw.slice('tools/'.length) as ToolSlug;
      const exists = TOOLS_CATALOG.some((t) => t.slug === slug);
      return { page: 'tools', toolSlug: exists ? slug : null, policyTab: null };
    }

    if ((VALID_PAGES as string[]).includes(raw)) {
      return { page: raw as AppPage, toolSlug: null, policyTab: null };
    }
  } catch {
    // Ignore hash parsing restrictions
  }
  return { page: 'home', toolSlug: null, policyTab: null };
}

export default function App() {
  // Creamy Light 3D Studio canvas
  const theme: 'light' = 'light';

  // Multi-page navigation synced with URL hash
  const initialRoute = useMemo(() => parseHashRoute(), []);
  const [currentPage, setCurrentPage] = useState<AppPage>(initialRoute.page);
  const [selectedToolSlug, setSelectedToolSlug] = useState<ToolSlug | null>(
    initialRoute.toolSlug
  );

  // Main editor states with automatic local draft restoration
  const [rawText, setRawText] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('hh_ai_draft_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.rawText === 'string') return parsed.rawText;
      }
    } catch {
      // Ignore storage failures
    }
    return ASSIGNMENT_PRESETS[0].content;
  });
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [settings, setSettings] = useState<PageSettings>(() => {
    try {
      const saved = localStorage.getItem('hh_ai_draft_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.settings && typeof parsed.settings === 'object') {
          return { ...DEFAULT_PAGE_SETTINGS, ...parsed.settings };
        }
      }
    } catch {
      // Ignore storage failures
    }
    return DEFAULT_PAGE_SETTINGS;
  });
  const [headerInfo, setHeaderInfo] = useState<StudentHeaderInfo>(() => {
    try {
      const saved = localStorage.getItem('hh_ai_draft_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.headerInfo && typeof parsed.headerInfo === 'object') {
          return { ...DEFAULT_STUDENT_HEADER, ...parsed.headerInfo };
        }
      }
    } catch {
      // Ignore storage failures
    }
    return DEFAULT_STUDENT_HEADER;
  });
  const [customFonts, setCustomFonts] = useState<HandwritingFont[]>([]);
  const [diagrams, setDiagrams] = useState<DiagramElement[]>([]);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

  // View state inside editor: split/full-width on desktop, editor/preview tab on mobile
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor');
  const [isPaperExpanded, setIsPaperExpanded] = useState<boolean>(false);

  useEffect(() => {
    document.documentElement.classList.add('light');
    document.documentElement.classList.remove('dark');
  }, []);

  // Auto-save active draft & formatting locally so work survives reloads
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(
          'hh_ai_draft_v1',
          JSON.stringify({ rawText, settings, headerInfo })
        );
        setLastSavedAt(
          new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })
        );
      } catch {
        // Ignore storage quota errors
      }
    }, 450);
    return () => clearTimeout(timer);
  }, [rawText, settings, headerInfo]);

  // Sync URL hash <-> navigation
  const navigateTo = useCallback(
    (page: AppPage, toolSlug: ToolSlug | null = null) => {
      setPolicyModalType(null);
      setCurrentPage(page);
      setSelectedToolSlug(toolSlug);
      try {
        const nextHash =
          page === 'tools' && toolSlug ? `#tools/${toolSlug}` : `#${page}`;
        if (window.location.hash !== nextHash) {
          window.history.pushState(null, '', nextHash);
        }
      } catch {
        // Ignore history restrictions in sandboxed environments
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    []
  );

  useEffect(() => {
    const handleHashChange = () => {
      const parsed = parseHashRoute();
      if (parsed.policyTab) {
        setPolicyModalType(parsed.policyTab);
      } else {
        setPolicyModalType(null);
        setCurrentPage(parsed.page);
        setSelectedToolSlug(parsed.toolSlug);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Modals
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState<boolean>(false);
  const [isBuyCoffeeOpen, setIsBuyCoffeeOpen] = useState<boolean>(false);
  const [isDiagramModalOpen, setIsDiagramModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isPaperGalleryOpen, setIsPaperGalleryOpen] = useState<boolean>(false);
  const [policyModalType, setPolicyModalType] = useState<PolicyTab | null>(
    initialRoute.policyTab
  );

  const openPolicy = useCallback((type: PolicyTab) => {
    setPolicyModalType(type);
    try {
      window.history.pushState(null, '', `#${type}`);
    } catch {
      // Ignore history restrictions
    }
  }, []);

  const closePolicy = useCallback(() => {
    setPolicyModalType(null);
    try {
      const cleanHash = `#${currentPage}`;
      if ((VALID_POLICY_TABS as string[]).includes(window.location.hash.replace(/^#\/?/, ''))) {
        window.history.pushState(null, '', cleanHash);
      }
    } catch {
      // Ignore history restrictions
    }
  }, [currentPage]);

  // Paper DOM reference
  const paperRef = useRef<HTMLDivElement | null>(null);

  // Compute pages from raw text
  const pages = useMemo(() => {
    return parsePagesFromText(rawText);
  }, [rawText]);

  const safePageIndex = Math.min(currentPageIndex, Math.max(0, pages.length - 1));
  const currentPageText = pages[safePageIndex] || '';

  // Active font CSS family
  const activeFontFamilyCss = useMemo(() => {
    const customMatch = customFonts.find((f) => f.id === settings.fontId);
    if (customMatch) {
      return customMatch.fontFamily;
    }
    const builtInMatch = BUILT_IN_FONTS.find((f) => f.id === settings.fontId);
    return builtInMatch ? builtInMatch.fontFamily : "'Kalam', cursive";
  }, [settings.fontId, customFonts]);

  // Toast notification state
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  const showToast = (
    message: string,
    type: 'success' | 'error' | 'info' = 'info'
  ) => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 3200);
  };

  // Custom font file upload
  const handleCustomFontUpload = async (file: File) => {
    try {
      const loaded = await loadCustomFontFile(file);
      const newFont: HandwritingFont = {
        id: loaded.fontId,
        name: loaded.fontName,
        fontFamily: loaded.fontFamily,
        category: 'neat',
        isCustom: true,
      };
      setCustomFonts((prev) => [newFont, ...prev]);
      setSettings((prev) => ({
        ...prev,
        fontId: loaded.fontId,
        customFontFamily: loaded.fontFamily,
      }));
      showToast(`Font "${file.name}" loaded successfully!`, 'success');
    } catch (err) {
      console.error('Failed to load custom font:', err);
      showToast(
        'Could not parse font file. Please upload a valid .ttf, .otf, or .woff file.',
        'error'
      );
    }
  };

  // Apply setup from Homepage interactive preview
  const handleStartWithSetup = (
    text: string,
    fontId: string,
    paperType: PaperType,
    inkColor: string
  ) => {
    const paperDef = PAPER_DEFINITIONS_MAP[paperType];
    if (text.trim()) {
      setRawText(text);
    }
    setCurrentPageIndex(0);
    setSettings((prev) => ({
      ...prev,
      fontId,
      paperType,
      inkColor,
      ...(paperDef
        ? {
            marginLineColor: paperDef.marginColor,
            lineHeight: paperDef.recommendedLineHeight,
            topMargin: paperDef.recommendedTopMargin,
          }
        : {}),
    }));
    navigateTo('editor');
    showToast('Loaded your setup into the Handwriting Editor!', 'success');
  };

  // Apply style selected from Styles Gallery
  const handleSelectStyleFromGallery = (fontId: string) => {
    const customMatch = customFonts.find((f) => f.id === fontId);
    setSettings((prev) => ({
      ...prev,
      fontId,
      customFontFamily: customMatch ? customMatch.fontFamily : prev.customFontFamily,
    }));
    navigateTo('editor');
    const fontName =
      customMatch?.name ||
      BUILT_IN_FONTS.find((f) => f.id === fontId)?.name ||
      fontId;
    showToast(`Applied handwriting style: ${fontName}`, 'success');
  };

  // Apply paper selected from Paper Templates Gallery or Modal
  const handleSelectPaper = (
    newPaperId: PaperType,
    recSettings?: Partial<PageSettings>,
    switchToEditor = false
  ) => {
    const def = PAPER_DEFINITIONS_MAP[newPaperId];
    setSettings((prev) => ({
      ...prev,
      paperType: newPaperId,
      ...(def
        ? {
            marginLineColor: def.marginColor,
            lineHeight: def.recommendedLineHeight,
            topMargin: def.recommendedTopMargin,
          }
        : {}),
      ...(recSettings || {}),
    }));
    if (switchToEditor) {
      navigateTo('editor');
    }
    showToast(`Applied ${def ? def.name : newPaperId}!`, 'success');
  };

  // Launch an active Tool preset directly inside the Editor
  const handleOpenToolInEditor = (tool: ToolDefinition, customText?: string) => {
    const nextText = customText?.trim() ? customText : tool.sampleText;
    const presetPaper = tool.presetSettings.paperType;
    const def = presetPaper ? PAPER_DEFINITIONS_MAP[presetPaper] : undefined;

    setRawText(nextText);
    setCurrentPageIndex(0);
    setSettings((prev) => ({
      ...prev,
      ...(def
        ? {
            marginLineColor: def.marginColor,
            lineHeight: def.recommendedLineHeight,
            topMargin: def.recommendedTopMargin,
          }
        : {}),
      ...tool.presetSettings,
    }));
    navigateTo('editor');
    showToast(`Opened "${tool.title}" setup in editor`, 'success');
  };

  // Apply preset
  const handleApplyPreset = (preset: AssignmentPreset) => {
    setRawText(preset.content);
    setCurrentPageIndex(0);
    setSettings((prev) => ({
      ...prev,
      fontId: preset.recommendedFont,
      inkColor: preset.recommendedInk,
      paperType: preset.recommendedPaper,
    }));
    setHeaderInfo((prev) => ({
      ...prev,
      subject: preset.subject,
    }));
    showToast(`Loaded preset: ${preset.title}`, 'info');
  };

  // Page manipulation
  const handleAddPage = () => {
    const res = addNewPageToEnd(rawText);
    setRawText(res.newRawText);
    setCurrentPageIndex(res.newPageIndex);
    showToast(`Page ${res.newPageIndex + 1} added!`, 'success');
  };

  const handleDeleteCurrentPage = () => {
    if (pages.length <= 1) {
      setRawText('');
      showToast('Document cleared', 'info');
      return;
    }
    const res = deletePageAtIndex(rawText, safePageIndex);
    setRawText(res.newRawText);
    setCurrentPageIndex(res.newPageIndex);
    showToast(`Deleted page ${safePageIndex + 1}`, 'info');
  };

  const handleAutoSplitPages = () => {
    const splitText = autoSplitLongText(rawText, settings);
    setRawText(splitText);
    const newPages = parsePagesFromText(splitText);
    showToast(`Document divided into ${newPages.length} pages!`, 'success');
  };

  const handleClearText = () => {
    setRawText('');
    setCurrentPageIndex(0);
    showToast('Text cleared', 'info');
  };

  const handleGenerateHandwriting = () => {
    setMobileTab('preview');
    showToast(
      `Handwriting preview updated (${pages.length} ${
        pages.length === 1 ? 'page' : 'pages'
      })`,
      'success'
    );
  };

  // Diagrams handlers
  const handleAddDiagram = (newDiagram: DiagramElement) => {
    setDiagrams((prev) => [...prev, newDiagram]);
    showToast('Diagram added to paper!', 'success');
  };

  const handleUpdateDiagram = (updated: DiagramElement) => {
    setDiagrams((prev) =>
      prev.map((d) => (d.id === updated.id ? updated : d))
    );
  };

  const handleDeleteDiagram = (id: string) => {
    setDiagrams((prev) => prev.filter((d) => d.id !== id));
    showToast('Diagram removed', 'info');
  };

  // PDF & PNG export
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<ExportProgress | null>(
    null
  );

  const handleDirectDownloadPdf = async () => {
    try {
      setIsExporting(true);
      const safePages = pages && pages.length > 0 ? pages : [''];
      setExportProgress({
        currentPage: 1,
        totalPages: safePages.length,
        status: 'Starting authentic handwritten PDF export...',
      });

      await downloadAssignmentAsPdf({
        pages: safePages,
        settings,
        fontFamilyCss: activeFontFamilyCss,
        diagrams,
        headerInfo,
        filename: 'Human_Handwriting_Document.pdf',
        onProgress: (p) => setExportProgress(p),
      });

      showToast(
        `All ${safePages.length} pages downloaded as PDF successfully!`,
        'success'
      );
    } catch (err: unknown) {
      console.error('PDF export failed:', err);
      showToast('Failed to export PDF. Please try again.', 'error');
    } finally {
      setIsExporting(false);
      setExportProgress(null);
    }
  };

  const handleDirectDownloadImage = async () => {
    try {
      setIsExporting(true);
      const safePages = pages && pages.length > 0 ? pages : [''];
      await downloadAssignmentSinglePage({
        pages: safePages,
        pageIndex: safePageIndex,
        settings,
        fontFamilyCss: activeFontFamilyCss,
        diagrams,
        headerInfo,
        filename: `Handwritten_Page_${safePageIndex + 1}.png`,
      });
      showToast(`Page ${safePageIndex + 1} PNG downloaded!`, 'success');
    } catch (err: unknown) {
      console.error('Image export failed:', err);
      showToast('Failed to export image. Please try again.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  // Keyboard shortcuts: Ctrl+S / Cmd+S exports PDF inside editor, Escape closes any open dialog
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsDiagramModalOpen(false);
        setIsHowItWorksOpen(false);
        setIsBuyCoffeeOpen(false);
        setIsExportModalOpen(false);
        setIsPaperGalleryOpen(false);
        setPolicyModalType(null);
        return;
      }

      if (
        currentPage === 'editor' &&
        (e.ctrlKey || e.metaKey) &&
        e.key.toLowerCase() === 's'
      ) {
        e.preventDefault();
        handleDirectDownloadPdf();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [currentPage, pages, settings, activeFontFamilyCss, diagrams, headerInfo]);

  const handleResetWorkspaceDraft = () => {
    setRawText(ASSIGNMENT_PRESETS[0].content);
    setSettings(DEFAULT_PAGE_SETTINGS);
    setHeaderInfo(DEFAULT_STUDENT_HEADER);
    setDiagrams([]);
    setCurrentPageIndex(0);
    try {
      localStorage.removeItem('hh_ai_draft_v1');
    } catch {
      // Ignore
    }
    showToast('Reset draft to default settings', 'info');
  };

  const toggleMarginGuides = () => {
    setSettings((prev) => {
      const nextValue = !prev.showMarginGuides;
      showToast(
        nextValue
          ? 'Margin guides shown on paper preview'
          : 'Margin guides hidden',
        'info'
      );
      return { ...prev, showMarginGuides: nextValue };
    });
  };

  return (
    <div
      className={`min-h-screen relative flex flex-col font-sans bg-[#F5EEE0] text-[#1E1B18] selection:bg-amber-600/20 selection:text-[#1E1B18] ${
        currentPage === 'editor' ? 'pb-16 lg:pb-0' : ''
      }`}
    >
      {/* Animated Catchy 3D Background Canvas */}
      <Background3DScene />

      <div className="relative z-10 flex-1 flex flex-col">
        {/* Keyboard Accessibility Skip Link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:rounded-xl focus:bg-[#24201C] focus:text-[#FFFDF8] focus:text-xs focus:font-bold focus:shadow-lg"
        >
          Skip to main content
        </a>

        {/* Top SaaS Navigation Bar (No Dark Mode Toggle, No Pricing Link) */}
        <Navbar
          currentPage={currentPage}
          onNavigate={(page) => navigateTo(page, null)}
        />

      {/* Page Router Outlet */}
      <main id="main-content" className="flex-1 flex flex-col">
        {/* Clean Non-Blocking Top Banner */}
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-3 pb-1">
          <AdBannerSlot
            variant="top"
            slotId="banner-top-slot"
            onOpenBuyCoffee={() => setIsBuyCoffeeOpen(true)}
          />
        </div>

        {currentPage === 'home' && (
          <HomeView
            onNavigate={(page) => navigateTo(page, null)}
            onStartWithSetup={handleStartWithSetup}
            onOpenBuyCoffee={() => setIsBuyCoffeeOpen(true)}
          />
        )}

        {currentPage === 'features' && (
          <FeaturesView
            theme={theme}
            onNavigate={(page) => navigateTo(page, null)}
          />
        )}

        {currentPage === 'styles' && (
          <StylesGalleryView
            theme={theme}
            activeFontId={settings.fontId}
            customFonts={customFonts}
            onSelectStyle={handleSelectStyleFromGallery}
            onUploadCustomFont={handleCustomFontUpload}
          />
        )}

        {currentPage === 'papers' && (
          <PaperTemplatesView
            theme={theme}
            activePaper={settings.paperType}
            onSelectPaper={(paperId, rec) => handleSelectPaper(paperId, rec, true)}
          />
        )}

        {currentPage === 'tools' && (
          <ToolsView
            theme={theme}
            selectedToolSlug={selectedToolSlug}
            onSelectTool={(slug) => navigateTo('tools', slug)}
            onOpenToolInEditor={handleOpenToolInEditor}
            onNavigate={(page) => navigateTo(page, null)}
          />
        )}

        {currentPage === 'faq' && (
          <FaqView
            theme={theme}
            onNavigate={(page) => navigateTo(page, null)}
            onOpenPolicy={openPolicy}
            onOpenBuyCoffee={() => setIsBuyCoffeeOpen(true)}
          />
        )}

        {/* Distraction-Free Handwriting Editor Workspace */}
        {currentPage === 'editor' && (
          <div className="flex-1 flex flex-col">
            {/* Mobile Top Segmented Switcher */}
            <div className="flex lg:hidden px-3 py-2.5 border-b border-[#DDD2BC] bg-[#FAF4E8]/95 gap-2 shrink-0">
              <div className="w-full grid grid-cols-2 p-1 rounded-xl border border-[#D7CCB5] bg-[#FFFDF8]">
                <button
                  type="button"
                  onClick={() => setMobileTab('editor')}
                  className={`min-h-[40px] px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                    mobileTab === 'editor'
                      ? 'bg-[#24201C] text-[#FFFDF8] font-bold shadow-xs'
                      : 'text-[#5C5347] hover:text-[#1E1B18]'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Write &amp; Settings</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMobileTab('preview')}
                  className={`min-h-[40px] px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                    mobileTab === 'preview'
                      ? 'bg-[#24201C] text-[#FFFDF8] font-bold shadow-xs'
                      : 'text-[#5C5347] hover:text-[#1E1B18]'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Paper Preview ({pages.length})</span>
                </button>
              </div>
            </div>

            {/* Split Editor Layout */}
            <div
              id="workbench"
              className="flex-1 flex flex-col lg:flex-row min-h-[700px] lg:min-h-[820px]"
            >
              {/* Left Side: Input & Settings */}
              <section
                className={`w-full lg:w-[460px] xl:w-[500px] 2xl:w-[540px] shrink-0 border-r border-[#DDD2BC] bg-[#F5EEE0]/95 flex flex-col ${
                  isPaperExpanded
                    ? 'hidden'
                    : mobileTab === 'editor'
                    ? 'flex'
                    : 'hidden lg:flex'
                }`}
              >
                <UnifiedControlsPanel
                  theme={theme}
                  rawText={rawText}
                  currentPageIndex={safePageIndex}
                  totalPages={pages.length}
                  settings={settings}
                  onUpdateSettings={(newSettings) =>
                    setSettings((prev) => ({ ...prev, ...newSettings }))
                  }
                  headerInfo={headerInfo}
                  onUpdateHeader={(newHeader) =>
                    setHeaderInfo((prev) => ({ ...prev, ...newHeader }))
                  }
                  customFonts={customFonts}
                  onCustomFontUpload={handleCustomFontUpload}
                  diagrams={diagrams}
                  onOpenDiagramModal={() => setIsDiagramModalOpen(true)}
                  onDeleteDiagram={handleDeleteDiagram}
                  onChangeText={setRawText}
                  onApplyPreset={handleApplyPreset}
                  onInsertPageBreak={handleAddPage}
                  onAutoSplitPages={handleAutoSplitPages}
                  onClearText={handleClearText}
                  onDownloadPdf={handleDirectDownloadPdf}
                  onDownloadImage={handleDirectDownloadImage}
                  isExporting={isExporting}
                  exportProgress={exportProgress}
                  onNotify={showToast}
                  onSwitchToPreviewMobile={() => setMobileTab('preview')}
                  onGenerateHandwriting={handleGenerateHandwriting}
                  onOpenPaperGallery={() => setIsPaperGalleryOpen(true)}
                  onOpenStylesGallery={() => navigateTo('styles')}
                  onOpenBuyCoffee={() => setIsBuyCoffeeOpen(true)}
                />
              </section>

              {/* Right Side: Large Live Handwritten Paper Preview */}
              <section
                className={`flex-1 min-w-0 flex flex-col min-h-0 p-3 sm:p-5 gap-3 bg-[#EDE4D2]/85 ${
                  mobileTab === 'preview' ? 'flex' : 'hidden lg:flex'
                }`}
              >
                {/* Top Paper Header Strip */}
                <div className="flex items-center justify-between gap-3 border border-[#DDD2BC] bg-[#FFFDF8] text-[#1E1B18] rounded-2xl px-4 py-2.5 text-xs flex-wrap shadow-2xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-[#1E1B18]">Live Paper Output</span>
                    <span aria-hidden="true" className="opacity-40">
                      ·
                    </span>
                    <span className="text-[#9A4319] font-semibold tabular-nums">
                      Page {safePageIndex + 1} of {pages.length}
                    </span>
                    {lastSavedAt && (
                      <>
                        <span
                          aria-hidden="true"
                          className="opacity-40 hidden sm:inline"
                        >
                          ·
                        </span>
                        <span className="text-[11px] text-[#6E655A] hidden sm:inline tabular-nums">
                          Saved locally ({lastSavedAt})
                        </span>
                      </>
                    )}
                    {settings.showMarginGuides && (
                      <>
                        <span
                          aria-hidden="true"
                          className="opacity-40 hidden sm:inline"
                        >
                          ·
                        </span>
                        <span className="text-[11px] text-[#9A4319] font-semibold hidden sm:inline">
                          Margin Guides On
                        </span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleResetWorkspaceDraft}
                      className="cursor-pointer px-2.5 py-1.5 rounded-xl border border-[#D7CCB5] bg-[#FAF4E8] hover:bg-[#EFE5D3] text-[#1E1B18] text-xs font-medium transition-colors"
                      title="Restore default sample draft & settings"
                    >
                      Reset Draft
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsPaperExpanded(!isPaperExpanded)}
                      className="cursor-pointer hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#D7CCB5] bg-[#FAF4E8] hover:bg-[#EFE5D3] text-[#1E1B18] text-xs font-medium transition-colors"
                      title={
                        isPaperExpanded
                          ? 'Restore Split View'
                          : 'Maximize Paper to Full View'
                      }
                    >
                      {isPaperExpanded ? (
                        <>
                          <Minimize2 className="w-3.5 h-3.5" />
                          <span>Split View</span>
                        </>
                      ) : (
                        <>
                          <Maximize2 className="w-3.5 h-3.5" />
                          <span>Full Width</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Paper Preview Canvas */}
                <div className="flex-1 min-h-[580px] lg:min-h-[660px] relative">
                  <PaperPreview
                    theme={theme}
                    pageIndex={safePageIndex}
                    totalPages={pages.length}
                    pageText={currentPageText}
                    settings={settings}
                    headerInfo={headerInfo}
                    diagrams={diagrams}
                    fontFamilyCss={activeFontFamilyCss}
                    onPageChange={setCurrentPageIndex}
                    onAddPage={handleAddPage}
                    onDeletePage={handleDeleteCurrentPage}
                    onAutoSplitPages={handleAutoSplitPages}
                    onUpdateDiagram={handleUpdateDiagram}
                    onDeleteDiagram={handleDeleteDiagram}
                    paperRef={paperRef}
                    onUpdateFontSize={(newFontSize) =>
                      setSettings((prev) => ({ ...prev, fontSize: newFontSize }))
                    }
                    onDownloadPdf={handleDirectDownloadPdf}
                    onDownloadImage={handleDirectDownloadImage}
                    onOpenPaperGallery={() => setIsPaperGalleryOpen(true)}
                    onToggleMarginGuides={toggleMarginGuides}
                  />
                </div>

                {/* Clean Multi-page Navigation Bar */}
                {pages.length > 1 && (
                  <div className="rounded-xl border border-[#DDD2BC] bg-[#FFFDF8] p-2 flex items-center justify-center gap-2 select-none">
                    <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 font-mono-code scrollbar-thin">
                      {pages.map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setCurrentPageIndex(idx)}
                          className={`cursor-pointer px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 ${
                            idx === safePageIndex
                              ? 'bg-[#24201C] text-[#FFFDF8] shadow-xs'
                              : 'bg-[#FAF4E8] text-[#4A433A] hover:bg-[#EFE5D3] border border-[#D7CCB5]'
                          }`}
                          title={`Switch to Page ${idx + 1}`}
                        >
                          <span>PAGE {idx + 1}</span>
                          {diagrams.some((d) => d.pageIndex === idx) && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#9A4319]" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            </div>

            {/* Brief "How to Use" Guide Section below the main studio interface */}
            <section
              aria-labelledby="studio-how-to-use-heading"
              className="border-t border-[#DDD2BC] bg-[#FAF4E8]/92 text-[#1E1B18]"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div className="space-y-1">
                    <h2
                      id="studio-how-to-use-heading"
                      className="text-lg sm:text-xl font-extrabold tracking-tight text-[#1E1B18]"
                    >
                      How to Use the Handwriting Studio
                    </h2>
                    <p className="text-xs sm:text-sm text-[#4A433A] max-w-2xl">
                      Turn digital notes, assignments, or study sheets into realistic handwritten pages in four quick steps—everything renders privately inside your browser.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setIsHowItWorksOpen(true)}
                      className="cursor-pointer px-3.5 py-2 rounded-xl border border-[#D7CCB5] bg-[#FFFDF8] hover:bg-[#EFE5D3] text-[#1E1B18] text-xs font-semibold transition-colors"
                    >
                      Read Origin &amp; Tech Specs
                    </button>
                    <button
                      type="button"
                      onClick={() => navigateTo('styles', null)}
                      className="cursor-pointer px-3.5 py-2 rounded-xl border border-[#E2C2A8] bg-[#F6EBE0] hover:bg-[#EDD9C5] text-[#8F3D15] text-xs font-semibold transition-colors"
                    >
                      Compare All 19 Scripts
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="rounded-2xl border border-[#DDD2BC] bg-[#FFFDF8] p-4 space-y-1.5">
                    <span className="text-xs font-mono-code font-bold text-[#9A4319]">01</span>
                    <h3 className="text-sm font-bold text-[#1E1B18]">Write or Import Text</h3>
                    <p className="text-xs text-[#4A433A] leading-relaxed">
                      Type or paste draft notes in the left panel, or drop a .txt/.md file. Insert <code className="font-mono-code text-[#9A4319]">---page---</code> anywhere for a manual page break.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#DDD2BC] bg-[#FFFDF8] p-4 space-y-1.5">
                    <span className="text-xs font-mono-code font-bold text-[#9A4319]">02</span>
                    <h3 className="text-sm font-bold text-[#1E1B18]">Pick Style, Ink &amp; Paper</h3>
                    <p className="text-xs text-[#4A433A] leading-relaxed">
                      Switch handwriting scripts (or load your own .ttf/.otf font), select pen ink shade, and choose from 23 ruled, grid, Cornell, or cream templates.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#DDD2BC] bg-[#FFFDF8] p-4 space-y-1.5">
                    <span className="text-xs font-mono-code font-bold text-[#9A4319]">03</span>
                    <h3 className="text-sm font-bold text-[#1E1B18]">Align Guides &amp; Sketches</h3>
                    <p className="text-xs text-[#4A433A] leading-relaxed">
                      Toggle Margin Guides for hairline alignment markers on screen, adjust font size or line height, and drop hand-drawn sketches right onto any sheet.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#DDD2BC] bg-[#FFFDF8] p-4 space-y-1.5">
                    <span className="text-xs font-mono-code font-bold text-[#9A4319]">04</span>
                    <h3 className="text-sm font-bold text-[#1E1B18]">Export Print-Ready PDF</h3>
                    <p className="text-xs text-[#4A433A] leading-relaxed">
                      Press Download PDF (or <code className="font-mono-code text-[#9A4319]">Ctrl/Cmd + S</code>) to save a high-DPI multi-page A4 document or export individual PNG pages cleanly.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Single Clean Above-Footer Banner Slot */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4">
        <AdBannerSlot
          variant="horizontal"
          slotId="banner-above-footer-slot"
          onOpenBuyCoffee={() => setIsBuyCoffeeOpen(true)}
        />
      </div>

      {/* Quiet Unified Footer */}
      <Footer
        onNavigate={(page) => navigateTo(page, null)}
        onOpenPolicy={openPolicy}
        onOpenBuyCoffee={() => setIsBuyCoffeeOpen(true)}
      />
      </div>

      {/* Floating Quick Action Dock (Active & Creamy Light across every page) */}
      <FloatingActions
        currentPage={currentPage}
        totalPages={pages.length}
        fontSize={settings.fontSize}
        showMarginGuides={Boolean(settings.showMarginGuides)}
        onNavigate={(page) => navigateTo(page, null)}
        onOpenExport={() => setIsExportModalOpen(true)}
        onOpenBuyCoffee={() => setIsBuyCoffeeOpen(true)}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        onOpenPolicy={openPolicy}
        onAddPage={handleAddPage}
        onUpdateFontSize={(newFontSize) =>
          setSettings((prev) => ({ ...prev, fontSize: newFontSize }))
        }
        onToggleMarginGuides={toggleMarginGuides}
      />

      {/* Modals */}
      <DiagramModal
        isOpen={isDiagramModalOpen}
        onClose={() => setIsDiagramModalOpen(false)}
        currentPageIndex={safePageIndex}
        onAddDiagram={handleAddDiagram}
      />

      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
      />

      <BuyCoffeeModal
        isOpen={isBuyCoffeeOpen}
        onClose={() => setIsBuyCoffeeOpen(false)}
      />

      <ExportModal
        theme={theme}
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        currentPageIndex={safePageIndex}
        totalPages={pages.length}
        paperRef={paperRef}
        pages={pages}
        settings={settings}
        fontFamilyCss={activeFontFamilyCss}
        diagrams={diagrams}
        headerInfo={headerInfo}
      />

      <PolicyModal
        isOpen={policyModalType !== null}
        onClose={closePolicy}
        type={policyModalType || 'about'}
        onClearLocalData={handleResetWorkspaceDraft}
      />

      <PaperGalleryModal
        isOpen={isPaperGalleryOpen}
        onClose={() => setIsPaperGalleryOpen(false)}
        currentPaper={settings.paperType}
        theme={theme}
        onSelectPaper={(newPaperId, recSettings) =>
          handleSelectPaper(newPaperId, recSettings, false)
        }
      />

      {/* Mobile Thumb-Zone Bottom Bar (Rendered only inside Editor on small viewports) */}
      {currentPage === 'editor' && (
        <nav
          aria-label="Mobile editor quick navigation"
          className="lg:hidden fixed bottom-0 left-0 right-0 z-40 h-[60px] px-2 border-t border-[#DDD2BC] bg-[#FFFDF8]/96 text-[#5C5347] grid grid-cols-4 items-center gap-1"
        >
          <button
            type="button"
            onClick={() => setMobileTab('editor')}
            className={`min-h-[44px] flex flex-col items-center justify-center rounded-xl transition-colors cursor-pointer ${
              mobileTab === 'editor'
                ? 'text-[#9A4319] font-semibold'
                : 'opacity-75 hover:opacity-100'
            }`}
          >
            <Edit3 className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 leading-none">Write</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileTab('preview')}
            className={`min-h-[44px] flex flex-col items-center justify-center rounded-xl transition-colors cursor-pointer ${
              mobileTab === 'preview'
                ? 'text-[#9A4319] font-semibold'
                : 'opacity-75 hover:opacity-100'
            }`}
          >
            <Eye className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 leading-none">
              Paper ({pages.length})
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              toggleMarginGuides();
              if (mobileTab !== 'preview') {
                setMobileTab('preview');
              }
            }}
            aria-pressed={settings.showMarginGuides}
            className={`min-h-[44px] flex flex-col items-center justify-center rounded-xl transition-colors cursor-pointer ${
              settings.showMarginGuides
                ? 'text-[#9A4319] font-semibold'
                : 'opacity-75 hover:opacity-100'
            }`}
          >
            <Ruler className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 leading-none">Guides</span>
          </button>

          <button
            type="button"
            onClick={handleDirectDownloadPdf}
            disabled={isExporting}
            className="min-h-[44px] mx-1 rounded-xl bg-[#24201C] hover:bg-[#38322C] disabled:opacity-50 text-[#FFFDF8] flex flex-col items-center justify-center transition-colors cursor-pointer active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span className="text-[10px] font-bold mt-0.5 leading-none">
              {isExporting ? 'Saving...' : 'PDF'}
            </span>
          </button>
        </nav>
      )}

      {/* Floating System Toast */}
      {toast && (
        <div
          className={`fixed right-4 lg:right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xl border bg-[#24201C] border-[#3D352E] text-[#FFFDF8] ${
            currentPage === 'editor' ? 'bottom-20 lg:bottom-6' : 'bottom-6'
          }`}
        >
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}