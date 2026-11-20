import React from 'react';
import { MODULES, TOTAL_MODULES, TOTAL_SUBTOPICS, TRACKS, getModuleBySlug } from '../data/syllabus';
import type { AppProgressState } from '../types';
import { MiniSketchnoteBookCover, SketchIcon } from './Icons';

interface HomeViewProps {
  progress: AppProgressState;
  onToggleRep: (index: number) => void;
  onNavigate: (hash: string) => void;
}

const FEATURED_IDS = [0, 7, 17, 28, 33, 54];

const LANGUAGE_BRIDGES = [
  {
    topic: 'Runtime & Deploy',
    js: 'JS is the language, TS adds static types, Node.js is the runtime.',
    py: 'Interpreted via CPython + virtualenvs & pip/uv.',
    go: 'Compiles ahead-of-time into one static native binary (~12MB Docker image).',
  },
  {
    topic: 'Concurrency',
    js: 'Single-threaded event loop + Promises/async-await.',
    py: 'GIL limits CPU threads; asyncio colors functions async.',
    go: 'Lightweight ~2KB goroutines across ALL CPU cores + typed channels.',
  },
  {
    topic: 'Error Handling',
    js: 'try / catch & rejected Promises.',
    py: 'try / except exceptions.',
    go: 'Explicit `(result, err)` return values + `errors.Is` / `%w` wrapping.',
  },
  {
    topic: 'OOP & Reuse',
    js: 'Classes, prototypes & TS structural interfaces.',
    py: 'Classes, multiple inheritance & Protocols.',
    go: 'No classes or inheritance—Structs + Embedding + Implicit Interfaces.',
  },
  {
    topic: 'Memory & Types',
    js: 'Dynamic; undefined + implicit coercion (`"5"+1`).',
    py: 'Dynamic; everything is a heap object reference.',
    go: 'Static types, safe zero values (no undefined), explicit pointers `&`/`*`.',
  },
];

