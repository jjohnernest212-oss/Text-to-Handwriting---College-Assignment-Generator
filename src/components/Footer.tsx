import React from 'react';
import { Coffee } from 'lucide-react';
import { AppPage } from '../types';
import AppLogo from './AppLogo';
import { PolicyTab } from './PolicyModal';

interface FooterProps {
  onNavigate: (page: AppPage) => void;
  onOpenPolicy: (type: PolicyTab) => void;
  onOpenBuyCoffee: () => void;
}

export default function Footer({
  onNavigate,
  onOpenPolicy,
  onOpenBuyCoffee,
}: FooterProps) {
  const linkClass =
    'cursor-pointer text-sm text-[#4A433A] hover:text-[#9A4319] transition-colors text-left';

  return (
    <footer className="border-t border-[#DDD2BC] bg-[#FAF4E8]/94 text-[#4A433A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-4">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="cursor-pointer flex items-center gap-2.5 text-left"
            >
              <span className="w-9 h-9 rounded-xl bg-[#FFFDF8] border border-[#DDD2BC] text-[#1E1B18] flex items-center justify-center shrink-0">
                <AppLogo size={24} variant="brand" />
              </span>
              <span className="text-base font-bold tracking-tight text-[#1E1B18]">
                Human Handwriting AI
              </span>
            </button>

            <p className="text-sm leading-relaxed max-w-sm text-[#4A433A]">
              Free browser-private digital penmanship studio with 19 scripts, 23 custom notebook rulings, Margin Guides, and print-ready A4 PDF export. Voluntary coffee tips support Plenty.
            </p>

            <div className="flex items-center gap-3 pt-1 flex-wrap">
              <a
                href="https://github.com/plenty"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold bg-[#FFFDF8] hover:bg-[#EFE5D3] border border-[#D7CCB5] text-[#1E1B18] transition-colors"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  />
                </svg>
                <span>Follow Plenty</span>
              </a>

              <button
                type="button"
                onClick={onOpenBuyCoffee}
                className="cursor-pointer px-4 py-2 rounded-xl text-xs font-semibold border border-[#E2C2A8] bg-[#F6EBE0] hover:bg-[#EDD9C5] text-[#8F3D15] inline-flex items-center gap-1.5 transition-colors"
              >
                <Coffee className="w-3.5 h-3.5" />
                <span>Buy Plenty a Coffee (UPI &amp; Bitcoin)</span>
              </button>
            </div>
          </div>

          {/* Product Column */}
          <div className="md:col-span-2 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1E1B18]">
              Studio
            </h3>
            <ul className="space-y-2.5 flex flex-col items-start">
              <li>
                <button type="button" onClick={() => onNavigate('editor')} className={linkClass}>
                  Handwriting Editor
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('features')} className={linkClass}>
                  Features
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('styles')} className={linkClass}>
                  Handwriting Styles
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('papers')} className={linkClass}>
                  Paper Templates
                </button>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div className="md:col-span-2 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1E1B18]">
              Resources
            </h3>
            <ul className="space-y-2.5 flex flex-col items-start">
              <li>
                <button type="button" onClick={() => onNavigate('tools')} className={linkClass}>
                  Tools Directory
                </button>
              </li>
              <li>
                <button type="button" onClick={onOpenBuyCoffee} className={linkClass}>
                  Tip / Buy Coffee
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('faq')} className={linkClass}>
                  FAQ &amp; Help
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Support Column */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1E1B18]">
              Company &amp; Policies
            </h3>
            <ul className="space-y-2.5 flex flex-col items-start">
              <li>
                <button
                  type="button"
                  onClick={() => onOpenPolicy('about')}
                  className={linkClass}
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenPolicy('contact')}
                  className={linkClass}
                >
                  Contact &amp; Support
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenPolicy('privacy')}
                  className={linkClass}
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenPolicy('terms')}
                  className={linkClass}
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenPolicy('copyright')}
                  className={linkClass}
                >
                  Copyright &amp; Font Credits
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[#DDD2BC] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#6E655A]">
          <span>&copy; 2026 Human Handwriting AI · Created by Plenty.</span>
          <span>Browser-Private Rendering · SIL Open Font &amp; Procedural Paper Credits</span>
        </div>
      </div>
    </footer>
  );
}
