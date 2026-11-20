import type { ModuleContent, SyllabusModule, Subtopic } from '../types';
import { MODULE_DATA_PART_1 } from './moduleDataPart1';
import { MODULE_DATA_PART_2 } from './moduleDataPart2';

export const MODULE_DATA: Record<number, ModuleContent> = {
  ...MODULE_DATA_PART_1,
  ...MODULE_DATA_PART_2,
};

export function getModuleContent(moduleId: number): ModuleContent {
  return MODULE_DATA[moduleId] || MODULE_DATA[0];
}

/**
 * Generates concise, focused study guidance for any of the 615 subtopics so learners
 * can click any checklist item and see what to practice and verify.
 */
export function getSubtopicStudyTip(mod: SyllabusModule, sub: Subtopic): string {
  const t = sub.title.toLowerCase();

  if (t.includes('go vs javascript') || t.includes('compiled vs interpreted')) {
    return 'Contrast compilation into a single native binary vs runtime interpretation (Node.js/CPython), and trace how startup time and memory change.';
  }
  if (t.includes('zero value')) {
    return 'Verify that Go assigns safe defaults (0, "", false, nil) automatically—never undefined—so structs start predictable.';
  }
  if (t.includes('exported') || t.includes('unexported')) {
    return 'Capitalized identifiers are exported outside the package; lowercase names remain package-private at compile time.';
  }
  if (t.includes('rune') || t.includes('unicode') || t.includes('utf-8') || t.includes('byte')) {
    return 'Remember `byte` = `uint8` (raw data) and `rune` = `int32` (Unicode code point). Use `utf8.RuneCountInString` for human character length.';
  }
  if (t.includes('slice') || t.includes('backing array') || t.includes('append') || t.includes('copy')) {
    return 'Track the 3-word slice header (ptr, len, cap). Reassign `s = append(s, x)` and use `copy()` whenever you must break shared backing memory.';
  }
  if (t.includes('map') || t.includes('key exists')) {
    return 'Always initialize maps before writing (`make` or `{}`), use `val, ok := m[k]` to verify presence, and never depend on iteration order.';
  }
  if (t.includes('defer')) {
    return 'Defers execute LIFO right before the enclosing function returns—place `defer resource.Close()` immediately after checking `err != nil`.';
  }
  if (t.includes('pointer') || t.includes('address') || t.includes('dereference')) {
    return 'Use `&x` to take an address and `*p` to read/write the underlying value. Guard against `nil` pointers before dereferencing.';
  }
  if (t.includes('interface') || t.includes('type assertion') || t.includes('type switch')) {
    return 'Keep interfaces small (1–3 methods), rely on implicit satisfaction, use comma-ok type assertions, and avoid returning typed-nil pointers.';
  }
  if (t.includes('error') || t.includes('panic') || t.includes('recover') || t.includes('%w')) {
    return 'Return explicit `error` values, wrap context with `fmt.Errorf("...: %w", err)`, inspect chains with `errors.Is`/`errors.As`, and avoid panic for normal errors.';
  }
  if (t.includes('goroutine') || t.includes('race') || t.includes('concurrency')) {
    return 'Ensure every spawned goroutine has a clear exit path (context or closed channel) and verify shared memory access with `go test -race`.';
  }
  if (t.includes('channel') || t.includes('select')) {
    return 'Let only the sender close a channel, use directional channel signatures (`<-chan` / `chan<-`), and combine `select` with `ctx.Done()` for clean cancellation.';
  }
  if (t.includes('mutex') || t.includes('waitgroup') || t.includes('atomic') || t.includes('sync.')) {
    return 'Always pass `sync` primitives by pointer (`*sync.Mutex`, `*sync.WaitGroup`), unlock via `defer`, and prefer `RWMutex` or `atomic` on read-heavy counters.';
  }
  if (t.includes('context')) {
    return 'Pass `ctx context.Context` as parameter #1 down the call chain and always call `defer cancel()` immediately after `WithTimeout`/`WithCancel`.';
  }
  if (t.includes('http') || t.includes('middleware') || t.includes('router') || t.includes('sse') || t.includes('cors')) {
    return 'Set explicit `http.Server` and `http.Client` timeouts, close `resp.Body`, set headers before `WriteHeader`, and flush immediately for SSE streams.';
  }
  if (t.includes('sql') || t.includes('postgres') || t.includes('mysql') || t.includes('transaction') || t.includes('pool') || t.includes('gorm') || t.includes('sqlc') || t.includes('pgx')) {
    return 'Use parameterized queries (`$1`/`?`), `*Context` query methods, `defer rows.Close()`, check `rows.Err()`, and tune connection pool limits.';
  }
  if (t.includes('test') || t.includes('mock') || t.includes('fuzz') || t.includes('benchmark')) {
    return 'Structure cases as table-driven `t.Run` subtests, mark helpers with `t.Helper()`, and run `go test -race -cover ./...` on every change.';
  }
  if (t.includes('docker') || t.includes('kubernetes') || t.includes('pod') || t.includes('ci/cd') || t.includes('github actions')) {
    return 'Build static `CGO_ENABLED=0` binaries via multi-stage Dockerfiles, run as non-root, wire `/livez` + `/readyz` probes, and handle `SIGTERM` gracefully.';
  }
  if (t.includes('llm') || t.includes('rag') || t.includes('vector') || t.includes('embedding') || t.includes('agent') || t.includes('tool')) {
    return 'Enforce hard step/timeout budgets, filter retrieval by tenant metadata, validate structured JSON into Go structs, and execute independent tools concurrently.';
  }

  return `Master ${sub.title} within Module ${mod.id} (${mod.title}): trace how Go’s explicit syntax handles it, compare it with your JS/Python habits, and test edge cases in the interactive lab above.`;
}
