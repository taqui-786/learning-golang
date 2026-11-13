package main

import "fmt"

// Closure: remembers 'count' across calls
func counter() func() int {
	count := 0
	return func() int {
		count++
		return count
	}
}

func main() {
	// Closures
	next := counter()
	fmt.Println("Counter:", next(), next(), next()) // 1 2 3

	// defer: schedules cleanup to run right before function exit (LIFO order!)
	fmt.Println("1. Program starts")
	defer fmt.Println("4. Deferred cleanup (Runs LAST!)")
	defer fmt.Println("3. Another defer (Runs 2nd to last)")
	fmt.Println("2. Program doing work...")
}
