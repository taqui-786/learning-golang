import React, { useState } from 'react';
import type { LabType } from '../types';
import { SketchIcon } from './Icons';

interface InteractiveLabProps {
  labType: LabType;
  moduleId: number;
}

/* ==================== 1. ENV / VARS / UTF-8 RUNE LAB ==================== */
function EnvVarsLab() {
  const [text, setText] = useState('café Go');
  const [selectedType, setSelectedType] = useState<'int' | 'float64' | 'string' | 'bool' | '*User'>('int');

  const bytes = new TextEncoder().encode(text);
  const runes = Array.from(text);

  const zeroMap: Record<typeof selectedType, { zero: string; js: string; note: string }> = {
    int: { zero: '0', js: 'undefined', note: 'Safe numeric start—never NaN or undefined.' },
    float64: { zero: '0.0', js: 'undefined', note: 'Requires explicit int <-> float64 conversion.' },
    string: { zero: '"" (empty)', js: 'undefined', note: 'Immutable UTF-8 byte sequence.' },
    bool: { zero: 'false', js: 'undefined', note: 'Strict boolean—no truthy/falsy coercion.' },
    '*User': { zero: 'nil', js: 'null / undefined', note: 'Always check != nil before dereferencing.' },
  };

  const info = zeroMap[selectedType];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* UTF-8 Byte vs Rune Inspector */}
        <div className="bg-paper border-2 border-ink rounded-xl p-4 space-y-3">
          <div className="font-display font-bold text-sm text-tealDeep">
            1. Live UTF-8 Bytes vs Runes Inspector
          </div>
          <label className="block text-sm font-bold text-ink">
            Type any ASCII, accented, or Unicode text:
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={28}
              className="mt-1.5 w-full bg-white border-2 border-ink rounded-xl px-3 py-2 font-mono text-sm"
            />
          </label>
          <div className="grid grid-cols-2 gap-3 font-mono text-sm tabular-nums">
            <div className="bg-tealSoft border-2 border-ink rounded-xl p-3">
              <div className="text-xs text-ink/70">len(s) — UTF-8 Bytes</div>
              <div className="text-2xl font-bold text-ink mt-0.5">{bytes.length}</div>
            </div>
            <div className="bg-yellowSoft border-2 border-ink rounded-xl p-3">
              <div className="text-xs text-ink/70">utf8.RuneCountInString</div>
              <div className="text-2xl font-bold text-ink mt-0.5">{runes.length}</div>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {runes.slice(0, 12).map((ch, idx) => {
              const cp = ch.codePointAt(0)?.toString(16).toUpperCase().padStart(4, '0');
              return (
                <div
                  key={`${ch}-${idx}`}
                  className="px-2 py-1 bg-white border-[1.8px] border-ink rounded-lg font-mono text-xs text-center"
                >
                  <div className="font-bold text-sm">{ch === ' ' ? '␣' : ch}</div>
                  <div className="text-[10px] text-ink/65">U+{cp}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Zero Value Box */}
        <div className="bg-paper border-2 border-ink rounded-xl p-4 space-y-3">
          <div className="font-display font-bold text-sm text-tealDeep">
            2. Zero-Value Box (Go vs JavaScript)
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(zeroMap) as Array<keyof typeof zeroMap>).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setSelectedType(t)}
                className={`sketch-btn px-3 py-1.5 font-mono text-xs font-bold whitespace-nowrap ${
                  selectedType === t ? 'bg-yellowHi text-ink' : 'bg-white text-ink/80'
                }`}
              >
                var x {t}
              </button>
            ))}
          </div>
          <div className="bg-white border-2 border-ink rounded-xl p-3.5 space-y-2">
            <div className="font-mono text-sm">
              <span className="tk-kw">var</span> x <span className="tk-kw">{selectedType}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-tealSoft/70 border border-ink/40 rounded-lg p-2.5">
                <div className="text-xs font-display font-bold text-tealDeep">Go Zero Value</div>
                <div className="font-mono font-bold text-base mt-0.5">{info.zero}</div>
              </div>
              <div className="bg-paperDark border border-ink/40 rounded-lg p-2.5">
                <div className="text-xs font-display font-bold text-ink/70">Uninit JS `let x`</div>
                <div className="font-mono font-bold text-base mt-0.5 text-redPen">{info.js}</div>
              </div>
            </div>
            <p className="text-sm text-ink/85">{info.note}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==================== 2. LOOPS & ARRAYS LAB ==================== */
