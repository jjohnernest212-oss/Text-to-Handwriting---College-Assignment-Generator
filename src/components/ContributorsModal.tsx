import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  GitPullRequest,
  GitCommit,
  Star,
  GitFork,
  Heart,
  Sparkles,
  Upload,
  RotateCcw,
  Camera,
  Check,
} from 'lucide-react';

interface ContributorsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface Contributor {
  id: string;
  name: string;
  handle: string;
  role: string;
  avatarType: 'plenty' | 'saurabh' | 'ruth';
  bio: string;
  commits: number;
  pullRequests: number;
  featuredBadge: string;
  highlights: string[];
  isHighlighted?: boolean;
}

export const CONTRIBUTORS: Contributor[] = [
  {
    id: 'plenty',
    name: 'Plenty',
    handle: '@plenty',
    role: 'Core Feature Architect & Lead Contributor',
    avatarType: 'plenty',
    bio: 'Passionate developer dedicated to authentic handwriting realism, ink smudge physics, unlimited multi-page generation, and Indian UPI student tipping.',
    commits: 148,
    pullRequests: 14,
    featuredBadge: 'CORE ARCHITECT',
    highlights: [
      'Engineered realistic Ink Blot & Smudge simulation overlay',
      'Architected unlimited multi-page pagination & auto-split',
      'Integrated PhonePe & UPI scanner with instant tipping flow',
      'Calibrated 300-DPI multi-page PDF generation pipeline',
    ],
    isHighlighted: true,
  },
  {
    id: 'saurabh',
    name: 'Saurabh Daware',
    handle: '@saurabhdaware',
    role: 'Original Creator & Founder',
    avatarType: 'saurabh',
    bio: 'Original creator of the open-source Text-to-Handwriting tool that went viral globally, saving millions of students countless hours of handwritten homework.',
    commits: 342,
    pullRequests: 38,
    featuredBadge: 'FOUNDER',
    highlights: [
      'Invented line-height synchronized CSS ruled paper lines',
      'Implemented browser-native dynamic FontFace() loader',
      'Pioneered initial multi-page assignment rendering',
    ],
  },
  {
    id: 'ruth',
    name: 'Ruth Queen',
    handle: '@ruthqueen',
    role: 'Design Systems & Mobile UX Contributor',
    avatarType: 'ruth',
    bio: 'Frontend engineer focused on technical workbench aesthetics, responsive mobile drawer navigation, camera QR access, and high-DPI canvas rasterization.',
    commits: 96,
    pullRequests: 11,
    featuredBadge: 'DESIGN SYSTEMS',
    highlights: [
      'Crafted Technical Scribe Edition dark theme & typography',
      'Built mobile access camera QR scanner modal',
      'Optimized printable A4 paper ratios & layout physics',
    ],
  },
];

// Native inline SVG badge for Plenty - 100% reliable, zero network latency, never fails to load
function PlentyDefaultAvatarSvg({ className = '' }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 400 520"
      className={`w-full h-full select-none ${className}`}
    >
      <rect width="400" height="520" fill="#08080a" rx="16" />
      <rect x="2" y="2" width="396" height="516" fill="none" stroke="#27272a" strokeWidth="2" rx="14" />
      
      {/* Top Tag < > */}
      <text
        x="200"
        y="140"
        fill="#f4f4f5"
        fontFamily="'JetBrains Mono', 'Courier New', monospace"
        fontSize="42"
        fontWeight="700"
        textAnchor="middle"
        letterSpacing="6"
      >
        &lt; &gt;
      </text>
      
      {/* Middle Line 1: I l♡ve */}
      <text
        x="200"
        y="235"
        fontFamily="'JetBrains Mono', 'Courier New', monospace"
        fontSize="50"
        fontWeight="700"
        textAnchor="middle"
        letterSpacing="3"
      >
        <tspan fill="#ffffff">I </tspan>
        <tspan fill="#ea580c">l</tspan>
        <tspan fill="#ea580c">♡</tspan>
        <tspan fill="#ea580c">ve</tspan>
      </text>
      
      {/* Middle Line 2: coding */}
      <text
        x="200"
        y="320"
        fill="#f4f4f5"
        fontFamily="'JetBrains Mono', 'Courier New', monospace"
        fontSize="50"
        fontWeight="700"
        textAnchor="middle"
        letterSpacing="2"
      >
        coding
      </text>
      
      {/* Bottom Tag </ > */}
      <text
        x="200"
        y="410"
        fill="#f4f4f5"
        fontFamily="'JetBrains Mono', 'Courier New', monospace"
        fontSize="42"
        fontWeight="700"
        textAnchor="middle"
        letterSpacing="6"
      >
        &lt;/ &gt;
      </text>
    </svg>
  );
}

