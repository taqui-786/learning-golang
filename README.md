# 🐹 Golang Learning Journey (From Scratch to Advanced)

A clean, step-by-step repository documenting my journey learning **Go (Golang)**, covering daily topics from November 6, 2026 to November 20, 2026.

---

## 🌐 Featured Web Application: [Go with Taqui](./go-with-taqui)

Along with hands-on CLI topics, check out **[Go with Taqui](./go-with-taqui)** — an interactive visual learning web platform covering all 55 modules and 615 subtopics with JS/Python conceptual bridges!

* **Live Demo on GitHub Pages:** [https://taqui-786.github.io/learning-golang/](https://taqui-786.github.io/learning-golang/)
* **Automated CI/CD:** Deployed automatically on every push via [GitHub Actions](.github/workflows/deploy-pages.yml).

Each topic directory includes:
* `main.go`: Fully runnable code examples.
* `README.md`: Concept breakdown, syntax rules, and comparisons for JavaScript/Node.js developers.

---

## 📅 Daily Learning Roadmap

| Day | Date | Topics Covered | Key Concepts |
|---|---|---|---|
| **Day 1** | Nov 06 | `01_hello_world`, `02_simple_values` | `main` package, `fmt.Println`, primitive types |
| **Day 2** | Nov 07 | `03_variables`, `04_constants` | `var`, `:=` short syntax, zero values, `const`, `iota` |
| **Day 3** | Nov 08 | `05_for_loops`, `06_if_else` | 3-part for, while-style for, if with short statement |
| **Day 4** | Nov 09 | `07_switch`, `08_operators` | Auto-break switch, tagless switch, bitwise & bit-clear (`&^`) |
| **Day 5** | Nov 10 | `09_arrays` | Fixed-size arrays, value copy semantics, 2D grids |
| **Day 6** | Nov 11 | `10_slices`, `11_slice_operations` | Dynamic slices, `len` vs `cap`, `append()`, `copy()` |
| **Day 7** | Nov 12 | `12_maps` | Hash tables, CRUD, nil map gotcha, "comma-ok" idiom |
| **Day 8** | Nov 13 | `13_functions`, `14_closures_and_defer` | Multiple return values, variadic `...`, closures, `defer` LIFO |
| **Day 9** | Nov 14 | `15_pointers` | Addresses (`&`), dereferencing (`*`), mutation, value vs pointer semantics |
| **Day 10** | Nov 15 | `16_structs`, `17_struct_embedding` | Custom data types, anonymous structs, embedding & field promotion |
| **Day 11** | Nov 16 | `18_methods`, `19_interfaces` | Value vs pointer receivers, implicit duck typing, `any`, type switches |
| **Day 12** | Nov 17 | `20_error_handling`, `21_packages`, `22_go_modules` | Error interface, wrapping `%w`, `errors.Is`/`As`, custom packages, `init()`, `go.mod` & `go.sum` |
| **Day 13** | Nov 19 | `23_goroutines` | Concurrency vs parallelism, M:N scheduler, `go` keyword, lifecycle & channel handshake |
| **Day 14** | Nov 20 | `24_channels`, `25_synchronization` | Typed channels, unbuffered vs buffered, directional channels, `sync.WaitGroup`, `sync.Mutex`, `sync.Once`, `sync/atomic` |

---

## 🚀 How to Run Any Topic

Clone the repository and run any topic using the `go run` command:

```bash
# Example: Run Interfaces
go run ./19_interfaces/main.go

# Example: Run Pointers
go run ./15_pointers/main.go
```
