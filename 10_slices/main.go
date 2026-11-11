package main

import "fmt"

func main() {
	// 1. Slice literal (notice empty brackets []!)
	nums := []int{10, 20, 30}
	fmt.Printf("Slice: %v | Len: %d | Cap: %d\n", nums, len(nums), cap(nums))

	// 2. make([]T, len, cap) - Pre-allocates backing array
	s := make([]int, 2, 5) // len=2, cap=5
	fmt.Printf("make slice: %v | Len: %d | Cap: %d\n", s, len(s), cap(s))

	// 3. Slice expressions: [low:high] (low included, high excluded)
	letters := []string{"a", "b", "c", "d", "e"}
	sub := letters[1:4] // ["b", "c", "d"]
	fmt.Println("Subslice:", sub)
}
