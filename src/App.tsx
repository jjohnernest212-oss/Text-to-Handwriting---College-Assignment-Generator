/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
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
import PolicyModal from './components/PolicyModal';
import PaperGalleryModal from './components/PaperGalleryModal';
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

function parseHashRoute(): { page: AppPage; toolSlug: ToolSlug | null } {
  try {
    const raw = window.location.hash.replace(/^#\/?/, '').trim();
    if (!raw) return { page: 'home', toolSlug: null };

    if (raw.startsWith('tools/')) {
      const slug = raw.slice('tools/'.length) as ToolSlug;
      const exists = TOOLS_CATALOG.some((t) => t.slug === slug);
      return { page: 'tools', toolSlug: exists ? slug : null };
    }

    if ((VALID_PAGES as string[]).includes(raw)) {
      return { page: raw as AppPage, toolSlug: null };
    }
  } catch {
    // Ignore hash parsing restrictions
  }
  return { page: 'home', toolSlug: null };
}

export default function App() {
  // Always crisp warm light editorial canvas (no dark mode toggle)
  const theme: 'light' = 'light';

  // Multi-page navigation synced with URL hash
  const initialRoute = useMemo(() => parseHashRoute(), []);
  const [currentPage, setCurrentPage] = useState<AppPage>(initialRoute.page);
  const [selectedToolSlug, setSelectedToolSlug] = useState<ToolSlug | null>(
    initialRoute.toolSlug
  );

  // Main editor states
  const [rawText, setRawText] = useState<string>(ASSIGNMENT_PRESETS[0].content);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [settings, setSettings] = useState<PageSettings>(DEFAULT_PAGE_SETTINGS);
  const [headerInfo, setHeaderInfo] = useState<StudentHeaderInfo>(
    DEFAULT_STUDENT_HEADER
  );
  const [customFonts, setCustomFonts] = useState<HandwritingFont[]>([]);
  const [diagrams, setDiagrams] = useState<DiagramElement[]>([]);

  // View state inside editor: split/full-width on desktop, editor/preview tab on mobile
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor');
  const [isPaperExpanded, setIsPaperExpanded] = useState<boolean>(false);

  useEffect(() => {
    document.documentElement.classList.add('light');
    document.documentElement.classList.remove('dark');
  }, []);

  // Sync URL hash <-> navigation
  const navigateTo = useCallback(
    (page: AppPage, toolSlug: ToolSlug | null = null) => {
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
      setCurrentPage(parsed.page);
      setSelectedToolSlug(parsed.toolSlug);
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
  const [policyModalType, setPolicyModalType] = useState<'privacy' | 'terms' | null>(
    null
  );

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

  // Keyboard shortcut: Ctrl+S / Cmd+S inside editor downloads PDF
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
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
      className={`min-h-screen flex flex-col font-sans bg-[#faf7f0] text-[#18181b] selection:bg-[#a68426]/20 selection:text-[#18181b] ${
        currentPage === 'editor' ? 'pb-16 lg:pb-0' : ''
      }`}
    >
      {/* Top SaaS Navigation Bar (No Dark Mode Toggle, No Pricing Link) */}
      <Navbar
        currentPage={currentPage}
        onNavigate={(page) => navigateTo(page, null)}
      />

      {/* Page Router Outlet */}
      <main className="flex-1 flex flex-col">
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
            onOpenPolicy={(type) => setPolicyModalType(type)}
            onOpenBuyCoffee={() => setIsBuyCoffeeOpen(true)}
          />
        )}

        {/* Distraction-Free Handwriting Editor Workspace */}
        {currentPage === 'editor' && (
          <div className="flex-1 flex flex-col">
            {/* Mobile Top Segmented Switcher */}
            <div className="flex lg:hidden px-3 py-2.5 border-b border-[#e5dfd2] bg-[#f4efe6] gap-2 shrink-0">
              <div className="w-full grid grid-cols-2 p-1 rounded-xl border border-[#e2ddd0] bg-white">
                <button
                  type="button"
                  onClick={() => setMobileTab('editor')}
                  className={`min-h-[40px] px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                    mobileTab === 'editor'
                      ? 'bg-[#18181b] text-[#faf7f0] shadow-xs'
                      : 'text-[#57534e] hover:text-[#18181b]'
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
                      ? 'bg-[#18181b] text-[#faf7f0] shadow-xs'
                      : 'text-[#57534e] hover:text-[#18181b]'
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
                className={`w-full lg:w-[460px] xl:w-[500px] 2xl:w-[540px] shrink-0 border-r border-[#e5dfd2] bg-white flex flex-col ${
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
                />
              </section>

              {/* Right Side: Large Live Handwritten Paper Preview */}
              <section
                className={`flex-1 min-w-0 flex flex-col min-h-0 p-3 sm:p-5 gap-3 bg-[#f3efe6] ${
                  mobileTab === 'preview' ? 'flex' : 'hidden lg:flex'
                }`}
              >
                {/* Top Paper Header Strip */}
                <div className="flex items-center justify-between gap-3 border border-[#e2ddd0] bg-white text-[#18181b] rounded-2xl px-4 py-2.5 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Live Paper Output</span>
                    <span aria-hidden="true" className="opacity-40">
                      ·
                    </span>
                    <span className="text-[#856514] font-semibold tabular-nums">
                      Page {safePageIndex + 1} of {pages.length}
                    </span>
                    {settings.showMarginGuides && (
                      <>
                        <span
                          aria-hidden="true"
                          className="opacity-40 hidden sm:inline"
                        >
                          ·
                        </span>
                        <span className="text-[11px] text-[#57534e] hidden sm:inline">
                          Margin Guides On
                        </span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsPaperExpanded(!isPaperExpanded)}
                      className="cursor-pointer hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#e2ddd0] bg-[#faf7f0] hover:bg-[#f1eadc] text-[#44403c] text-xs font-medium transition-colors"
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
                  <div className="rounded-xl border border-[#e2ddd0] bg-white p-2 flex items-center justify-center gap-2 select-none">
                    <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 font-mono-code scrollbar-thin">
                      {pages.map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setCurrentPageIndex(idx)}
                          className={`cursor-pointer px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 ${
                            idx === safePageIndex
                              ? 'bg-[#18181b] text-[#faf7f0] shadow-xs'
                              : 'bg-[#f4efe6] text-[#44403c] hover:bg-[#eae2d3] border border-[#e2ddd0]'
                          }`}
                          title={`Switch to Page ${idx + 1}`}
                        >
                          <span>PAGE {idx + 1}</span>
                          {diagrams.some((d) => d.pageIndex === idx) && (
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            </div>
          </div>
        )}
      </main>

      {/* Quiet Unified Footer */}
      <Footer
        onNavigate={(page) => navigateTo(page, null)}
        onOpenPolicy={(type) => setPolicyModalType(type)}
        onOpenBuyCoffee={() => setIsBuyCoffeeOpen(true)}
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
        onClose={() => setPolicyModalType(null)}
        type={policyModalType || 'privacy'}
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
          className="lg:hidden fixed bottom-0 left-0 right-0 z-40 h-[60px] px-2 border-t border-[#e5dfd2] bg-white/95 text-[#44403c] backdrop-blur-md grid grid-cols-4 items-center gap-1"
        >
          <button
            type="button"
            onClick={() => setMobileTab('editor')}
            className={`min-h-[44px] flex flex-col items-center justify-center rounded-xl transition-colors cursor-pointer ${
              mobileTab === 'editor'
                ? 'text-[#18181b] font-semibold'
                : 'opacity-70 hover:opacity-100'
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
                ? 'text-[#18181b] font-semibold'
                : 'opacity-70 hover:opacity-100'
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
                ? 'text-[#856514] font-semibold'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <Ruler className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 leading-none">Guides</span>
          </button>

          <button
            type="button"
            onClick={handleDirectDownloadPdf}
            disabled={isExporting}
            className="min-h-[44px] mx-1 rounded-xl bg-[#18181b] hover:bg-[#27272a] disabled:opacity-50 text-[#faf7f0] flex flex-col items-center justify-center transition-colors cursor-pointer active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span className="text-[10px] font-semibold mt-0.5 leading-none">
              {isExporting ? 'Saving...' : 'PDF'}
            </span>
          </button>
        </nav>
      )}

      {/* Floating System Toast */}
      {toast && (
        <div
          className={`fixed right-4 lg:right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium shadow-xl border bg-[#18181b] border-black/15 text-[#faf7f0] ${
            currentPage === 'editor' ? 'bottom-20 lg:bottom-6' : 'bottom-6'
          }`}
        >
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}