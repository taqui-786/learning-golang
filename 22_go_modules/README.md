# 22. Go Modules & Dependency Management

A **Go Module** is a collection of related Go packages that are versioned, distributed, and tracked together. It is defined by a `go.mod` file at the root of the project.

---

## 🔑 Key Concepts

### 1. `go.mod` Anatomy
The `go.mod` file defines the module's path and its dependency requirements:

```go
module github.com/taqui-786/learning-golang

go 1.22

require (
    github.com/google/uuid v1.6.0
)
```

* `module`: Unique module namespace (typically its GitHub repository path).
* `go`: Minimum supported Go language version.
* `require`: Direct and indirect third-party dependencies pinned to specific semantic versions.

---

### 2. `go.sum` Checksum File
Whenever dependencies are downloaded, Go records their cryptographic SHA-256 hashes in `go.sum`:
* Guarantees that future downloads of that version match the exact same bytes.
* Prevents **supply-chain tampering** (e.g. if an attacker modifies a tag on GitHub).
* **Always commit `go.sum` to Git!**

---

### 3. Essential Go Module CLI Commands

| Command | What it does | npm equivalent |
|---|---|---|
| `go mod init <name>` | Initializes a new module and creates `go.mod` | `npm init -y` |
| `go get <package>@<v>` | Adds or upgrades a dependency | `npm install <package>` |
| `go mod tidy` ⭐ | Adds missing dependencies & removes unused ones | `npm prune` + `npm install` |
| `go mod download` | Downloads all dependencies to local module cache | `npm ci` (fetch step) |
| `go mod verify` | Verifies that local dependencies match `go.sum` hashes | `npm audit` / integrity check |
| `go mod vendor` | Copies all dependencies into a local `./vendor` directory | `node_modules` |

> [!TIP]
> **Golden Rule of Go Modules:** Whenever you add or remove imports in your code, run `go mod tidy`. It keeps your `go.mod` and `go.sum` files strictly synchronized with your source code.

---

### 4. Local Module Replacement (`replace`)
To test a local fork or package without publishing it to GitHub, use the `replace` directive in `go.mod`:

```go
module my-app

go 1.22

require github.com/example/lib v1.0.0

// Redirects remote package to a local folder on your machine
replace github.com/example/lib => ../local-lib
```

---

### 5. Semantic Versioning & The `/v2` Rule
Go strictly adheres to Semantic Versioning (`vMAJOR.MINOR.PATCH`):
* `v1.2.3`: Standard semantic release.
* **Major breaking changes (`v2+`)**: Go requires the major version to be part of the module path!
  ```go
  import "github.com/example/lib/v2"
  ```
  This allows different major versions of the same library to coexist in the same project without breaking each other!

---

## 💡 Node.js (npm) vs Go Modules Comparison

| Feature | Node.js / npm | Go Modules |
|---|---|---|
| **Manifest** | `package.json` | `go.mod` |
| **Lock File** | `package-lock.json` | `go.sum` |
| **Storage** | Heavy `./node_modules` inside each project | Central global cache in `$GOPATH/pkg/mod` |
| **Registry** | Centralized (npmjs.com) | Decentralized (direct from Git / `proxy.golang.org`) |
| **Cleanup** | Manual `npm uninstall` | Automatic via `go mod tidy` |

---

## 🚀 How to Run

```bash
go run ./22_go_modules/main.go
```
