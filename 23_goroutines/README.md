# 23. Goroutines in Go

A **Goroutine** is an extremely lightweight, independently executing function managed by the **Go Runtime**, not directly by the Operating System.

While a traditional OS thread takes **1 MB to 8 MB** of memory, a Goroutine begins with just **~2 KB** of stack space. This enables a single Go application to concurrently execute **hundreds of thousands** of goroutines without crashing.

---

## 🔑 Key Concepts

### 1. Concurrency vs Parallelism

> **💡 Hinglish Analogy:**
> * **Concurrency:** *"Ek sath multiple kaamo ko manage/juggle karna."*  
>   Ek akela cook ek gas pe daal chadhata hai, doosri taraf pyaz kaat raha hai, aur beech me chai dekhne jata hai. Task multiple chal rahe hain, par physical resource ek hi banda hai.
> * **Parallelism:** *"Ek sath physical CPU cores par multiple kaamo ko simultaneously execute karna."*  
>   Do ya teen cooks alag-alag stove par ek hi instant par alag-alag dishes bana rahe hain.

* **Concurrency** is about **program structure** (dealing with lots of things at once).
* **Parallelism** is about **hardware execution** (doing lots of things at once across multiple CPU cores).

---

### 2. The `go` Keyword

Prefixing any function call with `go` spawns a new goroutine in the background:

```go
// 1. Synchronous (Blocks main execution until finished)
doWork()

// 2. Asynchronous Goroutine (Main proceeds immediately without waiting!)
go doWork()

// 3. Anonymous Goroutine
go func() {
    fmt.Println("Running in background! 🚀")
}()
```

> [!WARNING]
> **The Main Goroutine Rule:**  
> The `main()` function is the primary goroutine. If `main()` finishes executing, **all background goroutines are instantly terminated**, regardless of whether their tasks were completed. Synchronization mechanisms (like **Channels** or **`sync.WaitGroup`**) ensure the main function waits for workers to complete.

---

### 3. Why `go func()` Prevents Unbuffered Channel Deadlocks

#### The Problem: Deadlock in a Single Goroutine
```go
ch := make(chan int) // Unbuffered (Capacity: 0)
ch <- 10             // ❌ DEADLOCK! Execution halts here.
recv := <-ch         // Line never reached!
```
* An unbuffered channel has **zero storage slots**. It requires a **direct hand-to-hand exchange** (rendezvous).
* The sender (`ch <- 10`) freezes until a receiver is actively ready to receive.
* Because execution is sequential within `main()`, the code freezes on the send operation and can never reach the receive line.

#### The Solution: Spawning a Second Worker
```go
ch := make(chan int)

// Worker B: Runs in the background
go func() {
    ch <- 10 // Pushes 10 into the channel
}()

// Worker A (Main): Waits to receive
recv := <-ch // Handshake complete! Both proceed.
```

#### 🛋️ The 2-Person Sofa Analogy:
Imagine moving a heavy sofa that requires two people to hold opposite ends simultaneously:
* **Without `go`:** You try to hold one end and freeze waiting for someone to take the other end. You cannot walk over to hold the second end because you are already stuck holding the first!
* **With `go`:** You call a colleague (`go func()`). They hold one end (`ch <- 10`), while you hold the other end (`recv := <-ch`). The handshake succeeds immediately!

#### ⏱️ Execution Timeline:

| Time | 👤 Worker A (Main Goroutine) | 👷 Worker B (Spawned Goroutine) |
|---|---|---|
| **T1** | Creates channel `ch` | - |
| **T2** | Sees `go func()`, hands it to scheduler, **does not wait**! | Worker B starts executing in background |
| **T3** | Reaches `recv := <-ch`, pauses and waits for data | Runs `ch <- 10` and sends value |
| **T4** | **Handshake Complete!** Value received, both proceed | Worker B terminates cleanly |

---

### 4. Passing Arguments to Goroutines

When spawning goroutines inside loops, always pass loop variables as **arguments by value** to avoid race conditions:

```go
// ✅ Correct: Each goroutine receives its own distinct copy of 'i'
for i := 1; i <= 3; i++ {
    go func(taskID int) {
        fmt.Println("Processing task:", taskID)
    }(i)
}
```

---

## 💡 JavaScript vs Go Concurrency Comparison

| Concept | JavaScript / Node.js | Go (Golang) |
|---|---|---|
| **Model** | Single-threaded Event Loop + Non-blocking I/O | Multi-threaded M:N Scheduler (Goroutines over OS threads) |
| **Spawning Task** | `Promise`, `async/await`, `setTimeout` | `go myFunction()` |
| **Memory Overhead** | High (V8 Promise / Closure heap objects) | Extremely lightweight (~2 KB per Goroutine) |
| **CPU-bound Tasks** | Freezes the event loop (requires `worker_threads`) | Scales effortlessly across all CPU cores |
| **Communication** | Callbacks, Promises, Event Emitters | Channels (`chan T`) & Shared Memory with Mutexes |

---

## 🚀 How to Run

```bash
go run ./23_goroutines/main.go
```
