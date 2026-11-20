# 25. Synchronization in Go (`sync` & `atomic`)

When multiple goroutines run concurrently, they often need to coordinate or access shared resources (memory, counters, maps, files). Without proper synchronization, you get **Data Races** and **Corrupted State**.

The standard library **`sync`** and **`sync/atomic`** packages provide essential synchronization primitives.

---

## 🔑 Key Synchronization Tools

### 1. `sync.WaitGroup` (Go's `Promise.all`)

> **💡 Hinglish Analogy:**  
> Main function ko bolta hai: *"Ruko bhai! Jab tak mere sabhi workers apna kaam khatam karke report na kar dein, tab tak program band mat karna!"*

* `wg.Add(n)`: Increases worker counter by `n`.
* `wg.Done()`: Decreases counter by 1 (`defer wg.Done()`).
* `wg.Wait()`: Blocks until counter reaches 0.

> [!IMPORTANT]
> **Always pass `*sync.WaitGroup` as a pointer!** If passed by value, a copy is made and `Wait()` will hang forever in a deadlock.

---

### 2. `sync.Mutex` (The Bathroom Lock)

> **💡 Hinglish Analogy:**  
> Ek time pe sirf **ek hi Goroutine** room (critical section) ke andar ja sakti hai. Darwaza lock karo (`mu.Lock()`), data update karo, aur nikalte waqt lock kholo (`mu.Unlock()`). Baaki sabhi goroutines baahar line me wait karti hain.

```go
type SafeCounter struct {
    mu    sync.Mutex
    count int
}

func (c *SafeCounter) Increment() {
    c.mu.Lock()
    defer c.mu.Unlock() // Ensures unlock even if panic occurs
    c.count++
}
```

---

### 3. `sync.RWMutex` (Read-Write Lock)

When your application is **95%+ reads** and **<5% writes** (e.g. In-memory cache):
* `mu.RLock()` / `mu.RUnlock()`: Multiple readers can read simultaneously without blocking each other.
* `mu.Lock()` / `mu.Unlock()`: Exclusive lock for writers. All readers and other writers block until write finishes.

---

### 4. `sync.Once` (Execute Exactly Once)

Guarantees a piece of code (like database connection pool initialization or config loading) runs **only once**, regardless of how many goroutines call it:

```go
var once sync.Once

func initDatabase() {
    once.Do(func() {
        fmt.Println("Database connection pool initialized! (Runs exactly once)")
    })
}
```

---

### 5. Atomic Operations (`sync/atomic`)

For simple counters, acquiring a Mutex incurs CPU lock overhead.  
**Atomic operations** utilize low-level CPU hardware instructions for lock-free, blazing-fast updates:

```go
import "sync/atomic"

var counter int64

// Lock-free atomic increment
atomic.AddInt64(&counter, 1)

// Lock-free atomic read
val := atomic.LoadInt64(&counter)
```

---

### 6. 🛡️ The Go Race Detector

Go has a built-in compiler tool to detect hidden concurrent data races:

```bash
# Run program with race detection enabled
go run -race ./25_synchronization/main.go

# Run tests with race detection
go test -race ./...
```

If any two goroutines access a shared variable concurrently with at least one writer and no lock, the race detector prints a full stack trace.

---

## 💡 JavaScript vs Go Synchronization

| Concept | JavaScript / Node.js | Go (Golang) |
|---|---|---|
| **Wait for All** | `await Promise.all([p1, p2, p3])` | `sync.WaitGroup` (`Add`, `Done`, `Wait`) |
| **Race Conditions** | Rare on memory (single-threaded loop), but common on DB I/O | Common on shared memory across goroutines |
| **Mutual Exclusion** | Not needed for RAM; distributed locks (Redis) for DB | `sync.Mutex` / `sync.RWMutex` |
| **Singleton Init** | Module caching (`import` runs once) | `sync.Once` |
| **Hardware Atomics** | `Atomics` (SharedArrayBuffer) | `sync/atomic` |

---

## 🚀 How to Run

```bash
go run ./25_synchronization/main.go
```
