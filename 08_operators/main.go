package main

import "fmt"

func main() {
	// 1. Integer division truncation (Trap for JS devs!)
	fmt.Println("Integer division 7 / 2 =", 7/2)       // 3
	fmt.Println("Float division 7.0 / 2.0 =", 7.0/2.0) // 3.5

	// 2. Modulus (integers only)
	fmt.Println("10 % 3 =", 10%3) // 1

	// 3. Bitwise & Bit-Clear (&^) operator (Unique to Go!)
	a := 5 // binary: 0101
	b := 3 // binary: 0011

	// Bit Clear: wherever b has a 1, clear that bit in a to 0!
	fmt.Println("Bit Clear 5 &^ 3 =", a&^b) // 4 (binary: 0100)

	// Bit shifts: << multiplies by 2, >> divides by 2
	fmt.Println("Left shift 2 << 1 =", 2<<1) // 4
}
