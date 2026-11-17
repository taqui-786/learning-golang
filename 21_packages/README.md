# 21. Packages in Go

A **Package** in Go is simply a **directory containing one or more `.go` files** that share the same `package <name>` statement at the very top.

---

## 🔑 Key Concepts

### 1. `main` Package vs Library Packages
* **`package main`**: An executable package. Tells Go to compile an entry point with `func main()`.
* **Library Package (e.g. `package greeter`)**: A collection of reusable functions, structs, and interfaces without a `main()` function.

---

### 2. Exported vs Unexported (The Capitalization Rule)
Go does not use `export`, `public`, or `private` keywords. Visibility is determined entirely by the **first letter of the identifier's name**:

| First Letter | Visibility | Scope | Example |
|---|---|---|---|
| **Uppercase** | **Exported (Public)** | Accessible from any package that imports it | `func Greet()`, `const AppName` |
| **Lowercase** | **Unexported (Private)** | Only accessible within the declaring package | `var defaultPrefix`, `func formatGreeting()` |

```go
package greeter

// Public (Exported)
func Greet(name string) string {
    return helper(name) // Can call private helper
}

// Private (Unexported)
func helper(name string) string {
    return "Hello, " + name
}
```

---

### 3. Package Initialization: `init()`
Every `.go` file can define one or more parameterless `func init()` functions.
* Go executes `init()` automatically **before `main()` starts**.
* Useful for setting up configuration, initializing caches, or registering drivers.

```go
func init() {
    fmt.Println("Runs automatically when package is imported!")
}
```

---

### 4. Import Variations

```go
import (
    // 1. Standard Library
    "fmt"

    // 2. Custom Package within your module
    "github.com/taqui-786/learning-golang/21_packages/greeter"

    // 3. Import Alias (useful when resolving name collisions)
    str "strings"

    // 4. Blank Import (triggers package init() without calling its functions)
    _ "github.com/lib/pq"
)
```

---

### 5. Private Packages: The `internal/` Directory
Go enforces a special compiler rule for directories named `internal`:
* Any package inside `internal/` can **only** be imported by packages within the same parent directory tree.
* External users importing your module cannot access your internal packages, keeping internal helpers hidden.

---

### 6. Circular Dependencies: Strictly Forbidden
Go does not allow Package A to import Package B if Package B also imports Package A.
* If a cycle exists, the compiler stops with: `import cycle not allowed`.
* **Solution**: Extract shared interfaces or structs into a shared 3rd package (e.g., `types` or `models`).

---

## 💡 JavaScript vs Go Comparison

| Concept | JavaScript / TypeScript | Go (Golang) |
|---|---|---|
| **Exporting** | `export function greet() {}` | Capital letter: `func Greet() {}` |
| **Private** | `#privateField` or omitted `export` | Lowercase letter: `func greet() {}` |
| **Module boundary** | File-based (`foo.ts`) | Directory-based (all `.go` files in folder share `package`) |
| **Circular imports** | Allowed (often causes runtime `undefined` bugs) | Strictly forbidden at compile-time |
| **Initialization** | Top-level module execution | Explicit `func init()` |

---

## 🚀 How to Run

```bash
go run ./21_packages/main.go
```