function LoopsArraysLab() {
  const [arrA] = useState([10, 20, 30]);
  const [arrB, setArrB] = useState([10, 20, 30]);
  const [rangeStep, setRangeStep] = useState(0);
  const [mutateMode, setMutateMode] = useState<'copy' | 'index'>('copy');

  const items = ['Go', 'Slices', 'Channels', 'HTTP'];

  const handleEditB = (idx: number) => {
    setArrB((prev) => prev.map((v, i) => (i === idx ? v + 100 : v)));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Fixed Array Value Copy */}
      <div className="bg-paper border-2 border-ink rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="font-display font-bold text-sm text-tealDeep">
            Array Value-Copy Demo (`b := a`)
          </span>
          <button
            type="button"
            onClick={() => setArrB([10, 20, 30])}
            className="sketch-btn bg-white px-2.5 py-1 text-xs font-display font-bold inline-flex items-center gap-1"
          >
            <SketchIcon name="refresh" className="w-3.5 h-3.5" /> Reset
          </button>
        </div>
        <p className="text-sm text-ink/80">
          Click any cell in <code className="font-mono font-bold">b</code> to add 100. Watch{' '}
          <code className="font-mono font-bold">a</code> stay completely untouched!
        </p>

        <div className="space-y-2.5">
          <div>
            <div className="text-xs font-mono font-bold text-ink/70 mb-1">a := [3]int (original)</div>
            <div className="grid grid-cols-3 gap-2">
              {arrA.map((val, i) => (
                <div
                  key={i}
                  className="bg-tealSoft border-2 border-ink rounded-xl py-2 text-center font-mono font-bold tabular-nums"
                >
                  <div className="text-[10px] text-ink/60">a[{i}]</div>
                  <div className="text-lg">{val}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-mono font-bold text-ink/70 mb-1">
              b := a (independent copy — click cells!)
            </div>
            <div className="grid grid-cols-3 gap-2">
              {arrB.map((val, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleEditB(i)}
                  className="sketch-btn bg-yellowSoft hover:bg-yellowHi py-2 text-center font-mono font-bold tabular-nums"
                >
                  <div className="text-[10px] text-ink/65">b[{i}] +100</div>
                  <div className="text-lg">{val}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="font-mono text-xs bg-white border-2 border-ink rounded-lg px-3 py-2 flex items-center justify-between">
          <span>a == b</span>
          <span
            className={`font-bold ${
              arrA.every((v, i) => v === arrB[i]) ? 'text-greenPen' : 'text-redPen'
            }`}
          >
            {String(arrA.every((v, i) => v === arrB[i]))}
          </span>
        </div>
      </div>

      {/* Range Loop Stepper */}
      <div className="bg-paper border-2 border-ink rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="font-display font-bold text-sm text-tealDeep">
            `for i, v := range` Stepper
          </span>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => setMutateMode('copy')}
              className={`sketch-btn px-2.5 py-1 text-xs font-display font-bold ${
                mutateMode === 'copy' ? 'bg-yellowHi' : 'bg-white'
              }`}
            >
              Mutate v (Bug)
            </button>
            <button
              type="button"
              onClick={() => setMutateMode('index')}
              className={`sketch-btn px-2.5 py-1 text-xs font-display font-bold ${
                mutateMode === 'index' ? 'bg-tealSoft' : 'bg-white'
              }`}
            >
              Mutate s[i] (Fix)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {items.map((item, idx) => (
            <div
              key={item}
              className={`border-2 border-ink rounded-xl p-2 text-center font-mono text-xs transition-transform ${
                idx === rangeStep ? 'bg-yellowHi -translate-y-0.5 shadow-[3px_3px_0px_#222]' : 'bg-white'
              }`}
            >
              <div className="text-[10px] text-ink/60">i={idx}</div>
              <div className="font-bold text-sm mt-0.5">
                {mutateMode === 'index' && idx <= rangeStep ? item.toUpperCase() : item}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white border-2 border-ink rounded-xl p-3 text-sm space-y-1">
          <div className="font-mono text-xs">
            Current step: <span className="font-bold">i = {rangeStep}</span>, copy{' '}
            <span className="font-bold">v = &quot;{items[rangeStep]}&quot;</span>
          </div>
          <p className={mutateMode === 'copy' ? 'text-redPen font-bold' : 'text-greenPen font-bold'}>
            {mutateMode === 'copy'
              ? 'Warning: Changing `v` only edits the loop copy—the slice stays lowercase!'
              : 'Correct: Assigning `items[i] = strings.ToUpper(v)` updates the real slice element.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setRangeStep((s) => (s + 1) % items.length)}
          className="sketch-btn bg-tealSoft px-4 py-2 font-display font-bold text-sm inline-flex items-center gap-1.5"
        >
          <SketchIcon name="play" className="w-4 h-4" /> Next Iteration
        </button>
      </div>
    </div>
  );
}

/* ==================== 3. SLICE INTERNALS LAB ==================== */
function SlicesLab() {
  const [elements, setElements] = useState<number[]>([10, 20]);
  const [capacity, setCapacity] = useState<number>(2);
  const [reallocatedCount, setReallocatedCount] = useState<number>(0);
  const [subMutated, setSubMutated] = useState<boolean>(false);

  const handleAppend = () => {
    if (elements.length >= 12) return;
    const nextVal = (elements.length + 1) * 10;
    if (elements.length + 1 > capacity) {
      setCapacity((c) => c * 2);
      setReallocatedCount((r) => r + 1);
    }
    setElements((prev) => [...prev, nextVal]);
    setSubMutated(false);
  };

  const handleMutateSubslice = () => {
    if (elements.length === 0) return;
    setElements((prev) => prev.map((v, idx) => (idx === 0 ? 999 : v)));
    setSubMutated(true);
  };

  const handleReset = () => {
    setElements([10, 20]);
    setCapacity(2);
    setReallocatedCount(0);
    setSubMutated(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleAppend}
            disabled={elements.length >= 12}
            className="sketch-btn bg-yellowHi px-3.5 py-2 font-display font-bold text-sm disabled:opacity-50"
          >
            s = append(s, {(elements.length + 1) * 10})
          </button>
          <button
            type="button"
            onClick={handleMutateSubslice}
            className="sketch-btn bg-tealSoft px-3.5 py-2 font-display font-bold text-sm"
          >
            sub := s[:2]; sub[0] = 999
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="sketch-btn bg-white px-3 py-2 font-display font-bold text-sm inline-flex items-center gap-1"
          >
            <SketchIcon name="refresh" className="w-3.5 h-3.5" /> Reset
          </button>
        </div>

        <div className="font-mono text-xs font-bold tabular-nums bg-white border-2 border-ink rounded-xl px-3 py-1.5">
          len={elements.length} · cap={capacity} · reallocs={reallocatedCount}
        </div>
      </div>

      {/* 3-Word Slice Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-paper border-2 border-ink rounded-xl p-3 font-mono text-xs">
          <div className="text-ink/65">ptr (Backing Array Addr)</div>
          <div className="font-bold text-sm text-tealDeep mt-0.5">
            0xc000{(10 + reallocatedCount * 4).toString(16)}a00
          </div>
        </div>
        <div className="bg-tealSoft border-2 border-ink rounded-xl p-3 font-mono text-xs tabular-nums">
          <div className="text-ink/65">len (Active Elements)</div>
          <div className="font-bold text-lg text-ink">{elements.length}</div>
        </div>
        <div className="bg-yellowSoft border-2 border-ink rounded-xl p-3 font-mono text-xs tabular-nums">
          <div className="text-ink/65">cap (Backing Slots)</div>
          <div className="font-bold text-lg text-ink">{capacity}</div>
        </div>
      </div>

      {/* Backing Array Cells */}
      <div className="bg-paper border-2 border-ink rounded-xl p-4 space-y-2">
        <div className="text-xs font-display font-bold text-ink/75">
          Hidden Backing Array in RAM (filled = len, dashed = spare capacity)
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {Array.from({ length: capacity }).map((_, i) => {
            const hasVal = i < elements.length;
            return (
              <div
                key={i}
                className={`rounded-xl py-2.5 text-center font-mono font-bold tabular-nums border-2 ${
                  hasVal
                    ? i === 0 && subMutated
                      ? 'bg-yellowHi border-ink shadow-[2px_2px_0px_#222]'
                      : 'bg-tealSoft border-ink'
                    : 'bg-white/60 border-dashed border-ink/40 text-ink/40'
                }`}
              >
                <div className="text-[10px]">[{i}]</div>
                <div className="text-base">{hasVal ? elements[i] : '—'}</div>
              </div>
            );
          })}
        </div>
        {subMutated && (
          <p className="text-sm font-bold text-redPen pt-1">
            Shared Backing Array Alert: Editing `sub[0] = 999` mutated `s[0]` because both slices point to the same array! Use `copy()` to isolate.
          </p>
        )}
      </div>
    </div>
  );
}

/* ==================== 4. MAPS & COMMA-OK LAB ==================== */
function MapsLab() {
  const [entries, setEntries] = useState<Array<[string, number]>>([
    ['alice', 90],
    ['bob', 0],
    ['taqui', 100],
  ]);
  const [lookupKey, setLookupKey] = useState('bob');
  const [newKey, setNewKey] = useState('gopher');
  const [newVal, setNewVal] = useState('85');

  const foundEntry = entries.find(([k]) => k === lookupKey);
  const commaVal = foundEntry ? foundEntry[1] : 0;
  const commaOk = Boolean(foundEntry);

  const handleSet = () => {
    const k = newKey.trim();
    if (!k) return;
    const v = Number(newVal) || 0;
    setEntries((prev) => {
      const idx = prev.findIndex(([ek]) => ek === k);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = [k, v];
        return copy;
      }
      return [...prev, [k, v]];
    });
    setLookupKey(k);
  };

  const handleDelete = (key: string) => {
    setEntries((prev) => prev.filter(([k]) => k !== key));
  };

  const handleShuffle = () => {
    setEntries((prev) => [...prev].sort(() => Math.random() - 0.5));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="bg-paper border-2 border-ink rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="font-display font-bold text-sm text-tealDeep">
            Map Storage (`map[string]int`)
          </span>
          <button
            type="button"
            onClick={handleShuffle}
            className="sketch-btn bg-white px-2.5 py-1 text-xs font-display font-bold"
          >
            Randomize Range Order
          </button>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            placeholder="key"
            aria-label="Map key"
            className="w-1/2 bg-white border-2 border-ink rounded-xl px-3 py-1.5 font-mono text-sm"
          />
          <input
            type="number"
            value={newVal}
            onChange={(e) => setNewVal(e.target.value)}
            placeholder="int"
            aria-label="Map value"
            className="w-24 bg-white border-2 border-ink rounded-xl px-3 py-1.5 font-mono text-sm"
          />
          <button
            type="button"
            onClick={handleSet}
            className="sketch-btn bg-yellowHi px-3 py-1.5 font-display font-bold text-xs whitespace-nowrap"
          >
            m[k] = v
          </button>
        </div>

        <div className="space-y-1.5">
          {entries.map(([k, v]) => (
            <div
              key={k}
              className="flex items-center justify-between bg-white border-2 border-ink rounded-xl px-3 py-2 font-mono text-sm"
            >
              <button
                type="button"
                onClick={() => setLookupKey(k)}
                className="text-left hover:underline font-bold"
              >
                &quot;{k}&quot; =&gt; {v}
              </button>
              <button
                type="button"
                onClick={() => handleDelete(k)}
                className="text-xs font-display font-bold text-redPen hover:underline"
              >
                delete()
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-paper border-2 border-ink rounded-xl p-4 space-y-3">
        <div className="font-display font-bold text-sm text-tealDeep">
          Comma-Ok Lookup Inspector
        </div>
        <div className="flex flex-wrap gap-1.5">
          {['bob', 'ghost', 'taqui'].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setLookupKey(preset)}
              className={`sketch-btn px-3 py-1 font-mono text-xs font-bold ${
                lookupKey === preset ? 'bg-yellowHi' : 'bg-white'
              }`}
            >
              Lookup &quot;{preset}&quot;
            </button>
          ))}
        </div>
        <div className="bg-white border-2 border-ink rounded-xl p-3.5 font-mono text-sm space-y-2">
          <div>
            val, ok := scores[&quot;<span className="text-tealDeep font-bold">{lookupKey}</span>&quot;]
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="bg-tealSoft/70 border border-ink/40 rounded-lg p-2.5">
              <div className="text-xs text-ink/70">val</div>
              <div className="text-xl font-bold tabular-nums">{commaVal}</div>
            </div>
            <div
              className={`border border-ink/40 rounded-lg p-2.5 ${
                commaOk ? 'bg-yellowSoft' : 'bg-paperDark'
              }`}
            >
              <div className="text-xs text-ink/70">ok (exists?)</div>
              <div className={`text-xl font-bold ${commaOk ? 'text-greenPen' : 'text-redPen'}`}>
                {String(commaOk)}
              </div>
            </div>
          </div>
          <p className="font-hand text-base text-ink/85">
            {commaOk
              ? `Key "${lookupKey}" exists in the map (even if its stored value is 0!).`
              : `Key "${lookupKey}" is missing—Go returned zero value 0, and ok=false proved it wasn't stored.`}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ==================== 5. POINTERS & VALUE SEMANTICS LAB ==================== */
function PointersLab() {
  const [wallet, setWallet] = useState(100);
  const [mode, setMode] = useState<'value' | 'pointer'>('pointer');
  const [lastLog, setLastLog] = useState('Click "Add +50 Bonus" to compare photocopy vs live RAM pointer.');

  const applyBonus = () => {
    if (mode === 'pointer') {
      setWallet((w) => w + 50);
      setLastLog('addBonus(&wallet, 50): dereferenced *balance at 0xc00018a0 -> REAL wallet updated!');
    } else {
      setLastLog(`addBonusCopy(wallet, 50): local copy became ${wallet + 50}, then vanished—REAL wallet is still ${wallet}!`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setMode('value')}
          className={`sketch-btn px-3.5 py-2 font-display font-bold text-sm ${
            mode === 'value' ? 'bg-yellowHi' : 'bg-white'
          }`}
        >
          Pass by Value (Photocopy)
        </button>
        <button
          type="button"
          onClick={() => setMode('pointer')}
          className={`sketch-btn px-3.5 py-2 font-display font-bold text-sm ${
            mode === 'pointer' ? 'bg-tealSoft' : 'bg-white'
          }`}
        >
          Pass by Pointer (`&wallet`)
        </button>
        <button
          type="button"
          onClick={applyBonus}
          className="sketch-btn bg-yellowHi px-4 py-2 font-display font-extrabold text-sm inline-flex items-center gap-1.5"
        >
          <SketchIcon name="zap" className="w-4 h-4" /> Add +50 Bonus
        </button>
        <button
          type="button"
          onClick={() => {
            setWallet(100);
            setLastLog('Reset wallet to 100.');
          }}
          className="sketch-btn bg-white px-3 py-2 font-display font-bold text-sm"
        >
          Reset
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-paper border-2 border-ink rounded-xl p-4 space-y-1.5">
          <div className="text-xs font-mono text-ink/65">Caller RAM Slot: 0xc00018a0</div>
          <div className="font-display font-bold text-base">wallet (int)</div>
          <div className="text-3xl font-mono font-bold text-tealDeep tabular-nums">{wallet}</div>
        </div>

        <div className="bg-paper border-2 border-ink rounded-xl p-4 space-y-1.5">
          <div className="text-xs font-mono text-ink/65">
            {mode === 'pointer' ? 'Function Parameter: balance *int' : 'Function Parameter: balance int (copy)'}
          </div>
          <div className="font-display font-bold text-base">
            {mode === 'pointer' ? 'Points directly to 0xc00018a0' : 'Separate RAM Slot: 0xc00099f8'}
          </div>
          <div className="text-sm font-mono bg-white border border-ink/40 rounded-lg px-3 py-2">
            {mode === 'pointer' ? `*balance += 50  // live edit!` : `balance += 50   // edits photocopy only`}
          </div>
        </div>
      </div>

      <div
        className={`border-2 border-ink rounded-xl px-4 py-2.5 text-sm font-bold ${
          mode === 'pointer' ? 'bg-tealSoft text-ink' : 'bg-yellowSoft text-ink'
        }`}
      >
        {lastLog}
      </div>
    </div>
  );
}

/* ==================== 6. INTERFACES & ERROR CHAIN LAB ==================== */
function InterfacesErrorsLab() {
  const [adapter, setAdapter] = useState<'Email' | 'Slack' | 'MockTest'>('Email');
  const [wrapVerb, setWrapVerb] = useState<'%w' | '%v'>('%w');

  const outputs: Record<typeof adapter, string> = {
    Email: 'Email{Addr: "dev@taqui.in"}.Send("Deploy live!") -> SMTP 250 OK',
    Slack: 'Slack{Channel: "#ops"}.Send("Deploy live!") -> Webhook 200 OK',
    MockTest: 'MockNotifier.Send("Deploy live!") -> Recorded in memory (0ms unit test!)',
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="bg-paper border-2 border-ink rounded-xl p-4 space-y-3">
        <div className="font-display font-bold text-sm text-tealDeep">
          1. Implicit Interface Socket (`Notifier`)
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(['Email', 'Slack', 'MockTest'] as const).map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setAdapter(a)}
              className={`sketch-btn px-3 py-1.5 font-mono text-xs font-bold ${
                adapter === a ? 'bg-yellowHi' : 'bg-white'
              }`}
            >
              Plug {a}
            </button>
          ))}
        </div>
        <div className="bg-white border-2 border-ink rounded-xl p-3 font-mono text-xs space-y-1.5">
          <div className="text-tealDeep font-bold">func Alert(n Notifier, msg string)</div>
          <div>{outputs[adapter]}</div>
        </div>
        <p className="text-sm text-ink/80">
          None of these structs wrote <code className="font-mono">implements Notifier</code>—having{' '}
          <code className="font-mono">Send(string)</code> satisfies the socket automatically.
        </p>
      </div>

      <div className="bg-paper border-2 border-ink rounded-xl p-4 space-y-3">
        <div className="font-display font-bold text-sm text-tealDeep">
          2. Error Wrapping: `%w` vs `%v`
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setWrapVerb('%w')}
            className={`sketch-btn px-3 py-1.5 font-mono text-xs font-bold ${
              wrapVerb === '%w' ? 'bg-tealSoft' : 'bg-white'
            }`}
          >
            fmt.Errorf(&quot;user: %w&quot;, ErrNotFound)
          </button>
          <button
            type="button"
            onClick={() => setWrapVerb('%v')}
            className={`sketch-btn px-3 py-1.5 font-mono text-xs font-bold ${
              wrapVerb === '%v' ? 'bg-yellowHi' : 'bg-white'
            }`}
          >
            fmt.Errorf(&quot;user: %v&quot;, ErrNotFound)
          </button>
        </div>

        <div className="bg-white border-2 border-ink rounded-xl p-3.5 font-mono text-xs space-y-2">
          <div>
            errors.Is(err, ErrNotFound) =&gt;{' '}
            <span className={wrapVerb === '%w' ? 'text-greenPen font-bold' : 'text-redPen font-bold'}>
              {wrapVerb === '%w' ? 'true (Chain preserved!)' : 'false (Chain broken!)'}
            </span>
          </div>
          <p className="font-hand text-sm text-ink/85">
            {wrapVerb === '%w'
              ? '`%w` preserves the wrapped error chain so HTTP handlers cleanly return 404 Not Found.'
              : '`%v` flattens the error into plain text, so `errors.Is` can no longer detect ErrNotFound!'}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ==================== 7. CONCURRENCY, CHANNELS & RACE LAB ==================== */
function ConcurrencyLab() {
  const [workers, setWorkers] = useState(3);
  const [bufCap, setBufCap] = useState(4);
  const [queue, setQueue] = useState<number[]>([1, 2]);
  const [doneCount, setDoneCount] = useState(0);
  const [useMutex, setUseMutex] = useState(true);
  const [counterResult, setCounterResult] = useState<number | null>(null);

  const enqueueJob = () => {
    if (queue.length >= bufCap) return;
    setQueue((prev) => [...prev, prev.length + doneCount + 1]);
  };

  const processBatch = () => {
    if (queue.length === 0) return;
    const taken = Math.min(workers, queue.length);
    setQueue((prev) => prev.slice(taken));
    setDoneCount((d) => d + taken);
  };

  const simulateRace = () => {
    if (useMutex) {
      setCounterResult(1000);
    } else {
      const lost = 47 + Math.floor(Math.random() * 140);
      setCounterResult(1000 - lost);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Buffered Channel & Worker Pool */}
      <div className="bg-paper border-2 border-ink rounded-xl p-4 space-y-3">
        <div className="font-display font-bold text-sm text-tealDeep">
          1. Buffered Channel &amp; Worker Pool
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs font-display font-bold">
          <label className="space-y-1">
            <span>Workers: {workers}</span>
            <input
              type="range"
              min={1}
              max={6}
              value={workers}
              onChange={(e) => setWorkers(Number(e.target.value))}
              className="w-full accent-tealInk"
            />
          </label>
          <label className="space-y-1">
            <span>Channel cap: {bufCap}</span>
            <input
              type="range"
              min={2}
              max={8}
              value={bufCap}
              onChange={(e) => {
                const next = Number(e.target.value);
                setBufCap(next);
                setQueue((q) => q.slice(0, next));
              }}
              className="w-full accent-tealInk"
            />
          </label>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={enqueueJob}
            disabled={queue.length >= bufCap}
            className="sketch-btn bg-yellowHi px-3 py-1.5 font-mono text-xs font-bold disabled:opacity-50"
          >
            jobs &lt;- job
          </button>
          <button
            type="button"
            onClick={processBatch}
            disabled={queue.length === 0}
            className="sketch-btn bg-tealSoft px-3 py-1.5 font-mono text-xs font-bold disabled:opacity-50"
          >
            Run {workers} Workers
          </button>
          <button
            type="button"
            onClick={() => {
              setQueue([1, 2]);
              setDoneCount(0);
            }}
            className="sketch-btn bg-white px-2.5 py-1.5 font-display text-xs font-bold"
          >
            Reset
          </button>
        </div>

        <div className="space-y-1.5">
          <div className="text-xs font-mono flex justify-between">
            <span>chan int (buffered: {queue.length}/{bufCap})</span>
            <span className={queue.length >= bufCap ? 'text-redPen font-bold' : 'text-tealDeep font-bold'}>
              {queue.length >= bufCap ? 'FULL (Backpressure blocks sender!)' : `Done: ${doneCount}`}
            </span>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
            {Array.from({ length: bufCap }).map((_, i) => (
              <div
                key={i}
                className={`rounded-lg py-2 text-center font-mono text-xs font-bold border-2 ${
                  i < queue.length ? 'bg-yellowHi border-ink' : 'bg-white border-dashed border-ink/35 text-ink/40'
                }`}
              >
                {i < queue.length ? `#${queue[i]}` : '—'}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Race Condition vs Mutex */}
      <div className="bg-paper border-2 border-ink rounded-xl p-4 space-y-3">
        <div className="font-display font-bold text-sm text-tealDeep">
          2. 1,000 Goroutines Shared Counter (`-race`)
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setUseMutex(true);
              setCounterResult(null);
            }}
            className={`sketch-btn px-3 py-1.5 font-display text-xs font-bold inline-flex items-center gap-1 ${
              useMutex ? 'bg-tealSoft' : 'bg-white'
            }`}
          >
            <SketchIcon name="lock" className="w-3.5 h-3.5" /> sync.Mutex ON
          </button>
          <button
            type="button"
            onClick={() => {
              setUseMutex(false);
              setCounterResult(null);
            }}
            className={`sketch-btn px-3 py-1.5 font-display text-xs font-bold inline-flex items-center gap-1 ${
              !useMutex ? 'bg-yellowHi' : 'bg-white'
            }`}
          >
            <SketchIcon name="unlock" className="w-3.5 h-3.5" /> No Lock (Race!)
          </button>
        </div>

        <button
          type="button"
          onClick={simulateRace}
          className="sketch-btn bg-yellowHi px-4 py-2 font-display font-extrabold text-sm inline-flex items-center gap-1.5"
        >
          <SketchIcon name="play" className="w-4 h-4" /> Spawn 1,000 Goroutines
        </button>

        <div className="bg-white border-2 border-ink rounded-xl p-3 font-mono text-xs space-y-1.5 tabular-nums">
          <div>Expected count: 1000</div>
          <div>
            Actual count:{' '}
            <span className={counterResult === 1000 ? 'text-greenPen font-bold' : 'text-redPen font-bold'}>
              {counterResult === null ? '(click Run above)' : counterResult}
            </span>
          </div>
          {counterResult !== null && (
            <div className={useMutex ? 'text-greenPen font-bold' : 'text-redPen font-bold'}>
              {useMutex
                ? 'PASS: `go test -race` clean! Mutex serialized every increment.'
                : 'WARNING: DATA RACE detected! Lost updates occurred across CPU cores.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ==================== 8. HTTP, CONTEXT TIMEOUT & SQL POOL LAB ==================== */
function HttpDbLab() {
  const [timeoutMs, setTimeoutMs] = useState(150);
  const [dbLatencyMs, setDbLatencyMs] = useState(90);
  const [userId, setUserId] = useState('42');
  const [paramMode, setParamMode] = useState<'param' | 'concat'>('param');

  const timedOut = dbLatencyMs > timeoutMs;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="bg-paper border-2 border-ink rounded-xl p-4 space-y-3">
        <div className="font-display font-bold text-sm text-tealDeep">
          1. HTTP Request + `context.WithTimeout` Simulator
        </div>
        <div className="space-y-2 text-xs font-display font-bold">
          <label className="block">
            Context Timeout Budget: <span className="font-mono">{timeoutMs}ms</span>
            <input
              type="range"
              min={50}
              max={300}
              step={10}
              value={timeoutMs}
              onChange={(e) => setTimeoutMs(Number(e.target.value))}
              className="w-full accent-tealInk"
            />
          </label>
          <label className="block">
            PostgreSQL Query Time: <span className="font-mono">{dbLatencyMs}ms</span>
            <input
              type="range"
              min={20}
              max={300}
              step={10}
              value={dbLatencyMs}
              onChange={(e) => setDbLatencyMs(Number(e.target.value))}
              className="w-full accent-tealInk"
            />
          </label>
        </div>

        <div
          className={`border-2 border-ink rounded-xl p-3 font-mono text-xs space-y-1 ${
            timedOut ? 'bg-yellowSoft' : 'bg-tealSoft'
          }`}
        >
          <div className="font-bold text-sm">
            {timedOut ? '504 Gateway Timeout (ctx.Done() fired!)' : '200 OK (JSON returned cleanly)'}
          </div>
          <div>
            {timedOut
              ? `Aborted at ${timeoutMs}ms -> Postgres cancelled query early -> goroutine freed!`
              : `Completed in ${dbLatencyMs}ms within ${timeoutMs}ms budget -> defer rows.Close() ran.`}
          </div>
        </div>
      </div>

      <div className="bg-paper border-2 border-ink rounded-xl p-4 space-y-3">
        <div className="font-display font-bold text-sm text-tealDeep">
          2. Parameterized SQL (`$1`) vs Unsafe Concat
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setUserId('42')}
            className="sketch-btn bg-white px-2.5 py-1 font-mono text-xs font-bold"
          >
            Normal: 42
          </button>
          <button
            type="button"
            onClick={() => setUserId("42 OR 1=1")}
            className="sketch-btn bg-yellowSoft px-2.5 py-1 font-mono text-xs font-bold"
          >
            Attack: 42 OR 1=1
          </button>
          <button
            type="button"
            onClick={() => setParamMode((m) => (m === 'param' ? 'concat' : 'param'))}
            className={`sketch-btn px-2.5 py-1 font-display text-xs font-bold ${
              paramMode === 'param' ? 'bg-tealSoft' : 'bg-yellowHi'
            }`}
          >
            Mode: {paramMode === 'param' ? 'Safe ($1)' : 'Unsafe fmt.Sprintf'}
          </button>
        </div>

        <div className="bg-white border-2 border-ink rounded-xl p-3 font-mono text-xs space-y-1.5">
          {paramMode === 'param' ? (
            <>
              <div className="text-tealDeep font-bold">
                db.QueryRowContext(ctx, &quot;SELECT * FROM users WHERE id = $1&quot;, input)
              </div>
              <div className="text-greenPen font-bold">
                SAFE: Input &quot;{userId}&quot; is sent strictly as bound data, never executable SQL.
              </div>
            </>
          ) : (
            <>
              <div className="text-redPen font-bold">
                SELECT * FROM users WHERE id = {userId}
              </div>
              <div className="text-redPen font-bold">
                {userId.includes('OR')
                  ? 'SQL INJECTION! Attacker dumped every user row!'
                  : 'Vulnerable pattern—try clicking the Attack button above!'}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ==================== 9. MEMORY ALIGNMENT & ESCAPE LAB ==================== */
function MemoryPerfLab() {
  const [aligned, setAligned] = useState(false);

  const badCells = [
    { label: 'A bool', type: 'data' },
    { label: 'pad', type: 'pad' },
    { label: 'pad', type: 'pad' },
    { label: 'pad', type: 'pad' },
    { label: 'pad', type: 'pad' },
    { label: 'pad', type: 'pad' },
    { label: 'pad', type: 'pad' },
    { label: 'pad', type: 'pad' },
    { label: 'B int64 (8B)', type: 'wide' },
    { label: 'C bool', type: 'data' },
    { label: 'pad', type: 'pad' },
    { label: 'pad', type: 'pad' },
    { label: 'pad', type: 'pad' },
    { label: 'pad', type: 'pad' },
    { label: 'pad', type: 'pad' },
    { label: 'pad', type: 'pad' },
    { label: 'pad', type: 'pad' },
  ];

  const goodCells = [
    { label: 'B int64 (8B)', type: 'wide' },
    { label: 'A bool', type: 'data' },
    { label: 'C bool', type: 'data' },
    { label: 'pad', type: 'pad' },
    { label: 'pad', type: 'pad' },
    { label: 'pad', type: 'pad' },
    { label: 'pad', type: 'pad' },
    { label: 'pad', type: 'pad' },
    { label: 'pad', type: 'pad' },
  ];

  const cells = aligned ? goodCells : badCells;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setAligned(false)}
            className={`sketch-btn px-3.5 py-2 font-mono text-xs font-bold ${
              !aligned ? 'bg-yellowHi' : 'bg-white'
            }`}
          >
            Unaligned: {`{ bool; int64; bool }`} (24 B)
          </button>
          <button
            type="button"
            onClick={() => setAligned(true)}
            className={`sketch-btn px-3.5 py-2 font-mono text-xs font-bold ${
              aligned ? 'bg-tealSoft' : 'bg-white'
            }`}
          >
            Aligned: {`{ int64; bool; bool }`} (16 B)
          </button>
        </div>
        <div className="font-mono text-xs font-bold tabular-nums bg-white border-2 border-ink rounded-xl px-3 py-1.5">
          unsafe.Sizeof = {aligned ? '16 bytes (33% RAM saved!)' : '24 bytes (14B wasted padding)'}
        </div>
      </div>

      <div className="bg-paper border-2 border-ink rounded-xl p-4 space-y-2">
        <div className="text-xs font-display font-bold text-ink/75">
          64-bit CPU 8-Byte Word Rows (yellow = real fields, dashed = wasted padding bytes)
        </div>
        <div className="grid grid-cols-8 gap-1.5 font-mono text-[11px] font-bold">
          {cells.map((cell, idx) => (
            <div
              key={idx}
              className={`rounded-lg py-2 text-center border-2 ${
                cell.type === 'wide'
                  ? 'col-span-8 bg-tealSoft border-ink'
                  : cell.type === 'data'
                  ? 'bg-yellowHi border-ink'
                  : 'bg-white border-dashed border-ink/35 text-ink/40'
              }`}
            >
              {cell.label}
            </div>
          ))}
        </div>
        <p className="text-sm text-ink/85 pt-1">
          Across a slice of 1,000,000 structs, simply sorting fields largest-to-smallest saves{' '}
          <span className="font-mono font-bold">8 MB</span> of heap RAM and speeds up CPU cache hits!
        </p>
      </div>
    </div>
  );
}

/* ==================== 10. DISTRIBUTED RESILIENCE & AGENTIC GO LAB ==================== */
function DistributedAiLab({ moduleId }: { moduleId: number }) {
  const isAiModule = moduleId >= 52;
  const [failures, setFailures] = useState(0);
  const [agentStep, setAgentStep] = useState(0);
  const [approved, setApproved] = useState(false);

  const circuitState = failures >= 3 ? 'OPEN (Fail-Fast)' : failures === 2 ? 'WARN (2/3)' : 'CLOSED (Healthy)';
  const agentTimeline = [
    {
      title: 'Step 1 · Plan & Parallel Read Tools',
      detail: 'Go errgroup executes `searchDocs` (95ms) + `fetchOrder` (110ms) concurrently in 110ms total!',
    },
    {
      title: 'Step 2 · Grounded RAG Context Built',
      detail: 'Filtered chunks by `WHERE tenant_id = $1` (cosine >= 0.86); no cross-tenant data leaked.',
    },
    {
      title: 'Step 3 · Human-in-the-Loop Gate',
      detail: approved
        ? 'Human Approved! Refund tool executed idempotently with Idempotency-Key.'
        : 'PAUSED before `issue_refund` tool—waiting for explicit human approval!',
    },
    {
      title: 'Step 4 · Streamed Final Answer + Trace',
      detail: 'Tokens flushed via SSE (`http.Flusher`) and OpenTelemetry span logged with token cost.',
    },
  ];

  if (isAiModule) {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setAgentStep((s) => (s + 1) % agentTimeline.length)}
              className="sketch-btn bg-yellowHi px-3.5 py-2 font-display font-bold text-sm inline-flex items-center gap-1.5"
            >
              <SketchIcon name="play" className="w-4 h-4" /> Step Agent ({agentStep + 1}/4)
            </button>
            <button
              type="button"
              onClick={() => setApproved((a) => !a)}
              className={`sketch-btn px-3.5 py-2 font-display font-bold text-sm ${
                approved ? 'bg-tealSoft' : 'bg-white'
              }`}
            >
              HITL Approval: {approved ? 'GRANTED' : 'REQUIRED'}
            </button>
          </div>
          <span className="font-mono text-xs font-bold bg-white border-2 border-ink rounded-xl px-3 py-1.5">
            Budget: step {agentStep + 1} / maxSteps 8
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {agentTimeline.map((item, idx) => (
            <div
              key={item.title}
              className={`border-2 border-ink rounded-xl p-3.5 transition-transform ${
                idx === agentStep
                  ? 'bg-yellowSoft shadow-[3px_3px_0px_#222] -translate-y-0.5'
                  : idx < agentStep
                  ? 'bg-tealSoft/70'
                  : 'bg-paper opacity-75'
              }`}
            >
              <div className="font-display font-bold text-sm text-ink">{item.title}</div>
              <p className="text-sm text-ink/85 mt-1">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFailures((f) => Math.min(f + 1, 5))}
            className="sketch-btn bg-yellowHi px-3.5 py-2 font-display font-bold text-sm"
          >
            Simulate Downstream Failure
          </button>
          <button
            type="button"
            onClick={() => setFailures(0)}
            className="sketch-btn bg-tealSoft px-3.5 py-2 font-display font-bold text-sm"
          >
            Probe Succeeds (Close Circuit)
          </button>
        </div>
        <span
          className={`font-mono text-xs font-bold border-2 border-ink rounded-xl px-3 py-1.5 ${
            failures >= 3 ? 'bg-yellowHi text-redPen' : 'bg-tealSoft text-ink'
          }`}
        >
          Breaker: {circuitState}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
        {[0, 1, 2].map((attempt) => {
          const base = 100 << attempt;
          const jitter = ((attempt + 1) * 19) % 45;
          return (
            <div key={attempt} className="bg-paper border-2 border-ink rounded-xl p-3 space-y-1">
              <div className="text-ink/65">Retry Attempt #{attempt + 1}</div>
              <div className="text-base font-bold text-tealDeep tabular-nums">
                {base}ms + {jitter}ms jitter = {base + jitter}ms
              </div>
              <div className="font-hand text-sm text-ink/80">
                Idempotency-Key reused safely
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-sm font-bold text-ink/85">
        {failures >= 3
          ? 'Circuit OPEN: Requests fail immediately (<1ms) instead of piling up hung goroutines while the downstream service recovers.'
          : 'Circuit CLOSED: Normal requests flow through with exponential backoff + jitter on transient network hiccups.'}
      </p>
    </div>
  );
}

const LAB_LABELS: Record<LabType, { title: string; subtitle: string }> = {
  'env-vars': {
    title: 'Interactive Sketchnote Lab: Zero Values & UTF-8 Runes',
    subtitle: 'Experiment with live Unicode bytes vs runes and Go zero values.',
  },
  'loops-arrays': {
    title: 'Interactive Sketchnote Lab: Value Copies & Range Loops',
    subtitle: 'Click array cells and step through Go range loop semantics.',
  },
  slices: {
    title: 'Interactive Sketchnote Lab: Slice Header & Backing Array',
    subtitle: 'Append past capacity to watch 2x reallocation and shared sub-slices.',
  },
  maps: {
    title: 'Interactive Sketchnote Lab: Hash Map & Comma-Ok Check',
    subtitle: 'Insert, delete, randomize order, and tell stored 0 apart from missing keys.',
  },
  pointers: {
    title: 'Interactive Sketchnote Lab: Value Photocopy vs Pointer Link',
    subtitle: 'Toggle pass-by-value vs `&wallet` pointer mutation in RAM.',
  },
  'interfaces-errors': {
    title: 'Interactive Sketchnote Lab: Implicit Sockets & `%w` Error Chains',
    subtitle: 'Plug structs into an interface and compare `%w` vs `%v` wrapping.',
  },
  concurrency: {
    title: 'Interactive Sketchnote Lab: Worker Pool & Race Detector',
    subtitle: 'Tune channel capacity, worker count, and test Mutex ON vs OFF.',
  },
  'http-db': {
    title: 'Interactive Sketchnote Lab: Context Timeout & Safe SQL',
    subtitle: 'Slide DB latency past timeout budgets and test `$1` query safety.',
  },
  'memory-perf': {
    title: 'Interactive Sketchnote Lab: Struct Memory Alignment',
    subtitle: 'Reorder struct fields and watch CPU padding shrink from 24B to 16B.',
  },
  'distributed-ai': {
    title: 'Interactive Sketchnote Lab: Resilience & Agentic Go Workflow',
    subtitle: 'Step through circuit-breaker backoff or a bounded multi-tool Go Agent.',
  },
};

export function InteractiveLab({ labType, moduleId }: InteractiveLabProps) {
  const meta = LAB_LABELS[labType];

  return (
    <section className="sketch-box-teal p-5 sm:p-6 space-y-4">
      <div>
        <h3 className="font-display font-extrabold text-lg sm:text-xl text-ink flex items-center gap-2">
          <SketchIcon name="zap" className="w-5 h-5 text-tealDeep" />
          {meta.title}
        </h3>
        <p className="text-base text-ink/80 mt-0.5">{meta.subtitle}</p>
      </div>

      {labType === 'env-vars' && <EnvVarsLab />}
      {labType === 'loops-arrays' && <LoopsArraysLab />}
      {labType === 'slices' && <SlicesLab />}
      {labType === 'maps' && <MapsLab />}
      {labType === 'pointers' && <PointersLab />}
      {labType === 'interfaces-errors' && <InterfacesErrorsLab />}
      {labType === 'concurrency' && <ConcurrencyLab />}
      {labType === 'http-db' && <HttpDbLab />}
      {labType === 'memory-perf' && <MemoryPerfLab />}
      {labType === 'distributed-ai' && <DistributedAiLab moduleId={moduleId} />}
    </section>
  );
}
