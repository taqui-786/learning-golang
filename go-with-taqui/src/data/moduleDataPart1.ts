import type { ModuleContent } from '../types';

export const MODULE_DATA_PART_1: Record<number, ModuleContent> = {
  0: {
    summary:
      'Go is a fast, compiled, statically typed language built by Google engineers for readable, scalable backends. Its entire toolchain—compiler, formatter, test runner, and doc viewer—ships in one binary.',
    mentalModel:
      'Node.js ships your recipe book plus a kitchen interpreter (V8) onto the server. Go bakes the meal ahead of time into one self-contained lunchbox binary.',
    lab: 'env-vars',
    goCode: `package main

import (
\t"fmt"
\t"runtime"
)

func main() {
\tfmt.Println("Hello from Go with taqui!")
\tfmt.Printf("Running on %s/%s\\n", runtime.GOOS, runtime.GOARCH)
}`,
    goOut: `Hello from Go with taqui!
Running on linux/amd64`,
    lines: [
      ['package main', 'Marks this file as an executable program (not a reusable library).'],
      ['import (...)', 'Pulls in Go standard library packages: fmt for printing, runtime for OS info.'],
      ['func main()', 'The mandatory entry point where Go starts running your program.'],
      ['go build / go run', 'go run compiles and runs quickly; go build outputs a standalone executable file.'],
    ],
    jsBridge:
      'JavaScript is the programming language; TypeScript adds a static type system on top of JavaScript; Node.js is a JavaScript runtime—not a separate language. Go compiles directly to native machine code with no separate runtime install needed on servers.',
    pyBridge:
      'Python executes bytecode inside the CPython interpreter and relies on virtualenvs + pip. Go compiles ahead-of-time into one static binary and manages dependencies natively via go.mod.',
    realApp:
      'Docker, Kubernetes, Prometheus, and Cloudflare edge proxies are written in Go because single binaries deploy instantly with low RAM.',
    mistake:
      'Leaving an unused import or variable in a file—unlike JS or Python warnings, Go refuses to compile unused code.',
    quiz: [
      {
        type: 'Concept',
        q: 'Which statement accurately describes JavaScript, TypeScript, and Node.js?',
        opts: [
          'Node.js is a compiled language like Go',
          'JavaScript is the language, TypeScript adds static types, and Node.js is a runtime',
          'TypeScript is a runtime that replaces Node.js',
        ],
        ans: 1,
        why: 'JavaScript is the language itself, TypeScript is a statically typed superset that compiles to JS, and Node.js executes JS outside the browser.',
      },
      {
        type: 'CLI Tool',
        q: 'Which Go command automatically formats your source files to the official style?',
        opts: ['go style', 'gofmt -w .', 'go lint --fix'],
        ans: 1,
        why: 'gofmt (or go fmt) enforces one standard formatting style across the entire Go ecosystem.',
      },
      {
        type: 'Predict Output',
        q: 'What happens if you import "fmt" in main.go without calling anything from fmt?',
        opts: [
          'Go prints a warning and runs anyway',
          'Compilation fails with an unused import error',
          'Go deletes the import automatically at runtime',
        ],
        ans: 1,
        why: 'Go treats unused imports and unused local variables as compile-time errors to keep code clean and builds fast.',
      },
      {
        type: 'Architecture',
        q: 'What is the main difference between go run main.go and go build main.go?',
        opts: [
          'go run compiles to a temporary binary and runs it; go build saves a reusable executable file',
          'go run interprets Go line-by-line like Python',
          'go build requires Node.js to bundle files',
        ],
        ans: 0,
        why: 'Both invoke the Go compiler, but go build writes a standalone executable binary to disk for deployment.',
      },
    ],
  },
  1: {
    summary:
      'Learn how Go stores values using var, short declaration :=, compile-time constants, safe zero values, explicit conversions, and capitalization-based visibility.',
    mentalModel:
      'Think of every Go variable as a labeled storage box whose shape (type) is locked when created—and if you leave it empty, Go automatically puts a safe default (0, "", false) inside.',
    lab: 'env-vars',
    goCode: `package main

import "fmt"

const AppName = "Go with taqui" // Exported (Capital A)

func main() {
\tvar visits int                // Zero value is 0 (never undefined!)
\tuser := "Taqui"               // Short declaration inside func
\trate := float64(visits) + 4.5 // Explicit conversion required
\tfmt.Printf("%s | %s | visits=%d | rate=%.1f\\n", AppName, user, visits, rate)
}`,
    goOut: `Go with taqui | Taqui | visits=0 | rate=4.5`,
    lines: [
      ['const AppName', 'Untyped string constant; capital A makes it exported (public) outside this package.'],
      ['var visits int', 'Declares an integer without assigning; Go initializes it to its zero value (0).'],
      ['user := "Taqui"', 'Short declaration infers string type; valid only inside functions.'],
      ['float64(visits)', 'Go never silently mixes int and float64; you convert explicitly.'],
    ],
    jsBridge:
      'In JavaScript, an uninitialized let x is undefined and "5" + 1 coerces to "51". Go has NO undefined and NO implicit type coercion: uninitialized variables get zero values, and mixing types is a compile error.',
    pyBridge:
      'Python variables can change types freely (x = 5 then x = "hi") and exports use naming conventions like _private. Go locks each variable type at compile time and enforces visibility strictly via Capital vs lowercase first letters.',
    realApp:
      'Zero values let config structs and counters start safely without null-check boilerplate, while explicit conversions prevent silent financial rounding bugs.',
    mistake:
      'Trying to use := at the package level outside a function (use var instead), or forgetting that lowercase identifiers cannot be accessed by other packages.',
    quiz: [
      {
        type: 'Predict Output',
        q: 'What is printed by: var active bool; fmt.Println(active)?',
        opts: ['undefined', 'nil', 'false'],
        ans: 2,
        why: 'Every Go type has a deterministic zero value: 0 for numbers, "" for strings, and false for booleans.',
      },
      {
        type: 'Find Bug',
        q: 'Why does `var a int = 5; var b float64 = 2.5; fmt.Println(a + b)` fail to compile?',
        opts: [
          'Go requires explicit conversion like float64(a) + b',
          'float64 cannot be added in main()',
          'You must use const instead of var',
        ],
        ans: 0,
        why: 'Go forbids implicit numeric mixing; you must explicitly convert int to float64.',
      },
      {
        type: 'Visibility',
        q: 'How do you make a variable or function accessible from another Go package?',
        opts: ['Add the export keyword', 'Start its name with an Uppercase letter', 'Put it inside module.exports'],
        ans: 1,
        why: 'Go uses capitalization instead of public/private keywords: Uppercase = exported, lowercase = unexported.',
      },
      {
        type: 'Syntax',
        q: 'Where is short variable declaration (`x := 10`) allowed?',
        opts: ['Anywhere, including package top level', 'Only inside functions', 'Only inside loops'],
        ans: 1,
        why: 'Short declaration := works only inside function bodies; package-level declarations must use var or const.',
      },
    ],
  },
  2: {
    summary:
      'Explore Go’s concrete data types—signed/unsigned integers, float64, bool, immutable UTF-8 strings, byte (uint8), rune (int32), and Unicode handling.',
    mentalModel:
      'A Go string is a read-only ribbon of raw UTF-8 bytes; a byte is one raw slot (uint8), while a rune is a full Unicode character (int32) that safely holds accented letters and symbols.',
    lab: 'env-vars',
    goCode: `package main

import (
\t"fmt"
\t"unicode/utf8"
)

func main() {
\tword := "café"
\tvar b byte = 'A' // alias for uint8 (65)
\tvar r rune = 'é' // alias for int32 (Unicode code point)
\tfmt.Println("Bytes:", len(word), "Runes:", utf8.RuneCountInString(word))
\tfmt.Printf("byte=%d rune=%U\\n", b, r)
}`,
    goOut: `Bytes: 5 Runes: 4
byte=65 rune=U+00E9`,
    lines: [
      ['len(word)', 'Returns byte length (5 bytes in UTF-8), NOT visual character count!'],
      ['utf8.RuneCountInString', 'Counts actual Unicode code points (4 runes).'],
      ['byte vs rune', 'byte is an alias for uint8 (raw binary data); rune is an alias for int32 (one Unicode code point).'],
    ],
    jsBridge:
      'JavaScript has only one number type (IEEE-754 float64) plus BigInt, and JS strings are UTF-16. Go gives exact integer sizes (int, int64, uint8) and native UTF-8 strings.',
    pyBridge:
      'Python 3 int has arbitrary precision and str indexes by Unicode character. Go int64 has fixed 64-bit bounds (fast CPU math) and string indexing s[0] returns a raw byte, so use range or []rune for characters.',
    realApp:
      'Choosing int64 for database IDs, byte slices for HTTP/file streams, and runes for international username length validation.',
    mistake:
      'Using len(str) to validate character limits for non-ASCII text—use utf8.RuneCountInString(str) instead.',
    quiz: [
      {
        type: 'Concept',
        q: 'What is a `rune` in Go?',
        opts: ['An alias for int32 representing a Unicode code point', 'A 1-byte ASCII character', 'A mutable string type'],
        ans: 0,
        why: 'rune is an alias for int32, letting Go represent any Unicode character cleanly.',
      },
      {
        type: 'Predict Behavior',
        q: 'What does `len("café")` return in Go?',
        opts: ['4 (character count)', '5 (UTF-8 byte count, since é takes 2 bytes)', '8 (UTF-16 code units)'],
        ans: 1,
        why: 'len() on a Go string counts raw UTF-8 bytes, not human-visible characters.',
      },
      {
        type: 'Types',
        q: 'Which underlying type is `byte` an alias for?',
        opts: ['int8', 'uint8', 'char'],
        ans: 1,
        why: 'byte is a built-in alias for uint8 (0 to 255), heavily used in I/O and networking.',
      },
      {
        type: 'Scenario',
        q: 'Why should you avoid float64 for storing exact currency amounts like $199.99?',
        opts: [
          'float64 is deprecated in Go',
          'Binary floating point has rounding inaccuracies; store smallest integer units (cents) in int64',
          'float64 cannot hold decimals',
        ],
        ans: 1,
        why: 'IEEE-754 floats cannot represent 0.1 exactly; production payment systems store integer cents.',
      },
    ],
  },
  3: {
    summary:
      'Master Go’s arithmetic, comparison, logical, assignment, bitwise operators, precedence rules, and why ++ / -- are statements rather than expressions.',
    mentalModel:
      'Operators work just like math class, except Go keeps ++ simple on its own line so nobody writes confusing puzzles like x = i++ + ++i.',
    lab: 'env-vars',
    goCode: `package main

import "fmt"

func main() {
\tconst (
\t\tRead  = 1 << iota // 1 (001)
\t\tWrite             // 2 (010)
\t\tExec              // 4 (100)
\t)
\tperms := Read | Write
\tcount := 1
\tcount++ // Statement only! Cannot do x := count++
\tfmt.Println("CanWrite:", perms&Write != 0, "Count:", count, "IntDiv:", 7/2)
}`,
    goOut: `CanWrite: true Count: 2 IntDiv: 3`,
    lines: [
      ['1 << iota', 'Bit-shifting creates clean bitmask flags (1, 2, 4).'],
      ['perms&Write != 0', 'Bitwise AND tests whether the Write permission bit is enabled.'],
      ['count++', 'In Go, ++ and -- are statements, not expressions; no ++count prefix exists.'],
      ['7 / 2', 'Dividing two ints performs integer division (3, dropping the remainder).'],
    ],
    jsBridge:
      'JavaScript has === vs == coercion, ++x expressions, and 7 / 2 === 3.5. Go only has == (strict, same-type equality), no ++x, and integer division truncates toward zero.',
    pyBridge:
      'Python uses // for integer division and / for float division, and has no ++ operator at all. Go uses / for integer division when both operands are ints and supports postfix i++ as a statement.',
    realApp: 'Bitwise flags power Linux file permissions (0644), feature flags, and network protocol headers.',
    mistake:
      'Expecting 7 / 2 to produce 3.5 (write 7.0 / 2.0) or trying to write arr[i++] inside an index expression.',
    quiz: [
      {
        type: 'Predict Output',
        q: 'What is the result of `9 / 2` in Go?',
        opts: ['4.5', '4', '5'],
        ans: 1,
        why: 'Both operands are int, so Go performs integer division and drops the fractional part.',
      },
      {
        type: 'Find Bug',
        q: 'Which line will FAIL to compile in Go?',
        opts: ['i++', 'x := i++', 'i += 1'],
        ans: 1,
        why: 'In Go, ++ is a statement, not an expression, so it cannot be assigned to a variable.',
      },
      {
        type: 'Comparison',
        q: 'Why does Go NOT have a `===` operator like JavaScript?',
        opts: [
          'Go does not support equality checks',
          'Go forbids comparing mismatched types, so == is already strict',
          'Go uses .equals() instead',
        ],
        ans: 1,
        why: 'Because Go is strictly typed with no implicit coercion, == never coerces "5" == 5.',
      },
      {
        type: 'Bitwise',
        q: 'If `flags := Read | Write`, which expression checks if `Write` is set?',
        opts: ['flags & Write != 0', 'flags || Write', 'flags % Write == 0'],
        ans: 0,
        why: 'Bitwise AND (&) isolates the matching bit; non-zero means that flag is active.',
      },
    ],
  },
  4: {
    summary:
      'Write clean branching logic with Go’s parenthesis-free if statements, scoped if-initializers, auto-breaking switch statements, tagless switches, and type switches.',
    mentalModel:
      'Go’s switch is a polite traffic controller: after matching one lane, it automatically stops (breaks) unless you explicitly ask for fallthrough.',
    lab: 'env-vars',
    goCode: `package main

import "fmt"

func describe(v any) string {
\tswitch val := v.(type) {
\tcase int:
\t\treturn fmt.Sprintf("number %d", val)
\tcase string:
\t\treturn "text: " + val
\tdefault:
\t\treturn "other"
\t}
}

func main() {
\tif n := 42; n > 40 { // n exists only inside this if block
\t\tfmt.Println("High:", describe(n))
\t}
}`,
    goOut: `High: number 42`,
    lines: [
      ['if n := 42; n > 40', 'Declares a short-lived variable scoped strictly to the if/else block—huge in Go error checks!'],
      ['switch val := v.(type)', 'A Type Switch inspects the concrete runtime type inside an interface value (any).'],
      ['No break needed', 'Unlike JS/C, Go switch cases do NOT fall through by default.'],
    ],
    jsBridge:
      'In JS you must wrap conditions in parentheses and add break to every switch case to avoid accidental fallthrough. Go drops outer parentheses and breaks switch cases automatically.',
    pyBridge:
      'Python uses indentation and match/case (3.10+) and truthy values like if items:. Go requires explicit boolean conditions (if len(items) > 0) and curly braces { } on the same line.',
    realApp:
      'HTTP handlers use `if err := json.Unmarshal(...); err != nil` and tagless switches to map error categories to clean HTTP status codes.',
    mistake:
      'Writing `if count {` (Go has no truthy/falsy conversion; write `if count > 0`) or putting the opening `{` on a new line.',
    quiz: [
      {
        type: 'Behavior',
        q: 'What happens at the end of a matched `case` in a Go `switch` statement?',
        opts: [
          'It falls through to the next case like JavaScript',
          'It breaks automatically unless `fallthrough` is written',
          'It panics if break is omitted',
        ],
        ans: 1,
        why: 'Go prevents accidental switch fallthrough bugs by breaking automatically after each case.',
      },
      {
        type: 'Scope',
        q: 'In `if err := check(); err != nil { ... }`, where is `err` accessible?',
        opts: ['In the entire function', 'Only inside the if and attached else blocks', 'Across the whole package'],
        ans: 1,
        why: 'Variables initialized in an if header stay tightly scoped to that if/else chain.',
      },
      {
        type: 'Find Bug',
        q: 'Why does `name := "Go"; if name { fmt.Println(name) }` fail to compile?',
        opts: [
          'Strings are not booleans; Go has no truthy/falsy coercion',
          'Missing parentheses around name',
          'fmt.Println cannot print inside if',
        ],
        ans: 0,
        why: 'Go conditions must evaluate strictly to bool, such as `if name != ""`.',
      },
      {
        type: 'Feature',
        q: 'What does a switch with NO expression (`switch { case x > 10: ... }`) replace?',
        opts: ['A for loop', 'A long if / else-if chain', 'A struct definition'],
        ans: 1,
        why: 'Tagless switch reads like a clean, readable vertical table of boolean conditions.',
      },
    ],
  },
  5: {
    summary:
      'Go simplifies looping to ONE keyword: `for`. Use it for classic C-style counters, while-style loops, infinite server loops, and clean `range` iteration over slices, maps, strings, and channels.',
    mentalModel:
      'Instead of memorizing for, while, do-while, for..in, for..of, and forEach, Go hands you one Swiss-Army `for` tool that handles every loop pattern cleanly.',
    lab: 'loops-arrays',
    goCode: `package main

import "fmt"

func main() {
\t// 1. Classic counter
\tsum := 0
\tfor i := 1; i <= 3; i++ { sum += i }

\t// 2. While-style
\tn := 1
\tfor n < 8 { n *= 2 }

\t// 3. Range over slice (index, value)
\tlangs := []string{"Go", "JS", "Python"}
\tfor idx, lang := range langs {
\t\tfmt.Printf("%d:%s ", idx, lang)
\t}
\tfmt.Printf("| sum=%d n=%d\\n", sum, n)
}`,
    goOut: `0:Go 1:JS 2:Python | sum=6 n=8`,
    lines: [
      ['for i := 1; i <= 3; i++', 'Classic 3-part loop; in Go 1.22+ you can also write `for i := range 3`.'],
      ['for n < 8', 'While-style loop—just omit init and post parts.'],
      ['for idx, lang := range langs', 'Returns index and a COPY of each element; use `_` to discard unused index.'],
    ],
    jsBridge:
      'JavaScript has for, while, do-while, for..of, and .forEach(). Go unifies all of them into `for`, and `range` gives both index and value cleanly (for strings, range decodes UTF-8 runes!).',
    pyBridge:
      'Python uses `for i, val in enumerate(items):` and `while cond:`. Go’s `for i, val := range items` works like Python’s enumerate by default.',
    realApp:
      'Infinite `for {}` loops drive background job consumers, HTTP accept loops, and agent reasoning loops until a `break` or `ctx.Done()` exits.',
    mistake:
      'Mutating the loop value copy `for _, u := range users { u.Active = true }`—it only changes the copy! Modify `users[i].Active = true` instead.',
    quiz: [
      {
        type: 'Syntax',
        q: 'How do you write a while-loop in Go?',
        opts: ['while x < 10 { x++ }', 'for x < 10 { x++ }', 'loop x < 10 { x++ }'],
        ans: 1,
        why: 'Go has no while keyword; `for condition {}` is Go’s while loop.',
      },
      {
        type: 'Bug Hunt',
        q: 'In `for _, v := range nums { v = v * 2 }`, what happens to the `nums` slice?',
        opts: [
          'Every number in nums doubles',
          'nums is unchanged because v is a copy of each element',
          'Compilation fails',
        ],
        ans: 1,
        why: 'range copies each element into v; to mutate elements in place, index via `nums[i] *= 2`.',
      },
      {
        type: 'Range on String',
        q: 'What does `for i, r := range "café"` iterate over?',
        opts: [
          'Raw single bytes',
          'Decoded UTF-8 runes (with starting byte index i)',
          'Words split by spaces',
        ],
        ans: 1,
        why: 'Ranging over a Go string automatically decodes multi-byte UTF-8 runes.',
      },
      {
        type: 'Syntax',
        q: 'How do you discard the index when using `range` if you only need the value?',
        opts: ['for _, v := range items', 'for null, v := range items', 'for v := range items'],
        ans: 0,
        why: 'The blank identifier `_` tells Go you intentionally ignore the first value. (`for v := range items` gives the index, not the value!)',
      },
    ],
  },
  6: {
    summary:
      'Arrays in Go have a fixed compile-time length that is part of their type (`[3]int` differs from `[4]int`), are comparable with `==`, and are copied completely by value when assigned or passed.',
    mentalModel:
      'An array is a sealed egg carton with a fixed number of slots—if you hand it to a friend (a function), Go builds a brand-new copy of the entire carton.',
    lab: 'loops-arrays',
    goCode: `package main

import "fmt"

func main() {
\ta := [3]int{10, 20, 30}
\tb := a     // Full value copy!
\tb[0] = 999 // Does NOT touch a
\tfmt.Println("a:", a, "b:", b, "same?", a == b)
}`,
    goOut: `a: [10 20 30] b: [999 20 30] same? false`,
    lines: [
      ['[3]int{10, 20, 30}', 'Fixed-size array of 3 integers; `[...]int{10,20,30}` lets the compiler count 3 for you.'],
      ['b := a', 'Copies all 3 integers into a new array in memory.'],
      ['a == b', 'Arrays of identical length and comparable elements can be compared directly with ==.'],
    ],
    jsBridge:
      'JavaScript "Arrays" are dynamic reference objects (assigning b = a shares the same array). Go arrays are fixed-size value types; Go Slices (Module 7) are what behave like dynamic JS arrays.',
    pyBridge:
      'Python lists are dynamic references. Go arrays are fixed-length contiguous memory blocks, closer to C arrays or fixed tuples in memory layout.',
    realApp:
      'Fixed-size cryptographic hashes like SHA-256 (`[32]byte`), UUIDs (`[16]byte`), and IPv4 bytes (`[4]byte`) use arrays for zero-allocation stack storage.',
    mistake:
      'Passing a huge array `[100000]int` by value to a function (copies all 100k ints!)—use a slice or pointer instead.',
    quiz: [
      {
        type: 'Types',
        q: 'Can you assign a `[3]int` variable to a `[4]int` variable in Go?',
        opts: [
          'Yes, Go pads the 4th slot with 0',
          'No, the length is part of the array type so they are incompatible types',
          'Only with append()',
        ],
        ans: 1,
        why: 'In Go, `[3]int` and `[4]int` are completely distinct compile-time types.',
      },
      {
        type: 'Predict Output',
        q: 'If `x := [2]int{1, 2}; y := x; y[0] = 9`, what is `x[0]`?',
        opts: ['9', '1', '0'],
        ans: 1,
        why: 'Assigning an array copies all its elements by value, leaving x untouched.',
      },
      {
        type: 'Comparison',
        q: 'Can two `[3]int` arrays be compared using `a == b`?',
        opts: ['Yes, element-by-element', 'No, only slices can use ==', 'Only if you import reflect'],
        ans: 0,
        why: 'Arrays are directly comparable with == when their element type is comparable (unlike slices!).',
      },
      {
        type: 'Real Use',
        q: 'When do Go engineers actually prefer an array over a slice?',
        opts: [
          'For every list in a web API',
          'For fixed-size data like `[32]byte` SHA-256 digests',
          'Whenever they need push/pop',
        ],
        ans: 1,
        why: 'Fixed-size values like hashes and UUIDs fit cleanly in arrays without heap allocation.',
      },
    ],
  },
  7: {
    summary:
      'Slices are Go’s workhorse dynamic lists: a lightweight 3-word header (pointer, length, capacity) viewing a hidden backing array. Mastering `len`, `cap`, `append`, and `copy` prevents subtle memory bugs.',
    mentalModel:
      'A slice is a stretchy viewing window sliding over a hidden backing array. When you `append()` past capacity, Go allocates a bigger array (~2x) and copies elements over.',
    lab: 'slices',
    goCode: `package main

import "fmt"

func main() {
\ts := make([]int, 0, 2) // len=0, cap=2
\ts = append(s, 10, 20)
\tfmt.Printf("before: %v len=%d cap=%d\\n", s, len(s), cap(s))
\ts = append(s, 30)      // exceeds cap=2 -> reallocates!
\tfmt.Printf("after:  %v len=%d cap=%d\\n", s, len(s), cap(s))
}`,
    goOut: `before: [10 20] len=2 cap=2
after:  [10 20 30] len=3 cap=4`,
    lines: [
      ['make([]int, 0, 2)', 'Pre-allocates backing array capacity 2 while starting with 0 elements.'],
      ['s = append(s, 30)', 'Always reassign the return value of append because reallocation may move the backing array!'],
      ['sub := s[0:2]', 'Sub-slicing shares the SAME backing array unless copied with copy().'],
    ],
    jsBridge:
      'JS `arr.push(x)` mutates in place and `arr.slice(0, 2)` creates a shallow copy. In Go, `s = append(s, x)` returns a new slice header, and `s[0:2]` SHARES backing memory with `s`!',
    pyBridge:
      'Python `lst[0:2]` allocates a brand-new list copy. Go’s `s[0:2]` is O(1) zero-copy—fast, but mutating the sub-slice also mutates the parent slice!',
    realApp:
      'Pre-sizing `make([]User, 0, limit)` when reading SQL rows avoids repeated heap reallocations under high API traffic.',
    mistake:
      'Forgetting that sub-slicing shares the backing array (causing spooky cross-mutations or keeping a 100MB file pinned in RAM by a tiny 10-byte sub-slice).',
    quiz: [
      {
        type: 'Internals',
        q: 'What three fields live inside a Go slice header?',
        opts: ['Pointer to backing array, length, capacity', 'Head node, tail node, size', 'Type name, hash, values'],
        ans: 0,
        why: 'A slice header is just 3 words: backing array pointer, len, and cap.',
      },
      {
        type: 'Predict Output',
        q: 'If `a := []int{1,2,3}; b := a[:2]; b[0] = 99`, what is `a[0]`?',
        opts: ['1', '99', 'Compile error'],
        ans: 1,
        why: 'Sub-slicing shares the underlying backing array, so changing b[0] changes a[0]!',
      },
      {
        type: 'Best Practice',
        q: 'How do you avoid repeated memory reallocations when you know you will append 500 items?',
        opts: ['var s []int', 's := make([]int, 0, 500)', 's := [500]int{}'],
        ans: 1,
        why: 'Setting capacity to 500 upfront allocates the backing array once while keeping len=0.',
      },
      {
        type: 'Nil vs Empty',
        q: 'Does `var s []int` (nil slice) work safely with `len(s)` and `append(s, 1)`?',
        opts: [
          'No, append panics on a nil slice',
          'Yes! A nil slice has len 0 and is ready for append()',
          'Only after calling make()',
        ],
        ans: 1,
        why: 'Unlike nil maps, nil slices are completely valid for len(), range, and append().',
      },
    ],
  },
  8: {
    summary:
      'Maps are Go’s built-in hash tables (`map[K]V`) offering O(1) average lookup, insert, and delete—with comma-ok existence checks, randomized iteration order, and strict nil-map safety rules.',
    mentalModel:
      'A map is a super-fast locker room where each key hashes straight to a locker. Reading an empty locker returns a zero value, so check the `ok` tag to know if anything was actually stored.',
    lab: 'maps',
    goCode: `package main

import "fmt"

func main() {
\tscores := map[string]int{"alice": 90, "bob": 0}
\tscores["taqui"] = 100
\tdelete(scores, "alice")

\tif val, ok := scores["bob"]; ok {
\t\tfmt.Println("bob exists with score:", val)
\t}
\t_, exists := scores["ghost"]
\tfmt.Println("ghost exists?", exists)
}`,
    goOut: `bob exists with score: 0
ghost exists? false`,
    lines: [
      ['map[string]int{...}', 'Creates an initialized map; never write to a nil map (`var m map[string]int`) without make().'],
      ['val, ok := scores["bob"]', 'The comma-ok idiom distinguishes a stored 0 from a missing key!'],
      ['delete(scores, "alice")', 'Removes a key safely (no-op if the key does not exist).'],
    ],
    jsBridge:
      'JS objects coerce keys to strings and preserve insertion order; JS `Map` allows any key. Go maps enforce uniform typed keys (must be comparable) and intentionally RANDOMIZE iteration order so you never depend on it.',
    pyBridge:
      'Python dicts raise `KeyError` on missing keys and preserve insertion order (3.7+). Go maps return the zero value on missing keys and randomize `for k, v := range m` order.',
    realApp: 'In-memory caches, rate-limit counters (guarded by sync.Mutex), and O(1) user-ID lookup tables.',
    mistake:
      'Writing to a nil map (`var m map[string]int; m["a"] = 1` panics!) or accessing one map concurrently from multiple goroutines without a mutex (fatal crash).',
    quiz: [
      {
        type: 'Find Bug',
        q: 'What happens when you run `var m map[string]int; m["go"] = 1`?',
        opts: ['Go auto-initializes m', 'Runtime panic: assignment to entry in nil map', 'Compile-time error'],
        ans: 1,
        why: 'Reading a nil map returns the zero value, but writing to a nil map panics—initialize with make() or {}.',
      },
      {
        type: 'Idiom',
        q: 'Why do we use `val, ok := m[key]` in Go?',
        opts: [
          'Because missing keys return the zero value, so ok confirms real presence',
          'Because Go throws an exception otherwise',
          'To sort the map',
        ],
        ans: 0,
        why: 'Without ok, you cannot tell if key "bob" has value 0 or does not exist at all.',
      },
      {
        type: 'Behavior',
        q: 'What order does `for k := range myMap` iterate in?',
        opts: ['Alphabetical order', 'Insertion order like Python/JS', 'Intentionally randomized order'],
        ans: 2,
        why: 'Go randomizes map iteration order to stop developers from relying on hash bucket layout.',
      },
      {
        type: 'Concurrency',
        q: 'Is a regular Go `map` safe for concurrent writes from multiple goroutines?',
        opts: [
          'Yes, built-in thread safety',
          'No, concurrent map writes cause a fatal runtime crash unless locked',
          'Only when using string keys',
        ],
        ans: 1,
        why: 'Protect shared maps with sync.Mutex/sync.RWMutex or use sync.Map for specific read-heavy cases.',
      },
    ],
  },
  9: {
    summary:
      'Functions are first-class citizens in Go with multiple return values (crucial for `(result, error)`), variadic parameters, closures, higher-order callbacks, and `defer` cleanup stacks.',
    mentalModel:
      'Think of `defer` as a sticky note placed on the exit door of a function: no matter how you leave (early return or normal end), Go executes your sticky notes in Last-In-First-Out order.',
    lab: 'pointers',
    goCode: `package main

import "fmt"

func divide(a, b float64) (float64, bool) {
\tif b == 0 { return 0, false }
\treturn a / b, true
}

func makeCounter() func() int {
\tn := 0
\treturn func() int { n++; return n } // Closure
}

func main() {
\tdefer fmt.Println("3. cleanup runs last")
\tnext := makeCounter()
\tq, ok := divide(10, 2)
\tfmt.Printf("1. div=%.0f ok=%v\\n2. count=%d,%d\\n", q, ok, next(), next())
}`,
    goOut: `1. div=5 ok=true
2. count=1,2
3. cleanup runs last`,
    lines: [
      ['(float64, bool)', 'Go natively returns multiple values—no need to wrap them in an object or tuple!'],
      ['makeCounter() func() int', 'Returns a closure that captures and remembers `n` across calls.'],
      ['defer fmt.Println(...)', 'Schedules execution right before main() exits; multiple defers run LIFO (stack order).'],
    ],
    jsBridge:
      'JS uses array/object destructuring to simulate multiple returns and `try/finally` for cleanup. Go natively returns multiple values and uses `defer` right next to resource opening.',
    pyBridge:
      'Python returns tuples (`return a, b`) and uses `with` context managers for cleanup. Go’s `defer file.Close()` keeps open and close side-by-side without extra indentation.',
    realApp:
      'HTTP middleware factories (higher-order functions returning `http.Handler`) and `defer rows.Close()` in every database query.',
    mistake:
      'Calling `defer f.Close()` inside a long `for` loop—defers run when the *function* returns, not when the loop iteration ends, which can exhaust open file descriptors!',
    quiz: [
      {
        type: 'Predict Output',
        q: 'If a function has `defer fmt.Print("A"); defer fmt.Print("B"); fmt.Print("C")`, what prints?',
        opts: ['ABC', 'CAB', 'CBA'],
        ans: 2,
        why: 'Normal code runs first (C), then deferred calls run in LIFO (stack) order: B, then A.',
      },
      {
        type: 'Syntax',
        q: 'How do you write a variadic function that accepts any number of ints?',
        opts: ['func sum(nums ...int) int', 'func sum(...nums int) int', 'func sum(*nums int) int'],
        ans: 0,
        why: 'Go places `...` before the type: `nums ...int`, which becomes a `[]int` slice inside the function.',
      },
      {
        type: 'Pitfall',
        q: 'When does a `defer` statement execute?',
        opts: [
          'At the end of the enclosing if or for block',
          'When the surrounding function returns',
          'In a background goroutine',
        ],
        ans: 1,
        why: 'defer is function-scoped, so avoid deferring resource closes inside huge loops without wrapping in a helper function.',
      },
      {
        type: 'Closures',
        q: 'What can a Go closure do?',
        opts: [
          'Capture and persist variables from its surrounding function scope',
          'Bypass compile-time type checking',
          'Run only once',
        ],
        ans: 0,
        why: 'Just like JS and Python closures, Go function literals retain access to captured outer variables.',
      },
    ],
  },
  10: {
    summary:
      'Pointers hold the memory address of a value. Using `&` (address-of) and `*` (dereference), you mutate real data in place and share large structs without expensive copies.',
    mentalModel:
      'Passing by value hands someone a photocopy of your Google Doc. Passing a pointer (`&doc`) shares the live link—edits via `*doc` update the real original.',
    lab: 'pointers',
    goCode: `package main

import "fmt"

func addBonus(balance *int, bonus int) {
\tif balance == nil { return } // Always guard nil pointers!
\t*balance += bonus
}

func main() {
\twallet := 100
\taddBonus(&wallet, 50)
\tfmt.Println("Updated wallet:", wallet)
}`,
    goOut: `Updated wallet: 150`,
    lines: [
      ['&wallet', 'Address operator: produces a `*int` pointer pointing to wallet’s exact RAM location.'],
      ['balance *int', 'Parameter type `*int` means "pointer to an int".'],
      ['*balance += bonus', 'Dereference operator: follows the address and updates the real int in RAM.'],
      ['if balance == nil', 'Dereferencing a nil pointer crashes your program—always guard when nil is possible!'],
    ],
    jsBridge:
      'JS hides pointers: primitives copy by value while objects pass references implicitly. Go makes value vs pointer explicit everywhere (and unlike C/C++, Go has NO dangerous pointer arithmetic!).',
    pyBridge:
      'In Python, everything is a reference to a heap object. Go lets you choose value copies (fast on stack, safe from mutation) or explicit pointers (shared mutable state).',
    realApp:
      'Mutating struct state in methods, passing `*sql.DB` or `*http.Request` efficiently, and distinguishing optional JSON fields (`*string` nil vs `""`).',
    mistake:
      'Dereferencing an uninitialized pointer (`var p *int; *p = 5`) causes a nil pointer dereference panic.',
    quiz: [
      {
        type: 'Operators',
        q: 'What does `&x` produce in Go?',
        opts: ['A copy of x', 'The memory address (pointer) of x', 'Bitwise AND of x'],
        ans: 1,
        why: 'Unary `&` takes the address of a variable so you can pass a pointer to it.',
      },
      {
        type: 'Predict Output',
        q: 'Given `x := 10; p := &x; *p = 25`, what is `x` now?',
        opts: ['10', '25', '0'],
        ans: 1,
        why: 'p points to x, so `*p = 25` updates the value stored in x directly.',
      },
      {
        type: 'Safety',
        q: 'What happens if you dereference a `nil` pointer (`var p *int; fmt.Println(*p)`)?',
        opts: ['Prints 0', 'Runtime panic (nil pointer dereference)', 'Compile error'],
        ans: 1,
        why: 'A nil pointer points to no memory address, so dereferencing it panics at runtime.',
      },
      {
        type: 'Difference from C',
        q: 'Does Go allow C-style pointer arithmetic like `p++`?',
        opts: ['Yes, everywhere', 'No, Go forbids pointer arithmetic for memory safety', 'Only on strings'],
        ans: 1,
        why: 'Go gives you pointers without unsafe pointer arithmetic (outside the special `unsafe` package).',
      },
    ],
  },
  11: {
    summary:
      'Structs group typed fields into custom domain models. Go has NO classes or inheritance—instead it uses struct composition, embedded structs, and struct tags for JSON/DB mapping.',
    mentalModel:
      'A struct is a custom blueprint form (like an ID card with Name, Age, Email slots). Embedding another struct is like stapling a reusable sub-form right onto your main form.',
    lab: 'pointers',
    goCode: `package main

import (
\t"encoding/json"
\t"fmt"
)

type Timestamps struct { CreatedAt string }
type User struct {
\tID    int    \`json:"id"\`
\tName  string \`json:"name"\`
\tToken string \`json:"-"\` // Hidden from JSON!
\tTimestamps           // Embedded struct (composition)
}

func main() {
\tu := User{ID: 1, Name: "Taqui", Token: "secret", Timestamps: Timestamps{CreatedAt: "2026"}}
\tb, _ := json.Marshal(u)
\tfmt.Println(string(b), "| Promoted:", u.CreatedAt)
}`,
    goOut: `{"id":1,"name":"Taqui","CreatedAt":"2026"} | Promoted: 2026`,
    lines: [
      ['type User struct', 'Defines a concrete data layout—all fields start at safe zero values if omitted.'],
      ['`json:"-"`', 'Struct tags attach metadata read via reflection; `-` ensures secrets are never serialized.'],
      ['Timestamps', 'Embedding promotes `u.CreatedAt` directly onto `User` without classical inheritance!'],
    ],
    jsBridge:
      'JS uses classes or ad-hoc `{}` objects where fields can appear/disappear at runtime. Go structs have fixed, memory-efficient layouts checked at compile time.',
    pyBridge:
      'Python uses classes or `@dataclass` with inheritance. Go replaces inheritance entirely with struct embedding (composition over inheritance).',
    realApp: 'Every API request payload, database model, configuration object, and LLM tool schema in Go is a struct.',
    mistake:
      'Forgetting to Capitalize struct fields when encoding to JSON—lowercase fields are invisible to `encoding/json`!',
    quiz: [
      {
        type: 'JSON Trap',
        q: 'Why does `type Item struct { name string }` encode to `{}` in JSON?',
        opts: [
          'JSON requires pointers',
          'Lowercase `name` is unexported, so encoding/json cannot access it',
          'Missing json tag',
        ],
        ans: 1,
        why: 'Only exported (Capitalized) struct fields are visible to external packages like encoding/json.',
      },
      {
        type: 'OOP Design',
        q: 'How does Go reuse fields and methods across structs without `extends`?',
        opts: ['Struct embedding (composition)', 'Multiple class inheritance', 'Prototypes'],
        ans: 0,
        why: 'Go favors composition: embedding a struct promotes its fields and methods cleanly.',
      },
      {
        type: 'Security',
        q: 'Which struct tag prevents a Password field from ever being serialized to JSON?',
        opts: ['`json:"hidden"`', '`json:"-"`', '`json:"private"`'],
        ans: 1,
        why: '`json:"-"` tells encoding/json to always ignore that field.',
      },
      {
        type: 'Zero Values',
        q: 'What are the fields of `var u User` if not explicitly initialized?',
        opts: ['undefined', 'Each field holds its own type zero value (0, "", false)', 'Compile error'],
        ans: 1,
        why: 'Zero-value structs are immediately usable without a mandatory constructor.',
      },
    ],
  },
  12: {
    summary:
      'Methods are functions with a special receiver argument attached to a type. Knowing when to use a value receiver `(u User)` vs a pointer receiver `(u *User)` is essential Go fluency.',
    mentalModel:
      'A value receiver reads a snapshot of the struct; a pointer receiver holds the keys to edit the real struct in place.',
    lab: 'pointers',
    goCode: `package main

import "fmt"

type Account struct{ Balance int }

func (a Account) Read() int      { return a.Balance } // Value receiver
func (a *Account) Deposit(n int) { a.Balance += n }   // Pointer receiver

func main() {
\tacc := Account{Balance: 100}
\tacc.Deposit(50) // Go auto-takes (&acc).Deposit(50)
\tfmt.Println("Balance:", acc.Read())
}`,
    goOut: `Balance: 150`,
    lines: [
      ['func (a Account) Read()', 'Value receiver works on a copy—ideal for small immutable reads.'],
      ['func (a *Account) Deposit(n int)', 'Pointer receiver mutates the caller’s real `Account` and avoids copying big structs.'],
      ['Method Sets', 'Pointer receivers belong to `*Account`’s method set when satisfying interfaces.'],
    ],
    jsBridge:
      'JS attaches methods to class prototypes with dynamic `this` binding pitfalls. Go receivers are explicit typed parameters (`a`, not `this`) with zero binding surprises.',
    pyBridge:
      'Python passes `self` explicitly as the first argument inside a class body. Go puts the receiver before the method name and lets you attach methods to ANY custom named type in your package (even `type Celsius float64`).',
    realApp: 'Attaching `ServeHTTP` to custom handlers, `Validate()` to request DTOs, and `String()` for custom log formatting.',
    mistake:
      'Writing a value receiver `func (a Account) Deposit(n int)` and wondering why the balance never changes!',
    quiz: [
      {
        type: 'Find Bug',
        q: 'Why does `func (c Counter) Inc() { c.N++ }` fail to increment the caller’s Counter?',
        opts: [
          'Value receiver edits a copy of Counter; use `(c *Counter)`',
          'Methods cannot modify structs',
          'Missing return statement',
        ],
        ans: 0,
        why: 'To mutate the receiver’s fields, you must declare a pointer receiver `(c *Counter)`.',
      },
      {
        type: 'Custom Types',
        q: 'Can you attach methods to `type Role string` in Go?',
        opts: [
          'No, only structs can have methods',
          'Yes, any defined type in your own package can have methods',
          'Only if it embeds a struct',
        ],
        ans: 1,
        why: 'Go lets you define methods on any named type declared in the same package.',
      },
      {
        type: 'Consistency',
        q: 'If one method on `User` requires a pointer receiver `*User`, what is idiomatic for the other methods?',
        opts: [
          'Keep all methods on `*User` for consistent method sets',
          'Mix value and pointer randomly',
          'Use global functions instead',
        ],
        ans: 0,
        why: 'Keeping receivers consistent prevents confusion when passing values vs pointers to interfaces.',
      },
      {
        type: 'Syntax',
        q: 'Does Go use `this` or `self` inside methods?',
        opts: [
          'Yes, `this` is mandatory',
          'No, you pick a short receiver name like `u` or `acc`',
          'Yes, `self` is a reserved keyword',
        ],
        ans: 1,
        why: 'Idiomatic Go uses a short 1–2 letter receiver name matching the type (e.g., `u` for User).',
      },
    ],
  },
  13: {
    summary:
      'Interfaces define behavior contracts without coupling. In Go, satisfaction is IMPLICIT—any type implementing the methods automatically satisfies the interface. Remember: accept interfaces, return structs.',
    mentalModel:
      'An interface is a wall power socket. Any appliance (struct) with matching prongs (methods) plugs right in—without ever writing `implements WallSocket`.',
    lab: 'interfaces-errors',
    goCode: `package main

import "fmt"

type Notifier interface { Send(msg string) }
type Email struct{ Addr string }
func (e Email) Send(msg string) { fmt.Println("Email to", e.Addr, "->", msg) }

func Alert(n Notifier, msg string) { n.Send(msg) } // Accepts interface!

func main() {
\tAlert(Email{Addr: "dev@taqui.in"}, "Deploy live!")
}`,
    goOut: `Email to dev@taqui.in -> Deploy live!`,
    lines: [
      ['type Notifier interface', 'Small 1-method interface (just like Go’s famous `io.Reader` and `fmt.Stringer`).'],
      ['Implicit implementation', 'Email never mentions Notifier—having `Send(string)` is enough!'],
      ['Nil interface vs Typed Nil', 'An interface holds (type, value); if type is `*Email` and value is `nil`, `n != nil` is TRUE!'],
    ],
    jsBridge:
      'TypeScript has structural interfaces erased at compile time; plain JS has runtime duck typing. Go interfaces are checked at compile time AND carry runtime type descriptors.',
    pyBridge:
      'Python uses runtime duck typing and optional `typing.Protocol`. Go’s implicit interfaces act like `Protocol` enforced strictly by the compiler.',
    realApp: 'Swapping real PostgreSQL repositories or OpenAI clients for fast in-memory mocks in unit tests.',
    mistake:
      'Returning a typed nil pointer (`var e *MyErr = nil; return e`) as an `error` interface—callers see `err != nil` because the interface holds a non-nil type descriptor!',
    quiz: [
      {
        type: 'Core Rule',
        q: 'How does a struct implement an interface in Go?',
        opts: [
          'By writing `implements InterfaceName`',
          'Automatically, simply by implementing all methods in the interface',
          'By registering it in init()',
        ],
        ans: 1,
        why: 'Implicit satisfaction decouples packages—you can satisfy interfaces defined later by callers!',
      },
      {
        type: 'Subtle Trap',
        q: 'If `var p *MyErr = nil; var err error = p`, what does `err == nil` evaluate to?',
        opts: ['true', 'false (typed nil interface trap!)', 'Compile error'],
        ans: 1,
        why: 'An interface is nil ONLY when BOTH its concrete type and concrete value are nil.',
      },
      {
        type: 'Design',
        q: 'What does Go’s famous proverb "Accept interfaces, return structs" mean?',
        opts: [
          'Functions take flexible interface parameters but constructors return concrete struct types',
          'Never define structs',
          'Always return `any`',
        ],
        ans: 0,
        why: 'Accepting small interfaces makes callers and tests flexible; returning structs gives callers full access to fields/methods.',
      },
      {
        type: 'Type Safety',
        q: 'What is the safe way to extract a `string` from an `any` value without panicking?',
        opts: ['s := v.(string)', 's, ok := v.(string)', 'string(v)'],
        ans: 1,
        why: 'The comma-ok type assertion returns `ok = false` instead of panicking on a mismatch.',
      },
    ],
  },
  14: {
    summary:
      'Go treats errors as normal return values—not hidden exceptions. Check `if err != nil`, wrap context with `fmt.Errorf("%w", err)`, inspect chains with `errors.Is` / `errors.As`, and reserve `panic` for unrecoverable bugs.',
    mentalModel:
      'Instead of throwing a grenade (`throw`) that might explode 6 files away, Go hands you a tray holding both your dish and an error slip: `(result, err)`.',
    lab: 'interfaces-errors',
    goCode: `package main

import (
\t"errors"
\t"fmt"
)

var ErrNotFound = errors.New("record not found")

func findUser(id int) (string, error) {
\tif id <= 0 {
\t\treturn "", fmt.Errorf("findUser(%d): %w", id, ErrNotFound)
\t}
\treturn "Taqui", nil
}

func main() {
\t_, err := findUser(-1)
\tif errors.Is(err, ErrNotFound) {
\t\tfmt.Println("404 handled cleanly:", err)
\t}
}`,
    goOut: `404 handled cleanly: findUser(-1): record not found`,
    lines: [
      ['type error interface { Error() string }', 'Built-in error is just a tiny 1-method interface!'],
      ['fmt.Errorf("...: %w", ErrNotFound)', '`%w` wraps the original error while adding helpful context.'],
      ['errors.Is(err, ErrNotFound)', 'Walks the entire wrapped error chain safely—never compare wrapped errors with `==`!'],
    ],
    jsBridge:
      'JS relies on `try/catch` and rejected Promises where hidden throws are easy to miss. Go makes every failure path visible right at the call site.',
    pyBridge:
      'Python uses `try/except` heavily for control flow (EAFP). Go prefers explicit error checking (LBYL) and reserves `panic/recover` only for truly impossible invariants or HTTP crash guards.',
    realApp:
      'Wrapping database `sql.ErrNoRows` into domain errors so HTTP handlers return clean 404 JSON instead of leaking SQL internals.',
    mistake:
      'Ignoring errors with `_`, or using `err == ErrNotFound` after wrapping with `%w` (always use `errors.Is`).',
    quiz: [
      {
        type: 'Wrapping',
        q: 'Which format verb wraps an error so `errors.Is()` and `errors.As()` can unwrap it later?',
        opts: ['%v', '%s', '%w'],
        ans: 2,
        why: '`%w` preserves the underlying error chain; `%v` only formats its text string.',
      },
      {
        type: 'Checking',
        q: 'How should you check if a wrapped error matches a custom error struct type `*ValidationError`?',
        opts: ['errors.As(err, &target)', 'err == ValidationError', 'try/catch'],
        ans: 0,
        why: 'errors.Is checks sentinel values; errors.As extracts a matching concrete error type from the chain.',
      },
      {
        type: 'Best Practice',
        q: 'When should a Go web handler call `panic()`?',
        opts: [
          'Whenever a user enters a wrong password',
          'Almost never for user errors—return an `error` instead',
          'On every 404 response',
        ],
        ans: 1,
        why: 'Normal runtime failures (bad input, DB down, 404) must return `error`; panic is only for programmer bugs.',
      },
      {
        type: 'Interface',
        q: 'What makes ANY custom struct satisfy Go’s built-in `error` interface?',
        opts: ['Implementing `Error() string`', 'Embedding `errors.Base`', 'Adding a `status` field'],
        ans: 0,
        why: 'The built-in error interface has only one method: `Error() string`.',
      },
    ],
  },
  15: {
    summary:
      'Packages organize Go code into cohesive directories. Understand exported vs unexported symbols, `init()` ordering, compiler-enforced `internal/` privacy, and breaking circular imports.',
    mentalModel:
      'A package is a tidy toolbox folder. Anything inside `internal/` has a compiler-enforced "Staff Only" lock so outside repos cannot import your private code.',
    lab: 'interfaces-errors',
    goCode: `package auth // Directory name == package name

import "strings"

// Exported: usable by other packages
func NormalizeEmail(raw string) string {
\treturn strings.ToLower(strings.TrimSpace(raw))
}

// unexported: private to package auth
func isBlocked(email string) bool { return false }`,
    goOut: `(Library package: imported as "yourapp/internal/auth" and called via auth.NormalizeEmail(...))`,
    lines: [
      ['package auth', 'Every .go file in the same directory belongs to the same package (except `_test` packages).'],
      ['internal/ directory', 'Go compiler forbids external modules from importing packages under `internal/`.'],
      ['No circular imports', 'If package A imports B, B cannot import A—extract shared types into a third package or interface.'],
    ],
    jsBridge:
      'JS/ESM exports individual files via `export`/`import`. Go’s unit of compilation and privacy is the whole DIRECTORY (package), not a single file.',
    pyBridge:
      'Python treats each `.py` file as a module and relies on `_leading_underscore` convention. Go enforces directory-level packages and strict compile-time capitalization privacy.',
    realApp: 'Structuring backends into `cmd/api`, `internal/handler`, `internal/service`, and `internal/repository`.',
    mistake: 'Creating vague `utils` or `helpers` dump packages that quickly cause circular dependency errors.',
    quiz: [
      {
        type: 'Privacy',
        q: 'What is special about a folder named `internal/` in a Go project?',
        opts: [
          'Go skips compiling it',
          'The Go toolchain prevents external modules from importing packages inside it',
          'It is required for go.mod',
        ],
        ans: 1,
        why: 'The compiler enforces `internal/` boundaries so your private API stays hidden from outside consumers.',
      },
      {
        type: 'Rules',
        q: 'What happens if package A imports package B and package B imports package A?',
        opts: ['Go resolves it at runtime', 'Compile-time error: import cycle not allowed', 'Only allowed with init()'],
        ans: 1,
        why: 'Go strictly forbids circular package imports to keep builds fast and architecture clean.',
      },
      {
        type: 'init()',
        q: 'When does a package’s `init()` function run?',
        opts: [
          'Only when called manually from main()',
          'Automatically once when the package is imported, before main()',
          'After main() exits',
        ],
        ans: 1,
        why: 'Go initializes package vars and calls `init()` before `main()`—use sparingly to avoid hidden side effects.',
      },
      {
        type: 'Scope',
        q: 'Can two `.go` files inside the SAME package call each other’s lowercase functions?',
        opts: [
          'Yes, unexported symbols are shared across all files in the same package',
          'No, lowercase is private to a single file',
          'Only if imported',
        ],
        ans: 0,
        why: 'Package boundaries are per-directory, so files in the same package see all package symbols.',
      },
    ],
  },
  16: {
    summary:
      'Go Modules (`go.mod` and `go.sum`) manage reproducible builds, semantic versions, cryptographic checksums, local `replace` directives, and clean dependency graphs without a giant `node_modules` folder.',
    mentalModel:
      '`go.mod` is your shopping list with minimum versions (`package.json`), and `go.sum` is the cryptographic receipt proving nobody tampered with the packages (`package-lock.json`).',
    lab: 'interfaces-errors',
    goCode: `// go.mod example
module github.com/taqui/go-api

go 1.24

require (
\tgithub.com/go-chi/chi/v5 v5.2.1
)

// Terminal workflow:
// go mod init github.com/taqui/go-api
// go get github.com/go-chi/chi/v5
// go mod tidy`,
    goOut: `go: added github.com/go-chi/chi/v5 v5.2.1
(Verified checksums saved to go.sum)`,
    lines: [
      ['go mod init', 'Creates `go.mod` to start a Go module anywhere on disk (no GOPATH required!).'],
      ['go.sum', 'Stores SHA-256 hashes of every downloaded module to prevent supply-chain tampering.'],
      ['go mod tidy', 'Adds missing dependencies used in code and removes unused ones from go.mod/go.sum.'],
    ],
    jsBridge:
      'Replaces `npm init`, `package.json`, `package-lock.json`, and `node_modules`—Go caches modules globally once instead of duplicating hundreds of MBs per project.',
    pyBridge:
      'Replaces `venv`, `requirements.txt`, `poetry`, and `uv` with one built-in module system and Minimal Version Selection (MVS).',
    realApp: 'Pinning exact library versions in CI/CD builds and using `replace` directives when testing a local shared library.',
    mistake:
      'Forgetting to commit `go.sum` to Git, or forgetting the `/v2` path suffix when importing major version 2+ Go modules.',
    quiz: [
      {
        type: 'CLI',
        q: 'Which command adds missing imports to `go.mod` and cleans up unused dependencies?',
        opts: ['go mod clean', 'go mod tidy', 'go get --prune'],
        ans: 1,
        why: '`go mod tidy` synchronizes go.mod and go.sum with the actual imports in your source code.',
      },
      {
        type: 'Security',
        q: 'What is the purpose of `go.sum`?',
        opts: [
          'Stores compiled binaries',
          'Stores cryptographic hashes to verify downloaded module integrity',
          'Lists environment variables',
        ],
        ans: 1,
        why: 'go.sum guarantees every developer and CI server downloads the exact verified dependency bytes.',
      },
      {
        type: 'SemVer',
        q: 'In Go Modules, how are major versions v2 and above indicated in import paths?',
        opts: [
          'With a `/v2` suffix like `github.com/org/pkg/v2`',
          'With `@2` at the end',
          'Go ignores major versions',
        ],
        ans: 0,
        why: 'Semantic Import Versioning includes `/v2`, `/v3` in the module path so v1 and v2 can coexist safely.',
      },
      {
        type: 'Local Dev',
        q: 'Which `go.mod` directive lets you temporarily point a dependency to a local folder?',
        opts: ['link', 'replace', 'alias'],
        ans: 1,
        why: '`replace example.com/lib => ../local-lib` redirects imports locally (or use `go.work` workspaces).',
      },
    ],
  },
  17: {
    summary:
      'Goroutines are lightweight concurrent functions managed by the Go runtime scheduler (starting at ~2KB stack). Understand concurrency vs parallelism, main goroutine exit, leaks, and race conditions.',
    mentalModel:
      'OS threads are heavy delivery trucks (MBs of RAM each). Goroutines are nimble electric scooters multiplexed across all your CPU cores by Go’s smart dispatcher.',
    lab: 'concurrency',
    goCode: `package main

import (
\t"fmt"
\t"sync"
)

func main() {
\tvar wg sync.WaitGroup
\tfor i := 1; i <= 3; i++ {
\t\twg.Add(1)
\t\tgo func(id int) {
\t\t\tdefer wg.Done()
\t\t\tfmt.Printf("Worker #%d finished\\n", id)
\t\t}(i)
\t}
\twg.Wait() // Wait so main() doesn't exit early!
}`,
    goOut: `Worker #2 finished
Worker #1 finished
Worker #3 finished
(Order varies because goroutines run concurrently!)`,
    lines: [
      ['go func(id int)', 'Spawns a new goroutine in microseconds with tiny memory overhead.'],
      ['Main goroutine', 'If `main()` returns, the entire process terminates immediately—killing unfinished goroutines!'],
      ['Goroutine leaks', 'A goroutine blocked forever on a channel that nobody closes leaks memory for the life of the server.'],
    ],
    jsBridge:
      'Node.js runs JS on a single-threaded event loop (CPU work blocks everyone). Go schedules thousands of goroutines across ALL CPU cores simultaneously.',
    pyBridge:
      'Python threads face the GIL for CPU work, and `asyncio` requires viral `async`/`await` coloring. Go goroutines use normal synchronous-looking code with true multi-core parallelism.',
    realApp: 'Handling 100,000 simultaneous WebSocket connections or fetching 5 downstream microservices in parallel.',
    mistake:
      'Forgetting to synchronize before `main()` exits, or spawning unbounded goroutines per request without a limit/cancellation context.',
    quiz: [
      {
        type: 'Lifecycle',
        q: 'What happens if `main()` finishes while background goroutines are still running?',
        opts: [
          'Go waits automatically until all goroutines finish',
          'The program exits immediately and kills remaining goroutines',
          'Go throws a deadlock panic',
        ],
        ans: 1,
        why: 'The main goroutine owns the process lifetime; use WaitGroup or channels to wait cleanly.',
      },
      {
        type: 'Concepts',
        q: 'What is the difference between Concurrency and Parallelism?',
        opts: [
          'They mean the exact same thing',
          'Concurrency is structuring independent tasks; Parallelism is executing multiple tasks at the exact same instant on multiple CPU cores',
          'Parallelism only works in JavaScript',
        ],
        ans: 1,
        why: 'As Rob Pike taught: concurrency is about structure, parallelism is about simultaneous execution.',
      },
      {
        type: 'Leaks',
        q: 'What causes a Goroutine Leak?',
        opts: [
          'Calling fmt.Println in a goroutine',
          'A goroutine blocked forever waiting on a channel or lock that will never unblock',
          'Using WaitGroup',
        ],
        ans: 1,
        why: 'The garbage collector cannot free a goroutine that is still blocked—always design a clear exit path (like context cancellation).',
      },
      {
        type: 'Scale',
        q: 'Roughly how much initial stack memory does a new goroutine take?',
        opts: ['~2 KB (grows dynamically)', '~8 MB fixed like an OS thread', '512 MB'],
        ans: 0,
        why: 'Tiny growable stacks let a single Go server run hundreds of thousands of goroutines.',
      },
    ],
  },
  18: {
    summary:
      'Channels (`chan T`) are typed pipes for safely passing data between goroutines. Master unbuffered handshakes, buffered queues, blocking rules, closing ownership, `range`, and directional signatures.',
    mentalModel:
      'An unbuffered channel is a relay baton handoff (sender waits until receiver grabs it). A buffered channel `make(chan int, 5)` is a 5-slot kitchen order counter.',
    lab: 'concurrency',
    goCode: `package main

import "fmt"

func produce(out chan<- int) { // Send-only channel!
\tfor i := 1; i <= 3; i++ { out <- i }
\tclose(out) // Only the SENDER closes the channel
}

func main() {
\tch := make(chan int, 3) // Buffered channel (cap 3)
\tgo produce(ch)
\tfor v := range ch {     // Reads until closed & drained
\t\tfmt.Print(v, " ")
\t}
}`,
    goOut: `1 2 3 `,
    lines: [
      ['chan<- int / <-chan int', 'Directional channel parameters prevent accidental sends or closes by receivers!'],
      ['close(out)', 'Signals "no more values coming" so `for range ch` terminates cleanly.'],
      ['Blocking rules', 'Sending to a full channel or receiving from an empty channel pauses the goroutine safely.'],
    ],
    jsBridge:
      'JS has no native typed CSP channel primitive (MessageChannel is niche). Go channels combine synchronization AND data transfer in one built-in construct.',
    pyBridge:
      'Closest to Python’s `queue.Queue` or `asyncio.Queue`, but integrated directly into Go’s syntax (`<-`) and scheduler.',
    realApp: 'Connecting HTTP request producers to worker pools, streaming SSE tokens, and coordinating graceful shutdown signals.',
    mistake:
      'Sending on a closed channel (panics!), closing a channel twice (panics!), or closing a channel from the receiver side.',
    quiz: [
      {
        type: 'Ownership',
        q: 'Who should close a Go channel?',
        opts: ['The receiver', 'The sender (never the receiver)', 'Both sender and receiver'],
        ans: 1,
        why: 'Only the sender knows when no more values will be sent; sending to a closed channel panics.',
      },
      {
        type: 'Blocking',
        q: 'What happens when a goroutine sends on an UNBUFFERED channel with no receiver ready?',
        opts: ['The value is dropped', 'The sender blocks until a receiver reads it', 'It panics immediately'],
        ans: 1,
        why: 'Unbuffered channels synchronize sender and receiver like a direct handoff.',
      },
      {
        type: 'Nil Channel',
        q: 'What happens if you send to or receive from a `nil` channel?',
        opts: [
          'Returns zero value immediately',
          'Blocks forever (useful inside `select` to disable a case!)',
          'Panics',
        ],
        ans: 1,
        why: 'Operations on a nil channel block forever—a clever trick in `select` loops.',
      },
      {
        type: 'Direction',
        q: 'What does parameter `jobs <-chan int` allow a function to do?',
        opts: ['Receive ints only (cannot send or close)', 'Send ints only', 'Both send and receive'],
        ans: 0,
        why: 'The arrow points OUT of `chan`, meaning receive-only.',
      },
    ],
  },
  19: {
    summary:
      'When multiple goroutines share state, protect it with `sync.WaitGroup`, `sync.Mutex`, `sync.RWMutex`, `sync.Once`, `sync/atomic`, and ALWAYS verify with Go’s built-in `-race` detector.',
    mentalModel:
      'A `sync.Mutex` is a single-occupant bathroom key: only one goroutine holds the key to edit the shared counter at a time, and `defer mu.Unlock()` guarantees the key is always returned.',
    lab: 'concurrency',
    goCode: `package main

import (
\t"fmt"
\t"sync"
)

type SafeCounter struct {
\tmu sync.Mutex
\tn  int
}

func (c *SafeCounter) Inc() {
\tc.mu.Lock()
\tdefer c.mu.Unlock()
\tc.n++
}

func main() {
\tvar wg sync.WaitGroup
\tc := &SafeCounter{}
\tfor i := 0; i < 1000; i++ {
\t\twg.Add(1)
\t\tgo func() { defer wg.Done(); c.Inc() }()
\t}
\twg.Wait()
\tfmt.Println("Exact count:", c.n)
}`,
    goOut: `Exact count: 1000`,
    lines: [
      ['c.mu.Lock() + defer c.mu.Unlock()', 'Guarantees mutual exclusion even if an early return happens.'],
      ['sync.RWMutex', 'Allows many simultaneous readers while giving writers exclusive access—great for caches!'],
      ['go test -race ./...', 'Go’s built-in race detector catches hidden data races automatically during tests.'],
    ],
    jsBridge:
      'JS’s single thread avoids low-level memory races (except SharedArrayBuffer), though async logic races still happen. Go runs across real CPU cores, so shared mutable memory MUST be synchronized.',
    pyBridge:
      'Similar to Python’s `threading.Lock`, `RLock`, and `Event`, but Go adds lock-free `sync/atomic` types and a world-class compiler `-race` detector.',
    realApp:
      'Thread-safe in-memory caches (`RWMutex`), lazy singleton initialization (`sync.Once`), and high-throughput request counters (`atomic.Int64`).',
    mistake:
      'Copying a struct containing a `sync.Mutex` by value (breaks locking—always pass pointer receivers!) or forgetting to run `go test -race`.',
    quiz: [
      {
        type: 'Tooling',
        q: 'Which command detects concurrent data races in your Go tests?',
        opts: ['go vet -sync', 'go test -race ./...', 'go run -lock'],
        ans: 1,
        why: 'The `-race` flag instruments memory accesses to catch unsynchronized concurrent reads/writes.',
      },
      {
        type: 'Performance',
        q: 'When is `sync.RWMutex` better than `sync.Mutex`?',
        opts: [
          'When writes happen 99% of the time',
          'When reads vastly outnumber writes (e.g., an in-memory config cache)',
          'When you never unlock',
        ],
        ans: 1,
        why: 'RWMutex lets multiple readers proceed in parallel while still blocking writers safely.',
      },
      {
        type: 'Singleton',
        q: 'Which `sync` primitive guarantees an initialization function runs exactly ONCE across all goroutines?',
        opts: ['sync.Once', 'sync.WaitGroup', 'sync.Cond'],
        ans: 0,
        why: 'sync.Once is thread-safe and runs its callback only on the very first invocation.',
      },
      {
        type: 'Bug Hunt',
        q: 'Why must a `sync.WaitGroup` be passed by pointer (`*sync.WaitGroup`) to goroutine functions?',
        opts: [
          'WaitGroup is too big',
          'Passing by value copies the internal counter, causing wg.Done() to update the wrong copy (deadlock!)',
          'Go forbids struct parameters',
        ],
        ans: 1,
        why: 'Copying a WaitGroup breaks synchronization; always pass `&wg`.',
      },
    ],
  },
  20: {
    summary:
      'The `select` statement lets a goroutine wait on multiple channel operations simultaneously—enabling clean timeouts, non-blocking polling via `default`, and cancellation listeners.',
    mentalModel:
      '`select` is like watching three kitchen bells at once and immediately serving whichever bell rings first—or leaving if your timer bell rings!',
    lab: 'concurrency',
    goCode: `package main

import (
\t"fmt"
\t"time"
)

func main() {
\tapiCh := make(chan string, 1)
\tgo func() {
\t\ttime.Sleep(120 * time.Millisecond)
\t\tapiCh <- "OK"
\t}()

\tselect {
\tcase res := <-apiCh:
\t\tfmt.Println("Got:", res)
\tcase <-time.After(50 * time.Millisecond):
\t\tfmt.Println("Timed out!")
\t}
}`,
    goOut: `Timed out!`,
    lines: [
      ['select { case ... }', 'Blocks until one channel case is ready; if multiple are ready, Go chooses pseudo-randomly.'],
      ['time.After(...)', 'Returns a channel that fires after a duration (in tight loops, prefer `time.NewTimer` + `Stop()`).'],
      ['default:', 'Makes `select` non-blocking—runs immediately if no channel is ready.'],
    ],
    jsBridge:
      'Works like `Promise.race([fetchData(), timeout()])` in JavaScript, except `select` can also wait on channel SENDS, non-blocking checks, and cancellation signals.',
    pyBridge:
      'Comparable to `asyncio.wait(..., return_when=FIRST_COMPLETED)` or OS `select.select`, built directly into Go’s core language syntax.',
    realApp: 'Cancelling slow database or LLM calls cleanly and draining channels during graceful server shutdown.',
    mistake:
      'Calling `time.After()` inside an infinite high-frequency `for { select {} }` loop (before Go 1.23 this leaked timers; using `time.NewTimer` with `defer t.Stop()` is clean and explicit).',
    quiz: [
      {
        type: 'Behavior',
        q: 'What does `select` do if TWO cases are ready at the exact same moment?',
        opts: ['Always picks the top case', 'Picks one pseudo-randomly to ensure fairness', 'Runs both cases'],
        ans: 1,
        why: 'Random choice prevents starving lower cases in loops.',
      },
      {
        type: 'Non-Blocking',
        q: 'How do you make a `select` statement non-blocking?',
        opts: ['Add a `default:` case', 'Add `break` at the top', 'Use `go select`'],
        ans: 0,
        why: 'If no channel case is ready, `default` executes immediately instead of blocking.',
      },
      {
        type: 'Cancellation',
        q: 'Which channel is typically listened to inside a worker’s `select` for clean shutdown?',
        opts: ['<-ctx.Done()', '<-os.Exit', '<-fmt.EOF'],
        ans: 0,
        why: '`ctx.Done()` closes when a request is cancelled or times out, unblocking all listening workers.',
      },
      {
        type: 'Deadlock',
        q: 'What happens if you execute an empty `select {}` in a single goroutine?',
        opts: ['Exits immediately', 'Blocks forever (deadlock if no other goroutines can run)', 'Loops 10 times'],
        ans: 1,
        why: 'Empty `select {}` blocks indefinitely.',
      },
    ],
  },
  21: {
    summary:
      'The `context` package carries deadlines, cancellation signals, and request-scoped metadata across API boundaries and goroutines so abandoned work stops immediately.',
    mentalModel:
      'Pass `ctx` as Argument #1 like an emergency walkie-talkie: if the user closes their browser tab or 3 seconds expire, Go shouts "ABORT!" straight down to PostgreSQL and your worker goroutines.',
    lab: 'http-db',
    goCode: `package main

import (
\t"context"
\t"fmt"
\t"time"
)

func fetchSlow(ctx context.Context) error {
\tselect {
\tcase <-time.After(2 * time.Second):
\t\treturn nil
\tcase <-ctx.Done():
\t\treturn ctx.Err() // context.DeadlineExceeded
\t}
}

func main() {
\tctx, cancel := context.WithTimeout(context.Background(), 50*time.Millisecond)
\tdefer cancel() // Mandatory to release timer resources!
\tfmt.Println("Result:", fetchSlow(ctx))
}`,
    goOut: `Result: context deadline exceeded`,
    lines: [
      ['context.WithTimeout', 'Derives a child context that auto-cancels after 50ms (or earlier if parent cancels).'],
      ['defer cancel()', 'Always call cancel() even if work finishes early so timers are cleaned up immediately.'],
      ['ctx as first arg', 'Go convention: pass `ctx context.Context` as parameter #1—never store it inside a struct!'],
    ],
    jsBridge:
      'Directly analogous to JavaScript’s `AbortController` / `AbortSignal` passed into `fetch(url, { signal })`, but standardized across the entire Go standard library and ecosystem.',
    pyBridge:
      'Combines Python’s `asyncio.wait_for` timeout cancellation with `contextvars` for request-scoped tracing IDs.',
    realApp:
      'Propagating HTTP client disconnects (`r.Context()`) directly into SQL queries (`db.QueryContext`), Redis calls, and LLM requests.',
    mistake:
      'Storing `context.Context` inside a struct, using `context.WithValue` for optional function parameters, or forgetting `defer cancel()`.',
    quiz: [
      {
        type: 'Rule',
        q: 'Why MUST you write `defer cancel()` right after `ctx, cancel := context.WithTimeout(...)`?',
        opts: [
          'Otherwise the function won’t compile',
          'To immediately release internal timer resources and avoid leaks if work finishes early',
          'To restart the timer',
        ],
        ans: 1,
        why: 'Calling cancel() frees resources promptly once the operation completes.',
      },
      {
        type: 'Convention',
        q: 'Where should `context.Context` be passed in a Go function signature?',
        opts: [
          'Stored in a struct field',
          'As the very first parameter: `func Do(ctx context.Context, ...)`',
          'As a global variable',
        ],
        ans: 1,
        why: 'Passing ctx explicitly as parameter #1 makes cancellation flow obvious across call stacks.',
      },
      {
        type: 'Values',
        q: 'What is `context.WithValue` intended for?',
        opts: [
          'Passing database connections and config structs',
          'Request-scoped cross-cutting metadata like request IDs or auth user IDs',
          'Replacing all function arguments',
        ],
        ans: 1,
        why: 'Use typed keys and reserve WithValue strictly for request-scoped metadata, not dependency injection.',
      },
      {
        type: 'Root Context',
        q: 'When should you use `context.Background()` vs `context.TODO()`?',
        opts: [
          'Background() at top-level entry points (main/tests); TODO() temporarily while refactoring code that lacks a ctx yet',
          'They behave completely differently at runtime',
          'Always use nil instead',
        ],
        ans: 0,
        why: 'Both return an empty non-nil context, but TODO() signals to static analyzers and teammates that a real context should be wired in later.',
      },
    ],
  },
  22: {
    summary:
      'Combine goroutines, channels, and contexts into production concurrency architectures: Worker Pools, Pipelines, Fan-Out/Fan-In, Semaphores, Rate Limiters, Backpressure, and Graceful Shutdown.',
    mentalModel:
      'A Worker Pool is a busy restaurant with 5 fixed chefs pulling orders off a bounded ticket counter—even if 10,000 customers arrive, memory stays flat and the kitchen never crashes!',
    lab: 'concurrency',
    goCode: `package main

import (
\t"fmt"
\t"sync"
)

func main() {
\tjobs := make(chan int, 5)
\tvar wg sync.WaitGroup
\tfor w := 1; w <= 2; w++ {
\t\twg.Add(1)
\t\tgo func(id int) {
\t\t\tdefer wg.Done()
\t\t\tfor j := range jobs {
\t\t\t\tfmt.Printf("Worker %d processed job %d\\n", id, j)
\t\t\t}
\t\t}(w)
\t}
\tfor j := 1; j <= 4; j++ { jobs <- j }
\tclose(jobs)
\twg.Wait()
}`,
    goOut: `Worker 1 processed job 1
Worker 2 processed job 2
Worker 1 processed job 3
Worker 2 processed job 4`,
    lines: [
      ['Bounded concurrency', 'A buffered semaphore channel `sem := make(chan struct{}, 10)` caps max parallel calls cleanly.'],
      ['Fan-Out / Fan-In', 'Split heavy jobs across N workers (Fan-Out) and merge results into one output channel (Fan-In).'],
      ['Backpressure', 'A full bounded channel naturally slows down producers instead of blowing up RAM (OOM).'],
    ],
    jsBridge: 'Replaces third-party `p-limit` or worker-thread queues in Node.js with ~15 lines of standard-library Go.',
    pyBridge:
      'Replaces `concurrent.futures.ThreadPoolExecutor` / `asyncio.Semaphore` with far lower per-worker overhead and true multi-core execution.',
    realApp:
      'Image thumbnail pipelines, concurrent web crawlers, embedding batchers for RAG ingestion, and rate-limited API callers (`golang.org/x/time/rate`).',
    mistake:
      'Spawning 50,000 unbounded goroutines in a loop and exhausting database connections or file descriptors.',
    quiz: [
      {
        type: 'Pattern',
        q: 'How can a buffered channel `sem := make(chan struct{}, 5)` act as a Semaphore?',
        opts: [
          'Send `sem <- struct{}{}` before work and `<-sem` in defer to allow at most 5 concurrent tasks',
          'Close it 5 times',
          'Use it as a mutex',
        ],
        ans: 0,
        why: 'When 5 tokens fill the buffer, the 6th goroutine waits until one finishes and releases a slot.',
      },
      {
        type: 'Backpressure',
        q: 'Why is a bounded buffered channel safer than an unbounded queue in a high-traffic server?',
        opts: [
          'Bounded channels apply backpressure so producers slow down instead of crashing with Out-Of-Memory',
          'Unbounded channels are built into Go',
          'Bounded channels skip errors',
        ],
        ans: 0,
        why: 'Backpressure protects system stability under traffic spikes.',
      },
      {
        type: 'Fan-In',
        q: 'What does the Fan-In pattern do?',
        opts: [
          'Splits one channel into ten',
          'Merges outputs from multiple concurrent worker channels into a single channel',
          'Rate-limits HTTP requests',
        ],
        ans: 1,
        why: 'Fan-Out distributes work across workers; Fan-In collects their results back into one stream.',
      },
      {
        type: 'Shutdown',
        q: 'How do workers know there are no more jobs coming in a `for job := range jobs` worker pool?',
        opts: ['When the producer calls `close(jobs)`', 'After 10 seconds automatically', 'When the channel is empty'],
        ans: 0,
        why: 'Closing `jobs` lets workers finish buffered items and then exit the `range` loop gracefully.',
      },
    ],
  },
  23: {
    summary:
      'Read, write, append, stream, and inspect files and directories safely using `os`, `io`, `bufio`, and `path/filepath`—without loading 5GB files into RAM.',
    mentalModel:
      '`os.ReadFile` gulps a whole glass of water at once (great for tiny configs). `bufio.Scanner` and `io.Copy` sip through a straw—handling 10GB log files in kilobytes of RAM.',
    lab: 'http-db',
    goCode: `package main

import (
\t"bufio"
\t"fmt"
\t"strings"
)

func main() {
\t// Streaming lines with bufio.Scanner (same API works on *os.File!)
\tsrc := strings.NewReader("line1: OK\\nline2: WARN\\nline3: OK")
\tsc := bufio.NewScanner(src)
\tfor n := 1; sc.Scan(); n++ {
\t\tfmt.Printf("%d -> %s\\n", n, sc.Text())
\t}
\tif err := sc.Err(); err != nil { fmt.Println("scan err:", err) }
}`,
    goOut: `1 -> line1: OK
2 -> line2: WARN
3 -> line3: OK`,
    lines: [
      ['os.ReadFile / os.WriteFile', 'One-liner helpers for small files; use permission `0644` for regular files and `0600` for secrets.'],
      ['os.OpenFile + os.O_APPEND', 'Opens files for appending; ALWAYS pair with `defer f.Close()` right after checking `err != nil`.'],
      ['filepath.WalkDir', 'Recursively traverses directories efficiently using OS-neutral path separators.'],
    ],
    jsBridge:
      'Replaces Node’s `fs.promises.readFile` and `fs.createReadStream`, unified around Go’s simple `io.Reader` and `io.Writer` interfaces.',
    pyBridge:
      'Replaces Python’s `with open("f.txt", "a") as f:` and `pathlib.Path.rglob()`. Because `bufio.Scanner` accepts any `io.Reader`, testing file code with `strings.NewReader` needs zero fake disk files!',
    realApp: 'Streaming CSV uploads, rotating log analyzers, and parsing huge JSONL datasets for RAG document ingestion.',
    mistake:
      'Using `os.ReadFile` on gigabyte files (causes OOM) or forgetting to check `scanner.Err()` after a `bufio.Scanner` loop.',
    quiz: [
      {
        type: 'Large Files',
        q: 'Why should you use `bufio.Scanner` or `io.Copy` instead of `os.ReadFile` for a 4GB log file?',
        opts: [
          'os.ReadFile only reads JSON',
          'os.ReadFile loads the entire file into RAM at once, whereas streaming reads small chunks',
          'bufio is deprecated',
        ],
        ans: 1,
        why: 'Streaming keeps RAM constant regardless of file size.',
      },
      {
        type: 'Permissions',
        q: 'What Unix file permission mode restricts a secret config file to read/write by the owner only?',
        opts: ['0777', '0600', '0644'],
        ans: 1,
        why: '0600 grants rw------- (owner read+write, nobody else).',
      },
      {
        type: 'Cleanup',
        q: 'Right after `f, err := os.Open("data.txt")` succeeds (`err == nil`), what should you write?',
        opts: ['defer f.Close()', 'go f.Close()', 'delete(f)'],
        ans: 0,
        why: 'Deferring Close() ensures you never leak OS file descriptors on early returns.',
      },
      {
        type: 'Directories',
        q: 'Which standard function efficiently walks a directory tree in modern Go?',
        opts: ['filepath.WalkDir', 'os.ListAll', 'fs.ScanTree'],
        ans: 0,
        why: 'filepath.WalkDir avoids unnecessary stat syscalls on every entry compared to older filepath.Walk.',
      },
    ],
  },
  24: {
    summary:
      'Convert Go structs to and from JSON using `encoding/json`, struct tags (`omitempty`, `-`), `json.NewDecoder` streaming, `DisallowUnknownFields()`, and custom `Marshaler`/`Unmarshaler` hooks.',
    mentalModel:
      '`json.Marshal` packs a Go struct suitcase into a JSON string; `json.Unmarshal` unpacks JSON bytes into a struct pointer (`&dst`) so Go can fill your real fields.',
    lab: 'http-db',
    goCode: `package main

import (
\t"encoding/json"
\t"fmt"
\t"strings"
)

type Event struct {
\tType string \`json:"type"\`
\tNote string \`json:"note,omitempty"\`
}

func main() {
\tdec := json.NewDecoder(strings.NewReader(\`{"type":"login"}\`))
\tdec.DisallowUnknownFields()
\tvar e Event
\t_ = dec.Decode(&e) // Pass POINTER &e!
\tout, _ := json.Marshal(e)
\tfmt.Println("Decoded:", e.Type, "| Re-encoded:", string(out))
}`,
    goOut: `Decoded: login | Re-encoded: {"type":"login"}`,
    lines: [
      ['dec.Decode(&e)', 'Always pass a pointer `&e` to Unmarshal/Decode so Go can write into your struct!'],
      ['DisallowUnknownFields()', 'Rejects unexpected typo keys in API request bodies instead of silently ignoring them.'],
      ['Custom MarshalJSON()', 'Implement `MarshalJSON() ([]byte, error)` when custom date formats or enums need special JSON output.'],
    ],
    jsBridge:
      'JS `JSON.parse` produces untyped dynamic objects; Go `json.Unmarshal` validates structure directly into strongly typed structs.',
    pyBridge:
      'Similar to Python’s `pydantic` models rather than raw `json.loads` dicts, built directly into Go’s standard library.',
    realApp: 'Decoding HTTP request bodies (`r.Body`), formatting structured API responses, and parsing strict LLM structured JSON outputs.',
    mistake:
      'Passing a value instead of a pointer to `json.Unmarshal(data, u)` (returns error!) or leaving struct fields lowercase.',
    quiz: [
      {
        type: 'Find Bug',
        q: 'Why does `json.Unmarshal(raw, user)` fail when `user` is a `User` struct value?',
        opts: [
          'Must pass a pointer `&user` so Unmarshal can populate its fields',
          'Unmarshal only works on maps',
          'JSON requires XML tags',
        ],
        ans: 0,
        why: 'Passing by value gives Unmarshal a copy; it requires a pointer `&user` to modify your variable.',
      },
      {
        type: 'Streaming',
        q: 'When decoding an HTTP `r.Body` stream, which `encoding/json` tool avoids reading everything into a `[]byte` first?',
        opts: ['json.NewDecoder(r.Body).Decode(&dst)', 'json.ReadAll', 'json.StreamBytes'],
        ans: 0,
        why: 'json.NewDecoder reads directly from any `io.Reader` like `r.Body` or a file.',
      },
      {
        type: 'Strictness',
        q: 'How can a Go API reject JSON payloads containing unexpected extra fields?',
        opts: ['dec.DisallowUnknownFields()', 'json.Strict(true)', 'struct tag `json:"strict"`'],
        ans: 0,
        why: 'Calling DisallowUnknownFields() on a json.Decoder returns an error if unknown keys appear.',
      },
      {
        type: 'Tags',
        q: 'What does `json:"bio,omitempty"` do when `Bio == ""`?',
        opts: [
          'Encodes `"bio": null`',
          'Omits the `"bio"` key completely from the JSON output',
          'Panics',
        ],
        ans: 1,
        why: '`omitempty` leaves out empty/zero values during JSON encoding.',
      },
    ],
  },
  25: {
    summary:
      'Understand how bytes actually travel over the internet: IP addresses, ports, DNS resolution, network sockets, reliable TCP vs fast UDP, TLS encryption, and the client-server request lifecycle.',
    mentalModel:
      'An IP address is a building’s street address, a Port (`:8080`, `:443`) is the apartment number inside, TCP is registered mail with delivery receipts, and UDP is tossing postcards fast without receipts.',
    lab: 'http-db',
    goCode: `package main

import (
\t"fmt"
\t"net"
)

func main() {
\thost, port, _ := net.SplitHostPort("127.0.0.1:8080")
\tip := net.ParseIP(host)
\tfmt.Printf("Host=%s Port=%s Loopback=%v\\n", ip, port, ip.IsLoopback())
\t// Real TCP server: ln, err := net.Listen("tcp", ":9000")
}`,
    goOut: `Host=127.0.0.1 Port=8080 Loopback=true`,
    lines: [
      ['net.Listen("tcp", ":9000")', 'Opens a TCP socket listening for client connections—each accepted `net.Conn` is an `io.ReadWriteCloser`!'],
      ['TCP vs UDP', 'TCP guarantees ordered, reliable delivery (HTTP, Postgres, gRPC); UDP skips handshakes for low latency (DNS, video calls, QUIC/HTTP3).'],
      ['TLS / HTTPS', 'Encrypts TCP sockets with certificates so eavesdroppers cannot read passwords or JWTs.'],
    ],
    jsBridge:
      'Node’s `net` and `tls` modules use callback/EventEmitter streams. Go’s `net.Conn` lets you spawn one lightweight goroutine per connection with simple blocking `Read`/`Write` code.',
    pyBridge:
      'Python’s `socket` module requires `asyncio` or thread pools to scale. Go’s netpoller automatically uses OS epoll/kqueue under the hood while letting you write clean synchronous code.',
    realApp:
      'Building custom Redis/Postgres wire proxies, chat servers, load balancers, and understanding why port binding or DNS timeouts fail in production.',
    mistake:
      'Binding to `localhost:8080` inside a Docker container instead of `:8080` (`0.0.0.0:8080`), making the container unreachable from outside!',
    quiz: [
      {
        type: 'Protocols',
        q: 'Why do HTTP/1.1, HTTP/2, and PostgreSQL run over TCP instead of plain UDP?',
        opts: ['TCP guarantees ordered, reliable, lossless byte delivery', 'UDP cannot carry text', 'TCP does not use IP addresses'],
        ans: 0,
        why: 'TCP handles handshakes, packet ordering, and automatic retransmission of lost packets.',
      },
      {
        type: 'DNS',
        q: 'What does DNS do before your browser or Go HTTP client opens a TCP connection to `taqui.in`?',
        opts: ['Encrypts the JSON body', 'Translates the domain name into an IP address', 'Compresses images'],
        ans: 1,
        why: 'DNS is the internet’s phonebook mapping human domain names to routable IP addresses.',
      },
      {
        type: 'Ports',
        q: 'What is the standard default port for HTTPS (HTTP over TLS)?',
        opts: ['80', '443', '5432'],
        ans: 1,
        why: 'HTTP defaults to port 80, HTTPS to 443, and PostgreSQL to 5432.',
      },
      {
        type: 'Docker Tip',
        q: 'Why might a Go server listening on `127.0.0.1:8080` inside Docker fail to accept traffic from your host machine?',
        opts: [
          '127.0.0.1 only accepts loopback traffic inside that container; bind `:8080` instead',
          'Go does not support port 8080',
          'TCP is disabled in Docker',
        ],
        ans: 0,
        why: 'Listening on `:8080` binds all interfaces (`0.0.0.0`) so port forwarding works.',
      },
    ],
  },
  26: {
    summary:
      'Build fast, single-binary CLI tools using `os.Args`, the standard `flag` package, environment variables (`os.Getenv`), stdin/stdout piping, config files, and Unix exit codes.',
    mentalModel:
      'A great CLI tool follows Unix etiquette: send real data to `stdout`, send logs/errors to `stderr`, exit `0` on success, and exit non-zero (`1`) when something fails so shell scripts know.',
    lab: 'http-db',
    goCode: `package main

import (
\t"flag"
\t"fmt"
\t"os"
)

func main() {
\tname := flag.String("name", "learner", "user name")
\tport := flag.Int("port", 8080, "server port")
\tflag.Parse()
\tenv := os.Getenv("APP_ENV")
\tif env == "" { env = "dev" }
\tfmt.Printf("CLI ready: name=%s port=%d env=%s\\n", *name, *port, env)
}`,
    goOut: `CLI ready: name=learner port=8080 env=dev`,
    lines: [
      ['flag.String(...)', 'Returns a pointer `*string`; remember to call `flag.Parse()` before reading `*name`!'],
      ['os.Stdout vs os.Stderr', 'Print output to stdout (`fmt.Println`) and diagnostics/errors to `os.Stderr` so piping works!'],
      ['os.Exit(1)', 'Terminates immediately with failure exit code (note: deferred functions do NOT run on `os.Exit`!).'],
    ],
    jsBridge:
      'Unlike Node CLIs that require Node installed and take 100ms+ to boot, a Go CLI compiles into one tiny binary that starts in ~2ms—why tools like `gh`, `hugo`, and `terraform` choose Go.',
    pyBridge:
      'Replaces Python’s `argparse` / `click` with built-in `flag` (or `cobra` for complex subcommands) and zero Python version/venv distribution headaches.',
    realApp: 'Database migration runners, internal DevOps automation CLIs, and local code generators.',
    mistake:
      'Calling `os.Exit(1)` inside a function with `defer cleanup()`—`os.Exit` skips defers! Return an `error` from `run()` and call `os.Exit(1)` only once at the end of `main()`.',
    quiz: [
      {
        type: 'Trap',
        q: 'Do `defer` statements execute when `os.Exit(1)` is called?',
        opts: ['Yes, always', 'No, os.Exit terminates the process immediately without running defers', 'Only in main()'],
        ans: 1,
        why: 'Put main logic in a `run() error` helper so all defers run cleanly before `os.Exit(1)`.',
      },
      {
        type: 'Standard Streams',
        q: 'Where should a well-behaved CLI write error messages so shell pipes (`mycli | jq`) do not break?',
        opts: ['os.Stdout', 'os.Stderr', 'os.Stdin'],
        ans: 1,
        why: 'Sending errors to stderr keeps stdout clean for machine-readable piped output.',
      },
      {
        type: 'Flags',
        q: 'What does `port := flag.Int("port", 8080, "http port")` return?',
        opts: ['An int value', 'A pointer `*int` populated after `flag.Parse()`', 'A string'],
        ans: 1,
        why: 'flag helpers return pointers; dereference `*port` after calling `flag.Parse()`.',
      },
      {
        type: 'Exit Codes',
        q: 'What exit status code indicates success in Unix/Linux shells and CI pipelines?',
        opts: ['0', '1', '200'],
        ans: 0,
        why: '0 means success; any non-zero value (typically 1 or 2) indicates failure.',
      },
    ],
  },
  27: {
    summary:
      'Solidify core HTTP protocol concepts before writing servers: methods (GET/POST/PUT/PATCH/DELETE), status families (2xx/3xx/4xx/5xx), headers, bodies, cookies, sessions, REST, middleware, and CORS.',
    mentalModel:
      'An HTTP request is a structured envelope: Method + URL on the front (action + target), Headers as stamps (`Authorization`, `Content-Type`), and the Body as the letter inside.',
    lab: 'http-db',
    goCode: `// HTTP Request & Response Wire Anatomy (Conceptual Example)
// ---> Client Request:
// POST /api/v1/tasks HTTP/1.1
// Host: api.taqui.in
// Content-Type: application/json
// Authorization: Bearer eyJhbGc...
//
// {"title":"Learn Go HTTP"}
//
// <--- Server Response:
// HTTP/1.1 201 Created
// Content-Type: application/json
// {"id":42,"title":"Learn Go HTTP"}`,
    goOut: `201 Created — Resource stored with id=42`,
    lines: [
      ['Idempotency', 'GET, PUT, and DELETE should be safe to repeat without creating duplicates; POST is non-idempotent.'],
      ['Status Codes', '200 OK, 201 Created, 204 No Content, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 429 Too Many Requests, 500 Server Error.'],
      ['CORS', 'A browser security check—servers send `Access-Control-Allow-Origin` headers to allow approved frontend origins.'],
    ],
    jsBridge:
      'Frontend JS developers call these via `fetch()`; now you sit on the server side setting headers, reading cookies, and returning exact status codes.',
    pyBridge:
      'Same HTTP fundamentals behind FastAPI/Django—HTTP is language-agnostic, so mastering it makes you stronger in every backend stack.',
    realApp: 'Designing predictable APIs that browsers, mobile apps, and third-party webhooks integrate with effortlessly.',
    mistake:
      'Confusing `401 Unauthorized` (who are you? not logged in) with `403 Forbidden` (I know who you are, but you lack permission).',
    quiz: [
      {
        type: 'Status Codes',
        q: 'A logged-in regular user tries to access `/admin/delete-all`. Which status code is most accurate?',
        opts: ['401 Unauthorized', '403 Forbidden', '404 Not Found'],
        ans: 1,
        why: '401 means unauthenticated; 403 means authenticated but lacking permission (authorization failed).',
      },
      {
        type: 'CORS',
        q: 'Who enforces CORS (Cross-Origin Resource Sharing) restrictions?',
        opts: ['The web browser (not curl or server-to-server Go clients)', 'The Go compiler', 'TCP routers'],
        ans: 0,
        why: 'CORS is a browser security policy; servers opt in by returning `Access-Control-Allow-*` headers.',
      },
      {
        type: 'Methods',
        q: 'Which HTTP status code is most idiomatic when a `POST /users` request creates a new user?',
        opts: ['200 OK', '201 Created', '302 Found'],
        ans: 1,
        why: '201 Created specifically signals that a new resource was successfully created.',
      },
      {
        type: 'Cookies',
        q: 'Which cookie flag prevents JavaScript (`document.cookie`) from reading a session cookie (mitigating XSS)?',
        opts: ['HttpOnly', 'Public', 'NoScript'],
        ans: 0,
        why: '`HttpOnly` (paired with `Secure` and `SameSite`) protects session cookies from XSS theft.',
      },
    ],
  },
};