export function HomeView({ progress, onToggleRep, onNavigate }: HomeViewProps) {
  const completedModules = Object.values(progress.completed).filter(Boolean).length;
  const completedSubtopics = Object.values(progress.completedSubtopics).filter(Boolean).length;
  const pct = Math.round((completedModules / TOTAL_MODULES) * 100);

  const resumeMod = getModuleBySlug(progress.lastVisitedSlug) || MODULES[0];
  const hasStarted = completedModules > 0 || progress.lastVisitedSlug !== MODULES[0].slug;

  const repLabels = ['Day 1', 'Day 3', 'Day 7', 'Day 14', 'Day 30'];

  return (
    <div className="space-y-12">
      {/* ==================== HERO SECTION ==================== */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-7 sketch-box p-6 sm:p-8 flex flex-col justify-between gap-6">
          <div className="space-y-4">
            <div className="text-sm font-mono font-bold text-tealDeep tracking-wide">
              Visual Go Curriculum · 55 Modules (0–54) · 615 Subtopics
            </div>

            <h1 className="font-display font-extrabold text-3xl sm:text-5xl leading-[1.12] text-ink [text-wrap:balance]">
              Learn <span className="hi-yellow">Go (Golang)</span> from Zero to{' '}
              <span className="hi-teal">Agentic Systems</span>
            </h1>

            <p className="text-lg sm:text-xl leading-relaxed text-ink/85 max-w-2xl">
              Hand-crafted sketchnote lessons built for clarity—bridging what you already know from
              JavaScript, TypeScript, Node.js, or Python straight into production Go backends,
              concurrency, databases, Kubernetes, RAG, and AI agents.
            </p>

            {/* Hand-drawn speech bubble */}
            <div className="speech-bubble max-w-xl mt-2">
              <p className="text-base sm:text-lg font-bold text-ink leading-snug">
                &ldquo;Every single module pairs plain-English mental models, syntax-highlighted code
                scraps, an interactive visual lab, and a 4-question mastery quiz.&rdquo;
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-4">
            <a
              href={`#/learn/${resumeMod.slug}`}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(`#/learn/${resumeMod.slug}`);
              }}
              className="sketch-btn bg-yellowHi px-5 py-3 font-display font-extrabold text-base text-ink inline-flex items-center gap-2 whitespace-nowrap"
            >
              <SketchIcon name="compass" className="w-5 h-5" />
              {hasStarted ? `Continue Module ${resumeMod.id}` : 'Start Module 0: Go Setup'}
              <SketchIcon name="arrowRight" className="w-4 h-4" />
            </a>

            <a
              href="#/syllabus"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('#/syllabus');
              }}
              className="sketch-btn bg-paper px-5 py-3 font-display font-bold text-base text-ink inline-flex items-center gap-2 whitespace-nowrap hover:bg-tealSoft"
            >
              <SketchIcon name="book" className="w-5 h-5" />
              Browse All 55 Modules
            </a>
          </div>
        </div>

        {/* Right Column: Pocket Book Cover + Starburst Mastery Tracker */}
        <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
          <div className="sketch-box-alt p-6 flex items-center justify-center flex-1">
            <MiniSketchnoteBookCover completedCount={completedModules} totalCount={TOTAL_MODULES} />
          </div>

          {/* Starburst Spaced-Repetition & Mastery Tracker */}
          <div className="sketch-box-yellow p-5 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-display font-extrabold text-base text-ink flex items-center gap-1.5">
                <SketchIcon name="award" className="w-5 h-5 text-tealDeep" />
                Starburst Mastery Tracker
              </h2>
              <span className="font-mono text-xs font-bold tabular-nums text-ink">
                {pct}% Complete
              </span>
            </div>

            <div className="w-full h-3.5 bg-paper border-2 border-ink rounded-full overflow-hidden">
              <div
                className="h-full bg-tealInk transition-all duration-300"
                style={{ width: `${Math.max(pct, completedModules > 0 ? 4 : 0)}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs font-mono font-bold tabular-nums text-ink/80">
              <span>
                Modules: {completedModules} / {TOTAL_MODULES}
              </span>
              <span>
                Subtopics: {completedSubtopics} / {TOTAL_SUBTOPICS}
              </span>
            </div>

            {/* 5 Spaced-Repetition Stars */}
            <div className="pt-1 border-t-2 border-dashed border-ink/25">
              <div className="text-xs font-display font-bold text-ink/80 mb-2">
                Spaced-Repetition Review Streak (tap stars as you review):
              </div>
              <div className="grid grid-cols-5 gap-2">
                {progress.reps.map((active, idx) => (
                  <button
                    key={repLabels[idx]}
                    type="button"
                    onClick={() => onToggleRep(idx)}
                    aria-pressed={active}
                    className={`sketch-btn py-1.5 px-1 flex flex-col items-center justify-center gap-0.5 text-center ${
                      active ? 'bg-tealSoft text-ink pop-bounce' : 'bg-paper text-ink/65'
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill={active ? '#53B7BE' : 'none'}
                      stroke="#222222"
                      strokeWidth={2.2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <polygon points="12,2.5 14.9,8.4 21.4,9.3 16.7,13.9 17.8,20.4 12,17.3 6.2,20.4 7.3,13.9 2.6,9.3 9.1,8.4" />
                    </svg>
                    <span className="font-mono text-[10px] font-bold">{repLabels[idx]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 8-TRACK CURRICULUM ROADMAP ==================== */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="sk-section-title text-2xl sm:text-3xl">
              8-Track Complete Go Roadmap
            </h2>
            <p className="text-base sm:text-lg text-ink/80">
              Every module from your very first <code className="font-mono font-bold">go run</code>{' '}
              through Docker, Kubernetes, RAG, and concurrent AI agents.
            </p>
          </div>
          <a
            href="#/syllabus"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('#/syllabus');
            }}
            className="font-display font-bold text-sm text-tealDeep underline decoration-2 inline-flex items-center gap-1 whitespace-nowrap"
          >
            Inspect all 615 subtopics <SketchIcon name="arrowRight" className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {TRACKS.map((track) => {
            const trackMods = MODULES.filter(
              (m) => m.id >= track.range[0] && m.id <= track.range[1],
            );
            const doneInTrack = trackMods.filter((m) => progress.completed[m.id]).length;
            const subCount = trackMods.reduce((sum, m) => sum + m.subtopics.length, 0);
            const firstMod = trackMods[0];

            return (
              <div
                key={track.id}
                className="sketch-box p-5 flex flex-col justify-between gap-4 hover:-translate-y-0.5 transition-transform"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`w-10 h-10 rounded-xl border-2 border-ink ${track.color} flex items-center justify-center`}
                    >
                      <SketchIcon name={track.icon} className="w-5 h-5 text-ink" />
                    </span>
                    <span className="font-mono text-xs font-bold tabular-nums text-ink/75">
                      Mod {track.range[0]}–{track.range[1]} · {subCount} topics
                    </span>
                  </div>

                  <h3 className="font-display font-extrabold text-lg text-ink leading-snug">
                    {track.name}
                  </h3>
                  <p className="text-base text-ink/80 leading-snug">{track.desc}</p>
                </div>

                <div className="space-y-3 pt-2 border-t-2 border-dashed border-ink/20">
                  <div className="flex items-center justify-between text-xs font-mono font-bold tabular-nums">
                    <span className="text-tealDeep">
                      {doneInTrack}/{trackMods.length} done
                    </span>
                    <a
                      href={`#/learn/${firstMod.slug}`}
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate(`#/learn/${firstMod.slug}`);
                      }}
                      className="font-display font-bold text-ink hover:text-tealDeep inline-flex items-center gap-1"
                    >
                      Open Track <SketchIcon name="chevronRight" className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ==================== FEATURED MILESTONE LESSONS ==================== */}
      <section className="space-y-5">
        <div>
          <h2 className="sk-section-title text-2xl sm:text-3xl">Popular Milestone Modules</h2>
          <p className="text-base sm:text-lg text-ink/80">
            Jump straight into key turning points in the Go journey.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURED_IDS.map((id) => {
            const mod = MODULES[id];
            const isDone = Boolean(progress.completed[id]);
            return (
              <a
                key={mod.id}
                href={`#/learn/${mod.slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(`#/learn/${mod.slug}`);
                }}
                className="sketch-box-alt p-5 flex flex-col justify-between gap-3 hover:bg-yellowSoft/55 transition-colors group"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-ink/70">
                    <span>
                      Module {mod.id} · {mod.subtopics.length} subtopics
                    </span>
                    {isDone && (
                      <span className="text-greenPen inline-flex items-center gap-1">
                        <SketchIcon name="checkCircle" className="w-4 h-4" /> Done
                      </span>
                    )}
                  </div>
                  <h3 className="font-display font-extrabold text-lg text-ink group-hover:text-tealDeep">
                    {mod.title}
                  </h3>
                  <div className="text-sm text-ink/75">
                    {mod.subtopics
                      .slice(0, 3)
                      .map((s) => s.title)
                      .join(' · ')}
                  </div>
                </div>
                <div className="font-display font-bold text-sm text-tealDeep inline-flex items-center gap-1">
                  Start Lesson <SketchIcon name="arrowRight" className="w-4 h-4" />
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* ==================== JS / TS / PYTHON MENTAL BRIDGE TABLE ==================== */}
      <section className="sketch-box p-6 sm:p-8 space-y-5">
        <div className="space-y-1">
          <h2 className="sk-section-title text-2xl sm:text-3xl">
            Mental Model Bridge: JS / TS / Python → Go
          </h2>
          <p className="text-base sm:text-lg text-ink/80">
            Keep this quick translation sheet in mind as you move through all 55 modules.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[680px]">
            <thead>
              <tr className="border-b-[2.5px] border-ink font-display text-sm text-ink">
                <th className="py-3 pr-4">Concept</th>
                <th className="py-3 px-4">JavaScript / TS / Node.js</th>
                <th className="py-3 px-4">Python</th>
                <th className="py-3 pl-4 text-tealDeep">Go (Golang)</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-dashed divide-ink/20 text-base">
              {LANGUAGE_BRIDGES.map((row) => (
                <tr key={row.topic} className="align-top">
                  <td className="py-3.5 pr-4 font-display font-bold text-ink whitespace-nowrap">
                    {row.topic}
                  </td>
                  <td className="py-3.5 px-4 text-ink/80">{row.js}</td>
                  <td className="py-3.5 px-4 text-ink/80">{row.py}</td>
                  <td className="py-3.5 pl-4 font-bold text-ink bg-tealSoft/35 rounded-r-lg">
                    {row.go}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
