package greeter

import "fmt"

// AppName is an EXPORTED variable (starts with uppercase)
// Accessible outside this package
const AppName = "GoGreeterService"

// defaultPrefix is an UNEXPORTED variable (starts with lowercase)
// Only visible inside the greeter package
var defaultPrefix = "Hello"

// init() runs automatically when this package is initialized, before main()
func init() {
	fmt.Println("👉 [greeter package] initialized automatically via init()!")
}

// Greet is an EXPORTED function (starts with uppercase)
// Public API callable from other packages
func Greet(name string) string {
	return formatGreeting(defaultPrefix, name)
}

// SetPrefix changes the greeting prefix (Exported)
func SetPrefix(prefix string) {
	defaultPrefix = prefix
}

// formatGreeting is an UNEXPORTED helper function (starts with lowercase)
// Private implementation detail - cannot be called outside this package
func formatGreeting(prefix, name string) string {
	return fmt.Sprintf("[%s] %s, %s!", AppName, prefix, name)
}
