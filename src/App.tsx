/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useMemo, useEffect } from 'react';
import Header from './components/Header';
import PaperPreview from './components/PaperPreview';
import UnifiedControlsPanel from './components/UnifiedControlsPanel';
import DiagramModal from './components/DiagramModal';
import HowItWorksModal from './components/HowItWorksModal';
import BuyCoffeeModal from './components/BuyCoffeeModal';
import ExportModal from './components/ExportModal';
import InkBlotsOverlay from './components/InkBlotsOverlay';
import StudentTestimonials from './components/StudentTestimonials';
import StaticContributors from './components/StaticContributors';
import PolicyModal from './components/PolicyModal';
import PaperGalleryModal from './components/PaperGalleryModal';
import { downloadAssignmentAsPdf, downloadAssignmentSinglePage, ExportProgress } from './utils/exportUtils';
import { PAPER_DEFINITIONS_MAP } from './utils/paperStyles';

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
  Edit3,
  Eye,
  Maximize2,
  Minimize2,
  Ruler,
  Download,
} from 'lucide-react';

export default function App() {
  // Main states
  const [rawText, setRawText] = useState<string>(ASSIGNMENT_PRESETS[0].content);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [settings, setSettings] = useState<PageSettings>(DEFAULT_PAGE_SETTINGS);
  const [headerInfo, setHeaderInfo] = useState<StudentHeaderInfo>(DEFAULT_STUDENT_HEADER);
  const [customFonts, setCustomFonts] = useState<HandwritingFont[]>([]);
  const [diagrams, setDiagrams] = useState<DiagramElement[]>([]);

  // View state: 'split' or 'full-paper' on desktop, 'editor' vs 'preview' on mobile
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor');
  const [isPaperExpanded, setIsPaperExpanded] = useState<boolean>(false);

  // Theme state: 'dark' (Night Mode) vs 'light' (Day Mode)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('app-theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {
      // Ignore localStorage restrictions
    }
    return 'dark';
  });

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('app-theme', next);
      } catch {
        // Ignore
      }
      return next;
    });
  };

  // Smooth scroll tracking
  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Modals
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState<boolean>(false);
  const [isBuyCoffeeOpen, setIsBuyCoffeeOpen] = useState<boolean>(false);
  const [isDiagramModalOpen, setIsDiagramModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isPaperGalleryOpen, setIsPaperGalleryOpen] = useState<boolean>(false);
  const [policyModalType, setPolicyModalType] = useState<'privacy' | 'terms' | null>(null);

  // Paper DOM reference
  const paperRef = useRef<HTMLDivElement | null>(null);

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
    showToast(`Page ${res.newPageIndex + 1} added!`, 'success');
  };

  // Handle deleting the current page
  const handleDeleteCurrentPage = () => {
    if (pages.length <= 1) {
      setRawText('');
      showToast('Assignment cleared', 'info');
      return;
    }
    const res = deletePageAtIndex(rawText, safePageIndex);
    setRawText(res.newRawText);
    setCurrentPageIndex(res.newPageIndex);
    showToast(`Deleted page ${safePageIndex + 1}`, 'info');
  };

  // Handle auto split for long text based on actual page capacity and word count
  const handleAutoSplitPages = () => {
    const splitText = autoSplitLongText(rawText, settings);
    setRawText(splitText);
    const newPages = parsePagesFromText(splitText);
    showToast(`Assignment automatically divided into ${newPages.length} pages!`, 'success');
  };

  // Clear text
  const handleClearText = () => {
    setRawText('');
    setCurrentPageIndex(0);
    showToast('Text cleared', 'info');
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

  // Direct export download handlers (Saurabh Daware style instant download)
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<ExportProgress | null>(null);

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
        filename: 'Handwritten_Assignment.pdf',
        onProgress: (p) => setExportProgress(p),
      });

      showToast(`All ${safePages.length} pages downloaded as PDF successfully!`, 'success');
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
        filename: `Handwritten_Assignment_Page_${safePageIndex + 1}.png`,
      });
      showToast(`Page ${safePageIndex + 1} PNG downloaded!`, 'success');
    } catch (err: unknown) {
      console.error('Image export failed:', err);
      showToast('Failed to export image. Please try again.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  // Keyboard shortcut: Ctrl+S / Cmd+S for instant PDF download
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleDirectDownloadPdf();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [pages, settings, activeFontFamilyCss, diagrams, headerInfo]);

  const isLight = theme === 'light';

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
      className={`min-h-screen flex flex-col font-sans pb-16 lg:pb-0 transition-colors duration-200 selection:bg-[#6366f1]/30 ${
        isLight
          ? 'bg-slate-50 text-slate-900 selection:text-slate-900'
          : 'bg-[#0c0c0e] text-[#e4e4e7] selection:text-white'
      }`}
    >
      {/* Top Header */}
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        onOpenBuyCoffee={() => setIsBuyCoffeeOpen(true)}
        onOpenExport={() => setIsExportModalOpen(true)}
        onScrollToSection={scrollToSection}
      />

      {/* Smooth, Clear Front-Page Intro Strip */}
      <section
        className={`border-b px-4 sm:px-6 lg:px-8 py-5 sm:py-6 transition-colors ${
          isLight
            ? 'bg-white border-slate-200'
            : 'bg-[#111115] border-white/10'
        }`}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-2xl space-y-1.5">
            <h1
              className={`text-xl sm:text-2xl lg:text-[1.75rem] font-bold tracking-tight text-balance leading-snug ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}
            >
              Turn typed notes into real handwritten pages.
            </h1>
            <p
              className={`text-xs sm:text-sm leading-relaxed ${
                isLight ? 'text-slate-600' : 'text-zinc-400'
              }`}
            >
              Paste your text, pick a notebook sheet and pen color, align with optional margin guides, and download a print-ready PDF.
            </p>
          </div>

          <div
            className={`flex items-center gap-2 text-xs font-medium shrink-0 ${
              isLight ? 'text-slate-500' : 'text-zinc-400'
            }`}
          >
            <span>1. Paste text</span>
            <span aria-hidden="true">·</span>
            <span>2. Style paper</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#6366f1] font-semibold">3. Export PDF</span>
          </div>
        </div>
      </section>

      {/* Mobile Top Segmented Switcher */}
      <div
        className={`flex lg:hidden px-3 py-2.5 border-b gap-2 shrink-0 transition-colors ${
          isLight ? 'bg-slate-100/80 border-slate-200' : 'bg-[#121216] border-white/10'
        }`}
      >
        <div
          className={`w-full grid grid-cols-2 p-1 rounded-xl border ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#1a1a20] border-white/10'
          }`}
        >
          <button
            type="button"
            onClick={() => setMobileTab('editor')}
            className={`min-h-[40px] px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              mobileTab === 'editor'
                ? 'bg-[#6366f1] text-white shadow-xs'
                : isLight
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-zinc-400 hover:text-white'
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
                ? 'bg-[#6366f1] text-white shadow-xs'
                : isLight
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Paper Preview ({pages.length})</span>
          </button>
        </div>
      </div>

      {/* Main Spacious Workbench */}
      <main id="workbench" className="flex-1 flex flex-col lg:flex-row min-h-[700px] lg:min-h-[820px]">
        {/* Left Side: Assignment Input & Styling Workbench */}
        <section
          className={`w-full lg:w-[460px] xl:w-[500px] 2xl:w-[540px] flex-shrink-0 border-r flex flex-col transition-colors ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#0e0e12] border-white/10'
          } ${isPaperExpanded ? 'hidden' : mobileTab === 'editor' ? 'flex' : 'hidden lg:flex'}`}
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
            onOpenPaperGallery={() => setIsPaperGalleryOpen(true)}
          />
        </section>

        {/* Right Side: Full-View Handwriting Paper Preview */}
        <section
          className={`flex-1 min-w-0 flex flex-col min-h-0 p-3 sm:p-5 gap-3 transition-colors ${
            isLight ? 'bg-slate-100' : 'bg-[#121216]'
          } ${mobileTab === 'preview' ? 'flex' : 'hidden lg:flex'}`}
        >
          {/* Top Paper Header Strip */}
          <div
            className={`flex items-center justify-between gap-3 border rounded-2xl px-4 py-2.5 text-xs transition-colors ${
              isLight
                ? 'bg-white border-slate-200 text-slate-800'
                : 'bg-[#141418] border-white/10 text-zinc-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className={`font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Live Paper Output
              </span>
              <span aria-hidden="true" className="opacity-40">·</span>
              <span className="text-[#6366f1] font-semibold tabular-nums">
                Page {safePageIndex + 1} of {pages.length}
              </span>
              {settings.showMarginGuides && (
                <>
                  <span aria-hidden="true" className="opacity-40 hidden sm:inline">·</span>
                  <span className="text-[11px] opacity-70 hidden sm:inline">
                    Margin Guides On
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPaperExpanded(!isPaperExpanded)}
                className={`cursor-pointer hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors ${
                  isLight
                    ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                    : 'bg-white/5 hover:bg-white/10 border-white/10 text-zinc-300 hover:text-white'
                }`}
                title={isPaperExpanded ? 'Restore Split View' : 'Maximize Paper to Full View'}
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

          {/* The Paper Preview Element */}
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

          {/* Clean Multi-page Navigation Bar (Shown when multi-page assignment) */}
          {pages.length > 1 && (
            <div
              className={`rounded-xl border p-2 flex items-center justify-center gap-2 select-none transition-colors ${
                isLight ? 'bg-white border-slate-300 shadow-2xs' : 'bg-[#0c0c0e] border-white/10'
              }`}
            >
              <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 font-mono-code scrollbar-thin">
                {pages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPageIndex(idx)}
                    className={`cursor-pointer px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all flex-shrink-0 ${
                      idx === safePageIndex
                        ? 'bg-[#6366f1] text-white shadow-sm ring-1 ring-indigo-400'
                        : isLight
                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                        : 'bg-[#18181b] text-zinc-400 hover:bg-[#222226] border border-white/5'
                    }`}
                    title={`Switch to Page ${idx + 1}`}
                  >
                    <span>PAGE {idx + 1}</span>
                    {diagrams.some((d) => d.pageIndex === idx) && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Real Students Who Used and Liked The Site */}
      <StudentTestimonials
        theme={theme}
        onOpenCoffeeModal={() => setIsBuyCoffeeOpen(true)}
      />

      {/* Static Contributors Space */}
      <StaticContributors
        theme={theme}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
      />

      {/* Footer */}
      <footer
        className={`border-t px-4 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono-code text-[11px] select-none transition-colors ${
          isLight
            ? 'bg-white border-slate-200 text-slate-600'
            : 'bg-[#0a0a0d] border-white/10 text-zinc-400'
        }`}
      >
        <div className="flex items-center gap-2 flex-wrap">
          <span>&copy; 2026 Text to Handwriting.</span>
          <span className="text-zinc-500 hidden sm:inline">|</span>
          <a
            href="https://github.com/plenty"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-500 hover:text-amber-600 font-bold transition-colors"
          >
            Made with ❤️ by PLENTY
          </a>
          <span className="text-zinc-500 hidden sm:inline">|</span>
          <span className="text-[10px] text-emerald-500 hidden md:inline font-semibold">
            18,400+ Submissions Saved
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs flex-wrap">
          <button
            type="button"
            onClick={() => scrollToSection('workbench')}
            className="cursor-pointer hover:text-indigo-500 transition-colors"
          >
            Back to Editor ↑
          </button>
          <span className="text-zinc-400">·</span>
          <button
            type="button"
            onClick={() => scrollToSection('student-reviews')}
            className="cursor-pointer hover:text-emerald-500 transition-colors"
          >
            Student Reviews
          </button>
          <span className="text-zinc-400">·</span>
          <button
            type="button"
            onClick={() => setPolicyModalType('privacy')}
            className="cursor-pointer hover:underline transition-colors"
          >
            Privacy Policy
          </button>
          <span className="text-zinc-400">·</span>
          <button
            type="button"
            onClick={() => setPolicyModalType('terms')}
            className="cursor-pointer hover:underline transition-colors"
          >
            Terms of Service
          </button>
          <span className="text-zinc-400">·</span>
          <a
            href="https://github.com/plenty"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline transition-colors font-bold text-indigo-500"
          >
            Follow Plenty on GitHub ↗
          </a>
        </div>
      </footer>

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

      {/* FIXED: ExportModal now uses data-based export (no html2canvas blank pages) */}
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

      {/* Visual Notebook & Book Pages Aesthetic Gallery Modal */}
      <PaperGalleryModal
        isOpen={isPaperGalleryOpen}
        onClose={() => setIsPaperGalleryOpen(false)}
        currentPaper={settings.paperType}
        theme={theme}
        onSelectPaper={(newPaperId, recSettings) => {
          setSettings((prev) => ({
            ...prev,
            paperType: newPaperId,
            ...recSettings,
          }));
          const def = PAPER_DEFINITIONS_MAP[newPaperId];
          showToast(`Applied ${def ? def.name : newPaperId}!`, 'success');
        }}
      />

      {/* Unified Mobile Thumb-Zone Bottom Bar (<= 15% sticky height cap) */}
      <nav
        aria-label="Mobile quick navigation"
        className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 h-[60px] px-2 border-t backdrop-blur-md grid grid-cols-4 items-center gap-1 ${
          isLight
            ? 'bg-white/95 border-slate-200 text-slate-700'
            : 'bg-[#111115]/95 border-white/10 text-zinc-300'
        }`}
      >
        <button
          type="button"
          onClick={() => setMobileTab('editor')}
          className={`min-h-[44px] flex flex-col items-center justify-center rounded-xl transition-colors cursor-pointer ${
            mobileTab === 'editor'
              ? 'text-[#6366f1] font-semibold'
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
              ? 'text-[#6366f1] font-semibold'
              : 'opacity-75 hover:opacity-100'
          }`}
        >
          <Eye className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 leading-none">Paper ({pages.length})</span>
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
              ? 'text-[#6366f1] font-semibold'
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
          className="min-h-[44px] mx-1 rounded-xl bg-[#6366f1] hover:bg-indigo-600 disabled:opacity-50 text-white flex flex-col items-center justify-center transition-colors cursor-pointer active:scale-95"
        >
          <Download className="w-4 h-4" />
          <span className="text-[10px] font-semibold mt-0.5 leading-none">
            {isExporting ? 'Saving...' : 'PDF'}
          </span>
        </button>
      </nav>

      {/* Floating System Toast */}
      {toast && (
        <div className="fixed bottom-20 lg:bottom-6 right-4 lg:right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium shadow-xl border bg-[#18181b] border-white/10 text-white">
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}