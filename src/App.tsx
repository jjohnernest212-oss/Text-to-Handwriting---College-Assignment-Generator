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
import { parsePagesFromText } from './utils/paginationUtils';
import { loadCustomFontFile } from './utils/fontLoader';
import {
  BookOpen,
  Edit3,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Eye,
  Plus,
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
    } catch (err) {
      console.error('Failed to load custom font:', err);
      alert('Could not parse font file. Please ensure it is a valid .ttf, .otf, or .woff file.');
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
  };

  // Handle insert page break
  const handleInsertPageBreak = () => {
    setRawText((prev) => prev + '\n\n---page---\n\n');
    setCurrentPageIndex(pages.length);
  };

  // Clear text
  const handleClearText = () => {
    if (window.confirm('Are you sure you want to clear all text?')) {
      setRawText('');
      setCurrentPageIndex(0);
    }
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

  // Prepare all page elements for PDF export
  const prepareAllPagesForExport = async (): Promise<HTMLElement[]> => {
    const container = multiPageExportContainerRef.current;
    if (!container) return [];
    const pageNodes = container.querySelectorAll<HTMLElement>('.export-paper-page');
    return Array.from(pageNodes);
  };

  return (
    <div className="h-screen flex flex-col bg-[#0c0c0e] text-[#e4e4e7] overflow-hidden font-sans">
      {/* Header */}
      <Header
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        onOpenBuyCoffee={() => setIsBuyCoffeeOpen(true)}
        onOpenExport={() => setIsExportModalOpen(true)}
      />

      {/* Mobile Navigation Tabs (visible only on small screens < lg) */}
      <div className="flex lg:hidden bg-[#121214] p-1 border-b border-[#27272a] gap-1">
        <button
          onClick={() => setMobileTab('editor')}
          className={`flex-1 py-1.5 font-mono-code text-[11px] uppercase tracking-wider font-semibold rounded flex items-center justify-center gap-1.5 transition-colors ${
            mobileTab === 'editor'
              ? 'bg-[#6366f1] text-white shadow-xs'
              : 'text-[#e4e4e7]/60 hover:text-white'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>01 // Input</span>
        </button>
        <button
          onClick={() => setMobileTab('preview')}
          className={`flex-1 py-1.5 font-mono-code text-[11px] uppercase tracking-wider font-semibold rounded flex items-center justify-center gap-1.5 transition-colors ${
            mobileTab === 'preview'
              ? 'bg-[#6366f1] text-white shadow-xs'
              : 'text-[#e4e4e7]/60 hover:text-white'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Preview ({pages.length})</span>
        </button>
        <button
          onClick={() => setMobileTab('settings')}
          className={`flex-1 py-1.5 font-mono-code text-[11px] uppercase tracking-wider font-semibold rounded flex items-center justify-center gap-1.5 transition-colors ${
            mobileTab === 'settings'
              ? 'bg-[#6366f1] text-white shadow-xs'
              : 'text-[#e4e4e7]/60 hover:text-white'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
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
            onInsertPageBreak={handleInsertPageBreak}
            onClearText={handleClearText}
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
              onUpdateDiagram={handleUpdateDiagram}
              onDeleteDiagram={handleDeleteDiagram}
              paperRef={paperRef}
            />
          </div>

          {/* Multi-page Thumbnail strip when more than 1 page */}
          {pages.length > 1 && (
            <div className="bg-[#0c0c0e] rounded-md border border-[#27272a] p-2 flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 font-mono-code">
                {pages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPageIndex(idx)}
                    className={`cursor-pointer px-3 py-1 rounded text-[11px] font-bold flex items-center gap-1.5 transition-all ${
                      idx === safePageIndex
                        ? 'bg-[#6366f1] text-white shadow-xs'
                        : 'bg-[#18181b] text-[#e4e4e7]/70 hover:bg-[#222226]'
                    }`}
                  >
                    <span>PAGE {idx + 1}</span>
                    {diagrams.some((d) => d.pageIndex === idx) && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    )}
                  </button>
                ))}
              </div>

              <button
                onClick={handleInsertPageBreak}
                className="cursor-pointer flex-shrink-0 px-2.5 py-1 text-[11px] font-mono-code text-[#6366f1] hover:bg-[#6366f1]/10 border border-[#6366f1]/30 rounded flex items-center gap-1 transition-colors"
                title="Add new assignment page"
              >
                <Plus className="w-3 h-3" />
                <span>+ Page</span>
              </button>
            </div>
          )}
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

      {/* Technical Status Footer Bar (Variation 2) */}
      <footer className="h-12 bg-[#18181b] border-t border-[rgba(228,228,231,0.1)] px-6 flex items-center justify-between font-mono-code text-[0.65rem] uppercase tracking-[0.15em] text-[#e4e4e7]/60 select-none flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>SYS_STATUS: READY // {pages.length} {pages.length === 1 ? 'PAGE' : 'PAGES'} RENDERED</span>
        </div>
        <div className="hidden md:block text-[#e4e4e7]/40">
          VER. 4.3 // DESIGNED FOR AUTHENTICITY
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[#6366f1] font-semibold">85% VIEWPORT SCALE</span>
        </div>
      </footer>

      {/* Hidden Offscreen Container for Multi-Page PDF Export Generation */}
      <div
        ref={multiPageExportContainerRef}
        style={{
          position: 'fixed',
          left: '-9999px',
          top: '-9999px',
          width: '794px',
          visibility: 'hidden',
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
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        currentPageIndex={safePageIndex}
        totalPages={pages.length}
        paperRef={paperRef}
        onPrepareAllPages={prepareAllPagesForExport}
      />
    </div>
  );
}
