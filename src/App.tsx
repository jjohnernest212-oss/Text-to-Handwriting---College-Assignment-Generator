/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useMemo } from 'react';
import Header from './components/Header';
import TextInputPanel from './components/TextInputPanel';
import EditorControls from './components/EditorControls';
import PaperPreview from './components/PaperPreview';
import DiagramModal from './components/DiagramModal';
import HowItWorksModal from './components/HowItWorksModal';
import BuyCoffeeModal from './components/BuyCoffeeModal';
import ExportModal from './components/ExportModal';
import InkBlotsOverlay from './components/InkBlotsOverlay';
import MobileScanModal from './components/MobileScanModal';
import ContributorsModal from './components/ContributorsModal';
import ModernPathBar from './components/ModernPathBar';
import FloatingActions from './components/FloatingActions';
import FrontPageMarquee from './components/FrontPageMarquee';

import {
  DEFAULT_PAGE_SETTINGS,
  DEFAULT_STUDENT_HEADER,
  ASSIGNMENT_PRESETS,
  BUILT_IN_FONTS,
} from './constants';
import {
  PageSettings,
  StudentHeaderInfo,
  HandwritingFont,
  DiagramElement,
  AssignmentPreset,
} from './types';
import {
  parsePagesFromText,
  addNewPageToEnd,
  addNewPageAfter,
  deletePageAtIndex,
  autoSplitLongText,
} from './utils/paginationUtils';
import { loadCustomFontFile } from './utils/fontLoader';
import {
  BookOpen,
  Edit3,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Eye,
  Plus,
  QrCode,
} from 'lucide-react';

