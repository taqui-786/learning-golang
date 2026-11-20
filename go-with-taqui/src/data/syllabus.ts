import type { SyllabusModule, Track } from '../types';

export const TRACKS: Track[] = [
  {
    id: 'foundations',
    name: '1. Go Foundations',
    range: [0, 8],
    icon: 'book',
    color: 'bg-tealSoft',
    desc: 'Toolchain, variables, types, control flow, arrays, slices, and maps.',
  },
  {
    id: 'design',
    name: '2. Functions, Pointers & Types',
    range: [9, 16],
    icon: 'code',
    color: 'bg-yellowSoft',
    desc: 'Functions, pointers, structs, methods, interfaces, errors, packages, and modules.',
  },
  {
    id: 'concurrency',
    name: '3. Concurrency Mastery',
    range: [17, 22],
    icon: 'cpu',
    color: 'bg-tealSoft',
    desc: 'Goroutines, channels, sync primitives, select, context, and production patterns.',
  },
  {
    id: 'systems',
    name: '4. I/O, Networking & HTTP',
    range: [23, 31],
    icon: 'terminal',
    color: 'bg-yellowSoft',
    desc: 'Files, JSON, sockets, CLI tools, net/http, routers, auth, and REST API design.',
  },
  {
    id: 'backend',
    name: '5. Databases, Testing & Prod',
    range: [32, 39],
    icon: 'database',
    color: 'bg-tealSoft',
    desc: 'SQL, database/sql, sqlc/pgx/GORM, clean architecture, testing, debugging, and slog.',
  },
  {
    id: 'internals',
    name: '6. Generics, Memory & Toolchain',
    range: [40, 43],
    icon: 'layers',
    color: 'bg-yellowSoft',
    desc: 'Generics, stack/heap escape analysis, GC, reflection, unsafe, and toolchain.',
  },
  {
    id: 'cloud',
    name: '7. Distributed Systems & Cloud',
    range: [44, 51],
    icon: 'cloud',
    color: 'bg-tealSoft',
    desc: 'Microservices, Redis, Kafka, gRPC, Docker, GitHub Actions, Linux, and Kubernetes.',
  },
  {
    id: 'ai',
    name: '8. AI, RAG & Agentic Go',
    range: [52, 54],
    icon: 'sparkles',
    color: 'bg-yellowHi',
    desc: 'LLM APIs, SSE token streaming, vector search RAG pipelines, and Go AI agents.',
  },
];

