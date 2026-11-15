package main

import "fmt"

type Address struct {
	City    string
	Country string
}

// Employee embeds Address anonymously (Composition / Field Promotion!)
type Employee struct {
	Name    string
	Salary  float64
	Address // Embedded!
}

func main() {
	emp := Employee{
		Name:    "Taqui",
		Salary:  75000,
		Address: Address{City: "Delhi", Country: "India"},
	}

	// Field promotion: Access City directly on emp!
	fmt.Printf("Employee %s lives in %s, %s\n", emp.Name, emp.City, emp.Country)
}
