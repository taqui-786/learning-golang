package main

import "fmt"

const AppName = "GoStudyApp"
const Version = 1.0

// Grouped constants with iota (auto-incrementing enum)
const (
	StatusPending = iota // 0
	StatusApproved       // 1
	StatusRejected       // 2
)

func main() {
	fmt.Println("Application:", AppName, "| Version:", Version)
	fmt.Println("Status codes:", StatusPending, StatusApproved, StatusRejected)
}
