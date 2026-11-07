# 03. Variables in Go

## Declaration Styles
1. `var name string = "Alice"` (Explicit type)
2. `var age = 25` (Type inferred)
3. `city := "Delhi"` (Short variable declaration — most common inside functions!)

## Zero Values
In Go, variables are **never `undefined`**! Uninitialized variables get their zero value:
* `int`, `float`: `0`
* `string`: `""` (empty string)
* `bool`: `false`
