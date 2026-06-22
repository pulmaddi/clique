# Architecture — Clique

**Status:** Proposed (planning phase). This is a recommendation to validate with the client, not a built system.
**Last updated:** 2026-06-22

---

## 1. Constraints that shape the design

- **Mobile-first, India** — Android + iOS, low-bandwidth resilience, regional languages (launch: English, Hindi, Telugu; i18n framework for more).
- **Large live audiences** — broadcast events up to 10k+ concurrent (NFR-1); media cost is the dominant spend.
- **Marketplace payments** — collect from devotees, deduct platform commission, pay out to hosts; India compliance (DPDP, GST, RBI).
- **Multi-role** — devotees, three host types, co-hosts/sevaks, admins, with RBAC.

---

## 2. Recommended stack

| Layer | Choice | Why |
| --- | --- | --- |
| **Mobile app** | **React Native + Expo** (TypeScript) | One codebase for Android + iOS, large talent pool in India, OTA updates, mature WebRTC SDKs. |
| **Backend API** | **Node.js + NestJS** (TypeScript) | Shared language with mobile, structured/modular, good for RBAC + REST/WebSocket. |
| **Realtime media** | **LiveKit** (self-host or cloud) | Open-source SFU built for scale; supports interactive rooms + large broadcasts (and egress for recording). Alternative: Agora/100ms (managed, faster start, higher per-minute cost). |
| **Realtime messaging** | WebSocket gateway (NestJS) + Redis pub/sub | In-room chat, reactions, presence, raise-hand. |
| **Primary DB** | **PostgreSQL** | Relational core (users, hosts, occasions, subscriptions, payments, ledger). Strong consistency for money. |
| **Cache / queues** | **Redis** + a job queue (BullMQ) | Sessions, rate limits, reminders, payout jobs, notification fan-out. |
| **Object storage** | S3-compatible (AWS S3 / region in India) | Recordings, media, KYC docs (encrypted). |
| **Search** | Postgres FTS first; OpenSearch later | Host/occasion discovery. |
| **Notifications** | FCM (Android) + APNs (iOS) + in-app inbox | Reminders and broadcasts. |
| **Payments** | **Razorpay** — Checkout, Subscriptions, Route (split/payouts) | India-native: UPI, cards, netbanking, wallets, recurring mandates, marketplace payouts. |
| **Infra** | Containers (Docker) on a cloud with **India region** (AWS ap-south-1 / equivalent), IaC | Data residency, scale, managed Postgres/Redis. |
| **Observability** | OpenTelemetry, centralized logs/metrics, Sentry | NFR-9. |

> If time-to-market trumps cost, start media on a **managed provider (Agora/100ms)** and migrate to self-hosted LiveKit once volume justifies it. Documented as a roadmap decision.

---

## 3. High-level system

```
                 ┌─────────────────────────────────────────────┐
   Mobile app    │                  Backend (NestJS)            │
 (React Native)  │                                             │
      │          │  Auth/OTP   Hosts/Occasions   Payments/Ledger│
      ├── REST ──►│  RBAC       Subscriptions     Payouts        │
      │          │  Discovery  Notifications      Admin/Moderation│
      ├── WS ────►│  Realtime gateway (chat, reactions, presence)│
      │          └───────┬───────────────┬──────────────┬───────┘
      │                  │               │              │
      │            PostgreSQL          Redis         Job queue
      │           (core + ledger)   (cache/pubsub)   (BullMQ)
      │
      └── media ──►  LiveKit SFU  ──►  Egress/recording ──► Object storage (S3, India)

  External:  Razorpay (Checkout / Subscriptions / Route)   FCM / APNs   Festival calendar source
```

- **Media path is separate from the API.** The backend issues short-lived, access-scoped **room tokens**; the app connects to LiveKit directly for low latency. Token issuance enforces access rules (free/subscriber/paid).
- **Money is a ledger.** All payments, commission, and payouts are recorded in an append-only ledger in Postgres; Razorpay webhooks are the source of truth for settlement, reconciled idempotently.

