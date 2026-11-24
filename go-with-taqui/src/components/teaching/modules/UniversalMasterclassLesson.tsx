import React, { useMemo, useState } from 'react';
import {
  Sparkles,
  BookOpen,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  CheckSquare,
  Code2,
  Copy,
  Check,
  ShieldCheck,
  Zap,
  Cpu,
  Layers,
  Database,
  Cloud,
  Terminal,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';
import { getModuleContent, getSubtopicStudyTip } from '../../../data/curriculum';
import type { AppProgressState, SyllabusModule } from '../../../types';
import { highlightGoHtml } from '../../../utils/highlightGo';
import { SketchIcon } from '../../Icons';
import { InteractiveLab } from '../../InteractiveLabs';
import { AnnotatedCodeCard, CodeAnnotation } from '../AnnotatedCodeCard';
import { MicroCheck } from '../MicroCheck';
import { StepSimulatorShell, SimulatorStep } from '../StepSimulatorShell';
import { Term, PageGlossaryDrawer } from '../Term';

interface UniversalMasterclassLessonProps {
  module: SyllabusModule;
  progress: AppProgressState;
  onToggleModuleComplete: (moduleId: number) => void;
  onToggleSubtopic: (code: string) => void;
  onCheckAllSubtopics: (codes: string[]) => void;
  onSaveQuizScore?: (moduleId: number, score: number, total: number) => void;
  onToast: (msg: string) => void;
  onNavigate?: (hash: string) => void;
}

// Generate dynamic simulator steps based on the module's mental model and code lines
function getDynamicSimulatorSteps(
  module: SyllabusModule,
  lines: [string, string][]
): SimulatorStep[] {
  if (lines.length === 0) {
    return [
      {
        narrator: `Welcome to Module ${module.id}! Go compiles directly to machine code for extreme execution speed and predictable memory usage.`,
        highlightLine: 1,
        badge: 'Step 1: Initialization',
      },
      {
        narrator: `Every concept in this module operates with strict compile-time type safety.`,
        highlightLine: 2,
        badge: 'Step 2: Execution',
      },
    ];
  }

  return lines.map(([codeLine, explanation], idx) => ({
    narrator: `Line ${idx + 1} (${codeLine.trim()}): ${explanation}`,
    highlightLine: idx + 1,
    badge: `Step ${idx + 1} of ${lines.length}`,
  }));
}

// Track-specific vocabulary suggestions
const TRACK_TERMS: Record<string, string[]> = {
  foundations: ['slice', 'array', 'map', 'make', 'zero-value', 'defer'],
  design: ['pointer', 'dereference', 'struct', 'interface', 'nil', 'type-assertion'],
  concurrency: ['goroutine', 'channel', 'mutex', 'waitgroup', 'select', 'deadlock'],
  systems: ['http-handler', 'middleware', 'json-marshal', 'defer', 'panic'],
  backend: ['connection-pool', 'transaction', 'interface', 'struct', 'nil'],
  internals: ['generics', 'type-constraint', 'reflection', 'slice-header', 'gc', 'stack-vs-heap'],
  cloud: ['grpc', 'redis-cache', 'goroutine', 'context', 'channel'],
  ai: ['sse-streaming', 'rag-pipeline', 'ai-agent', 'context', 'goroutine'],
};

export function UniversalMasterclassLesson({
  module,
  progress,
  onToggleModuleComplete,
  onToggleSubtopic,
  onCheckAllSubtopics,
  onSaveQuizScore,
  onToast,
}: UniversalMasterclassLessonProps) {
  const content = getModuleContent(module.id);
  const isCompleted = Boolean(progress.completed[module.id]);

  const [activeTrapTab, setActiveTrapTab] = useState<'mistake' | 'fix'>('mistake');
  const [selectedScenario, setSelectedScenario] = useState(0);
  const [activeCodeLine, setActiveCodeLine] = useState<number | null>(1);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [simStep, setSimStep] = useState(0);

  const checkedSubsCount = module.subtopics.filter(
    (s) => progress.completedSubtopics[s.code]
  ).length;

  const relevantTerms = TRACK_TERMS[module.track.id] || [
    'goroutine',
    'channel',
    'pointer',
    'struct',
    'slice',
  ];

  const annotations: CodeAnnotation[] = useMemo(() => {
    return content.lines.map(([_, explanation], idx) => ({
      line: idx + 1,
      label: explanation,
    }));
  }, [content.lines]);

  const simSteps = useMemo(() => {
    return getDynamicSimulatorSteps(module, content.lines);
  }, [module, content.lines]);

  const handleCopyCode = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(content.goCode).then(() => {
        onToast('Copied Go snippet to clipboard!');
      });
    }
  };

  const handleQuizSubmit = () => {
    const total = content.quiz.length;
    let score = 0;
    content.quiz.forEach((q, idx) => {
      if (quizAnswers[idx] === q.ans) score += 1;
    });
    setQuizSubmitted(true);
    if (onSaveQuizScore) {
      onSaveQuizScore(module.id, score, total);
    }
    if (score === total) {
      onToast(`Perfect Score! ${score}/${total} on Module ${module.id}!`);
    } else {
      onToast(`Scored ${score}/${total}. Review explanations below!`);
    }
  };

  return (
    <div className="space-y-10 min-w-0">
      {/* =========================================================================
          STEP 1: PLAIN-ENGLISH BANNER (Zero Code Yet!)
      ========================================================================= */}
      <section className="sketch-box p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-black uppercase px-3 py-1 rounded-full bg-tealDeep text-paper shadow-[2px_2px_0px_#222]">
              Module {module.id} · {module.track.name}
            </span>
            <span className="font-display font-extrabold text-xs px-2.5 py-0.5 rounded-full bg-yellowHi border border-ink text-ink shadow-[1px_1px_0px_#222] inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-tealDeep" />
              <span>Interactive Masterclass</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <PageGlossaryDrawer termIds={relevantTerms} />
            <button
              type="button"
              onClick={() => {
                onToggleModuleComplete(module.id);
                onToast(isCompleted ? 'Marked incomplete' : `Module ${module.id} Mastered! 🎉`);
              }}
              className={`sketch-btn px-4 py-2 font-display text-xs sm:text-sm font-black inline-flex items-center gap-2 ${
                isCompleted ? 'bg-tealSoft text-ink' : 'bg-yellowHi text-ink'
              }`}
            >
              {isCompleted ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-greenPen" />
                  <span>Completed</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Mark Module Complete</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div>
          <h1 className="font-display font-black text-3xl sm:text-5xl text-ink leading-tight">
            {module.id}. {module.title}
          </h1>
          <p className="font-hand text-xl sm:text-2xl text-ink/85 mt-2 leading-relaxed">
            {content.summary}
          </p>
        </div>

        {/* 8th-Grade Mental Model Speech Bubble */}
        <div className="speech-bubble bg-yellowSoft/90 border-2 border-ink p-5 rounded-2xl shadow-[4px_4px_0px_#222]">
          <div className="font-display font-black text-xs text-tealDeep mb-1.5 flex items-center gap-2 uppercase tracking-wide">
            <Lightbulb className="w-4 h-4 text-tealDeep" />
            <span>The 8th-Grade Mental Model</span>
          </div>
          <p className="font-hand text-lg sm:text-xl font-bold text-ink leading-snug">
            "{content.mentalModel}"
          </p>
        </div>

        {/* Words You'll Learn Here Pill Bar */}
        <div className="pt-3 border-t-2 border-dashed border-ink/20">
          <div className="font-display font-bold text-xs text-ink/70 uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-tealDeep" />
            <span>Key Words In This Module (Click to Learn Without Leaving Tab)</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {relevantTerms.map((termId) => (
              <Term key={termId} id={termId} />
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          STEP 2: WHY DO WE CARE? (The Disaster Without It & Real App Usage)
      ========================================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Disaster Card */}
        <div className="sketch-box-yellow p-6 space-y-3 border-redPen/40 shadow-[4px_4px_0px_#D64545]">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-redPen shrink-0" />
            <h3 className="font-display font-black text-lg text-redPen uppercase tracking-wide">
              The Catastrophe Without It
            </h3>
          </div>
          <p className="font-hand text-base sm:text-lg text-ink leading-relaxed">
            {content.mistake}
          </p>
          <div className="font-mono text-xs bg-redPen/10 border border-redPen/30 text-redPen rounded-xl p-2.5 font-bold">
            ⚠️ Warning: Ignoring this causes silent runtime crashes, panics, or memory corruption.
          </div>
        </div>

        {/* Real-World Production Architecture Card */}
        <div className="sketch-box-teal p-6 space-y-3 shadow-[4px_4px_0px_#1B4947]">
          <div className="flex items-center gap-2">
            <Cloud className="w-5 h-5 text-tealDeep shrink-0" />
            <h3 className="font-display font-black text-lg text-tealDeep uppercase tracking-wide">
              Used In Production At Scale
            </h3>
          </div>
          <p className="font-hand text-base sm:text-lg text-ink leading-relaxed">
            {content.realApp}
          </p>
          <div className="font-mono text-xs bg-tealSoft border border-ink/30 text-ink rounded-xl p-2.5 font-bold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-tealDeep shrink-0" />
            <span>Industry Standard: Powers Docker, Kubernetes, CockroachDB & Cloudflare Edge.</span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          STEP 3: INTERACTIVE STORY LAB & VISUAL STAGE
      ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold uppercase bg-yellowHi border border-ink px-2.5 py-0.5 rounded-full text-ink">
              Interactive Lab
            </span>
            <h2 className="font-display font-black text-2xl text-ink">
              Step-by-Step Laboratory & Code Sync
            </h2>
          </div>
        </div>

        {/* Step Simulator Shell */}
        <StepSimulatorShell
          title={`Lab: Exploring Module ${module.id} (${module.title})`}
          subtitle="Watch how the Go runtime executes this pattern step-by-step"
          steps={simSteps}
          currentStep={simStep}
          onStepChange={setSimStep}
          codeSnippet={content.goCode}
        >
          {/* Visual Interactive Stage embedded directly */}
          <div className="space-y-4">
            <div className="font-display font-bold text-xs text-ink/70 uppercase tracking-wide flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-tealDeep" />
              <span>Interactive Experimentation Sandbox</span>
            </div>
            <InteractiveLab labType={content.lab} moduleId={module.id} />
          </div>
        </StepSimulatorShell>
      </section>

      {/* =========================================================================
          STEP 4: LINE-BY-LINE INTERACTIVE CODE CARD (With JS & Python Bridge)
      ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-black text-2xl text-ink flex items-center gap-2">
            <Code2 className="w-6 h-6 text-tealDeep" />
            <span>Annotated Source Code & Ecosystem Bridges</span>
          </h2>
          <button
            type="button"
            onClick={handleCopyCode}
            className="sketch-btn bg-paper px-3 py-1.5 font-display text-xs font-bold inline-flex items-center gap-1.5 hover:bg-yellowHi"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy Snippet</span>
          </button>
        </div>

        <AnnotatedCodeCard
          title={`Go Code Scrap — Module ${module.id}`}
          goCode={content.goCode}
          annotations={annotations}
          jsCode={`// JavaScript / Node.js Comparison\n// ${content.jsBridge}`}
          jsExplanation={content.jsBridge}
        />

        {/* Python Bridge Callout */}
        <div className="sketch-box-yellow p-4 text-xs font-hand text-ink space-y-1">
          <div className="font-display font-bold text-tealDeep uppercase tracking-wide flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5" />
            <span>Python Developer Bridge</span>
          </div>
          <p className="text-sm text-ink/90">{content.pyBridge}</p>
        </div>
      </section>

      {/* =========================================================================
          STEP 5: COMMON BEGINNER TRAPS ("Don't Do This!")
      ========================================================================= */}
      <section className="sketch-box p-6 sm:p-7 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-black text-2xl text-ink">
              Common Beginner Traps ("Don't Do This!")
            </h2>
            <p className="font-hand text-base text-ink/75">
              The exact pitfalls new Go developers face and how to fix them idiomatically.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTrapTab('mistake')}
            className={`sketch-btn px-4 py-1.5 text-xs font-display font-black inline-flex items-center gap-1.5 ${
              activeTrapTab === 'mistake'
                ? 'bg-redPen/20 text-redPen border-redPen'
                : 'bg-paper text-ink/60'
            }`}
          >
            <XCircle className="w-3.5 h-3.5 text-redPen shrink-0" />
            <span>The Mistake</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTrapTab('fix')}
            className={`sketch-btn px-4 py-1.5 text-xs font-display font-black inline-flex items-center gap-1.5 ${
              activeTrapTab === 'fix'
                ? 'bg-greenPen/20 text-greenPen border-greenPen shadow-[2px_2px_0px_#2E8B57]'
                : 'bg-paper text-ink/60'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-greenPen shrink-0" />
            <span>The Idiomatic Fix</span>
          </button>
        </div>

        <div className="p-4 rounded-xl border-2 border-ink bg-paperDark font-mono text-xs overflow-x-auto">
          {activeTrapTab === 'mistake' ? (
            <div className="space-y-2">
              <div className="text-redPen font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-redPen shrink-0" />
                <span>❌ Broken Pattern:</span>
              </div>
              <pre className="text-ink/90 whitespace-pre-wrap">{content.mistake}</pre>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-greenPen font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-greenPen shrink-0" />
                <span>✅ Idiomatic Go Solution:</span>
              </div>
              <pre className="text-ink/90 whitespace-pre-wrap">
                {`// Safe, idiomatic pattern enforced by Go:\n// Always handle errors, respect zero values, and follow Go conventions.`}
              </pre>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          STEP 6: 1-GLANCE MEMORY CHEAT SHEET
      ========================================================================= */}
      <section className="sketch-box-yellow p-6 sm:p-7 space-y-4">
        <h2 className="font-display font-black text-2xl text-ink flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-tealDeep" />
          <span>1-Glance Memory Cheat Sheet</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="bg-paper p-3.5 rounded-xl border-2 border-ink space-y-1">
            <div className="font-display font-black text-xs text-tealDeep">1. Zero Values</div>
            <p className="font-hand text-sm text-ink/85">
              Go never uses undefined. Memory starts at 0, "", false, or nil.
            </p>
          </div>
          <div className="bg-paper p-3.5 rounded-xl border-2 border-ink space-y-1">
            <div className="font-display font-black text-xs text-tealDeep">2. Fast Compilation</div>
            <p className="font-hand text-sm text-ink/85">
              Single static binary output. Deploys everywhere with zero external runtime.
            </p>
          </div>
          <div className="bg-paper p-3.5 rounded-xl border-2 border-ink space-y-1">
            <div className="font-display font-black text-xs text-tealDeep">3. Explicit Errors</div>
            <p className="font-hand text-sm text-ink/85">
              Errors are values returned as the last parameter, never silently thrown.
            </p>
          </div>
          <div className="bg-paper p-3.5 rounded-xl border-2 border-ink space-y-1">
            <div className="font-display font-black text-xs text-tealDeep">4. Memory Safety</div>
            <p className="font-hand text-sm text-ink/85">
              The compiler prevents dangling pointers with stack escape analysis.
            </p>
          </div>
          <div className="bg-paper p-3.5 rounded-xl border-2 border-ink space-y-1">
            <div className="font-display font-black text-xs text-tealDeep">5. Composition</div>
            <p className="font-hand text-sm text-ink/85">
              Prefer struct embedding and small interfaces over rigid class hierarchies.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          STEP 7: SUBTOPICS CHECKLIST & FINAL MODULE QUIZ
      ========================================================================= */}
      <section className="sketch-box p-6 sm:p-7 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b-2 border-dashed border-ink/20">
          <div>
            <h2 className="font-display font-black text-2xl text-ink">
              Subtopics Mastery Checklist ({checkedSubsCount}/{module.subtopics.length})
            </h2>
            <p className="font-hand text-base text-ink/75">
              Check off each topic as you feel confident with its concepts.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onCheckAllSubtopics(module.subtopics.map((s) => s.code))}
            className="sketch-btn bg-paper px-3.5 py-1.5 font-display text-xs font-bold hover:bg-tealSoft inline-flex items-center gap-1.5"
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Check All Subtopics</span>
          </button>
        </div>

        {/* Subtopics Checklist Items with Study Tips */}
        <div className="space-y-3">
          {module.subtopics.map((sub) => {
            const isDone = Boolean(progress.completedSubtopics[sub.code]);
            const tip = getSubtopicStudyTip(module, sub);
            return (
              <div
                key={sub.code}
                className={`p-3.5 rounded-xl border-2 transition-all ${
                  isDone
                    ? 'bg-tealSoft/30 border-tealDeep/50'
                    : 'bg-paper border-ink hover:bg-paperDark'
                }`}
              >
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isDone}
                    onChange={() => onToggleSubtopic(sub.code)}
                    className="mt-1 w-4 h-4 rounded border-2 border-ink text-tealDeep focus:ring-tealDeep"
                  />
                  <div className="space-y-0.5">
                    <div className="font-display font-bold text-sm text-ink flex items-center gap-2">
                      <span className="font-mono text-xs text-ink/60">{sub.code}</span>
                      <span>{sub.title}</span>
                      {isDone && (
                        <CheckCircle2 className="w-4 h-4 text-greenPen shrink-0 inline" />
                      )}
                    </div>
                    {tip && (
                      <p className="font-hand text-xs text-ink/75 leading-relaxed">
                        💡 <strong>Teacher Tip:</strong> {tip}
                      </p>
                    )}
                  </div>
                </label>
              </div>
            );
          })}
        </div>

        {/* =========================================================================
            FINAL MODULE ASSESSMENT QUIZ
        ========================================================================= */}
        <div className="pt-6 border-t-2 border-dashed border-ink/20 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-black text-xl text-ink flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-tealDeep" />
              <span>Module {module.id} Mastery Quiz ({content.quiz.length} Questions)</span>
            </h3>
            {quizSubmitted && (
              <button
                type="button"
                onClick={() => {
                  setQuizSubmitted(false);
                  setQuizAnswers({});
                }}
                className="sketch-btn bg-paper px-3 py-1 font-display text-xs font-bold hover:bg-yellowHi inline-flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Quiz</span>
              </button>
            )}
          </div>

          <div className="space-y-4">
            {content.quiz.map((q, qIdx) => (
              <MicroCheck
                key={qIdx}
                question={`${qIdx + 1}. [${q.type}] ${q.q}`}
                options={q.opts}
                correctIndex={q.ans}
                explanation={q.why}
              />
            ))}
          </div>

          {!quizSubmitted && (
            <button
              type="button"
              onClick={handleQuizSubmit}
              className="sketch-btn bg-yellowHi text-ink px-5 py-2.5 font-display text-sm font-black inline-flex items-center gap-2 shadow-[3px_3px_0px_#222] hover:bg-yellowSoft"
            >
              <Check className="w-4 h-4" />
              <span>Complete Module Assessment</span>
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
