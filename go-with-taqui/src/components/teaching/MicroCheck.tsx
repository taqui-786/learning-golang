import React, { useState } from 'react';
import { SketchIcon } from '../Icons';

export interface MicroCheckProps {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  wrongReason?: string;
}

export function MicroCheck({
  question,
  options,
  correctIndex,
  explanation,
  wrongReason,
}: MicroCheckProps) {
  const [selected, setSelected] = useState<number | null>(null);

  const isSubmitted = selected !== null;
  const isCorrect = selected === correctIndex;

  return (
    <div className="bg-paper border-2 border-ink rounded-2xl p-4 sm:p-5 space-y-3 shadow-[3px_3px_0px_var(--sketch-shadow,#222)]">
      <div className="flex items-center gap-2">
        <span className="text-xl">🎯</span>
        <span className="font-display font-black text-sm text-tealDeep uppercase tracking-wider">
          Did It Click? Quick 1-Minute Check
        </span>
      </div>

      <p className="font-display font-extrabold text-base text-ink leading-snug">
        {question}
      </p>

      <div className="space-y-2">
        {options.map((opt, idx) => {
          const isThisSelected = selected === idx;
          const isThisCorrect = idx === correctIndex;

          let btnClass = 'bg-paper text-ink border-ink hover:bg-tealSoft/50';
          if (isSubmitted) {
            if (isThisCorrect) {
              btnClass = 'bg-greenPen/20 text-ink border-greenPen font-extrabold shadow-[2px_2px_0px_#2E8B57]';
            } else if (isThisSelected) {
              btnClass = 'bg-redPen/20 text-ink border-redPen line-through';
            } else {
              btnClass = 'bg-paper/60 text-ink/40 border-ink/20 shadow-none';
            }
          }

          return (
            <button
              key={idx}
              type="button"
              disabled={isSubmitted}
              onClick={() => setSelected(idx)}
              className={`w-full text-left p-3 rounded-xl border-2 font-hand text-base transition-all flex items-center justify-between gap-3 ${btnClass}`}
            >
              <span>{opt}</span>
              {isSubmitted && isThisCorrect && (
                <span className="text-greenPen text-lg font-bold shrink-0">✓ Correct</span>
              )}
              {isSubmitted && isThisSelected && !isThisCorrect && (
                <span className="text-redPen text-lg font-bold shrink-0">✕ Not quite</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Instant Feedback Reason */}
      {isSubmitted && (
        <div
          className={`p-3.5 rounded-xl border-2 text-sm font-hand space-y-1 animate-in fade-in duration-150 ${
            isCorrect
              ? 'bg-greenPen/15 border-greenPen text-ink'
              : 'bg-redPen/15 border-redPen text-ink'
          }`}
        >
          <div className="font-display font-extrabold text-xs uppercase flex items-center gap-1.5">
            {isCorrect ? (
              <>
                <SketchIcon name="checkCircle" className="w-4 h-4 text-greenPen" />
                <span className="text-greenPen">Aha! You got it right!</span>
              </>
            ) : (
              <>
                <SketchIcon name="alert" className="w-4 h-4 text-redPen" />
                <span className="text-redPen">Why that option failed:</span>
              </>
            )}
          </div>
          <p className="leading-snug">
            {isCorrect ? explanation : wrongReason || explanation}
          </p>
          {!isCorrect && (
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="mt-2 sketch-btn bg-paper px-3 py-1 text-xs font-display font-bold hover:bg-yellowHi"
            >
              Try Again ↺
            </button>
          )}
        </div>
      )}
    </div>
  );
}
