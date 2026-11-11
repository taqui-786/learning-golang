package main

import "fmt"

func main() {
	var nums []int

	// 1. append() - Always reassign the result!
	nums = append(nums, 1, 2, 3)

	// Append another slice using spread '...'
	more := []int{4, 5}
	nums = append(nums, more...)
	fmt.Println("Appended slice:", nums)

	// 2. copy() - Creates a truly separate independent slice!
	dest := make([]int, len(nums))
	count := copy(dest, nums)
	dest[0] = 999

	fmt.Printf("Copied %d items. Original: %v, Dest: %v\n", count, nums, dest)
}
