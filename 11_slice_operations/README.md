# 11. Slice Operations: append & copy

* **Always reassign `append`:** `s = append(s, val)` because Go may reallocate a larger backing array.
* **Independent copies:** Simply doing `b := a` shares the backing array. Use `copy(dst, src)` for separate memory.
