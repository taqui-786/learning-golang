package main

import "fmt"

func main() {
	score := 85

	// 1. Standard if-else if-else
	if score >= 90 {
		fmt.Println("Grade: A")
	} else if score >= 80 {
		fmt.Println("Grade: B")
	} else {
		fmt.Println("Grade: C")
	}

	// 2. If with a short statement (scoped variable)
	// 'num' is declared, assigned, and tested in one line!
	if num := 9; num%2 == 0 {
		fmt.Printf("%d is even\n", num)
	} else {
		fmt.Printf("%d is odd\n", num)
	}
	// 'num' does NOT exist out here! Scope is tightly confined.
}
