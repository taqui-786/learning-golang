package main

import (
	"fmt"
	"time"
)

// 1. Directional Channels:
// out chan<- int: Send-only channel (Function can only send to this channel)
func producer(out chan<- int) {
	for i := 1; i <= 3; i++ {
		out <- i * 10
		time.Sleep(50 * time.Millisecond)
	}
	close(out) // Rule: Sender owns and closes the channel!
}

// in <-chan int: Receive-only channel (Function can only read from this channel)
func consumer(in <-chan int) {
	// 'range' automatically loops until the channel is closed
	for val := range in {
		fmt.Printf("   [Consumer] Received value: %d\n", val)
	}
}

func main() {
	fmt.Println("=== 1. Unbuffered Channel (Synchronous Handshake) ===")
	unbuffered := make(chan string)

	go func() {
		time.Sleep(100 * time.Millisecond)
		unbuffered <- "Data from background worker! 📬"
	}()

	// Blocks until the background goroutine sends the value
	msg := <-unbuffered
	fmt.Println("Received:", msg)

	fmt.Println("\n=== 2. Buffered Channel (Asynchronous Mailbox) ===")
	// Capacity of 2 items: can store 2 values without blocking!
	buffered := make(chan int, 2)
	buffered <- 100
	buffered <- 200
	fmt.Printf("Buffer status -> Length: %d, Capacity: %d\n", len(buffered), cap(buffered))

	// Reading values from buffer (FIFO order)
	fmt.Println("Popped from buffer:", <-buffered) // 100
	fmt.Println("Popped from buffer:", <-buffered) // 200

	fmt.Println("\n=== 3. Directional Channels & Range Over Channel ===")
	stream := make(chan int)
	go producer(stream) // Send-only inside producer
	consumer(stream)   // Receive-only inside consumer

	fmt.Println("\n=== 4. Checking if Channel is Closed (Comma-Ok Idiom) ===")
	testChan := make(chan string, 1)
	testChan <- "Ping"
	close(testChan)

	// 1st Read: reads "Ping", ok is true
	val, ok := <-testChan
	fmt.Printf("1st read -> value: '%s', open: %v\n", val, ok)

	// 2nd Read: channel is empty and closed, returns zero value, ok is false
	val, ok = <-testChan
	fmt.Printf("2nd read -> value: '%s' (zero-value), open: %v\n", val, ok)
}
