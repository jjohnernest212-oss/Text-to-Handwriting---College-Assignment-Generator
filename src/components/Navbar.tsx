import React, { useState } from 'react';
import { Menu, X, Sun, Moon, ArrowRight } from 'lucide-react';
import AppLogo from './AppLogo';
import { AppPage } from '../types';

interface NavbarProps {
  currentPage: AppPage;
  theme: 'dark' | 'light';
  onNavigate: (page: AppPage) => void;
  onToggleTheme: () => void;
}

const NAV_LINKS: { page: AppPage; label: string }[] = [
  { page: 'home', label: 'Home' },
  { page: 'features', label: 'Features' },
  { page: 'styles', label: 'Handwriting Styles' },
  { page: 'papers', label: 'Paper Templates' },
  { page: 'tools', label: 'Tools' },
  { page: 'pricing', label: 'Pricing' },
  { page: 'faq', label: 'FAQ' },
];

export default function Navbar({
  currentPage,
  theme,
  onNavigate,
  onToggleTheme,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isLight = theme === 'light';

  const handleLinkClick = (page: AppPage) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors duration-200 ${
        isLight
          ? 'bg-white/90 border-slate-200/90 text-slate-900'
          : 'bg-[#0f1014]/90 border-white/10 text-white'
      }`}
    >
      <div className="max-w-7xl mx-auto h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 lg:gap-8">
        {/* Zone 1: Brand Title */}
        <button
          type="button"
          onClick={() => handleLinkClick('home')}
          className="cursor-pointer flex items-center gap-2.5 text-left whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 rounded-lg"
        >
          <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
            <AppLogo size={18} className="text-white" />
          </span>
          <span
            className={`text-base sm:text-[17px] font-bold tracking-tight whitespace-nowrap ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}
          >
            Human Handwriting AI
          </span>
        </button>

        {/* Zone 2: Clean Typography Nav Links (Desktop) */}
        <nav
          aria-label="Primary navigation"
          className="hidden lg:flex items-center gap-5 xl:gap-6"
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
                    ? isLight
                      ? 'text-indigo-600 border-indigo-600 font-semibold'
                      : 'text-indigo-400 border-indigo-400 font-semibold'
                    : isLight
                    ? 'text-slate-600 border-transparent hover:text-slate-900 hover:border-slate-300'
                    : 'text-zinc-400 border-transparent hover:text-white hover:border-zinc-700'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Theme Toggle + Primary CTA */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
            title={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
            className={`cursor-pointer min-h-[40px] min-w-[40px] rounded-xl border flex items-center justify-center transition-colors ${
              isLight
                ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-amber-300'
            }`}
          >
            {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => handleLinkClick('editor')}
            className="hidden sm:inline-flex cursor-pointer min-h-[40px] px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 active:scale-[0.98]"
          >
            <span>Start Creating</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Mobile Hamburger Menu */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            className={`lg:hidden cursor-pointer min-h-[40px] min-w-[40px] rounded-xl border flex items-center justify-center transition-colors ${
              isLight
                ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-zinc-200'
            }`}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          className={`lg:hidden border-t px-4 py-4 space-y-1.5 ${
            isLight
              ? 'bg-white border-slate-200 text-slate-800'
              : 'bg-[#121318] border-white/10 text-zinc-100'
          }`}
        >
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
                      ? isLight
                        ? 'bg-indigo-50 text-indigo-700 font-semibold'
                        : 'bg-indigo-500/15 text-indigo-300 font-semibold'
                      : isLight
                      ? 'hover:bg-slate-50 text-slate-700'
                      : 'hover:bg-white/5 text-zinc-300'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="text-xs text-indigo-600 dark:text-indigo-400">Active</span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-3 mt-2 border-t border-inherit">
            <button
              type="button"
              onClick={() => handleLinkClick('editor')}
              className="cursor-pointer w-full min-h-[46px] px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
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
