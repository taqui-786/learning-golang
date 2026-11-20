import React, { useEffect, useMemo, useState } from 'react';
import { getModuleContent, getSubtopicStudyTip } from '../data/curriculum';
import { MODULES, TRACKS, getModuleById } from '../data/syllabus';
import type { AppProgressState, SyllabusModule } from '../types';
import { highlightGoHtml } from '../utils/highlightGo';
import { SketchIcon } from './Icons';
import { InteractiveLab } from './InteractiveLabs';

interface LessonViewProps {
  module: SyllabusModule;
  anchor?: string;
  progress: AppProgressState;
  onToggleModuleComplete: (moduleId: number) => void;
  onToggleSubtopic: (code: string) => void;
  onCheckAllSubtopics: (codes: string[]) => void;
  onSaveQuizScore: (moduleId: number, score: number, total: number) => void;
  onNavigate: (hash: string) => void;
  onToast: (msg: string) => void;
}

export function LessonView({
  module,
  anchor,
  progress,
  onToggleModuleComplete,
  onToggleSubtopic,
  onCheckAllSubtopics,
  onSaveQuizScore,
  onNavigate,
  onToast,
}: LessonViewProps) {
  const content = getModuleContent(module.id);
  const prevMod = getModuleById(module.id - 1);
  const nextMod = getModuleById(module.id + 1);
  const isCompleted = Boolean(progress.completed[module.id]);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarFilter, setSidebarFilter] = useState('');
  const [expandedSubCode, setExpandedSubCode] = useState<string | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Reset quiz local state when switching modules
  useEffect(() => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setSidebarOpen(false);
  }, [module.id]);

  // Smooth scroll & highlight if navigated to a specific subtopic anchor
  useEffect(() => {
    if (!anchor) return;
    const match = module.subtopics.find((s) => s.anchor === anchor);
    if (match) {
      setExpandedSubCode(match.code);
      setTimeout(() => {
        const el = document.getElementById(anchor);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 60);
    }
  }, [anchor, module]);

  const highlightedCode = useMemo(() => highlightGoHtml(content.goCode), [content.goCode]);

  const filteredSidebarModules = useMemo(() => {
    const q = sidebarFilter.trim().toLowerCase();
    if (!q) return MODULES;
    return MODULES.filter(
      (m) => `${m.id}`.includes(q) || m.title.toLowerCase().includes(q),
    );
  }, [sidebarFilter]);

  const handleCopyCode = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(content.goCode)
        .then(() => onToast('Copied Go snippet to clipboard'))
        .catch(() => onToast('Copy blocked—select text manually'));
    } else {
      onToast('Select and copy snippet manually');
    }
  };

  const handleSubmitQuiz = () => {
    const total = content.quiz.length;
    let score = 0;
    content.quiz.forEach((q, idx) => {
      if (quizAnswers[idx] === q.ans) score += 1;
    });
    setQuizSubmitted(true);
    onSaveQuizScore(module.id, score, total);
    if (score === total) {
      onToast(`Perfect ${score}/${total}! Module ${module.id} mastered.`);
    } else {
      onToast(`Quiz scored ${score}/${total} — review explanations below!`);
    }
  };

  const checkedSubsCount = module.subtopics.filter(
    (s) => progress.completedSubtopics[s.code],
  ).length;
  const savedQuiz = progress.quizScores[module.id];
  const allAnswered = Object.keys(quizAnswers).length === content.quiz.length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
      {/* ==================== MOBILE SIDEBAR TRIGGER ==================== */}
      <div className="lg:hidden flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setSidebarOpen((o) => !o)}
          className="sketch-btn bg-paper px-3.5 py-2 font-display text-sm font-bold inline-flex items-center gap-2"
        >
          <SketchIcon name="list" className="w-4 h-4" />
          {sidebarOpen ? 'Hide Course Outline' : `Course Outline (Mod ${module.id}/54)`}
        </button>

        <a
          href="#/syllabus"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('#/syllabus');
          }}
          className="font-display font-bold text-sm text-tealDeep underline"
        >
          Full Syllabus
        </a>
      </div>

      {/* ==================== LEFT CURRICULUM OUTLINE SIDEBAR ==================== */}
      <aside
        className={`${
          sidebarOpen ? 'block' : 'hidden'
        } lg:block lg:col-span-3 lg:sticky lg:top-20 sketch-box p-4 space-y-3 max-h-[82vh] overflow-y-auto`}
        aria-label="Course Outline"
      >
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-display font-extrabold text-sm text-tealDeep">
            All 55 Modules (0–54)
          </h2>
          <span className="font-mono text-[11px] font-bold tabular-nums text-ink/70">
            {Object.values(progress.completed).filter(Boolean).length}/55
          </span>
        </div>

        <input
          type="search"
          value={sidebarFilter}
          onChange={(e) => setSidebarFilter(e.target.value)}
          placeholder="Filter modules..."
          aria-label="Filter modules in outline"
          className="w-full bg-paper border-2 border-ink rounded-xl px-3 py-1.5 text-sm font-hand"
        />

        <div className="space-y-3">
          {TRACKS.map((track) => {
            const items = filteredSidebarModules.filter((m) => m.track.id === track.id);
            if (items.length === 0) return null;
            return (
              <div key={track.id} className="space-y-1">
                <div className="font-display font-bold text-xs text-ink/65 px-1 pt-1">
                  {track.name}
                </div>
                {items.map((m) => {
                  const active = m.id === module.id;
                  const done = Boolean(progress.completed[m.id]);
                  return (
                    <a
                      key={m.id}
                      href={`#/learn/${m.slug}`}
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate(`#/learn/${m.slug}`);
                      }}
                      className={`flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-xl text-sm transition-colors ${
                        active
                          ? 'bg-yellowHi border-2 border-ink font-display font-extrabold text-ink shadow-[2px_2px_0px_#222]'
                          : 'hover:bg-tealSoft/55 text-ink/85 border-2 border-transparent'
                      }`}
                    >
                      <span className="truncate">
                        <span className="font-mono text-xs mr-1.5 tabular-nums">{m.id}.</span>
                        {m.title}
                      </span>
                      {done && (
                        <SketchIcon
                          name="checkCircle"
                          className="w-4 h-4 text-greenPen shrink-0"
                        />
                      )}
                    </a>
                  );
                })}
              </div>
            );
          })}
        </div>
      </aside>

      {/* ==================== MAIN LESSON WORKSPACE ==================== */}
      <div className="lg:col-span-9 space-y-7 min-w-0">
        {/* 1. Lesson Header & Overview */}
        <section className="sketch-box p-6 sm:p-8 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs sm:text-sm font-mono font-bold text-tealDeep">
              {module.track.name} · Module {module.id} of 54 · {module.subtopics.length} Subtopics
            </div>

            <button
              type="button"
              onClick={() => onToggleModuleComplete(module.id)}
              className={`sketch-btn px-4 py-2 font-display text-xs sm:text-sm font-extrabold inline-flex items-center gap-1.5 whitespace-nowrap ${
                isCompleted ? 'bg-tealSoft text-ink' : 'bg-yellowHi text-ink'
              }`}
            >
              <SketchIcon name={isCompleted ? 'checkCircle' : 'check'} className="w-4 h-4" />
              {isCompleted ? 'Completed' : 'Mark Module Complete'}
            </button>
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-ink leading-tight">
            {module.id}. {module.title}
          </h1>

          <p className="text-lg sm:text-xl leading-relaxed text-ink/90">{content.summary}</p>

          {/* Mental Model Speech Bubble */}
          <div className="speech-bubble">
            <div className="font-display font-extrabold text-xs text-tealDeep mb-1 flex items-center gap-1.5">
              <SketchIcon name="bulb" className="w-4 h-4" />
              Mental Model Sketchnote
            </div>
            <p className="text-base sm:text-lg font-bold text-ink leading-snug">
              {content.mentalModel}
            </p>
          </div>
        </section>

        {/* 2. Taped Code Scrap + Output + Line-by-Line Walkthrough */}
        <section className="space-y-4">
          <div className="code-scrap p-5 sm:p-6 pt-7">
            <div className="tape-strip" aria-hidden="true" />

            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b-2 border-dashed border-ink/25">
              <div className="font-display font-extrabold text-base text-ink flex items-center gap-2">
                <SketchIcon name="code" className="w-5 h-5 text-tealDeep" />
                Go Code Scrap — Module {module.id}
              </div>
              <button
                type="button"
                onClick={handleCopyCode}
                className="sketch-btn bg-paper px-3 py-1.5 font-display text-xs font-bold inline-flex items-center gap-1.5"
              >
                <SketchIcon name="copy" className="w-3.5 h-3.5" /> Copy Code
              </button>
            </div>

            <pre className="overflow-x-auto font-mono text-xs sm:text-sm leading-relaxed text-ink">
              <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
            </pre>

            {/* Simulated Terminal Output */}
            <div className="mt-4 bg-ink text-paper rounded-xl p-3.5 font-mono text-xs sm:text-sm">
              <div className="text-yellowHi text-[11px] font-bold mb-1 flex items-center gap-1.5">
                <SketchIcon name="terminal" className="w-3.5 h-3.5" /> Expected Output
              </div>
              <pre className="whitespace-pre-wrap leading-relaxed">{content.goOut}</pre>
            </div>
          </div>

          {/* Line-by-Line Walkthrough */}
          <div className="sketch-box-alt p-5 sm:p-6 space-y-3">
            <h2 className="font-display font-extrabold text-lg text-ink">
              Line-by-Line Walkthrough
            </h2>
            <div className="space-y-2.5">
              {content.lines.map(([snippet, explanation]) => (
                <div
                  key={snippet}
                  className="bg-paper border-2 border-ink/80 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-baseline gap-2"
                >
                  <code className="font-mono text-xs sm:text-sm font-bold text-tealDeep bg-tealSoft/60 px-2.5 py-1 rounded-lg shrink-0">
                    {snippet}
                  </code>
                  <span className="text-base text-ink/90 leading-snug">{explanation}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Interactive Visual Lab */}
        <InteractiveLab labType={content.lab} moduleId={module.id} />

        {/* 4. JS / TS / Node.js & Python Bridges */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="sketch-box p-5 space-y-2">
            <h2 className="font-display font-extrabold text-lg text-ink flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-yellowHi border-2 border-ink font-mono text-xs font-extrabold inline-flex items-center justify-center">
                JS
              </span>
              JavaScript / TS / Node.js Bridge
            </h2>
            <p className="text-base text-ink/85 leading-relaxed">{content.jsBridge}</p>
          </div>

          <div className="sketch-box-alt p-5 space-y-2">
            <h2 className="font-display font-extrabold text-lg text-ink flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-tealSoft border-2 border-ink font-mono text-xs font-extrabold inline-flex items-center justify-center">
                PY
              </span>
              Python Bridge
            </h2>
            <p className="text-base text-ink/85 leading-relaxed">{content.pyBridge}</p>
          </div>
        </section>

        {/* 5. Real-World Application & Common Mistake */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="sketch-box-teal p-5 space-y-2">
            <h2 className="font-display font-extrabold text-lg text-ink flex items-center gap-2">
              <SketchIcon name="shield" className="w-5 h-5 text-tealDeep" />
              Real-World Production Use
            </h2>
            <p className="text-base text-ink/90 leading-relaxed">{content.realApp}</p>
          </div>

          <div className="sketch-box-yellow p-5 space-y-2">
            <h2 className="font-display font-extrabold text-lg text-ink flex items-center gap-2">
              <SketchIcon name="alert" className="w-5 h-5 text-redPen" />
              Common Mistake to Avoid
            </h2>
            <p className="text-base text-ink/90 leading-relaxed">{content.mistake}</p>
          </div>
        </section>

        {/* 6. Complete Subtopics Checklist (All numbered subtopics for this module) */}
        <section className="sketch-box p-5 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display font-extrabold text-xl text-ink">
                Subtopics Covered ({checkedSubsCount} / {module.subtopics.length})
              </h2>
              <p className="text-sm sm:text-base text-ink/75">
                Tap any subtopic to view its focused study note, and check it off as you practice.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onCheckAllSubtopics(module.subtopics.map((s) => s.code))}
              className="sketch-btn bg-paper px-3.5 py-1.5 font-display text-xs font-bold whitespace-nowrap hover:bg-tealSoft"
            >
              Check All {module.subtopics.length}
            </button>
          </div>

          <div className="space-y-2">
            {module.subtopics.map((sub) => {
              const checked = Boolean(progress.completedSubtopics[sub.code]);
              const isOpen = expandedSubCode === sub.code;
              const isTargetAnchor = anchor === sub.anchor;

              return (
                <div
                  key={sub.code}
                  id={sub.anchor}
                  className={`rounded-xl border-2 transition-colors ${
                    isTargetAnchor
                      ? 'border-tealInk bg-yellowSoft/70'
                      : checked
                      ? 'border-ink bg-tealSoft/45'
                      : 'border-ink/75 bg-paper'
                  }`}
                >
                  <div className="flex items-center gap-3 p-3">
                    <button
                      type="button"
                      onClick={() => onToggleSubtopic(sub.code)}
                      aria-label={`Toggle subtopic ${sub.code} ${sub.title}`}
                      className={`w-6 h-6 rounded-md border-2 border-ink flex items-center justify-center shrink-0 cursor-pointer ${
                        checked ? 'bg-tealInk text-ink' : 'bg-white'
                      }`}
                    >
                      {checked && <SketchIcon name="check" className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setExpandedSubCode(isOpen ? null : sub.code)}
                      aria-expanded={isOpen}
                      className="flex-1 text-left flex items-center justify-between gap-2 cursor-pointer"
                    >
                      <span className="text-base font-bold text-ink">
                        <span className="font-mono text-xs text-tealDeep mr-2 tabular-nums">
                          {sub.code}
                        </span>
                        {sub.title}
                      </span>
                      <SketchIcon
                        name={isOpen ? 'chevronDown' : 'chevronRight'}
                        className="w-4 h-4 text-ink/60 shrink-0"
                      />
                    </button>
                  </div>

                  {isOpen && (
                    <div className="px-4 pb-3.5 pt-1 text-sm sm:text-base text-ink/85 border-t border-dashed border-ink/25">
                      {getSubtopicStudyTip(module, sub)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* 7. Interactive 4-Question Mastery Quiz */}
        <section className="sketch-box p-5 sm:p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-display font-extrabold text-xl text-ink flex items-center gap-2">
                <SketchIcon name="award" className="w-5 h-5 text-tealDeep" />
                Module {module.id} Mastery Check (4 Questions)
              </h2>
              <p className="text-sm sm:text-base text-ink/75">
                Pick one answer per question, then grade your quiz to unlock explanations.
              </p>
            </div>
            {savedQuiz && (
              <span className="font-mono text-xs font-bold tabular-nums bg-tealSoft border-2 border-ink rounded-xl px-3 py-1.5">
                Best Score: {savedQuiz.score}/{savedQuiz.total}
              </span>
            )}
          </div>

          <div className="space-y-4">
            {content.quiz.map((item, qIdx) => {
              const selected = quizAnswers[qIdx];
              const isCorrect = selected === item.ans;

              return (
                <div
                  key={item.q}
                  className="bg-paper border-2 border-ink rounded-xl p-4 space-y-3"
                >
                  <div className="space-y-1">
                    <div className="font-mono text-xs font-bold text-tealDeep">
                      Q{qIdx + 1} · {item.type}
                    </div>
                    <div className="font-display font-bold text-base text-ink">{item.q}</div>
                  </div>

                  <div className="space-y-2">
                    {item.opts.map((opt, optIdx) => {
                      const isChosen = selected === optIdx;
                      const showRight = quizSubmitted && optIdx === item.ans;
                      const showWrong = quizSubmitted && isChosen && optIdx !== item.ans;

                      return (
                        <button
                          key={opt}
                          type="button"
                          disabled={quizSubmitted}
                          onClick={() =>
                            setQuizAnswers((prev) => ({ ...prev, [qIdx]: optIdx }))
                          }
                          className={`w-full text-left px-3.5 py-2.5 rounded-xl border-2 text-sm sm:text-base transition-colors cursor-pointer disabled:cursor-default ${
                            showRight
                              ? 'bg-tealSoft border-ink font-bold'
                              : showWrong
                              ? 'bg-yellowSoft border-redPen text-redPen font-bold'
                              : isChosen
                              ? 'bg-yellowHi border-ink font-bold shadow-[2px_2px_0px_#222]'
                              : 'bg-white border-ink/60 hover:bg-yellowSoft/50'
                          }`}
                        >
                          <span className="font-mono text-xs font-bold mr-2">
                            {String.fromCharCode(65 + optIdx)}.
                          </span>
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {quizSubmitted && (
                    <div
                      className={`text-sm font-bold rounded-lg px-3 py-2 border border-ink/40 ${
                        isCorrect ? 'bg-tealSoft/70 text-ink' : 'bg-yellowSoft text-ink'
                      }`}
                    >
                      {isCorrect ? 'Correct — ' : 'Review — '}
                      {item.why}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            {!quizSubmitted ? (
              <button
                type="button"
                disabled={!allAnswered}
                onClick={handleSubmitQuiz}
                className="sketch-btn bg-yellowHi px-5 py-2.5 font-display font-extrabold text-sm disabled:opacity-50"
              >
                Check Answers ({Object.keys(quizAnswers).length}/{content.quiz.length})
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setQuizAnswers({});
                    setQuizSubmitted(false);
                  }}
                  className="sketch-btn bg-paper px-4 py-2 font-display font-bold text-sm inline-flex items-center gap-1.5"
                >
                  <SketchIcon name="refresh" className="w-4 h-4" /> Retake Quiz
                </button>
                {!isCompleted && (
                  <button
                    type="button"
                    onClick={() => onToggleModuleComplete(module.id)}
                    className="sketch-btn bg-tealSoft px-4 py-2 font-display font-extrabold text-sm inline-flex items-center gap-1.5"
                  >
                    <SketchIcon name="checkCircle" className="w-4 h-4" /> Mark Module {module.id}{' '}
                    Complete
                  </button>
                )}
              </>
            )}
          </div>
        </section>

        {/* 8. Previous / Next Module Navigation */}
        <nav
          aria-label="Lesson pagination"
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2"
        >
          {prevMod ? (
            <a
              href={`#/learn/${prevMod.slug}`}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(`#/learn/${prevMod.slug}`);
              }}
              className="sketch-box p-4 flex items-center gap-3 hover:bg-yellowSoft/60 transition-colors"
            >
              <SketchIcon name="arrowLeft" className="w-5 h-5 text-tealDeep shrink-0" />
              <div className="min-w-0">
                <div className="font-mono text-xs font-bold text-ink/65">
                  Previous · Module {prevMod.id}
                </div>
                <div className="font-display font-extrabold text-base text-ink truncate">
                  {prevMod.title}
                </div>
              </div>
            </a>
          ) : (
            <div />
          )}

          {nextMod ? (
            <a
              href={`#/learn/${nextMod.slug}`}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(`#/learn/${nextMod.slug}`);
              }}
              className="sketch-box p-4 flex items-center justify-end gap-3 text-right hover:bg-tealSoft/60 transition-colors"
            >
              <div className="min-w-0">
                <div className="font-mono text-xs font-bold text-ink/65">
                  Next · Module {nextMod.id}
                </div>
                <div className="font-display font-extrabold text-base text-ink truncate">
                  {nextMod.title}
                </div>
              </div>
              <SketchIcon name="arrowRight" className="w-5 h-5 text-tealDeep shrink-0" />
            </a>
          ) : (
            <a
              href="#/syllabus"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('#/syllabus');
              }}
              className="sketch-box-yellow p-4 flex items-center justify-end gap-3 text-right"
            >
              <div>
                <div className="font-mono text-xs font-bold text-ink/75">Course Finale</div>
                <div className="font-display font-extrabold text-base text-ink">
                  Back to Complete Syllabus
                </div>
              </div>
              <SketchIcon name="award" className="w-5 h-5 text-tealDeep shrink-0" />
            </a>
          )}
        </nav>
      </div>
    </div>
  );
}
