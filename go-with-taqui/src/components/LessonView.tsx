import React, { useEffect, useMemo, useState } from 'react';
import { MODULES, TRACKS, getModuleById } from '../data/syllabus';
import type { AppProgressState, SyllabusModule } from '../types';
import { SketchIcon } from './Icons';
import { SynchronizationGoldLesson } from './teaching/modules/SynchronizationGoldLesson';
import { UniversalMasterclassLesson } from './teaching/modules/UniversalMasterclassLesson';

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
  const prevMod = getModuleById(module.id - 1);
  const nextMod = getModuleById(module.id + 1);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarFilter, setSidebarFilter] = useState('');

  // Reset mobile sidebar when switching modules
  useEffect(() => {
    setSidebarOpen(false);
  }, [module.id]);

  // Smooth scroll if navigated to a specific subtopic anchor
  useEffect(() => {
    if (!anchor) return;
    setTimeout(() => {
      const el = document.getElementById(anchor);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 60);
  }, [anchor, module]);

  const filteredSidebarModules = useMemo(() => {
    const q = sidebarFilter.trim().toLowerCase();
    if (!q) return MODULES;
    return MODULES.filter(
      (m) => `${m.id}`.includes(q) || m.title.toLowerCase().includes(q)
    );
  }, [sidebarFilter]);

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
        {/* Sole & Default Masterclass Renderer across ALL Chapters */}
        {module.slug === 'synchronization' ? (
          <SynchronizationGoldLesson
            module={module}
            progress={progress}
            onToggleModuleComplete={onToggleModuleComplete}
            onToggleSubtopic={onToggleSubtopic}
            onCheckAllSubtopics={onCheckAllSubtopics}
            onSaveQuizScore={onSaveQuizScore}
            onToast={onToast}
            onNavigate={onNavigate}
          />
        ) : (
          <UniversalMasterclassLesson
            module={module}
            progress={progress}
            onToggleModuleComplete={onToggleModuleComplete}
            onToggleSubtopic={onToggleSubtopic}
            onCheckAllSubtopics={onCheckAllSubtopics}
            onSaveQuizScore={onSaveQuizScore}
            onToast={onToast}
            onNavigate={onNavigate}
          />
        )}

        {/* Previous / Next Module Navigation */}
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
