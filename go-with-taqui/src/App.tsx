import React, { useCallback, useEffect, useRef, useState } from 'react';
import { HomeView } from './components/HomeView';
import { GopherBrandMark, SketchIcon } from './components/Icons';
import { LessonView } from './components/LessonView';
import { SyllabusView } from './components/SyllabusView';
import { MODULES, TOTAL_MODULES, getModuleBySlug } from './data/syllabus';
import type { AppProgressState } from './types';
import { loadProgressState, saveProgressState } from './utils/storage';

type RouteState =
  | { view: 'home' }
  | { view: 'syllabus' }
  | { view: 'learn'; slug: string; anchor?: string };

function parseHash(rawHash: string): RouteState {
  const cleaned = rawHash.replace(/^#/, '') || '/';
  if (cleaned === '/' || cleaned === '') {
    return { view: 'home' };
  }
  if (cleaned.startsWith('/syllabus')) {
    return { view: 'syllabus' };
  }
  if (cleaned.startsWith('/learn/')) {
    const rest = cleaned.slice('/learn/'.length);
    const [slugPart, anchorPart] = rest.split('#');
    return {
      view: 'learn',
      slug: slugPart || MODULES[0].slug,
      anchor: anchorPart || undefined,
    };
  }
  return { view: 'home' };
}

export default function App() {
  const [route, setRoute] = useState<RouteState>(() => parseHash(window.location.hash));
  const [progress, setProgress] = useState<AppProgressState>(() => loadProgressState());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastMsg(null);
    }, 2400);
  }, []);

  // Persist progress changes to localStorage
  useEffect(() => {
    saveProgressState(progress);
  }, [progress]);

  // Listen to browser hashchange (back/forward & direct URL edits)
  useEffect(() => {
    const onHashChange = () => {
      const parsed = parseHash(window.location.hash);
      setRoute(parsed);
      setMobileMenuOpen(false);
      if (parsed.view !== 'learn' || !parsed.anchor) {
        window.scrollTo({ top: 0, behavior: 'auto' });
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Track last visited lesson slug & update document title
  useEffect(() => {
    if (route.view === 'learn') {
      const mod = getModuleBySlug(route.slug) || MODULES[0];
      document.title = `${mod.id}. ${mod.title} — Go with taqui`;
      setProgress((prev) =>
        prev.lastVisitedSlug === mod.slug ? prev : { ...prev, lastVisitedSlug: mod.slug },
      );
    } else if (route.view === 'syllabus') {
      document.title = 'Full Syllabus (0–54) — Go with taqui';
    } else {
      document.title = 'Go with taqui — Visual Go Learning Platform';
    }
  }, [route]);

  const navigate = useCallback((targetHash: string) => {
    const normalized = targetHash.startsWith('#') ? targetHash : `#${targetHash}`;
    if (window.location.hash === normalized) {
      setRoute(parseHash(normalized));
      setMobileMenuOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    window.location.hash = normalized;
  }, []);

  const handleToggleModuleComplete = useCallback(
    (moduleId: number) => {
      setProgress((prev) => {
        const nextDone = !prev.completed[moduleId];
        showToast(nextDone ? `Module ${moduleId} marked complete!` : `Module ${moduleId} unmarked`);
        return {
          ...prev,
          completed: { ...prev.completed, [moduleId]: nextDone },
        };
      });
    },
    [showToast],
  );

  const handleToggleSubtopic = useCallback((code: string) => {
    setProgress((prev) => ({
      ...prev,
      completedSubtopics: {
        ...prev.completedSubtopics,
        [code]: !prev.completedSubtopics[code],
      },
    }));
  }, []);

  const handleCheckAllSubtopics = useCallback(
    (codes: string[]) => {
      setProgress((prev) => {
        const allChecked = codes.every((c) => prev.completedSubtopics[c]);
        const nextMap = { ...prev.completedSubtopics };
        for (const c of codes) {
          nextMap[c] = !allChecked;
        }
        showToast(allChecked ? 'Unchecked module subtopics' : `Checked all ${codes.length} subtopics!`);
        return { ...prev, completedSubtopics: nextMap };
      });
    },
    [showToast],
  );

  const handleSaveQuizScore = useCallback((moduleId: number, score: number, total: number) => {
    setProgress((prev) => {
      const existing = prev.quizScores[moduleId];
      const bestScore = existing ? Math.max(existing.score, score) : score;
      return {
        ...prev,
        quizScores: {
          ...prev.quizScores,
          [moduleId]: { score: bestScore, total },
        },
        completed: score === total ? { ...prev.completed, [moduleId]: true } : prev.completed,
      };
    });
  }, []);

  const handleToggleRep = useCallback(
    (index: number) => {
      setProgress((prev) => {
        const nextReps = prev.reps.map((v, i) => (i === index ? !v : v));
        showToast(nextReps[index] ? 'Review star earned!' : 'Review star cleared');
        return { ...prev, reps: nextReps };
      });
    },
    [showToast],
  );

  const handleResetProgress = useCallback(() => {
    setProgress({
      completed: {},
      completedSubtopics: {},
      quizScores: {},
      reps: [false, false, false, false, false],
      lastVisitedSlug: MODULES[0].slug,
    });
    showToast('All learning progress reset');
  }, [showToast]);

  const completedCount = Object.values(progress.completed).filter(Boolean).length;
  const activeLessonModule =
    route.view === 'learn' ? getModuleBySlug(route.slug) || MODULES[0] : MODULES[0];

  return (
    <div className="min-h-screen flex flex-col">
      {/* ==================== STICKY SKETCHBOOK HEADER ==================== */}
      <header className="sticky top-0 z-50 bg-paper/95 backdrop-blur-sm border-b-[2.5px] border-ink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-6">
          {/* Zone 1: Preserved Hand-Drawn Brand Mark */}
          <a
            href="#/"
            onClick={(e) => {
              e.preventDefault();
              navigate('#/');
            }}
            className="flex items-center gap-2.5 shrink-0 whitespace-nowrap"
            aria-label="Go with taqui Home"
          >
            <GopherBrandMark className="w-9 h-9" />
            <span className="font-display font-extrabold text-lg tracking-tight text-ink">
              Go with taqui
            </span>
          </a>

          {/* Zone 2: Clean Single-Line Navigation Links */}
          <nav
            className="hidden md:flex items-center gap-6 font-display text-sm font-bold"
            aria-label="Main Navigation"
          >
            <a
              href="#/"
              onClick={(e) => {
                e.preventDefault();
                navigate('#/');
              }}
              className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors ${
                route.view === 'home'
                  ? 'border-ink text-tealDeep'
                  : 'border-transparent text-ink/80 hover:text-ink hover:border-tealInk'
              }`}
            >
              Home
            </a>
            <a
              href="#/syllabus"
              onClick={(e) => {
                e.preventDefault();
                navigate('#/syllabus');
              }}
              className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors ${
                route.view === 'syllabus'
                  ? 'border-ink text-tealDeep'
                  : 'border-transparent text-ink/80 hover:text-ink hover:border-tealInk'
              }`}
            >
              Syllabus
            </a>
            <a
              href={`#/learn/${progress.lastVisitedSlug || MODULES[0].slug}`}
              onClick={(e) => {
                e.preventDefault();
                navigate(`#/learn/${progress.lastVisitedSlug || MODULES[0].slug}`);
              }}
              className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors ${
                route.view === 'learn'
                  ? 'border-ink text-tealDeep'
                  : 'border-transparent text-ink/80 hover:text-ink hover:border-tealInk'
              }`}
            >
              Lessons
            </a>
            <a
              href="#/learn/agentic-ai-with-go"
              onClick={(e) => {
                e.preventDefault();
                navigate('#/learn/agentic-ai-with-go');
              }}
              className="whitespace-nowrap shrink-0 py-1 border-b-2 border-transparent text-ink/80 hover:text-ink hover:border-tealInk transition-colors"
            >
              Agentic Go
            </a>
          </nav>

          {/* Zone 3: Primary Action / Progress Button + Mobile Toggle */}
          <div className="flex items-center gap-2 shrink-0">
            <a
              href="#/syllabus"
              onClick={(e) => {
                e.preventDefault();
                navigate('#/syllabus');
              }}
              className="sketch-btn bg-tealSoft hover:bg-yellowHi px-3.5 py-1.5 font-display text-xs font-extrabold inline-flex items-center gap-1.5 whitespace-nowrap tabular-nums"
              title="View course mastery progress"
            >
              <SketchIcon name="award" className="w-4 h-4" />
              <span>
                {completedCount} / {TOTAL_MODULES}
              </span>
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((o) => !o)}
              className="md:hidden sketch-btn bg-paper p-2"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              <SketchIcon name={mobileMenuOpen ? 'close' : 'menu'} className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t-2 border-ink bg-paper px-4 py-3 space-y-2 font-display text-sm font-bold">
            <a
              href="#/"
              onClick={(e) => {
                e.preventDefault();
                navigate('#/');
              }}
              className="block px-3 py-2 rounded-xl border-2 border-ink bg-paperDark hover:bg-yellowHi"
            >
              Home Overview
            </a>
            <a
              href="#/syllabus"
              onClick={(e) => {
                e.preventDefault();
                navigate('#/syllabus');
              }}
              className="block px-3 py-2 rounded-xl border-2 border-ink bg-paperDark hover:bg-yellowHi"
            >
              Full Syllabus (55 Modules)
            </a>
            <a
              href="#/learn/go-development-environment"
              onClick={(e) => {
                e.preventDefault();
                navigate('#/learn/go-development-environment');
              }}
              className="block px-3 py-2 rounded-xl border-2 border-ink bg-tealSoft hover:bg-yellowHi"
            >
              Module 0: Start Here
            </a>
            <a
              href="#/learn/agentic-ai-with-go"
              onClick={(e) => {
                e.preventDefault();
                navigate('#/learn/agentic-ai-with-go');
              }}
              className="block px-3 py-2 rounded-xl border-2 border-ink bg-yellowSoft hover:bg-yellowHi"
            >
              Module 54: Agentic AI with Go
            </a>
          </div>
        )}
      </header>

      {/* ==================== MAIN MULTI-PAGE CONTENT ==================== */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {route.view === 'home' && (
          <HomeView
            progress={progress}
            onToggleRep={handleToggleRep}
            onNavigate={navigate}
          />
        )}

        {route.view === 'syllabus' && (
          <SyllabusView
            progress={progress}
            onToggleModuleComplete={handleToggleModuleComplete}
            onNavigate={navigate}
            onResetProgress={handleResetProgress}
          />
        )}

        {route.view === 'learn' && (
          <LessonView
            module={activeLessonModule}
            anchor={route.anchor}
            progress={progress}
            onToggleModuleComplete={handleToggleModuleComplete}
            onToggleSubtopic={handleToggleSubtopic}
            onCheckAllSubtopics={handleCheckAllSubtopics}
            onSaveQuizScore={handleSaveQuizScore}
            onNavigate={navigate}
            onToast={showToast}
          />
        )}
      </main>

      {/* ==================== SHARED FOOTER ==================== */}
      <footer className="border-t-[2.5px] border-ink bg-paperDark/85 mt-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="font-display font-extrabold text-xl text-ink">Go with taqui</div>
            <p className="text-base text-ink/80">
              Interactive beginner-to-production Go curriculum with JavaScript, TypeScript,
              Node.js &amp; Python comparisons.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-base">
            <a
              href="#/"
              onClick={(e) => {
                e.preventDefault();
                navigate('#/');
              }}
              className="underline decoration-tealInk decoration-2 font-display font-bold hover:text-tealDeep"
            >
              Home
            </a>
            <span aria-hidden="true">·</span>
            <a
              href="#/syllabus"
              onClick={(e) => {
                e.preventDefault();
                navigate('#/syllabus');
              }}
              className="underline decoration-tealInk decoration-2 font-display font-bold hover:text-tealDeep"
            >
              All 55 Modules
            </a>
            <span aria-hidden="true">·</span>
            <a
              href="https://taqui.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="sketch-btn bg-yellowHi px-3.5 py-1.5 font-display font-extrabold text-sm inline-flex items-center gap-1.5 whitespace-nowrap"
            >
              Built by Md Taqui Imam
              <SketchIcon name="external" className="w-4 h-4" />
            </a>
          </div>
        </div>
      </footer>

      {/* ==================== STICKY-NOTE TOAST ==================== */}
      <div
        role="status"
        aria-live="polite"
        className={`fixed bottom-5 right-5 z-50 transition-all duration-200 bg-yellowHi text-ink font-display font-extrabold text-sm px-4 py-3 rounded-xl border-[2.5px] border-ink shadow-[4px_4px_0px_#222] ${
          toastMsg ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0 pointer-events-none'
        }`}
      >
        {toastMsg || ''}
      </div>
    </div>
  );
}