export function getTrack(modId: number): Track {
  return TRACKS.find((t) => modId >= t.range[0] && modId <= t.range[1]) || TRACKS[0];
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

const RAW_SYLLABUS = `
0. Go Development Environment
0.1 What is Go (Golang)?
0.2 History and Philosophy of Go
0.3 Why Go Was Created
0.4 Go vs JavaScript vs TypeScript vs Node.js
0.5 Compiled vs Interpreted Languages
0.6 Go Compiler and Compilation Process
0.7 Installing Go
0.8 Go Workspace Structure
0.9 GOROOT and GOPATH
0.10 Go Environment Variables
0.11 Go Toolchain
0.12 Running Programs with go run
0.13 Building Programs with go build
0.14 Code Formatting with gofmt
0.15 Documentation with go doc
1. Variables and Constants
1.1 Variable Declaration (var)
1.2 Short Variable Declaration (:=)
1.3 Constants (const)
1.4 Multiple Variable Declarations
1.5 Variable Scope
1.6 Zero Values
1.7 Type Inference
1.8 Explicit Type Conversion
1.9 Naming Conventions
1.10 Exported vs Unexported Identifiers
2. Data Types
2.1 Integer Types
2.2 Unsigned Integer Types
2.3 Floating-Point Types
2.4 Boolean Type
2.5 String Type
2.6 Byte Type
2.7 Rune Type
2.8 Type Aliases
2.9 Type Conversion
2.10 Unicode and UTF-8
3. Operators
3.1 Arithmetic Operators
3.2 Comparison Operators
3.3 Logical Operators
3.4 Assignment Operators
3.5 Increment and Decrement
3.6 Bitwise Operators
3.7 Operator Precedence
4. Conditional Statements
4.1 if Statement
4.2 if-else Statement
4.3 else-if Statement
4.4 Nested Conditions
4.5 Variable Declaration Inside if
4.6 switch Statement
4.7 Switch Without an Expression
4.8 Type Switch
5. Loops
5.1 for Loop
5.2 Traditional for Loop
5.3 While-Style Loop
5.4 Infinite Loop
5.5 break Statement
5.6 continue Statement
5.7 Nested Loops
5.8 range Keyword
6. Arrays
6.1 Array Declaration
6.2 Array Initialization
6.3 Array Length
6.4 Array Indexing
6.5 Multidimensional Arrays
6.6 Copying Arrays
6.7 Comparing Arrays
6.8 Arrays as Function Arguments
7. Slices
7.1 What is a Slice?
7.2 Slice vs Array
7.3 Creating Slices
7.4 Slice Length and Capacity
7.5 append()
7.6 copy()
7.7 Slice Expressions
7.8 Slicing an Existing Slice
7.9 Nil Slices
7.10 Empty Slices
7.11 Slice Internals
7.12 Backing Arrays
7.13 Slice Memory Behavior
8. Maps
8.1 What is a Map?
8.2 Map Declaration
8.3 Map Initialization
8.4 Adding Elements
8.5 Updating Elements
8.6 Deleting Elements
8.7 Checking Whether a Key Exists
8.8 Iterating Over Maps
8.9 Nil Maps
8.10 Maps of Structs
8.11 Nested Maps
9. Functions
9.1 Function Declaration
9.2 Function Parameters
9.3 Return Values
9.4 Multiple Return Values
9.5 Named Return Values
9.6 Variadic Functions
9.7 Anonymous Functions
9.8 Function Expressions
9.9 Closures
9.10 Functions as Values
9.11 Higher-Order Functions
9.12 Recursive Functions
9.13 Deferred Execution (defer)
10. Pointers
10.1 What is a Pointer?
10.2 Memory Addresses
10.3 Address Operator (&)
10.4 Dereference Operator (*)
10.5 Nil Pointers
10.6 Pointer Variables
10.7 Pointers as Function Arguments
10.8 Pointers with Structs
10.9 Pointer Receivers
10.10 Value vs Pointer Semantics
10.11 Passing by Value
10.12 Sharing Data Through Pointers
11. Structs
11.1 What is a Struct?
11.2 Struct Declaration
11.3 Struct Initialization
11.4 Struct Fields
11.5 Zero-Value Structs
11.6 Anonymous Structs
11.7 Nested Structs
11.8 Struct Composition
11.9 Embedded Structs
11.10 Struct Tags
11.11 JSON Struct Tags
11.12 Struct Pointers
11.13 Struct Methods
12. Methods
12.1 What are Methods?
12.2 Methods vs Functions
12.3 Value Receivers
12.4 Pointer Receivers
12.5 Method Sets
12.6 Methods on Custom Types
13. Interfaces
13.1 What is an Interface?
13.2 Interface Declaration
13.3 Implicit Interface Implementation
13.4 Interface Methods
13.5 Empty Interface (any)
13.6 Type Assertions
13.7 Type Switches
13.8 Interface Composition
13.9 Interface Embedding
13.10 Interface Values Internally
13.11 Nil Interface vs Typed Nil
13.12 Accept Interfaces, Return Structs
13.13 Small Interfaces and Interface Design
14. Error Handling
14.1 What is an Error in Go?
14.2 Built-in Error Interface
14.3 Returning Errors
14.4 Handling Errors with if err != nil
14.5 Creating Errors with errors.New()
14.6 Formatting Errors with fmt.Errorf()
14.7 Wrapping Errors with %w
14.8 Checking Errors with errors.Is()
14.9 Checking Error Types with errors.As()
14.10 Custom Error Types
14.11 Error Propagation
14.12 Panic and Recover
14.13 Panic vs Errors
14.14 Error Handling Best Practices
15. Packages
15.1 What is a Package?
15.2 Package Declaration
15.3 Importing Packages
15.4 Standard Library Packages
15.5 Creating Custom Packages
15.6 Exported Identifiers
15.7 Unexported Identifiers
15.8 Package-Level Variables
15.9 Package Initialization (init)
15.10 Internal Packages
15.11 Package Naming Conventions
15.12 Avoiding Circular Dependencies
16. Go Modules
16.1 What is a Go Module?
16.2 go mod init
16.3 go.mod
16.4 go.sum
16.5 Installing Dependencies with go get
16.6 Downloading Dependencies with go mod download
16.7 Cleaning Dependencies with go mod tidy
16.8 Module Versioning
16.9 Local Module Replacement
16.10 Semantic Versioning
16.11 Publishing Go Packages
17. Goroutines
17.1 What is Concurrency?
17.2 Concurrency vs Parallelism
17.3 What is a Goroutine?
17.4 Creating Goroutines with go
17.5 Main Goroutine
17.6 Goroutine Lifecycle
17.7 Anonymous Goroutines
17.8 Goroutine Leaks
17.9 Synchronization Problems
17.10 Race Conditions
18. Channels
18.1 What are Channels?
18.2 Creating Channels
18.3 Sending Data Through Channels
18.4 Receiving Data from Channels
18.5 Unbuffered Channels
18.6 Buffered Channels
18.7 Blocking Behavior
18.8 Closing Channels
18.9 Range Over Channels
18.10 Directional Channels
18.11 Nil Channels
18.12 Channel Ownership
19. Synchronization
19.1 sync.WaitGroup
19.2 sync.Mutex
19.3 sync.RWMutex
19.4 sync.Once
19.5 sync.Cond
19.6 sync.Map
19.7 Atomic Operations
19.8 sync/atomic
19.9 Race Detector
20. Select Statement
20.1 What is select?
20.2 Multiple Channel Operations
20.3 Default Case
20.4 Timeout with time.After
20.5 Cancellation Patterns
20.6 Managing Multiple Channels
21. Context Package
21.1 What is context.Context?
21.2 context.Background()
21.3 context.TODO()
21.4 context.WithCancel()
21.5 context.WithTimeout()
21.6 context.WithDeadline()
21.7 context.WithValue()
21.8 Context Propagation
21.9 Request Cancellation
21.10 Managing Goroutine Lifecycles
22. Advanced Concurrency Patterns
22.1 Worker Pools
22.2 Fan-In Pattern
22.3 Fan-Out Pattern
22.4 Pipeline Pattern
22.5 Producer-Consumer Pattern
22.6 Rate Limiting
22.7 Semaphore Pattern
22.8 Bounded Concurrency
22.9 Graceful Shutdown
22.10 Backpressure
22.11 Deadlocks and Race Conditions
22.12 Concurrent Task Scheduling
23. File Handling
23.1 Reading Files
23.2 Writing Files
23.3 Appending to Files
23.4 Creating Files
23.5 Opening Files
23.6 Closing Files
23.7 File Permissions
23.8 File Information
23.9 Directory Handling
23.10 Walking Directories
23.11 Temporary Files
23.12 Buffering with bufio
23.13 Working with Large Files
23.14 Streaming File Contents
24. JSON and Serialization
24.1 What is Serialization?
24.2 Encoding JSON
24.3 Decoding JSON
24.4 encoding/json Package
24.5 JSON Struct Tags
24.6 Marshalling
24.7 Unmarshalling
24.8 Custom JSON Marshaling
24.9 Custom JSON Unmarshalling
24.10 Handling Unknown Fields
24.11 JSON Streaming
24.12 Working with JSON Files
25. Networking Fundamentals
25.1 What is a Network Socket?
25.2 TCP
25.3 UDP
25.4 HTTP Fundamentals
25.5 HTTPS and TLS Basics
25.6 DNS Basics
25.7 IP Addresses and Ports
25.8 Client-Server Architecture
25.9 Request and Response Lifecycle
26. Building CLI Applications
26.1 Command-Line Arguments
26.2 Environment Variables
26.3 Standard Input and Output
26.4 os.Args
26.5 Flags with flag
26.6 Interactive Terminal Input
26.7 Exit Codes
26.8 CLI Application Structure
26.9 Configuration Files
26.10 Logging Output
27. HTTP Fundamentals
27.1 HTTP Request Lifecycle
27.2 HTTP Methods
27.3 HTTP Status Codes
27.4 HTTP Headers
27.5 Request Bodies
27.6 Response Bodies
27.7 Cookies
27.8 Sessions
27.9 REST API Architecture
27.10 Middleware
27.11 CORS
27.12 Content Types
28. Go HTTP Server
28.1 net/http Package
28.2 Creating an HTTP Server
28.3 HTTP Handlers
28.4 http.HandleFunc
28.5 http.Handler
28.6 http.HandlerFunc
28.7 Request Objects
28.8 Response Writers
28.9 Path Parameters and Routing
28.10 Query Parameters
28.11 Request Body Parsing
28.12 JSON Responses
28.13 Custom Middleware
28.14 HTTP Client
28.15 HTTP Timeouts
28.16 Graceful Server Shutdown
29. Routing and Frameworks
29.1 Standard Library Routing
29.2 Chi Router
29.3 Gin Framework
29.4 Echo Framework
29.5 Route Groups
29.6 Middleware Chaining
29.7 Request Validation
29.8 Centralized Error Responses
29.9 API Versioning
30. Authentication and Authorization
30.1 Authentication vs Authorization
30.2 Password Hashing
30.3 bcrypt and Argon2
30.4 JWT Authentication
30.5 Access Tokens
30.6 Refresh Tokens
30.7 Cookie-Based Authentication
30.8 Session Management
30.9 Role-Based Access Control (RBAC)
30.10 Middleware-Based Authorization
30.11 API Key Authentication
30.12 OAuth 2.0 Fundamentals
31. API Design
31.1 REST API Best Practices
31.2 CRUD Operations
31.3 Request Validation
31.4 Pagination
31.5 Filtering
31.6 Sorting
31.7 API Versioning
31.8 Rate Limiting
31.9 File Uploads
31.10 API Documentation
31.11 OpenAPI / Swagger
31.12 WebSockets
31.13 Server-Sent Events (SSE)
32. Database Fundamentals
32.1 Relational Database Concepts
32.2 SQL Fundamentals
32.3 Primary Keys
32.4 Foreign Keys
32.5 Indexes
32.6 Joins
32.7 Transactions
32.8 ACID Properties
32.9 Connection Pooling
32.10 Query Optimization
33. Database Integration with Go
33.1 database/sql Package
33.2 SQL Drivers
33.3 Connecting Go with PostgreSQL
33.4 Connecting Go with MySQL
33.5 Executing SQL Queries
33.6 Prepared Statements
33.7 Querying Multiple Rows
33.8 Scanning Database Results
33.9 Transactions
33.10 Connection Pooling
33.11 Database Migrations
33.12 Handling Database Errors
33.13 Context-Aware Queries
34. Go Database Tools and ORMs
34.1 GORM
34.2 sqlc
34.3 pgx
34.4 Database Migration Tools
34.5 Repository Pattern
34.6 Query Builders
34.7 Transaction Management
35. Backend Architecture
35.1 Monolithic Architecture
35.2 Layered Architecture
35.3 Clean Architecture
35.4 Hexagonal Architecture
35.5 Domain-Driven Design Fundamentals
35.6 Dependency Injection
35.7 Repository Pattern
35.8 Service Layer
35.9 Handler Layer
35.10 Data Transfer Objects (DTOs)
35.11 Configuration Management
35.12 Dependency Management
35.13 Application Lifecycle
35.14 Separation of Concerns
36. Testing
36.1 Why Testing Matters
36.2 Unit Testing
36.3 Integration Testing
36.4 End-to-End Testing
36.5 Go testing Package
36.6 Writing _test.go Files
36.7 Running Tests with go test
36.8 Table-Driven Tests
36.9 Test Cases and Subtests
36.10 Test Helpers
36.11 Setup and Teardown
36.12 Test Coverage
36.13 Mocking
36.14 Dependency Injection for Testing
36.15 HTTP Handler Testing
36.16 Benchmark Testing
36.17 Fuzz Testing
37. Debugging
37.1 Debugging with Delve
37.2 Breakpoints
37.3 Stack Traces
37.4 Goroutine Inspection
37.5 Panic Investigation
37.6 Race Condition Debugging
37.7 Memory Debugging
37.8 Log-Based Debugging
38. Performance Optimization
38.1 Benchmarking
38.2 CPU Profiling
38.3 Memory Profiling
38.4 Heap Profiling
38.5 Goroutine Profiling
38.6 Escape Analysis
38.7 Garbage Collection Basics
38.8 Memory Allocation
38.9 Stack vs Heap
38.10 Reducing Allocations
38.11 Compiler Optimizations
38.12 pprof
38.13 Execution Tracing
39. Production Best Practices
39.1 Structured Logging with log/slog
39.2 Configuration Through Environment Variables
39.3 Secrets Management
39.4 Health Check Endpoints
39.5 Readiness and Liveness Checks
39.6 Graceful Shutdown
39.7 Request Timeouts
39.8 Rate Limiting
39.9 Security Headers
39.10 Input Validation
39.11 Dependency Updates
39.12 Application Monitoring
39.13 Error Reporting
39.14 Observability Fundamentals
40. Generics
40.1 What are Generics?
40.2 Type Parameters
40.3 Generic Functions
40.4 Generic Structs
40.5 Type Constraints
40.6 comparable Constraint
40.7 Custom Constraints
40.8 Union Constraints
40.9 Type Sets
40.10 Generic Interfaces
40.11 When to Use Generics
40.12 When Not to Use Generics
41. Memory Management
41.1 How Go Manages Memory
41.2 Garbage Collection
41.3 Stack and Heap
41.4 Escape Analysis
41.5 Pointer Allocation
41.6 Memory Alignment
41.7 Struct Memory Layout
41.8 Memory Leaks
41.9 Garbage Collector Tuning
41.10 GOGC Basics
42. Advanced Language Features
42.1 Reflection
42.2 reflect Package
42.3 Type Metadata
42.4 Runtime Package
42.5 Custom Types
42.6 Type Embedding
42.7 Advanced Interfaces
42.8 Method Expressions
42.9 Method Values
42.10 Build Constraints
42.11 Platform-Specific Code
42.12 Assembly Basics
42.13 unsafe Package
42.14 CGO Fundamentals
43. Go Toolchain
43.1 go fmt
43.2 go vet
43.3 go test
43.4 go build
43.5 go run
43.6 go install
43.7 go generate
43.8 go work
43.9 Go Compiler Basics
43.10 Cross-Compilation
43.11 Build Tags
43.12 Static Analysis
43.13 Linting with golangci-lint
44. Distributed Systems Fundamentals
44.1 What are Distributed Systems?
44.2 Monolith vs Microservices
44.3 Service-to-Service Communication
44.4 Synchronous vs Asynchronous Communication
44.5 Distributed Transactions
44.6 Event-Driven Architecture
44.7 Message Queues
44.8 Eventual Consistency
44.9 Idempotency
44.10 Retry Patterns
44.11 Circuit Breaker Pattern
44.12 Service Discovery
44.13 Load Balancing
44.14 Fault Tolerance
45. Message Queues and Caching
45.1 Redis Fundamentals
45.2 Redis with Go
45.3 Pub/Sub
45.4 Message Brokers
45.5 RabbitMQ Fundamentals
45.6 Kafka Fundamentals
45.7 Producer and Consumer
45.8 Background Jobs
45.9 Job Scheduling
45.10 Worker Pools
45.11 Dead-Letter Queues
45.12 Retry Mechanisms
46. RPC and Communication
46.1 RPC Fundamentals
46.2 gRPC
46.3 Protocol Buffers
46.4 Unary RPC
46.5 Server Streaming
46.6 Client Streaming
46.7 Bidirectional Streaming
46.8 REST vs gRPC
46.9 WebSockets
46.10 Server-Sent Events (SSE)
46.11 API Gateways
47. Microservices Architecture
47.1 Service Boundaries
47.2 Independent Deployment
47.3 Database per Service
47.4 Service Communication
47.5 Distributed Tracing
47.6 Centralized Logging
47.7 API Gateway
47.8 Service Health Monitoring
47.9 Event-Driven Communication
47.10 Saga Pattern
47.11 Outbox Pattern
47.12 Failure Handling
48. Docker
48.1 Docker Fundamentals
48.2 Docker Images
48.3 Docker Containers
48.4 Dockerfile for Go Applications
48.5 Multi-Stage Builds
48.6 Docker Compose
48.7 Container Networking
48.8 Persistent Storage
48.9 Container Optimization
49. CI/CD
49.1 CI/CD Fundamentals
49.2 GitHub Actions
49.3 Automated Tests
49.4 Automated Builds
49.5 Build Artifacts
49.6 Docker Image Publishing
49.7 Deployment Pipelines
49.8 Release Management
50. Cloud and Deployment
50.1 Linux Server Administration
50.2 Environment Configuration
50.3 Reverse Proxies
50.4 Nginx Fundamentals
50.5 Deploying Go Binaries
50.6 VPS Deployment
50.7 Cloud Deployment
50.8 Domain and HTTPS Setup
50.9 Database Deployment
50.10 Log Management
50.11 Monitoring and Alerting
50.12 Rollbacks
51. Kubernetes
51.1 Kubernetes Fundamentals
51.2 Pods
51.3 Deployments
51.4 Services
51.5 ConfigMaps
51.6 Secrets
51.7 Ingress
51.8 Horizontal Pod Autoscaling
51.9 Health Probes
51.10 Deploying Go Applications
52. AI Integration
52.1 Calling LLM APIs with Go
52.2 HTTP Clients for AI Providers
52.3 Streaming LLM Responses
52.4 Server-Sent Events
52.5 Handling Token Streams
52.6 Function Calling and Tool Execution
52.7 Structured Outputs
52.8 Model Provider Abstraction
52.9 Retry and Timeout Strategies
52.10 API Usage Tracking
52.11 Rate Limiting
53. RAG Systems
53.1 Embedding APIs
53.2 Vector Databases
53.3 Document Ingestion
53.4 Text Chunking
53.5 Similarity Search
53.6 Metadata Filtering
53.7 RAG Pipelines
53.8 Retrieval Evaluation
53.9 Context Construction
54. Agentic AI with Go
54.1 Agent Architecture
54.2 Tool Calling
54.3 Tool Execution
54.4 Agent State Management
54.5 Conversation History
54.6 Multi-Step Execution
54.7 Planning and Execution
54.8 Agent Workflows
54.9 Background Agent Jobs
54.10 Concurrent Tool Execution
54.11 Human-in-the-Loop Workflows
54.12 Agent Observability
`.trim();

function parseSyllabus(raw: string): SyllabusModule[] {
  const modules: SyllabusModule[] = [];
  let currentMod: SyllabusModule | null = null;
  for (const rawLine of raw.split('\n')) {
    const line = rawLine.trim();
    const modMatch = line.match(/^(\d+)\.\s+(.*)$/);
    const subMatch = line.match(/^(\d+\.\d+)\s+(.*)$/);
    if (modMatch) {
      const id = Number(modMatch[1]);
      currentMod = {
        id,
        title: modMatch[2],
        slug: slugify(modMatch[2]),
        track: getTrack(id),
        subtopics: [],
      };
      modules.push(currentMod);
    } else if (subMatch && currentMod) {
      currentMod.subtopics.push({
        code: subMatch[1],
        title: subMatch[2],
        anchor: 'sub-' + subMatch[1].replace('.', '-'),
      });
    }
  }
  return modules;
}

export const MODULES: SyllabusModule[] = parseSyllabus(RAW_SYLLABUS);

export const TOTAL_MODULES = MODULES.length; // 55
export const TOTAL_SUBTOPICS = MODULES.reduce((acc, m) => acc + m.subtopics.length, 0); // 615

export function getModuleBySlug(slug: string): SyllabusModule | undefined {
  return MODULES.find((m) => m.slug === slug);
}

export function getModuleById(id: number): SyllabusModule | undefined {
  return MODULES.find((m) => m.id === id);
}
