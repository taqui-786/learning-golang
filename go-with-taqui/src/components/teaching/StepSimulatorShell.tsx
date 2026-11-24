import React, { useState, useEffect, useRef } from 'react';
import { SketchIcon } from '../Icons';

export interface SimulatorStep {
  narrator: string;
  highlightLine?: number; // 1-based index in codeSnippet
  badge?: string;
}

export interface StepSimulatorShellProps {
  title: string;
  subtitle?: string;
  modeToggle?: {
    current: string;
    options: { id: string; label: string; icon?: string }[];
    onChange: (modeId: string) => void;
  };
  steps: SimulatorStep[];
  currentStep: number;
  onStepChange: (stepIndex: number) => void;
  codeSnippet: string;
  children: React.ReactNode; // The Visual Stage
}

export function StepSimulatorShell({
  title,
  subtitle,
  modeToggle,
  steps,
  currentStep,
  onStepChange,
  codeSnippet,
  children,
}: StepSimulatorShellProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<number | null>(null);

  const totalSteps = steps.length;
  const isFinished = currentStep >= totalSteps - 1;

  // Clear auto-play timer cleanly
  const stopAutoPlay = () => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsPlaying(false);
  };

  const handleReset = () => {
    stopAutoPlay();
    onStepChange(0);
  };

  const handleStepForward = () => {
    if (currentStep < totalSteps - 1) {
      onStepChange(currentStep + 1);
    } else {
      stopAutoPlay();
    }
  };

  const handleStepBackward = () => {
    if (currentStep > 0) {
      onStepChange(currentStep - 1);
    }
  };

  const toggleAutoPlay = () => {
    if (isPlaying) {
      stopAutoPlay();
    } else {
      // If already at end, start from 0
      if (currentStep >= totalSteps - 1) {
        onStepChange(0);
      }
      setIsPlaying(true);
    }
  };

  // Run auto-play loop (1.3s per step for comfortable beginner reading)
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setInterval(() => {
        onStepChange(currentStep + 1);
      }, 1300);
    }
    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, currentStep, onStepChange]);

  // Stop if reached the end
  useEffect(() => {
    if (currentStep >= totalSteps - 1 && isPlaying) {
      stopAutoPlay();
    }
  }, [currentStep, totalSteps, isPlaying]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
      }
    };
  }, []);

  const activeStepData = steps[currentStep] || steps[0];
  const codeLines = codeSnippet.trim().split('\n');

  return (
    <div className="sketch-box p-5 sm:p-7 space-y-5">
      {/* 1. Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-dashed border-ink/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🔬</span>
            <h3 className="font-display font-black text-xl text-ink">{title}</h3>
          </div>
          {subtitle && (
            <p className="font-hand text-sm text-ink/75 mt-0.5">{subtitle}</p>
          )}
        </div>

        {/* Mode Toggle (e.g. Break It vs Fix It) */}
        {modeToggle && (
          <div className="flex items-center gap-2 self-start sm:self-auto bg-paper p-1.5 rounded-xl border-2 border-ink">
            {modeToggle.options.map((opt) => {
              const active = opt.id === modeToggle.current;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    stopAutoPlay();
                    modeToggle.onChange(opt.id);
                  }}
                  className={`sketch-btn px-3 py-1 font-display text-xs font-bold inline-flex items-center gap-1.5 transition-colors ${
                    active ? 'bg-yellowHi text-ink' : 'bg-transparent text-ink/70 border-transparent shadow-none hover:bg-tealSoft/50'
                  }`}
                >
                  {opt.icon && <span>{opt.icon}</span>}
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Visual Stage (Characters, Boxes, Keys moving) */}
      <div className="bg-paperDark border-2 border-ink rounded-2xl p-4 sm:p-6 min-h-[180px] flex flex-col justify-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.03)]">
        {children}
      </div>

      {/* 3. Live Teacher Narrator Speech Bubble */}
      <div className="speech-bubble bg-yellowSoft/90 border-2 border-ink p-4 rounded-2xl shadow-[3px_3px_0px_#222] transition-all">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="font-display font-extrabold text-xs text-tealDeep flex items-center gap-1.5">
            <SketchIcon name="bulb" className="w-4 h-4 text-tealDeep" />
            <span>Teacher Narrator</span>
            <span className="font-mono text-[11px] bg-paper px-2 py-0.5 rounded-full border border-ink/40 text-ink">
              Step {currentStep + 1} of {totalSteps}
            </span>
          </div>
          {activeStepData?.badge && (
            <span className="font-display font-bold text-xs px-2.5 py-0.5 rounded-full bg-paper border border-ink text-ink shadow-[1px_1px_0px_#222]">
              {activeStepData.badge}
            </span>
          )}
        </div>
        <p className="font-hand text-lg sm:text-xl text-ink leading-snug">
          {activeStepData?.narrator}
        </p>
      </div>

      {/* 4. Controls & Synced Code Line Highlighter */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-2 items-start">
        {/* Playback Controls */}
        <div className="lg:col-span-5 space-y-3">
          <div className="font-display font-bold text-xs text-ink/70 uppercase tracking-wide">
            Interactive Playback
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleStepBackward}
              disabled={currentStep === 0}
              className={`sketch-btn bg-paper px-3 py-2 font-display text-xs font-bold inline-flex items-center gap-1 ${
                currentStep === 0 ? 'opacity-40 cursor-not-allowed shadow-none' : 'hover:bg-tealSoft'
              }`}
              title="Step backward"
            >
              ◀ Back
            </button>

            <button
              type="button"
              onClick={handleStepForward}
              disabled={isFinished}
              className={`sketch-btn px-4 py-2 font-display text-xs sm:text-sm font-extrabold inline-flex items-center gap-1.5 ${
                isFinished
                  ? 'bg-paper opacity-50 cursor-not-allowed shadow-none'
                  : 'bg-yellowHi text-ink hover:bg-yellowSoft'
              }`}
            >
              <span>Step Forward 1 Step</span>
              <span>▶</span>
            </button>

            <button
              type="button"
              onClick={toggleAutoPlay}
              className={`sketch-btn px-3 py-2 font-display text-xs font-bold inline-flex items-center gap-1.5 ${
                isPlaying ? 'bg-tealInk text-paper' : 'bg-tealSoft text-ink hover:bg-tealSoft/80'
              }`}
            >
              <span>{isPlaying ? '⏸ Pause' : '▶ Auto-Play (Slow)'}</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="sketch-btn bg-paper px-3 py-2 font-display text-xs font-bold hover:bg-redPen/15 text-ink/80"
              title="Reset simulator"
            >
              ↺ Reset
            </button>
          </div>

          {/* Step Progress Dots */}
          <div className="flex items-center gap-1.5 pt-1">
            {steps.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  stopAutoPlay();
                  onStepChange(idx);
                }}
                className={`h-2.5 rounded-full transition-all cursor-pointer ${
                  idx === currentStep
                    ? 'w-7 bg-tealDeep border border-ink'
                    : idx < currentStep
                    ? 'w-2.5 bg-yellowHi border border-ink/60'
                    : 'w-2.5 bg-ink/20'
                }`}
                aria-label={`Jump to step ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Synced Code Line Highlighter */}
        <div className="lg:col-span-7 bg-[#222222] text-[#FAF9F2] rounded-xl p-3 sm:p-4 font-mono text-xs overflow-x-auto shadow-[3px_3px_0px_#222]">
          <div className="text-[11px] font-bold text-yellowHi mb-2 flex items-center justify-between border-b border-white/15 pb-1">
            <span className="flex items-center gap-1">
              <SketchIcon name="code" className="w-3.5 h-3.5 text-tealInk" />
              <span>Executing Go Code</span>
            </span>
            <span className="text-[10px] text-white/60">
              Line {activeStepData?.highlightLine || 1} of {codeLines.length}
            </span>
          </div>

          <pre className="leading-relaxed">
            {codeLines.map((line, idx) => {
              const lineNum = idx + 1;
              const isHighlighted = lineNum === activeStepData?.highlightLine;
              return (
                <div
                  key={idx}
                  className={`flex items-start px-2 py-0.5 rounded transition-colors ${
                    isHighlighted
                      ? 'bg-yellowHi text-ink font-extrabold shadow-sm'
                      : 'hover:bg-white/5 text-paper/85'
                  }`}
                >
                  <span
                    className={`select-none w-6 shrink-0 text-right pr-3 text-[10px] tabular-nums ${
                      isHighlighted ? 'text-ink font-black' : 'text-paper/40'
                    }`}
                  >
                    {lineNum}
                  </span>
                  <span className="truncate">{line || ' '}</span>
                </div>
              );
            })}
          </pre>
        </div>
      </div>
    </div>
  );
}
