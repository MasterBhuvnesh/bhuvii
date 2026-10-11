---
title: Horizontal vs Vertical Scaling
excerpt: Scale up by buying a bigger server or scale out by adding more of them? How to think about both approaches and when each one stops working.
section: fundamentals
publishDate: 'Sep 28 2026'
---

Every system hits a point where one machine is not enough. Traffic grows, queries pile up, response times climb. At that point you have two fundamental moves: make the machine bigger or add more machines.

## Vertical scaling (scaling up)

Vertical scaling means adding more CPU, RAM or disk to a single server. It is simple — no code changes, no distributed-systems headaches, no network partitions to reason about.

The trade-offs are hard limits:

- There is a ceiling to how big one machine can get, and prices rise steeply near the top.
- A single server is a single point of failure. If it goes down, everything goes down.
- Upgrading usually means downtime while you migrate to the bigger box.

Vertical scaling is a fine first step. Many products never outgrow it. But it is not a strategy — it is borrowed time.

## Horizontal scaling (scaling out)

Horizontal scaling means adding more servers behind a load balancer and splitting the work between them. There is no practical ceiling: need twice the capacity, add twice the machines.

The price is complexity:

- Requests can land on any server, so shared state has to live somewhere central — a database, a cache, an object store.
- Deployments, monitoring and debugging now span many machines.
- Your data layer has to keep up. Stateless app servers scale easily; the database is usually the hard part.

## The practical rule

Start with vertical scaling while you are small — it buys focus. Design stateless services from day one so that when growth arrives, horizontal scaling is a deployment change, not a rewrite. And remember the database question early: read replicas, caching and partitioning decide whether your scale-out actually scales.
