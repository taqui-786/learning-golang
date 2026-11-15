package main

import "fmt"

type User struct {
	Name string
	Age  int
}

func main() {
	// 1. Named initialization
	u1 := User{Name: "Taqui", Age: 22}

	// 2. Struct pointer
	u2 := &User{Name: "Sara", Age: 25}

	// Auto-dereferencing: Go lets us write u2.Name directly!
	fmt.Printf("User 1: %+v\n", u1)
	fmt.Printf("User 2: %s, age %d\n", u2.Name, u2.Age)
}
