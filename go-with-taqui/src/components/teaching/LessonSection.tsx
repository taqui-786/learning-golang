import React from 'react';

export interface LessonSectionProps {
  chapterNumber: number;
  title: string;
  badge?: string;
  plainEnglish: string;
  analogy: string;
  labSlot: React.ReactNode;
  codeSlot: React.ReactNode;
  checkSlot: React.ReactNode;
}

export function LessonSection({
  chapterNumber,
  title,
  badge,
  plainEnglish,
  analogy,
  labSlot,
  codeSlot,
  checkSlot,
}: LessonSectionProps) {
  return (
    <section className="space-y-6 pt-6 first:pt-0 border-t-4 border-dashed border-ink/20 first:border-t-0">
      {/* Chapter Title & Header */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs font-black uppercase px-2.5 py-0.5 rounded-full bg-tealDeep text-paper">
            Chapter {chapterNumber}
          </span>
          {badge && (
            <span className="font-display font-extrabold text-xs px-2.5 py-0.5 rounded-full bg-yellowHi border border-ink text-ink shadow-[1px_1px_0px_#222]">
              {badge}
            </span>
          )}
        </div>
        <h3 className="font-display font-black text-2xl sm:text-3xl text-ink leading-tight">
          {title}
        </h3>
      </div>

      {/* Micro-block A: Simple Meaning + Analogy Card */}
      <div className="sketch-box-yellow p-4 sm:p-5 space-y-2 shadow-[3px_3px_0px_#222]">
        <div className="text-xs font-display font-black text-tealDeep uppercase tracking-wider flex items-center gap-1.5">
          <span>💡</span> The Core Idea in 30 Seconds
        </div>
        <p className="font-hand text-lg sm:text-xl text-ink leading-snug">
          {plainEnglish}
        </p>
        <div className="bg-paper/90 p-2.5 rounded-xl border border-ink/30 text-sm font-hand text-ink/90 flex items-start gap-2">
          <span className="text-base">🧠</span>
          <span><strong>Mental Picture:</strong> {analogy}</span>
        </div>
      </div>

      {/* Micro-block B: Interactive Story Lab */}
      <div className="space-y-2">
        <div className="font-display font-extrabold text-sm text-tealDeep flex items-center gap-1.5">
          <span>🧪</span> Visual Step-by-Step Lab
        </div>
        {labSlot}
      </div>

      {/* Micro-block C: Line-by-Line Interactive Code Card */}
      <div className="space-y-2">
        <div className="font-display font-extrabold text-sm text-tealDeep flex items-center gap-1.5">
          <span>📜</span> Real Go Code Breakdown
        </div>
        {codeSlot}
      </div>

      {/* Micro-block D: 1-Question Micro-Check */}
      <div className="space-y-2">
        {checkSlot}
      </div>
    </section>
  );
}
