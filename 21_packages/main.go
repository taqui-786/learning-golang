package main

import (
	"fmt"

	// 1. Importing custom package using module path
	"github.com/taqui-786/learning-golang/21_packages/greeter"

	// 2. Import alias example (renaming to avoid collisions or shorten names)
	str "strings"
)

func main() {
	fmt.Println("🚀 main() started execution")

	// Accessing exported package constant
	fmt.Println("Service Name:", greeter.AppName)

	// Calling exported function
	msg := greeter.Greet("Taqui")
	fmt.Println(msg)

	// Mutating state via exported function
	greeter.SetPrefix("Namaste")
	fmt.Println(greeter.Greet("Gopher"))

	// Demonstrating aliased standard library import
	fmt.Println("Aliased strings.ToUpper():", str.ToUpper("golang packages rock"))

	// Note on Visibility / Encapsulation:
	// greeter.formatGreeting(...) or greeter.defaultPrefix would fail at compile time
	// because identifiers starting with a lowercase letter are UNEXPORTED (private).
}
