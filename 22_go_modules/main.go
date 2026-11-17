package main

import (
	"fmt"
	"log"

	// External third-party package managed by go.mod and go.sum
	"github.com/google/uuid"
)

func main() {
	fmt.Println("=== Go Modules & Third-Party Dependencies ===")

	// 1. Generate a new UUIDv4 using the external library
	newID := uuid.New()
	fmt.Printf("Generated UUID: %s\n", newID.String())
	fmt.Printf("UUID Version: %d\n", newID.Version())

	// 2. Parse and validate an existing UUID string
	rawUUID := newID.String()
	parsedID, err := uuid.Parse(rawUUID)
	if err != nil {
		log.Fatalf("Failed to parse UUID: %v", err)
	}
	fmt.Printf("Parsed UUID successfully: %s\n", parsedID)

	// 3. Handling invalid UUID strings
	invalidUUID := "not-a-valid-uuid"
	_, err = uuid.Parse(invalidUUID)
	if err != nil {
		fmt.Printf("Expected error parsing invalid UUID: %v\n", err)
	}

	fmt.Println("\n💡 Notice:")
	fmt.Println("- The dependency is pinned in 'go.mod'")
	fmt.Println("- Its cryptographic hash is verified in 'go.sum'")
	fmt.Println("- Go downloaded this package into the central module cache ($GOPATH/pkg/mod)")
}
