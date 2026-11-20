# 24. Channels in Go

Go's famous concurrency mantra:
> *"Do not communicate by sharing memory; instead, share memory by communicating."*

A **Channel** is a typed conduit (pipe or walkie-talkie) through which concurrent goroutines send and receive values. Channels prevent race conditions without needing complex explicit locks.

---

## 🔑 Key Concepts

### 1. Creating Channels & Syntax
Channels are first-class values created using `make(chan <Type>)`:

```go
// 1. Channel creation
ch := make(chan string)

// 2. Send operator: ch <- value (pushed into the pipe)
ch <- "Hello"

// 3. Receive operator: value := <-ch (pulled from the pipe)
msg := <-ch
```

---

### 2. Unbuffered vs Buffered Channels

| Feature | Unbuffered Channel | Buffered Channel |
|---|---|---|
| **Syntax** | `make(chan int)` (Capacity = 0) | `make(chan int, 3)` (Capacity = 3) |
| **Analogy** | **In-Person Handshake:** Sender and receiver must meet at the exact same instant. | **Mailbox / Queue:** Sender can drop up to 3 items without waiting for the receiver. |
| **Sender Block** | Sender blocks until receiver is actively ready to receive. | Sender only blocks when the buffer is **full**. |
| **Receiver Block** | Receiver blocks until sender pushes data. | Receiver only blocks when the buffer is **empty**. |

---

### 3. Closing Channels & `range`

When a producer is done sending data, it should **`close()`** the channel.  
A receiver can use a `for ... range` loop, which automatically consumes values and exits cleanly when the channel is closed.

```go
ch := make(chan int, 5)

// Producer
go func() {
    for i := 1; i <= 3; i++ {
        ch <- i * 10
    }
    close(ch) // Signals no more values will be sent
}()

// Consumer: Loops until channel is closed
for val := range ch {
    fmt.Println("Received:", val)
}
```

#### Comma-ok Idiom on Channels:
You can check whether a received value was actually sent or just the zero-value of a closed channel:
```go
val, ok := <-ch
if !ok {
    fmt.Println("Channel is closed and drained!")
}
```

---

### 4. Directional Channels (Send-Only & Receive-Only)

You can restrict how a function interacts with a channel in its type signature:

* **`chan<- int` (Send-Only):** Function can ONLY push values into the channel.
* **`<-chan int` (Receive-Only):** Function can ONLY pull values from the channel.

```go
// Producer: Only permitted to SEND
func produce(out chan<- int) {
    out <- 42
    close(out)
}

// Consumer: Only permitted to RECEIVE
func consume(in <-chan int) {
    for val := range in {
        fmt.Println("Consumed:", val)
    }
}
```

---

### 5. ⚠️ The 4 Golden Rules of Channels

1. **Only the SENDER should close a channel**, never the receiver.
2. **Sending to a closed channel causes a PANIC.**
3. **Closing an already closed channel causes a PANIC.**
4. **Sending or receiving from a `nil` channel BLOCKS FOREVER.**

---

## 💡 JavaScript vs Go Comparison

| Feature | JavaScript / Node.js | Go (Golang) |
|---|---|---|
| **Communication** | `EventEmitter`, callbacks, promises | Typed Channels (`chan T`) |
| **Backpressure** | Manual stream pausing (`stream.pause()`) | Built-in via channel buffer capacity |
| **Queueing** | Array / Message queue library | Built-in Buffered Channels |
| **Coordination** | `Promise.race([p1, p2])` | `select { case v := <-ch1: ... }` |

---

## 🚀 How to Run

```bash
go run ./24_channels/main.go
```
