---
title: A System Design Interview Roadmap
excerpt: The order I recommend learning system design in — from networking basics to full platform walkthroughs — and how I use video walkthroughs to fill the gaps.
section: piyush-garg
publishDate: 'Aug 28 2026'
---

System design feels overwhelming because it has no syllabus. Here is the order that actually works: each layer assumes only the previous one, and you can stop at whatever depth your interviews demand.

## Phase 1 — How the web works

HTTP, DNS, TCP, TLS, what happens when you type a URL. If you cannot trace a request from browser to server, the rest is memorization. One focused week here pays off everywhere.

## Phase 2 — One machine, done right

Relational modeling, indexes, basic caching, background jobs. Build a small app and measure it — numbers beat theory for developing intuition about bottlenecks.

## Phase 3 — Many machines

Load balancing, horizontal scaling, stateless services, read replicas, CDN behavior. This is where video walkthroughs earn their keep: watching someone draw the boxes-and-arrows for a real system teaches the vocabulary interviews expect. Piyush Garg's system design videos are my go-to at this stage — practical, Hindi-English friendly explanations that stay close to how systems actually run in production.

## Phase 4 — Full designs under time pressure

Pick classic problems — URL shortener, chat, feed, ride-hailing — and practice the arc: requirements, capacity math, API sketch, data model, then deep-dives. Record yourself, watch it back, notice where you rambled. Thirty minutes of structured practice beats three hours of passive watching.

## The loop

Learn a concept, watch a walkthrough, whiteboard it yourself, write down what you fumbled. Repeat per topic. Interviews test reasoning out loud, so practice out loud from the start.
