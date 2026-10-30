---
title: "Database Indexing (B Trees, LSM Trees)"
excerpt: Indexes make reads fast by organising data for lookup. How B-trees and LSM trees work, why one favours reads and the other writes, and what every index costs.
section: fundamentals
publishDate: 'Oct 11 2026'
updatedDate: 'Oct 25 2026'
---

Without an index, finding a row means scanning the whole table. An index is a **separate data structure** that organises keys so the database can jump straight to the rows it needs, like the index at the back of a book.

## B-trees: the read-friendly default

A B-tree is a balanced tree whose nodes are disk pages holding many sorted keys. Every lookup walks from the root to a leaf, and because each node has hundreds of children, the tree stays very shallow.

```mermaid
flowchart TB
    R["Root: 40 · 80"] --> N1["10 · 20 · 30"]
    R --> N2["50 · 60 · 70"]
    R --> N3["90 · 100 · 110"]
    N2 --> L1["Leaf: 50 → row ptr<br/>55 → row ptr"]
    N2 --> L2["Leaf: 60 → row ptr<br/>65 → row ptr"]
```

- **Point lookups** take $O(\log n)$ page reads. A billion rows is only about 4 levels deep.
- **Range queries** are efficient because the leaves are sorted and linked: `WHERE price BETWEEN 50 AND 70`.
- **Writes update pages in place,** which means random disk I/O.

Used by PostgreSQL, MySQL (InnoDB), SQL Server, Oracle, and most relational databases.

## LSM trees: the write-friendly alternative

A Log-Structured Merge tree never updates in place. It batches writes in memory and flushes them to disk as sorted, immutable files.

```mermaid
flowchart LR
    W["Writes"] --> WAL["WAL<br/>for durability"]
    W --> M["Memtable<br/>sorted, in memory"]
    M -->|"flush when full"| S1["SSTable L0"]
    S1 -->|"compaction"| S2["SSTable L1"]
    S2 -->|"compaction"| S3["SSTable L2"]
```

1. Writes go to an in-memory **memtable** (plus a [write-ahead log](/system-design/write-ahead-logging-wal/) for crash safety).
2. When full, the memtable is flushed as a sorted file (**SSTable**).
3. Background **compaction** merges files and drops overwritten or deleted values.

- **Writes are very fast:** sequential appends only.
- **Reads are more complex:** a key might be in the memtable or any of several SSTables. [Bloom filters](/system-design/bloom-filters/) on each file skip files that definitely don't contain the key.

Used by Cassandra, RocksDB, LevelDB, HBase and ScyllaDB.

## Trade-off

| | B-tree | LSM tree |
| --- | --- | --- |
| Write speed | Moderate, random I/O | Very high, sequential I/O |
| Read speed | Fast, predictable | Good, can check several files |
| Range scans | Excellent | Good |
| Background work | Little | Compaction uses CPU and I/O |
| Best for | Read-heavy, transactional | Write-heavy: logs, events, time series |

## Every index has a price

An index is a second structure that **must be updated on every write**. A table with 8 indexes does roughly 9 writes per insert. Too many indexes hurt insert performance and use more storage.

Practical rules:

- Index columns you filter, join or sort on often.
- Use **composite indexes** in the order of your queries: an index on `(user_id, created_at)` serves "this user's latest orders."
- Drop indexes nothing uses.
- Check query plans (`EXPLAIN`) instead of guessing.

## In interviews

Mention the write-heavy versus read-heavy trade-off: "The event log is write-heavy, so an LSM-based store like Cassandra. The orders table is read-heavy with range queries, so Postgres with a B-tree index on `(user_id, created_at)`."