---

## 4. Core data model (initial sketch)

Entities (not exhaustive):

- **User** — id, phone, email?, name, language, location, roles[].
- **Host** — id, type (temple|group|guru), profile, verification/KYC status, payout account, commission_rate.
- **HostMember** — links users to a host with a role (owner, co-host/sevak, moderator).
- **Occasion** — id, host_id, type, access (free|subscriber|paid), price?, recurrence, start/end, format (interactive|broadcast), festival_tag?.
- **OccasionInstance** — concrete dated instance of a recurring occasion.
- **Ritual** — occasion subtype with steps[], offering options, sankalpa schema.
- **Booking / Ticket** — user_id, occasion_instance_id, access grant, sankalpa data?, status.
- **SubscriptionTier** / **Subscription** — host tiers; a user's active subscription + renewal state.
- **Payment** — provider refs (Razorpay order/payment id), amount, GST, status; idempotency key.
- **LedgerEntry** — double-entry style: gross, commission, host_net, refunds.
- **Payout** — host settlement batch + status.
- **Room** — live session for an occasion instance; recording ref.
- **Broadcast / Announcement** — host message to followers/segment.
- **Notification** — per-user delivery + read state.
- **Follow** — user ↔ host.

Money fields use integer minor units (paise) and a currency; never floats.

---

## 5. Access control & live-room gating

1. Devotee requests to join an occasion instance.
2. Backend checks access: free → allow; subscriber-only → active subscription; paid → valid booking/ticket.
3. On success, backend mints a **LiveKit access token** (room name, identity, role grants, short TTL).
4. App joins LiveKit with the token. Co-host/host capabilities (publish, moderate) are encoded in the grant.

RBAC is enforced server-side on every API and at token issuance — never trust the client.

---

## 6. Payments flow (Razorpay)

- **Pay-per-event:** create Razorpay order → app completes Checkout → webhook confirms → backend grants booking + ledger entry (gross/commission/host_net).
- **Subscription:** create plan + subscription with mandate → recurring charges via webhooks → access reflects active/cancelled/expired state.
- **Payouts:** use Razorpay **Route** to split or transfer host_net to verified host accounts on a schedule; reconcile against the ledger.
- **Idempotency & webhooks:** all state transitions driven by verified webhooks with idempotency keys; Razorpay (PCI-DSS) handles card data — Clique stores only references.
- **Tax:** GST computed and shown on invoices/receipts per Indian rules.

---

## 7. Key risks & decisions to track

| Risk / decision | Note |
| --- | --- |
| **App-store IAP policy** | Apple/Google may require in-app purchase (and their cut) for digital services. Selling event/ritual access via Razorpay-only may conflict with store rules. **Validate early**; may need IAP for app-store builds (see REQUIREMENTS open Q7). |
| **Media cost & scale** | Live minutes/egress dominate cost. Mitigate with audio-only fallback, recording controls, and broadcast (one-to-many) mode for big events. Decide managed vs. self-hosted LiveKit. |
| **Compliance** | DPDP (consent, residency), RBI marketplace/payout rules, GST invoicing. Engage legal/CA early. |
| **KYC for hosts** | Required before payouts; gates host go-live. |
| **Recording consent & retention** | Participant consent + retention/storage policy unresolved (open question). |
| **Festival calendar source** | Need a reliable, regionally-correct panchang/festival data source. |
| **Concurrency targets** | NFR-1 numbers are estimates; load-test before committing media tier sizing. |

---

## 8. Repository shape (proposed, when build starts)

```
clique/
├── docs/                # this documentation
├── apps/
│   ├── mobile/          # React Native (Expo) app
│   └── api/             # NestJS backend
├── packages/
│   └── shared/          # shared TS types, validation, constants
└── infra/               # IaC, deployment, env config
```

A monorepo (pnpm/Turborepo) lets mobile and API share TypeScript types (e.g. occasion/payment schemas). To be confirmed at build kickoff.
