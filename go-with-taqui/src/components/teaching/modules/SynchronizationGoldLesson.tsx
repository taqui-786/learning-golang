import React, { useState } from 'react';
import type { AppProgressState, SyllabusModule } from '../../../types';
import { SketchIcon } from '../../Icons';
import { AnnotatedCodeCard } from '../AnnotatedCodeCard';
import { LessonSection } from '../LessonSection';
import { MicroCheck } from '../MicroCheck';
import { StepSimulatorShell, SimulatorStep } from '../StepSimulatorShell';
import { Term, PageGlossaryDrawer } from '../Term';

interface SynchronizationGoldLessonProps {
  module: SyllabusModule;
  progress: AppProgressState;
  onToggleModuleComplete: (moduleId: number) => void;
  onToggleSubtopic: (code: string) => void;
  onCheckAllSubtopics: (codes: string[]) => void;
  onSaveQuizScore?: (moduleId: number, score: number, total: number) => void;
  onToast: (msg: string) => void;
  onNavigate?: (hash: string) => void;
}

// =========================================================================
// LAB 1: DATA RACE & LOST OVERWRITE (The Invisible Chalkboard Thief)
// =========================================================================
function DataRaceLab() {
  const [mode, setMode] = useState<'race' | 'safe'>('race');
  const [step, setStep] = useState(0);

  const raceSteps: SimulatorStep[] = [
    {
      narrator: 'Initial State: Shared RAM variable `counter = 0`. Goroutine A and Goroutine B are both waiting to run `counter++`.',
      highlightLine: 7,
      badge: 'Step 1/7 · Idle RAM',
    },
    {
      narrator: 'Goroutine A reads RAM: `counter` is 0. Goroutine A loads `0` into its private CPU Register A.',
      highlightLine: 10,
      badge: 'Step 2/7 · Worker A Reads',
    },
    {
      narrator: 'Context switch! Before Worker A can write back, Worker B interrupts and ALSO reads `counter = 0` into Register B!',
      highlightLine: 16,
      badge: 'Step 3/7 · Worker B Preempts',
    },
    {
      narrator: 'Worker A resumes: computes 0 + 1 = 1, and writes `counter = 1` into shared RAM.',
      highlightLine: 11,
      badge: 'Step 4/7 · Worker A Writes 1',
    },
    {
      narrator: 'Worker B resumes: its stale register was 0, so it computes 0 + 1 = 1, and writes `counter = 1` to RAM — OVERWRITING Worker A!',
      highlightLine: 17,
      badge: 'Step 5/7 · Fatal Overwrite!',
    },
    {
      narrator: 'Both goroutines did their job, but `counter` is 1 instead of 2! One entire operation evaporated into thin air!',
      highlightLine: 23,
      badge: 'Step 6/7 · Silent Data Loss',
    },
    {
      narrator: 'Go to the rescue! Running `go run -race main.go` flags this bug immediately with a stack trace of conflicting memory accesses!',
      highlightLine: 24,
      badge: 'Step 7/7 · Race Detector Alert',
    },
  ];

  const safeSteps: SimulatorStep[] = [
    {
      narrator: 'Initial State: Shared RAM variable `counter = 0`. Protected by `var mu sync.Mutex`. Lock is currently UNLOCKED 🟢.',
      highlightLine: 8,
      badge: 'Step 1/7 · Mutex Ready',
    },
    {
      narrator: 'Goroutine A calls `mu.Lock()`. It acquires the brass key. Lock is now LOCKED 🔴 by Goroutine A.',
      highlightLine: 11,
      badge: 'Step 2/7 · Worker A Locks',
    },
    {
      narrator: 'Goroutine B attempts `mu.Lock()`. The lock is held! The Go runtime parks Worker B to sleep in the wait queue.',
      highlightLine: 19,
      badge: 'Step 3/7 · Worker B Blocked',
    },
    {
      narrator: 'Goroutine A safely reads 0, increments to 1, and writes `counter = 1`. No other goroutine can interfere!',
      highlightLine: 13,
      badge: 'Step 4/7 · Worker A Writes Safely',
    },
    {
      narrator: 'Goroutine A finishes and calls `mu.Unlock()`. The brass key is returned. Lock is UNLOCKED 🟢!',
      highlightLine: 14,
      badge: 'Step 5/7 · Worker A Unlocks',
    },
    {
      narrator: 'Go scheduler wakes Goroutine B. Worker B acquires the lock 🔴, reads `counter = 1`, and writes `counter = 2`!',
      highlightLine: 21,
      badge: 'Step 6/7 · Worker B Updates',
    },
    {
      narrator: 'Worker B unlocks. Both increments succeeded! Final count is 2. Clean, deterministic, and 100% bug-free!',
      highlightLine: 26,
      badge: 'Step 7/7 · Perfect Execution',
    },
  ];

  const currentSteps = mode === 'race' ? raceSteps : safeSteps;

  const raceCode = `package main

import (
\t"fmt"
\t"time"
)

var counter = 0 // Shared memory without lock!

func main() {
\tgo func() {
\t\tregA := counter // Read RAM
\t\tcounter = regA + 1 // Write RAM
\t}()

\tgo func() {
\t\tregB := counter // Interrupted read!
\t\tcounter = regB + 1 // Overwrites A!
\t}()

\ttime.Sleep(50 * time.Millisecond)
\tfmt.Println("Counter:", counter)
\t// Output: Counter: 1 (LOST UPDATE!)
\t// go run -race detects this instantly!
}`;

  const safeCode = `package main

import (
\t"fmt"
\t"sync"
)

var (
\tcounter = 0
\tmu      sync.Mutex // The single-occupant bathroom key!
)

func main() {
\tvar wg sync.WaitGroup
\twg.Add(2)

\tgo func() {
\t\tdefer wg.Done()
\t\tmu.Lock()
\t\tcounter++
\t\tmu.Unlock()
\t}()

\tgo func() {
\t\tdefer wg.Done()
\t\tmu.Lock()
\t\tcounter++
\t\tmu.Unlock()
\t}()

\twg.Wait()
\tfmt.Println("Counter:", counter) // Always 2!
}`;

  return (
    <StepSimulatorShell
      title="Lab 1: The Chalkboard Thief — Data Race & Lost Overwrite"
      subtitle="Watch two goroutines fight over a single shared variable in RAM"
      modeToggle={{
        current: mode,
        options: [
          { id: 'race', label: '❌ Without Mutex (Data Race)', icon: 'alert' },
          { id: 'safe', label: '✅ With sync.Mutex (Safe)', icon: 'shield' },
        ],
        onChange: (newMode) => {
          setMode(newMode as 'race' | 'safe');
          setStep(0);
        },
      }}
      steps={currentSteps}
      currentStep={step}
      onStepChange={setStep}
      codeSnippet={mode === 'race' ? raceCode : safeCode}
    >
      <div className="space-y-4">
        {/* Memory & Worker Visual Stage */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
          {/* Worker A */}
          <div
            className={`sketch-box p-3.5 space-y-2 transition-all ${
              step === 1 || step === 3
                ? 'bg-tealSoft border-tealDeep shadow-[3px_3px_0px_#146F77]'
                : 'bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-display font-black text-sm text-ink flex items-center gap-1.5">
                <span>🏃‍♂️</span> Worker A
              </span>
              <span className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-tealSoft text-tealDeep font-bold">
                Goroutine 1
              </span>
            </div>
            <div className="bg-paper p-2 rounded-xl border border-ink/30 text-xs font-mono space-y-1">
              <div className="text-ink/60 text-[10px] uppercase font-bold">Local Register:</div>
              <div className="font-bold text-sm text-tealDeep">
                {mode === 'race'
                  ? step >= 1 && step < 4
                    ? 'regA = 0'
                    : step >= 3
                    ? 'regA = 1'
                    : 'empty'
                  : step >= 3
                  ? 'regA = 1'
                  : 'idle'}
              </div>
            </div>
            <div className="text-[11px] font-hand text-ink/75">
              {mode === 'race'
                ? step === 1
                  ? '📖 Reading counter (0)...'
                  : step === 3
                  ? '✍️ Writing 1 to RAM...'
                  : step >= 4
                  ? '✅ Finished execution'
                  : '⏳ Ready to run'
                : step === 1
                ? '🔑 Grabbed Mutex Key'
                : step === 3
                ? '✍️ Safely modifying RAM'
                : step >= 4
                ? '🔓 Returned Key'
                : '⏳ Waiting'}
            </div>
          </div>

          {/* Central Shared RAM */}
          <div className="sketch-box-yellow p-4 text-center space-y-2 relative">
            <div className="text-xs font-display font-black text-ink uppercase tracking-wider flex items-center justify-center gap-1.5">
              <span>💾</span> Shared RAM Cell
            </div>
            <div className="bg-paper border-2 border-ink rounded-2xl py-3 px-4 shadow-[2px_2px_0px_#222]">
              <div className="text-[11px] font-mono text-ink/60">var counter int</div>
              <div
                className={`font-mono text-3xl font-black transition-transform duration-200 ${
                  step === 3 || step === 4 || (mode === 'safe' && (step === 3 || step === 5))
                    ? 'scale-125 text-redPen'
                    : 'text-ink'
                }`}
              >
                {mode === 'race'
                  ? step < 3
                    ? 0
                    : 1
                  : step < 3
                  ? 0
                  : step < 5
                  ? 1
                  : 2}
              </div>
            </div>
            <div className="text-xs font-hand font-bold text-ink/80">
              {mode === 'race' && step >= 4 ? (
                <span className="text-redPen font-black">⚠️ Should be 2, but it is 1!</span>
              ) : mode === 'safe' && step >= 6 ? (
                <span className="text-greenPen font-black">🎉 Mathematically perfect: 2</span>
              ) : (
                'Memory Address: 0x00c00001a0'
              )}
            </div>
          </div>

          {/* Worker B */}
          <div
            className={`sketch-box p-3.5 space-y-2 transition-all ${
              step === 2 || step === 4 || (mode === 'safe' && step === 5)
                ? 'bg-yellowSoft border-ink shadow-[3px_3px_0px_#222]'
                : 'bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-display font-black text-sm text-ink flex items-center gap-1.5">
                <span>🏃‍♀️</span> Worker B
              </span>
              <span className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-yellowHi text-ink font-bold border border-ink/40">
                Goroutine 2
              </span>
            </div>
            <div className="bg-paper p-2 rounded-xl border border-ink/30 text-xs font-mono space-y-1">
              <div className="text-ink/60 text-[10px] uppercase font-bold">Local Register:</div>
              <div className="font-bold text-sm text-ink">
                {mode === 'race'
                  ? step >= 2 && step < 4
                    ? 'regB = 0 (STALE!)'
                    : step >= 4
                    ? 'regB = 1'
                    : 'empty'
                  : step >= 5
                  ? 'regB = 2'
                  : 'idle'}
              </div>
            </div>
            <div className="text-[11px] font-hand text-ink/75">
              {mode === 'race'
                ? step === 2
                  ? '👀 Read 0 before A could write!'
                  : step === 4
                  ? '💥 Overwrote Worker A with 1!'
                  : step >= 5
                  ? '✅ Finished execution'
                  : '⏳ Ready to run'
                : step === 2
                ? '🛑 Blocked outside! Mutex busy'
                : step === 5
                ? '🔑 Acquired Key, writes 2'
                : step >= 6
                ? '🔓 Returned Key'
                : '⏳ Waiting'}
            </div>
          </div>
        </div>

        {/* Race Detector Terminal Callout */}
        {mode === 'race' && step === 6 && (
          <div className="bg-ink text-paper rounded-2xl p-4 font-mono text-xs space-y-1.5 border-2 border-redPen shadow-[4px_4px_0px_#D64545] animate-in fade-in duration-200">
            <div className="text-yellowHi font-bold flex items-center gap-2">
              <SketchIcon name="alert" className="w-4 h-4 text-redPen" />
              $ go run -race main.go
            </div>
            <div className="text-redPen font-bold">
              ==================<br />
              WARNING: DATA RACE<br />
              Write at 0x00c00001a0 by goroutine 7:<br />
              &nbsp;&nbsp;main.main.func2()<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/app/main.go:17 +0x3a<br />
              Previous write at 0x00c00001a0 by goroutine 6:<br />
              &nbsp;&nbsp;main.main.func1()<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/app/main.go:11 +0x3a<br />
              ==================<br />
              Found 1 data race(s)! Exit status 66
            </div>
            <div className="text-paper/70 pt-1 text-[11px] font-hand">
              💡 Always run <code>go test -race ./...</code> and <code>go run -race .</code> in CI/CD!
            </div>
          </div>
        )}
      </div>
    </StepSimulatorShell>
  );
}

// =========================================================================
// LAB 2: SYNC.MUTEX & SYNC.RWMUTEX (The Single-Occupant Bathroom Key)
// =========================================================================
function MutexLab() {
  const [mode, setMode] = useState<'mutex' | 'rwmutex'>('mutex');
  const [step, setStep] = useState(0);

  const mutexSteps: SimulatorStep[] = [
    {
      narrator: 'Initial State: Bank Account has $100. Mutex Lock is UNLOCKED 🟢 (The brass key is hanging on the wall hook).',
      highlightLine: 8,
      badge: 'Step 1/7 · Key Available',
    },
    {
      narrator: 'Goroutine A (Deposit $50) calls `mu.Lock()`. It takes the brass key off the hook. Door is LOCKED 🔴!',
      highlightLine: 16,
      badge: 'Step 2/7 · Worker A Locks',
    },
    {
      narrator: 'Goroutine B (Deposit $25) arrives and calls `mu.Lock()`. Key is missing! Go scheduler puts Worker B to sleep in hallway.',
      highlightLine: 24,
      badge: 'Step 3/7 · Worker B Queued',
    },
    {
      narrator: 'Worker A performs bank operation inside the room: $100 + $50 = $150. Nobody else can touch the balance!',
      highlightLine: 17,
      badge: 'Step 4/7 · Safe Mutation ($150)',
    },
    {
      narrator: 'Worker A finishes and executes `defer mu.Unlock()`. It hands the brass key back. Door is UNLOCKED 🟢!',
      highlightLine: 18,
      badge: 'Step 5/7 · Key Returned',
    },
    {
      narrator: 'Go scheduler instantly wakes Worker B! Worker B grabs key, locks the door 🔴, and deposits $25 ($150 + $25 = $175).',
      highlightLine: 25,
      badge: 'Step 6/7 · Worker B Runs',
    },
    {
      narrator: 'Worker B unlocks. Both deposits completed safely. Final balance is exactly $175! Zero race, zero corruption.',
      highlightLine: 31,
      badge: 'Step 7/7 · Complete ($175)',
    },
  ];

  const rwSteps: SimulatorStep[] = [
    {
      narrator: 'sync.RWMutex: Think of a Museum Plaque. 100 people can read the plaque at the same time without bothering each other!',
      highlightLine: 8,
      badge: 'Step 1/6 · Open to All Readers',
    },
    {
      narrator: 'Reader 1 & Reader 2 both call `rw.RLock()`. Both enter the room together! Concurrent Readers: 2 🟢🟢.',
      highlightLine: 15,
      badge: 'Step 2/6 · Multiple Shared Reads',
    },
    {
      narrator: 'Reader 3 joins with `rw.RLock()`. Concurrent Readers: 3 🟢🟢🟢. High read throughput, zero blocking between readers!',
      highlightLine: 18,
      badge: 'Step 3/6 · 3 Simultaneous Reads',
    },
    {
      narrator: 'A Writer arrives wanting to update the plaque! Calls `rw.Lock()`. Writer is BLOCKED until all 3 readers finish.',
      highlightLine: 26,
      badge: 'Step 4/6 · Writer Waiting',
    },
    {
      narrator: 'Readers finish and call `rw.RUnlock()`. Active Readers drop to 0. The Writer now grabs EXCLUSIVE write lock 🔴!',
      highlightLine: 27,
      badge: 'Step 5/6 · Exclusive Writer Lock',
    },
    {
      narrator: 'Writer updates plaque: "Price: $149", then calls `rw.Unlock()`. Plaque unlocked, normal reader traffic resumes!',
      highlightLine: 28,
      badge: 'Step 6/6 · Write Finished',
    },
  ];

  const currentSteps = mode === 'mutex' ? mutexSteps : rwSteps;

  const mutexCode = `package main

import (
\t"fmt"
\t"sync"
)

type BankAccount struct {
\tmu      sync.Mutex // Always protect shared state!
\tbalance int
}

func (a *BankAccount) Deposit(amount int) {
\ta.mu.Lock()
\tdefer a.mu.Unlock() // Guaranteed return of key!
\ta.balance += amount
}

func main() {
\tacc := &BankAccount{balance: 100}
\tvar wg sync.WaitGroup
\twg.Add(2)

\tgo func() { defer wg.Done(); acc.Deposit(50) }()
\tgo func() { defer wg.Done(); acc.Deposit(25) }()

\twg.Wait()
\tfmt.Println("Final Balance: $", acc.balance) // Always 175!
}`;

  const rwCode = `package main

import (
\t"fmt"
\t"sync"
)

type MuseumPlaque struct {
\trw  sync.RWMutex
\tmsg string
}

func (p *MuseumPlaque) Read() string {
\tp.rw.RLock()         // Multiple readers allowed!
\tdefer p.rw.RUnlock()
\treturn p.msg
}

func (p *MuseumPlaque) Update(newMsg string) {
\tp.rw.Lock()          // Exclusive lock: NO readers allowed!
\tdefer p.rw.Unlock()
\tp.msg = newMsg
}`;

  return (
    <StepSimulatorShell
      title="Lab 2: The Bathroom Key — sync.Mutex & sync.RWMutex"
      subtitle="Guaranteed mutual exclusion: only one holder of the brass key at a time"
      modeToggle={{
        current: mode,
        options: [
          { id: 'mutex', label: '🔒 sync.Mutex (Exclusive Lock)', icon: 'lock' },
          { id: 'rwmutex', label: '📖 sync.RWMutex (Multiple Readers)', icon: 'book' },
        ],
        onChange: (newMode) => {
          setMode(newMode as 'mutex' | 'rwmutex');
          setStep(0);
        },
      }}
      steps={currentSteps}
      currentStep={step}
      onStepChange={setStep}
      codeSnippet={mode === 'mutex' ? mutexCode : rwCode}
    >
      <div className="space-y-4">
        {mode === 'mutex' ? (
          /* MUTEX BATHROOM VISUAL */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-stretch">
            {/* The Waiting Hallway */}
            <div className="sketch-box p-3.5 space-y-2">
              <div className="text-xs font-display font-black text-ink uppercase tracking-wide flex items-center gap-1.5">
                <span>🚪</span> Hallway Queue
              </div>
              <div className="space-y-2 min-h-[90px] flex flex-col justify-center">
                {step < 2 ? (
                  <div className="text-xs font-hand text-ink/70 text-center py-2">
                    Workers ready at start
                  </div>
                ) : step === 2 || step === 3 ? (
                  <div className="bg-yellowSoft p-2.5 rounded-xl border border-ink text-xs font-display font-bold text-ink flex items-center gap-2 animate-pulse">
                    <span>💤</span> Worker B asleep waiting for key...
                  </div>
                ) : (
                  <div className="text-xs font-hand text-greenPen font-bold text-center">
                    Queue clear! All workers served.
                  </div>
                )}
              </div>
            </div>

            {/* The Restroom / Critical Section */}
            <div
              className={`sketch-box p-4 text-center space-y-2 transition-all ${
                step === 1 || step === 2 || step === 3 || step === 5
                  ? 'bg-redPen/10 border-redPen shadow-[4px_4px_0px_#D64545]'
                  : 'bg-greenPen/10 border-greenPen shadow-[4px_4px_0px_#2E8B57]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-display font-black text-ink uppercase">
                  Bathroom Stall
                </span>
                <span
                  className={`font-mono text-[10px] font-black px-2 py-0.5 rounded-full border ${
                    step === 1 || step === 2 || step === 3 || step === 5
                      ? 'bg-redPen text-paper border-redPen'
                      : 'bg-greenPen text-paper border-greenPen'
                  }`}
                >
                  {step === 1 || step === 2 || step === 3 || step === 5
                    ? '🔴 OCCUPIED'
                    : '🟢 VACANT'}
                </span>
              </div>

              <div className="py-2">
                <div className="text-3xl">
                  {step === 1 || step === 2 || step === 3
                    ? '🏃‍♂️'
                    : step === 5
                    ? '🏃‍♀️'
                    : '🚪'}
                </div>
                <div className="font-display font-bold text-xs text-ink mt-1">
                  {step === 1 || step === 2 || step === 3
                    ? 'Worker A inside'
                    : step === 5
                    ? 'Worker B inside'
                    : 'Nobody inside (Safe)'}
                </div>
              </div>

              {/* Shared Resource Value */}
              <div className="bg-paper border-2 border-ink rounded-xl p-2 font-mono text-xs">
                <div className="text-[10px] text-ink/60">bankAccount.balance:</div>
                <div className="text-xl font-black text-ink">
                  ${step < 3 ? 100 : step < 5 ? 150 : 175}
                </div>
              </div>
            </div>

            {/* The Key Hook */}
            <div className="sketch-box-yellow p-3.5 space-y-2 text-center flex flex-col justify-center">
              <div className="text-xs font-display font-black text-ink uppercase">
                Wall Key Hook
              </div>
              <div className="text-3xl py-1">
                {step === 1 || step === 2 || step === 3 || step === 5
                  ? '🪝 (Empty)'
                  : '🗝️ (Brass Key)'}
              </div>
              <div className="text-xs font-hand text-ink/80 leading-snug">
                {step === 1 || step === 2 || step === 3
                  ? 'Key held by Worker A'
                  : step === 5
                  ? 'Key held by Worker B'
                  : 'Key on hook (Ready for mu.Lock())'}
              </div>
            </div>
          </div>
        ) : (
          /* RWMUTEX VISUAL */
          <div className="sketch-box p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b-2 border-dashed border-ink/20">
              <div className="font-display font-black text-sm text-ink flex items-center gap-2">
                <span>🏛️</span> Museum Plaque State
              </div>
              <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-tealSoft text-tealDeep border border-ink/40">
                Plaque: {step < 5 ? '"Price: $99"' : '"Price: $149"'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Readers Panel */}
              <div className="bg-tealSoft/40 border-2 border-tealDeep rounded-xl p-3 space-y-2">
                <div className="font-display font-bold text-xs text-tealDeep flex items-center justify-between">
                  <span>📖 Readers with RLock()</span>
                  <span className="font-mono text-xs font-black">
                    {step === 1
                      ? '2 Active'
                      : step === 2
                      ? '3 Active'
                      : step === 3
                      ? '3 Active'
                      : '0 Active'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-2xl py-1">
                  {step >= 1 && step <= 3 ? (
                    <>
                      <span>👓 Reader 1</span>
                      <span>👓 Reader 2</span>
                      {step >= 2 && <span>👓 Reader 3</span>}
                    </>
                  ) : (
                    <span className="text-xs font-hand text-ink/60">No readers currently reading</span>
                  )}
                </div>
                <div className="text-[11px] font-hand text-ink/75">
                  Readers share read access concurrently without blocking one another!
                </div>
              </div>

              {/* Writer Panel */}
              <div
                className={`border-2 rounded-xl p-3 space-y-2 transition-all ${
                  step === 3
                    ? 'bg-yellowSoft border-ink'
                    : step >= 4
                    ? 'bg-redPen/20 border-redPen'
                    : 'bg-paper border-ink/40'
                }`}
              >
                <div className="font-display font-bold text-xs text-ink flex items-center justify-between">
                  <span>✍️ Exclusive Writer</span>
                  <span className="font-mono text-xs font-black">
                    {step === 3
                      ? '⏸️ Blocked'
                      : step === 4
                      ? '🔴 Writing Exclusive'
                      : 'Idle'}
                  </span>
                </div>
                <div className="text-sm font-hand font-bold text-ink py-1">
                  {step === 3
                    ? '⏳ Writer waiting for all 3 readers to finish...'
                    : step === 4
                    ? '🔒 Exclusive lock acquired! Changing price to $149...'
                    : '✅ Writer finished and released lock.'}
                </div>
                <div className="text-[11px] font-hand text-ink/70">
                  Writers block all new readers and existing readers to prevent torn writes.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </StepSimulatorShell>
  );
}

// =========================================================================
// LAB 3: SYNC.WAITGROUP (The School Bus Roll Call)
// =========================================================================
function WaitGroupLab() {
  const [step, setStep] = useState(0);

  const steps: SimulatorStep[] = [
    {
      narrator: 'Initial State: The School Bus driver (`main()` goroutine) is parked outside the museum with counter = 0.',
      highlightLine: 11,
      badge: 'Step 1/8 · Bus Parked',
    },
    {
      narrator: 'Bus Driver calls `wg.Add(3)`. The driver sets their mechanical clicker counter to 3: "3 students out doing field work".',
      highlightLine: 12,
      badge: 'Step 2/8 · Clicker = 3',
    },
    {
      narrator: 'Main spawns 3 student goroutines (`go download(...)`). Each student runs into the museum to fetch data.',
      highlightLine: 15,
      badge: 'Step 3/8 · Students Dispatched',
    },
    {
      narrator: 'Main hits `wg.Wait()`. The bus driver stops, turns off ignition, and BLOCKS. The bus cannot leave until counter = 0!',
      highlightLine: 23,
      badge: 'Step 4/8 · Driver Waiting',
    },
    {
      narrator: 'Student 2 finishes downloading fast! It taps their card: `defer wg.Done()`. Clicker decrements: 3 -> 2!',
      highlightLine: 18,
      badge: 'Step 5/8 · Student 2 Returns',
    },
    {
      narrator: 'Student 1 finishes downloading! Taps card: `defer wg.Done()`. Clicker decrements: 2 -> 1!',
      highlightLine: 18,
      badge: 'Step 6/8 · Student 1 Returns',
    },
    {
      narrator: 'Student 3 finishes last! Taps card: `defer wg.Done()`. Clicker hits ZERO (0)!',
      highlightLine: 18,
      badge: 'Step 7/8 · Counter = 0!',
    },
    {
      narrator: 'Counter reached zero! `wg.Wait()` unblocks immediately. Bus driver starts engine: "All aboard, driving home!" Program exits cleanly.',
      highlightLine: 24,
      badge: 'Step 8/8 · Clean Exit',
    },
  ];

  const code = `package main

import (
\t"fmt"
\t"sync"
\t"time"
)

func main() {
\tvar wg sync.WaitGroup

\twg.Add(3) // 1. Clicker = 3 BEFORE launching!

\tfor i := 1; i <= 3; i++ {
\t\tgo func(id int) {
\t\t\tdefer wg.Done() // 2. Decrement clicker when finished
\t\t\tfmt.Printf("Student %d downloading...\\n", id)
\t\t\ttime.Sleep(time.Duration(id*10) * time.Millisecond)
\t\t}(i)
\t}

\twg.Wait() // 3. Block until counter hits 0
\tfmt.Println("All 3 students on bus! Driving home.")
}`;

  return (
    <StepSimulatorShell
      title="Lab 3: The Bus Roll Call — sync.WaitGroup"
      subtitle="The golden rule: Add before go, Done in defer, Wait in main"
      steps={steps}
      currentStep={step}
      onStepChange={setStep}
      codeSnippet={code}
    >
      <div className="space-y-4">
        {/* Bus & Clicker Counter Visual Stage */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-stretch">
          {/* Bus Driver Status */}
          <div className="sketch-box p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-display font-black text-ink uppercase">
                🚌 Main Goroutine
              </span>
              <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-tealSoft text-tealDeep">
                main()
              </span>
            </div>
            <div className="text-center py-2">
              <div className="text-3xl">
                {step < 3 ? '🚌' : step < 7 ? '⏸️' : '🚀'}
              </div>
              <div className="font-display font-bold text-xs text-ink mt-1">
                {step < 3
                  ? 'Setting up trip'
                  : step < 7
                  ? 'BLOCKED at wg.Wait()'
                  : 'UNBLOCKED! Driving home'}
              </div>
            </div>
            <div className="text-[11px] font-hand text-ink/75 text-center">
              {step < 7
                ? 'Bus driver will NOT exit main until clicker reaches 0'
                : 'Zero reached! Safe to exit without cut-off goroutines.'}
            </div>
          </div>

          {/* Big Mechanical Clicker */}
          <div className="sketch-box-yellow p-4 text-center space-y-2 flex flex-col justify-center">
            <div className="text-xs font-display font-black text-ink uppercase tracking-wide">
              Mechanical Tally Clicker
            </div>
            <div className="bg-ink text-yellowHi font-mono text-4xl font-black py-2.5 px-4 rounded-xl shadow-[3px_3px_0px_#222] border-2 border-ink inline-block mx-auto">
              {step === 0 ? 0 : step < 4 ? 3 : step === 4 ? 2 : step === 5 ? 1 : 0}
            </div>
            <div className="text-xs font-hand font-bold text-ink/80">
              {step === 0
                ? 'wg := sync.WaitGroup{}'
                : step < 4
                ? 'wg.Add(3)'
                : step === 4
                ? 'Student 2 called wg.Done()'
                : step === 5
                ? 'Student 1 called wg.Done()'
                : '🎉 Counter == 0: Gate Opens!'}
            </div>
          </div>

          {/* Students on Field */}
          <div className="sketch-box p-3.5 space-y-2">
            <div className="text-xs font-display font-black text-ink uppercase">
              Students on Field
            </div>
            <div className="space-y-1.5 text-xs font-mono">
              {/* Student 1 */}
              <div
                className={`p-1.5 rounded-lg border flex items-center justify-between ${
                  step >= 5
                    ? 'bg-greenPen/20 border-greenPen text-greenPen font-bold'
                    : step >= 2
                    ? 'bg-yellowSoft border-ink text-ink'
                    : 'bg-paper text-ink/50 border-ink/20'
                }`}
              >
                <span>Student 1</span>
                <span>{step >= 5 ? '✅ On Bus' : step >= 2 ? '⏳ Fetching' : 'Ready'}</span>
              </div>

              {/* Student 2 */}
              <div
                className={`p-1.5 rounded-lg border flex items-center justify-between ${
                  step >= 4
                    ? 'bg-greenPen/20 border-greenPen text-greenPen font-bold'
                    : step >= 2
                    ? 'bg-yellowSoft border-ink text-ink'
                    : 'bg-paper text-ink/50 border-ink/20'
                }`}
              >
                <span>Student 2</span>
                <span>{step >= 4 ? '✅ On Bus' : step >= 2 ? '⏳ Fetching' : 'Ready'}</span>
              </div>

              {/* Student 3 */}
              <div
                className={`p-1.5 rounded-lg border flex items-center justify-between ${
                  step >= 6
                    ? 'bg-greenPen/20 border-greenPen text-greenPen font-bold'
                    : step >= 2
                    ? 'bg-yellowSoft border-ink text-ink'
                    : 'bg-paper text-ink/50 border-ink/20'
                }`}
              >
                <span>Student 3</span>
                <span>{step >= 6 ? '✅ On Bus' : step >= 2 ? '⏳ Fetching' : 'Ready'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StepSimulatorShell>
  );
}

// =========================================================================
// LAB 4: SYNC.ONCE & SYNC/ATOMIC (The Speed Demons)
// =========================================================================
function SpeedDemonsLab() {
  const [mode, setMode] = useState<'once' | 'atomic'>('once');
  const [step, setStep] = useState(0);

  const onceSteps: SimulatorStep[] = [
    {
      narrator: 'sync.Once is like a birthday sparkler or light switch: once flipped, it will NEVER execute again.',
      highlightLine: 8,
      badge: 'Step 1/6 · Light Switch Off',
    },
    {
      narrator: '4 Goroutines are spawned concurrently. All 4 try to initialize the Database Connection pool via `once.Do(initDB)`.',
      highlightLine: 16,
      badge: 'Step 2/6 · 4 Callers Race',
    },
    {
      narrator: 'Goroutine 1 reaches `once.Do` first! The internal atomic flag is 0, so Goroutine 1 executes the initialization function.',
      highlightLine: 18,
      badge: 'Step 3/6 · Caller 1 Wins',
    },
    {
      narrator: 'DB Pool connects ⚡! Goroutine 1 sets internal flag to 1 and finishes.',
      highlightLine: 12,
      badge: 'Step 4/6 · DB Connected',
    },
    {
      narrator: 'Goroutines 2, 3, and 4 arrive at `once.Do`. They see the flag is 1 and RETURN IMMEDIATELY without running `initDB` again!',
      highlightLine: 20,
      badge: 'Step 5/6 · Fast Bypass',
    },
    {
      narrator: 'Result: Exactly 1 DB connection was opened! 100% thread-safe singleton initialization with zero mutex lock contention.',
      highlightLine: 25,
      badge: 'Step 6/6 · Safe Singleton',
    },
  ];

  const atomicSteps: SimulatorStep[] = [
    {
      narrator: 'sync/atomic uses single-instruction CPU hardware magic (`LOCK XADD`) instead of heavy OS mutexes.',
      highlightLine: 7,
      badge: 'Step 1/5 · Hardware Level',
    },
    {
      narrator: '3 Goroutines concurrently execute `atomic.AddInt64(&requestCount, 1)`.',
      highlightLine: 14,
      badge: 'Step 2/5 · Pounding Counter',
    },
    {
      narrator: 'The CPU bus locks ONLY that 8-byte memory word for a few nanoseconds. No OS context switches or thread sleeps!',
      highlightLine: 15,
      badge: 'Step 3/5 · Lock-Free CPU Magic',
    },
    {
      narrator: 'All 3 increments succeed seamlessly in single-digit nanoseconds (~4ns vs ~18ns for Mutex).',
      highlightLine: 19,
      badge: 'Step 4/5 · 4x Faster',
    },
    {
      narrator: 'Reading is also atomic: `atomic.LoadInt64(&requestCount)`. Always reads a clean, non-torn 64-bit integer!',
      highlightLine: 23,
      badge: 'Step 5/5 · Safe Load',
    },
  ];

  const currentSteps = mode === 'once' ? onceSteps : atomicSteps;

  const onceCode = `package main

import (
\t"fmt"
\t"sync"
)

var (
\tonce   sync.Once
\tdbPool *Database
)

func initDB() {
\tfmt.Println("Connecting to Postgres DB...")
\tdbPool = &Database{Host: "localhost:5432"}
}

func GetDB() *Database {
\t// Safe to call 10,000 times from 10,000 goroutines!
\t// initDB runs EXACTLY once.
\tonce.Do(initDB)
\treturn dbPool
}

func main() {
\tvar wg sync.WaitGroup
\tfor i := 0; i < 4; i++ {
\t\twg.Add(1)
\t\tgo func() { defer wg.Done(); GetDB() }()
\t}
\twg.Wait()
}`;

  const atomicCode = `package main

import (
\t"fmt"
\t"sync"
\t"sync/atomic"
)

var requestCount int64 // 64-bit aligned integer

func handleRequest(wg *sync.WaitGroup) {
\tdefer wg.Done()
\t// Direct hardware atomic increment: NO MUTEX NEEDED!
\tatomic.AddInt64(&requestCount, 1)
}

func main() {
\tvar wg sync.WaitGroup
\tfor i := 0; i < 1000; i++ {
\t\twg.Add(1)
\t\tgo handleRequest(&wg)
\t}
\twg.Wait()

\t// Atomic read prevents torn reads on 32-bit systems
\ttotal := atomic.LoadInt64(&requestCount)
\tfmt.Println("Total requests handled:", total) // 1000!
}`;

  return (
    <StepSimulatorShell
      title="Lab 4: The Speed Demons — sync.Once & sync/atomic"
      subtitle="One-time initialization and lightning-fast lock-free CPU operations"
      modeToggle={{
        current: mode,
        options: [
          { id: 'once', label: '⚡ sync.Once (Singleton Init)', icon: 'zap' },
          { id: 'atomic', label: '🚀 sync/atomic (Lock-Free Counter)', icon: 'cpu' },
        ],
        onChange: (newMode) => {
          setMode(newMode as 'once' | 'atomic');
          setStep(0);
        },
      }}
      steps={currentSteps}
      currentStep={step}
      onStepChange={setStep}
      codeSnippet={mode === 'once' ? onceCode : atomicCode}
    >
      <div className="space-y-4">
        {mode === 'once' ? (
          /* ONCE VISUAL */
          <div className="sketch-box p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b-2 border-dashed border-ink/20">
              <span className="font-display font-black text-sm text-ink flex items-center gap-1.5">
                <span>🔌</span> Database Singleton Initializer
              </span>
              <span
                className={`font-mono text-xs font-bold px-3 py-0.5 rounded-full border ${
                  step >= 3
                    ? 'bg-greenPen text-paper border-greenPen'
                    : 'bg-paper text-ink border-ink/40'
                }`}
              >
                {step >= 3 ? '⚡ Initialized: YES' : '⚪ Initialized: NO'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[1, 2, 3, 4].map((id) => {
                const isWinner = id === 1;
                return (
                  <div
                    key={id}
                    className={`sketch-box p-2.5 text-center space-y-1 transition-all ${
                      step >= 2 && isWinner
                        ? 'bg-yellowHi border-ink shadow-[2px_2px_0px_#222]'
                        : step >= 4 && !isWinner
                        ? 'bg-tealSoft/40 border-tealDeep/50'
                        : 'bg-white'
                    }`}
                  >
                    <div className="text-xl">{isWinner && step >= 2 ? '👑' : '🏃'}</div>
                    <div className="font-display font-bold text-xs text-ink">Worker {id}</div>
                    <div className="text-[10px] font-hand text-ink/75">
                      {step < 2
                        ? 'Ready'
                        : isWinner && step < 4
                        ? 'Fires initDB()!'
                        : step >= 4
                        ? 'Bypassed instantly'
                        : 'Calling once.Do'}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-paper p-3 rounded-xl border border-ink/30 text-xs font-hand text-ink/85 flex items-center gap-2">
              <span className="text-xl">💡</span>
              <span>
                Even if 100,000 requests hit <code>GetDB()</code> simultaneously on server boot,
                <code>initDB()</code> is executed <strong>exactly once</strong>, and all callers receive the same singleton instance.
              </span>
            </div>
          </div>
        ) : (
          /* ATOMIC VISUAL */
          <div className="sketch-box p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b-2 border-dashed border-ink/20">
              <span className="font-display font-black text-sm text-ink flex items-center gap-1.5">
                <span>⚡</span> Hardware Bus Lock-Free Increments
              </span>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full bg-tealSoft text-tealDeep border border-ink/30">
                Instruction: LOCK XADD
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              <div className="bg-yellowSoft p-4 rounded-2xl border-2 border-ink text-center space-y-1">
                <div className="text-xs font-display font-bold text-ink/70">
                  atomic.AddInt64(&counter, 1)
                </div>
                <div className="font-mono text-4xl font-black text-ink">
                  {step === 0 ? 0 : step < 3 ? 1 : step === 3 ? 3 : 1000}
                </div>
                <div className="text-[11px] font-mono text-tealDeep font-bold">
                  Memory Address: 0x00c004f028
                </div>
              </div>

              {/* Benchmark Speed Comparison */}
              <div className="bg-paper border-2 border-ink rounded-2xl p-3.5 space-y-2 text-xs">
                <div className="font-display font-black text-xs text-ink uppercase">
                  🏎️ Benchmark Cost (Per Operation)
                </div>
                <div className="space-y-1.5 font-mono">
                  <div>
                    <div className="flex justify-between text-[11px]">
                      <span>sync.Mutex</span>
                      <span className="font-bold">~18.2 ns/op</span>
                    </div>
                    <div className="w-full bg-ink/10 h-2 rounded-full overflow-hidden">
                      <div className="bg-redPen h-full w-[85%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px]">
                      <span>sync/atomic</span>
                      <span className="font-bold text-greenPen">~4.1 ns/op (4.4x Faster!)</span>
                    </div>
                    <div className="w-full bg-ink/10 h-2 rounded-full overflow-hidden">
                      <div className="bg-greenPen h-full w-[22%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </StepSimulatorShell>
  );
}

// =========================================================================
// CHAPTER 5: THE 5 DEADLIEST CONCURRENCY TRAPS
// =========================================================================
function CommonTrapsSection() {
  const [activeTrap, setActiveTrap] = useState<number>(0);
  const [showFix, setShowFix] = useState<Record<number, boolean>>({});

  const traps = [
    {
      id: 1,
      title: 'Trap 1: Copying a Mutex or WaitGroup by Value',
      summary: 'Passing a Mutex or WaitGroup into a function without a pointer makes a copy of its internal lock state!',
      dangerLevel: 'FATAL SILENT BUG',
      buggyCode: `// ❌ WRONG: Passing by value copies the mutex!
func increment(counter *int, mu sync.Mutex) {
\tmu.Lock() // Locks the COPY, not original!
\t*counter++
\tmu.Unlock()
}

// go vet flags: passes lock by value`,
      fixedCode: `// ✅ FIXED: Pass pointer *sync.Mutex or Counter struct pointer
func increment(counter *int, mu *sync.Mutex) {
\tmu.Lock() // Locks the shared original lock!
\t*counter++
\tmu.Unlock()
}`,
      explanation:
        'Mutexes and WaitGroups contain internal memory addresses. When copied by value, each goroutine locks its OWN private copy, destroying synchronization! Always pass `*sync.Mutex` or `*sync.WaitGroup`, or wrap them in a struct and pass pointer receivers `func (c *Counter) Inc()`.',
    },
    {
      id: 2,
      title: 'Trap 2: Calling wg.Add() INSIDE the Goroutine',
      summary: 'Placing wg.Add(1) inside the `go func()` creates a race condition with wg.Wait().',
      dangerLevel: 'EARLY PROGRAM EXIT',
      buggyCode: `// ❌ WRONG: Race between main's Wait() and goroutine's Add()
for i := 0; i < 3; i++ {
\tgo func() {
\t\twg.Add(1) // May execute AFTER main hits wg.Wait()!
\t\tdefer wg.Done()
\t\tdoWork()
\t}()
}
wg.Wait() // Main might see counter == 0 and exit immediately!`,
      fixedCode: `// ✅ FIXED: Call Add() in the parent thread BEFORE launching!
for i := 0; i < 3; i++ {
\twg.Add(1) // Done in main thread guaranteed before Wait!
\tgo func() {
\t\tdefer wg.Done()
\t\tdoWork()
\t}()
}
wg.Wait()`,
      explanation:
        'Spawning a goroutine is asynchronous. If the scheduler takes a few microseconds to boot the goroutine, `main()` will hit `wg.Wait()` while the clicker is still 0, terminating the entire process before workers even start!',
    },
    {
      id: 3,
      title: 'Trap 3: Forgetting defer mu.Unlock() & Double Locking',
      summary: 'Returning early on an error or locking twice in the same goroutine causes fatal deadlocks.',
      dangerLevel: 'FREEZES PRODUCTION',
      buggyCode: `// ❌ WRONG: Early return forgets unlock, AND Go mutex is NOT re-entrant!
func process() error {
\tmu.Lock()
\tif err := check(); err != nil {
\t\treturn err // DEADLOCK! mu stays locked forever!
\t}
\tmu.Lock() // DEADLOCK! Locking twice in same thread freezes!
\tmu.Unlock()
\treturn nil
}`,
      fixedCode: `// ✅ FIXED: Always use defer immediately after Lock!
func process() error {
\tmu.Lock()
\tdefer mu.Unlock() // Guaranteed to unlock even on return or panic!

\tif err := check(); err != nil {
\t\treturn err // Cleanly unlocked!
\t}
\treturn nil
}`,
      explanation:
        'Unlike Java or C# where `synchronized` or `ReentrantLock` allows the same thread to re-enter a lock, Go mutexes are intentionally non-re-entrant! If a goroutine tries to lock a mutex it already holds, it deadlocks itself forever.',
    },
    {
      id: 4,
      title: 'Trap 4: Reading Shared Memory Without a Lock',
      summary: '"I only locked the writer, so reading is safe without a lock, right?" WRONG.',
      dangerLevel: 'DATA CORRUPTION',
      buggyCode: `// ❌ WRONG: Unprotected concurrent read!
func (c *Cache) Set(k, v string) {
\tc.mu.Lock()
\tc.data[k] = v
\tc.mu.Unlock()
}

func (c *Cache) Get(k string) string {
\treturn c.data[k] // DATA RACE! Reading map while another writes!
}`,
      fixedCode: `// ✅ FIXED: Protect reads with RLock or Lock!
func (c *Cache) Get(k string) string {
\tc.mu.RLock() // Safe concurrent read
\tdefer c.mu.RUnlock()
\treturn c.data[k]
}`,
      explanation:
        'In Go, reading a map while another goroutine writes to it triggers an unrecoverable fatal runtime crash: `fatal error: concurrent map read and map write`. Even simple 64-bit integers on 32-bit systems can suffer torn reads without a lock or `atomic.Load`.',
    },
    {
      id: 5,
      title: 'Trap 5: Negative WaitGroup Counter Panic',
      summary: 'Calling wg.Done() more times than wg.Add() panics immediately.',
      dangerLevel: 'RUNTIME PANIC',
      buggyCode: `// ❌ WRONG: Extra Done() call crashes program
var wg sync.WaitGroup
wg.Add(1)

wg.Done()
wg.Done() // PANIC: sync: negative WaitGroup counter!`,
      fixedCode: `// ✅ FIXED: Pair each Add with exactly one defer Done()
var wg sync.WaitGroup
wg.Add(1)

go func() {
\tdefer wg.Done() // Always 1-to-1 match
\tdoWork()
}()`,
      explanation:
        'A `sync.WaitGroup` counter can never drop below zero. If `Done()` is called when the counter is already zero, the Go runtime immediately panics with `panic: sync: negative WaitGroup counter`.',
    },
  ];

  return (
    <div className="sketch-box p-5 sm:p-7 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b-2 border-dashed border-ink/20">
        <div>
          <h3 className="font-display font-black text-2xl text-ink flex items-center gap-2">
            <span>🪤</span> The 5 Deadliest Concurrency Traps
          </h3>
          <p className="font-hand text-base text-ink/75">
            These 5 mistakes cause 95% of concurrency bugs in production Go code.
          </p>
        </div>
        <span className="font-mono text-xs font-bold px-3 py-1 rounded-full bg-redPen/15 text-redPen border border-redPen/30">
          Must-Know Gotchas
        </span>
      </div>

      {/* Trap Selection Tabs */}
      <div className="flex flex-wrap gap-2">
        {traps.map((t, idx) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTrap(idx)}
            className={`sketch-btn px-3 py-1.5 font-display text-xs font-bold transition-all ${
              activeTrap === idx
                ? 'bg-yellowHi text-ink border-ink shadow-[2px_2px_0px_#222]'
                : 'bg-paper text-ink/70 hover:bg-tealSoft/50 border-ink/40'
            }`}
          >
            Trap #{t.id}
          </button>
        ))}
      </div>

      {/* Active Trap Detail Card */}
      {(() => {
        const cur = traps[activeTrap];
        const isFixActive = Boolean(showFix[cur.id]);

        return (
          <div className="sketch-box-yellow p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="font-display font-black text-lg text-ink">{cur.title}</h4>
              <span className="font-mono text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full bg-redPen text-paper">
                {cur.dangerLevel}
              </span>
            </div>

            <p className="font-hand text-lg text-ink font-bold leading-snug">{cur.summary}</p>

            {/* Buggy vs Fixed Toggle */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowFix((prev) => ({ ...prev, [cur.id]: false }))}
                  className={`sketch-btn px-3 py-1 text-xs font-display font-black ${
                    !isFixActive ? 'bg-redPen/20 text-redPen border-redPen' : 'bg-paper text-ink/60'
                  }`}
                >
                  ❌ The Mistake
                </button>
                <button
                  type="button"
                  onClick={() => setShowFix((prev) => ({ ...prev, [cur.id]: true }))}
                  className={`sketch-btn px-3 py-1 text-xs font-display font-black ${
                    isFixActive
                      ? 'bg-greenPen/20 text-greenPen border-greenPen shadow-[2px_2px_0px_#2E8B57]'
                      : 'bg-paper text-ink/60'
                  }`}
                >
                  ✅ The Fix
                </button>
              </div>

              <div className="bg-ink text-paper rounded-2xl p-4 font-mono text-xs sm:text-sm overflow-x-auto">
                <pre>{isFixActive ? cur.fixedCode : cur.buggyCode}</pre>
              </div>
            </div>

            <div className="bg-paper border-2 border-ink/40 rounded-xl p-3 text-sm font-hand text-ink/90">
              <strong>💡 Why this matters:</strong> {cur.explanation}
            </div>
          </div>
        );
      })()}
    </div>
  );
}

// =========================================================================
// CHAPTER 6: 1-GLANCE MEMORY CHEAT SHEET
// =========================================================================
function CheatSheetSection() {
  const [selectedScenario, setSelectedScenario] = useState<number>(0);

  const scenarios = [
    {
      q: 'I want to wait for 10 background worker goroutines to finish downloading files.',
      tool: 'sync.WaitGroup',
      why: 'Ideal for fan-out task completion without passing data back.',
      code: `var wg sync.WaitGroup
wg.Add(10)
for i := 0; i < 10; i++ {
\tgo func() { defer wg.Done(); download() }()
}
wg.Wait()`,
    },
    {
      q: 'I have a shared cache map or banking account that multiple workers update.',
      tool: 'sync.Mutex',
      why: 'Guarantees mutual exclusion: only one goroutine touches the struct at any millisecond.',
      code: `var mu sync.Mutex
mu.Lock()
defer mu.Unlock()
cache[key] = val`,
    },
    {
      q: 'My in-memory cache has 98% reads and only 2% writes.',
      tool: 'sync.RWMutex',
      why: 'Multiple readers can read concurrently without waiting. Writers get exclusive access.',
      code: `var rw sync.RWMutex
// Readers:
rw.RLock(); defer rw.RUnlock(); val := cache[k]
// Writers:
rw.Lock(); defer rw.Unlock(); cache[k] = v`,
    },
    {
      q: 'I want to connect to MySQL database or parse a configuration file on app boot.',
      tool: 'sync.Once',
      why: 'Thread-safe singleton: guaranteed to run exactly once even with 10,000 concurrent callers.',
      code: `var once sync.Once
once.Do(func() {
\tdb = sql.Open("mysql", dsn)
})`,
    },
    {
      q: 'I need a blazing-fast global request counter or metrics gauge.',
      tool: 'sync/atomic',
      why: 'Lock-free single CPU instruction. 4x faster than Mutex with zero OS context-switch overhead.',
      code: `var ops int64
atomic.AddInt64(&ops, 1)
total := atomic.LoadInt64(&ops)`,
    },
    {
      q: 'I need to pass ownership of data packets between workers in a pipeline.',
      tool: 'Channels (chan T)',
      why: 'Go proverb: "Do not communicate by sharing memory; instead, share memory by communicating."',
      code: `ch := make(chan Job, 100)
ch <- job // Send
j := <-ch // Receive`,
    },
  ];

  const matrix = [
    {
      primitive: 'sync.Mutex',
      analogy: 'Single-occupant bathroom key',
      useCase: 'Protecting struct, slice, or map mutations',
      overhead: 'Medium (~18ns/op)',
      gotcha: 'Never copy by value; always defer Unlock()',
    },
    {
      primitive: 'sync.RWMutex',
      analogy: 'Museum plaque reader crowd',
      useCase: 'Read-heavy caches (95%+ reads)',
      overhead: 'Low for reads, High for writes',
      gotcha: 'Writer starvation if continuous read stream',
    },
    {
      primitive: 'sync.WaitGroup',
      analogy: 'School bus driver tally counter',
      useCase: 'Waiting for a batch of goroutines to finish',
      overhead: 'Very Low',
      gotcha: 'Add() must be called BEFORE `go`, not inside',
    },
    {
      primitive: 'sync.Once',
      analogy: 'Popping bubble wrap or light switch',
      useCase: 'One-time lazy initialization (DB/Configs)',
      overhead: 'Virtually zero (~1ns fast path)',
      gotcha: 'If func panics, it will never retry!',
    },
    {
      primitive: 'sync/atomic',
      analogy: 'High-speed hardware turnstile clicker',
      useCase: 'Simple integer counters, flags, metrics',
      overhead: 'Lowest (~4ns/op lock-free)',
      gotcha: 'Only works on single primitive numbers/pointers',
    },
  ];

  return (
    <div className="sketch-box p-5 sm:p-7 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b-2 border-dashed border-ink/20">
        <div>
          <h3 className="font-display font-black text-2xl text-ink flex items-center gap-2">
            <span>⚡</span> 1-Glance Memory Cheat Sheet
          </h3>
          <p className="font-hand text-base text-ink/75">
            Never second-guess which concurrency tool to reach for.
          </p>
        </div>
        <span className="font-mono text-xs font-bold px-3 py-1 rounded-full bg-tealSoft text-tealDeep border border-ink/30">
          Decision Guide
        </span>
      </div>

      {/* Interactive Scenario Finder */}
      <div className="space-y-3">
        <div className="text-xs font-display font-black text-tealDeep uppercase tracking-wider">
          🎯 What are you trying to build? (Click a scenario)
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {scenarios.map((sc, idx) => (
            <button
              key={sc.tool + idx}
              type="button"
              onClick={() => setSelectedScenario(idx)}
              className={`p-3 rounded-xl border-2 text-left text-xs font-display transition-all ${
                selectedScenario === idx
                  ? 'bg-yellowHi text-ink border-ink font-black shadow-[2px_2px_0px_#222]'
                  : 'bg-paper text-ink/80 hover:bg-tealSoft/50 border-ink/30'
              }`}
            >
              <div className="line-clamp-2 leading-snug">{sc.q}</div>
              <div className="mt-2 text-[11px] font-mono font-black text-tealDeep">
                👉 Use: {sc.tool}
              </div>
            </button>
          ))}
        </div>

        {/* Selected Scenario Recommendation */}
        {(() => {
          const act = scenarios[selectedScenario];
          return (
            <div className="sketch-box-yellow p-4 sm:p-5 space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-display font-black text-base text-ink">
                  Recommended Tool:{' '}
                  <span className="bg-ink text-yellowHi font-mono px-2 py-0.5 rounded-lg text-sm">
                    {act.tool}
                  </span>
                </span>
                <span className="font-hand text-xs font-bold text-ink/75">
                  {act.why}
                </span>
              </div>
              <div className="bg-ink text-paper rounded-xl p-3 font-mono text-xs overflow-x-auto">
                <pre>{act.code}</pre>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Comparison Matrix Table */}
      <div className="space-y-3 pt-3">
        <div className="text-xs font-display font-black text-tealDeep uppercase tracking-wider">
          📊 Concurrency Primitives Comparison Matrix
        </div>
        <div className="overflow-x-auto border-2 border-ink rounded-2xl bg-paper shadow-[3px_3px_0px_#222]">
          <table className="w-full text-left text-xs font-display border-collapse">
            <thead>
              <tr className="bg-tealSoft/70 border-b-2 border-ink text-ink font-black">
                <th className="p-3">Tool</th>
                <th className="p-3">Mental Metaphor</th>
                <th className="p-3">Primary Job</th>
                <th className="p-3">Overhead</th>
                <th className="p-3">Fatal Trap</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/20 font-hand text-sm">
              {matrix.map((row) => (
                <tr key={row.primitive} className="hover:bg-yellowSoft/40 transition-colors">
                  <td className="p-3 font-mono font-bold text-xs text-tealDeep">{row.primitive}</td>
                  <td className="p-3">{row.analogy}</td>
                  <td className="p-3 font-bold">{row.useCase}</td>
                  <td className="p-3 font-mono text-xs">{row.overhead}</td>
                  <td className="p-3 text-redPen font-bold">{row.gotcha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sticky Note Golden Rules */}
      <div className="bg-yellowSoft border-2 border-ink rounded-2xl p-4 sm:p-5 shadow-[4px_4px_0px_#222] space-y-2">
        <div className="font-display font-black text-sm text-ink flex items-center gap-2">
          <span>📌</span> The 3 Golden Rules of Go Synchronization
        </div>
        <ul className="space-y-1.5 font-hand text-base text-ink/90 list-disc list-inside">
          <li>
            <strong>1. Do not communicate by sharing memory:</strong> share memory by communicating (use Channels when passing data; use Mutex when protecting state).
          </li>
          <li>
            <strong>2. Always run Go’s Race Detector:</strong> run <code>go test -race ./...</code> on every pull request. If the race detector screams, believe it!
          </li>
          <li>
            <strong>3. Defer is your best friend:</strong> write <code>defer mu.Unlock()</code> and <code>defer wg.Done()</code> immediately after acquiring resources.
          </li>
        </ul>
      </div>
    </div>
  );
}

// =========================================================================
// MAIN EXPORTED COMPONENT: SYNCHRONIZATION GOLD LESSON
// =========================================================================
export function SynchronizationGoldLesson({
  module,
  progress,
  onToggleModuleComplete,
  onToggleSubtopic,
  onCheckAllSubtopics,
  onToast,
  onNavigate,
}: SynchronizationGoldLessonProps) {
  const isCompleted = Boolean(progress.completed[module.id]);
  const checkedSubsCount = module.subtopics.filter(
    (s) => progress.completedSubtopics[s.code]
  ).length;

  return (
    <div className="space-y-8">
      {/* 1. Masterclass Sketchnote Hero Header */}
      <header className="sketch-box p-6 sm:p-8 space-y-4 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-black uppercase px-3 py-1 rounded-full bg-tealDeep text-paper shadow-[2px_2px_0px_#222]">
              Module 19 · Track 4: Concurrency
            </span>
            <span className="font-display font-extrabold text-xs px-2.5 py-0.5 rounded-full bg-yellowHi border border-ink text-ink shadow-[1px_1px_0px_#222]">
              🌟 Gold Standard Interactive Masterclass
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              onToggleModuleComplete(module.id);
              onToast(isCompleted ? 'Marked incomplete' : 'Module 19 Mastered! 🎉');
            }}
            className={`sketch-btn px-4 py-2 font-display text-xs sm:text-sm font-black inline-flex items-center gap-2 ${
              isCompleted ? 'bg-tealSoft text-ink' : 'bg-yellowHi text-ink'
            }`}
          >
            <SketchIcon name={isCompleted ? 'checkCircle' : 'check'} className="w-4 h-4" />
            {isCompleted ? 'Module Completed' : 'Mark Module Complete'}
          </button>
        </div>

        <div>
          <h1 className="font-display font-black text-3xl sm:text-5xl text-ink leading-tight">
            Synchronization in Go
          </h1>
          <p className="font-hand text-xl sm:text-2xl text-ink/85 mt-2 leading-relaxed">
            Stop guessing with concurrency bugs. Master{' '}
            <Term id="mutex">sync.Mutex</Term>,{' '}
            <Term id="waitgroup">sync.WaitGroup</Term>,{' '}
            <Term id="once">sync.Once</Term>, and{' '}
            <Term id="atomic">sync/atomic</Term> through 4 hands-on visual laboratories.
          </p>
        </div>

        {/* Sketchnote Sticky Banner */}
        <div className="sketch-box-yellow p-4 text-sm font-hand text-ink flex items-start gap-3">
          <span className="text-2xl">🧠</span>
          <div>
            <strong>The 8th-Grade Mental Model:</strong> When multiple background{' '}
            <Term id="goroutine">goroutines</Term> touch the exact same variable in memory at once,
            chaos ensues. Synchronization tools are physical keys, tally clickers, and light switches
            that guarantee clean, orderly teamwork.
          </div>
        </div>

        {/* Subtopic Progress Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t-2 border-dashed border-ink/20">
          <div className="text-xs font-display font-bold text-ink/75">
            Subtopics Mastered: {checkedSubsCount} of {module.subtopics.length}
          </div>
          <button
            type="button"
            onClick={() => onCheckAllSubtopics(module.subtopics.map((s) => s.code))}
            className="sketch-btn bg-paper px-3 py-1 font-display text-xs font-bold hover:bg-tealSoft"
          >
            Check All {module.subtopics.length} Subtopics
          </button>
        </div>
      </header>

      {/* =========================================================================
          CHAPTER 1: DATA RACE & LOST OVERWRITE
      ========================================================================= */}
      <LessonSection
        chapterNumber={1}
        title="The Invisible Chalkboard Thief: Data Races & Lost Overwrites"
        badge="19.9 Race Detector"
        plainEnglish="When two workers write to the same number at the same millisecond without coordination, one write silently erases the other!"
        analogy="Two children both looking at a chalkboard with the number '0'. Both write '1' at the same instant. Even though two kids added 1, the board says 1 instead of 2!"
        labSlot={<DataRaceLab />}
        codeSlot={
          <AnnotatedCodeCard
            title="Go Code: Unsynchronized Race Condition"
            goCode={`package main

import (
\t"fmt"
\t"time"
)

var counter int

func main() {
\tfor i := 0; i < 1000; i++ {
\t\tgo func() {
\t\t\tcounter++ // ⚠️ DATA RACE! Read + Add + Write is NOT atomic!
\t\t}()
\t}

\ttime.Sleep(100 * time.Millisecond)
\tfmt.Println("Result:", counter) // Almost never 1000!
}`}
            annotations={[
              { line: 8, label: 'Shared global variable in RAM without any mutex protection.' },
              { line: 13, label: 'counter++ is secretly 3 CPU instructions: Read RAM, add 1, write RAM.' },
              { line: 17, label: 'Sleeping is NOT synchronization! It is fragile and unpredictable.' },
            ]}
            jsCode={`// JavaScript Equivalent (Single-Threaded Event Loop)
let counter = 0;
// JS async functions cannot have thread data races on numbers
// because V8 runs on a single event-loop thread!
// But async API calls CAN race:
async function update() {
  const current = await fetchBalance();
  await saveBalance(current + 1); // Race condition if called twice!
}`}
            jsExplanation="In JavaScript, numbers aren't mutated across real CPU threads because Node.js is single-threaded. But async API fetches have the EXACT same problem when two requests read before either writes back!"
          />
        }
        checkSlot={
          <MicroCheck
            question="Why does `counter++` cause a data race in Go even though it is written as a single line of code?"
            options={[
              'Because the Go compiler is too slow to execute it in 1 clock cycle',
              'Because at the CPU hardware level, counter++ is actually 3 distinct steps: read memory into register, increment register, write back to memory',
              'Because integers in Go cannot be updated by goroutines',
            ]}
            correctIndex={1}
            explanation="Spot on! `counter++` is syntactic sugar for read -> compute -> write. Between the read and the write, another goroutine can sneak in and read the old value!"
          />
        }
      />

      {/* =========================================================================
          CHAPTER 2: SYNC.MUTEX & SYNC.RWMUTEX
      ========================================================================= */}
      <LessonSection
        chapterNumber={2}
        title="The Bathroom Key: sync.Mutex & sync.RWMutex"
        badge="19.2 Mutex & 19.3 RWMutex"
        plainEnglish="A Mutex (Mutual Exclusion) ensures that ONLY ONE goroutine can enter the critical section room and touch shared memory at a time."
        analogy="A single-occupant cafe bathroom with a brass key. If someone has the key, you must wait in line. When they exit, they hang the key back on the hook."
        labSlot={<MutexLab />}
        codeSlot={
          <AnnotatedCodeCard
            title="Go Code: Protecting Struct State with sync.Mutex"
            goCode={`package main

import (
\t"fmt"
\t"sync"
)

type SafeCounter struct {
\tmu    sync.Mutex // The brass key
\tcount int
}

func (c *SafeCounter) Inc() {
\tc.mu.Lock()
\tdefer c.mu.Unlock() // Always put defer immediately after Lock!
\tc.count++
}

func (c *SafeCounter) Value() int {
\tc.mu.Lock()
\tdefer c.mu.Unlock()
\treturn c.count
}`}
            annotations={[
              { line: 9, label: 'Wrap the mutex directly inside the struct it protects.' },
              { line: 14, label: 'Lock() blocks until the brass key is available.' },
              { line: 15, label: 'defer Unlock() guarantees key is returned even if code panics or returns early.' },
              { line: 20, label: 'Reads MUST also be locked to prevent reading half-written data!' },
            ]}
            jsCode={`// JavaScript Equivalent (Mutex in Node.js)
import { Mutex } from 'async-mutex';

const mutex = new Mutex();
let balance = 100;

async function deposit(amount) {
  const release = await mutex.acquire();
  try {
    balance += amount;
  } finally {
    release(); // Equivalent to defer mu.Unlock()
  }
}`}
            jsExplanation="In TypeScript/Node.js, you use libraries like `async-mutex` with `try / finally` blocks to protect async critical sections."
          />
        }
        checkSlot={
          <MicroCheck
            question="Why should you almost always write `defer mu.Unlock()` immediately after `mu.Lock()`?"
            options={[
              'It makes the code run 10x faster',
              'It guarantees the mutex is unlocked even if an error causes an early return or a panic occurs',
              'It allows other goroutines to bypass the lock',
            ]}
            correctIndex={1}
            explanation="Exactly! If you return early on an error without unlocking, that mutex stays locked forever and your entire backend service deadlocks!"
          />
        }
      />

      {/* =========================================================================
          CHAPTER 3: SYNC.WAITGROUP
      ========================================================================= */}
      <LessonSection
        chapterNumber={3}
        title="The School Bus Roll Call: sync.WaitGroup"
        badge="19.1 sync.WaitGroup"
        plainEnglish="A WaitGroup is a mechanical clicker counter that stops your main function from finishing until all background goroutines report done."
        analogy="A school bus driver who counts 3 students off the bus (`Add(3)`), and won't drive away until all 3 have tapped their badge (`Done()`) bringing the counter back to zero (`Wait()`)."
        labSlot={<WaitGroupLab />}
        codeSlot={
          <AnnotatedCodeCard
            title="Go Code: Standard WaitGroup Pattern"
            goCode={`package main

import (
\t"fmt"
\t"sync"
)

func worker(id int, wg *sync.WaitGroup) {
\tdefer wg.Done() // Decrements counter when finished
\tfmt.Printf("Worker %d completed\\n", id)
}

func main() {
\tvar wg sync.WaitGroup

\tfor i := 1; i <= 3; i++ {
\t\twg.Add(1) // ⚠️ ALWAYS call Add() in main thread BEFORE go!
\t\tgo worker(i, &wg) // Pass pointer *sync.WaitGroup!
\t}

\twg.Wait() // Block until counter reaches 0
\tfmt.Println("All workers finished!")
}`}
            annotations={[
              { line: 8, label: 'Notice the pointer *sync.WaitGroup! Never copy by value.' },
              { line: 9, label: 'defer wg.Done() ensures clicker is decremented even if worker panics.' },
              { line: 17, label: 'wg.Add(1) MUST be called before launching the goroutine!' },
              { line: 21, label: 'wg.Wait() blocks until counter reaches zero.' },
            ]}
            jsCode={`// JavaScript Equivalent: Promise.all
async function main() {
  const tasks = [1, 2, 3].map(async (id) => {
    await fetchTask(id);
    console.log(\`Worker \${id} completed\`);
  });

  // Equivalent to wg.Wait():
  await Promise.all(tasks);
  console.log("All workers finished!");
}`}
            jsExplanation="In JavaScript, `Promise.all([p1, p2, p3])` waits for an array of promises to complete, which is the direct JS mental equivalent of `sync.WaitGroup`."
          />
        }
        checkSlot={
          <MicroCheck
            question="What dangerous bug happens if you put `wg.Add(1)` INSIDE the `go func()` instead of before it?"
            options={[
              'The compiler throws a syntax error',
              '`main()` may reach `wg.Wait()` before the background goroutine even starts, causing the program to exit prematurely!',
              'The goroutine will run in an infinite loop',
            ]}
            correctIndex={1}
            explanation="Nailed it! Goroutine spawning is asynchronous. If `main()` reaches `wg.Wait()` before the goroutine gets scheduled to run `wg.Add(1)`, the counter is 0 and main exits immediately!"
          />
        }
      />

      {/* =========================================================================
          CHAPTER 4: SYNC.ONCE & SYNC/ATOMIC
      ========================================================================= */}
      <LessonSection
        chapterNumber={4}
        title="The Speed Demons: sync.Once & sync/atomic"
        badge="19.4 Once & 19.8 sync/atomic"
        plainEnglish="Use `sync.Once` to run initialization code exactly once, and `sync/atomic` for super-fast numeric counters without lock overhead."
        analogy="`sync.Once` is a birthday sparkler: once lit, it cannot be relit. `sync/atomic` is a high-speed subway turnstile that clicks instantly without stopping the train."
        labSlot={<SpeedDemonsLab />}
        codeSlot={
          <AnnotatedCodeCard
            title="Go Code: Lock-Free Counters & Lazy Initialization"
            goCode={`package main

import (
\t"fmt"
\t"sync"
\t"sync/atomic"
)

var (
\tonce   sync.Once
\tconfig map[string]string
\thits   int64 // 64-bit integer
)

func LoadConfig() {
\tonce.Do(func() {
\t\tfmt.Println("Reading config from disk (exactly once)...")
\t\tconfig = map[string]string{"env": "prod"}
\t})
}

func RecordHit() {
\t// Single hardware CPU instruction: No Mutex!
\tatomic.AddInt64(&hits, 1)
}`}
            annotations={[
              { line: 15, label: 'once.Do executes the callback function exactly ONCE across all threads.' },
              { line: 22, label: 'atomic.AddInt64 is 4.5x faster than a mutex for simple numeric counters.' },
            ]}
            jsCode={`// JavaScript Equivalent (Lodash once & Atomics)
import _ from 'lodash';

// 1. sync.Once equivalent:
const initDB = _.once(() => {
  console.log("Connected to DB exactly once!");
});

// 2. sync/atomic equivalent in JS SharedArrayBuffer:
// Atomics.add(typedArray, index, value);`}
            jsExplanation="Lodash's `_.once()` provides the same one-time execution semantics as `sync.Once`, while JS `Atomics.add()` provides hardware atomic increments on SharedArrayBuffers."
          />
        }
        checkSlot={
          <MicroCheck
            question="When should you choose `sync/atomic` instead of `sync.Mutex`?"
            options={[
              'When you have complex nested maps and structs to update',
              'When you only need to increment or read a single primitive number (like metrics or request counts) at maximum CPU speed',
              'Whenever you want to pass data through channels',
            ]}
            correctIndex={1}
            explanation="Correct! `sync/atomic` is designed specifically for individual primitive integers or pointers. For structs, maps, or multi-step mutations, always use `sync.Mutex`."
          />
        }
      />

      {/* =========================================================================
          CHAPTER 5: THE 5 DEADLIEST CONCURRENCY TRAPS
      ========================================================================= */}
      <CommonTrapsSection />

      {/* =========================================================================
          CHAPTER 6: 1-GLANCE MEMORY CHEAT SHEET
      ========================================================================= */}
      <CheatSheetSection />

      {/* =========================================================================
          SUBTOPICS REVIEW LIST & QUIZ INTEGRATION
      ========================================================================= */}
      <section className="sketch-box p-5 sm:p-7 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-display font-black text-2xl text-ink">
              Module 19 Subtopics Checklist ({checkedSubsCount}/{module.subtopics.length})
            </h3>
            <p className="font-hand text-base text-ink/75">
              Check off each topic as you feel confident with its concepts.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onCheckAllSubtopics(module.subtopics.map((s) => s.code))}
            className="sketch-btn bg-paper px-3.5 py-1.5 font-display text-xs font-bold hover:bg-tealSoft"
          >
            Check All
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {module.subtopics.map((sub) => {
            const checked = Boolean(progress.completedSubtopics[sub.code]);
            return (
              <div
                key={sub.code}
                onClick={() => onToggleSubtopic(sub.code)}
                className={`p-3 rounded-xl border-2 flex items-center justify-between gap-2 cursor-pointer transition-all ${
                  checked
                    ? 'bg-tealSoft/50 border-ink font-bold'
                    : 'bg-paper border-ink/40 hover:bg-yellowSoft/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-5 h-5 rounded-md border-2 border-ink flex items-center justify-center shrink-0 ${
                      checked ? 'bg-tealDeep text-paper' : 'bg-white'
                    }`}
                  >
                    {checked && <SketchIcon name="check" className="w-3.5 h-3.5" />}
                  </div>
                  <span className="font-display text-xs text-ink">{sub.title}</span>
                </div>
                <span className="font-mono text-[10px] text-tealDeep font-bold">{sub.code}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Page Glossary Drawer with Concurrency Terms */}
      <PageGlossaryDrawer
        termIds={[
          'goroutine',
          'mutex',
          'rwmutex',
          'waitgroup',
          'once',
          'atomic',
          'race-condition',
          'race-detector',
          'deadlock',
          'defer',
        ]}
      />
    </div>
  );
}
