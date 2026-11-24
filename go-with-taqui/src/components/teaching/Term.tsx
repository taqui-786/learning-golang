import React, { useState, useRef, useEffect } from 'react';
import { getTerm, GLOSSARY, GlossaryTerm } from '../../data/glossary';
import { SketchIcon } from '../Icons';

interface TermProps {
  id: string;
  children?: React.ReactNode;
  className?: string;
}

export function Term({ id, children, className = '' }: TermProps) {
  const term = getTerm(id);
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  if (!term) {
    return <span className={className}>{children || id}</span>;
  }

  const displayText = children || term.name;

  return (
    <span className="relative inline-block" ref={popoverRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        onMouseEnter={() => setIsOpen(true)}
        className={`font-mono font-bold text-tealDeep bg-tealSoft/60 hover:bg-yellowHi border-b-2 border-dashed border-tealDeep/80 px-1.5 py-0.5 rounded-md inline-flex items-center gap-1 cursor-help transition-colors text-inherit ${className}`}
        aria-expanded={isOpen}
        aria-label={`Definition for ${term.name}`}
      >
        <span>{displayText}</span>
        <span className="text-[10px] text-tealDeep/70 font-sans" aria-hidden="true">💡</span>
      </button>

      {isOpen && (
        <div
          role="tooltip"
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 sm:w-80 p-4 bg-[#FFFDF7] border-2 border-ink rounded-2xl shadow-[4px_4px_0px_#222] text-left animate-in fade-in zoom-in-95 duration-150"
          onMouseLeave={() => setIsOpen(false)}
        >
          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[2px] w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-ink" />
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[4px] w-0 h-0 border-x-7 border-x-transparent border-t-7 border-t-[#FFFDF7]" />

          {/* Header */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b-2 border-dashed border-ink/20">
            <div className="flex items-center gap-1.5">
              <span className="font-display font-black text-sm text-ink">{term.name}</span>
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-tealSoft text-tealDeep border border-ink/40">
                {term.category}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-ink/60 hover:text-ink text-xs font-bold px-1"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* Plain English */}
          <div className="space-y-2 text-xs sm:text-sm">
            <div>
              <div className="text-[11px] font-display font-extrabold text-tealDeep uppercase tracking-wide">
                👶 In Plain English
              </div>
              <p className="font-hand text-base text-ink leading-snug mt-0.5">
                {term.plainEnglish}
              </p>
            </div>

            {/* Real Life Analogy */}
            <div className="bg-yellowSoft/70 p-2 rounded-xl border border-ink/40">
              <div className="text-[10px] font-display font-black text-ink/75 uppercase tracking-wide flex items-center gap-1">
                <span>🧠</span> Real-World Picture
              </div>
              <p className="font-hand text-sm text-ink leading-snug mt-0.5">
                {term.analogy}
              </p>
            </div>

            {/* JS Bridge */}
            <div className="bg-paper border border-ink/30 p-2 rounded-xl">
              <div className="text-[10px] font-display font-black text-ink/75 uppercase tracking-wide flex items-center gap-1">
                <span>⚡</span> JavaScript Bridge
              </div>
              <p className="font-mono text-[11px] text-ink/90 leading-tight mt-0.5">
                {term.jsEquivalent}
              </p>
            </div>
          </div>
        </div>
      )}
    </span>
  );
}

interface PageGlossaryDrawerProps {
  termIds: string[];
}

export function PageGlossaryDrawer({ termIds }: PageGlossaryDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const terms = termIds
    .map((id) => getTerm(id))
    .filter((t): t is GlossaryTerm => Boolean(t));

  const filtered = terms.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.plainEnglish.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="sketch-btn bg-yellowHi px-3.5 py-1.5 font-display text-xs sm:text-sm font-extrabold inline-flex items-center gap-2 hover:bg-yellowSoft"
      >
        <SketchIcon name="book" className="w-4 h-4 text-ink" />
        <span>Page Dictionary ({terms.length} Terms)</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="sketch-box bg-[#FAF9F2] w-full max-w-2xl max-h-[85vh] flex flex-col p-5 sm:p-6 space-y-4"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between pb-3 border-b-2 border-ink">
              <div className="flex items-center gap-2">
                <span className="text-xl">📖</span>
                <h3 className="font-display font-black text-xl text-ink">
                  Page Vocabulary & Mental Models
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="sketch-btn bg-paper px-3 py-1 font-display text-sm font-bold"
              >
                Close ✕
              </button>
            </div>

            <p className="text-sm font-hand text-ink/80">
              Never get stuck on jargon! Every single term on this page is explained below in simple 8th-grade English.
            </p>

            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search words on this page..."
              className="w-full bg-paper border-2 border-ink rounded-xl px-3 py-2 text-sm font-hand"
            />

            <div className="overflow-y-auto space-y-3 pr-1 max-h-[55vh]">
              {filtered.map((t) => (
                <div
                  key={t.id}
                  className="bg-[#FFFDF7] border-2 border-ink rounded-xl p-3.5 space-y-2 shadow-[2px_2px_0px_#222]"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display font-extrabold text-base text-tealDeep">
                      {t.name}
                    </span>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-tealSoft text-tealDeep border border-ink/40">
                      {t.category}
                    </span>
                  </div>
                  <p className="text-sm font-hand text-ink leading-snug">
                    👉 {t.plainEnglish}
                  </p>
                  <div className="bg-yellowSoft/60 p-2 rounded-lg text-xs font-hand text-ink/90 border border-ink/20">
                    <strong>Analogy:</strong> {t.analogy}
                  </div>
                  <div className="bg-paper p-1.5 rounded-lg text-[11px] font-mono text-ink/80 border border-ink/20">
                    <strong>JS Bridge:</strong> {t.jsEquivalent}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
