---
title: "Content Delivery Network(CDN)"
excerpt: Copies of your heavy files cached around the world, close to users. How a CDN cuts latency, offloads your origin, and what's tricky about it.
section: fundamentals
publishDate: 'Oct 11 2026'
updatedDate: 'Oct 25 2026'
---

A CDN is a network of geographically distributed servers, called edge locations or points of presence (PoPs), that cache content close to users. Think of it as local copies of your website's heavy files sprinkled around the world.

## How a request flows

```mermaid
flowchart LR
    U["User in Mumbai"] --> E["Nearest CDN edge<br/>Mumbai PoP"]
    E -->|"cache hit"| U
    E -.->|"cache miss<br/>fetch once"| O["Origin server<br/>us-east"]
    O -.-> E
```

1. DNS or anycast routes the user to the nearest edge.
2. **Cache hit:** the edge serves the file immediately, often in a few milliseconds.
3. **Cache miss:** the edge fetches the file from your origin, stores it, and serves it. The next user in that region gets a hit.

## Why it matters

- **Lower latency:** data travels hundreds of kilometres instead of across oceans. Physics sets the floor, and a CDN moves the data closer.
- **Origin offload:** most requests never reach your servers. Cache hit ratios of 90%+ for static assets are common.
- **Resilience:** CDNs absorb traffic spikes and DDoS attacks and can serve stale content if the origin is down.

## What to put on a CDN

| Content | CDN fit |
| --- | --- |
| Images, video, fonts, JS, CSS | Excellent, long cache lifetimes |
| Static HTML pages | Great, with purge on deploy |
| Public API responses | Good, with short TTLs |
| Personalized or private data | Usually no, or only with care |

## Controlling the cache

- **`Cache-Control` headers** decide how long edges and browsers keep a file (`max-age`, `s-maxage`, `stale-while-revalidate`).
- **Versioned file names** such as `app.3f9a1c.js` let you cache forever, because a new deploy ships a new URL.
- **Purge or invalidate** when content changes and the URL can't.

Like any [cache](/system-design/caching-in-system-design/), the hard part is freshness. Serve stale content too long and users see old data. Purge too aggressively and you lose the benefit.

## Push vs pull CDNs

- **Pull (most common):** the edge fetches from your origin on the first miss.
- **Push:** you upload content to the CDN ahead of time. Useful for large, rarely changing files such as video libraries.

## Beyond static files

Modern CDNs also run code at the edge: redirects, auth checks, A/B routing, even full apps (Cloudflare Workers, Lambda@Edge). See [CDN vs edge server](/system-design/cdn-vs-edge-server/) and [edge caching](/system-design/edge-caching/).

## In interviews

For any global, read-heavy system (video, images, a news site), put a CDN in front for static assets and say what you'd cache and for how long. It's often the single biggest latency win in the whole design.
