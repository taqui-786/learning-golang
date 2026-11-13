package main

import "fmt"

// 1. Multiple return values (Go's signature feature!)
func divide(a, b int) (int, int) {
	quotient := a / b
	remainder := a % b
	return quotient, remainder
}

// 2. Variadic function (...Type)
func sum(nums ...int) int {
	total := 0
	for _, n := range nums {
		total += n
	}
	return total
}

func main() {
	q, r := divide(10, 3)
	fmt.Printf("10 / 3 = %d remainder %d\n", q, r)

	total := sum(10, 20, 30, 40)
	fmt.Println("Total sum:", total)
}
