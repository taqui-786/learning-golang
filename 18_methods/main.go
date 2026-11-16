package main

import "fmt"

type Counter struct {
	Count int
}

// Value receiver: Read-only copy!
func (c Counter) Read() int {
	return c.Count
}

// Pointer receiver: Mutates original in-place!
func (c *Counter) Increment() {
	c.Count++
}

func main() {
	counter := Counter{Count: 10}
	counter.Increment()
	fmt.Println("Counter value:", counter.Read()) // 11
}
