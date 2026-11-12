package main

import "fmt"

func main() {
	// 1. Initialize using make()
	scores := make(map[string]int)

	// 2. Add / Update
	scores["Taqui"] = 95
	scores["Sara"] = 88
	scores["Bob"] = 0 // Actually scored 0!

	// 3. The famous 'comma-ok' idiom to check if key exists
	val, ok := scores["Bob"]
	if ok {
		fmt.Printf("Bob exists with score: %d\n", val)
	}

	if _, ok := scores["Unknown"]; !ok {
		fmt.Println("Unknown user does not exist in map!")
	}

	// 4. Delete key
	delete(scores, "Sara")

	// 5. Iterating (Order is intentionally randomized by Go!)
	fmt.Println("--- Current Map ---")
	for name, score := range scores {
		fmt.Printf("%s: %d\n", name, score)
	}
}