export default function ContributorsModal({ isOpen, onClose }: ContributorsModalProps) {
  const [customAvatar, setCustomAvatar] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load custom avatar from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('scribe_contributor_plenty_avatar');
      if (saved) {
        setCustomAvatar(saved);
      }
    } catch {
      // ignore localStorage errors
    }
  }, []);

  const handleAvatarFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        setCustomAvatar(dataUrl);
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 2500);
        try {
          localStorage.setItem('scribe_contributor_plenty_avatar', dataUrl);
        } catch {
          // ignore
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetAvatar = () => {
    setCustomAvatar(null);
    try {
      localStorage.removeItem('scribe_contributor_plenty_avatar');
    } catch {
      // ignore
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleAvatarFile(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto select-none">
      <div className="bg-[#0c0c0e] rounded-xl shadow-2xl border border-[#27272a] max-w-2xl w-full flex flex-col my-6 max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-[#27272a] bg-[#121214] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-[#6366f1]/20 border border-[#6366f1]/40 text-[#6366f1] flex items-center justify-center font-bold">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </div>
            <div>
              <h2 className="font-syne text-base sm:text-lg font-extrabold uppercase text-white tracking-tight flex items-center gap-2">
                <span>GitHub Contributors</span>
                <span className="bg-[#6366f1]/20 text-[#6366f1] text-[10px] font-mono-code px-2 py-0.5 rounded border border-[#6366f1]/30">
                  3 ACTIVE
                </span>
              </h2>
              <p className="font-mono-code text-[10px] text-[#e4e4e7]/50 tracking-wider uppercase">
                The Open Source Engineering Team Behind The Scribe Engine
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer p-1.5 rounded text-[#e4e4e7]/60 hover:text-white hover:bg-[#18181b] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Repository Stats Banner */}
        <div className="bg-[#18181b] border-b border-[#27272a] px-5 sm:px-6 py-2.5 flex items-center justify-between text-[11px] font-mono-code text-[#e4e4e7]/70 flex-wrap gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <strong className="text-white">4.9k</strong> Stars
            </span>
            <span className="flex items-center gap-1.5 text-[#6366f1]">
              <GitFork className="w-3.5 h-3.5" />
              <strong className="text-white">1.3k</strong> Forks
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <GitCommit className="w-3.5 h-3.5" />
              <strong className="text-white">580+</strong> Commits
            </span>
          </div>

          <div className="text-[10px] text-zinc-500 uppercase tracking-widest hidden sm:inline">
            handwrite.ai.com // 100% Open Source
          </div>
        </div>

        {/* Contributors List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {CONTRIBUTORS.map((contributor) => (
            <div
              key={contributor.id}
              className={`rounded-xl border p-4 sm:p-5 transition-all relative overflow-hidden ${
                contributor.isHighlighted
                  ? 'bg-[#141418] border-[#6366f1]/60 ring-1 ring-[#6366f1]/30 shadow-xl'
                  : 'bg-[#18181b] border-[#27272a] hover:border-[#3f3f46]'
              }`}
            >
              {/* Highlight ribbon for Plenty */}
              {contributor.isHighlighted && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-[#6366f1] to-indigo-700 text-white font-mono-code text-[9px] font-extrabold px-3 py-0.5 rounded-bl-lg uppercase tracking-wider flex items-center gap-1 shadow-sm">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>CORE ARCHITECT</span>
                </div>
              )}

              <div className="flex items-start gap-4 flex-col sm:flex-row">
                {/* Profile Image Column */}
                <div className="flex-shrink-0 flex flex-col items-center gap-2">
                  {contributor.avatarType === 'plenty' ? (
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleDrop}
                      className={`w-24 h-32 sm:w-28 sm:h-36 rounded-lg overflow-hidden border-2 shadow-lg relative group bg-black transition-all flex flex-col items-center justify-center ${
                        isDragging
                          ? 'border-[#6366f1] ring-2 ring-[#6366f1]/50 scale-105'
                          : 'border-orange-500/70 hover:border-orange-400'
                      }`}
                      title="Plenty profile avatar - Drop or click to change profile photo"
                    >
                      {/* Avatar Render: Custom Image or Inline Native SVG */}
                      {customAvatar ? (
                        <img
                          src={customAvatar}
                          alt="Plenty profile avatar"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center p-1 bg-[#08080a]">
                          <PlentyDefaultAvatarSvg />
                        </div>
                      )}

                      {/* Tag bar */}
                      <div className="absolute bottom-0 inset-x-0 bg-black/85 py-1 text-center text-[9px] font-mono-code font-bold text-orange-400 border-t border-orange-500/30 flex items-center justify-center gap-1">
                        <span>&lt;/&gt; CODER</span>
                      </div>

                      {/* Hover action overlay to change/upload avatar */}
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 p-2 text-center cursor-pointer"
                      >
                        <Camera className="w-5 h-5 text-orange-400" />
                        <span className="text-[10px] font-mono-code text-white font-bold leading-tight">
                          Change Photo
                        </span>
                        <span className="text-[8px] font-mono-code text-[#e4e4e7]/60">
                          (PNG/JPG/SVG)
                        </span>
                      </div>
                    </div>
                  ) : contributor.avatarType === 'saurabh' ? (
                    <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-lg bg-zinc-900 border border-[#27272a] flex flex-col items-center justify-center text-center p-2">
                      <div className="w-12 h-12 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center text-xl font-bold font-syne mb-1">
                        SD
                      </div>
                      <span className="font-mono-code text-[9px] text-[#e4e4e7]/50 uppercase">Founder</span>
                    </div>
                  ) : (
                    <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-lg bg-zinc-900 border border-[#27272a] flex flex-col items-center justify-center text-center p-2">
                      <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-xl font-bold font-syne mb-1">
                        RQ
                      </div>
                      <span className="font-mono-code text-[9px] text-[#e4e4e7]/50 uppercase">Designer</span>
                    </div>
                  )}

                  {/* Plenty Avatar Upload & Reset Controls */}
                  {contributor.avatarType === 'plenty' && (
                    <div className="flex flex-col items-center gap-1 w-full">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="cursor-pointer w-full py-1 px-1.5 rounded bg-[#18181b] hover:bg-[#222226] border border-[#27272a] hover:border-orange-500/50 text-[9px] font-mono-code text-[#e4e4e7] flex items-center justify-center gap-1 transition-all"
                        title="Upload your own profile picture file"
                      >
                        <Upload className="w-2.5 h-2.5 text-orange-400" />
                        <span>Upload Photo</span>
                      </button>

                      {customAvatar && (
                        <button
                          onClick={handleResetAvatar}
                          className="cursor-pointer w-full py-0.5 px-1 rounded hover:bg-rose-950/30 text-[8px] font-mono-code text-rose-400/80 hover:text-rose-300 flex items-center justify-center gap-1 transition-all"
                          title="Reset to default I love coding badge"
                        >
                          <RotateCcw className="w-2 h-2" />
                          <span>Reset Default</span>
                        </button>
                      )}

                      {uploadSuccess && (
                        <span className="text-[9px] font-mono-code text-emerald-400 flex items-center gap-0.5 animate-in fade-in">
                          <Check className="w-2.5 h-2.5" />
                          <span>Photo Loaded!</span>
                        </span>
                      )}

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleAvatarFile(file);
                            e.target.value = '';
                          }
                        }}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>

                {/* Contributor Details */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-syne text-base sm:text-lg font-bold text-white tracking-tight">
                      {contributor.name}
                    </h3>
                    <span className="font-mono-code text-xs text-[#6366f1] font-semibold">
                      {contributor.handle}
                    </span>
                    <span className="bg-[#27272a] text-[#e4e4e7]/80 text-[10px] font-mono-code px-2 py-0.5 rounded uppercase">
                      {contributor.featuredBadge}
                    </span>
                    {contributor.id === 'plenty' && customAvatar && (
                      <span className="bg-orange-500/20 text-orange-400 text-[9px] font-mono-code px-1.5 py-0.5 rounded border border-orange-500/30">
                        CUSTOM PROFILE LOADED
                      </span>
                    )}
                  </div>

                  <p className="font-mono-code text-xs text-[#6366f1] font-medium">
                    {contributor.role}
                  </p>

                  <p className="text-xs text-[#e4e4e7]/80 leading-relaxed font-sans">
                    {contributor.bio}
                  </p>

                  {/* Highlights list */}
                  <div className="pt-1.5 space-y-1">
                    <div className="font-mono-code text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">
                      Key Engineering Additions:
                    </div>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] font-mono-code text-[#e4e4e7]/70">
                      {contributor.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-[#6366f1] mt-0.5">›</span>
                          <span className="truncate">{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Commits & PRs Stats */}
                  <div className="pt-2 flex items-center gap-4 text-[10px] font-mono-code text-[#e4e4e7]/60">
                    <span className="flex items-center gap-1">
                      <GitCommit className="w-3 h-3 text-[#6366f1]" />
                      <strong>{contributor.commits}</strong> commits
                    </span>
                    <span className="flex items-center gap-1">
                      <GitPullRequest className="w-3 h-3 text-emerald-400" />
                      <strong>{contributor.pullRequests}</strong> PRs merged
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-3.5 border-t border-[#27272a] bg-[#121214] flex items-center justify-between font-mono-code text-xs">
          <div className="text-[11px] text-[#e4e4e7]/50 flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>Built with passion by the open-source community</span>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer px-4 py-1.5 bg-[#6366f1] hover:bg-[#4f46e5] text-white text-xs font-bold rounded transition-colors uppercase"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}
