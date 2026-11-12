# 12. Maps in Go

Go's built-in hash table (like JS `Map` or objects).
* **Nil Map Trap:** Writing to a nil map (`var m map[string]int`) causes a **panic**! Always initialize with `make()` or `{}`.
* **Comma-ok idiom:** `val, ok := m[key]` tests if a key truly exists vs just returning a zero-value.
* **Unordered:** Iteration order is randomized on purpose.
