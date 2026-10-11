---
title: Caching Strategies Every Backend Should Know
excerpt: Cache-aside, read-through, write-through and write-behind explained — what each one guarantees, what it costs, and which to reach for first.
section: fundamentals
publishDate: 'Sep 20 2026'
---

Caching is the closest thing to a free lunch in system design: keep a copy of slow data somewhere fast, and most requests never touch the database. The strategy you pick decides who is responsible for keeping that copy correct.

## Cache-aside (lazy loading)

The application checks the cache first. On a miss it reads from the database, serves the result, and writes it into the cache for next time.

- The cache only holds data somebody actually asked for.
- A cold cache means the first requests are slow, and a popular key expiring can stampede the database.
- Best default for read-heavy workloads.

## Read-through

Like cache-aside, except the cache itself knows how to fetch from the database on a miss. Application code gets simpler — it only ever talks to the cache.

- Same staleness story as cache-aside, less application logic.
- You are coupled to a cache that supports the pattern.

## Write-through

Every write goes to the cache and the database together before the request completes. Reads are always fresh.

- Strong consistency between cache and store.
- Every write pays the cost of two writes, so write-heavy workloads suffer.

## Write-behind (write-back)

Writes land in the cache and return immediately; the cache flushes to the database asynchronously.

- Extremely fast writes.
- Data loss is possible if the cache dies before flushing. Use it for data you can afford to recompute, never for money.

## Eviction and expiry

A cache is finite, so plan for what leaves: time-to-live (TTL) per key for natural expiry, and an eviction policy such as least-recently-used (LRU) when memory fills. Set TTLs from how stale a value is allowed to be — product prices and session tokens do not deserve the same lifetime.

Start with cache-aside plus sensible TTLs. Reach for the other patterns only when a measured problem — write consistency, thundering herds, write latency — forces your hand.
