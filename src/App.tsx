/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useMemo, useEffect } from 'react';
import Header from './components/Header';
import TextInputPanel from './components/TextInputPanel';
import EditorControls from './components/EditorControls';
import PaperPreview from './components/PaperPreview';
import DiagramModal from './components/DiagramModal';
import HowItWorksModal from './components/HowItWorksModal';
import BuyCoffeeModal from './components/BuyCoffeeModal';
import ExportModal from './components/ExportModal';
import InkBlotsOverlay from './components/InkBlotsOverlay';
import StudentTestimonials from './components/StudentTestimonials';
import StaticContributors from './components/StaticContributors';
import PolicyModal from './components/PolicyModal';

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
  SlidersHorizontal,
  Eye,
  Plus,
  PenTool,
  Upload,
  Maximize2,
  Minimize2,
  ArrowDown,
  ArrowUp,
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
  const [leftTab, setLeftTab] = useState<'text' | 'style'>('text');
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('preview');
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
  const [isScrolledDown, setIsScrolledDown] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolledDown(window.scrollY > 350);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
  const [policyModalType, setPolicyModalType] = useState<'privacy' | 'terms' | null>(null);

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

  // Handle auto split for long text
  const handleAutoSplitPages = () => {
    const splitText = autoSplitLongText(rawText, 1800);
    setRawText(splitText);
    showToast('Auto-split text into pages!', 'success');
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

  // Prepare pages for export with reliable single-page and multi-page support
  const prepareAllPagesForExport = async (): Promise<HTMLElement[]> => {
    // If only 1 page exists, paperRef.current is already live on screen
    if (pages.length === 1 && paperRef.current) {
      return [paperRef.current];
    }

    const container = multiPageExportContainerRef.current;
    if (!container) {
      return paperRef.current ? [paperRef.current] : [];
    }

    container.style.left = '0px';
    container.style.top = '0px';
    container.style.zIndex = '9999';

    try {
      await document.fonts.ready;
    } catch {
      // ignore
    }

    const pageNodes = container.querySelectorAll<HTMLElement>('.export-paper-page');
    const nodes = Array.from(pageNodes);
    if (nodes.length === 0 && paperRef.current) {
      return [paperRef.current];
    }
    return nodes;
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

  const isLight = theme === 'light';

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 selection:bg-[#6366f1]/30 ${
        isLight
          ? 'bg-slate-50 text-slate-800 selection:text-slate-900'
          : 'bg-[#0c0c0e] text-[#e4e4e7] selection:text-white'
      }`}
    >
      {/* Header with Glassy Buttons, Theme Toggle, and Smooth Navigation */}
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        onOpenBuyCoffee={() => setIsBuyCoffeeOpen(true)}
        onOpenExport={() => setIsExportModalOpen(true)}
        onScrollToSection={scrollToSection}
      />

      {/* Mobile Navigation Switch (Clean & Non-disturbing) */}
      <div
        className={`flex lg:hidden p-2 border-b gap-2 shrink-0 z-20 transition-colors ${
          isLight ? 'bg-slate-100 border-slate-200' : 'bg-[#121215] border-white/10'
        }`}
      >
        <button
          onClick={() => setMobileTab('editor')}
          className={`flex-1 min-h-[42px] py-2 px-3 font-mono-code text-xs uppercase tracking-wider font-semibold rounded-xl flex items-center justify-center gap-2 transition-all ${
            mobileTab === 'editor'
              ? 'bg-[#6366f1] text-white shadow-md shadow-indigo-950/40'
              : isLight
              ? 'text-slate-600 hover:text-slate-950 hover:bg-white'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Edit3 className="w-4 h-4" />
          <span>Input &amp; Options</span>
        </button>
        <button
          onClick={() => setMobileTab('preview')}
          className={`flex-1 min-h-[42px] py-2 px-3 font-mono-code text-xs uppercase tracking-wider font-semibold rounded-xl flex items-center justify-center gap-2 transition-all ${
            mobileTab === 'preview'
              ? 'bg-[#6366f1] text-white shadow-md shadow-indigo-950/40'
              : isLight
              ? 'text-slate-600 hover:text-slate-950 hover:bg-white'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Paper Preview ({pages.length})</span>
        </button>
      </div>

      {/* Main Spacious Workbench Inspired by saurabhdaware.github.io/text-to-handwriting (Full scrolling enabled) */}
      <main id="workbench" className="flex-1 flex flex-col lg:flex-row min-h-[750px] lg:min-h-[840px]">
        {/* Left Side: Spacious Assignment Input & Styling Workbench */}
        <section
          className={`w-full lg:w-[460px] xl:w-[500px] 2xl:w-[540px] flex-shrink-0 border-r flex flex-col transition-colors ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#0e0e12] border-white/10'
          } ${isPaperExpanded ? 'hidden' : mobileTab === 'editor' ? 'flex' : 'hidden lg:flex'}`}
        >
          {/* Top Workbench Tabs: Text Input vs Style Controls */}
          <div
            className={`p-2.5 border-b flex items-center justify-between gap-2 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#121216] border-white/10'
            }`}
          >
            <div
              className={`flex items-center gap-1.5 p-1 rounded-xl border ${
                isLight ? 'bg-slate-200/80 border-slate-300' : 'bg-[#09090b] border-white/5'
              }`}
            >
              <button
                type="button"
                onClick={() => setLeftTab('text')}
                className={`cursor-pointer px-3.5 py-1.5 rounded-lg text-xs font-mono-code font-bold flex items-center gap-1.5 transition-all ${
                  leftTab === 'text'
                    ? 'bg-[#6366f1] text-white shadow-sm'
                    : isLight
                    ? 'text-slate-700 hover:text-slate-950'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Assignment Text</span>
              </button>
              <button
                type="button"
                onClick={() => setLeftTab('style')}
                className={`cursor-pointer px-3.5 py-1.5 rounded-lg text-xs font-mono-code font-bold flex items-center gap-1.5 transition-all ${
                  leftTab === 'style'
                    ? 'bg-[#6366f1] text-white shadow-sm'
                    : isLight
                    ? 'text-slate-700 hover:text-slate-950'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Style &amp; Options</span>
              </button>
            </div>

            {/* Quick Action Shortcuts: Draw Diagrams & Custom Font */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsDiagramModalOpen(true)}
                className={`cursor-pointer text-[10px] font-mono-code border px-2 py-1.5 rounded-lg flex items-center gap-1 transition-colors ${
                  isLight
                    ? 'text-slate-700 hover:text-slate-950 bg-white hover:bg-slate-100 border-slate-300 shadow-2xs'
                    : 'text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border-white/10'
                }`}
                title="Draw or insert diagrams directly onto paper"
              >
                <PenTool className="w-3 h-3 text-[#6366f1]" />
                <span className="hidden sm:inline">Diagrams</span>
              </button>
            </div>
          </div>

          {/* Tab 1: Assignment Paste Area */}
          <div className={`flex-1 min-h-0 ${leftTab === 'text' ? 'flex flex-col' : 'hidden'}`}>
            <TextInputPanel
              theme={theme}
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
          </div>

          {/* Tab 2: Style & Options Panel */}
          <div className={`flex-1 min-h-0 ${leftTab === 'style' ? 'flex flex-col' : 'hidden'}`}>
            <EditorControls
              theme={theme}
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
          </div>
        </section>

        {/* Right Side: Spacious Full-View Handwriting Paper Preview (Not Squeezed!) */}
        <section
          className={`flex-1 min-w-0 flex flex-col min-h-0 p-3 sm:p-5 gap-3 transition-colors ${
            isLight ? 'bg-slate-100' : 'bg-[#121216]'
          } ${mobileTab === 'preview' ? 'flex' : 'hidden lg:flex'}`}
        >
          {/* Top Paper Header Strip: Page Info, Zoom & Full-View Expand Button */}
          <div
            className={`flex items-center justify-between gap-3 border rounded-xl px-3 sm:px-4 py-2 text-xs font-mono-code transition-colors ${
              isLight
                ? 'bg-white border-slate-300 text-slate-800 shadow-2xs'
                : 'bg-[#0c0c0e] border-white/10 text-zinc-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className={`font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Full-View Paper Preview
              </span>
              <span className="text-zinc-400 hidden sm:inline">|</span>
              <span className="text-[#6366f1] font-bold hidden sm:inline">
                Page {safePageIndex + 1} of {pages.length}
              </span>
            </div>

            {/* Expand / Minimize Full View Toggle */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPaperExpanded(!isPaperExpanded)}
                className={`cursor-pointer hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-colors ${
                  isLight
                    ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
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

          {/* The Paper Preview Element (Roomy, High Fidelity, Natural Scroll) */}
          <div className="flex-1 min-h-[660px] relative">
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
              onUpdateDiagram={handleUpdateDiagram}
              onDeleteDiagram={handleDeleteDiagram}
              paperRef={paperRef}
              onUpdateFontSize={(newFontSize) =>
                setSettings((prev) => ({ ...prev, fontSize: newFontSize }))
              }
            />
          </div>

          {/* Multi-page Navigation Strip */}
          <div
            className={`rounded-xl border p-2 sm:p-2.5 flex items-center justify-between gap-3 select-none transition-colors ${
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
                className="cursor-pointer px-3.5 py-1.5 text-xs font-mono-code font-bold bg-[#6366f1] hover:bg-[#4f46e5] text-white rounded-lg flex items-center gap-1.5 transition-all shadow-sm uppercase tracking-wider active:scale-95"
                title="Add unlimited assignment pages"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Page</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Real Students Who Used and Liked The Site (With verified real comments) */}
      <StudentTestimonials
        theme={theme}
        onOpenCoffeeModal={() => setIsBuyCoffeeOpen(true)}
      />

      {/* Static Contributors Space (Right Above Footer - Plenty's GitHub Only, Student FAQs) */}
      <StaticContributors
        theme={theme}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
      />

      {/* Clean Technical & Copyright Footer (Scrollable & Visually Crisp) */}
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
            href="https://github.com/jjohnernest212-oss"
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

        {/* Policy & Quick Nav Links */}
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
            href="https://github.com/jjohnernest212-oss"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline transition-colors font-bold text-indigo-500"
          >
            Follow Plenty on GitHub ↗
          </a>
        </div>
      </footer>

      {/* Floating Smooth Scroll Navigation Pill */}
      <div className="fixed bottom-6 left-6 z-40 hidden sm:flex items-center gap-2">
        {isScrolledDown ? (
          <button
            type="button"
            onClick={() => scrollToSection('workbench')}
            className={`cursor-pointer backdrop-blur-md px-3.5 py-2 rounded-full text-xs font-mono-code shadow-xl flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 border ${
              isLight
                ? 'bg-white/95 text-slate-800 border-slate-300 hover:bg-slate-100 shadow-slate-300'
                : 'bg-slate-900/90 text-white border-white/20 hover:bg-slate-900 shadow-black'
            }`}
            title="Scroll back to top of editor"
          >
            <ArrowUp className="w-3.5 h-3.5 text-indigo-500" />
            <span className="font-semibold">Top of Editor ↑</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => scrollToSection('student-reviews')}
            className={`cursor-pointer backdrop-blur-md px-3.5 py-2 rounded-full text-xs font-mono-code shadow-xl flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 border ${
              isLight
                ? 'bg-white/95 text-slate-800 border-slate-300 hover:bg-slate-100 shadow-slate-300'
                : 'bg-slate-900/90 text-white border-white/20 hover:bg-slate-900 shadow-black'
            }`}
            title="Scroll down to real student reviews & footer"
          >
            <ArrowDown className="w-3.5 h-3.5 text-emerald-500" />
            <span className="font-semibold">Student Reviews &amp; Footer ↓</span>
          </button>
        )}
      </div>

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
        onPrepareAllPages={prepareAllPagesForExport}
        onCleanupExport={cleanupAfterExport}
      />

      <PolicyModal
        isOpen={policyModalType !== null}
        onClose={() => setPolicyModalType(null)}
        type={policyModalType || 'privacy'}
      />

      {/* Floating System Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono-code text-xs shadow-2xl border animate-in slide-in-from-bottom-3 duration-200 bg-[#18181b] border-white/10 text-white">
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
