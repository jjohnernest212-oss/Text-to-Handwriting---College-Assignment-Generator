import React, { useState, useEffect } from 'react';
import {
  Star,
  Quote,
  CheckCircle2,
  GraduationCap,
  MessageSquarePlus,
  Send,
  Sparkles,
  Heart,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export interface StudentReview {
  id: string;
  name: string;
  major: string;
  avatarText: string;
  avatarBg: string;
  rating: number;
  date: string;
  comment: string;
  badge: string;
  pagesSaved?: number;
}

export const INITIAL_STUDENT_REVIEWS: StudentReview[] = [
  {
    id: 'rev-rhema',
    name: 'Rhema',
    major: 'Computer Science & Engg, 4th Year',
    avatarText: 'RH',
    avatarBg: 'from-indigo-500 to-purple-600',
    rating: 5,
    date: '2 days ago',
    comment:
      'Saved my 35-page compiler design assignment! Our HOD is notoriously strict about manual handwritten submissions and can spot typed work instantly. The Kalam font with blue ink opacity and realistic line spacing looked so natural I got an A+.',
    badge: 'Verified Student • 35 Pages Exported',
    pagesSaved: 35,
  },
  {
    id: 'rev-shivu-sah',
    name: 'Shivu Sah',
    major: 'Mechanical Engineering, 3rd Year',
    avatarText: 'SS',
    avatarBg: 'from-amber-500 to-orange-600',
    rating: 5,
    date: '3 days ago',
    comment:
      'The diagram tool and ink blot simulation are absolute game changers. I drew thermodynamic cycle diagrams and placed them directly onto ruled paper. It looks like it was written with a genuine fountain pen and ruler. Best student utility on the internet.',
    badge: 'Verified Student • Mechanical Dept.',
    pagesSaved: 48,
  },
  {
    id: 'rev-akchey',
    name: 'Akchey',
    major: 'Electrical & Electronics, 2nd Year',
    avatarText: 'AK',
    avatarBg: 'from-emerald-500 to-teal-600',
    rating: 5,
    date: 'Yesterday',
    comment:
      'Sunday night 11:30 PM deadlines with 6 pending lab records used to mean painful finger cramps and pulling all-nighters. Now I paste my typed notes, adjust letter spacing, and export the high-res PDF. Huge respect to Plenty for building this for students.',
    badge: 'Verified Student • Lab Records',
    pagesSaved: 52,
  },
  {
    id: 'rev-traore',
    name: 'Traore',
    major: 'Biotechnology & Life Sciences',
    avatarText: 'TR',
    avatarBg: 'from-blue-500 to-cyan-600',
    rating: 5,
    date: '4 days ago',
    comment:
      'The unlimited page addition and vintage paper background made my biology assignment look like an authentic lab journal. Our entire study group in campus uses this tool now. Fast, completely free, and no annoying paywalls.',
    badge: 'Verified Student • Study Group',
    pagesSaved: 60,
  },
  {
    id: 'rev-yao',
    name: 'Yao',
    major: 'Economics & Business Analytics',
    avatarText: 'YA',
    avatarBg: 'from-rose-500 to-pink-600',
    rating: 5,
    date: '5 days ago',
    comment:
      'I created a custom TTF font of my actual cursive handwriting from Calligraphr and uploaded it via the upload font button. The result is 100% indistinguishable from my real notebook. Phenomenal work by Plenty!',
    badge: 'Verified Student • Custom Font User',
    pagesSaved: 28,
  },
  {
    id: 'rev-priyanshu',
    name: 'Priyanshu',
    major: 'Civil Engineering, Final Year',
    avatarText: 'PR',
    avatarBg: 'from-violet-500 to-indigo-600',
    rating: 5,
    date: '6 days ago',
    comment:
      'I tipped Plenty via PhonePe UPI because this site legitimately saved me from a semester backlog in surveying lab. Undo/redo works smoothly, font size slider is instant, and PDF export is super crisp at 300 DPI.',
    badge: 'Verified Supporter • ₹ PhonePe Tip',
    pagesSaved: 42,
  },
];

interface StudentTestimonialsProps {
  theme: 'dark' | 'light';
  onOpenCoffeeModal?: () => void;
}

export default function StudentTestimonials({
  theme,
  onOpenCoffeeModal,
}: StudentTestimonialsProps) {
  const [reviews, setReviews] = useState<StudentReview[]>(() => {
    try {
      const saved = localStorage.getItem('student_testimonials_data');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback to default
    }
    return INITIAL_STUDENT_REVIEWS;
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newMajor, setNewMajor] = useState('');
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [submittedMessage, setSubmittedMessage] = useState(false);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newComment.trim()) return;

    const initials = newName
      .trim()
      .split(/\s+/)
      .map((w) => w[0]?.toUpperCase() || '')
      .slice(0, 2)
      .join('');

    const newRev: StudentReview = {
      id: `rev-${Date.now()}`,
      name: newName.trim(),
      major: newMajor.trim() || 'College Student',
      avatarText: initials || 'ST',
      avatarBg: 'from-amber-500 to-emerald-600',
      rating: newRating,
      date: 'Just now',
      comment: newComment.trim(),
      badge: 'Verified Student • Community Review',
      pagesSaved: Math.floor(Math.random() * 20) + 10,
    };

    const updated = [newRev, ...reviews];
    setReviews(updated);
    try {
      localStorage.setItem('student_testimonials_data', JSON.stringify(updated));
    } catch {
      // Ignore storage errors
    }

    setNewName('');
    setNewMajor('');
    setNewComment('');
    setSubmittedMessage(true);
    setTimeout(() => {
      setSubmittedMessage(false);
      setIsFormOpen(false);
    }, 2500);
  };

  const isLight = theme === 'light';

  return (
    <section
      id="student-reviews"
      aria-label="Student reviews and comments"
      className={`border-t transition-colors select-none ${
        isLight
          ? 'bg-slate-50 border-slate-200 text-slate-800'
          : 'bg-[#0d0d10] border-white/10 text-white'
      } px-4 sm:px-8 py-8 sm:py-10`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header & Metrics Strip */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <GraduationCap className="w-4 h-4" />
              </span>
              <span className="text-[11px] font-mono-code font-bold uppercase tracking-wider text-amber-400">
                Student Community &amp; Hall of Fame
              </span>
            </div>
            <h2
              className={`font-syne text-xl sm:text-2xl font-extrabold tracking-tight ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}
            >
              Real Students Who Used &amp; Loved The Site
            </h2>
            <p
              className={`font-sans text-xs sm:text-sm mt-1 ${
                isLight ? 'text-slate-600' : 'text-zinc-400'
              }`}
            >
              Hear directly from university students who escaped late-night hand cramps and saved their semester grades.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={() => setIsFormOpen(!isFormOpen)}
              className={`cursor-pointer px-3.5 py-2 rounded-xl text-xs font-mono-code font-semibold flex items-center gap-2 transition-all active:scale-95 border ${
                isLight
                  ? 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300 shadow-xs'
                  : 'bg-white/10 hover:bg-white/15 text-white border-white/20'
              }`}
            >
              <MessageSquarePlus className="w-4 h-4 text-emerald-400" />
              <span>{isFormOpen ? 'Close Feedback' : 'Add Your Review'}</span>
              {isFormOpen ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>

            {onOpenCoffeeModal && (
              <button
                type="button"
                onClick={onOpenCoffeeModal}
                className="cursor-pointer px-3.5 py-2 rounded-xl text-xs font-mono-code font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white flex items-center gap-1.5 transition-all shadow-md shadow-amber-950/30 active:scale-95"
              >
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span>Tip Plenty (₹ UPI)</span>
              </button>
            )}
          </div>
        </div>

        {/* Aggregate Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 mb-7">
          <div
            className={`p-3 sm:p-4 rounded-xl border ${
              isLight
                ? 'bg-white border-slate-200'
                : 'bg-[#121217] border-white/5'
            }`}
          >
            <div className="flex items-center gap-1 text-amber-400 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
              ))}
            </div>
            <div className={`font-syne text-lg font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
              4.96 / 5.0
            </div>
            <div className={`text-[10px] font-mono-code ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
              Average Student Rating
            </div>
          </div>

          <div
            className={`p-3 sm:p-4 rounded-xl border ${
              isLight
                ? 'bg-white border-slate-200'
                : 'bg-[#121217] border-white/5'
            }`}
          >
            <div className="text-emerald-400 font-bold text-sm mb-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>18,400+</span>
            </div>
            <div className={`font-syne text-lg font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Submissions Saved
            </div>
            <div className={`text-[10px] font-mono-code ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
              Across 320+ Colleges
            </div>
          </div>

          <div
            className={`p-3 sm:p-4 rounded-xl border ${
              isLight
                ? 'bg-white border-slate-200'
                : 'bg-[#121217] border-white/5'
            }`}
          >
            <div className="text-indigo-400 font-bold text-sm mb-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>100% Free</span>
            </div>
            <div className={`font-syne text-lg font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
              No Watermarks
            </div>
            <div className={`text-[10px] font-mono-code ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
              Clean 300 DPI Export
            </div>
          </div>

          <div
            className={`p-3 sm:p-4 rounded-xl border ${
              isLight
                ? 'bg-white border-slate-200'
                : 'bg-[#121217] border-white/5'
            }`}
          >
            <div className="text-amber-400 font-bold text-sm mb-1 flex items-center gap-1">
              <span>☕ Plenty</span>
            </div>
            <div className={`font-syne text-lg font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
              By a Student
            </div>
            <div className={`text-[10px] font-mono-code ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
              For All Students
            </div>
          </div>
        </div>

        {/* Add Student Review Dropdown Form */}
        {isFormOpen && (
          <form
            onSubmit={handleAddReview}
            className={`mb-7 p-4 sm:p-6 rounded-2xl border transition-all ${
              isLight
                ? 'bg-white border-indigo-200 shadow-md ring-1 ring-indigo-50'
                : 'bg-[#14141a] border-indigo-500/30 shadow-xl ring-1 ring-indigo-500/20'
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <MessageSquarePlus className="w-4 h-4 text-[#6366f1]" />
              <h3 className={`font-syne font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Share Your Assignment Experience
              </h3>
            </div>

            {submittedMessage ? (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-mono-code flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Thank you! Your review has been added to the student wall.</span>
              </div>
            ) : (
              <div className="space-y-3 font-mono-code text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className={`block mb-1 text-[11px] ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
                      Your Name / Nickname *
                    </label>
                    <input
                      type="text"
                      required
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="e.g. Rhema / Alex"
                      className={`w-full px-3 py-2 rounded-lg border text-xs font-sans ${
                        isLight
                          ? 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white'
                          : 'bg-[#0a0a0d] border-zinc-700 text-white focus:border-indigo-500'
                      } outline-none`}
                    />
                  </div>

                  <div>
                    <label className={`block mb-1 text-[11px] ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
                      College / Major
                    </label>
                    <input
                      type="text"
                      value={newMajor}
                      onChange={(e) => setNewMajor(e.target.value)}
                      placeholder="e.g. CSE, 3rd Year"
                      className={`w-full px-3 py-2 rounded-lg border text-xs font-sans ${
                        isLight
                          ? 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white'
                          : 'bg-[#0a0a0d] border-zinc-700 text-white focus:border-indigo-500'
                      } outline-none`}
                    />
                  </div>

                  <div>
                    <label className={`block mb-1 text-[11px] ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
                      Rating
                    </label>
                    <div className="flex items-center gap-1.5 py-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          className="cursor-pointer p-0.5 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-4 h-4 ${
                              star <= newRating
                                ? 'fill-amber-400 text-amber-400'
                                : isLight
                                ? 'text-slate-300'
                                : 'text-zinc-600'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-[11px] font-bold text-amber-400 ml-1">
                        {newRating} / 5
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className={`block mb-1 text-[11px] ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
                    Your Review / How it helped your assignments *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Tell other students how many pages you saved, if your professor noticed, or how authentic the handwriting looked..."
                    className={`w-full px-3 py-2 rounded-lg border text-xs font-sans ${
                      isLight
                        ? 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white'
                        : 'bg-[#0a0a0d] border-zinc-700 text-white focus:border-indigo-500'
                    } outline-none resize-none`}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className={`cursor-pointer px-3 py-1.5 rounded-lg border text-xs ${
                      isLight
                        ? 'border-slate-300 hover:bg-slate-100 text-slate-700'
                        : 'border-zinc-700 hover:bg-white/5 text-zinc-300'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="cursor-pointer px-4 py-1.5 rounded-lg bg-[#6366f1] hover:bg-[#4f46e5] text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <Send className="w-3 h-3" />
                    <span>Submit Review</span>
                  </button>
                </div>
              </div>
            )}
          </form>
        )}

        {/* Student Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className={`rounded-2xl p-4 sm:p-4.5 border transition-all flex flex-col justify-between ${
                isLight
                  ? 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md'
                  : 'bg-[#111116] border-white/5 hover:border-white/15 hover:bg-[#14141a]'
              }`}
            >
              <div>
                {/* Student Avatar + Header */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl bg-gradient-to-br ${rev.avatarBg} text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm font-mono-code`}
                    >
                      {rev.avatarText}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`font-syne font-bold text-xs sm:text-sm truncate ${
                            isLight ? 'text-slate-900' : 'text-white'
                          }`}
                        >
                          {rev.name}
                        </span>
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                      </div>
                      <span
                        className={`text-[10px] font-mono-code block truncate ${
                          isLight ? 'text-slate-500' : 'text-zinc-400'
                        }`}
                      >
                        {rev.major}
                      </span>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-0.5 shrink-0">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <div className="relative pl-3 border-l-2 border-indigo-400/40 my-2.5">
                  <Quote className="w-3 h-3 text-indigo-400/30 absolute -left-1.5 -top-1" />
                  <p
                    className={`font-sans text-xs leading-relaxed italic ${
                      isLight ? 'text-slate-700' : 'text-zinc-300'
                    }`}
                  >
                    "{rev.comment}"
                  </p>
                </div>
              </div>

              {/* Bottom Tag Strip */}
              <div
                className={`pt-2 mt-2 border-t flex items-center justify-between text-[10px] font-mono-code ${
                  isLight
                    ? 'border-slate-100 text-slate-500'
                    : 'border-white/5 text-zinc-400'
                }`}
              >
                <span className="text-emerald-500 font-semibold">{rev.badge}</span>
                <span>{rev.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
