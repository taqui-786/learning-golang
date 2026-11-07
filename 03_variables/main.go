package main

import "fmt"

func main() {
	// 1. var with explicit type
	var name string = "Taqui"

	// 2. var with type inference
	var age = 22

	// 3. Short declaration operator (:=) - idiomatic inside functions!
	role := "Fullstack & Go Developer"

	// 4. Zero values: Go automatically initializes variables!
	var unassignedInt int       // 0
	var unassignedString string // ""
	var unassignedBool bool     // false

	fmt.Printf("User: %s | Age: %d | Role: %s\n", name, age, role)
	fmt.Printf("Zero values -> int: %d, string: %q, bool: %t\n", unassignedInt, unassignedString, unassignedBool)
}
