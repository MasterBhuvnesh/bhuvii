---
title: 'Designing a Chat System'
excerpt: One-to-one messaging with delivery guarantees. WebSockets, message ordering, offline delivery and why "sent, delivered, read" is three separate problems.
section: platforms
publishDate: 'Sep 04 2026'
---

Chat feels instant, but "instant" hides three separate delivery problems: getting the message to the server, getting it to the recipient's devices, and proving each step happened.

## Connection model

Clients hold a persistent connection — WebSockets in practice — to a gateway tier. Gateways are stateful (they know who is connected where), so run many of them and keep a routing table of user → gateway → connection in a fast store. Any server can then find any online user in one lookup.

## Sending path

1. Sender emits the message over its socket; the gateway assigns a server-side sequence id and timestamp.
2. The message is persisted to the message store before anything is acknowledged — the database is the source of truth, not memory.
3. The gateway looks up the recipient's connection and pushes. If the recipient is offline, the message waits; a per-user outbox with "last delivered id" lets the client pull the gap on reconnect.

## Ordering and duplicates

Give every conversation a monotonically increasing sequence number at write time — clients render in that order regardless of arrival order. Retries will duplicate deliveries, so make the client deduplicate on message id. At-least-once delivery plus client-side dedup is the standard contract.

## Presence and receipts

"Online" is a heartbeat with a timeout, published on a pub/sub channel so all gateways agree. Read receipts are just another message type flowing back through the same pipe — sent, delivered and read are three flags on the message row, updated by three different events.

## Scaling notes

Partition conversations by conversation id so one conversation's ordering never spans writers. Fan-out is trivial for one-to-one chat, which is exactly why interviews then ask about group chats and broadcast — same skeleton, harder fan-out. Media attachments never ride the socket: upload to object storage, send a reference.
