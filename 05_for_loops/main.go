package main

import "fmt"

func main() {
	// 1. Classic 3-component loop
	fmt.Print("Standard loop: ")
	for i := 1; i <= 3; i++ {
		fmt.Print(i, " ")
	}
	fmt.Println()

	// 2. While-style loop (single condition)
	n := 1
	fmt.Print("While-style loop: ")
	for n <= 3 {
		fmt.Print(n, " ")
		n++
	}
	fmt.Println()

	// 3. Infinite loop with break & continue
	fmt.Print("Infinite loop with break: ")
	count := 0
	for {
		count++
		if count%2 == 0 {
			continue // skip even numbers
		}
		if count > 5 {
			break // exit loop
		}
		fmt.Print(count, " ")
	}
	fmt.Println()
}