export default function App() {
  // Main states
  const [rawText, setRawText] = useState<string>(ASSIGNMENT_PRESETS[0].content);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [settings, setSettings] = useState<PageSettings>(DEFAULT_PAGE_SETTINGS);
  const [headerInfo, setHeaderInfo] = useState<StudentHeaderInfo>(DEFAULT_STUDENT_HEADER);
  const [customFonts, setCustomFonts] = useState<HandwritingFont[]>([]);
  const [diagrams, setDiagrams] = useState<DiagramElement[]>([]);

  // View state for mobile/tablet
  const [mobileTab, setMobileTab] = useState<'editor' | 'settings' | 'preview'>('preview');

  // Modals
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState<boolean>(false);
  const [isBuyCoffeeOpen, setIsBuyCoffeeOpen] = useState<boolean>(false);
  const [isDiagramModalOpen, setIsDiagramModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isMobileScanOpen, setIsMobileScanOpen] = useState<boolean>(false);
  const [isContributorsOpen, setIsContributorsOpen] = useState<boolean>(false);

  // Paper DOM reference
  const paperRef = useRef<HTMLDivElement | null>(null);
  const multiPageExportContainerRef = useRef<HTMLDivElement | null>(null);

  // Compute pages from raw text
  const pages = useMemo(() => {
    return parsePagesFromText(rawText);
  }, [rawText]);

  // Keep currentPageIndex in bounds
  const safePageIndex = Math.min(currentPageIndex, Math.max(0, pages.length - 1));
  const currentPageText = pages[safePageIndex] || '';

  // Determine active font CSS family
  const activeFontFamilyCss = useMemo(() => {
    const customMatch = customFonts.find((f) => f.id === settings.fontId);
    if (customMatch) {
      return customMatch.fontFamily;
    }
    const builtInMatch = BUILT_IN_FONTS.find((f) => f.id === settings.fontId);
    return builtInMatch ? builtInMatch.fontFamily : "'Kalam', cursive";
  }, [settings.fontId, customFonts]);

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 3200);
  };

  // Handle custom font file upload
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
      showToast('Could not parse font file. Please upload a valid .ttf, .otf, or .woff file.', 'error');
    }
  };

  // Handle preset application
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

  // Handle adding a new page to the assignment (unlimited pages support)
  const handleAddPage = () => {
    const res = addNewPageToEnd(rawText);
    setRawText(res.newRawText);
    setCurrentPageIndex(res.newPageIndex);
    showToast(`Added Page ${res.newPageIndex + 1} (Total: ${res.newPageIndex + 1})`, 'success');
  };

  // Handle deleting current page (if more than 1 page)
  const handleDeleteCurrentPage = () => {
    if (pages.length <= 1) {
      showToast('Assignment must have at least 1 page.', 'info');
      return;
    }
    const targetIdx = safePageIndex;
    const res = deletePageAtIndex(rawText, targetIdx);
    setRawText(res.newRawText);
    setCurrentPageIndex(res.newPageIndex);
    showToast(`Deleted page. Active page: ${res.newPageIndex + 1}`, 'info');
  };

  // Handle auto-paginating long continuous text across pages
  const handleAutoSplitPages = () => {
    const splitted = autoSplitLongText(rawText);
    const newPages = parsePagesFromText(splitted);
    setRawText(splitted);
    setCurrentPageIndex(0);
    showToast(`Auto-paginated into ${newPages.length} ${newPages.length === 1 ? 'page' : 'pages'}!`, 'success');
  };

  // Handle insert page break delimiter at end
  const handleInsertPageBreak = () => {
    handleAddPage();
  };

  // Clear text
  const handleClearText = () => {
    setRawText('');
    setCurrentPageIndex(0);
    showToast('Assignment buffer cleared.', 'info');
  };

  // Add diagram
  const handleAddDiagram = (diagram: DiagramElement) => {
    setDiagrams((prev) => [...prev, diagram]);
  };

  // Update diagram
  const handleUpdateDiagram = (updated: DiagramElement) => {
    setDiagrams((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
  };

  // Delete diagram
  const handleDeleteDiagram = (id: string) => {
    setDiagrams((prev) => prev.filter((d) => d.id !== id));
  };

  // Prepare all page elements for PDF/PNG export by bringing them into active coordinate space
  const prepareAllPagesForExport = async (): Promise<HTMLElement[]> => {
    const container = multiPageExportContainerRef.current;
    if (!container) return [];

    // Bring container to visible coordinate space (left: 0, top: 0) directly under ExportModal backdrop (z-40)
    container.style.left = '0px';
    container.style.top = '0px';
    container.style.zIndex = '40';
    container.style.pointerEvents = 'none';
    container.style.visibility = 'visible';
    container.style.opacity = '1';

    // Wait a brief tick for layout to calculate and fonts to load
    await new Promise((r) => setTimeout(r, 80));
    try {
      await document.fonts.ready;
    } catch {
      // ignore
    }

    const pageNodes = container.querySelectorAll<HTMLElement>('.export-paper-page');
    return Array.from(pageNodes);
  };

  // Cleanup after export completes
  const cleanupAfterExport = () => {
    const container = multiPageExportContainerRef.current;
    if (container) {
      container.style.left = '-9999px';
      container.style.top = '0px';
      container.style.zIndex = '-1';
      const pageNodes = container.querySelectorAll<HTMLElement>('.export-paper-page');
      pageNodes.forEach((p) => {
        p.style.display = 'block';
      });
    }
  };

  return (
    <div className="h-[100dvh] min-h-[100dvh] flex flex-col bg-[#0c0c0e] text-[#e4e4e7] overflow-hidden font-sans">
      {/* Header */}
      <Header
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        onOpenBuyCoffee={() => setIsBuyCoffeeOpen(true)}
        onOpenExport={() => setIsExportModalOpen(true)}
        onOpenMobileScan={() => setIsMobileScanOpen(true)}
        onOpenContributors={() => setIsContributorsOpen(true)}
      />

      {/* Modern Workflow Path & Pipeline Telemetry */}
      <ModernPathBar
        activeTab={mobileTab}
        onSelectTab={setMobileTab}
        totalPages={pages.length}
        currentPageIndex={safePageIndex}
        fontSize={settings.fontSize}
        paperType={settings.paperType}
        onOpenExport={() => setIsExportModalOpen(true)}
        onOpenBuyCoffee={() => setIsBuyCoffeeOpen(true)}
      />

      {/* Mobile Navigation Tabs (Engineered for Android & iPhone thumb reachability) */}
      <div className="flex lg:hidden bg-[#121214] p-1.5 border-b border-[#27272a] gap-1.5 shrink-0 z-20">
        <button
          onClick={() => setMobileTab('editor')}
          className={`flex-1 min-h-[44px] py-2 px-3 font-mono-code text-xs uppercase tracking-wider font-semibold rounded-md flex items-center justify-center gap-2 transition-all ${
            mobileTab === 'editor'
              ? 'bg-[#6366f1] text-white shadow-md shadow-indigo-950/40 ring-1 ring-indigo-400/30'
              : 'text-[#e4e4e7]/70 hover:text-white hover:bg-[#18181b]'
          }`}
        >
          <Edit3 className="w-4 h-4" />
          <span>01 // Input</span>
        </button>
        <button
          onClick={() => setMobileTab('preview')}
          className={`flex-1 min-h-[44px] py-2 px-3 font-mono-code text-xs uppercase tracking-wider font-semibold rounded-md flex items-center justify-center gap-2 transition-all ${
            mobileTab === 'preview'
              ? 'bg-[#6366f1] text-white shadow-md shadow-indigo-950/40 ring-1 ring-indigo-400/30'
              : 'text-[#e4e4e7]/70 hover:text-white hover:bg-[#18181b]'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Preview ({pages.length})</span>
        </button>
        <button
          onClick={() => setMobileTab('settings')}
          className={`flex-1 min-h-[44px] py-2 px-3 font-mono-code text-xs uppercase tracking-wider font-semibold rounded-md flex items-center justify-center gap-2 transition-all ${
            mobileTab === 'settings'
              ? 'bg-[#6366f1] text-white shadow-md shadow-indigo-950/40 ring-1 ring-indigo-400/30'
              : 'text-[#e4e4e7]/70 hover:text-white hover:bg-[#18181b]'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>02 // Style</span>
        </button>
      </div>

      {/* Desktop 3-Column Shell (Variation 2) */}
      <main className="flex-1 min-h-0 flex overflow-hidden">
        {/* Left Column: 01 // ASSIGNMENT INPUT (w: ~340px) */}
        <section
          className={`w-full lg:w-[340px] 2xl:w-[380px] flex-shrink-0 h-full p-2.5 sm:p-3 bg-[#0c0c0e] border-r border-[#27272a] ${
            mobileTab === 'editor' ? 'flex flex-col' : 'hidden lg:flex lg:flex-col'
          }`}
        >
          <TextInputPanel
            rawText={rawText}
            currentPageIndex={safePageIndex}
            totalPages={pages.length}
            onChangeText={setRawText}
            onApplyPreset={handleApplyPreset}
            onInsertPageBreak={handleAddPage}
            onAutoSplitPages={handleAutoSplitPages}
            fontSize={settings.fontSize}
            onUpdateFontSize={(newFontSize) =>
              setSettings((prev) => ({ ...prev, fontSize: newFontSize }))
            }
            onClearText={handleClearText}
            onCustomFontUpload={handleCustomFontUpload}
            onNotify={showToast}
          />
        </section>

        {/* Center Column: MAIN-PREVIEW (flex-1) */}
        <section
          className={`flex-1 h-full min-w-0 p-2.5 sm:p-3 bg-[#121214] flex flex-col gap-2 ${
            mobileTab === 'preview' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          <div className="flex-1 min-h-0">
            <PaperPreview
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
              onUpdateDiagram={handleUpdateDiagram}
              onDeleteDiagram={handleDeleteDiagram}
              paperRef={paperRef}
              onUpdateFontSize={(newFontSize) =>
                setSettings((prev) => ({ ...prev, fontSize: newFontSize }))
              }
            />
          </div>

          {/* Multi-page Navigation & Management Strip - Always visible for unlimited pages */}
          <div className="bg-[#0c0c0e] rounded-md border border-[#27272a] p-2 flex items-center justify-between gap-3 shadow-xs select-none">
            <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 font-mono-code scrollbar-thin">
              {pages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPageIndex(idx)}
                  className={`cursor-pointer px-3 py-1 rounded text-[11px] font-bold flex items-center gap-1.5 transition-all flex-shrink-0 ${
                    idx === safePageIndex
                      ? 'bg-[#6366f1] text-white shadow-xs ring-1 ring-[#6366f1]'
                      : 'bg-[#18181b] text-[#e4e4e7]/70 hover:bg-[#222226] border border-[#27272a]'
                  }`}
                  title={`Go to Page ${idx + 1}`}
                >
                  <span>PAGE {idx + 1}</span>
                  {diagrams.some((d) => d.pageIndex === idx) && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={handleAddPage}
                className="cursor-pointer px-3 py-1 text-[11px] font-mono-code font-bold bg-[#6366f1] hover:bg-[#4f46e5] text-white rounded flex items-center gap-1.5 transition-all shadow-xs uppercase tracking-wider"
                title="Add unlimited assignment pages"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Page</span>
              </button>
            </div>
          </div>
        </section>

        {/* Right Column: 02 // STYLE SYSTEM (w: ~340px) */}
        <section
          className={`w-full lg:w-[350px] 2xl:w-[390px] flex-shrink-0 h-full p-2.5 sm:p-3 bg-[#0c0c0e] border-l border-[#27272a] ${
            mobileTab === 'settings' ? 'flex flex-col' : 'hidden lg:flex lg:flex-col'
          }`}
        >
          <EditorControls
            settings={settings}
            headerInfo={headerInfo}
            customFonts={customFonts}
            diagrams={diagrams}
            currentPageIndex={safePageIndex}
            onUpdateSettings={(newSettings) =>
              setSettings((prev) => ({ ...prev, ...newSettings }))
            }
            onUpdateHeader={(newHeader) =>
              setHeaderInfo((prev) => ({ ...prev, ...newHeader }))
            }
            onCustomFontUpload={handleCustomFontUpload}
            onOpenDiagramModal={() => setIsDiagramModalOpen(true)}
            onDeleteDiagram={handleDeleteDiagram}
          />
        </section>
      </main>

      {/* Front Page Near Footer: 
          Row 1: Contributors moving Left to Right with lightning speed toggle
          Row 2: Student FAQs moving Right to Left */}
      <FrontPageMarquee
        onOpenContributors={() => setIsContributorsOpen(true)}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
      />

      {/* Technical Status & Student Credits Footer Bar */}
      <footer className="h-auto sm:h-12 py-2 sm:py-0 bg-[#18181b] border-t border-[rgba(228,228,231,0.1)] px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 font-mono-code text-[0.65rem] uppercase tracking-[0.12em] text-[#e4e4e7]/70 select-none flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
          <span>SYS_STATUS: READY // {pages.length} {pages.length === 1 ? 'PAGE' : 'PAGES'}</span>
        </div>

        {/* Student names: rhema, shivu sah, akchey, traore, yao */}
        <div className="flex items-center gap-1.5 text-zinc-400 text-center flex-wrap justify-center">
          <span className="text-zinc-500 font-semibold">STUDENTS:</span>
          <span className="text-zinc-200 font-semibold tracking-normal lowercase">
            rhema · shivu sah · akchey · traore · yao
          </span>
        </div>

        {/* Made with love by PLENTY */}
        <div className="flex items-center gap-3">
          <span className="text-rose-400 font-bold flex items-center gap-1 shadow-xs">
            <span>Made with love by PLENTY</span>
            <span className="text-rose-500 animate-pulse">❤️</span>
          </span>

          <button
            onClick={() => setIsContributorsOpen(true)}
            className="cursor-pointer text-[#e4e4e7]/70 hover:text-white transition-colors py-1 px-2 rounded hover:bg-[#27272a] hidden md:flex items-center gap-1"
            title="View GitHub Contributors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
            <span className="text-orange-400 font-bold">@plenty</span>
          </button>
        </div>
      </footer>

      {/* Container for Multi-Page PDF Export Generation */}
      <div
        ref={multiPageExportContainerRef}
        style={{
          position: 'fixed',
          left: '-9999px',
          top: '0px',
          width: '794px',
          height: '1123px',
          overflow: 'hidden',
          pointerEvents: 'none',
          zIndex: -1,
          opacity: 1,
          backgroundColor: '#ffffff',
        }}
      >
        {pages.map((pText, pIdx) => {
          const pageDiags = diagrams.filter((d) => d.pageIndex === pIdx);
          return (
            <div
              key={pIdx}
              className="export-paper-page relative select-none rounded-none overflow-hidden"
              style={{
                width: '794px',
                height: '1123px',
                backgroundColor:
                  settings.paperType === 'vintage'
                    ? '#fbf5e5'
                    : settings.paperType === 'ruled'
                    ? '#fafaf9'
                    : '#ffffff',
                backgroundImage:
                  settings.paperType === 'ruled'
                    ? `repeating-linear-gradient(transparent 0px, transparent ${settings.lineHeight - 1}px, #93c5fd ${settings.lineHeight - 1}px, #93c5fd ${settings.lineHeight}px)`
                    : settings.paperType === 'college-ruled'
                    ? `repeating-linear-gradient(transparent 0px, transparent ${settings.lineHeight - 1}px, #cbd5e1 ${settings.lineHeight - 1}px, #cbd5e1 ${settings.lineHeight}px)`
                    : settings.paperType === 'grid'
                    ? `linear-gradient(to right, #e2e8f0 1px, transparent 1px), repeating-linear-gradient(transparent 0px, transparent ${settings.lineHeight - 1}px, #e2e8f0 ${settings.lineHeight - 1}px, #e2e8f0 ${settings.lineHeight}px)`
                    : settings.paperType === 'vintage'
                    ? `repeating-linear-gradient(transparent 0px, transparent ${settings.lineHeight - 1}px, #d4be98 ${settings.lineHeight - 1}px, #d4be98 ${settings.lineHeight}px)`
                    : 'none',
                backgroundPosition: `0px ${settings.topMargin}px`,
                backgroundSize: settings.paperType === 'grid' ? `20px 20px, 100% ${settings.lineHeight}px` : undefined,
              }}
            >
              {/* Header margin line */}
              {settings.paperType !== 'plain' && settings.showMarginLine && (
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: `${settings.topMargin - 4}px`,
                    height: '1.5px',
                    backgroundColor: settings.marginLineColor,
                    opacity: 0.65,
                  }}
                />
              )}

              {/* Vertical Margin Line */}
              {settings.showMarginLine && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: `${settings.marginLinePosition}px`,
                    width: '1.5px',
                    backgroundColor: settings.marginLineColor,
                    opacity: 0.85,
                  }}
                />
              )}

              {/* Header Info */}
              {headerInfo.enabled && (
                <div
                  style={{
                    position: 'absolute',
                    top: '18px',
                    left: 0,
                    right: 0,
                    padding: '0 32px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontFamily: activeFontFamilyCss,
                    fontSize: '12px',
                    color: settings.inkColor,
                    opacity: settings.inkOpacity * 0.9,
                  }}
                >
                  <div>
                    {headerInfo.name && <span>Name: <strong>{headerInfo.name}</strong> </span>}
                    {headerInfo.rollNo && <span>Roll No: <strong>{headerInfo.rollNo}</strong></span>}
                  </div>
                  <div>
                    {headerInfo.subject && <span>Sub: {headerInfo.subject} </span>}
                    {headerInfo.date && <span>Date: {headerInfo.date} </span>}
                    {headerInfo.showPageNumber && <span>Page {pIdx + 1}/{pages.length}</span>}
                  </div>
                </div>
              )}

              {/* Content text */}
              <div
                style={{
                  paddingTop: `${settings.topMargin}px`,
                  paddingLeft: `${settings.leftMargin}px`,
                  paddingRight: `${settings.rightMargin}px`,
                  paddingBottom: `${settings.bottomMargin}px`,
                  fontFamily: activeFontFamilyCss,
                  fontSize: `${settings.fontSize}px`,
                  lineHeight: `${settings.lineHeight}px`,
                  letterSpacing: `${settings.letterSpacing}px`,
                  color: settings.inkColor,
                  opacity: settings.inkOpacity,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {pText}
              </div>

              {/* Diagrams */}
              {pageDiags.map((d) => (
                <div
                  key={d.id}
                  style={{
                    position: 'absolute',
                    left: `${d.x}px`,
                    top: `${d.y}px`,
                    width: `${d.width}px`,
                    height: `${d.height}px`,
                  }}
                >
                  <img src={d.dataUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  {d.title && (
                    <div style={{ textAlign: 'center', fontSize: '11px', fontFamily: activeFontFamilyCss, color: settings.inkColor }}>
                      {d.title}
                    </div>
                  )}
                </div>
              ))}

              {/* Ink Blots in export output */}
              {settings.inkBlots && (
                <InkBlotsOverlay
                  pageIndex={pIdx}
                  pageText={pText}
                  inkColor={settings.inkColor}
                  intensity={settings.inkBlotIntensity}
                  seed={settings.inkBlotSeed}
                  topMargin={settings.topMargin}
                  leftMargin={settings.leftMargin}
                  rightMargin={settings.rightMargin}
                  bottomMargin={settings.bottomMargin}
                  lineHeight={settings.lineHeight}
                />
              )}

              {/* Lighting overlay */}
              {settings.paperEffect === 'subtle-shadow' && (
                <div className="absolute inset-0 desk-shadow-overlay" />
              )}
              {settings.paperEffect === 'mobile-scan' && (
                <div className="absolute inset-0 paper-scanner-lighting" />
              )}
            </div>
          );
        })}
      </div>

      {/* Modern Floating Action Buttons Cluster */}
      <FloatingActions
        totalPages={pages.length}
        currentPageIndex={safePageIndex}
        fontSize={settings.fontSize}
        onOpenExport={() => setIsExportModalOpen(true)}
        onOpenBuyCoffee={() => setIsBuyCoffeeOpen(true)}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        onAddPage={handleAddPage}
        onUpdateFontSize={(sz) =>
          setSettings((prev) => ({ ...prev, fontSize: sz }))
        }
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
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        currentPageIndex={safePageIndex}
        totalPages={pages.length}
        paperRef={paperRef}
        onPrepareAllPages={prepareAllPagesForExport}
        onCleanupExport={cleanupAfterExport}
      />

      <MobileScanModal
        isOpen={isMobileScanOpen}
        onClose={() => setIsMobileScanOpen(false)}
      />

      <ContributorsModal
        isOpen={isContributorsOpen}
        onClose={() => setIsContributorsOpen(false)}
      />

      {/* Floating System Toast */}
      {toast && (
        <div className="fixed bottom-14 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-md font-mono-code text-xs shadow-2xl border animate-in slide-in-from-bottom-3 duration-200 bg-[#18181b] border-[#27272a] text-white">
          <span
            className={`w-2 h-2 rounded-full ${
              toast.type === 'success'
                ? 'bg-emerald-400'
                : toast.type === 'error'
                ? 'bg-rose-400'
                : 'bg-[#6366f1]'
            }`}
          />
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
