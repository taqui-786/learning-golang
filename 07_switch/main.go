package main

import "fmt"

func main() {
	day := "Saturday"

	// 1. Standard switch (automatic break - no accidental fallthrough!)
	switch day {
	case "Monday":
		fmt.Println("Work week starts")
	case "Saturday", "Sunday": // Multiple cases in one line!
		fmt.Println("Weekend! 🎉")
	default:
		fmt.Println("Weekday")
	}

	// 2. Tagless switch (cleaner alternative to long if-else chains!)
	score := 75
	switch {
	case score >= 90:
		fmt.Println("Distinction")
	case score >= 70:
		fmt.Println("First Class")
	default:
		fmt.Println("Passed")
	}
}
