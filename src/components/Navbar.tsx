import React, { useState } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import AppLogo from './AppLogo';
import { AppPage } from '../types';

interface NavbarProps {
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
}

const NAV_LINKS: { page: AppPage; label: string }[] = [
  { page: 'home', label: 'Home' },
  { page: 'features', label: 'Features' },
  { page: 'styles', label: 'Handwriting Styles' },
  { page: 'papers', label: 'Paper Templates' },
  { page: 'tools', label: 'Tools' },
  { page: 'faq', label: 'FAQ' },
];

export default function Navbar({
  currentPage,
  onNavigate,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLinkClick = (page: AppPage) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#DDD2BC] bg-[#FFFDF8]/95 text-[#1E1B18]">
      <div className="max-w-7xl mx-auto h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-8">
        {/* Zone 1: Crisp Wordmark & Pen/Paper Logo */}
        <button
          type="button"
          onClick={() => handleLinkClick('home')}
          className="cursor-pointer flex items-center gap-2.5 text-left whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A4319] rounded-lg"
        >
          <span className="w-9 h-9 rounded-xl bg-[#FAF4E8] border border-[#DDD2BC] text-[#1E1B18] flex items-center justify-center shrink-0 shadow-xs">
            <AppLogo size={24} variant="brand" />
          </span>
          <span className="text-base sm:text-[17px] font-bold tracking-tight text-[#1E1B18] whitespace-nowrap">
            Human Handwriting AI
          </span>
        </button>

        {/* Zone 2: Clean Single-Line Navigation Links */}
        <nav
          aria-label="Primary navigation"
          className="hidden lg:flex items-center gap-6"
        >
          {NAV_LINKS.map((item) => {
            const isActive = currentPage === item.page;
            return (
              <button
                key={item.page}
                type="button"
                onClick={() => handleLinkClick(item.page)}
                className={`cursor-pointer text-[13px] xl:text-sm font-medium transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                  isActive
                    ? 'text-[#9A4319] border-[#9A4319] font-semibold'
                    : 'text-[#5C5347] border-transparent hover:text-[#1E1B18] hover:border-[#D7CCB5]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action CTA + Mobile Hamburger */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => handleLinkClick('editor')}
            className="hidden sm:inline-flex cursor-pointer min-h-[40px] px-4 py-2 rounded-xl bg-[#24201C] hover:bg-[#38322C] text-[#FFFDF8] text-xs sm:text-sm font-bold items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 active:scale-[0.98]"
          >
            <span>Start Creating</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            className="lg:hidden cursor-pointer min-h-[40px] min-w-[40px] rounded-xl border border-[#D7CCB5] bg-[#FAF4E8] hover:bg-[#EFE5D3] text-[#1E1B18] flex items-center justify-center transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#DDD2BC] bg-[#FFFDF8] px-4 py-4 space-y-1.5 text-[#1E1B18]">
          <div className="grid grid-cols-1 gap-1">
            {NAV_LINKS.map((item) => {
              const isActive = currentPage === item.page;
              return (
                <button
                  key={item.page}
                  type="button"
                  onClick={() => handleLinkClick(item.page)}
                  className={`cursor-pointer w-full min-h-[44px] px-3.5 rounded-xl text-left text-sm font-medium flex items-center justify-between transition-colors ${
                    isActive
                      ? 'bg-[#F6EBE0] text-[#9A4319] border border-[#E2C2A8] font-semibold'
                      : 'hover:bg-[#FAF4E8] text-[#4A433A]'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="text-xs text-[#9A4319] font-semibold">Active</span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-3 mt-2 border-t border-[#DDD2BC]">
            <button
              type="button"
              onClick={() => handleLinkClick('editor')}
              className="cursor-pointer w-full min-h-[46px] px-4 rounded-xl bg-[#24201C] hover:bg-[#38322C] text-[#FFFDF8] text-sm font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <span>Start Creating Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
