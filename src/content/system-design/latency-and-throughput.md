---
title: "Latency and Throughput"
excerpt: Latency is how long one request takes; throughput is how many you finish per second. Why they pull against each other and how to balance both.
section: fundamentals
publishDate: 'Oct 11 2026'
updatedDate: 'Oct 25 2026'
---

Two numbers describe almost every performance conversation:

- **Latency** is how long a single request takes from start to finish, measured in milliseconds.
- **Throughput** is how many requests the system completes per unit of time, measured in requests per second (RPS) or similar.

## The restaurant analogy

A restaurant that accepts every order the moment it arrives has high throughput on paper. But if the kitchen can only cook ten meals at a time, orders pile up and each customer waits longer. Throughput went up, latency went up with it.

```mermaid
flowchart LR
    R["Incoming requests"] --> Q["Queue<br/>waiting time"] --> W["Workers<br/>service time"] --> D["Done"]
```

Total latency = time spent waiting in the queue + time spent being served. Pushing more work in without adding workers grows the queue, and the queue is where latency hides.

## How they relate

Little's Law ties them together for a stable system:

$$L = \lambda \times W$$

where $L$ is the number of requests in flight, $\lambda$ is throughput and $W$ is average latency. At 1,000 RPS with 200 ms latency, about 200 requests are in flight at any moment. If your service can only hold 100 concurrent requests, it will queue, and latency will climb.

## Measure percentiles, not averages

An average of 50 ms can hide a 1-in-100 request that takes 2 seconds. Track **p50, p95 and p99** latency. Users notice the slow tail, and in a [microservice](/system-design/monolithic-vs-microservices-architecture/) call chain, one request often waits on many backends, so the tail of each backend becomes the typical case for the user.

## Levers for each

| Goal | Techniques |
| --- | --- |
| Lower latency | [Caching](/system-design/caching-in-system-design/), [CDNs](/system-design/content-delivery-network-cdn/), fewer network hops, better indexes, data closer to users |
| Higher throughput | [Horizontal scaling](/system-design/horizontal-and-vertical-scaling/), batching, async processing with [queues](/system-design/message-queues/), connection pooling |

Some techniques trade one for the other. Batching raises throughput but adds the wait to fill a batch, so each item's latency increases.

## In interviews

State targets for both: "We need 10k RPS at peak with p99 under 200 ms." Then design for the peak, not the average, and show where queues could build up.
