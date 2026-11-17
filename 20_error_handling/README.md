# 20. Error Handling in Go

In Go, **errors are normal values**, not thrown exceptions. There is no `try/catch` block for standard error flows.

---

## 🔑 Key Concepts

### 1. The Built-in `error` Interface
In Go, `error` is a predefined interface with a single method:
```go
type error interface {
    Error() string
}
```
Any type that provides an `Error() string` method automatically satisfies the `error` interface.

---

### 2. Returning & Checking Errors
Functions that can fail return the result alongside an `error` as the last return value.
* If successful: returns `(result, nil)`
* If failed: returns `(zeroValue, err)`

```go
result, err := divide(10, 0)
if err != nil {
    // Handle error immediately (Guard clause)
    fmt.Println("Error:", err)
    return
}
// Proceed with result safely
```

---

### 3. Creating Errors

#### Simple Static Errors: `errors.New()`
```go
import "errors"

var ErrNotFound = errors.New("item not found")
```

#### Dynamic / Formatted Errors: `fmt.Errorf()`
```go
import "fmt"

func findUser(id int) error {
    return fmt.Errorf("user with ID %d does not exist", id)
}
```

---

### 4. Error Wrapping (`%w`) & Chain Inspection (Go 1.13+)

#### Wrapping Errors:
Use `%w` verb inside `fmt.Errorf` to preserve the original error inside a new context layer:
```go
var ErrDatabase = errors.New("database connection lost")

func getUser() error {
    return fmt.Errorf("getUser failed: %w", ErrDatabase)
}
```

#### `errors.Is(err, target)`:
Checks if any error in the wrapped chain matches `target`:
```go
if errors.Is(err, ErrDatabase) {
    fmt.Println("Root cause was a database issue!")
}
```

#### `errors.As(err, &target)`:
Finds the first error in the chain that matches the target's type and assigns it, allowing access to custom struct fields:
```go
var customErr *CustomError
if errors.As(err, &customErr) {
    fmt.Println("HTTP Status Code:", customErr.StatusCode)
}
```

---

### 5. Custom Error Structs
You can attach extra metadata (such as error codes, timestamps, or field names) by creating a struct that implements `Error() string`:

```go
type ValidationError struct {
    Field   string
    Message string
}

func (v ValidationError) Error() string {
    return fmt.Sprintf("validation error on '%s': %s", v.Field, v.Message)
}
```

---

### 6. Panic and Recover
* **`panic`**: Go's emergency stop. Used only for unrecoverable errors (e.g., failed startup checks, nil pointer crashes).
* **`recover`**: Catches an active panic to stop stack unwinding. Must be called inside a `defer` function.

```go
func safeExecute() {
    defer func() {
        if r := recover(); r != nil {
            fmt.Println("Recovered from panic:", r)
        }
    }()

    panic("something went critically wrong!")
}
```

---

## 💡 JavaScript vs Go Comparison

| Feature | JavaScript / Node.js | Go (Golang) |
|---|---|---|
| **Mechanism** | `try / catch / throw` | Explicit return values `(val, err)` |
| **Control Flow** | Uncaught exceptions bubble and crash | Caller explicitly handles errors at call site |
| **Type** | `Error` class | `error` interface (`Error() string`) |
| **Fatal Crash** | Uncaught Exception / Process Exit | `panic()` (can be caught via `recover()`) |
| **Root Cause** | `err.cause` (ES2022) | Error wrapping with `%w` + `errors.Is()` / `errors.As()` |

---

## 🚀 How to Run

```bash
go run ./20_error_handling/main.go
```
