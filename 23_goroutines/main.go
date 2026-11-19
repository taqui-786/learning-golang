package main

import (
	"fmt"
	"time"
)

// Named function to run concurrently in a goroutine
func workerTask(name string, delay time.Duration) {
	for i := 1; i <= 3; i++ {
		fmt.Printf("[%s] Working step %d...\n", name, i)
		time.Sleep(delay)
	}
	fmt.Printf("[%s] Task completed! ✅\n", name)
}

func main() {
	fmt.Println("=== 1. Launching Goroutines with 'go' ===")

	// Launching concurrent goroutines (non-blocking!)
	go workerTask("Goroutine-A", 80*time.Millisecond)
	go workerTask("Goroutine-B", 120*time.Millisecond)

	// 2. Anonymous Goroutine
	go func() {
		fmt.Println("👉 Anonymous Goroutine executed in background!")
	}()

	// 3. Passing Arguments into Goroutines (Safe parameter passing)
	for i := 1; i <= 3; i++ {
		go func(taskID int) {
			fmt.Printf("   Worker spawned with task ID: %d\n", taskID)
		}(i) // Pass 'i' by value as argument
	}

	// 4. Channel Handshake between Goroutines
	// (Demonstrates why 'go func' prevents unbuffered channel deadlock!)
	fmt.Println("\n=== 2. Channel Handshake (Sender & Receiver) ===")
	ch := make(chan string)

	// Worker B (Background Goroutine) sends to channel
	go func() {
		time.Sleep(150 * time.Millisecond)
		ch <- "Hello from background Worker! 📬"
	}()

	// Worker A (Main Goroutine) waits and receives
	// Main pauses here until Worker B hands over the value
	msg := <-ch
	fmt.Println("Received in Main:", msg)

	// Wait briefly so remaining async tasks complete before main terminates
	time.Sleep(200 * time.Millisecond)
	fmt.Println("\n🚀 Main Goroutine finished and exiting cleanly!")
}
