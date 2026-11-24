import React, { useState } from 'react';
import { SketchIcon } from '../Icons';

export interface CodeAnnotation {
  line: number; // 1-based line number in goCode
  label: string; // Plain-English note for an 8th-grader
}

export interface AnnotatedCodeCardProps {
  title: string;
  goCode: string;
  annotations?: CodeAnnotation[];
  jsCode?: string;
  jsExplanation?: string;
}

export function AnnotatedCodeCard({
  title,
  goCode,
  annotations = [],
  jsCode,
  jsExplanation,
}: AnnotatedCodeCardProps) {
  const [activeTab, setActiveTab] = useState<'go' | 'js'>('go');
  const [selectedLine, setSelectedLine] = useState<number | null>(
    annotations.length > 0 ? annotations[0].line : null
  );
  const [copied, setCopied] = useState(false);

  const lines = goCode.trim().split('\n');

  const handleCopy = () => {
    const code = activeTab === 'go' ? goCode : jsCode || '';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const activeAnnotation = annotations.find((a) => a.line === selectedLine);

  return (
    <div className="sketch-box-alt bg-[#FFFDF7] p-5 sm:p-6 space-y-4">
      {/* Header & Language Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b-2 border-dashed border-ink/20">
        <div className="flex items-center gap-2">
          <span className="text-xl">💻</span>
          <h4 className="font-display font-black text-lg text-ink">{title}</h4>
        </div>

        <div className="flex items-center gap-2">
          {jsCode && (
            <div className="flex bg-paper border-2 border-ink rounded-xl p-1">
              <button
                type="button"
                onClick={() => setActiveTab('go')}
                className={`sketch-btn px-3 py-1 font-display text-xs font-bold transition-all ${
                  activeTab === 'go'
                    ? 'bg-yellowHi text-ink'
                    : 'bg-transparent border-transparent shadow-none text-ink/70'
                }`}
              >
                Go Code
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('js')}
                className={`sketch-btn px-3 py-1 font-display text-xs font-bold transition-all ${
                  activeTab === 'js'
                    ? 'bg-yellowHi text-ink'
                    : 'bg-transparent border-transparent shadow-none text-ink/70'
                }`}
              >
                JS Comparison
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={handleCopy}
            className="sketch-btn bg-paper px-3 py-1 font-display text-xs font-bold inline-flex items-center gap-1 hover:bg-tealSoft"
          >
            <SketchIcon name="copy" className="w-3.5 h-3.5" />
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Code Display Body */}
      {activeTab === 'go' ? (
        <div className="space-y-3">
          <div className="bg-[#222222] text-[#FAF9F2] rounded-xl p-3 sm:p-4 font-mono text-xs overflow-x-auto shadow-[3px_3px_0px_#222]">
            <pre className="leading-relaxed">
              {lines.map((codeText, idx) => {
                const lineNum = idx + 1;
                const hasAnnotation = annotations.some((a) => a.line === lineNum);
                const isSelected = selectedLine === lineNum;

                return (
                  <div
                    key={idx}
                    onClick={() => {
                      if (hasAnnotation) {
                        setSelectedLine(isSelected ? null : lineNum);
                      }
                    }}
                    className={`flex items-start px-2 py-0.5 rounded cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-yellowHi text-ink font-bold'
                        : hasAnnotation
                        ? 'hover:bg-white/10 text-paper'
                        : 'text-paper/85'
                    }`}
                  >
                    <span
                      className={`select-none w-6 shrink-0 text-right pr-3 text-[10px] tabular-nums ${
                        isSelected ? 'text-ink font-black' : 'text-paper/40'
                      }`}
                    >
                      {lineNum}
                    </span>
                    <span className="flex-1">{codeText || ' '}</span>
                    {hasAnnotation && !isSelected && (
                      <span className="ml-2 text-[10px] font-sans font-bold bg-tealDeep text-paper px-1.5 py-0.2 rounded-full shrink-0 select-none">
                        Tap note 💬
                      </span>
                    )}
                  </div>
                );
              })}
            </pre>
          </div>

          {/* Interactive Annotation Strip */}
          {activeAnnotation && (
            <div className="bg-yellowSoft/90 border-2 border-ink p-3.5 rounded-xl flex items-start gap-3 shadow-[2px_2px_0px_#222] animate-in fade-in duration-100">
              <span className="text-xl">👉</span>
              <div>
                <div className="font-display font-black text-xs text-tealDeep uppercase tracking-wide">
                  Line {activeAnnotation.line} Plain-English Note:
                </div>
                <p className="font-hand text-base text-ink leading-snug mt-0.5">
                  {activeAnnotation.label}
                </p>
              </div>
            </div>
          )}

          {/* Annotation List Pills */}
          {annotations.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs font-hand text-ink/80">
              <span className="font-display font-bold text-[11px] text-ink/70">
                Click lines to inspect:
              </span>
              {annotations.map((a) => (
                <button
                  key={a.line}
                  type="button"
                  onClick={() => setSelectedLine(a.line)}
                  className={`px-2 py-0.5 rounded-lg border border-ink text-xs font-mono font-bold transition-all ${
                    selectedLine === a.line
                      ? 'bg-yellowHi text-ink shadow-[1px_1px_0px_#222]'
                      : 'bg-paper text-ink/80 hover:bg-tealSoft'
                  }`}
                >
                  Line {a.line}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="bg-[#222222] text-[#FAF9F2] rounded-xl p-3 sm:p-4 font-mono text-xs overflow-x-auto shadow-[3px_3px_0px_#222]">
            <div className="text-[11px] font-bold text-yellowHi mb-2 border-b border-white/15 pb-1">
              JavaScript / Node.js Mental Model
            </div>
            <pre className="leading-relaxed whitespace-pre-wrap">{jsCode}</pre>
          </div>
          {jsExplanation && (
            <div className="bg-paper border-2 border-ink p-3.5 rounded-xl text-sm font-hand text-ink leading-snug shadow-[2px_2px_0px_#222]">
              <strong>How JS Compares:</strong> {jsExplanation}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
