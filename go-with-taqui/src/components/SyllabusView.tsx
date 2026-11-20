import React, { useMemo, useState } from 'react';
import { MODULES, TOTAL_MODULES, TOTAL_SUBTOPICS, TRACKS } from '../data/syllabus';
import type { AppProgressState } from '../types';
import { SketchIcon } from './Icons';

interface SyllabusViewProps {
  progress: AppProgressState;
  onToggleModuleComplete: (moduleId: number) => void;
  onNavigate: (hash: string) => void;
  onResetProgress: () => void;
}

export function SyllabusView({
  progress,
  onToggleModuleComplete,
  onNavigate,
  onResetProgress,
}: SyllabusViewProps) {
  const [query, setQuery] = useState('');
  const [activeTrack, setActiveTrack] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'done' | 'todo'>('all');
  const [expandedIds, setExpandedIds] = useState<Record<number, boolean>>({ 0: true, 1: true });
  const [confirmReset, setConfirmReset] = useState(false);

  const normalizedQuery = query.trim().toLowerCase();

  const filteredModules = useMemo(() => {
    return MODULES.filter((mod) => {
      if (activeTrack !== 'all' && mod.track.id !== activeTrack) return false;
      const isDone = Boolean(progress.completed[mod.id]);
      if (statusFilter === 'done' && !isDone) return false;
      if (statusFilter === 'todo' && isDone) return false;
      if (!normalizedQuery) return true;
      const matchMod =
        `${mod.id}`.includes(normalizedQuery) ||
        mod.title.toLowerCase().includes(normalizedQuery) ||
        mod.track.name.toLowerCase().includes(normalizedQuery);
      const matchSub = mod.subtopics.some(
        (s) =>
          s.code.toLowerCase().includes(normalizedQuery) ||
          s.title.toLowerCase().includes(normalizedQuery),
      );
      return matchMod || matchSub;
    });
  }, [activeTrack, statusFilter, normalizedQuery, progress.completed]);

  const completedCount = Object.values(progress.completed).filter(Boolean).length;
  const completedSubCount = Object.values(progress.completedSubtopics).filter(Boolean).length;

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    const next: Record<number, boolean> = {};
    for (const m of filteredModules) next[m.id] = true;
    setExpandedIds(next);
  };

  const collapseAll = () => {
    setExpandedIds({});
  };

  return (
    <div className="space-y-8">
      {/* Header Summary */}
      <section className="sketch-box p-6 sm:p-8 space-y-5">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <div className="font-mono text-xs font-bold text-tealDeep">
              Complete Curriculum Index · Modules 0–54
            </div>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-ink">
              Full Go Syllabus ({TOTAL_MODULES} Modules · {TOTAL_SUBTOPICS} Subtopics)
            </h1>
            <p className="text-base sm:text-lg text-ink/80">
              Search any module or subtopic (e.g., <code className="font-mono font-bold">goroutines</code>,{' '}
              <code className="font-mono font-bold">sqlc</code>,{' '}
              <code className="font-mono font-bold">54.10</code>) and jump straight into its lesson.
            </p>
          </div>

          <div className="bg-yellowSoft border-2 border-ink rounded-xl px-4 py-3 font-mono text-xs font-bold tabular-nums shrink-0 space-y-1">
            <div>
              Modules Mastered: {completedCount} / {TOTAL_MODULES}
            </div>
            <div>
              Subtopics Checked: {completedSubCount} / {TOTAL_SUBTOPICS}
            </div>
          </div>
        </div>

        {/* Search & Status Filter Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 pt-2">
          <div className="lg:col-span-6 relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/65 pointer-events-none">
              <SketchIcon name="search" className="w-4 h-4" />
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search all 55 modules & 615 subtopics (e.g. slice, mutex, pgx, RAG)..."
              aria-label="Search syllabus"
              className="w-full bg-paper border-[2.4px] border-ink rounded-xl pl-10 pr-4 py-2.5 text-base font-hand placeholder:text-ink/50"
            />
          </div>

          <div className="lg:col-span-6 flex flex-wrap items-center justify-between lg:justify-end gap-2">
            <div className="flex items-center gap-1.5">
              {(
                [
                  ['all', 'All'],
                  ['todo', 'Remaining'],
                  ['done', 'Completed'],
                ] as const
              ).map(([val, label]) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setStatusFilter(val)}
                  className={`sketch-btn px-3 py-2 font-display text-xs font-bold whitespace-nowrap ${
                    statusFilter === val ? 'bg-yellowHi text-ink' : 'bg-paper text-ink/80'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={expandAll}
                className="sketch-btn bg-paper px-3 py-2 font-display text-xs font-bold whitespace-nowrap"
              >
                Expand All
              </button>
              <button
                type="button"
                onClick={collapseAll}
                className="sketch-btn bg-paper px-3 py-2 font-display text-xs font-bold whitespace-nowrap"
              >
                Collapse
              </button>
            </div>
          </div>
        </div>

        {/* Track Filter Bar */}
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            type="button"
            onClick={() => setActiveTrack('all')}
            className={`sketch-btn px-3 py-1.5 font-display text-xs font-bold whitespace-nowrap ${
              activeTrack === 'all' ? 'bg-tealSoft text-ink' : 'bg-paper text-ink/75'
            }`}
          >
            All 8 Tracks ({TOTAL_MODULES})
          </button>
          {TRACKS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTrack(t.id)}
              className={`sketch-btn px-3 py-1.5 font-display text-xs font-bold whitespace-nowrap ${
                activeTrack === t.id ? 'bg-tealSoft text-ink' : 'bg-paper text-ink/75'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
      </section>

      {/* Results Count */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm font-mono font-bold text-ink/75">
        <span>
          Showing {filteredModules.length} of {TOTAL_MODULES} modules
          {normalizedQuery ? ` matching "${query}"` : ''}
        </span>

        {completedCount > 0 || completedSubCount > 0 ? (
          confirmReset ? (
            <div className="flex items-center gap-2">
              <span className="text-redPen">Reset all saved progress?</span>
              <button
                type="button"
                onClick={() => {
                  onResetProgress();
                  setConfirmReset(false);
                }}
                className="sketch-btn bg-yellowHi px-3 py-1 text-xs font-display font-bold text-redPen"
              >
                Yes, Reset
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="sketch-btn bg-paper px-3 py-1 text-xs font-display font-bold"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="underline decoration-dotted hover:text-redPen cursor-pointer"
            >
              Reset Progress
            </button>
          )
        ) : null}
      </div>

      {/* Modules List */}
      {filteredModules.length === 0 ? (
        <div className="sketch-box p-8 text-center space-y-3">
          <div className="font-display font-extrabold text-xl text-ink">
            No modules matched &ldquo;{query}&rdquo;
          </div>
          <p className="text-base text-ink/75">
            Try clearing your search or switching back to All 8 Tracks.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setActiveTrack('all');
              setStatusFilter('all');
            }}
            className="sketch-btn bg-yellowHi px-4 py-2 font-display font-bold text-sm"
          >
            Show All 55 Modules
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredModules.map((mod) => {
            const isDone = Boolean(progress.completed[mod.id]);
            const isExpanded = Boolean(expandedIds[mod.id]) || normalizedQuery.length > 0;
            const quizRecord = progress.quizScores[mod.id];
            const subsDone = mod.subtopics.filter((s) => progress.completedSubtopics[s.code]).length;

            const matchingSubs = normalizedQuery
              ? mod.subtopics.filter(
                  (s) =>
                    s.code.toLowerCase().includes(normalizedQuery) ||
                    s.title.toLowerCase().includes(normalizedQuery),
                )
              : mod.subtopics;
            const subsToShow = matchingSubs.length > 0 ? matchingSubs : mod.subtopics;

            return (
              <article
                key={mod.id}
                className={`sketch-box p-4 sm:p-5 transition-colors ${
                  isDone ? 'bg-tealSoft/30' : ''
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => onToggleModuleComplete(mod.id)}
                      aria-label={isDone ? `Unmark Module ${mod.id}` : `Mark Module ${mod.id} complete`}
                      className={`mt-0.5 w-7 h-7 rounded-lg border-2 border-ink flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                        isDone ? 'bg-tealInk text-ink' : 'bg-paper hover:bg-yellowSoft'
                      }`}
                    >
                      {isDone && <SketchIcon name="check" className="w-4 h-4" />}
                    </button>

                    <div>
                      <div className="text-xs font-mono font-bold text-ink/65">
                        Module {mod.id} · {mod.track.name} · {subsDone}/{mod.subtopics.length} subtopics
                        {quizRecord ? ` · Quiz ${quizRecord.score}/${quizRecord.total}` : ''}
                      </div>
                      <a
                        href={`#/learn/${mod.slug}`}
                        onClick={(e) => {
                          e.preventDefault();
                          onNavigate(`#/learn/${mod.slug}`);
                        }}
                        className="font-display font-extrabold text-xl text-ink hover:text-tealDeep transition-colors"
                      >
                        {mod.id}. {mod.title}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 pl-10 sm:pl-0">
                    <button
                      type="button"
                      onClick={() => toggleExpand(mod.id)}
                      aria-expanded={isExpanded}
                      className="sketch-btn bg-paper px-3 py-1.5 font-display text-xs font-bold inline-flex items-center gap-1 whitespace-nowrap"
                    >
                      {isExpanded ? 'Hide' : `${mod.subtopics.length} Subtopics`}
                      <SketchIcon
                        name={isExpanded ? 'chevronDown' : 'chevronRight'}
                        className="w-3.5 h-3.5"
                      />
                    </button>
                    <a
                      href={`#/learn/${mod.slug}`}
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate(`#/learn/${mod.slug}`);
                      }}
                      className="sketch-btn bg-yellowHi px-3.5 py-1.5 font-display text-xs font-extrabold inline-flex items-center gap-1 whitespace-nowrap"
                    >
                      Open Lesson <SketchIcon name="arrowRight" className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Expandable Subtopics Grid */}
                {isExpanded && (
                  <div className="mt-4 pt-3 border-t-2 border-dashed border-ink/20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {subsToShow.map((sub) => {
                      const subDone = Boolean(progress.completedSubtopics[sub.code]);
                      return (
                        <a
                          key={sub.code}
                          href={`#/learn/${mod.slug}#${sub.anchor}`}
                          onClick={(e) => {
                            e.preventDefault();
                            onNavigate(`#/learn/${mod.slug}#${sub.anchor}`);
                          }}
                          className={`px-3 py-2 rounded-xl border-[1.8px] border-ink/70 text-sm flex items-center gap-2 hover:bg-yellowSoft transition-colors ${
                            subDone ? 'bg-tealSoft/60 font-bold' : 'bg-paper'
                          }`}
                        >
                          <span className="font-mono text-xs font-bold text-tealDeep shrink-0 tabular-nums">
                            {sub.code}
                          </span>
                          <span className="truncate">{sub.title}</span>
                          {subDone && (
                            <SketchIcon name="check" className="w-3.5 h-3.5 text-greenPen ml-auto" />
                          )}
                        </a>
                      );
                    })}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
