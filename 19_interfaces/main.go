package main

import "fmt"

// 1. Interface contract
type Speaker interface {
	Speak() string
}

// 2. Concrete types (Implicit implementation - no 'implements' keyword!)
type Dog struct{}
func (d Dog) Speak() string { return "Woof! 🐶" }

type Cat struct{}
func (c Cat) Speak() string { return "Meow! 🐱" }

func PlaySound(s Speaker) {
	fmt.Println(s.Speak())
}

// 3. Type Switch with 'any'
func Inspect(val any) {
	switch v := val.(type) {
	case int:
		fmt.Printf("Integer: %d\n", v*2)
	case string:
		fmt.Printf("String: %s\n", v)
	case Speaker:
		fmt.Printf("Speaker says: %s\n", v.Speak())
	}
}

func main() {
	PlaySound(Dog{})
	PlaySound(Cat{})

	Inspect(42)
	Inspect("Hello Go")
	Inspect(Dog{})
}
