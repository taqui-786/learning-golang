import type { ModuleContent } from '../types';

export const MODULE_DATA_PART_2: Record<number, ModuleContent> = {
  28: {
    summary:
      'Go’s standard `net/http` is production-grade out of the box. Build servers with Go 1.22+ method/path routing (`GET /users/{id}`), custom middleware, `http.Client` timeouts, and graceful shutdown.',
    mentalModel:
      '`http.NewServeMux()` is a built-in Express router; every incoming HTTP request automatically runs in its own goroutine so one slow client never blocks another.',
    lab: 'http-db',
    goCode: `package main

import (
\t"encoding/json"
\t"net/http"
\t"time"
)

func main() {
\tmux := http.NewServeMux()
\tmux.HandleFunc("GET /users/{id}", func(w http.ResponseWriter, r *http.Request) {
\t\tw.Header().Set("Content-Type", "application/json")
\t\t_ = json.NewEncoder(w).Encode(map[string]string{"id": r.PathValue("id")})
\t})
\tsrv := &http.Server{Addr: ":8080", Handler: mux, ReadTimeout: 5 * time.Second, WriteTimeout: 10 * time.Second}
\t_ = srv.ListenAndServe()
}`,
    goOut: `GET http://localhost:8080/users/42 -> 200 OK {"id":"42"}`,
    lines: [
      ['"GET /users/{id}" + r.PathValue("id")', 'Standard Go 1.22+ ServeMux supports HTTP method matching and path wildcards with zero frameworks!'],
      ['&http.Server{ReadTimeout, WriteTimeout}', 'NEVER rely on bare `http.ListenAndServe` in production—explicit timeouts block slowloris attacks!'],
      ['srv.Shutdown(ctx)', 'Stops accepting new connections while letting in-flight requests finish cleanly on SIGTERM.'],
    ],
    jsBridge:
      'Replaces Express + Node’s `http` module cleanly—and `http.Client{Timeout: 10 * time.Second}` replaces `fetch`/`axios` (remember to always `defer resp.Body.Close()`!).',
    pyBridge:
      'Unlike Flask/FastAPI needing external ASGI/WSGI servers like Uvicorn or Gunicorn, Go’s built-in `net/http` server IS production-ready directly.',
    realApp: 'High-throughput REST APIs, webhook receivers, reverse proxies, and microservice gateways.',
    mistake:
      'Using `http.Get(url)` in production (has NO timeout and can hang forever!) or forgetting `defer resp.Body.Close()` (leaks TCP connections).',
    quiz: [
      {
        type: 'Production Safety',
        q: 'Why should you avoid `http.Get(url)` directly in production Go backends?',
        opts: [
          'It uses `http.DefaultClient` which has NO timeout, so a hung server can block goroutines forever',
          'It cannot send HTTPS requests',
          'It does not support JSON',
        ],
        ans: 0,
        why: 'Always create a reusable `&http.Client{Timeout: 10 * time.Second}` or pass a timeout context.',
      },
      {
        type: 'Go 1.22+ Routing',
        q: 'How do you read `{id}` from a route registered as `mux.HandleFunc("GET /items/{id}", h)`?',
        opts: ['r.URL.Param("id")', 'r.PathValue("id")', 'r.Header.Get("id")'],
        ans: 1,
        why: 'Go 1.22 introduced `r.PathValue("id")` directly on `*http.Request`.',
      },
      {
        type: 'Resource Leak',
        q: 'After `resp, err := client.Do(req)` succeeds, what line prevents TCP socket leaks?',
        opts: ['defer resp.Body.Close()', 'resp.Flush()', 'client.Stop()'],
        ans: 0,
        why: 'Closing `resp.Body` lets Go’s HTTP transport reuse keep-alive TCP connections.',
      },
      {
        type: 'Header Order',
        q: 'When writing an HTTP response, must `w.Header().Set(...)` be called BEFORE or AFTER `w.WriteHeader(code)`?',
        opts: ['BEFORE `w.WriteHeader` (headers added afterward are ignored)', 'AFTER `w.WriteHeader`', 'Order does not matter'],
        ans: 0,
        why: 'Once WriteHeader or Write sends the status line, headers are already flushed on the wire.',
      },
    ],
  },
  29: {
    summary:
      'Compare Go’s standard `net/http` ServeMux against popular routers (`Chi`, `Gin`, `Echo`)—plus route groups, middleware chains, request validation, centralized error helpers, and `/api/v1` versioning.',
    mentalModel:
      '`Chi` stays 100% compatible with standard `net/http` handlers (minimal magic); `Gin` and `Echo` add a richer `Context` wrapper with built-in JSON binding and validation helpers.',
    lab: 'http-db',
    goCode: `// Chi router example (standard net/http compatible!)
// r := chi.NewRouter()
// r.Use(middleware.Logger, middleware.Recoverer)
// r.Route("/api/v1", func(r chi.Router) {
//     r.Get("/health", healthHandler)
//     r.With(authMiddleware).Post("/orders", createOrderHandler)
// })

// Centralized custom handler type returning error:
type AppHandler func(w http.ResponseWriter, r *http.Request) error`,
    goOut: `Clean grouped routes under /api/v1 with unified logging, panic recovery, and error formatting.`,
    lines: [
      ['Standard net/http vs Chi', 'Chi is tiny, idiomatic, and works with any standard `http.Handler` middleware.'],
      ['Gin / Echo', 'Popular full-featured frameworks offering binding, validation, and batteries-included middleware.'],
      ['Centralized Error Handler', 'Returning `error` from handlers avoids repeating JSON error boilerplate in every endpoint!'],
    ],
    jsBridge: 'Think of `net/http` + `Chi` like clean modular Express routers, while `Gin`/`Echo` feel closer to Fastify/Nest-lite.',
    pyBridge:
      'Gin/Echo feel familiar to FastAPI/Flask users, though Go developers strongly favor keeping handlers thin and avoiding heavy framework lock-in.',
    realApp: 'Versioning public APIs (`/api/v1`, `/api/v2`) and attaching rate-limit + auth middleware cleanly to protected route groups.',
    mistake:
      'Coupling all your business logic directly to `*gin.Context` instead of keeping your service layer framework-independent.',
    quiz: [
      {
        type: 'Ecosystem',
        q: 'Which popular Go router stays 100% compatible with standard `net/http` `http.Handler` signatures?',
        opts: ['Chi', 'Django', 'GraphQL'],
        ans: 0,
        why: 'Chi builds directly on standard `http.Handler`, making middleware portable.',
      },
      {
        type: 'Architecture',
        q: 'Why is wrapping handlers with a custom `func(w, r) error` adapter useful?',
        opts: [
          'It centralizes error-to-HTTP-status mapping and structured error logging in one place',
          'It disables HTTP timeouts',
          'It removes the need for JSON',
        ],
        ans: 0,
        why: 'Central error handling keeps every endpoint concise and guarantees consistent JSON error shapes.',
      },
      {
        type: 'Middleware',
        q: 'What does a Recover middleware (`defer recover()`) protect your HTTP server from?',
        opts: [
          'Slow SQL queries',
          'An unexpected panic inside one request crashing the entire server process',
          'CORS errors',
        ],
        ans: 1,
        why: 'Recover catches panics inside a handler, logs the stack trace, and returns 500 cleanly.',
      },
      {
        type: 'Versioning',
        q: 'Why do production APIs prefix routes with `/api/v1/`?',
        opts: [
          'Required by net/http',
          'So breaking schema changes can ship on `/api/v2/` without breaking existing clients',
          'Makes TCP faster',
        ],
        ans: 1,
        why: 'URL or header versioning allows smooth, zero-downtime migrations for mobile and external consumers.',
      },
    ],
  },
  30: {
    summary:
      'Secure Go backends properly: Authentication vs Authorization, slow password hashing (`bcrypt`/`Argon2`), stateless JWT access + rotating refresh tokens, HttpOnly session cookies, RBAC middleware, API keys, and OAuth 2.0.',
    mentalModel:
      'Authentication checks your passport at the airport gate (who are you?). Authorization checks your boarding pass seat class (can you enter the VIP lounge?).',
    lab: 'http-db',
    goCode: `// Password hashing with golang.org/x/crypto/bcrypt (never store plaintext or SHA-256!)
// hash, err := bcrypt.GenerateFromPassword([]byte(plain), bcrypt.DefaultCost)
// err = bcrypt.CompareHashAndPassword(hash, []byte(input))

// RBAC Authorization Middleware pattern:
func RequireRole(role string, next http.Handler) http.Handler {
\treturn http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
\t\tif r.Header.Get("X-Role") != role { // In prod: read verified JWT/session from r.Context()!
\t\t\thttp.Error(w, "forbidden", http.StatusForbidden)
\t\t\treturn
\t\t}
\t\tnext.ServeHTTP(w, r)
\t})
}`,
    goOut: `200 OK if verified role matches; 403 Forbidden otherwise.`,
    lines: [
      ['bcrypt / Argon2id', 'Deliberately slow, salted hashing resists GPU brute-force attacks (NEVER use plain MD5/SHA-256 for passwords!).'],
      ['Access vs Refresh Tokens', 'Keep JWT access tokens short-lived (e.g., 15m) and store revocable refresh tokens safely in HttpOnly cookies + DB.'],
      ['OAuth 2.0', 'Delegates login to trusted providers (Google/GitHub) via Authorization Code + PKCE flow without touching user passwords.'],
    ],
    jsBridge: 'Replaces `bcryptjs`, `jsonwebtoken`, and Passport/Auth.js middleware in Node with Go’s `golang.org/x/crypto` and `golang-jwt/jwt`.',
    pyBridge:
      'Equivalent to `passlib`/`argon2-cffi` + FastAPI OAuth2 dependencies, implemented as composable Go `http.Handler` middleware.',
    realApp: 'SaaS dashboards with role-based permissions (`admin`, `editor`, `viewer`) and developer platforms issuing hashed API keys.',
    mistake:
      'Storing raw JWTs in `localStorage` vulnerable to XSS, forgetting to verify the JWT signing algorithm (`alg`), or comparing API keys with `==` instead of `subtle.ConstantTimeCompare`.',
    quiz: [
      {
        type: 'Security',
        q: 'Why must passwords be hashed with `bcrypt` or `Argon2id` instead of `SHA-256`?',
        opts: [
          'SHA-256 is too fast and unsalted, allowing attackers to crack billions of guesses per second',
          'Go lacks SHA-256',
          'bcrypt encrypts passwords reversibly',
        ],
        ans: 0,
        why: 'Password hashes should be intentionally slow, salted, and memory-hard (Argon2id/bcrypt).',
      },
      {
        type: 'Auth Concepts',
        q: 'What is the difference between Authentication and Authorization?',
        opts: ['Authentication verifies identity; Authorization checks permissions', 'Authorization happens before login', 'They are synonyms'],
        ans: 0,
        why: 'AuthN = who you are (401 on fail); AuthZ = what you are allowed to do (403 on fail).',
      },
      {
        type: 'Tokens',
        q: 'Why are JWT Access Tokens kept short-lived (e.g., 15 minutes)?',
        opts: [
          'JWTs expire automatically in Go',
          'Stateless JWTs are hard to revoke immediately if stolen, so short lifetimes limit damage',
          'Long JWTs fail JSON parsing',
        ],
        ans: 1,
        why: 'Short access tokens paired with server-tracked refresh tokens balance speed and revocability.',
      },
      {
        type: 'Timing Attacks',
        q: 'Which standard Go function compares secret API tokens safely against timing attacks?',
        opts: ['strings.EqualFold', 'crypto/subtle.ConstantTimeCompare', 'bytes.Contains'],
        ans: 1,
        why: 'ConstantTimeCompare takes the same time regardless of which byte differs.',
      },
    ],
  },
  31: {
    summary:
      'Design developer-friendly APIs: consistent REST CRUD, validation, cursor vs offset pagination, filtering/sorting, rate limiting, streaming multipart file uploads, OpenAPI docs, WebSockets, and Server-Sent Events (SSE).',
    mentalModel:
      'REST handles classic request-reply, SSE is a one-way live ticker from server to client (perfect for AI token streaming!), and WebSockets open a two-way walkie-talkie.',
    lab: 'http-db',
    goCode: `// Server-Sent Events (SSE) handler in standard Go net/http:
func streamHandler(w http.ResponseWriter, r *http.Request) {
\tw.Header().Set("Content-Type", "text/event-stream")
\tw.Header().Set("Cache-Control", "no-cache")
\tflusher, ok := w.(http.Flusher)
\tif !ok { http.Error(w, "streaming unsupported", 500); return }
\tfor _, token := range []string{"Go ", "streams ", "fast!"} {
\t\tfmt.Fprintf(w, "data: %s\\n\\n", token)
\t\tflusher.Flush() // Push chunk immediately to browser!
\t}
}`,
    goOut: `data: Go 

data: streams 

data: fast!`,
    lines: [
      ['Cursor Pagination', 'Using `?cursor=last_id&limit=20` stays O(1) fast on 10M-row tables where `OFFSET 500000` crawls.'],
      ['http.MaxBytesReader', 'Caps request body size to protect your server from giant-payload memory exhaustion!'],
      ['SSE vs WebSockets', 'Use SSE for one-way streams (notifications, LLM tokens) over plain HTTP; use WebSockets for two-way chat/games.'],
    ],
    jsBridge: 'Browsers read Go SSE streams natively using `new EventSource("/stream")` or `fetch()` ReadableStream.',
    pyBridge:
      'Comparable to FastAPI `StreamingResponse` + OpenAPI auto-docs, with far higher concurrent connection capacity per GB of RAM.',
    realApp: 'Real-time LLM chat UIs (SSE), live dashboards, paginated admin tables, and S3-backed media upload endpoints.',
    mistake:
      'Forgetting `http.MaxBytesReader` on file/JSON uploads or allowing unsanitized user `?sort=` strings directly into SQL `ORDER BY` (SQL injection!).',
    quiz: [
      {
        type: 'Real-Time',
        q: 'Which real-time protocol is simplest and ideal for one-way streaming like LLM token output over standard HTTP?',
        opts: ['Server-Sent Events (SSE)', 'UDP multicast', 'FTP'],
        ans: 0,
        why: 'SSE runs over plain HTTP (`text/event-stream`), auto-reconnects, and works seamlessly with proxies.',
      },
      {
        type: 'Scale',
        q: 'Why does cursor-based pagination outperform `OFFSET 100000` on large tables?',
        opts: [
          'Cursor pagination jumps directly via an indexed key instead of scanning and discarding 100k rows',
          'SQL does not support OFFSET',
          'Cursor skips indexes',
        ],
        ans: 0,
        why: 'Keyset/cursor pagination stays consistently fast even deep into millions of rows.',
      },
      {
        type: 'Security',
        q: 'How should you validate a user’s `?sort=created_at` query parameter before putting it in SQL?',
        opts: [
          'Escape quotes only',
          'Check it against a strict allowlist map of permitted column names',
          'Pass it straight into fmt.Sprintf',
        ],
        ans: 1,
        why: 'SQL parameters cannot bind column names, so always map user input through a fixed allowlist.',
      },
      {
        type: 'Uploads',
        q: 'What standard `net/http` helper limits maximum incoming request body size?',
        opts: ['http.MaxBytesReader', 'http.StopBody', 'io.LimitZero'],
        ans: 0,
        why: 'MaxBytesReader prevents malicious giant uploads from exhausting server RAM.',
      },
    ],
  },
  32: {
    summary:
      'Master relational database foundations before writing Go SQL code: tables, primary/foreign keys, B-Tree indexes, JOINs, ACID transactions, connection pooling, and reading `EXPLAIN ANALYZE` plans.',
    mentalModel:
      'An Index is the alphabetical index at the back of a 1,000-page textbook—without it, Postgres reads every single page (Sequential Scan) to find one user’s email!',
    lab: 'http-db',
    goCode: `-- Core SQL + Index + ACID Transaction example (PostgreSQL)
CREATE TABLE users (
    id         BIGSERIAL PRIMARY KEY,
    email      TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_users_created ON users (created_at DESC);

BEGIN;
  UPDATE wallets SET balance = balance - 500 WHERE user_id = 1 AND balance >= 500;
  UPDATE wallets SET balance = balance + 500 WHERE user_id = 2;
COMMIT; -- Both succeed together or ROLLBACK completely (Atomicity!)`,
    goOut: `Transaction committed atomically; index enables fast O(log N) lookups.`,
    lines: [
      ['ACID', 'Atomicity (all-or-nothing), Consistency (rules/constraints hold), Isolation (concurrent txns don’t corrupt), Durability (survives crash).'],
      ['Indexes', 'Dramatically speed up WHERE/JOIN/ORDER BY reads at the cost of slight extra storage and write overhead.'],
      ['Connection Pooling', 'Reuses warm TCP/auth connections to Postgres instead of paying ~30ms handshake cost per HTTP request.'],
    ],
    jsBridge: 'Exact same relational concepts you use with Prisma/Drizzle in Node—knowing real SQL makes you immune to N+1 query bottlenecks.',
    pyBridge: 'Same SQL foundations behind SQLAlchemy/Django ORM; Go engineers love writing crisp, verifiable SQL directly.',
    realApp: 'Money transfers, inventory reservations, multi-tenant SaaS schemas, and sub-10ms API endpoints.',
    mistake:
      'Adding zero indexes to foreign keys or running a SQL query inside a `for` loop (N+1 query problem) instead of using a JOIN or `WHERE id = ANY($1)`.',
    quiz: [
      {
        type: 'ACID',
        q: 'Which ACID property guarantees that a bank transfer either updates BOTH accounts or NEITHER?',
        opts: ['Atomicity', 'Durability', 'Indexing'],
        ans: 0,
        why: 'Atomicity ensures a transaction is treated as one indivisible all-or-nothing unit.',
      },
      {
        type: 'Performance',
        q: 'What is the trade-off of adding an index to a database column?',
        opts: ['Faster reads/lookups, slightly slower writes and extra disk space', 'Zero trade-offs—index every column', 'Makes reads slower'],
        ans: 0,
        why: 'Every INSERT/UPDATE must also update the index tree, so index columns queried frequently.',
      },
      {
        type: 'Connections',
        q: 'Why do production backends use a Connection Pool instead of opening a fresh DB connection per request?',
        opts: [
          'TCP + TLS + DB auth handshakes are slow and databases have a strict max-connections cap',
          'Postgres only allows 1 query per connection',
          'Go cannot open TCP sockets',
        ],
        ans: 0,
        why: 'Pools reuse persistent connections and cap concurrency so Postgres stays healthy.',
      },
      {
        type: 'Diagnostics',
        q: 'Which SQL command shows whether PostgreSQL used an Index Scan or a slow Sequential Scan?',
        opts: ['EXPLAIN ANALYZE SELECT ...', 'SHOW SPEED', 'DEBUG QUERY'],
        ans: 0,
        why: 'EXPLAIN ANALYZE executes and reports the actual query plan and timings.',
      },
    ],
  },
  33: {
    summary:
      'Connect Go cleanly to PostgreSQL and MySQL using `database/sql`: drivers, parameterized queries (`$1` / `?` preventing SQL injection!), `QueryContext`, scanning rows, `defer rows.Close()`, transactions, and pool tuning.',
    mentalModel:
      '`*sql.DB` is NOT a single database connection—it is a thread-safe Connection Pool manager! Create it once at startup and pass it via dependency injection.',
    lab: 'http-db',
    goCode: `// Parameterized, context-aware query with database/sql:
func getUserEmail(ctx context.Context, db *sql.DB, id int64) (string, error) {
\tvar email string
\t// ALWAYS use placeholders ($1 for Postgres, ? for MySQL) — NEVER string concat!
\terr := db.QueryRowContext(ctx, "SELECT email FROM users WHERE id = $1", id).Scan(&email)
\tif errors.Is(err, sql.ErrNoRows) {
\t\treturn "", ErrNotFound
\t}
\treturn email, err
}`,
    goOut: `Safe against SQL injection, auto-cancels if HTTP client disconnects, handles 404 cleanly.`,
    lines: [
      ['QueryRowContext / QueryContext', 'Always use `*Context` variants so cancelled HTTP requests abort running SQL queries!'],
      ['defer rows.Close() + rows.Err()', 'When querying multiple rows, always defer Close AND check `rows.Err()` after the `rows.Next()` loop.'],
      ['db.SetMaxOpenConns / SetConnMaxLifetime', 'Tune pool limits so your Go service never overwhelms Postgres’s connection limit.'],
    ],
    jsBridge: 'Replaces Node’s `pg` Pool (`pool.query("SELECT ... WHERE id=$1", [id])`) with Go’s uniform `database/sql` interface across drivers.',
    pyBridge: 'Similar to Python DB-API (`psycopg`), except `*sql.DB` has built-in goroutine-safe connection pooling right out of the box.',
    realApp: 'Production PostgreSQL/MySQL backends with zero-downtime schema migrations (`golang-migrate` or `goose`).',
    mistake:
      'Using `fmt.Sprintf("... WHERE email=\'%s\'", input)` (classic SQL injection!) or forgetting `defer rows.Close()` (exhausts the entire DB pool and hangs your app!).',
    quiz: [
      {
        type: 'Security',
        q: 'How do you prevent SQL Injection when querying databases in Go?',
        opts: [
          'Remove single quotes manually',
          'Always pass user inputs as query parameters (`$1`, `?`), never concatenate into SQL strings',
          'Use fmt.Sprintf',
        ],
        ans: 1,
        why: 'Parameterized queries separate SQL code from data at the protocol level.',
      },
      {
        type: 'Pool Behavior',
        q: 'Should you call `sql.Open()` inside every HTTP request handler?',
        opts: [
          'Yes, for fresh connections',
          'No! Create `*sql.DB` once at startup because it is a long-lived, concurrency-safe connection pool',
          'Only for POST requests',
        ],
        ans: 1,
        why: '`*sql.DB` manages a pool internally; opening it per request wastes sockets and crashes your DB.',
      },
      {
        type: 'Leak Prevention',
        q: 'After `rows, err := db.QueryContext(...)` succeeds, what two steps are mandatory?',
        opts: [
          '`defer rows.Close()` and checking `rows.Err()` after the loop',
          'Call `db.Close()` immediately',
          'Convert rows to JSON',
        ],
        ans: 0,
        why: 'Unclosed rows hold a pool connection forever, and `rows.Err()` catches mid-stream network errors.',
      },
      {
        type: 'Not Found',
        q: 'What sentinel error does `QueryRowContext().Scan()` return when zero rows match?',
        opts: ['io.EOF', 'sql.ErrNoRows', 'nil'],
        ans: 1,
        why: 'Check `errors.Is(err, sql.ErrNoRows)` to map missing records cleanly to 404 responses.',
      },
    ],
  },
  34: {
    summary:
      'Pick the right Go database tool for your project: `pgx` (native high-speed Postgres driver), `sqlc` (compiles real SQL into 100% type-safe Go code!), `GORM` (full ORM), migration tools, and the Repository pattern.',
    mentalModel:
      '`GORM` writes SQL for you using reflection (fast to prototype). `sqlc` flips it: YOU write real SQL and `sqlc` generates blazing-fast, compile-time-checked Go functions with zero reflection!',
    lab: 'http-db',
    goCode: `-- query.sql (input to sqlc)
-- name: GetUser :one
SELECT id, email FROM users WHERE id = $1 LIMIT 1;

// Auto-generated by sqlc (zero runtime reflection, full type safety!):
// user, err := queries.GetUser(ctx, userID)`,
    goOut: `Generated Go method with exact Go struct return type verified against your SQL schema!`,
    lines: [
      ['pgx (jackc/pgx/v5)', 'The fastest native PostgreSQL driver & pool (`pgxpool`) with rich Postgres types (JSONB, arrays, pgvector).'],
      ['sqlc', 'Beloved by senior Go teams: write standard SQL, get compile-time type-safe Go code—catches SQL typos at build time!'],
      ['GORM', 'Feature-rich ORM great for rapid CRUD apps; watch out for implicit queries and N+1 traps on complex joins.'],
    ],
    jsBridge: 'GORM feels closest to Prisma/TypeORM; `sqlc` + `pgx` gives you Drizzle-level SQL control with Go compile-time speed.',
    pyBridge:
      'GORM compares to SQLAlchemy ORM, whereas `sqlc` gives you raw SQL speed with compiler-verified bindings Python cannot check ahead of time.',
    realApp: 'Using `pgx/v5` + `sqlc` + `goose` migrations for high-scale Postgres APIs and `pgvector` RAG databases.',
    mistake: 'Letting ORM auto-migration run blindly in production instead of versioned, reviewable SQL migration files.',
    quiz: [
      {
        type: 'Tooling',
        q: 'How does `sqlc` work compared to a traditional ORM like GORM?',
        opts: [
          'You write real SQL queries and `sqlc` generates type-safe Go code at build time',
          'sqlc uses runtime reflection to guess SQL',
          'sqlc replaces PostgreSQL',
        ],
        ans: 0,
        why: 'sqlc validates your SQL against your schema and generates idiomatic, zero-reflection Go functions.',
      },
      {
        type: 'PostgreSQL',
        q: 'Why do many production Postgres Go apps choose `pgx/v5` directly?',
        opts: [
          'Higher performance and native support for Postgres features like arrays, COPY, and pgvector',
          'database/sql does not work with Postgres',
          'pgx removes SQL',
        ],
        ans: 0,
        why: 'pgx talks Postgres binary protocol natively while also offering a database/sql adapter if needed.',
      },
      {
        type: 'Migrations',
        q: 'Why are versioned SQL migration files (`001_create_users.up.sql`) preferred in production over ORM AutoMigrate?',
        opts: [
          'They are reviewable, repeatable, reversible, and safe for zero-downtime deploys',
          'AutoMigrate deletes all tables',
          'SQL migrations skip Postgres',
        ],
        ans: 0,
        why: 'Explicit migration files prevent accidental column drops or table locks in production.',
      },
      {
        type: 'Patterns',
        q: 'What is the goal of the Repository pattern?',
        opts: [
          'Hiding database query details behind a clean domain interface so services stay testable',
          'Putting SQL inside HTML templates',
          'Replacing Docker',
        ],
        ans: 0,
        why: 'Repositories isolate persistence details from business logic.',
      },
    ],
  },
  35: {
    summary:
      'Structure real Go backends for clarity and growth: modular monoliths, layered/clean/hexagonal architecture, Handler -> Service -> Repository flow, DTOs, constructor Dependency Injection, and clean app lifecycles.',
    mentalModel:
      'Keep three clean rooms: Handler (speaks HTTP/JSON), Service (holds business rules—knows nothing about HTTP or SQL!), and Repository (speaks SQL/Redis). Wire them together once in `main()`.',
    lab: 'http-db',
    goCode: `// Clean Constructor Dependency Injection (NO magic DI framework needed!)
// Flow: HTTP -> Handler -> Service -> Repository -> Postgres
type OrderRepo interface { Save(ctx context.Context, amt int) error }
type OrderService struct { repo OrderRepo }

func NewOrderService(r OrderRepo) *OrderService {
\treturn &OrderService{repo: r}
}
func (s *OrderService) Checkout(ctx context.Context, amt int) error {
\tif amt <= 0 { return errors.New("amount must be positive") }
\treturn s.repo.Save(ctx, amt)
}`,
    goOut: `OrderService has zero SQL/HTTP imports and can be unit-tested in <1ms with a fake repo!`,
    lines: [
      ['Modular Monolith first', 'Start with ONE deployable binary cleanly split into `internal/` domain packages—don’t jump to microservices prematurely!'],
      ['Constructor DI', 'Pass dependencies explicitly via `NewService(repo, logger)`—zero globals, crystal-clear dependency graph.'],
      ['DTOs vs Domain Models', 'Separate external JSON request/response DTOs from internal DB/domain structs so API changes don’t break schemas.'],
    ],
    jsBridge: 'Replaces NestJS decorators and reflection-based DI containers with simple, readable Go constructor functions.',
    pyBridge: 'Cleaner than Django’s tight ORM/view coupling; similar in spirit to clean FastAPI layered services without runtime magic.',
    realApp: 'Multi-team SaaS backends where you can swap Stripe, Postgres, or OpenAI implementations without rewriting core business rules.',
    mistake: 'Over-engineering a tiny 5-endpoint API into 40 tiny Clean Architecture folders—keep Go architecture pragmatic and shallow!',
    quiz: [
      {
        type: 'Layering',
        q: 'Which layer should contain core business rules (like discount calculations) without importing `net/http` or `database/sql`?',
        opts: ['Handler layer', 'Service / Domain layer', 'Middleware layer'],
        ans: 1,
        why: 'Keeping business rules isolated in the Service layer makes them reusable across HTTP, CLI, and gRPC.',
      },
      {
        type: 'DI',
        q: 'How is Dependency Injection idiomatically done in Go?',
        opts: ['Explicit constructor functions like `NewUserService(repo)`', 'Global singleton variables everywhere', 'Decorator annotations'],
        ans: 0,
        why: 'Explicit constructors make dependencies obvious to readers, compilers, and unit tests.',
      },
      {
        type: 'Architecture',
        q: 'Why do most experienced Go teams start with a Modular Monolith instead of 15 microservices?',
        opts: [
          'Go cannot run microservices',
          'Simpler deploys, zero network latency between modules, easy refactoring until scale truly demands splitting',
          'Monoliths never need tests',
        ],
        ans: 1,
        why: 'Well-structured `internal/` packages give clean boundaries without distributed-systems overhead.',
      },
      {
        type: 'DTOs',
        q: 'Why separate API Request/Response DTO structs from database table structs?',
        opts: [
          'Prevents accidentally leaking internal DB fields and lets API contracts evolve independently',
          'Go forbids reusing structs',
          'Makes JSON slower',
        ],
        ans: 0,
        why: 'DTOs protect your external API contract and security boundaries.',
      },
    ],
  },
  36: {
    summary:
      'Go’s standard `testing` package makes testing effortless: `*_test.go` files, Table-Driven Tests with `t.Run`, `httptest` for HTTP handlers, interface mocking, coverage, benchmarks, and built-in Fuzz testing!',
    mentalModel:
      'A Table-Driven Test is a neat spreadsheet of `{name, input, want}` rows looped through `t.Run`—adding a new edge case takes one line instead of copy-pasting whole functions.',
    lab: 'http-db',
    goCode: `// math_test.go
package calc

import "testing"

func TestAdd(t *testing.T) {
\tcases := []struct{ name string; a, b, want int }{
\t\t{"positives", 2, 3, 5},
\t\t{"negatives", -1, -2, -3},
\t}
\tfor _, tc := range cases {
\t\tt.Run(tc.name, func(t *testing.T) {
\t\t\tif got := tc.a + tc.b; got != tc.want {
\t\t\t\tt.Fatalf("got %d, want %d", got, tc.want)
\t\t\t}
\t\t})
\t}
}`,
    goOut: `=== RUN   TestAdd
=== RUN   TestAdd/positives
=== RUN   TestAdd/negatives
--- PASS: TestAdd (0.00s)`,
    lines: [
      ['go test -v -race -cover ./...', 'Runs all tests verbosely with the race detector and code coverage report!'],
      ['net/http/httptest', '`httptest.NewRecorder()` and `httptest.NewRequest()` test HTTP handlers in memory with zero open ports!'],
      ['Fuzzing (`FuzzXxx`)', 'Built right into `go test -fuzz=.`—automatically mutates inputs to uncover hidden panics and edge cases.'],
    ],
    jsBridge: 'Zero Jest/Vitest/Supertest setup needed—`testing` + `httptest` + benchmarks + fuzzing are all built right into `go test`.',
    pyBridge: 'Table-driven tests serve the exact same role as `pytest.mark.parametrize`, with no external runner required.',
    realApp: 'Running fast unit tests on every save, `httptest` API contract suites, and Fuzz tests on parsers/auth validators.',
    mistake:
      'Forgetting `t.Helper()` inside custom test helper functions (causing Go to report the helper’s line number instead of the failing test case’s line).',
    quiz: [
      {
        type: 'Naming',
        q: 'What filename and function prefix does `go test` look for automatically?',
        opts: ['`*.spec.go` and `SpecXxx`', '`*_test.go` and `func TestXxx(t *testing.T)`', '`tests/*.go` and `RunTest`'],
        ans: 1,
        why: 'Go compiles `*_test.go` files only during `go test` and runs exported `TestXxx` functions.',
      },
      {
        type: 'HTTP Testing',
        q: 'Which standard library package lets you unit-test Go HTTP handlers without binding a real network port?',
        opts: ['net/http/httptest', 'testing/mockhttp', 'net/fake'],
        ans: 0,
        why: 'httptest provides `NewRequest`, `NewRecorder`, and `NewServer` out of the box.',
      },
      {
        type: 'Helpers',
        q: 'Why should custom assertion helper functions call `t.Helper()`?',
        opts: [
          'Makes them run twice',
          'So failure line numbers point to the calling test instead of inside the helper',
          'Required for compilation',
        ],
        ans: 1,
        why: '`t.Helper()` keeps failure diagnostics crisp and accurate.',
      },
      {
        type: 'Fuzzing',
        q: 'What does Go’s built-in Fuzz Testing (`func FuzzXxx(f *testing.F)`) do?',
        opts: ['Formats code', 'Automatically generates mutated inputs to discover crashes and edge-case bugs', 'Deploys containers'],
        ans: 1,
        why: 'Coverage-guided fuzzing finds unexpected inputs humans forget to write tests for.',
      },
    ],
  },
  37: {
    summary:
      'Debug real Go issues methodically: step-through breakpoints with Delve (`dlv`), reading stack traces and goroutine dumps, investigating panics, catching races with `-race`, and structured log debugging.',
    mentalModel:
      'Guessing bugs by staring at code is walking blindfolded. `dlv`, stack traces, and `go test -race` turn on the floodlights so you see exact line numbers, goroutine states, and variable values.',
    lab: 'memory-perf',
    goCode: `// Essential Debugging Commands:
// 1. Interactive debugger:    dlv debug ./cmd/api
// 2. Test with race detector: go test -race ./...
// 3. Goroutine stack dump:    kill -QUIT <pid>  (or GET /debug/pprof/goroutine?debug=2)
// 4. Structured debug log:
//    slog.Debug("processing order", "order_id", id, "attempt", n)`,
    goOut: `(Delve) break main.go:24 -> inspect locals, goroutines, and exact call stack`,
    lines: [
      ['Delve (dlv)', 'The official Go debugger integrated into VS Code and GoLand—supports breakpoints, watch expressions, and goroutine switching!'],
      ['Stack Traces', 'Read from top (exact panic location) downward (callers) and look for YOUR package lines first.'],
      ['Goroutine Inspection', 'When a server hangs/deadlocks, dumping goroutines instantly shows which lock or channel every goroutine is stuck on!'],
    ],
    jsBridge: 'Delve replaces Chrome DevTools / `node --inspect` with goroutine-aware debugging across parallel threads.',
    pyBridge: 'Replaces `pdb`/`debugpy`, with extra visibility into Go’s goroutine scheduler and memory races.',
    realApp: 'Diagnosing deadlocks in staging, tracing nil-pointer panics from production logs, and pinpointing memory growth.',
    mistake: 'Deploying with `fmt.Println("HERE 1")` scattered everywhere instead of leveled `slog.Debug` and Delve breakpoints.',
    quiz: [
      {
        type: 'Tools',
        q: 'What is the standard interactive debugger for Go (used by VS Code and GoLand)?',
        opts: ['Delve (dlv)', 'gdb-js', 'pdb'],
        ans: 0,
        why: 'Delve understands Go goroutines, interfaces, slices, and runtime internals natively.',
      },
      {
        type: 'Hangs',
        q: 'Your Go server stops responding (suspected deadlock). What is the fastest diagnostic clue?',
        opts: [
          'Inspect a goroutine stack dump (via pprof or SIGQUIT) to see where goroutines are blocked',
          'Reinstall Go',
          'Delete go.sum',
        ],
        ans: 0,
        why: 'Goroutine dumps pinpoint exact file/line numbers waiting on channels or mutexes.',
      },
      {
        type: 'Races',
        q: 'A bug only appears randomly under heavy load when two requests touch shared state. Which tool finds it?',
        opts: ['gofmt', 'Go’s Race Detector (`go test -race` / `go run -race`)', 'go doc'],
        ans: 1,
        why: 'The race detector pinpoints the exact two unsynchronized goroutine stack traces.',
      },
      {
        type: 'Stack Traces',
        q: 'In a Go panic stack trace, where is the exact line that panicked shown?',
        opts: ['At the top of the failing goroutine’s stack frames', 'Always at the bottom line', 'Only in go.mod'],
        ans: 0,
        why: 'Stack traces list the crashing frame first, followed by each caller down to the goroutine origin.',
      },
    ],
  },
  38: {
    summary:
      'Optimize with evidence, never guesses: write `BenchmarkXxx` tests, profile CPU/heap/goroutines with `pprof`, inspect stack vs heap escape analysis (`-gcflags="-m"`), and cut allocations cleanly.',
    mentalModel:
      'Premature optimization wastes time. Measure first with `go test -bench` and `pprof` flame graphs—90% of slowness usually lives in 2% of your code (often unnecessary heap allocations!).',
    lab: 'memory-perf',
    goCode: `// Benchmark example (concat_test.go):
func BenchmarkBuilder(b *testing.B) {
\tfor i := 0; i < b.N; i++ {
\t\tvar sb strings.Builder
\t\tsb.Grow(32)
\t\tsb.WriteString("go-with-taqui")
\t\t_ = sb.String()
\t}
}
// Run: go test -bench=. -benchmem`,
    goOut: `BenchmarkBuilder-8   85000000   13.8 ns/op   32 B/op   1 allocs/op`,
    lines: [
      ['-benchmem', 'Reports `ns/op`, `B/op` (bytes allocated), and `allocs/op`—reducing allocs cuts GC work dramatically!'],
      ['net/http/pprof', 'Exposes live CPU, Heap, and Goroutine profiles you can inspect visually with `go tool pprof -http=:6060`!'],
      ['go build -gcflags="-m"', 'Prints Escape Analysis decisions showing which variables stay fast on the Stack vs escape to the Heap.'],
    ],
    jsBridge: 'Similar to V8 heap snapshots and CPU flame graphs, except Go gives you direct control over stack vs heap allocations and struct layout.',
    pyBridge: 'While Python devs often drop down to C/Rust for speed, pure Go benchmarks and allocation tuning routinely hit tens of millions of ops/sec.',
    realApp: 'Cutting p99 API latency from 120ms to 8ms by pre-sizing slices, using `strings.Builder`, and pooling buffers with `sync.Pool`.',
    mistake:
      'Concatenating strings with `+=` inside a 10,000-iteration loop (allocates 10,000 copies!) instead of `strings.Builder`, or exposing `/debug/pprof` on a public internet port!',
    quiz: [
      {
        type: 'Measurement',
        q: 'Which flag adds memory allocation metrics (`B/op`, `allocs/op`) to `go test -bench=.`?',
        opts: ['-benchmem', '-ram', '-heap'],
        ans: 0,
        why: '`-benchmem` reveals hidden allocations that slow down code and increase GC pressure.',
      },
      {
        type: 'Strings',
        q: 'What is the idiomatic way to build a large string inside a loop with minimal allocations?',
        opts: ['`s += part`', '`strings.Builder` (ideally with `Grow`)', '`fmt.Sprintf` every iteration'],
        ans: 1,
        why: 'Go strings are immutable, so `+=` reallocates repeatedly; `strings.Builder` writes into a single growable buffer.',
      },
      {
        type: 'Security',
        q: 'Why should `/debug/pprof` endpoints NEVER be exposed publicly on the open internet?',
        opts: [
          'They leak internal symbols, memory profiles, and allow attackers to trigger expensive CPU profiling',
          'pprof only works on Windows',
          'It stops HTTP routing',
        ],
        ans: 0,
        why: 'Bind pprof to localhost or an internal admin port behind auth/VPN.',
      },
      {
        type: 'Escape Analysis',
        q: 'What does `go build -gcflags="-m"` show you?',
        opts: [
          'SQL queries',
          'Compiler optimization decisions like inlining and whether variables escape to the heap',
          'Git commit history',
        ],
        ans: 1,
        why: 'Escape analysis output explains why allocations move from stack to heap.',
      },
    ],
  },
  39: {
    summary:
      'Ship resilient production services: structured JSON logging with `log/slog`, 12-factor env configuration, secret safety, `/healthz` + `/readyz` probes, graceful shutdown, timeouts, rate limiting, security headers, and OpenTelemetry observability.',
    mentalModel:
      'Production readiness is like putting seatbelts, smoke detectors, and dashboard gauges in a fast car—so when something breaks at 3 AM, you see WHY in 10 seconds instead of flying blind.',
    lab: 'http-db',
    goCode: `package main

import (
\t"log/slog"
\t"os"
)

func main() {
\tlogger := slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelInfo}))
\tlogger.Info("server_started", "addr", ":8080", "env", "production")
}`,
    goOut: `{"time":"2026-11-20T16:06:00Z","level":"INFO","msg":"server_started","addr":":8080","env":"production"}`,
    lines: [
      ['log/slog (Go 1.21+)', 'Built-in structured key-value logging (JSON for prod, text for dev)—zero external logging library required!'],
      ['Liveness vs Readiness', 'Liveness (`/livez`) checks "is the process alive?"; Readiness (`/readyz`) checks "can I reach Postgres/Redis right now?"'],
      ['Three Pillars of Observability', 'Logs (what happened), Metrics (Prometheus rates/latencies), and Distributed Traces (OpenTelemetry across services).'],
    ],
    jsBridge: 'Replaces `pino`/`winston` + `dotenv` + `helmet` with Go’s built-in `log/slog` and thin standard-library middleware.',
    pyBridge: 'Replaces `structlog` + `pydantic-settings` + health-check routes with zero-dependency structured logging and crisp signal handling.',
    realApp: 'Every cloud microservice running behind Kubernetes, Nginx, Datadog, Grafana, or Prometheus.',
    mistake:
      'Logging raw user passwords/JWTs in `slog`, hardcoding secrets in Git, or checking Postgres inside a Liveness probe (causing Kubernetes restart storms when DB blinks!).',
    quiz: [
      {
        type: 'Logging',
        q: 'Which standard Go package provides structured JSON logging out of the box (Go 1.21+)?',
        opts: ['log/slog', 'fmt/jsonlog', 'os/log'],
        ans: 0,
        why: '`log/slog` delivers high-performance structured logging right in the standard library.',
      },
      {
        type: 'Probes',
        q: 'Why should a Liveness probe NOT fail when an external third-party API goes down?',
        opts: [
          'Failing liveness restarts your container repeatedly even though restarting won’t fix the external API (use Readiness for dependency checks!)',
          'Liveness probes cannot return 200',
          'Kubernetes ignores liveness',
        ],
        ans: 0,
        why: 'Readiness removes a pod from traffic cleanly; Liveness restarts stuck/deadlocked processes.',
      },
      {
        type: 'Secrets',
        q: 'Where should production database passwords and LLM API keys live?',
        opts: [
          'Committed in config.go',
          'Injected via environment variables or a Secrets Manager (Vault/AWS/K8s Secrets)',
          'Inside HTML comments',
        ],
        ans: 1,
        why: 'Never hardcode secrets in source control—inject them at runtime and rotate regularly.',
      },
      {
        type: 'Observability',
        q: 'What are the three classic pillars of production observability?',
        opts: ['Logs, Metrics, and Traces', 'HTML, CSS, and JS', 'Arrays, Slices, and Maps'],
        ans: 0,
        why: 'Metrics alert you, Traces show where latency lives, and structured Logs explain the exact failure.',
      },
    ],
  },
  40: {
    summary:
      'Write type-safe reusable algorithms and data structures with Go Generics (Go 1.18+): type parameters `[T any]`, constraints (`comparable`, `cmp.Ordered`), union type sets (`~int | ~float64`), generic structs/interfaces, and knowing when NOT to use them.',
    mentalModel:
      'Before generics, writing `Min(a, b)` for `int`, `int64`, and `float64` meant writing 3 identical functions. Generics let you write ONE clean blueprint stamped safely for each type at compile time.',
    lab: 'memory-perf',
    goCode: `package main

import (
\t"cmp"
\t"fmt"
)

func Max[T cmp.Ordered](a, b T) T {
\tif a > b { return a }
\treturn b
}

func main() {
\tfmt.Println(Max(10, 42), Max(3.14, 2.71), Max("go", "taqui"))
}`,
    goOut: `42 3.14 taqui`,
    lines: [
      ['[T cmp.Ordered]', 'Type parameter `T` constrained to ordered types (`int`, `float64`, `string`, etc.) using standard `cmp` package.'],
      ['~int (Tilde approximation)', 'Matches `int` AND any custom defined type whose underlying type is `int` (like `type Score int`).'],
      ['When NOT to use Generics', 'If you just need different behaviors (like `io.Reader` or `Payer`), use a regular Interface—don’t over-genericize!'],
    ],
    jsBridge: 'TypeScript generics use angle brackets `<T>` and disappear at runtime; Go generics use square brackets `[T Constraint]` and generate real compiled code.',
    pyBridge: 'Python `Generic[T]` is only a static hint ignored at runtime; Go enforces constraints strictly during compilation.',
    realApp: 'Standard `slices` and `maps` packages, generic API response wrappers `Response[T]`, caches `Cache[K comparable, V any]`, and worker-pool pipelines.',
    mistake: 'Adding generics everywhere when a plain interface or concrete type is simpler and more readable.',
    quiz: [
      {
        type: 'Syntax',
        q: 'What constraint allows a generic type parameter `K` to be used as a Go map key (`map[K]V`)?',
        opts: ['any', 'comparable', 'stringable'],
        ans: 1,
        why: 'Map keys in Go must support `==` and `!=`, which is guaranteed by the built-in `comparable` constraint.',
      },
      {
        type: 'Tilde',
        q: 'In a union constraint `type Number interface { ~int | ~float64 }`, what does the `~` mean?',
        opts: [
          'Approximate equality',
          'Includes `int` PLUS any custom defined type whose underlying type is `int`',
          'Excludes int',
        ],
        ans: 1,
        why: 'The tilde `~` lets custom types like `type UserID int` satisfy the constraint.',
      },
      {
        type: 'Best Practice',
        q: 'When should you prefer a standard Go Interface over Generics?',
        opts: [
          'When you want different types to provide different behavior via methods (e.g., `io.Reader`)',
          'When building a generic `Stack[T]`',
          'Never use interfaces again',
        ],
        ans: 0,
        why: 'Use interfaces for polymorphic behavior; use generics for type-agnostic data structures and container algorithms.',
      },
      {
        type: 'Stdlib',
        q: 'Which Go standard library packages provide modern generic helpers like `Contains`, `Sort`, and `Clone`?',
        opts: ['`slices`, `maps`, and `cmp`', '`generics/util`', '`lodash`'],
        ans: 0,
        why: 'Go 1.21+ includes `slices`, `maps`, and `cmp` built directly on generics.',
      },
    ],
  },
  41: {
    summary:
      'Understand how Go manages memory automatically with ultra-low-latency Garbage Collection: fast Stack frames vs Heap allocations, Escape Analysis, struct field alignment padding, memory leaks, and `GOGC`/`GOMEMLIMIT` tuning.',
    mentalModel:
      'The Stack is your scratchpad desk (instant allocation & cleanup when a function returns). The Heap is the warehouse (checked by Go’s concurrent Garbage Collector). Keep short-lived data on the desk!',
    lab: 'memory-perf',
    goCode: `package main

import (
\t"fmt"
\t"unsafe"
)

type BadOrder  struct { A bool; B int64; C bool } // 24 bytes (padding waste!)
type GoodOrder struct { B int64; A bool; C bool } // 16 bytes (aligned!)

func main() {
\tfmt.Printf("Bad=%d bytes | Good=%d bytes\\n", unsafe.Sizeof(BadOrder{}), unsafe.Sizeof(GoodOrder{}))
}`,
    goOut: `Bad=24 bytes | Good=16 bytes`,
    lines: [
      ['Escape Analysis', 'If a function returns `&localVar`, Go automatically moves it to the Heap so the pointer stays valid (no dangling C pointers!).'],
      ['Struct Field Alignment', 'Ordering struct fields from largest (int64/string) to smallest (bool/int8) saves real RAM in large slices!'],
      ['GOGC & GOMEMLIMIT', '`GOGC=100` (default) triggers GC when live heap doubles; `GOMEMLIMIT` (Go 1.19+) sets a soft memory ceiling for containers!'],
    ],
    jsBridge: 'V8 runs a generational GC over mostly heap-allocated JS objects. Go’s value structs + stack allocation drastically reduce GC workload and keep pause times sub-millisecond.',
    pyBridge: 'Python relies on reference counting + cyclic GC with heavy per-object overhead (~28+ bytes per int). Go packs structs contiguously with zero object headers.',
    realApp: 'Fitting Go microservices comfortably into 128MB–256MB Kubernetes pods using `GOMEMLIMIT` without OOMKills.',
    mistake:
      'Thinking GC means "Go cannot leak memory"—forgotten global slices, unclosed HTTP bodies, and blocked goroutines still leak RAM!',
    quiz: [
      {
        type: 'Layout',
        q: 'Why does `struct{ A bool; B int64; C bool }` take 24 bytes instead of 10 bytes on 64-bit CPUs?',
        opts: [
          'CPU memory alignment adds padding bytes around `int64` (8-byte boundary)',
          'Booleans take 8 bytes each',
          'Go adds a header to every field',
        ],
        ans: 0,
        why: 'Placing largest fields first (`int64`, then `bool`, `bool`) shrinks the struct to 16 bytes!',
      },
      {
        type: 'Leaks',
        q: 'Can a garbage-collected Go program still suffer from memory leaks?',
        opts: [
          'No, GC prevents all leaks',
          'Yes—e.g., leaked goroutines, growing global caches, or sub-slices pinning huge backing arrays',
          'Only with CGO',
        ],
        ans: 1,
        why: 'GC only frees unreachable memory; anything still referenced stays in RAM.',
      },
      {
        type: 'Escape Analysis',
        q: 'What happens in Go if a function returns the address (`&x`) of a local variable?',
        opts: ['Dangling pointer crash like C', 'Go’s escape analysis safely allocates `x` on the heap', 'Compile error'],
        ans: 1,
        why: 'Go guarantees memory safety by promoting escaping locals to the heap automatically.',
      },
      {
        type: 'Containers',
        q: 'Which Go environment variable (Go 1.19+) sets a soft memory ceiling to prevent Docker/K8s OOMKills?',
        opts: ['GOMEMLIMIT', 'MAX_HEAP_JS', 'GO_RAM_CAP'],
        ans: 0,
        why: 'Setting `GOMEMLIMIT` (e.g., 85% of container RAM) makes the GC work harder before hitting the OS memory kill limit.',
      },
    ],
  },
  42: {
    summary:
      'Know Go’s power-user tools—and when to use them sparingly: `reflect` metadata inspection, `runtime` helpers, method values/expressions, build tags (`//go:build`), platform-specific files (`_linux.go`), `unsafe`, and CGO.',
    mentalModel:
      'Reflection and `unsafe` are surgical scalpels in a locked cabinet: standard libraries like `encoding/json` need them, but 95% of everyday app code is safer and faster without them.',
    lab: 'memory-perf',
    goCode: `package main

import (
\t"fmt"
\t"reflect"
)

type User struct {
\tEmail string \`validate:"required"\`
}

func main() {
\tt := reflect.TypeOf(User{})
\tf := t.Field(0)
\tfmt.Println("Field:", f.Name, "| Tag:", f.Tag.Get("validate"))
}`,
    goOut: `Field: Email | Tag: required`,
    lines: [
      ['reflect.TypeOf / ValueOf', 'Reads struct tags and types at runtime (how JSON encoders and struct validators work).'],
      ['//go:build linux', 'Build constraints include or exclude files per OS/architecture or custom feature flags (`go build -tags=prod`).'],
      ['CGO & unsafe', 'CGO calls C libraries (e.g., SQLite C driver) at the cost of slower builds & harder cross-compilation; `unsafe` bypasses Go’s type safety.'],
    ],
    jsBridge: 'Reflection resembles JS `Object.keys`/Proxy inspection; method values (`fn := user.Save`) work like pre-bound `user.Save.bind(user)`!',
    pyBridge:
      'Comparable to Python’s `inspect`/`getattr` and `ctypes`/`Cython`, except Go discourages runtime reflection on hot paths because compile-time code is vastly faster.',
    realApp: 'Writing a struct validator reading `validate:"required"` tags, or shipping OS-specific terminal code in `tty_unix.go` vs `tty_windows.go`.',
    mistake: 'Using `reflect` where generics or a simple interface solves the problem cleanly and 20x faster.',
    quiz: [
      {
        type: 'Reflection',
        q: 'How does `encoding/json` read your `json:"user_id"` struct tags at runtime?',
        opts: ['Using the `reflect` package', 'By parsing .go source files at runtime', 'Using CGO'],
        ans: 0,
        why: '`reflect.TypeOf` exposes struct field metadata and tags at runtime.',
      },
      {
        type: 'Build Constraints',
        q: 'How do you restrict a Go file to compile ONLY on Linux?',
        opts: [
          'Add `//go:build linux` at the top (or name the file `foo_linux.go`)',
          'Wrap the file in `if os == "linux"`',
          'Put it in `go.sum`',
        ],
        ans: 0,
        why: 'Both `//go:build` tags and filename suffixes (`_linux.go`, `_windows.go`) control platform compilation.',
      },
      {
        type: 'CGO Trade-off',
        q: 'What is a well-known downside of enabling CGO (`CGO_ENABLED=1`)?',
        opts: [
          'Slower builds, C toolchain dependency, and harder cross-compilation',
          'Go loses goroutines',
          'JSON stops working',
        ],
        ans: 0,
        why: 'Pure-Go binaries (`CGO_ENABLED=0`) cross-compile effortlessly into tiny scratch Docker images.',
      },
      {
        type: 'Method Values',
        q: 'What is `f := counter.Inc` (without parentheses) called in Go?',
        opts: [
          'A Method Value (captures the receiver `counter`, ready to call as `f()`)',
          'A syntax error',
          'A pointer leak',
        ],
        ans: 0,
        why: 'Method values bind the receiver cleanly so you can pass them as plain `func()` callbacks.',
      },
    ],
  },
  43: {
    summary:
      'Master the complete Go Toolchain: `go fmt`, `go vet`, `go test`, `go build`, `go install`, `go generate`, multi-module workspaces (`go work`), one-line cross-compilation (`GOOS`/`GOARCH`), and `golangci-lint`.',
    mentalModel:
      'Most languages need 6 separate third-party tools for formatting, vetting, building, testing, and cross-compiling. Go ships an entire Swiss watchmaker’s bench inside one `go` command.',
    lab: 'memory-perf',
    goCode: `// Cross-compile a static Linux ARM64 binary right from Windows or macOS:
// CGO_ENABLED=0 GOOS=linux GOARCH=arm64 go build -ldflags="-s -w" -o bin/api ./cmd/api
//
// Quality gate before every commit:
// gofmt -w .
// go vet ./...
// go test -race ./...
// golangci-lint run`,
    goOut: `Built self-contained static binary: bin/api (Linux ARM64, stripped debug symbols)`,
    lines: [
      ['GOOS / GOARCH', 'Cross-compile for Linux, macOS, or Windows in ONE command with zero VM needed!'],
      ['go generate', 'Runs `//go:generate` directives (like `sqlc`, `protoc`, or `stringer`) reproducibly.'],
      ['go work', 'Multi-module workspaces let you edit two local Go repos together without touching `go.mod` replace hacks.'],
    ],
    jsBridge: 'Replaces Prettier + ESLint basics + tsc + esbuild + Jest with unified native commands (plus `golangci-lint` for deep team linting).',
    pyBridge: 'Replaces black + ruff + pytest + PyInstaller with effortless native cross-compilation.',
    realApp: 'Building tiny 10MB Linux server binaries on a MacBook/Windows laptop and enforcing zero-warning CI checks.',
    mistake:
      'Forgetting `CGO_ENABLED=0` when building a binary for Alpine/scratch Docker containers (resulting in `not found` dynamic glibc errors!).',
    quiz: [
      {
        type: 'Cross-Compile',
        q: 'Which environment variables let you build a Linux AMD64 binary directly on a Windows or macOS laptop?',
        opts: ['`GOOS=linux GOARCH=amd64 go build`', '`TARGET=linux go run`', '`OS_BUILD=linux go fmt`'],
        ans: 0,
        why: 'Go’s compiler natively cross-compiles to any supported OS/CPU pair via `GOOS` and `GOARCH`.',
      },
      {
        type: 'Static Analysis',
        q: 'What does `go vet ./...` check for?',
        opts: [
          'Code indentation',
          'Suspicious constructs that compile but are likely bugs (like printf format mismatches or copying a mutex)',
          'Docker image sizes',
        ],
        ans: 1,
        why: '`go vet` catches subtle real bugs that the compiler itself permits.',
      },
      {
        type: 'Workspaces',
        q: 'What is `go work` (`go.work`) used for?',
        opts: [
          'Working across multiple local Go modules simultaneously during development',
          'Starting a worker pool',
          'Running cron jobs',
        ],
        ans: 0,
        why: '`go.work` lets you test changes across multiple local modules cleanly without editing `go.mod`.',
      },
      {
        type: 'Binary Size',
        q: 'What does `-ldflags="-s -w"` do during `go build`?',
        opts: [
          'Disables Goroutines',
          'Strips symbol table and DWARF debug info to shrink the binary size',
          'Turns on race detection',
        ],
        ans: 1,
        why: 'Stripping debug tables typically cuts production binary size by 25–35%.',
      },
    ],
  },
  44: {
    summary:
      'Think like a distributed systems engineer: monolith vs microservices, sync vs async communication, eventual consistency, idempotency keys, exponential backoff retries with jitter, circuit breakers, load balancing, and fault tolerance.',
    mentalModel:
      'In a distributed system, assume the network WILL drop packets and servers WILL restart mid-request. Idempotency + retries with jitter + circuit breakers keep one sick service from knocking down the whole company.',
    lab: 'distributed-ai',
    goCode: `// Idempotent payment check + exponential backoff with jitter concept:
func backoff(attempt int) time.Duration {
\tbase := 100 * time.Millisecond << attempt // 100ms, 200ms, 400ms...
\tjitter := time.Duration(rand.IntN(50)) * time.Millisecond
\treturn base + jitter // Jitter prevents thundering-herd retry storms!
}`,
    goOut: `Attempt 0 -> ~124ms, Attempt 1 -> ~238ms, Attempt 2 -> ~419ms`,
    lines: [
      ['Idempotency', 'Sending the same `Idempotency-Key` twice charges the customer ONCE, never twice!'],
      ['Circuit Breaker', 'Stops hammering an already-failing downstream service (Open state) until a probe succeeds (Half-Open -> Closed).'],
      ['Eventual Consistency', 'Async queues decouple services; read replicas catch up milliseconds later rather than blocking every write.'],
    ],
    jsBridge:
      'Exact same architectural principles apply across Node, Python, and Go microservices—Go excels here because fast timeouts, context cancellation, and low memory shine at scale.',
    pyBridge:
      'Go’s predictable latency and tiny binaries make Go the industry favorite for load balancers, service meshes, and API gateways.',
    realApp: 'Payment gateways (Stripe-style idempotency keys), resilient checkout pipelines, and multi-region SaaS backends.',
    mistake:
      'Retrying non-idempotent POST requests without an idempotency key, or retrying without jitter (causing a thundering herd that DDoSes your own recovering DB!).',
    quiz: [
      {
        type: 'Safety',
        q: 'What does making a payment endpoint "Idempotent" guarantee?',
        opts: [
          'Retrying the exact same request with the same Idempotency-Key will NOT charge the user twice',
          'The endpoint runs in under 1ms',
          'It skips authentication',
        ],
        ans: 0,
        why: 'Network timeouts happen after a server commits—idempotency keys make retries completely safe.',
      },
      {
        type: 'Resilience',
        q: 'What problem does a Circuit Breaker pattern solve?',
        opts: [
          'Encrypts passwords',
          'Prevents cascading failures by failing fast when a downstream dependency is already overloaded/down',
          'Compresses JSON',
        ],
        ans: 1,
        why: 'Opening the circuit gives the struggling service breathing room to recover instead of piling up hung requests.',
      },
      {
        type: 'Retries',
        q: 'Why do we add random "Jitter" to exponential backoff retries?',
        opts: [
          'So thousands of failing clients don’t retry at the exact same millisecond (thundering herd)',
          'To make code harder to read',
          'Required by TCP',
        ],
        ans: 0,
        why: 'Jitter spreads retry waves smoothly across time.',
      },
      {
        type: 'Trade-offs',
        q: 'Why does synchronous HTTP chaining (Service A -> B -> C -> D) reduce overall availability?',
        opts: [
          'If ANY single service in the chain fails or slows down, the entire user request fails',
          'HTTP cannot call another service',
          'Sync calls skip DNS',
        ],
        ans: 0,
        why: 'Use async queues/events for non-critical work like sending emails or analytics.',
      },
    ],
  },
  45: {
    summary:
      'Scale workloads off the hot request path with caching and message brokers: Redis (`go-redis`), cache-aside & TTLs, Pub/Sub, RabbitMQ vs Kafka, background jobs, worker pools, retries, and Dead-Letter Queues (DLQs).',
    mentalModel:
      'Redis is your sticky-note cache right next to the phone; RabbitMQ is a smart post office deleting each letter once delivered; Kafka is a permanent replayable ledger log that multiple teams can read independently.',
    lab: 'distributed-ai',
    goCode: `// Cache-Aside Pattern with Redis (github.com/redis/go-redis/v9):
// val, err := rdb.Get(ctx, "user:42").Result()
// if errors.Is(err, redis.Nil) {
//     val, err = db.FetchUser(ctx, 42)                      // 1. Cache miss -> hit Postgres
//     _ = rdb.Set(ctx, "user:42", val, 5*time.Minute).Err() // 2. Populate TTL cache
// }
// return val`,
    goOut: `Cache HIT: <1ms from Redis | Cache MISS: load from Postgres & cache for 5m`,
    lines: [
      ['Redis Cache-Aside', 'Always set a TTL expiration so stale data never lives forever, and handle `redis.Nil` gracefully.'],
      ['RabbitMQ vs Kafka', 'RabbitMQ excels at flexible task routing & per-message acks; Kafka excels at high-throughput ordered event streams with replay.'],
      ['Dead-Letter Queue (DLQ)', 'After N failed retries, poison messages move to a DLQ for human inspection instead of blocking the whole queue forever!'],
    ],
    jsBridge: 'Replaces `ioredis` + `BullMQ` with `go-redis` + `Asynq` / `River` / `Watermill` / `franz-go` at a fraction of the RAM.',
    pyBridge: 'Replaces `redis-py` + `Celery` workers with single-binary Go worker pools that boot instantly and use all CPU cores.',
    realApp: 'Sending transactional emails, generating PDF invoices, rate limiting in Redis, and streaming clickstream events via Kafka.',
    mistake:
      'Using Redis without TTLs (runs out of memory), forgetting idempotency in consumers (at-least-once delivery CAN deliver a message twice!), or skipping a DLQ.',
    quiz: [
      {
        type: 'Brokers',
        q: 'What is a key difference between Kafka and traditional RabbitMQ queues?',
        opts: [
          'Kafka stores an append-only durable log allowing replay by multiple consumer groups; RabbitMQ typically removes messages once acknowledged',
          'Kafka cannot use Go',
          'RabbitMQ is a SQL database',
        ],
        ans: 0,
        why: 'Kafka’s partitioned log lets analytics, billing, and search services independently replay the same event stream.',
      },
      {
        type: 'Reliability',
        q: 'What is a Dead-Letter Queue (DLQ) for?',
        opts: [
          'Deleting expired Redis caches',
          'Isolating repeatedly failing "poison" messages after max retries so healthy jobs keep flowing',
          'Storing user passwords',
        ],
        ans: 1,
        why: 'Without a DLQ, one malformed job can loop infinitely and starve the worker pool.',
      },
      {
        type: 'Caching',
        q: 'In the Cache-Aside pattern, what happens on a cache MISS?',
        opts: [
          'Return 404 immediately',
          'Fetch from the primary DB, store the result in Redis with a TTL, and return it',
          'Restart Redis',
        ],
        ans: 1,
        why: 'Cache-aside populates Redis lazily on demand.',
      },
      {
        type: 'Delivery',
        q: 'Most production message queues guarantee "At-Least-Once" delivery. What must your Go consumer therefore be?',
        opts: ['Idempotent (safely handles receiving the same event ID twice)', 'Single-threaded only', 'Stateless with no DB'],
        ans: 0,
        why: 'Because retries can deliver duplicates, consumers must deduplicate or make state updates idempotent.',
      },
    ],
  },
  46: {
    summary:
      'Connect services at blazing speed with RPC & real-time protocols: Protocol Buffers (`.proto`), gRPC (Unary, Server/Client/Bidirectional streaming), choosing REST vs gRPC, WebSockets, SSE, and API Gateways.',
    mentalModel:
      'REST sends human-readable JSON envelopes; gRPC uses `.proto` blueprints to pack compact binary frames over HTTP/2—like switching from handwritten letters to multiplexed fiber-optic packets.',
    lab: 'distributed-ai',
    goCode: `// user.proto (Schema contract generating type-safe Go client & server!)
syntax = "proto3";
service UserService {
  rpc GetUser (GetUserReq) returns (UserResp);               // Unary RPC
  rpc WatchEvents (WatchReq) returns (stream EventResp);     // Server Streaming
}
message GetUserReq { int64 id = 1; }
message UserResp   { int64 id = 1; string email = 2; }`,
    goOut: `protoc generates strongly typed Go stubs -> client.GetUser(ctx, &pb.GetUserReq{Id: 42})`,
    lines: [
      ['Protocol Buffers', 'Compact binary wire format with strict field numbers (`= 1`, `= 2`)—never reuse deleted field numbers!'],
      ['4 gRPC Modes', 'Unary (1 req -> 1 resp), Server Streaming, Client Streaming, and Bidirectional Streaming over HTTP/2.'],
      ['REST vs gRPC', 'Use REST/JSON for public browser/partner APIs; use gRPC for fast, strongly typed internal microservice-to-microservice calls!'],
    ],
    jsBridge:
      'Browsers typically talk JSON/REST (or ConnectRPC / gRPC-Web via an API Gateway), while backend Go services talk native binary gRPC over HTTP/2.',
    pyBridge:
      'Because `.proto` files are language-neutral, a Go backend can call a Python ML inference microservice via gRPC with auto-generated typed clients on both sides!',
    realApp: 'Connecting a Go API gateway to a Python ML/embedding service or internal billing/inventory microservices with sub-millisecond serialization.',
    mistake:
      'Reusing an old deleted Protobuf field number (`= 3`), which silently corrupts decoding for older deployed clients—mark removed numbers `reserved 3;`.',
    quiz: [
      {
        type: 'Protobuf Rules',
        q: 'Why must you NEVER reuse a deleted field number (like `= 2`) in a `.proto` schema?',
        opts: [
          'Protobuf encodes field numbers on the wire, so old clients/messages will misread the new field type',
          'Go forbids numbers below 5',
          'gRPC only allows 1 field',
        ],
        ans: 0,
        why: 'Field numbers define the binary wire identity; always mark deleted numbers with `reserved`.',
      },
      {
        type: 'Protocol Choice',
        q: 'When is gRPC usually preferred over REST/JSON?',
        opts: [
          'Public browser-facing REST APIs',
          'High-throughput internal service-to-service calls and bidirectional streaming with strict contracts',
          'Serving static HTML images',
        ],
        ans: 1,
        why: 'gRPC shines for low-latency internal polyglot services and streaming over HTTP/2.',
      },
      {
        type: 'Transport',
        q: 'Which HTTP version powers gRPC’s multiplexed bidirectional streaming?',
        opts: ['HTTP/1.0', 'HTTP/2', 'SMTP'],
        ans: 1,
        why: 'HTTP/2 enables multiplexed binary streams, header compression, and full-duplex streaming on a single TCP connection.',
      },
      {
        type: 'Gateway',
        q: 'What role does an API Gateway play in front of gRPC microservices?',
        opts: [
          'Terminates TLS, enforces auth/rate limits, and translates public REST/JSON requests into internal gRPC calls',
          'Replaces PostgreSQL',
          'Compiles Go code in the browser',
        ],
        ans: 0,
        why: 'An API Gateway gives external clients a clean unified edge while keeping internal services fast and focused.',
      },
    ],
  },
  47: {
    summary:
      'Architect resilient microservices without creating a distributed monolith: crisp service boundaries, database-per-service, distributed tracing (OpenTelemetry), centralized logging, Saga orchestration, and the Transactional Outbox pattern.',
    mentalModel:
      'Each microservice owns its own notebook (database)—nobody scribbles directly in another team’s notebook. When an order updates both DB and Kafka, the Outbox pattern guarantees neither gets lost on a crash!',
    lab: 'distributed-ai',
    goCode: `// Transactional Outbox Pattern (atomic DB write + reliable event publishing):
// BEGIN;
//   INSERT INTO orders (id, total) VALUES ($1, $2);
//   INSERT INTO outbox_events (id, topic, payload) VALUES ($3, 'order.created', $4);
// COMMIT;
// Background Go relay worker polls outbox_events -> publishes to Kafka -> marks sent!`,
    goOut: `Zero dual-write inconsistency: if DB commits, the event is GUARANTEED to reach Kafka.`,
    lines: [
      ['Database per Service', 'Prevents hidden schema coupling so teams can deploy and scale services independently.'],
      ['Transactional Outbox', 'Solves the dual-write bug (DB succeeds but Kafka publish crashes) by storing the event in the same SQL transaction!'],
      ['Saga Pattern', 'Coordinates multi-service workflows (Reserve Stock -> Charge Card -> Ship) using compensating actions if a step fails.'],
    ],
    jsBridge: 'Matches event-driven microservice patterns used with Node/Kafka, with Go’s tiny memory footprint allowing dozens of lean services per node.',
    pyBridge: 'OpenTelemetry (`go.opentelemetry.io/otel`) propagates `traceparent` headers seamlessly between Go services and Python workers.',
    realApp: 'E-commerce checkout spanning Orders, Payments, Inventory, and Notifications with full OpenTelemetry trace waterfall views.',
    mistake:
      'Sharing one giant database schema across 8 microservices (a "distributed monolith") or doing dual writes (`db.Save()` then `kafka.Publish()`) without an Outbox.',
    quiz: [
      {
        type: 'Data Integrity',
        q: 'What classic distributed-systems bug does the Transactional Outbox pattern solve?',
        opts: [
          'The dual-write problem where a DB commit succeeds but publishing to Kafka/RabbitMQ fails mid-crash',
          'CSS layout shifting',
          'Slow Go compilation',
        ],
        ans: 0,
        why: 'Writing business state and the outbox event inside one local ACID transaction makes event delivery reliable.',
      },
      {
        type: 'Workflows',
        q: 'In the Saga pattern, what happens if Step 3 (Payment) fails after Step 2 (Reserve Inventory) succeeded?',
        opts: [
          'The system executes a compensating action (Release Inventory) to undo Step 2 cleanly',
          'All servers reboot',
          'The error is ignored',
        ],
        ans: 0,
        why: 'Sagas replace brittle distributed 2-phase locks with local transactions + compensating rollbacks.',
      },
      {
        type: 'Observability',
        q: 'How does Distributed Tracing track a single user request across 6 microservices?',
        opts: [
          'By propagating a shared Trace ID header (e.g., W3C `traceparent`) through `context.Context` across every hop',
          'By guessing from timestamps',
          'By writing to local text files only',
        ],
        ans: 0,
        why: 'OpenTelemetry attaches trace/span IDs to HTTP/gRPC headers and Kafka messages so you see the complete waterfall.',
      },
      {
        type: 'Boundaries',
        q: 'Why does microservices architecture recommend "Database per Service"?',
        opts: [
          'So services stay loosely coupled and can evolve schemas, scale, and deploy independently',
          'Because PostgreSQL allows only one table',
          'To double latency',
        ],
        ans: 0,
        why: 'Shared databases create tight coupling where one service’s migration breaks five others.',
      },
    ],
  },
  48: {
    summary:
      'Package Go services into ultra-small, secure Docker images using Multi-Stage Builds (`golang:alpine` builder -> `distroless`/`scratch` runtime under 15MB!), Docker Compose for local Postgres/Redis, and non-root container hardening.',
    mentalModel:
      'Stage 1 is your messy carpentry workshop (Go compiler + source files = 800MB). Stage 2 copies ONLY the finished wooden chair (one static binary = 12MB) into an empty showroom container!',
    lab: 'distributed-ai',
    goCode: `# Multi-Stage Production Dockerfile for Go (~12MB final image!)
FROM golang:1.24-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o /api ./cmd/api

FROM gcr.io/distroless/static-debian12:nonroot
COPY --from=builder /api /api
EXPOSE 8080
USER nonroot:nonroot
ENTRYPOINT ["/api"]`,
    goOut: `Image size shrunk from 860MB -> 14MB with zero shell, zero root user, and TLS CA certs included!`,
    lines: [
      ['COPY go.mod go.sum + go mod download first', 'Maximizes Docker layer caching so code edits don’t re-download every Go module!'],
      ['CGO_ENABLED=0', 'Produces a fully static binary that runs cleanly in `scratch` or `distroless/static` with zero glibc dependency.'],
      ['distroless:nonroot', 'Ships CA root certificates (needed for HTTPS/OpenAI calls!) and runs as non-root with no shell for attackers.'],
    ],
    jsBridge: 'Node Docker images routinely weigh 200MB–600MB with `node_modules`. A multi-stage Go image weighs ~12MB and cold-starts in milliseconds!',
    pyBridge: 'Python images ship the Python runtime + C wheels (often 400MB+). Go compiles away the entire toolchain before shipping.',
    realApp: 'Spinning up Go API + Postgres + Redis locally with `docker compose up` and pushing tiny signed images to GHCR/ECR.',
    mistake:
      'Using `FROM scratch` without copying `/etc/ssl/certs/ca-certificates.crt` (every outbound HTTPS call fails with `x509: certificate signed by unknown authority`!).',
    quiz: [
      {
        type: 'Caching',
        q: 'Why do Go Dockerfiles `COPY go.mod go.sum ./` and run `go mod download` BEFORE `COPY . .`?',
        opts: [
          'So Docker caches the downloaded dependencies layer and skips re-downloading them when only `.go` code changes',
          'Docker refuses to copy .go files first',
          'Required by gofmt',
        ],
        ans: 0,
        why: 'Layer ordering cuts CI Docker build times from minutes down to seconds.',
      },
      {
        type: 'Security & Size',
        q: 'What is the biggest benefit of a Multi-Stage Dockerfile for Go?',
        opts: [
          'Drops the ~800MB Go compiler/SDK and source code, leaving only a tiny static binary in a minimal non-root runtime image',
          'Allows running Python inside Go',
          'Disables HTTPS',
        ],
        ans: 0,
        why: 'Smaller images deploy faster, cost less bandwidth, and drastically shrink your security attack surface.',
      },
      {
        type: 'TLS Gotcha',
        q: 'If your Go binary in a `FROM scratch` image fails outbound HTTPS calls with an x509 error, what is missing?',
        opts: ['CA root certificates (included automatically in `distroless/static`)', 'Node.js', 'A bash shell'],
        ans: 0,
        why: 'An empty `scratch` image has no `/etc/ssl/certs` bundle unless you copy them or use `distroless/static`.',
      },
      {
        type: 'Local Dev',
        q: 'What does `docker compose` simplify during Go backend development?',
        opts: [
          'Starting your Go app alongside PostgreSQL, Redis, and Kafka on a shared isolated network with one command',
          'Formatting Go files',
          'Compiling ARM binaries',
        ],
        ans: 0,
        why: 'Docker Compose makes local multi-service development reproducible across every teammate’s laptop.',
      },
    ],
  },
  49: {
    summary:
      'Automate confidence on every push with CI/CD pipelines: GitHub Actions workflows running `go vet`, `go test -race`, `golangci-lint`, cached Go builds, immutable Docker image publishing, and semantic versioned releases.',
    mentalModel:
      'CI is your tireless robot quality inspector checking every pull request before merge; CD is your automated conveyor belt pushing verified, tagged artifacts smoothly to staging and production.',
    lab: 'distributed-ai',
    goCode: `# .github/workflows/ci.yml (Fast, cached Go CI pipeline)
# on: [push, pull_request]
# jobs:
#   verify:
#     runs-on: ubuntu-latest
#     steps:
#       - uses: actions/checkout@v4
#       - uses: actions/setup-go@v5
#         with: { go-version-file: 'go.mod', cache: true }
#       - run: go vet ./...
#       - run: go test -race -cover ./...
#       - run: CGO_ENABLED=0 go build ./cmd/api`,
    goOut: `CI Pipeline PASSED in 28s: go vet OK | go test -race (94% cover) OK | binary built`,
    lines: [
      ['go-version-file: go.mod', 'Keeps CI’s Go compiler version locked cleanly to your repository’s `go.mod`.'],
      ['go test -race in CI', 'Catches concurrency bugs automatically on every pull request before they ever reach production!'],
      ['Immutable tags (`sha-...` / `v1.4.2`)', 'Deploy exact commit-SHA or SemVer Docker tags—never blindly deploy `:latest` in production!'],
    ],
    jsBridge: 'Much faster than JS CI pipelines because Go’s built-in compiler, module cache, and `go test` finish in seconds.',
    pyBridge: 'Eliminates "works on my virtualenv" surprises by verifying static types, races, and builds cleanly in one fast pipeline.',
    realApp: 'Auto-testing PRs, publishing tagged multi-arch Docker images to GHCR, and releasing CLI binaries with GoReleaser.',
    mistake:
      'Tagging every production Docker deploy as `:latest` (makes instant rollbacks impossible!) or skipping `-race` in CI.',
    quiz: [
      {
        type: 'Release Safety',
        q: 'Why should production CD pipelines deploy an immutable image tag (like `v1.2.3` or Git SHA) instead of `:latest`?',
        opts: [
          'So you know the exact code running and can roll back deterministically to the previous tag',
          'Docker forbids `:latest`',
          'Immutable tags skip CI tests',
        ],
        ans: 0,
        why: 'Mutable `:latest` tags blur which build is running and break predictable rollbacks.',
      },
      {
        type: 'Quality Gate',
        q: 'Which three Go commands form the core fast CI verification gate on every PR?',
        opts: ['`go vet ./...`, `go test -race ./...`, and `go build ./...`', '`go run`, `go doc`, `go env`', '`npm audit` only'],
        ans: 0,
        why: 'Static analysis, race-checked tests, and full compilation catch bugs before merge.',
      },
      {
        type: 'Speed',
        q: 'How does `actions/setup-go` speed up repeated CI runs?',
        opts: ['By caching Go’s module download cache and build cache across runs', 'By skipping tests', 'By deleting go.sum'],
        ans: 0,
        why: 'Caching `~/go/pkg/mod` and `~/.cache/go-build` slashes CI runtime dramatically.',
      },
      {
        type: 'Artifacts',
        q: 'What is a popular Go tool for automatically building cross-platform CLI binaries, checksums, and GitHub Releases on Git tags?',
        opts: ['GoReleaser', 'Webpack', 'Pipenv'],
        ans: 0,
        why: 'GoReleaser automates multi-OS/arch builds, Homebrew formulas, and Docker publishing on every SemVer tag.',
      },
    ],
  },
  50: {
    summary:
      'Deploy and operate Go binaries reliably on Linux VPS or Cloud platforms: `systemd` services, reverse proxies (Nginx / Caddy with automatic HTTPS), managed databases, centralized logs, alerting, and instant zero-drama rollbacks.',
    mentalModel:
      'Put Nginx or Caddy at the front door to handle HTTPS certificates and HTTP/3 compression, forwarding traffic locally (`127.0.0.1:8080`) to your Go binary supervised by `systemd` (so it auto-restarts if anything crashes!).',
    lab: 'distributed-ai',
    goCode: `# Nginx Reverse Proxy -> Go Binary (with SSE streaming support!)
# server {
#   listen 443 ssl http2;
#   server_name api.taqui.in;
#   location / {
#     proxy_pass http://127.0.0.1:8080;
#     proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
#     proxy_buffering off; # Critical for real-time SSE / LLM token streams!
#   }
# }`,
    goOut: `HTTPS (Let's Encrypt) terminated cleanly -> forwarded to Go service managed by systemd`,
    lines: [
      ['systemd service', 'Runs your Go binary as a non-root Linux daemon with `Restart=on-failure` and env vars via `EnvironmentFile`.'],
      ['Nginx / Caddy Reverse Proxy', 'Handles TLS termination, gzip/brotli, request size limits, and zero-downtime upstream swaps.'],
      ['proxy_buffering off', 'Crucial Nginx setting when proxying Go SSE streams so AI tokens aren’t buffered until completion!'],
    ],
    jsBridge: 'No PM2 cluster manager required! One Go binary already utilizes all CPU cores natively under `systemd` or Cloud Run/Fly.io.',
    pyBridge: 'No Gunicorn + Uvicorn worker tuning headaches—deploy one compiled Go executable directly behind Nginx/Caddy or on Cloud Run.',
    realApp: 'Running a $6/mo Linux VPS serving thousands of requests/sec with Go + Postgres + Caddy automatic HTTPS, or deploying serverless containers to Cloud Run.',
    mistake:
      'Running your Go binary as `root`, forgetting `proxy_buffering off` for SSE streams, or deploying without tested database backups & a rollback plan.',
    quiz: [
      {
        type: 'Linux Ops',
        q: 'Why run a Go binary under `systemd` on a Linux VPS instead of leaving it running in an SSH terminal?',
        opts: [
          'systemd starts it on boot, restarts it automatically on crash, manages env files, and streams logs to journald',
          'Go binaries cannot run in SSH',
          'systemd compiles Go faster',
        ],
        ans: 0,
        why: 'systemd turns your single binary into a self-healing production Linux service.',
      },
      {
        type: 'Reverse Proxy',
        q: 'Why is `proxy_buffering off;` important in Nginx when your Go backend streams Server-Sent Events (SSE)?',
        opts: [
          'Without it, Nginx buffers chunks instead of flushing live tokens immediately to the browser',
          'It enables SQL transactions',
          'It turns off HTTPS',
        ],
        ans: 0,
        why: 'Buffered proxies hold SSE output until a buffer fills, ruining real-time streaming UX.',
      },
      {
        type: 'Rollbacks',
        q: 'What makes rolling back a broken Go deployment fast and safe?',
        opts: [
          'Keeping previous versioned binaries/images ready and writing backward-compatible (expand-and-contract) DB migrations',
          'Dropping database tables on deploy',
          'Editing code live on the server',
        ],
        ans: 0,
        why: 'Backward-compatible schema changes let you switch back to the prior binary in seconds with zero data loss.',
      },
      {
        type: 'HTTPS',
        q: 'Which Go-based reverse proxy automatically provisions and renews Let’s Encrypt HTTPS certificates with minimal config?',
        opts: ['Caddy', 'SQLite', 'Delve'],
        ans: 0,
        why: 'Caddy (written in Go!) handles automatic TLS/HTTPS out of the box.',
      },
    ],
  },
  51: {
    summary:
      'Run Go workloads natively on Kubernetes (which itself is written in Go!): Pods, Deployments, Services, ConfigMaps, Secrets, Ingress, Horizontal Pod Autoscaling (HPA), Liveness/Readiness probes, and SIGTERM graceful draining.',
    mentalModel:
      'Kubernetes is a self-healing fleet captain: you declare "I want 3 healthy copies of `go-api:v1.4`," and K8s launches Pods, routes traffic via Services, replaces crashed containers, and scales up during traffic spikes.',
    lab: 'distributed-ai',
    goCode: `# Kubernetes Deployment snippet for a Go HTTP service
# spec:
#   replicas: 3
#   template:
#     spec:
#       containers:
#         - name: go-api
#           image: ghcr.io/taqui/go-api:v1.4.0
#           env: [{ name: GOMEMLIMIT, value: "200MiB" }]
#           readinessProbe: { httpGet: { path: /readyz, port: 8080 } }
#           livenessProbe:  { httpGet: { path: /livez,  port: 8080 } }
#           resources: { limits: { memory: "256Mi", cpu: "500m" } }`,
    goOut: `3/3 Pods Ready | Zero-downtime rolling updates + HPA auto-scaling enabled!`,
    lines: [
      ['Deployment + Service + Ingress', 'Deployment manages Pod replicas; Service gives stable internal DNS; Ingress routes external HTTPS traffic.'],
      ['ConfigMaps vs Secrets', 'ConfigMaps store non-sensitive settings (`LOG_LEVEL`); Secrets (or External Secrets Operator) inject credentials safely.'],
      ['SIGTERM + Graceful Shutdown', 'When K8s scales down or rolls out a new version, it sends `SIGTERM`—handle it with `signal.NotifyContext` + `srv.Shutdown(ctx)`!'],
    ],
    jsBridge: 'Go pods start in ~50ms and use 20–60MB RAM, meaning HPA autoscaling reacts almost instantaneously compared to heavy JVM/Node containers.',
    pyBridge: 'Go is the native language of the Kubernetes & CNCF ecosystem—understanding K8s also unlocks writing custom Go Operators and CLI plugins (`client-go`).',
    realApp: 'Auto-scaling Go API fleets across multiple availability zones with zero-downtime rolling deploys.',
    mistake:
      'Omitting `resources.requests/limits` (breaks HPA autoscaling!) or ignoring `SIGTERM` (drops active user HTTP requests during every deploy!).',
    quiz: [
      {
        type: 'Graceful Draining',
        q: 'What OS signal does Kubernetes send to your Go container before terminating a Pod during a rolling update?',
        opts: ['SIGTERM (giving your Go server time to finish in-flight requests via `srv.Shutdown`)', 'SIGFMT', 'HTTP 404'],
        ans: 0,
        why: 'Listening for `SIGTERM` with `signal.NotifyContext` guarantees zero dropped requests during deploys.',
      },
      {
        type: 'Autoscaling',
        q: 'What must be configured on a Pod container for Horizontal Pod Autoscaler (HPA) to scale based on CPU/memory?',
        opts: ['`resources.requests`', 'An SSH key', 'A public IP address'],
        ans: 0,
        why: 'HPA calculates utilization as a percentage of the container’s requested resources.',
      },
      {
        type: 'Probes',
        q: 'What happens when a Pod’s `readinessProbe` (`/readyz`) fails?',
        opts: [
          'Kubernetes removes that Pod from Service load-balancing traffic until it recovers (without killing it)',
          'Kubernetes deletes the entire cluster',
          'Kubernetes formats the disk',
        ],
        ans: 0,
        why: 'Readiness controls traffic routing; Liveness controls container restarts.',
      },
      {
        type: 'Networking',
        q: 'Which Kubernetes resource provides a stable internal DNS name and load balances across ephemeral Pod IPs?',
        opts: ['Service', 'ConfigMap', 'CronJob'],
        ans: 0,
        why: 'Pod IPs change on every restart, so Services expose a stable virtual IP and DNS entry.',
      },
    ],
  },
  52: {
    summary:
      'Integrate LLMs cleanly into Go backends: resilient HTTP clients with timeouts and retries, real-time SSE token streaming (`bufio.Scanner`), function/tool calling, strict JSON structured outputs, provider-agnostic interfaces, and token-usage/rate tracking.',
    mentalModel:
      'Wrap every LLM provider behind a tiny Go `LLMClient` interface—just like `io.Reader`. Your app streams SSE tokens straight to browsers with goroutines while swapping models or retrying 429 rate limits cleanly in one place!',
    lab: 'distributed-ai',
    goCode: `// Provider-agnostic Go interface for LLM calls + token streaming:
type StreamChunk struct { Token string; Done bool }

type LLMProvider interface {
\tGenerate(ctx context.Context, prompt string) (string, error)
\tStream(ctx context.Context, prompt string) (<-chan StreamChunk, error)
}

// Parse SSE "data: {...}" lines with bufio.Scanner + context cancellation!
// Always track prompt_tokens / output_tokens & enforce per-user rate limits.`,
    goOut: `Streaming live tokens over <-chan StreamChunk with full ctx.Done() abort + usage accounting.`,
    lines: [
      ['Provider Abstraction Interface', 'Keeps vendor SDK/HTTP quirks isolated so switching between Gemini, OpenAI, or local Ollama touches ONE package!'],
      ['SSE Token Streaming', 'Read upstream `data:` lines via `bufio.Scanner`, forward chunks through a channel, and `flusher.Flush()` immediately to the client.'],
      ['Retries, Timeouts & Usage', 'Retry transient `429`/`503` with exponential backoff + jitter, enforce per-user rate limits, and log token costs per tenant.'],
    ],
    jsBridge: 'Replaces Vercel AI SDK / Node `fetch` streaming with Go’s ultra-low-memory goroutines that effortlessly hold 50,000 concurrent SSE AI streams on one box!',
    pyBridge: 'Many teams prototype prompts in Python and build their production AI gateway, streaming proxy, and billing/rate-limit layer in Go for 10x lower memory and predictable latency.',
    realApp: 'Multi-model AI gateways, real-time streaming chat backends, and strict JSON extraction microservices.',
    mistake:
      'Setting a tiny 5-second global `http.Client.Timeout` on a streaming LLM response (cuts off long answers mid-stream—use response-header timeouts + `ctx` cancellation instead!).',
    quiz: [
      {
        type: 'Streaming Trap',
        q: 'Why can setting a short `http.Client{Timeout: 5 * time.Second}` break streaming LLM responses?',
        opts: [
          'Client.Timeout covers the ENTIRE body read, killing a healthy 15-second token stream mid-sentence—use Transport ResponseHeaderTimeout + context cancellation instead',
          'Go HTTP clients cannot read streams',
          'SSE requires UDP',
        ],
        ans: 0,
        why: 'Use `ResponseHeaderTimeout` for time-to-first-byte and `ctx` for overall budget or client disconnect!',
      },
      {
        type: 'Architecture',
        q: 'Why define a small `LLMProvider` Go interface instead of scattering vendor HTTP calls across handlers?',
        opts: [
          'Enables instant unit testing with fake responses, centralized retry/cost tracking, and painless model switching',
          'Go forbids calling external APIs without interfaces',
          'Makes prompts shorter',
        ],
        ans: 0,
        why: 'Decoupling business logic from vendor APIs protects your app as models evolve rapidly.',
      },
      {
        type: 'Reliability',
        q: 'Which HTTP status codes from an LLM provider should typically trigger a retry with exponential backoff + jitter?',
        opts: ['429 (Too Many Requests) and 503 (Service Unavailable)', '400 (Bad Request) and 401 (Unauthorized)', '200 (OK)'],
        ans: 0,
        why: '429 and 5xx are transient; retrying a 400 malformed payload or 401 bad key wastes quota.',
      },
      {
        type: 'Structured Outputs',
        q: 'After receiving a Structured JSON Output from an LLM in Go, what should you ALWAYS do before trusting it?',
        opts: [
          'Unmarshal into a typed Go struct and run explicit domain validation checks',
          'Execute it directly as SQL',
          'Skip error checking',
        ],
        ans: 0,
        why: 'Even schema-constrained model outputs should be parsed into Go structs and validated like any untrusted input.',
      },
    ],
  },
  53: {
    summary:
      'Build high-accuracy Retrieval-Augmented Generation (RAG) pipelines in Go: document ingestion, overlapping text chunking, concurrent embedding batching, vector databases (`pgvector` / Qdrant), hybrid metadata filtering, retrieval evaluation, and grounded context assembly.',
    mentalModel:
      'RAG gives an LLM an open-book exam instead of forcing it to memorize your company docs: Ingestion indexes pages into a vector library, and every user question fetches the top relevant paragraphs before answering!',
    lab: 'distributed-ai',
    goCode: `// Minimal Cosine Similarity + Chunking Pipeline in pure Go:
func CosineSim(a, b []float32) float64 {
\tvar dot, normA, normB float64
\tfor i := range a {
\t\tdot += float64(a[i]) * float64(b[i])
\t\tnormA += float64(a[i]) * float64(a[i])
\t\tnormB += float64(b[i]) * float64(b[i])
\t}
\treturn dot / (math.Sqrt(normA) * math.Sqrt(normB))
}
// Production pgvector SQL:
// SELECT content FROM doc_chunks WHERE tenant_id = $1 ORDER BY embedding <=> $2 LIMIT 5;`,
    goOut: `Retrieved top-5 grounded chunks (cosine similarity >= 0.84) scoped to tenant_id!`,
    lines: [
      ['Chunking with Overlap', 'Split documents into ~300–600 token chunks with 10–15% overlap so sentences at boundaries never lose context.'],
      ['Metadata Filtering (CRITICAL!)', 'Always filter by `tenant_id` / permissions BEFORE or DURING vector search so User A never retrieves User B’s private docs!'],
      ['Concurrent Go Ingestion', 'Use a bounded Go Worker Pool (Module 22) to chunk, embed, and upsert thousands of PDFs/Markdown docs into `pgvector` fast.'],
    ],
    jsBridge: 'Go’s worker pools and `pgx` binary bulk copy ingest massive document corpora much faster and leaner than single-threaded Node ingestion scripts.',
    pyBridge: 'Instead of heavy framework abstractions, Go RAG pipelines stay transparent—plain SQL (`pgvector`), explicit structs, and measurable Recall@K tests in `go test`!',
    realApp: 'Internal engineering docs Q&A, multi-tenant customer support assistants, and code-search copilots backed by Postgres `pgvector`.',
    mistake:
      'Skipping tenant/ACL metadata filters in vector search (severe cross-tenant data leak!) or failing to evaluate retrieval quality (Recall@K) separately from LLM generation.',
    quiz: [
      {
        type: 'Security',
        q: 'In a multi-tenant SaaS RAG system, why is Metadata Filtering (`WHERE tenant_id = $1`) mandatory during vector search?',
        opts: [
          'To guarantee users ONLY retrieve chunks they are authorized to see, preventing cross-tenant data leaks',
          'To make embeddings smaller',
          'Because pgvector does not support text',
        ],
        ans: 0,
        why: 'Access control must be enforced at retrieval time—never rely on the prompt to hide unauthorized context.',
      },
      {
        type: 'Chunking',
        q: 'Why do RAG ingestion pipelines include a small overlap (e.g., 10–15%) between consecutive text chunks?',
        opts: [
          'So ideas or sentences split across a chunk boundary preserve continuity and meaning',
          'To double database billing',
          'Required by Go slices',
        ],
        ans: 0,
        why: 'Overlap prevents losing half of a key sentence right at a hard split boundary.',
      },
      {
        type: 'Evaluation',
        q: 'A RAG chatbot gives wrong answers. What should you inspect FIRST?',
        opts: [
          'Retrieval quality—check whether the top-K retrieved chunks actually contained the right facts',
          'Change the CSS font',
          'Increase JSON indentation',
        ],
        ans: 0,
        why: 'Garbage chunks in = hallucinated answers out; always evaluate retrieval (Recall@K / MRR) independently.',
      },
      {
        type: 'Go Advantage',
        q: 'How can Go accelerate embedding 10,000 document chunks during ingestion without hitting API rate limits?',
        opts: [
          'A bounded Worker Pool combined with a rate limiter (`golang.org/x/time/rate`) and context cancellation',
          'Spawning 10,000 unbounded goroutines at once',
          'Reading 1 byte per second',
        ],
        ans: 0,
        why: 'Bounded concurrency + rate limiting maximizes throughput while respecting provider quotas.',
      },
    ],
  },
  54: {
    summary:
      'Put your entire Go mastery together to build reliable Agentic AI systems: typed Tool registries, safe multi-step Reason-Act loops with step budgets, persistent agent state & conversation history, CONCURRENT tool execution with `errgroup`, background agent jobs, human-in-the-loop approvals, and full observability.',
    mentalModel:
      'An AI Agent is a bounded Go `for step := 0; step < maxSteps; step++` loop: the LLM plans & picks typed Tools, Go executes those tools safely in parallel (with strict timeouts & approval gates for risky actions!), feeds observations back, and logs every step!',
    lab: 'distributed-ai',
    goCode: `// Bounded Agentic Loop with Concurrent Tool Execution in Go:
type Tool interface {
\tName() string
\tRun(ctx context.Context, args json.RawMessage) (string, error)
}

func RunAgent(ctx context.Context, llm LLM, tools map[string]Tool, history []Msg) (string, error) {
\tfor step := 0; step < 8; step++ { // Hard step budget prevents infinite loops!
\t\tresp, err := llm.Step(ctx, history)
\t\tif err != nil || len(resp.ToolCalls) == 0 { return resp.Text, err }
\t\t// Execute read-only tool calls CONCURRENTLY with errgroup + per-tool timeout!
\t\tresults := runToolsConcurrently(ctx, tools, resp.ToolCalls)
\t\thistory = append(history, results...)
\t}
\treturn "", errors.New("agent exceeded max step budget")
}`,
    goOut: `Step 1: parallel [searchDocs, fetchBilling] (140ms) -> Step 2: Approval check -> Final grounded answer!`,
    lines: [
      ['Bounded Loop (`maxSteps` + `ctx.WithTimeout`)', 'Prevents runaway token spend or infinite tool loops—EVERY production agent needs a hard step & cost cap!'],
      ['Concurrent Tool Execution', 'When an LLM requests 3 independent read tools (`weather`, `calendar`, `docs`), Go’s `errgroup` executes all 3 in parallel in the time of the slowest one!'],
      ['Human-in-the-Loop (HITL)', 'Pause & persist agent state to Postgres before destructive actions (`refund_payment`, `send_email`) until a human clicks Approve!'],
    ],
    jsBridge: 'Go turns brittle multi-step agent scripts into rock-solid, strongly typed concurrent state machines with zero event-loop blocking and built-in trace observability.',
    pyBridge: 'You can keep research notebooks in Python while running your production multi-step Agent runtime, tool sandbox, job queue, and HITL state engine in Go!',
    realApp: 'Autonomous DevOps incident triagers, customer-ops refund agents with human approval gates, and research workflows running as durable background jobs.',
    mistake:
      'Building an unbounded `for {}` agent loop with no max-steps/cost guard, or letting an agent execute write/delete tools without schema validation and Human-in-the-Loop approval.',
    quiz: [
      {
        type: 'Safety Guardrail',
        q: 'Why MUST every production Agentic loop enforce both a `maxSteps` cap and a `context.WithTimeout`?',
        opts: [
          'To prevent infinite reasoning loops, hung external tools, and runaway API token bills',
          'Because Go `for` loops only run 8 times',
          'To disable tool calling',
        ],
        ans: 0,
        why: 'Explicit step, timeout, and token budgets keep autonomous loops safe and cost-predictable.',
      },
      {
        type: 'Go Superpower',
        q: 'If an LLM asks to run 4 independent read-only tools in one turn, how does Go minimize total latency?',
        opts: [
          'Execute them concurrently using goroutines / `errgroup.WithContext` with per-tool timeouts',
          'Run them one-by-one with `time.Sleep`',
          'Ignore 3 of the 4 tools',
        ],
        ans: 0,
        why: 'Concurrent tool execution reduces 4 sequential 300ms calls (1.2s) down to ~300ms!',
      },
      {
        type: 'Human-in-the-Loop',
        q: 'How should a Go agent handle a high-impact tool call like `delete_production_db` or `issue_refund`?',
        opts: [
          'Persist agent state, pause execution, and require explicit human approval before running the tool',
          'Execute immediately and log later',
          'Panic the HTTP server',
        ],
        ans: 0,
        why: 'Durable state + HITL approval gates let agents stay helpful without risking irreversible mistakes.',
      },
      {
        type: 'Observability',
        q: 'What should Agent Observability capture for every step of a multi-step agent run?',
        opts: [
          'Trace spans with step number, tool name/args/latency, token usage, errors, and state transitions',
          'Only the final answer string',
          'Nothing—agents are deterministic',
        ],
        ans: 0,
        why: 'Because LLMs are probabilistic, step-by-step traces and structured logs are essential for debugging and evaluation.',
      },
    ],
  },
};
