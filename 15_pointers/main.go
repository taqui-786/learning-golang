package main

import "fmt"

// Function that mutates outer variable via pointer
func doubleValue(ptr *int) {
	*ptr = *ptr * 2 // Dereference and update value in place
}

func main() {
	val := 21

	// & gets memory address
	fmt.Println("Original value:", val)
	fmt.Println("Memory address:", &val)

	// Pass pointer to function
	doubleValue(&val)
	fmt.Println("After pointer mutation:", val) // 42!
}
