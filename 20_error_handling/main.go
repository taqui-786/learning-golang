package main

import (
	"errors"
	"fmt"
)

// Sentinel error definition
var ErrDivideByZero = errors.New("cannot divide by zero")
var ErrNotFound = errors.New("resource not found")

// 1. Basic error return
func divide(a, b float64) (float64, error) {
	if b == 0 {
		return 0, ErrDivideByZero
	}
	return a / b, nil
}

// 2. Error wrapping using %w
func fetchRecord(id int) error {
	if id <= 0 {
		// Wrap ErrNotFound inside contextual details
		return fmt.Errorf("fetchRecord(id=%d): %w", id, ErrNotFound)
	}
	return nil
}

// 3. Custom Error Struct
type APIError struct {
	StatusCode int
	Endpoint   string
	Message    string
}

// Satisfy the built-in 'error' interface
func (e *APIError) Error() string {
	return fmt.Sprintf("[%d] request to '%s' failed: %s", e.StatusCode, e.Endpoint, e.Message)
}

func queryAPI(endpoint string) error {
	return &APIError{
		StatusCode: 404,
		Endpoint:   endpoint,
		Message:    "route does not exist",
	}
}

// 4. Panic and Recover
func safeDivisionWithRecover(a, b int) {
	defer func() {
		if r := recover(); r != nil {
			fmt.Println("🚨 Recovered from panic:", r)
		}
	}()

	if b == 0 {
		panic("runtime panic: integer divide by zero")
	}
	fmt.Printf("Result: %d\n", a/b)
}

func main() {
	fmt.Println("=== 1. Basic Error Return ===")
	res, err := divide(10, 2)
	if err != nil {
		fmt.Println("Error:", err)
	} else {
		fmt.Println("10 / 2 =", res)
	}

	_, err = divide(10, 0)
	if err != nil {
		fmt.Println("Expected error:", err)
	}

	fmt.Println("\n=== 2. Error Wrapping & errors.Is ===")
	fetchErr := fetchRecord(-5)
	if fetchErr != nil {
		fmt.Println("Raw error:", fetchErr)

		// errors.Is looks through the wrapped chain!
		if errors.Is(fetchErr, ErrNotFound) {
			fmt.Println("✓ Matched root cause: ErrNotFound")
		}
	}

	fmt.Println("\n=== 3. Custom Error & errors.As ===")
	apiErr := queryAPI("/v1/users/999")
	if apiErr != nil {
		fmt.Println("Raw error:", apiErr)

		var targetErr *APIError
		if errors.As(apiErr, &targetErr) {
			fmt.Printf("✓ Extracted custom struct -> Status: %d, Endpoint: %s\n", targetErr.StatusCode, targetErr.Endpoint)
		}
	}

	fmt.Println("\n=== 4. Panic & Recover ===")
	safeDivisionWithRecover(10, 0)
	fmt.Println("✓ Program continues running normally after panic recovery!")
}
