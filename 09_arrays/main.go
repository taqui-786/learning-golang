package main

import "fmt"

func main() {
	// 1. Fixed-size array declaration
	var scores [3]int
	scores[0] = 90
	scores[1] = 85
	scores[2] = 95
	fmt.Println("Scores:", scores)

	// 2. Auto-counting with [...]
	fruits := [...]string{"Apple", "Banana", "Orange"}
	fmt.Printf("Fruits (%d items): %v\n", len(fruits), fruits)

	// 3. Value copy semantics: Go arrays are VALUE types!
	a := [3]int{1, 2, 3}
	b := a // Makes a FULL independent copy!
	b[0] = 999
	fmt.Println("Original a:", a) // [1 2 3] - untouched!
	fmt.Println("Copied   b:", b) // [999 2 3]
}
