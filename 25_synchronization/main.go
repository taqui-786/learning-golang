package main

import (
	"fmt"
	"sync"
	"sync/atomic"
	"time"
)

// 1. sync.WaitGroup Worker Example
func worker(id int, wg *sync.WaitGroup) {
	defer wg.Done() // Decrements counter when finished

	fmt.Printf("   [Worker %d] Starting task...\n", id)
	time.Sleep(50 * time.Millisecond)
	fmt.Printf("   [Worker %d] Finished task! ✅\n", id)
}

// 2. sync.Mutex Protected Counter
type SafeCounter struct {
	mu    sync.Mutex
	value int
}

func (c *SafeCounter) Increment(wg *sync.WaitGroup) {
	defer wg.Done()
	c.mu.Lock()         // Only 1 goroutine inside critical section
	c.value++           // Safe modification
	c.mu.Unlock()       // Release lock
}

func (c *SafeCounter) Value() int {
	c.mu.Lock()
	defer c.mu.Unlock()
	return c.value
}

// 3. sync.Once Singleton
var once sync.Once

func initializeService(id int, wg *sync.WaitGroup) {
	defer wg.Done()
	once.Do(func() {
		fmt.Printf("   👉 [sync.Once] Service initialized by Goroutine #%d (runs only once!)\n", id)
	})
}

func main() {
	fmt.Println("=== 1. sync.WaitGroup (Go's Promise.all) ===")
	var wg sync.WaitGroup

	for i := 1; i <= 3; i++ {
		wg.Add(1)         // Counter +1
		go worker(i, &wg) // Pass pointer to WaitGroup!
	}
	wg.Wait() // Blocks until counter reaches 0
	fmt.Println("All workers finished execution!")

	fmt.Println("\n=== 2. sync.Mutex (Mutual Exclusion Lock) ===")
	counter := SafeCounter{}
	var mutexWg sync.WaitGroup

	for i := 0; i < 500; i++ {
		mutexWg.Add(1)
		go counter.Increment(&mutexWg)
	}
	mutexWg.Wait()
	fmt.Println("Final Mutex Counter value:", counter.Value()) // Exactly 500!

	fmt.Println("\n=== 3. sync.Once (Run Exactly Once) ===")
	var onceWg sync.WaitGroup
	for i := 1; i <= 5; i++ {
		onceWg.Add(1)
		go initializeService(i, &onceWg)
	}
	onceWg.Wait()

	fmt.Println("\n=== 4. sync/atomic (Lock-Free Hardware Counters) ===")
	var atomicCounter int64
	var atomicWg sync.WaitGroup

	for i := 0; i < 500; i++ {
		atomicWg.Add(1)
		go func() {
			defer atomicWg.Done()
			atomic.AddInt64(&atomicCounter, 1) // High-speed hardware atomic increment
		}()
	}
	atomicWg.Wait()
	fmt.Println("Final Atomic Counter value:", atomic.LoadInt64(&atomicCounter)) // Exactly 500!
}
